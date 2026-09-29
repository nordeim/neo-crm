# Session 5 Remediation Plan — Interactive-Layer Parity (2026-09-29)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `b9f388f`
(baseline gate green: lint 0/0 · tsc clean · 68/68 unit; build + 21/21 e2e
green at push time `988ca79`, only docs changed since). The reference's demo
data is still **reset to zero**, so parity continues to target structure —
but this session's audit went one layer deeper than session 4: beyond static
anatomy into **dialogs, option vocabularies, table density, responsive column
hiding and per-page formatting variants**. Every item below is evidence-backed
by `outerHTML` / class-list / listbox-option extraction on the logged-in
reference (no VLM screenshot reads).

**Method:** TDD — every pure-seam behavior change (stage/source vocabularies,
currency variants, dropped-stage predicate) lands with a failing unit test
first; UI changes land with the full gate plus browser re-verification at
1512×945 and 390×844. The `skills/` folder stays excluded from all checking,
testing and compilation.

**Baseline evidence:** `/home/z/my-project/live-s5/` (fresh live captures),
DOM extraction transcripts in this session log.

**Reference quirks deliberately NOT copied** (documented fixes over defects —
carried forward from session 4 plus new confirmations):

- The **duplicate "Status" column** in the dashboard Recent Deals table (the
  reference renders Lead/Company/Deal Value/Status/Owner/Close Date/**Status**/
  w-8 — the same status twice; we keep six unique columns plus the trailing
  action column).
- The **dead dashboard buttons**: header "Add", "More…", and the card "Add"
  buttons open nothing on the reference (0 dialogs/menus, no navigation).
  Ours open a working quick-create menu / link to Leads.
- The **dead login buttons**: "Need an account? Sign up" and "Forgot
  password?" are handler-less `<button>`s and `/signup` 404s on the reference.
  Ours ship a working `/signup` page.
- The **static "Last 2 days" caption** on the activities by-type chart (the
  reference's caption ignores the selected filter range — session-3 decision
  reaffirmed: our caption is honest/dynamic).
- The **raw `closed_won` stage keys** in the reference reports funnel.
- The **missing mobile navigation** (re-confirmed at 390×844: zero nav
  elements; our drawer remains the fix — full functional re-verification this
  session: trigger → drawer visible → 8 links → focus moves into panel →
  Escape closes → scroll lock released).
- The reference's **internally inconsistent stage vocabularies** (its create
  dialog offers New/Contacted/Qualified/Unqualified while its own charts
  display Won/Lost — statuses the dialog cannot produce). We align the CREATE
  dialog to the reference's four options and keep the full pipeline for edit.

---

## Identified Issues, Bugs and Gaps (all DOM-verified)

| # | Sev | Issue | Evidence (live DOM) |
|---|-----|-------|---------------------|
| S5-1 | High | **Entity-table density**: reference ships stock-shadcn cells — th `h-10 px-2` (size inherited from table `text-sm`), td `p-2`. Ours: th `h-10 px-4 text-xs` (+`whitespace-nowrap`), td `px-4 py-3` — visibly wider/taller rows and smaller header text. | `th`/`td` class extraction on accounts/contacts/leads |
| S5-2 | High | **Per-page table headers + wrappers**: contacts headers are `font-semibold text-gray-700` (bolder/darker than the other tables' `font-medium text-muted-foreground`) and the Name th carries `cursor-pointer w-64`; wrappers differ per page — accounts + leads `bg-white rounded-lg shadow` (no border), contacts `bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden`. Ours: uniform wrapper + uniform header style. | th/wrapper class extraction on all three pages |
| S5-3 | High | **Empty-state rows**: reference centers copy in the first td with `text-center py-8` (accounts/leads) / `py-12` (contacts), `text-gray-500`, full colspan. | empty-td outerHTML on all three pages |
| S5-4 | High | **Recent Deals is a compact custom table**, not the shared Table: tr `text-xs text-gray-500 border-b`, th `text-left py-2 font-medium` (no horizontal padding — the `p-6 pt-0` card provides gutters), trailing `w-8` action th. Ours reuses the dense shared Table with px-4 cells. | Recent Deals thead outerHTML + card wrapper |
| S5-5 | High | **Leads table responsive column hiding**: Phone `hidden md:table-cell`, Company `hidden lg:table-cell`, Source `hidden xl:table-cell` (th and td). Ours show all 9 columns at every width (horizontal scroll only). | hidden-class map on leads th |
| S5-6 | High | **Activities stat-card delta positions**: only two deltas live in the header row — Activities Today `+23%` (green + trending-up icon) and Overdue `2h overdue` (red + trending-down icon). All other annotations are **gray `text-xs text-gray-500 mt-1` subtexts UNDER the value**: `+7 today` (Emails), `+4 today` (Calls), `+1h 12m` (Meetings, with plus), `Due now` (Overdue, static — no count). Ours renders every delta in the header row (green/red/muted). Bars are `h-10 w-20` at ALL widths (ours adds `sm:w-24`). | all six activity cards' outerHTML |
| S5-7 | High | **Reports KPI cards**: icon chip is a **square `w-10 h-10 rounded-lg bg-{c}-50`** tint (ours: round `rounded-full h-12 w-12`); label `text-xs text-gray-500 mb-1` plain (ours adds font-medium/tracking-wide); value row is **count + amount inline, both `text-2xl font-bold`** ("0 $0.0K" — ours nests the amount as a smaller `text-sm` span); gap-3; **currency is uppercase-K on this page** — Won `$0.0K` (1 decimal), Lost `$0K` (0 decimals). | reports card outerHTML × 5 |
| S5-8 | High | **Leads KPI cards**: value `text-xl sm:text-2xl font-bold` (ours text-3xl), label `text-xs sm:text-sm text-gray-600` plain (ours text-sm font-medium), padding `p-4 sm:p-6` (ours p-6), chip `w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-{c}-50 text-{c}-600` (ours fixed h-10 w-10), no hover shadow (ours has one), and **currency is FULL format** — the reference prints `$0` where the dashboard prints `$0.0k`, i.e. plain `formatCurrency` → `$687,000`. | leads card outerHTML × 6 + zero-value comparison vs dashboard |
| S5-9 | High | **Card primitives**: reference CardHeader `flex flex-col space-y-1.5 p-6`, CardContent `p-6 pt-0`, CardTitle `font-semibold tracking-tight text-base sm:text-lg` (ours: p-5 pb-3 / p-5 pt-2 / text-sm). Affects every chart/table/filter card. | chart + Recent Deals card outerHTML |
| S5-10 | High | **Create Lead dialog**: label "Status" (ours "Stage"); options **New/Contacted/Qualified/Unqualified** (ours 7 pipeline stages); Source options **Call/Email/Website/Partner** (ours the 8-item settings list); **no date fields** (ours ships Expected Close + Next Follow-up); fields are **single-column stacked** in a `max-w-lg` dialog (ours 2-col grid pairs). | dialog labels/options extraction |
| S5-11 | High | **Create Account dialog**: exactly 8 fields — Account Name*, Industry, Email, Phone, Website, Annual Revenue, Employees, Status (ours adds Tier/Owner/Key account and orders Website before Email/Phone); single-column. | dialog labels + triggers |
| S5-12 | High | **Create Contact dialog**: Email is required (`Email *`); the source field is labeled **"How did you meet?"** with emoji options **📞 Phone Call / ✉️ Email / 🌐 Website / 🤝 Partner Referral / 👥 Personal Referral**; **no Priority field**; single-column. Ours: optional email, "Source" + settings list, Priority select, 2-col grid with section headers. | dialog labels + listbox options |
| S5-13 | High | **New Event dialog**: labels "Event Type *", "Start Date & Time *", "End Date & Time"; Event Type options **Meeting/Call/Demo/Task/Reminder/Appointment** (ours 4: Appointment/Call/Meeting/Task); a **"Related To" select** (None/Contact/Account/Opportunity/Lead) that ours lacks entirely. | dialog labels + two listboxes |
| S5-14 | High | **Log Activity dialog**: labels "Activity Type *", "Date & Time *", "Description *", **"Related To (Type)" + "Related To (Name)"** (two dependent selects — ours has a single contact-only "Related to"); **no Status select** (ours ships one); single-column. | dialog labels + selects |
| S5-15 | High | **Dashboard filter vocabularies**: "All Stages" offers the **pipeline stages** Prospecting/Qualification/Proposal/Negotiation/Won (ours offers the 7 lead statuses); "All Sources" offers **Call/Email/Website/Partner** hardcoded (ours the settings list). | both listboxes on the dashboard |
| S5-16 | Med | **Avg. Sales Cycle suffix**: "days" is a sibling span `text-xs text-gray-600 mb-1` (ours a nested `text-sm` span inside the value). | dashboard card outerHTML |

Supporting data-model decisions (to keep the app internally consistent with
the reference's dialogs):

- **D-1**: add stage `unqualified` (gray badge) to `STAGE_META` + `LEAD_STAGES`;
  dropped-deals = `lost` **+** `unqualified` via a new `isDroppedStage()`
  seam used by the leads page, dashboard API and reports API. Create dialog
  offers the reference's four statuses; edit keeps the full list.
- **D-2**: `LEAD_SOURCES` → **Call/Email/Website/Partner**;
  `CONTACT_SOURCES` → the five emoji sources; seed + `DEFAULT_SETTINGS`
  follow, so the dashboard Lead Sources card, contacts Source column and
  settings picklists agree with the dialogs (the reference's own settings
  lists are empty/disconnected — our seeded lists are the documented upgrade).
- **D-3**: currency display stays `$`-attached everywhere, with per-page
  variants now DOM-pinned: dashboard compact lowercase (`$687.0k`), reports
  compact **uppercase K** (`$542.0K` won / `$196K` lost), leads page **full**
  (`$687,000`).

---

## ToDo List (execution order)

### Phase A — Pure seams, TDD (failing tests first)

- [ ] **A1. `src/lib/constants.ts`**: add `unqualified` to `LEAD_STAGES` +
  `STAGE_META` (gray badge/chart hex); add `isDroppedStage()`; `LEAD_SOURCES`
  → `["Call","Email","Website","Partner"]`; `CONTACT_SOURCES` → the five
  emoji sources; `EVENT_TYPES` → `["meeting","call","demo","task","reminder","appointment"]`
  with meta (labels/colors); update `DEFAULT_SETTINGS.contactSources` +
  `leadStages`. New unit checks in `tests/constants.test.ts` pin every value.
- [ ] **A2. `src/lib/format.ts`**: `formatCompactCurrency(value, { decimals =
  1, upper = false })` — reports uses `upper: true` (won 1-dec, lost 0-dec).
  Extend `tests/format.test.ts` (red first): `$687.0K`, `$196K`, `$0K`,
  existing lowercase defaults unchanged.
- [ ] **A3. Dropped-stage adoption**: replace `l.stage === "lost"` /
  `!== "won" && !== "lost"` open/dropped logic with `isDroppedStage()` in
  `leads/page.tsx`, `api/dashboard/route.ts`, `api/reports/route.ts`
  (reports "Lost Deals" keeps counting `lost` only — the reference labels the
  card "Lost Deals", and our dropped superset only feeds the leads page).

### Phase B — Shared components

- [ ] **B1. `ui/table.tsx`**: th → `h-10 px-2 text-left align-middle font-medium
  text-muted` (drop `text-xs`, `whitespace-nowrap`, `px-4`); td → `p-2
  align-middle` (drop `px-4 py-3`). Add `headerClassName` passthrough already
  exists via `className`.
- [ ] **B2. `ui/card.tsx`**: CardHeader `p-6` + `space-y-1.5`; CardContent
  `p-6 pt-0`; CardTitle `text-base sm:text-lg font-semibold tracking-tight`.
- [ ] **B3. `page-parts.tsx`**: KpiCard "days"-suffix variant — render
  `suffix` as a sibling `text-xs text-muted mb-1` span (not nested text-sm);
  `BarStatCard` gains an optional `subText` slot rendered under the value in
  `text-xs text-muted mt-1` and keeps header deltas for %/overdue only;
  `IconStatCard` gains the leads-page variant (label `text-xs sm:text-sm`
  plain, value `text-xl sm:text-2xl font-bold`, chip `w-8 h-8 sm:w-10 sm:h-10
  rounded-lg` tinted, `p-4 sm:p-6`, no hover shadow); `CircleStatCard`
  reworked to the reports anatomy (square `rounded-lg w-10 h-10` tinted chip,
  label `text-xs text-muted mb-1`, value+amount inline `text-2xl font-bold`,
  gap-3, mb-3 header).
- [ ] **B4. Empty-state row helper**: `text-center py-8`/`py-12` +
  `text-muted` td with full colspan (per-page py).

### Phase C — Dashboard

- [ ] **C1.** Recent Deals table → compact custom table (`tr text-xs
  text-muted border-b`, th `text-left py-2 font-medium`, trailing `w-8` th,
  inside the existing card's `p-6 pt-0` content) — six unique columns, no
  duplicate Status (documented quirk).
- [ ] **C2.** All Stages select → `PIPELINE_STAGES` + `PIPELINE_LABELS`
  (value = the underlying stage key, label = Prospecting/Qualification/…);
  All Sources select → the four `LEAD_SOURCES`.
- [ ] **C3.** Avg. Sales Cycle card uses the new suffix rendering.

### Phase D — Leads

- [ ] **D1.** KPI cards → new IconStatCard variant + full currency
  (`formatCurrency`) for Won/Dropped values.
- [ ] **D2.** Table responsive hiding: Phone `hidden md:table-cell`, Company
  `hidden lg:table-cell`, Source `hidden xl:table-cell` (th + td); wrapper →
  `rounded-lg` no-border style per S5-2; empty state py-8.

### Phase E — Contacts

- [ ] **E1.** Headers `font-semibold` darker ink + Name th `cursor-pointer
  w-64` (no sort action — mirrors the reference); wrapper `rounded-xl` +
  border + `overflow-hidden`; empty state py-12.

### Phase F — Accounts

- [ ] **F1.** Wrapper → `rounded-lg` shadow no-border; empty state py-8.
  (Table columns already parity-true.)

### Phase G — Activities

- [ ] **G1.** Stat cards per S5-6: "+N today" / "+Xh Ym" / "Due now" as gray
  subtexts under values (Meetings gains the `+` prefix); only Today's % and
  Overdue stay in the header with trending icons; bars `w-20` at all widths.

### Phase H — Reports

- [ ] **H1.** KPI cards → new CircleStatCard anatomy + uppercase-K currency
  (won `$542.0K`, lost `$196K`).

### Phase I — Dialogs (single-column, max-w-lg, reference field sets)

- [ ] **I1. Lead**: create = Name*, Email, Phone, Company, Estimated Value,
  Status (New/Contacted/Qualified/Unqualified), Source (Call/Email/Website/
  Partner); no date fields on create; edit keeps dates + full stage list.
- [ ] **I2. Account**: create = Account Name*, Industry, Email, Phone,
  Website, Annual Revenue, Employees, Status; Tier/Owner/Key account move to
  edit-only (create uses defaults).
- [ ] **I3. Contact**: create = Name*, Email*, Phone, Company, Position, "How
  did you meet?" (5 emoji options); no Priority on create; drop the section
  sub-headers.
- [ ] **I4. Event**: labels per S5-13; add Related To select
  (None/Contact/Account/Opportunity/Lead — stores `relatedType` freeform on
  the existing related field if the model has one, else a plain text-free
  select storing the type only); event type options from the new
  `EVENT_TYPES`.
- [ ] **I5. Activity**: labels per S5-14; Related To (Type) select +
  Related To (Name) dependent select (populated from the chosen slice:
  contacts/accounts/leads); drop the Status select on create (defaults to
  scheduled).

### Phase J — Seed + settings alignment

- [ ] **J1.** `prisma/seed.ts`: lead sources drawn from the four reference
  sources; contact sources from the five emoji sources; **stage distribution
  and all values unchanged** (e2e totals stay valid).
- [ ] **J2.** Settings page renders the new vocabularies via
  `DEFAULT_SETTINGS` (picklists now match what the dialogs produce).

### Phase K — Verification + delivery

- [ ] **K1.** Full gate: lint 0/0 → tsc → unit (≥ 68; grows with A1/A2
  checks) → build → e2e (21; update assertions only if dialog labels changed
  selectors — the lead-creation test uses Name*/Estimated Value/Create Lead
  which all survive).
- [ ] **K2.** Browser re-verification at 1512×945 AND 390×844: mobile drawer
  regression intact; DOM spot-checks of every S5 item (cell padding, headers,
  wrappers, empty states, card anatomies, dialog fields/options, filter
  options, responsive column hiding at 390/768/1024/1280 widths).
- [ ] **K3.** Refresh `docs/screenshots/` (12 captures incl. dialogs? — keep
  the established set: login, 9 pages desktop, mobile dashboard + drawer).
- [ ] **K4.** Docs realignment: AGENTS.md / CLAUDE.md / README.md / PAD /
  `neo-crm_SKILL.md` (table density convention, card typography, dialog
  contract, per-page currency variants, vocabulary tables, test counts).
- [ ] **K5.** Worklog append; Conventional Commit on `main`; push via
  `docs/ssh_git_wrapper_v3.py` (paramiko shim; key outside repo, shredded
  after).

---

## Plan Validation Checklist (audited against the codebase)

- [x] S5-1/S5-2 trace to `src/components/ui/table.tsx` (single source — one
  edit retunes every entity table; page-level overrides for contacts'
  semibold headers land as `className` props at the call site).
- [x] S5-4 Recent Deals is dashboard-local (`src/app/(app)/page.tsx` ~line
  340) — no other consumer of a compact table exists.
- [x] S5-6 activities cards are the local `ActivityStatCard`
  (`activities/page.tsx:42`) — delta strings already computed
  (`+N today`, `Xh overdue`); only their POSITION and the Meetings `+`
  prefix change.
- [x] S5-7/S5-8 trace to `CircleStatCard`/`IconStatCard` in
  `page-parts.tsx` — single-source; reports/leads call sites pass label/
  value/icon/color only.
- [x] S5-9 `ui/card.tsx` is imported by every chart/table card — the padding
  change is global by design (the reference uses the same card primitive
  everywhere; stat cards bypass Card and keep their own p-4/p-5/p-6).
- [x] S5-10..S5-14 all live in `entity-dialogs.tsx` (AccountForm,
  ContactForm, LeadForm, EventForm, ActivityForm) — create/edit split already
  possible via the `account`/`contact`/`lead`… prop (forms render "Edit" vs
  "Create" variants today).
- [x] S5-15 dashboard filter state (`stage`/`source`) already filters
  client-side (`page.tsx:53-54`); switching the select to pipeline stages
  needs a label→key map that `PIPELINE_LABELS` already provides
  (`new→Prospecting`, `qualified→Qualification`).
- [x] D-1 `isDroppedStage` adoption sites enumerated via `rg '"lost"'`:
  leads/page.tsx (3), dashboard/route.ts (2), reports/route.ts (4) — reports'
  "Lost Deals" KPI keeps the strict `lost` filter (card label says Lost).
- [x] D-2 seed change touches source strings only — no e2e assertion
  references source names (`rg "Referral|source" tests/e2e` → one
  "Contact Sources" heading check on Settings which still renders).
- [x] Lead-creation e2e fills only Name*/Estimated Value and clicks Create
  Lead — survives the dialog rework; "Create New Lead" title unchanged.
- [x] Mobile-nav e2e suite (5 checks) untouched by every change above —
  no layout/table component it asserts is modified (drawer assertions are
  role/dialog based).

---

## Execution Addendum (2026-09-29, post-execution)

All phases executed in order; the ToDo list above is complete.

### Verification outcomes

- **Phase A (TDD)**: red-first — 5 new vocabulary checks
  (`tests/constants.test.ts`) + 2 new formatter checks
  (`tests/format.test.ts`) failed against the old constants/formatter,
  then green after the constants + `formatCompactCurrency` options landed.
  **75/75 unit** total (68 → 75).
- **Phases B–J**: every S5 item implemented. Implementation notes:
  - The shared `Table` retune (px-2/p-2) propagated to every entity table
    automatically; per-page overlays (contacts semibold headers, wrappers,
    empty rows) landed as call-site `className` props per the plan.
  - The compact Recent Deals table renders plain `<th>/<td>` elements —
    deliberately NOT the shared Table — inside the card's `p-6 pt-0`
    content, with six unique columns + the trailing `w-8` th (the
    reference's duplicate "Status" column is the documented quirk not
    copied).
  - The Event/Activity "Related To" fields required schema additions
    (`Event.relatedType`, `Activity.relatedType` + `Activity.relatedName`,
    all nullable) pushed with `db push` (no migrations folder, per repo
    convention); the e2e global-setup re-pushes the schema to `db/e2e.db`
    automatically. The Activity "Related To (Name)" is a freeform input
    (placeholder "e.g., John Doe" — DOM-verified), and the timeline
    prefers `relatedName` over the contact relation when present.
  - Seed source remapping (old → reference vocabularies) touched only the
    source strings — stage distribution, values and dates are untouched,
    so every e2e total stayed valid (the full e2e run passed unchanged).
  - The dashboard's working All Owners filter is retained (documented
    fix-over-defect — the reference's owner dropdown has disappeared
    entirely from its current filter bar, but our control is real and
    useful; noted in the quirk register above).
- **DOM re-verification** on the running clone confirmed every item at
  1512×945 and 390/768/1024/1280 widths: Recent Deals th `py-2 text-left
  font-medium` + `w-8` trailing; All Stages listbox = All
  Stages/Prospecting/Qualification/Proposal/Negotiation/Won; All Sources =
  All Sources/Call/Email/Website/Partner; lead dialog = 7 reference fields
  with Status (New/Contacted/Qualified/Unqualified) and Source
  (Call/Email/Website/Partner) listboxes; account dialog = the 8 reference
  fields; contact dialog = required Email + "How did you meet?" with the
  five emoji options; event dialog = the 8 reference fields with Related To
  (None/Contact/Account/Opportunity/Lead); activity dialog = Activity
  Type*/Date & Time*/Description*/Related To (Type)/Related To (Name) with
  no Status select; activities cards show "+0h 45m"/"+2 today"/"Due now"
  subtexts with `w-20` bars; reports cards render "6 $542.0K" / "3 $196K"
  inline with square chips; leads cards render "7 $687,000" full-form in
  the compact anatomy; contacts headers semibold gray-700 with the w-64
  cursor-pointer Name; accounts wrapper `rounded-lg border-0 shadow`; tds
  `p-2`; leads Phone/Company/Source hidden below md/lg/xl.
- **Full gate**: lint 0/0 · typecheck clean · **75/75 unit** · build
  clean · **21/21 e2e** (mobile-nav regression 5/5 intact — the drawer
  was additionally re-verified interactively at 390×844: open → 8 links →
  focus moves into the panel → Escape → scroll lock released).
- **Deliverables**: 12 refreshed screenshots in `docs/screenshots/`;
  AGENTS/CLAUDE/README/PAD realigned (counts 68→75, table-density +
  dialog-contract + currency-variant conventions);
  `neo-crm_SKILL.md` v1.2.0 (session-5 audit entry + the "audit the
  interactive layer" lesson); this addendum.
