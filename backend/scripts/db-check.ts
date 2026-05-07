
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Database Diagnostic Start ---');
  console.log('Attempting to connect to database...');
  
  try {
    const startTime = Date.now();
    // Simple query to test connection
    const userCount = await prisma.user.count();
    const endTime = Date.now();
    
    console.log('✅ Connection Successful!');
    console.log(`User Count: ${userCount}`);
    console.log(`Query Time: ${endTime - startTime}ms`);
    
  } catch (error: any) {
    console.error('❌ Connection Failed!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n--- Troubleshooting Tips ---');
      console.log('1. Check if Supabase project is active.');
      console.log('2. Check if your IP is allowed in Supabase (though usually it is for public DBs).');
      console.log('3. Try adding "?direct_connection=true" to DATABASE_URL if using a pooler.');
      console.log('4. Ensure your network supports IPv6 if Supabase is using it.');
    }
  } finally {
    await prisma.$disconnect();
    console.log('--- Diagnostic End ---');
  }
}

main();
