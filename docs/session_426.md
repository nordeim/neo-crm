# Session 426 — THE A11Y REGISTER'S LOGIN-CARD CLIENT-STATE COVERAGE AUDIT (the session-202 round record)

Date: 2026-10-30 · Rotation: 202 · Agent: main (Z.ai) ·
Plan: `docs/plans/2026-10-30-session202-a11y-register-login-client-state-coverage.md`

## The round

The post-201 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`35b2c97` — the session_425 transcript, the s201 round's own
execution record). The round took THE S201 CLOSE'S BANKED STANDING
CANDIDATE — the register's client-state arms: the login card's
in-card view states. The register's live census was 55 registrations
(33 page-family + 22 dialog-open + ZERO client-state view) while the
login card's view machine (`src/lib/login-reset.ts`: `signin | reset
| sent | signup | verify`) renders WHOLE-CARD DOM surfaces no resting
scan ever sees — the s172 closed-by-default genus's client-state
sibling (the view swaps REPLACE the card's column entirely: no logo,
no Google button, no divider). THE SURFACE-BLIND GENUS: the register's
own head criterion claims "one test() per surface × width" — CARRIED
true for every registered family since s201, but the criterion's
STATE axis was never adjudicated against the machine's inventory (3
whole-card view states carrying zero registrations at ANY width; no
pin cross-reading the union; the s200/s201 declined-posture "the
batteries hold the wiring" was carried without a single two-gate
tooth on the views).

## The audit (the baseline + the discovery)

The baseline gate GREEN at the exact s201 ship state (the workspace
at `35b2c97`, tree clean — lint 0/0 · tsc 0 · **138/2832** unit · db
census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db` — the
`.env` `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo
root, the operator's standing ask verified)).

The discovery verdicts (`scripts/discover-202.ts`): the standing
data-gated re-checks ALL KILLED at the reference's unchanged
zero-data state (OURS rows=15/24/10 with the rowMenus live, the REF
rows=1 the empty-state rows — the discover-184..202 standing census)
· the conditional gates KILLED (probe:ref re-run live — STABLE at
`46bc2d9c`; the registry's latest recharts 3.10.1 kills the 4.0 gate)
· the s120-era re-walk kill STANDING (the leads family source-frozen
since s113 — 89 sessions; the deps locked at the s196 census) · the
pre-ship audit duty CLEAN against the s198 triple pins (bun audit 9:
4h/4m/1l exactly — no drift; the dormancy `.html(`= 0 re-verified).

## The client-state census (the round's material)

The register's live census: 55 registrations (33 page-family + 22
dialog-open — read live from the spec). The LoginView machine's own
census: 5 states (`signin | reset | sent | signup | verify`), of
which `signin` + `signup` ride the page family (the /login + /signup
registrations) — **the UNREGISTERED view states: reset · sent ·
verify** (3 whole-card surfaces, zero two-gate registrations at ANY
width). THE BORN-GREEN RE-VERIFICATION (the s172 discovery doctrine —
the live axe probes BEFORE the plan): all 3 view states probed at
BOTH widths (1280×800 + 390×844, fresh anon contexts, the
VIEW-SENTINEL h2 open-wait guards — the L-164c2 form) —
**structural=0 on every state (6/6); the GATE 2 landscape: zero
contrast flags** (the views' slate-900/600 on white passes AA
unassisted). THE MUTATION-CANDIDATE DECODE: the verify view's six
code inputs decoded live — each carries `aria-label="Digit N"` as the
ONLY accessible name (no wired `<label>`, no placeholder, no title;
`inputMode="numeric"`), so a dropped aria-label ships SIX nameless
inputs inside a view NO existing registration ever scans. THE
RICHER-FACE DECODE: the sent view's demo-email ride renders the
resetUrl anchor ("Open your password reset link" — the in-app
delivery, the knob pinned "" in the e2e env) — the registered form
(the s200 reset-password precedent).

## The cures (the TDD ledger)

**C-202a1 — THE REGISTER'S CLIENT-STATE COVERAGE.** THE CURE: +6 e2e
registrations at BOTH widths (the open-state form with the
VIEW-SENTINEL h2 open-wait guards — the L-164c2 vacuous-green cure):
the reset view (the "Forgot password?" swap) ×2 · the sent view (the
demo-email "Send reset link" POST — the no-enumeration 200 + the
resetUrl anchor, the RICHER face) ×2 · the verify view (the in-card
"Need an account?" signup ladder on a throwaway email — the s163
in-app OTP delivery) ×2. THE PINS (the dialog-controls suite, the
one-suite doctrine): the containment pair + the client-state census
pin (six, live-read) — RED-first at birth (exactly 5 RED, zero
collateral) → the registrations → born-green (6/6 the first run; the
full spec 62 passed). MUTATION-PROVEN: the planted
`aria-label={`Digit ${idx + 1}`}` removal on the verify view's six
code inputs → BOTH verify-view registrations RED exactly at the axe
`label` rule (the six nameless inputs; the rides still complete — the
sentinel is the heading, the SCAN catches the genus) → EVERY other
registration GREEN (the /login page registrations scan the signin
view; the dialog families never reach the login card — the register's
surface-blindness, the round's own rationale) → restored → GREEN.

**C-202a2 — THE SPEC'S OWN SURFACE-BLIND CRITERION CLAIM.** The head
criterion ("one test() per surface × width") has been surface-blind
since the register's s171 birth for the client-state genus: the view
machine renders whole-card surfaces no resting scan sees, the
criterion's STATE axis was never adjudicated against the machine's
inventory, and no pin has ever held it (the s201 width-pair pin holds
the WIDTH axis only). THE CURE: the client-state family registered
(the criterion TRUE on the state axis for every family — a1) + THE
PIN PAIR: the state-machine census (every `LoginView` state the
machine names rides the two-gate somewhere — the live cross-read of
the `src/lib/login-reset.ts` union against the register's labels: a
future view state added to the machine without its registration trips
it) + the state-pair census (every view-state registration carries
its width twin + the family's live count equals the machine's
un-page-registered state count) — RED-first at birth (the
state-machine census reads 3 unregistered states) → the registrations
→ GREEN. MUTATION-PROVEN: the planted phone verify-twin removal trips
the state-pair census + the containment-b + the client-state census
(exactly 3 RED; the state-machine census stays GREEN by design — the
state axis holds via the desktop twin, the correct state/width
division of labor) → restored → GREEN.

**THE REQUIRED TEST-SIDE RE-ANCHOR:** the s200 (g) page-family census
pin re-anchored to subtract BOTH non-page families (total minus
dialog-open minus view-state = 33 — the s201 (e) re-anchor precedent,
the live read moving with the register).

DECLINED (recorded considered-and-declined in the plan): the
reset-password no-token card state (the same-component adjudication —
the s200 posture stands) · the landing page's client-state arms (the
FAQ open-item switch + the mobile disclosure menu — the marketing
batteries hold the wiring; the round's genus is the login card's
whole-column view swaps) · the signup view's in-card registration at
/login (the same-component adjudication — the /signup page
registration scans the identical DOM, the s199 Edit Event/Activity
precedent).

## The count ladder + the docs lockstep

UNIT 2832 → **2837** (+5: the dialog-controls session-202 describes —
the containment pair + the client-state census + the state-machine
census + the state-pair census) · SUITES **138 HELD** (the one-suite
doctrine) · E2E 217 → **223** (+6: the six view-state registrations;
the Appendix B a11y row re-anchored 55 → 61) · badge 3049 → **3060**
(the unit+e2e arithmetic: 2837+223). The head surgery first
(skill-head-202.py — the SKILL v1.199.0, the s201 layer
comment-demoted at its ship counts 2832/217, the s202 layer live at
2837/223, idempotent), then count-ladder-202.py (assert-first,
idempotent, unique-anchor — the docs-counts UNIT + E2E constants ·
the README badge + Tested row + tree + commands + the two s102-P1 e2e
tree/commands sites · the AGENTS commands + gate-order · the CLAUDE
gate-order + commands + pyramid + the coverage seam + the a11y family
description's s202 closure (the login card's three in-card view
states registered at both widths — every LoginView state the machine
names rides the two-gate) · the PAD tree + Total + HEAD + checklist +
commands + the §11 a11y row (the line census 764 → 881 + the family)
+ the §11 dialog-controls row (391 → 514 + the s202 pins — **the
F-168c live-census pin catching the first-draft 510 claim
mid-flight**, the inventory census doing its exact job) · the SKILL
commands + Appendix B unit + e2e totals + the a11y row 55 → 61) + the
test-side re-anchors in the same stroke (the docs-counts layer-axis
[first = s202, second = s201 at its ship 2832/217] + the unit
negatives ladder [the retired 2832 site-forms join the negatives] +
the login-family E2E ladder [the retired E2E 217 form joins its
negatives, the live positive re-anchored 223] + the
dialog-geometry-parity F-92a3 ladder [the four CLAUDE live positives
re-anchored 2837 + the 2832 forms join the negatives]). The docs
lockstep: the AGENTS Session-202 section · this record · the PAD §7.1
s202 inventory row + the §11 rows · the README walk-contracts
paragraph's s202 clause · the plan's execution record · the worklog
entry {Task ID: 202}.

## The verification (the final gate)

lint 0/0 · tsc 0 · **138/2837** unit · build (the type-gate artifact)
· smoke **14/14** · e2e **223/223** · the four-band sweep GREEN (the
cure's baseline-inertness proof — zero pixel-bearing surface touched)
· `bun audit` (9, all dev-toolchain, the triple-pinned posture) · db
census MATCH · probe:ref STABLE. The captures: the client-state pair
(ours + the reference — the round's own reset-view axis at 1280×800,
the VLM battery: "structurally identical in styling and layout" —
the sole structural note the reference's own Base44 FAB, the s149
platform genus, never mirrored) + the dev-server set of the three
view states at both widths + the mobile drawer-open face (the
operator's standing mobile-nav ask) under `docs/screenshots/`.

## The next rotation's standing material

The register is now closed on every axis its criterion names — the
page family both-widths since s171, the dialog family both-widths
since s201, the client-state family both-widths since s202 (the
state-machine census pin holding the machine's union against the
register). THE STANDING CANDIDATES: the landing page's client-state
arms (the FAQ open-item switch + the mobile disclosure menu — the
drawer-genus sibling on the marketing surface, this round's declined
arm) · the s120-era interactive-table re-walk (the kill standing
until the leads family source, a dep, or the reference bundle moves)
or a fresh data-gated round if the reference gains demo data · the
conditional gates unchanged (the fresh-bundle re-derivation when
probe:ref trips; the recharts 4.0 gate) · the next `bun audit`
pre-ship ride re-checks the census against the s198 pins.
