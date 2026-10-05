import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

export interface RecommendationRequest {
  userId: string;
  destination: string;
  budgetPerPerson: number;
  days: number;
  groupSize: number;
  monthOfYear: number;
  explicitPreferences?: string[];
}

export interface RecommendationResponse {
  placeIds: string[];
  scores: number[];
}

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);
  private readonly recommendationServiceUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {
    this.recommendationServiceUrl = this.configService.get<string>(
      'RECOMMENDATION_SERVICE_URL',
      'http://localhost:8000',
    );
  }

  async getRecommendations(
    request: RecommendationRequest,
  ): Promise<RecommendationResponse> {
    try {
      this.logger.log(
        `Fetching recommendations for user ${request.userId} to ${request.destination}`,
      );

      const payload = {
        user_id: request.userId,
        destination: request.destination,
        budget_per_person: request.budgetPerPerson,
        days: request.days,
        group_size: request.groupSize,
        month_of_year: request.monthOfYear,
        explicit_preferences: request.explicitPreferences || [],
      };

      const response = await firstValueFrom(
        this.httpService.post<{
          place_ids: string[];
          scores: number[];
        }>(`${this.recommendationServiceUrl}/recommend`, payload, {
          timeout: 5000,
        }),
      );

      return {
        placeIds: (response as any).data.place_ids,
        scores: (response as any).data.scores,
      };
    } catch (error: any) {
      this.logger.warn(
        `Recommendation service unavailable (${error?.message || 'Unknown error'}). Falling back to database popularity ranking.`,
      );
      return this.fallbackRecommendations(request);
    }
  }

  private async fallbackRecommendations(
    request: RecommendationRequest,
  ): Promise<RecommendationResponse> {
    try {
      const takeLimit = Math.max(30, (request.days || 3) * 10);

      // Search places by destination province (case-insensitive)
      let places = await this.prisma.place.findMany({
        where: {
          province: {
            contains: request.destination,
            mode: 'insensitive',
          },
        },
        orderBy: {
          popularityScore: 'desc',
        },
        take: takeLimit,
      });

      // If empty, broaden search across province, district, name
      if (places.length === 0) {
        places = await this.prisma.place.findMany({
          where: {
            OR: [
              { province: { contains: request.destination, mode: 'insensitive' } },
              { district: { contains: request.destination, mode: 'insensitive' } },
              { name: { contains: request.destination, mode: 'insensitive' } },
            ],
          },
          orderBy: {
            popularityScore: 'desc',
          },
          take: takeLimit,
        });
      }

      // If still empty, take top places overall
      if (places.length === 0) {
        places = await this.prisma.place.findMany({
          orderBy: {
            popularityScore: 'desc',
          },
          take: takeLimit,
        });
      }

      // If explicit preferences provided, prioritize places with matching categories
      if (request.explicitPreferences && request.explicitPreferences.length > 0 && places.length > 0) {
        const prefLower = request.explicitPreferences.map((p) => p.toLowerCase().trim());
        places.sort((a, b) => {
          const aMatches = a.categories.filter((c) =>
            prefLower.some((p) => c.toLowerCase().includes(p) || p.includes(c.toLowerCase())),
          ).length;
          const bMatches = b.categories.filter((c) =>
            prefLower.some((p) => c.toLowerCase().includes(p) || p.includes(c.toLowerCase())),
          ).length;

          if (aMatches !== bMatches) {
            return bMatches - aMatches;
          }
          return b.popularityScore - a.popularityScore;
        });
      }

      const placeIds = places.map((p) => p.id);
      const maxPop = places.length > 0 ? Math.max(...places.map((p) => p.popularityScore)) : 1;
      const scores = places.map((p) =>
        maxPop > 0 ? Number((0.3 + 0.6 * (p.popularityScore / maxPop)).toFixed(3)) : 0.5,
      );

      this.logger.log(
        `Fallback generated ${placeIds.length} recommendations from database for destination: ${request.destination}`,
      );

      return {
        placeIds,
        scores,
      };
    } catch (dbError: any) {
      this.logger.error(
        `Database fallback also failed: ${dbError?.message}`,
        dbError?.stack,
      );
      return {
        placeIds: [],
        scores: [],
      };
    }
  }

  async trainModel(): Promise<{ status: string; message: string }> {
    try {
      this.logger.log('Triggering model training...');

      const response = await firstValueFrom(
        this.httpService.post<{ status: string; message: string }>(
          `${this.recommendationServiceUrl}/train`,
        ),
      );

      this.logger.log('Model training completed successfully');
      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Failed to train model: ${error?.message || 'Unknown error'}`,
        error?.stack,
      );
      throw error;
    }
  }

  async checkHealth(): Promise<{ status: string; modelStatus: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<{ status: string; model_status: string }>(
          `${this.recommendationServiceUrl}/health`,
        ),
      );

      return {
        status: (response as any).data.status,
        modelStatus: (response as any).data.model_status,
      };
    } catch (error: any) {
      this.logger.error(
        `Failed to check health: ${error?.message || 'Unknown error'}`,
        error?.stack,
      );
      return {
        status: 'unhealthy',
        modelStatus: 'unknown',
      };
    }
  }
}
