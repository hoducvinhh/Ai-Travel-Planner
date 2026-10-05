import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface AdminCreateUserDto {
  email: string;
  name?: string;
  password: string;
  role?: Role;
  preferredStyles?: string[];
  budgetLevel?: string;
}

export interface AdminUpdateUserDto {
  email?: string;
  name?: string;
  password?: string;
  role?: Role;
  preferredStyles?: string[];
  budgetLevel?: string;
}

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

  async findAll(query: { page?: number; limit?: number; search?: string; role?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.role && (query.role === 'ADMIN' || query.role === 'USER')) {
      where.role = query.role;
    }

    if (query.search && query.search.trim()) {
      const s = query.search.trim();
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          preferredStyles: true,
          budgetLevel: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              trips: true,
              communityPosts: true,
              comments: true,
            },
          },
        },
      }),
    ]);

    return {
      items: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async adminCreateUser(dto: AdminCreateUserDto) {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email đã tồn tại trong hệ thống');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    return this.prisma.user.create({
      data: {
        email: dto.email.trim(),
        name: dto.name?.trim() || null,
        password: hashedPassword,
        role: dto.role || Role.USER,
        preferredStyles: dto.preferredStyles || [],
        budgetLevel: dto.budgetLevel || null,
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
  }

  async adminUpdateUser(id: string, dto: AdminUpdateUserDto) {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.role !== undefined) updateData.role = dto.role;
    if (dto.preferredStyles !== undefined) updateData.preferredStyles = dto.preferredStyles;
    if (dto.budgetLevel !== undefined) updateData.budgetLevel = dto.budgetLevel;

    if (dto.email && dto.email !== existing.email) {
      const emailExists = await this.findByEmail(dto.email);
      if (emailExists) {
        throw new ConflictException('Email này đã được sử dụng bởi tài khoản khác');
      }
      updateData.email = dto.email.trim();
    }

    if (dto.password && dto.password.trim()) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(dto.password.trim(), salt);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
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
  }

  async adminDeleteUser(id: string, currentAdminId: string) {
    if (id === currentAdminId) {
      throw new BadRequestException('Bạn không thể tự xóa tài khoản admin đang đăng nhập');
    }

    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
