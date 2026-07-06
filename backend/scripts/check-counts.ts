import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const signals = await (prisma as any).kimmpSignal.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log('Top 5 signals:', JSON.stringify(signals, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
