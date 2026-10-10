# Session-97 Parity Remediation Plan (2026-10-11)

Session 97 on `main` @ `b48cac9` (the s96 ship `f33020d` + the operator's
docs-only `session_194.md` addition). Fresh clone (the sandbox was reset):
`git clone` → `bun install` → `.env` from `.env.example` (DATABASE_URL
`file:../db/custom.db`, db/ at the repo root, AUTH_SECRET generated) →
`db:push` + `db:seed`. The platform `DATABASE_URL` override hazard
re-confirmed (it exports a parent-of-repo path) — all session-97 repo
operations ran under `env -u DATABASE_URL`.

## Baseline gate

- lint 0/0 ✓ · tsc 0 ✓ · 1849/1849 unit (103 suites) ✓ — exactly the s96
  ship state; census MATCH (24 leads / 15 contacts / 10 accounts /
  12 events / 23 activities + 4 users; the repo db at
  `<repo>/db/custom.db`).

## The standing layers (93rd sweep, NO APP DRIFT)

- **Drift sweep #93**: the reference app-shell bundle re-fetched
  post-login — `index-DZ-xbrIm.js`, md5 `a70a637fcf1d4291da8e0d965676dc11`
  EXACT (1,631,071 bytes) — the **68th consecutive stable session**.
- **The desktop sweep (1440×900, 10 pages)**: the standing table
  reproduced — dashboard 0.43% (within the 0.31+0.5 margin, chart-artifact
  noise) · the rest 0.00–0.01% · settings 4.73% · login 0.27% — the
  **drift gate CLEAN**.
- **The phone sweep (390×844)**: the standing table reproduced — floor
  0.51–0.56% · reports 0.71% · settings 7.34% · login 0.75% — the drift
  gate CLEAN.
- **Reference census #93**: demo data zero · desktop nav normal (256px/8
  links) · **the mobile-nav defect STANDS at TRUE 390×844** (nav w=0, 0
  visible links, NO menu button — the 18th consecutive census).
- **The drawer battery at TRUE 390×844: FULLY GREEN live** (trigger
  16,16 36×36 · panel 288px @ x0 rgb(37,99,235) · 8 links · focus inside
  · dual body+main lock · navigate-close → /Leads with the full release ·
  Escape-close · REOPEN-BEFORE-GROW visible+locked → RESIZE-PAST-MD
  released — the F-96a1-fixed construction).

## The audits

- **97-a (subagent)**: the s96 ship delta (`1d9e722..f33020d`) 7/7
  GENUINE — the src changes verified scoped (the two field constants +
  the ONE w-full signin section), the non-vacuousness independently
  re-proven via a throwaway pre-fix tree (10 failed | 50 passed → 60/60
  reproduced), the drift-gate seams verified (baselines/split/verdict/
  exit-after-restore), the F-96a1 fix verified against the
  mobile-nav.tsx listener premise, the docs counts verified live. **Zero
  REAL findings.** B-97a1 (the reset view's email field rides the fixed
  LOGIN_LAYOUT.field with no re-walk evidence — **CLOSED this session**,
  see the rotation), **B-97a2** (the `--drift-margin` NaN hazard —
  `Number(argv[idx+1])` on a missing/non-numeric value yields NaN,
  `pct > NaN` is always false, silently disarming the gate; the same
  shape as `--max-diff`/`--width`/`--height`), N-97a1 (two stale
  "9-page" comments in sweep.ts — the F-94a1 stale-count genus), N-97a2
  (indentation nano), N-97a3 (worklog phrasing nano).
- **97-b (subagent)**: the graduation audit **13/13 GENUINE — ZERO
  graduations** (~54th consecutive; `git diff f33020d..HEAD -- src/`
  EMPTY). The CSV census 17 sites ZERO unguarded; the source-vocabulary
  clean; the config + SEO/sitemap layers verified (37/37 / 47/47 /
  db-path 20/20). No real findings.

## The operator decisions (57th re-affirmation)

Both STAND, evidence re-verified live: **CSV posture (b)**
(guardFormulaPrefix + qq, the 17-site census, ZERO unguarded live-data
builders; the (b)-vs-(c) `-` exclusion unchanged) and
**source-vocabulary parity** (raw storage, no vocabulary introduced).

## The rotation (97-c)

- **THE DASHBOARD CHART CARDS AT TRUE 390×844 — the last chart surface
  walked: FULL GEOMETRY MATCH, Δ=+0 on ALL 13 elements.** Both apps at
  the zero-data state: the 6 KPI cards 358×130 at y 189/335/481/627/773/
  919 (the sparkline SVGs 324×32 where present); the KPI grids'
  geometry byte-identical (cols/widths/heights); **Sales Pipeline by
  Stage** 358×494 with the chart SVG 308×300 + 5 bars + 5 legend chips;
  **Revenue Over Time** 358×398 with the SVG 308×300 + 2 rows;
  **Top Performing Sales Reps** 358×131 · **Lead Sources** 358×106 ·
  **Upcoming Activities** 358×158 · **Recent Deals** 358×155 @ the
  identical y-ladder (2337/2492/2622/2804). The recharts reflow at phone
  width is at parity.
- **THE 768×1024 TABLET MAIDEN SWEEP** (the s96 suggested next #1, the
  md/sm boundary where the responsive families flip): zero catastrophic
  drift — dashboard 0.06 · contacts 0.09 · leads 0.07 · calendar 0.02 ·
  activities 0.01 · reports 0.00 · profile 0.00 · settings 5.19 (the
  picklist genus at the tablet share) · login 0.44 (the logo genus at
  the tablet share) · **accounts 0.72% — a NEW tablet-width measurement,
  DECODED live as the documented s95 overflow genus at the md boundary**:
  the reference's accounts table rides the bare `flex-1` container and
  POKES OUT (table 535px, main scrollW 567 > clientW 512, main
  h-scroll), ours scrolls in-box (table 472px, min-w-0, scrollW 512 =
  clientW) — the same mechanism as the phone walk, the th distribution
  differing downstream (ref 90/74/77/42/62/81/61/48 vs ours
  73/74/77/42/62/68/61/16). Documented STANDING, ours the consistent
  pattern.
- **B-97a1 CLOSED — the reset view re-walked at TRUE 390×844: FULL
  GEOMETRY MATCH.** Card 358×358 @ (16,243) · the back button y 275
  127×20 · the email label y 399 h16 inline 14px · the input y 425
  294×40 · **the label→input gap 10 on BOTH apps** (the s96 fix's
  computed gap, the `[&>*+*]:mt-1.5` semantics) · the submit y 481
  294×40. The fix's scope extension to the reset view is verified
  correct.

## The remediation set (TDD — RED first, then GREEN)

- **S97-P0 — the sweep's TABLET class** (the rotation's productization):
  `standingBaseline()` gains the 3-way split (`width < 768` phone ·
  `width < 1024` tablet · else desktop — the md/lg banding) +
  `STANDING_BASELINES.tablet` from the maiden run (accounts 0.8 the
  overflow genus · settings 5.5 the picklist genus · login 0.5 the logo
  genus · dashboard 0.1 · the rest 0.1) + the header docs (the tablet
  class line + the accounts genus note). RED-first pins: the 3-way split
  boundaries (767/768/1023/1024), the tablet table (the three genera +
  the every-page-defined doctrine), a driftVerdict demonstration that
  the tablet accounts row passes its own class where the desktop
  baseline would fail it.
- **S97-P1 — the B-97a2 numeric-arg fail-fast**: a PURE
  `parseNumberArg(argv, flag, fallback)` seam (returns the fallback when
  the flag is absent; THROWS listing the valid form when the value is
  missing or non-numeric — the `--pages` typo doctrine extended to the
  numeric family), wired into ALL FOUR numeric flags (`--drift-margin`,
  `--max-diff`, `--width`, `--height`). RED-first pins: the seam
  (absent → fallback · valid → value · missing-value → throw ·
  non-numeric → throw) + the four wiring sites.
- **S97-P2 — the N-97a1 stale-count nanos**: the two "9-page" comments
  in sweep.ts → ten pages.
- **S97-P3 — the `gate:full` composite** (the s96 suggested next #3):
  package.json `gate:full` = the standing gate chain (lint → typecheck →
  test → build → CI=1 e2e) + the three drift sweeps (desktop, phone
  390×844, tablet 768×1024, each `--fail-on-drift`). Pins in
  tests/gate-script.test.ts: the chain order, the three viewport
  classes present, the plain `gate` UNCHANGED.
- **S97-P4 — the screenshots**: 144 (the dashboard chart cards at 390)
  + 145 (the accounts tablet surface at 768) — the VLM battery per the
  house protocol.
- **S97-P5 — the docs**: session_195.md + this plan's execution record
  + the worklog + the count realignment (README badge + AGENTS +
  CLAUDE ×4 + PAD + SKILL v1.94.0) + the CLAUDE-count lockstep
  re-anchor (1849 → the new total).

## Blast radius (pre-checked)

- `scripts/sweep.ts` (the baselines table + the split + the
  parseNumberArg seam + the four flag wirings + the comment nanos + the
  header docs), `package.json` (the ONE new `gate:full` script — the
  existing scripts untouched), `tests/sweep-tool.test.ts` (the new
  pins), `tests/gate-script.test.ts` (the gate:full pins), the docs
  family (screenshots 144/145 + session_195.md + this plan's execution
  record + the worklog + the count sites).
- The existing pins are compatible: the desktop pin rides
  `standingBaseline(1440)` (still desktop under the 3-way split); the
  phone pin's `sb(768) ≠ phone` and `sb(767) = phone` assertions hold
  under the tablet class; the drift-gate wiring pin's
  `driftVerdict(rows, standingBaseline(WIDTH), driftMargin)` string is
  preserved.
- The gate re-run decides everything else (the one-gate discipline).

## The execution record (2026-10-11, session-97)

Executed exactly as planned, RED-first:

- **RED**: 13 new pins — 3 tablet-class + 5 numeric-fail-fast + 1
  stale-comment + 4 gate:full. **12 failed | 29 passed** against the
  pre-fix source (the 13th — the plain-gate-unchanged guard — green
  from the start).
- **Non-vacuousness stash-proven**: stash `scripts/sweep.ts` +
  `package.json` → 12 failed | 29 passed → pop → 41/41.
- **GREEN (S97-P0)**: the 3-way md/lg banding + `STANDING_BASELINES.
  tablet` + the header docs. The tablet drift gate verified CLEAN live
  (accounts 0.72 ≤ 0.8+0.5 · settings 5.19 ≤ 5.5+0.5 · login 0.44 ≤
  0.5+0.5).
- **GREEN (S97-P1)**: the `parseNumberArg()` seam + the four-flag
  wiring; verified live — `--drift-margin` with no value → exit 1 with
  `--drift-margin: expected a number, got nothing (e.g.
  --drift-margin 0.5)`.
- **S97-P2**: the two 9-page comments → ten-page.
- **GREEN (S97-P3)**: the `gate:full` script + 4 pins; the plain
  `gate` byte-identical.
- **S97-P4**: screenshots 144 + 145 (VLM 5/5 + 5/5; one adjudication —
  145's edge crop = the documented overflow genus, a viewport crop).
- **S97-P5**: the docs — session_195.md + this record + the worklog +
  the count realignment (README badge 1994, AGENTS the counts + the
  §Session-97 block, CLAUDE ×4, PAD the s97 row + Total 103/1862,
  SKILL v1.94.0 §16ck + project_state + the H1) + the lockstep
  re-anchor (1849 → 1862; dialog-geometry-parity 19/19).
- **GATE**: lint 0/0 · tsc 0 · unit (103 suites, +13 net → 1862) ·
  build clean · e2e fresh CI=1 (132/132, 3.3m). The closing census
  MATCH; `.env.example` 3 vars standing.
