import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = bcrypt.hashSync('Admin@123456', 10);
  
  // Update ALL users in the database
  const result = await prisma.user.updateMany({
    data: { password: hash }
  });
  
  console.log(`Successfully reset password to Admin@123456 for ${result.count} accounts.`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
