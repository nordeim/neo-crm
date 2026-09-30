# Session 11 — Login Reset Flow + Chart Geometry + Stat Shadows + Reports De-Card + Contacts Architecture (completion log)

> Picked up from the session-10 completion point (pushed at `f2c5010`, plus
> the user's `1982263` session-log commit). This file is the completion
> record for **Session 11**; the next session should treat it as the brief.

## What happened

1. **Workspace refresh** — pulled to `1982263` (the new `docs/session_14.md`
   = the session-10 transcript), re-read the five core docs + the
   session-10 plan/log + worklog. Baseline gate green: lint 0/0 · tsc
   clean · 169/169 unit · dev server healthy on :3000; `.env`
   `DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root,
   `.env.example` tracked, vitest + playwright configs intact. The
   mobile-nav regression was re-verified live BEFORE any changes (burger at
   390, drawer with 8 links, dual scroll locks — body + main inline
   `overflow:hidden`, Escape close with lock restore, the resize-past-md
   auto-close, zero 390px overflow on all nine routes).

2. **Live-reference audit at 1512×945, layer by layer** — demo data STILL
   zero (seventh consecutive session), so parity stayed structural. The
   audit swept the layers below the session-6–10 pins: hover micro-states
   (nav `hover:bg-white/5`, buttons `hover:bg-accent` / primary
   `hover:bg-blue-700` — all matching), Radix Select/dialog chrome (stock
   shadcn both sides), export/toast behavior (**every** reference Export
   button — dashboard, leads, reports tab 2, accounts, contacts,
   activities — plus the login Sign up link and the settings exports are
   dead platform artifacts: no request, no toast, no download), chart
   legends (the reference ships the DEFAULT recharts `<Legend />` — we had
   custom circle icons), chart geometry (dashboard + reports 300px, leads
   rail 250, activities 150 — we had 260/240), the settings Defaults/Data
   tabs (freeform text inputs + only two selects — already aligned), the
   mobile topbar at 390 (search + mail + bell hidden below sm — aligned),
   and the five create-dialog titles/submits (aligned).

3. **The headline finding — the login reset flow (S11-P1)** — the
   reference's "Forgot password?" is NOT dead: it swaps the login card
   IN PLACE (URL stays `/login`) to a **Reset your password** view (Back
   button, H2, description, stock email field, one-size-smaller
   `Send reset link`), and submitting swaps to a **Check your email**
   confirmation (mail icon in a slate-100 circle, the typed email
   emphasized, a green note, a centered Back). No email is actually sent
   (the demo's confirmation is pure client state — the network log shows
   only analytics pings). Our clone had a dead button.

4. **Four structural findings** — (a) every stat-card family on the
   reference carries bare `shadow` (our `shadow-sm` was one step light)
   and the dashboard/reports KPI cards additionally
   `hover:shadow-md transition-shadow`; (b) the reports tabs are NOT
   card-wrapped — the pill bar + panels render bare in a `space-y-6`
   container directly under the page-level KPI row, every grid `gap-6`,
   every tab body `space-y-6` (ours sat inside a `Card mt-6` with
   `py-4` insets and `gap-4` grids — a session-3 misreading of "white
   filter card + pill tabs"); (c) the contacts page is the reference's
   only full-height layout — `h-[calc(100vh-64px)]` + inner
   `overflow-auto` + `p-8` at ALL widths, with the calc 5px short of the
   real 69px topbar (a quirk mirrored verbatim; main overflows 5px); (d)
   the contacts table card is the ONLY tiny-shadow (`shadow-sm`) table
   card (accounts/leads stay `rounded-lg shadow`).

5. **The Tailwind v4 space-y bug (the session's one new rename-family
   bug)** — the reference's reset-view Back button ships `-mb-2`, which
   under ITS v3-era space-y (margin-TOP on following siblings) computes a
   16px gap. Under v4, `space-y-*` is wrapped in `:where()` (0,0,0
   specificity) AND flipped to margin-BOTTOM on `:not(:last-child)` — so
   the mirrored `-mb-2` (0,1,0) won the specificity fight and produced an
   8px OVERLAP. First caught as a VLM suspicion, then proven by computed
   margins on both apps, fixed by re-deriving from the computed gap
   (`mb-4`). Recorded as a standing hazard next to the s9 shadow and s10
   blur re-pins: **when mirroring negative margins that ride on space-y
   gaps, re-derive from the reference's computed gap, never copy the
   class string.**

6. **TDD execution** — 20 red-first checks: the new
   `tests/login-reset.test.ts` (14 — the two views' class vocabularies,
   the `nextLoginView()` state machine, `canSubmitReset()` gating) + 6
   page-layout pins (`CHART_GEOMETRY`, `STAT_SHADOWS`, `TABLE_SHADOWS`,
   `CONTACTS_LAYOUT`, `LOGIN_RESET_LAYOUT`, `iconButton` `sm:flex`).
   Then the implementation: `src/lib/login-reset.ts` (new seam) + the
   two in-card views in `login-card.tsx`; the stat-card shadows +
   KPI hover in `page-parts.tsx`; chart heights + plain `<Legend />` in
   `charts.tsx`; the reports de-card + `gap-6` + 300px charts; the
   contacts full-height rebuild. E2E extended in the same commits: +2
   auth tests (the reset swap + the sent view) and +1 crm test (bare
   tabs + gap-6 + 300px) → 26 total.

7. **VLM comparison rounds** — 4 pages compared (reset view, dashboard,
   reports, contacts). Two real diffs, both on the reset view (the
   space-y overlap above; the reset input's placeholder slate-600 where
   the reference ships slate-400 — its own inconsistency vs the sign-in
   fields, mirrored). Both fixed, both re-probed, the re-captured reset
   view compared ALIGNED.

8. **Full gate green** — lint 0/0 · tsc clean · **189/189 unit** ·
   build clean · **26/26 e2e** (mobile-nav 6/6 intact). DOM
   re-verification at 1512/1024/768/700/390: stat-card computed shadows,
   KPI hover, chart heights 300/250/150, default legend icons, reports
   bare tabs + 1192px content + gap-6 grids, contacts inner-scroll +
   p-8 (32px at 390) + the 5px quirk, the standing mobile-nav
   regression, zero horizontal overflow at 390 on all nine routes.

9. **Deliverables** — 12 screenshots refreshed in `docs/screenshots/`
   (the login capture stays the sign-in view — the reset flow is
   e2e-verified); `.env.example` re-verified (unchanged contract); docs
   realigned (README, AGENTS + the space-y hazard + the five session-11
   contract blocks, CLAUDE, PAD, `neo-crm_SKILL.md` **v1.8.0** with the
   new §16c session-11 layer, this log, the plan addendum, repo
   worklog).

## Suggested next steps for Session 12

- The reference's demo data has now been zero for seven consecutive
  sessions; if it ever returns, audit the data-populated states first
  (the legend icons with real series, the Forecast-by-Probability chart
  type, the funnel's populated geometry, the aging buckets with real
  ages).
- The dead Export buttons and Sign up link remain platform artifacts;
  a self-hosted deployment could wire real CSV exports behind the same
  seams (the reference's own buttons never fire).
- The login reset flow is client-side by design (the reference's demo
  never sends mail); a real sender can be wired behind
  `src/lib/login-reset.ts` without touching the views.
- Remaining unprobed surfaces are thin: print styles, keyboard-only
  focus order on the reports tabs, and the settings picklist add-flow
  dialogs were last re-verified in session 8.
