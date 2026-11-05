import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

export interface WebGroundingSource {
  title: string;
  url: string;
  domain?: string;
}

export interface GenerateOptions {
  enableGoogleSearch?: boolean;
}

export interface GenerateResult {
  text: string;
  groundingSources: WebGroundingSource[];
  searchQueries?: string[];
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private ai: GoogleGenAI | null = null;
  private modelName: string;
  private fallbackModelName: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.modelName = this.configService.get<string>('GEMINI_MODEL', 'gemini-3.5-flash-lite');
    this.fallbackModelName = this.configService.get<string>('GEMINI_FALLBACK_MODEL', 'gemini-3.1-flash-lite');

    if (apiKey && apiKey.trim().length > 0) {
      this.ai = new GoogleGenAI({ apiKey });
      this.logger.log(
        `Google Gemini SDK đã khởi tạo (Model chính: ${this.modelName}, Model dự phòng: ${this.fallbackModelName})`,
      );
    } else {
      this.logger.warn(
        'Chưa cấu hình GEMINI_API_KEY trong .env! Vui lòng cập nhật API key để sử dụng tính năng sinh câu trả lời.',
      );
    }
  }

  isConfigured(): boolean {
    return this.ai !== null;
  }

  /**
   * Helper trích xuất danh sách nguồn Grounding từ GroundingMetadata của Gemini
   */
  private extractSourcesFromMetadata(metadata: any): WebGroundingSource[] {
    if (!metadata) return [];
    const list: WebGroundingSource[] = [];
    const seen = new Set<string>();

    if (Array.isArray(metadata.groundingChunks)) {
      for (const chunk of metadata.groundingChunks) {
        const uri = chunk.web?.uri;
        const title = chunk.web?.title || 'Trang web xác thực';
        if (uri && !seen.has(uri)) {
          seen.add(uri);
          let domain = '';
          try {
            domain = new URL(uri).hostname.replace(/^www\./, '');
          } catch {
            domain = '';
          }
          list.push({ title, url: uri, domain });
        }
      }
    }
    return list;
  }

  /**
   * Helper trích xuất các liên kết markdown [Tiêu đề](URL) từ nội dung câu trả lời
   */
  private extractMarkdownLinks(text: string): WebGroundingSource[] {
    if (!text) return [];
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const list: WebGroundingSource[] = [];
    const seen = new Set<string>();
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(text)) !== null) {
      const title = match[1].trim();
      const url = match[2].trim();
      if (!seen.has(url)) {
        seen.add(url);
        let domain = '';
        try {
          domain = new URL(url).hostname.replace(/^www\./, '');
        } catch {
          domain = '';
        }
        list.push({ title, url, domain });
      }
    }
    return list;
  }

  /**
   * Sinh câu trả lời non-streaming với tùy chọn Google Search Grounding và trích xuất nguồn kiểm chứng
   */
  async generateAnswerWithGrounding(prompt: string, options?: GenerateOptions): Promise<GenerateResult> {
    if (!this.ai) {
      return {
        text: 'Hệ thống chưa được cấu hình GEMINI_API_KEY. Vui lòng thêm GEMINI_API_KEY vào file backend/.env để nhận câu trả lời từ AI.',
        groundingSources: [],
      };
    }

    const useSearch = !!options?.enableGoogleSearch;

    // 1. Nếu yêu cầu Google Search Grounding, thử gọi trước với công cụ googleSearch
    if (useSearch) {
      try {
        const response = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const text = response.text || '';
        const metadata = response.candidates?.[0]?.groundingMetadata;
        const sources = this.extractSourcesFromMetadata(metadata);
        const searchQueries = metadata?.webSearchQueries || [];

        // Nếu có link trong văn bản, bổ sung thêm
        const mdLinks = this.extractMarkdownLinks(text);
        for (const l of mdLinks) {
          if (!sources.some((s) => s.url === l.url)) {
            sources.push(l);
          }
        }

        return {
          text,
          groundingSources: sources,
          searchQueries,
        };
      } catch (searchError: any) {
        this.logger.warn(
          `Google Search Grounding không khả dụng (${searchError?.message || searchError}). Tự động chuyển tiếp sang mô hình tiêu chuẩn...`,
        );
      }
    }

    // 2. Chạy với mô hình chuẩn (kèm cơ chế fallback model)
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
      });

      const text = response.text || 'Không có phản hồi từ mô hình AI.';
      const sources = this.extractMarkdownLinks(text);

      return {
        text,
        groundingSources: sources,
      };
    } catch (error: any) {
      this.logger.warn(
        `Lỗi khi gọi model chính (${this.modelName}): ${error?.message || error}. Đang thử sang model dự phòng (${this.fallbackModelName})...`,
      );

      try {
        const fallbackResponse = await this.ai.models.generateContent({
          model: this.fallbackModelName,
          contents: prompt,
        });

        const text = fallbackResponse.text || 'Không có phản hồi từ mô hình AI.';
        const sources = this.extractMarkdownLinks(text);

        return {
          text,
          groundingSources: sources,
        };
      } catch (fallbackError: any) {
        this.logger.error(`Lỗi cả model dự phòng (${this.fallbackModelName}):`, fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Sinh câu trả lời dạng non-streaming (tương thích ngược)
   */
  async generateAnswer(prompt: string, options?: GenerateOptions): Promise<string> {
    const result = await this.generateAnswerWithGrounding(prompt, options);
    return result.text;
  }

  /**
   * Alias for generateAnswer (for compatibility)
   */
  async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
    return this.generateAnswer(prompt, options);
  }

  /**
   * Sinh câu trả lời dạng streaming (tương thích ngược)
   */
  async *generateAnswerStream(prompt: string, options?: GenerateOptions): AsyncGenerator<string, void, unknown> {
    for await (const chunk of this.generateAnswerStreamWithGrounding(prompt, options)) {
      if (chunk.type === 'token') {
        yield chunk.data;
      }
    }
  }

  /**
   * Sinh câu trả lời dạng streaming có trích xuất grounding sources
   */
  async *generateAnswerStreamWithGrounding(
    prompt: string,
    options?: GenerateOptions,
  ): AsyncGenerator<{ type: 'token' | 'grounding'; data: any }, void, unknown> {
    if (!this.ai) {
      yield {
        type: 'token',
        data: 'Hệ thống chưa được cấu hình GEMINI_API_KEY. Vui lòng thêm GEMINI_API_KEY vào file backend/.env để nhận câu trả lời từ AI.',
      };
      return;
    }

    const useSearch = !!options?.enableGoogleSearch;
    let accumulatedText = '';
    let lastGroundingMetadata: any = null;
    let streamSuccessful = false;

    // 1. Thử stream với Google Search Grounding nếu được yêu cầu
    if (useSearch) {
      try {
        const responseStream = await this.ai.models.generateContentStream({
          model: this.modelName,
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        for await (const chunk of responseStream) {
          if (chunk.candidates?.[0]?.groundingMetadata) {
            lastGroundingMetadata = chunk.candidates[0].groundingMetadata;
          }
          if (chunk.text) {
            accumulatedText += chunk.text;
            yield { type: 'token', data: chunk.text };
          }
        }
        streamSuccessful = true;
      } catch (searchError: any) {
        this.logger.warn(
          `Lỗi stream Google Search Grounding: ${searchError?.message}. Tự động fallback sang stream tiêu chuẩn...`,
        );
      }
    }

    // 2. Fallback stream nếu chưa thành công
    if (!streamSuccessful) {
      const activeModel = this.modelName;
      try {
        const responseStream = await this.ai.models.generateContentStream({
          model: activeModel,
          contents: prompt,
        });

        for await (const chunk of responseStream) {
          if (chunk.text) {
            accumulatedText += chunk.text;
            yield { type: 'token', data: chunk.text };
          }
        }
      } catch (error: any) {
        this.logger.warn(
          `Lỗi streaming model ${activeModel}: ${error?.message}. Thử chuyển model dự phòng ${this.fallbackModelName}...`,
        );
        try {
          const fallbackStream = await this.ai.models.generateContentStream({
            model: this.fallbackModelName,
            contents: prompt,
          });

          for await (const chunk of fallbackStream) {
            if (chunk.text) {
              accumulatedText += chunk.text;
              yield { type: 'token', data: chunk.text };
            }
          }
        } catch (fallbackError: any) {
          this.logger.error('Lỗi khi streaming cả model dự phòng:', fallbackError);
          yield {
            type: 'token',
            data: `\n[Lỗi kết nối Gemini API: ${fallbackError.message || 'Lỗi không xác định'}]`,
          };
        }
      }
    }

    // 3. Trích xuất grounding sources tổng hợp và phát event
    const sources = this.extractSourcesFromMetadata(lastGroundingMetadata);
    const mdLinks = this.extractMarkdownLinks(accumulatedText);
    for (const l of mdLinks) {
      if (!sources.some((s) => s.url === l.url)) {
        sources.push(l);
      }
    }

    yield {
      type: 'grounding',
      data: sources,
    };
  }
}
