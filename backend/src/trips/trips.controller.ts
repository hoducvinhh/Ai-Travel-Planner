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
  UseGuards,
  Request,
} from '@nestjs/common';
import { TripsService, CreateTripDto } from './trips.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTrip(@Request() req: any, @Body() dto: CreateTripDto) {
    dto.userId = req.user.id;
    return this.tripsService.createTrip(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTripById(@Param('id') id: string) {
    return this.tripsService.getTripById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/clone')
  async cloneTrip(@Param('id') id: string, @Request() req: any) {
    return this.tripsService.cloneTrip(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/optimize')
  async optimizeTrip(@Param('id') id: string) {
    return this.tripsService.optimizeTripItinerary(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTrips(@Request() req: any) {
    return this.tripsService.getUserTrips(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  async updateTripStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.tripsService.updateTripStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrip(@Param('id') id: string) {
    await this.tripsService.deleteTrip(id);
  }
}
