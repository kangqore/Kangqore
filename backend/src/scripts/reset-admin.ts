import { prisma } from '../lib/prisma';
import { hashPassword } from '../utils/password';

const resetAdmin = async () => {
  const email = process.env.ADMIN_RESET_EMAIL;
  const password = process.env.ADMIN_RESET_PASSWORD;

  if (!email || !password) {
    console.error('ADMIN_RESET_EMAIL and ADMIN_RESET_PASSWORD environment variables are required. Refusing to run with hardcoded credentials.');
    process.exit(1);
  }
  if (password.length < 12) {
    console.error('ADMIN_RESET_PASSWORD must be at least 12 characters.');
    process.exit(1);
  }

  try {
    const hashedPassword = await hashPassword(password);

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Kangqore',
        company: 'Kangqore'
      },
      create: {
        email,
        password: hashedPassword,
        name: 'Kangqore',
        role: 'ADMIN',
        company: 'Kangqore'
      }
    });

    console.log(`Admin user ${admin.email} has been updated/created.`);
  } catch (error) {
    console.error('Error resetting admin:', error);
  } finally {
    await prisma.$disconnect();
  }
};

resetAdmin();
