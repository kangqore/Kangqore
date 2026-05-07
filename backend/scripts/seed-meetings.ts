
import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding meetings data...');

  // 1. Ensure Partner User exists
  const partnerEmail = 'partner@kangqore.com';
  const partnerPassword = await bcrypt.hash('Partner123!', 10);
  
  const partner = await prisma.user.upsert({
    where: { email: partnerEmail },
    update: {},
    create: {
      email: partnerEmail,
      password: partnerPassword,
      name: 'Test Partner',
      role: 'PARTNER',
      customId: 'KQ-PARTNER-01'
    }
  });

  console.log(`✅ Partner user ready: ${partner.email}`);

  // 2. Create a Pending Client Consultation
  // Use a fixed date for consistency
  const consultation = await prisma.consultation.create({
    data: {
      name: 'Startup Founder',
      email: 'founder@startup.com',
      company: 'NextBigThing',
      service: 'MVP Development',
      status: 'PENDING',
      message: 'Interested in building an MVP for our AI platform.',
      preferredDate: 'Next Tuesday 10AM'
    }
  });

  console.log(`✅ Created pending consultation: ${consultation.id}`);

  // 3. Create a Scheduled Partner Meeting
  const meetingStart = new Date();
  meetingStart.setDate(meetingStart.getDate() + 2); // 2 days from now
  meetingStart.setHours(10, 0, 0, 0); // 10:00 AM
  
  const meetingEnd = new Date(meetingStart);
  meetingEnd.setHours(11, 0, 0, 0); // 11:00 AM

  const meeting = await prisma.meeting.create({
    data: {
      title: 'Sprint Review: Alpha Phase',
      type: 'VIDEO',
      startTime: meetingStart,
      endTime: meetingEnd,
      status: 'SCHEDULED',
      createdBy: partner.id, // Partner created it
      partnerId: partner.id, // Assigned to this partner
      joinLink: 'https://meet.google.com/abc-defg-hij'
    }
  });

  console.log(`✅ Created scheduled meeting: ${meeting.title} (${meeting.status})`);
  
  console.log('seeds completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
