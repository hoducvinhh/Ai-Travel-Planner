import { Controller, Post, Get, Body, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { RagService } from '../rag/rag.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from '../embedding/embedding.service';
import { GeminiService } from '../gemini/gemini.service';
import { ChatDto } from './chat.dto';

@Controller('api/chat')
export class ChatController {
  constructor(
    private readonly ragService: RagService,
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
    private readonly geminiService: GeminiService,
  ) {}

  /**
   * Endpoint chính: Chatbot hỏi đáp streaming qua Server-Sent Events (SSE)
   */
  @Post()
  async chatStream(@Body() body: ChatDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    try {
      for await (const event of this.ragService.streamRagAnswer(body.message)) {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      }
    } catch (error: any) {
      res.write(`data: ${JSON.stringify({ type: 'error', data: error.message || 'Lỗi server' })}\n\n`);
    } finally {
      res.end();
    }
  }

  /**
   * Endpoint phụ: Chatbot hỏi đáp trả về kết quả đầy đủ (JSON)
   */
  @Post('sync')
  async chatSync(@Body() body: ChatDto) {
    return this.ragService.getRagAnswer(body.message);
  }

  /**
   * Endpoint kiểm tra trạng thái RAG và số lượng dữ liệu đã nạp
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
}
