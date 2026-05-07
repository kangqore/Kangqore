
import { prisma } from '../src/lib/prisma';
import { generateCustomId } from '../src/utils/idGenerator';

async function main() {
  console.log('--- Starting ID Migration ---');
  
  const users = await prisma.user.findMany({
    where: {
      customId: null
    }
  });

  console.log(`Found ${users.length} users without Custom ID.`);

  for (const user of users) {
    const newId = await generateCustomId(user.role);
    console.log(`Assigning ${newId} to ${user.email} (${user.role})`);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { customId: newId }
    });
  }

  console.log('--- Migration Completed ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
