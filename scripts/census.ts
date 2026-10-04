// DB census: prints the resolved database path + per-model counts, and
// compares them against the seed contract.
//
// Why this exists (session-53, S53-P2 — the N-53b lesson, pinned by
// tests/db-census.test.ts):
//   • a raw `new PrismaClient()` run from the repo root opens
//     <sandbox-root>/db/custom.db — NOT <repo>/db/custom.db — under BOTH
//     node (the relative `file:` URL from the repo .env resolves against
//     the process CWD, not the schema dir) and bun (which additionally
//     absolutizes the .env value against the .env location — the same
//     outer path). Session-53 proved this live: the orchestrator's own
//     intake census read the sandbox-root mirror db (which still carries
//     the s51 zombie server's probe event) and briefly misread it as
//     repo-db residue; `PRAGMA database_list` revealed the engine's true
//     file, and the repo db itself had been pristine all along.
//   • the closure: censuses go through the app's own client — the SAME
//     singleton the running server uses (`src/lib/db`, re-anchored by
//     runtimeDatabaseUrl) — and PRINT the resolved URL, so every count
//     is bound to a named file. A count without its path is not
//     evidence.
// The expected counts are the prisma/seed.ts row counts; a mismatch is
// probe residue unless you deliberately added data (reseed with
// `bun run db:seed` to restore the contract).
//
// Run: bun run db:census   (or: bun scripts/census.ts)

import { db } from "../src/lib/db";
import { runtimeDatabaseUrl } from "../src/lib/db-path";

// The seed contract — prisma/seed.ts's row counts (contacts / leads /
// accounts / activities / events + users). Keep in sync with the seed.
const EXPECTED = {
  contacts: 15,
  leads: 24,
  accounts: 10,
  activities: 23,
  events: 12,
  users: 4,
} as const;

type Counts = Record<keyof typeof EXPECTED, number>;

async function main(): Promise<void> {
  const url = runtimeDatabaseUrl();
  const [contacts, leads, accounts, activities, events, users] = await Promise.all([
    db.contact.count(),
    db.lead.count(),
    db.account.count(),
    db.activity.count(),
    db.event.count(),
    db.user.count(),
  ]);
  const counts: Counts = { contacts, leads, accounts, activities, events, users };

  console.log(`database: ${url}`);
  console.log(
    `counts: contacts=${contacts} leads=${leads} accounts=${accounts} ` +
      `activities=${activities} events=${events} users=${users}`,
  );

  const drift = (Object.keys(EXPECTED) as Array<keyof typeof EXPECTED>).filter(
    (k) => counts[k] !== EXPECTED[k],
  );
  if (drift.length > 0) {
    const detail = drift.map((k) => `${k}=${counts[k]} (expected ${EXPECTED[k]})`).join(", ");
    console.error(`pristine: MISMATCH — ${detail}`);
    console.error("Probe residue? Remove it, or reseed in place: bun run db:seed");
    await db.$disconnect();
    process.exit(1);
  }
  // Session-54 (S54-P3, N-54d): the banner DERIVES from EXPECTED — the
  // s53 form hardcoded "15/24/10/23/12 + 4 users", so a future EXPECTED
  // re-sync would have left the printed contract silently stale.
  const contract =
    (Object.keys(EXPECTED) as Array<keyof typeof EXPECTED>)
      .filter((k) => k !== "users")
      .map((k) => EXPECTED[k])
      .join("/") + ` + ${EXPECTED.users} users`;
  console.log(`pristine: MATCH (${contract} — the seed contract)`);
  await db.$disconnect();
}

// Only take over the process when executed directly (not when imported by
// the Vitest suite).
const invokedAsScript = process.argv[1]?.endsWith("census.ts");
if (invokedAsScript) void main();
