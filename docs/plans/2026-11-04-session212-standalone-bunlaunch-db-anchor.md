# The session-212 plan — THE STANDALONE BUN-LAUNCH DB RE-ANCHOR (the session-34 recovery rejoins the session-170 artifact shape)

Date: 2026-11-04 · Rotation: 212
Task: the operator's standing instruction set — audit + validate the
shipped session-211 state (commit `e21269a` + the owner's transcript
commit `1b093de` — the session_445 transcript is this round's rotation
trigger), re-verify visual + functional parity with the live reference
(`https://neo-crm-8ab2c17c.base44.app/`, logged in with the documented
demo credentials; the named focus: the mobile navigation), re-run the
standing gates, remediate the identified gaps, capture the round's
screenshots, update the docs, and push to `main`.

## 0. The audit (the baseline + the discovery — EXECUTED, one live catch, the third consecutive fresh-clone round)

The workspace was reset again (the standing brief's contingency ran
`git clone`; the standing `.env` contract re-created:
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root;
`bun install` + `db:push` + `db:seed` → db census MATCH 15/24/10/23/12
+ 4 users).

The baseline gate at the exact s211 ship state, ON THE FRESH CLONE:

- lint 0/0 · tsc 0 · **138/2863 unit GREEN** (clean first pass) ·
  build (compiled successfully — the 2 warnings the pre-existing
  Turbopack tracing heuristics) · smoke 14/14 · **e2e 226/226 CLEAN**
  (8.1m; one environment-only wrinkle — the fresh sandbox's Playwright
  1.64.1 wanted chromium-1248, `bunx playwright install chromium`
  cured it, zero code involvement — the s209/s210/s211 precedent).
- probe:ref STABLE at `46bc2d9c` (the demo data still ZERO; the
  conditional gates stay killed).
- **THE FIRST SWEEP WENT RED — the phantom drift**: the desktop
  `--fail-on-drift` sweep failed 7 pages (dashboard 6.37% · accounts
  5.57% · contacts 5.22% · leads 3.78% · calendar 1.29% · activities
  3.51% · reports 6.21% — the s211 record: every page at its standing
  ~0.1% family), and the interior census reported 100-900 unexplained
  events on every data page with ours at ~2x the reference's element
  count (dashboard ours 366 els / h3743 vs ref 187 / h2798 at phone).
  The reference itself was STABLE (probe:ref) — the drift was OUR side
  rendering SEEDED data at the zero-data state.
- **THE DECODE** (live-reproduced at every step): the round had booted
  the standalone production server (`bun run start`) on :3000 and the
  drift gates reused it. The DB was zeroed — yet the server's
  `/api/dashboard` still returned the seed (`totalLeads: 24`). The
  server was reading **`/home/z/my-project/db/custom.db` — a stale
  seeded database OUTSIDE the repo** (176KB, persisted in the parent
  directory from an earlier sandbox era). The chain: `bun run start`
  → bun auto-loads `<repo>/.env` and **absolutizes** the relative
  `file:../db/custom.db` against the .env's own directory →
  `file:/home/z/my-project/db/custom.db` (parent of repo) → the
  standalone `server.js` runs `process.chdir(__dirname)` into
  `.next/standalone` → `runtimeDatabaseUrl()` finds **no `.env` at
  the post-chdir cwd** (the session-170 artifact hygiene removed the
  traced copy) → the session-34 launch-dir recovery — nested inside
  `if (envUrl && isRelativeFileUrl(envFileUrl))` — is **unreachable**
  → bun's absolutized value is mistaken for an intentional override →
  the engine opens the parent-of-repo file.
- **THE BASELINE RE-ESTABLISHED**: standalone server killed, the stale
  parent-of-repo `db/` removed, the dev server booted — **all six
  drift gates CLEAN**: the four-band sweep at `--fail-on-drift` ×4 ·
  the fullpage sweep CLEAN (desktop 0.093% / phone 0.316% — the exact
  standing margins) · the interior census CLEAN at `--fail-on-drift`
  (byte-parity, every delta attributed; the login row unexplained 0,
  els 44/44 — the exact s211 ship state).
- THE PARITY RE-VERIFICATION (the operator's named focus, probed live
  with agent-browser against BOTH apps logged in): **the mobile
  navigation both surfaces working** — the app drawer at 390×844 (the
  Close button + the "CRM" h2 + the 8 destinations; the overlay
  `rgba(0, 0, 0, 0.8)` vs ours `oklab(0 0 0 / 0.8)` — the same 80%
  black; ours the main-scroller lock superset; Escape closes; the
  "Leads" link ride navigates `/Dashboard` → `/Leads` AND auto-closes
  AND releases every lock) — verified on BOTH apps this round + the
  landing disclosure menu working + Tailwind v4 state clean (no config
  file; the CSS-first `@theme`) + SEO/sitemap live-verified (the
  11-route `/sitemap.xml` · `/robots.txt` 200 · `/manifest.json` 200
  `application/json` · the OG/Twitter head tags) + the hygiene legs
  clean (no TODO/FIXME · no `console.log` · the single `any` hit a
  comment word · `.env` + `db/*.db` git-ignored · `bun audit` at the
  pinned census 10 — 4 high / 5 moderate / 1 low, all dev-toolchain
  transitive) + the recent-changes audit (the owner's newest commit
  adds `docs/session_445.md` only; src/ unchanged since the s211
  ship) + the scandihaven repo re-cloned (`61711c3`, unchanged since
  the s208 review).

## 1. The round's material — F-212a: THE STANDALONE BUN-LAUNCH DB MIS-ANCHORING

The s211 close named the next candidates: "the semantic-prose census
remains the named candidate, or a new genus the tree (or the platform)
grows." The round's drift-gate phantom surfaced the genus — **not a
reference-side parity event but a live local defect in the SQLite
path-normalization seam**, shipped since session-170:

- THE TIMELINE: session-34 added the standalone-launch recovery — it
  worked because the standalone artifact then carried Next's traced
  `.env` copy (`writeStandaloneDirectory` copied it; the recovery's
  cwd-side guard could find it). Session-170's artifact-hygiene cure
  (F-170a — the ~550MB artifact problem) excluded `.env` from the
  trace AND added the build script's `rm -f .next/standalone/.env`
  (the double-cure). From that moment the recovery was **dead code**
  for every `bun run start` launch: `envFileUrl` (read at the
  post-chdir cwd) became `undefined`, the `isRelativeFileUrl(undefined)`
  guard went false, and the nested recovery never ran.
- THE MASK (why 42 sessions shipped it green): the smoke test boots
  the artifact with an EXPLICIT `DATABASE_URL` override via `node`
  (respected as intentional → correct); the e2e suite pins
  `DATABASE_URL=file:../db/e2e.db` in the child env (respected →
  correct); the drift gates boot/reuse the DEV server (CWD = repo
  root, `.env` found at the cwd, the first-branch signature fires →
  correct); and the db-path unit test's session-34 fixture WRITES
  `.next/standalone/.env` itself — testing the pre-s170 shape against
  a fabricated tree that no build produces anymore. **The fixture no
  longer mirrors the artifact — the test-blind-spot genus.**
- THE EXPOSURE (what the defect does in the wild): `bun run start`
  per README/DEPLOYMENT silently opens `<repo-parent>/db/custom.db`.
  On a clean machine SQLite creates an EMPTY database outside the repo
  (the production server serves zero data — a silent data absence);
  where such a file persists (a reused parent directory — this
  sandbox's exact case) it serves STALE data — a data-integrity
  hazard. The documented contract ("the standalone server lands on
  `<repo>/db/custom.db` regardless of the process working directory")
  is broken for the one launch form the docs themselves recommend.
- THE OPERATIONAL FACE (how this round caught it): the drift gates
  reuse whatever listens on :3000 — a mis-anchored standalone server
  there poisons every gate with phantom drift (the 7-page RED above).

## 2. The cure (TDD — the root-cause restructure, not a workaround)

**D-212a1 — THE LAUNCH-DIR RECOVERY HOIST** (src-side, one seam):

- `src/lib/db-path.ts` — `runtimeDatabaseUrl()`: the session-34
  launch-dir recovery moves OUT of the
  `if (envUrl && isRelativeFileUrl(envFileUrl))` guard and runs
  whenever the cwd is the validated standalone dir — independent of
  the artifact's `.env` presence. The order: (1) the cwd-side bun
  signature (unchanged — the dev server + the legacy traced-.env
  shape), (2) the hoisted launch-dir signature (the session-34 form,
  now shape-independent: reads `<repo>/.env` at the validated
  standalone root, honors the session-35 RELATIVE-only guard, re-anchors
  through `urlForRoot(launchDir, ref)`), (3) the
  `effectiveDatabaseUrl` passthrough (the intentional overrides —
  e2e/smoke/production absolutes — unchanged). The seam's docstring
  + the file header carry the s212 note (the session-170 shape change
  that orphaned the recovery).

**D-212a2 — THE CURE PINS** (test-side, RED-first at birth):

- `tests/db-path.test.ts` — a new describe for **the session-170
  artifact shape** (the fixture WITHOUT `.next/standalone/.env` — the
  shape every build has produced since s170):
  - it-1 (RED at the stale tree): the bun-absolutized launch value
    re-anchors to `<repo>/db/custom.db` (currently returns the
    parent-of-repo path — the defect's own signature).
  - it-2: the intentional e2e-style relative override still
    re-anchors to `<repo>/db/e2e.db` (keep-green under the new shape).
  - it-3: the intentional ABSOLUTE override still passes through
    untouched (keep-green under the new shape).
  - it-4: the no-junk property — the parent-of-repo `db/` is never
    created by the re-anchor (the `urlForRoot` mkdir lands inside the
    repo only).
  - The legacy session-34 describe KEEPS its fixture + its (the
    traced-.env shape still covered — the backward-compat form), with
    its fixture comment scoped to the pre-s170 shape.

**THE VERIFICATION (the cure's own named proofs):**

- RED-first: exactly 2 RED at the stale tree (the re-anchor it + the
  no-junk it — both carry the defect's signature), zero collateral,
  then the cure → GREEN.
- MUTATION-PROVEN (each planted → exactly 1 RED at its own pin →
  restored → GREEN): the recovery re-nested under the old guard (the
  hoist reverted) → it-1 RED · the session-35 relative-only guard
  dropped → the absolute-override pin RED · the recovery's
  `urlForRoot` swapped for the raw launch absolutization → it-1 RED.
- THE LIVE PROOF: a fresh `bun run build` + `bun run start` on the
  cured tree — the standalone server serves the REPO database (the
  seeded dashboard before the zero, zeros after the zero, the seed
  back after the reseed — via the API), and the parent-of-repo
  `db/` is NEVER recreated.

## 3. The re-anchors (the count ladder + the docs lockstep)

- The count ladder: UNIT 2863 → 2863+N (the N new cure its — counted
  at execution) · SUITES 138 HELD (the pins land in an existing
  file) · E2E 226 HELD · badge 3089 → 3089+N (the unit+e2e
  arithmetic) + `scripts/skill-head-212.py` (the SKILL v1.209.0, the
  s211 layer comment-demoted at its ship counts 2863/226, the s212
  layer live at the new counts, `last_updated` 2026-11-03 → 2026-11-04)
  + the count-ladder script (assert-first, idempotent, unique-anchor)
  + the test-side re-anchors in the same stroke (the docs-counts
  layer-axis: first = s212, second = s211 at its ship 2863/226 · the
  unit negatives ladder: the retired 2863 forms join the negatives).
- The docs lockstep: the AGENTS Session-212 section · the PAD §7.1
  s212 inventory row + the ADR-002-adjacent seam narration note (the
  §4 db-path row) · the README Deployment section's session-34 claim
  scoped (the recovery now shape-independent — the s212 clause) · the
  DEPLOYMENT.md §2 launch narration note · `docs/session_446.md` (the
  transcript) · the worklog Task ID 212 entry · this plan's execution
  record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · 138/(2863+N) unit · build · smoke 14/14 ·
`CI=1 bun run test:e2e` 226/226 · the six drift gates re-run CLEAN
(the cures seam-side only — the resolver's consumers unchanged) · db
census MATCH · `git status` clean of secrets/dbs · the live
standalone proof (§2) at the final tree.

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the
  fresh-clone baseline + the phantom-drift decode + the re-established
  six-gate baseline + the parity battery with agent-browser against
  BOTH apps + the SEO/sitemap curl legs + the hygiene greps + the
  bun-audit tally + the recent-changes diff + the scandihaven
  re-clone).
- D-212a1/D-212a2: RED-first (**exactly 2 RED** at the stale tree —
  the re-anchor it + the no-junk it, both the defect's signature;
  zero collateral: the 22 standing tests + the two override
  keep-guards GREEN) → the cure → **GREEN 24/24** → **MUTATION-PROVEN
  ×3** (the hoist reverted [the recovery re-nested under the cwd-`.env`
  reachability] → exactly 2 RED · the session-35 relative-only guard
  dropped → exactly 1 RED [the absolute-launch-value it] · the
  `urlForRoot` re-anchor swapped for the raw launch absolutization →
  3 RED [every re-anchor-asserting pin] — each restored → GREEN) →
  **THE LIVE PROOF**: a fresh `bun run build` + `bun run start` on the
  cured tree — the standalone server serves the REPO database live
  (the seeded dashboard before the zero · zeros after the zero · the
  seed back after the reseed — via the API) and the parent-of-repo
  `db/` is NEVER recreated.
- The count ladder: **UNIT 2863 → 2867 (+4)** · SUITES 138 HELD ·
  E2E 226 HELD · **badge 3089 → 3093** (the unit+e2e arithmetic:
  2867+226) + `skill-head-212.py` (SKILL v1.209.0 · the s211 layer
  comment-demoted at its ship 2863/226 · the s212 layer live at
  2867/226 · `last_updated` 2026-11-03 → 2026-11-04 · idempotent) +
  `count-ladder-212.py` (assert-first, idempotent, unique-anchor — 26
  flips) + the same-stroke line-census re-anchor (`src/lib/db-path.ts`
  227 → 240 — the s168 doctrine: the PAD §11 row + the ADR-002
  rationale face) + the docs lockstep (the AGENTS Session-212 section
  · the PAD §7.1 s212 inventory row + the ADR-002 rationale's s212
  clause + the §11 line row · the README Deployment section's s212
  scoping · the DEPLOYMENT.md §2 launch note · docs/session_446.md ·
  the worklog entry [Task ID 212] · the docs-counts layer-axis pair
  re-anchored [first = s212 · second = s211 at its ship 2863/226]).
- The captures 717-721 (the dev-server set): the dashboard at 1280 +
  at 390 · the drawer OPEN at phone (the operator's standing
  mobile-nav ask) · the landing mobile menu OPEN at phone · the login
  card.

## The declined list (this round)

- A drift-gate hardening that verifies the :3000 listener's db anchor
  before reusing it (the gates' reuse becomes safe once the seam is
  cured — any correctly-anchored server serves the right DB; a
  listener probe would re-implement the seam's contract at the gate
  layer).
- Re-adding a traced `.env` to the standalone artifact (would
  reintroduce the F-170a secret-shipping hazard the hygiene cure
  closed).
- A doc-wide rewrite of every session-34 narration (the historical
  session layers keep their ship-time form — the standing doctrine;
  the LIVE claim sites get the s212 scoping).
- A mid-rotation eslint/vite-family bump (the standing posture).
- The semantic-prose-claim census (remains the named candidate for a
  future rotation — this round's genus is the seam defect).
- The skills/ mirror (the operator's own domain, the standing
  exclusion).
