Session 75 — the accounts/contacts table-family session
(docs/session_142.md + docs/session_143.md, the s74 records; the
operator's brief = the standing cycle + this session's explicit
instructions: refresh the workspace from the remote, review the five
core docs + the four session records [session_142.md, the session74
plan, worklog.md, session_143.md], validate against the codebase,
audit with the repo skills, proceed on the two operator decisions,
iterate for parity with the reference, mind the mobile navigation +
the Tailwind v4 hazard class, keep DATABASE_URL at file:../db/custom.db
with db/ at the repo root, verify the vitest + playwright suites, plan
+ execute RED-first, capture screenshots, keep .env.example aligned,
realign the docs, ship to main via the SSH wrapper).
Workspace: the sandbox was RESET — a fresh clone at c6888d2; the
environment rebuilt (bun install 533 pkgs · the .env with
DATABASE_URL="file:../db/custom.db" + the AUTH_SECRET · db:push +
db:seed · the census reading 15/24/10/23/12 + 4 users — MATCH). The
documented intake hazard STANDS (the stale platform DATABASE_URL
override points at a NON-EXISTENT mirror, all session-75 repo
operations ran under `env -u DATABASE_URL`, the e2e suite immune via
its own pinned E2E_DATABASE_URL). Baseline gate GREEN: lint 0/0
(enforced) · tsc 0 · 1397/1397 unit (83 suites) — the documented
state exact; the skills/ exclusion verified in all three configs.

The standing drift re-sweep (71st session): the reference bundle
fresh-fetched — byte-identical (size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — the 46th consecutive
stable session). The reference census (71st, agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the mobile-nav defect STANDS
at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW
390, NO hamburger); desktop nav normal (256px, 8 links, all
visible).

The three parallel audit agents (75-a/75-b/75-c split accounts +
contacts after a context-deadline on the single 75-c agent) + every
finding manually validated at file:line by the orchestrator (the
parity-bearing claims additionally BUNDLE-DECODED against the
fresh-fetched reference — the accounts KPI memo, the zv card family
with the chartData literals, the Rx stat card, the kke panel groups +
the us checkbox API, the sortable th pair, the bce create form, the
rich empty state with the RB=tr("CircleUser") alias resolution; ONE
audit finding DISMISSED at validation — the contacts row-menu
"align:end" — our MenuContent primitive already defaults align="end",
the bare consumer IS the aligned construction). **75-a** — the s74
re-audit: **11/11 claims GENUINE** (every S74-P1..P11 fix at
file:line; the counts corroborated [83 suites, 1397 its, playwright
--list 129, tsc 0, lint 0/0]; the 52c6891 commit honest [27 files,
+1456/−159, zero strays]). Five nano notes (bookkeeping only): the
export-icon test TITLE said "eight" where the body pins 2+2 and the
plan says four — the title re-anchored this session; the P9 "11
sites" maps to no measurable (the pre-fix census was 24 cells across
10 tables); the P10 ternary-vs-optional-chain form; the P7 value
composes formatCompactCurrency inside the template (byte-identical
output); the commit message's "reports-page 1085" vs the pre-fix
1084 (off-by-one). **75-b** — the graduation audit: **ZERO
graduations, 13/13 (the 32nd consecutive)**; the 8 mechanical
censuses ALL CLEAN (localStorage exactly 2 live keys
[crm_saved_reports + neo-crm.leads.views — the ledger's `.view`
spelling is the known AGENTS abbreviation]; public/ og-image.png
only; API 27 routes/39 handlers all consumed; env parity 3-var
exact; doc anchors at 1397+129 all four carriers exact, badge 1526;
zero commented-out code; TODO/FIXME 0, .skip/.only 0, console.log 0
with the 4 documented exceptions; `new PrismaClient` exactly 2; the
e2e-waits census 5 annotated). One wording nano: the ledger's item-6
should say "the DASHBOARD header Add" (the accounts page's own "New
Account" is functional in BOTH apps — bundle `onClick:()=>n(!0)`).
**75-c** — the fresh-eyes rotation on the accounts/contacts
table-family seam (the session_142 suggested target — accounts-page
696 + contacts-page 1010 + account-insights-dialog 228 +
contact-detail-panel 244 + the table chrome + the records +
vocabularies + routes, never a dedicated rotation): the foundations
SOLID (the accounts table headers/row template/badge maps/owner
cell/empty row/row menu/rail/toolbar/insights dialog all
decode-match; the contacts row template/slide-over/engagement
bars/priority meta/kke wrapper/vocabularies/API pre-gates all
decode-match) — the N-75 family as validated + decoded:

- **M-75c1-1** — the Overdue Activities KPI counts overdue
  ACTIVITIES; the reference's memo decodes
  `W=N.filter(te=>te.overdueActivities>0).length` — ACCOUNTS with
  ≥1 overdue activity.
- **L-75c1-2** — the KPI sparkbars are computed per-industry
  buckets; the reference's five zv cards ship STATIC 6-value
  chartData literals (50/60/55/70/65/75 blue … 30/35/40/38/42/45
  red).
- **L-75c1-3** — the accounts trailing TableHead w-10 vs the
  bundle's w-12 (the leads table already ships w-12).
- **N-75c1-4** — the health badge fallback is the Healthy GREEN
  map; the reference's terminal is `||"bg-gray-100 text-gray-800"`.
- **N-75c1-5/6** — the accounts GET's dead `_count` include (zero
  consumers) + the create route's invented `lastActivityAt: new
  Date()` stamp (the reference's bce form ships NO last-activity
  field — fresh accounts render "No activity").
- **M-75c2-1** — the contacts Name th is a DEAD affordance on ours
  (with a stale s6 comment); the reference decodes a LIVE sort:
  `onClick:()=>te("name")` + the inner hover-blue div + the
  active-only chevron.
- **M-75c2-2** — the Filters button stays outline; the reference
  flips `variant:x?"default":"outline"` while the panel is open.
- **M-75c2-3** — the kke panel is missing the SIXTH group
  ("Engagement Level" — the LAST card after Source; High/Medium/Low)
  + its filter clause.
- **M-75c2-4** — the four stat cards derive from the FULL array;
  the reference's G memo reads the FILTERED memo + "Top Decision
  Makers" counts BOTH roles (Decision Maker OR Key Contact).
- **M-75c2-5** — the table empty state is plain text; the reference
  renders the rich stack (the CircleUser icon w-12 h-12
  text-gray-300 + the font-medium line + the text-sm hint).
- **M-75c2-6** — the filter checkboxes are native inputs; the
  reference's `us` primitive carries checked + onCheckedChange (the
  Radix-style button-role Checkbox — the s17 sweep covered every
  filter RAIL but missed the PANEL).
- **L-75c2-7** — the stat card: items-center + gap-3 + min-w-0 +
  text-muted label + the 40px/20px chip vs the reference's Rx
  (items-start, NO gap, flex-1, gray-600 label, gray-900 value,
  mb-2, the 48px p-3 chip with the 24px white icon).
- **L-75c2-8** — the Last Activity header: an inner button with an
  ArrowUpDown fallback vs the reference's th-direct onClick + the
  active-only chevron.
- **L-75c2-9** — the mobile empty state adds text-sm; the
  reference's p is bare.
- **N-75c2-10..15** — the contacts Actions header's invented w-10;
  the search scope's position arm (the reference matches
  name/email/company); the null-activity sort fallback createdAt vs
  the epoch 0; the dead mobile-card ve; the scanFile stale-state on
  reopen; the double thisMonth predicate.
- **STANDING (unresolvable at zero data)** — the insights-dialog
  stat icons (the Wc/op/q0 aliases carry no displayName and no
  assignment decode) — the s28-era icons keep with the
  documented-unverifiable posture.

The operator decisions: the **CSV formula-injection posture (b)
STANDS** (the 34th re-affirmation — the guard intact in both export
families [guardFormulaPrefix at csv.ts:31-33 applied in escapeCell
AND imported into entity-export.ts, the 75-b re-verification], the
`-` exclusion documented + pinned, the reference bundle byte-stable
for the 46th consecutive session; the 75-c rotations re-decoded the
family's export surfaces fresh — the contacts page-level export is
the documented client-side toQuotedCsv guarded superset, no new
unguarded builders found; no new evidence moves the (a) parity /
(c) full-OWASP alternatives). The **source-vocabulary documented
parity STANDS AND EXTENDS to the accounts/contacts table-family
seam** (the 75-b census re-confirmed every anchor at file:line; the
M-75c2-4 fix EXTENDS the role vocabulary — "Top Decision Makers"
gains the reference's both-roles basis while the CONTACT_ROLES wire
values stay raw; the M-75c1-1 fix re-derives the Overdue KPI from
the same raw activity vocabulary; the tier/status/health/priority/
source vocabularies re-verified byte-identical to the bundle in
this rotation).

The remediation set (S75-P1..P13, blast radius pre-checked):

- **S75-P1** — the Overdue KPI counts the distinct-accountId Set
  (null accountIds excluded).
- **S75-P2** — the five STATIC 6-value sparkbar literals; the
  industrySpark/activeSpark/revenueSpark memos retire (the
  industries memo STAYS — the rail's Industry select consumes it).
- **S75-P3** — the accounts trailing TableHead w-12; the contacts
  Actions header drops the invented w-10.
- **S75-P4** — the health badge gray terminal.
- **S75-P5** — the accounts route hygiene: the `_count` include +
  the type's optional field retire; the create stamp retires.
- **S75-P6** — the sortable headers: the Name th LIVE (onClick +
  the hover-blue inner div + the active-only chevron, the stale
  comment re-anchored); the Last Activity th-direct onClick (the
  inner button + the ArrowUpDown retire); the epoch-0 null
  fallback.
- **S75-P7** — the Filters variant flip.
- **S75-P8** — the kke panel: the SIXTH Engagement Level group +
  the engagementLevels state + the filter clause + the clearFilters
  extension; ALL the panel's checkboxes swap to the kit's
  button-role Checkbox primitive paired with the Label
  (`text-sm font-normal cursor-pointer` — the panel's explicit
  weight, byte-exact to the decode).
- **S75-P9** — the stat cards: the filtered basis + the both-roles
  union + the Rx construction (items-start, flex-1, gray-600
  label, gray-900 value, mb-2, the 48px p-3 chip with the
  `w-6 h-6 text-white` icons at the call sites; the IconChip
  helper RETIRED with its last consumer) + the thisMonth hoist.
- **S75-P10** — the empty states: the rich CircleUser stack (the
  mobile empty p goes bare).
- **S75-P11** — the contacts hygiene: the search scope drops
  position; the dead mobile-card ve retires; the scanFile resets
  on dialog close.
- **S75-P12** — the s74 export-icon test title re-anchor ("eight"
  → the four per-table buttons).
- **S75-P13** — the two e2e closures: the settings/users surface
  smoke (the tab strip + the Data exports + the accounts rail's
  Owner select listing the seeded users — the /api/users
  round-trip's first e2e, the rail-scoped combobox locator after
  the accessible-name miss) + the calendar month-boundary math
  (the December→January rollover increments the title year).
  129 → 131.

RED: **23 failing pins exactly** (the account-contacts-parity
suite's 20 + the contact-surfaces checkbox-groups + both-roles
re-anchors + the stat-value-contract Rx re-anchor; TWO test-shape
repairs mid-RED — the both-roles pin matched through its own label,
tightened to the value block; the Name-th/Engagement/scanFile
anchors re-scoped to stable literals). GREEN: S75-P1..P12 all
landed. Non-vacuousness: **23 failed | 26 passed** in the pre-fix
c6888d2 worktree (node_modules hard-linked via cp -al, only the
modified test files) — exactly the modified-pin set; clean
teardown.

Full gate: **lint 0/0 · tsc 0 · 1417/1417 unit (84 suites, +20) ·
build clean · 131/131 e2e on a fresh CI=1 boot (3.1m, all 9
mobile-nav checks green)** — ONE mid-flight e2e repair the run
caught (on the NEW test: the Owner-select locator — the trigger
carries no accessible name, re-scoped to the rail-scoped
`.w-80` combobox; passes in isolation + on the full re-run).

The LIVE battery (dev server, real login): the accounts KPI row
(Total 10 / Active 8 / Key 4 / $77.5M / **Overdue 4 = the
distinct-account count**, cross-checked against the table's four
red-bordered "1 Overdue" rows); the five cards each rendering
exactly SIX static bars; the trailing th computing w-12; the health
badges (At Risk yellow / Needs Attention red / Healthy green); the
contacts Name sort round-trip (Khalid → Aisha on the asc click +
the chevron-up rendering ONLY while active); the Last Activity th
clickable; the Filters button computing rgb(37,99,235) = #2563eb
filled while open; the panel's SIX groups with 20 button-role
checkboxes + ZERO native inputs; the engagement filter round-trip
(15 rows → 5 on "High" + ALL FOUR stat cards re-deriving 5/5/2/1
from the filtered set — the M-75c2-4 fix LIVE-proven); the rich
empty state (the CircleUser w-12 h-12 gray-300 + both lines on a
no-match search); the stat card anatomy (root items-start, label
gray-600, value gray-900 mb-2, chip 48px, icon 24px — all
computed); the drawer at TRUE 390px (visible + focus in the panel +
the dual body/main lock + Escape closed + focus RESTORED to the
burger — the activeElement verified directly); **zero 390px
overflow on all routes** (the sweep + the capital aliases);
**NO Tailwind v4 bug** (--blur-sm 4px + --shadow-sm `0 1px 2px 0
#0000000d`); the closing census MATCH (15/24/10/23/12 + 4 users,
pristine — zero probe residue).

Two screenshots captured (89-contacts-filter-panel +
90-accounts-kpi-static-bars) — VLM-verified (3/4 direct on 89: the
Engagement-Level miss is the panel's own below-the-fold scroll at
900px — the DOM probe verified all 6 groups + 20 checkboxes; the
two truncation flags are the pinned s28/s16 constructions; 4/4
direct on 90: the $77.5M/bars "overlap" flag RUN DOWN by the DOM
measurement — a 12px gap, no overlap).

The docs realignment: SKILL v1.72.0 (the new §16bo + the
project_state prepend, applied atomically via the assert-first
scripts/skill_edits_s75.py at the sandbox root, 6781 → 6859 lines
by wc -l) + README (badge 1548, the 84/1417 + 131 carriers, the
test-list gains account-contacts-parity) + AGENTS (the commands +
the counts) + CLAUDE (the count carriers) + PAD (the s75 unit +
e2e rows, the totals) + this record + the plan's execution record
+ the repo worklog; the .env/.env.example verified (no env surface
change; DATABASE_URL file:../db/custom.db with db/ at the repo
root).

Suggested next (session 76): the activities/calendar remaining
seams (the timeline card family + the agenda surfaces — partial
rotations only); standing e2e gaps: the opportunities surface
smoke; the insights-dialog icon identities remain
unresolvable-in-bundle (a live-reference probe at nonzero data
would close them).
