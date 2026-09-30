# Session 10 — Stock-Primitive Internals + Chart Zero-State + Reports Tab Re-Mirror (completion log)

> Picked up from the session-9 completion point (pushed at `2b0a7a6`, plus
> the user's `203162e` session-log commit). This file is the completion
> record for **Session 10**; the next session should treat it as the brief.

## What happened

1. **Workspace refresh** — pulled to `203162e` (the new `docs/session_12.md`
   = the session-9 transcript), re-read the five core docs + the session-9
   plan/log + worklog. Baseline gate green: lint 0/0 · tsc clean · 148/148
   unit · dev server healthy on :3000; `.env` `DATABASE_URL="file:../db/custom.db"`,
   `db/` at the repo root, `.env.example` tracked, vitest + playwright
   configs intact. Mobile-nav regression re-verified live BEFORE any
   changes (drawer, dual locks, Escape, route-close, the 700→800 resize
   unlock, zero 390px overflow on all nine routes).

2. **Live-reference audit at 1512×945 first** — all nine routes captured
   from both apps plus computed-style probes. Demo data STILL zero (sixth
   consecutive session). The audit targeted the three layers still below
   the session-6–9 pins: stock-primitive internals (inputs/selects/cursor/
   tokens), chart rendering internals (tooltips + the zero-data state), and
   the never-audited reports tabs 2–4. One more real Tailwind v4 rename bug
   surfaced (the blur scale — same family as session-9's shadow bug).

3. **The Tailwind v4 blur-scale bug (S10-P0)** — v4 renamed the blur scale
   (`blur-sm` 4px → `blur-xs`; v4 `blur-sm` is the old bare blur 8px), so
   our login card's `backdrop-blur-sm` glass computed **8px** while the
   reference's computes **4px**. Fixed with one `@theme` re-pin
   (`--blur-sm: 4px`), pinned by the design-tokens suite. Class-identical
   cards on both sides — pure computed diff.

4. **The stock-primitive internals (S10-1..3)** — the reference's global
   stylesheet ships `button, [role="button"] { cursor: pointer; }` (every
   button shows the hand cursor; ours computed the arrow) — added to the
   base layer. The reference's stock Input/Select carry `bg-transparent`,
   NO text color class (typed text inherits its `--foreground` #0a0a0a) and
   `placeholder:text-muted-foreground` #737373; ours shipped bg-white +
   #111827 + #9ca3af/#6b7280. Two new tokens (`--color-ink`, `--color-muted-ink`)
   + the full stock base on Input/Textarea/Select (Select: rounded-md, no
   gap-2, transparent, no base w-full — w-full is per-surface now, matching
   the reference's 270px rails vs 128px toolbars). The topbar search pill
   became the shared stock Input + `pl-10 bg-gray-50 border-gray-200`
   (12px right padding, keyboard-only focus-visible ring, transition-colors).

5. **Chart internals (S10-4/5/11)** — the reference ships recharts DEFAULT
   tooltips (no `content` prop) and passes NO tick/grid style (ticks 12px
   #666, CartesianGrid dashed "3 3" #ccc with BOTH horizontal and vertical
   lines — 5+6 on its pipeline chart). Ours shipped custom tooltips, 11px
   #9ca3af ticks and a solid #f3f4f6 horizontal-only grid. All retired to
   the defaults. The BIG reversal: the reference renders the REAL chart at
   all-zero data (ticks, zero bars, legends) — our session-1 "friendly
   placeholder" (`ChartEmpty` dashed boxes) never appears on the reference.
   All early-returns removed; the empty-state decision is reversed and
   documented (AGENTS/CLAUDE/SKILL).

6. **The reports re-mirror (S10-6..9 — the largest find)** — the reference's
   reports tab-1 "Pipeline by Stage" chart ships **8 RAW SLUGS**
   (`new, contacted, qualified, prospecting, qualification, proposal,
   negotiation, closed_won` — a merged-list quirk; NOT a 390px artifact,
   re-verified at desktop). The Conversion Funnel is a recharts **FunnelChart**
   (4 trapezoid groups), not our custom div bars. Reports time-series are
   ROW-DERIVED (no month ticks at zero) while the dashboard's stay FIXED
   (7-month window, 5 stages) — the split is DOM-verified and now mirrored
   exactly. Tabs 2–4 were rebuilt to the reference's structure (never
   audited before): tab 2 = Forecasting Accuracy (wide chart + the centered
   "Average Accuracy: N%" caption) + row-derived Pipeline by Stage +
   Forecast by Probability + the fixed 4-bucket Aging Pipeline + the Open
   Deals by Stage and Deals at Risk tables with Export CSV/PDF buttons, NO
   KPI cards; tab 3 = three row-derived charts + Overdue Activities +
   Activity Log by Owner (Owner/Activities); tab 4 = three source charts +
   Leads List by Source + Source Performance Summary (Source/Leads/Won/
   Revenue). New `src/lib/reports-data.ts` pure seam (agingCounts,
   forecastAccuracySeries, monthsFromEvents) + a reshaped /api/reports.

7. **Per-page titles (S10-10)** — the reference titles every non-dashboard
   page "X | NEO CRM" (dashboard + login stay "NEO CRM"); ours shipped
   "NEO CRM" everywhere. Implemented via server page wrappers (the (app)
   pages are client components, so each route gained a thin server
   `page.tsx` + renamed client part). A per-route `layout.tsx` approach was
   tried first and hit a Next 16 typed-routes generation bug
   (`LayoutRoutes` not assignable to `"/"`) — the wrapper pattern compiles
   clean. Our login title was "Sign in | NEO CRM"; the reference's login
   is plain "NEO CRM" — fixed (signup keeps "Sign up | NEO CRM").

8. **TDD execution** — red first: 21 new checks (design-tokens +5,
   constants +4, page-layout +5 refined, reports-data +7) failed exactly as
   intended, then the contracts landed and everything went green. Two
   mid-verification VLM rounds caught three more fixes: the reports
   Conversion Rate KPI icon (lucide-target, not Percent — the reference
   uses target on BOTH Total Leads and Conversion Rate), the dashed-grid
   default, and the login card's demo-credentials hint (a visible
   clone-only block — removed; credentials stay in the README). One VLM
   claim (dotted-border placeholders on the reference) was disproven by DOM
   probe (`anyDashed: false`).

9. **Verification** — full gate green at every checkpoint: **lint 0/0 ·
   tsc · 169/169 unit · build · 23/23 e2e** (mobile-nav 6/6 with the resize
   lock-release; new per-page-titles + reports-tab-structure tests). DOM
   re-verification: cursor pointer (all buttons; the drawer overlay keeps
   its deliberate cursor-default), login blur 4px, input ink #0a0a0a +
   placeholder #737373 + transparent bg, Select rounded-md transparent
   128px-auto, default tooltips (recharts-default-tooltip), zero-state
   with real charts (no ChartEmpty boxes; fixed ticks on the 8-slug
   pipeline, empty row-derived series), funnel trapezoids + labels,
   breakpoints 1512/1024/768/700/390 exact (burger below 768, sidebar from
   768), zero horizontal overflow at 390 on all nine routes.

10. **Deliverables** — 12 screenshots refreshed (login captured
    logged-out); `.env.example` re-verified (unchanged contract); docs
    realigned (README, AGENTS, CLAUDE, PAD, `neo-crm_SKILL.md` **v1.7.0**,
    this log, the plan addendum, repo worklog).

## Suggested next steps for Session 11

- The reference's demo data has now been zero for six consecutive
  sessions; if it ever returns, audit the data-populated states (the
  8-slug bucket mapping, the funnel's populated geometry, the
  Forecast-by-Probability chart type, the aging buckets with real ages).
- The tab 2–4 chart TYPES for row-derived series are zero-data-informed
  choices (bar for per-X, line for over-time) — documented in the plan;
  re-pin if the reference's data ever returns.
- The login logo + favicon on the reference are platform-owner uploaded
  images — documented deviations (our CSS brand mark + no favicon).
