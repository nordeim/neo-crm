# Session 428 — THE A11Y REGISTER'S LANDING-PAGE CLIENT-STATE COVERAGE AUDIT + THE STANDING DUTY'S AUDIT-CENSUS DRIFT (the session-203 round record)

Date: 2026-10-31 · Rotation: 203 · Agent: main (Z.ai) ·
Plan: `docs/plans/2026-10-31-session203-a11y-register-landing-client-state-coverage.md`

## The round

The post-202 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`549e5d2` — the session_427 transcript, the s202 round's own
execution record). The round took THE S202 CLOSE'S BANKED STANDING
CANDIDATE — the register's marketing client-state arms: the landing
page's client-state machines. The register's live census was 61
registrations (33 page-family + 22 dialog-open + 6 client-state view +
ZERO marketing client-state) while the PUBLIC landing surface carries
exactly TWO client-state machines (`LandingHeader`'s `menuOpen` +
`Faq`'s `openIndex` — the source census found no others on the
marketing surfaces) whose non-resting states render DOM the resting
`/` registration never sees — THE MARKETING-STATE GENUS: the
register's own head criterion claims "one test() per surface ×
width", carried true for every family since s202, but the landing's
machines were never adjudicated against the register and no pin
cross-reads them (the s202a2 state-axis doctrine's marketing arm;
the s202 DECLINED posture "the batteries hold the wiring" carried
without a single two-gate tooth on the arms — landing.spec:85/:105
hold the functional wiring, never the a11y face).

## The audit (the baseline + the discovery)

The baseline gate GREEN at the exact s202 ship state (the fresh clone
at `549e5d2`, tree clean, the env rebuilt: `.env` from `.env.example`
with `DATABASE_URL="file:../db/custom.db"` + a fresh `AUTH_SECRET` ·
`db:push` + `db:seed`): lint 0/0 · tsc 0 · **138/2837** unit · db
census MATCH (15/24/10/23/12 + 4 users at `<repo>/db/custom.db` — the
operator's standing ask verified).

The discovery verdicts (`scripts/discover-203.ts`): the standing
data-gated re-checks ALL KILLED at the reference's unchanged
zero-data state (OURS rows=15/24/10 with the rowMenus live, the REF
rows=1 the empty-state rows — the discover-184..203 standing census)
· the conditional gates KILLED (probe:ref re-run live — STABLE at
`46bc2d9c`; the registry's latest recharts 3.10.1 kills the 4.0
gate) · the s120-era re-walk kill STANDING (the leads family source
frozen since s113 — 90 sessions; the deps locked; the bundle STABLE)
· **THE PRE-SHIP AUDIT DUTY DRIFT — THE ROUND'S SECOND MATERIAL**:
`bun audit` re-run live reads **10 advisories (4 high / 5 moderate /
1 low)** against the s198-pinned census 9 (4h/4m/1l) — the NEW
moderate **GHSA-g3hv-75wg-m249** on minimatch <11.0.1 ("potential
denial of service via globparts amplification"), riding the
DEV-TOOLCHAIN eslint family (`eslint › @eslint/eslintrc › minimatch`
+ `eslint-config-next › typescript-eslint ›
@typescript-eslint/utils › typescript-estree › minimatch`) —
lint-time transitive only, zero runtime request-path exposure, the
exact genus of the other nine; the dormancy re-check held
(pdf-export.ts `.html(` call sites = 0).

## The marketing client-state census (the round's primary material)

The landing's two machines decoded: the **mobile disclosure menu**
(menuOpen — closed at rest, the toggle scanned at phone; the OPEN
panel MOUNTS 6 link controls [Features · Preview · Pricing · FAQ ·
Contact · Open dashboard] at phone width only, the `md:hidden`
width-inverse — the header div count 2 → 3 on open, the
mount/unmount construction, the drawer-genus sibling on the marketing
surface) + the **FAQ open-item machine** (openIndex — the resting
Q1-open face is the only one the page-family registration scans; the
non-default states mount a different item's answer while the resting
Q1 answer unmounts). THE BORN-GREEN RE-VERIFICATION (the s172
discovery doctrine — the live axe probes BEFORE the plan): all 3
arms probed (the FAQ non-default open state [the Q6 ride — the
maximal-distance member from the resting Q1] at BOTH widths + the
menu-open state at phone, fresh anon contexts) — **structural=0 on
every arm (3/3); the GATE 2 landscape: zero unsanctioned contrast
flags** (every flag citing the landing preview's sanctioned
families). THE MUTATION-CANDIDATE DECODE: the mobile menu toggle's
`aria-label="Toggle navigation"` is the ONLY accessible name of an
ICON-ONLY `md:hidden` button (textContent="" · the Menu/X svg · no
wired label · no title) — the s201 contacts Import trigger genus's
md:hidden sibling: a dropped aria-label ships a nameless trigger the
resting phone / registration sees at rest and NO open-state scan had
ever covered. THE FAQ STATE DECODE: the open-answer is a TEXT-ONLY
state (controls=0) — the non-default state's unique surfaces are
the Q6 answer mounted + the Q1 face closed (aria-expanded=false +
the answer unmounted).

## The cures (the TDD ledger)

**C-203a1 — THE REGISTER'S MARKETING CLIENT-STATE COVERAGE.** +3
e2e registrations (the anon-family form): the FAQ non-default open
state at BOTH widths (the Q6 ride with the L-164c2 SENTINEL PAIR:
`#faq-answer-5` visible + `#faq-answer-0` hidden — the single-open
invariant, the state the registration claims to scan, never the
resting face behind the label) + the mobile menu OPEN at phone (the
toggle ride → the `div.md\:hidden.border-t` panel mount + its unique
"Preview" link — the only Preview link visible at 390: the desktop
nav computes display:none below md, the footer carries no Preview).
THE PINS (the dialog-controls session-203 (m) describe, the
one-suite doctrine): the containment pair + the marketing
client-state census pin (three, live-read) + the FAQ width-pair
census + the menu arm's phone-only NEGATIVE (the width-inverse
doctrine pinned as a negative — a desktop menu twin never lands
silently). RED-first at birth (exactly 4 RED, zero collateral) →
the registrations → born-green (3/3 the first run; the full scoped
spec 65 passed). MUTATION-PROVEN: the planted `aria-label="Toggle
navigation"` removal on the landing menu toggle → the NEW menu-open
registration RED at its role-based opener (the nameless trigger
unfindable by name — the s201 Import-opener form) + the NEW phone
FAQ registration RED + the STANDING phone / landing registration
RED exactly at the axe button-name rule (`.md\:hidden`) → EVERY
desktop registration GREEN (the toggle computes display:none at ≥md
— the width-blindness proof, the round's own rationale) → restored
→ GREEN (6/6 on the landing-grep re-run).

**C-203a2 — THE CRITERION'S MARKETING-STATE PIN PAIR.** No pin had
ever cross-read the landing surface's client-state machines against
the register (the s202a2 state-machine census holds the LOGIN
machine only). THE CURE: the marketing family registered (the
criterion TRUE for the landing surface's every client-state arm —
a1) + the (m) pin pair. MUTATION-PROVEN: the planted phone FAQ-twin
removal trips the width-pair census + the containment-a + the
census (exactly 3 RED; the (g) census GREEN by design — the total
and the family count drop together) → restored → GREEN (38/38).

**C-203a3 — THE STANDING DUTY'S AUDIT-CENSUS DRIFT (the s198
D-198a2 doctrine re-applied).** The PAD §10 ledger row + the AGENTS
gate-order note + the docs-counts pin triplex carried the
s198-pinned census 9 while the live audit reads 10. THE CURE: the
PAD row re-anchored at the live 10 (4 high / 5 moderate / 1 low) +
the minimatch chain + the RE-TRIAGED session-203 clause (the drift
9 → 10 · GHSA-g3hv-75wg-m249 · the dev-toolchain eslint-family
chains · zero runtime exposure · NO cure without a mid-rotation
eslint-family bump — the standing no-mid-rotation-bump posture
holds: a toolchain bump forces the standing pixel baselines'
re-derivation, its own rotation); the AGENTS gate-order note
re-anchored (the s198 clause kept verbatim beneath the s203 tail);
the docs-counts D-198a2 pins re-anchored to the live row (the pin
moving with the ledger — the s202 (g) re-anchor precedent).
MUTATION-PROVEN: the planted stale-9 row reversion trips the
re-anchored pin exactly once → restored → GREEN (41/41).

**THE REQUIRED TEST-SIDE RE-ANCHOR:** the s200 (g) page-family
census pin re-anchored to subtract ALL THREE non-page families
(total minus dialog-open minus view-state minus
marketing-client-state = 33 — the s202 (g) re-anchor precedent, the
live read moving with the register).

DECLINED (recorded considered-and-declined in the plan): the FAQ
all-closed state (the minus-construction — the richer-face
adjudication: the has-open family is the registered face) · the FAQ
non-default members Q2..Q5 individually (the same-construction
family — Q6 the registered representative) · the desktop
mobile-menu twin (the width-inverse — the s201 drawer-at-desktop
doctrine) · the marketing interiors' client-state arms (none exist
— the source census) · a mid-rotation eslint-family bump to cure
minimatch (the standing no-mid-rotation-bump posture).

## The count ladder + the docs lockstep

UNIT 2837 → **2841** (+4: the dialog-controls session-203 (m)
describes — the containment pair + the census + the width-pair
census + the phone-only negative) · SUITES **138 HELD** (the
one-suite doctrine) · E2E 223 → **226** (+3: the three marketing
client-state registrations; the Appendix B a11y row re-anchored
61 → 64) · badge 3060 → **3067** (the unit+e2e arithmetic:
2841+226 — the first draft's 3071 tripped the badge-arithmetic pin
mid-flight, the pin doing its exact job). The head surgery first
(skill-head-203.py — the SKILL v1.200.0, the s202 layer
comment-demoted at its ship counts 2837/223, the s203 layer live at
2841/226, idempotent), then count-ladder-203.py (assert-first,
idempotent, unique-anchor — 46 verified flips: the docs-counts UNIT
+ E2E constants · the README badge + Tested row + tree + commands +
the two s102-P1 e2e tree/commands sites · the AGENTS commands +
gate-order · the CLAUDE gate-order + commands + pyramid + the
coverage seam + the a11y family description's s203 closure · the
PAD tree + Total + HEAD + checklist + commands + the §11 a11y row
(the line census 881 → 967, re-anchored by the line-prefix form
after the shell-mangled exact-match lesson — the shipped
"ideOthers" typo cured to "[hideOthers" in the same stroke) + the
§11 dialog-controls row (514 → 581 + the s203 pins) · the SKILL
commands + Appendix B unit + e2e totals + the a11y row 61 → 64) +
the test-side re-anchors in the same stroke (the docs-counts
layer-axis [first = s203, second = s202 at its ship 2837/223] + the
unit negatives ladder [the retired 2837 site-forms join the
negatives] + the login-family E2E ladder [the retired E2E 223 form
joins its negatives, the live positive re-anchored 226] + the
dialog-geometry-parity F-92a3 ladder [the four CLAUDE live
positives re-anchored 2841 + the 2837 forms join the negatives]).
The docs lockstep: the AGENTS Session-203 section · this record ·
the PAD §7.1 s203 inventory row (inserted BEFORE the Total row) +
the §11 rows · the README walk-contracts paragraph's s203 clause ·
the plan's execution record · the worklog entry {Task ID: 203}.

## The verification (the final gate)

lint 0/0 · tsc 0 · **138/2841** unit · build (the type-gate
artifact) · smoke **14/14** · e2e **226/226** · the four-band sweep
GREEN (the cure's baseline-inertness proof — zero pixel-bearing
surface touched) · `bun audit` (10: 4 high / 5 moderate / 1 low —
the RE-PINNED census, the triplex re-anchored) · db census MATCH ·
probe:ref STABLE. THE FULL-GATE RIDE'S LIVE CATCHES (both test-side,
zero product-code motion): the calendar month-boundary test's
DATE-QUIRK (October 31 — the trigger date: the s54-era test's raw
`setMonth(+1)` overflows on the month's last day, Oct 31 → "Nov 31"
→ Dec 1, so the cursor read December already and hopped once onto
the November view — a date-dependent ambient leak, the L-164c1
family's date sibling; cured with the DAY-1-ANCHORED constructor
form the rest of the calendar family already uses, green isolated ON
THE TRIGGER DATE + green in the full re-run, the count held) · the
settings-defaults focus contract's under-load flake (the S72-P2
spec tripped once in three full runs, passing isolated + on the
final green run — the KNOWN s164 starved-read lineage, no artifact
survived for a decode, no blind hardening attempted; the lineage
stands recorded for the next recurrence). The captures (the 670
series): the round's marketing client-state pair (ours + the
reference — the mobile disclosure menu OPEN at the 390×844 phone
axis, the walk65-walked member; the VLM battery: "structurally
identical in styling and layout", the sole structural note the
reference's own Base44 FAB — the s149 platform genus, never
mirrored) + the dev-server set of the FAQ non-default state at both
widths + the menu-open dev face + the mobile drawer-open face (the
operator's standing mobile-nav ask) + the dashboard under
`docs/screenshots/`.

## The next rotation's standing material

The register is now closed on every axis its criterion names — the
page family both-widths since s171, the dialog family both-widths
since s201, the login card's client-state family both-widths since
s202, the landing's marketing client-state arms since s203 (the
(m) pins holding the family + the phone-only width-inverse). THE
STANDING CANDIDATES: the s120-era interactive-table re-walk (the
kill standing until the leads family source, a dep, or the
reference bundle moves — 90 sessions frozen) or a fresh data-gated
round if the reference gains demo data · the conditional gates
unchanged (the fresh-bundle re-derivation when probe:ref trips; the
recharts 4.0 gate) · the next `bun audit` pre-ship ride re-checks
the census against the re-pinned 10 (the minimatch advisory rides
the lockfile until the next eslint-family major — its own
rotation) · the a11y register's remaining client-state inventory
re-census (the FAQ all-closed minus-construction + the reset-
password no-token card state stay DECLINED under the richer-face
doctrine — re-adjudicate only if a component's construction
changes).
