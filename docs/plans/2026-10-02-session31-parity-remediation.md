# Session 31 Plan — the Opportunity-split remediation (the LAST s51 pointer)

Date: 2026-10-02 · Branch: `main` · Base: `fd9bf74` (docs/session_54.md only — zero app-code drift)

## Context

Session-30 closed the photo-upload pointer (dcf942b + 0fc862b, gate 741/741 unit ·
106/106 e2e, SKILL v1.27.0). The s53 Next-steps named three pointers: **the
Opportunity-split question** (the model-level seam — the LAST s51 pointer), the
Scan Card / Import AI extraction (base44-only, documented), and the standing
drift re-sweep. This session closes the first, backed by the full bundle decode.

## Audit results

### Standing layers — 27th consecutive session, NO DRIFT

- The reference at a TRUE 390px viewport: 8 nav links in the DOM, **0 visible**
  (nav box w=0), no hamburger — the mobile-nav defect STANDS. (Census hazard
  re-learned: `agent-browser set viewport` takes POSITIONAL args — `--width`/
  `--height` flags print usage and silently leave the viewport at 1512, which
  false-positived "8 visible links" until the rigorous computed-style probe at
  a verified 390px width.)
- Our drawer spot-verified live (dev server, 390px): the REAL "Open navigation
  menu" trigger → 8 links visible + focus inside the drawer + body scroll lock;
  Escape → 0 visible, lock released, drawer closed. The 7-check e2e suite is
  green in the baseline gate.
- Zero 390px horizontal overflow on all nine authed routes on BOTH apps.
- The reference bundle is BYTE-IDENTICAL to the s30 cache
  (`/assets/index-DZ-xbrIm.js`, 1,631,071 bytes, md5 match) — no redeploy,
  every s29/s30 bundle contract intact.

### The NEW decode — the Opportunity entity (the reference's second deal model)

The bundle ships a full **Opportunity entity** the clone never modeled. It has
NO create/edit UI anywhere (the leads-table "Convert to Opportunity" item is
DEAD — no onClick; no "New Opportunity" dialog exists) — its data feeds the
dashboard, ALL FIVE reports tabs, and both insights surfaces:

- **Fields (from usage)**: `name`, `account_name` (the account NAME STRING, no
  relation), `stage` (prospecting/qualification/proposal/negotiation/
  closed_won/closed_lost), `amount`, `probability` (0-100), `close_date`,
  `source`, `owner` (the owner NAME STRING), `created_date`/`updated_date`.
- **Badge tints (the P map)**: prospecting blue-100/blue-800, qualification
  purple-100/purple-800, proposal yellow-100/yellow-800, negotiation
  orange-100/orange-800, closed_won green-100/green-800, closed_lost
  red-100/red-800. **Solid chips (the O map)**: blue-500/cyan-500/yellow-500/
  orange-500/green-500/red-500.
- **Dashboard (Eke)**: the "Sales Pipeline" chart = the 5 OPP stages with
  VALUE sums (labels Prospecting/Qualification/Proposal/Negotiation/Won);
  "Revenue Over Time" = won opps grouped by **updated_date month** over the
  FIXED 7-label window `["Nov","Dec","Jan","Feb","Mar","Apr","May"]` (the
  labels are HARDCODED — they do not track the data months; the reference's
  own quirk) with `target = 55000 + random*10000`; Top Reps = won opps by
  owner string `{name, deals, value}` sorted value-desc slice(0,3); Recent
  Deals = opps sorted by updated_date desc slice(0,5); KPIs: dealsClosedValue
  = WON-OPP amount sum, revenueThisMonth = won opps with updated_date in the
  current month, **salesTarget HARDCODED 0 + targetProgress 0** (the bundle's
  literal `V=0`), conversionRate = won LEADS / total leads (`.toFixed(1)`),
  avgSalesCycle = the average AGE of won leads (`floor((now − created)/day)`
  per lead, averaged, rounded — NOT created→closed).
- **Recent Deals row (bundle-decoded, unverifiable at zero data until now)**:
  Lead cell `td.py-3` flex gap-2 = w-8 h-8 bg-gray-200 icon box + the
  name/account_name stack (text-sm font-medium / text-xs text-gray-500);
  Company `td.text-sm` account_name; Deal Value `td.text-sm font-semibold`
  `$${amount.toLocaleString()}`; Status = the P-map badge, text
  `stage==="closed_won" ? "Won" : stage` (RAW slug); Owner = flex gap-2 w-6
  h-6 bg-blue-100 box + `span.text-sm` owner string; Close Date
  `td.text-sm.text-gray-600` `toLocaleDateString()`; second Status =
  **OUTLINE badge text-xs with the copy-paste quirk** `"Contacted"` (or
  `"Proposal"` when negotiation — a reference bug, mirrored); trailing ghost
  h-8 w-8 more-horizontal.
- **Top Reps row (same class)**: w-8 h-8 bg-blue-100 text-blue-600 text-xs
  font-semibold INITIALS box + name (text-sm font-medium) + "Top Admin"
  subtitle (text-xs text-gray-500); right: `$${(value/1e3).toFixed(0)}k`
  (text-sm font-semibold) + the Won/Active badge (deals>0 ? green-100
  text-green-800 "Won" : blue-100 text-blue-800 "Active"). Header row: Sales
  Rep / Deals / Owner (gap-8).
- **Reports filter model**: OPPS filtered by period(created_date) + stage +
  source + owner + status(open=neither-closed / won / lost); LEADS by
  period(created_date) + source; ACTIVITIES by period(date). The owner
  dropdown lists the DISTINCT OPP owner strings. Default period "quarter".
- **Reports KPI row**: totalLeads = filtered LEADS; openLeads = leads with
  status new+contacted ONLY (NOT qualified); won/lost count+value = OPPS;
  conversionRate = opps `won/(won+lost)*100 .toFixed(1)`; the sparks the
  static [65,72,68,85,78,92].
- **Reports tab 1 (Sales Overview)**: Revenue Over Time = won opps by
  close_date month (`revenue` = amount sums, single #3b82f6 line); Won vs
  Lost = opp counts by close_date month; Pipeline by Stage = OPEN opps
  grouped by stage (RAW slug ticks) with VALUE sums (#8b5cf6, "Value ($)",
  plain-number tooltip); **Conversion Funnel = the 8-slug CONCATENATION:
  leads' new/contacted/qualified (by lead status) + opps' prospecting/
  qualification/proposal/negotiation/closed_won (by opp stage)** — the s10
  "merged-list double-report" interpretation was a zero-data-inferred
  approximation, now corrected; Recent Won Deals = won opps slice(0,10)
  (Deal/Account/Amount, "No won deals"); Top Deals by Value = ALL opps
  amount-desc slice(0,10) (Deal/Stage-outline-badge/Amount, "No deals").
- **Reports tab 2 (Pipeline & Forecast)**: Forecasting Accuracy = CLOSED opps
  with close_date+created_date grouped by close_date month:
  `forecasted += amount * (probability||50)/100`, `actual += (won &&
  amount) || 0`, `accuracy = (actual/forecasted*100).toFixed(1)` (NOT our
  clamped `100−|diff|` formula), average = mean of parseFloat; Forecast by
  Probability = OPEN opps, bands 0-25/26-50/51-75/76-100 by
  `probability||0`, value = AMOUNT sums (pie, `${band}%: $${(v/1e3)
  .toFixed(0)}K` labels, palette 3b82f6/06b6d4/8b5cf6/ec4899); Aging
  Pipeline = OPEN opps by age = now − created_date into the fixed 4 buckets
  (NOT updatedAt); Open Deals by Stage = open opps slice(0,10) in list order
  (Deal / Stage outline badge / `$${amount.toLocaleString()}`); Deals at Risk
  = open opps whose LAST related activity (`related_to_id === opp.id`,
  date-desc) is >14 days old — or NO activity (999 sentinel) — slice(0,20),
  rows bg-red-50, CSV prefixes `open_deals_` / `deals_at_risk_`.
- **Reports tab 3 (Activity)**: Activities vs Wins = activity months + won
  OPP counts by close_date month; Overdue Activities = past-date non-Note
  activities slice(0,20); Activity Log by Owner = `created_by||"Unassigned"`
  sorted desc slice(0,10).
- **Reports tab 4 (Lead Sources)**: Leads by Source = LEADS (unchanged);
  Win Rate by Source (%) = OPPS `won/(won+lost)` per source; Avg Deal Value
  by Source = `Math.round(total/count)` per source (OPPS); Source
  Performance Summary = leads-count from LEADS + won/lost/revenue from OPPS
  (revenue `$${(v/1e3).toFixed(0)}K`).
- **Reports tab 5 (Account Health)**: the computed health's
  `hasLostDeals` rule = **closed_lost OPPS by account_name** (not lost
  leads by accountId).
- **Ece Account Insights**: opps filtered `account_name === account.name`;
  Total Revenue `$${(f/1e6).toFixed(1)}M` (won-opp sum); the Open Deals
  COUNT card = opps where `stage !== "closed_lost"` (INCLUDES won — the
  reference's own quirk); the Open Deals TAB = opps neither closed.
- **Pke Contact slide-over**: the Deals tab = opps where
  `account_name === contact.company`.
- **Reset flow**: deletes opportunities (its confirm message already says
  so).

## The remediation — S31-P1..P6

- **S31-P1 — the Opportunity entity**: Prisma `Opportunity` model (name,
  accountName, stage, amount, probability?, closeDate?, source?, owner?,
  createdAt, updatedAt; indexes on stage/accountName) + `OPP_STAGE_META` /
  `OPPORTUNITY_STAGES` / the P + O maps in constants (PIPELINE_STAGES
  redefined as the OPP stage vocabulary — the dashboard's stage select +
  chart ride it; labels unchanged) + the seed dataset (won 4 = 87k+145k+39k+
  66k = **$337.0K**, lost 2 = 64k+28k, open 6 across the four open stages =
  525k pipeline, tied to the seeded accounts, owners = the seeded users'
  names, plus Opportunity-related activities for the at-risk computation) +
  `db.opportunity.deleteMany()` in the reset route + `GET
  /api/opportunities` (session-guarded, createdAt-desc) + the store's
  `opportunities` slice in hydrate + the serialized `Opportunity` type.
- **S31-P2 — the dashboard re-derivation**: /api/dashboard computes from
  opps (pipeline 5-stage value sums, revenue by updated_date month over the
  FIXED Nov..May labels + 55k+random targets, KPIs: dealsClosedValue/
  revenueThisMonth from won opps, salesTarget/progress = the hardcoded-0
  quirk, avgSalesCycle = the won-lead AGE formula, conversionRate
  toFixed(1)) + topReps `{name, deals, value}` (owner strings, slice 3) +
  recentDeals = opps slice(0,5); the page: the Top Reps row rebuild
  (initials box + "Top Admin" + $Xk + Won/Active badge) + the Recent Deals
  row rebuild (the icon-box stack, $ toLocaleString, the P-map RAW badge,
  the Contacted/Proposal outline-quirk badge) + the filter bar rewired to
  the opp set.
- **S31-P3 — the reports re-derivation**: /api/reports — the filter model
  on opps (period/stage/source/owner/status; leads by period+source only),
  the KPI row (openLeads = new+contacted; won/lost from opps;
  conversionRate opp-based), the 8-slug funnel SPLIT (reports-data.ts:
  `pipelineStageCounts(leads, opps)`), Revenue/WonLost by close_date month,
  pipelineByStageRows = open opps (raw slug labels), the forecast-accuracy
  formula rewrite (`forecastAccuracySeries(closedOpps)` — actual/forecasted),
  probability bands from `opp.probability`, aging from createdAt, at-risk
  via the last related activity (relatedType "Opportunity" + relatedName
  match, >14d or never), the sources tab (winRate/avgValue/performance from
  opps), account health's lost rule from opps; the page: the row-count
  fixes (10/10/10/20), the `$${amount.toLocaleString()}` cells, the outline
  RAW-slug stage badges, the bg-red-50 at-risk rows, the revenue chart's
  `{month, revenue}` shape.
- **S31-P4 — the insights surfaces**: Ece (opps by accountName; Total
  Revenue $X.XM; the !== closed_lost count quirk; the open-deals tab) + Pke
  (the Deals tab from opps by company) — both fed from the store's
  opportunities slice.
- **S31-P5 — the tests (RED first)**: the new `tests/opportunity-model
  .test.ts` (the stage vocabulary + maps + the schema/seed/API/store pins)
  + the `tests/reports-data.test.ts` rewrite (the split/accuracy/aging/
  at-risk seams) + `tests/dashboard-contracts.test.ts` extensions (the
  hardcoded-0 target, the fixed labels, the opp-fed shapes, the two row
  contracts) + `tests/account-health.test.ts` (the opp lost rule) + the
  e2e updates (the reports All-Time pin → "4 $337.0K", the insights
  opp-based rows, the dashboard row contracts).
- **S31-P6 — the gate + deliverables**: lint 0/0 · tsc 0 · unit (741 + new)
  · build · e2e (106 + updates) · LIVE verification on the restarted dev
  server · the screenshot set · docs realignment (README/AGENTS/CLAUDE/PAD/
  SKILL v1.28.0/session_55.md/this plan + both worklogs) · .env/.env.example
  re-verified · commit + SSH-wrapper push.

## Validation gates

- RED-first: the new suites must fail against the current code (the s29/s30
  TDD doctrine).
- GREEN: lint 0/0 · tsc 0 · unit (741 + new) · build · e2e (106 + updates).
- LIVE: the seeded dashboard/reports/insights render the opp-derived numbers
  on the dev server; the drawer + zero-overflow layers re-spot-checked.

## Deferred (documented, not this session)

The Scan Card / Import AI extraction (base44-only), the Opportunity
create/edit UI (the reference ships NONE — read-only entity, mirrored), the
reference's in-memory saved-views (documented superset stands).

---

## EXECUTION RECORD (2026-10-02, post-gate)

Executed as planned, S31-P1..P6 all landed:

- **S31-P1**: the Prisma `Opportunity` model (accountName/owner as NAME
  STRINGS — the reference's model), OPPORTUNITY_STAGES + OPP_STAGE_META
  (the P badge map) + the O solid map, PIPELINE_STAGES redefined to the
  opp vocabulary, reportsBucketCounts RETIRED, the seed (12 opps: 4 won
  = $337.0K, 2 lost, 6 open + 3 Opportunity-linked activities), the
  list-only GET /api/opportunities, the store slice in hydrate, the
  reset wipe, the serialized type.
- **S31-P2**: /api/dashboard rewritten to the Eke memo (the opp-fed
  pipeline/revenue/Top Reps/Recent Deals/KPIs incl. the HARDCODED-0
  sales target + the FIXED Nov..May labels + the won-lead AGE cycle);
  the page's Top Reps + Recent Deals rows rebuilt to the bundle
  contracts (incl. the Contacted/Proposal second-Status QUIRK).
- **S31-P3**: /api/reports rewritten to the opp filter model (opps by
  period/stage/source/owner/status; leads by period+source; activities
  by the BOTH-ends [start, now] window), the KPI row (openLeads =
  new+contacted), the 8-slug funnel SPLIT, the insertion-order "MMM
  yyyy" series, the actual/forecasted accuracy, the opp-probability
  bands, the created-date aging, the last-activity at-risk join, the
  opp-based sources + account health, the 10/10/10/20 tables with
  $ toLocaleString + raw-slug outline badges + bg-red-50 rows; the page
  + the export route's type=report rewire.
- **S31-P4**: the Ece insights (the account_name join, $X.XM revenue,
  the !== closed_lost COUNT quirk, the open-deals tab) + the Pke Deals
  tab (opps by contact.company).
- **S31-P5**: RED 41 first; GREEN at **779/779 unit (+38: the new
  opportunity-model 21 + the reports-data rewrite 15 + the
  dashboard-contracts extensions)** · **106/106 e2e** (the reports pin
  → "4 $337.0K"; the health-tab test now selects All Time — its
  at-risk rule is period-dependent exactly like the reference's).
- **S31-P6**: LIVE-verified on the restarted dev server (every surface
  probed at the exact values — the $0 target, 109.5% accuracy, the
  count quirk); 8 screenshots (38 + 39 new, VLM-verified); docs at
  SKILL v1.28.0 (§16w); .env/.env.example re-verified.
- Standing layers: 27th session, NO DRIFT (the mobile-nav absence at a
  TRUE 390px, our drawer live, zero overflow both apps, the bundle
  byte-identical).
