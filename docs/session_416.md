# Session 416 — THE SWEEP-STATE COVERAGE AUDIT (the session-197 round record)

Date: 2026-10-28 · Rotation: 197 · Agent: main (Z.ai) ·
Plan: `docs/plans/2026-10-28-session197-sweep-coverage-404-registration.md`

## The round

The post-196 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`769ba13` — the session_415 transcript, the s196 round's own
execution record). The round is THE SWEEP-STATE'S OWN COVERAGE AUDIT —
the s412 close's other naming ("the re-walk staleness ladder [the
walk50 drawer + the s144-era marketing exteriors] or the sweep-state's
own coverage audit": the drawer member walked + gate-frozen at s196,
this round takes the other naming), adjudicated by
`scripts/discover-197.ts` BEFORE the plan, with the s120-era
interactive-table candidate adjudicated in the same pass.

## The audit (the baseline + the discovery)

The baseline gate GREEN at the exact s196 ship state (the fresh-sandbox
clone to `769ba13`, tree clean — the environment rebuilt in the
intake: bun 1.4.4 + the Playwright chromium install + `db:push`/
`db:seed` + the `.env` rebuilt from `.env.example` with a fresh 64-hex
AUTH_SECRET): lint 0/0 · tsc 0 · **138/2811** unit · build (the
type-gate artifact) · smoke **14/14** (the sitemap + robots +
manifest 200s ride check 12) · e2e **195/195** (clean first run,
5.6m) · probe:ref STABLE (`46bc2d9c` — the bundle md5 unchanged, the
demo data still ZERO, the desktop + TRUE-390 + landing censuses
STANDING) · db census MATCH (15/24/10/23/12 + 4 users at
`<repo>/db/custom.db` — the `.env` `DATABASE_URL="file:../db/custom.db"`
with `db/` at the repo root, the operator's standing ask verified).

The discovery verdicts: the standing data-gated re-checks ALL KILLED
at the reference's unchanged zero-data state (the Edit-family census
rows=1 the empty-state rows, rowMenus=0, the topbar-search
populated=0 on both, the dashboard follow-up-rows checkbox arms + the
activities Completed-tab empty — the discover-184..197 standing
census) · the conditional gates KILLED (probe:ref STABLE kills the
fresh-bundle re-derivation; the registry's latest recharts 3.10.1
kills the 4.0 gate) · the s120-era interactive-table candidate KILLED
by evidence (the leads family source-frozen since s113 — 84 sessions;
the deps frozen; the family's only computed-style change vector since
s120 the s193a1 outline-color rule, decoded at s193 and drift-gated by
the /leads sweep baselines at the 0.1 floor at every band — a re-walk
re-derives the s196 verdict).

## The coverage audit (the round's material)

The app's renderable routes vs. the standing drift-gate inventories
(the sweep PAGES 13 · the interior census 12 + the public leg 1 · the
fullpage 1 = the landing only): **/signup** and **/reset-password**
are OURS-ONLY supersets outside the two-app sweep (the REF has no such
routes — its /signup renders its own 404, its /reset-password a blank
shell; both surfaces e2e-pinned already) · **THE 404 is the only
two-app-renderable surface with ZERO drift-gate coverage** — OURS
renders the designed 404 at the unknown URL with the true HTTP 404
(session-independent, the D-194a5 construction), the REF renders its
own designed 404 PAST its auth guard (http 200, its platform badge
riding), NO `main` on either app's 404 (the bare root not-found). The
maiden measurement (the pair captured at the sweep's own four bands,
badge closed, the h1-404 content-wait): desktop 1440×900 **0.01%** ·
phone 390×844 **0.04%** · tablet 768×1024 **0.01%** · landscape
1024×768 **0.01%** — the byte-identical family floor, no genus at any
band. The anon posture re-verified STANDING (OURS the 404 at the
unknown URL http 404; the REF the wall redirect with the from_url
round-trip).

## The cures (the TDD ledger)

**D-197a1 — THE 404 SWEEP REGISTRATION.** The s194 walk67 decoded the
404's faces; the s195 pins hold its render + its TRUE-404 status + its
a11y registrations; no gate held its PIXELS — a future pixel
regression on the surface would have kept every gate green. THE CURE:
the born-green sweep registration (the s195a1/s196a1 wire-freeze
doctrine's next member): the 14th PAGES entry `{ name: "not-found",
path: "/no-such-sweep-route", waitFor: "heading-404" }` + the per-page
capture-wait override in `captureAll` (the bare 404 carries NO main —
the shell-wait soft-falls its full 15s burn per capture; the h1 "404"
is the content-wait anchor instead, present on BOTH apps' designed
404s) + the STANDING_BASELINES entries at all four bands (0.1 the
family floor) + the sweep-tool pins (the PAGES census re-anchored
13 → 14 + the waitFor override pin + the not-found baselines pin —
UNIT +2, the suite census held at 138). Born-green at all four bands
(`--pages not-found --fail-on-drift`: 0.01 desktop · 0.03 phone ·
0.02 tablet · 0.02 landscape — the seed restored after every run).
MUTATION-PROVEN ×2: the planted `text-8xl` h1 regression → the sweep
DRIFT trip exactly at not-found (**1.12% > allowed 0.60%, exit 1**)
→ restored → 0.01% clean; the removed desktop baseline → exactly 2
unit REDs (the new baselines pin + the standing coverage-loop pin),
zero collateral → restored → GREEN.

**D-197a2 — THE SWEEP HEADER'S OWN STALE PAGE CENSUS.** The s91-era
count-anchored comments ("the ten pages") survived three page
additions (s96/s142/s144) — and the s98 F-98a1 guard's own live face
went stale WITH them (`toMatch(/ten pages|ten-page/)` pinned the
stale count as "the corrected phrasing" since s144). THE CURE: the
sweep header + the suite's own two comments re-anchored to the
count-proof NAME form ("the PAGES list" / "the full PAGES sweep");
the F-98a1/N-97a1 guards re-anchored — the negatives grow the retired
ten-forms (the s192 doctrine), the live faces move to the NAME form.

DECLINED (the parity + scaffolding doctrines): the census 404
registration (a third collector for one page — speculative scaffolding;
the element ledger walk-frozen + source-pinned) · /signup +
/reset-password in the sweep (OURS-ONLY, e2e-pinned already) · the
s120-era re-walk (KILLED by the discovery evidence).

## The count ladder + the docs lockstep

UNIT 2811 → **2813** (+2) · SUITES 138 HELD · E2E 195 HELD · badge
3006 → **3008**. The head surgery first (skill-head-197.py — the SKILL
v1.194.0, the s196 layer comment-demoted at its ship counts 2811/195,
the s197 layer live at 2813/195 + the beneath-it tail, idempotent; the
surgery's own live catch: the H1 flip's bare-substring guard was
fooled by the new layer text mentioning "the SKILL v1.194.0" — the H1
flipped directly + the script hardened to the exact-H1 form), then
count-ladder-197.py (assert-first, idempotent, unique-anchor — 18
flips). The test-side re-anchors in the same stroke: the docs-counts
layer-axis (first = s197, second = s196 at its ship 2811/195) · the
unit negatives ladder (the retired 2811 site-forms join the negatives
on the docs-counts s166 block) · the dialog-geometry-parity F-92a3
ladder (the four CLAUDE live positives re-anchored 2813 + the 2811
forms join the negatives). The docs lockstep: the AGENTS Session-197
section · this record · the PAD §7.1 s197 inventory row · the README
walk-contracts paragraph's s197 clause · the plan's execution record ·
the worklog entry {Task ID: 197}.

## The verification (the final gate)

lint 0/0 · tsc 0 · **138/2813** unit · build · smoke **14/14** ·
e2e **195/195** · the not-found sweep leg GREEN at all four bands ·
db census MATCH · probe:ref STABLE. The captures: the round's 404 pair
(ours + the reference) + the dev-server set under `docs/screenshots/`.

## The next rotation's standing material

The sweep-state's own coverage audit is closed — every two-app
renderable surface now carries drift-gate teeth (the sweep 14 · the
census 12+1 · the fullpage 1), and the two ours-only supersets are
documented outside the two-app sweep by construction. The next
staleness candidates: the s120-era interactive-table re-walk (the
discovery's evidence kill standing until the leads family source,
a dep, or the reference bundle moves) or a fresh data-gated round if
the reference gains demo data. The conditional gates unchanged (the
fresh-bundle re-derivation when probe:ref trips; the recharts 4.0
gate).
