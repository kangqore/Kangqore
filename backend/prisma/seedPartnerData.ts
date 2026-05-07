import { PrismaClient, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Partner data...');

  // 1. Create or Find Partner User
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const partnerEmail = 'partner@kangqore.com';
  
  const partner = await prisma.user.upsert({
    where: { email: partnerEmail },
    update: {
      role: 'PARTNER',
      status: 'ACTIVE',
    },
    create: {
      email: partnerEmail,
      name: 'Alex Partner',
      password: hashedPassword,
      role: 'PARTNER',
      company: 'DevForce Solutions',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Partner user ready: ${partner.email}`);

  // 2. Create a Dummy Client for relationships
  const client = await prisma.user.upsert({
    where: { email: 'client@kangqore.com' },
    update: {},
    create: {
      email: 'client@kangqore.com',
      name: 'Sarah Client',
      password: hashedPassword,
      role: 'CLIENT', 
      company: 'TechCorp',
    }
  });

  // 3. Seed Projects (Assigned to Partner)
  const project1 = await prisma.project.create({
    data: {
      title: 'Mobile App Development',
      description: 'Native iOS and Android app for TechCorp customer loyalty.',
      status: 'ACTIVE',
      clientId: client.id,
      partnerId: partner.id,
    }
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Legacy System Migration',
      description: 'Migrating old SQL database to cloud infrastructure.',
      status: 'ACTIVE',
      clientId: client.id,
      partnerId: partner.id,
    }
  });
  
  console.log(`✅ Seeded 2 assigned projects.`);

  // 4. Seed Tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Setup CI/CD Pipeline',
        description: 'Configure GitHub Actions for automated testing.',
        status: 'completed',
        projectId: project1.id,
        clientId: client.id,
        partnerId: partner.id,
      },
      {
        title: 'Design Authentication Flow',
        description: 'Implement JWT based auth with refresh tokens.',
        status: 'in_progress',
        projectId: project1.id,
        clientId: client.id,
        partnerId: partner.id,
      },
      {
        title: 'Database Schema Audit',
        description: 'Review existing tables for normalization.',
        status: 'todo',
        projectId: project2.id,
        clientId: client.id,
        partnerId: partner.id,
      }
    ]
  });

  console.log(`✅ Seeded tasks.`);

  // 5. Seed Deliverables
  await prisma.deliverable.create({
    data: {
      title: 'API Documentation v1.0',
      description: 'Swagger documentation for core endpoints.',
      status: 'submitted',
      projectId: project1.id,
      clientId: client.id,
      partnerId: partner.id,
    }
  });

  console.log(`✅ Seeded deliverables.`);

  // 6. Seed Meetings
  await prisma.meeting.create({
    data: {
      title: 'Weekly Sprint Sync',
      type: 'VC',
      platform: 'ZOOM',
      startTime: new Date(Date.now() + 86400000), // Tomorrow
      endTime: new Date(Date.now() + 86400000 + 3600000),
      status: 'SCHEDULED',
      clientId: client.id,
      partnerId: partner.id,
      createdBy: client.id, // Organizer
      joinLink: 'https://zoom.us/j/123456789',
    }
  });

  console.log(`✅ Seeded meetings.`);

  // 7. Seed Messages
  await prisma.message.create({
    data: {
      content: 'Hi Admin, regarding the API specs, are we locked on v2?',
      senderId: partner.id,
      receiverId: null, // To Admin (System)
      partnerId: partner.id,
      isRead: false,
    }
  });

  console.log(`✅ Seeded messages.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
