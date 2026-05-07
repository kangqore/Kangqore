const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    // Hash new password
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);

    // Update admin password
    const admin = await prisma.user.update({
      where: { email: 'admin@kangqore.com' },
      data: { password: hashedPassword }
    });

    console.log('✅ Admin password reset successfully!');
    console.log('Email:', admin.email);
    console.log('New Password: Admin@123456');
    console.log('Role:', admin.role);
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
