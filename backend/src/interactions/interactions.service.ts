import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum InteractionEventType {
  VIEW_DETAIL = 'VIEW_DETAIL',
  LIKE = 'LIKE',
  SAVE = 'SAVE',
  REMOVE_SAVE = 'REMOVE_SAVE',
  RATE = 'RATE',
  SHARE = 'SHARE',
}

export interface TrackInteractionDto {
  userId: string;
  placeId: string;
  eventType: InteractionEventType;
  sessionId?: string;
  ratingValue?: number;
}

@Injectable()
export class InteractionsService {
  private readonly logger = new Logger(InteractionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async trackInteraction(dto: TrackInteractionDto) {
    this.logger.log(
      `Tracking ${dto.eventType} interaction for user ${dto.userId} on place ${dto.placeId}`,
    );

    // Validate rating value if event type is RATE
    if (dto.eventType === InteractionEventType.RATE) {
      if (!dto.ratingValue || dto.ratingValue < 1 || dto.ratingValue > 5) {
        throw new Error('Rating value must be between 1 and 5');
      }
    }

    // Create interaction event
    const interaction = await this.prisma.userInteractionEvent.create({
      data: {
        userId: dto.userId,
        placeId: dto.placeId,
        eventType: dto.eventType,
        sessionId: dto.sessionId || null,
        ratingValue: dto.ratingValue || null,
      },
    });

    // Update place popularity score asynchronously
    this.updatePlacePopularity(dto.placeId).catch((error) => {
      this.logger.error(
        `Failed to update popularity for place ${dto.placeId}: ${error.message}`,
      );
    });

    return interaction;
  }

  async toggleLike(userId: string, placeId: string) {
    const existingLike = await this.prisma.userInteractionEvent.findFirst({
      where: {
        userId,
        placeId,
        eventType: InteractionEventType.LIKE,
      },
    });

    let isLiked = false;
    if (existingLike) {
      // Remove like
      await this.prisma.userInteractionEvent.delete({
        where: { id: existingLike.id },
      });
      isLiked = false;
    } else {
      // Add like
      await this.prisma.userInteractionEvent.create({
        data: {
          userId,
          placeId,
          eventType: InteractionEventType.LIKE,
        },
      });
      isLiked = true;
    }

    // Update popularity
    this.updatePlacePopularity(placeId).catch(() => {});

    // Count current likes
    const likesCount = await this.prisma.userInteractionEvent.count({
      where: {
        placeId,
        eventType: InteractionEventType.LIKE,
      },
    });

    return { isLiked, likesCount };
  }

  async toggleSave(userId: string, placeId: string) {
    // Check latest save/remove_save status
    const latestSave = await this.prisma.userInteractionEvent.findFirst({
      where: {
        userId,
        placeId,
        eventType: { in: [InteractionEventType.SAVE, InteractionEventType.REMOVE_SAVE] },
      },
      orderBy: { createdAt: 'desc' },
    });

    const isCurrentlySaved = latestSave?.eventType === InteractionEventType.SAVE;
    let isSaved = false;

    if (isCurrentlySaved) {
      await this.prisma.userInteractionEvent.create({
        data: {
          userId,
          placeId,
          eventType: InteractionEventType.REMOVE_SAVE,
        },
      });
      isSaved = false;
    } else {
      await this.prisma.userInteractionEvent.create({
        data: {
          userId,
          placeId,
          eventType: InteractionEventType.SAVE,
        },
      });
      isSaved = true;
    }

    this.updatePlacePopularity(placeId).catch(() => {});

    return { isSaved };
  }

  async ratePlace(userId: string, placeId: string, ratingValue: number) {
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      throw new Error('Đánh giá phải từ 1 đến 5 sao');
    }

    // Upsert or create new rate event
    await this.prisma.userInteractionEvent.create({
      data: {
        userId,
        placeId,
        eventType: InteractionEventType.RATE,
        ratingValue,
      },
    });

    this.updatePlacePopularity(placeId).catch(() => {});

    // Recalculate stats
    const placeRatings = await this.getPlaceRatings(placeId);

    return {
      success: true,
      userRating: ratingValue,
      ratingAvg: placeRatings.averageRating,
      ratingCount: placeRatings.totalRatings,
    };
  }

  async getUserSummary(userId: string) {
    const [savedPlaces, likedPlaces, allUserRatings, tripsCount] = await Promise.all([
      this.getUserSavedPlaces(userId),
      this.getUserLikedPlaces(userId),
      this.prisma.userInteractionEvent.findMany({
        where: { userId, eventType: InteractionEventType.RATE },
        orderBy: { createdAt: 'desc' },
        include: { place: true },
      }),
      this.prisma.trip.count({
        where: { userId },
      }),
    ]);

    // Unique rated places
    const ratedPlacesMap = new Map();
    for (const r of allUserRatings) {
      if (!ratedPlacesMap.has(r.placeId)) {
        ratedPlacesMap.set(r.placeId, {
          place: r.place,
          rating: r.ratingValue,
          ratedAt: r.createdAt,
        });
      }
    }

    return {
      savedPlaces,
      likedPlaces,
      ratedPlaces: Array.from(ratedPlacesMap.values()),
      stats: {
        tripsCount,
        likedCount: likedPlaces.length,
        savedCount: savedPlaces.length,
        ratedCount: ratedPlacesMap.size,
      },
    };
  }

  async getUserInteractions(userId: string, placeId?: string) {
    const where: any = { userId };
    if (placeId) {
      where.placeId = placeId;
    }

    return this.prisma.userInteractionEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        place: {
          select: {
            id: true,
            name: true,
            categories: true,
          },
        },
      },
    });
  }

  async getPlaceInteractions(placeId: string) {
    return this.prisma.userInteractionEvent.findMany({
      where: { placeId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getUserSavedPlaces(userId: string) {
    const saves = await this.prisma.userInteractionEvent.findMany({
      where: {
        userId,
        eventType: InteractionEventType.SAVE,
      },
      select: {
        placeId: true,
        createdAt: true,
      },
    });

    const removals = await this.prisma.userInteractionEvent.findMany({
      where: {
        userId,
        eventType: InteractionEventType.REMOVE_SAVE,
      },
      select: {
        placeId: true,
        createdAt: true,
      },
    });

    const savedPlaceIds = saves
      .filter((save) => {
        const removal = removals.find(
          (r) => r.placeId === save.placeId && r.createdAt > save.createdAt,
        );
        return !removal;
      })
      .map((s) => s.placeId);

    const uniquePlaceIds = [...new Set(savedPlaceIds)];

    return this.prisma.place.findMany({
      where: {
        id: {
          in: uniquePlaceIds,
        },
      },
    });
  }

  async getUserLikedPlaces(userId: string) {
    const interactions = await this.prisma.userInteractionEvent.findMany({
      where: {
        userId,
        eventType: InteractionEventType.LIKE,
      },
      include: {
        place: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Deduplicate by place id
    const seen = new Set<string>();
    const places = [];
    for (const i of interactions) {
      if (!seen.has(i.placeId)) {
        seen.add(i.placeId);
        places.push(i.place);
      }
    }
    return places;
  }

  async getPlaceRatings(placeId: string) {
    const ratings = await this.prisma.userInteractionEvent.findMany({
      where: {
        placeId,
        eventType: InteractionEventType.RATE,
      },
      select: {
        ratingValue: true,
        userId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (ratings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratings: [],
      };
    }

    const sum = ratings.reduce((acc, r) => acc + (r.ratingValue || 0), 0);
    const average = sum / ratings.length;

    return {
      averageRating: Math.round(average * 10) / 10,
      totalRatings: ratings.length,
      ratings,
    };
  }

  private async updatePlacePopularity(placeId: string) {
    const interactions = await this.prisma.userInteractionEvent.groupBy({
      by: ['eventType'],
      where: {
        placeId,
      },
      _count: {
        id: true,
      },
    });

    const weights = {
      [InteractionEventType.VIEW_DETAIL]: 1,
      [InteractionEventType.LIKE]: 3,
      [InteractionEventType.SAVE]: 5,
      [InteractionEventType.RATE]: 4,
      [InteractionEventType.SHARE]: 3,
      [InteractionEventType.REMOVE_SAVE]: -2,
    };

    let popularityScore = 0;
    for (const interaction of interactions) {
      const weight = weights[interaction.eventType as InteractionEventType] || 0;
      popularityScore += interaction._count.id * weight;
    }

    await this.prisma.place.update({
      where: { id: placeId },
      data: { popularityScore: Math.max(0, popularityScore) },
    });

    this.logger.log(`Updated popularity score for place ${placeId}: ${popularityScore}`);
  }

  async getInteractionStats(userId: string) {
    const stats = await this.prisma.userInteractionEvent.groupBy({
      by: ['eventType'],
      where: {
        userId,
      },
      _count: {
        id: true,
      },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.eventType] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);
  }
}
