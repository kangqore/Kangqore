import { prisma } from '../lib/prisma';
import { hashPassword } from '../utils/password';

const resetAdmin = async () => {
  try {
    const email = 'admin@kangqore.com';
    const password = 'KangqoreAdmin2024!';
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
    console.log(`Password set to: ${password}`);
  } catch (error) {
    console.error('Error resetting admin:', error);
  } finally {
    await prisma.$disconnect();
  }
};

resetAdmin();
