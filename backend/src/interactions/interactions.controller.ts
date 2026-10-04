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
import {
  InteractionsService,
  TrackInteractionDto,
  InteractionEventType,
} from './interactions.service';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async trackInteraction(@Body() dto: TrackInteractionDto) {
    return this.interactionsService.trackInteraction(dto);
  }

  @Post('toggle-like')
  async toggleLike(@Body() body: { userId: string; placeId: string }) {
    return this.interactionsService.toggleLike(body.userId, body.placeId);
  }

  @Post('toggle-save')
  async toggleSave(@Body() body: { userId: string; placeId: string }) {
    return this.interactionsService.toggleSave(body.userId, body.placeId);
  }

  @Post('rate')
  async ratePlace(
    @Body() body: { userId: string; placeId: string; ratingValue: number },
  ) {
    return this.interactionsService.ratePlace(
      body.userId,
      body.placeId,
      body.ratingValue,
    );
  }

  @Post('track')
  async trackEvent(
    @Body() body: { userId: string; placeId: string; eventType: InteractionEventType },
  ) {
    return this.interactionsService.trackInteraction({
      userId: body.userId,
      placeId: body.placeId,
      eventType: body.eventType,
    });
  }

  @Get('user/:userId/summary')
  async getUserSummary(@Param('userId') userId: string) {
    return this.interactionsService.getUserSummary(userId);
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
