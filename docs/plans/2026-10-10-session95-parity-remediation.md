# Session-95 Parity Remediation Plan (2026-10-10)

Session 95 on `main` @ `c215904` (the s94 ship `2488878` + the operator's
docs-only `session_190.md` addition). The workspace was RESET — a fresh
clone at `c215904`; the environment rebuilt from scratch: `.env` written
(`DATABASE_URL="file:../db/custom.db"` + a generated `AUTH_SECRET`) ·
`bun install` · `db:push` + `db:seed` · the census MATCH
(15/24/10/23/12 + 4 users). The platform `DATABASE_URL` override hazard
CONFIRMED on the fresh sandbox (it exports a parent-of-repo path) — all
session-95 repo operations ran under `env -u DATABASE_URL`.

## Baseline gate

- lint 0/0 ✓ · tsc 0 ✓ · 1832/1832 unit (102 suites) ✓ — exactly the
  s94 ship state; build + e2e deferred to the post-fix gate (the
  one-gate discipline).

## The standing layers (91st sweep, NO APP DRIFT)

- **Drift sweep #91**: the reference bundle re-fetched post-login —
  `https://neo-crm-8ab2c17c.base44.app/assets/index-DZ-xbrIm.js`, md5
  `a70a637fcf1d4291da8e0d965676dc11` EXACT (1,631,071 bytes) — the
  **66th consecutive stable session**.
- **The desktop zero-data sweep** (the ship-cadence run, the s94
  suggested-next #1): the standing table reproduced — dashboard 0.32%
  (the 2px chart artifact) · accounts/contacts/leads/reports/profile
  0.00% · calendar/activities 0.01% · settings 4.73% (the picklist
  genus) — ZERO new drift.
- **The phone-width sweep** (`--width 390 --height 844`): the s94
  maiden table reproduced — the ~0.5% mobile-nav-superset floor on
  every page + settings 7.34% (the picklist genus, the larger share of
  the narrower frame) + reports 0.71% — ZERO new drift.
- **Reference census #91**: demo data zero (the $0.0k family) ·
  desktop nav normal (256px/8 links) · the mobile-nav defect STANDS at
  TRUE 390×844 (nav w=0, 0 visible links, NO menu button — the 16th
  consecutive census).

## The audits (the triple-audit pattern)

- **95-a (subagent)** — the s94 delta re-read line-by-line: GENUINE.
  The phone-width mode verified (the flags feed BOTH the capture
  context and the viewport-tagged dir; the seams untouched; 12/12
  live; tsc 0 with the uncast env construction). The non-vacuousness
  re-proven independently against `git show 7b43516:scripts/sweep.ts`.
  The count-in-comment genus guard: the docs counts verified against
  the live tree (badge 1964, CLAUDE 1832 ×4, PAD §11 all 24 rows,
  SKILL v1.91.0, screenshots byte-exact). Findings: **F-95a1**
  (SKILL:388 §5.6 — a CURRENT-STATE section claims page-layout.ts is
  "300 lines; 37 checks"; the actual is **1520 lines / 180 checks**,
  live-verified) + B-95a2–a9 (borderline historical-record wording,
  no action) + **B-95a8** (sweep.ts:26 documents `--max-diff=<pct>`
  but only the space-separated form parses — the header text is
  wrong, the parser is right).
- **95-b (subagent)** — the graduation audit **13/13 GENUINE, ZERO
  graduations** (the ~52nd consecutive session; `git diff
  86872b8..HEAD --stat -- src/` is EMPTY — the src tree is
  byte-identical to the s94-b base). The CSV guard census re-derived
  (17 sites — 13 live-data builders + the server-owned reports fetch
  + the 3 static templates — ZERO unguarded; csv-formula-guard 10/10
  live). The source-vocabulary census CLEAN (constants.ts diff empty
  since s90; constants 12/12 live). The config layer VERIFIED
  (vitest *.test.ts-only isolation, the pinned e2e db, CI=1 fresh
  boot). The SEO/sitemap layer VERIFIED (the 9-route sitemap, robots,
  manifest, pageMetadata ×18; metadata/pwa/http-headers 37/37 live).
  Findings: **F-95b1** (the 94-b worklog record misrecords ledger
  item 13's first anchor — `page-parts.tsx:448-458` spans the
  contacts-arm LIVE trend row; the dead leads-arm row is `:424-429`
  and TrendStatCard lives at `:625`; the construction is intact at
  both true sites — a citation fix, not a graduation) + **N-95b1**
  (the "47/47 across the four targeted suites" phrasing counts
  csv-formula-guard 10 in the sum — carried in three historical
  records, corrected going forward).

## The operator decisions (55th re-affirmation)

Both STAND, evidence re-verified live this session:

- **CSV formula-injection posture (b)** — `guardFormulaPrefix` at
  csv.ts:32 (the `/^[=+@\t\r]/` regex) through escapeCell + the
  `qq()` seam at entity-export.ts:43; the 17-site builder census,
  ZERO unguarded. The (b)-vs-(c) line (excluding `-`) remains
  correct: guarding `-` would mangle negative numbers and
  dash-prefixed free text for a materially narrower residual vector.
  Session 95 touches no CSV surface.
- **Source-vocabulary documented parity** —
  `LEAD_SOURCE_OPTIONS` (constants.ts:138) +
  `CONTACT_SOURCE_OPTIONS` (:254), raw storage
  (call/email/website/partner/referral). No vocabulary introduced.

## The 95-c rotation — the TABLE family at TRUE 390 (the s94 suggested-next #2)

Walked on BOTH apps at 390×844 (both at the zero-data state — the
reference's own standing state; ours via scripts/zero-data.ts, the
seed restored after):

- **The leads table: FULL GEOMETRY MATCH** — table 380px wide in the
  `relative w-full overflow-auto` scroll box (358px, scrollW 380)
  inside the `rounded-lg shadow` card (358px) on the `p-4 sm:p-8`
  bare page; **thead STICKY top:0, height 63px, bg white**, 9 header
  cells at widths [81,79,0,0,78,61,0,65,16] — the array EXACT on
  both; the empty row 85px; thead at y=1142 EXACT; and the LIVE
  sticky check: scrolling the main scroller by 800 sticks the thead
  to the container top (342 == 342, stuck) on BOTH apps.
- **The contacts table: FULL MATCH** — table 633px in the 324px
  scroll box inside the 326px `rounded-xl` card on the `p-8` page;
  thead static 43px; the zero-data empty row 201px
  ("No contacts found / Try adjusting…") — identical.
- **The accounts table: MATCH on the table surface + one explained
  genus** — table 472px, thead static 43px, 8 columns, the empty row
  85px, thead at y=1040 EXACT (the whole page above renders at
  identical heights). The DIFFERENCE is the horizontal-overflow
  MECHANISM at 390: the reference's accounts column is a bare
  `flex-1` (min-width:auto) so the 472px min-content pokes out past
  the viewport and the MAIN scroller scrolls horizontally (scrollW
  488); OURS adds `min-w-0` so the column keeps the 358px width and
  the table scrolls INSIDE its own overflow-auto box (main never
  h-scrolls). Visually equivalent at first paint (both cards end
  flush at the viewport edge — the phone sweep measures accounts at
  the ~0.5% standing floor); functionally ours matches the
  contacts/leads in-box pattern on BOTH apps. Documented as a
  STANDING EXPLAINED GENUS — do NOT restructure to chase the
  reference's poke-out.

This closes the table-family walk; the interactive-surface program
now reads: dialogs s92 → popovers/menus s93 → tabs s94 → TABLES s95.

## The drawer battery at TRUE 390 (the standing mobile-nav ask)

Re-verified FULLY GREEN with the corrected exact-selector protocol
(the panel `div.h-dvh.w-72` inside `[role="dialog"]`, the panel not
the root): trigger (16,16) 36×36 · panel 288px @ x0 computing
rgb(37,99,235) · 8 links · focus inside · dual body+main lock ·
navigate-close → **/Leads** with the full release (inert +
visibility:hidden + pointer-events:none + both locks freed) ·
Escape-close · the resize-past-md lock release. (One tooling lesson:
a pipeline sanitizer strips the literal `[h` two-char sequence from
displayed outputs — the battery's href selectors were correct all
along; the real fix was the CAPITAL `/Leads` route, the s24
route-case construction.)

## The remediation set (TDD — RED first, then GREEN)

- **S95-P0 — the sweep `--pages` filter** (the s94 suggested-next
  #3): `bun run sweep -- --pages leads,settings` restricts the run to
  the named pages (both the capture and the diff loops) for targeted
  rotation runs; unknown names fail fast listing the valid names; the
  default remains the full 9-page sweep. A PURE seam
  (`parsePagesArg(argv, all)`) exported beside PAGES/TOLERANCE/
  diffPixels, pinned RED-first (4 pins: the subset pick in PAGES
  order, the no-flag default, the unknown-name fail-fast, the wiring
  + header doc). Plus the B-95a8 header fix (document the
  space-separated `--max-diff <pct>` form — the one the parser
  actually reads).
- **S95-P1 — the docs nanos**: F-95a1 (SKILL §5.6 "300 lines; 37
  checks" → 1520 lines / 180 checks) + F-95b1's corrected ledger
  anchors recorded in this session's docs (the worklog is append-only
  history — the correction lands going forward, not by rewriting the
  94-b record) + N-95b1's corrected four-suite phrasing.
- **S95-P2 — the screenshots**: 139 (the leads sticky thead at 390,
  captured mid-scroll with the header stuck) + 140 (the accounts
  table at 390 — the genus) + 141 (the contacts table zero-data at
  390) — VLM 5-question battery per the house protocol.
- **S95-P3 — the docs realignment**: this plan + its execution record
  + `docs/session_191.md` + the worklog + the count realignment
  (README badge + the Tested row's --pages mention, AGENTS the
  §Session-95 block + the counts, CLAUDE the counts ×4, PAD the s95
  inventory row + the Total, SKILL v1.92.0 §16ci + project_state +
  the H1) + the CLAUDE-count lockstep pin re-anchor (1832 → the new
  total, the s92/s93/s94 lockstep pattern).

## Blast radius (pre-checked)

- The sweep.ts change: scripts/sweep.ts only; the new seam is purely
  additive (PAGES/TOLERANCE/diffPixels untouched); the existing 12
  pins re-verified green; the `main()` guard already isolates the
  vitest import.
- The docs nanos: prose-only; no pins anchor on the stale SKILL §5.6
  counts (verified by grep before editing).
- The gate re-run decides everything else (the one-gate discipline).

## The execution record (2026-10-10, session-95)

Executed exactly as planned, RED-first:

- **RED**: the 4 new sweep-tool pins failed against the pre-fix
  source (4 failed | 12 passed — exactly the new pin set, zero
  collateral).
- **Non-vacuousness**: stash the parsePagesArg implementation → RED
  again → pop → GREEN (the stash proof, the s93/s94 pattern).
- **GREEN (S95-P0)**: the `parsePagesArg` seam + the wiring + the
  B-95a8 header fix; the maiden filtered run verified.
- S95-P1 the docs nanos; S95-P2 the screenshots (VLM 5/5 × 3);
  S95-P3 the docs realignment + the lockstep re-anchor.
- **GATE**: lint 0/0 · tsc 0 · unit (102 suites, +4 net → 1836) ·
  build clean · e2e fresh CI=1 (132/132, the mobile-nav suite green
  inside the run).
- **LIVE**: both sweeps re-run clean post-fix; the census MATCH; the
  reference md5-exact (the 66th consecutive stable session).
