# The session-203 plan — THE A11Y REGISTER'S LANDING-PAGE CLIENT-STATE COVERAGE (the marketing-state arms + the standing duty's audit-census drift)

Date: 2026-10-31 · Rotation: 203
Task: audit + validate the shipped session-202 state (commit `734e22e` +
the owner's transcript commit `549e5d2` — the session_427 transcript is
this round's rotation trigger), re-run the standing discovery legs (the
data-gated re-checks · the s120-era re-walk kill · the conditional
gates · the pre-ship audit duty), and take the round's fresh material:
TWO ARMS — THE S202 CLOSE'S BANKED STANDING CANDIDATE (THE REGISTER'S
MARKETING CLIENT-STATE ARMS — the landing page's client-state machines)
plus THE STANDING DUTY'S LIVE CATCH (the `bun audit` census drift 9 →
10 — the new moderate GHSA-g3hv-75wg-m249 on minimatch).

## 0. The audit (the baseline + the discovery)

The baseline gate at the shipped s202 state (the fresh clone at
`549e5d2`, tree clean, the env rebuilt: `.env` from `.env.example`
with `DATABASE_URL="file:../db/custom.db"` + a fresh `AUTH_SECRET` ·
`db:push` + `db:seed`): lint 0/0 · tsc 0 · **138/2837** unit · db
census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db` — the
`.env` `DATABASE_URL` with `db/` at the repo root, the operator's
standing ask verified). The build · smoke · e2e legs ride the final
gate (§4).

The discovery (`scripts/discover-203.ts` — the discover-202 form + the
marketing-state family leg + the audit-drift catch):

- **LEG-1 the standing data-gated re-checks — KILLED** at the
  reference's unchanged zero-data state (OURS rows=15/24/10 with the
  rowMenus live, the REF rows=1 the empty-state rows, rowMenus=0 —
  the discover-184..203 standing census).
- **LEG-2 the s120-era interactive-table re-walk kill — STANDING.**
  The kill condition re-checked live: the leads family source
  untouched since s113 (`f10cee6`, 90 sessions — git log), the deps
  locked (the lockfile census: recharts 3.10.1 · lucide 0.525.0 ·
  tailwind 4.3.3 — the s196 version census unchanged), the reference
  bundle STABLE at `46bc2d9c`. Nothing moved — the kill stands.
- **LEG-3 the conditional gates — KILLED**: probe:ref re-run live —
  STABLE at `46bc2d9c` (the bundle md5 unchanged) kills the
  fresh-bundle re-derivation; the registry's latest recharts is 3.10.1
  (fetched live) — the 4.0 gate stays killed.
- **LEG-4 THE STANDING PRE-SHIP DUTY (the s164 `bun audit` doctrine)
  — DRIFT: THE ROUND'S SECOND MATERIAL.** `bun audit` run live
  against the shipped tree: **10 advisories (4 high / 5 moderate / 1
  low)** — the s198-pinned census was 9 (4h/4m/1l); the NEW advisory:
  the moderate **GHSA-g3hv-75wg-m249** (minimatch <11.0.1 —
  "potential denial of service via globparts amplification"), riding
  the DEV-TOOLCHAIN eslint family (`eslint › @eslint/eslintrc ›
  minimatch` + `eslint-config-next › typescript-eslint ›
  @typescript-eslint/utils › @typescript-eslint/typescript-estree ›
  minimatch`) — zero runtime request-path exposure, the exact genus
  of the other nine (lint-time transitive chains). The dormancy
  re-check held: pdf-export.ts `.html(` call sites = 0.
- **LEG-5 THE REGISTER'S MARKETING CLIENT-STATE FAMILY — THE S202
  CLOSE'S BANKED STANDING CANDIDATE (probed live).** The register's
  live census: **61 registrations** (33 page-family · 22 dialog-open
  · 6 client-state view · **0 marketing client-state**). The landing
  surface carries exactly TWO client-state machines (the source
  census: `useState(false)` in LandingHeader + `useState(0)` in Faq —
  the /About + /Contact interiors carry NONE): the **mobile
  disclosure menu** (menuOpen: closed | the mounted panel — a
  whole-panel MOUNT of 6 link controls [Features · Preview · Pricing
  · FAQ · Contact · Open dashboard] at phone width only, the
  `md:hidden` width-inverse; the header div count 2 → 3 on open —
  the mount/unmount construction, the drawer-genus sibling on the
  marketing surface) + the **FAQ open-item machine** (openIndex: 6
  single-open states + the all-closed minus-construction; the resting
  Q1-open face is the ONLY one the page-family registration scans).
  THE MARKETING-STATE GENUS: the register's own head criterion claims
  "one test() per surface × width" — carried true for every family
  since s202, but the LANDING surface's client-state machines were
  never adjudicated against the register and no pin cross-reads them
  (the s202a2 state-axis doctrine's marketing arm — the s202 DECLINED
  posture "the batteries hold the wiring" carried without a single
  two-gate tooth on the arms: landing.spec.ts:85/:105 hold the
  functional wiring, never the a11y face). THE BORN-GREEN
  RE-VERIFICATION (the s172 discovery doctrine — the live axe probes
  BEFORE the plan): all 3 arms probed live (the FAQ non-default open
  state [the Q6 ride — the maximal-distance member from the resting
  Q1, the L-164c2 sentinel pair: Q6's answer mounted + Q1's resting
  answer GONE — the single-open invariant] at BOTH widths + the
  menu-open state at phone, fresh anon contexts) — **structural=0 on
  every arm (3/3); the GATE 2 landscape: zero unsanctioned contrast
  flags** (every flag citing the landing preview's sanctioned
  families — the micro-captions `text-[8px]`/`text-[10px]` · the
  white-wash `text-white\/75`/`bg-white\/20` · the muted grays). THE
  MUTATION-CANDIDATE DECODE (the marketing name-evaporation family):
  the mobile menu toggle decoded live — `aria-label="Toggle
  navigation"` is the ONLY accessible name of an ICON-ONLY
  `md:hidden` button (textContent="" · the Menu/X svg, no wired
  label, no title) — the s201 contacts Import trigger genus's
  md:hidden sibling: a dropped aria-label ships a NAMELESS icon-only
  trigger that the resting phone / registration scans at rest and NO
  open-state scan has ever covered. THE FAQ STATE DECODE: the
  open-answer is a TEXT-ONLY state (controls=0 — the mounted `<p>`
  carries the family's construction, the resting Q1 answer holds the
  class face); the non-default state's unique surfaces are the Q6
  answer mounted + the Q1 face closed (aria-expanded=false + the
  answer unmounted).

### The findings triage

**FIX THIS ROUND (three cures — the marketing arms born-green by the
live probes, the audit census a pure re-pin with zero runtime
surface):**

- **D-203a1 (Verified) — THE REGISTER'S MARKETING CLIENT-STATE
  COVERAGE.** The three marketing client-state arms get their two-gate
  registrations: the FAQ non-default open state (the Q6 ride, the
  L-164c2 sentinel pair — the answer mounted + the resting answer
  GONE) at BOTH widths (+2) + the mobile disclosure menu OPEN (the
  toggle ride → the panel sentinel — the `div.md\:hidden.border-t`
  mount + its unique "Preview" link, the only Preview link visible at
  390) at phone width (+1 — the width-inverse: the `md:hidden` toggle
  renders at no ≥768 band, the s201 declined drawer-at-desktop
  doctrine). + THE PINS (in `tests/dialog-controls.test.ts`, the
  one-suite doctrine): the containment pair + the marketing
  client-state census pin (three, live-read) + the FAQ width-pair
  census + the menu arm's phone-only negative — RED-first at birth
  (the labels do not exist yet; the census reads 0) → the
  registrations → GREEN. MUTATION-PROVEN: the planted `aria-label`
  removal on the landing menu toggle
  (`src/components/landing/landing-page.tsx` — the name-evaporation
  genus decoded live at LEG-5c) → the NEW menu-open registration RED at
  its role-based opener (the nameless trigger unfindable by name —
  the s201 Import-trigger form) + the NEW phone FAQ registration RED +
  the STANDING phone / landing registration RED exactly at the axe
  button-name rule → EVERY desktop registration GREEN (the toggle
  computes display:none at ≥md — the md:hidden width-blindness genus,
  the round's own rationale) → restored → GREEN.
- **D-203a2 (Verified) — THE CRITERION'S MARKETING-STATE PIN PAIR.**
  The head criterion ("one test() per surface × width") has never been
  adjudicated for the landing surface's client-state machines: no pin
  cross-reads menuOpen/openIndex against the register (the s202a2
  state-machine census holds the LOGIN machine only). THE CURE: the
  marketing family registered (the criterion TRUE for the landing
  surface's every client-state arm — a1) + THE PIN PAIR (the
  dialog-controls session-203 (m) describe): the containment pair
  (the FAQ arms at both widths + the menu arm, named) + the marketing
  client-state census (three, live-read) + the FAQ width-pair census
  (every FAQ registration carries its width twin) + the menu arm's
  phone-only negative (the width-inverse doctrine pinned as a NEGATIVE
  — a desktop menu twin never appears). RED-first at birth → the
  registrations → GREEN. MUTATION-PROVEN: the planted phone FAQ-twin
  removal trips the width-pair census + the containment-a + the
  census (exactly 3 RED) → restored → GREEN.
- **D-203a3 (Verified) — THE STANDING DUTY'S AUDIT-CENSUS DRIFT (the
  s198 D-198a2 doctrine re-applied).** The PAD §10 ledger row + the
  AGENTS gate-order note + the docs-counts pin triplex carried the
  s198-pinned census 9 (4h/4m/1l); the live audit is 10 (4h/5m/1l)
  with the minimatch moderate. THE CURE: the PAD §10 row re-anchored
  at the live census (10: 4 high / 5 moderate / 1 low) + the
  minimatch chain + the RE-TRIAGED session-203 clause (the drift
  9 → 10 · GHSA-g3hv-75wg-m249 · the dev-toolchain eslint-family
  chains · zero runtime exposure · no mid-rotation toolchain bump —
  the standing posture: a toolchain bump forces the standing pixel
  baselines' re-derivation, its own rotation); the AGENTS gate-order
  note re-anchored (9 → 10 + the s203 re-triage tail, the s198 clause
  kept verbatim beneath); the docs-counts D-198a2 pins re-anchored to
  the live row (the pin moving with the ledger — the s202 (g)
  re-anchor precedent). MUTATION-PROVEN: the planted stale-9
  reversion of the PAD row trips the re-anchored pin exactly once →
  restored → GREEN.
- **THE REQUIRED TEST-SIDE RE-ANCHOR:** the s200 (g) page-family
  census pin re-anchored to subtract ALL THREE non-page families
  (total minus dialog-open minus view-state minus
  marketing-client-state = 33 — the s202 (g) re-anchor precedent, the
  live read moving with the register).

**DECLINED (recorded considered-and-declined for the next audit's
re-triage):**

- **The FAQ all-closed state** (openIndex=-1) — the
  same-component/richer-face adjudication: the has-open family is the
  registered richer face (the mounted answer); the all-closed state
  is the minus-construction (every control renders at rest, all
  named — the resting scan's face; the s202 reset-password
  no-token-card posture).
- **The FAQ non-default members Q2..Q5 individually** — the
  same-construction family: Q6 is the registered representative
  member (the maximal-distance scan from the resting Q1); the s199
  Edit Event/Activity same-component doctrine.
- **The desktop mobile-menu twin** — the width-inverse: the
  `md:hidden` toggle renders at no ≥768 band; the s201 declined
  drawer-at-desktop doctrine.
- **The marketing interiors' client-state arms** — none exist: the
  source census found exactly TWO useState machines on the landing
  surface and ZERO on the /About + /Contact interiors.
- **A mid-rotation eslint-family bump to cure minimatch** — the
  standing no-mid-rotation-bump posture (a toolchain bump forces the
  standing pixel baselines' re-derivation — its own rotation); the
  advisory is dev-toolchain lint-time only, zero runtime exposure.

## 1. The TDD ledger (the cure plan)

- **D-203a1 — RED-first spec-contract pins, then the registrations:**
  1. `tests/dialog-controls.test.ts`: the NEW session-203 (m)
     describe — the containment pair (the FAQ arms at both widths +
     the menu arm at phone, each naming its registrations) + the
     marketing client-state census pin (three, the live read of the
     `FAQ item|menu OPEN`-labeled test() names) + the FAQ width-pair
     census + the menu arm's phone-only negative → **RED at birth**
     (the spec carries 0 marketing client-state registrations; the
     census reads 0).
  2. THE CURE: `tests/e2e/a11y.spec.ts` grows the session-203
     describe (the anon-family form: the storageState opt-out) + the
     three registrations, each with its L-164c2 open-wait sentinel:
     - "desktop / (landing, anon) with a non-default FAQ item OPEN"
       · "phone / (landing, anon) with a non-default FAQ item OPEN"
       (the Q6 ride → `#faq-answer-5` visible + `#faq-answer-0`
       hidden — the single-open invariant, the state the
       registration claims to scan);
     - "phone / (landing, anon) with the mobile disclosure menu OPEN"
       (the toggle ride → the `div.md\:hidden.border-t` panel mount +
       its unique "Preview" link visible).
  3. Born-green verification: the three registrations run green on
     the first run (the discovery's live probes pre-verified
     structural=0 + all-sanctioned contrast on every arm).
  4. MUTATION-PROOF: the planted `aria-label="Toggle navigation"`
     removal on the landing menu toggle → the NEW menu-open
     registration RED at its role-based opener + the NEW phone FAQ
     registration RED + the STANDING phone / landing registration
     RED at the axe button-name rule → EVERY desktop registration
     GREEN (the `md:hidden` width-blindness proof) → restored →
     GREEN.
- **D-203a2 — the pin pair holds the criterion (RED-first at birth,
  then the registrations):** the (m) width-pair census + the
  phone-only negative → the registrations → GREEN.
  MUTATION-PROOF: the planted phone FAQ-twin removal (one width twin
  deleted from the spec) → the width-pair census + the
  containment-a + the census pins RED (exactly 3) → restored →
  GREEN.
- **D-203a3 — the audit-census re-pin:** the PAD §10 row + the AGENTS
  gate-order note re-anchored at the live 10 (4h/5m/1l) + the
  docs-counts D-198a2 pin re-anchored (the row-prefix expectation +
  the RE-TRIAGED session-203 arm).
  MUTATION-PROOF: the planted stale-9 row reversion → the
  re-anchored docs-counts pin RED exactly once → restored → GREEN.
- **The required re-anchor:** the s200 (g) census subtracts all
  three non-page families (the live read: total − dialogs − views −
  marketing = 33).

## 2. The count ladder + the docs lockstep

UNIT 2837 → **2841** (+4: the dialog-controls session-203 (m)
describes — the containment pair + the census + the width-pair
census + the phone-only negative) · SUITES **138 HELD** (the
one-suite doctrine — the new pins ride the EXISTING dialog-controls
suite) · E2E 223 → **226** (+3: the three marketing client-state
registrations; the Appendix B a11y row re-anchored 61 → 64) · badge
3060 → **3067** (the unit+e2e arithmetic: 2841+226).
`skill-head-203.py` FIRST (the SKILL v1.200.0, the s202 layer
comment-demoted at its ship counts 2837/223, the s203 layer live at
2841/226, idempotent, the s197 exact-H1 guard form), then
`count-ladder-203.py` (assert-first, idempotent, unique-anchor — the
docs-counts UNIT + E2E constants · the README badge + Tested row +
tree + commands + the two s102-P1 e2e tree/commands sites · the
AGENTS commands + gate-order (unit + e2e) · the CLAUDE gate-order +
commands + pyramid (unit + e2e) + the coverage seam + the a11y family
description's s203 closure (the marketing-state arm: the landing
page's client-state arms registered — the FAQ non-default state at
both widths + the mobile disclosure menu at phone) · the PAD tree +
Total + HEAD + checklist + commands + the §11 a11y row (the line
census 881 → the live read + the family) + the §11 dialog-controls
row (the live read + the s203 pins) + the AGENTS gate-order note's
AUDIT-CENSUS flip (9 → 10 + the RE-TRIAGED session-203 tail) + the
PAD §10 ledger row's audit-census flip (the D-203a3 cure) + the
SKILL commands + Appendix B unit + e2e totals + the a11y row 61 →
64) + the test-side re-anchors in the same stroke (the docs-counts
layer-axis [first = s203, second = s202 at its ship 2837/223] + the
unit negatives ladder [the retired 2837 site-forms join the
negatives] + the login-family E2E ladder [the retired E2E 223 form
joins its negatives, the live positive re-anchored 226] + the
dialog-geometry-parity F-92a3 ladder [the four CLAUDE live positives
re-anchored 2841 + the 2837 forms join the negatives]). The docs
lockstep: the AGENTS Session-203 section · `docs/session_428.md` ·
the PAD §7.1 s203 inventory row (inserted BEFORE the Total row — the
s180 table-termination doctrine) + the §11 rows · the README
walk-contracts paragraph's s203 clause · this plan's execution record
· the worklog entry {Task ID: 203}.

## 3. The captures

The round's pair: one marketing client-state surface OURS + the
REFERENCE (the two-app-openable surface — the mobile disclosure menu
OPEN at the 390×844 phone axis on both apps, the walk65-walked
member: the mounted panel with the 6-link vocabulary + the icon swap)
+ the dev-server set of the remediated tree: the FAQ non-default open
state at both widths + the menu-open dev face + the mobile
drawer-open face at 390×844 (the operator's standing mobile-nav ask)
+ the dashboard — numbered past the s202 660-669 (the 670 series),
saved under `docs/screenshots/`, the VLM battery on the round's pair
(the house evidence form).

## 4. The final gate + the push

`bun run gate` (lint 0/0 · tsc 0 · 138/2841 · build · smoke 14/14 ·
CI=1 e2e 226/226) · the four-band sweep GREEN (`--fail-on-drift`,
the cure's baseline-inertness proof: zero pixel-bearing surface
touched) · `bun audit` (10: 4 high / 5 moderate / 1 low — the
RE-PINNED census, the triple-pin triplex re-anchored) · probe:ref
STABLE re-check · db census MATCH · the SSH-wrapper push to main
(`git@github.com:nordeim/neo-crm.git`), no new branch, the wrapper's
verified-push form.

The rate-limit arithmetic (the e2e rides' budget): the three new
registrations ride the PUBLIC landing surface — zero auth endpoints,
zero writes, zero rate-limit consumption (the standing budgets
unchanged: signup 7/10 · forgot: the auth.spec/reset-password rides
only). The db census contract untouched (no throwaway users).

## 5. The execution record (2026-10-31)

Executed as planned, in the order above, all green:

- **The baseline**: lint 0/0 · tsc 0 · 138/2837 unit · db census MATCH
  (15/24/10/23/12 + 4 users at `<repo>/db/custom.db`) — the fresh
  clone at `549e5d2`, tree clean, the env rebuilt from
  `.env.example`.
- **The discovery** (scripts/discover-203.ts): the standing data-gated
  re-checks ALL KILLED (OURS rows=15/24/10, the REF rows=1 the
  empty-state rows — the discover-184..203 standing census) · the
  conditional gates KILLED (probe:ref re-run live — STABLE at
  `46bc2d9c`; the registry's latest recharts 3.10.1) · the s120-era
  re-walk kill STANDING (the leads family source-frozen since s113 —
  90 sessions) · **THE PRE-SHIP AUDIT DUTY DRIFT** (bun audit 10:
  4h/5m/1l vs the s198-pinned 9 — the NEW moderate
  GHSA-g3hv-75wg-m249 on minimatch via the dev-toolchain eslint
  family; the dormancy `.html(`= 0 held) · **THE MARKETING
  CLIENT-STATE CENSUS**: the register 61 (33 page + 22 dialog + 6 view
  + 0 marketing) / the landing's 2 machines with 3 arms unregistered
  (the marketing-state genus) / **the LIVE axe probes: 3/3 arms
  structural=0** (the FAQ non-default at BOTH widths + the menu-open
  at phone; every contrast flag sanctioned) / the mutation candidate
  decoded live (the toggle's aria-label the ONLY name — icon-only,
  md:hidden) / the panel-mount decode (the header divs 2 → 3 + the
  6 mounted links) / the FAQ text-only state decode (controls=0).
- **D-203a1**: the (m) spec-contract pins RED-first into
  tests/dialog-controls.test.ts (exactly 4 RED at birth, zero
  collateral) → the +3 registrations in tests/e2e/a11y.spec.ts →
  born-green (3/3 the first run; the full scoped spec 65 passed) →
  **MUTATION-PROVEN**: the planted `aria-label="Toggle navigation"`
  removal → the NEW menu-open registration RED at its role-based
  opener + the NEW phone FAQ registration RED + the STANDING phone /
  landing registration RED exactly at the axe button-name rule
  (`.md\:hidden`) → EVERY desktop registration GREEN (62 passed —
  the md:hidden width-blindness proof) → restored → GREEN (6/6 on
  the landing-grep re-run).
- **D-203a2**: the (m) pin pair GREEN with the registrations →
  **MUTATION-PROVEN**: the planted phone FAQ-twin removal trips the
  width-pair census + the containment-a + the census (exactly 3 RED;
  the (g) census GREEN by design — the total and the family count
  drop together) → restored → GREEN (38/38).
- **D-203a3**: the PAD §10 row + the AGENTS gate-order note + the
  docs-counts D-198a2 pins re-anchored at the live 10 (4h/5m/1l) +
  the minimatch chain + the RE-TRIAGED session-203 clause →
  **MUTATION-PROVEN**: the planted stale-9 row reversion trips the
  re-anchored pin exactly once → restored → GREEN (41/41).
- **The required test-side re-anchor**: the s200 (g) page-family
  census pin re-anchored to subtract ALL THREE non-page families
  (total − dialogs − views − marketing = 33) — caught live by the pin
  itself the moment the family joined (the RED was the anchor's own
  proof).
- **The lockstep**: skill-head-203.py ran FIRST (the SKILL v1.200.0,
  the s202 layer comment-demoted at its ship counts 2837/223, the
  s203 layer live at 2841/226, idempotent) · count-ladder-203.py
  (assert-first, idempotent, unique-anchor — 46 verified flips; the
  live-census F-168c pin caught the mid-flight Appendix B row, and
  the badge-arithmetic pin caught the first draft's 3071 — re-set
  at 2841+226=3067; the §11 rows re-anchored by the line-prefix form
  after the shell-mangled exact-match lesson) · the test-side
  re-anchors (the docs-counts layer-axis + the 2837 unit negatives +
  the login-family E2E ladder + the dialog-geometry F-92a3 ladder) ·
  the docs (the AGENTS Session-203 section · session_428.md · the
  PAD §7.1 s203 inventory row [BEFORE the Total row] + the §11 rows
  · the README s203 clause · this execution record · the worklog
  entry {Task ID 203}).
- **The captures**: 670-676 (the round's marketing client-state pair
  ours+ref at the 390×844 phone axis — the mobile disclosure menu
  OPEN, the walk65-walked member — + the dev-server set: the FAQ
  non-default state at both widths + the menu-open dev face + the
  mobile drawer-open face + the dashboard).
- **The final gate**: lint 0/0 · tsc 0 · **138/2841** unit · build ·
  smoke **14/14** · e2e **226/226** · the four-band sweep GREEN
  (`--fail-on-drift` at desktop + 390 + 768×1024 + 1024×768 — the
  drift gate clean at every band, the seed restored after every run)
  · `bun audit` 10 (4 high / 5 moderate / 1 low — the RE-PINNED
  census) · db census MATCH · probe:ref STABLE at `46bc2d9c`.
- **THE FULL-GATE RIDE'S LIVE CATCHES** (both test-side, zero
  product-code motion):
  1. **The calendar month-boundary test's date-quirk** (the s203
     full-gate ride, October 31 — the trigger date): the s54-era test
     hopped its cursor with the raw `setMonth(+1)`, which OVERFLOWS on
     the month's last day (Oct 31 → "Nov 31" → Dec 1) — the while loop
     then read the cursor as December already, hopped once, and
     expected December on the November view. The test failed ONLY on
     overflow days — a date-dependent ambient leak (the L-164c1
     family's date sibling), 226→225 on the first full run. THE CURE:
     the DAY-1-ANCHORED constructor form the rest of the calendar
     family already uses (`new Date(y, m, 1)` — the :2839 hop cursor +
     calendar-mobile:128), verified green isolated ON THE TRIGGER
     DATE + green in the full re-run (226/226). The count held
     (the fix is in-place, never a skip).
  2. **The settings-defaults focus contract's under-load flake**:
     the S72-P2 spec tripped once on the second full run (1-in-3
     full runs this round), passing isolated (1/1) and on the final
     green run — the KNOWN starved-read lineage (the s164 record:
     "1-in-1 under full-suite load; 3/3 isolated", the same spec
     family). No artifact survived the isolated re-run (the trace
     was wiped), so no blind hardening was attempted (the speculative
     fix is not the house form); the lineage stands recorded — if it
     recurs, the decode is the next round's material.
