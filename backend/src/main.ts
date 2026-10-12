import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Cho phép CORS cho frontend Next.js (hỗ trợ linh hoạt các port localhost: 3000, 3001, 3002, 3003...)
  app.enableCors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (curl, mobile app) hoặc bất kỳ origin localhost / 127.0.0.1 nào
      if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      if (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN) {
        return callback(null, true);
      }
      return callback(null, true);
    },
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
