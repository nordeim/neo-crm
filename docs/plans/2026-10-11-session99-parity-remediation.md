# Session-99 Parity Remediation Plan (2026-10-11)

Session 99 on `main` @ `ddac209` (the s98 ship `f96c0a9` + the operator's
docs-only `session_198.md`). The workspace survived (no reset): `git pull`
`f96c0a9..ddac209` (session_198.md only) · `.env` standing (DATABASE_URL
`file:../db/custom.db`, db/ at the repo root) · census MATCH (24/15/10/12/23
+ 4 users). All ops under `env -u DATABASE_URL`.

## Baseline gate

- lint 0/0 ✓ · tsc 0 ✓ · 1870/1870 unit (103 suites) ✓ — exactly the s98
  ship state.

## The standing layers (95th sweep, NO APP DRIFT)

- **Drift sweep #95**: the reference app-shell bundle `index-DZ-xbrIm.js`
  md5 `a70a637fcf1d4291da8e0d965676dc11` EXACT (1,631,071 bytes) — the
  **70th consecutive stable session**.
- The desktop sweep (1440×900, 10 pages): the standing table reproduced
  (dashboard 0.32 · the rest 0.00–0.01 · settings 4.73 · login 0.27) —
  the drift gate CLEAN.
- The phone sweep (390×844): the standing table reproduced (floor
  0.51–0.56 · reports 0.71 · settings 7.34 · login 0.75) — CLEAN.
- The tablet sweep (768×1024): the standing table reproduced (accounts
  0.72 the overflow genus · settings 5.19 · login 0.44) — CLEAN.
- **Reference census #95**: demo data zero · desktop nav 256px/8 · the
  mobile-nav defect STANDS at TRUE 390×844 (nav w=0, 0 visible links, NO
  menu button — the **20th consecutive** census; the reference's own bug,
  our drawer the superset).
- **The drawer battery at TRUE 390×844: FULLY GREEN live** (trigger ·
  panel · 8 links · focus inside · dual body+main lock · navigate-close →
  /Leads with the release · Escape-close · the reopen-then-resize
  construction with the release).

## The audits

- **99-a (subagent)**: the s98 ship delta (`2e66455..f96c0a9`) GENUINE
  **9/9 items** — every construction verified hunk-by-hunk at HEAD
  (CardHeader base, legend prop, widened guard, 3-way doc,
  standingExplained seam, the 8+3 pins, docs counts, screenshots,
  .env.example); non-vacuousness independently re-proven via a throwaway
  pre-fix tree (**10 failed | 267 passed → 277/277** across the five
  suites; the full unit suite re-run live 103/1870). **Findings**:
  F-99a1 REAL (docs-only — `Project_Architecture_Document.md:358` still
  reads "1862 checks" in the directory-tree site; the s98 realignment
  updated :778/:779/:792/:1214/:1284 but missed :358; no pin covers the
  PAD tree counts) · N-99a2/N-99a3 NANO (method-documentation only —
  the raw-rg census shorthand vs the pinned grep+strip method; suite
  scopes beside counts).
- **99-b (subagent)**: the graduation audit **13/13 GENUINE — ZERO
  graduations** (~56th consecutive; `git diff f96c0a9..HEAD -- src/`
  EMPTY). The CSV census **17 sites ZERO unguarded** (26/26 live); the
  source-vocabulary clean (16/16 live; constants.ts untouched since
  s90); the config layer verified (the vitest isolation, the playwright
  e2e.db pin, the 3-var .env.example contract); the SEO/sitemap layer
  verified (57/57 live).

## The operator decisions (59th re-affirmation)

Both STAND, evidence re-verified live: **CSV posture (b)**
(guardFormulaPrefix `/^[=+@\t\r]/` at csv.ts:32 + qq at
entity-export.ts:43; the 17-site census, ZERO unguarded; the
(b)-vs-(c) `-` exclusion unchanged) and **source-vocabulary parity**
(raw storage, no vocabulary introduced since s90).

## The rotation (99-c)

**THE 1024×768 LANDSCAPE-TABLET MAIDEN RUN — the s98 suggested next
#1 (the lg boundary where the 2-col grids flip and the w-80 rail
joins).** The maiden sweep (report run, both apps, zero-data):

- **8/10 pages FLAT or standing-family**: contacts 0.00 · leads 0.00 ·
  reports 0.00 · profile 0.00 · calendar 0.02 · activities 0.01 ·
  dashboard 0.47 (the chart artifact at its lg share) · settings 4.74
  (the picklist genus) · login 0.44 (the logo genus).
- **F-99c1 — THE ACCOUNTS OVERFLOW GENUS AT THE LG BAND (2.43%,
  decoded live)**: at 1024 the reference's accounts row is
  `[content flex-1 (BARE)] [rail w-80]` — its table's min-content (535)
  FLOORS the bare flex-1 at 535 (min-width:auto), which SQUEEZES its own
  w-80 rail from 320 to **183** (flex-shrink absorbs the shortfall; its
  filter dropdowns visibly compress) and the row still overflows —
  main scrollW 774 vs clientW 768 (a **+6px poke-out** past the
  viewport). Ours: content `flex-1 min-w-0` = 360 with the table
  (min-content 472) scrolling **in-box** inside the card's
  `overflow-x-auto`, the rail holding its designed full 320 — the
  documented consistent pattern (the s95 overflow genus family at its
  lg-band share; VLM-confirmed visually: ours the narrower card + full
  rail, the reference the wide card + squeezed rail + clipped edge).
  NOT a defect to copy — the reference's own broken flexbox, ours the
  fix. Documented STANDING, banded as its own class.

## The remediation set (TDD — RED first, then GREEN)

- **S99-P0 — the LANDSCAPE class (the 4-way banding)**:
  `STANDING_BASELINES.landscape` from the maiden run (dashboard 0.6 ·
  accounts 2.6 [the overflow genus at its lg share] · the rest 0.1 ·
  settings 4.9 · login 0.5) + the `standingBaseline()` split grows the
  fourth band (`< 1024` tablet · `< 1280` landscape · else desktop —
  the lg/xl breakpoints; 1024 is NOT desktop, the s97 boundary pin
  re-anchored) + the `standingExplained(width)` landscape line (the
  overflow genus at the lg band + the rail squeeze decoded · settings
  ~4.7 · login ~0.44) + the header/STANDING_BASELINES doc comments →
  the 4-way wording.
- **S99-P1 — gate:full grows the landscape sweep**: the package script
  chains the fourth drift sweep (`--width 1024 --height 768
  --fail-on-drift`); the plain `gate` UNCHANGED.
- **S99-P2 — the F-99a1 PAD:358 fix**: the stale "1862 checks" tree
  site → the living count.
- **S99-P3 — the RED-first pins**: NEW its — the landscape table (the
  maiden genera ranges + every PAGES name defined) · the driftVerdict
  landscape contrast (accounts 2.43 passes ITS OWN class where the
  desktop table would fail it) · the standingExplained landscape line
  (the overflow-genus wording + the class boundaries). RE-ANCHORED —
  the s97 boundary pin (3-way → 4-way: 767/768/1023/1024/1279/1280,
  four distinct classes) · the B-98a1 doc pin (3-way → 4-way wording)
  · the N-98a1 explained pin (the boundary mirror: 1024 → landscape,
  1280 → desktop) · the gate:full pins (three → four sweeps; the
  fail-on-drift count) · the CLAUDE-count lockstep pin.
- **S99-P4 — the live verification**: the 1024 sweep `--fail-on-drift`
  → CLEAN under the new landscape class; the other three sweeps
  re-gated (the banding change must not disturb them — 390/768/1440
  keep their classes).
- **S99-P5 — the screenshots**: 148 (the accounts landscape genus at
  1024 — the in-box consistent pattern + the full rail) + 149 (a clean
  FLAT landscape page at 1024) — the VLM battery per the house
  protocol.
- **S99-P6 — the docs**: session_199.md + this plan's execution record
  + the worklog + the count realignment (README badge + the Tested
  row's s99 additions + the gate:full line; AGENTS the counts + the
  §Session-99 block; CLAUDE the counts ×4; PAD the s99 inventory row +
  the Total + the :358 fix; SKILL v1.96.0 §16cm + project_state + the
  H1).

## Blast radius (pre-checked)

- `scripts/sweep.ts` (the landscape table + the 4-way banding + the
  explained line + the two doc comments), `package.json` (the ONE
  gate:full line), `tests/sweep-tool.test.ts` (3 new + 3 re-anchored),
  `tests/gate-script.test.ts` (2 re-anchored),
  `tests/dialog-geometry-parity.test.ts` (the CLAUDE-count lockstep),
  `Project_Architecture_Document.md` (:358 + the s99 row + Total), the
  docs family (screenshots 148/149 + session_199.md + this record +
  the worklog + the count sites).
- ZERO src/ changes — the genus is the reference's own defect family
  (the s95 doctrine: ours the consistent pattern, documented STANDING).
- The e2e tree is untouched (no browser-test reads STANDING_BASELINES).
- The 390/768/1440 class assignments are byte-identical pre/post (the
  new band only claims 1024..1279, previously mis-banded desktop).
- The gate re-run decides everything else (the one-gate discipline).

## The execution record (2026-10-11, session-99)

Executed exactly as planned, RED-first:

- **RED**: 2 new pins (the landscape table + the landscape
  driftVerdict contrast + the standingExplained landscape line) + 5
  re-anchored (the 4-way boundary pin · the B-98a1 doc pin · the
  N-98a1 explained boundary mirror · the gate:full chain + count ·
  the CLAUDE-count lockstep 1870 → 1872). **8 failed | 58 passed**
  at the pre-fix source.
- **Non-vacuousness stash-proven**: stash `sweep.ts` +
  `package.json` + `CLAUDE.md` → **8 failed | 58 passed** → pop →
  **66/66**.
- **GREEN (S99-P0)**: `STANDING_BASELINES.landscape` (dashboard 0.6
  · accounts 2.6 · the rest 0.1 · settings 4.9 · login 0.5) + the
  4-way md/lg/xl banding + the `standingExplained` landscape line +
  the header/type doc comments → the 4-way wording.
- **GREEN (S99-P1)**: gate:full += `bun run sweep -- --width 1024
  --height 768 --fail-on-drift` (the fourth sweep); the plain gate
  byte-identical.
- **GREEN (S99-P2)**: PAD:358 the stale 1862 tree site → the living
  count (with the other five PAD count sites and the README/AGENTS/
  CLAUDE living sites realigned 1870 → 1872).
- **The LIVE re-verification (S99-P4)**: the 1024 sweep
  `--fail-on-drift` → **CLEAN** (accounts 2.43 within its landscape
  baseline; the per-class explained line printing); the desktop +
  phone + tablet sweeps re-gated **CLEAN** post-fix.
- **S99-P5**: screenshots 148 (the accounts landscape genus — the
  in-box consistent pattern + the full rail) + 149 (the clean
  dashboard landscape) — VLM 4/4 + 4/4.
- **S99-P6**: the docs — session_199.md + this record + the worklog
  + the count realignment (README badge 2004 + the Tested row's s99
  additions + the gate:full four-sweep line; AGENTS the counts + the
  §Session-99 block; CLAUDE the counts ×4; PAD the s99 inventory
  row + the Total 103/1872 + the :358 fix; SKILL v1.96.0 §16cm +
  project_state + the H1).
- **GATE**: lint 0/0 · tsc 0 · unit (103 suites, +2 net → 1872) ·
  build clean · e2e fresh CI=1 (132/132). All four drift gates
  CLEAN post-fix. The closing census MATCH; `.env.example` 3 vars
  standing.
