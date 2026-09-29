# Session 7 Remediation Plan — App-Chrome & Identity-Layer Parity (2026-09-29)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `29f0f84`
(baseline gate green: lint 0/0 · tsc clean · 92/92 unit; session-6 work pushed
at `a7690dc`). The reference's demo data is STILL reset to zero, so parity
continues to target structure. Sessions 1–6 covered data/API, visual details,
interactive dialogs, and the page layout system; this session's audit targeted
the one layer never systematically extracted — the **app chrome** (shell,
sidebar, topbar), the **identity surfaces** (login, user menu), and the
reference's **regressions since session 6** (the calendar search input is
back, the reports Reset button is back). Every item below is evidence-backed
by class-list/DOM extraction on the logged-in reference at 1512×945,
900×800, 700×800 and 390×844, plus one live-computed color probe
(`rgb(37,99,235)` on the reference's primary button).

**Method:** TDD — new layout contracts land in `src/lib/page-layout.ts` with
failing unit tests first; UI changes land with the full gate plus browser
re-verification at 1512/1024/900/768/390. The `skills/` folder stays excluded
from all checking, testing and compilation.

**Baseline evidence:** DOM extraction transcripts in this session log; live
auth state saved at `/home/z/my-project/live-auth-s7.json`.

**Reference quirks deliberately NOT copied** (carried forward plus new):

- All previous quirk-register entries stand (duplicate Recent Deals "Status"
  column, dead header Add/More…, dead signup/forgot links, static
  "Last 2 days" caption, raw `closed_won` funnel keys, dead view-switcher
  selects, contacts stub filters card, missing mobile navigation — our drawer
  stays).
- **Sidebar nav `href="/Dashboard"`** (capitalized) — internal routing
  quirk; ours keeps canonical `/` routes.
- **Live login logo** is a hotlinked Supabase screenshot image — reproduced
  as a CSS brand mark (white circle + blue dot, same as the sidebar brand);
  no external asset dependency.
- **CardTitle is a `<div>` on the reference** (no heading semantics in
  cards). Ours keeps `<h3>` — deliberate a11y superset, same as the drawer
  fix; the e2e golden path asserts five card titles via heading roles.
- **Dead bell/mail buttons** (no dropdowns on the reference) — mirrored
  (ours render the same affordances with no handlers).
- **"Add new industrie" placeholder typo** (settings) — MIRRORED for
  parity, consistent with the "Conversion Funnel" typo we already mirror.

---

## Identified Issues, Bugs and Gaps (all DOM-verified)

| # | Sev | Issue | Evidence (live DOM) |
|---|-----|-------|---------------------|
| S7-1 | High | **Primary token is one shade light**: our `--color-primary #3b82f6` (blue-500); every live primary button is `bg-blue-600 hover:bg-blue-700` — computed `rgb(37,99,235)` = `#2563eb` (New Event probe). Affects all primary buttons + `text-primary` links globally. | computed-color probe + button class extraction (calendar, reports, settings) |
| S7-2 | High | **Shell scroll model**: live root is `flex h-screen` — sidebar is an IN-FLOW flex child, the main column is `flex-1 flex flex-col overflow-hidden`, and `main.flex-1.overflow-auto` scrolls internally (the window never scrolls). Ours: `fixed` sidebar + `min-h-screen` content column → the WINDOW scrolls and `main.overflow-auto` is inert (verified on the dev server: `mainScrollable=false`, window scrolls). Impact: scrollbar sits outside the topbar; sticky-report bar relies on window scroll. | root-tree extraction; dev-server scroll probe |
| S7-3 | High | **Sidebar breakpoint**: live sidebar is `hidden md:flex` — visible from **768px**. Ours: `hidden lg:flex` (1024px). Between 768–1023 the reference shows the sidebar; ours shows the drawer hamburger. | `getBoundingClientRect` probes at 900/700px |
| S7-4 | High | **Sidebar brand**: live `p-6 flex items-center gap-3` + `w-10 h-10 bg-white rounded-full` containing `w-6 h-6 bg-[#2563eb]` circle + wordmark `text-2xl font-bold`. Ours: `px-5 py-5` + 32px empty white ring + `text-lg tracking-wide`. | brand extraction |
| S7-5 | High | **Nav items**: live `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors` + `hover:bg-white/5`, active `bg-white/10`; icons `w-5 h-5` stroke-2 uniform; label `<span class="font-medium">`. Ours: `px-3 py-2.5 text-sm font-medium text-white/85`, `hover:bg-white/10`, active `bg-white/15 font-semibold`, icons 18px sw 1.8/2.2. | nav link extraction (active + inactive) |
| S7-6 | Med | **Nav footer group**: live `mt-auto space-y-1 pt-4 border-t border-white/10` — pinned to the sidebar BOTTOM with a top border. Ours: a mid-list `my-2 h-px bg-white/15` divider, not bottom-pinned. Nav container: live `flex-1 px-3 space-y-1 flex flex-col` with `space-y-1` group wrappers. | sidebar tree extraction |
| S7-7 | High | **Mobile drawer range**: with the sidebar at `md`, the drawer + trigger must switch `lg:hidden` → `md:hidden` (the drawer remains our fix for the reference's missing nav below 768). e2e mobile suite runs at 390px — unaffected. | breakpoint probes |
| S7-8 | High | **Topbar header**: live `bg-white border-b border-gray-200 px-4 sm:px-8 py-4` STATIC with inner `flex items-center justify-between gap-4`. Ours: `sticky top-0 z-40 h-16` with `ml-auto` right group and `gap-2 sm:gap-4`. | header extraction |
| S7-9 | High | **Topbar search**: live hidden below `sm` (`hidden sm:flex flex-1 max-w-xl` → `relative w-full`), icon `w-5 h-5 text-gray-400`, input `h-9 w-full rounded-md border pl-10 bg-gray-50 border-gray-200`. Ours: always visible, icon 16px, `pl-9 bg-white rounded-lg sm:max-w-md`. Keep our functional results dropdown + aria-label (e2e). | header inner extraction |
| S7-10 | Med | **Mail/bell buttons**: live `h-9 w-9 rounded-md text-gray-600 hidden sm:flex` with `w-5 h-5` stroke-2 icons. Ours: `rounded-lg text-muted` with 18px sw-1.8 icons. | button extraction |
| S7-11 | High | **User button**: live is a rectangular ghost `h-9 px-4 py-2 rounded-md hover:bg-accent` with `gap-1 sm:gap-2`, label `text-sm font-medium text-gray-700 hidden sm:inline`, a 32px `bg-gray-200 text-gray-600` initial avatar and `chevron-down w-4 h-4 text-gray-500`. Ours: `rounded-full p-1 pr-2` pill, `max-w-[140px] truncate` label, colored avatar, 14px chevron. | user button extraction |
| S7-12 | Med | **User menu**: live `min-w-[8rem]` with plain Profile + Logout items — NO separator, NO destructive red. Ours: `min-w-[11rem]`, separator + destructive Logout. | menu extraction (opened via real click) |
| S7-13 | High | **Calendar header search (reference regression)**: NEW since session 6 — actions row is `flex gap-2 w-full sm:w-auto` holding a `relative flex-1 sm:flex-none sm:w-64` search (icon left-3 `w-4 h-4`, input `pl-9 h-9`, placeholder "Search events...") before the New Event button. Ours has none. | actions extraction |
| S7-14 | High | **Reports bar (reference regression)**: the Reset button is BACK — bar buttons are now h-8: Reset = outline `h-8 px-3 text-xs` + `rotate-ccw w-4 h-4 mr-2`; Export CSV = primary `h-8` + `download w-4 h-4 mr-2`; PDF = outline `h-8` + `file-text w-4 h-4 mr-2`. The first two selects gained leading icons (`calendar`/`user` `w-4 h-4 text-gray-500`) in `flex items-center gap-2` wrappers. Session 6 pinned h-9 buttons + iconless selects; ours removed Reset entirely. | sticky-bar extraction + icon inventory |
| S7-15 | Med | **Calendar nav buttons**: prev/next = outline `h-9 w-9` icon buttons; Today = outline h-9 `hidden sm:flex` (hidden on phones). Ours: secondary h-7 icons + always-visible secondary Today. | calendar card extraction |
| S7-16 | Med | **Subtitle sizes split**: calendar + reports subtitles are `text-gray-500 text-sm mt-1` (14px); contacts/leads/settings/profile are `text-gray-500 mt-1` (16px). Ours: all 16px. | per-page subtitle extraction |
| S7-17 | Med | **Activities card headers**: Priority header row is `flex items-center justify-between mb-4` with `h2 text-lg font-semibold` + ghost h-8 "More"; Timeline is a plain `flex items-center justify-between mb-6` row inside the `p-6` card with `h2 text-lg font-semibold` + ghost h-8 **"•••" TEXT** button; Timeline empty state `text-center py-12 text-gray-500` (16px). Ours: CardTitle h3 `text-base sm:text-lg`, SVG icon buttons, `py-10 text-sm` empty states. | activities card extraction |
| S7-18 | Med | **Dashboard card headers**: Add buttons (Lead Sources / Upcoming Activities) = ghost `h-8 px-3 text-xs` with **`text-blue-600`** + `plus w-4 h-4 mr-1`; ellipsis buttons = ghost `h-8 w-8`. Ours: `h-7 px-2` non-blue Adds + `iconSm` (h-7 w-7) ellipsis. | card header extraction |
| S7-19 | Med | **Settings picklists**: items container `space-y-2 mb-4`; empty state plain `text-sm text-gray-500 text-center py-4` (ours: dashed box, text-xs); add button = primary `h-9 px-4 py-2` icon-only Plus (ours: dark-800 icon); reference placeholder typo "Add new industrie". | picklist card extraction |
| S7-20 | High | **Login card (never re-pinned since session 1)**: live wrapper `min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4`; card `relative overflow-hidden border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl` with a `h-1` gradient accent strip; `p-8 sm:p-10` inner; centered `flex flex-col items-center text-center space-y-6 sm:space-y-8`; logo `h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-white/50` with glow; h1 `text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight`; subtitle `text-sm sm:text-base font-medium`; Google button white `px-5 py-3.5 rounded-xl text-[16px]`; divider `my-6` + "or" `bg-white uppercase tracking-wider`; inputs `h-11 sm:h-12 rounded-xl bg-slate-50/50 border-slate-200 pl-10 placeholder:text-slate-600`; Sign in `h-11 sm:h-12 bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm`; footer `flex flex-col sm:flex-row justify-between` with `text-slate-500` links. Ours: a completely different bordered-card design (h-10 inputs, text-xl h1, blue links). | full login card + wrapper extraction |
| S7-21 | Low | **Toast container position**: live `fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0` — top of screen on mobile, bottom-right from sm. Ours: bottom-right always. | root-tree extraction |
| S7-22 | Med | **TrendStatCard anatomy** (calendar KPI cards): live card `p-4` (ours p-5), top row `flex items-start justify-between mb-3` (ours no mb-3), icon chip `w-10 h-10 rounded-lg bg-blue-50` + icon `w-5 h-5 text-blue-600` (ours 36px + `${color}1a` tint), trend `flex items-center gap-1 text-xs text-green-600` + trending-up `w-3 h-3` (ours `font-semibold text-success`), value `text-2xl font-bold`, label `text-xs text-gray-600 mt-1`. | KPI card extraction |
| S7-23 | Med | **Delta text colors**: live deltas are `text-green-600` (`rgb(22,163,74)`) / `text-red-600` (`rgb(220,38,38)`) — computed probes on dashboard +5.3% and activities 2h-overdue. Ours: `text-success #10b981` / `text-danger #ef4444` (one shade off on both). | computed-color probes |
| S7-24 | Low | **Base Card shadow**: live bordered cards are `rounded-xl border bg-card shadow` (shadow, not shadow-sm) — settings picklists, calendar cards, KPI stat cards, rails all use it. | card class extraction (6× on accounts) |

---

## Remediation ToDo (TDD)

### Phase A — layout contracts, red first
- [x] **A1** Extend `tests/page-layout.test.ts` with failing pins for new
      `src/lib/page-layout.ts` records: `SHELL_LAYOUT` (root row / sidebar /
      main column / main scroller / inner pad), `NAV_LAYOUT` (brand, link,
      active, icon size, footer group, container), `TOPBAR_LAYOUT` (header,
      inner row, search block + icon + input, icon button, right group, user
      button, user menu), `LOGIN_LAYOUT` (page wrapper, card, accent, inner,
      centered col, logo, title, subtitle, google, divider, field, input,
      submit, footer links), `STAT_CARD` (TrendStatCard pins),
      `ACTIVITY_CARD` (priority/timeline header rows + more-dots button),
      `DASHBOARD_CARD` (add/ellipsis buttons), `SETTINGS_PICKLIST` (empty,
      items, add row/button); update `PAGE_HEADER` (subtitleSm variant for
      calendar/reports) and `REPORTS_FILTER_BAR` (h-8 buttons + reset +
      icon-wrapped selects).
- [x] **A2** Implement to green in `src/lib/page-layout.ts`; consume from
      the components.

### Phase B — design tokens (S7-1, S7-23, S7-24)
- [x] **B1** `globals.css`: `--color-primary: #2563eb`,
      `--color-primary-hover: #1d4ed8` (live-computed blue-600/blue-700).
- [x] **B2** `page-parts.tsx` DeltaText + BarStatCard deltas + TrendStatCard
      trend: `text-green-600` / `text-red-600` literal classes (keep the
      success/danger TOKENS for badges — only delta text changes).
- [x] **B3** Base `Card` + KpiCard + stat-card own-classes: `shadow-sm` →
      `shadow` (bordered family only; TABLE_CARD stays `rounded-lg shadow`).

### Phase C — shell + sidebar + drawer (S7-2, S7-3, S7-4, S7-5, S7-6, S7-7)
- [x] **C1** `app-shell.tsx`: root `flex h-screen bg-background`; sidebar
      in-flow `hidden w-64 flex-col bg-sidebar md:flex`; main column
      `flex min-w-0 flex-1 flex-col overflow-hidden`; keep Topbar + main
      (`flex-1 overflow-auto`) + inner `p-4 sm:p-8 min-h-screen`.
- [x] **C2** `sidebar.tsx`: brand to live anatomy (p-6 gap-3, 40px white
      circle + 24px blue circle, `text-2xl font-bold`); nav items to
      `px-4 py-3` + `hover:bg-white/5` + active `bg-white/10`, icons
      `h-5 w-5` strokeWidth 2, label `font-medium`; nav container
      `flex-1 px-3 space-y-1`; footer group `mt-auto space-y-1 pt-4
      border-t border-white/10`.
- [x] **C3** `mobile-nav.tsx`: drawer + trigger `lg:hidden` → `md:hidden`.

### Phase D — topbar (S7-8 … S7-12)
- [x] **D1** Header: static `border-b border-line bg-surface px-4 sm:px-8
      py-4` + inner `flex items-center justify-between gap-4`; hamburger
      stays (our fix), aligned to `rounded-md`.
- [x] **D2** Search: `hidden sm:flex flex-1 max-w-xl` wrapper + icon
      `h-5 w-5` + input `h-9 rounded-md border-line bg-background pl-10`
      (keep aria-label + functional dropdown).
- [x] **D3** Mail/bell: `rounded-md` + `h-5 w-5` icons.
- [x] **D4** User button: rectangular ghost h-9 + label
      `text-sm font-medium text-gray-700 hidden sm:inline` + 32px
      `bg-gray-200 text-gray-600` avatar + `h-4 w-4` chevron.
- [x] **D5** User menu: `min-w-[8rem]`, plain Profile/Logout (drop
      separator + destructive).

### Phase E — calendar (S7-13, S7-15, S7-16)
- [x] **E1** Header search input (`relative flex-1 sm:flex-none sm:w-64` +
      icon + `pl-9 h-9` "Search events...") filtering events by subject —
      functional superset (the reference's is live-dead at zero data).
- [x] **E2** Nav buttons: prev/next outline h-9 w-9; Today outline
      `hidden sm:flex`; subtitle → text-sm variant.
- [x] **E3** TrendStatCard re-pin (S7-22): p-4, mb-3 row, 40px `-50`-tint
      chips + `h-5 w-5` icons, trend `gap-1 text-green-600` +
      `trending-up w-3 h-3`.

### Phase F — reports (S7-14, S7-16)
- [x] **F1** Bar buttons h-8: Reset (outline + RotateCcw `h-4 w-4 mr-2`,
      restores filter defaults — functional), Export CSV (primary +
      Download), PDF (outline + FileText); selects 1–2 wrapped
      `flex items-center gap-2` + leading Calendar/User `h-4 h-4` icons;
      subtitle → text-sm variant.

### Phase G — activities (S7-17)
- [x] **G1** Priority header: `mb-4` row + `h2 text-lg font-semibold`;
      Timeline: plain `mb-6` row inside the p-6 card + h2 + ghost h-8
      "•••" TEXT button; empty states: Timeline `py-12` 16px, Priority
      panels re-checked against live and aligned.

### Phase H — dashboard (S7-18)
- [x] **H1** Add buttons → ghost h-8 `text-primary` + `Plus h-4 w-4 mr-1`;
      ellipsis buttons → ghost h-8 w-8 (`size sm` + `w-8`).

### Phase I — settings (S7-19)
- [x] **I1** Picklist card: items `space-y-2 mb-4`, empty
      `text-sm text-muted text-center py-4`, add button primary h-9
      icon-only, placeholder "Add new industrie" (typo mirror).

### Phase J — login (S7-20)
- [x] **J1** `login/page.tsx` + `signup/page.tsx` wrappers:
      `bg-gradient-to-br from-slate-50 to-slate-100 p-4`.
- [x] **J2** `login-card.tsx` restructured to the live anatomy (accent
      strip, centered layout, CSS logo with ring+glow, h1
      `text-2xl sm:text-3xl text-slate-900`, Google white button, my-6
      divider, `h-11 sm:h-12` slate inputs, slate-900 submit, slate
      footer). KEEP: demo-credentials hint, error alert, signup mode,
      label ids + button names (e2e).

### Phase K — toasts (S7-21)
- [x] **K1** Container: `fixed top-0 z-[100] flex max-h-screen w-full
      flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:left-auto` +
      per-toast max-width preserved.

### Phase L — verification
- [x] **L1** Full gate: lint 0/0 · tsc · unit (92 + new pins) · build ·
      e2e 21/21 (mobile-nav 5/5; auth selectors intact).
- [x] **L2** DOM re-verification on the dev server at 1512/1024/900/768/
      390: chrome anatomy, sidebar from 768, drawer below 768, main as
      the true scroller, reports sticky bar inside main, zero horizontal
      overflow at 390.
- [x] **L3** Drawer regression re-check end-to-end (open → links → Escape
      → dual scroll lock).

### Phase M — deliverables
- [x] **M1** Refresh `docs/screenshots/` (12 captures).
- [x] **M2** `.env.example` re-verified against the codebase.
- [x] **M3** Docs realignment: AGENTS.md, CLAUDE.md, README.md,
      Project_Architecture_Document.md, `neo-crm_SKILL.md` (v1.4.0),
      `docs/session_7.md` session log, `worklog.md`.
- [x] **M4** Commit on main + SSH-wrapper push.

---

## Execution notes

- **Scroll-lock interplay**: once the window stops scrolling (Phase C),
  the drawer's body lock becomes belt-and-braces and the `main` lock is
  the real one — the dual lock from session 6 becomes MORE correct, not
  less. The e2e body-lock assertion stays green.
- **Sticky reports bar**: with `main` as the true scroller, the
  `sticky top-0` bar sticks to main's top exactly like the reference.
- **iconSm stays h-7**: entity-table row action buttons are unverifiable
  at zero data; only the four card-header ellipsis buttons and the
  calendar nav are re-pinned this session.
- **CardTitle stays h3** (see quirk register) — the activities
  Priority/Timeline titles render as literal `h2 text-lg font-semibold`
  elements to match the live tags.

---

## Addendum — execution record (same session)

All phases executed with the full gate green at every checkpoint:

- **Phase A:** 20 new layout-contract pins (37 total in `tests/page-layout.test.ts`);
  the module gained `SHELL_LAYOUT`, `NAV_LAYOUT`, `TOPBAR_LAYOUT`, `LOGIN_LAYOUT`,
  `STAT_CARD`, `ACTIVITY_CARD`, `DASHBOARD_CARD`, `SETTINGS_PICKLIST` plus
  `PAGE_HEADER.*.subtitleSm` and the re-pinned `REPORTS_FILTER_BAR`.
- **Phase B:** `--color-primary` → `#2563eb` (blue-600, live-computed) with
  `#1d4ed8` hover; delta text → `text-green-600`/`text-red-600` (live-computed
  probes); the bordered `Card` family drops `shadow-sm` → `shadow`. An
  additional stock-input alignment landed mid-verification: the base `Input`
  switched `rounded-lg` → `rounded-md` (the live toolbar searches and settings
  inputs are stock shadcn rounded-md — verified on the live contacts search).
- **Phases C–K:** all implemented as planned. Dev-server DOM verification
  confirmed every pin: root `flex h-screen` with an in-flow `hidden md:flex`
  sidebar; `main` is now the TRUE scroller (`mainScrollable=true`,
  `windowScrolls=false`) and the reports sticky bar sticks to main's top
  (verified with a programmatic scroll); the drawer's dual lock engages
  (body + main hidden) and releases on Escape; breakpoints sweep green at
  1024 (sidebar + rails), 900/768 (sidebar only), 700/390 (drawer + no
  horizontal overflow).
- **Functional superset noted:** the restored reports Reset button actually
  resets the four filters (verified: This Month → This Quarter), and the new
  calendar header search filters events by title — both live controls are
  inert at zero data.
- **VLM spot-comparison** (login + calendar, fresh live captures): zero
  structural findings — only the documented divergences (CSS logo vs the
  reference's hotlinked screenshot image, our demo-credentials hint, seeded
  vs zero data, the Base44 platform badge).
- **Final gate:** lint 0/0 · tsc clean · **112/112 unit** · build clean ·
  **21/21 e2e** (mobile-nav 5/5 intact — the suite's 390px viewport is below
  the new md drawer range).
