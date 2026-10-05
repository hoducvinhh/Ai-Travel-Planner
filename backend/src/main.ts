import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Cho phép CORS cho frontend Next.js (port 3000 & 3001)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];
  if (process.env.CORS_ORIGIN && !allowedOrigins.includes(process.env.CORS_ORIGIN)) {
    allowedOrigins.push(process.env.CORS_ORIGIN);
  }

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  });

  // Đăng ký bộ lọc xử lý exception toàn cục
  app.useGlobalFilters(new AllExceptionsFilter());

  // Kích hoạt DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Cấu hình Swagger API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AI Travel Planner API')
    .setDescription('Tài liệu API cho Hệ thống Lập kế hoạch Chuyến đi AI (NestJS RAG Backend)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`🚀 NestJS RAG Backend đang chạy tại http://localhost:${port}`);
  logger.log(`📑 Swagger Documentation: http://localhost:${port}/api/docs (hoặc /docs)`);
}

bootstrap();
