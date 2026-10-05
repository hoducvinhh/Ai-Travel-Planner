import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlacesService, PlacesQueryDto, CreatePlaceDto, UpdatePlaceDto } from './places.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  async getPlaces(@Query() query: PlacesQueryDto) {
    return this.placesService.findAll(query);
  }

  @Get(':id')
  async getPlace(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.placesService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createPlace(@Body() body: CreatePlaceDto) {
    return this.placesService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async updatePlace(@Param('id') id: string, @Body() body: UpdatePlaceDto) {
    return this.placesService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deletePlace(@Param('id') id: string) {
    return this.placesService.delete(id);
  }
}
