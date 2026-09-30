# Session 12 — Mobile-Nav Focus Race + Border Split + Tabs Anatomy + KPI Drift + Sparkline Rebuild + Custom 404 (completion log)

> Picked up from the session-11 completion point (pushed at `1746794`,
> plus the operator's session-log commits up to `992befe`). This file is
> the completion record for **Session 12**; the next session should treat
> it as the brief.

## What happened

1. **Workspace refresh** — pulled to `992befe` (the new
   `docs/session_16.md` = the session-11 completion transcript), re-read
   the five core docs (v1.8.0) + the session-11 plan/log + worklog.
   Baseline gate green: lint 0/0 · tsc clean · 189/189 unit · dev server
   healthy on :3000; `.env` `DATABASE_URL="file:../db/custom.db"`,
   `db/` at the repo root, `.env.example` tracked, vitest + playwright
   configs intact.

2. **The mobile navigation drawer under the focus-lock lens** (the
   operator's standing priority) — the full regression re-verified LIVE
   before any changes: burger hit-test at 390 (clickable), drawer with 8
   links, dual scroll-lock, focus-trap wrap, Escape + lock restore,
   resize-past-md auto-close + unlock, orientation change, backdrop
   click, route-change close. **9/10 PASS — the one failure was the
   session's headline bug (S12-P1): focus NEVER entered the drawer.**
   Instrumentation (`HTMLElement.prototype.focus` + rAF logging) proved
   the rAF callback DID call `focus()` on the Close button — while its
   computed `visibility` was still `hidden` (the
   `transition-[visibility]` class flip had not applied in that frame),
   and `focus()` on a not-rendered element **silently no-ops**. Keyboard
   users Tabbed through the background page behind the `aria-modal`
   dialog (WCAG 2.4.3). Fixed with a bounded retry (verify
   `activeElement` landed inside the panel, re-schedule up to 5 frames —
   observed to land on frame 3) + a `cancelled` flag in the cleanup, and
   the panel switched `h-full` → `h-dvh` (mobile-nav taxonomy class D).
   E2E-pinned as the 7th mobile-nav check.

3. **The reference is a MOVING TARGET** — its dashboard KPI cards
   dropped `hover:shadow-md transition-shadow` and `border-gray-200`
   between sessions (the base44 app is live-edited). The session-11
   hover pin was re-derived: only the REPORTS KPI family keeps the hover
   treatment now. Standing rule recorded: re-probe previously-pinned
   surfaces when their family is touched.

4. **The border-color split (S12-P3)** — a computed-style sweep across
   all 9 pages found the reference renders TWO border grays: its
   platform DEFAULT is **#e5e5e5** (neutral-200) riding every
   bare-`border` surface (ALL stock cards, table rows, the tablists,
   outline buttons, select triggers/contents, dropdowns, dialog content,
   bare form inputs), while an EXPLICIT `border-gray-200` family
   (#e5e7eb) covers only the reports KPI cards, the reports sticky
   filter card, the contacts table card and the topbar search. Ours
   rendered #e5e7eb everywhere. `--color-line` re-pinned to #e5e5e5 +
   new `--color-line-strong` (#e5e7eb) for the explicit family (login
   keeps its own slate-200 tokens — verified untouched).

5. **Four more finding families** — (a) the tab strips ship stock Radix
   classes (`TABS_PILL`/`TABS_SEGMENTED`): muted-ink tracks (inactive
   tabs inherit #737373, not gray-500), natural-height triggers,
   `transition-all`, `ring-offset-background`, `data-[state=active]:*`
   variants riding a `data-state` attribute, the bare `shadow` on the
   active pill (our segmented `shadow-sm` was one step light), the pill
   trigger `text-xs sm:text-sm`, and NO hover classes on any variant
   (the reference's tabs are also all `tabIndex=-1` — a keyboard
   platform defect our accessible roving tabindex deliberately does NOT
   mirror); (b) the dashboard KPI label re-pins to `text-gray-600`
   (#4b5563) and deltas drop `font-medium` with neutral = gray-600; (c)
   the sparklines are recharts MONOTONE curves (line strokeWidth 2, area
   fillOpacity 0.3 + strokeWidth 1) — our hand-rolled straight-segment
   SVG rebuilt on recharts, the reports sparks moved into the
   `flex-1 h-12 mr-2` slot capped 176px, the reports LOST DEALS card
   lost its spark, and the icon chips became SOLID color-50s; (d) the
   404 page is a designed slate-family surface (NOT the stock Next
   built-in) — bg-slate-50 center, 7xl font-light "404" + a 2px×64px
   slate-200 divider bar, the h2+p in their own `space-y-3` group with
   the quoted pathname in a `font-medium text-slate-700` span, and the
   Go Home pill in a `pt-6` group.

6. **Verified-aligned (no action)** — demo data STILL zero (8th
   consecutive session); the settings picklist add-flow (inline add,
   disabled-at-empty dark button, "No items yet"); print styles (none on
   either app); the reference's non-tab media queries (sonner-toast
   boilerplate); the dead reference search/exports (documented
   functional superset); the Tailwind v4 hazard sweep (no bare `ring`,
   no `drop-shadow`, no removed utilities, no negative-margin riders;
   `bg-gradient-to-*` is the v4-compat alias).

7. **TDD execution** — 17 red-first checks: 3 design-tokens (the border
   split) + 14 page-layout pins (`NOT_FOUND_LAYOUT`, `TABS_PILL`,
   `TABS_SEGMENTED`, `KPI_CARD`, `DELTA_TEXT`, `KPI_SPARK`,
   `KPI_CHIP_BG`, `STAT_CARD.reportsCard`, the filter-bar strong border
   re-pin) → **206/206**; +2 e2e (the drawer focus-entry regression +
   the custom-404 golden path) → **28/28** (mobile-nav 7/7). One s11
   e2e was re-scoped (the reports-chart selector now targets the
   tabpanel — the KPI sparks are recharts wrappers too).

8. **VLM comparison rounds** — dashboard/reports diffs were all
   data-driven (zero-data reference vs seeded clone). The 404 round-1
   caught REAL structure the first DOM extraction missed (the divider
   bar, the space-y-3 group split, the emphasized pathname span, the
   pt-6 button group) — all fixed; round-2 compared **ALIGNED**.

9. **Full gate green** — lint 0/0 · tsc clean · **206/206 unit** ·
   build clean · **28/28 e2e**. DOM re-verified at 1512/1024/768/700/390
   (breakpoints exact: sidebar from 768, drawer below; tabs 12px at 390;
   borders per-surface exact; sparks curved at 32/48px; chips solid
   color-50s; the drawer focus lands inside) + zero 390px overflow on
   all TEN routes (nine + the 404).

10. **Deliverables** — 12 screenshots refreshed + the new
    `13-not-found.png` (13 total); `.env.example` re-verified unchanged;
    docs realigned (README, AGENTS + the five session-12 contract
    blocks + the mobile-nav focus-race note, CLAUDE, PAD, `neo-crm_SKILL
    .md` **v1.9.0** with the new §16d session-12 layer, this log, the
    plan addendum, repo worklog).

## Suggested next steps for Session 13

- The reference's demo data has now been zero for EIGHT consecutive
  sessions; if it ever returns, audit the data-populated states first
  (legend icons with real series, the Forecast-by-Probability chart
  type, the funnel's populated geometry, the aging buckets with real
  ages, the sparkline data sources).
- The reference MOVED once this session (the dashboard KPI de-hover);
  start the next audit with a quick re-probe of the previously-pinned
  families (stat cards, tables, tabs, charts) before opening new layers.
- Remaining unprobed surfaces are thin: print styles are now confirmed
  aligned (none both sides); what is left is the calendar's view
  switching behavior at non-zero data and the toast system's populated
  states (our reference's Toaster has never fired).
