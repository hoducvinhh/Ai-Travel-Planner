import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Danh mục ảnh Unsplash 4K chuyên đề phong cảnh du lịch Việt Nam chất lượng cao làm fallback
const TOPIC_FALLBACKS: Record<string, string[]> = {
  beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
  ],
  mountain: [
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
  ],
  heritage: [
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
  ],
  food: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
  ],
  general: [
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  ],
};

function getFallbackImage(name: string, categories: string[], province: string): string {
  const text = `${name} ${categories.join(' ')} ${province}`.toLowerCase();

  let pool: string[];
  if (text.includes('biển') || text.includes('đảo') || text.includes('vịnh') || text.includes('beach') || text.includes('bãi')) {
    pool = TOPIC_FALLBACKS.beach;
  } else if (text.includes('núi') || text.includes('thác') || text.includes('đèo') || text.includes('fansipan') || text.includes('sapa') || text.includes('thiên nhiên') || text.includes('rừng')) {
    pool = TOPIC_FALLBACKS.mountain;
  } else if (text.includes('chùa') || text.includes('lăng') || text.includes('đền') || text.includes('phố cổ') || text.includes('hội an') || text.includes('cung') || text.includes('thành') || text.includes('di tích')) {
    pool = TOPIC_FALLBACKS.heritage;
  } else if (text.includes('chợ') || text.includes('ẩm thực') || text.includes('ăn vặt') || text.includes('đêm')) {
    pool = TOPIC_FALLBACKS.food;
  } else {
    pool = TOPIC_FALLBACKS.general;
  }

  // Chọn ảnh ngẫu nhiên có trật tự theo mã hash tên
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return pool[charCodeSum % pool.length];
}

// Làm sạch tên địa điểm để tìm kiếm trên Wikipedia hiệu quả nhất
function cleanSearchQuery(rawName: string): string[] {
  const queries: string[] = [];

  // Query gốc
  queries.push(rawName.trim());

  // Loại bỏ nội dung trong ngoặc đơn, ví dụ: "Quần Thể Danh Thắng Tràng An (UNESCO)" -> "Quần Thể Danh Thắng Tràng An"
  const withoutParens = rawName.replace(/\(.*?\)/g, '').trim();
  if (withoutParens && withoutParens !== rawName) {
    queries.push(withoutParens);
  }

  // Loại bỏ các tiền tố thương hiệu như "Sun World", "VinWonders & Safari", "Khu Du Lịch"
  const simplified = withoutParens
    .replace(/^Sun World\s+/i, '')
    .replace(/^VinWonders\s*(&\s*Safari)?\s*/i, '')
    .replace(/^Khu Du Lịch\s+/i, '')
    .replace(/^Danh Thắng\s+/i, '')
    .replace(/^Di Tích\s+/i, '')
    .trim();

  if (simplified && !queries.includes(simplified)) {
    queries.push(simplified);
  }

  return queries;
}

async function fetchWikiImage(query: string): Promise<string | null> {
  const endpoints = [
    `https://vi.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      query,
    )}&gsrlimit=1&prop=pageimages&pithumbsize=1000&format=json`,
    `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      query,
    )}&gsrlimit=1&prop=pageimages&pithumbsize=1000&format=json`,
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'AITravelPlannerBot/1.0 (https://github.com/hoducvinhh/Ai-Travel-Planner; contact@travelplanner.edu.vn)',
          Accept: 'application/json',
        },
      });
      clearTimeout(timeoutId);

      if (!res.ok) continue;
      const data = await res.json();

      if (data?.query?.pages) {
        const pageKey = Object.keys(data.query.pages)[0];
        const page = data.query.pages[pageKey];
        if (page?.thumbnail?.source) {
          return page.thumbnail.source;
        }
      }
    } catch {
      // Network / timeout
    }
  }

  return null;
}

async function searchImageForPlace(name: string, categories: string[], province: string): Promise<string> {
  const candidates = cleanSearchQuery(name);

  for (const q of candidates) {
    const img = await fetchWikiImage(q);
    if (img) {
      return img;
    }
  }

  // Fallback ảnh Unsplash chất lượng cao theo chủ đề
  return getFallbackImage(name, categories, province);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const forceAll = process.argv.includes('--force');
  console.log(`🚀 Bắt đầu quét & nạp ảnh hàng loạt (${forceAll ? 'Chế độ FORCE: quét lại toàn bộ' : 'Chỉ quét địa điểm thiếu ảnh'})...`);

  // Lấy các địa điểm chưa có ảnh (hoặc nếu forceAll: quét lại các ảnh fallback để nâng cấp lên ảnh Wikipedia)
  const whereCondition = forceAll
    ? {}
    : {
        OR: [{ imageUrl: null }, { imageUrl: '' }],
      };

  const places = await prisma.place.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'asc' },
  });

  const total = places.length;
  console.log(`📋 Tìm thấy ${total} địa điểm cần xử lý ảnh.\n`);

  if (total === 0) {
    console.log('🎉 Tất cả địa điểm trong database đều đã có ảnh đầy đủ!');
    return;
  }

  let wikiCount = 0;
  let fallbackCount = 0;

  for (let i = 0; i < total; i++) {
    const place = places[i];
    const imgUrl = await searchImageForPlace(place.name, place.categories, place.province || '');

    const isWiki = imgUrl.includes('wikimedia.org') || imgUrl.includes('wikipedia.org');
    if (isWiki) {
      wikiCount++;
    } else {
      fallbackCount++;
    }

    await prisma.place.update({
      where: { id: place.id },
      data: { imageUrl: imgUrl },
    });

    const percent = Math.round(((i + 1) / total) * 100);
    const sourceTag = isWiki ? '🏛️ Wikipedia' : '🏖️ Curated HD';
    console.log(`[${i + 1}/${total}] (${percent}%) [${sourceTag}] ${place.name} -> ${imgUrl.slice(0, 65)}...`);

    // Delay 100ms giữa các request để đảm bảo an toàn mạng
    await delay(100);
  }

  console.log('\n===========================================');
  console.log(`🎉 HOÀN THÀNH CẬP NHẬT ẢNH CHO ${total} ĐỊA ĐIỂM!`);
  console.log(` - 🏛️ Ảnh thực tế từ Wikipedia: ${wikiCount}`);
  console.log(` - 🏖️ Ảnh phong cảnh du lịch chuẩn: ${fallbackCount}`);
  console.log('===========================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi nạp ảnh:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
