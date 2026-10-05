import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  UsersService,
  AdminCreateUserDto,
  AdminUpdateUserDto,
} from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

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

  // --- ADMIN ENDPOINTS ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.usersService.findAll({ page, limit, search, role });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createUser(@Body() body: AdminCreateUserDto) {
    return this.usersService.adminCreateUser(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: AdminUpdateUserDto,
  ) {
    return this.usersService.adminUpdateUser(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string, @Request() req: any) {
    return this.usersService.adminDeleteUser(id, req.user?.id);
  }
}
