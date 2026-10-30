# The session-201 plan — THE A11Y REGISTER'S PHONE-WIDTH DIALOG-OPEN COVERAGE (the eleven phone states + the spec's own width-blind criterion claim)

Date: 2026-10-30 · Rotation: 201 ·
Task: audit + validate the shipped session-200 state (commit `45ae4f6` +
the owner's transcript commit `0e78b16` — the session_423 transcript is
this round's rotation trigger), re-run the standing discovery legs (the
data-gated re-checks · the s120-era re-walk kill · the conditional
gates · the pre-ship audit duty), and take the round's fresh material
the s200 close banked: THE REGISTER'S PHONE-WIDTH DIALOG-OPEN FAMILY —
the width-scope arm. The register's dialog-open family is DESKTOP-only
(11 registrations, 0 at phone) while the register's own head criterion
claims "one test() per surface × width" — the width-blind genus: the
s199a2 re-anchor WORDED a criterion the register has never satisfied
for the dialog family (born false at s199, held through s200). The
page family carries both widths since s171 (the hidden-sm:inline
rationale); the dialog family never did. The s200 close banked this
family as the STANDING NEXT-ROUND CANDIDATE with its born-green
pre-verification (discover-200 LEG-5d); this round's discovery
(discover-201 LEG-5b) re-probed every phone state live — structural=0
on all 11, every contrast flag citing an existing sanctioned matcher.
Cure both arms the same round (the +11 born-green registrations + the
width-pair census pins holding the head criterion), align every doc in
the house lockstep, capture the round's set, push to main via the SSH
wrapper.

## 0. The audit (the baseline + the discovery)

The baseline gate at the shipped s200 state (the fresh clone at
`0e78b16`, tree clean): lint 0/0 · tsc 0 · **138/2827** unit · db
census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db` — the
`.env` `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo
root, the operator's standing ask verified). The build · smoke · e2e
legs ride the final gate (§4).

The discovery (`scripts/discover-201.ts` — the discover-200 form + the
phone-dialog family leg):

- **LEG-1 the standing data-gated re-checks — KILLED** at the
  reference's unchanged zero-data state (probe:ref this session: the
  demo data still ZERO — the discover-184..201 standing census: the
  Edit-family census OURS rows=15/24/10 with the rowMenus live, the
  REF rows=1 the empty-state rows, rowMenus=0).
- **LEG-2 the s120-era interactive-table re-walk kill — STANDING.**
  The kill condition re-checked live: the leads family source
  untouched since s113 (`f10cee6`, 88 sessions — git log), the deps
  locked (the lockfile census: recharts 3.10.1 · lucide 0.525.0 ·
  tailwind 4.3.3 — the s196 version census unchanged), the reference
  bundle STABLE at `46bc2d9c`. Nothing moved — the kill stands.
- **LEG-3 the conditional gates — KILLED**: probe:ref STABLE at
  `46bc2d9c` kills the fresh-bundle re-derivation; the registry's
  latest recharts is 3.10.1 (fetched live) — the 4.0 gate stays killed.
- **LEG-4 THE STANDING PRE-SHIP DUTY (the s164 `bun audit` doctrine)
  — CLEAN against the s198 triple pins.** `bun audit` run live
  against the shipped tree: **9 advisories (4 high / 4 moderate / 1
  low)** — the exact s198-pinned census (no drift); the vulnerable
  packages unchanged (deepmerge-ts · vite · zod · source-map-js — all
  dev-toolchain transitive); the dormancy re-check:
  pdf-export.ts `.html(` call sites = 0. No material on this leg.
- **LEG-5 THE REGISTER'S PHONE-WIDTH DIALOG-OPEN FAMILY — THE ROUND'S
  MATERIAL (the s200 close's banked candidate, re-verified live).**
  The register's live census: **44 registrations** (33 page-family ·
  11 dialog-open). The WIDTH split — the round's own axis: the
  dialog-open family is **11 desktop / 0 phone** (the page family is
  both-widths since s171). THE WIDTH-BLIND GENUS: the spec's own head
  criterion claims **"one test() per surface × width"** — CARRIED
  since the s199a2 re-anchor, VIOLATED by the dialog family the whole
  time (the claim was born false at s199 and no pin holds it). THE
  BORN-GREEN RE-VERIFICATION (the s172 discovery doctrine — the live
  axe probes BEFORE the plan): all 11 phone dialog-open states probed
  at 390×844 with the VISIBLE-DIALOG open-wait guard (the L-164c2
  form) — **structural=0 on every open state** (11/11); the GATE 2
  landscape: 7 states zero-flag, 4 states carrying contrast flags
  that ALL cite existing sanctioned matchers (the quick-log
  `bg-emerald-600` · the accounts badge/border family
  `bg-danger`/`text-neutral-50`/`bg-blue-100`/`border-l-red-500`/
  `bg-yellow-50` · the calendar `text-gray-400` · the `-trigger-`
  segmented pair) — the phone landscape is the desktop landscape
  minus the sidebar arms (hidden below lg at phone). THE
  MUTATION-CANDIDATE DECODE (the hidden-sm:inline name-evaporation
  family): the contacts Import trigger decoded live at both widths —
  at 390 the visible span computes `display:none` (EVAPORATED — the
  `aria-label="Import"` is the ONLY accessible name), at 1280 the
  span computes `display:block` (the visible text carries the name) —
  a dropped aria-label ships a NAMELESS icon-only button at phone
  while every desktop registration stays green: the phone-only
  regression class the desktop-only register is structurally blind
  to, the round's own teeth.
  THE STALE-CLAIM FIND (LEG-5d, the width axis of the
  s197a2/s199a2/s200a2 pattern): the spec head's criterion claim
  (above) + the CLAUDE a11y family description's closure claim
  ("every Radix Dialog's open state now registered" — width-
  incomplete: the family carries one width) + the dialog-controls
  (e) census pin's count-anchored form ("eleven open-state
  registrations" — the live-read pin reads 22 the moment the phone
  family joins: the required test-side re-anchor).

### The findings triage

**FIX THIS ROUND (the width-scope round — zero pixel risk by decode,
born-green by the live probes):**

- **D-201a1 (Verified) — THE REGISTER'S PHONE-WIDTH DIALOG-OPEN
  COVERAGE.** The eleven desktop-only open states get their phone
  twins at 390×844 (the s199 open-state form: setViewport → goto →
  open → the VISIBLE-DIALOG open-wait guard → scanTwoGate → Escape):
  the five create dialogs (New Lead · New Account · New Contact · New
  Event · Log Call) + the six edit/standalone states (Edit Contact ·
  Edit Lead · Edit Account · Import Contacts · Account Insights ·
  Save Custom Report View). + THE PINS (in
  `tests/dialog-controls.test.ts`, the one-suite doctrine): the
  containment pair (the create family at phone + the edit/standalone
  family at phone, each naming its registrations) + the phone-width
  census pin (eleven phone-width open-state registrations — the live
  read of the phone-labeled test() names) — RED-first at birth (the
  labels do not exist yet; the census reads 0) → the registrations →
  GREEN. THE REQUIRED TEST-SIDE RE-ANCHOR: the s199 (e) census pin
  re-anchored eleven → twenty-two (the live read — total dialog-open
  scan labels; RED-first at birth alongside the new pins).
  MUTATION-PROVEN: the planted `aria-label="Import"` removal on the
  contacts Import trigger (contacts-page.tsx — the hidden-sm:inline
  genus decoded live at LEG-5c; the phone-only name-evaporation
  class) → the phone /contacts family REDs exactly at the
  button-name rule (the three new phone dialog-open registrations on
  /contacts — New Contact · Edit Contact · Import — whose scan
  surface carries the page furniture behind the open dialog + the
  standing phone /contacts page registration, the same genus caught
  by the page family's own teeth — defense in depth, enumerated) →
  EVERY desktop registration GREEN (the visible span carries the
  name at 1280 — the desktop register's width-blindness, the round's
  own rationale) → restored → GREEN.
- **D-201a2 (Verified) — THE SPEC'S OWN WIDTH-BLIND CRITERION CLAIM.**
  The head criterion ("one test() per surface × width") was born
  false at s199 (the s199a2 re-anchor worded a criterion the register
  violated for the dialog family) and no pin has ever held it. THE
  CURE: the phone family registered (the criterion TRUE for every
  family — a1) + THE PIN PAIR (the dialog-controls session-201 (j)
  describe): the width-pair census (every desktop dialog registration
  carries its phone twin — the live read: the desktop/phone label
  equality + the per-label twin containment; a future width-scope
  regression trips the equality + the twin arms) + the criterion-form
  pair (the positive: the head carries the ×width criterion — the
  NAME form; the negative: the width-blind "per surface" form never
  re-anchors — `/per surface(?! × width)/` never matches the spec).
  RED-first at birth (the width-pair census reads 11 ≠ 0) → the
  registrations → GREEN. MUTATION-PROVEN: the planted phone-registration
  removal (one phone twin deleted) → the width-pair census + the
  containment + the census pins RED → restored → GREEN.

**DECLINED (recorded considered-and-declined for the next audit's
re-triage):**

- **The Edit Event + Edit Activity edit modes at phone** — the
  same-component adjudication (the s199 desktop precedent carried to
  the width axis: the create registrations already scan their shared
  EntityDialog DOM at both widths; the edit-mode delta is the
  prefilled values + the title text only).
- **The login card's in-card view states at phone** — the client-state
  genus (the s200 declined-posture stands: the s192 walk65 cures + the
  login-views/login-reset batteries hold the wiring).
- **The drawer-open state at desktop** — the width-inverse of this
  round's family (the drawer renders at PHONE only; the standing
  registration is the phone one — there is no desktop drawer to
  register).

## 1. The TDD ledger (the cure plan)

- **D-201a1 — RED-first spec-contract pins, then the registrations:**
  1. `tests/dialog-controls.test.ts`: the NEW session-201 (i) describe
     — the containment pair (the create family at phone + the
     edit/standalone family at phone, each naming its registrations)
     + the phone-width census pin (eleven phone-width open-state
     registrations — the live read of the phone-labeled test() names)
     → **RED at birth** (the spec carries 0 phone dialog
     registrations; the census reads 0). PLUS the (e) census pin
     re-anchor (eleven → twenty-two) → RED at birth (the spec carries
     11 dialog-open scan labels).
  2. THE CURE: `tests/e2e/a11y.spec.ts` grows the two session-201
     describes + the eleven phone registrations (the s199 open-state
     form with the VISIBLE-DIALOG open-wait guard — the L-164c2
     vacuous-green cure — at 390×844):
     - "phone /leads with the New Lead dialog OPEN" · "phone
       /accounts with the New Account dialog OPEN" · "phone
       /contacts with the New Contact dialog OPEN" · "phone
       /calendar with the New Event dialog OPEN" · "phone
       /activities with the Log Call dialog OPEN" (the create
       family);
     - "phone /contacts with the Edit Contact dialog OPEN" · "phone
       /leads with the Edit Lead dialog OPEN" · "phone /accounts
       with the Edit Account dialog OPEN" · "phone /contacts with
       the Import Contacts dialog OPEN" · "phone /accounts with the
       Account Insights dialog OPEN" · "phone /reports with the Save
       Custom Report View dialog OPEN" (the edit + standalone
       family).
  3. Born-green verification: the eleven registrations run green on
     the first run (the discovery's live probes pre-verified
     structural=0 + all-cited-sanctioned on every phone state).
  4. MUTATION-PROOF: the planted `aria-label="Import"` removal on the
     contacts Import trigger (`src/app/(app)/contacts/contacts-page.tsx`
     — the hidden-sm:inline genus) → the phone /contacts family REDs
     exactly at the axe button-name rule (the Import trigger nameless
     at phone: the three new phone dialog-open registrations on
     /contacts + the standing phone /contacts page registration —
     the page family's own teeth on the same genus) → EVERY desktop
     registration GREEN (the visible span carries the name at 1280)
     → restored → GREEN.
- **D-201a2 — RED-first width-pair pin, then the registrations:**
  1. `tests/dialog-controls.test.ts`: the NEW session-201 (j)
     describe — the width-pair census pin (every desktop dialog
     registration carries its phone twin, live-read) + the
     criterion-form pair (the ×width criterion is the live face +
     the width-blind form never returns) → **RED at birth** (the
     width-pair census reads 11 desktop / 0 phone).
  2. THE CURE: the a1 registrations (the criterion becomes TRUE for
     every family) → GREEN.
  3. MUTATION-PROOF: the planted phone-registration removal (one
     phone twin deleted from the spec) → the width-pair census +
     the containment-b + the phone census + the (e) census RED →
     restored → GREEN.

## 2. The count ladder + the docs lockstep

UNIT 2827 → **2832** (+5: the dialog-controls session-201 describes —
the containment pair + the phone census + the width-pair census + the
criterion pair) · SUITES **138 HELD** (the one-suite doctrine — the new
pins ride the EXISTING dialog-controls suite) · E2E 206 → **217**
(+11: the eleven phone registrations) · badge 3033 → **3049** (the
unit+e2e arithmetic: 2832+217). `skill-head-201.py` FIRST (the SKILL
v1.198.0, the s200 layer comment-demoted at its ship counts
2827/206, the s201 layer live at 2832/217 + the beneath-it tail,
idempotent, the s197 exact-H1 guard form), then `count-ladder-201.py`
(assert-first, idempotent, unique-anchor — the docs-counts UNIT + E2E
constants · the README badge + Tested row + tree + commands + the two
s102-P1 e2e tree/commands sites · the AGENTS commands + gate-order
(unit + e2e) · the CLAUDE gate-order + commands + pyramid (unit +
e2e) + the coverage seam + the a11y family description's s201 closure
(the width-scope arm: every Radix Dialog's open state registered at
BOTH widths) · the PAD tree + Total + HEAD + checklist + commands +
the §11 a11y row (the line census + the family) + the §11
dialog-controls row (the line census + the s201 pins) · the SKILL
commands + Appendix B unit + e2e totals + the a11y row 44 → 55) + the
test-side re-anchors in the same stroke (the docs-counts layer-axis
[first = s201, second = s200 at its ship 2827/206] + the unit
negatives ladder [the retired 2827 site-forms join the negatives] +
the login-family E2E ladder [the retired E2E 206 form joins its
negatives, the live positive re-anchored 217] + the
dialog-geometry-parity F-92a3 ladder [the four CLAUDE live positives
re-anchored 2832 + the 2827 forms join the negatives]). The docs
lockstep: the AGENTS Session-201 section · `docs/session_424.md` ·
the PAD §7.1 s201 inventory row (inserted BEFORE the Total row — the
s180 table-termination doctrine) + the §11 rows · the README
walk-contracts paragraph's s201 clause · this plan's execution record
· the worklog entry {Task ID: 201}.

## 3. The captures

The round's pair: one phone dialog-open surface OURS + the REFERENCE
at the 390×844 axis (the round's own axis — the width-scope family;
the reference's own phone dialog face, the two-app-openable surface:
the /contacts New Contact dialog OPEN at 390 on both apps) + the
dev-server set of the remediated tree: the eleven phone dialog-open
states (or the representative set: the create family's five + the
edit/standalone family's six — each captured OPEN at 390×844) + the
mobile drawer-open face at 390×844 (the operator's standing mobile-nav
ask) + the dashboard — numbered past the s200 637-645 (646+), saved
under `docs/screenshots/`, the VLM battery on the round's pair (the
house evidence form).

## 4. The final gate + the push

`bun run gate` (lint 0/0 · tsc 0 · 138/2832 · build · smoke 14/14 ·
CI=1 e2e 217/217) · the four-band sweep GREEN (`--fail-on-drift`, the
cure's baseline-inertness proof: zero pixel-bearing surface touched)
· `bun audit` (9, all dev-toolchain, the triple-pinned posture) ·
probe:ref STABLE re-check · db census MATCH · the SSH-wrapper push to
main (`git@github.com:nordeim/neo-crm.git`), no new branch, the
wrapper's verified-push form.

## 5. The execution record (2026-10-30)

Executed as planned, in the order above, all green:

- **The baseline**: lint 0/0 · tsc 0 · 138/2827 unit · probe:ref STABLE
  at `46bc2d9c` (the bundle md5 unchanged, the demo data still ZERO) ·
  db census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db`)
  — the workspace at `0e78b16`, tree clean.
- **The discovery** (scripts/discover-201.ts): the standing data-gated
  re-checks ALL KILLED (OURS rows=15/24/10, the REF rows=1 the
  empty-state rows — the discover-184..201 standing census) · the
  conditional gates KILLED (probe:ref STABLE; the registry's latest
  recharts 3.10.1) · the s120-era re-walk kill STANDING (the leads
  family source-frozen since s113 — 88 sessions) · the pre-ship audit
  duty CLEAN vs the s198 triple pins (bun audit 9: 4h/4m/1l exactly;
  the dormancy `.html(`= 0) · **THE WIDTH-SCOPE CENSUS**: the register
  44 (33 page + 11 dialog — the dialog family 11 desktop / 0 phone) /
  the head criterion "one test() per surface × width" CARRIED but
  VIOLATED (the width-blind genus) / **the LIVE axe probes: 11/11
  phone dialog-open states structural=0 at 390×844 with the
  visible-dialog guard; every contrast flag citing an existing
  sanctioned matcher** / the mutation-candidate decoded live (the
  contacts Import trigger: the span display:none at 390 / display:block
  at 1280 — the aria-label the only phone name).
- **D-201a1**: the spec-contract pins RED-first into
  tests/dialog-controls.test.ts (the session-201 (i) describe: the
  containment pair + the phone census + the s199 (e) census re-anchor
  — exactly 5 RED at birth incl. the (j) width-pair census, zero
  collateral) → the +11 registrations in tests/e2e/a11y.spec.ts →
  born-green (11/11 the first run; the full spec 56 passed) →
  **MUTATION-PROVEN**: the planted `aria-label="Import"` removal on
  the contacts Import trigger → the NEW phone Import registration RED
  (the role-based opener — the nameless trigger UNFINDABLE by name at
  phone) + the standing phone /contacts page registration RED (the
  axe button-name rule, citing
  `.px-4.py-2.text-foreground:nth-child(3)`) → EVERY desktop
  registration GREEN (the visible span carries the name at 1280) →
  restored → GREEN (11/11 on the contacts-scoped re-run). **THE LIVE
  CATCH (the mutation landscape decoded)**: while a Radix Dialog is
  open, hideOthers aria-hides the app root — GATE 1 (structural) sees
  ONLY the dialog content, GATE 2 (color-contrast) still cites the
  PAINTED page behind (the visual rule's applicability is on-screen
  visibility) — the open-dialog scan mechanics documented in the
  spec's s201 family comment (scripts/mutation-landscape-201.ts, the
  decode probe).
- **D-201a2**: the width-pair census + criterion-form pins RED-first
  at birth (the width split 11≠0) → the registrations (a1) → GREEN →
  **MUTATION-PROVEN**: the planted phone Edit Account twin removal
  trips the width-pair census + the containment-b + the phone census +
  the (e) census (exactly 4 RED) → restored → GREEN (29/29).
- **The lockstep**: skill-head-201.py ran FIRST (the SKILL v1.198.0,
  the s200 layer comment-demoted at its ship counts 2827/206, the s201
  layer live at 2832/217, idempotent) · count-ladder-201.py
  (assert-first, idempotent, unique-anchor — 46 flips incl. the §11
  a11y row 593 → 764 + the §11 dialog-controls row 306 → 391 + the
  CLAUDE a11y family description's s201 closure) · the test-side
  re-anchors (the docs-counts layer-axis + the unit negatives + the
  login-family E2E ladder + the dialog-geometry F-92a3 ladder) · the
  docs (the AGENTS Session-201 section · session_424.md · the PAD §7.1
  s201 inventory row [BEFORE the Total row] + the §11 rows · the
  README s201 clause · this execution record · the worklog entry
  {Task ID 201}).
- **The captures**: 646+ (the round's phone dialog-open pair ours+ref
  at the 390×844 axis + the dev-server set: the eleven phone
  dialog-open states + the mobile drawer-open face + the dashboard).
  The VLM battery on the round's pair (the house evidence form).
- **The final gate**: lint 0/0 · tsc 0 · **138/2832** unit · build ·
  smoke **14/14** · e2e **217/217** · the four-band sweep GREEN
  (`--fail-on-drift` at desktop + 390 + 768×1024 + 1024×768 — the
  drift gate clean at every band, the seed restored after every run)
  · `bun audit` 9 (all dev-toolchain, the triple-pinned posture) · db
  census MATCH · probe:ref STABLE at `46bc2d9c`.
