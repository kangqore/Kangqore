import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating Admin user...');

  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminEmail = 'admin@kangqore.com';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      status: 'ACTIVE',
      name: 'Kangqore', // Update name if already exists
      password: hashedPassword // Ensure password is set
    },
    create: {
      email: adminEmail,
      name: 'Kangqore',
      password: hashedPassword,
      role: 'ADMIN',
      company: 'Kangqore',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Admin user created/updated: ${admin.email} / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
