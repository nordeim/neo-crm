# Session 4 Remediation Plan — Pixel-Grade Parity Hardening (2026-09-29)

**Scope:** Fresh-login DOM-level audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `aa6395e`
(gate green: lint 0/0 · tsc clean · 65/65 unit · build clean · 21/21 e2e).
The reference's demo data is still **reset to zero**, so this audit extracted
**computed styles, exact hex colors, icon names and HTML anatomy straight from
the live DOM** (not VLM screenshots) — every item below is evidence-backed by
`getComputedStyle` / outerHTML extraction on the logged-in reference.

**Method:** TDD — every pure-seam behavior change (color constants, formatters,
sort-indicator logic) lands with a failing unit test first; UI changes land
with the full gate plus a browser re-verification at 1512×945 and 390×844.
The `skills/` folder stays excluded from all checking, testing and compilation.

**Baseline evidence:** `/home/z/my-project/live-s4/` (fresh live captures +
DOM extractions), `/home/z/my-project/clone-s4/` (clone captures),
`/home/z/my-project/scripts/parity-compare-s4.sh` (VLM diff harness),
DOM extraction transcripts in this session log.

**Reference quirks deliberately NOT copied** (documented fixes over defects):
the duplicated Export button on the dashboard (we ship two *working* export
buttons), the empty owner dropdown on dashboard/accounts toolbars (ours is a
real working control), the "Stage: Source" ghost textbox, the raw
`closed_won` stage keys in the reference reports funnel, the blank Recent
Deals panel with no empty-state copy, the "Edit with Base44" platform badge,
and the reference's nested `main`-scroll layout (our window scroll with
sticky chrome is visually equivalent and simpler).

---

## Identified Issues, Bugs and Gaps (all DOM-verified)

| # | Sev | Issue | Evidence (live DOM) |
|---|-----|-------|---------------------|
| G-1 | High | **Pipeline legend stage colors**: Proposal is yellow `#eab308` (yellow-500) not amber `#f59e0b`; **Won is grey `#9ca3af`** (grey-400), not emerald. Legend swatches: `rgb(59,130,246)` / `rgb(6,182,212)` / `rgb(234,179,8)` / `rgb(249,115,22)` / `rgb(156,163,175)`. Badge pills stay green/emerald (verified separately: table badges are green). | Pipeline legend swatch extraction |
| G-2 | High | **Dashboard KPI sparkline colors + types**: Total Leads = recharts **LINE `#10b981`**; Deals Closed = **7 bars `#22d3ee`**; Revenue = **bars `#4ade80`**; Sales Target = **two-tone bars: 4× `#fbbf24` then 3× `#3b82f6`**; Conversion Rate = **AREA `#8b5cf6`** ✓; Avg. Sales Cycle = **LINE `#10b981`**. Ours: teal `#14b8a6` lines, `#06b6d4`/`#10b981` bars, orange `#f97316` below-target bars. | Card-DOM path extraction: `recharts-line-c stroke #10b981`, bar divs `rgb(34,211,238)` etc. |
| G-3 | High | **Revenue Over Time (dashboard)**: BOTH series are recharts **Areas** (Won fill `#10b981`, Target fill `#ef4444`), not line+area; window is **7 ticks** (current month + 6 back — live X axis shows 7 month labels under the "Last 6 months" caption); ours renders 6 ticks and a Won Line. | `recharts-area-area` ×2 in live svg; X-axis tick count |
| G-4 | High | **Accounts KPI card anatomy** — reference is NOT the dashboard KpiCard anatomy: header row = label left + **trending-up icon + delta right** (`flex items-center gap-1 text-xs text-green-600`); bottom row = `text-2xl sm:text-3xl font-bold` value left + **6 mini bars right** (`h-10 w-24 flex items-end gap-0.5`, bars `flex-1 rounded-sm bg-{c}-400` with % heights). Colors: Total `#60a5fa` (blue-400), Active `#4ade80` (green-400), Key `#22d3ee` (cyan-400), Revenue `#c084fc` (purple-400), Overdue `#f87171` (red-400, no delta, `h-10 w-24`). Ours reuses the dashboard label/value/sparkline stack. | outerHTML of all 5 accounts cards |
| G-5 | High | **Table sort indicators**: inactive sortable headers show **`lucide arrow-up-down` (w-4 h-4)**; the ACTIVE sort column shows a directional `chevron-down/up`. Sortability per table: **leads = Lead Name, Email, Value** (arrow-up-down each); **contacts = Last Activity only** (chevron-down, default desc sort; Name is NOT sortable); accounts = no sortable columns (**already true in the clone** — validated). Ours: chevrons on every sortable column (leads ✓ sortability, wrong inactive icon) and contacts Name wrongly sortable. | `th` svg-class extraction on all three pages |
| G-6 | High | **Activities stat cards**: same side-by-side anatomy as accounts (already close) but deltas carry icons — **`trending-up` on % deltas, `trending-down` on "2h overdue"**; "+N today" deltas have no icon. Bar container `h-10 w-20`; colors: Today blue-400, Overdue red-400, Emails cyan-400, Calls green-400, Meetings grey-400, WhatsApp green-400. | Card outerHTML + lucide class extraction |
| G-7 | High | **Profile page**: (a) Profile Picture = **80/96px circle `bg-blue-100` with a user icon** — not the small grey initial avatar; (b) Upload Photo button uses a **camera** icon; (c) **Save Changes is black** (`rgb(23,23,23)` bg, near-white text) — ours is blue; (d) right column = **4 separate cards** — Account (centered 80px `bg-blue-100` avatar + name + email + "user" badge), Account Type (`w-12 h-12 bg-blue-100` chip + user icon), Email Verified (`bg-green-100` chip `#dcfce7` + mail icon, value "Yes"), Security (`bg-purple-100` chip `#f3e8ff` + shield icon, value "Protected") — ours renders one merged card; (e) ours adds "Workspace team: N members" which the reference does not have. | outerHTML of every profile card + computed styles |
| G-8 | Medium | **Reports tabs**: container is `grid w-full grid-cols-2 lg:grid-cols-5 bg-white border` with active tab **`bg-blue-50` + `text-blue-700`**; ours uses the grey flex container with a blue-tint active. | tablist class + computed colors |
| G-9 | Medium | **Reports Revenue Over Time has NO legend** (the reference card ships no legend element; the Won/Lost chart does have one). Ours renders a Won/Target legend on the revenue chart. | `.recharts-legend` absence check |
| G-10 | Medium | **Segmented tab containers** (activities priority tabs, settings tabs): reference uses `grid w-full grid-cols-4` / `grid-cols-3` on the `bg-muted` container (equal-width columns); ours uses `flex gap-1 overflow-x-auto`. | tablist class extraction on both pages |
| G-11 | Medium | **Activities by Type widget**: chart categories are **Call / Email / Meeting / Task / Note** — no WhatsApp series (ours includes WhatsApp). Caption stays our honest dynamic range text (session-3 documented decision: the reference's static "Last 2 days" caption ignores the selected range — quirk not copied). | Card textContent extraction |
| G-12 | Medium | **Calendar selected-day cell**: the whole day cell gets **`bg-blue-600` with white text** (`min-h-20 sm:min-h-24 p-1 sm:p-2 rounded-lg … bg-blue-600 text-white`); ours draws a blue border on a light cell. Month heading is **level 2** (ours: level 3). | Selected-cell computed styles + a11y heading level |
| G-13 | Medium | **Contacts cards**: card bg is a **gradient** (`bg-gradient-to-br from-white to-gray-50`), label `text-sm font-medium`, value `text-3xl font-bold`, chips are **solid `bg-{c}-500`** (blue-500 / **green-500 `#22c55e`** / amber-500 / red-500 — ours uses emerald for New This Month), and "New This Month" carries a **trend row: trending-up icon + "+N"** (`text-sm font-medium text-green-600`). | Card outerHTML + chip computed colors |
| G-14 | Medium | **Dashboard KpiCard styling refinements**: reference card = `p-4 sm:p-6`, label `text-xs sm:text-sm text-gray-600` (plain weight), value `text-2xl sm:text-3xl font-bold`, delta `text-xs …-600 mb-1`, value row `flex items-end gap-2`. Ours: `p-5`, `text-xs font-medium tracking-wide`, `text-[28px] font-semibold`, `text-sm font-medium`, `items-baseline`. | Dashboard card outerHTML |
| G-15 | Low | Search-box aria-labels drop the ellipsis the visible placeholder has ("Search accounts…" a11y name includes it); harmless but free to align. | a11y tree |

---

## ToDo List (execution order)

### Phase A — Pure seams, TDD (failing tests first)

- [ ] **A1. `src/lib/constants.ts`**: `STAGE_META.proposal.color` → `#eab308`;
  `STAGE_META.won.color` → `#9ca3af` (chart hex only — badge classes stay
  emerald). Extend `CHART_COLORS` with the verified -400 family:
  `blue400 #60a5fa`, `green400 #4ade80`, `cyan400 #22d3ee`, `purple400 #c084fc`,
  `red400 #f87171`, `amber400 #fbbf24`, `emerald #10b981`. New unit checks in
  `tests/format.test.ts` (or a new `tests/constants.test.ts`) pinning every
  value — red first.
- [ ] **A2. Sort-indicator helper** (pure): `sortIcon(active, dir)` semantics —
  inactive ⇒ ArrowUpDown, active ⇒ directional Chevron. Land as a tiny
  exported helper in `src/components/ui/table.tsx` (or `page-parts`) with a
  unit test if extractable; otherwise pin via e2e assertions.

### Phase B — Shared components

- [ ] **B1. `KpiCard`** refinements per G-14 (padding, label size/weight,
  value size/weight, delta size + mb-1, value row `items-end`).
- [ ] **B2. New `BarStatCard`** in `page-parts.tsx` — the accounts/activities
  anatomy (G-4/G-6): header (label + optional delta w/ icon), footer
  (value + optional sub-text + `h-10` bar strip, bars `flex-1 rounded-sm`
  with `colorFor` support). Migrate `ActivityStatCard` onto it.
- [ ] **B3. `IconStatCard`** refinements per G-13 (gradient bg, text sizes,
  optional `trend` row with trending-up icon + green text).
- [ ] **B4. `Tabs`**: `segmented` variant gains `cols` (grid-cols-N);
  `pill` variant → white bordered container + `bg-blue-50 text-blue-700`
  active (G-8/G-10).
- [ ] **B5. `Table` sort headers**: arrow-up-down inactive / chevron active
  (G-5); wire per-table sortability.

### Phase C — Dashboard

- [ ] **C1.** Sparkline colors per G-2 (line `#10b981` ×2, bars `#22d3ee` /
  `#4ade80`, Sales Target `colorFor` amber400/blue).
- [ ] **C2.** Revenue chart: both series filled Areas; 7-month window
  (`i = 6 … 0`) in the API route (G-3).

### Phase D — Accounts

- [ ] **D1.** Replace the five KpiCards with `BarStatCard` (G-4), incl. the
  delta icons and the no-delta Overdue card. (Accounts table sorting already
  absent — validated, no change needed.)

### Phase E — Contacts

- [ ] **E1.** IconStatCard gradient + New This Month trend row (G-13);
  chip color `#22c55e`.
- [ ] **E2.** Sort: only Last Activity sortable, default desc (G-5).

### Phase F — Leads

- [ ] **F1.** Sort headers → arrow-up-down on Lead Name/Email/Value with
  chevron on the active one (G-5).

### Phase G — Calendar

- [ ] **G1.** Selected day cell = solid `bg-primary`-blue cell with white
  text (G-12); month heading level 2.

### Phase H — Activities

- [ ] **H1.** Segmented tabs `grid-cols-4` (G-10); by-type chart categories
  drop WhatsApp (G-11); caption stays dynamic (session-3 decision).
- [ ] **H2.** Stat cards via B2 with delta icons per G-6.

### Phase I — Reports

- [ ] **I1.** Tabs per G-8; revenue chart drops its legend (G-9).

### Phase J — Settings + Profile

- [ ] **J1.** Settings tabs `grid-cols-3` (G-10).
- [ ] **J2.** Profile rework per G-7 (blue-100 80/96px avatar + user icon,
  camera-icon Upload, black Save Changes, four separate right-column cards,
  remove the workspace-team footnote).

### Phase K — Verification + delivery

- [ ] **K1.** Full gate: lint 0/0 → tsc → unit (≥ 65) → build → e2e (≥ 21;
  update any assertions touching changed copy/colors).
- [ ] **K2.** Browser re-verification at 1512×945 AND 390×844 (mobile drawer
  regression intact); DOM-level spot-checks of every G-item on the running
  clone (colors, icons, tab classes, sort icons, selected-day cell).
- [ ] **K3.** Refresh `docs/screenshots/` (12 captures incl. profile).
- [ ] **K4.** Docs realignment: AGENTS.md / CLAUDE.md / README.md / PAD /
  `neo-crm_SKILL.md` (stat-card anatomy note, -400 bar palette, sort-icon
  convention, tab variants, profile layout, test counts).
- [ ] **K5.** Worklog append; Conventional Commit on `main`; push via
  `docs/ssh_git_wrapper_v3.py` (paramiko shim; key outside repo, shredded
  after).

---

## Plan Validation Checklist (audited against the codebase)

- [x] G-1/G-2/G-6/G-13 all trace to `src/lib/constants.ts` + call sites in
  `page.tsx` / `accounts/page.tsx` / `activities/page.tsx` /
  `contacts/page.tsx` — verified single-source palettes (`rg CHART_COLORS src`
  lists every consumer).
- [x] G-3 window change lives in `src/app/api/dashboard/route.ts:79`
  (`for (let i = 5; i >= 0; …)`) — one-line change, sparkline arrays derive
  from the same `revenueOverTime` so they inherit the 7-tick window.
- [x] G-4/G-6 anatomy is already half-built (`ActivityStatCard` in
  `activities/page.tsx` is side-by-side) — extracting it to `page-parts.tsx`
  and reusing it on accounts avoids a second divergent card family.
- [x] G-5 sort logic: `sortKey/sortDir` state already exists in
  leads/contacts pages; accounts ships NO sort state (validated — already
  matches the reference); contacts drops Name-sortability, leads keeps
  Name/Email/Value with the new inactive icon.
- [x] G-7 profile: `PATCH /api/users/[id]` + keyed-remount ProfileForm from
  session 3 stay untouched — only presentational markup changes.
- [x] G-8/G-10 tabs: `Tabs` already has `variant` prop ("segmented", "pill")
  — the change is class-level in one component file.
- [x] G-11 by-type chart derives from `ACTIVITY_TYPE_META` keys
  (`activities/page.tsx:177`) — filter to the five reference categories at
  the call site, not in the META map (WhatsApp stays a valid activity type
  elsewhere: quick-log button, filters, timeline dots).
- [x] "Last 7 days" / caption copy appears in NO test assertion
  (`rg "Last 7 days" tests` → no matches) — no e2e updates needed for the
  caption; the range select keeps its own labels.

---

## Execution Addendum (2026-09-29, post-execution)

All phases executed in order; the ToDo list above is complete.

### Verification outcomes

- **Phase A (TDD)**: red-first — `tests/constants.test.ts` (3 checks)
  failed against the old palette, then green after the `STAGE_META` chart
  hex + `CHART_COLORS` -400 family landed. 68/68 unit total.
- **Phases B–J**: every G-item implemented; mid-execution catch — dynamic
  `` `grid-cols-${cols}` `` class templates never compile under Tailwind v4
  (literal-string scanning), so `tabs.tsx` ships a static `GRID_COLS`
  record. The calendar's selected cell also switched from `bg-primary`
  (blue-500) to `bg-sidebar` (blue-600 #2563eb) to match the DOM-verified
  reference cell.
- **Dev-server gotcha**: the long-running dev server served a stale module
  graph after the edits (old API colors, 6-month window) — a clean restart
  was required before browser verification meant anything.
- **DOM re-verification** on the running clone confirmed every item: the
  five legend swatches render `rgb(234,179,8)` + `rgb(156,163,175)`, all
  six dashboard sparkline colors exact, revenue chart = two Areas over 7
  months, accounts/activities bars in the -400 family with trending
  icons, contacts gradient + green-500 chip + trend row, leads
  `arrow-up-down` headers, calendar solid blue-600 selected cell + h2
  heading, activities `grid-cols-4` track + 5-category chart, reports
  white bordered pill track (`bg-blue-50` active) + legendless revenue
  chart, settings `grid-cols-3`, profile chips `#dbeafe/#dcfce7/#f3e8ff`
  with black Save Changes.
- **Full gate**: lint 0/0 · typecheck clean · **68/68 unit** · build
  clean · **21/21 e2e** (5-check mobile-nav regression intact) · mobile
  drawer re-verified at 390×844.
- **Deliverables**: 12 refreshed screenshots in `docs/screenshots/`;
  AGENTS/CLAUDE/README/PAD counts + conventions realigned;
  `neo-crm_SKILL.md` v1.1.0 (session-4 audit entry, DOM-extraction
  methodology, palette notes); `globals.css` vestigial chart tokens
  aligned with the pinned palette.
