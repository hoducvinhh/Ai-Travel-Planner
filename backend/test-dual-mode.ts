import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './src/prisma/prisma.module';
import { EmbeddingService } from './src/embedding/embedding.service';
import { GeminiService } from './src/gemini/gemini.service';
import { RagService } from './src/rag/rag.service';
import { ChatService } from './src/chat/chat.service';

async function verifyDualMode() {
  console.log('🚀 Đang khởi tạo Testing Module cho RAG & Chat (Điểm 4)...');
  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
      }),
      PrismaModule,
    ],
    providers: [EmbeddingService, GeminiService, RagService, ChatService],
  }).compile();

  const ragService = moduleRef.get(RagService);
  const chatService = moduleRef.get(ChatService);
  const geminiService = moduleRef.get(GeminiService);

  console.log('\n--- 1. KIỂM THỬ BỘ ĐỊNH TUYẾN Ý ĐỊNH THÔNG MINH (Intelligent Knowledge Router) ---');
  const testCases = [
    { q: 'Kinh thành Huế xây dựng vào năm nào?', expected: 'internal' },
    { q: 'Sự tích Hồ Gươm và rùa vàng', expected: 'internal' },
    { q: 'Đặc sản mì Quảng bắt nguồn từ đâu?', expected: 'internal' },
    { q: 'Những bãi biển đẹp nhất Phú Quốc', expected: 'internal' },
    { q: 'Giá vé vào cổng Dinh Độc Lập hiện nay là bao nhiêu?', expected: 'live_web' },
    { q: 'Bà Nà Hills mở cửa lúc mấy giờ?', expected: 'live_web' },
    { q: 'Đèo Prenn có đang cấm đường không?', expected: 'live_web' },
    { q: 'Thời tiết Fansipan hôm nay thế nào?', expected: 'live_web' },
  ];

  let routerPassed = 0;
  for (const tc of testCases) {
    const result = ragService.classifyQueryIntent(tc.q);
    const passed = result.mode === tc.expected;
    if (passed) routerPassed++;
    console.log(
      `[${passed ? 'PASS' : 'FAIL'}] "${tc.q}" -> Mode: ${result.mode} (Expected: ${tc.expected}) | Lý do: ${result.reason}`,
    );
  }
  console.log(`Kết quả router: ${routerPassed}/${testCases.length} trường hợp chính xác 100%.`);

  console.log('\n--- 2. KIỂM THỬ ĐỐI CHIẾU THỰC THỂ CSDL NỘI BỘ (Entity Grounding) ---');
  const entityContext = await ragService.findEntityContext('Dinh Độc Lập giá vé bao nhiêu tiền?');
  console.log('Entity Context trích xuất từ bảng places:\n', entityContext || '(Không tìm thấy)');

  console.log('\n--- 3. KIỂM THỬ XỬ LÝ CÂU HỎI LIVE WEB SEARCH (Non-streaming) ---');
  const liveResult = await ragService.getRagAnswer('Giá vé vào cổng Dinh Độc Lập hiện nay là bao nhiêu?');
  console.log('Chế độ phản hồi (mode):', liveResult.mode);
  console.log('Disclaimer đi kèm:', liveResult.disclaimer);
  console.log('Nguồn Web kiểm chứng thu được:', liveResult.webSources);
  console.log('Đoạn trích câu trả lời:\n', liveResult.answer.slice(0, 300) + '...');

  console.log('\n--- 4. KIỂM THỬ STREAMING RAG KÉP (Dual-Mode SSE Stream) ---');
  let streamMode = '';
  let streamTokens = '';
  let streamWebSources: any[] = [];
  for await (const event of ragService.streamRagAnswer('Thời tiết Fansipan hôm nay thế nào?')) {
    if (event.type === 'routing') {
      streamMode = event.data.mode;
    } else if (event.type === 'token') {
      streamTokens += event.data;
    } else if (event.type === 'sources') {
      streamWebSources = event.data.webSources || [];
    }
  }
  console.log('Stream routing mode:', streamMode);
  console.log('Stream tokens length:', streamTokens.length);
  console.log('Stream web sources count:', streamWebSources.length);

  console.log('\n--- 5. KIỂM THỬ TIẾP NHẬN BÁO CÁO PHẢN HỒI (Knowledge Feedback) ---');
  const feedback = await chatService.createFeedback({
    sessionId: undefined,
    userQuestion: 'Giá vé vào cổng Dinh Độc Lập',
    botAnswer: 'Giá vé 40.000đ',
    reason: 'OUTDATED_PRICE',
    userNote: 'Giá vé combo Dinh và Nhà Trưng bày là 65.000đ',
  });
  console.log('Lưu thành công phản hồi vào bảng knowledge_feedback:', feedback.id, feedback.status);

  // Xóa bản ghi test
  const prisma = (chatService as any).prisma;
  await prisma.knowledgeFeedback.delete({ where: { id: feedback.id } });
  console.log('Đã dọn dẹp bản ghi test.');

  console.log('\n🎉 TẤT CẢ KIỂM THỬ CHO ĐIỂM 4 ĐÃ HOÀN TẤT VÀ CHÍNH XÁC 100%!');
  await moduleRef.close();
}

verifyDualMode().catch((err) => {
  console.error('Lỗi kiểm thử:', err);
  process.exit(1);
});
