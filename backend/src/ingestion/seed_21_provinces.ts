import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { NORTHERN_QA_DATA } from './qa_data_northern';
import { CENTRAL_HIGHLANDS_QA_DATA } from './qa_data_central_highlands';
import { SOUTHERN_QA_DATA } from './qa_data_southern';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function seed21Provinces() {
  const startTime = Date.now();
  console.log('=== BẮT ĐẦU SEED DỮ LIỆU RAG CHO 21 TỈNH THÀNH (420 CẶP QA) ===\n');

  try {
    await prisma.$connect();
    console.log('✅ Đã kết nối cơ sở dữ liệu PostgreSQL!');

    // 1. Tổng hợp dữ liệu
    const allQA = [
      ...NORTHERN_QA_DATA,
      ...CENTRAL_HIGHLANDS_QA_DATA,
      ...SOUTHERN_QA_DATA,
    ];

    console.log(`📊 Tổng số cặp QA đã chuẩn bị: ${allQA.length} (21 tỉnh x 20 QA)`);

    // Thống kê theo tỉnh
    const provinceCount: Record<string, number> = {};
    for (const item of allQA) {
      provinceCount[item.province] = (provinceCount[item.province] || 0) + 1;
    }
    console.log('Danh sách các tỉnh thành:', Object.keys(provinceCount).join(', '));

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
        const content = `Tiêu đề: ${item.title}\nCâu hỏi: ${item.question}\nCâu trả lời: ${item.answer}`;
        const metadata = {
          qa_id: item.id,
          title: item.title,
          question: item.question,
          answers: [item.answer],
          province: item.province,
          source_file: 'seed_21_provinces',
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
      const percent = ((processed / total) * 100).toFixed(1);
      console.log(`[Tiến độ: ${percent}%] Đã nhúng & nạp ${processed}/${total} QA chunks (${elapsed}s)...`);
    }

    const totalSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n🎉 HOÀN TẤT SEED 21 TỈNH THÀNH! Tổng thời gian: ${totalSeconds}s`);

    // 4. Kiểm tra tổng số bản ghi trong bảng
    const countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM tourism_chunks;
    `;
    const count = Number(countResult[0]?.count || 0);
    console.log(`=> Tổng số chunks hiện tại trong bảng tourism_chunks: ${count}`);

  } catch (error) {
    console.error('❌ Lỗi trong quá trình seed dữ liệu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed21Provinces();
