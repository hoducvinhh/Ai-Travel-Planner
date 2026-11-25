import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GeminiModule } from '../gemini/gemini.module';
import { RecommendationModule } from '../recommendation/recommendation.module';
import { RouteOptimizerService } from './optimizer/route-optimizer.service';
import { FeasibilityValidatorService } from './optimizer/feasibility-validator.service';

@Module({
  imports: [PrismaModule, GeminiModule, RecommendationModule],
  controllers: [TripsController],
  providers: [TripsService, RouteOptimizerService, FeasibilityValidatorService],
  exports: [TripsService, RouteOptimizerService, FeasibilityValidatorService],
})
export class TripsModule {}
