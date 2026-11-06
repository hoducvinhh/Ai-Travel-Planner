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
    this.modelName = this.configService.get<string>('GEMINI_MODEL', 'gemini-3.5-flash');
    this.fallbackModelName = this.configService.get<string>('GEMINI_FALLBACK_MODEL', 'gemini-3.5-flash-lite');

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
   * Danh sách chuỗi mô hình dự phòng đa tầng (Multi-model resilience fallback)
   */
  private getCandidateModels(): string[] {
    const defaultList = [
      this.modelName,
      this.fallbackModelName,
      'gemini-3.8-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash',
      'gemini-3-flash-preview',
    ];
    return Array.from(new Set(defaultList.filter(Boolean)));
  }

  /**
   * Trích xuất tên nguồn ngắn gọn, trực quan (ví dụ: "VnExpress Du Lịch", "Dinh Độc Lập", "Traveloka")
   */
  getCleanSourceName(title?: string, url?: string): string {
    let domainName = '';
    if (url) {
      try {
        const host = new URL(url).hostname.replace(/^www\./, '');
        const parts = host.split('.');
        if (parts.length >= 2) {
          domainName = parts[0];
        }
      } catch {}
    }

    if (title && title.trim()) {
      const clean = title.trim();
      const parts = clean.split(/\s*[-|–—:•]\s*/).filter((p) => p.trim().length > 0);
      if (parts.length > 1) {
        if (domainName) {
          const matchingPart = parts.find(
            (p) =>
              p.toLowerCase().includes(domainName.toLowerCase()) ||
              domainName.toLowerCase().includes(p.toLowerCase()),
          );
          if (matchingPart && matchingPart.trim().length <= 25) {
            return matchingPart.trim();
          }
        }
        const candidates = parts.filter((p) => p.trim().length >= 3 && p.trim().length <= 25);
        if (candidates.length > 0) {
          return candidates[0].trim();
        }
      }
      if (clean.length <= 25) return clean;
    }

    if (domainName) {
      return domainName.charAt(0).toUpperCase() + domainName.slice(1);
    }

    return 'Nguồn';
  }

  /**
   * Helper gắn inline markdown citations [Tên nguồn](URL) vào cuối các câu/đoạn tương ứng
   * dựa trên metadata groundingSupports từ Google Gemini
   */
  attachGroundingSupports(
    text: string,
    metadata?: any,
    sourcesList?: WebGroundingSource[],
  ): string {
    if (!text || !metadata) return text;
    const supports = metadata.groundingSupports;
    const chunks = metadata.groundingChunks;

    if (!Array.isArray(supports) || supports.length === 0 || !Array.isArray(chunks) || chunks.length === 0) {
      return text;
    }

    // Kiểm tra các URL đã có trong text dạng markdown link [Title](url)
    const existingMdUrls = new Set(
      this.extractMarkdownLinks(text).map((s) => s.url.toLowerCase().replace(/\/+$/, '')),
    );

    let resultText = text;

    for (const support of supports) {
      const segmentText = support.segment?.text?.trim();
      if (!segmentText) continue;

      const chunkIndices: number[] = support.groundingChunkIndices || [];
      if (chunkIndices.length === 0) continue;

      // Gom danh sách link duy nhất cho segment này
      const segmentUrls: Array<{ title: string; url: string }> = [];
      const seenInSegment = new Set<string>();

      for (const idx of chunkIndices) {
        const chunk = chunks[idx];
        const uri = chunk?.web?.uri;
        if (!uri) continue;
        const normUri = uri.toLowerCase().replace(/\/+$/, '');
        if (seenInSegment.has(normUri)) continue;
        seenInSegment.add(normUri);

        const title = this.getCleanSourceName(chunk?.web?.title, uri);
        segmentUrls.push({ title, url: uri });
      }

      // Chỉ chèn nếu URL chưa được xuất hiện trong text
      const urlsToInsert = segmentUrls.filter((s) => {
        const norm = s.url.toLowerCase().replace(/\/+$/, '');
        return !existingMdUrls.has(norm);
      });

      if (urlsToInsert.length === 0) continue;

      const citationString = urlsToInsert
        .map((s) => `[${s.title}](${s.url})`)
        .join(' ');

      const segIndex = resultText.indexOf(segmentText);
      if (segIndex !== -1) {
        let endOfSeg = segIndex + segmentText.length;
        // Nếu ngay sau đó là dấu câu (. hoặc , hoặc ! hoặc ?), chèn sau dấu câu
        while (
          endOfSeg < resultText.length &&
          (resultText[endOfSeg] === '.' ||
            resultText[endOfSeg] === ',' ||
            resultText[endOfSeg] === '!' ||
            resultText[endOfSeg] === '?')
        ) {
          endOfSeg++;
        }

        resultText =
          resultText.slice(0, endOfSeg) +
          ' ' +
          citationString +
          resultText.slice(endOfSeg);

        for (const u of urlsToInsert) {
          existingMdUrls.add(u.url.toLowerCase().replace(/\/+$/, ''));
        }
      }
    }

    return resultText;
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
      for (const model of this.getCandidateModels().slice(0, 2)) {
        try {
          const response = await this.ai.models.generateContent({
            model,
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

          const enhancedText = this.attachGroundingSupports(text, metadata, sources);

          return {
            text: enhancedText,
            groundingSources: sources,
            searchQueries,
          };
        } catch (searchError: any) {
          const isQuota = searchError?.status === 429 || `${searchError?.message}`.includes('429') || `${searchError?.message}`.includes('quota');
          this.logger.warn(
            `Google Search Grounding trên ${model} không khả dụng (${searchError?.status || searchError?.message})...`,
          );
          if (isQuota) break;
        }
      }
    }

    // 2. Chạy với chuỗi mô hình dự phòng (Multi-model resilience fallback)
    for (const model of this.getCandidateModels()) {
      try {
        const response = await this.ai.models.generateContent({
          model,
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
          `Model ${model} tạm thời không khả dụng (${error?.status || error?.message}). Đang chuyển sang model tiếp theo trong chuỗi...`,
        );
      }
    }

    return {
      text: 'Hệ thống AI hiện đang chịu tải cao tạm thời từ máy chủ Google. Vui lòng thử lại sau giây lát.',
      groundingSources: [],
    };
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
   * Sinh câu trả lời dạng streaming có trích xuất grounding sources với cơ chế đa model dự phòng
   */
  async *generateAnswerStreamWithGrounding(
    prompt: string,
    options?: GenerateOptions,
  ): AsyncGenerator<{ type: 'token' | 'grounding' | 'content_update'; data: any }, void, unknown> {
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
      for (const model of this.getCandidateModels().slice(0, 2)) {
        try {
          const responseStream = await this.ai.models.generateContentStream({
            model,
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
          break;
        } catch (searchError: any) {
          const isQuota = searchError?.status === 429 || `${searchError?.message}`.includes('429') || `${searchError?.message}`.includes('quota');
          this.logger.warn(
            `Google Search Grounding trên ${model} không khả dụng (${searchError?.status || searchError?.message})...`,
          );
          if (isQuota) break;
        }
      }
    }

    // 2. Fallback stream qua chuỗi candidate models nếu chưa thành công
    if (!streamSuccessful) {
      for (const model of this.getCandidateModels()) {
        try {
          const responseStream = await this.ai.models.generateContentStream({
            model,
            contents: prompt,
          });

          for await (const chunk of responseStream) {
            if (chunk.text) {
              accumulatedText += chunk.text;
              yield { type: 'token', data: chunk.text };
            }
          }
          streamSuccessful = true;
          break;
        } catch (error: any) {
          this.logger.warn(
            `Lỗi streaming trên model ${model}: ${error?.status || error?.message}. Đang thử model tiếp theo...`,
          );
        }
      }

      if (!streamSuccessful) {
        this.logger.error('Toàn bộ các model AI trong chuỗi dự phòng đều không phản hồi.');
        yield {
          type: 'token',
          data: '\n[Hệ thống AI hiện đang chịu tải cao tạm thời từ Google Cloud. Vui lòng gửi lại câu hỏi sau giây lát.]',
        };
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

    // 4. Nếu có groundingSupports mà text chưa chèn link, bổ sung link vào text
    const enhancedText = this.attachGroundingSupports(accumulatedText, lastGroundingMetadata, sources);
    if (enhancedText !== accumulatedText) {
      yield {
        type: 'content_update',
        data: enhancedText,
      };
    }

    yield {
      type: 'grounding',
      data: sources,
    };
  }
}
