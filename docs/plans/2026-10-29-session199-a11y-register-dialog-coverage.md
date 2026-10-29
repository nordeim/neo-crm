# The session-199 plan — THE A11Y REGISTER'S DIALOG-OPEN COVERAGE AUDIT (the five un-registered open states + the spec's own stale census claim)

Date: 2026-10-29 · Rotation: 199 ·
Task: audit + validate the shipped session-198 state (commit `56deef8` +
the owner's transcript commit `a8a761d` — the session_419 transcript is
this round's rotation trigger), re-run the standing discovery legs (the
data-gated re-checks · the s120-era re-walk kill · the conditional
gates · the pre-ship audit duty), and take the round's fresh material
the inventory-coverage hunt surfaces: the s197 pattern applied to the
OTHER drift-gate inventory — the a11y two-gate register's own F-172c
criterion (a Radix Dialog's content is ABSENT from the DOM while
closed, so every dialog-open state deserves its own two-gate
registration) re-applied against the app's RUNTIME dialog census. The
register holds the five CREATE dialogs + ONE member of the five-member
edit family + neither of the three standalone dialogs — FIVE
dialog-open states carry ZERO open-surface a11y teeth (Edit Lead ·
Edit Account · Import Contacts · Account Insights · Save Custom Report
View), and the spec's own head comment still claims the s171 ship count
("The 25 registrations are EXPLICIT" — the register is 33; the s197a2
stale-census pattern INSIDE the spec file). Cure both the same round
(born-green registrations — the discovery's live axe probes verified
structural ZERO + all-cited-sanctioned on every open state), pin the
register's census + the count-proof comment form, align every doc in
the house lockstep, capture the round's set, push to main via the SSH
wrapper.

## 0. The audit (the baseline + the discovery)

The baseline gate at the shipped s198 state (the continuing workspace
at `a8a761d`, tree clean): lint 0/0 · tsc 0 · **138/2817** unit · db
census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db` — the
`.env` `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo
root, the operator's standing ask verified). The build · smoke · e2e
legs ride the final gate (§4).

The discovery (`scripts/discover-199.ts` — the discover-198 form + the
new register-coverage leg):

- **LEG-1 the standing data-gated re-checks — expected KILLED** at the
  reference's unchanged zero-data state (probe:ref this session: the
  demo data still ZERO — the discover-184..199 standing census: the
  Edit-family census rows=1 the empty-state rows, rowMenus=0, the
  topbar-search populated=0 on both).
- **LEG-2 the s120-era interactive-table re-walk kill — STANDING.**
  The kill condition re-checked live: the leads family source
  untouched since s113 (`f10cee6`, 86 sessions — git log), the deps
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
  posture verified in package.json + the lockfile (outside the
  vulnerable range); the dormancy re-check: pdf-export.ts `.html(`
  call sites = 0. No material on this leg.
- **LEG-5 THE A11Y REGISTER'S DIALOG-OPEN COVERAGE CENSUS — THE
  ROUND'S MATERIAL FOUND.** The register's live census: **33
  registrations** (test() calls in tests/e2e/a11y.spec.ts — 9 CRM
  pages × desktop + 9 × phone + 3 anon × 2 + the drawer-open + the
  five create dialogs + the contact edit dialog + the 404 × 2). The
  app's RUNTIME dialog inventory (the DialogContent components):
  the five create dialogs (entity-dialogs.tsx — also carrying the
  Event/Activity EDIT modes as the same components) · the W7/wce/Mke
  EDIT family (entity-edit-dialog.tsx — ONE component, the
  Contact/Account/Lead configs) · the Import Contacts dialog
  (contacts-page.tsx) · the Account Insights dialog
  (account-insights-dialog.tsx — the Ece, the accounts row click) ·
  the Save Custom Report View dialog (save-report-dialog.tsx — the
  reports "Saved Reports (N)" trigger). THE GAP: the register's own
  F-172c criterion (the closed-by-default genus — a Radix Dialog's
  content is ABSENT from the DOM while closed, invisible to every
  page-surface probe) leaves FIVE dialog-open states with ZERO
  open-surface a11y teeth:
  1. **Edit Lead** — /leads row ⋮ menu → Edit (the Mke config — a
     SEPARATE component from the registered Edit Contact; the s172
     product fix covered its htmlFor/id + aria-label mechanism, but
     no gate has ever scanned its RENDERED open state);
  2. **Edit Account** — /accounts row ⋮ menu → Edit (the wce config,
     the same separate component);
  3. **Import Contacts** — /contacts, the outline Import trigger
     (never in the s172 audit's scope at all);
  4. **Account Insights** — /accounts, the row click / the ⋮ View
     Insights (never in the s172 audit's scope);
  5. **Save Custom Report View** — /reports, the Saved Reports (N)
     outline trigger (never in the s172 audit's scope; the s190a1
     id={col.key} cure + the walk63 decode hold the construction,
     never the rendered a11y tree).
  THE ADJUDICATED same-component DECLINE: the Edit Event + Edit
  Activity modes — the create registrations already scan their
  shared DOM (the `event`/`activity` prop flips the title + the
  prefilled values only; the control set + the aria wiring identical).
  THE STALE-CENSUS FIND: the spec's own head comment still claims
  "The 25 registrations are EXPLICIT" — the s171 ship count, stale
  through the s172 +6 and the s195 +2 (the register is 33 — the
  s197a2 stale-census pattern INSIDE the spec file itself). THE
  BORN-GREEN PRE-VERIFICATION (the s172 discovery doctrine — the
  live axe probes BEFORE the plan): all five open states probed at
  1280×800 on the seeded dev server — **structural=0 on every open
  state** (GATE 1 clean), and every color-contrast node on the
  open-dialog landscapes cites a SANCTIONED matcher (the active-nav
  `bg-white\/10` chip · the accounts badge/border families
  `bg-danger`/`text-neutral-50`/`bg-blue-100`/`border-l-red-500`/
  `bg-yellow-50` · the muted `bg-gray-50` row family — GATE 2 clean).

### The findings triage

**FIX THIS ROUND (the register-coverage round — zero pixel risk by
decode, born-green by the live probes):**

- **D-199a1 (Verified) — THE REGISTER'S DIALOG-OPEN COVERAGE.** The
  five un-registered open states get their own two-gate registrations
  (the s195a2 form: open → scanTwoGate → Escape, one explicit test()
  per open state) + THE PINS (in `tests/dialog-controls.test.ts`,
  the one-suite doctrine — the spec-contract carrier since s172): the
  containment pins (the two edit siblings + the three standalone
  dialogs, each naming its registration) + the dialog-open register
  census pin (the live-read count: eleven dialog-open registrations
  — five create + the contact edit + the five new) — RED-first at
  birth (the describes/labels do not exist yet) → the registrations
  → GREEN. MUTATION-PROVEN: the planted `id="reportName"` removal in
  save-report-dialog.tsx (a REAL product-code mutation — the s172
  doctrine: the rendered a11y tree is the class no source pin can
  see) → the new "/reports (Save Custom Report View dialog OPEN)"
  registration RED exactly at the label rule → restored → GREEN.
- **D-199a2 (Verified) — THE SPEC'S OWN STALE REGISTRATION-COUNT
  CLAIM.** The head comment re-anchored to the count-proof NAME form
  ("The register is EXPLICIT (one test() per surface × width …)" — a
  name never goes stale when a registration joins; the s197a2
  doctrine) + THE PIN (in the dialog-controls 199 describe): the
  negative — the retired count-anchored form
  (`/The \d+ registrations are EXPLICIT/`) never returns —
  RED-first at birth (the spec still carries the 25-form) → the
  comment cure → GREEN. MUTATION-PROVEN: the stale re-plant → the
  negative pin RED → restored → GREEN.

**DECLINED (recorded considered-and-declined for the next audit's
re-triage):**

- **The Edit Event + Edit Activity edit-mode registrations** — the
  same-component adjudication: the create registrations already scan
  the shared EntityDialog DOM; the edit-mode delta is the prefilled
  values + the title text only (both wiring aria-labelledby through
  the same DialogTitle mechanism).
- **The popover/menu-open a11y registrations** (the Filters popover ·
  the account menu · the row menus · the reports selects · the
  more-filters expander) — the walk53/56/57/62 contract-freeze pins
  hold the open-interior constructions FULL-STRING (the aria forms
  included), and the register's family criterion since s172 is the
  Radix Dialog genus; the popover interiors are walk-proven
  two-app byte-equal.
- **The dev-toolchain bumps + the registry majors** — the s198
  declined-posture stands (the no-mid-rotation TOOLCHAIN doctrine;
  the lucide 0.525 PARITY pin; none of the newer registry versions
  carries an audit advisory on our locked versions — the live audit
  output the evidence).

## 1. The TDD ledger (the cure plan)

- **D-199a1 — RED-first spec-contract pins, then the registrations:**
  1. `tests/dialog-controls.test.ts`: the NEW session-199 describe —
     the containment pins (the edit-siblings registration + the
     three-standalone registration) + the dialog-open register
     census pin (the live read: eleven dialog-open registrations) →
     **RED at birth** (the spec carries six describes / 33
     registrations; the new labels do not exist).
  2. THE CURE: `tests/e2e/a11y.spec.ts` grows the new describe(s) +
     the five registrations (the s195a2 form: setViewport → goto →
     the open walk → scanTwoGate → Escape):
     - "/leads with the Edit Lead dialog OPEN" (the row ⋮ menu → the
       Edit item — the Mke config);
     - "/accounts with the Edit Account dialog OPEN" (the row ⋮ menu
       → the Edit item — the wce config);
     - "/contacts with the Import Contacts dialog OPEN" (the outline
       Import trigger);
     - "/accounts with the Account Insights dialog OPEN" (the row
       click — the Ece);
     - "/reports with the Save Custom Report View dialog OPEN" (the
       Saved Reports (N) outline trigger).
  3. Born-green verification: the five registrations run green on
     the first full battery (the discovery's live probes pre-verified
     GATE 1 structural=0 + GATE 2 all-cited-sanctioned on every open
     state).
  4. MUTATION-PROOF: the planted `id="reportName"` removal in
     save-report-dialog.tsx → the new Save-Report registration RED
     exactly at the axe label rule → restored → GREEN (the
     registration's teeth on the RENDERED tree proven — the class no
     source pin can see).
- **D-199a2 — RED-first negative pin, then the comment cure:**
  1. `tests/dialog-controls.test.ts`: the NEW negative pin — the
     spec's register claim must be the count-proof NAME form, the
     count-anchored form never returns → **RED at birth** (the spec
     still carries "The 25 registrations are EXPLICIT").
  2. THE CURE: the spec's head comment re-anchored ("The register is
     EXPLICIT (one test() per surface × width — the Appendix B
     per-spec census counts source test() calls, and the granular
     names name the failing surface directly).") → GREEN.
  3. MUTATION-PROOF: the stale re-plant ("The 25 registrations…") →
     the negative pin RED → restored → GREEN.

## 2. The count ladder + the docs lockstep

UNIT 2817 → **2822** (+5: the dialog-controls session-199 describes —
the containment pair + the census pin + the count-proof negative pair)
· SUITES **138 HELD** (the one-suite doctrine — the new pins ride the
EXISTING dialog-controls suite) · E2E 195 → **200** (+5: the five
registrations) · badge 3012 → **3022** (the unit+e2e arithmetic:
2822+200). `skill-head-199.py` FIRST (the SKILL v1.196.0, the s198
layer comment-demoted at its ship counts 2817/195, the s199 layer
live at 2822/200 + the beneath-it tail, idempotent, the s197
exact-H1 guard form), then `count-ladder-199.py` (assert-first,
idempotent, unique-anchor — the docs-counts UNIT + E2E constants ·
the README badge + Tested row + tree + commands · the AGENTS commands
+ gate-order · the CLAUDE gate-order + commands + pyramid · the PAD
tree + Total + HEAD + checklist + commands + the §11 a11y row's line
census · the SKILL commands + Appendix B unit + e2e totals + the a11y
row 33 → 38). The test-side re-anchors in the same stroke: the
docs-counts layer-axis (first = s199 at 2822/200, second = s198 at
its ship 2817/195) + the unit negatives ladder (the retired 2817
site-forms join the negatives, the s166 form) + the login-family
negatives ladder (the retired **E2E (Playwright, 195 checks)** joins
its negatives, the live positive re-anchored 200) + the
dialog-geometry-parity F-92a3 ladder (the four CLAUDE live positives
re-anchored 2822 + the 2817 forms join the negatives). The docs
lockstep: the AGENTS Session-199 section · `docs/session_420.md` ·
the PAD §7.1 s199 inventory row (inserted BEFORE the Total row — the
s180 table-termination doctrine) · the README walk-contracts
paragraph's s199 clause · this plan's execution record · the worklog
entry {Task ID: 199}.

## 3. The captures

The round's pair: the Save Custom Report View dialog OPEN, ours + the
reference at the desktop axis (the two-app-openable registered surface
— walk63's own surface, the round's own axis) + the dev-server set of
the remediated tree: the five newly-registered dialogs OPEN (the Edit
Lead · the Edit Account · the Import · the Insights · the Save-Report)
+ the mobile drawer-open face at 390×844 (the operator's standing
mobile-nav ask) + the dashboard — numbered past the s198 621-628 (629+),
saved under `docs/screenshots/`, the VLM battery on the round's pair
(the house evidence form).

## 4. The final gate + the push

`bun run gate` (lint 0/0 · tsc 0 · 138/2822 · build · smoke 14/14 ·
CI=1 e2e 200/200) · the four-band sweep GREEN (`--fail-on-drift`, the
not-found leg included — the cure's baseline-inertness proof: zero
product-code pixels touched) · `bun audit` (9, all dev-toolchain, the
triple-pinned posture) · probe:ref STABLE re-check · db census MATCH ·
the SSH-wrapper push to main (`git@github.com:nordeim/neo-crm.git`),
no new branch, the wrapper's verified-push form.

## 5. The execution record (2026-10-29)

Executed as planned, in the order above, all green:

- **The baseline**: lint 0/0 · tsc 0 · 138/2817 unit · probe:ref STABLE
  at `46bc2d9c` (the bundle md5 unchanged, the demo data still ZERO) ·
  db census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db`) —
  the continuing workspace verified standing (node_modules + the .env
  64-hex + `db/` at the repo root).
- **The discovery** (scripts/discover-199.ts): the standing data-gated
  re-checks ALL KILLED (the live Edit-family census on both apps: OURS
  rows=15/24/10 with the rowMenus live, the REF rows=1 the empty-state
  rows with rowMenus=0 — the discover-184..199 standing census; the
  topbar-search populated=0 on both) · the conditional gates KILLED
  (probe:ref STABLE; the registry's latest recharts 3.10.1) · the
  s120-era re-walk kill STANDING (the leads family source-frozen since
  s113 — 86 sessions; the deps locked; the bundle STABLE) · the
  pre-ship audit duty CLEAN against the s198 triple pins (bun audit 9:
  4h/4m/1l exactly; the overrides.dompurify 3.4.17 posture verified;
  the dormancy re-check `.html(` call sites = 0) · **THE
  REGISTER-COVERAGE CENSUS**: the register 33 / the runtime dialog
  inventory decoded / the FIVE un-registered open states enumerated +
  the same-component adjudication recorded / the stale "25
  registrations" comment found / **the LIVE axe probes on the five
  un-scanned open states: structural=0 + all-cited-sanctioned on every
  open state** (born-green pre-verified).
- **D-199a1**: the spec-contract pins RED-first into
  tests/dialog-controls.test.ts (exactly 5 RED at birth, zero
  collateral) → the +5 registrations in tests/e2e/a11y.spec.ts (each
  with the visible-dialog open-wait guard) → born-green (5/5 the first
  run; the full spec 39 passed) → **MUTATION-PROVEN**: the planted
  aria-label removal on the config-driven SelectTrigger → BOTH new
  edit-sibling registrations RED exactly at the structural gate
  (aria-input-field-name) → restored → GREEN. **THE LIVE CATCH**: the
  first mutation attempt (the `id="reportName"` removal) did NOT trip
  — the live probe decoded axe's label rule: `non-empty-placeholder`
  is a sanctioned `any` check, so the label-association break alone
  stays green — the mutation moved to the combobox-name axis where no
  content fallback exists (the walk lesson recorded).
- **D-199a2**: the negative pin pair RED-first at birth → the head
  comment re-anchored to the count-proof NAME form → GREEN →
  **MUTATION-PROVEN**: the stale re-plant trips BOTH arms of the pin
  pair → restored → GREEN.
- **The lockstep**: skill-head-199.py ran FIRST (the SKILL v1.196.0,
  the s198 layer comment-demoted at its ship counts 2817/195, the s199
  layer live at 2822/200, idempotent) · count-ladder-199.py
  (assert-first, idempotent — the full site census incl. the two
  s102-P1 e2e tree/commands sites + the §11 rows the live-census pins
  themselves caught mid-flight: the inventory-census §11
  dialog-controls row 175 → 236 + the a11y row 436 → 526) · the
  test-side re-anchors (the docs-counts layer-axis + the unit
  negatives + the login-family E2E ladder + the dialog-geometry
  F-92a3 ladder) · the docs (the AGENTS Session-199 section ·
  session_420.md · the PAD §7.1 s199 inventory row [BEFORE the Total
  row] + the §11 rows · the README s199 clause · this execution
  record · the worklog entry {Task ID 199}).
- **The captures**: 629-636 (the round's save-report pair ours+ref at
  the desktop axis + the dev-server set: the four other
  newly-registered dialogs OPEN + the mobile drawer-open face + the
  dashboard). The VLM battery: "STRUCTURAL differences: None ·
  STYLING differences: None · structurally identical in styling and
  layout".
- **The final gate**: lint 0/0 · tsc 0 · **138/2822** unit · build ·
  smoke **14/14** · e2e **200/200** (6.3m) · the four-band sweep GREEN
  (`--fail-on-drift` at desktop + 390 + 768×1024 + 1024×768 — the
  drift gate clean at every band, the seed restored after every run)
  · `bun audit` 9 (all dev-toolchain, the triple-pinned posture) · db
  census MATCH · probe:ref STABLE at `46bc2d9c`.
