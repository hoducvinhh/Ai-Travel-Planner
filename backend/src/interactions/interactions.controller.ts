import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InteractionsService, TrackInteractionDto } from './interactions.service';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async trackInteraction(@Body() dto: TrackInteractionDto) {
    return this.interactionsService.trackInteraction(dto);
  }

  @Get('user/:userId')
  async getUserInteractions(
    @Param('userId') userId: string,
    @Query('placeId') placeId?: string,
  ) {
    return this.interactionsService.getUserInteractions(userId, placeId);
  }

  @Get('place/:placeId')
  async getPlaceInteractions(@Param('placeId') placeId: string) {
    return this.interactionsService.getPlaceInteractions(placeId);
  }

  @Get('user/:userId/saved')
  async getUserSavedPlaces(@Param('userId') userId: string) {
    return this.interactionsService.getUserSavedPlaces(userId);
  }

  @Get('user/:userId/liked')
  async getUserLikedPlaces(@Param('userId') userId: string) {
    return this.interactionsService.getUserLikedPlaces(userId);
  }

  @Get('place/:placeId/ratings')
  async getPlaceRatings(@Param('placeId') placeId: string) {
    return this.interactionsService.getPlaceRatings(placeId);
  }

  @Get('user/:userId/stats')
  async getInteractionStats(@Param('userId') userId: string) {
    return this.interactionsService.getInteractionStats(userId);
  }
}
