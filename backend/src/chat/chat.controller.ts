import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  Res,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RagService } from '../rag/rag.service';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from '../embedding/embedding.service';
import { GeminiService } from '../gemini/gemini.service';
import { ChatDto, CreateSessionDto, UpdateSessionDto } from './chat.dto';
import { CreateFeedbackDto } from './dto/feedback.dto';

@Controller('api/chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    private readonly ragService: RagService,
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
    private readonly geminiService: GeminiService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Helper trích xuất userId từ header Authorization Bearer token (nếu có)
   */
  private extractUserId(req: Request): string | undefined {
    try {
      const authHeader = req.headers?.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = this.jwtService.decode(token) as any;
        return payload?.sub || payload?.id;
      }
    } catch (err) {
      this.logger.debug('Lỗi giải mã JWT token:', err);
    }
    return undefined;
  }

  /**
   * 1. Lấy danh sách các phiên trò chuyện
   */
  @Get('sessions')
  async getSessions(
    @Req() req: Request,
    @Query('guest_ids') guestIdsParam?: string,
  ) {
    const userId = this.extractUserId(req);
    let guestIds: string[] | undefined;

    if (guestIdsParam) {
      guestIds = guestIdsParam.split(',').map((id) => id.trim()).filter(Boolean);
    }

    return this.chatService.getSessions(userId, guestIds);
  }

  /**
   * 2. Tạo phiên trò chuyện mới thủ công
   */
  @Post('sessions')
  async createSession(
    @Req() req: Request,
    @Body() body: CreateSessionDto,
  ) {
    const userId = this.extractUserId(req);
    return this.chatService.createSession(body.title, userId);
  }

  /**
   * 3. Lấy chi tiết phiên trò chuyện kèm toàn bộ tin nhắn
   */
  @Get('sessions/:id')
  async getSessionDetail(@Param('id') id: string) {
    return this.chatService.getSessionDetail(id);
  }

  /**
   * 4. Cập nhật tiêu đề phiên trò chuyện
   */
  @Patch('sessions/:id')
  async updateSessionTitle(
    @Param('id') id: string,
    @Body() body: UpdateSessionDto,
  ) {
    return this.chatService.updateSessionTitle(id, body.title);
  }

  /**
   * 5. Xóa phiên trò chuyện
   */
  @Delete('sessions/:id')
  async deleteSession(@Param('id') id: string) {
    return this.chatService.deleteSession(id);
  }

  /**
   * 6. Endpoint chính: Chatbot hỏi đáp streaming qua SSE và tự động lưu lịch sử
   */
  @Post()
  async chatStream(
    @Req() req: Request,
    @Body() body: ChatDto,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const userId = this.extractUserId(req);
    let activeSessionId = body.sessionId;
    let isNewSession = false;

    try {
      // 1. Quản lý Session
      if (!activeSessionId) {
        const newSession = await this.chatService.createSession(
          body.message.slice(0, 60),
          userId,
        );
        activeSessionId = newSession.id;
        isNewSession = true;
      }

      // 2. Gửi thông tin session về client ngay lập tức
      res.write(
        `data: ${JSON.stringify({
          type: 'session_info',
          data: {
            sessionId: activeSessionId,
            isNew: isNewSession,
          },
        })}\n\n`,
      );

      // 3. Lưu tin nhắn của user vào database
      await this.chatService.addMessage(activeSessionId, 'user', body.message);

      // 4. Biến lưu tích lũy kết quả bot để lưu vào DB khi kết thúc
      let accumulatedSources: any = null;
      let accumulatedContent = '';

      // 5. Stream kết quả từ RagService
      for await (const event of this.ragService.streamRagAnswer(body.message)) {
        if (event.type === 'sources') {
          accumulatedSources = event.data || null;
        } else if (event.type === 'token') {
          accumulatedContent += event.data || '';
        } else if (event.type === 'content_update') {
          accumulatedContent = event.data || accumulatedContent;
        }

        res.write(`data: ${JSON.stringify(event)}\n\n`);
      }

      // 6. Lưu tin nhắn của Assistant và nguồn tham chiếu vào database
      if (accumulatedContent.trim()) {
        await this.chatService.addMessage(
          activeSessionId,
          'assistant',
          accumulatedContent,
          accumulatedSources,
        );
      }
    } catch (error: any) {
      this.logger.error(`Lỗi stream chat RAG: ${error.message}`, error.stack);
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          data: error.message || 'Lỗi server khi truy xuất tri thức',
        })}\n\n`,
      );
    } finally {
      res.end();
    }
  }

  /**
   * 7. Endpoint phụ: Chatbot hỏi đáp trả về kết quả JSON đầy đủ
   */
  @Post('sync')
  async chatSync(@Req() req: Request, @Body() body: ChatDto) {
    const userId = this.extractUserId(req);
    let activeSessionId = body.sessionId;

    if (!activeSessionId) {
      const newSession = await this.chatService.createSession(
        body.message.slice(0, 60),
        userId,
      );
      activeSessionId = newSession.id;
    }

    await this.chatService.addMessage(activeSessionId, 'user', body.message);

    const result = await this.ragService.getRagAnswer(body.message);

    const sourcesPayload = {
      mode: result.mode,
      items: result.sources,
      webSources: result.webSources,
      disclaimer: result.disclaimer,
    };

    await this.chatService.addMessage(
      activeSessionId,
      'assistant',
      result.answer,
      sourcesPayload,
    );

    return {
      sessionId: activeSessionId,
      ...result,
    };
  }

  /**
   * 8. Endpoint kiểm tra trạng thái RAG và số lượng dữ liệu đã nạp
   */
  @Get('status')
  async getStatus() {
    try {
      const countResult = await this.prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM tourism_chunks;
      `;
      const count = Number(countResult[0]?.count || 0);

      const typeStats = await this.prisma.$queryRaw<Array<{ chunk_type: string; count: bigint }>>`
        SELECT chunk_type, COUNT(*) as count FROM tourism_chunks GROUP BY chunk_type;
      `;

      return {
        status: 'online',
        database: {
          connected: true,
          totalChunks: count,
          breakdown: typeStats.map((t: { chunk_type: string; count: bigint }) => ({
            type: t.chunk_type,
            count: Number(t.count),
          })),
        },
        services: {
          bgeM3Local: this.embeddingService.isReady(),
          geminiConfigured: this.geminiService.isConfigured(),
        },
      };
    } catch (error: any) {
      return {
        status: 'degraded',
        error: error.message,
      };
    }
  }

  /**
   * 9. Endpoint tiếp nhận báo cáo/phản hồi sai lệch tri thức từ người dùng
   */
  @Post('feedback')
  async submitFeedback(@Body() body: CreateFeedbackDto) {
    const feedback = await this.chatService.createFeedback(body);
    return {
      success: true,
      message: 'Cảm ơn bạn đã gửi phản hồi. Hệ thống sẽ kiểm tra và cập nhật dữ liệu.',
      data: feedback,
    };
  }
}
