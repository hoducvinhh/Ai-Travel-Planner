import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TripsService, CreateTripDto } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTrip(@Body() dto: CreateTripDto) {
    return this.tripsService.createTrip(dto);
  }

  @Get(':id')
  async getTripById(@Param('id') id: string) {
    return this.tripsService.getTripById(id);
  }

  @Get()
  async getUserTrips(@Query('userId') userId: string) {
    return this.tripsService.getUserTrips(userId);
  }

  @Patch(':id/status')
  async updateTripStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.tripsService.updateTripStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrip(@Param('id') id: string) {
    await this.tripsService.deleteTrip(id);
  }
}
