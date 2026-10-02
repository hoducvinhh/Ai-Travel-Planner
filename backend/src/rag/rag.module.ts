import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  providers: [RagService],
  exports: [RagService],
})
export class RagModule {}
