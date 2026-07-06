import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = bcrypt.hashSync('Admin@123456', 10);
  await prisma.user.updateMany({
    where: { email: { in: ['mahesh@kangqore.com', 'admin@kangqore.com', 'client@kangqore.com'] } },
    data: { password: hash }
  });
  console.log('Passwords reset to Admin@123456');
}
main().catch(console.error).finally(() => prisma.$disconnect());
