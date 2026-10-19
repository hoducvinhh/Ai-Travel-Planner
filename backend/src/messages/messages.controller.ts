import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  async getUserConversations(@Request() req: any) {
    return this.messagesService.getUserConversations(req.user.id);
  }

  @Post('conversations')
  async getOrCreateConversation(
    @Request() req: any,
    @Body('targetUserId') targetUserId: string,
  ) {
    if (!targetUserId) {
      throw new BadRequestException('targetUserId không được để trống');
    }
    return this.messagesService.getOrCreateConversation(req.user.id, targetUserId);
  }

  @Get('conversations/:id/messages')
  async getConversationMessages(
    @Param('id') conversationId: string,
    @Request() req: any,
  ) {
    return this.messagesService.getConversationMessages(conversationId, req.user.id);
  }

  @Post('conversations/:id/read')
  async markRead(
    @Param('id') conversationId: string,
    @Request() req: any,
  ) {
    return this.messagesService.markConversationRead(conversationId, req.user.id);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    const count = await this.messagesService.getUnreadCount(req.user.id);
    return { unreadCount: count };
  }
}
