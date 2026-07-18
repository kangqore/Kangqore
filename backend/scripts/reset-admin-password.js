const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
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
    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    console.log('✅ Admin password reset successfully!');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
