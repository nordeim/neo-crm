# Session 11 Remediation Plan — Login Reset Flow + Stat-Card Shadows + Chart Geometry + Reports De-Card + Contacts Architecture (2026-09-30)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `1982263`
(baseline gate green: lint 0/0 · tsc clean · 169/169 unit · dev server healthy
on :3000 with `db/custom.db` at the repo root; `.env` / `.env.example` / `db/`
/ vitest + playwright configs all verified; the mobile-nav regression suite
re-verified LIVE before any changes — burger at 390, drawer with 8 links,
dual scroll-lock (body + main inline `overflow:hidden`), Escape close with
lock restore, the resize-past-md auto-close at 800px, zero 390px horizontal
overflow). The reference's demo data is STILL zero (seventh consecutive
session) — parity remains structural. All reference DOM was captured at
**1512×945** with computed-style probes on both apps. Sessions 1–10 covered
data/API, visual basics, dialogs, layout, app chrome, functional controls,
component anatomy, stock primitives and chart internals. This session's audit
targeted the layers still below those pins: **the login card's reset-password
flow** (never clicked before — the "dead" Forgot-password button was actually
a live in-card view swap), **stat-card + table-card shadow scales** (computed
box-shadows), **chart geometry** (heights + legend internals), the **reports
tabs container** (our Tabs are card-wrapped; the reference's are bare), and
the **contacts page architecture** (a unique full-height layout the other
eight pages do not share). One standing instruction re-check: no new
Tailwind v4 rename bugs surfaced this session (shadow/blur/rounded/outline/
ring scales all re-probed clean after the s9/s10 re-pins).

**Method:** TDD — new contracts land in `src/lib/page-layout.ts`
(`LOGIN_RESET_LAYOUT`, chart-height pins), `tests/design-tokens.test.ts`,
`tests/page-layout.test.ts` and a new `tests/login-reset.test.ts` with
failing tests first; e2e assertions are updated in the same commits as the
behavior changes. UI changes land with the full gate plus browser
re-verification at 1512/1024/768/700/390. The `skills/` folder stays
excluded from all checking, testing and compilation.

---

## Identified Issues, Bugs and Gaps (all DOM-verified unless noted)

| # | Sev | Issue | Evidence (live DOM / reproduction) |
|---|-----|-------|-----------------------------------|
| S11-P1 | **High** | **The login "Forgot password?" flow is missing — the button is NOT dead on the reference.** Clicking it swaps the login card IN PLACE (URL stays `/login`) to a **"Reset your password"** view: `Back to sign in` button (`flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors -mb-2`, lucide ArrowLeft h-4 w-4), H2 `Reset your password` (`text-xl sm:text-2xl font-bold text-slate-900`), description `Enter your email and we'll send you a link to reset your password` (`text-slate-600 text-sm sm:text-base`), the stock Email label + input, and `Send reset link` (`px-3 py-2 w-full h-10 sm:h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm rounded-xl transition-all duration-200` — one size smaller than Sign in's h-11 sm:h-12). Submitting swaps to a **"Check your email"** confirmation: mail icon (`lucide-mail h-7 w-7 sm:h-8 sm:w-8 text-slate-700`) in `mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center`, H2 `Check your email` (same title classes), `We've sent password reset instructions to <span class="font-medium text-slate-900">{email}</span>`, green note `Please check your email for the password reset link. It may take a few minutes to arrive.` (`[&_p]:leading-relaxed text-green-700 text-sm`), and a full-width centered `Back to sign in` (`w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors`). Ours: a dead `<button>` with no onClick. No email is actually sent on the reference (base44 demo — the confirm view renders from the client); ours mirrors the two views client-side. | live click probes + full class/HTML extraction on both views |
| S11-P2 | High | **IconStatCard (both variants) + CircleStatCard ship `shadow-sm` — the reference's stat cards ALL carry bare `shadow`.** Computed: reference stat cards `0 1px 3px 0 rgb(0 0 0/0.1), 0 1px 2px -1px rgb(0 0 0/0.1)` on every page family (dashboard KPI, reports KPI, accounts, leads, activities, calendar, contacts gradient cards); ours render the s9-re-pinned tiny `0 1px 2px 0 rgb(0 0 0/0.05)` on IconStatCard leads+contacts variants and CircleStatCard (KpiCard/BarStatCard/TrendStatCard already ship bare `shadow` ✓). | computed box-shadow probes on all 7 stat-card surfaces, both apps |
| S11-P3 | Med | **KpiCard missing hover feedback.** The reference's dashboard + reports KPI cards ship `hover:shadow-md transition-shadow`; our KpiCard has neither (CircleStatCard already has both ✓). | class dumps on dashboard + reports KPI cards |
| S11-P4 | **High** | **Chart heights short across the app.** Reference: dashboard pipeline + revenue **300px** (534 wide); reports tab-1 all four charts **534×300**; tab-2 Forecasting Accuracy **1142×300** ✓ (ours already 300) + the other three **331×300**; tabs 3/4 charts **331×300**; leads rail three charts **331×250**. Ours: dashboard 260; reports tab-1 260/240; tabs 2–4 250; leads 240. (Activities by-type 150 ✓ matches.) | `.recharts-wrapper` clientWidth/Height measurement, every chart on both apps |
| S11-P5 | **High** | **The reports Tabs are wrapped in a Card.** Reference structure (tab-1 active): KPI grid (`…gap-4 mb-6`) → bare `DIV.space-y-6` → pill-tabs bar (`items-center justify-center rounded-lg p-1 …`) → `TabsContent.mt-2 → DIV.space-y-6 → charts grid (lg:grid-cols-2 gap-6)`. Ours: `<Card className="mt-6"><CardContent className="py-4"><Tabs>…` plus an inner `py-4` wrapper around every tab panel — the card paint + double padding shrink the tab content to **1142px** where the reference renders **1192px** (charts 513 vs 534 wide) and put a white card + border behind the tab bar the reference does not have. | DOM structure walks both apps; card/width measurements |
| S11-P6 | Med | **Reports grids + tab wrappers use gap-4 — the reference uses gap-6 / space-y-6 everywhere on the reports tabs.** Charts: tab-1 `grid grid-cols-1 lg:grid-cols-2 gap-6`; tabs 2–4 `grid grid-cols-1 lg:grid-cols-3 gap-6` (cards 381 = 331+50). Tables: `grid grid-cols-1 lg:grid-cols-2 gap-6`. Tab body wrappers: `space-y-6`. Ours: `flex flex-col gap-4` wrappers + `gap-4` grids throughout. (The LEADS page grid is correctly `gap-4 sm:gap-6 mt-6` ✓ — reports is the outlier.) | grid class + computed-gap extraction on all 5 reference tabs |
| S11-P7 | Med | **The revenue chart's legend is custom — the reference ships the recharts DEFAULT legend.** Reference (dashboard Revenue Over Time): `recharts-default-legend` with two items — `Won` (icon stroke `#10b981`) and `Target` (`#ef4444`), plainline icons (14×14 box, `stroke-width="4"` path), item text colored per series (`color: rgb(16,185,129)` / `rgb(239,68,68)`), no extra wrapper style. Ours: `iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#6b7280", paddingTop: 8 }}` on RevenueLineChart + WonLostLineChart. Same bug family as the s10 custom-tooltip find (we pass props where the reference passes none). Reports tab-1 keeps `hideLegend` ✓ (reference: no legend there). | legend HTML extraction on the reference's dashboard |
| S11-P8 | Med | **Contacts page architecture differs.** The reference's contacts page is the ONLY page with a full-height layout: `main > DIV.flex.h-[calc(100vh-64px)] > DIV.flex-1.overflow-auto > DIV.p-8 > (header / 4-stat grid / filters bar / table card / empty lg:hidden mt-6 space-y-4 mobile-cards container)`. The content scrolls inside the nested container (main only overflows 5px — the calc uses 64px but the real topbar is 69px, a reference quirk), and the padding is **p-8 at ALL widths** (every other page: `p-4 sm:p-8` — at 390px contacts pads 32px where ours renders 16px). Ours: the standard shell. The contacts stat grid is `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6` ✓ (ours matches) and the 4 gradient cards ✓ — only the shell + inner scroller + trailing mobile-cards container differ. | DOM walks, computed paddings, main.scrollHeight probes |
| S11-P9 | Low | **Contacts table card shadow inverted.** Reference contacts table card: `bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden` (TINY shadow-sm + border). Ours: `<Card className="mb-6 overflow-hidden">` — the Card base's bare `shadow` (standard) renders one step HEAVIER. (Accounts/leads table cards: `rounded-lg shadow` both sides ✓.) Our code comment already says shadow-sm — the implementation just never overrode the Card default. | computed box-shadows on all three entity table cards |
| S11-P10 | Low | **Topbar iconButton `sm:inline-flex` vs the reference's `sm:flex`.** Same utilities otherwise; computed `display` differs (inline-flex vs flex) with no visual effect on fixed-size icon buttons. Align for computed parity. | class dumps both apps |
| S11-P11 | Info | **The reference's Export buttons are dead everywhere** — leads header `Export`, reports filter-card `Export CSV`/`PDF`, tab-2 table `Export CSV`/`Export PDF`, dashboard header `Export`: no network request, no download, no toast (platform artifacts). Ours export real CSVs / open print (documented functional superset, like the working /signup). Quirk-register entry only. | click probes + network capture (zero export requests) |
| S11-P12 | Info | **The reference's empty Toaster viewport blocks the top 32px of every page** (no `pointer-events-none`; `fixed top-0 z-[100] … p-4` intercepts clicks — reproduced: the user-menu click was blocked until mouse-positioned below it). Ours ships the identical viewport classes + `pointer-events-none` on the container / `pointer-events-auto` on toasts — the defect is already fixed; document as a deliberate fix-over-defect (mobile-nav precedent). | click-block reproduction + class comparison |

**Verified-aligned (no action):** demo data still zero (7th session); all five
entity dialogs (titles `Create New Lead/Account/Contact`, `New Event`,
`Log Activity`; submits `Create Lead/Account/Contact/Event`, `Log Activity`;
Cancel; stock `grid gap-4 py-4` fields + `flex flex-col-reverse
sm:flex-row sm:justify-end sm:space-x-2` footer + `absolute right-4 top-4
opacity-70` close + `bg-black/80` overlay + `bg-primary` submit); Select
dropdown content (stock `min-w-[8rem] rounded-md border shadow-md` +
popper viewport + `py-1.5 pl-2 pr-8 focus:bg-accent` items); settings
Defaults tab (4 inputs incl. freeform currency/stage/tier + number
follow-up, 2 selects) + Data tab (3 templates, 4 exports, destructive
reset); activities rail (Save All, 4 type checkboxes, Owner/Last 7 Days
selects, More Filters (1) + Filter); calendar (New Event primary, arrow
icon-buttons, Today, Clear All, 42-cell grid); mobile topbar at 390 (search
`hidden sm:flex flex-1 max-w-xl`, mail/bell `hidden sm:flex`, user label
`hidden sm:inline`, avatar visible); nav hover `hover:bg-white/5`; button
hovers (`hover:bg-accent`, primary `hover:bg-blue-700`); all per-page KPI/
stat grids (dashboard xl:6, accounts lg:5, contacts lg:4, leads xl:6,
activities xl:6, calendar lg:4, reports xl:5 — all `gap-4 mb-6`);
accounts/leads table cards (`bg-white rounded-lg shadow`); dashboard chart
grid (`lg:grid-cols-2 gap-6 mb-6`); leads chart grid (`gap-4 sm:gap-6 mt-6`)
+ titles; scrollbars unstyled both sides; login card + slate gradient accent
bar + footer links; user menu (Profile `<a>` + Logout `<div>`); chart cards
(`p-6` header + `p-6 pt-0` content); the Toaster container classes; the
`hidden lg:hidden` contact-card quirk register entry is N/A (that container
is contacts-specific and handled by S11-P8).

**Quirk-register updates:** the login reset flow is a client-side view swap
(no email is sent by the demo — our clone mirrors the two views and links
the real behavior to a documented no-op sender); the dead Export buttons;
the Toaster pointer-events defect; the contacts `calc(100vh-64px)` vs real
topbar 69px (5px main-scroll quirk — mirrored verbatim for strict parity);
contacts `p-8` at all widths.

---

## Remediation ToDo (TDD)

### Phase A — contracts, red first
- [ ] **A1** new `tests/login-reset.test.ts` (pure seam
      `src/lib/login-reset.ts` — the two views' class vocabularies +
      `nextLoginView()` state machine: `signin → reset → sent`):
      `LOGIN_RESET_LAYOUT.back` (with `-mb-2`), `.title`,
      `.description`, `.send` (h-10 sm:h-11 slate-900), `.sentIconWrap`
      (w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full),
      `.sentIcon` (lucide-mail h-7 w-7 sm:h-8 sm:w-8 text-slate-700),
      `.sentEmail` (font-medium text-slate-900), `.sentNote`
      (text-green-700 text-sm), `.sentBack` (w-full justify-center),
      and the state machine transitions + `canSubmit(email)` guard.
- [ ] **A2** `tests/page-layout.test.ts` add pins: `CHART_GEOMETRY`
      (dashboard/reports charts height 300, leads rail 250, activities
      by-type 150 — the reference-measured values), `STAT_SHADOWS`
      (IconStatCard both variants + CircleStatCard carry bare `shadow`,
      KpiCard carries `hover:shadow-md transition-shadow`),
      `CONTACTS_LAYOUT` (fullHeight `h-[calc(100vh-64px)]`, innerScroll
      `flex-1 overflow-auto`, content `p-8`, mobileCards
      `lg:hidden mt-6 space-y-4`), `TABLE_SHADOWS.contacts`
      (`shadow-sm`), `TOPBAR_LAYOUT.iconButton` uses `sm:flex`.
- [ ] **A3** `tests/design-tokens.test.ts`: no new tokens this session —
      re-verify the existing suite stays green (the shadow/blur re-pins
      from s9/s10 are the reason bare `shadow` and `shadow-sm` now differ
      by exactly one step; no changes to globals.css).

### Phase B — e2e dependencies (same commits as the changes)
- [ ] **B1** `tests/e2e/crm.spec.ts`: add the login reset-flow test
      (login page → Forgot password? → reset view visible (title + Send
      reset link) → back → sign-in view restored; the sent view via a
      direct state injection is unit-covered, not e2e — no email send in
      e2e); extend the reports assertions to the bare-tabs structure
      (tabs bar NOT inside a `[class*=border]` card; content width 1192
      at 1512) and chart heights (300px wrappers).

### Phase C — implementation to green
- [ ] **C1** `src/lib/login-reset.ts` (new pure seam: view state machine
      + class vocabulary) → `src/components/layout/login-card.tsx`:
      the two in-card views (reset + sent) with the exact reference
      anatomy; `Forgot password?` swaps to the reset view; `Send reset
      link` validates the email and swaps to the sent view; both
      `Back to sign in` buttons return to the sign-in view.
- [ ] **C2** `src/components/shared/page-parts.tsx`: IconStatCard both
      variants + CircleStatCard `shadow-sm` → `shadow`; KpiCard gains
      `hover:shadow-md transition-shadow`.
- [ ] **C3** `src/components/charts/charts.tsx`: default heights 300 for
      PipelineBarChart / RevenueLineChart / WonLostLineChart /
      ConversionFunnel; the leads page passes `height={250}` explicitly;
      RevenueLineChart + WonLostLineChart drop every custom Legend prop
      → plain `<Legend />`.
- [ ] **C4** reports page: remove the `<Card mt-6><CardContent py-4>`
      wrapper + the inner `py-4` — the pill-tabs bar + `TabsContent
      mt-2` render bare in a `space-y-6` container directly under the
      KPI grid; every tab body `flex flex-col gap-4` → `space-y-6`;
      every `gap-4` grid → `gap-6` (tab-1 2-col, tabs 2–4 3-col charts,
      2-col tables); tab-2/3/4 chart `height={250}` → 300.
- [ ] **C5** contacts page: adopt the reference architecture — the page
      renders `h-[calc(100vh-64px)] flex` + `flex-1 overflow-auto` +
      `p-8` content (mirroring the reference's 5px quirk verbatim), the
      trailing `lg:hidden mt-6 space-y-4` mobile-cards container, and
      the table card `shadow` → `shadow-sm` (via className override —
      `cn` is tailwind-merge, the conflict resolves cleanly).
- [ ] **C6** `src/lib/page-layout.ts`: `TOPBAR_LAYOUT.iconButton`
      `sm:inline-flex` → `sm:flex`; add the `CHART_GEOMETRY` /
      `CONTACTS_LAYOUT` contract exports the tests pin.

### Phase D — verification
- [ ] **D1** Full gate: lint 0/0 · tsc · unit (169 + new pins) · build ·
      e2e (23 + the reset-flow + reports-structure checks; mobile-nav
      6/6 must stay green).
- [ ] **D2** DOM re-verification at 1512/1024/768/700/390: the reset
      views' classes, stat-card computed shadows (0 1px 3px), KPI hover,
      chart heights (300/250/150), reports tabs bare + 1192 content +
      gap-6 grids, contacts inner-scroll + p-8 (390px: 32px padding),
      contacts table shadow-sm, legend default icons, the standing
      mobile-nav regression + zero 390px overflow on all nine routes.
- [ ] **D3** VLM spot-comparison (login reset view, dashboard, reports,
      contacts).

### Phase E — deliverables
- [ ] **E1** Refresh `docs/screenshots/` (12 captures; the login capture
      stays the sign-in view — the reset flow is e2e-verified).
- [ ] **E2** `.env.example` re-verify (unchanged contract).
- [ ] **E3** Docs realignment: README, AGENTS, CLAUDE,
      Project_Architecture_Document, `neo-crm_SKILL.md` (v1.8.0),
      `docs/session_15.md` (session-11 completion log), repo worklog,
      quirk-register updates.
- [ ] **E4** Commit on main + SSH-wrapper push.

---

## Execution notes

- **Why the reset flow is client-side:** the reference's demo never sends
  an email — the "Check your email" view renders purely from client state
  (no network call fires; the network log shows only analytics pings).
  Our clone mirrors the two views exactly; a self-hosted deployment can
  later wire a real sender behind the same seam. The unit seam
  (`login-reset.ts`) keeps the view classes testable without rendering.
- **Shadow scale, one year later:** the s9 `--shadow-sm` re-pin made
  `shadow-sm` (tiny) and bare `shadow` (standard) differ by exactly one
  step — which is why S11-P2/S11-P9 are visible at all. The reference
  uses the tiny one ONLY on the contacts table card, the dialog trigger
  family and the login buttons; every stat card carries the standard
  one. The fix is class-level only — no token changes.
- **Chart heights are per-surface constants, not a global:** dashboard +
  reports render 300, the leads rail 250, activities by-type 150. The
  leads page keeps its explicit `height={250}` (its rail cards are
  381-wide vs the reports 584/381 mix — the reference itself differs
  per surface, so the constants live in `CHART_GEOMETRY`).
- **The reports de-card reverses a session-3 reading:** "white filter
  card + pill tabs" was recorded when only the filter bar was probed;
  the tabs were assumed to live in the same card. The reference's tabs
  are bare — the filter card (sticky, p-4) is a separate element above
  the KPI row and is untouched by this plan.
- **Contacts strict-mirror:** the `calc(100vh-64px)` produces a 5px
  main scroll on the reference (real topbar 69px). We mirror the calc
  verbatim per the strict-parity precedent (duplicate-Status quirk,
  session 9) and document it; the mobile-nav dual lock still works
  (main clamps its 5px scroll; the inner scroller sits under the
  overlay and cannot receive wheel events).
- **Legend defaults follow the s10 tooltip precedent:** where the
  reference passes no props, we pass no props. The WonLostLineChart's
  legend is unverifiable at zero data (row-derived, renders empty) —
  defaulting it matches every verified recharts surface and is the
  documented zero-data-informed choice.

---

## Addendum — execution record (same session)

All phases executed with the full gate green at every checkpoint:

- **Phase A:** 20 red-first checks — `tests/login-reset.test.ts` (14:
  the two views' class vocabularies, the `nextLoginView()` state
  machine, `canSubmitReset()` gating) + 6 page-layout pins
  (`CHART_GEOMETRY`, `STAT_SHADOWS`, `TABLE_SHADOWS`, `CONTACTS_LAYOUT`,
  `LOGIN_RESET_LAYOUT`, the `iconButton` `sm:inline-flex → sm:flex`
  refinement). design-tokens re-verified green (no token changes).
  **Contract corrected mid-phase:** the plan's `LOGIN_RESET_LAYOUT.back`
  pinned the reference's literal `-mb-2` — VLM flagged and computed
  styles proved that v4's `:where()` space-y (margin-BOTTOM on
  `:not(:last-child)`) loses the specificity fight to `-mb-2` (0,1,0 vs
  0,0,0), turning the reference's computed 16px back-gap into an 8px
  OVERLAP. The pin (and the component) use `mb-4` — the v4-correct
  expression of the reference's computed gap. Recorded as the space-y
  hazard in AGENTS/SKILL.
- **Phase B:** +2 auth e2e (forgot-password swap + back; send reset
  link → the check-your-email view) landed in `auth.spec.ts` (the
  logged-out surface the flow belongs to) and +1 crm e2e (reports tabs
  bare + gap-6 grids + 300px chart wrappers) — 26 total.
- **Phase C:** `src/lib/login-reset.ts` seam + the two in-card views in
  `login-card.tsx` (slate-400 placeholder on the reset input — the
  reference's own inconsistency, caught in VLM round 2); stat-card
  shadows (`shadow` on IconStatCard ×2 + CircleStatCard, KpiCard
  `hover:shadow-md transition-shadow`); chart heights (300 default on
  PipelineBar/RevenueLine/WonLostLine/ConversionFunnel, leads rail
  explicit 250, activities 150) + plain `<Legend />`; reports de-carded
  (bare `space-y-6` container under the KPI row, `gap-6` grids,
  `space-y-6` tab bodies, 300px tab 2–4 charts); contacts rebuilt to
  the full-height architecture (`h-[calc(100vh-64px)]` + `flex-1
  overflow-auto` + `p-8` at all widths + the table card `shadow-sm`
  via the `cn`/tailwind-merge override).
- **VLM rounds:** 2 real fixes — the space-y/`-mb-2` overlap (above)
  and the reset placeholder (slate-600 → slate-400); both proven by
  computed-style probes before and after; the re-captured reset view
  compared ALIGNED.
- **Phase D:** full gate green (lint 0/0 · tsc · **189/189 unit** ·
  build · **26/26 e2e**, mobile-nav 6/6); DOM re-verified at
  1512/1024/768/700/390 (breakpoints exact: sidebar from 768, drawer
  below 768); zero 390px overflow on all nine routes; the contacts
  5px-short-calc quirk renders verbatim (main scrolls 5px like the
  reference).
- **Phase E:** 12 screenshots refreshed (login captured logged-out;
  the reset flow is e2e-verified); `.env.example` re-verified
  unchanged; docs realigned (README, AGENTS + the space-y hazard + the
  five session-11 contract blocks, CLAUDE, PAD, SKILL **v1.8.0**,
  `docs/session_15.md`, this addendum, repo worklog).
- **Dead-surface register (re-confirmed):** every reference Export
  button and the login Sign up link are platform artifacts (no request
  / toast / download) — mirrored as no-ops, documented in SKILL §16c.
