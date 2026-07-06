import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ select: { name: true, email: true, role: true } });
  console.log('All users:', users);
}
main().catch(console.error).finally(() => prisma.$disconnect());
