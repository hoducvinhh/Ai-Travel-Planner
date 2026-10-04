import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CommunityService, CreatePostDto } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('posts')
  async getPosts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
    @Query('userId') userId?: string,
  ) {
    return this.communityService.getPosts({ page, limit, tag, search, userId });
  }

  @Post('posts')
  async createPost(
    @Body() body: CreatePostDto & { userId: string },
  ) {
    if (!body.userId) {
      throw new BadRequestException('Vui lòng đăng nhập để đăng bài');
    }
    return this.communityService.createPost(body.userId, body);
  }

  @Post('posts/:id/like')
  async toggleLike(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    if (!body.userId) {
      throw new BadRequestException('Vui lòng đăng nhập để thích bài viết');
    }
    return this.communityService.toggleLike(id, body.userId);
  }

  @Get('posts/:id/comments')
  async getComments(@Param('id') id: string) {
    return this.communityService.getComments(id);
  }

  @Post('posts/:id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() body: { userId: string; content: string },
  ) {
    if (!body.userId) {
      throw new BadRequestException('Vui lòng đăng nhập để bình luận');
    }
    return this.communityService.addComment(id, body.userId, body.content);
  }

  @Get('travel-buddies')
  async getTravelBuddies(@Query('userId') userId?: string) {
    return this.communityService.getTravelBuddies(userId);
  }
}
