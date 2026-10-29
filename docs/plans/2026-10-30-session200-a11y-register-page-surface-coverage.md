# The session-200 plan — THE A11Y REGISTER'S PAGE-SURFACE COVERAGE AUDIT (the three un-registered page surfaces + the spec's own stale anon-family claim)

Date: 2026-10-30 · Rotation: 200 ·
Task: audit + validate the shipped session-199 state (commit `013232a` +
the owner's transcript commit `17ea4a4` — the session_421 transcript is
this round's rotation trigger), re-run the standing discovery legs (the
data-gated re-checks · the s120-era re-walk kill · the conditional
gates · the pre-ship audit duty), and take the round's fresh material
the register-coverage hunt surfaces: the s197/s199 pattern applied to
the register's OTHER family — the PAGE SURFACES. The register's live
census: 38 registrations (27 page-family + 11 dialog-open). The app's
renderable route inventory: 16 surfaces. THREE page surfaces carry
ZERO a11y teeth at ANY width — **/about + /contact** (the authenticated
marketing interiors — two-app-renderable, login-walled per the s147
reference posture, their interactive arms walked at s193/walk66 but
never axe-scanned) and **/reset-password** (the OURS-ONLY anon surface
— the /signup registration precedent; the s163 digma port, its form
controls never axe-scanned). PLUS the spec's own anon-family describe
head still claims "The three anon surfaces (login/signup/landing)" —
STALE SINCE s195 (the 404 ×2 joined that very describe without the
count moving; the s197a2/s199a2 stale-census pattern INSIDE the spec
file, and about to go staler when the reset surface joins). Cure both
the same round (born-green registrations — the discovery's live axe
probes verified structural ZERO + zero contrast flags on every
un-registered surface at both widths, OURS + the REFERENCE's own DOM),
pin the page-family census + the count-proof comment form, align every
doc in the house lockstep, capture the round's set, push to main via
the SSH wrapper.

## 0. The audit (the baseline + the discovery)

The baseline gate at the shipped s199 state (the fresh clone at
`17ea4a4`, tree clean): lint 0/0 · tsc 0 · **138/2822** unit · db
census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db` — the
`.env` `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo
root, the operator's standing ask verified). The build · smoke · e2e
legs ride the final gate (§4).

The discovery (`scripts/discover-200.ts` — the discover-199 form + the
new page-surface coverage leg):

- **LEG-1 the standing data-gated re-checks — expected KILLED** at the
  reference's unchanged zero-data state (probe:ref this session: the
  demo data still ZERO — the discover-184..200 standing census: the
  Edit-family census OURS rows=15/24/10 with the rowMenus live, the
  REF rows=1 the empty-state rows, rowMenus=0, the topbar-search
  populated=0 on both).
- **LEG-2 the s120-era interactive-table re-walk kill — STANDING.**
  The kill condition re-checked live: the leads family source
  untouched since s113 (`f10cee6`, 87 sessions — git log), the deps
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
  packages unchanged (deepmerge-ts · vite · zod · source-map-js —
  all dev-toolchain transitive); the overrides.dompurify=3.4.17
  posture verified; the dormancy re-check: pdf-export.ts `.html(`
  call sites = 0. No material on this leg.
- **LEG-5 THE A11Y REGISTER'S PAGE-SURFACE COVERAGE CENSUS — THE
  ROUND'S MATERIAL FOUND.** The register's live census: **38
  registrations** (27 page-family + 11 dialog-open — the spec's test()
  census read live). The app's renderable route inventory (the 15
  page.tsx files + the not-found): **16 surfaces** — the 9 CRM pages ·
  login · signup · landing · the 404 · **about · contact ·
  reset-password**. THE GAP: three page surfaces with ZERO a11y teeth
  at any width:
  1. **/about + /contact** — the authenticated marketing interiors
     (the s144 (marketing) group; the s147 F-147c2 parity event
     re-walled them — the reference's own reversed posture, mirrored;
     they render for logged-in users with the full app chrome, swept
     since s144 + censused since the 156-c legs + their interactive
     arms focus-walked at s193/walk66 — but NEVER axe-scanned: the
     s171 register's page family was enumerated before the marketing
     pair existed, and no later round re-applied the coverage
     criterion to the page family);
  2. **/reset-password** — the OURS-ONLY anon surface (the s163 digma
     S46/RA-66 port; the /signup registration is the OURS-ONLY
     precedent — the register's family criterion is renderable
     surfaces, not two-app parity). Its "Set new password" form state
     (any non-empty `?token=` renders the form — validity is checked
     on submit only; the reset-password.spec shape-probe form) carries
     two htmlFor/id-wired password inputs + the submit; never
     axe-scanned.
  THE BORN-GREEN PRE-VERIFICATION (the s172 discovery doctrine — the
  live axe probes BEFORE the plan): all three surfaces probed at
  1280×800 + 390×844 — **structural=0 + zero contrast/svg-alt flags
  on every surface at both widths** (OURS). The reset surface probed
  at BOTH card states (the no-token invalid-link card + the
  shape-probe token form) — both clean; the form state is the richer
  face (the registration's choice). THE REFERENCE's own /About +
  /Contact probed at both widths (the GATE 2 citation verification,
  the s171 doctrine): zero contrast flags (its marketing palette
  rides the same gray-500/600 + blue-600 families the landing
  registration already sanctions) + **THE LIVE CATCH: the reference's
  own marketing pages carry TWO NAMELESS icon-only buttons at desktop
  (`.w-9.sm\:flex.gap-2` on /About · `.w-9.sm\:flex.whitespace-nowrap`
  on /Contact — decoded: its topbar's Messages + Notifications
  buttons, `button-name` violations on ITS DOM)** — OURS renders the
  same arms NAMED ("Messages" · "Notifications" · "Account menu" —
  the s171 fixes cover the whole shell): the drawer precedent's
  direction (nameless controls are the reference's defect, ours name
  them — the registration's GATE 1 face is OURS-structural-zero, the
  reference's own defect documented, never mirrored).
  THE WIDTH-SCOPE CENSUS (LEG-5d): the register's dialog-open family
  is DESKTOP-only (11 registrations, 0 at phone width) — the 11 phone
  dialog-open states probed live this round (the discovery addendum):
  **ALL born-green** (structural=0 on every open state; every
  contrast flag cites an existing sanctioned matcher — the quick-log
  `bg-emerald-600` · the accounts badge/border family · the calendar
  `text-gray-400` · the `-trigger-` segmented pair). The phone
  dialog-open family is the STANDING NEXT-ROUND CANDIDATE (§ the
  DECLINED below — the width-scope arm, born-green pre-verified, its
  own rotation).
  THE STALE-CLAIM FIND (LEG-5e): the spec's own anon-family describe
  head still claims **"The three anon surfaces (login/signup/
  landing)"** — stale since s195 (the 404 ×2 joined that very
  describe; the family is FOUR surfaces today, FIVE after this
  round's cure) — the s197a2/s199a2 stale-census pattern INSIDE the
  spec file. The CLAUDE live-doc family description carries the same
  count-anchored form ("the three anon surfaces × both widths" —
  re-anchored by the count ladder's CLAUDE flip in the same stroke).

### The findings triage

**FIX THIS ROUND (the register-coverage round — zero pixel risk by
decode, born-green by the live probes):**

- **D-200a1 (Verified) — THE REGISTER'S PAGE-SURFACE COVERAGE.** The
  three un-registered surfaces get their own two-gate registrations at
  BOTH widths (the page-family form — the s171 both-widths doctrine):
  /about + /contact in the AUTHENTICATED form (the s147 login-walled
  posture — the default storageState, the same form as the 9 CRM
  pages; the pages render their full interiors + the app chrome) and
  /reset-password in the ANON form (the describe's storageState
  opt-out, the /signup precedent; the set-password FORM state via the
  shape-probe token — the richer face; the no-token card adjudicated
  same-component below) + THE PINS (in `tests/dialog-controls.test.ts`,
  the one-suite doctrine — the spec-contract carrier since s172): the
  containment pins (the marketing pair at both widths + the reset
  surface at both widths) + the page-surface register census pin (the
  live-read count: thirty-three page-family registrations — total
  test() minus the dialog-open labels) — RED-first at birth (the
  labels do not exist yet; the census reads 27) → the registrations →
  GREEN. MUTATION-PROVEN: the planted `{label}` removal inside the
  SocialLink anchor (contact/page.tsx — the three social links become
  nameless icon links, a REAL product-code mutation in the
  rendered-tree class no source pin can see; no existing pin holds
  the label child — the walk66 pins hold href/target/rel only) → BOTH
  new /contact registrations RED exactly at the link-name rule →
  restored → GREEN.
- **D-200a2 (Verified) — THE SPEC'S OWN STALE ANON-FAMILY CLAIM.**
  The describe head re-anchored to the count-proof NAME form ("The
  anon family, both widths" — a name never goes stale when a surface
  joins; the s197a2/s199a2 doctrine) + THE PIN (in the
  dialog-controls 200 describe): the negative — the retired
  count-anchored form (`/The \d+ anon surfaces/`) never returns +
  the NAME form is the live face — RED-first at birth (the spec still
  carries the three-form) → the comment cure → GREEN.
  MUTATION-PROVEN: the stale re-plant trips BOTH arms of the pin pair
  → restored → GREEN.

**DECLINED (recorded considered-and-declined for the next audit's
re-triage):**

- **The phone-width dialog-open registrations (11 states)** — the
  width-scope arm of the register's dialog family: born-green
  pre-verified this round (the discovery addendum probes — structural
  0 on every open state, every contrast flag already-sanctioned), but
  the family is its own rotation (the +11 scale would double this
  round's e2e delta; the desktop-only form is the register's shipped
  criterion since s172 — the phone family joins as the STANDING
  NEXT-ROUND CANDIDATE, the first standing candidate with its
  born-green pre-verification already banked).
- **The reset-password no-token card state** — the same-component
  adjudication (the s199 Edit Event/Activity precedent): the card
  state and the form state share the ResetPasswordScreen component;
  the card's delta is the title + text + the Back button (all
  name-passing); the form state is the richer face and carries the
  registration.
- **The login card's in-card view states (the reset + sent views)**
  — the client-state genus (a view swap is required to see them —
  the same closed-by-default logic as the dialogs), but the views'
  control wiring is already cured + pinned at the source level (the
  s192 walk65 id cures D-192a1/a2/a3 + the login-views/login-reset
  unit batteries); the genus joins the standing candidates for a
  future view-state arm.

## 1. The TDD ledger (the cure plan)

- **D-200a1 — RED-first spec-contract pins, then the registrations:**
  1. `tests/dialog-controls.test.ts`: the NEW session-200 describe —
     the containment pins (the marketing pair + the reset surface,
     each naming its registrations at both widths) + the
     page-surface register census pin (the live read: thirty-three
     page-family registrations = total test() minus the dialog-open
     labels) → **RED at birth** (the spec carries 27 page-family
     registrations; the new labels do not exist).
  2. THE CURE: `tests/e2e/a11y.spec.ts` grows the new describe(s) +
     the six registrations (the page-family form: setViewport → goto
     → scanTwoGate):
     - "desktop /about" + "phone /about" (the authenticated form —
       the default storageState, the CRM-page idiom);
     - "desktop /contact" + "phone /contact" (the same form);
     - "desktop /reset-password (anon, the set-password form)" +
       "phone /reset-password (anon, the set-password form)" (inside
       the anon describe — its storageState opt-out; the
       `?token=e2e-shape-probe` form state, the reset-password.spec's
       own shape-probe idiom).
  3. Born-green verification: the six registrations run green on the
     first run (the discovery's live probes pre-verified structural=0
     + zero contrast flags on every surface at both widths).
  4. MUTATION-PROOF: the planted `{label}` removal inside the
     SocialLink anchor in `src/app/(marketing)/contact/page.tsx` →
     BOTH new /contact registrations RED exactly at the axe link-name
     rule (the three social anchors become nameless icon links — the
     rendered-tree class) → restored → GREEN.
- **D-200a2 — RED-first negative pin, then the comment cure:**
  1. `tests/dialog-controls.test.ts`: the NEW negative pin pair —
     the anon-family head claim must be the count-proof NAME form,
     the count-anchored form never returns → **RED at birth** (the
     spec still carries "The three anon surfaces").
  2. THE CURE: the describe head re-anchored ("The anon family, both
     widths — the logged-out state (no storage state; an authed
     visit redirects away)") → GREEN.
  3. MUTATION-PROOF: the stale re-plant ("The three anon surfaces…")
     → the negative pin RED → restored → GREEN.

## 2. The count ladder + the docs lockstep

UNIT 2822 → **2827** (+5: the dialog-controls session-200 describes —
the containment pair + the page-family census pin + the count-proof
negative pair) · SUITES **138 HELD** (the one-suite doctrine — the new
pins ride the EXISTING dialog-controls suite) · E2E 200 → **206**
(+6: the six registrations) · badge 3022 → **3033** (the unit+e2e
arithmetic: 2827+206). `skill-head-200.py` FIRST (the SKILL v1.197.0,
the s199 layer comment-demoted at its ship counts 2822/200, the s200
layer live at 2827/206 + the beneath-it tail, idempotent, the s197
exact-H1 guard form), then `count-ladder-200.py` (assert-first,
idempotent, unique-anchor — the docs-counts UNIT + E2E constants · the
README badge + Tested row + tree + commands + the two s102-P1 e2e
tree/commands sites · the AGENTS commands + gate-order (unit + e2e) ·
the CLAUDE gate-order + commands + pyramid (unit + e2e) + the coverage
seam + the a11y family description's s200 closure (the count-proof
"the anon family" form + the marketing pair + the reset surface + the
phone-family width note) · the PAD tree + Total + HEAD + checklist +
commands + the §11 a11y row (the line census + the family) + the §11
dialog-controls row (the line census + the s200 pins) · the SKILL
commands + Appendix B unit + e2e totals + the a11y row 38 → 44). The
test-side re-anchors in the same stroke: the docs-counts layer-axis
(first = s200 at 2827/206, second = s199 at its ship 2822/200) + the
unit negatives ladder (the retired 2822 site-forms join the negatives)
+ the login-family negatives ladder (the retired **E2E (Playwright,
200 checks)** joins its negatives, the live positive re-anchored 206)
+ the dialog-geometry-parity F-92a3 ladder (the four CLAUDE live
positives re-anchored 2827 + the 2822 forms join the negatives). The
docs lockstep: the AGENTS Session-200 section · `docs/session_422.md`
· the PAD §7.1 s200 inventory row (inserted BEFORE the Total row —
the s180 table-termination doctrine) · the README walk-contracts
paragraph's s200 clause · this plan's execution record · the worklog
entry {Task ID: 200}.

## 3. The captures

The round's pair: the /contact page OURS + the REFERENCE at the
desktop axis (the two-app-renderable registered surface — walk66's
own surface, the round's own axis; the reference's nameless-buttons
defect lives on its DOM there, the pair's VLM face identical) + the
dev-server set of the remediated tree: the three newly-registered
surfaces at both widths (the /about + the /contact + the
/reset-password form state at desktop + phone) + the mobile
drawer-open face at 390×844 (the operator's standing mobile-nav ask)
+ the dashboard — numbered past the s199 629-636 (637+), saved under
`docs/screenshots/`, the VLM battery on the round's pair (the house
evidence form).

## 4. The final gate + the push

`bun run gate` (lint 0/0 · tsc 0 · 138/2827 · build · smoke 14/14 ·
CI=1 e2e 206/206) · the four-band sweep GREEN (`--fail-on-drift`, the
not-found leg included — the cure's baseline-inertness proof: zero
product-code pixels touched) · `bun audit` (9, all dev-toolchain, the
triple-pinned posture) · probe:ref STABLE re-check · db census MATCH ·
the SSH-wrapper push to main (`git@github.com:nordeim/neo-crm.git`),
no new branch, the wrapper's verified-push form.

## 5. The execution record (2026-10-30)

Executed as planned, in the order above, all green:

- **The baseline**: lint 0/0 · tsc 0 · 138/2822 unit · probe:ref STABLE
  at `46bc2d9c` (the bundle md5 unchanged, the demo data still ZERO) ·
  db census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db`) —
  the fresh clone rebuilt in the intake (bun install + the Playwright
  chromium install + db:push/db:seed + the .env from .env.example with
  a fresh 64-hex AUTH_SECRET).
- **The discovery** (scripts/discover-200.ts): the standing data-gated
  re-checks ALL KILLED (OURS rows=15/24/10, the REF rows=1 the
  empty-state rows — the discover-184..200 standing census) · the
  conditional gates KILLED (probe:ref STABLE; the registry's latest
  recharts 3.10.1) · the s120-era re-walk kill STANDING (the leads
  family source-frozen since s113 — 87 sessions) · the pre-ship audit
  duty CLEAN vs the s198 triple pins (bun audit 9: 4h/4m/1l exactly) ·
  **THE PAGE-SURFACE COVERAGE CENSUS**: the register 38 (27 page + 11
  dialog) / the 16-surface route inventory decoded / the THREE
  un-registered surfaces enumerated (about + contact + reset-password)
  / the stale "three anon surfaces" head found (stale since s195) /
  **the LIVE axe probes: structural=0 + zero contrast flags on every
  un-registered surface at both widths, both reset card states** +
  the REFERENCE's own /About + /Contact probed (THE LIVE CATCH: its
  marketing pages carry TWO NAMELESS icon-only buttons at desktop —
  its topbar's Messages + Notifications; OURS renders the same arms
  NAMED) + the 11 phone-width dialog-open states probed ALL
  born-green (the width-scope census — the standing next-round
  candidate).
- **D-200a1**: the spec-contract pins RED-first into
  tests/dialog-controls.test.ts (exactly 5 RED at birth, zero
  collateral) → the +6 registrations in tests/e2e/a11y.spec.ts →
  born-green (6/6 the first run) → **MUTATION-PROVEN**: the planted
  `{label}` removal inside the SocialLink anchor → BOTH new /contact
  registrations RED exactly at the link-name rule (citing the
  linkedin/x/github anchors) → restored → GREEN.
- **D-200a2**: the negative pin pair RED-first at birth → the describe
  head re-anchored to the count-proof NAME form → GREEN →
  **MUTATION-PROVEN**: the stale re-plant trips BOTH arms of the pin
  pair → restored → GREEN. **THE LIVE CATCH**: the negative pin's
  first draft (a bare `\d+` regex) was fooled by the spelled-out count
  word — the `\w+` form catches both spellings.
- **The lockstep**: skill-head-200.py ran FIRST (the SKILL v1.197.0,
  the s199 layer comment-demoted at its ship counts 2822/200, the s200
  layer live at 2827/206, idempotent) · count-ladder-200.py
  (assert-first, idempotent — the full site census incl. the §11 a11y
  row 526 → 593 + the §11 dialog-controls row 236 → 306) · the
  test-side re-anchors (the docs-counts layer-axis + the unit
  negatives + the login-family E2E ladder + the dialog-geometry
  F-92a3 ladder) · the docs (the AGENTS Session-200 section ·
  session_422.md · the PAD §7.1 s200 inventory row [BEFORE the Total
  row] + the §11 rows · the README s200 clause · this execution
  record · the worklog entry {Task ID 200}).
- **The captures**: 637-645 (the round's /contact pair ours+ref at the
  desktop axis + the dev-server set: the three newly-registered
  surfaces at both widths + the mobile drawer-open face + the
  dashboard). The VLM battery: "STRUCTURAL differences: None ·
  STYLING differences: None · structurally identical in both styling
  and layout".
- **The final gate**: lint 0/0 · tsc 0 · **138/2827** unit · build ·
  smoke **14/14** · e2e **206/206** (6.6m) · the four-band sweep GREEN
  (`--fail-on-drift` at desktop + 390 + 768×1024 + 1024×768 — the
  drift gate clean at every band, the seed restored after every run)
  · `bun audit` 9 (all dev-toolchain, the triple-pinned posture) · db
  census MATCH · probe:ref STABLE at `46bc2d9c`.
