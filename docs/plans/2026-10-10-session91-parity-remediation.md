# Session-91 Parity Remediation Plan (2026-10-10)

Session 91 on `main` @ `17e34cd` (the s90 ship `3a89508` + the two
operator-added log commits `3060b04`/`17e34cd` — `session_180.md` the
process narrative + `session_181.md` the operator-added raw log). The
workspace was RESET at session start — a fresh clone, the environment
rebuilt (`bun install`, `.env` written with
`DATABASE_URL="file:../db/custom.db"` + a fresh AUTH_SECRET, `db:push`
+ `db:seed`, census MATCH 15/24/10/23/12 + 4 users). The platform
`DATABASE_URL` override hazard STANDS — all session-91 repo operations
run under `env -u DATABASE_URL`.

**Baseline gate on HEAD: lint 0/0 · tsc 0 · 1788/1788 unit (99 suites,
re-run live) · build + e2e deferred to the post-fix gate** (the
one-gate discipline; both audit subagents re-ran the full unit suite
live at HEAD: 99 files / 1788/1788 green).

## The standing layers (87th session, NO APP DRIFT)

Drift sweep #87: the APP bundle re-fetched fresh from the reference
(post-login) and served byte-identical — `/assets/index-DZ-xbrIm.js`
1,631,071 bytes md5 `a70a637fcf1d4291da8e0d965676dc11` exact + the
stylesheet `index-Be9epoFc.css` 79,581 bytes exact — **the 62nd
consecutive stable session**. Reference census #87 (agent-browser,
live login + a TRUE 390px viewport): the demo data still zero (the
$0.0k KPI family); the mobile-nav defect STANDS at a TRUE 390px
(vw=390, nav w=0, 8 links in DOM, 0 visible, no menu button — the
12th consecutive census); desktop nav normal (256px, 8 links). Our
mobile drawer stays the deliberate documented superset (the LIVE
battery re-verifies post-fix). Scandihaven re-verified as the
tech-stack-patterns reference (fresh clone @ `d4789c3`, up to date;
the same Next.js 16 + React 19 + Tailwind v4 CSS-first family — no
new patterns to adopt).

## The audits (two parallel subagents + the orchestrator's own rotation)

**91-a** — the s90 re-audit: **13/13 checklist items GENUINE, ZERO
material findings** (every s90 fix verified at exact file:line: the
M-90c1 calendar gray-900 at page-parts.tsx:657; the M-90c2 reports
gray-900 :544; the Card > CardContent splits :302/:535/:649 with zero
merged-padding survivors; the BAR_BG_GM/BAR_BG_ZV per-arm class maps
:224-241 with height-only inline styles; the TREND_CHIP/REPORT_CHIP
color-KEY chip pairs :472/:601 with the direct-icon mechanism; the
DeltaBadgeText direction-keyed row :126-131; the N-90c7-c10 nanos;
the @theme red-400/purple-400 extension globals.css:239/:247; the
README/stat-value-contract nanos; the CHART_COLORS -400 retirement +
the ActivityStatCard wrapper retirement). The live re-runs:
statcard-family-parity **30/30**, the 5 re-anchored suites **123/123**,
the full unit gate **99/1788**, the screenshots 124/125/126 present.
The **count-in-comment genus guard re-run** (the s90 suggested next):
**5 drift nanos + 2 borderline** — G-91a1
(tests/stat-value-contract.test.ts:10-13 the file header still claims
the "BARE at every surface" census the file's own pins retired);
G-91a2 (tests/reports-filter-parity.test.ts:49-51 the header still
asserts the s69/s70 "bare form = standing decision" premise the
M-90c2 it retired); G-91a3
(tests/dead-code-hygiene.test.ts:556 the stale "live read set:
red/gray/violet/emerald + the -400 family" parenthetical — gray +
the -400s retired at L-90c4); G-91a4
(src/lib/page-layout.ts:1453-1454 the ACTIVITY_KPI_STATICS comment
cites the retired CHART_COLORS.gray key — the live mechanism is
BAR_BG_GM_ELSE "bg-gray-400" → @theme --color-gray-400);
G-91a5 (Project_Architecture_Document.md:776 the s90 inventory row
says "+ **8** files re-anchored" then lists NINE); B-1
(page-layout.ts:339-340 "the four surviving stat-card components"
naming only 3 of ours — defensible as the four reference identities,
re-worded); B-2 (tests/constants.test.ts:50-52 the palette prose
omits bg-gray-400 from the -400 enumeration + calls the Sales Target
two-tone "bg-amber-400 + bg-blue-500" though it rides the inline-hex
colorFor — the enumeration re-derived).

**91-b** — the graduation audit: **ZERO graduations, 13/13 (the 48th
consecutive)** — every standing-ledger rationale verified UNCHANGED at
HEAD (the mobile-drawer superset at 9 e2e checks; the dashboard
search/Add supersets; the s32 topbar search; the accounts
Owner/Industry live filters; the dead-default parity pair; the
emptyLabel mechanism; the dead SelectValue placeholder family; the
lucide svg superset; the partial-import conflation; the 5 e2e sleeps;
the CSV `-` exclusion; the defaultTier editor; the dead trend-row
mechanism). The 8 mechanical censuses **8/8 CLEAN** (the localStorage
2-key set crm_saved_reports + neo-crm.leads.views; public/ og-image
only; the 19+11 deps; the 27-route/39-handler API census; the 3-var
env parity; the doc anchors at 1788+132/1920/v1.87.0; zero
commented-out code; the 5 annotated e2e sleeps + the mobile-nav suite
at 9). Both operator decisions' evidence INTACT.

**91-c** — the fresh-eyes rotation on the **FULL-APP SCREENSHOT DIFF
AGAINST THE REFERENCE** (the first-listed suggested next per
session_179.md, executed as the strong sweep): both apps driven to the
ZERO-DATA state (the reference's own standing state — its demo
workspace has been empty for 12 consecutive censuses; our side matched
via the session-scoped `scripts/zero-data.ts`: the 7 domain tables
cleared INCLUDING `opportunity` — the first pass missed it and the
dashboard still computed $337.0k from the 12 seeded opportunities; the
users + the Setting singleton kept), 9 pages captured per app at
1440×900 with an h1-wait, pairwise pixel diff (per-channel tolerance
12) + cluster analysis + DOM probes on BOTH apps.

**The zero-data diff results**: accounts **0.00%** · reports **0.00%**
· calendar **0.01%** · activities **0.01%** (four pages
byte-clean-to-noise — the strongest validation yet of the 90-session
parity program) · contacts **0.51%** (the empty-state DOM
byte-identical: the `flex flex-col items-center gap-2` >
circle-user/No contacts found/Try adjusting triple at identical
boxes; the residue = antialiasing noise + the lucide aria-hidden
superset) · dashboard **0.33%** (a 2px zero-area chart-baseline
artifact inside the Revenue Over Time area — both axis ticks and
geometry identical; library-internal at the zero-data state,
documented, not actionable on the pinned recharts stack) · settings
**4.73%** (THE PICKLIST-DATA GENUS — the reference's picklists were
wiped with its workspace: "No items yet" ×5; ours render the seeded
vocabularies; our own empty-picklist form IS mirrored —
settings-page.tsx:121 the SETTINGS_PICKLIST.empty "No items yet"
branch — this is the same standing genus as the domain-table data, no
fix) · profile **2.08%** · leads **2.17%** — the two REAL finds, plus
the bundle decode surfacing the edit-dialog + import-dialog arms of
the same root cause.

**The N-91 family (2 M + 2 L + the genus sweep + the 7 audit nanos) —
ALL ONE ROOT CAUSE: the v4 space-y semantics.** v3 compiles
`space-y-N` as `margin-top` on FOLLOWING siblings through the
`.space-y-N > :not([hidden]) ~ :not([hidden])` selector at specificity
(0,3,0) with a `margin-bottom: calc(N * --tw-space-y-reverse)` sidecar;
v4 compiles it as `margin-bottom` on NON-LAST children inside
`:where(& > :not(:last-child))` — ZERO specificity. The two semantics
compute IDENTICAL gaps for plain block stacks, and diverge exactly
when (a) a non-last child is INLINE (vertical margins are ignored on
inline boxes — every shadcn `<Label>` is `display: inline`), or (b) a
non-first child carries its own `mb-*` class (v3's (0,3,0) rule kills
it; v4's :where preserves it):

- **M-91c1 — THE PROFILE FORM'S COLLAPSED LABEL→CONTROL GAPS ×4.**
  The reference's Personal Information form (bundle @1177642, the
  `space-y-6` > four `space-y-2` groups) renders a 12px label→control
  gap on every group (the v3 input margin-top 8px + the 4px inline
  label strut); OURS collapses to 4px (the v4 label margin-bottom
  8px is IGNORED on the inline label). The form renders 32px shorter
  (472 vs 504px). LIVE-measured on both apps: ref label
  mb=0/input mt=8px vs ours label mb=8px-ignored/input mt=0; both
  labels `display: inline`; the four groups = Profile Picture (the
  avatar row), Full Name, Email (+ the hint p), Role. The s14/s15
  sessions fixed this exact genus on the dialogs (DIALOG_GROUP
  `controlMt: "mt-2"`) and the settings defaults
  (SETTINGS_DEFAULTS.controlMt) — the profile arm was never walked.
- **M-91c2 — THE LEADS TOOLBAR'S LIVE mb-4.** The reference's filters
  row (`flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4`, the Gke
  component) carries `mb-4` but it computes **0px** — v3's space-y-4
  rule at (0,3,0) forces `margin-bottom: calc(1rem × 0)`, killing the
  (0,1,0) `.mb-4`. OURS keeps it alive (v4's :where() never touches
  the last child) → 16px extra below the filters row → the toolbar
  137px vs 121px → the whole leads table starts 16px lower and the
  card renders 262px vs 246px. LIVE-measured on both apps (ref row2
  mb=0, ours row2 mb=16px). The s11 house rule anticipated the genus:
  "re-derive from the reference's COMPUTED gap, never copy the class
  string."
- **L-91c3 — THE EDIT-DIALOG GROUPS (space-y-2 vs the reference's
  BARE).** The reference's wce/Mke/Edit-Leal edit dialogs render
  their field groups as BARE unclassed divs — `label + control` as
  direct children, the 4px inline-strut gap, NO space-y (bundle:
  `c.jsxs("div",{children:[nt-label, Ct-input]})` — the exact
  DIALOG_BARE_GROUP form the s15 decode documented for the
  Event/Activity dialogs but never re-derived for the EDIT family).
  OURS ships `space-y-2` groups (entity-edit-dialog.tsx:274) —
  computing 4px ONLY through the v4 accident (the ignored label
  margin). Class-string divergence + the geometry riding a bug.
- **L-91c4 — THE IMPORT DIALOG'S SELECT FILE GROUP.** The reference's
  Import Contacts dialog (bundle @1027804): `space-y-2` > [Label
  "Select File", the dropzone div] → a 12px gap; OURS
  (contacts-page.tsx:863) ships the same classes → 4px under v4.
- **N-91c5 — THE GENUS SWEEP (complete).** All 99 `space-y-*` usages
  in src/ swept for the two sub-genera: the other table toolbars
  carry no space-y (accounts `p-4 border-b` bare, contacts `flex
  gap-3`, activities `p-4 border-b` bare); the create dialogs +
  settings defaults carry the s14/s15 controlMt fix; the calendar
  rail + save-report section labels are `block` (margins apply); the
  checkbox stacks are block rows. **The 4 finds are the complete
  set.**
- **The standing states documented (no fix):** the settings picklist
  data genus (above); the SortHead `th > button` (the S29-P2
  accessible superset — the reference puts the onClick on the th with
  a bare div inside); the 2px zero-area chart artifact.

## The operator decisions (51st re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 91-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied
in `escapeCell` AND imported into entity-export.ts's `qq` (:24/:43);
the full call-site census re-verified live (settings ×7 — 4 guarded
builders + the 3 static templates, the documented outside-the-guard
exception; dashboard ×4; accounts/contacts/leads ×1 each; reports ×2;
api/export ×1 — ZERO unguarded live-data builders; this session
touches no CSV surface). The **source-vocabulary documented parity
STANDS** — every anchor re-confirmed at file:line by 91-b (the 7
*_META maps + the raw-slug vocab arrays byte-stable; the
`git diff d7487ad..HEAD -- src/lib/constants.ts` delta is 100%
non-vocabulary — the s90 CHART_COLORS dead-key retirement only; this
session introduces no vocabularies).

## The remediation set (TDD — RED first, then GREEN)

- **S91-P0 (M-91c1 — the profile form's controlMt ×4)** in
  src/app/(app)/profile/profile-page.tsx + src/lib/page-layout.ts: a
  new `PROFILE_LAYOUT.controlMt: "mt-2"` token (the DIALOG_GROUP /
  SETTINGS_DEFAULTS precedent, carrying the s14-hazard documentation)
  applied to the four controls: the avatar-row wrapper div, the Full
  Name Input, the Email Input, the Role Input. Computed: every
  label→control gap 4→12px; the Email input→hint gap stays 8px (the
  v4 space-y margin-bottom on the block input — equal to the
  reference's v3 margin-top on the hint); the form grows 32px to 504.
  The `pt-4` submit group is untouched (block-block, semantics-equal).
- **S91-P1 (M-91c2 — the leads filters row's dead mb-4)** in
  src/app/(app)/leads/leads-page.tsx: the filters row's `mb-4`
  retires — the row class becomes `flex flex-col gap-2 sm:flex-row
  sm:gap-4` + the comment citing the v3 (0,3,0) space-y kill (the
  computed-geometry mirror per the s11 rule; the toolbar 137→121px,
  the table 16px up, the card 262→246px).
- **S91-P2 (L-91c3 — the edit dialogs' BARE groups)** in
  src/components/shared/entity-edit-dialog.tsx: the field groups drop
  `space-y-2` → bare unclassed divs (the reference's own wce/Mke
  construction; the 4px gap becomes construction-guaranteed, not
  bug-dependent). The form's `space-y-4` + the per-row grids are
  untouched (computed-equal: gap-4 ≡ space-y-4 at 16px).
- **S91-P3 (L-91c4 — the import dialog's Select File group)** in
  src/app/(app)/contacts/contacts-page.tsx: the dropzone wrapper div
  gains `mt-2` (the controlMt precedent; the gap 4→12px).
- **S91-P4 (the audit nanos)**: G-91a1 the stat-value-contract
  header re-derived (the bare/explicit census); G-91a2 the
  reports-filter-parity header re-derived (the misdecode premise
  retired); G-91a3 the dead-code-hygiene parenthetical re-derived
  (red/violet/emerald); G-91a4 the page-layout ACTIVITY_KPI_STATICS
  comment re-derived (BAR_BG_GM_ELSE → --color-gray-400); G-91a5 the
  PAD "+8 files" → "+9"; B-1 the "four surviving components" wording
  clarified (the four reference identities gm/zv/Mx/ay across our
  three); B-2 the constants.test palette prose re-derived (the
  complete -400 enumeration incl. bg-gray-400 + the inline-hex
  two-tone).
- **S91-P5 (the tests — RED first)** — the NEW
  `tests/spacey-hazard-parity.test.ts`: the profile-form pins (the
  controlMt on all 4 controls + the PROFILE_LAYOUT.controlMt token +
  the no-raw-space-y-control negative — no control inside a
  profile space-y-2 group without mt-2); the leads-toolbar pins (the
  filters row WITHOUT mb-4 + the mb-4-absent negative + the comment
  citing the v3 kill); the edit-dialog pins (the BARE field groups +
  the no-space-y-2 negative); the import-dialog pin (the mt-2
  dropzone wrapper); the genus-census pins (the known-clean surfaces:
  the create dialogs + settings defaults carry controlMt, the rail +
  save-report labels are block). Plus the LOCKSTEP re-anchors:
  profile-family-parity (the form-group construction re-anchor),
  entity-edit-dialog (the group-class re-anchor), import-dialog (the
  Select File group re-anchor), leads-family-parity (the toolbar
  re-anchor if pinned), + the 5 genus-nano re-derivations
  (stat-value-contract + reports-filter-parity headers,
  dead-code-hygiene parenthetical, constants prose — the
  needle-in-own-docs pins).
- **S91-P6 (the docs)** — SKILL v1.88.0 (§16ce + project_state + the
  H1, via the assert-first scripts/skill_edits_s91.py at the sandbox
  root) + README badge + the suite list + AGENTS/CLAUDE/PAD at the
  new counts (+ the PAD s91 inventory row + the Total + the footnote +
  the G-91a5 fix) + session_182.md + this plan's execution record +
  the repo worklog.
- **S91-P7 (the LIVE battery + the screenshots + the re-diff)** —
  restore the seed (census MATCH); the fixed dev server probed
  side-by-side with the reference: the profile label→control gaps
  12px (was 4px) + the form 504px; the leads toolbar 121px + the
  table at y≈496 + the card 246px; the edit-dialog groups 4px (the
  bare construction, opened on a seeded row); the import dialog 12px;
  the 390px drawer battery; the closing census MATCH + the reference
  md5-exact re-fetch. THEN the zero-data re-diff sweep: re-zero via
  scripts/zero-data.ts, re-capture both apps' profile + leads (+ the
  7 other pages for the census), re-diff — profile 2.08% → ~0 and
  leads 2.17% → ~0 expected (the strongest possible verification);
  re-seed + census MATCH to close. Screenshots 127 (the profile
  Personal Information card post-fix) + 128 (the leads table + the
  toolbar post-fix) + 129 (the zero-diff side-by-side pair or the
  mobile drawer at 390) NEW under `docs/screenshots/`, VLM-verified
  per the house protocol.

No new e2e: every fix surface is a class-string/spacing change (the
e2e selectors are role/text/testid — no spacing assertions; the
SortHead button stays; the edit/import dialog texts unchanged; the
mobile-nav suite untouched). The unit pins + the LIVE DOM-census
battery + the re-diff sweep cover the family (the s78–s90 precedent
for structural rotations).

## Blast radius (pre-checked)

The component changes touch profile-page.tsx (+ the PROFILE_LAYOUT
token), leads-page.tsx (one class), entity-edit-dialog.tsx (the group
divs), contacts-page.tsx (one class). The locked pins re-anchoring:
profile-family-parity (the form pins), entity-edit-dialog (the group
pins), import-dialog (the Select File pins), leads-family-parity
(the toolbar pins if any). The surviving pins verified: the
PROFILE_LAYOUT token pins (uploadBtn/saveBtn/avatarIcon/etc.
untouched), the leads-family SORTABLE_HEADER + inline-row + popover
pins (untouched), the entity-edit-dialog field-set pins (labels only,
untouched), the import-dialog copy/dropzone/columns pins (untouched),
the DIALOG_GROUP/SETTINGS_DEFAULTS controlMt pins (untouched — the
precedent this session extends), the login-card space-y ladders
(s26/s80-pinned — the login's groups are block-children forms,
semantics-equal, untouched), the e2e family (text/role selectors
only — zero blast, pre-checked).

## The execution record (2026-10-10, session-91)

EXECUTED AS PLANNED. RED: the new suite's 13 its split **9 failed |
4 passed** — the full-suite proof **9 failed | 1792 passed (1801
total)** — exactly the modified pin set, ZERO collateral, RE-PROVEN
via the src stash after the 5 mid-flight pin-shape repairs (the
cn()/controlMt-token forms ×2 — the pins originally asserted the
literal "mt-2"; the needle-in-own-docs comment-strip — the
retirement comment legitimately names "space-y-2", the assertions
now scan code-only per the s88/s90 lesson; the comment-window width
700→1200; the foundation anchor). GREEN: S91-P0 the
PROFILE_LAYOUT.controlMt token + the 4 applications; S91-P1 the
leads filters-row mb-4 retirement + the M-91c2 comment; S91-P2 the
edit-dialog BARE groups; S91-P3 the import dialog's mt-2 dropzone
wrapper; S91-P4 the 7 audit nanos (the two test headers, the
hygiene parenthetical, the page-layout comment + the B-1 wording,
the PAD 8→9, the constants enumeration); S91-P5 the suite; S91-P6
the docs at SKILL v1.88.0/README 1933/AGENTS+CLAUDE+PAD 1801+132
(via the assert-first scripts/skill_edits_s91.py — one anchor
repair mid-flight: §16cd proved to be the file's LAST section, §16ce
appends); S91-P7 the LIVE battery + the re-diff + the screenshots.
GATE: lint 0/0 · tsc 0 · **1801/1801 unit (100 suites, +13 net)** ·
build clean · **132/132 e2e fresh CI=1 (3.2m on the re-run; the
known settings-debounce focus flake on the first run passed
standalone AND on the full re-run — untouched by this session's
delta; the mobile-nav suite green inside the run)**. LIVE (both
apps probed): the profile gap **12px** + the form **504px** (was
4px/472); the leads toolbar **121px** + the row mb **0px** + the
table at **y496** (was 137px/16px/y512); the Edit Contact groups
**(BARE)** at **4px**; the import gap **12px**; the drawer battery
at TRUE 390px green; **THE ZERO-DATA RE-DIFF: leads 2.17% → 0.00% +
profile 2.08% → 0.00% — both pages BYTE-CLEAN** (accounts/reports
0.00% + calendar/activities 0.01% standing; contacts 0.51% noise;
dashboard 0.30% the chart artifact; settings 4.73% the picklist
genus); the closing census MATCH + the reference md5-exact
re-fetched (the 62nd consecutive stable session). Screenshots
127 + 128 + 129 NEW (VLM 5/5 + 5/5 + 5/5 — zero adjudications).
Estimate drift: +13 net its exact (no re-anchor-side additions — no
existing pins collided, verified pre-RED) · 132 e2e exact · the
census unchanged.
