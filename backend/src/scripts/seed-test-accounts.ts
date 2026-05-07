import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/password';

const prisma = new PrismaClient();

const testAccounts = [
  {
    email: 'partner@kangqore.com',
    password: 'Partner2024!',
    name: 'Test Partner',
    role: 'PARTNER',
    company: 'Tech Solutions Inc',
    phone: '+1-555-0101'
  },
  {
    email: 'investor@kangqore.com',
    password: 'Investor2024!',
    name: 'Test Investor',
    role: 'INVESTOR',
    company: 'Venture Capital Group',
    phone: '+1-555-0102'
  },
  {
    email: 'jobseeker@kangqore.com',
    password: 'JobSeeker2024!',
    name: 'Test Job Seeker',
    role: 'JOB_SEEKER',
    company: null,
    phone: '+1-555-0103'
  },
  {
    email: 'client@kangqore.com',
    password: 'Client2024!',
    name: 'Test Client',
    role: 'CLIENT',
    company: 'Enterprise Corp',
    phone: '+1-555-0104'
  }
];

async function seedTestAccounts() {
  console.log('🌱 Seeding test accounts...\n');

  for (const account of testAccounts) {
    try {
      // Check if user already exists
      const existing = await prisma.user.findUnique({
        where: { email: account.email }
      });

      if (existing) {
        console.log(`⚠️  ${account.role} account already exists: ${account.email}`);
        continue;
      }

      // Hash password
      const hashedPassword = await hashPassword(account.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: account.email,
          password: hashedPassword,
          name: account.name,
          role: account.role as any,
          company: account.company,
          phone: account.phone
        }
      });

      console.log(`✅ Created ${account.role} account: ${account.email}`);
    } catch (error) {
      console.error(`❌ Failed to create ${account.role} account:`, error);
    }
  }

  console.log('\n📋 Test Account Credentials:');
  console.log('='.repeat(60));
  testAccounts.forEach(account => {
    console.log(`\n${account.role}:`);
    console.log(`  Email: ${account.email}`);
    console.log(`  Password: ${account.password}`);
    console.log(`  Dashboard: /dashboard/${account.role.toLowerCase().replace('_', '-')}`);
  });
  console.log('\n' + '='.repeat(60));

  await prisma.$disconnect();
}

seedTestAccounts()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
