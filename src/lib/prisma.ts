import { PrismaClient } from '@prisma/client';

// Provide dummy DATABASE_URL fallback during Vercel build phase if env is missing
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://placeholder:placeholder@localhost:5432/placeholder";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const getPrismaClient = (): PrismaClient => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  return globalForPrisma.prisma;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

/**
 * withDB — auto-retry wrapper for Neon's serverless cold-start errors.
 *
 * Neon suspends its compute after ~5 min of inactivity. When it wakes,
 * existing pool connections are stale ("Error { kind: Closed }").
 * This helper retries up to maxRetries times with progressive back-off.
 */
export async function withDB<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("placeholder")) {
    throw new Error("DATABASE_URL is missing or placeholder.");
  }
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
