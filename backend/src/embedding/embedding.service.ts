import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(EmbeddingService.name);
  private extractor: any = null;
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;

  async onModuleInit() {
    // Khởi tạo mô hình trong background để server NestJS khởi động ngay lập tức
    this.initModel().catch((err) => {
      this.logger.error('Lỗi khi tải mô hình Xenova/bge-m3 trong background:', err);
    });
  }

  async initModel(): Promise<void> {
    if (this.extractor) return;
    if (this.isInitializing && this.initPromise) {
      return this.initPromise;
    }

    this.isInitializing = true;
    this.initPromise = (async () => {
      this.logger.log('Khởi tạo mô hình BAAI/bge-m3 local (Xenova/bge-m3)...');
      try {
        const { pipeline } = await (eval('import("@huggingface/transformers")') as Promise<any>);
        this.extractor = await pipeline('feature-extraction', 'Xenova/bge-m3', {
          dtype: 'q8',
        });
        this.logger.log('Mô hình BAAI/bge-m3 (q8) đã sẵn sàng!');
      } catch (error) {
        this.logger.error('Lỗi khi tải mô hình embedding Xenova/bge-m3:', error);
        throw error;
      } finally {
        this.isInitializing = false;
      }
    })();

    return this.initPromise;
  }

  /**
   * Tạo vector nhúng 1024 chiều cho một đoạn văn bản đơn
   */
  async embed(text: string): Promise<number[]> {
    await this.initModel();
    const cleanText = text.trim();
    const output = await this.extractor(cleanText, {
      pooling: 'cls',
      normalize: true,
    });
    return Array.from(output.data);
  }

  /**
   * Tạo vector nhúng cho danh sách các đoạn văn bản theo batch
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    await this.initModel();
    if (texts.length === 0) return [];

    const cleanTexts = texts.map((t) => t.trim());
    const output = await this.extractor(cleanTexts, {
      pooling: 'cls',
      normalize: true,
    });

    const [batchSize, dim] = output.dims;
    const result: number[][] = [];
    const flatData = output.data;

    for (let i = 0; i < batchSize; i++) {
      const start = i * dim;
      const end = start + dim;
      result.push(Array.from(flatData.slice(start, end)));
    }

    return result;
  }

  isReady(): boolean {
    return this.extractor !== null;
  }
}
