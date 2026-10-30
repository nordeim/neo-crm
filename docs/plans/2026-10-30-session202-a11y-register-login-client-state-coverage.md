# The session-202 plan — THE A11Y REGISTER'S LOGIN-CARD CLIENT-STATE COVERAGE (the three view states + the spec's own surface-blind criterion claim)

Date: 2026-10-30 · Rotation: 202
Task: audit + validate the shipped session-201 state (commit `e6d70ba` +
the owner's transcript commit `35b2c97` — the session_425 transcript is
this round's rotation trigger), re-run the standing discovery legs (the
data-gated re-checks · the s120-era re-walk kill · the conditional
gates · the pre-ship audit duty), and take the round's fresh material
the s201 close banked: THE REGISTER'S CLIENT-STATE ARMS — the login
card's in-card view states. The register's live census is 55
registrations (33 page-family + 22 dialog-open) with ZERO client-state
view registrations at ANY width, while the login card's view machine
(`src/lib/login-reset.ts`: `signin | reset | sent | signup | verify`)
renders WHOLE-CARD DOM surfaces the resting /login scan never sees —
the s172 closed-by-default genus's client-state sibling (the view
swaps REPLACE the card's column entirely: no logo, no Google button,
no divider). THE SURFACE-BLIND GENUS: the register's own head
criterion claims "one test() per surface × width" — CARRIED true for
every registered family since s201, but the criterion's STATE axis has
never been adjudicated against the app's client-state inventory (3
whole-card view states carrying zero registrations; no pin
cross-reads the machine's union against the register). The s201 close
banked this family as the STANDING NEXT-ROUND CANDIDATE; this round's
discovery (discover-202 LEG-5b) probed every view state live at BOTH
widths — 6/6 structural=0, zero contrast flags (the born-green
pre-verification). Cure both arms the same round (the +6 born-green
registrations + the state-axis pin pair holding the criterion), align
every doc in the house lockstep, capture the round's set, push to
main via the SSH wrapper.

## 0. The audit (the baseline + the discovery)

The baseline gate at the shipped s201 state (the workspace at
`35b2c97`, tree clean): lint 0/0 · tsc 0 · **138/2832** unit · db
census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db` — the
`.env` `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo
root, the operator's standing ask verified). The build · smoke · e2e
legs ride the final gate (§4).

The discovery (`scripts/discover-202.ts` — the discover-201 form + the
client-state family leg):

- **LEG-1 the standing data-gated re-checks — KILLED** at the
  reference's unchanged zero-data state (OURS rows=15/24/10 with the
  rowMenus live, the REF rows=1 the empty-state rows, rowMenus=0 —
  the discover-184..202 standing census).
- **LEG-2 the s120-era interactive-table re-walk kill — STANDING.**
  The kill condition re-checked live: the leads family source
  untouched since s113 (`f10cee6`, 89 sessions — git log), the deps
  locked (the lockfile census: recharts 3.10.1 · lucide 0.525.0 ·
  tailwind 4.3.3 — the s196 version census unchanged), the reference
  bundle STABLE at `46bc2d9c`. Nothing moved — the kill stands.
- **LEG-3 the conditional gates — KILLED**: probe:ref re-run live —
  STABLE at `46bc2d9c` (the bundle md5 unchanged) kills the
  fresh-bundle re-derivation; the registry's latest recharts is 3.10.1
  (fetched live) — the 4.0 gate stays killed.
- **LEG-4 THE STANDING PRE-SHIP DUTY (the s164 `bun audit` doctrine)
  — CLEAN against the s198 triple pins.** `bun audit` run live
  against the shipped tree: **9 advisories (4 high / 4 moderate / 1
  low)** — the exact s198-pinned census (no drift); the vulnerable
  packages unchanged (deepmerge-ts · vite · zod · source-map-js — all
  dev-toolchain transitive); the dormancy re-check:
  pdf-export.ts `.html(` call sites = 0. No material on this leg.
- **LEG-5 THE REGISTER'S CLIENT-STATE FAMILY — THE ROUND'S MATERIAL
  (the s201 close's banked candidate, probed live).** The register's
  live census: **55 registrations** (33 page-family · 22 dialog-open
  · **0 client-state view**). The LoginView machine's own census: 5
  states (`signin | reset | sent | signup | verify`), of which
  `signin` + `signup` ride the page family (the /login + /signup
  registrations) — **the UNREGISTERED view states: reset · sent ·
  verify** (3 whole-card surfaces, zero two-gate registrations at ANY
  width). THE SURFACE-BLIND GENUS: the spec's own head criterion
  claims **"one test() per surface × width"** — CARRIED since s171,
  held true for every registered family by the s201 width-pair pin,
  but the STATE axis is unpinned and violated (no pin cross-reads
  the machine's union against the register; the s200/s201
  declined-posture "the batteries hold the wiring" was carried
  without a single two-gate tooth). THE BORN-GREEN RE-VERIFICATION
  (the s172 discovery doctrine — the live axe probes BEFORE the
  plan): all 3 view states probed at BOTH widths (1280×800 +
  390×844, fresh anon contexts, the VIEW-SENTINEL open-wait guards —
  the L-164c2 form) — **structural=0 on every state (6/6); the GATE 2
  landscape: zero contrast flags** (the views' slate-900/600 on
  white passes AA unassisted). THE MUTATION-CANDIDATE DECODE (the
  client-state name-evaporation family): the verify view's six code
  inputs decoded live — each carries `aria-label="Digit N"` as the
  ONLY accessible name (no wired `<label>`, no placeholder, no
  title; `inputMode="numeric"`), so a dropped aria-label ships SIX
  nameless inputs inside a view NO existing registration ever scans
  (the /login page registration scans the SIGNIN view; the dialog
  families never reach the login card) — the round's own teeth. THE
  RICHER-FACE DECODE: the sent view's demo-email ride renders the
  resetUrl anchor ("Open your password reset link" — the in-app
  delivery, the knob pinned "" in the e2e env) — the richer face is
  the registered form (the s200 reset-password precedent); the
  ride's token row is census-inert, and the e2e db is the scratch
  reseeded context (the reset-password.spec round-trip precedent).
  THE STALE-CLAIM FIND (LEG-5d, the state axis of the
  s197a2/s199a2/s200a2/s201a2 pattern): the spec head's criterion
  claim (above) + the CLAUDE a11y family description's page-surface
  closure ("every renderable page surface registered at both
  widths" — page-scoped, true for pages, silent on the
  client-state genus) + the PAD §7.1 rows' declined rationale ("the
  login-views/login-reset batteries hold the wiring" — the
  functional wiring, never the a11y face).

### The findings triage

**FIX THIS ROUND (the client-state round — zero pixel risk by decode,
born-green by the live probes):**

- **D-202a1 (Verified) — THE REGISTER'S CLIENT-STATE COVERAGE.** The
  three un-registered view states get their two-gate registrations at
  BOTH widths (+6, the s199 open-state form with the VIEW-SENTINEL
  open-wait guards): the reset view (the "Forgot password?" swap),
  the sent view (the reset ride + the demo-email "Send reset link"
  POST — the no-enumeration 200 + the resetUrl anchor, the richer
  face), the verify view (the in-card "Need an account?" signup ride
  on a throwaway email — the s163 in-app OTP delivery). + THE PINS
  (in `tests/dialog-controls.test.ts`, the one-suite doctrine): the
  containment pair (the reset + sent views at both widths + the
  verify view at both widths, each naming its registrations) + the
  client-state census pin (six view-state registrations — the live
  read of the view-labeled test() names) — RED-first at birth (the
  labels do not exist yet; the census reads 0) → the registrations →
  GREEN. MUTATION-PROVEN: the planted `aria-label={`Digit ${idx +
  1}`}` removal on the verify view's code inputs
  (`src/components/layout/login-card.tsx` — the client-state
  name-evaporation genus decoded live at LEG-5c) → BOTH verify-view
  registrations RED exactly at the axe `label` rule (the six
  nameless inputs; `getByLabel`-driven rides unaffected — the rides
  complete, the SCAN catches the genus) → EVERY other registration
  GREEN (the signin-page registrations scan the signin view; the
  dialog families never reach the login card — the register's
  surface-blindness, the round's own rationale) → restored → GREEN.
- **D-202a2 (Verified) — THE SPEC'S OWN SURFACE-BLIND CRITERION
  CLAIM.** The head criterion ("one test() per surface × width") has
  been surface-blind since the register's s171 birth for the
  client-state genus: the view machine renders whole-card DOM
  surfaces no resting-page scan ever sees, the criterion's STATE
  axis was never adjudicated against the machine's inventory, and no
  pin has ever held it (the s201a2 width-pair pin holds the WIDTH
  axis only). THE CURE: the client-state family registered (the
  criterion TRUE on the state axis for every family — a1) + THE PIN
  PAIR (the dialog-controls session-202 (l) describe): the
  state-machine census (every `LoginView` state the machine names
  rides the two-gate SOMEWHERE in the register — the live cross-read
  of the `src/lib/login-reset.ts` union against the spec's labels:
  `signin`/`signup` via the page registrations, `reset`/`sent`/
  `verify` via the view registrations; a future view state added to
  the machine without its registration trips it) + the state-pair
  census (every view-state registration carries its width twin —
  the live read: the desktop/phone label equality + the per-label
  twin containment + the family's live count equals the machine's
  un-page-registered state count) — RED-first at birth (the
  state-machine census reads 3 unregistered states) → the
  registrations → GREEN. MUTATION-PROVEN: the planted view-state
  registration removal (one width twin deleted) → the state-pair
  census + the containment + the census pins RED → restored →
  GREEN.

**DECLINED (recorded considered-and-declined for the next audit's
re-triage):**

- **The reset-password no-token card state** — the same-component
  adjudication (the s200 posture stands: the shared
  ResetPasswordScreen; the set-password FORM state is the registered
  richer face).
- **The landing page's client-state arms** (the FAQ open-item switch
  + the mobile disclosure menu) — the marketing batteries
  (landing.spec + marketing-mobile.spec + the walk65/66 arms) hold
  the wiring; the round's genus is the login card's whole-column
  view swaps (the FAQ's open-item switch renders the same family
  DOM the resting landing registration already scans; the mobile
  menu is the drawer-genus sibling — a standing candidate for a
  future round).
- **The signup view's in-card registration at /login** — the
  same-component adjudication (the s199 Edit Event/Activity
  precedent: the /signup page registration scans the identical
  signup-view DOM; the in-card swap is the same component at the
  same width).

## 1. The TDD ledger (the cure plan)

- **D-202a1 — RED-first spec-contract pins, then the registrations:**
  1. `tests/dialog-controls.test.ts`: the NEW session-202 (k)
     describe — the containment pair (the reset + sent views at both
     widths + the verify view at both widths, each naming its
     registrations) + the client-state census pin (six view-state
     registrations — the live read of the `view OPEN`-labeled
     test() names) → **RED at birth** (the spec carries 0
     view-state registrations; the census reads 0).
  2. THE CURE: `tests/e2e/a11y.spec.ts` grows the session-202
     describe (the anon-family form: the storageState opt-out) + the
     six registrations, each with its VIEW-SENTINEL open-wait guard
     (the L-164c2 vacuous-green cure):
     - "desktop /login with the reset view OPEN" · "phone /login
       with the reset view OPEN" (the "Forgot password?" swap → the
       h2 sentinel);
     - "desktop /login with the sent view OPEN" · "phone /login
       with the sent view OPEN" (the reset ride + the demo email +
       "Send reset link" → the h2 sentinel — the richer face with
       the resetUrl anchor);
     - "desktop /login with the verify view OPEN" · "phone /login
       with the verify view OPEN" (the in-card "Need an account?"
       signup ride on a throwaway email → the h2 sentinel).
  3. Born-green verification: the six registrations run green on the
     first run (the discovery's live probes pre-verified
     structural=0 + zero contrast flags on every state at both
     widths).
  4. MUTATION-PROOF: the planted aria-label removal on the verify
     view's code inputs (`src/components/layout/login-card.tsx` —
     the `aria-label={`Digit ${idx + 1}`}` line) → BOTH verify-view
     registrations RED exactly at the axe `label` rule (the six
     nameless inputs) → EVERY other registration GREEN (the
     register's surface-blindness — no existing family scans the
     verify view) → restored → GREEN.
- **D-202a2 — RED-first state-axis pins, then the registrations:**
  1. `tests/dialog-controls.test.ts`: the NEW session-202 (l)
     describe — the state-machine census (every `LoginView` state
     rides the two-gate somewhere — the live cross-read of the
     `src/lib/login-reset.ts` union against the spec's labels) +
     the state-pair census (every view-state registration carries
     its width twin + the family's live count equals the machine's
     un-page-registered state count) → **RED at birth** (the
     state-machine census reads 3 unregistered states; the
     state-pair census reads 0 ≠ 3).
  2. THE CURE: the a1 registrations (the criterion TRUE on the
     state axis for every family) → GREEN.
  3. MUTATION-PROOF: the planted view-state registration removal
     (one width twin deleted from the spec) → the state-pair census
     + the containment + the census pins RED → restored → GREEN.

## 2. The count ladder + the docs lockstep

UNIT 2832 → **2837** (+5: the dialog-controls session-202 describes —
the containment pair + the client-state census + the state-machine
census + the state-pair census) · SUITES **138 HELD** (the one-suite
doctrine — the new pins ride the EXISTING dialog-controls suite) ·
E2E 217 → **223** (+6: the six view-state registrations; the Appendix
B a11y row re-anchored 55 → 61) · badge 3049 → **3060** (the
unit+e2e arithmetic: 2837+223). `skill-head-202.py` FIRST (the SKILL
v1.199.0, the s201 layer comment-demoted at its ship counts
2832/217, the s202 layer live at 2837/223 + the beneath-it tail,
idempotent, the s197 exact-H1 guard form), then
`count-ladder-202.py` (assert-first, idempotent, unique-anchor — the
docs-counts UNIT + E2E constants · the README badge + Tested row +
tree + commands + the two s102-P1 e2e tree/commands sites · the
AGENTS commands + gate-order (unit + e2e) · the CLAUDE gate-order +
commands + pyramid (unit + e2e) + the coverage seam + the a11y family
description's s202 closure (the client-state arm: the login card's
every view state registered at BOTH widths) · the PAD tree + Total +
HEAD + checklist + commands + the §11 a11y row (the line census +
the family) + the §11 dialog-controls row (the line census + the
s202 pins) · the SKILL commands + Appendix B unit + e2e totals + the
a11y row 55 → 61) + the test-side re-anchors in the same stroke (the
docs-counts layer-axis [first = s202, second = s201 at its ship
2832/217] + the unit negatives ladder [the retired 2832 site-forms
join the negatives] + the login-family E2E ladder [the retired E2E
217 form joins its negatives, the live positive re-anchored 223] +
the dialog-geometry-parity F-92a3 ladder [the four CLAUDE live
positives re-anchored 2837 + the 2832 forms join the negatives]). The
docs lockstep: the AGENTS Session-202 section · `docs/session_426.md`
· the PAD §7.1 s202 inventory row (inserted BEFORE the Total row —
the s180 table-termination doctrine) + the §11 rows · the README
walk-contracts paragraph's s202 clause · this plan's execution record
· the worklog entry {Task ID: 202}.

## 3. The captures

The round's pair: one client-state view surface OURS + the REFERENCE
(the two-app-openable surface — the reset view, the walk65-walked
member: the "Forgot password?" swap at the desktop axis on both
apps) + the dev-server set of the remediated tree: the three view
states at both widths (the reset + sent + verify views, each captured
OPEN at 1280×800 + 390×844) + the mobile drawer-open face at
390×844 (the operator's standing mobile-nav ask) + the dashboard —
numbered past the s201 646-659 (660+), saved under
`docs/screenshots/`, the VLM battery on the round's pair (the house
evidence form).

## 4. The final gate + the push

`bun run gate` (lint 0/0 · tsc 0 · 138/2837 · build · smoke 14/14 ·
CI=1 e2e 223/223) · the four-band sweep GREEN (`--fail-on-drift`,
the cure's baseline-inertness proof: zero pixel-bearing surface
touched) · `bun audit` (9, all dev-toolchain, the triple-pinned
posture) · probe:ref STABLE re-check · db census MATCH · the
SSH-wrapper push to main (`git@github.com:nordeim/neo-crm.git`), no
new branch, the wrapper's verified-push form.

The rate-limit arithmetic (the e2e rides' budget): signup 9/10 per
IP/15min (a11y's 2 verify rides + auth.spec's 5 + reset-password's
2 — retries 0, the fresh CI=1 boot, the N-69a hazard family
documented) · forgot ~5/10 (a11y's 2 sent rides + auth.spec's 1 +
reset-password's rides). Both budgets hold.

## 5. The execution record (2026-10-30)

Executed as planned, in the order above, all green:

- **The baseline**: lint 0/0 · tsc 0 · 138/2832 unit · db census MATCH
  (15/24/10/23/12 + 4 users at `<repo>/db/custom.db`) — the workspace
  at `35b2c97`, tree clean.
- **The discovery** (scripts/discover-202.ts): the standing data-gated
  re-checks ALL KILLED (OURS rows=15/24/10, the REF rows=1 the
  empty-state rows — the discover-184..202 standing census) · the
  conditional gates KILLED (probe:ref re-run live — STABLE at
  `46bc2d9c`; the registry's latest recharts 3.10.1) · the s120-era
  re-walk kill STANDING (the leads family source-frozen since s113 —
  89 sessions) · the pre-ship audit duty CLEAN vs the s198 triple
  pins (bun audit 9: 4h/4m/1l exactly; the dormancy `.html(`= 0) ·
  **THE CLIENT-STATE CENSUS**: the register 55 (33 page + 22 dialog +
  0 view) / the machine's 5 states with 3 UNREGISTERED (reset · sent
  · verify — the surface-blind genus) / **the LIVE axe probes: 6/6
  view states structural=0 at BOTH widths with the view-sentinel h2
  guards; zero contrast flags** / the mutation-candidate decoded live
  (the verify view's six code inputs: the aria-label "Digit N" the
  ONLY name — no wired label, no placeholder, no title) / the
  richer-face decode (the demo-email sent view renders the resetUrl
  anchor).
- **D-202a1**: the spec-contract pins RED-first into
  tests/dialog-controls.test.ts (the session-202 (k) describe: the
  containment pair + the client-state census — exactly 5 RED at birth
  incl. the (l) pair, zero collateral) → the +6 registrations in
  tests/e2e/a11y.spec.ts → born-green (6/6 the first run; the full
  spec 62 passed) → **MUTATION-PROVEN**: the planted
  `aria-label={`Digit ${idx + 1}`}` removal on the verify view's code
  inputs → BOTH verify-view registrations RED exactly at the axe
  `label` rule (citing `input[autocomplete="one-time-code"]` etc. —
  the six nameless inputs; the rides still complete, the sentinel is
  the heading) → EVERY other registration GREEN (60 passed — the
  register's surface-blindness, the round's own rationale) →
  restored → GREEN (6/6 on the scoped re-run).
- **D-202a2**: the state-machine census + state-pair census pins
  RED-first at birth (the state-machine census reads 3 unregistered
  states) → the registrations (a1) → GREEN → **MUTATION-PROVEN**: the
  planted phone verify-twin removal trips the state-pair census + the
  containment-b + the client-state census (exactly 3 RED; the
  state-machine census stays GREEN by design — the state axis holds
  via the desktop twin, the correct state/width division of labor) →
  restored → GREEN (34/34).
- **The required test-side re-anchor**: the s200 (g) page-family
  census pin re-anchored to subtract BOTH non-page families (total
  minus dialog-open minus view-state = 33) — caught live by the pin
  itself the moment the family joined (the RED was the anchor's own
  proof).
- **The lockstep**: skill-head-202.py ran FIRST (the SKILL v1.199.0,
  the s201 layer comment-demoted at its ship counts 2832/217, the
  s202 layer live at 2837/223, idempotent) · count-ladder-202.py
  (assert-first, idempotent, unique-anchor — 46 flips incl. the §11
  a11y row 764 → 881 + the §11 dialog-controls row 391 → 514 + the
  CLAUDE a11y family description's s202 closure; the F-168c
  live-census pin caught the first-draft 510 claim mid-flight — the
  row re-anchored 510 → 514, the inventory census doing its exact
  job) · the test-side re-anchors (the docs-counts layer-axis + the
  unit negatives + the login-family E2E ladder + the
  dialog-geometry F-92a3 ladder) · the docs (the AGENTS Session-202
  section · session_426.md · the PAD §7.1 s202 inventory row [BEFORE
  the Total row] + the §11 rows · the README s202 clause · this
  execution record · the worklog entry {Task ID 202}).
- **The captures**: 660-669 (the round's client-state pair ours+ref
  at the desktop axis — the reset view, the walk65-walked member — +
  the dev-server set: the three view states at both widths + the
  mobile drawer-open face + the dashboard). The VLM battery on the
  round's pair: "structurally identical in styling and layout" (the
  sole structural note the reference's own Base44 FAB — the s149
  platform genus, never mirrored).
- **The final gate**: lint 0/0 · tsc 0 · **138/2837** unit · build ·
  smoke **14/14** · e2e **223/223** · the four-band sweep GREEN
  (`--fail-on-drift` at desktop + 390 + 768×1024 + 1024×768 — the
  drift gate clean at every band, the seed restored after every run)
  · `bun audit` 9 (all dev-toolchain, the triple-pinned posture) · db
  census MATCH · probe:ref STABLE at `46bc2d9c`.
