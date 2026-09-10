import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma Client singleton — safe for Next.js dev (HMR) and Vercel
// serverless (one client per lambda instance, reused across warm
// invocations). Query logging is dev-only: on serverless it would
// flood the function logs.
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db