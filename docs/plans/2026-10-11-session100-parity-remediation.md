# Session-100 Parity Remediation Plan (2026-10-11)

Session 100 on `main` @ `57dca50` (the s99 ship `da618ad` + the
operator's docs-only `session_200.md`, +87 lines, zero src/). The
workspace was RESET — rebuilt from a fresh clone: `bun install` (533
pkgs) + `.env` recreated (`DATABASE_URL="file:../db/custom.db"` +
`NEXT_PUBLIC_SITE_URL` + a fresh `AUTH_SECRET`) + `db:push` + `db:seed`
→ census MATCH (15/24/10/23/12 + 4 users — the seed contract). All ops
under `env -u DATABASE_URL`. The repo `skills/` folder excluded from
checking/testing/compilation throughout.

## Baseline gate

- lint 0/0 ✓ · tsc 0 ✓ · 1872/1872 unit (103 suites) ✓ — exactly the
  s99 ship state.

## The standing layers (96th sweep, NO APP DRIFT)

- **Drift sweep #96 (desktop 1440×900)**: the standing table reproduced
  (dashboard 0.32 · the rest 0.00–0.01 · settings 4.73 · login 0.27) —
  the drift gate CLEAN.
- **The reference bundle md5**: `index-DZ-xbrIm.js`
  `a70a637fcf1d4291da8e0d965676dc11` EXACT (1,631,071 bytes) — the
  **71st consecutive stable session**.
- **Census #96**: demo data zero · desktop nav 256px/8 · the mobile-nav
  defect STANDS at TRUE 390×844 (nav w=0, 0 visible links, NO menu
  button — the **21st consecutive** census; the reference's own bug,
  our drawer the superset).
- **The drawer battery at TRUE 390×844: FULLY GREEN live** (trigger
  16,16 36×36 · panel 288px @ x0 rgb(37,99,235) · 8 links · focus
  inside · dual body+main lock · navigate-close → /Leads with the
  release · Escape-close · the reopen-then-resize construction with the
  release).

## The audits

- **100-a (subagent)**: the s99 ship delta (`ddac209..da618ad`)
  GENUINE **10/10 items** — every construction verified hunk-by-hunk at
  HEAD; the non-vacuousness independently re-proven via a throwaway
  pre-fix tree (**8 failed | 58 passed → 66/66**; the full unit suite
  re-run live 103/1872). **Findings**: F-100a1 REAL (docs-only —
  PAD:779 + SKILL §16cm:8910 say "3 new" its where the true new-its
  count is 2: the same rows' own "+2 its = 1872" arithmetic is the
  truth; the loose "2 new pins … + the explained line" phrasing seeded
  the error) · F-100a2 REAL (docs-only — AGENTS:3548, the §Session-94
  HISTORY block, silently edited "3 new pins" → "2 new pins" by the
  s99 delta — now internally contradictory with its own "3 failed |
  9 passed → 12/12" and contradicted by session_189.md + the s94
  commit message) · N-100a3 NANO (PAD:747 the s68 row "5"→"6
  re-anchored" — a CORRECT but undocumented correction, record-only).
- **100-b (subagent)**: the graduation audit **13/13 GENUINE — ZERO
  graduations** (~57th consecutive; `git diff da618ad..HEAD -- src/`
  EMPTY). The CSV census 17 sites ZERO unguarded (26/26 live); the
  source-vocabulary clean (16/16 live; constants.ts untouched since
  s90); the config layer verified (vitest *.test.ts isolation,
  playwright e2e.db pin + CI=1, .env.example 3 vars); the SEO/sitemap
  layer verified (57/57 live); the space-y census 18/110 exact (19/19
  live).

## The operator decisions (60th re-affirmation)

Both STAND, evidence re-verified live by 100-b: **CSV posture (b)**
(guardFormulaPrefix `/^[=+@\t\r]/` at csv.ts:32 + qq at
entity-export.ts:43; the 17-site census, ZERO unguarded; the
(b)-vs-(c) `-` exclusion unchanged) and **source-vocabulary parity**
(raw storage, no vocabulary introduced since s90).

## The rotation (100-c)

**THE DIFF-CLUSTERING DECODE PROMOTED INTO THE SWEEP TOOL (the
twice-suggested #1 — the s98 suggested next #2, re-suggested at s99)
+ THE 1280×800 XL-BOUNDARY MAIDEN SPOT-CHECK riding the promoted tool
(the s99 suggested next #3).** Every genus hunt since s95 has decoded
its deltas with one-off "bucket-diff" probes — scripts that take the
two PNGs, compute the diff mask, and cluster the differing pixels into
regions (the F-99c1 decode: "the rail band x≈183–503 vs the content
band"; the s94 topbar decode: "the displaced account glyphs + the
hamburger ≈ 1600px"). The promotion makes that decode a one-flag
feature of `bun run sweep` — `--clusters` — so every future drift
investigation starts from the bucket table, not a hand-rolled probe.

- **S100-P0 — the `clusterDiff` PURE seam** (scripts/sweep.ts, beside
  diffPixels): takes the same `(a, b, tol, w, h)` + a `gap` (default
  16); builds the diff mask with the EXACT diffPixels tolerance
  semantics; clusters the diff pixels by a coarse-grid union-find
  (cell = gap px; 8-adjacent marked cells merge — clusters separated
  by less than ~gap px merge, the anti-aliasing-noise absorption);
  returns `{ diffPx, total, pct, buckets }` where each bucket carries
  `{ x0, y0, x1, y1, px, diffShare, frameShare }` (the bbox of its
  diff pixels, its pixel count, its share of the page's total diff,
  its share of the frame — the same unit as the % table), sorted by px
  DESC. Size mismatch throws (the diffPixels parity); a non-positive
  gap throws (the B-97a2 NaN doctrine — the cell math divides by it).
  An identical pair yields zero buckets. PURE by design: pinned in
  tests/sweep-tool.test.ts.
- **S100-P1 — the `--clusters` / `--cluster-gap` CLI wiring**: the
  boolean `--clusters` flag + `--cluster-gap <px>` routed through
  parseNumberArg (the fifth numeric flag); the browser-side diffPair
  evaluate grows the SAME inline decode (the no-bundling doctrine —
  the seam and the browser copy cross-referenced in comments); the
  report prints a per-page bucket table (top 5 by px) after the
  standingExplained line. The gate semantics UNCHANGED (the drift gate
  output byte-identical).
- **S100-P2 — the F-100a1/F-100a2 docs fixes**: PAD:779 "3 new (3
  sweep-tool)" → "2 new (2 sweep-tool)"; SKILL §16cm:8910 "3 NEW" →
  "2 NEW"; AGENTS:3548 the §Session-94 history reverted to "3 new
  pins" (the wrong historical edit undone). N-100a3 recorded here in
  this plan (the PAD:747 s68 correction acknowledged).
- **S100-P3 — the RED-first pins** (8 NEW its + 2 re-anchors):
  the cluster seam family (two synthetic clusters → two buckets with
  exact geometry + shares · closer-than-gap MERGE · farther-than-gap
  stay apart · identical pair → zero buckets · sorted px DESC · size
  mismatch throws · non-positive gap throws) + the wiring pin (the
  flag literals + the parseNumberArg routing + the browser inline +
  the header documentation) + the RE-ANCHORS (the "ALL FOUR numeric
  flags" wiring pin → FIVE with --cluster-gap · the CLAUDE-count
  lockstep 1872 → 1880). **Expected RED: 10 failed** (9 on
  sweep-tool + 1 on dialog-geometry) at the pre-fix source.
- **S100-P4 — the LIVE verification**: (a) the landscape 1024×768
  sweep with `--clusters` — the tool must reproduce the F-99c1 genus
  decode (the accounts buckets at the rail band + the content band);
  (b) the MAIDEN 1280×800 sweep with `--clusters` (report run) — the
  xl-boundary spot-check: the desktop class assignment must hold
  (1280 → desktop per the s99 boundary pin) with every page within the
  desktop baselines + margin, and the accounts rail-squeeze genus
  share must be dead-or-minimal at 1280 (the s99 prediction: the
  squeeze shrinks toward 1280 and dies there); (c) the four standing
  drift gates re-run CLEAN (the banding untouched by this session).
- **S100-P5 — the screenshots**: 150 (a clean desktop-class page at
  1280×800 — the maiden xl-boundary view) + 151 (the accounts page at
  1280×800 — where the rail-squeeze genus dies; VLM-verify the full
  rail + the in-box scroll) — the VLM battery per the house protocol.
- **S100-P6 — the docs**: session_201.md + this plan's execution
  record + the worklog + the count realignment (README badge 2012 +
  the Tested row's s100 additions; AGENTS the counts + the
  §Session-100 block; CLAUDE the counts ×4; PAD the s100 inventory
  row + the Total 103/1880 + the F-100a1 fixes; SKILL v1.97.0 §16cn +
  project_state + the H1) + the CLAUDE-count lockstep re-anchor
  (1872 → 1880).

## Blast radius (pre-checked)

- `scripts/sweep.ts` (the clusterDiff seam + the CLI wiring + the
  browser inline + the header docs), `tests/sweep-tool.test.ts` (8 new
  its + 1 re-anchor), `tests/dialog-geometry-parity.test.ts` (the
  lockstep re-anchor), the docs family (PAD:779 + SKILL:8910 +
  AGENTS:3548 the three F-100a1/F-100a2 one-token fixes; screenshots
  150/151; session_201.md; this record; the worklog; the count sites).
- ZERO src/ changes — the rotation is a tooling + docs session (the
  parity surfaces stand; the promoted decode ACCELERATES future
  sessions without touching app behavior).
- The e2e tree untouched (no browser-test reads clusterDiff).
- The four drift-gate sweeps unchanged in gate:full (the 1280 maiden
  is a spot-check of an EXISTING class boundary, not a new class — no
  fifth sweep unless the maiden run contradicts the desktop
  assignment, in which case the maiden protocol applies: decode first,
  then decide).
- The gate re-run decides everything else (the one-gate discipline).

## The execution record (2026-10-11, session-100)

Executed exactly as planned, RED-first:

- **RED**: 8 new pins (the 7 clusterDiff seam pins + the 1 --clusters
  wiring pin) + 2 re-anchored (the ALL-FIVE parseNumberArg wiring pin
  [+ --cluster-gap] · the CLAUDE-count lockstep 1872 → 1880).
  **10 failed | 53 passed** at the pre-fix source — the 10 enumerated
  by name (9 on sweep-tool + 1 on dialog-geometry), zero
  reconciliation needed.
- **Non-vacuousness stash-proven**: stash `scripts/sweep.ts` +
  `CLAUDE.md` → **10 failed | 53 passed** → pop → **63/63**.
- **GREEN (S100-P0)**: the `clusterDiff` PURE seam (the coarse-grid
  union-find; the size-mismatch throw parity; the non-positive-gap
  fail-fast; buckets sorted px DESC with bbox + shares).
- **GREEN (S100-P1)**: the `--clusters` flag + the FIFTH numeric flag
  `--cluster-gap` (default 16) through parseNumberArg + the
  browser-side inline twin in the diffPair evaluate (the no-bundling
  doctrine, cross-referenced) + the per-page bucket table (top 5) in
  the report + the header documentation. The gate semantics
  UNCHANGED.
- **GREEN (S100-P2)**: the F-100a1 fixes (PAD:779 + SKILL §16cm:8910
  "3 new" → "2 new") + the F-100a2 revert (AGENTS:3548 back to
  "3 new pins" — the wrong historical edit undone). N-100a3 recorded
  in this plan (the PAD:747 s68 correction acknowledged).
- **The LIVE verification (S100-P4)**: (a) the landscape 1024 re-run
  with `--clusters` reproduces the F-99c1 decode — one dominant
  accounts bucket [x 356..1023, y 303..767] 18240px (95.4% of diff,
  2.32% of frame) + the 873px th-distribution sub-bucket; the drift
  gate CLEAN; (b) the MAIDEN 1280×800 spot-check — accounts 0.00%
  (the rail-squeeze genus DEAD at 1280, the s99 prediction
  confirmed); every page within the DESKTOP baselines (dashboard
  0.36 · the rest 0.00–0.01 · settings 4.67 · login 0.34) — the
  desktop class assignment holds, NO fifth class, gate:full
  unchanged; (c) the four standing drift gates re-run CLEAN (desktop
  1440 at the standing layers · landscape 1024 · phone 390 · tablet
  768 post-fix).
- **S100-P5**: screenshots 150 (the dashboard at 1280×800 — the
  maiden xl-boundary view) + 151 (the accounts at 1280×800 — the
  full rail + the in-box table, the genus dead) — **VLM 4/4 + 4/4,
  zero adjudications**.
- **S100-P6**: the docs — session_201.md + this record + the worklog
  + the count realignment (README badge 2012 + the Tested row's s100
  additions + the tree/commands counts; AGENTS the counts + the
  §Session-100 block; CLAUDE the counts ×4; PAD the s100 inventory
  row + the Total 103/1880 + the :358/:793/:1215/:1285 counts + the
  F-100a1 fixes; SKILL v1.97.0 §16cn + project_state + the H1) + the
  CLAUDE-count lockstep re-anchor (1872 → 1880).
- **GATE**: lint 0/0 · tsc 0 · unit (103 suites, +8 net → 1880) ·
  build clean · e2e fresh CI=1 (132/132). The closing census MATCH;
  `.env.example` 3 vars standing.
