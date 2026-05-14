const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const eventTypes = await prisma.eventType.findMany();
  console.log('Event Types:', eventTypes.map(et => ({ name: et.name, slug: et.slug, isActive: et.isActive, isPublic: et.isPublic })));
  process.exit(0);
}
check();
