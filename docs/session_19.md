# Session 13 — Doubled Auth Titles + Profile Parity + Button Radius + CardTitle Map + By-Type Rebuild + Dashed Grids + Funnel Type + Foreground/Base-Font Re-Pins (completion log)

> Picked up from the session-12 completion point (pushed at `2adc126`,
> plus the operator's session-log commits up to `22aeb95`). This file is
> the completion record for **Session 13** (the 17th/18th task-book
> brief — the remediation plan lives at
> `docs/plans/2026-09-30-session13-parity-remediation.md`); the next
> session should treat it as the brief.

## What happened

1. **Workspace refresh** — pulled to `22aeb95` (no new remote commits);
   re-read the five core docs (v1.9.0) + the session-17/18 transcripts +
   the session-12 parity plan + worklog. Baseline gate green on the
   UNCOMMITTED session-13 tree: lint 0/0 · tsc clean · 244/244 unit ·
   dev server healthy on :3000 with `db/custom.db` at the repo root;
   `.env` / `.env.example` / vitest + playwright configs verified.

2. **Auth pages SSR titles (S13-P1)** — the raw server HTML rendered
   `NEO CRM | NEO CRM` on `/login` and `Sign up | NEO CRM | NEO CRM` on
   `/signup` (relative titles wrapped a second time by the root layout's
   `"%s | NEO CRM"` template — the same class as the session-12 404
   bug). Both pages now ship `title: { absolute: … }`; pinned by the new
   `tests/page-titles.test.ts` and re-verified via `curl` on the raw
   HTML (the browser tab title settles after hydration, so the SSR
   probe was the only way to see it).

3. **The never-probed Profile page (S13-P2)** — reached via the topbar
   user menu, which itself turned out to be a Radix **Popover**
   (role=dialog) where the reference ships the stock **DropdownMenu**
   (role=menu). The page got the full parity treatment: header wrapper →
   plain `mb-6 sm:mb-8` on the `p-4 sm:p-8` root, the disabled email and
   role inputs gained `bg-gray-50` (and the role input `capitalize`, so
   the raw value "user" displays "User"), the role badge became the
   STOCK Badge pattern on the reference's NEUTRAL family
   (`bg-neutral-900 text-neutral-50` — its profile-page primary is
   #171717, not its own blue), and the Save/Upload buttons became stock
   Buttons (`rounded-md`, `w-full sm:w-auto`, camera icon `w-4 h-4 mr-2`
   on the svg itself). Verified live at 1512 + 390.

4. **Button radius + CardTitle map (S13-P3/P6)** — the reference is
   `rounded-md` (6px) on EVERY button surface; our Button base was
   `rounded-lg` (8px), diverging on contacts/calendar/reports/profile
   (the pages that use default-size buttons). Button base + lg are now
   `rounded-md` (login submit keeps its own rounded-xl slate family).
   CardTitle became a per-page map: the STOCK 16px string by default,
   `text-base sm:text-lg` on dashboard (6) + leads (3), `text-base` on
   the filter rails + the by-type title, `text-lg` on settings (5),
   stock on reports + profile.

5. **The account menu (S13-P4)** — rebuilt on new stock Menu primitives
   in `src/components/ui/dropdown.tsx`: `role=menu` with real menuitems
   (z-50, rounded-md, shadow-md, items `rounded-sm focus:bg-accent
   cursor-default relative`). One probing lesson: DropdownMenuTrigger
   opens on POINTERDOWN, so synthetic `element.click()` never opens it —
   use the browser tool's real click command. E2E-pinned.

6. **The by-type card rebuild (S13-P5)** — the reference's card carries
   a FILTER_RAIL header with the title row + a BARE ••• button, the
   STATIC "Last 2 days" subtitle INSIDE the header (verified: the range
   combobox does not change it), a chips row with five inline-bg
   swatches, and a `mt-4 pt-4 border-t` footer with a stock checkbox.
   Series colors re-pinned: Call #3b82f6, Email #8b5cf6, Meeting
   #f59e0b, Task #10b981, Note #14b8a6. E2E-pinned (chips + footer).

7. **Chart grids + funnel type (S13-P8)** — the grid sweep DISPROVED the
   session-10 pin: recharts' default grid is SOLID; the reference passes
   `strokeDasharray="3 3"` explicitly on `#ccc` lines. All four
   grid-bearing charts now set it (pinned by the new
   `tests/charts-contracts.test.ts`). The reports tab-1 "Conversion
   Funnel" is a horizontal `BarChart layout="vertical"`
   (`FunnelBarChart`) — dashed grid, numeric X, category Y with the EIGHT
   raw stage slugs — NOT a recharts FunnelChart; ours was swapped off
   the trapezoid chart and e2e-pinned (the `closed_won` tick + dashed
   grid). The LEADS funnel stays a FunnelChart (the reference renders
   NOTHING there at zero data — documented inference).

8. **Foreground + base font + Label (S13-P9/P12/P13)** —
   `--color-foreground` flipped #111827 → **#0a0a0a** with page h1s
   explicit `text-gray-900`; the KPI value dropped
   `leading-none tracking-tight` (real computed diffs: line-height
   36px vs 30px, letter-spacing normal vs −0.75px). Two more findings
   surfaced DURING verification, after the suite was green: the BASE
   font-size is 16px on the reference (ours 14px — a scaffold-era
   assumption), and the Label is stock shadcn (`text-sm font-medium
   leading-none`, 14px — ours was a 12px custom). Both fixed and
   re-verified; the avg-cycle KPI also dropped its `+1d` delta
   (S13-P10 — the reference renders deltas at zero on its other cards,
   so this was structural, not data-driven).

9. **The build-script hazard (operational)** — the mid-session e2e
   failure (`auth.setup.ts` timing out at `waitForURL("/")`) was NOT a
   code bug: `package.json`'s build = `next build` + `cp -r .next/static
   .next/standalone/.next/` + `cp -r public .next/standalone/`, and a
   bare `next build` had left the standalone server without any static
   chunks — every `/_next/static` request 404'd, React never hydrated,
   and the login form degraded to a native GET submit (URL became
   `/login?`). Rebuilt through the package script; suite green.
   Documented in AGENTS/PAD/SKILL so it never recurs.

10. **Verification** — full gate: lint 0/0 · tsc clean · **244/244
    unit** (38 new checks) · build clean · **31/31 e2e** (mobile-nav
    7/7). Live DOM re-verified on a fresh dev server at 1512 + 390
    across every touched surface (titles via raw-HTML curl, computed
    KPI styles, button radii, card titles, by-type anatomy, calendar
    cell states, grid dashes, funnel ticks, account-menu anatomy,
    profile form details); zero 390px overflow on all ten routes. Two
    VLM rounds (dashboard + profile): every remaining diff is
    data-driven (the reference's demo data is still zero — 9th
    consecutive session) or an OCR/platform artifact; the profile
    round's "Üser" claim was DOM-disproven (both render "User" via
    capitalize).

11. **Deliverables** — 13 screenshots refreshed under
    `docs/screenshots/` (login logged-out, 9 app routes at 1512×945,
    mobile dashboard + open drawer at 390×844, custom 404); `.env`
    still `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo
    root and `.env.example` matching; docs realigned (README counts +
    e2e coverage, AGENTS session-13 contracts + the build-script note +
    the dashed-grid correction, CLAUDE test strategy, PAD test matrix +
    session-13 notes, SKILL v1.10.0 §16e, this log, the plan addendum,
    both worklogs).

## Next session pointers

- The reference's demo data has been zero for NINE consecutive
  sessions — parity remains structural; re-check on login (it may
  return and change every data-driven surface).
- The reference is a moving target (session-12 KPI drift): re-probe
  previously-pinned families before new layers.
- Unprobed layers remaining: deeper settings surfaces (picklist edit
  flows beyond the add-flow), toast/export behaviors at non-zero data,
  keyboard focus order app-wide, print styles at non-zero data, the
  reference's `/Profile` vs `/profile` casing (both resolve there; ours
  `/profile` only), and dark-mode (neither app ships it).
- Standing rule: verify with raw-HTML/computed-style probes; VLM claims
  are hypotheses until DOM-proven.
