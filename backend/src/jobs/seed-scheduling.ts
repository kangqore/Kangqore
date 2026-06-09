import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'mahesh@kangqore.com';

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const hash = await bcrypt.hash('Kangqore@2026', 10);
    user = await prisma.user.create({
      data: {
        email,
        name: 'Mahesh Kumar',
        password: hash,
        role: 'ADMIN',
        company: 'Kangqore Global Pvt Ltd',
      },
    });
    console.log('Created user:', user.email);
  } else {
    console.log('User exists:', user.email);
  }

  const existing = await prisma.eventType.findUnique({ where: { slug: 'consultation-30' } });
  if (!existing) {
    await prisma.eventType.create({
      data: {
        slug: 'consultation-30',
        name: '30-Min Strategy Consultation',
        description: 'A focused 30-minute session to explore how Kangqore BIDS™ can transform your organisation.',
        duration: 30,
        color: '#2564ea',
        minNotice: 60,
        maxAdvanceDays: 30,
        hostId: user.id,
        isActive: true,
        isPublic: true,
        locationType: 'VIDEO',
        videoProvider: 'JITSI',
      },
    });
    console.log('Created event type: consultation-30');
  } else {
    console.log('Event type exists: consultation-30');
  }

  const schedule = await prisma.availabilitySchedule.findFirst({ where: { userId: user.id } });
  if (!schedule) {
    await prisma.availabilitySchedule.create({
      data: {
        userId: user.id,
        name: 'Working Hours',
        timezone: 'Asia/Kolkata',
        isDefault: true,
        rules: [
          { day: 1, startTime: '09:00', endTime: '17:00' },
          { day: 2, startTime: '09:00', endTime: '17:00' },
          { day: 3, startTime: '09:00', endTime: '17:00' },
          { day: 4, startTime: '09:00', endTime: '17:00' },
          { day: 5, startTime: '09:00', endTime: '17:00' },
        ],
        overrides: [],
      },
    });
    console.log('Created availability schedule');
  } else {
    console.log('Schedule exists');
  }

  console.log('\nDone. Booking widget slug: consultation-30');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
