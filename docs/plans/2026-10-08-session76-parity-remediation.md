# Session-76 Parity Remediation Plan (2026-10-08)

Session 76 on `main` @ `3d45843` (the s75 ship `5ff0d3b` + the two
session-log commits — docs only, ZERO code drift). The sandbox was RESET —
a fresh clone; the environment rebuilt (bun install 533 pkgs · `.env` with
`DATABASE_URL="file:../db/custom.db"` + the openssl AUTH_SECRET · db:push +
db:seed · the census reading 15/24/10/23/12 + 4 users — MATCH). The
documented intake hazard STANDS (the platform `DATABASE_URL` override
points at a non-existent mirror; all session-76 repo operations run under
`env -u DATABASE_URL`). **Baseline gate on HEAD: lint 0/0 (enforced) ·
tsc 0 · 1417/1417 unit (84 suites)** — the documented state exact; the
`skills/` exclusion verified in all three configs.

## The standing layers (72nd session, NO DRIFT)

Drift sweep #72: the reference bundle fresh-fetched — size 1,631,071 +
md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 47th consecutive
stable session**. Reference census #72 (agent-browser, live login at 1280
then a TRUE 390px viewport): the demo data still zero (the KPI values
0/$0.0k/$0.0k/$0k); the mobile-nav defect STANDS at a TRUE 390px (vw=390,
nav w=0, 8 links in DOM, 0 visible, scrollW 390, NO hamburger); desktop
nav normal (256px, 8 links, all visible).

## The audits (three parallel agents + the orchestrator's manual
validation of every claim at file:line, the parity claims BUNDLE-DECODED
against the fresh-fetched reference)

**76-a** — the s75 re-audit: **15/15 claims GENUINE** (every S75-P1..P13
fix at file:line; the counts corroborated by live runs [84 suites, 1417
its, playwright --list 131, tsc 0, lint 0/0]; the 5ff0d3b commit honest
[20 files, +1224/−169, zero strays]). Four nano notes (bookkeeping only):
the `engagement-${e}` vs `-i` id spelling; the settings/users e2e naming
3-of-4 seeded users; the "chartData literals" prop named `bars` in ours;
the historical non-vacuousness runs not re-verified (the intake baseline
corroborates).

**76-b** — the graduation audit: **ZERO graduations, 13/13 (the 33rd
consecutive)**; the 8 mechanical censuses ALL CLEAN (localStorage exactly
2 live keys; public/ og-image.png only; API 27 routes/39 handlers all
consumed; env parity 3-var exact; doc anchors at 1417+131 all four
carriers exact, badge 1548; zero commented-out code; TODO/FIXME 0,
.skip/.only 0, console.log 0 with the 4 documented exceptions;
`new PrismaClient` at the sanctioned sites; the e2e-waits census 5
annotated).

**76-c** — the fresh-eyes rotation on the activities/calendar family (the
session_145 suggested target — activities-page 666 + calendar-page 602 +
the four API routes + the Event/Activity dialog arms + the
timeline/priority/agenda surfaces, never a dedicated rotation): the
foundations SOLID (page chrome, KPI grids, rail anatomy, by-type card,
dialog shells, all four API routes ZERO findings, the chip/tint maps, the
seams) — the N-76 family (14 M + 10 L + 5 N) as validated +
bundle-decoded by the orchestrator (every M/L claim re-decoded from
/tmp/ref-bundle-check.js before acceptance; the component identities:
activities = JSe/gm/vx/Rce/Lce/QSe/Mce, calendar = jAe/Mx/_Ae/SAe; the
op/q0 icon aliases resolved at their tr("Target")/tr("Users") assignment
lines — the s75 playbook trick):

**The activities half:**

- **M-76c1 CONFIRMED** — the priority-tab rows are a different
  construction (ours a divide-y ul with CheckCircle2 toggle + subject
  meta line + type Badge + edit; the reference's `vx`: the
  `p-3 hover:bg-gray-50 rounded-lg border-b` row with the initials
  avatar box `w-10 h-10 bg-blue-100 text-blue-600 text-sm
  font-semibold` (initials of related_to_name || "A"), the title
  `related_to_name || "Activity"` + the destructive "Xh/Xd overdue"
  Badge, the `text-xs text-gray-600` description line, the right-side
  time span (`text-red-600` overdue else `text-gray-900`) + the ghost-sm
  text-xs "Check as completed" button with the w-4 h-4 mr-1 icon).
- **M-76c2 CONFIRMED** — the timeline rows are a different construction
  (ours the border-l dotted rail with subject/meta/status-badge; the
  reference's `Rce`: groups keyed by the LONG weekday date format under
  `h3 text-sm font-semibold text-gray-900 mb-3`, items as Cards `p-4
  hover:shadow-md transition-shadow` with `flex gap-4`, the TINTED icon
  square w-10 h-10 rounded-lg (Email blue / Call green / Meeting purple
  / WhatsApp emerald / Note gray — the 100/600 pairs) + the w-5 h-5
  icon, the description title, the "Related to:" blue-link line, the
  time span, and the avatar + created_by + type-Badge footer).
- **M-76c3 CONFIRMED** — ours "Nothing due today"; the reference "No
  activities due today".
- **M-76c4 CONFIRMED** — ours `slice(0, 8)` on every tab; the reference
  NO cap on overdue/dueToday, `slice(0, 5)` on upcoming/completed.
- **M-76c5 CONFIRMED** — the rail Status select vocabulary: ours Last 24
  hours / Last 7 Days / Last 30 Days / All Time; the reference Last 7
  Days / Last 30 Days / Last 90 Days (7days/30days/90days, default
  7days).
- **M-76c6 CONFIRMED** — the ten stat cards ship STATICS: the activities
  `gm` cards (Activities Today trend "+23%" + [60,70,65,80,75,85] blue;
  Overdue sub "Due now" + trend "2h overdue" + [40,50,45,60,55,50] red;
  Emails Sent sub "+7 today" + [30,40,50,60,70,80] cyan; Calls Logged
  sub "+4 today" + [50,55,60,65,70,75] green; Meetings Scheduled sub
  "+1h 12m" + [40,50,55,60,70,65] — color "purple" falls through the
  gm's blue/green/red/cyan map to GRAY-400; WhatsApp [30,35,40,45,50,55]
  green) + the calendar `Mx` cards (trends "+3"/"+34"/"+2"/"+3" all up).
  Ours computes dynamic deltas/subtexts/bars with invented
  normalization (the 12% floor, the 0.4 zero-opacity, the v−1 transform).
  The TrendStatCard also hardcodes TrendingUp where `Mx` swaps to
  TrendingDown on `trend==="down"`. The house already adjudicated this
  pattern on the dashboard (KPI_STATICS, "NEVER feed these cards real").
- **M-76c11 CONFIRMED** — the by-type footer's children sit directly in
  the `mt-4 pt-4 border-t` div; the reference wraps them in an inner
  `flex items-center gap-2` row (the `ml-auto` on the ••• is inert
  without it).
- **L-76c1 CONFIRMED** — the stat-card LABELS are one step light: ours
  `text-muted` (#6b7280) on BarStatCard + STAT_CARD.label; the reference
  `text-gray-600` (#4b5563) on both gm and Mx.
- **L-76c2 CONFIRMED** — the KPI derivations: ours Activities Today by
  createdAt (the reference: by the due DATE within [startOfToday,
  startOfTomorrow)), Meetings Scheduled = upcoming (the reference: ALL
  meetings), the overdue boundary `< now` (the reference: `<
  startOfToday`), the values computed on raw `activities` (the
  reference: on the type-filtered set A).
- **L-76c7 CONFIRMED** — the WhatsApp bar color: ours #22c55e; the
  reference's gm maps "green" → bg-green-400 #4ade80.
- **N-76c1 CONFIRMED** — the dead `green: true` field on QUICK_LOG's
  whatsapp entry (never read).
- **N-76c4 CONFIRMED** — `barsFor`'s `n` param never passed (rides the
  P1 statics retirement).
- **N-76c5 CONFIRMED** — the timeline renders "Loading activities..."
  (`text-center py-12 text-gray-500`) while the query loads; ours shows
  the empty state during the fetch. (The loading-layer pins — no
  Skeleton, zero animate-pulse — are NOT violated by a text line.)

**The calendar half:**

- **M-76c7 CONFIRMED (correctness bug)** — TODAY always carries the blue
  pill in the reference (`bg-blue-600 text-white border-blue-600`; no
  selection state exists); ours rides the pill on `isSelected` — after
  clicking any other day, today renders `bg-white` + a `text-white`
  number (white-on-white, invisible).
- **M-76c8 CONFIRMED** — the month grid is ALWAYS 42 cells in the
  reference (eachDayOfInterval from the Sunday before the 1st to the
  Saturday after the last); ours trims to whole weeks (28/35/42 — the
  card height jumps between months).
- **M-76c9 CONFIRMED** — the Upcoming Events derivation: the reference
  filters [now, now+7d] + status "scheduled" + slice(0,5) riding the
  desc-ordered query; ours unbounded-future + not-cancelled + asc + 6.
- **M-76c10 CONFIRMED** — the agenda row content: the reference renders
  `format(start_date, "EEEE, MMM d • h:mm a")` + the event DESCRIPTION
  line (`text-xs text-gray-500 mt-1 line-clamp-2`); ours the
  formatMonthDayTime timestamp + the related line.
- **L-76c3 CONFIRMED** — the calendar KPI memo reads the RAW events
  array (totalEvents: p.length) — ours reads `visible` (the cards move
  under filters; the reference's do not).
- **L-76c4 CONFIRMED** — the reference's event query is `"-start_date"`
  (DESC): the agenda's slice(0,10) takes the 10 LATEST, the day-cell
  chips render desc. Ours: API asc + soonest-10.
- **L-76c5 CONFIRMED** — the calendar Date rail is single-valued
  (`onCheckedChange: a ? value : null` — radio semantics); ours ORs
  multiple date filters.
- **L-76c9 CONFIRMED** — the day-cell chip container is a plain
  `space-y-0.5` stack; ours `mt-auto flex flex-col gap-0.5` (an
  invention riding the button superset).
- **N-76c2 CONFIRMED** — CALENDAR_CELL is a construction-dead record
  (the page inlines byte-identical strings; only tests read it — the
  S68-P4 "render through the constant" class).

**The dialog family:**

- **M-76c12 CONFIRMED** — the Event dialog's submit is
  `bg-blue-600 hover:bg-blue-700` in BOTH modes with the label
  "Update Event" in edit; ours goes dark + "Save Changes" in edit (the
  s15 "edit keeps the dark superset — unverifiable" claim
  bundle-falsified).
- **M-76c13 CONFIRMED** — the Event dialog renders a CONDITIONAL "Name"
  field in the Related To pair's second cell when a type is chosen
  (placeholder `Enter ${related_to_type} name`); ours leaves the cell
  empty always (the s15 "second cell empty" pin was a zero-interaction
  live read).
- **M-76c14 CONFIRMED** — five dialog placeholders the s15 dump missed:
  Event Location "Enter location or meeting link", Event Related
  SelectValue "Select type", Activity Description "Enter activity
  details...", Activity Related Type "Select type", Activity Related
  Name "e.g., John Doe". The S15-P4/P14 pin re-anchors (the S30-P2
  precedent — the John Doe re-anchor).
- **L-76c6 CONFIRMED** — the Activity dialog's type select lists FIVE
  (Call/Email/Meeting/Task/Note); WhatsApp arrives only via the
  quick-log's SUBMIT-TIME override (`onSubmit: N => mutate({...N, type:
  i || N.type})` — the preset state wins at submit; the select never
  shows it). Ours lists six + presets the visible form value.
- **L-76c8 CONFIRMED** — the Activity dialog's Description textarea is
  rows=4 (~88px); ours min-h-[60px] (the Event dialog's rows=3 ✓
  matches).
- **L-76c10 CONFIRMED** — the Related To selects default `""` (the
  "Select type" placeholder shows at rest; the Event dialog's None
  option carries value null); ours preselects "none"/"contact".
- **N-76c3 CONFIRMED** — "Saving..." (three ASCII dots) in both
  dialogs; ours uses the ellipsis character.

**The opportunities-surface verdict (the standing e2e gap):** the
reference has NO visible opportunities page or route — all nine bundle
hits are the API entity + its CONSUMERS (the account-insights dialog
filtered by account_name, the contact-details Deals tab by
contact.company, the dashboard Recent Deals slice(0,5), the five reports
tabs, the dead "Convert to Opportunity" menu item, the reset wipe). Ours
mirrors every consumer + the list-only route (the "LIST-ONLY by design"
comment bundle-confirmed). The e2e closure lands against the CONSUMERS.

## The operator decisions (35th re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 76-b re-verification:
`guardFormulaPrefix` intact at csv.ts:31-33 applied in `escapeCell` AND
imported into entity-export.ts's `qq`; the `-` exclusion documented;
**ZERO new unguarded builders** (every dynamic-data builder routes
through the guard; the raw-dump header + the static templates are the
documented exclusions); the reference bundle byte-stable for the 47th
consecutive session; no new evidence moves the (a) parity / (c)
full-OWASP alternatives.

The **source-vocabulary documented parity STANDS AND EXTENDS to the
activities/calendar family** — the 76-b census re-confirmed every anchor
at file:line (CONTACT_SOURCE_OPTIONS/LEAD_SOURCE_OPTIONS pinned; NO
enum-membership on the four validation sites; the settings Capitalized
defaults verbatim); the 76-c rotation decoded the family's vocabularies
fresh (the ACTIVITY_TYPES select vocabulary narrows per L-76c6 — the
wire values stay raw; the EVENT/ACTIVITY_RELATED vocabularies
byte-verified; the rail vocabularies re-verified).

## The remediation set (TDD — RED first, then GREEN)

- **S76-P1 (M-76c6 + L-76c1 + L-76c7 + N-76c4) — the KPI STATICS
  family**: a new ACTIVITY_KPI_STATICS constant (the six gm literals +
  the static deltas/subtexts) + the four calendar trend literals riding
  KPI_STATICS; the ten cards render the statics; the dynamic memo
  family retires (todayCount/yesterdayCount/todayDelta/oldestOverdue/
  overdueLabel/emailsToday/callsToday/upcomingMeetings/meetingMinutes/
  meetingDuration/barsFor/allBars — the VALUES stay live, only the
  deltas/subtexts/bars go static); the TrendStatCard gains the
  down-glyph swap; BarStatCard's label + STAT_CARD.label go the literal
  `text-gray-600`; the WhatsApp bars go CHART_COLORS.green400.
- **S76-P2 (M-76c1) — the priority-row family**: the rows rebuild on
  the decoded `vx` contract (the initials avatar box, the
  relatedName-||-"Activity" title, the destructive overdue Badge with
  the Xh/Xd math, the description line, the time span, the "Check as
  completed" ghost-sm text-xs button). Our kept supersets (documented
  in-code): the toggle's aria-label + the edit affordance (the
  reference has neither edit nor toggle — only complete).
- **S76-P3 (M-76c2 + N-76c5) — the timeline family**: the rows rebuild
  on the decoded `Rce` contract (the long-weekday date groups, the Card
  p-4 hover:shadow-md items, the tinted icon squares, the "Related to:"
  line, the footer); the loading line renders while the first fetch is
  in flight (a local loaded state — the loading-layer pins untouched).
- **S76-P4 (M-76c3 + M-76c4)** — "No activities due today" + the
  per-tab caps (none/none/5/5).
- **S76-P5 (M-76c5)** — the Status select vocabulary (7days/30days/
  90days, default 7days; the range filter keeps our functional
  semantics on the 3 values).
- **S76-P6 (L-76c2) — the KPI derivations**: Activities Today by the
  due date in [startOfToday, startOfTomorrow); Meetings Scheduled = ALL
  meetings; the overdue bucket boundary < startOfToday (the four
  priority buckets re-derive on the same boundary family); the values
  read the type-filtered set (our baseFiltered — the structural
  equivalent of the reference's A).
- **S76-P7 (M-76c7 + M-76c8 + L-76c9 + N-76c2) — the calendar grid**:
  TODAY always carries the blue pill (selection becomes our distinct
  non-conflicting superset treatment; the chips' white-variant keys on
  isToday); the grid renders the UNTRIMMED 42 cells; the chip container
  goes the plain `space-y-0.5`; the page renders through CALENDAR_CELL
  (the record becomes the source of truth).
- **S76-P8 (M-76c9 + M-76c10 + L-76c4) — the upcoming/agenda pair**: the
  upcoming derivation goes [now, now+7d] + scheduled + slice(0,5); the
  agenda row renders the "EEEE, MMM d • h:mm a" timestamp + the
  DESCRIPTION line (the related line retires there; the upcoming row
  keeps formatMonthDayTime + the related line); the events route orders
  startAt DESC + the page-side chip/agenda orderings follow (a new
  formatWeekdayBulletTime seam in format.ts).
- **S76-P9 (L-76c3 + L-76c5)** — the calendar KPI memo reads the RAW
  events array; the Date rail goes radio semantics (single dateRange).
- **S76-P10 (M-76c12 + M-76c13 + M-76c14 + L-76c6 + L-76c8 + L-76c10 +
  N-76c3) — the dialog family**: the Event dialog's submit stays blue
  in both modes with the "Update Event" label; the conditional Name
  field renders in the second cell (placeholder
  `Enter ${type} name`); the five placeholders land (the S15 pin
  re-anchors to exactly six allowed); the Activity type select narrows
  to five + the quick-log preset rides the SUBMIT (the reference's
  `type: i || N.type` construction); the Activity textarea rows=4; the
  Related selects default "" (placeholder at rest; the Event None
  option stays, the conditional Name field keys on a real type);
  "Saving..." ASCII in both dialogs.
- **S76-P11 (N-76c1)** — the dead `green: true` retires.
- **S76-P12 (M-76c11)** — the by-type footer gains the inner
  `flex items-center gap-2` row (BY_TYPE_CARD.footer re-derived).
- **S76-P13 (the coverage closure — the opportunities-consumers e2e)**:
  a new e2e smoking the three bundle-confirmed consumers — the accounts
  insights dialog's Open Deals tab, the contact panel's Deals tab, and
  the dashboard Recent Deals rows (the seeded opportunities round-trip
  through /api/opportunities on each surface). 131 → 132.

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: `tests/page-layout.test.ts:1690-1705`
(the S15 placeholder pin gains the five — the S30-P2 precedent) + the
STAT_CARD.label pin + the BY_TYPE_CARD.footer pins; `tests/calendar-cells.
test.ts:129` (the agenda timestamp pin re-anchors to the weekday-bullet
format + the description line) + the today-variant chip pin (keys
isToday); `tests/calendar-fetch-bounds.test.ts` SURVIVES (the seam is
unchanged — it already computes the untrimmed bound); `tests/stat-value-
contract.test.ts` (the label color re-anchor); `tests/mutation-feedback.
test.ts` + `tests/dialog-mount-contract.test.ts` (the dialog label/
placeholder re-anchors); the e2e S54-P6 trailing-cell round-trip SURVIVES
(its monthTitle helper is formatMonthYear, untouched); the s75 calendar
year-rollover e2e SURVIVES (the title math untouched); the mobile-nav
9-check suite SURVIVES. No pins on: the priority-row family, the timeline
family, the statics, the per-tab caps, the Status vocabulary, the overdue
boundary, the 42-cell grid, the upcoming window, the desc ordering, the
dateRange radio, the KPI raw basis, the Event-dialog edit submit, the
conditional Name field, the textarea rows, the related defaults.

## The execution record (2026-10-08, session-76)

EXECUTED AS PLANNED with THREE mid-flight test-shape repairs (all caught
by the RED runs themselves, all on the NEW pins) + ONE mid-flight e2e
repair: (1) the Meetings-Scheduled block-scope anchor matched nothing
(its slice ran backwards) — tightened to the upcomingMeetings
retirement; (2) the related-defaults regex missed the `?? "none"`
initializers — re-scoped to the exact forms; (3) the by-type-footer
anchor false-positived through the CHIP row's identical class string —
pinned on the footerRow FIELD; (4) the opportunities e2e's contact
slide-over locator — role=dialog found nothing (the panel is the
.fixed.top-0.right-0 construction, the s28 convention) + the Close
button click. The s72 settings flake fired once in the full run and
passed on re-run (the documented pre-existing timing sensitivity, zero
session-76 surface). RED: **42 failed exactly** (the
activities-calendar-parity suite's 40 + the page-layout placeholder-pin
and STAT_CARD.label re-anchors). GREEN: S76-P1..P12 all landed (P1 the
statics + the memo retirements + the TrendStatCard down-glyph + the
gray-600 labels; P2 the vx rebuild; P3 the Rce rebuild + the
Loading-activities line; P4/P5 the vocabulary trio; P6 the
calendar-day boundaries + the filtered basis; P7 the isToday-first pill
+ the ring superset + the untrimmed 42 + the CALENDAR_CELL consumption;
P8 the 7-day window + formatWeekdayBulletTime + the desc route; P9 the
raw-basis KPIs + the radio rail; P10 the blue both-modes submit + the
conditional Name field (Event.relatedName at the schema/type/both
routes) + the five placeholders + the five-option select with the
preset-at-submit + rows=4 + the empty defaults + the ASCII Saving...;
P11 the green field; P12 the footerRow) + P13 the opportunities-consumers
e2e. SIX lockstep re-anchors (the retired-surface class): dch s62, dch
N-56a timeUntil→formatTime, mutation-feedback delete→toggle,
dual-mode createMode→the label ternaries, N-51b baselines→the raw-basis
statics, the GUARD trim/trend pins. Non-vacuousness: 42 failed | 178
passed in the pre-fix 3d45843 worktree (node_modules hard-linked via
cp -al, only the modified test files); clean teardown. Full gate: lint
0/0 · tsc 0 · **1457/1457 unit (85 suites, +40)** · build clean ·
**132/132 e2e on a fresh CI=1 boot (3.2m, all 9 mobile-nav checks
green)**. LIVE: the statics computing exactly (the overdue bars
67/83/75/100/92/83% = [40,50,45,60,55,50]/60); the vx row (TN initials,
4d overdue, 1:32 PM, Check as completed); the Rce timeline (the
Wednesday-October-14 groups, 16 cards, the tinted squares); the 42-cell
grid (11/30/1); the today pill surviving a selection click; the
Saturday-Oct-17-bullet agenda; the dateRange radio; the blue #2563eb
Update Event + the Enter-Contact-name field; zero overflow ×10; NO
Tailwind v4 bug; the closing census MATCH. Screenshots 91 + 92 (the
scrolled capture) — VLM 3/4 (the below-fold flag run down in the DOM) +
3/3. Docs: SKILL v1.73.0 (§16bp + project_state, 6859 → 6928, via the
assert-first scripts/skill_edits_s76.py at the sandbox root) + README
badge 1589 + AGENTS/CLAUDE/PAD at 1457+132 + session_147.md + this
record + the repo worklog; .env/.env.example verified (no env surface
change — Event.relatedName is schema-only). Estimate drift: +40 its
exact (the new suite) · 132 e2e exact · the e2e-waits census unchanged
at 5 (the new e2e rides role/text locators + toBeVisible polling, zero
new sleeps).
