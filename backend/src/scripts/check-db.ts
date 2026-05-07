import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkColumns() {
  try {
    const consultation = await prisma.consultation.findFirst();
    if (consultation) {
      console.log('Columns found:', Object.keys(consultation));
    } else {
      console.log('No consultations found to check columns.');
      // Try to create a dummy one and catch the error
      console.log('Attempting to create a dummy consultation...');
      await prisma.consultation.create({
        data: {
          name: 'Test',
          email: 'test@example.com',
          service: 'Check'
        }
      });
      console.log('Successfully created test consultation.');
    }
  } catch (error) {
    console.error('Error checking columns:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkColumns();
