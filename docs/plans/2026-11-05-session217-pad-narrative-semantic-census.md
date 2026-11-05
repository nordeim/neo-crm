# The session-217 plan — THE PAD NARRATIVE-BLOCK SEMANTIC-PROSE CENSUS (the fresh-eyes walk finds the PAD's own stale trio — the 10-check doctrine line its own pin kept green, the pre-s174 build-gate sentence, and the <1024px diagram boundary)

Date: 2026-11-05 · Rotation: 217
Task: the operator's standing instruction set — audit + validate the
shipped session-216 state (commit `2076fa4` + the transcript commits
`017462a`/`dedd05d` — the session_457 polished transcript is this
round's rotation trigger), re-verify visual + functional parity with
the live reference (`https://neo-crm-8ab2c17c.base44.app/`, logged in
with the documented demo credentials; the named focus: the mobile
navigation), re-run the standing gates, remediate the identified gaps,
capture the round's screenshots, update the docs, and push to `main`.

## 0. The audit (the baseline — EXECUTED before the plan landed; the FRESH-CLONE round)

The sandbox reset emptied the workspace — the round cloned the repo +
rebuilt the environment: bun install 536 packages · the standing
`.env` contract re-created (`DATABASE_URL="file:../db/custom.db"`, the
operator's own instruction names the exact form, + a fresh
AUTH_SECRET) · db:push + db:seed · db census MATCH 15/24/10/23/12 + 4
users at the repo-root anchor — NO parent-of-repo db mirror (the
s212/s214 hazard probed clean BEFORE any listener reuse). The
PLAYWRIGHT chromium-1248 gap (the fresh cache carries only the 1200
era) cured PROACTIVELY — `bunx playwright install chromium` BEFORE the
e2e leg. The scandihaven reference re-cloned — `61711c3`, the standing
commit, unchanged.

The baseline gate at the exact s216 ship state:

- lint 0/0 · tsc 0 · **138/2894 unit GREEN** · build (compiled
  successfully — the 2 warnings the pre-existing Turbopack tracing
  heuristics) · smoke 14/14 · e2e 226/226 (running at plan time — the
  full battery verified before the ship) · db census MATCH · the dev
  server's DB anchor probed green (login + dashboard API against the
  REPO db, leads=24 matching the census) · **probe:ref STABLE at
  `46bc2d9c`** (the demo data still ZERO; nav 256px/8 links; the 390
  census; the landing census — every standing layer verified).
- THE PARITY RE-VERIFICATION (the operator's named focus, probed live
  with agent-browser 0.41.1 against BOTH apps logged in):
  **the mobile navigation both surfaces working** — the REFERENCE
  drawer at 390×844 (the "Open navigation" trigger 36px visible → the
  dialog "CRM" + the Close button + the "Navigate between your CRM
  pages" paragraph + the 8 destinations; the body-only scroll lock
  `hidden` with main staying `auto`; the "Leads" link ride
  `/Dashboard` → `/Leads` AND auto-closes AND releases; Escape closes
  AND releases) — OURS the same battery PLUS the documented supersets
  (the body+main DUAL lock `hidden/hidden`, released to
  `visible/auto` on every close path; the resize-past-md auto-close
  verified live at 769px with both locks released and the trigger
  `display:none`). The landing "Toggle navigation" disclosure menu
  working on BOTH apps (ours the aria-expanded superset, verified
  true→false→true across the toggle ride with the panel unmounting;
  the reference's toggle carries NO aria-expanded — null; the 6-link
  panel on both: Features/Preview/Pricing/FAQ/Contact/Open dashboard;
  the toggle correctly `display:none` at 1280 with the inline nav
  visible).
- Tailwind v4 state CLEAN (no `tailwind.config.*` at the repo root ·
  postcss.config.mjs plugins EXACTLY `["@tailwindcss/postcss"]` · the
  vendored `src/app/vendor/tw-animate.css` imported by globals.css ·
  zero npm `tw-animate-css` imports in src/). SEO/sitemap
  live-verified on the dev server (the 11-route `/sitemap.xml` 200
  `application/xml` · `/robots.txt` 200 with the Sitemap line ·
  `/manifest.json` 200 `application/json` · the OG/Twitter/canonical/
  description head tags · the security headers on every path).
- THE FRESH-EYES WALK (the s216 close's named candidate — the
  architecture-facts section's remaining surface, the sessions-10-49
  DOM-parity bullets' doc faces): the sampled claims verified LIVE and
  GREEN (the s16 table density `h-10 px-2`/`hover:bg-line-soft/50` ·
  the s12 sparkline monotone/strokeWidth-2 family · the s13 dashed
  grids EXACTLY five `strokeDasharray="3 3"` sites · the s13 funnel
  forms [reports HorizontalBarChart / leads FunnelChart] · the s13
  `rounded-md` button radius · the s14 `--color-line-soft: #f5f5f5` ·
  the s15 `EVENT_DIALOG` seam) — the named candidate's own family
  carries NO live defect this round. The walk's live findings came
  from the PAD's narrative blocks instead — see F-217a/b/c.

## 1. The round's material — the PAD NARRATIVE-BLOCK STALE TRIO (the fresh-eyes walk's live findings)

The s216 close named the next candidate: "the architecture-facts
section's remaining surface (the sessions-10-49 DOM-parity bullets'
doc faces, the narrative blocks), or whatever live defect the next
fresh-eyes walk finds first." The walk found BOTH: the named AGENTS
family clean (the sampled live verification above), and THREE live
stale doc faces in the PAD — the blueprint's own narrative blocks:

- **F-217a — THE §7.3 STALE DRAWER-COUNT + ITS OWN STALE PIN**: PAD
  §7.3 (Coverage Thresholds) still says the mobile drawer "must keep
  all **10** regression checks green unmodified" — the live
  `tests/e2e/mobile-navigation.spec.ts` carries **11** tests (the s196
  walk50 interior-spine freeze grew it 10 → 11; every other doc face
  re-anchored then — AGENTS "(11 checks, 390/700px viewports)", README
  "the 11-check", the docs-counts `MOBILE_NAV_E2E = 11` constant —
  but the PAD doctrine line was never flipped). WORSE: the s167 pin
  itself (tests/docs-counts.test.ts, F-167i — "PAD 7.3's drawer
  doctrine carries the live 10-check form") asserts the LITERAL
  `expect(pad).toContain("all 10 regression checks")` — the pin
  enforces the stale count, so every gate stays GREEN while the doc
  face lies. This is the F-216a genus with an extra face: not just an
  unpinned doc claim, a PINNED-STALE one (the pin's own literal froze
  at its birth era and rode through the s196 spec growth un-noticed).
- **F-217b — THE §8.1 PRE-s174 BUILD-GATE SENTENCE**: PAD §8.1 still
  says "TypeScript/ESLint build blocking is intentionally off — the
  explicit `lint`/`typecheck` scripts are the gate" — STALE since
  session-174 (F-174a retired `typescript.ignoreBuildErrors`; the
  build IS the type gate now). The live faces all agree —
  next.config.ts's retirement comment (the `typescript` key stays
  UNSET), tests/type-gate.test.ts:55 ("next.config.ts carries NO
  ignoreBuildErrors"), AGENTS:46-48, and the PAD's OWN §7.4 checklist
  two sections later ("session-174 retired `ignoreBuildErrors` — the
  build itself now fails on type errors too") — the document
  contradicts itself across §8.1 vs §7.4, and survived 43 sessions of
  gates because no pin reads the §8.1 face.
- **F-217c — THE §2 DIAGRAM BOUNDARY CONTRADICTION**: the topology
  diagram's Client Layer still splits "Desktop browser **≥768px**"
  from "Mobile browser **<1024px** hamburger" — the two ranges
  OVERLAP (768-1023px matches both) and the mobile boundary is the
  pre-session-8 era: the live drawer covers `< md` = **<768px** (the
  trigger/overlay `md:hidden`, `MOBILE_NAV_LAYOUT.autoCloseQuery`
  "(min-width: 768px)" — pinned by page-layout.test.ts:535-536 with
  its own not-1024 negative), the sidebar `hidden md:flex` visible
  FROM 768px (AGENTS: "visible from 768px, NOT lg — live-verified at
  900/700px"). No pin reads the diagram face.
- Plus the header-date straggler: the PAD header's "Last Updated:
  2026-10-23" predates the s212-s216 edits (the s167 round set it;
  five subsequent inventory-row rounds never flipped it) — cured
  same-stroke as part of the narrative-block flip (the s167
  precedent: the header date tracks the file's prose edits).

## 2. The cure (TDD — the PAD-side sentence flips + the pin re-anchor + the genus-closing census, test-side + docs only, src/ code untouched)

**D-217a1 — THE FOUR-SITE PAD FLIP** (the stale prose cured, the live
truth narrated in the s174/s196/s7 forms):

- `Project_Architecture_Document.md` §7.3 — "all 10 regression
  checks" → "all 11 regression checks" (the live spec count).
- `Project_Architecture_Document.md` §8.1 — the stale sentence flipped
  to the live form: TypeScript build blocking is ON (session-174
  retired `ignoreBuildErrors`; `next build` itself fails on type
  errors — the planted-error proof lives in `tests/type-gate.test.ts`)
  and the explicit `typecheck` script stays in the gate chain as the
  faster signal (no hosted CI; the local gate is the only gate).
- `Project_Architecture_Document.md` §2 — the diagram's mobile arm
  flipped to "Mobile browser <768px" (the ranges now partition
  cleanly at the md boundary; the desktop arm "≥768px" unchanged — it
  was already live).
- `Project_Architecture_Document.md` header — "Last Updated" flipped
  to 2026-11-05 (the round's date, the s167 precedent).

**D-217b1 — THE F-167i PIN RE-ANCHOR** (tests/docs-counts.test.ts,
the stale-literal root cure): the s167 pin's literal
`toContain("all 10 regression checks")` becomes the live-constant form
`toContain(\`all ${MOBILE_NAV_E2E} regression checks\`)` (the constant
the file already declares at :922) + the retired-form negatives
extended ("all 7" AND "all 10" never return). The pin can never again
freeze a stale count: the day MOBILE_NAV_E2E re-anchors, the PAD face
must follow or the gate trips.

**D-217a2 — THE PAD NARRATIVE-BLOCK SEMANTIC CENSUS PIN** (a new
describe in `tests/facts-census.test.ts` — the D-213a1…D-216a2 home;
the F-109a1 live-read doctrine; four its):

- it-1 THE SPEC-COUNT LIVE CENSUS: the live
  `tests/e2e/mobile-navigation.spec.ts` test-declaration count (the
  `^\s*test\(` census, describe excluded) === 11 === MOBILE_NAV_E2E's
  value (the three-way lockstep's missing arm: the PAD §7.3 face is
  F-167i's, the README/AGENTS faces are docs-counts':1276-1300 — the
  SPEC↔constant arm rode on nothing; a 12th test added without the
  constant bump now trips the gate).
- it-2 THE §8.1 BUILD-GATE CORRECTION: the stale sentence absent
  (whitespace-normalized) + the corrected form present (the
  s174-narrated build-gate + typecheck-faster-signal clauses) + the
  §7.4 internal-consistency arm (both sections carry the same s174
  doctrine — the self-contradiction ban) + the "pinned by" claim live
  (tests/type-gate.test.ts exists and reads next.config.ts) + the
  AGENTS architecture-facts build-gate claim (the unpinned doc face:
  "the build IS the type gate" + the planted-error-proof clause).
- it-3 THE §2 DIAGRAM BOUNDARY CORRECTION: the stale "<1024px" form
  absent from the Client Layer block + the corrected partition
  present (desktop "≥768px" + mobile "<768px") + the live co-faces
  (MOBILE_NAV_LAYOUT.autoCloseQuery reads "(min-width: 768px)" from
  the page-layout import — the same live-read form as the s215 it-5
  doctrine).
- it-4 THE HEADER-DATE LIVE-TENSE: the PAD header's "Last Updated"
  carries 2026-11-05 (the round's flip; the pre-s212 2026-10-23 form
  retired).

**THE VERIFICATION (the pin's own named proofs):**

- **BORN-RED AT THE DOC ARM** (the TDD discipline): it-2 and it-3 run
  RED at the stale tree (the §8.1 sentence + the diagram boundary are
  the cures' own faces); it-1 born-green (the spec count is live
  11 — the pin's own census arm); it-4 born-red (the header date is
  the cure's face). Then D-217a1 flips the four sites → GREEN.
  (D-217b1's re-anchored F-167i runs RED at the stale PAD §7.3 too —
  the re-anchor is itself born-red at the doc arm, cured by the same
  flip.)
- MUTATION-PROVEN (each planted → exactly 1 RED at its own pin →
  restored → GREEN; the documented co-pinned exceptions keep the s216
  M9 doctrine): M1 a ghost 12th `test(` planted in the spec → exactly
  1 RED (it-1) · M2 the PAD §7.3 re-staled to "all 10" → exactly 1
  RED (the re-anchored F-167i) · M3 the PAD §8.1 re-staled → exactly
  1 RED (it-2) · M4 the AGENTS build-gate claim edited → exactly 1
  RED (it-2) · M5 the PAD §2 diagram re-staled to <1024px → exactly
  1 RED (it-3) · M6 the autoCloseQuery flipped src-side → 2 RED, the
  DOCUMENTED co-pinned face (it-3 + page-layout.test.ts:535 — both
  pins correctly trip the same live face) · M7 the PAD header date
  re-staled → exactly 1 RED (it-4) · M8 the §7.4 checklist's s174
  clause removed → exactly 1 RED (it-2, the internal-consistency arm).
- STASH-PROOF: the round's describe stashed → exactly 138/2894 (the
  s216 ship state, zero collateral) → restored → 138/2897.

## 3. The re-anchors (the count ladder + the docs lockstep)

- The count ladder: UNIT **2894 → 2897 (+3)** · SUITES 138 HELD (the
  pin lands in an existing file) · E2E 226 HELD · badge **3120 →
  3123** (the unit+e2e arithmetic: 2897+226 — the final form after
  the battery's M1 catch removed the redundant fourth it) + `skill-head-217.py`
  (the SKILL v1.214.0, the s216 layer comment-demoted at its ship
  counts 2894/226, the s217 layer live at 2897/226, `last_updated`
  stays 2026-11-05 — the same-day form; idempotent) +
  `count-ladder-217.py` (assert-first, idempotent, unique-anchor —
  the live-tense flips + the test-side re-anchors in the same stroke:
  the docs-counts layer-axis pair [first = s217, second = s216 at its
  ship 2894/226] · the 2894 negatives join the retired forms · the
  dialog-geometry-parity F-92a3 ladder: the four CLAUDE live
  positives re-anchored 2897).
- The docs lockstep: the AGENTS Session-217 section · the PAD §7.1
  s217 inventory row · `docs/session_458.md` (the polished
  transcript — the 457 slot holds the s216 close's working log, this
  round's pair shifts one) · the worklog Task ID 217 entry · this
  plan's execution record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · **138/2897 unit** · build · smoke 14/14 ·
`CI=1 bun run test:e2e` 226/226 · the six drift gates re-run CLEAN
(the cures test-side + PAD-side only — no src code touch, but the
house proves it) · db census MATCH · `git status` clean of
secrets/dbs.

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the
  fresh-clone round: the clone + the environment rebuild + the
  baseline battery [lint 0/0 · tsc 0 · 138/2894 · build · smoke 14/14
  · e2e 226/226 in 8.2m · db census MATCH · the dev-server DB anchor
  green · probe:ref STABLE at 46bc2d9c] + the parity walk with
  agent-browser against BOTH apps + the named candidate's sampled
  live verification + the SEO/sitemap live legs + the Tailwind-v4
  state legs + the scandihaven check at 61711c3).
- D-217a1 + D-217b1 + D-217a2: **BORN-RED AT THE DOC ARM** — exactly
  4 RED at the stale tree (it-1 the §8.1 build-gate + it-2 the §2
  diagram + it-3 the header date + the re-anchored F-167i) → the
  four-site flip → **GREEN**. One assert calibration at birth (the
  AGENTS build-gate claim wraps across lines — the s167
  whitespace-normalization lesson applied).
- THE MUTATION BATTERY caught **ONE birth defect in the pin itself,
  cured in-round**: the first draft's FOURTH it (the SPEC-COUNT live
  census) tripped **SIX pins at once** at M1 — the arm already
  belongs to docs-counts:1916 (the s147 miscount's root-cause cure)
  plus the Appendix-B row census, the line-census sites, and §9's
  Bug #1 count; **cured by REMOVING the redundant it** (the
  one-owner doctrine enforced by the battery itself — the third
  consecutive round the battery caught the pin's own birth defect,
  the s215 boundary/comment and s216 substring-weak lineage).
- **MUTATION-PROVEN ×8**: M1 the ghost 12th `test(` planted → 6 RED
  (the birth-defect catch, the it removed) · M2 the PAD §7.3
  re-staled to the ten-check form → exactly 1 RED (the re-anchored
  F-167i) · M3 the PAD §8.1 re-staled → exactly 1 RED · M4 the AGENTS
  build-gate claim edited → exactly 1 RED · M5 the diagram re-staled
  → exactly 1 RED · M6 the autoCloseQuery flipped src-side → **2 RED,
  the DOCUMENTED co-pinned face** (it-2 + page-layout.test.ts:535 —
  both pins correctly trip the same live face) · M7 the header date
  re-staled → exactly 1 RED · M8 the §7.4 checklist s174 clause
  removed → exactly 1 RED at the internal-consistency arm — each
  restored → GREEN.
- **STASH-PROOF**: the describe stashed → exactly 138/2894 (the s216
  ship state, zero collateral) → restored → 138/2897.
- The count ladder + the docs lockstep: **UNIT 2894 → 2897 (+3)** ·
  SUITES 138 HELD · E2E 226 HELD · **badge 3120 → 3123** (the
  unit+e2e arithmetic: 2897+226 — the first draft's 3121 was an
  arithmetic slip CAUGHT BY the docs-counts badge pin itself at the
  full-suite run, the pin doing exactly its job; cured at the README
  badge + the ladder script + the SKILL head narrative in the same
  stroke) + `skill-head-217.py` (the SKILL v1.214.0, the s216 layer
  comment-demoted at its ship counts 2894/226, the s217 layer live at
  2897/226; idempotent — the re-run a verified no-op) +
  `count-ladder-217.py` (assert-first, idempotent, unique-anchor — 26
  flips, the re-run all no-ops) + the test-side re-anchors (the
  docs-counts layer-axis pair: first = s217 · second = s216 at its
  ship 2894/226 · the 2894 negatives join the retired forms · the
  dialog-geometry-parity F-92a3 ladder: the four CLAUDE live
  positives re-anchored 2897) + the docs lockstep (the AGENTS
  Session-217 section · the PAD §7.1 s217 inventory row ·
  docs/session_458.md · the worklog entry [Task ID 217] · this
  record). The PAD inventory row's own self-trip caught and cured
  in-round: the first draft QUOTED the stale forms verbatim (the
  F-167i ten-check negative + the census it-1 stale-sentence ban both
  tripped) — **cured with the ban-safe paraphrase** (the s216
  doctrine, applied at birth this time).
- The captures 742-746 (the dev-server set, pixel-signature
  verified).
- The final gate at the cured tree: lint 0/0 · tsc 0 · **138/2897
  unit** · build · smoke 14/14 · `CI=1 bun run test:e2e` 226/226 ·
  the six drift gates CLEAN · db census MATCH at the repo-root
  anchor · `git status` clean of secrets/dbs.

## The declined list (this round)

- The AGENTS sessions-10-49 DOM-parity bullets' doc faces BEYOND the
  sampled verification (the named candidate walked clean at its
  sample — the full per-bullet census stays the s218+ rotation's
  standing residue; their live faces ride the per-family pins).
- A mid-rotation eslint/vite-family bump (the standing posture).
- The skills/ mirror (the operator's own domain, the standing
  exclusion — the operator's own instruction re-affirms the `skills/`
  folder stays excluded from code checking, testing, and compilation;
  the eslint ignores + the build's outputFileTracingExcludes + the
  walk censuses' exclusions all hold).
- Test-suite config modifications (both configs verified sound and
  green this round — the s215/s216 declined-list precedent).
- The ADR 008-013 numbering gap and the s178+ ADR absence (the PAD's
  ADR register is a historical record; the s213-216 rounds established
  the §7.1 inventory row as the post-ADR session record — a
  renumbering would rewrite history, not cure a live defect).
