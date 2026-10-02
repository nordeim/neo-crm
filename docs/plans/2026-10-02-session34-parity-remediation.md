# Session 34 Plan — the standalone-launch database-path remediation

Date: 2026-10-02 · Branch: `main` · Base: `bee7211` (docs/session_60.md — the operator's session-33 transcript; zero app-code drift)

## Context

Session-33 shipped the dead-control decode closure (commits `8dc063a` + `b72eae2`, gate 799/799 unit · 106/106 e2e, SKILL v1.30.0 §16y). The s59 Next-steps named three pointers: the base44-only AI extraction (no action possible), the Opportunity create/edit UI (absent on BOTH sides — read-only entity, mirrored), and the standing drift re-sweep. This session executes the re-sweep (30th) and a fresh production-start audit — which surfaced a REAL, novel, production-relevant bug in the database path seam.

## Audit results

### Standing layers — 30th consecutive session, NO DRIFT

- Baseline gate GREEN FIRST TRY: lint 0/0 · tsc 0 · 799/799 unit · build clean · 106/106 e2e — matching the docs exactly.
- The reference bundle BYTE-IDENTICAL to the s30..s33 cache (`/assets/index-DZ-xbrIm.js`, 1,631,071 bytes, md5 `a70a637fcf1d4291da8e0d965676dc11`) — no redeploy, FIVE consecutive bundle-stable sessions.
- The reference at a TRUE 390px viewport: 8 nav links in the DOM, **0 visible** (nav box w=0), no hamburger — the mobile-nav defect STANDS (30th session).
- Our drawer spot-verified LIVE both directions on :3000 (the REAL "Open navigation menu" trigger → 8 links visible inside the dialog + body scroll lock; Escape → the wrapper's computed visibility:hidden + unlocked + aria-expanded false).
- Zero 390px horizontal overflow on all nine routes BOTH apps.
- The reference demo data still ZERO (30th) — the zero-data dashboard live-confirms the s32 currency doctrine again ("$0.0k" / "$0.0k" / "$0k").
- Environment: `.env` `file:../db/custom.db` + `db/` at root verified, `.env.example` present, vitest (47 suites) + playwright (3 spec files + setup) configured, uploads/ gitignored, the bundle cache alive outside the repo tree, agent-browser 0.38.1.
- Tailwind v4 stack healthy (postcss plugin + literal-hex `@theme` + the vendored tw-animate.css) — re-verified on the fresh server in Phase C.

### THE NEW FINDING — `bun run start` cannot open the database (production-start bug)

**Symptom (live, reproduced twice):** `bun run start` from the repo root boots, serves
pages, but EVERY database-touching route fails — `POST /api/auth/login` returns
HTTP 500, `GET /api/health` reports `"db":"down"`, and the Prisma log shows
`Error querying the database: Error code 14: Unable to open the database file`.

**Root cause (seam-level, proven):** the bun-absolutization detection in
`src/lib/db-path.ts` compares `process.env.DATABASE_URL` against
`bunAbsolutized(envFileUrl, cwd)` — but the two sides were computed against
DIFFERENT directories:

1. At LAUNCH, `bun run start` runs from the repo root; bun loads `<repo>/.env`
   and absolutizes the relative `file:../db/custom.db` against the LAUNCH cwd
   → `file:/home/z/my-project/db/custom.db` (the PARENT-of-repo location —
   whose directory does not even exist).
2. The standalone `server.js` then runs `process.chdir(__dirname)` (line 6) —
   from that point the process cwd is `<repo>/.next/standalone`.
3. When the Prisma client boots, `runtimeDatabaseUrl()` reads the .env at the
   CURRENT cwd (the traced copy at `.next/standalone/.env`) and computes the
   bun signature with `envFileDir = <repo>/.next/standalone` →
   `file:<repo>/.next/db/custom.db`.
4. `file:/home/z/my-project/db/custom.db` ≠ `file:<repo>/.next/db/custom.db`
   → the env value is treated as an INTENTIONAL OVERRIDE → the absolute URL
   passes through untouched → the engine tries to open the parent-of-repo
   path → SQLITE_CANTOPEN (code 14).

**Empirical proof (all three levels):**

- Live: login 500 + health `db:"down"` + the Prisma error above.
- Seam: `cd .next/standalone && DATABASE_URL="file:/home/z/my-project/db/custom.db" bun -e 'runtimeDatabaseUrl()'` → returns `file:/home/z/my-project/db/custom.db` (the outside-repo passthrough — the detection missed).
- Why 33 sessions never saw it: the DEV server resolves from the repo root (the
  original comparison matches — proven working), and the e2e suite runs the
  standalone server under playwright's `DATABASE_URL` OVERRIDE
  (`file:../db/e2e.db` — an intentional override that the seam correctly
  re-anchors through the standalone cwd anchor). The only broken path is the
  DOCUMENTED production start from the repo root — `bun run start` (README
  "Deployment") — exactly the flow the operator's standing DATABASE_URL
  contract (`file:../db/custom.db`, `db/` at the repo root) is about.

## The remediation — S34-P1..P5

- **S34-P1 — the db-path fix (src/lib/db-path.ts):** in
  `runtimeDatabaseUrl()`, when the cwd-side bun signature does NOT match and
  the process is in the standalone context (`repoRootFromStandaloneCwd()`
  validates a `<repo>` different from the cwd), ALSO test the signature of the
  LAUNCH-directory .env — `bunAbsolutized(<repo>/.env value, <repo>)`. On a
  match, re-anchor through `resolveDatabaseUrl()` (the schema rule →
  `<repo>/db/custom.db`). The pinned public API is unchanged
  (`DEFAULT_DATABASE_URL` / `resolveDatabaseUrl` / `parseEnvFile` /
  `effectiveDatabaseUrl` / `runtimeDatabaseUrl` / `urlForRoot`); the 17
  existing db-path pins are untouched (the dev-context comparison path is
  byte-identical when the cwd is outside `.next`).
- **S34-P2 — the TDD layer (tests/db-path.test.ts, +3 checks):**
  1. RED — "re-anchors a bun-absolutized env var when the standalone server
     was launched from the repo root": temp layout `<tmp>/repo` with
     `prisma/schema.prisma` + `.env` (`file:../db/custom.db`) + a
     `.next/standalone/` cwd (with the traced `.env` copy);
     `process.env.DATABASE_URL` = bun's launch absolutization
     (`file:<parent-of-repo>/db/custom.db`); expect
     `runtimeDatabaseUrl(<tmp>/repo/.next/standalone)` →
     `file:<tmp>/repo/db/custom.db`. Fails today (returns the outside-repo
     passthrough).
  2. GREEN guard — "keeps an intentional e2e-style override when launched
     from the repo root": same layout, `DATABASE_URL=file:../db/e2e.db` →
     still `file:<tmp>/repo/db/e2e.db` (the override re-anchored, unchanged
     behavior).
  3. GREEN guard — "re-anchors when launched from inside .next/standalone":
     `DATABASE_URL` = bun's absolutization against `.next/standalone` →
     still `file:<tmp>/repo/db/custom.db` (unchanged behavior).
- **S34-P3 — the gate:** lint 0/0 · tsc 0 · unit (799 + 3) · build · e2e
  (106).
- **S34-P4 — the LIVE verification (the production server, launched exactly
  per the README):** `bun run start` from the repo root → `GET /api/health`
  reports `db:"up"` → `POST /api/auth/login` 200 with a session → the
  dashboard renders the seeded data (the s32 KPI scales, the s33 header trio +
  filter bar + the functional search) → the Tailwind v4 token render
  (body `#f9fafb` on the app shell).
- **S34-P5 — the deliverables:** the screenshot set re-captured on the dev
  server (02 the dashboard + the standing mobile shots), `.env`/`.env.example`
  re-verified, docs realigned (README badge + the session-34 paragraph +
  the Deployment note, AGENTS counts + the db-path block, CLAUDE counts, PAD
  the s34 test row, SKILL v1.31.0 §16z + frontmatter + project_state,
  docs/session_61.md, this plan's execution record, both worklogs) · commit +
  SSH-wrapper push.

## Validation gates

- RED-first: check (1) above must fail against the current seam (the s29-s33
  TDD doctrine); checks (2)-(3) pass against the current code as expected.
- GREEN: lint 0/0 · tsc 0 · unit (802) · build · e2e (106).
- LIVE: the production server (`bun run start` from the repo root) opens
  `<repo>/db/custom.db` — health `db:"up"`, login 200, dashboard data, the s33
  pins, the Tailwind tokens.

## Deferred (documented, not this session)

The Scan Card / Import AI extraction (base44-only), the Opportunity
create/edit UI (absent on BOTH sides — the read-only entity mirrored), the
reference's dead topbar search + dead accounts View/Format selects (the
s32-documented supersets), and the `.next/standalone` output tracing note
(the tracer copies `db/*.db` + `uploads/` + `.env` into the standalone
folder — build-output-only, gitignored, and the traced `.env` is load-bearing
for the seam).

---

## EXECUTION RECORD (2026-10-02, post-gate)

Executed as planned, S34-P1..P5 all landed:

- **S34-P1**: the db-path fix in src/lib/db-path.ts —
  `repoRootFromStandaloneCwd(dir)` generalized to take a directory,
  `readDatabaseUrlFromEnvAt(dir)` extracted, and `runtimeDatabaseUrl()`
  now ALSO tests the bun signature of the .env at the validated
  standalone repo root (the LAUNCH directory); on a match it re-anchors
  through `urlForRoot(launchDir, ref)`. The pinned public API unchanged;
  the 17 pre-existing db-path pins untouched (verified: 19/19 after the
  fix — 16 pre-existing + 3 new).
- **S34-P2**: RED 1 first (1 failed / 18 passed — the re-anchor check
  failed against the pre-fix seam exactly as predicted; the two guards
  passed against the current code), then GREEN. Gate-caught in the loop:
  the first implementation re-anchored via `resolveDatabaseUrl()` whose
  MODULE anchor won over the standalone anchor in the temp-repo test
  layout — refined to `urlForRoot(launchDir, ref)` so the anchor is
  exactly the validated launch directory.
- **S34-P3**: gate green — lint 0/0 · tsc 0 · 802/802 unit (+3) · build
  clean · 106/106 e2e.
- **S34-P4**: LIVE-verified on the production server launched per the
  README (`bun run start` from the repo root): `/api/health`
  `{"status":"healthy","db":"up"}` · login 200 with a session ·
  `/api/dashboard` serving the seeded workspace (337000 / 126000 / 0 /
  29.2 / 82) · the s33 trio + filter bar rendering the documented parity
  · the Tailwind v4 token render (body #f9fafb) · production server.log
  zero errors.
- **S34-P5**: 4 screenshots (02 re-captured + **42** the
  production-start dashboard NEW + the 11/12 mobile standing shots —
  byte-identical re-captures; 02 + 42 VLM-verified); `.env`/`.env.example`
  re-verified (no env surface change); docs realigned (README badge 908 +
  the session-34 paragraph + the Deployment note, AGENTS 802 + the
  session-34 block, CLAUDE 802 + the db-path paragraph, PAD the s34 row /
  802+106, SKILL v1.31.0 §16z + frontmatter + project_state,
  docs/session_61.md, both worklogs).
- Standing layers: 30th session, NO DRIFT (the bundle md5-identical —
  FIVE consecutive stable sessions, the reference's mobile-nav absence at
  a TRUE 390px, our drawer live both directions, zero overflow both
  apps, the demo data still zero).
- Sandbox hazards recorded in §16z: the tool-call reaper (single-call
  server workflows), the orphaned next-server + playwright
  reuseExistingServer trap, the OOM-killed neighbor (dmesg oom-kill
  before debugging), the wrapper-PID RSS sampling trap.
