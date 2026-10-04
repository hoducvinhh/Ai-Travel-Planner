import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/profile')
  async getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch(':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      preferredStyles?: string[];
      budgetLevel?: string;
    },
  ) {
    return this.usersService.updateProfile(id, body);
  }
}
