import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface PlacesQueryDto {
  page?: number;
  limit?: number;
  province?: string;
  category?: string;
  search?: string;
  sortBy?: 'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  userId?: string;
}

export interface CreatePlaceDto {
  name: string;
  description: string;
  categories: string[];
  latitude: number;
  longitude: number;
  province?: string;
  district?: string;
  priceEstimate?: number;
  popularityScore?: number;
  indoorOutdoor?: string;
  activityLevel?: string;
  imageUrl?: string;
}

export type UpdatePlaceDto = Partial<CreatePlaceDto>;

@Injectable()
export class PlacesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PlacesQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.province && query.province !== 'ALL' && query.province !== 'all') {
      const p = query.province.trim();
      where.OR = [
        { province: { equals: p, mode: 'insensitive' } },
        { province: { contains: p, mode: 'insensitive' } },
      ];
    }

    if (query.category && query.category !== 'ALL' && query.category !== 'all') {
      where.categories = {
        has: query.category,
      };
    }

    if (query.search && query.search.trim()) {
      const s = query.search.trim();
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { description: { contains: s, mode: 'insensitive' } },
        { district: { contains: s, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { popularityScore: 'desc' };
    if (query.sortBy === 'price_asc') {
      orderBy = { priceEstimate: 'asc' };
    } else if (query.sortBy === 'price_desc') {
      orderBy = { priceEstimate: 'desc' };
    } else if (query.sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const [total, places] = await Promise.all([
      this.prisma.place.count({ where }),
      this.prisma.place.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    const placeIds = places.map((p) => p.id);

    // Batch fetch interaction stats and comments count for these places
    const [likeEvents, saveEvents, removeSaveEvents, rateEvents, commentsCountMap] =
      await Promise.all([
        this.prisma.userInteractionEvent.findMany({
          where: { placeId: { in: placeIds }, eventType: 'LIKE' },
          select: { placeId: true, userId: true },
        }),
        this.prisma.userInteractionEvent.findMany({
          where: { placeId: { in: placeIds }, eventType: 'SAVE' },
          select: { placeId: true, userId: true, createdAt: true },
        }),
        this.prisma.userInteractionEvent.findMany({
          where: { placeId: { in: placeIds }, eventType: 'REMOVE_SAVE' },
          select: { placeId: true, userId: true, createdAt: true },
        }),
        this.prisma.userInteractionEvent.findMany({
          where: { placeId: { in: placeIds }, eventType: 'RATE' },
          select: { placeId: true, userId: true, ratingValue: true },
        }),
        this.prisma.comment.groupBy({
          by: ['placeId'],
          where: { placeId: { in: placeIds } },
          _count: { id: true },
        }),
      ]);

    // Build lookup maps
    const likesByPlace: Record<string, Set<string>> = {};
    for (const ev of likeEvents) {
      if (!likesByPlace[ev.placeId]) likesByPlace[ev.placeId] = new Set();
      likesByPlace[ev.placeId].add(ev.userId);
    }

    const savesByPlace: Record<string, Set<string>> = {};
    for (const s of saveEvents) {
      const removed = removeSaveEvents.find(
        (r) => r.placeId === s.placeId && r.userId === s.userId && r.createdAt > s.createdAt,
      );
      if (!removed) {
        if (!savesByPlace[s.placeId]) savesByPlace[s.placeId] = new Set();
        savesByPlace[s.placeId].add(s.userId);
      }
    }

    const ratingsByPlace: Record<string, { total: number; sum: number; userRating?: number }> = {};
    for (const r of rateEvents) {
      if (!ratingsByPlace[r.placeId]) {
        ratingsByPlace[r.placeId] = { total: 0, sum: 0 };
      }
      if (r.ratingValue) {
        ratingsByPlace[r.placeId].total += 1;
        ratingsByPlace[r.placeId].sum += r.ratingValue;
        if (query.userId && r.userId === query.userId) {
          ratingsByPlace[r.placeId].userRating = r.ratingValue;
        }
      }
    }

    const commentsMap: Record<string, number> = {};
    for (const c of commentsCountMap) {
      commentsMap[c.placeId] = c._count.id;
    }

    const items = places.map((place) => {
      const likesSet = likesByPlace[place.id] || new Set();
      const savesSet = savesByPlace[place.id] || new Set();
      const ratingInfo = ratingsByPlace[place.id] || { total: 0, sum: 0 };
      const ratingAvg =
        ratingInfo.total > 0
          ? Math.round((ratingInfo.sum / ratingInfo.total) * 10) / 10
          : 0;

      return {
        ...place,
        likesCount: likesSet.size,
        savesCount: savesSet.size,
        commentsCount: commentsMap[place.id] || 0,
        ratingAvg,
        ratingCount: ratingInfo.total,
        isLiked: query.userId ? likesSet.has(query.userId) : false,
        isSaved: query.userId ? savesSet.has(query.userId) : false,
        userRating: ratingInfo.userRating || null,
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const place = await this.prisma.place.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!place) {
      throw new NotFoundException(`Địa điểm với ID ${id} không tồn tại`);
    }

    // Get interactions
    const [likeEvents, saveEvents, removeSaveEvents, rateEvents, nearbyPlaces] =
      await Promise.all([
        this.prisma.userInteractionEvent.findMany({
          where: { placeId: id, eventType: 'LIKE' },
          select: { userId: true },
        }),
        this.prisma.userInteractionEvent.findMany({
          where: { placeId: id, eventType: 'SAVE' },
          select: { userId: true, createdAt: true },
        }),
        this.prisma.userInteractionEvent.findMany({
          where: { placeId: id, eventType: 'REMOVE_SAVE' },
          select: { userId: true, createdAt: true },
        }),
        this.prisma.userInteractionEvent.findMany({
          where: { placeId: id, eventType: 'RATE' },
          select: { userId: true, ratingValue: true },
        }),
        place.province
          ? this.prisma.place.findMany({
              where: {
                province: place.province,
                id: { not: id },
              },
              take: 4,
              orderBy: { popularityScore: 'desc' },
            })
          : [],
      ]);

    const likesSet = new Set(likeEvents.map((e) => e.userId));
    const activeSaves = saveEvents.filter((s) => {
      const removed = removeSaveEvents.find(
        (r) => r.userId === s.userId && r.createdAt > s.createdAt,
      );
      return !removed;
    });
    const savesSet = new Set(activeSaves.map((s) => s.userId));

    let ratingSum = 0;
    let userRating: number | null = null;
    for (const r of rateEvents) {
      if (r.ratingValue) {
        ratingSum += r.ratingValue;
        if (userId && r.userId === userId) {
          userRating = r.ratingValue;
        }
      }
    }
    const ratingAvg =
      rateEvents.length > 0 ? Math.round((ratingSum / rateEvents.length) * 10) / 10 : 0;

    return {
      ...place,
      likesCount: likesSet.size,
      savesCount: savesSet.size,
      commentsCount: place.comments.length,
      ratingAvg,
      ratingCount: rateEvents.length,
      isLiked: userId ? likesSet.has(userId) : false,
      isSaved: userId ? savesSet.has(userId) : false,
      userRating,
      nearbyPlaces,
    };
  }

  async create(dto: CreatePlaceDto) {
    return this.prisma.place.create({
      data: {
        name: dto.name,
        description: dto.description,
        categories: dto.categories || [],
        latitude: Number(dto.latitude),
        longitude: Number(dto.longitude),
        province: dto.province || null,
        district: dto.district || null,
        priceEstimate: Number(dto.priceEstimate) || 0,
        popularityScore: Number(dto.popularityScore) || 0,
        indoorOutdoor: dto.indoorOutdoor || null,
        activityLevel: dto.activityLevel || null,
        imageUrl: dto.imageUrl || null,
      },
    });
  }

  async update(id: string, dto: UpdatePlaceDto) {
    const existing = await this.prisma.place.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Địa điểm với ID ${id} không tồn tại`);
    }

    return this.prisma.place.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.categories !== undefined && { categories: dto.categories }),
        ...(dto.latitude !== undefined && { latitude: Number(dto.latitude) }),
        ...(dto.longitude !== undefined && { longitude: Number(dto.longitude) }),
        ...(dto.province !== undefined && { province: dto.province }),
        ...(dto.district !== undefined && { district: dto.district }),
        ...(dto.priceEstimate !== undefined && { priceEstimate: Number(dto.priceEstimate) }),
        ...(dto.popularityScore !== undefined && { popularityScore: Number(dto.popularityScore) }),
        ...(dto.indoorOutdoor !== undefined && { indoorOutdoor: dto.indoorOutdoor }),
        ...(dto.activityLevel !== undefined && { activityLevel: dto.activityLevel }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.place.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Địa điểm với ID ${id} không tồn tại`);
    }

    return this.prisma.place.delete({
      where: { id },
    });
  }

  async getProvinces() {
    const raw = await this.prisma.place.groupBy({
      by: ['province'],
      _count: { id: true },
      where: { province: { not: null } },
      orderBy: { _count: { id: 'desc' } },
    });

    return raw.map((r) => ({
      key: r.province,
      count: r._count.id,
    }));
  }
}
