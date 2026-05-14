const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
process.exit(0);
