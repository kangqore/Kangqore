
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const contact = await prisma.contact.findFirst({
    where: { email: 'success@kangqore.com' },
    orderBy: { createdAt: 'desc' },
  });

  console.log(JSON.stringify(contact, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
