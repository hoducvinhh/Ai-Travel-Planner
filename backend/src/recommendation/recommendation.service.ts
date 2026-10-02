import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

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
        }>(`${this.recommendationServiceUrl}/recommend`, payload),
      );

      return {
        placeIds: (response as any).data.place_ids,
        scores: (response as any).data.scores,
      };
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch recommendations: ${error?.message || 'Unknown error'}`,
        error?.stack,
      );
      throw error;
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
