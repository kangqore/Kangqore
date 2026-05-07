import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@kangqore.com';
  const password = await bcrypt.hash('Admin@123', 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { password, role: 'ADMIN' },
    create: {
      email,
      password,
      name: 'Admin User',
      role: 'ADMIN',
      customId: 'USR-ADMIN-001'
    }
  });
  console.log('Admin user ready:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
