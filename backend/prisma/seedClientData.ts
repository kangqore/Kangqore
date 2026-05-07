import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Client Dashboard data...');

  // Find the first client
  const client = await prisma.user.findFirst({
    where: { role: 'CLIENT' }
  });

  if (!client) {
    console.error('❌ No user with role CLIENT found. Please create one first.');
    return;
  }

  const clientId = client.id;
  console.log(`Found Client: ${client.name} (${clientId})`);

  // Clear existing MVPs to avoid duplicates/confusion
  await prisma.productVersion.deleteMany({ where: { clientId } });
  console.log('Cleared existing Product Versions.');

  // 1. Seed Product Versions (MVPs)
  console.log('Seeding Product Versions...');
  await prisma.productVersion.createMany({
    data: [
      {
        clientId,
        name: 'UX Prototype (Design Demo)',
        type: 'Prototype',
        environment: 'Figma',
        url: 'https://figma.com/demo',
        status: 'Approved',
        version: 'v0.2.0-prototype',
        metadata: {
          description: 'High-fidelity clickable prototype for the new Dashboard flow. Validates core navigation and branding.',
          features: ['New Sidebar Navigation', 'Dark Mode Preview', 'Mobile Responsive Layouts'],
          limitations: ['Static data only', 'No real backend connection']
        }
      },
      {
        clientId,
        name: 'MVP (First Functional)',
        type: 'MVP',
        environment: 'Staging',
        url: 'https://staging.kangqore.com',
        status: 'In Review',
        version: 'v0.5.0-mvp',
        metadata: {
          description: 'First working version with core user management and authentication.',
          features: ['User Login/Signup', 'Profile Management', 'Basic Reporting'],
          limitations: ['Email notifications not enabled', 'Payment gateway in sandbox mode']
        }
      },
      {
        clientId,
        name: 'Beta Release',
        type: 'Beta',
        environment: 'Staging',
        url: 'https://beta.kangqore.com',
        status: 'In Progress',
        version: 'v0.8.0-beta',
        metadata: {
          description: 'Feature-complete build ready for user acceptance testing (UAT).',
          features: ['All MVP features', 'Real-time Notifications', 'Payment Processing (Stripe)', 'Admin Analytics'],
          limitations: ['Performance optimization pending for large datasets']
        }
      },
      {
        clientId,
        name: 'Production (GA)',
        type: 'Production',
        environment: 'Production',
        url: 'https://app.kangqore.com',
        status: 'Scheduled',
        version: 'v1.0.0',
        metadata: {
          description: 'Final gold master build. Ready for public launch.',
          features: ['Full System Stability', 'CDN Integration', 'Security Audited'],
          limitations: []
        }
      }
    ]
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
