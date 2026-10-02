# Session 27 Remediation Plan — The Chart Internals + Account Health / Calendar Contract Layer (2026-10-02)

**Scope:** Fresh-login live audit of the reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `f986f0a`
(pulled to the operator's session-46 transcript `docs/session_46.md` — the
ONLY change since `f943779`; zero app-code drift, so every pinned family
from s26's live verification held by construction). Workspace intact from
session-26 (bun install, `.env` with `DATABASE_URL="file:../db/custom.db"`,
`db/` at the repo root, dev server healthy on :3000). **Baseline gate green:
lint 0/0 · tsc clean · 525/525 unit · build clean · 87/87 e2e** (first run
86/87 — the documented s15 Event-dialog flake, clean in isolation ×1 and in
the full re-run).

**Standing layers re-verified FIRST (moving-target rule) — NO drift:**

- **Mobile navigation (the standing priority)**: the reference at 390px
  still ships NO navigation (**23rd consecutive session** — 8 sidebar links
  in the DOM, 0 with `getClientRects()`, zero hamburger). Our drawer
  spot-verified LIVE (trigger 36×36 hit-tested via elementFromPoint; open →
  8 capitalized links, focus on Close, dual scroll locks; Escape → inert +
  focus restore + unlock) — the full 7-check suite green in the 87/87
  baseline. **Zero 390px overflow on all nine authed routes.**
- **Demo data still zero (23rd consecutive session)** — KPIs at 0/$0.0k.
- **The typography layer (s22)**: controlled-span metrics EXACTLY equal on
  both apps this session (59-char 522/582.89 + 65-char 544.39/612.25,
  byte-identical family).
- **The tabs ARIA layer (s23)**: settings 3/3 wired + controls on both
  apps, byte-identical labels.
- **The contacts table (live re-check)**: the reference's headers are
  Name/Role/Priority/Last Activity/Engagement/Company/Source/Actions with
  the toolbar Export CSV/Scan Card/Import/New Contact/Filters — our clone
  matches row-for-row (the role/engagement surface was already mirrored).
- **Tailwind v4 hazards**: zero (pinned by the 525 baseline).

**This session's NEW audit layer — the chart-internals + Account Health /
Calendar contracts** (the s45 "Next" pointers + everything the reference's
persistent zero-data state made invisible until the s26 bundle-extraction
method). Method: the reference's minified bundle (1.63MB, fetched to
`scripts/reference-bundle.js` for rg/python analysis — `indexOf`/regex
walks with wide context windows) + live DOM probes for every
zero-data-visible surface + our API queried directly for data-shape
comparison. **The decisive finding: the reference's chart family carries
per-surface configs (fills, formatters, radii, tick styles, chart TYPES)
that were ALL invisible at zero data — and its KPI sparklines and deltas
are HARDCODED STATIC ARRAYS.**

| # | Sev | Issue | Evidence (bundle + live) |
|---|-----|-------|------------------------|
| S27-P1 | **High** | **The Reports tab-5 "Account Health" data model is wrong end-to-end.** The reference COMPUTES health client-side: `daysSinceActivity = last activity ? diffDays(now, last) : 999`; `health = (days>60 \|\| account has a closed_lost deal) ? "At Risk" : days>30 ? "Needs Attention" : "Healthy"` (bundle `r3e`). The distribution series is `{Healthy, "Needs Attention", "At Risk"}` name/value pairs. Ours: the API ships a STATUS distribution (Active/Inactive/Churned from `ACCOUNT_STATUS_META`) into a DonutChart — wrong vocabulary, wrong chart, wrong data. The at-risk list: reference = `health==="At Risk"` slice(0,20); ours = "stale 45 days OR churned" slice(0,10). The top-10 list: reference = `filter(annual_revenue).sort(revenue desc).slice(10)`; ours = `filter.slice(10)` with NO SORT. | bundle `r3e` extraction + live tab-5 DOM (empty states at zero) + our `/api/reports?period=all` response |
| S27-P2 | **High** | **The Account Health tab's four surfaces render the wrong components.** (a) "Account Health Distribution": reference = PIE `cx/cy 50%`, `labelLine:false`, `label:({name,value})=>\`${name}: ${value}\``, `outerRadius:100`, Cells `["#10b981","#f59e0b","#ef4444"]`, stock tooltip, height 300, NO legend — ours = DonutChart (inner 55%/outer 80%, paddingAngle, custom circle legend, height 240). (b) "Top 10 Accounts by Revenue": reference = HORIZONTAL BarChart `layout:"vertical"`, YAxis `dataKey:"name" type:"category" width:120`, XAxis number, Tooltip `$${v.toLocaleString()}`, Bar `dataKey:"revenue" fill:"#3b82f6"`; ours = vertical PipelineBarChart with per-item colors + 12-char truncated labels. (c) "At Risk Accounts": reference rows carry `bg-red-50`, Last Activity renders `daysSinceActivity===999?"Never":\`${d}d ago\``, Status = Badge `bg-red-100 text-red-800` "At Risk"; ours = plain rows + formatDate + plain capitalize text. (d) "Account Summary": reference Status = outline Badge, Industry `\|\| "-"`; ours = plain text + "—" em dash. | bundle + our reports-page.tsx:743-829 |
| S27-P3 | **High** | **The reports tab-1 chart types are all wrong.** (a) "Revenue Over Time": reference = LineChart with ONE Line `dataKey:"revenue" stroke:#3b82f6 strokeWidth:2` + `$` tooltip (the data is `{month, revenue}` — NOT won/target!); ours = the dashboard's won/target AREA chart. (b) "Won vs Lost Over Time": reference = grouped BarChart `won #10b981 "Won"` + `lost #ef4444 "Lost"` + stock Legend + stock tooltip; ours = a LINE chart. (c) "Pipeline by Stage": reference = ROW-DERIVED (open opportunities grouped by stage — EMPTY at zero, no axes) with Bar `dataKey:"value" fill:"#8b5cf6" name:"Value ($)"` + plain-number tooltip; ours = the FIXED 8-slug count bars (renders ticks at zero where the reference renders nothing). (d) "Conversion Funnel": reference = the 8-stage horizontal bars with a SINGLE fill `#06b6d4`, YAxis `dataKey:"stage" width:100`, no radius/maxBarSize (counts: new/contacted/qualified from LEAD STATUS + prospecting/qualification/proposal/negotiation/closed_won from OPPORTUNITY STAGE); ours = per-stage Cells + radius [0,6,6,0] + maxBarSize 24 + width 90. | bundle `cCe` extraction + our reports-page.tsx:286-319 + charts.tsx |
| S27-P4 | **High** | **The reports tab-2/3/4 charts are wrong.** Tab-2: (a) "Forecasting Accuracy" = TWO Lines `forecasted #3b82f6 "Forecasted"` + `actual #10b981 "Actual"` + `$` tooltip; ours = one "Accuracy %" line. The caption = `mt-4 text-center` with the value in `font-bold text-lg text-gray-900`; ours = mt-2 plain. (b) "Pipeline by Stage" (tab-2) = Bar `value #3b82f6` + `$` tooltip; ours = count bars. (c) "Forecast by Probability" = PIE `outerRadius:90`, `label:({band,value})=>\`${band}%: $${(value/1e3).toFixed(0)}K\``, Cells the FOUR-color palette `["#3b82f6","#06b6d4","#8b5cf6","#ec4899"]` (the tab-2 palette is 4 — the tab-3/4 palettes are 5), `$` tooltip; the data = the FIXED 4 bands "0-25"/"26-50"/"51-75"/"76-100" by probability with AMOUNT sums (our Lead model carries no per-deal probability — the stage-weight → band mapping is the documented approximation); ours = a vertical bar chart. (d) "Aging Pipeline" = Bar `count #8b5cf6`, XAxis `dataKey:"age"`; ours = blue bars. The Forecasting Accuracy DATA: forecasted = amount×(probability||50)/100 by close month, actual = won amounts (ours approximates forecasted=target — the two-line + $-tooltip visual contract still matches). Tab-3: (e) "Activities by Type" = PIE `outerRadius:90` `label:({type,count})=>\`${type}: ${count}\`` + the same 5-color palette; ours = a bar chart. (f) "Activities Over Time" = ONE Line `count #3b82f6 strokeWidth:2`; ours = a two-line chart with a fake `lost:0`. (g) "Activities vs Wins" = grouped BARS `count #3b82f6 "Activities"` + `won #10b981 "Won Deals"`; ours = lines. (h) "Overdue Activities" rows carry `bg-red-50` + outline-Badge type. Tab-4: (i) "Leads by Source" = PIE `outerRadius:90` `label:({source,count})=>\`${source}: ${count}\``; ours = bars. (j) "Win Rate by Source (%)" = Bar `winRate #10b981` + `%` tooltip; ours = no formatter. (k) "Avg Deal Value by Source" = Bar `avgValue #8b5cf6` + `$` tooltip; ours = no formatter. | bundle extractions @1585814/1590687/1594397 + our reports-page.tsx:398-670 |
| S27-P5 | **High** | **The reports KPI cards' sparklines + Lost-Deals value are wrong.** The reference's sparkline data is a HARDCODED STATIC array `[65,72,68,85,78,92]` (`z=X=>[65,72,68,85,78,92].map(W=>({value:W}))`) fed to Total Leads / Open Leads / Won Deals / Conversion Rate (Lost Deals ships none — already pinned); ours feeds REAL `revenueOverTime.won` series (renders EMPTY in the current quarter — a live-visible gap: the reference always shows the sparkline). The Lost Deals card: value = count only, the `$XK` amount is a SUBTITLE in the bottom-right delta column (`text-xs text-gray-500 mt-1`); ours renders it inline in the bold value. Total Leads value = `toLocaleString()`. | bundle `ay` + `m` (sparklineLeads: z()) extraction + live probes (reference cards all show sparklines; ours show none in Q4) |
| S27-P6 | **High** | **The dashboard "Sales Pipeline by Stage" chart + legend are wrong.** The reference's bars: SINGLE fill `#3b82f6` with `radius:[8,8,0,0]`, `dataKey:"value"`, `$` tooltip, `tick:{fontSize:12}` on BOTH axes (explicit); ours = per-stage STAGE_META colored count bars, no radius, no formatter, no tick style. The legend: reference = a custom div `flex flex-wrap gap-4 mt-4 text-xs` with per-stage chips `flex items-center gap-2` + `w-3 h-3 rounded` SQUARES carrying TAILWIND classes from the map `{prospecting:"bg-blue-500", qualification:"bg-cyan-500", proposal:"bg-yellow-500", negotiation:"bg-orange-500", closed_won:"bg-green-500", closed_lost:"bg-red-500"}` (with the "Won" label MISSING the map → the `bg-gray-400` FALLBACK — the s13 "Won = grey #9ca3af" pin explained: it's a lookup miss, not a mapped color) + `text-gray-600` spans `` `${stage}: $${(value/1e3).toFixed(1)}k` ``; ours = `mt-2 flex flex-wrap gap-x-4 gap-y-1` + `h-2 w-2 rounded-full` dots + `text-muted` + formatCompactCurrency. | bundle @1125430 + the O-map @1118405 + live legend chips (computed bg colors confirmed) + our charts.tsx:50-87 |
| S27-P7 | **Med** | **The dashboard "Revenue Over Time" areas + the KPI family's static data.** The reference's revenue chart: `fillOpacity: .6` (won #10b981) / `.3` (target #ef4444), STOCK strokeWidth (1 — no prop), `$` tooltip, `tick:{fontSize:12}`; ours = fillOpacity 0.08 both + strokeWidth 2.5 + stock tooltip + no tick style. The KPI cards: the reference's deltas are STATIC STRINGS — Total Leads `+5.3%`, Revenue This Month `+15%` (plain `text-xs text-green-600 mb-1` divs, no arrow) — and the sparkline data is STATIC: Total Leads `[10,12,11,14,13,15]` line #10b981, Deals Closed bars `[40,55,45,70,60,80,75]` bg-cyan-400, Revenue bars `[30,40,50,45,60,70,80]` bg-green-400, Sales Target bars `[30,45,60,50,70,65,75]` with `E<4 ? "#fbbf24" : "#3b82f6"` + progress as `text-xs text-gray-600` (NEUTRAL — not a green/red delta), Conversion Rate AREA `[25,28,30,29,32,31]` #8b5cf6 fillOpacity .3, Avg. Sales Cycle line `[30,28,29,27,26,26]` #10b981. Ours feeds REAL series (empty at zero) + computed deltas (renders "-100%" red vs the reference's static "+5.3%" green). | bundle @1119750-1123600 + live probes |
| S27-P8 | **Med** | **The dashboard "Lead Sources" + "Upcoming Activities" lists are invented.** Reference Lead Sources rows: `space-y-3` container, `slice(0,4)`, each row `flex items-center justify-between p-2 hover:bg-gray-50 rounded` with the CHECKBOX primitive (`us` — the s17 stock button checkbox, no handler — an inert affordance) + `span.text-sm` "Follow up with {source}" + `span.text-xs text-gray-500` count. Ours: a progress-bar list (source + count + h-1.5 bar) — invented. Reference Upcoming Activities rows: the same p-2 hover row family with CHECKBOX + `p.text-sm` description + `p.text-xs text-gray-500` related_to_name + `span.text-xs text-gray-500` `new Date(date).toLocaleDateString()`; empty = `text-sm text-gray-500 text-center py-4` "No upcoming activities". Ours: colored-dot rows + subject + "type · timeUntil" — invented content model. | bundle @1128503 + @Upcoming extraction + our page.tsx:320-397 |
| S27-P9 | **Med** | **The leads rail charts.** (a) "Pipeline Value by Stage": reference data = the FIVE-status list `["new","contacted","qualified","won","lost"]` (Capitalized labels — "Contacted" elides at 331px, live-verified) with `value` = SUM of lead value by STATUS, Bar `dataKey:"value" fill:"#3b82f6"` + `$` tooltip + tick 12; ours = the 4-stage FUNNEL_STAGES count bars with per-stage colors. (b) "Won vs Lost Over Time": reference = grouped BARS + stock Legend + stock tooltip + tick 12 (last 6 months by status); ours = lines. (c) "Conversion Funnel": reference = FunnelChart with labels **New Leads / Contacted / Qualified / Won** (from STATUS: new / contacted+qualified+won / qualified+won / won) + fills #3b82f6/#8b5cf6/#10b981/#22c55e + LabelList position right fill #000; ours = New/Qualified/Won/Lost from stage with STAGE_META colors. (Invisible at the reference's zero data — bundle-level parity.) | bundle `Xke` @1145800-1149200 + live /Leads (ticks New/Qualified/Won/Lost = the 5-list with "Contacted" elided) |
| S27-P10 | **Med** | **The activities by-type chart internals.** Reference: Bar `dataKey:"count" fill:"#3b82f6" radius:[4,4,0,0]`, `tick:{fontSize:10}` both axes, NO grid (no CartesianGrid!), no maxBarSize, no interval; ours = per-type Cell colors + radius [6,6,0,0] + maxBarSize 36 + interval 0. (The chips row below keeps the per-type colors — pinned.) | bundle @968862 + our activities-page.tsx:523-532 |
| S27-P11 | **High** | **The calendar day cells + chips + rail rows (the s45 pointer).** (a) Day NUMBER: reference = plain text `text-xs sm:text-sm font-medium mb-1` (+ `text-white` when today) — NO circle/pill; ours = an `h-6 w-6 rounded-full` circle with a today `bg-primary` fill. (b) Event CHIPS: reference = `text-xs px-1 py-0.5 rounded truncate cursor-pointer` with the TYPE TINT classes (`bg-*-100 text-*-800` from the map `{meeting:blue, call:green, demo:purple, task:orange, reminder:yellow, appointment:cyan}` + solid `bg-*-600` dots `w-1.5 h-1.5 rounded-full mr-1`) + title ONLY (no time prefix) + `onClick → EDIT dialog` + `title` attr + `bg-white/20 text-white` on today; ours = solid-color chips with white text + a TIME prefix, not clickable. (c) "+N more": reference = a separate line AFTER the chips `text-xs ${today?"text-white":"text-gray-500"}` reading "+N more"; ours = an inline "+N" next to the day number. (d) Upcoming Events rows: `flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50` with a TALL BAR `w-2 h-12 rounded-full ${dot}` + title `font-medium text-gray-900 truncate` + `text-sm text-gray-600` "MMM d, h:mm a" + optional related line + THREE ghost icon buttons (edit h-8 w-8 + phone-on-call + more); ours = dot rows with a different text model. (e) Agenda rows: `flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50` with a 40×40 TINTED SQUARE `w-10 h-10 rounded-lg ${bg}` + inner `w-2 h-2 rounded-full ${dot}` dot + title + the Edit/Delete DROPDOWN (the ••• ghost button family); the list = the FILTERED events (search + type + dateRange filters), slice(0,10) — NOT a selected-day list; ours = selected-day cards with inline buttons (our invented superset). | bundle @1009369 (B map) + @1012150 (cells) + @1013700 (upcoming/agenda) + our calendar-page.tsx:285-430 |

**Census-method lessons this session (→ SKILL §16s):**

- **The chart-internals family was invisible at zero data for 26 sessions** —
  fills, formatters, radii, tick styles, chart TYPES (line vs bar vs pie),
  and row-derived-ness are ALL zero-invisible. The bundle gives every one.
  Never pin a chart's internals from its zero-data DOM alone.
- **The reference HARDCODES its KPI sparklines and deltas** — the dashboard
  sparks `[10,12,11,14,13,15]`/`[40,55,45,70,60,80,75]`/…, the reports
  sparks `[65,72,68,85,78,92]`, the deltas "+5.3%"/"+15%" — static strings,
  not computed series. Our "real data" model was the divergence.
- **The bundle contains DEAD paths** — the leads funnel cluster found first
  (New Leads/Contacted/Qualified/Won) is NOT the rendered funnel's data
  source until cross-checked: the live DOM (ticks New/Qualified/Won/Lost =
  the 5-status list with "Contacted" elided by recharts at 331px) is ground
  truth for what RENDERS; the bundle is ground truth for the WITH-DATA
  contract. Both checks are required before remediation.
- **Recharts tick elision can fake a vocabulary** — the reference's leads
  pipeline ships FIVE stages but renders four ticks at 331px ("Contacted"
  elided). Never read a chart's vocabulary from rendered ticks alone; the
  data construction in the bundle is the truth.
- **Cache the bundle OUTSIDE the page** (`curl` to a local file) — the
  in-page `window.__BUNDLE` cache dies on every SPA navigation and the
  eval failures look like syntax errors.

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. New `tests/charts-internals.test.ts` (~28 checks, source-pin + pure
   helper): the reconfigured `src/components/charts/charts.tsx` family —
   `SingleBarChart` (fill/radius/formatter/tick props per surface), the
   grouped-bar pair, `SingleLineChart` (+$ formatter variants), the label
   PIE family (outerRadius 90/100, the two label formatters, the two
   palettes [#10b981,#f59e0b,#ef4444] and [#3b82f6,#06b6d4,#8b5cf6,
   #ec4899,#f97316]), the horizontal bar (YAxis width 100/120, fills
   #06b6d4/#3b82f6), the aging XAxis "age", the by-type radius [4,4,0,0]
   + tick 10 + NO grid, the funnel's YAxis width 100 single fill.
2. New `tests/account-health-tab.test.ts` (~14 checks): the pure
   `accountHealth()` seam (the days>60‖lost → At Risk / days>30 → Needs
   Attention / else Healthy rules; 999 → "Never"; the "Nd ago" format);
   the API's accountHealth/atRiskAccounts/topAccounts computations (the
   sort, the slice 20, the computed vocabulary); the tab-5 page pins (the
   PIE wiring, the Top-10 horizontal chart, the bg-red-50 at-risk rows +
   the red Badge "At Risk", the outline-Badge summary status, industry "-").
3. New `tests/dashboard-contracts.test.ts` (~18 checks): the pipeline
   chart (single #3b82f6 fill + radius [8,8,0,0] + value dataKey + $
   formatter + tick 12) + the LEGEND_CHIP class map (the six bg-*-500
   entries + the Won→bg-gray-400 fallback + `w-3 h-3 rounded` squares +
   `text-gray-600` + the `$${(v/1e3).toFixed(1)}k` format); the revenue
   fillOpacity .6/.3 + stock strokeWidth + $ formatter; the KPI static
   deltas ("+5.3%", "+15%", the neutral text-gray-600 Sales Target
   progress) + the six static spark arrays + their colors/variants; the
   Lead Sources row family (checkbox + "Follow up with" + p-2 hover +
   slice 4); the Upcoming Activities row family (checkbox + description +
   related + toLocaleDateString + the py-4 empty state).
4. New `tests/leads-charts.test.ts` (~8 checks): the 5-status pipeline
   vocabulary (incl. "Contacted") + value sums + single-blue fill + $
   formatter; the wonlost grouped bars + stock legend; the funnel
   labels/colors (New Leads #3b82f6 / Contacted #8b5cf6 / Qualified
   #10b981 / Won #22c55e) + the status-based cumulative counts.
5. New `tests/calendar-cells.test.ts` (~16 checks): the day-number
   plain-text classes (no circle); the chip family (the six-type tint map
   with bg-100/text-800/dot-600 triples, the dot span, title-only text,
   cursor-pointer + onClick → edit, the title attr, the today bg-white/20
   variant); the "+N more" line (text + classes + position); the upcoming
   row family (w-2 h-12 bar + "MMM d, h:mm a" + related line + the three
   icon buttons); the agenda row family (the 40×40 square + dot + the
   dropdown Edit/Delete + the filtered-list slice 10).
6. E2E additions in `tests/e2e/crm.spec.ts` (~8 checks): the reports tab-5
   renders the PIE (a .recharts-pie sector set) + the top-10 horizontal
   bars + the seeded at-risk rows tinted red with the red "At Risk"
   badges + the summary outline badges; the dashboard Lead Sources rows
   render "Follow up with" + checkboxes; the KPI sparklines present; a
   calendar chip click opens the edit dialog (seeded events); the
   activities by-type bars are single-blue.

### Phase B — implementation

1. **S27-P1/P2**: the `accountHealth()` pure seam in `src/lib/`
   (reports-data or a new account-health seam) + the API rewire (computed
   health distribution, at-risk slice 20, top-10 sorted) + the tab-5
   rendering (LabelPie + horizontal Top10 + the red-tinted table + the
   outline badges).
2. **S27-P3/P4**: the tab-1/2/3/4 chart rewires through the new
   parameterized chart family; the tab-1 pipeline becomes row-derived
   (empty at zero); the tab-2 caption structure; the overdue rows tint.
3. **S27-P5**: the reports KPI cards — the static spark array + the Lost
   Deals subtitle split + toLocaleString.
4. **S27-P6/P7/P8**: the dashboard pipeline chart + legend chip family +
   the revenue areas + the KPI static deltas/sparks + the two checkbox
   lists.
5. **S27-P9**: the leads rail rewires (the 5-status pipeline, the grouped
   bars, the funnel vocabulary/colors).
6. **S27-P10**: the by-type chart reconfig.
7. **S27-P11**: the calendar cell/chip/upcoming/agenda rebuild.

### Phase C — gate + live re-verification

Full gate: `bun run lint` → `bun run typecheck` → `bun run test` (565+) →
`bun run build` → `bun run test:e2e` (95+). LIVE on the dev server: the
tab-5 surfaces with SEEDED data (the PIE sectors, the sorted top-10, the
red at-risk rows — seeded health vocabulary, the summary badges); the
dashboard (single-blue bars, the legend chips with the exact computed
colors, the checkbox lists with seeded sources/activities, the static
deltas/sparks); the leads 5-stage pipeline; the calendar chips (seeded
events → clickable → the edit dialog); the standing layers spot-check
(drawer, tabs, typography, the 390px overflow sweep).

### Phase D — deliverables

The established screenshot set re-captured under `docs/screenshots/`
(26 shots + the new surfaces: the tab-5 Account Health with data, the
dashboard lists); `.env`/`.env.example` re-verified (no new env surface);
docs realigned (README badge + counts, AGENTS counts + the session-27
contract blocks, CLAUDE counts + the new suites, PAD matrix + the §5
blocks, SKILL v1.24.0 §16s + frontmatter + project_state,
`docs/session_47.md`, this plan's addendum, both worklogs); commit on
main + SSH-wrapper push.
