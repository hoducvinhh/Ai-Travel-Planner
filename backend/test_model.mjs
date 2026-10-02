import { pipeline } from '@huggingface/transformers';

console.log('Bắt đầu tải và kiểm tra mô hình Xenova/bge-m3 (q8 - ~570MB)...');
try {
  const extractor = await pipeline('feature-extraction', 'Xenova/bge-m3', {
    dtype: 'q8',
    progress_callback: (p) => {
      if (p.status === 'progress') {
        const percent = (p.progress || 0).toFixed(1);
        if (Number(percent) % 10 === 0 || p.progress > 99) {
          console.log(`[${p.file}] ${percent}% (${(p.loaded / 1024 / 1024).toFixed(1)}MB / ${(p.total / 1024 / 1024).toFixed(1)}MB)`);
        }
      } else if (p.status === 'done') {
        console.log(`[Hoàn thành file] ${p.file}`);
      }
    }
  });
  console.log('\nTải mô hình thành công! Đang thử nhúng câu test...');
  const output = await extractor('Du lịch Việt Nam rất đẹp và phong phú', { pooling: 'cls', normalize: true });
  console.log('Output dims:', output.dims);
  console.log('5 giá trị đầu:', Array.from(output.data.slice(0, 5)));
  console.log('=> Mô hình Xenova/bge-m3 (q8) hoạt động hoàn hảo!');
} catch (e) {
  console.error('Lỗi tải mô hình:', e);
}
