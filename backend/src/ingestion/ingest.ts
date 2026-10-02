import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

interface QAPair {
  id: string;
  question: string;
  answers: Array<{ text: string; answer_start: number }>;
}

interface Paragraph {
  context: string;
  qas: QAPair[];
}

interface Article {
  title: string;
  paragraphs: Paragraph[];
}

interface DatasetFile {
  data: Article[];
}

interface ChunkItem {
  id: string;
  chunkType: 'context' | 'qa';
  content: string;
  metadata: Record<string, any>;
}

async function loadDatasetFiles(): Promise<ChunkItem[]> {
  const datasetsDir = path.resolve(__dirname, '../../../datasets');
  const files = ['train_vietnam_tourism.json', 'valid_vietnam_tourism.json'];

  const contextMap = new Map<string, ChunkItem>();
  const qaMap = new Map<string, ChunkItem>();

  let contextCounter = 0;

  for (const filename of files) {
    const filePath = path.join(datasetsDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`[Cảnh báo] Không tìm thấy file: ${filePath}`);
      continue;
    }

    console.log(`Đang đọc file: ${filename}...`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsed: DatasetFile = JSON.parse(rawData);

    for (let artIdx = 0; artIdx < parsed.data.length; artIdx++) {
      const article = parsed.data[artIdx];
      const title = article.title.trim();

      for (let pIdx = 0; pIdx < article.paragraphs.length; pIdx++) {
        const p = article.paragraphs[pIdx];
        const context = p.context.trim();

        // 1. Tạo Context Chunk ({title, context})
        const contextKey = `${title}:::${context}`;
        if (!contextMap.has(contextKey)) {
          contextCounter++;
          const chunkId = `ctx_${artIdx}_${pIdx}_${contextCounter}`;
          const content = `Tiêu đề: ${title}\nNội dung: ${context}`;
          contextMap.set(contextKey, {
            id: chunkId,
            chunkType: 'context',
            content,
            metadata: {
              title,
              source_file: filename,
              article_idx: artIdx,
              paragraph_idx: pIdx,
              qas_count: p.qas?.length || 0,
            },
          });
        }

        // 2. Tạo QA Chunks ({question, answers})
        if (p.qas && Array.isArray(p.qas)) {
          for (const qa of p.qas) {
            const qaId = qa.id.trim();
            const question = qa.question.trim();
            const answers = (qa.answers || []).map((a) => a.text.trim());

            if (!qaMap.has(qaId)) {
              const content = `Tiêu đề: ${title}\nCâu hỏi: ${question}\nCâu trả lời: ${answers.join('; ')}`;
              qaMap.set(qaId, {
                id: qaId,
                chunkType: 'qa',
                content,
                metadata: {
                  qa_id: qaId,
                  title,
                  question,
                  answers,
                  source_file: filename,
                },
              });
            }
          }
        }
      }
    }
  }

  const allChunks = [...contextMap.values(), ...qaMap.values()];
  console.log(`=> Đã trích xuất thành công:`);
  console.log(`   - Context chunks: ${contextMap.size}`);
  console.log(`   - QA chunks: ${qaMap.size}`);
  console.log(`   - Tổng cộng: ${allChunks.length} chunks`);

  return allChunks;
}

async function ingest() {
  const startTime = Date.now();
  console.log('=== BẮT ĐẦU QUÁ TRÌNH NẠP DỮ LIỆU RAG VÀO POSTGRESQL PGVECTOR ===\n');

  try {
    await prisma.$connect();
    console.log('Đã kết nối PostgreSQL thành công!');

    // 1. Đọc và tạo danh sách chunks
    const chunks = await loadDatasetFiles();
    if (chunks.length === 0) {
      console.error('Không tìm thấy dữ liệu để nạp!');
      return;
    }

    // 2. Khởi tạo mô hình Xenova/bge-m3
    console.log('\nĐang tải mô hình Xenova/bge-m3 (q8) local...');
    const { pipeline } = await (eval('import("@huggingface/transformers")') as Promise<any>);
    const extractor = await pipeline('feature-extraction', 'Xenova/bge-m3', {
      dtype: 'q8',
    });
    console.log('Mô hình BGE-M3 (q8) đã sẵn sàng!\n');

    // 3. Xử lý theo batch và ghi vào DB
    const BATCH_SIZE = 16;
    const total = chunks.length;
    let processed = 0;

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const texts = batch.map((item) => item.content);

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
        const start = j * dim;
        const end = start + dim;
        const vectorArray = Array.from(flatData.slice(start, end));
        const vectorStr = `[${vectorArray.join(',')}]`;

        await prisma.$executeRaw`
          INSERT INTO tourism_chunks (id, chunk_type, content, embedding, metadata, created_at)
          VALUES (
            ${item.id},
            ${item.chunkType},
            ${item.content},
            ${vectorStr}::vector,
            ${JSON.stringify(item.metadata)}::jsonb,
            NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            content = EXCLUDED.content,
            embedding = EXCLUDED.embedding,
            metadata = EXCLUDED.metadata;
        `;
      }

      processed += batch.length;
      if (processed % 80 === 0 || processed === total) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const percent = ((processed / total) * 100).toFixed(1);
        console.log(`[Tiến độ: ${percent}%] Đã nhúng & nạp ${processed}/${total} chunks (${elapsed}s)...`);
      }
    }

    const totalSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n🎉 HOÀN TẤT NẠP DỮ LIỆU! Tổng thời gian: ${totalSeconds}s`);

    // Kiểm tra số lượng bản ghi
    const countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM tourism_chunks;
    `;
    const count = Number(countResult[0]?.count || 0);
    console.log(`Tổng số bản ghi trong bảng tourism_chunks: ${count}`);

  } catch (error) {
    console.error('Lỗi trong quá trình nạp dữ liệu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

ingest();
