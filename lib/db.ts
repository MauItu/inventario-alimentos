import 'server-only'
import { PrismaClient } from '@prisma/client';

// Reutiliza una sola instancia entre recargas en dev y entre invocaciones en serverless
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
