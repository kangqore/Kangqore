/**
 * Database Module - Centralized database access
 * 
 * This module provides the Prisma client and database utilities
 */

import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Export everything from this module
export { prisma as db };
export default prisma;
