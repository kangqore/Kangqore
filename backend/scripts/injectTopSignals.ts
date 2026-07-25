import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Injecting top signals...');

  await prisma.kimmpSignal.createMany({
    data: [
      {
        sourceModule: 'aegis',
        signalType: 'UNAUTHORIZED_ACCESS',
        signalCategory: 'RISK',
        signalValue: 'Unauthorized access patterns detected on 3 accounts, exceeding 16 active sessions per user',
        severity: 'CRITICAL',
        confidence: 99.5,
      },
      {
        sourceModule: 'aegis',
        signalType: 'CRITICAL_FAILURE',
        signalCategory: 'SYSTEM',
        signalValue: 'Critical failure in the system\'s ability to detect and respond to critical conditions',
        severity: 'CRITICAL',
        confidence: 95.0,
      }
    ]
  });

  console.log('Successfully injected top signals.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
