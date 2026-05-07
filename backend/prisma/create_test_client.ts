
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'client@test.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const client = await prisma.user.upsert({
    where: { email },
    update: { role: 'CLIENT', status: 'ACTIVE', password: hashedPassword },
    create: {
      email,
      name: 'Test Client',
      password: hashedPassword,
      role: 'CLIENT',
      company: 'Test Corp',
      status: 'ACTIVE'
    }
  });

  // Ensure ClientProfile exists
  await prisma.clientProfile.upsert({
    where: { userId: client.id },
    create: { userId: client.id, interestedServices: [] },
    update: {}
  });

  // Ensure Project exists (for dashboard widgets)
  await prisma.project.create({
    data: {
      title: 'Alignment Verification Project',
      description: 'Project to test Alignment Pulse and Analytics',
      status: 'ACTIVE',
      clientId: client.id,
      // scores removed - schema mismatch in seed env
      services: ['Strategy', 'Tech']
    }
  });

  // Create Snapshot history for Analytics
  const dates = [
      new Date(Date.now() - 30 * 86400000),
      new Date(Date.now() - 15 * 86400000), 
      new Date(Date.now() - 5 * 86400000),
      new Date() 
  ];
  
  // Mock history: Client delay growing
  const historyData = [
      { date: dates[0], client: 0, admin: 0 },
      { date: dates[1], client: 2, admin: 0 },
      { date: dates[2], client: 5, admin: 1 },
      { date: dates[3], client: 10, admin: 2 }
  ];

  // We need the project ID we just created... wait, finding first is safer if strict
  const project = await prisma.project.findFirst({ where: { clientId: client.id }, orderBy: { createdAt: 'desc' } });

  if(project) {
      for(const h of historyData) {
          await prisma.accountabilitySnapshot.create({
              data: {
                  projectId: project.id,
                  clientId: client.id,
                  snapshotDate: h.date,
                  clientDelayDays: h.client,
                  adminDelayDays: h.admin,
                  budgetClientCaused: 0,
                  riskScore: 0
              }
          });
      }
  }

  console.log(`User created: ${email} / ${password}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
