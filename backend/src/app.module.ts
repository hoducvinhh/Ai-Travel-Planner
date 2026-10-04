import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { EmbeddingModule } from './embedding/embedding.module';
import { GeminiModule } from './gemini/gemini.module';
import { RagModule } from './rag/rag.module';
import { ChatModule } from './chat/chat.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { TripsModule } from './trips/trips.module';
import { InteractionsModule } from './interactions/interactions.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlacesModule } from './places/places.module';
import { CommentsModule } from './comments/comments.module';
import { CommunityModule } from './community/community.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    PrismaModule,
    EmbeddingModule,
    GeminiModule,
    RagModule,
    ChatModule,
    RecommendationModule,
    TripsModule,
    InteractionsModule,
    AuthModule,
    UsersModule,
    PlacesModule,
    CommentsModule,
    CommunityModule,
  ],
})
export class AppModule {}
