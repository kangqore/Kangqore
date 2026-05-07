
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const consultation = await prisma.consultation.findFirst({
    where: { email: 'consult-api@kangqore.com' },
    orderBy: { createdAt: 'desc' },
  });

  console.log(JSON.stringify(consultation, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
