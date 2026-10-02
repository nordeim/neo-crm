import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export const dynamic = "force-dynamic";

// Session-36 (S36-P5): the db-down branch is an honest 503 — the
// session-34 incident (production start serving db:"down" at 200 while
// every DB route 500'd) is the existence proof that the 200 form lies to
// monitoring. The playwright webServer probe still passes on a healthy
// boot (SQLite auto-creates db/e2e.db on first connect and SELECT 1
// succeeds on the empty file — verified by the fresh-boot e2e run); the
// 503 only fires when SELECT 1 actually fails, exactly the state where
// monitoring needs the signal.
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return ok({ status: "healthy", db: "up" });
  } catch {
    return fail("SERVICE_UNAVAILABLE", "Database unavailable", 503);
  }
}
