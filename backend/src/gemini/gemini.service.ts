import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private ai: GoogleGenAI | null = null;
  private modelName: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.modelName = this.configService.get<string>('GEMINI_MODEL', 'gemini-2.0-flash');

    if (apiKey && apiKey.trim().length > 0) {
      this.ai = new GoogleGenAI({ apiKey });
      this.logger.log(`Google Gemini SDK đã khởi tạo với model: ${this.modelName}`);
    } else {
      this.logger.warn('Chưa cấu hình GEMINI_API_KEY trong .env! Vui lòng cập nhật API key để sử dụng tính năng sinh câu trả lời.');
    }
  }

  isConfigured(): boolean {
    return this.ai !== null;
  }

  /**
   * Sinh câu trả lời dạng non-streaming
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
      this.logger.error('Lỗi khi gọi Gemini API:', error);
      throw error;
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

    try {
      const responseStream = await this.ai.models.generateContentStream({
        model: this.modelName,
        contents: prompt,
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error: any) {
      this.logger.error('Lỗi khi streaming từ Gemini API:', error);
      yield `\n[Lỗi kết nối Gemini API: ${error.message || 'Lỗi không xác định'}]`;
    }
  }
}
