import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true
    }
  });

  console.log('--- Users List ---');
  users.forEach(u => {
    console.log(`[${u.status}] ${u.role} - ${u.email} (${u.name})`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
