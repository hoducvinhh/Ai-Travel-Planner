import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from '../embedding/embedding.service';
import { GeminiService } from '../gemini/gemini.service';

export interface RetrievedChunk {
  id: string;
  chunk_type: 'context' | 'qa';
  content: string;
  metadata: any;
  similarity: number;
}

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
    private readonly geminiService: GeminiService,
  ) {}

  /**
   * Tìm kiếm các chunks ngữ cảnh có độ tương đồng cao nhất với câu hỏi
   */
  async searchSimilarChunks(query: string, topK: number = 5): Promise<RetrievedChunk[]> {
    const queryVector = await this.embeddingService.embed(query);
    const vectorStr = `[${queryVector.join(',')}]`;

    const results = await this.prisma.$queryRaw<RetrievedChunk[]>`
      SELECT id, chunk_type, content, metadata, 
             1 - (embedding <=> ${vectorStr}::vector) AS similarity
      FROM tourism_chunks
      ORDER BY embedding <=> ${vectorStr}::vector
      LIMIT ${topK};
    `;

    return results;
  }

  /**
   * Tạo prompt RAG hoàn chỉnh kết hợp ngữ cảnh và câu hỏi
   */
  buildRagPrompt(question: string, chunks: RetrievedChunk[]): string {
    const contextSections = chunks
      .map((chunk, index) => {
        const typeLabel = chunk.chunk_type === 'qa' ? 'Cặp Hỏi - Đáp mẫu' : 'Ngữ cảnh bài viết';
        const similarityPct = (Number(chunk.similarity) * 100).toFixed(1);
        return `--- [TÀI LIỆU ${index + 1} (${typeLabel}) - Khớp: ${similarityPct}%] ---\n${chunk.content}`;
      })
      .join('\n\n');

    return `Bạn là "Cố Vấn Du Lịch Việt Nam AI" - một chuyên gia du lịch am hiểu văn hóa, lịch sử, ẩm thực và các địa danh của đất nước Việt Nam.

Nhiệm vụ của bạn là trả lời câu hỏi của người dùng dựa trên các tài liệu tham khảo được cung cấp bên dưới (được trích xuất từ cơ sở tri thức du lịch Việt Nam qua vector search).

HƯỚNG DẪN TRẢ LỜI:
1. Hãy ưu tiên sử dụng thông tin trong phần "TÀI LIỆU THAM KHẢO" để trả lời chính xác, mạch lạc và tự nhiên.
2. Trả lời bằng tiếng Việt thân thiện, nhiệt tình, có cấu trúc rõ ràng (sử dụng gạch đầu dòng hoặc in đậm các địa danh, món ăn nổi bật khi thích hợp).
3. Nếu tài liệu tham khảo có chứa câu trả lời trực tiếp từ cặp Hỏi - Đáp hoặc Ngữ cảnh bài viết, hãy tổng hợp đầy đủ và làm phong phú thêm câu trả lời.
4. Nếu câu hỏi hoàn toàn không liên quan đến du lịch Việt Nam hoặc thông tin không có trong tài liệu, hãy thông báo lịch sự rằng cơ sở dữ liệu hiện tại chỉ tập trung vào du lịch Việt Nam.

TÀI LIỆU THAM KHẢO:
${contextSections}

CÂU HỎI CỦA NGƯỜI DÙNG:
${question}

CÂU TRẢ LỜI:`;
  }

  /**
   * Xử lý câu hỏi và stream phản hồi kèm danh sách nguồn trích dẫn
   */
  async *streamRagAnswer(question: string): AsyncGenerator<{ type: 'sources' | 'token' | 'done'; data: any }> {
    this.logger.log(`Bắt đầu truy vấn RAG cho câu hỏi: "${question}"`);

    // 1. Tìm kiếm chunks tương đồng
    const sources = await this.searchSimilarChunks(question, 5);

    // 2. Gửi metadata danh sách nguồn trích dẫn về client trước
    yield {
      type: 'sources',
      data: sources.map((s) => ({
        id: s.id,
        chunk_type: s.chunk_type,
        title: s.metadata?.title || 'Du lịch Việt Nam',
        content: s.content,
        similarity: Number(s.similarity),
        metadata: s.metadata,
      })),
    };

    // 3. Xây dựng prompt
    const prompt = this.buildRagPrompt(question, sources);

    // 4. Stream từng token câu trả lời từ Gemini
    for await (const token of this.geminiService.generateAnswerStream(prompt)) {
      yield {
        type: 'token',
        data: token,
      };
    }

    // 5. Báo hiệu kết thúc
    yield {
      type: 'done',
      data: true,
    };
  }

  /**
   * Xử lý câu hỏi trả về dạng JSON hoàn chỉnh (non-streaming)
   */
  async getRagAnswer(question: string) {
    const sources = await this.searchSimilarChunks(question, 5);
    const prompt = this.buildRagPrompt(question, sources);
    const answer = await this.geminiService.generateAnswer(prompt);

    return {
      question,
      answer,
      sources: sources.map((s) => ({
        id: s.id,
        chunk_type: s.chunk_type,
        title: s.metadata?.title || 'Du lịch Việt Nam',
        content: s.content,
        similarity: Number(s.similarity),
        metadata: s.metadata,
      })),
    };
  }
}
