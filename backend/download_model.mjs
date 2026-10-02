import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ONNX_DIR = path.resolve(
  __dirname,
  'node_modules/.pnpm/@huggingface+transformers@4.3.0_@types+node@24.19.0/node_modules/@huggingface/transformers/.cache/Xenova/bge-m3/onnx'
);

const TARGET_FILE = path.join(ONNX_DIR, 'model_quantized.onnx');
const TMP_FILE = path.join(ONNX_DIR, 'model_quantized.onnx.tmp.20848.7jjqya');
const TOTAL_SIZE = 569694530;

function getDirectUrl() {
  return new Promise((resolve, reject) => {
    https.get('https://huggingface.co/Xenova/bge-m3/resolve/main/onnx/model_quantized.onnx', (res) => {
      if (res.statusCode === 302 || res.statusCode === 307) {
        resolve(res.headers.location);
      } else {
        resolve('https://huggingface.co/Xenova/bge-m3/resolve/main/onnx/model_quantized.onnx');
      }
    }).on('error', reject);
  });
}

function downloadPart(directUrl, startByte, endByte, partIndex) {
  return new Promise((resolve, reject) => {
    console.log(`Bắt đầu tải phần ${partIndex}...`);
    https.get(directUrl, { headers: { 'Range': `bytes=${startByte}-${endByte}` } }, (res) => {
      if (res.statusCode !== 206 && res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      
      const stream = fs.createWriteStream(TARGET_FILE, { flags: 'r+', start: startByte });
      let downloaded = 0;
      let lastReport = Date.now();
      
      res.on('data', (chunk) => {
        downloaded += chunk.length;
        if (Date.now() - lastReport > 2000) {
          console.log(`[Phần ${partIndex}] Đang tải: ${(downloaded / 1024 / 1024).toFixed(1)} MB`);
          lastReport = Date.now();
        }
      });
      
      res.pipe(stream);
      
      stream.on('finish', () => {
        console.log(`Hoàn thành phần ${partIndex}!`);
        resolve();
      });
      
      stream.on('error', reject);
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== HOÀN TẤT TẢI MÔ HÌNH Xenova/bge-m3 (model_quantized.onnx) ===');

  if (!fs.existsSync(ONNX_DIR)) {
    fs.mkdirSync(ONNX_DIR, { recursive: true });
  }

  let currentSize = 0;
  if (fs.existsSync(TMP_FILE)) {
    const tmpStat = fs.statSync(TMP_FILE);
    console.log(`Tìm thấy file cache tạm: ${(tmpStat.size / 1024 / 1024).toFixed(1)} MB`);
    fs.copyFileSync(TMP_FILE, TARGET_FILE);
    currentSize = tmpStat.size;
  } else if (fs.existsSync(TARGET_FILE)) {
    currentSize = fs.statSync(TARGET_FILE).size;
  }

  console.log(`Dung lượng hiện tại: ${(currentSize / 1024 / 1024).toFixed(1)} MB / ${(TOTAL_SIZE / 1024 / 1024).toFixed(1)} MB`);

  if (currentSize >= TOTAL_SIZE) {
    console.log('File model_quantized.onnx đã đủ kích thước!');
    return;
  }

  const remaining = TOTAL_SIZE - currentSize;
  console.log(`Còn lại: ${(remaining / 1024 / 1024).toFixed(1)} MB. Đang lấy link direct...`);
  const directUrl = await getDirectUrl();

  const CHUNK_SIZE = 30 * 1024 * 1024;
  const numChunks = Math.ceil(remaining / CHUNK_SIZE);
  console.log(`Chia làm ${numChunks} phần, tải song song...`);

  const chunks = [];
  for (let i = 0; i < numChunks; i++) {
    const start = currentSize + i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE - 1, TOTAL_SIZE - 1);
    chunks.push({ index: i + 1, start, end });
  }

  const t0 = Date.now();
  const CONCURRENCY = 4;
  
  for (let i = 0; i < chunks.length; i += CONCURRENCY) {
    const batch = chunks.slice(i, i + CONCURRENCY);
    console.log(`Đang tải batch ${Math.floor(i / CONCURRENCY) + 1} (${batch.length} phần song song)...`);
    
    await Promise.all(batch.map(c => downloadPart(directUrl, c.start, c.end, c.index).catch(e => {
        console.error(`Lỗi tải phần ${c.index}:`, e);
        throw e;
    })));
  }

  const finalStat = fs.statSync(TARGET_FILE);
  console.log(`\nHoàn thành! Kích thước file cuối cùng: ${finalStat.size} bytes (${(finalStat.size / 1024 / 1024).toFixed(1)} MB) in ${((Date.now()-t0)/1000).toFixed(1)}s`);

  // Truncate in case it's slightly larger due to any reason
  if (finalStat.size > TOTAL_SIZE) {
     fs.truncateSync(TARGET_FILE, TOTAL_SIZE);
  }

  // Cleanup tmp
  try {
    const files = fs.readdirSync(ONNX_DIR);
    for (const f of files) {
      if (f.includes('.tmp.')) {
        fs.unlinkSync(path.join(ONNX_DIR, f));
      }
    }
  } catch {}
}

main().catch(console.error);
