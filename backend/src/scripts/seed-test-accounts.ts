import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/password';

const prisma = new PrismaClient();

const testAccounts = [
  {
    email: 'admin@kangqore.com',
    password: 'Admin2026!',
    name: 'Mahesh Kumar',
    role: 'ADMIN',
    company: 'Kangqore',
    phone: '+1-555-0100'
  },
  {
    email: 'client@kangqore.com',
    password: 'Client2026!',
    name: 'Dr. Priya Rao',
    role: 'CLIENT',
    company: 'Synapse Health Systems',
    phone: '+1-555-0101'
  },
  {
    email: 'partner@kangqore.com',
    password: 'Partner2026!',
    name: 'Dev Patel',
    role: 'PARTNER',
    company: 'Nexus Tech Solutions',
    phone: '+1-555-0102'
  },
  {
    email: 'investor@kangqore.com',
    password: 'Investor2026!',
    name: 'James Whitfield',
    role: 'INVESTOR',
    company: 'Whitfield Ventures',
    phone: '+1-555-0103'
  },
  {
    email: 'careers@kangqore.com',
    password: 'Careers2026!',
    name: 'Mia Johansson',
    role: 'JOB_SEEKER',
    company: null,
    phone: '+1-555-0104'
  },
  {
    email: 'press@kangqore.com',
    password: 'Press2026!',
    name: 'Ananya Singh',
    role: 'JOURNALIST',
    company: 'TechDesk Media',
    phone: '+1-555-0105'
  },
  {
    email: 'analyst@kangqore.com',
    password: 'Analyst2026!',
    name: 'Ravi Mehta',
    role: 'ANALYST',
    company: 'Meridian Insights Group',
    phone: '+1-555-0106'
  },
];

async function seedTestAccounts() {
  console.log('🌱 Seeding demo accounts...\n');

  for (const account of testAccounts) {
    try {
      const existing = await prisma.user.findUnique({ where: { email: account.email } });

      if (existing) {
        // Update password in case it changed
        const hashedPassword = await hashPassword(account.password);
        await prisma.user.update({
          where: { email: account.email },
          data: { password: hashedPassword, name: account.name, company: account.company }
        });
        console.log(`🔄  Updated ${account.role}: ${account.email}`);
        continue;
      }

      const hashedPassword = await hashPassword(account.password);
      await prisma.user.create({
        data: {
          email:    account.email,
          password: hashedPassword,
          name:     account.name,
          role:     account.role as any,
          company:  account.company,
          phone:    account.phone,
        }
      });

      console.log(`✅  Created ${account.role}: ${account.email}`);
    } catch (error) {
      console.error(`❌  Failed ${account.role}:`, error);
    }
  }

  console.log('\n' + '═'.repeat(62));
  console.log('  KANGQORE DEMO ACCOUNTS');
  console.log('═'.repeat(62));
  console.log('  Login at: http://localhost:3000/login\n');

  const rolePortal: Record<string, string> = {
    ADMIN:      '/kangqore-view/kimmp',
    CLIENT:     '/kangqore-view/client',
    PARTNER:    '/kangqore-view/partner',
    INVESTOR:   '/kangqore-view/investor',
    JOB_SEEKER: '/kangqore-view/careers',
    JOURNALIST: '/kangqore-view/journalist',
    ANALYST:    '/kangqore-view/analyst',
  };

  testAccounts.forEach(a => {
    console.log(`  ${a.role.padEnd(12)}  ${a.email.padEnd(28)}  ${a.password.padEnd(16)}  → ${rolePortal[a.role]}`);
  });

  console.log('═'.repeat(62) + '\n');
  await prisma.$disconnect();
}

seedTestAccounts().catch(err => {
  console.error(err);
  process.exit(1);
});
