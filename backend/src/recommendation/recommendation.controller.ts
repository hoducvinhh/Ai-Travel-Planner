import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { IsString, IsNumber, IsArray, IsOptional, Min } from 'class-validator';

export class GetRecommendationsDto {
  @IsString()
  userId: string;

  @IsString()
  destination: string;

  @IsNumber()
  @Min(0)
  budgetPerPerson: number;

  @IsNumber()
  @Min(1)
  days: number;

  @IsNumber()
  @Min(1)
  groupSize: number;

  @IsNumber()
  @Min(1)
  monthOfYear: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  explicitPreferences?: string[];
}

@Controller('recommendations')
export class RecommendationController {
  constructor(
    private readonly recommendationService: RecommendationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async getRecommendations(@Body() dto: GetRecommendationsDto) {
    return this.recommendationService.getRecommendations(dto);
  }

  @Post('train')
  @HttpCode(HttpStatus.OK)
  async trainModel() {
    return this.recommendationService.trainModel();
  }

  @Get('health')
  async checkHealth() {
    return this.recommendationService.checkHealth();
  }
}
