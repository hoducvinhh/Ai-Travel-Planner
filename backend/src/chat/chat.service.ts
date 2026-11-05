import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/feedback.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy danh sách phiên trò chuyện của user hoặc khách vãng lai
   */
  async getSessions(userId?: string, guestSessionIds?: string[]) {
    if (userId) {
      return this.prisma.chatSession.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: { messages: true },
          },
        },
      });
    }

    if (guestSessionIds && guestSessionIds.length > 0) {
      return this.prisma.chatSession.findMany({
        where: {
          id: { in: guestSessionIds },
        },
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: { messages: true },
          },
        },
      });
    }

    return [];
  }

  /**
   * Lấy chi tiết một phiên trò chuyện kèm toàn bộ tin nhắn
   */
  async getSessionDetail(sessionId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Không tìm thấy phiên trò chuyện với id: ${sessionId}`);
    }

    return session;
  }

  /**
   * Tạo phiên trò chuyện mới
   */
  async createSession(title: string = 'Cuộc trò chuyện mới', userId?: string) {
    return this.prisma.chatSession.create({
      data: {
        title: title.slice(0, 100),
        userId: userId || null,
      },
    });
  }

  /**
   * Cập nhật tiêu đề phiên trò chuyện
   */
  async updateSessionTitle(sessionId: string, title: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Không tìm thấy phiên trò chuyện với id: ${sessionId}`);
    }

    return this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { title: title.trim().slice(0, 100) },
    });
  }

  /**
   * Xóa phiên trò chuyện
   */
  async deleteSession(sessionId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Không tìm thấy phiên trò chuyện với id: ${sessionId}`);
    }

    return this.prisma.chatSession.delete({
      where: { id: sessionId },
    });
  }

  /**
   * Thêm tin nhắn mới vào phiên trò chuyện
   */
  async addMessage(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
    sources?: any,
  ) {
    // 1. Kiểm tra session
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Không tìm thấy phiên trò chuyện với id: ${sessionId}`);
    }

    // 2. Tự động đổi title nếu session đang là mặc định và user vừa gửi câu hỏi đầu tiên
    let updateTitleData: any = {};
    if (
      role === 'user' &&
      (session.title === 'Cuộc trò chuyện mới' || !session.title.trim())
    ) {
      const cleanTitle = content.trim().replace(/\n+/g, ' ').slice(0, 60);
      updateTitleData.title = cleanTitle || 'Cuộc trò chuyện mới';
    }

    // 3. Tạo tin nhắn và cập nhật session
    const [message] = await this.prisma.$transaction([
      this.prisma.chatMessage.create({
        data: {
          sessionId,
          role,
          content,
          sources: sources ? sources : undefined,
        },
      }),
      this.prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          updatedAt: new Date(),
          ...updateTitleData,
        },
      }),
    ]);

    return message;
  }

  /**
   * Lưu phản hồi / báo cáo sai lệch tri thức từ người dùng
   */
  async createFeedback(dto: CreateFeedbackDto) {
    return this.prisma.knowledgeFeedback.create({
      data: {
        sessionId: dto.sessionId || null,
        userQuestion: dto.userQuestion,
        botAnswer: dto.botAnswer,
        reason: dto.reason,
        userNote: dto.userNote || null,
        status: 'PENDING',
      },
    });
  }
}
