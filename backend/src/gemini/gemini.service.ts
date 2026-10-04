import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

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
      this.logger.log(`Google Gemini SDK đã khởi tạo (Model chính: ${this.modelName}, Model dự phòng: ${this.fallbackModelName})`);
    } else {
      this.logger.warn('Chưa cấu hình GEMINI_API_KEY trong .env! Vui lòng cập nhật API key để sử dụng tính năng sinh câu trả lời.');
    }
  }

  isConfigured(): boolean {
    return this.ai !== null;
  }

  /**
   * Sinh câu trả lời dạng non-streaming với tự động chuyển đổi sang model dự phòng
   */
  async generateAnswer(prompt: string): Promise<string> {
    if (!this.ai) {
      return 'Hệ thống chưa được cấu hình GEMINI_API_KEY. Vui lòng thêm GEMINI_API_KEY vào file backend/.env để nhận câu trả lời từ AI.';
    }

    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
      });

      return response.text || 'Không có phản hồi từ mô hình AI.';
    } catch (error: any) {
      this.logger.warn(`Lỗi khi gọi model chính (${this.modelName}): ${error?.message || error}. Đang tự động thử sang model dự phòng (${this.fallbackModelName})...`);
      
      try {
        const fallbackResponse = await this.ai.models.generateContent({
          model: this.fallbackModelName,
          contents: prompt,
        });
        return fallbackResponse.text || 'Không có phản hồi từ mô hình AI.';
      } catch (fallbackError: any) {
        this.logger.error(`Lỗi cả model dự phòng (${this.fallbackModelName}):`, fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Alias for generateAnswer (for compatibility)
   */
  async generateText(prompt: string): Promise<string> {
    return this.generateAnswer(prompt);
  }

  /**
   * Sinh câu trả lời dạng streaming
   */
  async *generateAnswerStream(prompt: string): AsyncGenerator<string, void, unknown> {
    if (!this.ai) {
      yield 'Hệ thống chưa được cấu hình GEMINI_API_KEY. Vui lòng thêm GEMINI_API_KEY vào file backend/.env để nhận câu trả lời từ AI.';
      return;
    }

    let activeModel = this.modelName;
    try {
      const responseStream = await this.ai.models.generateContentStream({
        model: activeModel,
        contents: prompt,
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error: any) {
      this.logger.warn(`Lỗi streaming model ${activeModel}: ${error?.message}. Thử chuyển model dự phòng ${this.fallbackModelName}...`);
      try {
        const fallbackStream = await this.ai.models.generateContentStream({
          model: this.fallbackModelName,
          contents: prompt,
        });

        for await (const chunk of fallbackStream) {
          if (chunk.text) {
            yield chunk.text;
          }
        }
      } catch (fallbackError: any) {
        this.logger.error('Lỗi khi streaming cả model dự phòng:', fallbackError);
        yield `\n[Lỗi kết nối Gemini API: ${fallbackError.message || 'Lỗi không xác định'}]`;
      }
    }
  }
}
