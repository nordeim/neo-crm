# The session-213 plan — THE SEMANTIC-PROSE LAYOUT-CONTRACT CENSUS (the AGENTS conventions block's semantic claims join the pin)

Date: 2026-11-04 · Rotation: 213
Task: the operator's standing instruction set — audit + validate the
shipped session-212 state (commit `838db00` + the owner's transcript
commit `b0bb8cd` — the session_447 transcript is this round's rotation
trigger), re-verify visual + functional parity with the live reference
(`https://neo-crm-8ab2c17c.base44.app/`, logged in with the documented
demo credentials; the named focus: the mobile navigation), re-run the
standing gates, remediate the identified gaps, capture the round's
screenshots, update the docs, and push to `main`.

## 0. The audit (the baseline — EXECUTED, zero live defects, the continued-workspace round)

The workspace SURVIVED this round (the repo intact at `838db00`, the
`git pull` fast-forwarding only `docs/session_447.md` — the owner's
transcript commit `b0bb8cd`). The standing `.env` contract verified in
place (DATABASE_URL="file:../db/custom.db" with `db/` at the repo
root; db census MATCH 15/24/10/23/12 + 4 users) — and, the s212
lesson applied at the gate layer: the :3000 listener's DB anchor
PROBED before the drift gates reused it (the dev server, cwd = the
repo root — the correctly-anchored form; the parent-of-repo `db/`
absent, the s212 cleanup holding).

The baseline gate at the exact s212 ship state:

- lint 0/0 · tsc 0 · **138/2867 unit GREEN** (clean first pass) ·
  build (compiled successfully — the 2 warnings the pre-existing
  Turbopack tracing heuristics) · smoke 14/14 · **e2e 226/226 CLEAN**
  (8.2m) · db census MATCH.
- **THE SIX DRIFT GATES ALL CLEAN**: probe:ref STABLE at `46bc2d9c`
  (the demo data still ZERO) · the four-band sweep at
  `--fail-on-drift` ×4 (desktop 1280 · phone 390x844 · tablet
  768x1024 · landscape 1024x768) · the fullpage sweep CLEAN (desktop
  0.093% / phone 0.316% — the exact standing margins) · the interior
  census CLEAN at `--fail-on-drift` (byte-parity, every delta
  attributed).
- THE PARITY RE-VERIFICATION (the operator's named focus, probed live
  with agent-browser against BOTH apps logged in): **the mobile
  navigation both surfaces working** — the app drawer at 390×844 (the
  Close button + the "CRM" h2 + the 8 destinations; the overlay
  `rgba(0, 0, 0, 0.8)` vs OURS `oklab(0 0 0 / 0.8)` — the same 80%
  black, the v4 serialization; ours the body+main dual lock vs the
  reference's body-only — the documented superset; Escape closes +
  releases every lock; the "Leads" link ride navigates `/Dashboard` →
  `/Leads` AND auto-closes AND releases every lock — verified on BOTH
  apps this round) + the landing "Toggle navigation" disclosure menu
  working on BOTH apps (the 6 links; ours the aria-expanded superset;
  the in-panel FAQ ride lands `/#faq` + collapses).
- Tailwind v4 state CLEAN (no config file — the CSS-first `@theme`).
  SEO/sitemap live-verified on the dev server (the 11-route
  `/sitemap.xml` · `/robots.txt` 200 with the Sitemap line ·
  `/manifest.json` 200 `application/json` · the OG/Twitter/canonical
  head tags). The hygiene legs clean (no TODO/FIXME · no
  `console.log` · the single `any` hit a comment word · `.env` +
  `db/*.db` git-ignored · `bun audit` at the pinned census 10 — 4
  high / 5 moderate / 1 low, all dev-toolchain transitive). The
  recent-changes audit: the owner's newest commit adds
  `docs/session_447.md` only; src/ last touched at the s212 ship. The
  scandihaven reference repo re-checked (`61711c3`, unchanged).

## 1. The round's material — F-213a: THE SEMANTIC-PROSE RESIDUE (the named candidate, scoped to its first mechanically-checkable family)

The s212 close named the next candidates: "the semantic-prose census
remains the named candidate, or a new genus the tree (or the platform)
grows." The round's fresh-eyes walk found NO live defect — the tree is
fully green at the exact s212 ship state, the reference STABLE, the
docs holding (the prose-claim samples verified live: the icon cascade
· the z-scale inventory · the delta tokens · the validation seam · the
eslint ignores). So the round's material IS the named candidate — the
genus-closing pin, the s208/s209 precedent (the doc family clean, the
pin the material):

- THE GENUS: every mechanically-checkable doc-claim family is pinned
  (the commands/paths/ADRs at D-208a1 · the env face at D-205a2 ·
  the strictness doc-family at D-206a1 · the chart-stack rows at
  D-207b1 · the push-ritual remote at D-209a2 · the counts at
  docs-counts) — but the AGENTS **"Conventions that differ from
  defaults"** block, the F-206a HOME BLOCK (the stale strictness
  claim lived there 31 sessions), still carries SIX semantic claims
  that ride on the rotation audit's fresh eyes alone:
  1. the VALIDATION-SEAM claim (zod ^4 · `src/lib/schemas.ts` +
     `parseBody()` in `src/lib/api.ts` · the asString/asNumber/asDate
     URL-param helpers);
  2. the ICON-CASCADE claim (lucide-react · the sidebar nav icons
     uniform `h-5 w-5` stroke-2, no active/inactive variation · the
     topbar mail/bell + search icons `h-5 w-5` · the content icons
     `h-4 w-4`);
  3. the DELTA-TEXT claim (`text-green-600` / `text-red-600` — not
     the success/danger tokens, "those stay on badges");
  4. the Z-SCALE claim (topbar z-40 · drawer/dialogs z-50 · dropdown
     portals z-[60] · toasts z-[100] · no ad-hoc `z-[9999]`);
  5. the ESLINT-IGNORES claim (`skills/` + the build output dirs);
  6. the CHARTS bullet (recharts DEFAULTS · the REAL chart renders at
     all-zero data — the one chart-doctrine face D-207b1 never
     covered: AGENTS).
- THE EXPOSURE (the genus's bite, the F-206a precedent made
  mechanical): any of these claims can rot silently — a token flip
  (`h-5 w-5` → `h-6 w-6`), a new ad-hoc z-tier (`z-[9999]` planted
  for a "quick fix"), a delta-text re-token, an eslint-ignore trim —
  and every gate stays GREEN (no pin reads the block; the pixel
  sweeps would catch only the RENDERED subset, and only if the
  reference itself moved).

## 2. The cure (TDD — the genus-closing pin, test-side only, src/ untouched)

**D-213a1 — THE CONVENTIONS-BLOCK SEMANTIC CENSUS PIN** (a new
describe in `tests/facts-census.test.ts` — the D-204a1/D-205a1/D-207b1
home; the F-109a1 live-read doctrine throughout):

- it-1 THE VALIDATION-SEAM CLAIM: the AGENTS section carries the
  claim strings (zod ^4 · `src/lib/schemas.ts` · `parseBody()` · the
  three helper names); LIVE: the installed zod's major is 4 (the
  `installed()` helper) · `src/lib/schemas.ts` exists + non-empty ·
  `src/lib/api.ts` exports parseBody + asString + asNumber + asDate.
- it-2 THE ICON-CASCADE CLAIM: the section carries `h-5 w-5` +
  `h-4 w-4` + stroke-2; LIVE (the imported tokens — the live-read
  doctrine): NAV_LAYOUT.icon · TOPBAR_LAYOUT.iconClass ·
  TOPBAR_LAYOUT.searchIcon · MOBILE_NAV_TRIGGER.icon each carry
  `h-5 w-5`; the content tokens (FILTER_BAR.selectIcon ·
  FILTER_BAR.barBtnIcon · TOPBAR_LAYOUT.userChevron ·
  LOGIN_LAYOUT.inputIcon) each carry `h-4 w-4`; sidebar.tsx renders
  its icons at `strokeWidth={2}` with NO conditional strokeWidth (the
  no-variation claim).
- it-3 THE DELTA-TEXT CLAIM: the section carries both delta classes;
  LIVE: DELTA_TEXT.good === "text-green-600" · DELTA_TEXT.bad ===
  "text-red-600" · the hand-inlined delta site (page-parts.tsx)
  carries `text-green-600` and NOT the success/danger tokens · the
  badge family (toast.tsx) carries text-success/text-danger — the
  "those stay on badges" split proven.
- it-4 THE Z-SCALE CENSUS (the genus arm — the D-205a2 census form):
  walk comment-stripped `src/**/*.{ts,tsx}` for every z-tier; assert
  the tier set ⊆ {10, 40, 50, 60, 100} (the flat scale — any new
  tier trips the census) · the four claimed tiers each PRESENT ·
  `z-[9999]` absent · the section carries the four tier claims + the
  ban.
- it-5 THE ESLINT-IGNORES CLAIM: the section carries the skills/
  claim; LIVE: eslint.config.mjs ignores carry `skills` + the build
  output dirs (node_modules · .next · out · build).
- it-6 THE CHARTS-BULLET AGENTS FACE (the D-207b1 straggler site):
  the section carries "recharts DEFAULTS" + "the REAL chart renders
  at all-zero data" + "fixed lists render ticks at zero,
  row-derived series render empty".

**THE VERIFICATION (the pin's own named proofs):**

- Born-green at the cured tree expected (the audit verified every
  claim live — the D-208a1 precedent: the doc family clean, the pin
  the material; the count +6).
- MUTATION-PROVEN (each planted → exactly 1 RED at its own pin →
  restored → GREEN): M1 NAV_LAYOUT.icon → "h-6 w-6" (the src-side
  icon mutation) · M2 the AGENTS icons bullet `h-5 w-5` → `h-4 w-4`
  (the doc-side arm) · M3 a `z-[9999]` planted in a src file · M4
  `skills` dropped from the eslint ignores · M5 DELTA_TEXT.good →
  "text-success" · M6 `parseBody` renamed in api.ts.
- STASH-PROOF: the round's describe stashed → exactly 138/2867 (the
  s212 ship state) → restored → 138/2873.

## 3. The re-anchors (the count ladder + the docs lockstep)

- The count ladder: UNIT **2867 → 2873 (+6)** · SUITES 138 HELD (the
  pins land in an existing file) · E2E 226 HELD · badge **3093 →
  3099** (the unit+e2e arithmetic: 2873+226) + `skill-head-213.py`
  (the SKILL v1.210.0, the s212 layer comment-demoted at its ship
  counts 2867/226, the s213 layer live at 2873/226, `last_updated`
  stays 2026-11-04 — the same-day form; idempotent) +
  `count-ladder-213.py` (assert-first, idempotent, unique-anchor) +
  the test-side re-anchors in the same stroke (the docs-counts
  layer-axis: first = s213, second = s212 at its ship 2867/226 · the
  unit negatives ladder: the retired 2867 forms join the negatives ·
  the dialog-geometry-parity F-92a3 ladder: the four CLAUDE live
  positives re-anchored 2873).
- The docs lockstep: the AGENTS Session-213 section · the PAD §7.1
  s213 inventory row · `docs/session_448.md` (the transcript) · the
  worklog Task ID 213 entry · this plan's execution record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · **138/2873 unit** · build · smoke 14/14 ·
`CI=1 bun run test:e2e` 226/226 · the six drift gates re-run CLEAN
(the cures test-side only — no src touch, but the house proves it) ·
db census MATCH · `git status` clean of secrets/dbs.

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the
  continued-workspace baseline + the six-gate sweep + the parity
  battery with agent-browser against BOTH apps + the SEO/sitemap
  curl legs + the hygiene greps + the bun-audit tally + the
  recent-changes diff + the scandihaven re-check + the :3000
  listener's DB-anchor probe — the s212 lesson applied).
- D-213a1: **born-green after two anchor-form cures** (the first run
  3 RED — the REPORTS_FILTER_BAR token mis-anchor
  [FILTER_BAR.selectIcon is undefined; the keys live in
  REPORTS_FILTER_BAR] + two wrap-blind prose anchors [the AGENTS
  lines wrap mid-phrase: "dropdown\n portals z-[60]" · "ticks at\n
  zero"] — the pin's own flaws, not live findings, cured in place
  with the flattened-section anchor form — the D-208a1 birth
  precedent) → **GREEN 57/57** at the file. **MUTATION-PROVEN ×6**:
  M1 NAV_LAYOUT.icon → "h-6 w-6" → exactly 1 RED (it-2) · M2 the
  AGENTS icons bullet `h-5 w-5` → `h-4 w-4` → exactly 1 RED (it-2) ·
  M3 a `z-[9999]` planted in toast.tsx → exactly 1 RED (it-4) · M4
  `skills` dropped from the eslint ignores → exactly 1 RED (it-5) ·
  M5 DELTA_TEXT.good → "text-success" → exactly 1 RED (it-3) · M6
  `parseBody` renamed → **the FIRST RUN GREEN — the mutation caught
  the pin's own prefix-blind teeth** (the regex
  `/export (async )?function parseBody/` matched
  `parseBodyRenamed`) — the `\b` anchors added, the re-plant →
  exactly 1 RED (it-1) — each restored → GREEN. **STASH-PROOF**:
  the describe stashed → exactly 138/2867 (the s212 ship state,
  zero collateral) → restored → 138/2873.
- The count ladder + the docs lockstep: **UNIT 2867 → 2873 (+6)** ·
  SUITES 138 HELD · E2E 226 HELD · **badge 3093 → 3099** (the
  unit+e2e arithmetic: 2873+226 — verified against the live unit
  run: **138/2873 GREEN**, clean first pass) + `skill-head-213.py`
  (the SKILL v1.210.0, the s212 layer comment-demoted at its ship
  2867/226, the s213 layer live at 2873/226, `last_updated` stays
  2026-11-04 — the same-day form; idempotent — the re-run a verified
  no-op) + `count-ladder-213.py` (assert-first, idempotent,
  unique-anchor — 26 flips, the re-run 26 no-ops) + the test-side
  re-anchors in the same stroke (the docs-counts layer-axis pair:
  first = s213 · second = s212 at its ship 2867/226 · the 2867
  negatives join · the dialog-geometry-parity F-92a3 ladder: the
  four CLAUDE live positives re-anchored 2873) + the docs lockstep
  (the AGENTS Session-213 section · the PAD §7.1 s213 inventory row
  · docs/session_448.md · the worklog entry [Task ID 213] · this
  record).
- The captures 722-726 (the dev-server set, pixel-signature
  verified: the blue sidebar (37,99,235) on the dashboard at 1280 ·
  the 80%-black overlay on the drawer OPEN at 390 · the gray-50
  login card at 1280; every capture at 0% coarse-grid diff against
  the s212 set at matched sizes — the pages unchanged, the cures
  test-side only; the md5 deltas the fresh seed's date-relative
  values, the s212 record's own note; the landing menu capture
  byte-IDENTICAL): `722-s213-dev-dashboard-1280.png` ·
  `723-s213-dev-dashboard-390.png` ·
  `724-s213-dev-drawer-open-390.png` ·
  `725-s213-dev-landing-mobilemenu-390.png` ·
  `726-s213-dev-login-1280.png`.
- The final gate at the cured tree: lint 0/0 · tsc 0 · **138/2873
  unit** · build (the 2 warnings the pre-existing Turbopack tracing
  heuristics) · smoke 14/14 · `CI=1 bun run test:e2e` **226/226**
  (8.2m) · **all six drift gates re-run CLEAN** (probe:ref STABLE at
  `46bc2d9c` · the four-band sweep ×4 · the fullpage
  0.093%/0.316% · the interior census byte-parity, the login row
  unexplained 0, exit 0) · db census MATCH · `git status` clean of
  secrets/dbs. (One environment-only wrinkle mid-gate: the dev
  server OOM-killed twice under the build+e2e+sweep memory pressure
  — relaunched, the gates re-run CLEAN; zero code involvement.)

## The declined list (this round)

- The FULL semantic-prose census (every prose claim in the five core
  docs — the conventions block is the first mechanically-checkable
  family; the remainder stays under the rotation audit's fresh-eyes
  walk, the s208 scoping doctrine).
- A mid-rotation eslint/vite-family bump (the standing posture).
- The skills/ mirror (the operator's own domain, the standing
  exclusion).
- Pinning the AGENTS Git block (the push-ritual family already
  pinned at D-209a2; the branch/commit-convention claims are
  process, not code).
