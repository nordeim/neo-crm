# Session-94 Parity Remediation Plan (2026-10-10)

Session 94 on `main` @ `7b43516` (the s93 ship + the operator's
docs-only commit `86872b8` — `docs/session_188.md` the operator-added
s93 process narrative). The workspace SURVIVED s93 (the pull
fast-forwarded, tree clean); the environment verified intact without
a rebuild: `.env` with `DATABASE_URL="file:../db/custom.db"` ·
`db/custom.db` + `db/e2e.db` at the repo root · the census MATCH
(15/24/10/23/12 + 4 users). The platform `DATABASE_URL` override
hazard STANDS (the sandbox exports a parent-of-repo path) — all
session-94 repo operations ran under `env -u DATABASE_URL`.

## Baseline gate

- lint 0/0 ✓ · tsc 0 ✓ (the s93 fresh-clone fix holds) · 1829/1829
  unit (102 suites) ✓ — the post-fix gate re-ran the full chain.

## The standing layers (90th sweep, NO APP DRIFT)

Drift sweep #90: the reference bundle re-fetched post-login — md5
`a70a637fcf1d4291da8e0d965676dc11` EXACT (1,631,071 bytes) — the
**65th consecutive stable session**. Reference census #90: demo data
zero (the $0.0k family) · desktop nav normal (256px/8 links) · the
mobile-nav defect STANDS at TRUE 390×844 (vw=390, nav w=0, 0 visible
links, NO menu button — the account alone at LEFT x=16, the standing
explained genus).

## The audits (the triple-audit pattern)

- **94-a (subagent)** — the s93 delta re-read line-by-line: 4/4
  GENUINE-OK (the sweep.ts cast retirement, the topbar genus comment,
  the new pin, the 2 lockstep re-anchors; tsc 0 + the pin 9/9
  re-verified live). The count-in-comment genus guard: the actual
  counts (1829/102/132/9/20/112-space-y) all match the current-state
  claims — but found the **F-94a1–a8 stale-count family** (docs-only):
  the mobile-nav "7-check" quartet (CLAUDE:309, PAD:207, PAD:1346,
  SKILL:359 — the actual suite is 9 checks), the PAD §3.2 tree freeze
  (:358 "77 suites — 1257 checks" / :359 "112 checks" vs the actual
  102/1829/132), the PAD gate-checklist 1191/112 pair, the db-path
  "16 checks" (actual 20), and the PAD §11 Lines-column drift (14
  rows). Plus **N-94a1**: the SKILL project_state's
  "16Session-93" §-mangling.
- **94-b (subagent)** — the graduation audit **13/13 GENUINE, ZERO
  graduations** (the ~50th consecutive session); the CSV guard census
  re-derived (17 call sites — api/export :117, reports :670, accounts
  :192, contacts :258, leads :355, the dashboard ×4, the settings ×4,
  the reports fetch→blob family — ZERO unguarded live-data builders,
  the 3 static templates the documented exception); the
  source-vocabulary diff EMPTY since s90 (no vocabulary introduced);
  the vitest/playwright config layer verified (zero double-pickup,
  the pinned e2e db, the CI=1 fresh boot); the SEO/sitemap layer
  verified (the 9-route sitemap, robots, manifest, the security
  headers, the pageMetadata family, the 47/47 pin re-run).

## The operator decisions (54th re-affirmation)

Both STAND, evidence re-verified live this session:

- **CSV formula-injection posture (b)** — `guardFormulaPrefix` at
  csv.ts:32 (the `/^[=+@\t\r]/` regex) through escapeCell + the
  `qq()` seam at entity-export.ts:43; the builder census above —
  ZERO unguarded. The (b)-vs-(c) line (excluding `-`) remains
  correct: guarding `-` would mangle negative numbers and
  dash-prefixed free text for a materially narrower residual vector.
  Session 94 touches no CSV surface.
- **Source-vocabulary documented parity** —
  `LEAD_SOURCE_OPTIONS` (constants.ts:138) +
  `CONTACT_SOURCE_OPTIONS` (:254), raw storage
  (call/email/website/partner/referral). No vocabulary introduced.

## The 94-c rotation — the tabs family at TRUE 390 (the last unwalked interactive family)

Executed on BOTH apps (agent-browser, TRUE 390×844):

- **The reports PILL strip: FULL GEOMETRY MATCH** — track 358×82 @
  (16,1333) on both; `grid-cols-2 lg:grid-cols-5` reflows to
  "174px 174px" at 390, 5 tabs in 3 rows of 24px, zero gaps, no
  overflow. The page above renders at identical heights (y=1333
  exactly).
- **The settings SEGMENTED strip: FULL MATCH including the defect** —
  3 fractional cols (116.656/116.672/116.656), track 358×36 @
  (16,197), 28px row; "CRM Configuration" scrollWidth > clientWidth
  on BOTH apps (the reference's own whitespace-nowrap clipping,
  mirrored; VLM-adjudicated visually benign).
- **The activities SEGMENTED strip: FULL MATCH** — track 326×36 @
  (32,1057), 4 cols of 79.5px; the only delta is DATA (our seeded
  "Overdue 3" badge vs its zero-data — the reference's own
  construction).
- **THE PROBE-TRAP LESSON** (the corrected drawer battery): a loose
  `aria-label*=menu` selector hits the drawer's hidden CLOSE button
  first (DOM order) — and `visibility:hidden` preserves geometry AND
  offsetParent, so closed-state probes read like open-state ones (a
  programmatic `.click()` also bypasses inert). The battery re-run
  with EXACT selectors: trigger (16,16) 36×36 · panel 288px @ x0
  computing rgb(37,99,235) · 8 links · focus inside · dual body+main
  lock · navigate-close → /Leads · closed root inert + hidden +
  pe-none · Escape-close — **FULLY GREEN**.

## The remediation set (TDD — RED first, then GREEN)

- **S94-P0 — the sweep tool phone-width mode** (the s93
  suggested-next #1): `--width`/`--height` flags (defaults
  1440×900), the parameterized capture viewport, the viewport-tagged
  shots dir (`sweep-shots/w390x844/`), the width-AGNOSTIC per-page
  content-wait (`.locator("main")` — the nav links are display:none
  below md on BOTH apps, so the old nav-a visible-wait burned its
  full 15s timeout per page at 390). RED-first: 3 pins in
  `tests/sweep-tool.test.ts` (one mid-flight pin-shape repair — the
  prettier-wrap class); non-vacuousness stash-re-proven (3 failed |
  9 passed pre-fix → 12/12 post). The MAIDEN 390×844 run: 8 pages at
  the ~0.5% mobile-nav-superset topbar floor (≈1600 displaced px ≈
  0.49% of the frame) + settings 7.34% (the picklist genus, larger
  share) — ZERO new drift; both standing tables documented in the
  tool header.
- **S94-P1 — the docs nanos (F-94a1–a8 + N-94a1)**: the mobile-nav
  9-check quartet (CLAUDE/PAD×2/SKILL), the PAD tree-block
  102/1832/132, the gate-checklist 1832/1832 + 132/132, the db-path
  20 checks, the §11 Lines-column ×14 rows (re-censused by `wc -l`),
  the SKILL §-mangling — all docs-only, zero code surface.
- **S94-P2 — the screenshots**: 136 (the drawer OPEN at TRUE 390,
  re-captured after the probe-trap decode) + 137 (the reports pill
  tabs at 390) + 138 (the settings segmented tabs at 390) — VLM
  5/5 × 3 (one adjudication: 138's clipped-label NO vs the
  DOM-verified shared overflow genus).
- **S94-P3 — the docs realignment**: this plan + its execution
  record + `docs/session_189.md` + the worklog + the count
  realignment (README badge 1964 + the Tested row's phone-width
  mention, AGENTS 1832 + the §Session-94 block, CLAUDE 1832 ×4,
  PAD the s94 inventory row + the Total 102/1832, SKILL v1.91.0
  §16ch + project_state + the H1) + the CLAUDE-count lockstep pin
  re-anchor (1829 → 1832, the same lockstep s92/s93 performed).

## Blast radius (pre-checked)

- The sweep.ts change: scripts/sweep.ts only; the new flags feed the
  existing capture path; the exported seams (PAGES/TOLERANCE/
  diffPixels) untouched; the existing 9 pins re-verified green.
- The docs nanos: prose-only; the two PAD-reading pins (the
  Profile-page.jsx anchor, the space-y census phrase) untouched —
  verified before editing.
- The gate re-run decides everything else (the one-gate discipline).

## The execution record (2026-10-10, session-94)

Executed exactly as planned, RED-first:

- **RED**: the 3 new sweep-tool pins failed against the pre-fix
  source (3 failed | 9 passed — exactly the new pin set, zero
  collateral); one mid-flight pin-shape repair (the `.locator("main")`
  member-form needle — prettier wraps `page` and the member across
  lines; the s93 wrap-repair class).
- **GREEN**: S94-P0 the phone-width mode (4 edits + the standing
  tables in the header); the MAIDEN run green (the table above).
- **Non-vacuousness**: stash the sweep.ts fix → 3 failed | 9 passed
  (RED again) → pop → 12/12 (GREEN) — exactly the modified pin set.
- S94-P1 the docs nanos (F-94a1–a8 + N-94a1, all assert-first or
  MultiEdit-verified); S94-P2 the screenshots (VLM 5/5 × 3, one
  adjudication); S94-P3 the docs realignment + the CLAUDE-count
  lockstep re-anchor.
- **GATE**: lint 0/0 · tsc 0 · **1832/1832 unit** (102 suites, +3
  net) · build clean · **132/132 e2e** fresh CI=1 (3.2m, zero
  flakes; one environmental chromium crash at the first setup —
  clean after the stray-browser cleanup, the full re-run green with
  the mobile-nav suite green inside the run).
- **LIVE**: the drawer battery FULLY GREEN at TRUE 390 (the
  corrected exact-selector run); the tabs family FULL PARITY on all
  three strips; the maiden phone sweep ZERO new drift; the census
  MATCH; the reference md5-exact (the 65th consecutive stable
  session).
