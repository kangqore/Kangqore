const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.updateMany({
    where: { email: 'mahesh@kangqore.com' },
    data: { password: hashedPassword }
  });
  console.log('Password updated to admin123');
}
main().catch(console.error).finally(() => prisma.$disconnect());
