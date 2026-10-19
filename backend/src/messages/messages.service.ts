import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateConversation(userAId: string, userBId: string) {
    if (userAId === userBId) {
      throw new BadRequestException('Không thể tạo cuộc hội thoại với chính mình');
    }

    const [u1, u2] = [userAId, userBId].sort();

    let conversation = await this.prisma.conversation.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: u1,
          user2Id: u2,
        },
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredStyles: true,
            budgetLevel: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredStyles: true,
            budgetLevel: true,
          },
        },
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          user1Id: u1,
          user2Id: u2,
        },
        include: {
          user1: {
            select: {
              id: true,
              name: true,
              email: true,
              preferredStyles: true,
              budgetLevel: true,
            },
          },
          user2: {
            select: {
              id: true,
              name: true,
              email: true,
              preferredStyles: true,
              budgetLevel: true,
            },
          },
        },
      });
    }

    const partner = conversation.user1Id === userAId ? conversation.user2 : conversation.user1;
    return {
      ...conversation,
      partner,
    };
  }

  async getUserConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      orderBy: { lastMessageAt: 'desc' },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredStyles: true,
            budgetLevel: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredStyles: true,
            budgetLevel: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (conversations.length === 0) {
      return [];
    }

    const unreadCounts = await this.prisma.directMessage.groupBy({
      by: ['conversationId'],
      where: {
        conversationId: { in: conversations.map((c) => c.id) },
        senderId: { not: userId },
        isRead: false,
      },
      _count: { id: true },
    });

    const unreadMap = new Map(unreadCounts.map((u) => [u.conversationId, u._count.id]));

    return conversations.map((c) => {
      const partner = c.user1Id === userId ? c.user2 : c.user1;
      return {
        id: c.id,
        partner,
        lastMessage: c.messages[0] || null,
        unreadCount: unreadMap.get(c.id) || 0,
        lastMessageAt: c.lastMessageAt,
      };
    });
  }

  async getConversationMessages(conversationId: string, currentUserId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredStyles: true,
            budgetLevel: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredStyles: true,
            budgetLevel: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Hội thoại không tồn tại');
    }

    if (conversation.user1Id !== currentUserId && conversation.user2Id !== currentUserId) {
      throw new ForbiddenException('Bạn không có quyền truy cập cuộc trò chuyện này');
    }

    // Đánh dấu đã đọc các tin nhắn đối phương gửi
    await this.prisma.directMessage.updateMany({
      where: {
        conversationId,
        senderId: { not: currentUserId },
        isRead: false,
      },
      data: { isRead: true },
    });

    const messages = await this.prisma.directMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const partner = conversation.user1Id === currentUserId ? conversation.user2 : conversation.user1;

    return {
      conversationId: conversation.id,
      partner,
      messages,
    };
  }

  async saveMessage(conversationId: string, senderId: string, content: string) {
    const trimmed = content?.trim();
    if (!trimmed) {
      throw new BadRequestException('Nội dung tin nhắn không được rỗng');
    }

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Hội thoại không tồn tại');
    }

    if (conversation.user1Id !== senderId && conversation.user2Id !== senderId) {
      throw new ForbiddenException('Bạn không phải thành viên của cuộc trò chuyện này');
    }

    const recipientId = conversation.user1Id === senderId ? conversation.user2Id : conversation.user1Id;

    const [message] = await this.prisma.$transaction([
      this.prisma.directMessage.create({
        data: {
          conversationId,
          senderId,
          content: trimmed,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      }),
    ]);

    return {
      message,
      recipientId,
    };
  }

  async getUnreadCount(userId: string) {
    return this.prisma.directMessage.count({
      where: {
        conversation: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        senderId: { not: userId },
        isRead: false,
      },
    });
  }

  async markConversationRead(conversationId: string, userId: string) {
    await this.prisma.directMessage.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
    return { success: true };
  }
}
