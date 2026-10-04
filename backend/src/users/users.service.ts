import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        preferredStyles: true,
        budgetLevel: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const [trips, likedEvents, saveEvents, removeSaveEvents, ratedEvents] = await Promise.all([
      this.prisma.trip.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.userInteractionEvent.findMany({
        where: { userId, eventType: 'LIKE' },
        include: { place: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.userInteractionEvent.findMany({
        where: { userId, eventType: 'SAVE' },
        select: { placeId: true, createdAt: true },
      }),
      this.prisma.userInteractionEvent.findMany({
        where: { userId, eventType: 'REMOVE_SAVE' },
        select: { placeId: true, createdAt: true },
      }),
      this.prisma.userInteractionEvent.findMany({
        where: { userId, eventType: 'RATE' },
        include: { place: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Active saved places
    const activeSavedPlaceIds = saveEvents
      .filter((s) => {
        const removed = removeSaveEvents.find(
          (r) => r.placeId === s.placeId && r.createdAt > s.createdAt,
        );
        return !removed;
      })
      .map((s) => s.placeId);

    const uniqueSavedPlaceIds = [...new Set(activeSavedPlaceIds)];
    const savedPlaces = await this.prisma.place.findMany({
      where: { id: { in: uniqueSavedPlaceIds } },
    });

    // Unique liked places
    const seenLikes = new Set<string>();
    const likedPlaces = [];
    for (const l of likedEvents) {
      if (!seenLikes.has(l.placeId)) {
        seenLikes.add(l.placeId);
        likedPlaces.push(l.place);
      }
    }

    return {
      user,
      trips,
      savedPlaces,
      likedPlaces,
      stats: {
        tripsCount: trips.length,
        likedCount: likedPlaces.length,
        savedCount: savedPlaces.length,
        ratedCount: ratedEvents.length,
      },
    };
  }

  async updateProfile(
    userId: string,
    data: { name?: string; preferredStyles?: string[]; budgetLevel?: string },
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.preferredStyles !== undefined && { preferredStyles: data.preferredStyles }),
        ...(data.budgetLevel !== undefined && { budgetLevel: data.budgetLevel }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        preferredStyles: true,
        budgetLevel: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
}
