# Session 13 Remediation Plan — Doubled Titles + Profile-Page Parity + Button-Radius + Stock Dropdown Menu + Activities By-Type Rebuild + CardTitle Map + Calendar Cells + Chart Grid Dashes + Reports Funnel Type + Foreground Token (2026-09-30)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `22aeb95`
(baseline gate green: lint 0/0 · tsc clean · 206/206 unit · dev server healthy
on :3000 with `db/custom.db` at the repo root; `.env` / `.env.example` / `db/`
/ vitest + playwright configs all verified). The reference's demo data is
STILL zero (ninth consecutive session) — parity remains structural. All
reference DOM was captured at **1512×945** with computed-style probes on both
apps; the mobile-nav regression was re-verified LIVE at 390px before any
changes (7/7 PASS: burger hit-test, drawer open with 8 links + focus landing
INSIDE the panel, scroll locks, Escape + lock restore, focus-trap wrap,
resize-past-md auto-close, route-change close) and the 390px overflow sweep
is clean on all nine routes. Sessions 1–12 covered data/API, visual basics,
dialogs, layout, app chrome, functional controls, component anatomy, stock
primitives, chart internals, design tokens, the login reset flow, chart
geometry, stat shadows, the reports bare-tabs layout, the contacts
full-height architecture, the mobile-nav focus race, the custom 404, the
border-token split, stock Radix tabs and the recharts sparklines. This
session's audit targeted the **never-probed Profile page** (reached via the
topbar user menu — the menu itself turned out to be a Radix **Popover**, not
the reference's stock **DropdownMenu**), the **document titles of the auth
pages**, a **button-radius sweep of every page**, the **CardTitle size map
per page**, the **activities "by Type" card** (found structurally
incomplete), a **chart-grid dash sweep** (found the s10 "dashed default"
pin was wrong — recharts' default grid is SOLID; the reference passes
`strokeDasharray="3 3"` explicitly on every gridded chart), the **reports
tab-1 funnel chart type** (it is a horizontal BAR chart, not a FunnelChart),
and the **default foreground token** (the reference's body/card foreground
is `#0a0a0a`, ours `#111827`, with page h1s explicitly `text-gray-900`).

**Method:** TDD — new contracts land in `src/lib/page-layout.ts`
(`PROFILE_LAYOUT` additions, `BY_TYPE_*`, `CARD.title` flip + per-page
overrides), `tests/design-tokens.test.ts` (the foreground flip), new
`tests/page-titles.test.ts` (the auth absolute titles), and new pins in
`tests/page-layout.test.ts` / `tests/charts-contracts.test.ts`; e2e
assertions land in the same commits as the behavior changes (the
account-menu anatomy + the reports funnel chart type + the by-type card
structure). UI changes land with the full gate plus browser re-verification
at 1512/1024/768/700/390. The `skills/` folder stays excluded from all
checking, testing and compilation.

---

## Identified Issues, Bugs and Gaps (all DOM-verified unless noted)

| # | Sev | Issue | Evidence (live DOM / reproduction) |
|---|-----|-------|-----------------------------------|
| S13-P1 | **High** | **The auth pages SSR DOUBLED titles.** Raw server HTML: `/login` → `<title>NEO CRM \| NEO CRM</title>` and `/signup` → `<title>Sign up \| NEO CRM \| NEO CRM</title>` — the root layout's `"%s \| NEO CRM"` template wraps the pages' RELATIVE `title: "NEO CRM"` / `title: "Sign up \| NEO CRM"` (the signup string already contains the suffix). The live reference's login tab title is plain **"NEO CRM"**. Same bug class as the s12 404 fix: both pages need `title: { absolute: … }`. All nine app routes' titles verified matching (curl sweep both apps). | `curl /login` + `curl /signup` raw HTML vs `document.title` on the reference login; s12 not-found precedent (`title.absolute`) |
| S13-P2 | **High** | **Profile page (`/profile`) parity gaps — the page exists in the clone with matching content but diverges in nine details.** Reference anatomy: root `div [p-4 sm:p-8]` → `max-w-4xl mx-auto` → header `div [mb-6 sm:mb-8]` (plain) with h1 `text-2xl sm:text-3xl font-bold text-gray-900` + p `text-gray-500 mt-1`; left card = stock Card (`rounded-xl border bg-card text-card-foreground shadow`, border #e5e5e5 ✓) with STOCK CardTitle (`font-semibold leading-none tracking-tight`, 16px — ours renders `text-base sm:text-lg` = 18px); form groups: Full Name = stock Input, **Email (disabled) = stock Input + `bg-gray-50`** (ours `bg-transparent`), **Role (disabled) = stock Input + `bg-gray-50` + `capitalize`** so the raw value "user" displays "User" (ours lacks both); Save Changes = stock Button default variant (`bg-primary … shadow hover:bg-primary/90 h-9 px-4 py-2 w-full sm:w-auto`, **rounded-md**) and Upload Photo = stock outline Button with the camera icon carrying **`w-4 h-4 mr-2` on the svg itself** (ours: rounded-lg custom + `[&_svg]:mr-2` wrapper classes + `border-transparent bg-neutral-900` custom save). Right column: profile card with avatar (`w-20 h-20 mb-4`, User icon `w-10 h-10` — ✓ ours), h3 `font-semibold text-lg` ✓, p `text-sm text-gray-500` ✓, and the **"user" badge = the STOCK shadcn Badge default variant** (`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80` + `mt-2 capitalize`; bg #171717 ✓ fg #fafafa ✓) — ours is a hand-rolled minimal span without shadow/hover/transition/focus classes; the three info cards' icon boxes/colors/labels match (blue-100/user/blue-600, green-100/mail/green-600, purple-100/shield/purple-600 — ours inline-styled, computed-equal ✓). | full DOM tree walks + computed styles both apps at 1512 and 390; VLM round caught the Role "User" vs "user" display (the `capitalize` class) |
| S13-P3 | **High** | **Button radius: the reference is `rounded-md` (6px) on EVERY button on EVERY page; our Button component's base is `rounded-lg` (8px).** Measured both apps: reference contacts header buttons (Export CSV/Scan Card/Import/New Contact/Filters) = 36px tall, **6px** radius; accounts = sm-size 32px/6px ✓ (our `size="sm"` overrides to rounded-md — which is why accounts/activities/settings/dashboard pages already match); clone contacts/calendar/reports-saved/profile buttons render **8px**. Reference icon buttons (topbar messages/notifications) = `h-9 w-9 rounded-md` ✓; dialog buttons (Cancel/Create Account) = 6px; login submit keeps its own `rounded-xl` slate family ✓ (untouched). Fix: `button.tsx` base `rounded-lg` → `rounded-md`, `size lg` `rounded-lg` → `rounded-md` (unused today but pinned), `sm`/`iconSm` already rounded-md. | computed borderRadius sweeps across all 8 reference pages + profile + dialog + icon buttons vs the clone's 4 divergent pages |
| S13-P4 | **Med** | **The topbar account menu is a Radix POPOVER (role=dialog); the reference ships the stock Radix DROPDOWNMENU (role=menu + menuitems).** Reference content: `z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=*]:slide-in-from-*`; items: `relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0` with "Profile" + "Logout". Ours: `z-[60] overflow-hidden rounded-lg border border-line bg-surface p-1 text-foreground shadow-lg …` with custom items (`flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm … hover:bg-line-soft focus-visible:bg-line-soft`). Diffs: z-60→z-50, rounded-lg→rounded-md, shadow-lg→shadow-md, bg-surface/border-line/text-foreground tokens → bg-popover/border(default)/text-popover-foreground equivalents (values identical: white/#e5e5e5/#0a0a0a post-P9), items rounded-md→rounded-sm, hover:→focus: semantics, cursor-pointer→cursor-default, w-full text-left→relative. The menu items (Profile → `/Profile`, Logout) work on both. | role/menu dumps + class extraction + item behavior clicks on both apps |
| S13-P5 | **High** | **The activities "Activities by Type" card is structurally incomplete.** Reference: header `flex flex-col space-y-1.5 p-6 pb-3` (the FILTER_RAIL pattern) containing a title row `flex justify-between items-center` (CardTitle **`text-base`** + a BARE ••• button `text-gray-400 hover:text-gray-600`, 24px, no radius/bg) AND the subtitle **inside the header** (`text-xs text-gray-500` "**Last 2 days**" — STATIC: verified the range combobox does not change it); body `p-6 pt-0` = the 150px chart (no grid ✓) + a **chips row** `flex flex-wrap gap-3 mt-4` (five `flex items-center gap-2` chips: `w-3 h-3 rounded` color swatch with INLINE bg + `text-xs text-gray-600` "Call N"/"Email N"/"Meeting N"/"Task N"/"Note N") + a **footer** `mt-4 pt-4 border-t` (stock-style checkbox `peer h-4 w-4 shrink-0 rounded-sm border border-primary …` checked by default + label `text-sm font-medium cursor-pointer` "Activities" + a `ml-auto text-gray-400 hover:text-gray-600` •••). Chip colors (the chart series): **Call #3b82f6 blue-500, Email #8b5cf6 violet-500, Meeting #f59e0b amber-500, Task #10b981 emerald-500, Note #14b8a6 teal-500** — ours renders blue/cyan/amber/violet/gray (email/task/note wrong). Ours: custom flex-row header (`flex space-y-1.5 p-6 flex-row items-center justify-between`, title 18px, ghost iconSm ••• 28px), subtitle "Last {range} days" in the BODY (dynamic — reference is static "Last 2 days"), and NO chips row or checkbox footer. | card tree walks + innerHTML dumps + filter-change probe (Last 30 Days does not alter the subtitle) + chip color extraction both apps |
| S13-P6 | **Med** | **CardTitle sizes are a per-page map on the reference; ours is one global default.** Reference: dashboard (6) + leads (3) = `font-semibold tracking-tight text-base sm:text-lg` (our current default ✓ for those); accounts/activities/calendar filter-rail titles = `font-semibold tracking-tight text-base` (ours `text-base sm:text-base` — computed-equal, literal cleanup); activities by-type = `text-base` (ours 18px); **reports (11) + profile (1) = the STOCK `font-semibold leading-none tracking-tight`** (16px, no size class — ours 18px); **settings (5) = `font-semibold tracking-tight text-lg`** (18px at ALL widths — ours 16px below sm). Fix: flip `CARD.title` to the stock string and pass explicit overrides where the reference does (dashboard/leads `text-base sm:text-lg`; filters + by-type `text-base`; settings `text-lg`; reports/profile default). | `.font-semibold.tracking-tight` class sweeps across all 9 reference pages vs the clone |
| S13-P7 | **Med** | **Calendar out-of-month day cells hide their border; the reference keeps it.** Reference states: out-of-month `min-h-20 sm:min-h-24 p-1 sm:p-2 rounded-lg border transition-all bg-gray-50 text-gray-400` (border = default #e5e5e5); current `… bg-white hover:bg-gray-50`; today `… bg-blue-600 text-white border-blue-600` (ours bg-sidebar #2563eb ✓). Ours: out-of-month `border-transparent bg-line-soft/50 text-subtle` (border HIDDEN), current `border-line bg-white hover:border-primary/40`, transition-colors. Day cells are DIVs on the reference (not clickable) vs our BUTTONS (the documented clickable superset — semantics stay); the visual fix: out-of-month `border-transparent` → `border-line` (+ literal `bg-gray-50 text-gray-400 transition-all`), current-month hover → `hover:bg-gray-50` (reference's own hover), keep our focus-visible ring as the accessible superset. Also: "Agenda View" h3 misses `mb-4` (reference `text-lg font-semibold mb-4`; "Upcoming Events" ✓ has it). | day-cell class enumeration both apps (3 states each) + computed border checks |
| S13-P8 | **High** | **Chart grid dashes + the reports funnel chart TYPE.** (a) Every gridded reference chart renders `stroke-dasharray="3 3"` #ccc — dashboard (Sales Pipeline 11 lines, Revenue 12), reports tab-1 (Revenue 4, Won vs Lost 4, Pipeline 4, **funnel 15**), leads (Pipeline 10, Won vs Lost 4). Ours render SOLID (no dasharray) on every chart — the s10 comment "the CartesianGrid at the default DASHED 3 3" was a **misreading of the recharts default** (it is solid; the reference passes the dash explicitly). Fix: `strokeDasharray="3 3"` on the three CartesianGrids in `charts.tsx` (PipelineBarChart, RevenueLineChart, WonLostLineChart) + the new funnel. (b) The reference's reports tab-1 **"Conversion Funnel" is a HORIZONTAL BAR chart** — 534×300, CartesianGrid dashed, XAxis numeric (0…4), **YAxis category with the EIGHT raw slugs** `new/contacted/qualified/prospecting/qualification/proposal/negotiation/closed_won` (exactly our `REPORTS_PIPELINE_SLUGS` list, the s10 quirk register), no legend. Ours renders a recharts **FunnelChart with four trapezoids** (new/qualified/won/lost) — the s10 inference, disproven by today's DOM. Fix: a new horizontal `FunnelBarChart` (BarChart `layout="vertical"`, grid dashed, X numeric, Y category raw slugs) fed by the existing `pipeline` seam (reportsBucketCounts — the fixed 8-slug list renders ticks at zero exactly like the reference). The LEADS page funnel stays a FunnelChart (the reference's leads funnel renders NOTHING at zero — no axes/grid/shapes — unverifiable, documented inference). | grid-line attribute extraction on every chart card both apps (7 reference charts vs 7 clone charts); funnel axis tick dumps (X 0-4, Y 8 raw slugs, grid 15 dashed) |
| S13-P9 | **High** | **The default foreground token is #0a0a0a on the reference; ours is #111827.** Reference: `document.body` color `rgb(10,10,10)`, card-foreground `rgb(10,10,10)` — card titles, KPI values, buttons, dialog text all inherit it; the PAGE h1s are EXPLICIT `text-gray-900` (#111827 — dashboard, profile). Ours: `--color-foreground: #111827` everywhere, page h1s ride `text-foreground`. Computed diff on the KPI value: reference #0a0a0a vs ours #111827. Fix: `--color-foreground` → `#0a0a0a` (our `--color-ink` already #0a0a0a for inputs — stays), PAGE_HEADER titles → `text-gray-900` (all 4 variants + the profile h1), DialogTitle → the stock `text-lg font-semibold leading-none tracking-tight` (reference class dump; ours `text-lg font-semibold text-foreground` — gains leading-none tracking-tight and inherits the new default), and the KPI value drops its extra `leading-none tracking-tight text-foreground` → `text-2xl sm:text-3xl font-bold` (the reference's exact string; ours today computes line-height 30px vs reference 36px and letter-spacing −0.75px vs normal — REAL computed diffs). LOGIN_LAYOUT.title is already the slate family ✓ (untouched). | computed color/line-height/letter-spacing probes on body, cards, KPI values, h1s, dialog titles both apps |
| S13-P10 | **Med** | **The dashboard "Avg. Sales Cycle" KPI card carries a delta the reference does not have.** Reference card row = value SPAN `text-2xl sm:text-3xl font-bold` + unit SPAN `text-xs text-gray-600 mb-1` ("days") — NO third element. Ours adds `+1d` (`text-xs text-red-600 mb-1`). The reference renders deltas at zero on its OTHER cards (+5.3%, +15%, 0%), so a delta element here would render if it existed — it does not. Fix: the avg-cycle KPI spec drops its delta (value + unit only). | row-children dumps both apps (2 children vs 3) |
| S13-P11 | Info | **Verified-aligned (no action):** demo data still zero (9th session); KPI value+delta flex layout (`flex items-end gap-2`, delta `text-xs … mb-1`) ✓; dashboard chart legends (Revenue [Won, Target], pipeline none) ✓; tab-1 pipeline X ticks (raw slugs) ✓; th color #6b7280 ✓; text-gray-500 = our text-muted ✓; tabs muted-ink #737373 ✓ (s12); login slate family ✓; user-menu items Profile/Logout both work; the reference's mobile layer unchanged (no nav below md — our drawer stays the documented superset, 7/7 regression PASS); 390px overflow zero on all 9 routes; the reference's `/Profile` and `/profile` both resolve (ours `/profile` ✓); reference Export buttons + Sign up still dead (documented); VLM mobile-profile diff "JPG, PNG or GIF Max 5MB" was an OCR artifact (DOM: both "JPG, PNG or GIF. Max 5MB." ✓). | computed sweeps + regression runs listed above |

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. `tests/page-titles.test.ts` (NEW): pin `metadata.title` of
   `src/app/login/page.tsx` = `{ absolute: "NEO CRM" }` and
   `src/app/signup/page.tsx` = `{ absolute: "Sign up | NEO CRM" }` (import
   the pages' metadata objects; assert `.title.absolute`).
2. `tests/design-tokens.test.ts`: pin `--color-foreground: #0a0a0a` (the
   s13 flip).
3. `tests/page-layout.test.ts` new pins: `CARD.title` = stock string;
   `CARD_TITLE_OVERRIDE` map (dashboard/leads `text-base sm:text-lg`,
   filters+by-type `text-base`, settings `text-lg`); `FILTER_RAIL.title` /
   `titleWithAction` = `text-base` / `text-base flex items-center
   justify-between`; `BUTTON_BASE.rounded` = `rounded-md` (new contract
   group for the button radius); `PROFILE_LAYOUT` additions (header plain
   `mb-6 sm:mb-8`, stock cardTitle, email/role disabled inputs
   `bg-gray-50` + role `capitalize`, badge stock string + `mt-2 capitalize`,
   stock save/upload buttons with `w-full sm:w-auto`, upload icon
   `mr-2` on the svg); `BY_TYPE_CARD` group (headerPad/row/subtitle static
   "Last 2 days"/bare dots/chips row classes/chip colors/footer classes);
   `CALENDAR_CELL` group (out-of-month `border-line bg-gray-50
   text-gray-400 transition-all`, current `bg-white hover:bg-gray-50`);
   `KPI_VALUE` = `text-2xl sm:text-3xl font-bold` (no leading-none/
   tracking-tight/text-foreground); avg-cycle spec delta = null;
   `DIALOG_TITLE` = `text-lg font-semibold leading-none tracking-tight`;
   `MENU_CONTENT`/`MENU_ITEM` stock DropdownMenu strings; `FUNNEL_CHART`
   contract (layout vertical, dashed grid, numeric X, category Y raw
   slugs, `strokeDasharray="3 3"` on all four CartesianGrids).
4. e2e: `tests/e2e/crm.spec.ts` — the account menu opens a real
   `[role=menu]` with Profile/Logout menuitems; the reports tab-1 funnel
   renders `.recharts-yAxis .recharts-cartesian-axis-tick` texts including
   `closed_won` + a dashed grid; the by-type card shows the chips row +
   the "Activities" checkbox footer.

### Phase B — implementation

1. `src/app/login/page.tsx` + `src/app/signup/page.tsx`: absolute titles.
2. `src/app/globals.css`: `--color-foreground: #0a0a0a`.
3. `src/lib/page-layout.ts`: CARD.title flip + CARD_TITLE_OVERRIDE map;
   FILTER_RAIL literal cleanup; PROFILE_LAYOUT/BY_TYPE_CARD/
   CALENDAR_CELL/BUTTON_BASE/KPI_VALUE/DIALOG_TITLE/MENU_CONTENT/
   MENU_ITEM/FUNNEL_CHART contracts.
4. `src/components/ui/button.tsx`: base + lg `rounded-md`.
5. `src/components/ui/card.tsx`: CardTitle → stock default.
6. `src/components/ui/dialog.tsx`: DialogTitle stock string.
7. `src/components/ui/dropdown.tsx` (+ topbar): the account menu becomes a
   stock-classed DropdownMenu (z-50/rounded-md/shadow-md/items rounded-sm
   focus:bg-accent cursor-default relative); keep our token VALUES via the
   existing CSS variables where the reference uses popover tokens.
8. `src/components/shared/page-parts.tsx`: KPI value string + avg-cycle
   delta removal; per-page CardTitle overrides via `PAGE_HEADER`/call
   sites.
9. Page call sites: dashboard (6) + leads (3) CardTitle `text-base
   sm:text-lg`; accounts/activities/calendar filters + by-type `text-base`;
   settings (5) `text-lg`; reports + profile stock.
10. `src/app/(app)/profile/profile-page.tsx`: header wrapper → plain
    `mb-6 sm:mb-8`; root `p-4 sm:p-8`; email/role inputs `bg-gray-50` +
    `capitalize`; stock Badge/BUTTONS for save/upload (icon `mr-2`).
11. `src/app/(app)/activities/activities-page.tsx`: by-type card rebuild
    (header pattern + static subtitle + chips row + checkbox footer +
    bare ••• buttons + series colors blue/violet/amber/emerald/teal).
12. `src/app/(app)/calendar/calendar-page.tsx`: day-cell state classes +
    Agenda View `mb-4`.
13. `src/components/charts/charts.tsx`: `strokeDasharray="3 3"` ×3 + the
    new horizontal `FunnelBarChart`; `src/app/(app)/reports/
    reports-page.tsx` swaps the tab-1 funnel to it (pipeline seam).

### Phase C — full gate + browser re-verification

lint → typecheck → 206+ unit → build → e2e (28+) → DOM re-verification at
1512/1024/768/700/390 (titles via curl, KPI value computed styles, button
radii, card titles, by-type card, calendar cells, grid dashes, funnel
axes, account menu, profile form) → zero 390px overflow on all 9 routes +
`/nonexistent`.

### Phase D — deliverables

Screenshots refreshed (13) + the new `/profile` capture; `.env.example`
re-verified; docs realigned (README test counts + button radius + CardTitle
map, AGENTS session-13 contracts + the dashed-grid correction, CLAUDE, PAD,
SKILL v1.10.0 §16e, `docs/session_19.md`, this addendum, repo worklog),
commit on main + SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 38 failing checks confirmed RED before any
implementation — `tests/page-titles.test.ts` (2: the auth absolute
titles), `tests/charts-contracts.test.ts` (4: grid dashes on the four
charts + the funnel-as-bar type), 29 new pins in
`tests/page-layout.test.ts` (CARD title flip + CARD_TITLE_OVERRIDE,
FILTER_RAIL literal cleanup, BUTTON_BASE radius, PROFILE_LAYOUT,
BY_TYPE_CARD, CALENDAR_CELL, KPI_VALUE, DIALOG_TITLE, MENU_CONTENT/
ITEM, FUNNEL_CHART), 3 re-pins in `tests/design-tokens.test.ts`
(foreground #0a0a0a; later + the 16px base font). Three e2e reds: the
account menu role=menu, the reports funnel ticks, the by-type chips +
footer.

**Phase B (implementation):** all thirteen findings implemented as
listed in §ToDo — login/signup absolute titles; the globals.css
foreground flip; the page-layout.ts contract groups + CARD title map;
button.tsx/card.tsx/dialog.tsx/label.tsx stock strings; the new
dropdown.tsx Menu primitives + topbar wiring; KpiCard value string +
avg-cycle delta removal; per-page CardTitle overrides at the six call
sites; the profile-page rebuild (header/input/badge/button families);
the activities by-type card rebuild (header + static subtitle + chips +
footer + bare dots + the re-pinned series colors); the calendar
day-cell states + Agenda View mb-4; the four dashed grids + the new
FunnelBarChart + the reports funnel swap.

**Mid-verification findings (after the suite was green):** the base
font-size is 16px on the reference (ours 14px — scaffold-era
assumption) and the Label is stock shadcn (`text-sm font-medium
leading-none`, 14px vs our 12px custom). Both fixed with comment-aware
test updates (a self-comment tripped the first regex); 244/244.

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
244/244 unit · build · **31/31 e2e** (mobile-nav 7/7; one e2e locator
fix during the run: the by-type footer checkbox). One OPERATIONAL
failure root-caused during the gate: the e2e auth setup timed out
because a bare `next build` had left the standalone server without its
static chunks (`/_next/static` 404s → no hydration → the login form
degrades to a native GET submit); rebuilt through `bun run build`
(next build + the static/public copy steps). Live DOM re-verified on a
fresh dev server at 1512 + 390 on every touched surface; zero 390px
overflow on all ten routes; two VLM rounds (dashboard + profile) — all
remaining diffs data-driven or OCR/platform artifacts (the profile
"Üser" claim DOM-disproven: both render "User" via capitalize).

**Phase D (deliverables):** 13 screenshots refreshed under
`docs/screenshots/`; `.env` / `.env.example` / `db/` / vitest +
playwright configs re-verified; docs realigned (README badge + counts +
e2e coverage, AGENTS counts + session-13 contract block + build-script
note, CLAUDE test strategy, PAD tree + test matrix + session-13 notes,
SKILL v1.10.0 §16e, `docs/session_19.md`, this addendum, both
worklogs). Committed on main + SSH-wrapper push.
