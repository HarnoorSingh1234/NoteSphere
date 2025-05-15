import { PrismaClient } from '@prisma/client';

// This prevents multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance of Prisma Client
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Attach prisma to the global object in non-production environments
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}