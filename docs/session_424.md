# Session 424 — THE A11Y REGISTER'S PHONE-WIDTH DIALOG-OPEN COVERAGE AUDIT (the session-201 round record)

Date: 2026-10-30 · Rotation: 201 · Agent: main (Z.ai) ·
Plan: `docs/plans/2026-10-30-session201-a11y-register-phone-dialog-width-coverage.md`

## The round

The post-200 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`0e78b16` — the session_423 transcript, the s200 round's own
execution record). The round took THE S200 CLOSE'S BANKED STANDING
CANDIDATE — the width-scope arm of the register's dialog-open family.
The register's head criterion ("one test() per surface × width") had
been VIOLATED by the dialog family since s172: the 11 open states
carried ONE width (desktop-only) while the page family carried both —
the s199a2 re-anchor WORDED a criterion the register never satisfied
for this family (the width-blind genus, born false at s199, held
through s200, no pin holding it).

## The audit (the baseline + the discovery)

The baseline gate GREEN at the exact s200 ship state (the workspace at
`0e78b16`, tree clean — lint 0/0 · tsc 0 · **138/2827** unit ·
probe:ref STABLE at `46bc2d9c` — the bundle md5 unchanged, the demo
data still ZERO · db census MATCH (15/24/10/23/12 + 4 users at
`<repo>/db/custom.db` — the `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, the
operator's standing ask verified) · `bun audit` live: 9 (4 high / 4
moderate / 1 low) — the exact s198-pinned census, no drift; the
dormancy re-check pdf-export.ts `.html(`= 0).

The discovery verdicts (`scripts/discover-201.ts`): the standing
data-gated re-checks ALL KILLED at the reference's unchanged zero-data
state (OURS rows=15/24/10 with the rowMenus live, the REF rows=1 the
empty-state rows — the discover-184..201 standing census) · the
conditional gates KILLED (probe:ref STABLE kills the fresh-bundle
re-derivation; the registry's latest recharts 3.10.1 kills the 4.0
gate) · the s120-era re-walk kill STANDING (the leads family
source-frozen since s113 — 88 sessions) · the pre-ship audit duty
CLEAN against the s198 triple pins.

## The width-scope census (the round's material)

The register's live census: 44 registrations (33 page-family + 11
dialog-open — read live from the spec). The WIDTH split: the
dialog-open family **11 desktop / 0 phone**. THE WIDTH-BLIND GENUS:
the spec's own head criterion claims "one test() per surface × width"
— CARRIED since the s199a2 re-anchor, VIOLATED by the dialog family
the whole time. THE BORN-GREEN RE-VERIFICATION (the s172 discovery
doctrine — the live axe probes BEFORE the plan): all 11 phone
dialog-open states probed at 390×844 with the VISIBLE-DIALOG open-wait
guard — **structural=0 on every open state** (11/11); the GATE 2
landscape: 7 states zero-flag, 4 states carrying contrast flags that
ALL cite existing sanctioned matchers (the quick-log `bg-emerald-600`
· the accounts badge/border family · the calendar `text-gray-400` ·
the `-trigger-` segmented pair) — the phone landscape is the desktop
landscape minus the sidebar arms (hidden below lg at phone). THE
MUTATION-CANDIDATE DECODE: the contacts Import trigger decoded live at
both widths — at 390 the visible span computes `display:none`
(EVAPORATED — the `aria-label="Import"` is the ONLY accessible name),
at 1280 the span computes `display:block` (the visible text carries
the name) — the phone-only regression class the desktop-only register
is structurally blind to, the round's own teeth.

## The cures (the TDD ledger)

**D-201a1 — THE REGISTER'S PHONE-WIDTH DIALOG-OPEN COVERAGE.** THE
CURE: +11 e2e registrations at 390×844 (the s199 open-state form: open
→ the VISIBLE-DIALOG open-wait guard → scanTwoGate → Escape): the
five create dialogs (New Lead · New Account · New Contact · New Event
· Log Call) + the six edit/standalone states (Edit Contact · Edit
Lead · Edit Account · Import Contacts · Account Insights · Save
Custom Report View). THE PINS (the dialog-controls suite, the
one-suite doctrine): the containment pair + the phone-width census
pin (eleven, live-read) + THE REQUIRED TEST-SIDE RE-ANCHOR: the s199
(e) census pin re-anchored eleven → twenty-two — RED-first at birth
(exactly 5 RED, zero collateral) → the registrations → born-green
(11/11 the first run). MUTATION-PROVEN: the planted
`aria-label="Import"` removal on the contacts Import trigger (the
hidden-sm:inline genus) → the NEW phone Import registration RED (the
role-based opener — the nameless trigger is UNFINDABLE by name at
phone) + the standing phone /contacts page registration RED (the axe
button-name rule, citing `.px-4.py-2.text-foreground:nth-child(3)`)
→ EVERY desktop registration GREEN (the visible span carries the name
at 1280) → restored → GREEN.

**D-201a2 — THE SPEC'S OWN WIDTH-BLIND CRITERION CLAIM.** The head
criterion ("one test() per surface × width") was born FALSE at s199 —
the dialog family carried one width — and no pin has ever held it.
THE CURE: the phone family registered (the criterion TRUE for every
family) + THE PIN PAIR: the width-pair census (every desktop dialog
registration carries its phone twin — the live read: the
desktop/phone label equality + the per-label twin containment) + the
criterion-form pair (the ×width criterion is the live face + the
width-blind "per surface" form never returns) — RED-first at birth →
the registrations → GREEN. MUTATION-PROVEN: the planted phone-twin
removal trips the width-pair census + the containment + the census
pins (4 RED) → restored → GREEN.

**THE LIVE CATCH (the mutation landscape decoded):** while a Radix
Dialog is open, hideOthers aria-hides the app root — GATE 1
(structural) sees ONLY the dialog content (the page furniture leaves
the a11y tree), while GATE 2 (color-contrast) still cites the PAINTED
page behind (the visual rule's applicability is on-screen visibility)
— the open-dialog scan mechanics documented in the spec's s201 family
comment; the s172-era "the same page furniture behind the dialog"
claim is the GATE 2 landscape only.

DECLINED (recorded considered-and-declined in the plan): the Edit
Event + Edit Activity edit modes at phone (the same-component
adjudication carried to the width axis) · the login card's in-card
view states at phone (the client-state genus) · the drawer-open state
at desktop (the width-inverse — the drawer renders at PHONE only).

## The count ladder + the docs lockstep

UNIT 2827 → **2832** (+5: the dialog-controls session-201 describes —
the containment pair + the phone census + the width-pair census + the
criterion pair) · SUITES **138 HELD** (the one-suite doctrine) · E2E
206 → **217** (+11: the eleven phone registrations; the Appendix B
a11y row re-anchored 44 → 55) · badge 3033 → **3049** (the unit+e2e
arithmetic: 2832+217). The head surgery first (skill-head-201.py —
the SKILL v1.198.0, the s200 layer comment-demoted at its ship counts
2827/206, the s201 layer live at 2832/217, idempotent), then
count-ladder-201.py (assert-first, idempotent — the docs-counts UNIT +
E2E constants · the README badge + Tested row + tree + commands + the
two s102-P1 e2e tree/commands sites · the AGENTS commands + gate-order
· the CLAUDE gate-order + commands + pyramid + the coverage seam + the
a11y family description's s201 closure (every Radix Dialog's open
state registered at BOTH widths) · the PAD tree + Total + HEAD +
checklist + commands + the §11 a11y row (the line census 593 → 764 +
the family) + the §11 dialog-controls row (306 → 391 + the s201 pins)
· the SKILL commands + Appendix B unit + e2e totals + the a11y row 44
→ 55) + the test-side re-anchors in the same stroke (the docs-counts
layer-axis [first = s201, second = s200 at its ship 2827/206] + the
unit negatives ladder [the retired 2827 site-forms join the negatives]
+ the login-family E2E ladder [the retired E2E 206 form joins its
negatives, the live positive re-anchored 217] + the
dialog-geometry-parity F-92a3 ladder [the four CLAUDE live positives
re-anchored 2832 + the 2827 forms join the negatives]). The docs
lockstep: the AGENTS Session-201 section · this record · the PAD §7.1
s201 inventory row + the §11 rows · the README walk-contracts
paragraph's s201 clause · the plan's execution record · the worklog
entry {Task ID: 201}.

## The verification (the final gate)

lint 0/0 · tsc 0 · **138/2832** unit · build (the type-gate artifact)
· smoke **14/14** · e2e **217/217** · the four-band sweep GREEN (the
cure's baseline-inertness proof — zero pixel-bearing surface touched)
· `bun audit` (9, all dev-toolchain, the triple-pinned posture) · db
census MATCH · probe:ref STABLE. The captures: the phone dialog-open
pair (ours + the reference — the round's own 390×844 axis) + the
dev-server set of the eleven phone dialog-open states + the mobile
drawer-open face (the operator's standing mobile-nav ask) under
`docs/screenshots/`.

## The next rotation's standing material

The register's dialog-open family is now WIDTH-COMPLETE (every Radix
Dialog's open state registered at BOTH widths, the head criterion
held by the width-pair census pin) and the page family has been
both-widths since s171 — the register is closed on every axis its
criterion names. THE STANDING CANDIDATES: the register's remaining
client-state arms (the login card's in-card view states — the s192
cures + the unit batteries hold the wiring; the reset-password
no-token card — the same-component adjudication) · the s120-era
interactive-table re-walk (the kill standing until the leads family
source, a dep, or the reference bundle moves) or a fresh data-gated
round if the reference gains demo data · the conditional gates
unchanged (the fresh-bundle re-derivation when probe:ref trips; the
recharts 4.0 gate) · the next `bun audit` pre-ship ride re-checks the
census against the s198 pins.
