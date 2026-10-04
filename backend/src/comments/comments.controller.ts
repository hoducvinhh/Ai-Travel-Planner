import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('places/:placeId/comments')
  async getComments(@Param('placeId') placeId: string) {
    return this.commentsService.findByPlace(placeId);
  }

  @Post('places/:placeId/comments')
  async addComment(
    @Param('placeId') placeId: string,
    @Body() body: { content: string; userId?: string },
    @Request() req: any,
  ) {
    // Support either authenticated user or userId in body
    const userId = req.user?.id || body.userId;
    if (!userId) {
      throw new Error('Vui lòng đăng nhập để bình luận');
    }
    return this.commentsService.create(placeId, userId, body.content);
  }

  @Delete('comments/:id')
  async deleteComment(
    @Param('id') id: string,
    @Body() body: { userId?: string },
    @Request() req: any,
  ) {
    const userId = req.user?.id || body.userId;
    if (!userId) {
      throw new Error('Thiếu thông tin người dùng');
    }
    return this.commentsService.delete(id, userId);
  }
}
