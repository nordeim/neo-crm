# Session 12 Remediation Plan — Mobile-Nav Focus Race + Custom 404 + Border-Token Split + Tabs Anatomy + KPI Drift + Sparkline Rebuild (2026-09-30)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `992befe`
(baseline gate green: lint 0/0 · tsc clean · 189/189 unit · dev server healthy
on :3000 with `db/custom.db` at the repo root; `.env` / `.env.example` / `db/`
/ vitest + playwright configs all verified). The reference's demo data is
STILL zero (eighth consecutive session) — parity remains structural. All
reference DOM was captured at **1512×945** with computed-style probes on both
apps; the mobile-nav regression was re-verified LIVE before any changes
(burger hit-test at 390, drawer with 8 links, dual scroll-lock, focus-trap
wrap, Escape + lock restore, resize-past-md auto-close at 1024, orientation
change, backdrop click, route-change close). Sessions 1–11 covered
data/API, visual basics, dialogs, layout, app chrome, functional controls,
component anatomy, stock primitives, chart internals, the login reset flow,
chart geometry, stat shadows, the reports bare-tabs layout and the contacts
full-height architecture. This session's audit targeted: the **mobile
navigation drawer under the focus-lock lens** (the user's standing priority —
debugged against the mobile-nav taxonomy in
`skills/avant-garde-design-v4/references/07-08`), the **404 page** (never
compared), **print media**, the **settings picklist add-flow** (last verified
session 8), the **reports-tab keyboard layer**, and a full **border-color +
text-muted token sweep** (the computed layer below every class-level pin).
The reference app MOVED since session 11 (its dashboard KPI cards lost
`hover:shadow-md transition-shadow` and `border-gray-200`) — its current DOM
is the ground truth re-pinned this session.

**Method:** TDD — new contracts land in `src/lib/page-layout.ts`
(`NOT_FOUND_LAYOUT`, `KPI_SPARK`, tab contracts), `tests/design-tokens.test.ts`
(the border token flip), `tests/page-layout.test.ts` and a new
`tests/sparkline.test.ts` with failing tests first; e2e assertions land in
the same commits as the behavior changes (a new mobile-nav focus-on-open
regression + a 404 test). UI changes land with the full gate plus browser
re-verification at 1512/1024/768/700/390. The `skills/` folder stays
excluded from all checking, testing and compilation.

---

## Identified Issues, Bugs and Gaps (all DOM-verified unless noted)

| # | Sev | Issue | Evidence (live DOM / reproduction) |
|---|-----|-------|-----------------------------------|
| S12-P1 | **High** | **Mobile-nav focus-on-open race (the session's functional bug).** The drawer's `requestAnimationFrame` focus fires while the `transition-[visibility]` class flip has not yet applied — computed `visibility` is still `hidden` at call time, and `focus()` on a not-rendered element **silently no-ops** (instrumented live: `focus()` IS called on the Close button, `activeElement` stays on the burger/body). Keyboard users therefore Tab through the **background page behind an `aria-modal` dialog** (WCAG 2.4.3 focus-order violation); the trap's wrap logic never engages because focus never entered the panel. Escape/restore/cleanup all work — only the initial focus move is broken. Fix: a bounded retry (`focus()`, verify `activeElement`, re-schedule via rAF up to 5 frames — verified live: lands on attempt 3) with a `cancelled` flag so the effect cleanup stops pending retries. Also switch the panel `h-full` → `h-dvh` (Class D of the mobile-nav taxonomy: `h-full` on `fixed` = the large-viewport height; `dvh` tracks mobile browser chrome). | `HTMLElement.prototype.focus` + rAF instrumentation, computed-visibility probes at call time, real trusted clicks via CDP; retry-fix prototype verified in-page |
| S12-P2 | **High** | **404 page is the Next.js built-in.** Reference `/nonexistent`: title `This Page Does Not Exist \| NEO CRM`; root `min-h-screen flex items-center justify-center p-6 bg-slate-50` → `max-w-md w-full` → `text-center space-y-6` → `space-y-2` heading group: H1 `404` (`text-7xl font-light text-slate-300`), H2 `Page Not Found` (`text-2xl font-medium text-slate-800`), P `The page "{pathname}" could not be found in this application.` (`text-slate-600 leading-relaxed`), and a `Go Home` button (`inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500`, lucide **Home** `w-4 h-4 mr-2`, navigates to `/`). No app shell. Ours: the stock `404 / This page could not be found.` system-UI page. | full HTML/class extraction on both apps; click-through on the reference |
| S12-P3 | **High** | **Border-color token split — the reference's platform default is `#e5e5e5` (neutral-200), ours is `#e5e7eb` (gray-200) everywhere.** The reference renders TWO border grays: (a) its **default** (`#e5e5e5`) rides every bare-`border` surface — ALL stock cards (dashboard KPI + charts + lists, accounts, leads, calendar, activities, settings, profile, contacts stat cards, reports table/chart cards), **table rows** (`border-b` on tr), **table cell defaults**, the **reports tablist**, **outline buttons**, **select triggers/contents** (`border-input` where `--input` = `#e5e5e5`), **dropdown contents**, **dialog content** (1px) and **every bare form input** (dialog inputs, filter inputs — all compute `#e5e5e5`); (b) **explicit `border-gray-200`** (`#e5e7eb`) on exactly: the **reports KPI stat cards**, the **reports sticky filter card**, the **contacts table card** (`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden`), and the **topbar search input** (`border-gray-200` — ours already matches ✓). The login card inputs are their own **slate-200** family (`#e2e8f0` — ours already matches ✓). Ours renders `--color-line: #e5e7eb` on every one of these surfaces. Fix: re-pin `--color-line` to `#e5e5e5` (base default + every `border-line` utility flips with it) and add `--color-line-strong: #e5e7eb` for the three explicit surfaces (CircleStatCard + the reports filter card + the contacts table card). | elementFromPoint border-color sweeps across all 9 pages on both apps; per-surface computed probes (cards, rows, tablist, outline button, select trigger, dialog, inputs) |
| S12-P4 | **High** | **Tabs anatomy diverges on all three tab surfaces** (reports pill, activities + settings segmented — the reference ships stock Radix Tabs classes; ours is a hand-rolled component). Reference track: `items-center justify-center rounded-lg p-1 text-muted-foreground grid w-full grid-cols-2 lg:grid-cols-5 h-auto bg-white border` (pill) / `h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground grid w-full grid-cols-{n}` (segmented) — both carry **`text-muted-foreground`** so inactive tabs inherit **`#737373`** (ours: `text-muted` `#6b7280`). Reference trigger (both variants): `inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow` + pill-only `text-xs sm:text-sm` + `data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700` / segmented-only `text-sm` + `data-[state=active]:bg-background data-[state=active]:text-foreground`. Computed active-pill shadow = the v3 `shadow` scale (`0 1px 3px 0.1`) on all three surfaces — **our segmented active pill ships `shadow-sm`** (the s9 tiny re-pin) and the pill variant ships none. Ours additionally forces `h-7` (reference: natural 28px — same computed at `sm`+), uses `transition-colors` (reference: `transition-all`), lacks `ring-offset-background`, and adds `hover:text-foreground` on inactive tabs (the reference ships NO hover on any tab variant). The reference's tabs are also all `tabIndex=-1` (keyboard-unreachable platform defect) — **our roving tabindex stays** (documented accessible improvement, drawer precedent). | class dumps + computed styles (shadow string, inactive color, transition-property, height) on reports/activities/settings tab strips, both apps |
| S12-P5 | **Med** | **Dashboard KPI card drift (the reference moved since session 11).** The reference's dashboard KPI cards are now plain stock Cards — `rounded-xl border bg-card text-card-foreground shadow` + `p-4 sm:p-6` — with **no** `hover:shadow-md`, **no** `transition-shadow`, **no** `border-gray-200` (border rides the `#e5e5e5` default). The label is `text-xs sm:text-sm text-gray-600` (**`#4b5563`** — ours `text-muted` `#6b7280`); deltas are `text-xs text-green-600/text-gray-600 mb-1` with **no font-medium** (ours: `font-medium`, neutral = `text-muted`). Our KpiCard keeps `hover:shadow-md transition-shadow` (an s11 pin now stale) and the darker token set. The REPORTS KPI cards still carry `border-gray-200 hover:shadow-md transition-shadow` (CircleStatCard ✓ keeps hover) — only the dashboard family changed. | card class dumps + computed colors on both apps (dashboard vs reports KPI rows) |
| S12-P6 | **Med** | **Sparkline internals: the reference renders recharts monotone curves; ours is a hand-rolled straight-segment SVG.** Reference (dashboard, `mt-2 h-8` = 32px): recharts `ResponsiveContainer` → `LineChart` with **`type="monotone"`** cubic paths, `strokeWidth` **2**, no dots, stock 5px margins (points x∈[5,130] in a 135×32 viewBox); the area variant (Conversion Rate) closes at the axis with **`fillOpacity 0.3`** and a **1px** stroke. Reference (reports, `flex items-end justify-between mt-2` → **`flex-1 h-12 mr-2`** = 48px, recharts wrapper `max-width: 176px`): sparks on Total Leads (`#3b82f6`), Open Leads (`#f97316`), Won Deals (`#10b981`), Conversion Rate (`#8b5cf6`) — **Lost Deals has NO spark** (ours renders one). Ours: hand-rolled `page-parts.tsx` Sparkline (straight `M…L` paths, area fillOpacity 0.15 + 2px stroke, area flush to the bottom edge), reports sparks at `h-6` (24px), and **all five** reports cards carry sparks. The icon chips also render **10%-alpha tints** (`rgba(59,130,246,.1)`) where the reference ships **solid color-50s** (`blue-50 #eff6ff`, `orange-50 #fff7ed`, `green-50 #f0fdf4`, `red-50 #fef2f2`, `violet-50 #faf5ff`). | recharts-wrapper measurements, path `d` + computed stroke/fill/fillOpacity/strokeWidth extraction, container class walks on both apps |
| S12-P7 | Info | **Reference keyboard layer (documented, not mirrored):** the reference's reports/settings/activities tabs are ALL `tabIndex=-1` (keyboard-inaccessible platform defect); the topbar search input is dead (no results UI ever renders — zero data or not wired); every reference Export button + Sign up link remains dead (re-confirmed). Ours keeps the accessible roving tabindex, the functional search dropdown and the working exports — deliberate documented superset (mobile-nav precedent). | tab tabIndex dumps both apps; search typing probes with popup observation |
| S12-P8 | Info | **Reference media queries are sonner-toast boilerplate** (`(hover: none) and (pointer: coarse)` + `(max-width: 600px)` → `[data-sonner-toaster]` rules from the reference's EMPTY toast system). No `@media print` rules on either app (print parity ✓). The settings picklist add-flow re-verified ALIGNED (inline input + disabled-at-empty dark Add button, "No items yet" empty state, chip rows). | stylesheet media-rule enumeration + content dump on both apps |

**Verified-aligned (no action):** demo data still zero (8th session);
settings picklist add-flow (inline add, `disabled={!value.trim()}`, dark
`bg-neutral-900` button, `No items yet` empty state, chip remove rows);
print styles (none on either app); login card slate-200 input family;
topbar search pill `border-gray-200`; contacts full-height architecture
(`h-[calc(100vh-64px)]` still present); accounts/leads table cards
(`rounded-lg shadow`, no border); contacts table card shadow-sm + explicit
`border-gray-200`; chart geometry (dashboard/reports 300px, stock recharts
`<Legend/>`); the five entity dialogs (stock `grid gap-4 py-4` +
`bg-black/80` overlay + dark submits); mobile-nav regression 9/10 checks
PASS (burger hit-test, 8 links, dual locks, trap wrap, Escape + restore,
resize auto-close + unlock, orientation, backdrop, route-change); Tailwind
v4 hazard sweep CLEAN (no bare `ring`, no `drop-shadow`, no removed
utilities, no negative-margin riders on space-y; `bg-gradient-to-*` is the
v4-compat alias; all `outline-none` usages are the focus-ring pattern).

---

## Execution Plan (TDD)

### Phase A — red tests first

1. `tests/design-tokens.test.ts`: re-pin `--color-line` → `#e5e5e5` + new
   `--color-line-strong` → `#e5e7eb` (parses `globals.css`).
2. `tests/page-layout.test.ts`: new pins —
   - `NOT_FOUND_LAYOUT` (the 404 page's five class vocabularies),
   - `TABS` contract: pill + segmented track/trigger classes (track
     `text-muted-ink`, pill `h-auto`, trigger without `h-7`, `transition-all`,
     `ring-offset-background`, active `shadow`, pill `text-xs sm:text-sm`,
     no `hover:` on either variant),
   - `KPI_CARD` updates (no `hover:shadow-md`/`transition-shadow`, label
     `text-gray-600`), `DELTA_TEXT` (no `font-medium`, neutral
     `text-gray-600`),
   - `KPI_SPARK` contract: dashboard `mt-2 h-8`, reports wrapper
     `flex items-end justify-between mt-2` + `flex-1 h-12 mr-2` +
     `max-w-[176px]`, line `strokeWidth 2` + `dot={false}` + `monotone`,
     area `fillOpacity 0.3` + `strokeWidth 1`, solid color-50 chip map.
3. New `tests/sparkline.test.ts`: the Sparkline seam (variant configs:
   line/area/bars geometry constants, chip color map, `sparklineData()`
   row-derivation if needed).
4. `tests/e2e/mobile-navigation.spec.ts`: +1 — focus lands inside the
   drawer after opening (activeElement within `[role=dialog]`).
5. `tests/e2e/crm.spec.ts` (or a new `not-found.spec.ts`): +1 — `/nonexistent`
   renders the custom 404 (404 h1, Page Not Found, quoted path, Go Home → `/`).

### Phase B — e2e additions in the same commits as the behavior

### Phase C — implementation

1. `globals.css`: the border-token flip + `--color-line-strong`.
2. `src/components/layout/mobile-nav.tsx`: retry-focus + `cancelled` flag +
   `h-dvh` panel.
3. `src/app/not-found.tsx`: the custom 404 (server component, no shell).
4. `src/components/ui/tabs.tsx`: the track/trigger class updates (both
   variants).
5. `src/components/shared/page-parts.tsx`: KpiCard de-hover + label/delta
   tokens; DeltaText fixes; Sparkline rebuilt on recharts
   (`LineChart`/`AreaChart` in `ResponsiveContainer`, monotone, per-variant
   stroke/fill); CircleStatCard: children wrapper →
   `flex items-end justify-between mt-2`, spark slot `flex-1 h-12 mr-2`,
   chip solid color-50 via the color map, border → `border-line-strong`.
6. `src/app/(app)/page.tsx`: dashboard spark wrappers `mt-2 h-8`.
7. `src/app/(app)/reports/reports-page.tsx`: Lost Deals spark REMOVED;
   filter card border → strong; spark wrappers.
8. `src/app/(app)/contacts/contacts-page.tsx`: table card border → strong
   (keep `shadow-sm` + `rounded-xl`).

### Phase D — full gate + browser re-verification

lint → typecheck → 189+ unit → build → e2e (26+2) → DOM re-verification at
1512/1024/768/700/390 (border colors, tab anatomy, spark geometry, 404,
drawer focus) → zero 390px overflow on all nine routes + `/nonexistent`.

### Phase E — deliverables

12 screenshots refreshed (+ the 404 capture), `.env.example` re-verified,
docs realigned (README, AGENTS, CLAUDE, PAD, SKILL v1.9.0, `session_17.md`,
this addendum, repo worklog), commit on main + SSH-wrapper push.

---

## Addendum — execution record (same session)

All phases executed with the full gate green at every checkpoint:

- **Phase A:** 17 red-first checks — 3 design-tokens (the border split:
  `--color-line` → #e5e5e5, new `--color-line-strong` → #e5e7eb,
  `--color-line-soft` unchanged) + 14 page-layout pins
  (`NOT_FOUND_LAYOUT` ×2 tests, `TABS_PILL`/`TABS_SEGMENTED`,
  `KPI_CARD` + `DELTA_TEXT` + `STAT_CARD.reportsCard`, `KPI_SPARK` ×4 +
  `KPI_CHIP_BG`, and the `REPORTS_FILTER_BAR.bar` strong-border re-pin
  of the s6 test). RED confirmed (16 failing + 1 pre-passing soft pin).
- **Phase B:** +2 e2e — the drawer focus-entry regression
  (`expect.poll` on `dialog.contains(document.activeElement)`) and the
  custom-404 golden path (headings + quoted path + Go Home → `/`).
- **Phase C:** the token flip in `globals.css`; the retry-focus +
  `cancelled` flag + `h-dvh` panel in `mobile-nav.tsx`;
  `not-found.tsx` (server, ABSOLUTE title — the root "%s | NEO CRM"
  template doubled the suffix until `title.absolute` was used) +
  `not-found-body.tsx` (client `usePathname`); the `tabs.tsx` rewrite on
  the `TABS_PILL`/`TABS_SEGMENTED` contracts (data-state variants, no
  conditional active classes); `page-parts.tsx` — KpiCard de-hover +
  gray-600 label, DeltaText de-medium + gray-600 neutral, CircleStatCard
  on `STAT_CARD.reportsCard` + the `KPI_SPARK.reportsWrapper` split row
  + solid `KPI_CHIP_BG` chips, and the Sparkline rebuilt on recharts
  (`LineChart`/`AreaChart`, `type="monotone"`, line sw 2 / area fill
  0.3 + sw 1, `ResponsiveContainer`, no animation); the reports page
  (Lost Deals sparkless, `h-full` sparks in the h-12 slot, filter card
  `border-line-strong`); the contacts table card `border-line-strong`.
- **VLM rounds:** round 1 — dashboard/reports diffs all data-driven;
  the 404 comparison caught the divider bar + space-y-3 group + path
  span + pt-6 group (DOM-proven on the reference, all added to the
  contract + component). Round 2 — the re-captured 404 compared
  **ALIGNED**.
- **Phase D:** full gate green (lint 0/0 · tsc · **206/206 unit** ·
  build · **28/28 e2e**, mobile-nav 7/7); DOM re-verified at
  1512/1024/768/700/390 — borders per-surface exact (#e5e5e5 default
  everywhere + #e5e7eb on the three explicit surfaces), tab tracks
  #737373 with the bare-shadow active pill (12px pill tabs at 390),
  curved sparks at 32/48px with solid color-50 chips, Lost Deals
  sparkless, the 404 structure + absolute title, the drawer focus
  landing inside; zero 390px overflow on all ten routes (nine + the
  404). One s11 e2e re-scoped: the reports-chart selector targets
  `[role=tabpanel] .recharts-wrapper` because the KPI sparks are
  recharts wrappers now.
- **Phase E:** 12 screenshots refreshed + the new `13-not-found.png`;
  `.env.example` re-verified unchanged; docs realigned (README, AGENTS,
  CLAUDE, PAD, SKILL **v1.9.0** with §16d, `docs/session_17.md`, this
  addendum, repo worklog).
- **Moving-target note:** the reference's dashboard KPI cards dropped
  `hover:shadow-md transition-shadow` + `border-gray-200` BETWEEN
  sessions (live-edited base44 app) — the s11 hover pin was re-derived
  to reports-only, and the "re-probe previously-pinned families" rule
  is recorded in AGENTS/SKILL.
