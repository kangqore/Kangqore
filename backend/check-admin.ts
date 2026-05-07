import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@kangqore.com' },
    select: { name: true, email: true }
  });
  console.log('Current Admin in DB:', admin);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
