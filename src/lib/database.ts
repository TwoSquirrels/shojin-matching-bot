import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
async function disconnect() {
  await prisma.$disconnect();
}

process.on('beforeExit', () => {
  void disconnect();
});

process.on('SIGINT', () => {
  disconnect()
    .then(() => {
      console.log('Database disconnected');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error disconnecting from database:', error);
      process.exit(1);
    });
});

process.on('SIGTERM', () => {
  disconnect()
    .then(() => {
      console.log('Database disconnected');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error disconnecting from database:', error);
      process.exit(1);
    });
});
