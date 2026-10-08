# Session-80 Parity Remediation Plan (2026-10-08)

Session 80 on `main` @ `b325905` (the s79 ship `89f3b10` + two
session-log commits — `docs/session_154.md` + `docs/session_155.md`,
ZERO code drift). The workspace SURVIVED s79: the pull fast-forwarded
`89f3b10 → b325905` (session_155.md only, 124 insertions, docs-only).
Environment verified in place (`.env` with
`DATABASE_URL="file:../db/custom.db"` + the AUTH_SECRET; `db/custom.db`
+ `db/e2e.db` at the repo root; census MATCH 15/24/10/23/12 + 4 users).
The documented intake hazard STANDS (the platform `DATABASE_URL`
override points at a non-existent mirror; all session-80 repo
operations run under `env -u DATABASE_URL`). **Baseline gate on HEAD:
lint 0/0 (enforced) · tsc 0 · 1561/1561 unit (88 suites) · playwright
--list 132 in 4 files** — the documented state exact; the `skills/`
exclusion verified in all three configs (eslint ignores + tsconfig
exclude + vitest include-scope).

## The standing layers (76th session, NO DRIFT)

Drift sweep #76: the reference bundle fresh-fetched from
`/assets/index-DZ-xbrIm.js` — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` **exact — the 51st consecutive
stable session**. Reference census #76 (agent-browser, live login at
1440 then a TRUE 390px viewport): the demo data still zero (the KPI
values 0/$0.0k/$0.0k); the mobile-nav defect STANDS at a TRUE 390px
(vw=390, nav w=0, 8 links in DOM, 0 visible, no hamburger); desktop
nav normal (256px, 8 links, all visible). Our mobile drawer stays the
deliberate documented superset.

## The audits (two parallel subagents + the orchestrator's own
fresh-eyes rotation, every parity claim LIVE-EXTRACTED from the
reference — the profile page's surfaces are APP code but its neutral
button family rides the platform's `--primary` #171717, so the hover
claims were measured as COMPUTED VALUES on both apps + the reference's
own compiled stylesheet was fetched and decoded)

**80-a** — the s79 re-audit: **15/15 checklist items GENUINE** (every
S79-P1..P15 fix at file:line; the login-family-parity suite re-ran
38/38 [the +6 green-by-design anchors over the 32 RED pins]; the
re-anchor suites 45/45; the FULL unit suite re-ran 1561/1561; the
89f3b10 commit honest [17 files, +1014/−94, 5 added / 12 modified,
zero strays]; 7ea0901 + b325905 docs-only). Three nano notes: (1) two
stale s21 comment remnants survived the P2 comment sweep —
`login-reset.ts:34-38` (the file header still asserts the LIVE-FALSIFIED
"safe to mirror -mb-2 verbatim / computes 8px under BOTH v3 and v4"
claim, contradicting the re-derived record comment below it) +
`login-card.tsx:305` (still reads "the -mb-2 back button"); (2) the
P11 "focus-visible:ring-offset-2" needle was never in the pre-s79
inline classes (verified at 89f3b10^ — the three real needles were
present and retired; the landed fix matches the plan verbatim); (3)
the parity suite ships 38 its, not ~32 — the 32 is the RED-first
failing-pin count (consistent with the plan's own "+38 its exact").

**80-b** — the graduation audit: **ZERO graduations, 13/13 (the 37th
consecutive)** — item (1) N-77c17 TableHead CLOSED as RESOLVED by
s79's M-79c5 (the resolution holds: `table.tsx:55` text-muted-ink,
`globals.css:73` #737373); the ledger now 12 standing, items 2-13 all
verified unchanged. The 8 mechanical censuses 6 CLEAN + **TWO
findings (three stale carriers, all one N-50a-class docs fix)**:
`CLAUDE.md:38` (the gate-order paragraph still reads `bun run test`
(1523) → … (132) — stale since s79's 1523→1561 bump; the s79
realignment touched only :114/:115/:299/:371) + `CLAUDE.md:125` (the
Test-Pyramid "Unit (Vitest, 1523 checks)" line) + `PAD:772` (the HEAD
line still "87 Vitest suites with 1523 checks" — the s79 inventory row
:764 + Total :765 are correct at 88/1561). Both operator decisions'
evidence INTACT (censuses 7/8 clean; the CSV guard suites re-ran
25/25).

**80-c** — the fresh-eyes rotation on the PROFILE PAGE'S OWN SURFACES
(the session_154 suggested target #1 — never a dedicated VISUAL
rotation: s13 pinned PROFILE_LAYOUT, s30 the photo flow, s72 the
store/API seams, but nobody ever walked the page's DOM + computed
styles against the live reference): the foundations SOLID (the
page-root/header/grid anatomy byte-equal; the form's space-y-6 +
space-y-2 group stack; the stock Label; the Full Name input with the
"Enter your full name" placeholder; the disabled email/role inputs
with the bg-gray-50 wash + capitalize + computed opacity 0.5 + 14px
md:text-sm; the 48px chips' inline-color expressions computed-equal
[blue-100/#2563eb, green-100/#16a34a, purple-100/#f3e8ff, purple-600
#9333ea]; the Account card's 80px flat avatar + h3→p gap 0 + badge
mt-2 8px; the 390px responsive set measured IDENTICAL on both apps
[form avatar 80, upload/save w-full 308, grid-cols-1, account avatar
80, zero overflow]; the outline Upload button computing white/#e5e5e5/
#0a0a0a/36px on BOTH apps) — the **N-80 family: 2 M + 1 L + 2 N**:

- **M-80c1 CONFIRMED (live-measured on the reference, both apps)** —
  the NEUTRAL-900 HOVER ALPHA ARMS: the reference's dark-primary
  surfaces ship ALPHA hovers — its profile role badge computes
  `hover:bg-primary/80` → **rgba(23,23,23,0.8)** (LIVE hover-probed,
  settled past the transition), its profile Save Changes computes
  `hover:bg-primary/90` → **rgba(23,23,23,0.9)** (LIVE), its New Lead
  dialog submit carries the class-decoded
  `bg-primary text-primary-foreground shadow hover:bg-primary/90
  h-9 px-4 py-2`, and its settings picklist Add button the same /90
  construction; its stylesheet literally reads
  `.hover\:bg-primary\/80:hover{background-color:hsl(var(--primary) /
  .8)}` (the 79.5KB asset decoded, ZERO alpha-translation ambiguity).
  OURS ships SOLID `hover:bg-neutral-800` (#262626 = rgb(38,38,38)) on
  ALL FIVE carriers — `badge.tsx:31` (the default Badge variant — the
  accounts "N Overdue" family), `page-layout.ts:986`
  (PROFILE_LAYOUT.badge), `page-layout.ts:690` (DIALOG_SUBMIT.button —
  8 call sites), `page-layout.ts:415` (SETTINGS_PICKLIST.addButton),
  `profile-page.tsx:282` (the inline Save). The s66 badge translation
  miscalculated the alpha math (0.8×23 + 0.2×255 = 69.4 ≈ #454545 ≠
  #262626 — the same genus as the s21 "-mb-2 verbatim" v4-math
  error): the solid arm renders rgb(38,38,38) where the reference
  renders a 20%-lighter rgb(69,69,69) wash (badge) / 10%-lighter
  rgb(46,46,46) (buttons) on EVERY hover.
- **M-80c2 CONFIRMED (live-proven, both apps + both stylesheets)** —
  the TAILWIND V4 HOVER-VARIANT MEDIA WRAP: Tailwind v4 compiles every
  `hover:` utility inside `@media (hover: hover)` (CSSOM-walked live:
  our `.hover\:bg-neutral-800:hover` rides
  `…(hover: hover) && (hover: hover)`), so ALL our hover affordances
  NO-OP on hover-incapable devices (touch — the sticky-hover washes
  never fire). The reference's v3-era compiled stylesheet
  (`index-Be9epoFc.css`, 79,581 bytes) contains **ZERO
  `(hover: hover)` media queries** — every hover rule is a BARE
  `:hover` selector, so its hovers apply on touch exactly like
  desktop. LIVE-PROVEN on our dev server: with the mouse parked over
  our badge (`:hover` matching, polled true for 1s), the computed
  background stayed **#171717 unchanged** — the hover rule never
  applies in a hover:none environment while the reference's identical
  probe computes rgba(23,23,23,0.8). The v4 shadow/blur/space-y
  re-pin family's fourth member. Fix: `@custom-variant hover
  (&:hover);` in `globals.css` (one top-level line after the imports —
  restores the reference's v3 bare-:hover semantics family-wide; the
  `ui-styling` skill's tailwind-customization reference documents the
  @custom-variant escape hatch).
- **L-80c3 CONFIRMED (DOM-extracted, both apps)** — the PROFILE EMAIL
  INPUT TYPE: the reference's disabled email input renders
  `type="email"` (the Full Name `type="text"` + the Role `type="text"`
  match ours); OURS renders `type="text"` (the `<Input>` passes type
  through — the profile call site simply never set it). A DOM
  attribute diff with real semantics: autofill categorization +
  password-manager field detection + a11y role computation all read
  the type.
- **N-80c4 (80-a's nano note #1)** — the two stale s21 comment
  remnants: `login-reset.ts:34-38` (the file header's falsified
  "-mb-2 verbatim / computes 8px under BOTH v3 and v4" claim) +
  `login-card.tsx:305` ("the -mb-2 back button") — comment-only
  repairs (the dch policy), zero functional impact.
- **N-80c5 DOCUMENTED PARITIES (no change)** — the three info-card
  value ps' `text-foreground` (ours) vs inherited card-foreground
  (reference): BOTH compute rgb(10,10,10) (our --color-foreground
  re-pinned #0a0a0a in s73 — the class is the computed-equal
  expression); `text-muted` vs the reference's `text-gray-500` (both
  #6b7280); the outline button's `bg-surface`/`border-line` vs its
  `bg-background`/`border-input` (white/#e5e5e5 both, live-probed);
  its `hover:bg-accent hover:text-accent-foreground` pair (the accent
  = #f5f5f5 = our line-soft; the text arm is a no-op over the resting
  #0a0a0a); the chips' inline-style vs class expressions
  (computed-equal); the Account card's flat-80 avatar vs the form's
  80/96 ladder (both apps); the upload icon's `w-4 h-4 mr-2`
  ON-THE-SVG; the gap stack (h3→p 0, p→badge 8px via mt-2, both
  apps); the badge's full stock construction (border-transparent +
  shadow + focus-ring + capitalize — byte-set-equal apart from the
  hover arm); the avatar SVGs' lucide-user/user/mail/shield glyphs
  with stroke-2 (path-data-verified); the page title "Profile | NEO
  CRM"; the 390px responsive set (measured identical).

## The operator decisions (39th re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 80-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied
in `escapeCell` AND imported into entity-export.ts's `qq`; the `-`
exclusion documented; **ZERO new unguarded builders** (the 80-b
consumer sweep re-verified every dynamic CSV construction routes
through the guarded builders; the profile family ships ZERO CSV
surfaces — no export affordance exists on the page; the bundle
byte-stable for the 51st consecutive session); no new evidence moves
the (a) parity / (c) full-OWASP alternatives.

The **source-vocabulary documented parity STANDS** — the 80-b census
re-confirmed every anchor at file:line (both OPTIONS arrays pinned
with the in-file posture comments; NO enum-membership on the four
validation sites; the settings Capitalized defaults verbatim). The
profile family introduces NO vocabularies (a display-name freeform +
two disabled identity fields + a photo URL — no enum surfaces).

## The remediation set (TDD — RED first, then GREEN)

- **S80-P1 (M-80c2) — the hover-variant un-wrap**: `@custom-variant
  hover (&:hover);` as a top-level line in `src/app/globals.css`
  directly after the two `@import` lines (with the hazard comment
  documenting the reference's zero-wrap stylesheet + the live probe).
  This is what restores the reference's v3 hover semantics
  family-wide AND what makes S80-P2's alpha arms LIVE-verifiable in
  the battery (the headless probe environment reports hover:none —
  under the wrap, NO hover rule can be exercised there at all).
- **S80-P2 (M-80c1) — the five alpha arms**: `badge.tsx:31` default
  variant + `page-layout.ts:986` PROFILE_LAYOUT.badge:
  `hover:bg-neutral-800` → `hover:bg-neutral-900/80`;
  `page-layout.ts:690` DIALOG_SUBMIT.button + `:415`
  SETTINGS_PICKLIST.addButton + `profile-page.tsx:282` (the inline
  Save — which also drops the inert `border-transparent` the
  reference's default-variant Save does not carry):
  `hover:bg-neutral-800` → `hover:bg-neutral-900/90`. All five stay
  neutral-900-based (the computed-equal of the reference's
  --primary #171717) — only the hover arm's OPACITY expression
  changes (v4's `bg-neutral-900/90` compiles to
  `color-mix(in oklab, var(--color-neutral-900) 90%, transparent)` =
  rgba(23,23,23,0.9) — the reference's `hsl(var(--primary) / .9)`
  exact).
- **S80-P3 (M-80c1 re-anchors, in lockstep)**: `tests/badge-contract.
  test.ts:85` → `/hover:bg-neutral-900\/80/`; `tests/page-layout.
  test.ts:543` + `:614` (the two full-string toBe pins) → the /90
  strings; `tests/page-layout.test.ts:1189` (the badge toContain) →
  `hover:bg-neutral-900/80`.
- **S80-P4 (L-80c3) — the email input type**: the profile call site
  gains `type="email"` on the disabled email Input (the component
  already passes type through).
- **S80-P5 (N-80c4) — the two comment repairs**: the login-reset.ts
  file header's falsified claim re-derived; login-card.tsx:305's
  "the -mb-2 back button" → the mb-2 record reference.
- **S80-P6 (N-80b1, docs phase) — the three stale carriers**:
  `CLAUDE.md:38` (1523→1561) + `CLAUDE.md:125` (1523→1561) + `PAD:772`
  (87/1523→88/1561).
- **S80-P7 — the new `tests/profile-family-parity.test.ts`**: the
  RED-first pin set (the five alpha arms + the @custom-variant line +
  the email type + the two comment negatives) + green-by-design
  anchors (the computed-equal parities: the value ps' text-foreground
  token #0a0a0a, the gap stack, the avatar ladders, the chips'
  inline colors, the responsive w-full set).

No new e2e: the hover fixes are CSS-level (every e2e interaction is a
real pointer click — unaffected); the touch-sticky semantics change no
assertion the suite makes; the email type is a disabled-field
attribute. The unit pins + the LIVE battery cover the family (the
s76/s77/s78/s79 precedent for styling-only rotations).

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: `tests/badge-contract.test.ts:85`
(the default-variant hover regex); `tests/page-layout.test.ts:543`
(SETTINGS_PICKLIST.addButton toBe) + `:614` (DIALOG_SUBMIT.button
toBe) + `:1189` (the PROFILE_LAYOUT.badge toContain). SURVIVES
untouched: the save/upload button pins (`:1197-1207` — saveBtn pins
only `w-full sm:w-auto`, the hover arm unpinned there); the badge
structure pins (`:1184-1193` — every other toContain); the
badge-contract region pins (:84's border/bg/text regex unchanged); the
dialog/settings/source-rule pins (the dch/api-robustness families
reference DIALOG_SUBMIT by import — the record's VALUE changes, the
references stay); the settings-profile-parity suite (pins the
ListEditor anatomy + the defaults editors — not the add-button hover
string... verified: no hover pin in that suite); the profile-photo
suite (pins the upload flow, not the save classes); the e2e family
(132 unchanged — no assertion touches a hover state or the email
input's type). No pins on: the @custom-variant line, the email type,
the comment texts. The GREEN-hazard check: `grep -rn "hover:"
src/` — every existing hover usage compiles under the un-wrapped
variant identically on hover-capable devices; only touch devices gain
the reference-matching sticky wash.

## The execution record (2026-10-08, session-80)

EXECUTED AS PLANNED, zero mid-flight repairs (the first session since
s73 whose RED/GREEN runs needed no pin-shape fixes — the blast-radius
survey held exactly). RED: **13 failed exactly** (the new
profile-family-parity suite's 9 [1 the @custom-variant line + 5 the
alpha arms + 1 the email type + 2 the comment negatives] + the 4
re-anchors [badge-contract:85 → /80 + page-layout :543/:614 → /90 +
:1189 → /80]). Non-vacuousness PROVEN at the pre-fix state (only the
test files modified): the full suite ran **13 failed | 1563 passed**
— exactly the modified-pin set, ZERO collateral. GREEN: S80-P1..P6
all landed (P1 the `@custom-variant hover (&:hover);` line + the
hazard comment in globals.css; P2 the five alpha arms — badge.tsx
default + PROFILE_LAYOUT.badge at /80, DIALOG_SUBMIT.button +
SETTINGS_PICKLIST.addButton + the profile Save inline at /90 [the
inert border-transparent retired with it] + the save's comment
re-derived; P3 the four lockstep re-anchors; P4 type="email" on the
profile email input; P5 the login-reset.ts header re-derived +
login-card.tsx:305's mb-2 reference; P6 CLAUDE.md:38/:125 → 1561 +
PAD:772 → 88/1561 — the realignment phase then carried all carriers
to the final 1576/132 state). GATE: lint 0/0 · tsc 0 · **1576/1576
unit (89 suites, +15)** · build clean · **132/132 e2e on a fresh
CI=1 boot (3.3m; the FIRST run green — no flakes; all 9 mobile-nav
checks green)**. LIVE: the compiled CSS carries **ZERO (hover: hover)
wraps** post-fix (the raw fetch + the CSSOM walk both); the badge
hovers at **oklab(0.205.../0.8) = rgba(23,23,23,0.8)** — the
reference's LIVE-measured value exact — settling past the transition
(the 0.806257 first reading); the Save + the New Lead dialog submit +
the settings picklist Add all settle at **/0.9 = rgba(23,23,23,0.9)**
(the settings probe needed the add-Input typed into first — the
button ships disabled at empty input, the reference's own gating);
the email input type="email" live; the save's border-transparent
gone; the drawer at TRUE 390px (full-bleed 390x844, 8 links, dual
scroll-lock, focus inside; navigate → close + locks released;
Escape → inert + hidden); zero overflow ×10; NO Tailwind v4 bug
(the standing token re-pins 15/15 green — and THIS session's v4 bug,
the hover-variant wrap, fixed and live-verified in the hover:none
environment that could not exercise the wrapped rules at all); the
closing census MATCH (the db pristine 15/24/10/23/12 + 4 users [the
settings probe typed into a React input but never submitted — zero
DB writes] + the reference unchanged: demo zero, the mobile defect
standing, 256px/8 desktop). Screenshots 99 (the profile hover alpha)
+ 100 (the profile mobile responsive) NEW — VLM 4/5 + 4/4 PASS (the
99 hover flag a VLM-scale artifact, the s78 precedent: the pixel
sample proves the wash — the screenshot's dominant dark shade is
(46,46,46) = rgba(23,23,23,0.9) blended over white, with the badge's
resting (23,23,23) alongside it). Docs: SKILL v1.77.0 (§16bt +
project_state, 7129 → 7212, via the assert-first
scripts/skill_edits_s80.py at the sandbox root — the frontmatter +
H1 bumped together) + README badge 1708 + AGENTS/CLAUDE/PAD at
1576+132 (+ the PAD s80 inventory row + the Total 89/1576) +
session_156.md + this record + the repo worklog; .env/.env.example
verified (no env surface change; DATABASE_URL file:../db/custom.db
with db/ at the repo root). Estimate drift: +15 its exact (the new
suite's 15) · 132 e2e exact · the e2e-waits census unchanged at 5.

