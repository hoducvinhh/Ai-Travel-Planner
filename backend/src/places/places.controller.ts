import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlacesService, PlacesQueryDto } from './places.service';

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
}
