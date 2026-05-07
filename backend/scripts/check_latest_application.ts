
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const application = await prisma.jobApplication.findFirst({
    where: { email: 'careers@kangqore.com' },
    orderBy: { createdAt: 'desc' },
  });

  console.log(JSON.stringify(application, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
