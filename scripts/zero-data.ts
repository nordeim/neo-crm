// Session-91 91-c: put the dev database into the ZERO-DATA state (mirroring
// the reference workspace's current empty state) for the apples-to-apples
// screenshot diff sweep. Keeps users + the Setting singleton (auth + the
// settings surface must stay functional); clears the six domain tables.
// Restore afterwards with `bun run db:seed` (idempotent wipe+recreate).
//
// Run: env -u DATABASE_URL bun scripts/zero-data.ts

import { db } from "../src/lib/db";
import { runtimeDatabaseUrl } from "../src/lib/db-path";

async function main() {
  console.log("database:", runtimeDatabaseUrl());
  const r1 = await db.savedReport.deleteMany();
  const r2 = await db.activity.deleteMany();
  const r3 = await db.event.deleteMany();
  const r4 = await db.lead.deleteMany();
  const r5 = await db.contact.deleteMany();
  const r6 = await db.account.deleteMany();
  const r7 = await db.opportunity.deleteMany();
  console.log(
    `cleared: savedReport=${r1.count} activity=${r2.count} event=${r3.count} lead=${r4.count} contact=${r5.count} account=${r6.count} opportunity=${r7.count}`
  );
  const users = await db.user.count();
  const settings = await db.setting.count();
  console.log(`kept: users=${users} setting=${settings}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
