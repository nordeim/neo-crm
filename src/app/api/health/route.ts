import { db } from "@/lib/db";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return ok({ status: "healthy", db: "up" });
  } catch {
    return ok({ status: "healthy", db: "down" });
  }
}
