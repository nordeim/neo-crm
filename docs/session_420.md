# Session 420 — THE A11Y REGISTER'S DIALOG-OPEN COVERAGE AUDIT (the session-199 round record)

Date: 2026-10-29 · Rotation: 199 · Agent: main (Z.ai) ·
Plan: `docs/plans/2026-10-29-session199-a11y-register-dialog-coverage.md`

## The round

The post-198 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`a8a761d` — the session_419 transcript, the s198 round's own
execution record). The round is THE S197 PATTERN APPLIED TO THE OTHER
DRIFT-GATE INVENTORY — the a11y two-gate register's own F-172c
criterion (a Radix Dialog's content is ABSENT from the DOM while
closed, so every dialog-open state deserves its own two-gate
registration) re-applied against the app's RUNTIME dialog census.

## The audit (the baseline + the discovery)

The baseline gate GREEN at the exact s198 ship state (the continuing
workspace at `a8a761d`, tree clean — lint 0/0 · tsc 0 · **138/2817**
unit · probe:ref STABLE at `46bc2d9c` — the bundle md5 unchanged, the
demo data still ZERO · db census MATCH (15/24/10/23/12 + 4 users at
`<repo>/db/custom.db` — the `.env` `DATABASE_URL="file:../db/custom.db"`
with `db/` at the repo root, the operator's standing ask verified).

The discovery verdicts (`scripts/discover-199.ts`): the standing
data-gated re-checks ALL KILLED at the reference's unchanged zero-data
state (the Edit-family census rows=1 the empty-state rows, rowMenus=0,
the topbar-search populated=0 on both — the discover-184..199 standing
census) · the conditional gates KILLED (probe:ref STABLE kills the
fresh-bundle re-derivation; the registry's latest recharts 3.10.1
kills the 4.0 gate) · the s120-era re-walk kill STANDING (the leads
family source-frozen since s113 — 86 sessions; the deps locked at the
s196 census; the reference bundle STABLE) · the pre-ship audit duty
CLEAN against the s198 triple pins (`bun audit` live: **9 (4 high /
4 moderate / 1 low)** — the exact pinned census, no drift; the
overrides.dompurify 3.4.17 posture verified in package.json + the
lockfile; the dormancy re-check: pdf-export.ts `.html(` call sites
= 0).

## The register-coverage census (the round's material)

The register's live census: 33 registrations. The app's runtime dialog
inventory: the five create dialogs (entity-dialogs.tsx — also carrying
the Event/Activity edit modes as the same components) · the W7/wce/Mke
EDIT family (entity-edit-dialog.tsx — ONE component, three configs) ·
the Import Contacts dialog (contacts-page.tsx) · the Account Insights
dialog (account-insights-dialog.tsx — the Ece, the accounts row
click) · the Save Custom Report View dialog (save-report-dialog.tsx —
the reports "Saved Reports (N)" trigger). THE GAP: the register held
the five create dialogs + ONE member of the five-member edit family +
neither standalone — FIVE dialog-open states with ZERO open-surface
a11y teeth: **Edit Lead · Edit Account** (the Mke/wce configs — a
SEPARATE component from the registered Edit Contact; the s172 product
fix covered their htmlFor/id + aria-label mechanism, but no gate ever
scanned the RENDERED open state) · **Import Contacts · Account
Insights · Save Custom Report View** (never in the s172 audit's scope
at all). THE STALE-CENSUS FIND: the spec's own head comment still
claimed "The 25 registrations are EXPLICIT" — the s171 ship count,
stale through the s172 +6 and the s195 +2 (the s197a2 stale-census
pattern INSIDE the spec file itself). THE BORN-GREEN
PRE-VERIFICATION (the s172 discovery doctrine — live axe probes
BEFORE the plan): all five open states probed at 1280×800 on the
seeded dev server — structural=0 on every open state, and every
color-contrast node on the open-dialog landscapes cites a SANCTIONED
matcher (the active-nav chip · the accounts badge/border families ·
the muted row family).

## The cures (the TDD ledger)

**D-199a1 — THE REGISTER'S DIALOG-OPEN COVERAGE.** THE CURE: +5 e2e
registrations (the s195a2 form: open → scanTwoGate → Escape, one
explicit test() per open state — the Edit Lead + Edit Account via the
row ⋮ menu → the Edit item; the Import via the outline Import trigger;
the Insights via the accounts row click; the Save-Report via the
Saved Reports (N) trigger), each carrying the VISIBLE-DIALOG
open-wait guard (the L-164c2 vacuous-green cure — a silently-failed
open would otherwise scan the page behind the label). THE PINS (the
dialog-controls suite, the one-suite doctrine): the containment pair +
the dialog-open register census pin (eleven open-state registrations —
the live-read label census) — RED-first at birth (exactly 5 RED, zero
collateral) → the registrations → born-green (5/5 the first run; the
full spec 39 passed). MUTATION-PROVEN: the planted aria-label removal
on the config-driven SelectTrigger (the F-172b regression's exact
shape) → BOTH new edit-sibling registrations RED exactly at the
structural gate (aria-input-field-name — the class no source pin can
see) → restored → GREEN. THE LIVE CATCH: the first mutation attempt
(the `id="reportName"` removal) did NOT trip — axe's label rule
carries `non-empty-placeholder` as a sanctioned fallback, so the label
association break alone stays green; the decode moved the mutation to
the combobox-name axis where no content fallback exists.

**D-199a2 — THE SPEC'S OWN STALE REGISTRATION-COUNT CLAIM.** THE CURE:
the head comment re-anchored to the count-proof NAME form ("The
register is EXPLICIT" — a name never goes stale when a registration
joins; the s197a2 doctrine) + THE PINS: the negative pair (the retired
count-anchored form never returns + the NAME form is the live face) —
RED-first at birth → the comment cure → GREEN. MUTATION-PROVEN: the
stale re-plant trips BOTH arms of the pin pair → restored → GREEN.

DECLINED (recorded considered-and-declined in the plan): the Edit
Event + Edit Activity edit-mode registrations (the same-component
adjudication — the create registrations already scan their shared
EntityDialog DOM; the edit-mode delta is prefilled values + the title
text only) · the popover/menu-open a11y registrations (the
walk53/56/57/62 contract-freeze pins hold the open-interior
constructions FULL-STRING — the aria forms included; the register's
family criterion since s172 is the Radix Dialog genus) · the registry
majors (the s198 declined-posture stands — none carries an advisory
on our locked versions).

## The count ladder + the docs lockstep

UNIT 2817 → **2822** (+5: the dialog-controls session-199 describes —
the containment pair + the census pin + the count-proof negative pair)
· SUITES **138 HELD** (the one-suite doctrine) · E2E 195 → **200**
(+5: the five registrations; the Appendix B a11y row re-anchored
33 → 38) · badge 3012 → **3022** (the unit+e2e arithmetic: 2822+200).
The head surgery first (skill-head-199.py — the SKILL v1.196.0, the
s198 layer comment-demoted at its ship counts 2817/195, the s199 layer
live at 2822/200, idempotent), then count-ladder-199.py (assert-first,
idempotent — the docs-counts UNIT + E2E constants · the README badge +
Tested row + tree + commands + the two s102-P1 e2e tree/commands
sites · the AGENTS commands + gate-order (unit + e2e) · the CLAUDE
gate-order + commands + pyramid (unit + e2e) + the coverage seam + the
a11y family description's s199 closure · the PAD tree + Total + HEAD +
checklist + commands + the s102-P1 e2e tree site + the §11 a11y row
(436 → 526) + the §11 dialog-controls row (175 → 236) · the SKILL
commands (unit + e2e) + the Appendix B unit total + the a11y row +
the e2e total). The test-side re-anchors in the same stroke: the
docs-counts layer-axis (first = s199 at 2822/200, second = s198 at its
ship 2817/195) + the unit negatives ladder (the retired 2817
site-forms join the negatives) + the login-family negatives ladder
(the retired E2E 195 form joins its negatives, the live positive
re-anchored 200) + the dialog-geometry-parity F-92a3 ladder (the four
CLAUDE live positives re-anchored 2822 + the 2817 forms join the
negatives). The docs lockstep: the AGENTS Session-199 section · this
record · the PAD §7.1 s199 inventory row + the §11 rows · the README
walk-contracts paragraph's s199 clause · the plan's execution record ·
the worklog entry {Task ID: 199}.

## The verification (the final gate)

lint 0/0 · tsc 0 · **138/2822** unit · build (the type-gate artifact)
· smoke **14/14** · e2e **200/200** · the four-band sweep GREEN (the
cure's baseline-inertness proof — zero pixel-bearing surface touched)
· `bun audit` (9, all dev-toolchain, the triple-pinned posture) · db
census MATCH · probe:ref STABLE. The captures: the save-report pair
(ours + the reference — the two-app-openable registered surface) +
the dev-server set of the five newly-registered dialogs OPEN + the
mobile drawer-open face (the operator's standing mobile-nav ask)
under `docs/screenshots/`.

## The next rotation's standing material

The register's dialog-open family is closed (every Radix Dialog's
open state registered — eleven dialog-open scans + the census pin
holding the count) and the register's own claim is count-proof (the
NAME form + the negative pair). The standing candidates unchanged:
the s120-era interactive-table re-walk (the kill standing until the
leads family source, a dep, or the reference bundle moves) or a fresh
data-gated round if the reference gains demo data; the conditional
gates unchanged (the fresh-bundle re-derivation when probe:ref trips;
the recharts 4.0 gate); the next `bun audit` pre-ship ride re-checks
the census against the s198 pins.
