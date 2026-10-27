# The session-190 plan — THE REPORTS SAVE-CUSTOM-VIEW DIALOG OPEN FACES (walk63)

Date: 2026-10-27 · Rotation: 190 ·
Task: audit + validate the shipped session-189 state (commit `3739c96` +
the owner's transcript commit `b8ea9f3` — the session_400/401 transcripts
are this round's rotation trigger), then execute the next-rotation
candidates the s400 close names (the reports SAVE-CUSTOM-VIEW dialog —
the s25-era construction, its open faces never walked under ADR-022 ·
the dashboard follow-up-rows checkbox arms — the s27-era construction,
its interactive faces never walked · the activities Completed-tab's
row-action buttons — the s109-era mobile-guard construction never
re-walked at the desktop axis), plus the round-specific operator asks
(env/db placement re-verification · the vitest/playwright config
standing check · the sitemap/SEO re-verification · the mobile-nav
two-app comparison · the Tailwind v4 bug-watch · the `.env.example`
inclusion · the dev-server captures), TDD-first, align every doc, push
to main via the SSH wrapper.

## 0. The audit (the baseline + the rotation adjudication) — DONE

The baseline gate at the shipped s189 state on a FRESH CLONE:
lint 0/0 · tsc 0 · **138/2781** unit · build (the type-gate artifact) ·
smoke **14/14** · e2e **192/192** (clean first run, 5.7m) · probe:ref
STABLE (`46bc2d9c` — the bundle md5 unchanged) · db census MATCH
(15/24/10/23/12 + 4 users at `<repo>/db/custom.db`, the ambient
`DATABASE_URL` shadow scrubbed with `env -u` on every DB-touching
command — the F-123a1 doctrine) · sitemap 11 routes + robots +
manifest 200 (smoke check 12).

The rotation adjudication: probe:ref STABLE kills the fresh-bundle
candidate; the registry's `latest` 3.10.1 (verified live against
registry.npmjs.org) kills the recharts 4.0 gate. **The round material =
the s400 close's named candidates**, adjudicated by the discovery probe
(`scripts/discover-190.ts` + the two micro-probes):

- **The reports SAVE-CUSTOM-VIEW dialog (the s400 close's first-named
  candidate) — LIVE, BOTH APPS, rich arms**: the s25-era construction
  (the "Saved Reports (N)" outline button → the wide Radix dialog → the
  localStorage `crm_saved_reports` seam — the L-74c8 state contract,
  the F-123a4 BLACK-pair Save): the trigger byte-equal at
  `1216,113 192x36` (bg white, border `1px solid rgb(229,229,229)`,
  radius 6), the OPEN dialog byte-equal at `384,240 672x420` (bg white,
  border `1px solid rgb(229,229,229)`, radius 8), the title
  "Save Custom Report View" + its cls byte-equal, the name input's
  placeholder + the COMPUTED font byte-equal (`14px/400`,
  `lineHeight 20px` at 1440 — the `md:text-sm` a CLASS-ORDER genus:
  the reference appends `md:text-sm mt-1` at the chain's end, ours
  carries it inline, computed-equal), the 6-column checkbox grid
  vocabulary identical (`[Name | Account | Owner | Value | Stage |
  Won Date]`) with the checkbox faces computed-EQUAL (`1px solid
  rgb(23,23,23)` + bg rgb(23,23,23) — the `border-neutral-900` vs
  `border-primary` token-selection genus, decoded), the Current-Filters
  summary box identical (`bg-blue-50 border-blue-200 rounded-lg p-3`
  + the three-dimension line), the footer identical (9 buttons: the
  X + Cancel + `Save Report [disabled]`), the SAVE round-trip
  identical (dialog closes; the trigger flips to "Saved Reports (1)";
  the localStorage seam — the browser context discards it), the
  post-save REOPEN identical (the name CLEARED — the L-74c8 contract;
  1 Load button). **The dialog's open faces + its REAL keyboard focus
  faces are genuinely unwalked** (the walk54/58 dialog family never
  touched this call site; the s25 pins hold the content words as
  regexes, never the call-site chains) — the walk + freeze-pin
  candidate.
- **The dashboard follow-up-rows checkbox arms (the second-named
  candidate) — KILLED**: the reference's zero-data state persists
  (the micro-probe's text-anchored census: the Lead Sources card
  carries 0 checkboxes — the empty container, the S9-10 contract; the
  Upcoming Activities card renders its "No upcoming activities"
  empty-state paragraph — 0 checkboxes) while OURS carries the seeded
  rows (4 + 3 checkboxes at the demo db). The checkbox rows ride DATA
  rows that do not exist on the reference — the same doctrine as the
  s189 Insights kill. The candidate STAYS SUSPENDED (the day the
  reference carries rows again is the day it returns).
- **The activities Completed-tab's row-action buttons (the third-named
  candidate) — KILLED**: the reference's Completed tab renders its
  empty panel at the zero-data state (checkButtons=0, the empty-state
  row alone) while OURS carries the seeded completed rows (5 toggle
  buttons + the s109 mobile-guard rows). The row-action construction
  rides DATA rows that do not exist on the reference — the candidate
  STAYS SUSPENDED under the same doctrine.
- **The topbar-search dropdown arm (the standing conditional gate) —
  STILL KILLED**: `populated=0` on BOTH apps at the seeded-term leg
  (the placeholder `Search Anything...` byte-equal) — the
  s392/394/396/398/400 gate FAILS; the candidate stays suspended with
  the s32 dead-stub doctrine standing.
- **The standing Edit-family re-check**: the reference's zero-row
  state persists (rows=1 the empty-state row alone, rowMenus=0,
  insightsTriggers=0 on /contacts, /leads, /accounts + zero calendar
  chips — the discover-190 census, one leg).

## WP-1 — The walk tool

`scripts/walk63-savedreports-dialog-focus-open.ts` (the walk53-62
ledger form over the LIVE arm at BOTH axes):

- **Phase A — the OPEN dialog census at the desktop axis 1440×900**:
  the trigger's resting face + the click-open ride + the OPEN dialog's
  root geometry ledger (the box + the face + the DFS ledger form) +
  the title + the name input's FULL chain + computed face + the
  6-column checkbox grid (the vocabularies + the first checkbox's
  chain + computed face) + the Current-Filters summary box + the
  footer's Cancel/Save pair faces + the disabled-Save resting face +
  the close X's aria + the mount-focus census.
- **Phase B — the REAL keyboard Tab drive through the OPEN dialog**
  (the walk54/58 focus form: the mount-focus stop + the chain through
  the dialog's focusables until the wrap + each stop's REAL
  :focus-visible ring — the programmatic face never the true face) +
  the REAL focus faces on the name input + a checkbox + the Save
  button + the Escape close round-trip.
- **Phase C — the interactive arms**: type a name → the disabled-Save
  flip → the SAVE round-trip (the localStorage seam — client-only,
  the browser context discards it; never a DB write) → the post-save
  REOPEN (the L-74c8 name-clear decode) + the saved-list arm (the
  p-3 bg-gray-50 rows + the Load outline-sm + the bookmark glyph +
  the saved-report date line) + the cancel-then-reopen state decode
  (the typed name KEEPS across a cancel — the L-74c7 contract) + one
  column-checkbox toggle ride (the unchecked face + the restored
  state — client state, discardable).
- **Phase D — the phone axis 390×844**: the dialog's phone box
  (w-full → the 358px family) + the input + the phone REAL-TAB drive
  + the phone footer faces.

The pairing idiom: the reference rides the sweep-state storageState
pair (ONE reference login — the s162 doctrine); OURS rides the dev
server on :3000 (the seeded db). The DATA-STATE discipline: the
dialog is data-INDEPENDENT (the reference's own zero-data state
reaches every censused face — the reports page renders its real charts
at zero data, the session-10 doctrine); the saved-list arm rides the
probe's OWN saved report on both apps (the localStorage seam — the
IDENTICAL one-item state, the browser context discarding it). The
destructive arms are NEVER fired on either app (the save is a
client-side localStorage write inside a discardable browser context;
the Load applies client-side filter state; the checkbox toggles are
client state).

## WP-2 — The decode

Every delta root-caused against the standing genus register (the
box-shadow SLOT-COUNT genus — the v4 five-slot variable chain vs the
reference's two/three-slot form, every VISIBLE layer byte-equal · the
outline VERSION FORM + both sub-forms + the color-carrier sub-form
[s178/walk61] · the token-selection genus [the M-81c2 pairs —
`border-line`/`bg-surface`/`text-ink`/`muted-ink` vs
`border-input`/`bg-background`/`muted-foreground`, computed-equal] ·
the CLASS-ORDER genus [the reference's `md:text-sm mt-1` append
position, decoded at the micro-probe] · the aria-label superset genus
[s88-c9, kept] · the React useId format genus · the Radix
mount-state offsets) + the v3-semantics lineage re-check
(s11/s96/s98/s123/M-92c1/D-187a3 — the space-y arms at the dialog's
body: the space-y-6 py-4 body + the space-y-4 section + the grid
gap-3). Target: ZERO live defects, every delta a documented genus or
a kept superset.

## WP-3 — TDD

Born-green contract-freeze pins (the s173 P-p/P-q precedent, the
s178-189 continuation), all in the existing page-layout suite (the
ADR-017 one-suite doctrine) — the pin survey FIRST (the standing
pins: the s25 saved-reports suite's content regexes + the s68
DIALOG_CONTENT.wide wiring pin · the s74 L-74c7/c8 state pins · the
s83 Load outline-sm pin · the s123 DIALOG_SUBMIT BLACK-pair pin ·
the s10 INPUT_BASE/CHECKBOX.control/BUTTON_BASE pins · the s30
DIALOG_CLOSE construction pin · the walk53-62 decode freezes):

1. the walk63 decode freeze (the tool's own contract — the one-arm
   OPEN ledger at both axes + the REAL Tab drive + the save/reopen
   round-trips + the phone axis);
2. the Saved-Reports TRIGGER call-site construction freeze (the
   genuine battery gap: the s25 pins hold the wiring regex, never the
   trigger's own construction — the `variant="outline"` + the
   Bookmark glyph + the `Saved Reports ({savedCount})` count form);
3. the Save-Report-Dialog open-interior construction freeze (the
   genuine gap: the s25 pins hold the content words as regexes, never
   the call-site chains — the `mt-1` Input + the htmlFor/id pairing +
   the `grid grid-cols-2 gap-3` checkbox grid + the summary box chain
   + the footer pair + the L-74c8 post-save clear) —
   + THE CURE PINS (RED-first: exactly N RED at birth → the cures →
   GREEN) for every live find the walk decodes.

## WP-4 — Proofs

MUTATION-PROOF (a planted construction regression on a walked
contract → exactly 1 RED → restored → GREEN) · STASH-PROOF (the
round's test block stashed alone → exactly 138/2781 [the s189 ship
state] → restored → 138/2781+N) · the walk re-run stable on the
walked tree.

## WP-5 — Count ladder + docs

2781 → 2781+N (the walk63 pins) · badge 2973 → 2973+N
(count-ladder-190.py: the house assert-first idempotent form, the
s187/s188/s189 lessons applied — the head surgery runs BEFORE the
ladder, no retired-block carrier form in the old-forms) · the
collateral re-anchors (the SKILL §5.6 census checks · the F-106a1
layer-axis pin — the s190 layer live, the s189 demoted beneath it at
2781/192) · the docs lockstep (the AGENTS Session-190 section · the
PAD session-190 inventory row · the CLAUDE page-layout bullet's
walk63 tail · the README Tested row's walk63 clause + the badge ·
the SKILL head surgery [skill-head-190.py, idempotent] ·
session_402.md + this plan's execution record + the worklog entry
[Task ID 190]).

## WP-6 — Captures + the operator asks

- The captures (docs/screenshots/): the round's ours+ref faces (the
  Save-Custom-View dialog OPEN ours+ref at the desktop axis + the
  phone-axis pair) + the standard dev-server page set for the
  operator's record.
- The `.env.example` verified against the codebase contract (the
  six-knob family; committed as-is, included in this round's commit
  per the operator's instruction).
- The sitemap/SEO standing re-verified (smoke check 12: the 200s ·
  the 11 routes + the robots Sitemap line + the per-route OG/Twitter
  factory).
- The mobile-nav comparison: probe:ref TRUE-390 STANDING (the
  reference's own menu button live — this session's probe re-verified
  it) + the drawer battery GREEN carry the verdict — documented in
  the session record.
- The Tailwind v4 state (the bug-watch): every walk delta decoded
  against the standing genus register — the v3-semantics lineage
  (s11/s96/s98/s123/M-92c1/D-187a3) checked at every WP-2 arm.

## The execution checklist (the operator's round-shaped asks)

| Ask | State | The round's evidence |
| --- | --- | --- |
| `.env` DATABASE_URL = `file:../db/custom.db`, db/ at repo root | DONE (fresh intake) | census MATCH at `<repo>/db/custom.db` |
| vitest + playwright suites via the config files | STANDING (verified) | 138/2781 unit + 192/192 e2e this session |
| Sitemap + SEO | STANDING (re-verified) | smoke check 12; the 11-route sitemap + robots + manifest |
| Mobile nav menu parity | STANDING (re-verified) | probe:ref TRUE-390 STANDING (this session's run) |
| Tailwind v4 bug watch | STANDING | the genus register walked against every WP-2 delta |
| `.env.example` matches + in the commit | VERIFIED | the six-knob contract audit |
| Screenshots under docs/screenshots/ | WP-6 | the round's captures |
| Docs alignment | WP-5 | the lockstep ledger |
| Commit + push via the SSH wrapper, main only | FINAL | the dry-run + the push + the remote verify |

---

## The execution record (2026-10-27, session-190)

- **The audit GREEN** — the baseline gate at the shipped s189 state on
  a FRESH CLONE: lint 0/0 · tsc 0 · 138/2781 · build · smoke 14/14 ·
  e2e 192/192 (clean first run, 5.7m) · probe:ref STABLE (46bc2d9c) ·
  census MATCH (15/24/10/23/12 + 4 users) · sitemap 11 routes + robots
  + manifest 200 · the Tailwind v4 state clean · the operator's
  standing asks verified (env/db placement · the vitest/playwright
  configs · sitemap/SEO · mobile-nav · `.env.example`).
- **The rotation adjudication** — probe:ref STABLE kills the
  fresh-bundle candidate; recharts latest 3.10.1 kills the 4.0 gate;
  the s400 close's named candidates adjudicated by the discovery
  (`scripts/discover-190.ts` + the micro-probes): the SAVE-CUSTOM-VIEW
  dialog LIVE on BOTH apps with every censused face byte-equal modulo
  the documented genera; the dashboard follow-up-rows KILLED (the
  reference's zero-data state — 0 checkboxes on Lead Sources + the
  No-upcoming empty state); the activities Completed-tab row actions
  KILLED (the empty panel); the topbar-search gate KILLED again
  (populated=0); the Edit-family re-check still zero-row (suspended);
  the plan landed + validated against the codebase, executed TDD.
- **WP-1 GREEN** — `scripts/walk63-savedreports-dialog-focus-open.ts`
  (Phase A the OPEN dialog census — the trigger resting 1216,113
  192x36 byte-equal both apps + the OPEN root 384,240 672x420 + the
  DFS ledger + the title + the name input [the placeholder + the
  COMPUTED font 14px/400 line 20px byte-equal — the md:text-sm
  class-order genus decoded live via the micro-probe] + the 6-column
  checkbox grid [the vocabulary identical] + the Current-Filters
  summary 409,521 622x46 + the footer Cancel/Save/Close byte-equal +
  the mount-focus the input on BOTH; Phase B the REAL keyboard Tab
  drive through the OPEN dialog — the chain STRUCTURALLY IDENTICAL
  [10 stops: the mount input → 6 checkboxes → Cancel → Close → the
  input wrap; the Save NEVER in the fresh-open chain — disabled
  buttons are not focusable; the post-type drive captures its REAL
  face] + the REAL :focus-visible faces byte-equal on the VISIBLE
  layers; Phase C the interactive arms — the type-flip + the SAVE
  round-trip + the post-save REOPEN [the L-74c8 name-clear byte-equal]
  + the saved-list arm [the Load outline-sm + the bookmark glyph; the
  name + the date identical] + the cancel-then-reopen decode [the
  L-74c7 keep] + the checkbox-toggle ride; Phase D the phone axis —
  the root 0,184 390x476 + the input 16px/400 below md + the footer
  byte-equal); the walk re-run STABLE (the delta report
  byte-identical).
- **WP-2 GREEN — TWO LIVE FINDS CURED**: D-190a1 the six column
  checkboxes' literal id/for construction (the reference's
  REPORT_COLUMNS keys as ids vs our React useId ids; the
  D-114a2/D-187a1 doctrine; the cure: id={col.key} at the call site;
  the re-walk PROVES the id/for ledger deltas GONE) · D-190a2 the
  README Tested row's duplicated walk62 clause (the s189 first-pass
  residue — the clause appended twice with an unbalanced double close,
  shipped undetected; the s29 paren restored + the single clause +
  the D-190a2 clause-unique pin); every remaining delta a documented
  genus (the slot-count · the outline version + both sub-forms +
  the color-carrier sub-form · the s129 white zero-extent slot · the
  M-81c2 token pairs [computed-equal on every face] · the class-order
  genus · the React useId format · the DANGLING aria-describedby genus
  · our aria-hidden svg superset).
- **WP-3 GREEN** — the pin survey first (the s25/s68/s74/s83/s123/s10
  pin families), then the battery: 3 born-green pins in page-layout
  (the walk63 decode freeze · the Saved-Reports trigger call-site
  construction freeze · the Save-Report-Dialog open-interior
  construction freeze) + the D-190a1 CURE PIN (RED-first: exactly 1
  RED at birth → the cure → GREEN) + the D-190a2 CURE PIN in
  docs-counts (RED-first: exactly 1 RED at birth → the cure →
  GREEN).
- **WP-4 GREEN** — MUTATION-PROOF (the planted id={col.key} regression
  → exactly 1 RED → restored → GREEN, no residual) · STASH-PROOF
  (the round's page-layout block stashed → exactly 138/2781 [the s189
  ship state] → restored → 138/2785; the D-190a2 pin's +1 caught at
  the full-suite count lands the TRUE 2786 — the s187/s188 undercount
  lesson repeating as the worklog predicted) · the walk re-run
  STABLE.
- **WP-5 GREEN** — skill-head-190.py ran FIRST (the SKILL v1.187.0,
  the s189 layer demoted at its ship counts 2781/192, the s190 layer
  live, idempotent; the retired s189 ship line PINNED by the
  generalized D-188a1 doctrine's next member in docs-counts) ·
  count-ladder-190.py (2781 → 2786 [+5 — the first pass carried
  +4/2785 before the D-190a2 pin's +1 was caught at the full-suite
  count; the corrected ladder accepts both intermediate forms] ·
  badge 2973 → 2978 [the unit+e2e arithmetic: 2786+192]; assert-first,
  idempotent — the re-run a verified 0-flip no-op) · the docs
  lockstep (the AGENTS Session-190 section · the PAD s190 inventory
  row · the CLAUDE page-layout bullet's walk63 tail · the README
  Tested row's walk63 clause + the D-190a2 cure + the badge ·
  session_402.md + this execution record + the worklog entry [Task
  ID 190]) · the collateral re-anchors (the UNIT constant + the
  F-106a1 layer-axis [the s190 first layer + the s189 second] + the
  retired-s189 ship-line pin + the §5.6 negatives ladder + the
  dialog-geometry-parity collateral pins).
- **WP-6** — the captures (docs/screenshots/: the Save-Custom-View
  dialog OPEN ours+ref at the desktop axis + the phone-axis pair +
  the standard dev-server page set) + the operator asks all verified
  standing.
- **THE VERIFICATION LEDGER** — lint 0/0 · tsc 0 · 138/2786 · build ·
  smoke 14/14 · e2e 192/192 · db census MATCH · probe:ref STABLE ·
  the walk63 dialog arm byte-equal on both axes (post-cure) · the
  REAL Tab chains structurally identical (10 stops both).
- **SHIPPED** — committed on main + pushed via
  `docs/ssh_git_wrapper_v3.py` (the remote verified; no new branches).
