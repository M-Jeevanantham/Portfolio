import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * withDB — auto-retry wrapper for Neon's serverless cold-start errors.
 *
 * Neon suspends its compute after ~5 min of inactivity. When it wakes,
 * existing pool connections are stale ("Error { kind: Closed }").
 * This helper retries up to maxRetries times with progressive back-off.
 */
export async function withDB<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const errStr = String(err?.message || err || "");
      const isRetryable =
        errStr.includes("kind: Closed") ||
        errStr.includes("Closed") ||
        errStr.includes("ECONNRESET") ||
        errStr.includes("ETIMEDOUT") ||
        errStr.includes("EngineState") ||
        err?.code === "P1001" ||
        err?.code === "P1008" ||
        err?.code === "P1017";

      if (!isRetryable || attempt === maxRetries) throw err;

      // Disconnect stale client instance to force fresh TCP connection pool on retry
      try {
        await prisma.$disconnect();
      } catch (_) {}

      const delay = 300 * attempt;
      console.warn(`[DB] Stale connection detected, retrying ${attempt}/${maxRetries} in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("withDB: exhausted retries");
}
