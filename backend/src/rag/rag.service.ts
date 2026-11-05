import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from '../embedding/embedding.service';
import { GeminiService, WebGroundingSource } from '../gemini/gemini.service';

export interface RetrievedChunk {
  id: string;
  chunk_type: 'context' | 'qa';
  content: string;
  metadata: any;
  similarity: number;
}

export type QueryMode = 'internal' | 'live_web';

export interface QueryIntent {
  mode: QueryMode;
  reason: string;
  matchedKeywords: string[];
}

export interface RagSourcesPayload {
  mode: QueryMode;
  items: Array<{
    id: string;
    chunk_type: 'context' | 'qa';
    title: string;
    content: string;
    similarity: number;
    metadata: any;
  }>;
  webSources: WebGroundingSource[];
  disclaimer?: string | null;
}

export const DISCLAIMER_NOTE =
  '⚠️ Lưu ý: Thông tin về giá vé, giờ mở cửa và trạng thái hoạt động có thể thay đổi tùy thời điểm, dịp lễ/tết hoặc chính sách mới nhất của đơn vị quản lý. Du khách nên kiểm tra lại với cổng thông tin chính thức trước chuyến đi.';

const DYNAMIC_KEYWORDS = [
  // Giá vé & Chi phí
  'giá vé', 'vé vào', 'vé tham quan', 'bao nhiêu tiền', 'giá bao nhiêu',
  'bảng giá', 'phí vào', 'phí tham quan', 'giá cáp treo', 'vé combo',
  'phụ thu', 'vé trẻ em', 'vé người lớn', 'mua vé', 'đặt vé', 'chi phí',
  'giá tour', 'tiền vé', 'mức giá',
  // Khung giờ & Lịch vận hành
  'giờ mở cửa', 'mở cửa', 'giờ đóng cửa', 'đóng cửa', 'giờ hoạt động',
  'lịch diễn', 'lịch biểu diễn', 'suất chiếu', 'khung giờ', 'mấy giờ mở', 'mấy giờ đóng',
  // Rủi ro & Trạng thái hoạt động
  'có đang mở cửa', 'có mở cửa', 'đang mở cửa', 'đang đóng cửa', 'tạm đóng',
  'tạm dừng', 'tạm ngưng', 'ngưng hoạt động', 'tu sửa', 'bảo trì',
  'cấm đường', 'sạt lở', 'ngập lụt', 'thời tiết hôm nay', 'thời tiết', 'bão', 'mưa bão',
  'quy định mới', 'lưu ý mới',
  // Quy mô & Sức chứa
  'quy mô', 'sức chứa', 'diện tích',
  // Yếu tố thời gian thực & cập nhật
  'hôm nay', 'hiện nay', 'mới nhất', 'năm nay', 'cập nhật mới', '2025', '2026',
];

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);
  readonly DISCLAIMER_NOTE = DISCLAIMER_NOTE;

  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
    private readonly geminiService: GeminiService,
  ) {}

  /**
   * Bộ định tuyến ý định thông minh (Intelligent Knowledge Router):
   * Phân loại câu hỏi sang Tri Thức CSDL Nội Bộ (Evergreen) hoặc Live Web Search Agent (Dynamic/Real-time)
   */
  classifyQueryIntent(question: string): QueryIntent {
    const normalized = question.toLowerCase();
    const matched = DYNAMIC_KEYWORDS.filter((k) => normalized.includes(k));

    if (matched.length > 0) {
      return {
        mode: 'live_web',
        reason: `Phát hiện truy vấn số liệu / trạng thái thời gian thực (${matched.slice(0, 3).join(', ')})`,
        matchedKeywords: matched,
      };
    }

    return {
      mode: 'internal',
      reason: 'Truy vấn tri thức lịch sử, văn hóa, ẩm thực hoặc thông tin du lịch bền vững',
      matchedKeywords: [],
    };
  }

  /**
   * Entity Grounding: Tìm kiếm đối soát thông tin địa danh trong bảng `places` của CSDL
   */
  async findEntityContext(question: string): Promise<string | undefined> {
    try {
      const cleanQ = question.toLowerCase();
      const places = await this.prisma.place.findMany({
        select: {
          id: true,
          name: true,
          province: true,
          priceEstimate: true,
          categories: true,
        },
      });

      const matched = places.filter((p) => {
        const pNameLower = p.name.toLowerCase();
        return cleanQ.includes(pNameLower);
      });

      if (matched.length === 0) return undefined;

      return matched
        .slice(0, 3)
        .map(
          (p) =>
            `- Địa điểm: ${p.name} (${p.province || 'Việt Nam'})\n  + Giá vé niêm yết trong CSDL nội bộ: ${
              p.priceEstimate > 0 ? p.priceEstimate.toLocaleString('vi-VN') + ' VNĐ' : 'Miễn phí vé vào'
            }\n  + Phân loại: ${p.categories.join(', ')}`,
        )
        .join('\n');
    } catch (err) {
      this.logger.debug('Lỗi Entity Grounding:', err);
      return undefined;
    }
  }

  /**
   * Tìm kiếm các chunks ngữ cảnh có độ tương đồng cao nhất với câu hỏi trong PostgreSQL pgvector
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
   * Tạo prompt RAG tri thức nội bộ kết hợp ngữ cảnh vector search
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
   * Tạo prompt cho Agent Tìm kiếm Trực tuyến Thời gian thực (Live Web Search Agent)
   */
  buildLiveWebSearchPrompt(question: string, entityContext?: string): string {
    return `Bạn là "Agent Kiểm Chứng Du Lịch Thông Minh" (Real-time Travel Verification Agent) của Việt Nam.
Nhiệm vụ của bạn là tra cứu và cung cấp thông tin số liệu thực tế chính xác nhất (giá vé, giờ mở cửa, trạng thái hoạt động) tính đến năm 2026.

HỆ THỐNG NGUỒN ĐƯỢC ƯU TIÊN KIỂM CHỨNG:
1. Website chính thức của Ban quản lý & Cổng thông tin Sở Du Lịch (ví dụ: dinhdoclap.gov.vn, banahills.sunworld.vn, vinwonders.com, vietnamtourism.gov.vn, dulichdanang.gov.vn, sodulich.hanoi.gov.vn...).
2. Báo chí chính thống lớn của Việt Nam: Chuyên mục Du lịch/Thời sự của VnExpress (vnexpress.net/du-lich), Báo Tuổi Trẻ (tuoitre.vn), Báo Thanh Niên, Báo Du Lịch Việt Nam.
3. Cổng niêm yết vé du lịch chính thống: Klook, Traveloka, MoMo Travel (nơi cập nhật giá vé bán thực tế theo ngày).

RÀO CHẮN LỌC NGUỒN & QUY TẮC PHẢN HỒI (Source Guardrail Directive):
1. BẮT BUỘC ưu tiên thông tin cập nhật gần nhất (năm 2025 - 2026).
2. KHÔNG sử dụng thông tin từ blog cá nhân không ghi ngày tháng hoặc các diễn đàn không kiểm chứng.
3. Luôn trích dẫn rõ ràng nguồn web hoặc đường link kiểm chứng trong câu trả lời dưới định dạng liên kết Markdown có thể click: [Tên nguồn/website](URL).
4. Phân tách rõ các loại giá vé (nếu có): vé người lớn, vé trẻ em, vé combo, cáp treo, phụ thu ngày lễ.
5. Nếu là trạng thái đóng/mở cửa hoặc cấm đường, hãy nêu rõ khung giờ áp dụng hoặc lưu ý an toàn.

${entityContext ? `THÔNG TIN THAM CHIẾU NIÊM YẾT TỪ CSDL NỘI BỘ (Entity Grounding):\n${entityContext}\n` : ''}

CÂU HỎI CỦA NGƯỜI DÙNG:
${question}

CÂU TRẢ LỜI CỦA AGENT:`;
  }

  /**
   * Xử lý câu hỏi và stream phản hồi kèm danh sách nguồn trích dẫn kép (Dual-Mode SSE Stream)
   */
  async *streamRagAnswer(question: string): AsyncGenerator<{
    type: 'routing' | 'sources' | 'token' | 'done';
    data: any;
  }> {
    this.logger.log(`Bắt đầu xử lý truy vấn RAG kép cho: "${question}"`);
    const intent = this.classifyQueryIntent(question);
    this.logger.log(`Bộ định tuyến ý định: mode=${intent.mode} (${intent.reason})`);

    // 1. Gửi metadata routing về client
    yield {
      type: 'routing',
      data: {
        mode: intent.mode,
        reason: intent.reason,
        disclaimer: intent.mode === 'live_web' ? this.DISCLAIMER_NOTE : undefined,
      },
    };

    if (intent.mode === 'internal') {
      // --- CHẾ ĐỘ 1: TRI THỨC NỘI BỘ (Evergreen Vector Retrieval) ---
      const sources = await this.searchSimilarChunks(question, 5);

      const sourcesPayload: RagSourcesPayload = {
        mode: 'internal',
        items: sources.map((s) => ({
          id: s.id,
          chunk_type: s.chunk_type,
          title: s.metadata?.title || 'Du lịch Việt Nam',
          content: s.content,
          similarity: Number(s.similarity),
          metadata: s.metadata,
        })),
        webSources: [],
        disclaimer: null,
      };

      yield {
        type: 'sources',
        data: sourcesPayload,
      };

      const prompt = this.buildRagPrompt(question, sources);
      for await (const token of this.geminiService.generateAnswerStream(prompt)) {
        yield {
          type: 'token',
          data: token,
        };
      }
    } else {
      // --- CHẾ ĐỘ 2: AGENT TÌM KIẾM TRỰC TUYẾN (Live Web Search Agent) ---
      const entityContext = await this.findEntityContext(question);
      const prompt = this.buildLiveWebSearchPrompt(question, entityContext);

      let webSources: WebGroundingSource[] = [];

      for await (const chunk of this.geminiService.generateAnswerStreamWithGrounding(prompt, {
        enableGoogleSearch: true,
      })) {
        if (chunk.type === 'token') {
          yield {
            type: 'token',
            data: chunk.data,
          };
        } else if (chunk.type === 'grounding') {
          webSources = chunk.data || [];
        }
      }

      const sourcesPayload: RagSourcesPayload = {
        mode: 'live_web',
        items: [],
        webSources,
        disclaimer: this.DISCLAIMER_NOTE,
      };

      yield {
        type: 'sources',
        data: sourcesPayload,
      };
    }

    // Kết thúc stream
    yield {
      type: 'done',
      data: true,
    };
  }

  /**
   * Xử lý câu hỏi trả về dạng JSON hoàn chỉnh (non-streaming)
   */
  async getRagAnswer(question: string) {
    const intent = this.classifyQueryIntent(question);

    if (intent.mode === 'internal') {
      const sources = await this.searchSimilarChunks(question, 5);
      const prompt = this.buildRagPrompt(question, sources);
      const answer = await this.geminiService.generateAnswer(prompt);

      return {
        question,
        answer,
        mode: 'internal' as const,
        routerReason: intent.reason,
        disclaimer: null,
        sources: sources.map((s) => ({
          id: s.id,
          chunk_type: s.chunk_type,
          title: s.metadata?.title || 'Du lịch Việt Nam',
          content: s.content,
          similarity: Number(s.similarity),
          metadata: s.metadata,
        })),
        webSources: [],
      };
    } else {
      const entityContext = await this.findEntityContext(question);
      const prompt = this.buildLiveWebSearchPrompt(question, entityContext);
      const result = await this.geminiService.generateAnswerWithGrounding(prompt, {
        enableGoogleSearch: true,
      });

      return {
        question,
        answer: result.text,
        mode: 'live_web' as const,
        routerReason: intent.reason,
        disclaimer: this.DISCLAIMER_NOTE,
        sources: [],
        webSources: result.groundingSources,
      };
    }
  }
}
