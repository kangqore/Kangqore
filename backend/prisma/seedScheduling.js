const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    // Create default availability schedule
    await prisma.availabilitySchedule.upsert({
      where: { id: `default-schedule-${user.id}` },
      update: {},
      create: {
        id: `default-schedule-${user.id}`,
        name: 'Working Hours',
        userId: user.id,
        isDefault: true,
        timezone: 'Asia/Kolkata',
        rules: [
          { day: 1, startTime: '09:00', endTime: '17:00' },
          { day: 2, startTime: '09:00', endTime: '17:00' },
          { day: 3, startTime: '09:00', endTime: '17:00' },
          { day: 4, startTime: '09:00', endTime: '17:00' },
          { day: 5, startTime: '09:00', endTime: '17:00' }
        ]
      }
    });

    // Create default event types
    await prisma.eventType.upsert({
      where: { slug: `discovery-${user.id.slice(0, 5)}` },
      update: {},
      create: {
        slug: `discovery-${user.id.slice(0, 5)}`,
        name: '30-min Discovery Call',
        description: 'A brief call to discuss your requirements and how Kangqore can help.',
        duration: 30,
        hostId: user.id,
        isActive: true,
        isPublic: true,
        locationType: 'VIDEO',
        location: 'https://meet.google.com/abc-defg-hij'
      }
    });

    // Specific event for the global contact page
    if (user.email === 'admin@kangqore.com') {
      await prisma.eventType.upsert({
        where: { slug: 'discovery-call' },
        update: {},
        create: {
          slug: 'discovery-call',
          name: 'Executive Consultation',
          description: 'A high-level session to assess risks, opportunities, and next steps for your enterprise transformation.',
          duration: 30,
          hostId: user.id,
          isActive: true,
          isPublic: true,
          locationType: 'VIDEO',
          location: 'https://meet.google.com/kangqore-executive'
        }
      });
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
