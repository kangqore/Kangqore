import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Investor Data...');

  // 1. Create/Find Investor
  const email = 'investor@kangqore.com';
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const investor = await prisma.user.upsert({
    where: { email },
    update: { role: 'INVESTOR' }, // Ensure role is updated
    create: {
      email,
      password: hashedPassword,
      name: 'Sarah Investor',
      role: 'INVESTOR',
      company: 'Venture Capital Partners'
    }
  });

  console.log(`✅ Investor ready: ${investor.email}`);

  // 2. Create Updates
  await prisma.investorUpdate.createMany({
    data: [
        {
            title: 'Q1 2026 Board Meeting Summary',
            content: 'Key takeaways from our quarterly board meeting including strategic pivots and financial health.',
            type: 'Milestone',
            createdAt: new Date('2026-01-10')
        },
        {
            title: 'New Product Launch: Enterprise AI',
            content: 'We successfully launched the beta version of our Enterprise AI suite to 5 design partners.',
            type: 'Announcement',
            createdAt: new Date('2026-01-05')
        },
        {
            title: 'Funding Round Closed',
            content: 'Series B funding round successfully closed with participation from new strategic partners.',
            type: 'Financial',
            createdAt: new Date('2025-12-15')
        }
    ]
  });

  // 3. Create Meetings
  await prisma.meeting.create({
    data: {
        title: 'Q2 Strategy Sync',
        type: 'VIDEO',
        platform: 'ZOOM',
        startTime: new Date(Date.now() + 86400000), // Tomorrow
        endTime: new Date(Date.now() + 86400000 + 3600000),
        status: 'SCHEDULED',
        investorId: investor.id,
        clientId: investor.id, // Hack: Reuse ID if strictly required by old logic (though we made it optional, some code might check)
        createdBy: investor.id,
    }
  });

  // 4. Create Emails
  await prisma.emailLog.createMany({
    data: [
        {
            subject: 'Re: Term Sheet Discussion',
            from: 'admin@kangqore.com',
            to: investor.email,
            body: 'Hi Sarah, attaching the revised term sheet for your review.',
            investorId: investor.id,
            clientId: investor.id, // Hack for same reason
            hasAttachment: true,
            isUnread: true,
            createdAt: new Date()
        },
        {
            subject: 'Meeting Invitation: Board Sync',
            from: 'founder@kangqore.com',
            to: investor.email,
            body: 'You have been invited to...',
            investorId: investor.id,
            clientId: investor.id,
            createdAt: new Date(Date.now() - 86400000)
        }
    ]
  });

  console.log('🎉 Investor Data Seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
