import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagesGateway.name);
  private userSocketsMap = new Map<string, Set<string>>();

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      let token = client.handshake.auth?.token;
      if (!token && client.handshake.headers?.authorization) {
        const parts = client.handshake.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          token = parts[1];
        }
      }

      if (!token) {
        this.logger.warn(`Client connection rejected: No token provided (${client.id})`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'super_secret_key_for_jwt_datn_2026',
      });

      const userId = payload.sub || payload.id;
      if (!userId) {
        client.disconnect();
        return;
      }

      client.data.userId = userId;
      client.data.user = payload;

      // Gia nhập phòng cá nhân để nhận live notifications
      client.join(`user_${userId}`);

      if (!this.userSocketsMap.has(userId)) {
        this.userSocketsMap.set(userId, new Set());
      }
      this.userSocketsMap.get(userId)?.add(client.id);

      this.logger.log(`User connected: ${userId} (socket ${client.id})`);

      // Gửi số tin nhắn chưa đọc hiện tại về cho user
      const unreadCount = await this.messagesService.getUnreadCount(userId);
      client.emit('unread_notification', { unreadCount });
    } catch (err: any) {
      this.logger.warn(`JWT verification failed on socket handshake: ${err?.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId && this.userSocketsMap.has(userId)) {
      const set = this.userSocketsMap.get(userId);
      set?.delete(client.id);
      if (set?.size === 0) {
        this.userSocketsMap.delete(userId);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      client.join(`conversation_${data.conversationId}`);
      this.logger.log(`Socket ${client.id} joined conversation_${data.conversationId}`);
    }
  }

  @SubscribeMessage('leave_conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      client.leave(`conversation_${data.conversationId}`);
      this.logger.log(`Socket ${client.id} left conversation_${data.conversationId}`);
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const senderId = client.data?.userId;
    if (!senderId) {
      client.emit('error', { message: 'Chưa xác thực người dùng' });
      return;
    }

    try {
      const { message, recipientId } = await this.messagesService.saveMessage(
        data.conversationId,
        senderId,
        data.content,
      );

      // 1. Phát sóng tin nhắn ngay lập tức đến phòng trò chuyện (< 0.1s)
      this.server.to(`conversation_${data.conversationId}`).emit('new_message', message);

      // 2. Cập nhật huy hiệu chưa đọc cho người nhận
      const recipientUnread = await this.messagesService.getUnreadCount(recipientId);
      this.server.to(`user_${recipientId}`).emit('unread_notification', {
        unreadCount: recipientUnread,
        fromUserId: senderId,
        conversationId: data.conversationId,
      });

      // 3. Phản hồi cho người gửi (để xác nhận đã lưu)
      client.emit('message_sent', { success: true, messageId: message.id });
    } catch (err: any) {
      this.logger.error(`Error sending message: ${err?.message}`);
      client.emit('error', { message: err?.message || 'Không thể gửi tin nhắn' });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    const userId = client.data?.userId;
    if (userId && data?.conversationId) {
      client.to(`conversation_${data.conversationId}`).emit('typing', {
        userId,
        isTyping: data.isTyping,
      });
    }
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data?.userId;
    if (userId && data?.conversationId) {
      await this.messagesService.markConversationRead(data.conversationId, userId);
      const unreadCount = await this.messagesService.getUnreadCount(userId);
      client.emit('unread_notification', { unreadCount });
    }
  }
}
