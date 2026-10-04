import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      name: 'System Admin',
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      name: 'System Admin',
      password: hashedPassword,
      role: Role.ADMIN,
      preferredStyles: ['Khám phá', 'Văn hóa', 'Ẩm thực', 'Nghỉ dưỡng'],
      budgetLevel: 'MODERATE',
    },
  });

  console.log('--------------------------------------------------');
  console.log('Admin account seeded successfully:');
  console.log(`Email:    ${admin.email}`);
  console.log(`Password: ${adminPassword}`);
  console.log(`Role:     ${admin.role}`);
  console.log(`Name:     ${admin.name}`);
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Failed to seed admin account:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
