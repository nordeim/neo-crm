# Session-101 Parity Remediation Plan (2026-10-11)

Session 101 on `main` @ `ba18bb3` (the s100 ship `1c5af38` + `ef6635b`,
plus the operator's docs-only `session_202.md`, +81 lines, zero src/).
Environment intact from s100: `.env` (`DATABASE_URL="file:../db/custom.db"`
+ `NEXT_PUBLIC_SITE_URL` + `AUTH_SECRET`) + the seeded `db/custom.db` —
census MATCH (15/24/10/23/12 + 4 users). All ops under
`env -u DATABASE_URL`. The repo `skills/` folder excluded from
checking/testing/compilation throughout.

## Baseline gate

- lint 0/0 ✓ · tsc 0 ✓ · 1880/1880 unit (103 suites) ✓ — exactly the
  s100 ship state.

## The audits

- **101-a (subagent)**: the s100 ship delta (`57dca50..ef6635b`)
  GENUINE **12/12 items** — every construction verified hunk-by-hunk at
  HEAD; the non-vacuousness independently re-proven via a pre-fix tree
  (`git checkout 57dca50 -- scripts/sweep.ts CLAUDE.md`; **10 failed |
  53 passed → 63/63**; the full unit suite re-run live 103/1880).
  **Findings**: **F-101a1 REAL (CODE)** — scripts/sweep.ts:487 (the
  node seam) and :700 (the browser twin): the union-find neighbor
  lookup `nk = (cy+dy)*cw + (cx+dx)` carries NO column-bounds guard,
  so `cx=0, dx=-1` WRAPS to the last column of the adjacent row (and
  `cx=cw-1, dx=+1` to the first of the next) — marked cells at
  OPPOSITE HORIZONTAL EDGES falsely merge (proven live: two 16×16
  blocks at x 0..15 and x 144..159, 129px apart, merge into one bucket
  [x 0..159]; no pin covers edge cells) · **F-101a2 REAL (docs)** —
  PAD:779 (the s99 inventory row): the F-100a1 "3→2" fix over-reached
  into the Files column; under the table's own s93–s98 semantics
  (Files = files gaining NEW its: 1/1/1/3/2/3) the true value is **1**
  (only sweep-tool gained its; gate-script + dialog-geometry
  re-anchor-only) · **B-101a-1 borderline** — PAD:780 (the s100 row)
  Files=2, same semantics drift (all 8 new its live in sweep-tool;
  should be 1) · N-101a-1 nano (the "non-positive gap" phrasing vs the
  `gap < 1` guard — record-only) · N-101a-2 nano (AGENTS.md:3938
  `"3 new"its` missing space).
- **101-b (subagent)**: the graduation audit **13/13 GENUINE — ZERO
  graduations** (~58th consecutive; `git diff 1c5af38..HEAD -- src/`
  EMPTY). The CSV census 17 sites ZERO unguarded (70/70 live incl. the
  superset); the source-vocabulary clean (16/16 live; constants.ts
  untouched since s90); the config layer verified (the vitest
  *.test.ts isolation, the playwright e2e.db pin + the in-place
  reseed + CI=1, the 3-var .env.example contract); the SEO/sitemap
  layer verified (57/57 live: metadata 14 + pwa-metadata 14 +
  http-headers 9 + db-path 20).

## The operator decisions (61st re-affirmation)

Both STAND, evidence re-verified live by 101-b: **CSV posture (b)**
(guardFormulaPrefix `/^[=+@\t\r]/` at csv.ts:32 + qq at
entity-export.ts:43; the 17-site census, ZERO unguarded; the
(b)-vs-(c) `-` exclusion unchanged) and **source-vocabulary parity**
(raw storage, no vocabulary introduced since s90).

## The rotation (101-c)

**THE EDGE-WRAP FIX (F-101a1 — the audit's REAL find in the s100 tool)
+ THE DRIFT PROBE PROMOTED INTO A TOOL (the per-session throwaway
probe pattern — the s100-close suggested next #2) + THE 375×812
SECOND-PHONE-WIDTH DRIFT-GATE MAIDEN SPOT-CHECK riding it (the
s100-close suggested next #3).** Every session since s92 has re-run
the same three probe steps as a hand-rolled throwaway — the reference
bundle md5, the reference census (demo data + desktop nav + the
TRUE-390 mobile-nav defect), and the drawer battery already has its
tool. The promotion makes the reference-stability probe a one-command
repo tool — `bun run probe:ref` — so the 97th-and-later sweeps start
from the tool, not a re-derived script. The edge-wrap fix lands first:
the promoted decode must not carry the s100 defect into more hands.

- **S101-P0 — the F-101a1 column-bounds guard**: in BOTH clusterDiff
  copies (the node seam at scripts/sweep.ts:481-491 + the browser
  inline twin at :694-704, the no-bundling doctrine), the neighbor
  loop gains `if (cx + dx < 0 || cx + dx >= cw) continue;` — a cell at
  column 0 must never see column cw-1 as its "neighbor" (and vice
  versa). Vertical out-of-range keys can never collide with a real
  marked cell (the key space is bounded), so the horizontal guard is
  the complete fix. The bbox/share/top-5 outputs of prior --clusters
  runs stand (no real page diff touches both horizontal edges of the
  frame within one row band); the fix is correctness-for-defects-yet-
  unseen, pinned RED-first.
- **S101-P1 — the drift probe promoted** (`scripts/drift-probe.ts`):
  the PURE seams — `pickAppBundle(scripts)` (the largest-JS-by-bytes
  discovery, null on empty), `stabilityVerdict(observed, standing)`
  (STABLE only on exact md5+bytes), `desktopNavVerdict(nav)`
  (STANDING at 256px/8 visible links), `mobileNavVerdict(nav)`
  (DEFECT-STANDS at w=0 · 0 visible links · 0 menu buttons;
  NAV-FIXED when the reference grows any phone navigation — the
  parity re-evaluation trigger), `demoDataVerdict(rows)` (ZERO when
  every walked surface reports 0 data rows), and the `STANDING`
  constants (the bundle `a70a637fcf1d4291da8e0d965676dc11` /
  1,631,071 bytes · desktop 256/8 · the defect triple-zero). The
  Playwright main(): login → collect the loaded script srcs → fetch
  each (bytes) → pick the app bundle → md5 (node:crypto) → the census
  at desktop 1440×900 (contacts/leads/accounts data rows + the nav)
  → the census at TRUE 390×844 (nav width, visible links via
  getClientRects, menu-button count) → the verdict report + exit 1 on
  any CHANGED (probe-gateable). `--json` prints machine-readable.
  package.json gains `probe:ref`. NOT part of `gate`/`gate:full`
  (the reference is a network dependency; the gate stays offline).
- **S101-P2 — the F-101a2/B-101a-1/N-101a-2 docs fixes**: PAD:779
  Files `2` → `1` + PAD:780 Files `2` → `1` (the column's semantics
  pinned by its own s93–s98 history: Files = files gaining NEW its;
  the Location column already lists every touched file) + the
  AGENTS.md:3938 missing space. N-101a-1 recorded here (the
  "non-positive gap" phrasing vs the `gap < 1` guard — the error
  message itself is accurate; record-only, no edit).
- **S101-P3 — the RED-first pins**: sweep-tool +2 (the edge-wrap
  geometry pin — two blocks at OPPOSITE horizontal edges of one row
  band, 129px apart, stay TWO buckets with exact bboxes; the
  browser-twin guard wiring pin — both copies carry the guard, the
  no-bundling doctrine) + the NEW tests/drift-probe-tool.test.ts
  (the pick/stability/nav/demoData/STANDING seam family + the wiring
  pin: the header documentation + the package.json `probe:ref` script
  + the `--json` flag literal) + the CLAUDE-count lockstep re-anchor
  (1880 → the new total). **Expected RED: 13 failed** (2 sweep-tool +
  10 drift-probe-tool + 1 lockstep) at the pre-fix source.
- **S101-P4 — the LIVE verification**: (a) a FRESH dev boot (the s98
  environmental lesson — never gate off a long-lived recompiled
  server); (b) the promoted probe's MAIDEN RUN — `bun run probe:ref`
  must reproduce the standing layers (the bundle md5 EXACT — the 72nd
  consecutive stable; the census: demo zero · desktop 256px/8 · the
  mobile-nav defect STANDS at TRUE 390 — the 22nd consecutive);
  (c) the MAIDEN 375×812 drift-gate spot-check — `bun run sweep --
  --width 375 --height 812 --fail-on-drift` (the s96 plain run stood
  at floor ~0.55 · settings 7.52; the maiden GATE run proves the
  phone-class margin holds at the second walked width); (d) the four
  standing drift gates re-run CLEAN post-fix (desktop 1440 · phone
  390 · tablet 768 · landscape 1024); (e) the drawer battery at TRUE
  390 (the mobile-navigation verification — the operator's standing
  instruction).
- **S101-P5 — the screenshots**: 152 (the dashboard at 375×812 — the
  second-phone-width maiden view) + 153 (the leads table at 375×812 —
  the fractional-column reflow at the iPhone-SE-class width) — the
  VLM battery per the house protocol.
- **S101-P6 — the docs**: session_203.md + this plan's execution
  record + the worklog + the count realignment (README badge + the
  Tested row's s101 additions; AGENTS the counts + the §Session-101
  block; CLAUDE the counts ×4; PAD the s101 inventory row + the
  Total; SKILL v1.98.0 §16co + project_state + the H1) + the
  CLAUDE-count lockstep re-anchor (1880 → the new total).

## Blast radius (pre-checked)

- `scripts/sweep.ts` (the two guards — the seam bodies only, the CLI
  wiring untouched), `scripts/drift-probe.ts` (NEW),
  `package.json` (+`probe:ref`), `tests/sweep-tool.test.ts` (+2 its),
  `tests/drift-probe-tool.test.ts` (NEW suite),
  `tests/dialog-geometry-parity.test.ts` (the lockstep re-anchor),
  the docs family (PAD:779/:780 + AGENTS:3938 + the count sites +
  screenshots 152/153 + session_203.md + this record + the worklog).
- ZERO src/ changes — the rotation is a tooling + docs session (the
  parity surfaces stand; the F-101a1 fix touches the sweep TOOL, not
  the app).
- The e2e tree untouched (no browser-test reads clusterDiff or the
  probe).
- The four drift-gate sweeps unchanged in gate:full (the 375 maiden
  is a spot-check of the EXISTING phone class — no sixth sweep; the
  class banding `< 768 → phone` already covers 375).
- The gate re-run decides everything else (the one-gate discipline).

## The execution record (2026-10-11, session-101)

Executed exactly as planned, RED-first:

- **RED**: 2 new sweep-tool pins (the edge-wrap geometry pin — two
  16×16 blocks at x 0..15 and x 144..159 stay TWO buckets; the
  browser-twin guard wiring pin — the guard present TWICE) + the NEW
  drift-probe-tool suite (10 its: pickAppBundle largest +
  null-on-empty · stabilityVerdict STABLE/CHANGED ×2 ·
  desktopNavVerdict · mobileNavVerdict DEFECT-STANDS + NAV-FIXED ×2
  · demoDataVerdict · the STANDING constants · the wiring pin with
  the offline-gate negative) + the CLAUDE-count lockstep re-anchor
  (1880 → 1892). **13 failed | 62 passed** at the pre-fix source —
  the 13 enumerated by name (2 sweep-tool + 10 drift-probe-tool + 1
  dialog-geometry), zero reconciliation needed. The RED run itself
  proved F-101a1 live: the two edge blocks merged into ONE
  [x 0..159] bucket.
- **Non-vacuousness stash-proven**: stash `scripts/sweep.ts` +
  `scripts/drift-probe.ts` + `package.json` + `CLAUDE.md` → **13
  failed | 62 passed** → pop → **76/76**.
- **GREEN (S101-P0)**: the column-bounds guard
  `if (cx + dx < 0 || cx + dx >= cw) continue;` in BOTH clusterDiff
  copies (the node seam + the browser inline twin, the no-bundling
  doctrine, both sites cross-commented).
- **GREEN (S101-P1)**: `scripts/drift-probe.ts` (the PURE seam
  family + the STANDING constants + the Playwright main: login →
  the POST-LOGIN script inventory → the largest-JS bundle discovery
  → the node:crypto md5 → the demo-data census → the desktop census
  → the TRUE-390 census → the verdict report; `--json`; exit 1 on
  any CHANGED) + the package.json `probe:ref` script.
- **GREEN (S101-P2)**: PAD:779 Files 2 → 1 + PAD:780 Files 2 → 1 +
  the AGENTS:3938 space. N-101a-1 recorded in this plan (no edit —
  the error message itself is accurate).
- **The LIVE verification (S101-P4)**: (a) fresh dev boot; (b) the
  probe's MAIDEN RUN reproduced the standing layers — the bundle
  `index-DZ-xbrIm.js` md5 `a70a637fcf1d4291da8e0d965676dc11` (1,631,071
  bytes) **STABLE (the 72nd consecutive)**; census #97: demo zero
  (contacts 0 · leads 0 · accounts 0 data rows) · desktop 256px/8
  STANDING · **the mobile-nav defect STANDS at TRUE 390 (the 22nd
  consecutive)**; (c) the MAIDEN 375×812 drift-gate spot-check
  CLEAN — floor 0.55–0.59 · settings 7.52 · login 0.82, every page
  within the phone baselines; (d) all four standing drift gates
  re-run CLEAN post-fix (the desktop standing table reproduced:
  dashboard 0.32 · the rest 0.00–0.01 · settings 4.73 · login
  0.27); (e) the drawer battery FULLY GREEN live (trigger 16,16
  36×36 · panel 288px @ x0 rgb(37,99,235) · 8 links · focus inside
  · dual lock · navigate-close → /Leads with the release ·
  Escape-close · the reopen-then-resize construction).
- **S101-P5**: screenshots 152 (the dashboard at 375×812 — the
  seeded KPI ladder + the hamburger topbar) + 153 (the leads table
  at 375×812 — the seeded rows + the in-card scroll) — **VLM 4/4 +
  4/4, zero adjudications**.
- **S101-P6**: the docs — session_203.md + this record + the worklog
  + the count realignment (README badge 2024 + the Tested row's
  s101 clause; AGENTS the counts + the §Session-101 block; CLAUDE
  the counts ×4; PAD the s101 inventory row + the Total 104/1892 +
  the F-101a2/B-101a-1 fixes; SKILL v1.98.0 §16co + project_state +
  the H1) + the CLAUDE-count lockstep re-anchor (1880 → 1892).
- **GATE**: lint 0/0 · tsc 0 · unit (104 suites, +12 net → 1892) ·
  build clean · e2e fresh CI=1 (132/132). The closing census MATCH;
  `.env.example` 3 vars standing.
