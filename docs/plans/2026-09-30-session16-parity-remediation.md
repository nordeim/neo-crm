# Session 16 Remediation Plan — The Responsive Page-Root Model + the Table Kit + the Calendar Card (2026-09-30)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `2f819a4`
(baseline gate green: lint 0/0 · tsc clean · 280/280 unit · dev server
healthy on :3000 with `db/custom.db` at the repo root; `.env`
(`DATABASE_URL="file:../db/custom.db"`) / `.env.example` / vitest +
playwright configs verified — the task book's config asks were already
satisfied by prior sessions and re-verified this session). The audit
layer this session: **the responsive page anatomy** — the page-ROOT
model at 390/900/1512 (padding ownership, bg + min-height, the contacts
full-height layout), the table kit's stock strings, and the calendar
card's internals (a surface only ever pinned at the CELL level). The
mobile navigation — the standing priority — was verified three ways
FIRST: the reference still ships NO mobile nav at 390 (12th consecutive
session: sidebar `display:none` via `hidden md:flex`, mail/bell
`display:none`, no burger), our 7-check drawer regression ran LIVE at
390 **7/7 PASS** (trigger hit-test scoped to `header button[aria-expanded]`,
open + 8 links + focus inside the dialog, dual scroll locks, Escape +
lock restore, focus-trap wrap, resize-past-md auto-close, route-change
close), and the drawer internals swept clean for v4 hazards (h-dvh 844 =
innerHeight, `space-y-1` gaps land on BLOCK links, blur 2px, #2563eb
panel). The 390px overflow sweep is clean on all eleven routes (incl.
`/Profile`). Demo data: **zero in steady state** (12th consecutive
session) — with one documented anomaly below.

**The reference's page-root model (the session's structural find):**
every page owns its own padding — the dashboard, accounts, calendar,
activities, reports and settings roots ship `p-4 sm:p-8 bg-gray-50
min-h-screen`; the Leads and Profile roots ship just `p-4 sm:p-8` (the
reference drops the bg + min-height on those two — main's own gray-50
fills the gap); the Contacts root IS the full-height layout (`flex
h-[calc(100vh-64px)]` directly under `main`, no padding wrapper — the
padding lives inside its `flex-1 overflow-auto` scroller). Our clone
instead wraps EVERY page in a blanket `SHELL_LAYOUT.inner`
(`p-4 sm:p-8`) div inside the AppShell — which double-pads the contacts
full-height layout and breaks its geometry.

**Method:** TDD — new contracts land in `src/lib/page-layout.ts`
(`PAGE_ROOT`, `CALENDAR_CARD`, the reworked `TABLE_CARD` notes + table
kit strings), pinned by `tests/page-layout.test.ts` +
`tests/design-tokens.test.ts` (the global th/td reset); e2e assertions
land in the same commit as the behavior changes. UI changes land with
the full gate plus browser re-verification at 1512/900/768/700/390. The
`skills/` folder stays excluded from all checking, testing and
compilation.

---

## Identified Issues, Bugs and Gaps (all DOM-verified)

| # | Sev | Issue | Evidence (live DOM / reproduction) |
|---|-----|-------|-----------------------------------|
| S16-P1 | **High** | **Contacts double-padding — the AppShell's blanket `SHELL_LAYOUT.inner` wrapper sits OUTSIDE the full-height layout.** Reference at 390: `main > flex h-[calc(100vh-64px)]` (full-width 390px, the padding inside its `flex-1 overflow-auto > p-8` scroller) — table card 326px wide, `main` scrolls exactly the 5px mirrored topbar quirk (780 vs 775). Ours: `main > p-4 sm:p-8 > div > flex h-[calc(100vh-64px)]` — the h-calc box is 358px wide inside 16px page padding, the contacts table card 294px (-32px), and `main` scrolls 37px (812 vs 775 — the double padding). The full-height model is broken: the reference's contacts page never scrolls `main` beyond the 5px quirk. | live geometry probes at 390 both apps (h-calc width 390 vs 358, card 326 vs 294, mainScroll 5 vs 37) |
| S16-P2 | **Med** | **The page-root model: padding belongs to the PAGE, not the shell.** Reference roots: dashboard/accounts/calendar/activities/reports/settings `p-4 sm:p-8 bg-gray-50 min-h-screen`; Leads + Profile `p-4 sm:p-8` only; Contacts the h-calc flex. Ours: one blanket shell wrapper for all (the P1 root cause). Fix together: retire `SHELL_LAYOUT.inner`, add the per-page root. | page-root class census at 390 on all 9 routes both apps |
| S16-P3 | **Med** | **Table container is not stock.** Reference: `relative w-full overflow-auto` (the shadcn stock). Ours: `relative w-full overflow-x-auto scrollbar-thin` (x-only scroll + a custom scrollbar utility). | table container class dumps on every entity table |
| S16-P4 | **Med** | **Table kit stock-string gaps + the platform's global th/td reset.** (a) Reference TableHead: `h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]` — ours drops both checkbox variant classes. (b) Reference TableCell: `p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]` — ours drops them. (c) Reference TableRow: `border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted` — ours ships `hover:bg-line-soft/60` (60% vs 50% opacity) and NO selected state. (d) The reference's platform ships a global `th, td { padding: 1px }` reset that surfaces wherever no class overrides it: standard th compute `1px 8px` (header rows 43px) vs our `0px 8px` (41px), and the dashboard compact th compute `8px 1px` vs our `8px 0px`. | computed paddings + class strings on accounts/reports/dashboard tables both apps |
| S16-P5 | **High** | **The border leak: four TABLE_CARD surfaces render a border the reference does not ship.** Reference: accounts/leads table cards + the activities table card + the activities timeline card are plain `bg-white rounded-lg shadow` divs (0px border, computed; the timeline adds `p-6`; NO overflow-hidden anywhere). Ours: all four render via the `Card` primitive whose base carries `border border-line` — `cn(TABLE_CARD.card, …)` never removes it (tailwind-merge only replaces same-property classes), so all four compute 1px borders; accounts + leads also add an invented `overflow-hidden`. | live class + borderTopWidth probes at 390 + 1512 on accounts/leads/activities both apps |
| S16-P6 | **High** | **Settings picklist grid breakpoint: `lg` where the reference ships `md`.** Reference: `grid grid-cols-1 md:grid-cols-2 gap-4` — at 900px it renders 2 columns (282px cards). Ours: `grid grid-cols-1 gap-4 lg:grid-cols-2` — 1 column at 900px (580px cards). Invisible to the standing 390/1512 probe widths (both agree there) — a mid-width-only divergence. | live at 900px both apps |
| S16-P7 | **High** | **Calendar card internals — the merged-grid + CardHeader structure diverges from the reference's flat anatomy.** Reference card: `rounded-xl border bg-card text-card-foreground shadow p-4 sm:p-6 mb-6` (padding ON the card) with THREE flat children: (1) header row `flex items-center justify-between mb-6` with h2 `text-xl sm:text-2xl font-bold text-gray-900` + nav `flex gap-2`; (2) DOW grid `grid grid-cols-7 gap-1 sm:gap-2 mb-2` with seven `text-center text-xs sm:text-sm font-semibold text-gray-600 py-2` divs; (3) month grid `grid grid-cols-7 gap-1 sm:gap-2` (35 div cells). Ours: CardHeader-based header (`flex space-y-1.5 p-6 flex-row items-center justify-between px-0 pt-0` — a padding-neutralized wrapper) with h2 `text-lg font-semibold text-foreground` (18px semibold vs 20/24px bold gray-900) + nav `flex items-center gap-1` (4px vs 8px gap); a CardContent `p-6 px-0 pb-0 pt-4` wrapper; and ONE merged `grid grid-cols-7 gap-1 text-center` grid holding the 7 DOW spans (`pb-1 text-[11px] font-semibold tracking-wide text-subtle`) + all 35 cells (42 children). Measured gaps: header→DOW 16px vs 24px; DOW→month 4px vs 8px. | live structure dumps + gap measurements at 390/900 both apps |
| — | Info | **Reference anomaly (documented, no action):** one `/Reports` load this session served the FULL demo dataset (Recent Won Deals + Top Deals by Value with "Marketing automation / Cedar Retail Group / $39.0k" etc. — the same dataset our seed mirrors), then 6/6 subsequent loads rendered the steady zero state. An instance with data exists behind the platform's load balancer; the steady state remains zero (12th session). If a future session catches the data instance, the edit-dialog/picklist/upload layers become verifiable — re-check on login every session. | load sequence this session |

**Verified-aligned (no action):** the responsive section anatomy of every
other page at 390 (dashboard/accounts/contacts/leads/activities/reports/
settings/profile section classes identical or computed-equal); the KPI
grids (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6` etc.);
all three tab tracks (activities/settings segmented + reports pill —
token spellings, inactive color rgb(115,115,115) both); the contacts KPI
grid (`md:grid-cols-2 lg:grid-cols-4` — already md); the calendar rail
card; the calendar today-cell + out-of-month state classes (s13 pins
hold); the reports sticky filter card; the profile `max-w-4xl mx-auto`
inner; our literal `bg-gray-50` compiles rgb(249,250,251) under v4
(canvas pixel-verified = the reference's exact value — NO
literal-palette drift for gray-50); the drawer regression 7/7; zero
390px overflow on all eleven routes.

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. `tests/page-layout.test.ts` new pins:
   - `PAGE_ROOT.standard` = `p-4 sm:p-8 bg-background min-h-screen`
     (token spelling — `bg-background` = #f9fafb computes equal to the
     reference's literal `bg-gray-50`, canvas-verified this session) and
     `PAGE_ROOT.bare` = `p-4 sm:p-8`; `SHELL_LAYOUT.inner` RETIRED (the
     shell renders children directly in `main`).
   - `TABLE_CARD` call-shape rule: a source assertion that no
     `TABLE_CARD` surface renders through the `Card` primitive (the
     border-leak regression guard) — the four surfaces are plain divs.
   - Table kit stock strings (pinned against `src/components/ui/table.tsx`
     sources): container `relative w-full overflow-auto` (no
     `scrollbar-thin`, no `overflow-x`), TableHead + TableCell carry the
     checkbox variant classes, TableRow `hover:bg-line-soft/50` +
     `data-[state=selected]:bg-line-soft`.
   - `CALENDAR_CARD` (new contract): headerRow / title / navRow / dowGrid
     / dowLabel / monthGrid strings as extracted above.
   - `SETTINGS_GRID` (new pin): `grid grid-cols-1 md:grid-cols-2 gap-4`
     (the md breakpoint).
2. `tests/design-tokens.test.ts`: the base-layer global
   `th, td { padding: 1px }` reset is present (the platform mirror —
   source-level assertion on `globals.css`).
3. e2e additions (`tests/e2e/crm.spec.ts`):
   - Contacts at 390: the h-calc layout is the DIRECT child of `main`
     (full-width 390px), the table card is 326px wide, and `main`'s
     scrollHeight exceeds clientHeight by ~5px (the mirrored quirk, not
     37px).
   - Settings at 900: the picklist grid renders 2 columns.
   - Calendar: two separate grid-cols-7 rows (DOW + month) and the h2 is
     `text-xl sm:text-2xl font-bold`.
   - The accounts table card computes a 0px border.

### Phase B — implementation

1. `src/lib/page-layout.ts`:
   - Retire `SHELL_LAYOUT.inner`; add `PAGE_ROOT`
     (`standard` / `bare`); document the per-page map in the contract
     comment.
   - Add `CALENDAR_CARD`; add the `SETTINGS_GRID` pin; note the
     TABLE_CARD plain-div rule in the contract comment.
2. `src/components/layout/app-shell.tsx`: `<main>{children}</main>` —
   no inner wrapper.
3. Page roots (9 pages): dashboard `(app)/page.tsx`, accounts,
   calendar, activities, reports, settings → wrap in
   `<div className={PAGE_ROOT.standard}>`; leads + profile →
   `PAGE_ROOT.bare`; contacts → drop the outer plain `<div>` so
   `CONTACTS_LAYOUT.fullHeight` IS the root (its `p-8` content stays).
4. `src/components/ui/table.tsx`: the stock container + the checkbox
   variant classes on TableHead/TableCell + the TableRow hover/50 +
   selected state (token spellings: line-soft = the reference's muted
   surface).
5. `src/app/globals.css` base layer: `th, td { padding: 1px; }` (the
   platform reset mirror — classes override it, exactly like the
   reference; header rows grow to 43px, the compact th/td gain the 1px
   horizontal).
6. The four TABLE_CARD surfaces → plain divs: accounts:210 and
   leads:276 (`<div className={TABLE_CARD.card}>`, drop
   `overflow-hidden`), activities:286 (`<div className={TABLE_CARD.card}>`),
   activities:370 (`<div className={cn(TABLE_CARD.card, "p-6")}>`).
   contacts:232 is already a plain div (no change).
7. `settings-page.tsx`: the picklist grid `lg:grid-cols-2` →
   `md:grid-cols-2` (via the new pin).
8. `calendar-page.tsx`: rebuild the card internals — flat children in
   the padded card (`mb-6 p-4 sm:p-6` stays on the Card root), the
   header row + title + navRow per contract, the DOW grid with the seven
   label divs, the month grid with the 35 cells (cells KEEP the
   button + flex-stack superset and the s13 state classes).

### Phase C — full gate + browser re-verification

lint → typecheck → 280+ unit → `bun run build` (NEVER bare `next build`)
→ e2e (37+) → DOM re-verification at 1512/900/768/700/390 (the contacts
326px card + 5px scroll quirk, the borderless table cards, the 43px
header rows, the settings 2-col at 900, the calendar gaps 24/8px + two
grids + the bold title, the tab tracks, the drawer 7/7 re-run) → zero
390px overflow on all eleven routes.

### Phase D — deliverables

Screenshots refreshed (19 established + any new captures);
`.env` / `.env.example` re-verified; docs realigned (README badge +
counts + feature rows, AGENTS counts + the session-16 contract blocks +
the page-root model + the th/td reset + the border-leak lesson, CLAUDE
counts, PAD matrix + session-16 notes, SKILL v1.13.0 §16h,
`docs/session_25.md`, this addendum, both worklogs), commit on main +
SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 18 failing checks confirmed RED before any
implementation — the PAGE_ROOT pair + the SHELL_LAYOUT.inner retirement
(3: the pair, the shell contract rewrite, the source-level wrapper ban),
the per-page-root source pins (2), the contacts-fullHeight-root source
pin (1), the four table-kit stock string pins (4), the TABLE_CARD
plain-div source rules (2), the CALENDAR_CARD contract + page source
rule (4), the SETTINGS_GRID md pin (1), the design-tokens th/td reset
(1) + 4 e2e additions (contacts 390 geometry, settings 2-col at 900,
the calendar two-grid + bold-title anatomy, the borderless accounts
card).

**Phase B (implementation):** all ten edits landed as planned — the
AppShell wrapper retired, nine page roots added (six standard, two bare,
contacts fullHeight as root), the table kit on stock strings + the
global th/td reset in the base layer, the four TABLE_CARD surfaces as
plain divs, the settings grid at md, and the calendar card rebuilt flat
(header row + DOW grid + month grid; cells keep the clickable superset).

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**297/297 unit** (+17 net: 18 new checks, 1 rewritten shell pin) ·
build via `bun run build` · **41/41 e2e** (+4; mobile-nav 7/7; one
mid-flight e2e fix — the settings-grid test gained a waitForFunction
after the single-shot evaluate raced the settings fetch). Live DOM re-verified on a fresh dev server at
1512/900/768/700/390: the contacts h-calc full-width 390 + card 326px +
main scroll 5px (the quirk restored), the borderless accounts/leads/
activities cards + the p-6 timeline, 43px header rows + the 1px compact
th horizontal, hover /50, the settings 2-col at 900 (282px cards), the
calendar two-grid split + 24px/8px gaps + `text-xl sm:text-2xl font-bold
text-gray-900` title + 8px nav gap, every other page's sections
unchanged, the drawer 7/7, zero 390px overflow on all eleven routes.

**Phase D (deliverables):** 20 screenshots (19 established — all
re-captured with per-shot URL/dialog verification after the first 1512
loop silently failed to navigate — + the NEW contacts 390 full-height
capture); `.env` / `.env.example` / `db/` / configs re-verified; docs
realigned (README badge 338 + counts + the calendar/activities/
contacts/settings feature rows, AGENTS counts + the session-16 contract
blocks + the page-root model + the th/td platform reset + the
tailwind-merge border-leak lesson, CLAUDE counts + test strategy, PAD
matrix 297/41 + session-16 notes, SKILL v1.13.0 §16h,
docs/session_25.md, this addendum, both worklogs). Committed on main +
SSH-wrapper push.
