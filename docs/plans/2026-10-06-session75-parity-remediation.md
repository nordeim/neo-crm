# Session-75 Parity Remediation Plan (2026-10-06)

Session 75 on `main` @ `c6888d2` (the s74 ship `52c6891` + the session_143
transcript — docs only, ZERO code drift). The sandbox was RESET — a fresh
clone; the environment rebuilt (bun install 533 pkgs · `.env` with
`DATABASE_URL="file:../db/custom.db"` + the AUTH_SECRET · db:push +
db:seed · the census reading 15/24/10/23/12 + 4 users — MATCH). The
documented intake hazard STANDS (the platform `DATABASE_URL` override
points at a non-existent mirror; all session-75 repo operations run under
`env -u DATABASE_URL`; the e2e suite immune via its own pinned
E2E_DATABASE_URL). Ports 3000/3100 clear. **Baseline gate on HEAD: lint
0/0 (enforced) · tsc 0 · 1397/1397 unit (83 suites)** — the documented
state exact; the `skills/` exclusion verified in all three configs.

## The standing layers (71st session, NO DRIFT)

Drift sweep #71: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 46th
consecutive stable session**. Reference census #71 (agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero (the
KPI values 0/$0.0k/$0.0k/$0k/0%/0); the mobile-nav defect STANDS at a
TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW 390, NO
hamburger); desktop nav normal (256px, 8 links, all visible).

## The audits (three parallel agents [75-c split accounts/contacts after a
context-deadline on the single agent] + the orchestrator's manual
validation of every claim at file:line, the parity claims BUNDLE-DECODED
against the fresh-fetched reference)

**75-a** — the s74 re-audit: **11/11 claims GENUINE** (every S74-P1..P11
fix at file:line; the counts corroborated [83 suites, 1397 its, playwright
--list 129, tsc 0, lint 0/0]; the 52c6891 commit honest [27 files,
+1456/−159, zero strays]). Five nano notes (bookkeeping only): the
export-icon test TITLE says "eight" where the body pins 2+2 and the plan
says four; the P9 "11 sites" maps to no measurable (the pre-fix census
was 24 cells across 10 tables); the P10 ternary-vs-optional-chain form;
the P7 value composes formatCompactCurrency inside the template
(byte-identical output); the commit message's "reports-page 1085" vs the
pre-fix 1084 (off-by-one).

**75-b** — the graduation audit: **ZERO graduations, 13/13 (the 32nd
consecutive)**; the 8 mechanical censuses ALL CLEAN (localStorage exactly
2 live keys [crm_saved_reports + neo-crm.leads.views — the ledger's
`.view` spelling is the known AGENTS abbreviation]; public/ og-image.png
only; API 27 routes/39 handlers all consumed; env parity 3-var exact;
doc anchors at 1397+129 all four carriers exact, badge 1526; zero
commented-out code; TODO/FIXME 0, .skip/.only 0, console.log 0 with the
4 documented exceptions; `new PrismaClient` exactly 2; the e2e-waits
census 5 annotated). One wording nano: the ledger's item-6 should say
"the DASHBOARD header Add" (the accounts page's own "New Account" is
functional in BOTH apps — bundle `onClick:()=>n(!0)`).

**75-c** — the fresh-eyes rotation on the accounts/contacts table-family
seam (the session_142 suggested target — accounts-page 696 +
contacts-page 1010 + account-insights-dialog 228 + contact-detail-panel
244 + the table chrome + the records/vocabularies/routes, never a
dedicated rotation): the foundations SOLID (the accounts table headers/
row template/badge maps/owner cell/empty row/row menu/rail/toolbar/
insights dialog all decode-match; the contacts row template/slide-over/
engagement bars/priority meta/kke wrapper/vocabularies/API pre-gates all
decode-match) — the N-75 family as validated + decoded by the
orchestrator (one audit finding DISMISSED at validation: the contacts
row-menu "align:end" — our MenuContent primitive already defaults
`align = "end"`, the bare consumer IS the aligned construction):

**The accounts half (75-c1):**

- **M-75c1-1 CONFIRMED (bundle-decoded)** — the Overdue Activities KPI
  counts overdue ACTIVITIES (`accounts-page.tsx:126-130`); the
  reference's memo decodes `W=N.filter(te=>te.overdueActivities>0).length`
  — ACCOUNTS with ≥1 overdue activity (`overdueAccounts`), rendered
  `value:M.overdueAccounts`. Diverges live whenever any account carries
  2+ overdue items.
- **L-75c1-2 CONFIRMED (bundle-decoded)** — the KPI sparkbars are
  computed per-industry buckets (the industrySpark/activeSpark/
  revenueSpark memos); the reference's five zv cards ship STATIC 6-value
  chartData literals: Total `[50,60,55,70,65,75]` blue, Active
  `[55,60,58,68,65,72]` green, Key `[40,45,50,55,58,62]` cyan, Revenue
  `[60,65,70,75,78,82]` purple, Overdue `[30,35,40,38,42,45]` red.
- **L-75c1-3 CONFIRMED (bundle-decoded)** — the accounts trailing
  TableHead is `w-10` (:395); the bundle's `$t,{className:"w-12"}` (the
  leads table already ships w-12 — its :553 pin stands).
- **N-75c1-4 CONFIRMED (bundle-decoded)** — the health badge fallback is
  the Healthy GREEN map; the reference's terminal is
  `||"bg-gray-100 text-gray-800"` (gray).
- **N-75c1-5 CONFIRMED (zero consumers)** — the accounts GET `_count`
  include (contacts/leads/activities) is dead payload (the page + dialog
  count from the store's arrays client-side; only the reports route's
  own _count is consumed).
- **N-75c1-6 CONFIRMED (bundle-decoded)** — the create route stamps
  `lastActivityAt: new Date()` (:102); the reference's bce create form
  ships NO last-activity field — a fresh reference account renders "No
  activity", ours renders today.
- **STANDING (unresolvable at zero data)** — the insights dialog's stat
  card icons (Users/Phone/Users): the bundle's Wc/op/q0 aliases are
  chunk imports with no displayName in the cached bundle; the layout/
  colors/typography decode-match; ours keeps the s28-era decode.

**The contacts half (75-c2):**

- **M-75c2-1 CONFIRMED (bundle-decoded)** — the Name header is a DEAD
  affordance on ours (:454, with a stale s6 comment asserting the dead
  mirror); the reference's th decodes `onClick:()=>te("name")` + the
  inner `div.flex items-center gap-1 hover:text-blue-600
  transition-colors` + the directional chevron ONLY when active.
- **M-75c2-2 CONFIRMED (bundle-decoded)** — the Filters button stays
  `variant="outline"` (:424-428); the reference decodes
  `variant:x?"default":"outline"` — the filled state while the panel is
  open.
- **M-75c2-3 CONFIRMED (bundle-decoded)** — the kke panel is missing the
  SIXTH group: "Engagement Level" (the panel order Role/Priority/
  Activity Status/Company Size/Source/**Engagement Level** — the last
  position), `["High","Medium","Low"]` with the `engagement-${i}` ids +
  the filter clause `engagementLevels.length>0 &&
  !engagementLevels.includes(le.engagement_level)`.
- **M-75c2-4 CONFIRMED (bundle-decoded)** — the four stat cards derive
  from the FULL contacts array; the reference's G memo derives from F
  (the FILTERED memo): `total: F.length`, `thisMonth: F.filter(created
  after startOf month)`, `decisionMakers: F.filter(role === "Decision
  Maker" || role === "Key Contact")` (ours counts "Key Contact" ONLY),
  `noActivity: F.filter(last_activity_date ? diff >= 30 : true)`.
- **M-75c2-5 CONFIRMED (bundle-decoded)** — the table empty state is the
  plain TableEmptyRow text; the reference decodes the rich stack: the
  `RB` icon `w-12 h-12 text-gray-300` + `span.font-medium "No contacts
  found"` + `span.text-sm "Try adjusting your search or filters"` inside
  the `py-12 text-center text-gray-500` cell.
- **M-75c2-6 CONFIRMED (API-decoded)** — the filter checkboxes are
  native `<input type="checkbox">` elements (all 6 groups after M-3);
  the reference's `us` primitive carries `checked` + `onCheckedChange`
  (the Radix-style Checkbox — the styled square, not the OS-native box).
- **L-75c2-7 CONFIRMED (bundle-decoded — the Rx component)** — the
  contacts stat card: ours `flex items-center justify-between gap-3` +
  `min-w-0` left + `text-muted` label + `mb-2 mt-2` value + the 40px
  IconChip with a 20px icon; the reference `flex items-start
  justify-between` (NO gap) + `flex-1` left + `text-sm font-medium
  text-gray-600 mb-2` label + `text-3xl font-bold text-gray-900 mb-2`
  value + the `p-3 rounded-lg` chip (48px) with the `w-6 h-6 text-white`
  icon (24px) + the up/down trend row (green/red).
- **L-75c2-8 CONFIRMED (bundle-decoded)** — the Last Activity header:
  ours an inner `<button>` with the ArrowUpDown fallback (:457-466); the
  reference puts `cursor-pointer` + the onClick on the TH itself with the
  inner `div.flex items-center gap-1 hover:text-blue-600
  transition-colors` and the chevron ONLY when active.
- **L-75c2-9 CONFIRMED (bundle-decoded)** — the mobile empty state adds
  `text-sm` (:644); the reference's p is the bare
  `text-center text-gray-500 py-8`.
- **N-75c2-10 CONFIRMED (bundle-decoded)** — the contacts "Actions"
  header adds `w-10` (:470); the reference's th carries ONLY
  `font-semibold text-gray-700`.
- **N-75c2-11 CONFIRMED (bundle-decoded)** — the search scope includes
  `position` (:148); the reference matches `le.name||le.email||le.company`
  only.
- **N-75c2-12 CONFIRMED (bundle-decoded)** — the sort's null
  last-activity fallback is `?? a.createdAt` (:167-168); the reference's
  comparator reads the epoch terminal for nulls (a stale-but-recently-
  created row sorts NEW on ours, OLD on the reference).
- **N-75c2-13 CONFIRMED (zero reads)** — the dead `const ve =
  c.priority === "Key"` in the mobile-card map (:647).
- **N-75c2-14 CONFIRMED** — the scanFile is never reset when the Scan
  dialog closes — a stale "Selected:" line on reopen.
- **N-75c2-15** — the "New This Month" predicate runs twice (value +
  trend) — hoist to one variable.

**The standing e2e gaps (the session_142/143 suggestion):** the
settings/users surface smoke + the calendar month-boundary math (the
S54-P6 trailing-cell round-trip exists; the gap is the year-rollover
title math + the users-list surface).

## The operator decisions

The **CSV formula-injection posture (b) STANDS** (the 34th
re-affirmation — the guard intact in both export families
[guardFormulaPrefix at csv.ts:31-33 applied in escapeCell AND imported
into entity-export.ts, the 75-b re-verification], the `-` exclusion
documented + pinned, the reference bundle byte-stable for the 46th
consecutive session; the 75-c rotations re-decoded the family's export
surfaces fresh — the contacts page-level export is the documented
client-side toQuotedCsv guarded superset, no new unguarded builders
found; no new evidence moves the (a) parity / (c) full-OWASP
alternatives).

The **source-vocabulary documented parity STANDS AND EXTENDS to the
accounts/contacts table-family seam** (the 75-b census re-confirmed
every anchor at file:line; the M-75c2-4 fix EXTENDS the role vocabulary
— "Top Decision Makers" gains the reference's both-roles basis
[Decision Maker OR Key Contact — the CONTACT_ROLES wire values stay
raw]; the M-75c1-1 fix re-derives the Overdue KPI from the same raw
activity vocabulary; the tier/status/health/priority/source vocabularies
re-verified byte-identical to the bundle in this rotation — the 75-c
foundations list).

## The remediation set (TDD — RED first, then GREEN)

- **S75-P1 (M-75c1-1)** — the Overdue Activities KPI counts DISTINCT
  ACCOUNTS with ≥1 overdue scheduled activity (the Set-of-accountIds
  size; null accountIds excluded); the KPI card + its static bars land
  with P2.
- **S75-P2 (L-75c1-2)** — the five KPI sparkbars go the reference's
  STATIC 6-value literals ([50,60,55,70,65,75] / [55,60,58,68,65,72] /
  [40,45,50,55,58,62] / [60,65,70,75,78,82] / [30,35,40,38,42,45]); the
  industrySpark/activeSpark/revenueSpark memos + the industries memo
  (if zero consumers remain) retire.
- **S75-P3 (L-75c1-3 + N-75c2-10)** — the accounts trailing TableHead
  `w-10` → `w-12`; the contacts "Actions" header drops the `w-10`.
- **S75-P4 (N-75c1-4)** — the health badge fallback goes the reference's
  gray terminal `"bg-gray-100 text-gray-800"`.
- **S75-P5 (N-75c1-5/6)** — the accounts route hygiene: the GET's
  `_count` include retires (+ the type's optional field); the create
  route's `lastActivityAt: new Date()` stamp retires (fresh accounts
  render "No activity" like the reference).
- **S75-P6 (M-75c2-1 + L-75c2-8 + N-75c2-12)** — the sortable headers:
  the Name th gains the LIVE onClick + the inner
  `flex items-center gap-1 hover:text-blue-600 transition-colors` div +
  the active-only chevron (the stale s6 dead-affordance comment
  re-anchored); the Last Activity th carries `cursor-pointer` + the
  onClick directly (the inner button + the ArrowUpDown fallback retire,
  the same inner-div family); the null-activity sort fallback goes 0
  (the epoch terminal).
- **S75-P7 (M-75c2-2)** — the Filters button flips
  `variant={showFilters ? "default" : "outline"}`.
- **S75-P8 (M-75c2-3 + M-75c2-6)** — the kke panel: the Engagement
  Level group arrives as the SIXTH/last card (High/Medium/Low, the
  `engagement-${i}` ids) + the `engagementLevels` state + the filter
  clause + the clearFilters extension; ALL the panel's checkboxes swap
  to the kit's Checkbox primitive (checked + onCheckedChange, the
  paired htmlFor Label).
- **S75-P9 (M-75c2-4 + L-75c2-7 + N-75c2-15)** — the contacts stat
  cards: all four derive from `filtered`; "Top Decision Makers" counts
  BOTH roles; the IconStatCard contacts arm re-derives to the Rx
  construction (items-start wrapper, flex-1 left, the gray-600 label +
  gray-900 value with mb-2, the 48px p-3 chip with the 24px white icon);
  the thisMonth predicate hoists.
- **S75-P10 (M-75c2-5 + L-75c2-9)** — the empty states: the table empty
  cell renders the rich stack (the UsersRound-class icon w-12 h-12
  text-gray-300 + the font-medium line + the text-sm hint); the mobile
  empty p drops text-sm.
- **S75-P11 (N-75c2-11/13/14)** — the contacts hygiene: the search scope
  drops `position`; the dead mobile-card `ve` retires; the scanFile
  resets when the Scan dialog closes.
- **S75-P12 (N-75a-1)** — the s74 export-icon test title re-anchor
  ("eight" → the four per-table buttons).
- **S75-P13 (the coverage closures — two NEW e2e checks)** — (a) the
  **settings/users surface smoke**: /settings renders its tab strip +
  the Data tab's export family, AND the accounts rail's Owner select
  lists the seeded users (the /api/users round-trip through the store
  slice — the users surface's first e2e); (b) the **calendar
  month-boundary math**: from the current view, Next hops to the
  December→January rollover asserting the `MONTH YYYY` title at each hop
  (the year increments — the boundary math the formatMonthYear cursor
  owns). 129 → 131.

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: `tests/contact-surfaces.test.ts:
153-164` (the checkbox-groups it gains the Engagement Level group +
survives the primitive swap — the structure pins ride the constants
maps, unaffected) and `:175-180` (the "Top Decision Makers counts role
=== Key Contact" it re-anchors to the both-roles form). The
account-surfaces row-level pins SURVIVE (the w-10 pin at :59-61 is the
AVATAR box, not the trailing header). No pins on: the spark arrays, the
overdue KPI derivation, the health fallback, the _count include, the
create stamp, the Name sort wiring, the Filters variant, the stat-card
wrapper, the empty states, the search scope, the scanFile. The e2e
S28-P5 panel test survives (getByText anchors); the S28-P6 insights
test survives (row-click + dialog anchors); the s54 calendar round-trip
survives (its own monthTitle helper is the same formatMonthYear family
the new boundary check reads). The dch guards auto-scan (no new records
needed — the fixes ride existing constants). The type's optional
`_count` field retirement is consumer-safe (zero reads verified). The
Checkbox primitive exists in the kit (the accounts tier filters +
settings surfaces already consume it — the stock construction).

## The execution record (2026-10-06, session-75)

EXECUTED AS PLANNED with TWO mid-flight test-shape repairs (both
caught by the RED runs themselves, both on the NEW pins, none
post-ship) + ONE mid-flight e2e repair (on the NEW test): (1) the
both-roles pin matched through its own LABEL ("Top Decision Makers"
contains "Decision Maker") — tightened to the value block after the
label; (2) the Name-th/Engagement-group/scanFile anchors re-scoped to
stable literals (`>Name<` does not exist in JSX-text form; the quoted
`"Engagement Level"` likewise; the scanFile anchor moved from the
state declaration to `open={scanOpen}`); (3) the settings/users e2e's
Owner-select locator — the trigger carries NO accessible name (the
rail's Label is not htmlFor-linked), re-scoped to the rail-scoped
`.w-80` combobox (the s73 rail-locator convention). RED: **23 failed
exactly** (the account-contacts-parity suite's 20 + the
contact-surfaces checkbox-groups + both-roles re-anchors + the
stat-value-contract Rx re-anchor — the s68 bare-form pin re-anchored
in lockstep: the fresh Rx decode ships the explicit gray-900 + mb-2,
pre-dated by the s68 census). GREEN: S75-P1..P12 all landed (P1 the
distinct-accountId Set; P2 the five static literals + the three memos
retired [the industries memo STAYS — the rail's Industry select];
P3 the w-12/w-10-free pair; P4 the gray terminal; P5 the _count +
stamp retirements; P6 the LIVE Name sort + the th-direct Last
Activity + the epoch-0 fallback; P7 the variant flip; P8 the SIXTH
group + the Checkbox primitive swap [the `text-sm font-normal
cursor-pointer` labels, byte-exact]; P9 the filtered basis + the
both-roles union + the Rx construction [the IconChip helper RETIRED
with its last consumer — the dch policy]; P10 the rich CircleUser
stack + the bare mobile p; P11 the hygiene trio; P12 the title
re-anchor); P13 the two e2e closures. Non-vacuousness: 23 failed |
26 passed in the pre-fix c6888d2 worktree (node_modules hard-linked
via cp -al, only the modified test files); clean teardown. Full
gate: lint 0/0 · tsc 0 · **1417/1417 unit (84 suites, +20)** ·
build clean · **131/131 e2e on a fresh CI=1 boot (3.1m, all 9
mobile-nav checks green)**. LIVE: the overdue KPI at 4 =
distinct-accounts (cross-checked against the table's four
red-bordered rows); the six static bars ×5 cards; the Name sort
round-trip with the active-only chevron; the Filters flip computing
#2563eb; the SIX groups with 20 button-role checkboxes (zero
native); the engagement filter round-trip (15 → 5 rows + the stat
cards re-deriving 5/5/2/1 from the FILTERED set); the rich empty
state; the Rx anatomy computed (48px chip / 24px icon / gray-600
label / gray-900 value); the drawer at TRUE 390px with focus
restored; zero overflow on all routes; NO Tailwind v4 bug; the
closing census MATCH; the VLM's three flags run down (the
below-the-fold panel scroll + the two pinned constructions + the
DOM-measured 12px "overlap" gap). Docs: SKILL v1.72.0 (§16bo +
project_state, 6781 → 6859, via the assert-first
scripts/skill_edits_s75.py at the sandbox root) + README/AGENTS/
CLAUDE/PAD at 1417+131 (badge 1548) + session_144.md + this record
+ the repo worklog; .env/.env.example verified (no env surface
change). Estimate drift: +20 its exact (the new suite) · 131 e2e
exact · the e2e-waits census unchanged at 5 (the new tests ride
role/text locators + toHaveText polling, zero new sleeps).
