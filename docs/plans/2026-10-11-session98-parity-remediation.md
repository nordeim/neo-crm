# Session-98 Parity Remediation Plan (2026-10-11)

Session 98 on `main` @ `2e66455` (the s97 ship `1160405` + the operator's
docs-only `session_196.md`). Fresh clone (the sandbox was reset): `git
clone` → `bun install` → `.env` from `.env.example` (DATABASE_URL
`file:../db/custom.db`, db/ at the repo root, AUTH_SECRET generated) →
`db:push` + `db:seed`. The platform `DATABASE_URL` override hazard
re-confirmed — all session-98 repo operations run under
`env -u DATABASE_URL`.

## Baseline gate

- lint 0/0 ✓ · tsc 0 ✓ · 1862/1862 unit (103 suites) ✓ — exactly the s97
  ship state; census MATCH (24 leads / 15 contacts / 10 accounts /
  12 events / 23 activities + 4 users; the repo db at
  `<repo>/db/custom.db`).

## The standing layers (94th sweep, NO APP DRIFT)

- **Drift sweep #94**: the reference app-shell bundle `index-DZ-xbrIm.js`
  md5 `a70a637fcf1d4291da8e0d965676dc11` EXACT (1,631,071 bytes) — the
  **69th consecutive stable session**.
- The desktop sweep (1440×900, 10 pages): the standing table reproduced
  (dashboard 0.43 within margin · the rest 0.00–0.01 · settings 4.73 ·
  login 0.27) — the drift gate CLEAN.
- The phone sweep (390×844): the standing table reproduced (floor
  0.51–0.56 · reports 0.71 · settings 7.34 · login 0.75) — CLEAN.
- The tablet sweep (768×1024): the standing table reproduced (accounts
  0.72 the overflow genus · settings 5.19 · login 0.44) — CLEAN.
- **Reference census #94**: demo data zero · desktop nav 256px/8 · the
  mobile-nav defect STANDS at TRUE 390×844 (nav w=0, 0 links, NO menu
  button — the **19th consecutive** census).
- **The drawer battery at TRUE 390×844: FULLY GREEN live** (trigger ·
  panel 288px @ x0 · 8 links · focus inside · dual body+main lock ·
  navigate-close → /Leads with the full release · Escape-close · the
  reopen-then-resize construction with the release).

## The audits

- **98-a (subagent)**: the s97 ship delta (`b48cac9..1160405`) GENUINE
  across all 8 items — the non-vacuousness independently re-proven via a
  throwaway pre-fix tree (**12 failed | 29 passed → 41/41** reproduced);
  the sweep seams verified at HEAD (the 3-way split :222-226 · the
  tablet table :200-213 · parseNumberArg :132-148 wired ×4 :429/:438/
  :453/:454 · the drift gate :544); the docs counts live (badge 1994,
  AGENTS/CLAUDE/PAD at 1862+132, SKILL v1.94.0); screenshots valid
  (390×844 / 768×1024 PNGs); .env.example 3 vars.
  **Findings**: F-98a1 REAL (docs/tooling — the N-97a1 cleanup
  incomplete: stale "9 pages/9-page" at scripts/sweep.ts:11 +
  tests/sweep-tool.test.ts:10/:127, and the guard pin :365-367 reads
  only sweep.ts with a too-narrow regex) · B-98a1 BORDERLINE (the
  STANDING_BASELINES doc comment :153-161 still describes the 2-way
  split) · N-98a1 NANO (the "standing explained" print :526 emits the
  desktop-share genera on every run regardless of viewport class).
- **98-b (subagent)**: the graduation audit **13/13 GENUINE — ZERO
  graduations** (~55th consecutive; `git diff 1160405..HEAD -- src/`
  EMPTY). The CSV census **17 sites ZERO unguarded**; the
  source-vocabulary clean (constants.ts untouched since s90); the
  config + SEO/sitemap layers verified (26/26 CSV + 16/16 vocabulary +
  57/57 SEO/db-path live). N-98b1/b2 nanos only.

## The operator decisions (58th re-affirmation)

Both STAND, evidence re-verified live: **CSV posture (b)**
(guardFormulaPrefix `/^[=+@\t\r]/` at csv.ts:32 + qq at
entity-export.ts:43; the 17-site live-data builder census, ZERO
unguarded; the (b)-vs-(c) `-` exclusion unchanged) and
**source-vocabulary parity** (raw storage, no vocabulary introduced
since s90).

## The rotation (98-c)

**THE REPORTS TABS' CHART FAMILY AT TRUE 390×844 — the s97 suggested
next #1.** All FIVE analytics tabs walked live on BOTH apps at the
zero-data state: **24/26 elements FLAT (d=+0)** — every chart card on
Sales Overview (Revenue Over Time, Won vs Lost, Pipeline by Stage, the
Conversion Funnel with its 8 trapezoid bars, the two deal tables),
Pipeline & Forecast (Forecasting Accuracy 434, Pipeline, Forecast by
Probability, the 4-bucket Aging), Activity & Productivity (by Type,
Over Time, vs Wins, the two owner tables), Lead Sources (the three
chart cards + two tables), Account Health (the health distribution +
Top 10 + two tables) — all svg 308×300, all y-ladders identical. The
TWO deltas decoded live:

- **F-98c1 — THE CARDHEADER V4 ROW-GENUS (the M-79c2/s96 family, on a
  NEW surface)**: the two tab-2 table cards ("Open Deals by Stage" +6h
  → 221 vs 215 · "Deals at Risk" +6h/+6y → 253 vs 247). DECODED: the
  table content blocks are byte-identical (77px tables, thead 40, td
  37, same 24px paddings) — the +6 lives in the HEADER block (ours 118/
  150 vs ref 112/144). Our CardHeader base `flex flex-col space-y-1.5
  p-6` + the call-site `flex-row items-center justify-between` override:
  under the reference's v3, space-y-1.5 = margin-TOP on the FOLLOWING
  sibling (the button div — vertically INERT in a row header); under
  our v4 it is margin-BOTTOM on the TITLE (the non-last child), growing
  the flex line's cross-size by 6px when the title is the tallest child
  (the 6-line "Deals at Risk (No Activity 14+ Days)" title at 390).
  Single-child headers are immune (the only child IS :last-child) —
  which is why the Forecasting Accuracy row header and every prior
  walk stayed FLAT. The genus was INVISIBLE to all three sweeps: the
  tab-2 cards are not mounted at the default tab (the s23
  one-panel-per-tab construction) — exactly the gap the rotation
  program exists to close.
- **F-98c2 — THE ACTIVITIES-VS-WINS LEGEND GENUS**: ours renders the
  recharts default `<Legend />` (2 items "Activities"/"Won Deals", a
  24px strip inside the chart) at BOTH 390 and 1440; the reference
  renders **NO legend wrapper at all** on this surface (legendH=null,
  0 items) at both widths — while its sibling "Won vs Lost Over Time"
  DOES render its 2-item legend (FLAT on both apps). The s27
  bundle decode agrees: the Legend is listed for the wonlost charts
  only, never for vs-wins. Our single GroupedBarsChart family shipped
  `<Legend />` unconditionally — the vs-wins legend is OUR addition,
  not a reference mirror.

## The remediation set (TDD — RED first, then GREEN)

- **S98-P0 — the CardHeader v4 row-genus fix (F-98c1)**: the base
  `flex flex-col space-y-1.5 p-6` → `flex flex-col [&>*+*]:mt-1.5 p-6`
  (the M-79c2 doctrine: the v4 expression of the reference's own v3
  COMPUTED semantics — v3 space-y IS mt-on-following; identical gaps in
  column mode, inert in row mode) + the root-cause comment. Census
  impact: card.tsx's only space-y retires → the census 19 files/111
  occurrences → **18/110** (both dialog-geometry pins re-anchored, the
  SKILL census phrase with them). RED-first pins: the base string (no
  space-y-1.5, the mt-variant present) + the two census re-anchors.
- **S98-P1 — the vs-wins legend genus fix (F-98c2)**:
  GroupedBarsChart gains `legend?: boolean` (default **true** — the
  wonlost family keeps its stock Legend, incl. the leads rail); the
  reports tab-3 call site passes `legend={false}`; the s27 pin title
  updated (the wonlost family — vs-wins retired from it). RED-first
  pins: the legend prop seam + the call-site wiring (vs-wins false ·
  tab-1 wonlost + leads wonlost default).
- **S98-P2 — the F-98a1 stale-comment cleanup + pin widening**: the
  three stale sites → ten pages (sweep.ts:11 · sweep-tool.test.ts:10 ·
  :127) + the guard pin WIDENED to read BOTH files with a regex that
  catches every surviving form (`/9-page|the 9 pages/`). RED-first: the
  widened pin fails against the current test file.
- **S98-P3 — the B-98a1 doc comment**: the STANDING_BASELINES comment
  :153-161 → the 3-way wording (phone < 768 · tablet < 1024 · else
  desktop). RED-first pin: the comment mentions the tablet class.
- **S98-P4 — the N-98a1 per-class print**: a PURE exported
  `standingExplained(width)` seam returning the class-appropriate
  genera line (desktop: the picklist/lucide/chart trio · phone: the
  ~0.5% mobile-nav floor + settings ~7.3 · tablet: the accounts
  overflow + settings ~5.2 + login ~0.4), wired into the print.
  RED-first pins: the seam's three returns + the wiring.
- **S98-P5 — the screenshots**: 146 (the reports tab-3 chart family at
  390 post-fix — vs-wins legend-free) + 147 (the tab-2 table cards at
  390 post-fix — the two -6px headers) — the VLM battery per the house
  protocol.
- **S98-P6 — the docs**: session_197.md + this plan's execution record
  + the worklog + the count realignment (README badge + AGENTS +
  CLAUDE ×4 + PAD + SKILL v1.95.0 §16cl + project_state + the H1) +
  the census phrase re-anchor (111 → 110) + the CLAUDE-count lockstep
  re-anchor (1862 → the new total).

## Blast radius (pre-checked)

- `src/components/ui/card.tsx` (the ONE base line + the comment — the
  first src change since the s96 login-card fix), `src/components/
  charts/charts.tsx` (the legend prop), `src/app/(app)/reports/
  reports-page.tsx` (the ONE call-site line + comment),
  `scripts/sweep.ts` (the doc comments + the standingExplained seam +
  the print wiring), `tests/page-layout.test.ts` +
  `tests/charts-internals.test.ts` + `tests/sweep-tool.test.ts` +
  `tests/dialog-geometry-parity.test.ts` (the new pins + the census
  re-anchors), the docs family (screenshots 146/147 + session_197.md +
  this plan's execution record + the worklog + the count sites).
- Computed-geometry safety of the CardHeader base change: column-mode
  headers compute the IDENTICAL 6px gap (mt-on-following = the v3
  semantics); single-child headers carry no margin either way; the
  ONLY computed changes are the two reports row headers (−6px each →
  parity). No test pins the two direct flex-row sites; the
  tabcontent-parity pin :184 counts the ChartCard `headerClassName=`
  escape (untouched).
- The e2e tree carries zero legend assertions; the charts-internals
  `<Legend />` regex still matches the conditional form.
- The gate re-run decides everything else (the one-gate discipline).

## The execution record (2026-10-11, session-98)

Executed exactly as planned, RED-first:

- **RED**: 8 new pins (2 CardHeader row-genus + 2 vs-wins legend + 4
  sweep docs/per-class-print) + 3 re-anchored existing pins (the
  census 110/18 + the s91-header + the SKILL-phrase). **10 failed |
  254 passed** at the pre-fix source (the flex-row count guard green
  by design — the two call sites exist pre-fix).
- **Non-vacuousness stash-proven**: stash `card.tsx` + `charts.tsx` +
  `reports-page.tsx` + `sweep.ts` → **8 failed | 256 passed** → pop →
  264/264 (the 2 docs-guard pins stayed green by design — their doc
  files were not stashed).
- **GREEN (S98-P0)**: the CardHeader base → `flex flex-col
  [&>*+*]:mt-1.5 p-6` + the root-cause comment (worded to keep
  card.tsx out of the raw-grep census file list — the comment names
  the space-y FAMILY, never the hyphenated token). The census
  re-anchored 111/19 → **110/18** (the dialog-geometry file-count +
  total + s91-header + SKILL-phrase pins; the spacey-hazard header;
  both SKILL census-phrase sites — the s96 all-sites precedent).
- **GREEN (S98-P1)**: the `legend?: boolean` prop (default true) +
  the vs-wins call-site opt-out + the s27 pin title updated.
- **GREEN (S98-P2)**: the three stale sites → ten-page; the WIDENED
  guard reads BOTH files with the string-concatenated pattern (the
  pin cannot match its own guard text).
- **GREEN (S98-P3)**: the STANDING_BASELINES doc → the 3-way wording
  (phone < 768 · tablet < 1024 · else desktop).
- **GREEN (S98-P4)**: the PURE `standingExplained(width)` seam (the
  three class lines) wired into the print; the desktop trio no longer
  prints on phone/tablet runs.
- **The LIVE re-walk: 26/26 elements FLAT (d=+0)** — "Open Deals by
  Stage" 215 · "Deals at Risk" 247 · the vs-wins legend wrapper gone
  at BOTH 390 and 1440.
- **S98-P5**: screenshots 146 + 147 (VLM 5/5 + 5/5; one adjudicated
  capture repair on 147 — the scrollIntoView alignment re-captured
  with DOM-verified geometry, both card headers visible).
- **S98-P6**: the docs — session_197.md + this record + the worklog +
  the count realignment (README badge 2002, AGENTS the counts + the
  §Session-98 block, CLAUDE ×4, PAD the s98 row + Total 103/1870,
  SKILL v1.95.0 §16cl + project_state + the H1) + the lockstep
  re-anchor (1862 → 1870).
- **GATE**: lint 0/0 · tsc 0 · unit (103 suites, +8 net → 1870) ·
  build clean · e2e fresh CI=1 (132/132). All three drift gates CLEAN
  post-fix — the first-run phone/tablet FAILs decoded as the
  environmental long-lived-server lesson (a fresh dev-server boot
  reproduced the standing tables exactly; documented in §16cl).
  The closing census MATCH; `.env.example` 3 vars standing.
