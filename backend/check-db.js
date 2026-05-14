const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { email: true, name: true } });
  console.log('Users:', JSON.stringify(users, null, 2));
  const eventTypes = await prisma.eventType.findMany({ select: { slug: true, isActive: true, isPublic: true } });
  console.log('Event Types:', JSON.stringify(eventTypes, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
