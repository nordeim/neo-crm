# Session 422 — THE A11Y REGISTER'S PAGE-SURFACE COVERAGE AUDIT (the session-200 round record)

Date: 2026-10-30 · Rotation: 200 · Agent: main (Z.ai) ·
Plan: `docs/plans/2026-10-30-session200-a11y-register-page-surface-coverage.md`

## The round

The post-199 audit rotation. Its rotation trigger THE OWNER'S NEWEST
COMMIT (`17ea4a4` — the session_421 transcript, the s199 round's own
execution record). The round is THE S197/S199 PATTERN APPLIED TO THE
REGISTER'S OTHER FAMILY — the PAGE SURFACES: the s199 round closed the
register's dialog-open family; the page family is the other arm, and
the app's renderable route inventory had never been re-adjudicated
against it since the register's s171 birth (three surfaces joined the
app after that enumeration — the s144 marketing pair + the s163
reset-password — without ever joining the register).

## The audit (the baseline + the discovery)

The baseline gate GREEN at the exact s199 ship state (the fresh clone
at `17ea4a4`, tree clean — lint 0/0 · tsc 0 · **138/2822** unit ·
probe:ref STABLE at `46bc2d9c` — the bundle md5 unchanged, the demo
data still ZERO · db census MATCH (15/24/10/23/12 + 4 users at
`<repo>/db/custom.db` — the `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, the
operator's standing ask verified) · `bun audit` live: 9 (4 high / 4
moderate / 1 low) — the exact s198-pinned census, no drift).

The discovery verdicts (`scripts/discover-200.ts`): the standing
data-gated re-checks ALL KILLED at the reference's unchanged zero-data
state (OURS rows=15/24/10 with the rowMenus live, the REF rows=1 the
empty-state rows — the discover-184..200 standing census) · the
conditional gates KILLED (probe:ref STABLE kills the fresh-bundle
re-derivation; the registry's latest recharts 3.10.1 kills the 4.0
gate) · the s120-era re-walk kill STANDING (the leads family
source-frozen since s113 — 87 sessions; the deps locked; the bundle
STABLE) · the pre-ship audit duty CLEAN against the s198 triple pins.

## The page-surface census (the round's material)

The register's live census: 38 registrations (27 page-family + 11
dialog-open — read live from the spec). The app's renderable route
inventory: 16 surfaces. THE GAP: three page surfaces with ZERO a11y
teeth at any width — **/about + /contact** (the authenticated
marketing interiors: two-app-renderable, login-walled per the s147
reference posture [F-147c2 — its parity-event bundle re-walled its
marketing pages; ours mirrors]; their interactive arms focus-walked at
s193/walk66 but never axe-scanned — the s171 register's page family
was enumerated before the marketing pair existed) and
**/reset-password** (the OURS-ONLY anon surface — the /signup
registration precedent; the register's family criterion is renderable
surfaces, not two-app parity; the s163 digma S46/RA-66 port). THE
STALE-CENSUS FIND: the spec's own anon-family describe head still
claimed "The three anon surfaces (login/signup/landing)" — STALE
SINCE s195 (the 404 ×2 joined that very describe without the count
moving; the s197a2/s199a2 stale-census pattern INSIDE the spec file).
THE BORN-GREEN PRE-VERIFICATION (the s172 discovery doctrine — the
live axe probes BEFORE the plan): all three surfaces probed at
1280×800 + 390×844 — structural=0 + zero contrast/svg-alt flags on
every surface at both widths (OURS), both reset card states probed
(the no-token card + the shape-probe token form — the form the richer
face). THE REFERENCE's own /About + /Contact probed at both widths
(the GATE 2 citation verification — zero contrast flags; its
marketing palette rides the already-sanctioned gray/blue families) +
**THE LIVE CATCH**: the reference's own marketing pages carry TWO
NAMELESS icon-only buttons at desktop (`.w-9.sm\:flex` — decoded: its
topbar's Messages + Notifications, `button-name` violations on ITS
DOM) — OURS renders the same arms NAMED ("Messages" · "Notifications"
· "Account menu" — the s171 fixes cover the whole shell): the
drawer-precedent direction, the reference's own defect, never mirrored.
THE WIDTH-SCOPE CENSUS (the discovery addendum): the register's
dialog-open family is desktop-only (11 registrations, 0 at phone) —
the 11 phone dialog-open states probed live: ALL born-green
(structural=0 on every open state; every contrast flag cites an
existing sanctioned matcher — `bg-emerald-600` · the accounts
badge/border family · `text-gray-400` · the `-trigger-` pair) — the
STANDING NEXT-ROUND CANDIDATE with its pre-verification banked.

## The cures (the TDD ledger)

**D-200a1 — THE REGISTER'S PAGE-SURFACE COVERAGE.** THE CURE: +6 e2e
registrations at BOTH widths (the s171 page-family form: setViewport
→ goto → scanTwoGate): the /about + /contact authenticated pair (the
default storageState, the CRM-page idiom) + the /reset-password anon
pair (the describe's storageState opt-out, the set-password FORM state
via the shape-probe token — any non-empty `?token=` renders the form;
the no-token card adjudicated same-component: the shared
ResetPasswordScreen, the form the richer face). THE PINS (the
dialog-controls suite, the one-suite doctrine): the containment pair
+ the page-surface register census pin (thirty-three page-family
registrations — the live read: total test() minus the dialog-open
labels) — RED-first at birth (exactly 5 RED, zero collateral) → the
registrations → born-green (6/6 the first run). MUTATION-PROVEN: the
planted `{label}` removal inside the SocialLink anchor
(contact/page.tsx — the three social links become nameless icon
links; no existing pin holds the label child, the walk66 pins hold
href/target/rel only) → BOTH new /contact registrations RED exactly
at the link-name rule (citing the linkedin/x/github anchors) →
restored → GREEN.

**D-200a2 — THE SPEC'S OWN STALE ANON-FAMILY CLAIM.** THE CURE: the
describe head re-anchored to the count-proof NAME form ("The anon
family, both widths" — a name never goes stale when a surface joins;
the s197a2/s199a2 doctrine) + THE PINS: the negative pair (the
retired count-anchored form never returns + the NAME form is the live
face) — RED-first at birth → the comment cure → GREEN.
MUTATION-PROVEN: the stale re-plant trips BOTH arms of the pin pair →
restored → GREEN. THE LIVE CATCH: the negative pin's first draft (a
bare `\d+` regex) was fooled by the spelled-out count word — the s171
head carries "three" the WORD, not the digit; the `\w+` form catches
both spellings (the s199 placeholder-fallback lesson's cousin: read
what the artifact actually carries, never the assumed form).

DECLINED (recorded considered-and-declined in the plan): the
phone-width dialog-open registrations (11 states — the width-scope
arm, born-green pre-verified this round, the STANDING NEXT-ROUND
CANDIDATE) · the reset-password no-token card state (the
same-component adjudication — the s199 Edit Event/Activity precedent)
· the login card's in-card view states (the client-state genus — the
s192 walk65 cures + the login-views/login-reset batteries hold the
wiring).

## The count ladder + the docs lockstep

UNIT 2822 → **2827** (+5: the dialog-controls session-200 describes —
the containment pair + the page-family census pin + the count-proof
negative pair) · SUITES **138 HELD** (the one-suite doctrine) · E2E
200 → **206** (+6: the six registrations; the Appendix B a11y row
re-anchored 38 → 44) · badge 3022 → **3033** (the unit+e2e arithmetic:
2827+206). The head surgery first (skill-head-200.py — the SKILL
v1.197.0, the s199 layer comment-demoted at its ship counts 2822/200,
the s200 layer live at 2827/206, idempotent), then count-ladder-200.py
(assert-first, idempotent — the docs-counts UNIT + E2E constants ·
the README badge + Tested row + tree + commands + the two s102-P1 e2e
tree/commands sites · the AGENTS commands + gate-order (unit + e2e) ·
the CLAUDE gate-order + commands + pyramid (unit + e2e) + the coverage
seam + the a11y family description's s200 closure (the count-proof
anon family + the marketing pair + the reset surface) · the PAD tree +
Total + HEAD + checklist + commands + the §11 a11y row (the line
census 526 → 593 + the family) + the §11 dialog-controls row (236 →
306 + the s200 pins) · the SKILL commands + Appendix B unit + e2e
totals + the a11y row 38 → 44) + the test-side re-anchors in the same
stroke (the docs-counts layer-axis [first = s200, second = s199 at its
ship 2822/200] + the unit negatives ladder [the retired 2822
site-forms join the negatives] + the login-family negatives ladder
[the retired E2E 200 form joins its negatives, the live positive
re-anchored 206] + the dialog-geometry-parity F-92a3 ladder [the four
CLAUDE live positives re-anchored 2827 + the 2822 forms join the
negatives]). The docs lockstep: the AGENTS Session-200 section · this
record · the PAD §7.1 s200 inventory row + the §11 rows · the README
walk-contracts paragraph's s200 clause · the plan's execution record ·
the worklog entry {Task ID: 200}.

## The verification (the final gate)

lint 0/0 · tsc 0 · **138/2827** unit · build (the type-gate artifact)
· smoke **14/14** · e2e **206/206** · the four-band sweep GREEN (the
cure's baseline-inertness proof — zero pixel-bearing surface touched)
· `bun audit` (9, all dev-toolchain, the triple-pinned posture) · db
census MATCH · probe:ref STABLE. The captures: the /contact pair
(ours + the reference — the two-app-renderable registered surface) +
the dev-server set of the three newly-registered surfaces at both
widths + the mobile drawer-open face (the operator's standing
mobile-nav ask) under `docs/screenshots/`.

## The next rotation's standing material

The register's page-surface family is closed (every renderable page
surface registered at both widths — the census pin holding the count)
and the register's own claims are count-proof (the register-claim +
anon-family NAME forms + the negative pairs). THE STANDING
NEXT-ROUND CANDIDATE: the phone-width dialog-open family (11 states,
born-green pre-verified this round — the width-scope arm of the
dialog family). The standing candidates unchanged: the s120-era
interactive-table re-walk (the kill standing until the leads family
source, a dep, or the reference bundle moves) or a fresh data-gated
round if the reference gains demo data; the conditional gates
unchanged (the fresh-bundle re-derivation when probe:ref trips; the
recharts 4.0 gate); the next `bun audit` pre-ship ride re-checks the
census against the s198 pins.
