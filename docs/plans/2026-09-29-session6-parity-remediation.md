# Session 6 Remediation Plan — Layout-System & Page-Shell Parity (2026-09-29)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `1555c8d`
(baseline gate green: lint 0/0 · tsc clean · 75/75 unit; 21/21 e2e green at
session-5 push `38bf22e`, only docs changed since). The reference's demo data
is still **reset to zero**, so parity continues to target structure — and
this session's audit covers the one layer no previous session systematically
extracted: the **layout system itself** — app-shell scroll model, page
headers, header-button anatomy, KPI grid breakpoints, per-page content
layouts (filter rails, table cards, chart rows) and mobile structural states.
Every item below is evidence-backed by class-list/DOM extraction on the
logged-in reference at 1512×945 and 390×844 (no VLM screenshot reads).

**Method:** TDD — the layout contracts land as a pinned constants module
(`src/lib/page-layout.ts`) with failing unit tests first; UI changes land
with the full gate plus browser re-verification at 1512/1280/1024/768/390.
The `skills/` folder stays excluded from all checking, testing and
compilation.

**Baseline evidence:** DOM extraction transcripts in this session log;
`/home/z/my-project/live-fresh/` (session-3 captures still valid for
zero-data structure).

**Reference quirks deliberately NOT copied** (carried forward from sessions
3–5 plus new confirmations):

- All previous quirk-register entries stand (duplicate Recent Deals "Status"
  column, dead header Add/More…, dead signup/forgot, static "Last 2 days"
  caption, raw `closed_won` funnel keys, missing mobile navigation on the
  reference — our drawer stays).
- **Dead view-switcher selects** in toolbars (dashboard Recent Deals and
  accounts: a "Table" select plus an empty select that persist no state and
  change no view). Omitted; our toolbars carry only working controls.
- **Contacts' header-only "Filters" card** (reference renders a `p-4
  border-b` header with no body — a stub). We mirror the card + header and
  keep our functional filter groups below it (functional superset,
  documented).
- **Contacts' private scroll wrapper** (`main > .flex.h-[calc(100vh-64px)]
  > .flex-1.overflow-auto > .p-8`) — an inconsistency of the reference
  codegen. Normalized to the shared shell wrapper (`p-4 sm:p-8`).
- **Mobile filter rails hidden below `lg`** on accounts/calendar/activities
  (reference behavior: phone users get KPIs + table only). Mirrored; noted
  as a reference accessibility regression we do not "fix" here to keep
  structural parity (our working mobile drawer remains the navigation fix).
- **Reports "Reset" button** (ours) is removed to mirror the reference bar
  (Export CSV + PDF only); the reference's Export CSV in that bar is
  **primary blue**, mirrored exactly.

---

## Identified Issues, Bugs and Gaps (all DOM-verified)

| # | Sev | Issue | Evidence (live DOM) |
|---|-----|-------|---------------------|
| S6-1 | High | **App-shell scroll model + main wrapper**: reference topbar `bg-white border-b border-gray-200 px-4 sm:px-8 py-4` (static); `main.flex-1.overflow-auto.bg-gray-50` is the **scroll container**; content wrapper `p-4 sm:p-8 bg-gray-50 min-h-screen`, **no max-width**. Ours: sticky topbar, `main.mx-auto.w-full.max-w-[1400px].flex-1.px-4.py-6.sm:px-6.lg:px-8`, window scroll. Impact: content capped at 1400px vs full-bleed reference; a `sticky top-0` reports bar cannot work under window scroll. | main/topbar/root class extraction; scrollWidth probe |
| S6-2 | High | **PageHeader**: reference `flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4`; h1 `text-2xl sm:text-3xl font-bold text-gray-900`; actions `flex gap-2 w-full sm:w-auto`. Page variants: contacts `flex items-center justify-between mb-6` + h1 `text-3xl` + actions `flex gap-3`; leads `mb-6 sm:mb-8`. Ours: `mb-5 flex flex-wrap items-start justify-between gap-3`, h1 `text-2xl font-bold tracking-tight`, actions `flex flex-wrap items-center gap-2` — wraps instead of stacking on phones. | h1-row/actions extraction on all 9 pages |
| S6-3 | High | **Header action buttons**: reference outline variant (`border-input bg-background shadow-sm hover:bg-accent`) with per-page sizing — `h-8 px-3 text-xs` (dashboard/accounts/activities) or `h-9 px-4 py-2` (contacts/leads/calendar/reports); labels `hidden sm:inline` on dashboard Add/Export, accounts Export CSV, contacts Scan Card/Import; dashboard ships a **primary icon-only Export** (3rd button); Export CSV **disabled at zero data** on accounts+contacts but **enabled** on leads; activities Log WhatsApp is **ghost**; reports "Saved Reports (0)" outline h-9. Ours: `variant="secondary"` everywhere, always-visible labels, uniform h-9, no disabled states. | button class + span extraction per page |
| S6-4 | High | **KPI grids**: every reference grid starts at `grid-cols-1` (1-col phones) and breaks at `sm/lg/xl`: dashboard+leads+activities `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6`; accounts `… lg:grid-cols-5`; contacts `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`; calendar `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`; reports `… xl:grid-cols-5`. Ours: base `grid-cols-2` (2-col phones), md/xl-only breakpoints, no `mb-6`. | first-grid class per page + 390px col-width probe (358/326px = 1-col) |
| S6-5 | High | **Dashboard filter bar is a white card**: `bg-white rounded-lg shadow mb-6 p-4` → inner `flex flex-col sm:flex-row gap-3`; Filter = **outline h-8 px-3 text-xs sm:w-auto**; selects stock h-9 (stacked full-width on phones); search `relative flex-1` (h-9 pl-9, "Stage: Source"); "More…" = **ghost h-8 button**, not a text link. Ours: bare `mt-6 flex flex-wrap items-center gap-2` row, secondary h-9 Filter, `ml-auto hidden sm:block` underline link. Also charts row `grid-cols-1 lg:grid-cols-2 gap-6 mb-6` (ours `mt-4 xl:grid-cols-5` 3/2 split) and lists row `grid-cols-1 lg:grid-cols-3 gap-6 mb-6` (ours `mt-4 md:grid-cols-3 gap-4`). | filter-card children, button + grid class extraction |
| S6-6 | High | **Accounts layout = flex + right rail**: `flex gap-6` → `flex-1` (table card `bg-white rounded-lg shadow`, toolbar `p-4 border-b` → `flex flex-col sm:flex-row gap-3` with search + Export CSV, then `overflow-x-auto` table) + `hidden lg:block w-80` rail (Card: `flex justify-between items-center` "Filters" + "Save All"; body `p-6 pt-0 space-y-4`: Owner/Industry/Revenue-Range label (`text-sm font-semibold`) + h-9 `w-full` selects, Tier checkbox group, `pt-2` → **primary h-9 w-full Filter**). Ours: a valid but divergent `xl:grid-cols-[minmax(0,1fr)_260px]` single-grid (rail only from 1280px, not 1024px), collapsible filter card, toolbar outside the card. *(The audit log first read this class as broken — a terminal display artifact that ate `[m` as an ANSI escape; file bytes were always valid.)* | flex-row children, rail card, toolbar, group extraction |
| S6-7 | High | **Contacts**: contacts header variant (h1 `text-3xl`, row `flex items-center justify-between mb-6`, actions `flex gap-3`, subtitle `text-gray-500 mt-1` "Manage your contacts"); Export CSV outline h-9 **disabled**; Scan Card/Import outline h-9 hidden-sm labels; New Contact primary h-9; KPI `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6`; filters = `bg-white rounded-lg shadow mb-6` card with `p-4 border-b` header; table card `bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden`; **mobile card list `lg:hidden mt-6 space-y-4`** (renders cards below `lg` in addition to the scrolling table — ours has none on any page). | contacts header/grid/filters/table/mobile-list extraction at 1512 + 390 |
| S6-8 | High | **Leads**: header `mb-6 sm:mb-8`; Export outline h-9 **enabled** + New Lead primary h-9; KPI grid as dashboard; **filters + table merged in one white card** `bg-white rounded-lg shadow` — header `p-4 border-b space-y-4` (search row `flex flex-col sm:flex-row gap-4` + `relative flex-1` "Search leads…" h-9 pl-9; toggle row `flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4` + outline h-9 `w-full sm:w-auto` "Filters" chevron button) then `overflow-x-auto` table; charts row `grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6`. Ours: separate toolbar row + table card + charts `mt-4 lg:grid-cols-2 xl:grid-cols-3`. | leads card children + row extraction |
| S6-9 | High | **Calendar layout = flex + right rail**: `flex gap-6` → `flex-1` (calendar Card `p-4 sm:p-6 mb-6`; Upcoming Events + Agenda `grid grid-cols-1 lg:grid-cols-2 gap-6`) + `hidden lg:block w-80` rail (Card: "Filters" + "Clear All"; body: Type checkbox groups Appointments/Calls/Meetings/Tasks/Reminders). Ours: a valid but divergent `xl:grid-cols-[minmax(0,1fr)_320px]` single-grid (same display-artifact caveat as S6-6). | flex-row children + rail body extraction |
| S6-10 | High | **Activities layout = flex + right rail**: quick-log buttons outline h-8 (Log Call/Email/Meeting, visible labels) + **ghost h-8** Log WhatsApp; `flex gap-6` → `flex-1 space-y-6` (Priority Activities card `bg-white rounded-lg shadow` with `p-4 border-b` header + tabs + More; Timeline card `bg-white rounded-lg shadow p-6`) + rail `hidden lg:block w-80 space-y-6` (Filters Card with Save All + Activity-Type checkboxes; Activities by Type chart Card). Ours: a valid but divergent `xl:grid-cols-[minmax(0,1fr)_300px]` single-grid (same display-artifact caveat as S6-6), rail charts inline below. | flex-row children + both rail cards |
| S6-11 | High | **Reports sticky filter bar**: `rounded-xl border text-card-foreground p-4 mb-6 sticky top-0 z-10 bg-white shadow-md` → `flex flex-col lg:flex-row gap-4 items-center` → `flex flex-wrap gap-3 flex-1` (h-9 selects) + `flex gap-2` (**Export CSV primary** + PDF outline h-9). Ours: Card+CardHeader/CardContent, Reset/secondary buttons, not sticky. | sticky bar + children extraction |
| S6-12 | Med | **Settings/Profile width wrappers**: settings content `max-w-6xl mx-auto`; profile `max-w-4xl mx-auto`. Ours: full-width. | section extraction |
| S6-13 | Med | **Topbar padding**: reference `px-4 sm:px-8` (aligns with main's `p-4 sm:p-8`); ours `px-4 sm:px-6`. | topbar class extraction |
| S6-14 | Med | **Mobile-nav scroll lock vs new scroll model**: once `main` becomes the scroll container (S6-1), the drawer's body-only overflow lock (`document.body.style.overflow`) stops preventing scroll — the lock must also clamp the `main` scroller. | mobile-nav.tsx effect; e2e mobile-nav spec asserts body lock (stays green) |

---

## Remediation ToDo (TDD)

### Phase A — layout contracts, red first
- [x] **A1** Write failing `tests/page-layout.test.ts` pinning a new
      `src/lib/page-layout.ts` module: `PAGE_KPI_GRIDS` (7 pages), header
      row/title/actions class sets (standard/leads/contacts), rail classes
      (`flex gap-6`, `hidden lg:block w-80`, `space-y-6` variants), dashboard
      filter-card classes, reports sticky-bar classes, table-card/toolbar
      classes — plus a de-bracketed-arbitrary-value guard (**no exported string
      contains `grid-cols-inmax` / `grid-cols-(`**).
- [x] **A2** Implement `src/lib/page-layout.ts` to green; export typed
      records consumed by every page (single source of truth).

### Phase B — shell (S6-1, S6-13, S6-14)
- [x] **B1** `app-shell.tsx`: main → `flex-1 overflow-auto` + token bg;
      children wrapped in `p-4 sm:p-8 min-h-screen` inner div; drop
      `max-w-[1400px]`.
- [x] **B2** `topbar.tsx`: `px-4 sm:px-6` → `px-4 sm:px-8`.
- [x] **B3** `mobile-nav.tsx`: scroll lock clamps body **and** the `main`
      scroller (restores both on close); body-lock e2e assertion unchanged.

### Phase C — page header system (S6-2, S6-3)
- [x] **C1** `page-parts.tsx` PageHeader: reference anatomy (stacking row,
      `mb-6 gap-4`, h1 `text-2xl sm:text-3xl font-bold`, subtitle, actions
      `flex gap-2 w-full sm:w-auto`) + variants for contacts (title `text-3xl`,
      plain row, `gap-3`) and leads (`mb-6 sm:mb-8`).
- [x] **C2** `ui/button.tsx`: outline variant gains `shadow-sm`
      (reference: `border-input bg-background shadow-sm hover:bg-accent`).
- [x] **C3** Per-page header buttons to the audited anatomy (dashboard
      Add/Export/Export-icon-only; accounts Export CSV disabled-at-zero +
      New Account primary h-8; contacts Export CSV disabled + Scan Card/
      Import hidden-sm + New Contact; leads Export enabled + New Lead;
      calendar New Event; activities 3× outline + ghost WhatsApp; reports
      Saved Reports (0)); `hidden sm:inline` label spans where pinned.

### Phase D — KPI grids (S6-4)
- [x] **D1** Adopt `PAGE_KPI_GRIDS` on all 7 pages (+ skeleton rows).

### Phase E — dashboard (S6-5)
- [x] **E1** Filter bar → white card (`bg-surface rounded-lg shadow mb-6
      p-4`, inner `flex flex-col sm:flex-row gap-3`), Filter button
      outline-sm, h-9 selects, `relative flex-1` search, ghost-sm
      "More…" button.
- [x] **E2** Charts row → `grid-cols-1 lg:grid-cols-2 gap-6 mb-6` (drop
      3/2 col-span split); lists row → `grid-cols-1 lg:grid-cols-3 gap-6
      mb-6`; Recent Deals standalone card spacing aligned.

### Phase F — accounts (S6-6)
- [x] **F1** Replace the broken grid with `flex gap-6` + `flex-1` +
      `hidden lg:block w-80` rail; move toolbar into the table card
      (`p-4 border-b`, `flex flex-col sm:flex-row gap-3`, search +
      Export CSV outline-sm).
- [x] **F2** Rail: Card with Filters/Save All header, `text-sm
      font-semibold` labels + h-9 w-full selects (Owner/Industry/Revenue
      Range), Tier checkbox group, `pt-2` primary h-9 w-full Filter button.

### Phase G — contacts (S6-7)
- [x] **G1** Contacts header variant + button anatomy (disabled Export CSV).
- [x] **G2** Filters card mirrored (`bg-white rounded-lg shadow mb-6` +
      `p-4 border-b` "Filters" header, functional groups below).
- [x] **G3** Table card wrapper tokens (`rounded-xl shadow-sm border
      overflow-hidden` + `mb-6` spacing).
- [x] **G4** **Mobile card list `lg:hidden mt-6 space-y-4`** (compact
      contact cards: name, email/phone, company, priority badge, source,
      avatar; mirrors the leads responsive philosophy).

### Phase H — leads (S6-8)
- [x] **H1** Merge search + Filters toggle + table into one `bg-white
      rounded-lg shadow` card (`p-4 border-b space-y-4` header, `overflow-
      x-auto` body); Filters toggle → outline h-9 `w-full sm:w-auto`.
- [x] **H2** Charts row → `grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6`.

### Phase I — calendar (S6-9)
- [x] **I1** Replace the broken grid with `flex gap-6` + `flex-1` (calendar
      card `p-4 sm:p-6 mb-6` + Upcoming/Agenda `lg:grid-cols-2 gap-6`) +
      `hidden lg:block w-80` Filters rail (Clear All + Type checkboxes).

### Phase J — activities (S6-10)
- [x] **J1** Quick-log buttons: outline h-8 ×3 + ghost h-8 WhatsApp.
- [x] **J2** Replace the broken grid with `flex gap-6` + `flex-1
      space-y-6` (Priority card `p-4 border-b` header + tabs; Timeline
      `p-6`) + `hidden lg:block w-80 space-y-6` rail (Filters Card with
      Save All + type checkboxes; Activities by Type card).

### Phase K — reports (S6-11)
- [x] **K1** Filter bar → sticky `rounded-xl border p-4 mb-6 sticky top-0
      z-10 bg-surface shadow-md` + `flex flex-col lg:flex-row gap-4
      items-center`; selects `flex flex-wrap gap-3 flex-1`; right side
      Export CSV **primary** + PDF outline h-9; Reset removed (quirk
      register).

### Phase L — settings/profile (S6-12)
- [x] **L1** Settings content wrapped `max-w-6xl mx-auto`; profile
      `max-w-4xl mx-auto`.

### Phase M — verification
- [x] **M1** Full gate: lint 0/0 · tsc · unit (75 + new pins) · build ·
      e2e 21/21 (mobile-nav 5/5).
- [x] **M2** DOM re-verification on the dev server at 1512/1280/1024/768/
      390: every S6 item + drawer re-check (open → links → Escape → lock).
- [x] **M3** No horizontal overflow at 390 on any page.

### Phase N — deliverables
- [x] **N1** Refresh `docs/screenshots/` (12 captures).
- [x] **N2** Docs realignment: AGENTS.md, CLAUDE.md, README.md,
      Project_Architecture_Document.md, `neo-crm_SKILL.md` (layout-system
      conventions, test counts, plan addendum) + worklogs.
- [x] **N3** Commit on main + SSH-wrapper push.

---

## Addendum — post-verification refinements (same session)

After the Phase M DOM verification and a VLM spot-comparison of the refreshed
screenshots, three rail/toolbar details were re-audited against the live
reference and re-pinned (the VLM flagged them; live DOM confirmed with exact
class extraction). All fixes landed with the same gate + browser re-check:

- **Rail card headers (accounts / activities / calendar).** The stock
  CardHeader keeps its column direction — the reference nests a
  `flex justify-between items-center` **child row** holding the title and a
  ghost `h-8 px-3 text-xs` **"Save All"** button (accounts + activities).
  Calendar is the outlier: the **title element itself** carries
  `flex items-center justify-between` and its action is a **blue text link**
  (`text-xs text-blue-600 hover:text-blue-700 font-normal` **Clear All**),
  not a button. `FILTER_RAIL.headerPad/headerRow/title/titleWithAction/
  clearAllLink` now model all three; pages verified to render identical
  computed styles.
- **Rail group labels split by control type** (live DOM): select-group labels
  `text-sm font-semibold mb-2 block`, checkbox-group labels
  `text-sm font-semibold mb-3 block`; groups are **plain divs** (the earlier
  `grid gap-1.5` wrappers double-spaced labels); checkbox stacks `space-y-2`.
- **Rail titles are fixed 16px** — they never climb to the `sm:text-lg` of
  regular card titles (`FILTER_RAIL.title = "text-base sm:text-base"`).
- **Activities rail = 4 visible checkboxes + "More Filters (1)".** The
  reference shows Call/Email/Meeting/WhatsApp only, plus an outline `h-9
  w-full` "More Filters (1)" expander that is a **dead stub** live. Ours
  shows the same four and makes the expander functional (reveals a
  Task/Note "More Types" group — fix-over-defect, `aria-expanded` tracked);
  the `pt-2` wrapper holds expander + primary `mt-2 w-full` Filter, matching
  the live button order and classes.
- **Contacts filters card re-extracted.** The live toolbar is `p-4 border-b`
  → `flex gap-3` with a `relative flex-1 max-w-md` search (h-9, `pl-10`,
  w-5 icon, placeholder "Search contacts...") + an **outline h-9 "Filters"
  button** (filter icon `w-4 h-4 mr-2` + label). The live body below the
  border-b renders nothing (stub); ours keeps the functional Priority/
  Source/Owner groups behind the outline button (functional superset,
  documented in-code).
- **Rail squeeze at exactly 1024px** (flexbox `min-width: auto`): wide
  tables inside `overflow-x-auto` forced the `w-80` rail to 186px at lg.
  Fixed with `min-w-0` on the content column (`RAIL_LAYOUT.content/
  contentStack`); verified 320px rails on accounts/calendar/activities at
  1024×768.
- **Calendar group labels `<p>` → `<Label>`** for tag-level parity with the
  live `<label class="text-sm font-semibold mb-3 block">` elements.

Final gate after refinements: **lint 0/0 · tsc clean · 92/92 unit · build
clean · 21/21 e2e** (mobile-nav 5/5). Browser re-verification: rail anatomy
exact on all three pages at 1512; rails 320px at 1024; rails hidden + zero
horizontal overflow on all 9 routes at 390×844; contacts toolbar pins exact;
activities expander toggles the More Types group. Screenshots for the four
changed pages (accounts/contacts/calendar/activities) re-captured.
