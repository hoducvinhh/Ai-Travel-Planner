import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  console.log('--- Kiểm tra bảng ChatSession và ChatMessage ---');
  // 1. Tạo session mẫu
  const session = await prisma.chatSession.create({
    data: {
      title: 'Hỏi về du lịch Sa Pa',
    },
  });
  console.log('1. Đã tạo session:', session.id, session.title);

  // 2. Thêm tin nhắn user
  const userMsg = await prisma.chatMessage.create({
    data: {
      sessionId: session.id,
      role: 'user',
      content: 'Sa Pa mùa nào lúa chín vàng?',
    },
  });
  console.log('2. Đã lưu user message:', userMsg.id);

  // 3. Thêm tin nhắn bot kèm sources
  const botMsg = await prisma.chatMessage.create({
    data: {
      sessionId: session.id,
      role: 'assistant',
      content: 'Sa Pa mùa lúa chín vàng đẹp nhất vào khoảng tháng 9 đến tháng 10 hàng năm.',
      sources: [{ title: 'Sa Pa ruộng bậc thang', similarity: 0.85, chunk_type: 'context' }],
    },
  });
  console.log('3. Đã lưu assistant message kèm sources:', botMsg.id);

  // 4. Lấy chi tiết session
  const detail = await prisma.chatSession.findUnique({
    where: { id: session.id },
    include: { messages: true },
  });
  console.log('4. Truy vấn lại session thành công, số lượng messages:', detail?.messages.length);

  // 5. Dọn dẹp bản ghi test
  await prisma.chatSession.delete({ where: { id: session.id } });
  console.log('5. Đã dọn dẹp bản ghi test (cascade delete hoạt động tốt).');
  await prisma.$disconnect();
}

run().catch((e) => {
  console.error('Lỗi kiểm thử:', e);
  process.exit(1);
});
