import { prisma } from '../lib/prisma';

async function main() {
  const user = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!user) {
    console.log('No admin found');
    return;
  }

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: 'System Update',
      message: 'The notification system has been successfully deployed!',
      type: 'SUCCESS',
      link: '/dashboard/admin/settings'
    }
  });

  console.log('Notification created for:', user.email);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
