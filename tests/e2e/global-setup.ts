import { execSync } from "node:child_process";

// Global setup: prepare an isolated SQLite database for the E2E run
// (db/e2e.db — schema-pushed + seeded), independent of the dev database.
//
// IMPORTANT: never DELETE the db file between runs. `reuseExistingServer`
// may keep the standalone server (and its open SQLite handle) alive —
// swapping the file underneath leaves the server reading a deleted inode
// (stale data) while later clients read the fresh file. The seed script is
// idempotent IN PLACE (deleteMany + create), which every reader observes.
// NOTE: no import.meta here — Playwright loads this file as CJS.

export default function globalSetup() {
  execSync("bunx prisma db push --accept-data-loss --skip-generate", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: "file:../db/e2e.db" },
  });
  execSync("bun prisma/seed.ts", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: "file:../db/e2e.db" },
  });
}
