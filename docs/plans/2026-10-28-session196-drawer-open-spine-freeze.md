# The session-196 plan — THE DRAWER-OPEN SPINE FREEZE (the post-195 audit round — the re-walk staleness round)

Date: 2026-10-28 · Rotation: 196 ·
Task: audit + validate the shipped session-195 state (commit `9ff0d37` +
the owner's transcript commit `a3ac674` — the session_413 transcript is
this round's rotation trigger), then run the s412 close's named standing
material — the re-walk staleness ladder (the walk50 drawer + the
s144-era marketing exteriors) — and close the genuine battery gap the
re-walk surfaces (the drawer-open spine's zero gate teeth), TDD-first,
align every doc in the house lockstep, capture the dev-server set, push
to main via the SSH wrapper.

## 0. The audit (the baseline + the discovery + the re-walk)

The baseline gate at the shipped s195 state (the workspace pulled to
`a3ac674`, tree clean, the AUTH_SECRET refreshed — the prior session's
`.env` carried an empty value, dev-fallback territory, fixed in the
intake): lint 0/0 · tsc 0 · **138/2811** unit · build (the type-gate
artifact) · smoke **14/14** (the sitemap + robots + manifest 200s ride
check 12) · e2e **194/194** (clean first run, 5.8m) · probe:ref STABLE
(`46bc2d9c` — the bundle md5 unchanged, the demo data still ZERO, the
desktop census 256px/8 links STANDING, the TRUE-390 census STANDING,
the landing census STANDING) · db census MATCH (15/24/10/23/12 + 4
users at `<repo>/db/custom.db` — the `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, the
operator's standing ask verified).

The discovery (`scripts/discover-196.ts`, the discover-194 condensed
form + the staleness-ladder adjudication legs):

- **LEG-1 the standing data-gated re-checks — ALL KILLED** at the
  reference's unchanged zero-data state: the Edit-family census
  (rows=1 the empty-state row alone, rowMenus=0 on contacts/leads/
  accounts — the discover-184..196 standing census) · the topbar-search
  dropdown populated=0 on both (the s32 dead-stub doctrine stands) ·
  the dashboard follow-up-rows checkbox arms + the activities
  Completed-tab row actions (both panels empty) — every data-dependent
  candidate stays suspended.
- **LEG-2b the s144-era marketing exteriors — the posture byte-equal
  STANDING**: the guest `/about` + `/About` + `/contact` + `/Contact`
  login-wall on BOTH apps with the identical `from_url` round-trip
  form (the s147 F-147c2 contract, 49 sessions later); the landing
  funnel's marketing anchors + rides identical (Contact/About/Contact)
  — the wall posture never drifted. No walk material there.
- **LEG-3 the conditional gates — KILLED**: probe:ref STABLE at
  `46bc2d9c` kills the fresh-bundle re-derivation; the registry's
  latest recharts 3.10.1 (verified live) kills the 4.0 gate.

THE RE-WALK (the round's material — the s412 close's own naming: "the
re-walk staleness ladder … the walk50 drawer"): the walk50 re-run at
the current tree, 19 sessions after the s177 original:

- **The verdict: STABLE — ZERO NEW DELTAS.** OURS 61 rows vs REF 53
  (the 8 `span.truncate` label wrappers — the s177-adjudicated KEPT
  superset, the row-count difference's own root cause, standing).
  After spine alignment every disagreement maps to the s177
  adjudications: the s173/s177 **mb-0 cure holding** (the header
  80/80 · the h2 24,24 240×32 both · the nav 0,80 288×332 both · the
  footer 0,428 288×61 both — the post-cure spine byte-equal two-app) ·
  the genera standing (the `bg-sidebar` token vs the reference's
  `bg-[#2563eb]` literal — computed-equal rgb(37,99,235) · the Close
  button's stock-version class drift — both dead variants · lucide's
  `aria-hidden` — the version genus · the React 19 `useId` format ·
  the icon class order `h-5 w-5 shrink-0` — the shrink-0 superset ·
  the nav `aria-label`s + `aria-current` + the focus-visible ring —
  the KEPT supersets · the lucide-users icon's internal child order
  (path/circle serialization — the same shapes in a different DOM
  order, zero visual delta, the version genus; lucide-react 0.525.0
  unchanged since before s177) · the sr-only `<p>`'s y-delta 23-vs-32 —
  the mb-0 cure's own mechanism fingerprint (the reference's v3
  margin lands on the abspos p, ours' v4 :where() margin killed by
  the mb-0 — zero visible pixels, the s177 decode's own genus).
- **The 19 sessions of changes since s177 introduced zero drift** —
  the s193a1 outline-color base-layer rule included (every outline
  face in the drawer re-decoded: both apps carry the 50% near-black
  outline-color family now, the s126 oklab/rgba serialization the only
  difference).

### The findings triage

**FIX THIS ROUND (the genuine battery gap — zero product-behavior
risk):**

- **D-196a1 (Verified) — THE DRAWER-OPEN SPINE'S ZERO GATE TEETH.**
  The s177 round's spine cure + decode carry only SOURCE-STRING pins
  (`MOBILE_NAV_SHEET.title`'s `mb-0` + the header literal in
  `tests/page-layout.test.ts`); the 10-check e2e battery pins
  BEHAVIOR (the locks, the focus, the rides, the overflow); the a11y
  two-gate pins violations; the drift sweeps pin the CLOSED pixels
  (the interior census carries zero drawer-open runs — the s177
  coverage-gap finding, standing). The s177 defect's own shape — a
  computed-margin regression (a Tailwind upgrade's space-y semantics,
  a base-layer margin rule, an h2 line-height change) shifting the
  header 80→88 and cascading to every link + the footer — would keep
  every gate green while falsifying the walk50-verified contract. THE
  CURE: the born-green e2e registration (the s195a1 wire-freeze
  doctrine's next member — the shipped contract, finally carrying
  teeth): the rendered drawer-open spine pinned at the walk50 ledger's
  own boxes at TRUE 390×844 — the sheet content 288×844 · the header
  0,0 288×80 (the cure's own face) · the h2 24,24 240×32 · the nav
  0,80 288×332 · the 7-link row 12,80 264×44 with the 48px pitch ·
  the footer 0,428 288×61 · the Close 256,16 16×16 — the expect.poll
  starved-read idiom (s164 → s195a4) on the box reads.

**DECLINED (standing adjudications, never "fixed"):** every re-walk
delta above is a documented genus or a pinned KEPT superset — the
parity doctrine forbids mirroring the reference's own gaps (the
missing nav aria-labels, the absent focus ring, the missing
aria-current) and forbids churning the computed-equal class-string
forms (the bg token idiom, the icon class order). Recorded here as
considered-and-declined for the next audit's re-triage.

## 1. The TDD ledger (the cure plan)

- **D-196a1** — born-green freeze (the s194/s195 doctrine's form for
  a genuine battery gap: the pinned behavior already shipped
  mutation-proven at the source level, the gate carried zero teeth on
  the RENDERED contract). +1 `test()` block in
  `tests/e2e/mobile-navigation.spec.ts` (the spec census 10 → 11; the
  E2E const 194 → 195; badge 3005 → 3006). MUTATION-PROOF: the
  planted `mb-2` regression on `MOBILE_NAV_SHEET.title` (the s177
  defect's exact shape — the h2's :where() margin re-enters the
  flex-column layout) → build → the pin must RED at the header box
  (88 ≠ 80) → restore → GREEN.

## 2. The count ladder + the docs lockstep

`skill-head-196.py` FIRST (the SKILL v1.192.0 → v1.193.0 frontmatter +
H1 lockstep + the s196 head layer at 2811/195, the s195 layer
comment-demoted at its own ship counts 2811/194 — the s188 lesson:
the demoted block's ship line never matches an old form). Then
`count-ladder-196.py` (assert-first, idempotent, unique-anchor — the
house form): the docs-counts E2E const 194 → 195 + MOBILE_NAV_E2E
10 → 11 (the live-census-pinned constant) · the README badge
3005 → 3006 + the Tested row + the tree + the commands + the five
10-check mobile-nav sites · the AGENTS commands + gate-order + the
mobile-nav (10 checks) sites · the CLAUDE gate-order + commands +
pyramid · the PAD tree + Total + HEAD + checklist + commands · the
SKILL commands + Appendix B e2e total + wall-clock + the mobile-nav
row 10 → 11. The test-side re-anchors in the same stroke: the
docs-counts layer-axis (first = s196, second = s195 at its ship
194) · the login-family negatives ladder (the retired
`**E2E (Playwright, 194 checks)**` joins its negatives, the live
positive re-anchored 195). The docs lockstep: the AGENTS
Session-196 section · `docs/session_414.md` · the PAD §7.1 s196
inventory row · the README walk-contracts paragraph's s196 clause ·
this plan's execution record · the worklog entry {Task ID: 196}.

## 3. The captures

The dev-server set (the remediated tree): the drawer-open state at
390×844 (the round's own surface) + the ours-vs-ref drawer-open pair
+ the dashboard desktop/mobile set — landed under `docs/screenshots/`,
numbered past the s195 589-599.

## 4. The final gate + the push

`bun run gate` (lint 0/0 · tsc 0 · 138/2811 · build · smoke 14/14 ·
CI=1 e2e 195/195) · probe:ref STABLE re-check · db census MATCH ·
the SSH-wrapper push to main (`git@github.com:nordeim/neo-crm.git`),
no new branch, the wrapper's verified-push form.

## 5. The execution record (2026-10-28)

Executed as planned, in the order above, all green:

- **The baseline**: lint 0/0 · tsc 0 · 138/2811 unit · build · smoke
  14/14 · e2e 194/194 (clean first run, 5.8m) · probe:ref STABLE at
  `46bc2d9c` · db census MATCH (15/24/10/23/12 + 4 users at
  `<repo>/db/custom.db`) · sitemap + robots + manifest 200 (smoke
  check 12). The intake's one fix: the prior session's `.env` carried
  an empty AUTH_SECRET (dev-fallback territory), refreshed to the
  64-hex contract.
- **The discovery** (scripts/discover-196.ts): the standing data-gated
  re-checks ALL KILLED at the reference's unchanged zero-data state ·
  the conditional gates KILLED (probe:ref STABLE; recharts 3.10.1
  the registry's latest) · the s144-era marketing exteriors posture
  byte-equal STANDING (the guest wall + the from_url round-trip +
  the landing funnel identical on both apps) — no walk material
  there.
- **The re-walk** (the walk50 re-run): the verdict STABLE — ZERO NEW
  DELTAS. OURS 61 rows vs REF 53 (the 8 span.truncate wrappers
  standing); after spine alignment every disagreement maps to the
  s177 adjudications (the mb-0 cure holding: header 80/80 · nav
  80/80 · footer 428/428; the genera standing: the bg token · the
  Close stock drift · the lucide aria-hidden + the icon child-order
  version genera · the useId format · the class order + shrink-0 ·
  the nav aria-labels + aria-current + the focus ring · the sr-only
  p's y-delta — the cure's mechanism fingerprint). The 19 sessions of
  changes since s177 — the s193a1 outline-color base-layer rule
  included — introduced zero drift.
- **D-196a1**: the spine registration landed inside
  tests/e2e/mobile-navigation.spec.ts (+1 test() block, the census
  10 → 11; E2E 194 → 195). Born-green (12/12 on the spec at the
  standing build). MUTATION-PROVEN: the planted mb-2 regression (the
  s177 defect's exact shape) → build → the pin RED exactly at the
  header box (Expected 80 / Received 88) → restored → GREEN, the
  tree clean at the source.
- **The lockstep**: skill-head-196.py ran FIRST (the SKILL v1.193.0,
  the s195 layer comment-demoted at its ship counts 2811/194, the
  s196 layer live at 2811/195 + the beneath-it tail, idempotent) ·
  count-ladder-196.py (28 flips, all anchors unique) · the five
  test-side re-anchors (the docs-counts layer-axis [first = s196,
  second = s195] · the login-family negatives ladder [the retired
  194-form joins its negatives] · the s147-miscount 11-negatives
  RETIRED on both the docs-counts s165 block + the Appendix B row
  negative [the 10-check forms join the negatives — the s192
  re-anchor doctrine] · the inventory-census Bug #1 checks pin
  10 → 11 · the PAD §11 line-census row 284 → 364) · the docs (the
  AGENTS Session-196 section · session_414.md · the PAD §7.1 s196
  inventory row · the README walk-contracts paragraph's s196 clause ·
  this execution record · the worklog entry {Task ID: 196}).
- **The unit battery with the re-anchored lockstep**: 138/2811 GREEN.
