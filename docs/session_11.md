# Session 9 — Component-Anatomy Parity + Tailwind v4 Shadow-Scale Bug (completion log)

> Picked up from the session-8 completion point (pushed at `ef7e892`, plus
> the user's `2c6eb3e` session-log commit). This file is the completion
> record for **Session 9**; the next session should treat it as the brief.

## What happened

1. **Workspace refresh** — pulled to `2c6eb3e` (the new `docs/session_10.md`
   = the session-8 transcript), re-read the five core docs + the session-8
   plan/log + worklog. Baseline gate green: lint 0/0 · tsc clean · 133/133
   unit. Environment verified: `.env` `DATABASE_URL="file:../db/custom.db"`,
   `db/` at the repo root, `.env.example` tracked, vitest + playwright
   configs intact.

2. **Live-reference audit at DESKTOP width first** — the lesson of this
   session: the first 390px pass produced recharts tick-dropping artifacts
   (a false "pipeline stage vocabulary diff" — at 390px recharts drops
   ticks; at 1512px both apps render the same five stages
   Prospecting/Qualification/Proposal/Negotiation/Won). All nine routes
   captured from BOTH apps at 1512×945 + computed-style probes +
   structured DOM diffing. Demo data STILL zero (fifth consecutive
   session). Findings concentrated in the **component-anatomy layer**
   (buttons, inputs, card titles, focus states, empty states, table cards)
   — plus one real Tailwind v4 bug in our build.

3. **The Tailwind v4 shadow-scale bug (S9-P0)** — our v4.3.3 `shadow-sm`
   compiles to `0 1px 3px …, 0 1px 2px -1px …` (the RENAMED old bare
   `shadow`), while the reference's `shadow-sm` computes the tiny
   `0 1px 2px 0 rgb(0 0 0 / .05)`. Every `shadow-sm` surface (buttons,
   inputs, outline controls) rendered one step heavier than the reference.
   Exactly the rename hazard documented in
   `skills/avant-garde-design-v4/references/02-tailwind-v4-deep-dive.md`.
   Fix: a single `@theme` re-pin (`--shadow-sm: 0 1px 2px 0 rgb(0 0 0 /
   0.05)`), pinned by the new `tests/design-tokens.test.ts` (parses
   globals.css — no browser needed). Bare `shadow` (the Card family)
   matches both sides and was deliberately NOT overridden; `rounded-sm`
   probes confirmed both apps render 4px (no radius rename issue).

4. **The other DOM-verified fixes (S9-1…S9-17):**
   - **S9-1** button icon-text gap: reference icons carry `mr-2` on top of
     `gap-2` (measured 16px vs our 8px) — `BUTTON_BASE.iconGap` =
     `[&_svg]:mr-2 [&_svg:only-child]:mr-0` (icon-only buttons stay
     unmarginated, matching mail/bell/ellipsis).
   - **S9-2** entity-dialog submit buttons were blue; the reference's
     in-dialog `--primary` is the STOCK shadcn dark `rgb(23,23,23)` — all
     five dialogs now render the `DIALOG_SUBMIT` dark button (header
     primary buttons stay blue-600, as on the reference).
   - **S9-3** CardTitle h3 → **div** (the reference has no card-heading
     semantics; activities' h2s and the calendar rail h3s are literal
     elements); e2e card-title assertions moved to text locators.
   - **S9-4** settings header → the PLAIN variant (`PAGE_HEADER.settings`:
     a `mb-6` div, non-responsive `text-3xl` h1, no actions wrapper).
   - **S9-5** leads header actions stack below sm (`flex-col sm:flex-row`)
     with per-button `w-full sm:w-auto`.
   - **S9-6** activities quick-log group gains `flex-wrap`.
   - **S9-7** reports header button renders unwrapped (direct child).
   - **S9-9** Recent Deals mirrors the reference's EIGHT columns — the
     duplicate "Status" header (visible quirk; reverses session-5's
     "defect we do not copy" call per the strict-mirror precedent) — and
     renders an empty tbody at zero rows.
   - **S9-10** empty-state anatomy: dashboard lists `py-4 text-sm`;
     calendar `py-8` (16px inherited); Lead Sources renders an EMPTY
     container; reports render IN-TABLE empty rows with no vertical
     padding.
   - **S9-11** reports table cards inset their tables (`p-6 pt-0` via
     `REPORTS_TABLE_CARD`; ours were flush `px-0 py-0`).
   - **S9-12** inputs are `text-base md:text-sm` (16px below md — the
     reference's phones); Selects stay `text-sm` (as on both).
   - **S9-16** focus rings: 1px near-black `ring-1 ring-ring`
     (`--color-ring: #0a0a0a` — the reference's `--ring` 0 0% 3.9%) on
     inputs/buttons/selects; tabs keep ring-2 + offset with the ring-ring
     color.
   - **S9-17** Top Performing Sales Reps converted from a table to the
     reference's DIV list (bordered header row, `flex gap-8` right pair).
   - **S9-8** profile card: standard content + form + `space-y-6`
     (max-w-xl dropped), Avatar-primitive avatar (bg-blue-100 inner div +
     stroke-2 user icon — ours was stroke-1.5), default-size stretched
     Upload Photo + Save Changes (`w-full sm:w-auto`), "Enter your full
     name" placeholder, raw lowercase role value, always-enabled Save
     (the reference's is enabled at rest), div role badge, `space-y-4
     sm:space-y-6` column, no `h-fit`.

5. **TDD execution** — red first: the new `tests/design-tokens.test.ts`
   (3 checks) + a 12-check session-9 block in `tests/page-layout.test.ts`
   failed exactly as intended (14 failing), then the contracts landed in
   `page-layout.ts`/`globals.css` and the implementation went green. Two
   mid-verification VLM refinements (both DOM-verified on the live
   reference): the profile Save button must be ENABLED at rest (ours
   disabled-at-unchanged rendered gray) and the Role input shows the raw
   lowercase `user` (ours capitalized).

6. **Verification** — full gate green at every checkpoint: **lint 0/0 ·
   tsc · 148/148 unit · build clean · 22/22 e2e** (mobile-nav 6/6 with the
   resize lock-release regression). Dev-server DOM re-verification:
   icon-text gap 16px, computed `shadow-sm` = `0 1px 2px 0.05`, dark
   dialog submits (rgb(23,23,23)), settings plain header, leads stacking
   (358px full-width buttons at 390), activities wrap, 8-column Recent
   Deals, reports inset tables + direct-child header button, profile
   surface (stroke-2 avatar, stretched buttons, 16px inputs below md).
   Breakpoints 1512/1024/900/768/700/390 exact (sidebar from 768, burger
   below); zero horizontal overflow at 390 on all nine routes; drawer
   open → navigate → unlock + Escape + resize regression re-verified.
   Five VLM page comparisons (dashboard/reports/profile/settings/leads):
   every residual was a zero-data artifact; the profile round-2 verdict
   was **ALIGNED**.

7. **Deliverables** — 12 screenshots refreshed in `docs/screenshots/`
   (login captured from a logged-out state, then re-authenticated);
   `.env.example` re-verified unchanged; docs realigned (README, AGENTS
   with the session-9 contracts + the shadow-scale hazard, CLAUDE, PAD
   test distribution, `neo-crm_SKILL.md` **v1.6.0** + quirk-register
   additions, this log, repo worklog).

## Suggested next steps for Session 10

- The reference's demo data has now been zero for five consecutive
  sessions; if it ever returns, audit the data-populated states
  (pagination, chart values, populated chips, density switcher behavior,
  the Recent Deals duplicate-Status CELLS — our mirrored badge-twice is a
  zero-data-informed guess).
- The dead mirrors remain deliberate (accounts Standard/Detailed select,
  More button, mail/bell) — re-audit if the reference ever wires them.
- The calendar Agenda card shows a selected-day date chip next to its h3
  (functional superset; the reference's agenda is empty at rest) — if the
  reference ever shows its own date affordance, re-pin.
