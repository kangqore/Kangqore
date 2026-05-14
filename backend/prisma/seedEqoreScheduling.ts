import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding eQORE Scheduling Configuration...');

  // 1. Find the primary admin host
  const admin = await prisma.user.findFirst({
    where: { 
      OR: [
        { email: 'admin@kangqore.com' },
        { role: 'ADMIN' }
      ]
    }
  });

  if (!admin) {
    console.error('❌ Could not find primary admin for eQORE scheduling host.');
    return;
  }

  console.log(`👤 Using ${admin.email} as default host for eQORE consultations.`);

  // 2. Seed Default Event Type
  const eqoreEvent = await prisma.eventType.upsert({
    where: { slug: 'eqore-executive-consultation-30' },
    update: {
      name: 'eQORE Executive Consultation — 30 min',
      description: 'Initial discovery, requirement understanding, and solution fit discussion powered by eQORE Intelligence.',
      duration: 30,
      isActive: true,
      isPublic: true,
    },
    create: {
      slug: 'eqore-executive-consultation-30',
      name: 'eQORE Executive Consultation — 30 min',
      description: 'Initial discovery, requirement understanding, and solution fit discussion powered by eQORE Intelligence.',
      duration: 30,
      hostId: admin.id,
      isActive: true,
      isPublic: true,
      locationType: 'VIDEO',
      location: 'https://meet.google.com/eqore-consultation'
    }
  });

  console.log(`✅ Seeded Event Type: ${eqoreEvent.name} (${eqoreEvent.slug})`);

  // 3. Ensure the host has an availability schedule
  const scheduleId = `default-schedule-${admin.id}`;
  await prisma.availabilitySchedule.upsert({
    where: { id: scheduleId },
    update: {},
    create: {
      id: scheduleId,
      name: 'eQORE Standard Availability',
      userId: admin.id,
      isDefault: true,
      timezone: 'Asia/Kolkata',
      rules: [
        { day: 1, startTime: '09:00', endTime: '18:00' },
        { day: 2, startTime: '09:00', endTime: '18:00' },
        { day: 3, startTime: '09:00', endTime: '18:00' },
        { day: 4, startTime: '09:00', endTime: '18:00' },
        { day: 5, startTime: '09:00', endTime: '18:00' }
      ]
    }
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
