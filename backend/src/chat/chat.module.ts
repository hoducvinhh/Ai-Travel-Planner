import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { RagModule } from '../rag/rag.module';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [RagModule, GeminiModule],
  controllers: [ChatController],
})
export class ChatModule {}
