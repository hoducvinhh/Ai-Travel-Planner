import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const places = await prisma.place.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const formatted = places.map((p) => ({
    name: p.name,
    province: p.province,
    categories: p.categories,
    price: p.priceEstimate,
    lat: p.latitude,
    lon: p.longitude,
    id: p.id,
    description: p.description,
    price_estimate: p.priceEstimate,
    popularity_score: p.popularityScore,
    indoor_outdoor: p.indoorOutdoor,
    activity_level: p.activityLevel,
    latitude: p.latitude,
    longitude: p.longitude,
  }));

  const targetPath = path.resolve(__dirname, '../../datasets/mock_places.json');
  fs.writeFileSync(targetPath, JSON.stringify(formatted, null, 2), 'utf-8');
  console.log(`✅ Đã đồng bộ thành công ${formatted.length} địa điểm vào datasets/mock_places.json!`);

  const recPath = path.resolve(__dirname, '../../recommendation-service/mock_places.json');
  if (fs.existsSync(recPath)) {
    fs.writeFileSync(recPath, JSON.stringify(formatted, null, 2), 'utf-8');
  }
}

main()
  .catch((e) => {
    console.error('Lỗi sync:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
