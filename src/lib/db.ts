// Prisma client singleton. Always import `db` from here — never construct
// PrismaClient directly (hot-reload would open one connection per module
// instance and exhaust SQLite handles).

import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl } from "./db-path";

const globalForPrisma = globalThis as unknown as { __neoCrmPrisma?: PrismaClient };

function createClient(): PrismaClient {
  const url = resolveDatabaseUrl(process.env.DATABASE_URL ?? "file:../db/custom.db");
  return new PrismaClient({
    datasources: { db: { url } },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const db = globalForPrisma.__neoCrmPrisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__neoCrmPrisma = db;
}
