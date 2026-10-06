import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { ADVANCED_QA_PART1 } from './qa_advanced_topics_part1';
import { ADVANCED_QA_PART2 } from './qa_advanced_topics_part2';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

function getTopicName(id: string): string {
  if (id.startsWith('qa_route_')) return 'Tuyến cung đường liên tỉnh & Lộ trình kết hợp';
  if (id.startsWith('qa_cost_')) return 'Dự toán chi phí, Ngân sách & Bảng giá vé';
  if (id.startsWith('qa_style_')) return 'Du lịch theo đối tượng & Phong cách';
  if (id.startsWith('qa_stay_')) return 'Cẩm nang lưu trú & Trải nghiệm nghỉ dưỡng';
  if (id.startsWith('qa_tip_')) return 'Mẹo bản địa, An toàn đèo dốc & Quy tắc ứng xử';
  return 'Chủ đề chuyên sâu';
}

async function seedAdvancedTopics() {
  const startTime = Date.now();
  console.log('=== BẮT ĐẦU SEED 5 CHỦ ĐỀ DU LỊCH CHUYÊN SÂU (200 CẶP QA) ===\n');

  try {
    await prisma.$connect();
    console.log('✅ Đã kết nối cơ sở dữ liệu PostgreSQL!');

    // 1. Tổng hợp dữ liệu
    const allQA = [...ADVANCED_QA_PART1, ...ADVANCED_QA_PART2];

    console.log(`📊 Tổng số cặp QA đã chuẩn bị: ${allQA.length}`);

    // Phân loại theo chủ đề
    const topicStats: Record<string, number> = {};
    for (const item of allQA) {
      const topic = getTopicName(item.id);
      topicStats[topic] = (topicStats[topic] || 0) + 1;
    }

    console.log('\nThống kê theo 5 chủ đề:');
    for (const [topic, count] of Object.entries(topicStats)) {
      console.log(` - ${topic}: ${count} câu`);
    }

    // 2. Tải mô hình embedding Xenova/bge-m3
    console.log('\n⏳ Đang khởi tạo mô hình Xenova/bge-m3 (q8)...');
    const { pipeline } = await (eval('import("@huggingface/transformers")') as Promise<any>);
    const extractor = await pipeline('feature-extraction', 'Xenova/bge-m3', {
      dtype: 'q8',
    });
    console.log('✅ Mô hình BGE-M3 (q8) đã sẵn sàng!\n');

    // 3. Xử lý batching và nạp vào DB
    const BATCH_SIZE = 16;
    const total = allQA.length;
    let processed = 0;

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = allQA.slice(i, i + BATCH_SIZE);
      const texts = batch.map(
        (item) => `Tiêu đề: ${item.title}\nCâu hỏi: ${item.question}\nCâu trả lời: ${item.answer}`
      );

      // Sinh embedding
      const output = await extractor(texts, {
        pooling: 'cls',
        normalize: true,
      });

      const [batchCount, dim] = output.dims;
      const flatData = output.data;

      // Lưu từng chunk vào database
      for (let j = 0; j < batchCount; j++) {
        const item = batch[j];
        const topic = getTopicName(item.id);
        const content = `Tiêu đề: ${item.title}\nCâu hỏi: ${item.question}\nCâu trả lời: ${item.answer}`;
        const metadata = {
          qa_id: item.id,
          title: item.title,
          question: item.question,
          answers: [item.answer],
          province: item.province,
          topic: topic,
          source_file: 'seed_advanced_topics',
        };

        const start = j * dim;
        const end = start + dim;
        const vectorArray = Array.from(flatData.slice(start, end));
        const vectorStr = `[${vectorArray.join(',')}]`;

        await prisma.$executeRaw`
          INSERT INTO tourism_chunks (id, chunk_type, content, embedding, metadata, created_at)
          VALUES (
            ${item.id},
            ${'qa'},
            ${content},
            ${vectorStr}::vector,
            ${JSON.stringify(metadata)}::jsonb,
            NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            content = EXCLUDED.content,
            embedding = EXCLUDED.embedding,
            metadata = EXCLUDED.metadata;
        `;
      }

      processed += batch.length;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `[${processed}/${total}] (${Math.round((processed / total) * 100)}%) Đã nhúng và lưu - ${elapsed}s`
      );
    }

    // 4. Kiểm tra tổng số chunks trong DB
    const countResult: any[] = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM tourism_chunks;
    `;
    const totalInDb = countResult[0]?.total;

    console.log('\n======================================================');
    console.log(`🎉 HOÀN THÀNH NẠP 200 CÂU HỎI CHUYÊN SÂU!`);
    console.log(`⏱️ Thời gian thực thi: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
    console.log(`📈 Tổng số chunks hiện tại trong tourism_chunks: ${totalInDb}`);
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdvancedTopics();
