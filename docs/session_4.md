# Session 4 Log — Pixel-Grade Parity Hardening (2026-09-29)

Started by refreshing the workspace: `git pull` to `aa6395e` brought in
`docs/session_3.md` + `docs/prompt-to-review-2.md`. Reviewed all root docs,
the session-3 plan and worklog, then validated the baseline against the
codebase — lint 0/0, typecheck clean, 65/65 unit, dev server healthy on
:3000, `.env` / `db/` / vitest + playwright configs all correct.

## Audit method upgrade

The reference's demo data is still reset to zero, so structure remains the
parity target — but this session extracted evidence from the **live DOM**
(`getComputedStyle`, lucide class names, `outerHTML`) instead of VLM
screenshot reads. That overturned several session-3 conclusions:

- Sparkline lines are `#10b981`, not teal; Deals Closed bars are
  `#22d3ee` (cyan-400), not cyan-500.
- The pipeline legend's Proposal swatch is yellow-500 `#eab308` and Won is
  grey-400 `#9ca3af` (chart hex only — table badges stay emerald).
- Accounts/activities stat cards carry `trending-up` / `trending-down`
  glyphs the VLM never reported, and use a side-by-side value+bars anatomy
  (not the dashboard KpiCard stack).
- Inactive sortable headers show `arrow-up-down`, not chevrons; contacts
  Name is NOT sortable; accounts has no sorting at all.
- The reports revenue chart ships no legend; its tab track is a white
  bordered grid with `bg-blue-50` active tabs.
- The reference dashboard revenue chart renders BOTH series as filled
  areas over a 7-tick month window.
- The profile page: blue-100 avatar circle with a user glyph, camera-icon
  upload, near-black Save Changes, four right-column cards with tinted
  48px chips.

## Remediation (G-1…G-15, TDD)

Planned in `docs/plans/2026-09-29-session4-parity-remediation.md`, validated
against the codebase, then executed:

- **Phase A (red → green)**: `tests/constants.test.ts` pins the palette;
  `STAGE_META` chart hex + the `CHART_COLORS` -400 family landed.
- **Phases B–J**: KpiCard typography, new `BarStatCard`, IconStatCard
  gradient + trend row, tabs `segmented`/`pill` grid variants, sort-icon
  system, dashboard sparklines + dual-area 7-month revenue chart, accounts
  card migration, contacts trend row + green-500 chip, leads sort headers,
  calendar solid `bg-sidebar` selected cell + h2 heading, activities
  `grid-cols-4` track + 5-category by-type chart, reports legendless
  revenue chart, settings `grid-cols-3`, profile rebuilt to DOM truth.
- **Mid-execution catches**: Tailwind v4 never compiles dynamic
  `` `grid-cols-${n}` `` templates (static `GRID_COLS` record shipped);
  the long-running dev server served a stale module graph until restarted;
  the calendar cell needed `bg-sidebar` (blue-600), not `bg-primary`.

## Verification

- Full gate: lint 0/0 · typecheck clean · **68/68 unit** · build clean ·
  **21/21 e2e** (5-check mobile-nav regression intact).
- Every G-item re-verified in the running clone's DOM at 1512×945 and
  390×844 — exact swatch colors, sparkline strokes, bar families, tab
  classes, sort icons, selected-day cell, profile chips.
- 12 screenshots refreshed in `docs/screenshots/`; AGENTS.md, CLAUDE.md,
  README.md and the PAD realigned (counts, palette, conventions);
  `neo-crm_SKILL.md` bumped to v1.1.0 with the session-4 audit entry and
  the "DOM extraction beats VLM reads" methodology lesson.

Delivered as a Conventional Commit on `main`, pushed via
`docs/ssh_git_wrapper_v3.py`.
