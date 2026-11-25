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

      // Lấy thêm thông tin hồ sơ người dùng để cá nhân hóa cold-start đa thuộc tính
      let userPreferredStyles: string[] = [];
      let userBudgetLevel: string | null = null;
      let companionType: string | null = null;

      if (request.userId) {
        try {
          const user = await this.prisma.user.findUnique({
            where: { id: request.userId },
            select: { preferredStyles: true, budgetLevel: true },
          });
          if (user) {
            userPreferredStyles = user.preferredStyles || [];
            userBudgetLevel = user.budgetLevel || null;
            // Trích xuất companion nếu được lưu dạng companion:family
            const compTag = userPreferredStyles.find((s) => s.startsWith('companion:'));
            if (compTag) {
              companionType = compTag.replace('companion:', '');
            } else if (request.groupSize) {
              if (request.groupSize === 1) companionType = 'solo';
              else if (request.groupSize === 2) companionType = 'couple';
              else if (request.groupSize >= 3) companionType = 'family';
            }
          }
        } catch (e: any) {
          this.logger.debug(`Could not load user profile for recommendations: ${e.message}`);
        }
      }

      const payload = {
        user_id: request.userId,
        destination: request.destination,
        budget_per_person: request.budgetPerPerson,
        days: request.days,
        group_size: request.groupSize,
        month_of_year: request.monthOfYear,
        explicit_preferences: request.explicitPreferences || [],
        user_preferred_styles: userPreferredStyles,
        budget_level: userBudgetLevel,
        companion_type: companionType,
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
        `Recommendation service unavailable (${error?.message || 'Unknown error'}). Falling back to multi-attribute content-based ranking.`,
      );
      return this.fallbackRecommendations(request);
    }
  }

  private async fallbackRecommendations(
    request: RecommendationRequest,
  ): Promise<RecommendationResponse> {
    try {
      const takeLimit = Math.max(40, (request.days || 3) * 15);

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
        take: 300,
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
          take: 300,
        });
      }

      // If still empty, take top places overall
      if (places.length === 0) {
        places = await this.prisma.place.findMany({
          orderBy: {
            popularityScore: 'desc',
          },
          take: 300,
        });
      }

      if (places.length === 0) {
        return { placeIds: [], scores: [] };
      }

      // --- Thuật toán Cold-Start Cá Nhân Hóa Đa Thuộc Tính (Multi-Attribute Content-Based) ---
      // Lấy thông tin user nếu có
      let userStyles: string[] = [];
      let budgetLevel = 'standard';
      let companionType = 'friends';

      if (request.userId) {
        try {
          const user = await this.prisma.user.findUnique({
            where: { id: request.userId },
            select: { preferredStyles: true, budgetLevel: true },
          });
          if (user) {
            userStyles = user.preferredStyles || [];
            if (user.budgetLevel) budgetLevel = user.budgetLevel;
            const compTag = userStyles.find((s) => s.startsWith('companion:'));
            if (compTag) companionType = compTag.replace('companion:', '');
          }
        } catch {
          // ignore
        }
      }

      if (request.groupSize === 1) companionType = 'solo';
      else if (request.groupSize === 2) companionType = 'couple';

      const tripPrefs = (request.explicitPreferences || []).map((p) => p.toLowerCase());
      const onboardPrefs = userStyles
        .filter((s) => !s.startsWith('companion:'))
        .map((s) => s.toLowerCase());

      // 1. Dung hợp Vector động: u_final = 0.75 * t_trip + 0.25 * u_onboard
      const alpha = 0.75;
      const prefWeights = new Map<string, number>();

      if (tripPrefs.length > 0 && onboardPrefs.length > 0) {
        for (const p of tripPrefs) {
          prefWeights.set(p, (prefWeights.get(p) || 0) + alpha);
        }
        for (const p of onboardPrefs) {
          prefWeights.set(p, (prefWeights.get(p) || 0) + (1 - alpha));
        }
      } else if (tripPrefs.length > 0) {
        for (const p of tripPrefs) prefWeights.set(p, 1.0);
      } else if (onboardPrefs.length > 0) {
        for (const p of onboardPrefs) prefWeights.set(p, 1.0);
      }

      const dailyBudget = request.days > 0 && request.budgetPerPerson > 0
        ? request.budgetPerPerson / request.days
        : 1000000;

      const maxPop = Math.max(...places.map((p) => p.popularityScore || 0), 1);
      const minPop = Math.min(...places.map((p) => p.popularityScore || 0), 0);
      const popRange = maxPop - minPop > 0 ? maxPop - minPop : 1;

      // Chấm điểm từng địa điểm
      const scoredPlaces = places.map((place) => {
        const cats = (place.categories || []).map((c) => c.toLowerCase());
        const placeName = place.name.toLowerCase();

        // 1. Điểm sở thích (50%)
        let matchSum = 0;
        if (prefWeights.size > 0) {
          for (const [kw, weight] of prefWeights.entries()) {
            if (cats.some((c) => c.includes(kw) || kw.includes(c)) || placeName.includes(kw)) {
              matchSum += weight;
            }
          }
        } else {
          matchSum = 0.5;
        }
        const sContent = Math.min(1.0, matchSum);

        // 2. Điểm ngân sách (25%)
        const price = place.priceEstimate || 0;
        let fitBudget = 0.8;
        if (dailyBudget > 0) {
          if (price <= dailyBudget * 0.6) fitBudget = 1.0;
          else if (price <= dailyBudget) fitBudget = 0.9;
          else if (price <= dailyBudget * 1.3) fitBudget = 0.6;
          else fitBudget = 0.3;
        }

        // 3. Điểm nhóm đi (15%)
        let fitGroup = 0.8;
        const isNightlife = cats.some((c) => ['nightlife', 'bar', 'pub', 'club', 'chợ đêm'].includes(c));
        const isNatureRelax = cats.some((c) => ['nature', 'relax', 'park', 'beach', 'resort'].includes(c));

        if (companionType === 'family') {
          if (isNightlife) fitGroup = 0.1; // phạt nặng
          else if (isNatureRelax) fitGroup = 1.0;
          else fitGroup = 0.8;
        } else if (companionType === 'couple') {
          if (isNatureRelax || cats.some((c) => ['photography', 'food', 'cafe'].includes(c))) fitGroup = 1.0;
          else fitGroup = 0.8;
        } else if (companionType === 'friends') {
          if (isNightlife || cats.some((c) => ['adventure', 'food', 'shopping'].includes(c))) fitGroup = 1.0;
          else fitGroup = 0.8;
        } else {
          fitGroup = 0.85;
        }

        // 4. Điểm phổ biến (10%)
        const normPop = (place.popularityScore - minPop) / popRange;

        // CÔNG THỨC: Score = 0.50 * S_content + 0.25 * Fit_budget + 0.15 * Fit_group + 0.10 * NormPop
        const finalScore = 0.50 * sContent + 0.25 * fitBudget + 0.15 * fitGroup + 0.10 * normPop;

        return {
          id: place.id,
          score: Math.round(finalScore * 1000) / 1000,
        };
      });

      // Sắp xếp giảm dần theo điểm tổng hợp
      scoredPlaces.sort((a, b) => b.score - a.score);

      const topPlaces = scoredPlaces.slice(0, takeLimit);

      return {
        placeIds: topPlaces.map((p) => p.id),
        scores: topPlaces.map((p) => p.score),
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
