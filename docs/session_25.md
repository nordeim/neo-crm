# Session 16 — The Responsive Page-Root Model + the Table Kit + the Calendar Card (completion log)

> Picked up from the session-15 completion point (pushed at `2f819a4`,
> plus the operator's `docs/session_24.md` transcript commit at
> `0a7620a`). This file is the completion record for **Session 16**
> (the 23rd/24th task-book brief — the remediation plan lives at
> `docs/plans/2026-09-30-session16-parity-remediation.md`); the next
> session should treat it as the brief.

## What happened

1. **Workspace refresh** — pulled to `0a7620a` (the only new remote
   commit was `docs/session_24.md`, the previous session's transcript);
   re-read the five core docs (SKILL v1.12.0) + session_23/24 + the
   session-15 plan + both worklogs. Baseline gate green: lint 0/0 ·
   tsc clean · 280/280 unit · dev server healthy on :3000 with
   `db/custom.db` at the repo root. The task book's config asks were
   verified ALREADY SATISFIED: `.env`
   (`DATABASE_URL="file:../db/custom.db"`), `db/` at the repo root,
   `.env.example` matching, `vitest.config.ts` + `playwright.config.ts`
   both in place.

2. **Re-probe of every previously-pinned family FIRST (the
   moving-target rule)** — the reference did NOT move: body 16px /
   #0a0a0a, h1 30px gray-900, KPI cards de-hovered
   (`rounded-xl border bg-card shadow`), dashed `3 3` `#ccc` grids, 6px
   button radii, the sidebar family (8 links, 20px icons), the auth
   surface (`/signup` still renders the 404 view when logged in — the
   s14 drift stands), the tab tracks (activities/settings segmented +
   reports pill — inactive rgb(115,115,115) on both), the 404 family.
   Demo data STILL zero in steady state (12th consecutive session) —
   with ONE anomaly documented below.

3. **The mobile navigation menu — the session's standing priority —
   verified THREE ways.** (a) The reference at 390px: the sidebar's
   `hidden md:flex` parent keeps it hidden, mail/bell `display:none`,
   NO burger — still no mobile navigation (12th session), our drawer
   remains the documented fix. (b) Our clone's 7-check regression LIVE
   at 390px before any changes: **7/7 PASS** (trigger hit-test, drawer
   open with 8 links + focus entry, dual scroll locks, Escape + lock
   restore, focus-trap wrap, resize-past-md auto-close, route-change
   close). (c) The drawer internals swept for v4 hazards: h-dvh 844 =
   innerHeight, `space-y-1` gaps on BLOCK links (no inline-label
   hazard), overlay blur 2px, #2563eb panel — all healthy. The 390px
   overflow sweep was clean on all eleven routes (incl. `/Profile`).

4. **The audit then went after the responsive anatomy** — the layer
   between the standing 390/1512 probes. A page-root class census on
   every route at 390 + a full grid-string census at **900px** (a MID
   width the prior sessions never swept) surfaced seven findings:

   - **The page-ROOT model (S16-P1/P2, High)**: the reference's pages
     OWN their padding — `p-4 sm:p-8 bg-gray-50 min-h-screen` on six
     pages, BARE `p-4 sm:p-8` on Leads + Profile (its own quirk), and
     the h-calc flex DIRECTLY under `main` on Contacts. Our AppShell
     wrapped every page in a blanket `p-4 sm:p-8` div — DOUBLE-PADDING
     the contacts full-height layout: the h-calc box 358px wide at 390
     (not 390), the table card 294px (not 326px), main scrolling 37px
     (not the 5px mirrored topbar quirk). Fixed with the `PAGE_ROOT`
     contracts (standard/bare), nine page roots, and the contacts
     `fullHeight` as its root.
   - **The table kit's stock strings (S16-P3/P4, Med)**: the container
     is the stock `relative w-full overflow-auto` (ours: x-only +
     scrollbar-thin); TableHead/TableCell were missing the stock
     checkbox variant classes; TableRow shipped `hover:bg-line-soft/60`
     where the reference computes /50, and no selected state. The
     reference's platform ALSO resets `th, td { padding: 1px }`
     globally (its standard th compute `1px 8px` → 43px header rows;
     the compact th `8px 1px`) — mirrored in our base layer
     (utility classes override it, exactly like the platform).
   - **THE CARD-PRIMITIVE BORDER LEAK (S16-P5, High — the session's
     engineering lesson)**: the Card base ships `border border-line`
     and `cn(TABLE_CARD.card, …)` CANNOT remove it (tailwind-merge
     replaces same-property classes only) — FOUR surfaces (the
     accounts/leads/activities table cards + the activities timeline)
     computed a 1px border against the reference's plain BORDERLESS
     `bg-white rounded-lg shadow [p-6]` divs; accounts/leads also
     carried an invented `overflow-hidden`. TABLE_CARD surfaces now
     render as plain divs (source-pinned).
   - **The settings picklist grid broke at the WRONG breakpoint
     (S16-P6, High)**: `lg:grid-cols-2` vs the reference's
     `md:grid-cols-2` — at 768-1023px ours rendered ONE 580px column
     where the reference renders two 282px cards. A mid-width-only
     divergence INVISIBLE to the standing 390/1512 probes — the grid
     census at 900px caught it. LESSON: sweep a mid width every
     session.
   - **The calendar card internals (S16-P7, High)**: the reference
     ships padding ON the card with THREE flat children — the header
     row (`flex items-center justify-between mb-6`, h2 `text-xl
     sm:text-2xl font-bold text-gray-900`, nav `flex gap-2`), the DOW
     grid (`grid grid-cols-7 gap-1 sm:gap-2 mb-2` with seven
     `text-center text-xs sm:text-sm font-semibold text-gray-600 py-2`
     divs), and the month grid (`gap-1 sm:gap-2`). Ours had merged the
     DOW labels + cells into ONE 42-child grid behind a
     padding-neutralized CardHeader/CardContent pair — 16px header gap
     vs 24px, 4px DOW gap vs 8px, an 18px semibold title vs 20/24px
     bold. Rebuilt flat (`CALENDAR_CARD`); the cells keep the
     CALENDAR_CELL states + the clickable superset.
   - **The reports data anomaly (documented)**: ONE `/Reports` load
     served the FULL demo dataset (Recent Won Deals + Top Deals by
     Value with the exact records our seed mirrors — "Marketing
     automation / Cedar Retail Group / $39.0k" etc.), then 6/6
     subsequent loads rendered the steady zero state. An instance with
     data EXISTS behind the platform's load balancer; the steady state
     remains zero.
   - **Verified-aligned (no action)**: every other page's responsive
     sections at 390/900 (identical or computed-equal), the KPI
     ladders, the contacts KPI grid (already md), the calendar rail,
     the today-cell + state pins, and — canvas-verified before any
     copying — our literal `bg-gray-50` compiles rgb(249,250,251)
     under v4, exactly the reference's value (NO literal-palette drift
     for that shade; the page-root contract uses the `bg-background`
     token anyway).

5. **TDD** — 18 red-first checks confirmed RED before implementation
   (the PAGE_ROOT pair + shell-contract rewrite + per-page-root source
   pins + contacts-root pin, the table-kit stock strings, the
   TABLE_CARD plain-div source rules, the CALENDAR_CARD contract +
   page rule, the SETTINGS_GRID md pin, the design-tokens th/td reset)
   → **297/297 unit** (+17 net). +4 e2e (the contacts full-height
   geometry at 390 — direct child, 326px card, the 5px quirk; the
   settings 2-col at 900; the calendar split grids + bold title; the
   borderless accounts card) → **41/41 e2e** (mobile-nav 7/7; one
   mid-flight fix — the settings e2e gained a `waitForFunction` after
   the single-shot evaluate raced the settings fetch). Three JSX
   balance slips in the page-root refactor were caught by the lint
   gate before anything shipped.

6. **Verification** — full gate: lint 0/0 · tsc clean · **297/297
   unit** · build clean (via `bun run build`) · **41/41 e2e**. Live
   DOM re-verified on a fresh dev server at 1512/900/390 on every
   touched surface: the contacts h-calc FULL-WIDTH 390 + direct child
   of main + 326px card + 5px scroll quirk; the borderless accounts/
   leads/activities cards + the p-6 timeline; the 43px header rows +
   `8px 1px` compact th; the stock `overflow-auto` container; the
   settings 2-col at 900 (282px cards); the calendar's two grids +
   24px/8px gaps + bold title; the page roots; the drawer still
   healthy; zero 390px overflow on all eleven routes.

7. **Deliverables** — 20 screenshots under `docs/screenshots/` (the 19
   established — all re-captured with per-shot URL/dialog-state
   verification after the first 1512 loop silently failed to navigate —
   + the NEW contacts 390 full-height capture); `.env` still
   `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root
   and `.env.example` matching; docs realigned (README badge 338 +
   counts + feature rows, AGENTS counts + the session-16 contract
   blocks + the page-root model + the th/td platform reset + the
   border-leak lesson, CLAUDE counts + test strategy, PAD matrix
   297/41 + session-16 notes, SKILL v1.13.0 §16h, this log, the plan
   addendum, both worklogs).

## Next session pointers

- The reference's demo data has been zero for TWELVE consecutive
  sessions — but an instance WITH data exists behind its load balancer
  (the one-load anomaly above). Re-check `/Reports` on login EVERY
  session; catching the data instance would unlock the edit dialogs,
  the picklist add flow, the upload behavior, and every data-driven
  surface at once.
- Sweep at least one MID width (900px) every session — the settings
  grid divergence (S16-P6) was invisible at 390 AND 1512.
- The literal-palette hazard (§16g.4) now has a verified-safe case:
  gray-50 computes equal under our v4 — but VERIFY each shade via the
  canvas readback before copying any literal palette class.
- Unprobed layers remaining: the reference's EDIT dialogs, the picklist
  add flow at non-zero data, toast/export behaviors, the avatar UPLOAD
  — all data-gated on the same anomaly.
- Standing rule: verify with raw-HTML/computed-style probes; VLM
  claims are hypotheses until DOM-proven.
