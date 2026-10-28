# The session-197 plan — THE SWEEP-STATE COVERAGE AUDIT (the 404 drift-gate registration)

Date: 2026-10-28 · Rotation: 197 ·
Task: audit + validate the shipped session-196 state (commit `316fbe2` +
the owner's transcript commit `769ba13` — the session_415 transcript is
this round's rotation trigger), then run the s412 close's OTHER named
standing material — the sweep-state's own coverage audit — with the
s120-era interactive-table staleness candidate adjudicated in the same
discovery pass, close the genuine coverage gap the audit surfaces (the
designed 404's zero drift-gate teeth), TDD-first, align every doc in
the house lockstep, capture the round's set, push to main via the SSH
wrapper.

## 0. The audit (the baseline + the discovery)

The baseline gate at the shipped s196 state (the fresh-sandbox clone to
`769ba13`, tree clean — the environment rebuilt in the intake: bun
1.4.4 + the Playwright chromium install + `db:push`/`db:seed` + the
`.env` rebuilt from `.env.example` with a fresh 64-hex AUTH_SECRET):
lint 0/0 · tsc 0 · **138/2811** unit · build (the type-gate artifact)
· smoke **14/14** (the sitemap + robots + manifest 200s ride check 12)
· e2e **195/195** (clean first run, 5.6m) · probe:ref STABLE
(`46bc2d9c` — the bundle md5 unchanged, the demo data still ZERO, the
desktop census 256px/8 links STANDING, the TRUE-390 census STANDING,
the landing census STANDING) · db census MATCH (15/24/10/23/12 + 4
users at `<repo>/db/custom.db` — the `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, the
operator's standing ask verified).

The discovery (`scripts/discover-197.ts` — the discover-196 condensed
form + the two-candidate adjudication legs):

- **LEG-1 the standing data-gated re-checks — ALL KILLED** at the
  reference's unchanged zero-data state: the Edit-family census
  (rows=1 the empty-state rows on contacts/leads/accounts, rowMenus=0
  — the discover-184..197 standing census) · the topbar-search
  dropdown populated=0 on both (the s32 dead-stub doctrine stands) ·
  the dashboard follow-up rows + the activities Completed-tab (both
  panels empty on the reference) — every data-dependent candidate
  stays suspended.
- **LEG-2a THE SWEEP-STATE COVERAGE AUDIT — the round's material
  found.** The app's renderable-route inventory vs. the standing
  drift-gate inventories (the sweep PAGES 13 · the interior census
  12 + the public leg 1 · the fullpage 1 = the landing only): THREE
  uncovered surfaces, two ours-only supersets and ONE genuine gap —
  `/signup` (OURS renders the superset page; the REF renders its own
  404 — it has no such route) and `/reset-password` (OURS renders the
  token-gated landing; the REF renders its blank SPA shell) are
  OURS-ONLY by construction, outside the two-app sweep, already
  e2e-pinned (the s195 audit's adjudication of the same family) ·
  **THE 404 — the only two-app-renderable surface in the tree with
  ZERO drift-gate coverage**: OURS renders the designed 404 at the
  unknown URL with the TRUE HTTP 404 (session-independent, the
  D-194a5 construction), the REF renders its designed 404 PAST its
  auth guard (http 200, its platform badge riding), NO `main` on
  either app's 404 (the bare root not-found — the sweep's shell-wait
  would soft-fall a full 15s burn per capture) — the walk67 decode
  (s194) + the e2e/a11y registrations (s195) hold its FACES and its
  STATUS, but a future pixel regression on the surface (a base-layer
  shift, a NOT_FOUND_LAYOUT class drift) would keep every gate green.
  **THE MAIDEN MEASUREMENT** (the 404 pair captured at the sweep's own
  four bands, the REF badge closed, the h1-404 content-wait):
  desktop 1440×900 **0.01%** · phone 390×844 **0.04%** · tablet
  768×1024 **0.01%** · landscape 1024×768 **0.01%** — the
  byte-identical family floor, no genus at any band (the badge-close
  removes the s149 platform pill, the sole residual). The anon
  posture re-verified STANDING: OURS the 404 at the unknown URL
  (http 404), the REF the wall redirect with the `from_url`
  round-trip — the D-194a5 decode, unchanged.
- **LEG-2b the s120-era interactive-table candidate — KILLED by
  evidence.** The leads family source (`src/app/(app)/leads/`) is
  untouched since s113 (2026-10-12, 84 sessions — git log); the deps
  are frozen (recharts 3.10.1 + lucide 0.525 + Tailwind 4.3 — the
  s196 re-walk's own version census); the family's only computed-style
  change vector since the s120 walk is the s193a1 base-layer
  outline-color rule — decoded at s193, re-walked at s196 (the drawer
  member), and drift-gated by the /leads sweep baselines at the 0.1
  floor at every band since s148. A re-walk re-derives the s196
  verdict (STABLE — zero new deltas); no genuine gap.
- **LEG-3 the conditional gates — KILLED**: probe:ref STABLE at
  `46bc2d9c` kills the fresh-bundle re-derivation; the registry's
  latest recharts is 3.10.1 (fetched live in the discovery) — the 4.0
  gate stays killed.

### The findings triage

**FIX THIS ROUND (the genuine coverage gap — zero product-behavior
risk):**

- **D-197a1 (Verified) — THE 404'S ZERO DRIFT-GATE COVERAGE.** The
  designed 404 is the only two-app-renderable surface the drift-gate
  family does not carry. THE CURE: the 404 joins the standing sweep —
  the 14th PAGES entry `{ name: "not-found", path:
  "/no-such-sweep-route", waitFor: "heading-404" }` with the per-page
  capture-wait override (the bare 404 renders with NO `main`; the
  override waits on the h1 "404" instead — the s194 walk67 decode's
  own anchor — curing both the 15s soft-fall burn and the
  content-wait correctness) + the STANDING_BASELINES entries at all
  four bands (0.1 the family floor — the maiden measured
  0.01/0.04/0.01/0.01) + the sweep-tool pins (the PAGES census
  re-anchored 13 → 14 + the waitFor-field pin + the not-found
  baselines pin).
- **D-197a2 (Verified) — THE SWEEP HEADER'S OWN STALE PAGE CENSUS.**
  The `scripts/sweep.ts` header comments still count "the ten pages"
  (the s91-era census, three entries stale — the list has carried 13
  since s144, 14 after this round). THE CURE: the header census
  re-anchored in the same commit (comment-only, zero behavior).

**DECLINED (recorded considered-and-declined for the next audit's
re-triage):**

- **The interior census's 404 registration** — the census protocol
  rides the `main`-scroller collector (the 9-page doctrine, the s157
  login + s156 marketing extensions); the bare 404 would need a THIRD
  collector for one page (the landing's public-leg split was the last
  two-collector doctrine); the 404's element ledger is walk-frozen
  (s194 walk67) + source-pinned (`NOT_FOUND_LAYOUT` in
  `tests/page-layout.test.ts`). Declined as speculative scaffolding —
  the sweep registration carries the pixel teeth.
- **/signup + /reset-password in the sweep** — OURS-ONLY supersets
  (the REF has no such routes: its /signup renders its own 404, its
  /reset-password a blank shell); the two-app comparison is impossible
  by construction; both surfaces carry e2e + unit coverage already.
- **The s120-era interactive-table re-walk** — KILLED by the LEG-2b
  evidence (source-frozen + dep-frozen + drift-gated).

## 1. The TDD ledger (the cure plan)

- **D-197a1** — born-green registration (the s195a1/s196a1
  wire-freeze doctrine's next member — the shipped 404 construction
  finally carrying pixel-drift teeth):
  1. `scripts/sweep.ts`: the PAGES entry + the `waitFor` field on the
     page type + the captureAll override + the four STANDING_BASELINES
     entries (0.1 each band) + the standingExplained lines untouched
     (the 404 carries no genus after the badge-close).
  2. `tests/sweep-tool.test.ts`: the PAGES census pin re-anchored
     (14 entries, the not-found entry with its waitFor field) + the
     NEW waitFor pin (the not-found entry carries "heading-404";
     every other entry undefined) + the NEW not-found baselines pin
     (0.1 at all four bands — the maiden's floor) — +2 its, the
     suite census held at 138.
  3. THE SWEEP VERIFICATION: `bun run sweep -- --pages not-found
     --fail-on-drift` at all four bands → GREEN (the maiden shares
     under the baselines; the seed restored after each run).
  4. MUTATION-PROOF ×2: (a) the planted pixel regression
     (`NOT_FOUND_LAYOUT.h1` `text-7xl` → `text-8xl`) → the sweep
     trips at the desktop band (the share clears the 0.1 baseline +
     the 0.5 margin) → restored → GREEN; (b) the missing-baseline
     mutation (the not-found desktop entry removed) → the unit pins
     RED (the coverage-loop pin + the new baselines pin — the
     drift-level trip is impossible at the 0.01% maiden share under
     the 0.5% margin, so the fail-fast doctrine's teeth ride the
     unit gate) → restored → GREEN.
- **D-197a2** — the header census re-anchor (comment-only).

## 2. The count ladder + the docs lockstep

UNIT 2811 → **2813** (+2: the waitFor pin + the baselines pin — both
in the EXISTING sweep-tool suite) · SUITES 138 HELD · E2E 195 HELD ·
badge 3006 → **3008** (the unit+e2e arithmetic: 2813+195).
`skill-head-197.py` FIRST (the SKILL v1.194.0, the s196 layer
comment-demoted at its ship counts 2811/195, the s197 layer live at
2813/195 + the beneath-it tail, idempotent), then
`count-ladder-197.py` (assert-first, idempotent, unique-anchor — the
docs-counts UNIT constant · the README badge + Tested row + tree +
commands · the AGENTS commands + gate-order · the CLAUDE gate-order +
commands + pyramid + the coverage seam · the PAD tree + Total + HEAD +
checklist + commands · the SKILL commands + Appendix B unit total).
The test-side re-anchors in the same stroke: the docs-counts
layer-axis (first = s197 at 2813/195, second = s196 at its ship
2811/195) + the unit negatives ladder (the retired 2811 site-forms
join the negatives, the s166 form). The docs lockstep: the AGENTS
Session-197 section · `docs/session_416.md` · the PAD §7.1 s197
inventory row · the README walk-contracts paragraph's s197 clause ·
this plan's execution record · the worklog entry {Task ID: 197}.

## 3. The captures

The round's 404 pair (ours + ref at desktop + the phone 390 axis) +
the dev-server set of the remediated tree, numbered past the s196
600-612 (landing at 613+), saved under `docs/screenshots/`.

## 4. The final gate + the push

`bun run gate` (lint 0/0 · tsc 0 · 138/2813 · build · smoke 14/14 ·
CI=1 e2e 195/195) · the not-found sweep leg at all four bands
(`--fail-on-drift`) · probe:ref STABLE re-check · db census MATCH ·
the SSH-wrapper push to main (`git@github.com:nordeim/neo-crm.git`),
no new branch, the wrapper's verified-push form.

## 5. The execution record (2026-10-28)

Executed as planned, in the order above, all green:

- **The baseline**: lint 0/0 · tsc 0 · 138/2811 unit · build · smoke
  14/14 · e2e 195/195 (clean first run, 5.6m) · probe:ref STABLE at
  `46bc2d9c` · db census MATCH (15/24/10/23/12 + 4 users at
  `<repo>/db/custom.db`) — the fresh-sandbox environment rebuilt in
  the intake (bun 1.4.4 + the Playwright chromium install + the .env
  rebuilt with a fresh 64-hex AUTH_SECRET).
- **The discovery** (scripts/discover-197.ts): the standing data-gated
  re-checks ALL KILLED at the reference's unchanged zero-data state ·
  the conditional gates KILLED (probe:ref STABLE; the registry's
  latest recharts 3.10.1) · the s120-era interactive-table candidate
  KILLED by the source/deps/gates evidence · the coverage audit's
  finds: the 404 the only two-app-renderable un-swept surface (the
  maiden 0.01/0.04/0.01/0.01 at the four bands, badge-closed) ·
  /signup + /reset-password OURS-ONLY outside the two-app sweep ·
  the anon 404 posture re-verified STANDING.
- **D-197a1**: the 14th PAGES entry + the PageEntry interface with the
  waitFor override + the captureAll heading-404 branch + the four
  STANDING_BASELINES entries (0.1) + the three test faces (the PAGES
  census re-anchored 14 + the waitFor pin + the baselines pin).
  Born-green: the sweep `--pages not-found --fail-on-drift` GREEN at
  all four bands (0.01 desktop · 0.03 phone · 0.02 tablet · 0.02
  landscape). MUTATION-PROVEN ×2: the planted `text-8xl` h1 regression
  → the DRIFT trip exactly at not-found (1.12% > allowed 0.60%,
  exit 1) → restored → 0.01% clean; the removed desktop baseline →
  exactly 2 unit REDs (the baselines pin + the coverage-loop pin) →
  restored → GREEN.
- **D-197a2**: the sweep header's four stale s91-era count comments +
  the suite's own two re-anchored to the count-proof NAME form; the
  F-98a1/N-97a1 guards re-anchored (the negatives grow the retired
  ten-forms, the live faces move to the NAME form).
- **The lockstep**: skill-head-197.py ran FIRST (the SKILL v1.194.0,
  the s196 layer comment-demoted at its ship counts 2811/195, the
  s197 layer live at 2813/195 + the beneath-it tail, idempotent; the
  surgery's live catch: the H1 flip's bare-substring guard was fooled
  by the new layer text mentioning "the SKILL v1.194.0" — the H1
  flipped directly + the script hardened to the exact-H1 form) ·
  count-ladder-197.py (assert-first, idempotent, unique-anchor — 18
  flips) · the test-side re-anchors (the docs-counts layer-axis
  [first = s197, second = s196] · the unit negatives ladder [the
  retired 2811 site-forms join the negatives on the s166 block] · the
  dialog-geometry-parity F-92a3 ladder [the four CLAUDE live positives
  re-anchored 2813 + the 2811 forms join the negatives]) · the docs
  (the AGENTS Session-197 section · session_416.md · the PAD §7.1
  s197 inventory row · the README walk-contracts paragraph's s197
  clause · this execution record · the worklog entry {Task ID 197}).
- **The unit battery with the re-anchored lockstep**: 138/2813 GREEN.
- **The sandbox reset mid-round** (the environment note): the round's
  work was re-applied verbatim from the execution record after a full
  sandbox reset between sessions — every edit reproduced exactly, the
  verification legs re-run at the fresh environment, the mutation
  proofs re-verified live (the text-8xl drift trip at the fresh
  sweep build). The reset cost zero source truth.
