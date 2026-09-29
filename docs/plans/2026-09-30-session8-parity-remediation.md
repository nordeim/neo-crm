# Session 8 Remediation Plan — Functional-Layer Parity + Mobile-Nav Lock Bug (2026-09-30)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `667bd3e`
(baseline gate green: lint 0/0 · tsc clean · 112/112 unit · dev server healthy
on :3000 with `db/custom.db` at the repo root). The reference's demo data is
STILL reset to zero (Total Leads: 0, `$0.0k` everywhere) — the fourth
consecutive zero-data session — so parity remains structural. Sessions 1–7
covered data/API, visual details, interactive dialogs, the page layout system,
and the app chrome/identity layer. This session's audit targeted the layer
those sessions could not verify at zero data — the **functional controls that
surround the tables** (view switchers, filter popovers, toolbar anatomy) —
plus a re-test of the mobile navigation at every breakpoint, which surfaced a
**real bug in our own drawer** left behind by session-7's `lg → md` migration.

**Method:** TDD — new layout contracts land in `src/lib/page-layout.ts` with
failing unit tests first; the drawer fix lands with a Playwright resize
regression test that fails before and passes after. UI changes land with the
full gate plus browser re-verification at 1512/1024/900/768/700/390. The
`skills/` folder stays excluded from all checking, testing and compilation.

**Baseline evidence:** DOM extraction transcripts in this session log; live
auth state saved at `/home/z/my-project/live-auth-s8.json`; VLM
spot-comparisons for dashboard/accounts/contacts/leads/calendar/activities/
reports/settings/profile/login (data-shape differences excluded as zero-data
artifacts; two VLM false-positives — leads bottom charts, contacts Priority
column — were disproven by DOM queries).

---

## Identified Issues, Bugs and Gaps (all DOM-verified unless noted)

| # | Sev | Issue | Evidence (live DOM / reproduction) |
|---|-----|-------|-----------------------------------|
| S8-P1 | **High (bug)** | **Mobile-nav auto-close listens at the wrong breakpoint.** `mobile-nav.tsx` still closes the drawer via `matchMedia("(min-width: 1024px)")`, but session-7 moved the drawer + trigger to `md:hidden` (768px). Reproduced on the dev server: open the drawer at 390px (body + `main` scroll-locked), resize to 800px → the drawer hides (`md:hidden`) but **both scroll locks stay engaged** — the app is unscrollable until a route change. Classic "Class B: Display Mismatch" (mobile-nav debugging taxonomy: asymmetrical breakpoint classes). | dev-server reproduction: `{atWidth:800, drawerVisible:false, bodyStillLocked:true, mainStillLocked:true}` |
| S8-1 | High | **Dashboard primary Export lost its label.** The reference's third header button is `bg-blue-600 hover:bg-blue-700 h-8 rounded-md px-3 text-xs` with a Download `w-4 h-4 mr-2` icon and a **bare always-visible "Export" text node** (NOT wrapped in `hidden sm:inline`). Ours renders icon-only with `aria-label`. (Reference regression since session 7 — session-6 pinned "icon-only dashboard Export".) | header extraction 2026-09-30 |
| S8-2 | High | **Dashboard filter-bar middle select misread as an owner filter.** The reference renders THREE comboboxes between the Filter button and the search: "All Stages", an **EMPTY one**, "All Sources". Opening the empty one reveals it is a **Table/Cards view-switcher** (dead on the reference — picking "Cards" changes nothing, the label stays empty). Our clone renders it as a functional "All Owners" select — a session-2 misinterpretation. Replace with the reference's view-switcher: empty default label, Table/Cards options, made functional for the Recent Deals section (table ↔ compact cards) per the project's functional-superset pattern. | combobox DOM + option extraction + dead-control test |
| S8-3 | High | **Accounts table toolbar is missing three controls.** The reference's toolbar row is `[Table select] [empty select] [More outline h-8] [search flex-1] [Export CSV outline h-8]`. The first select = Table/Cards view-switcher (dead on the reference), the second = Standard/Detailed density select (renders with an empty label, dead), "More" = outline h-8 dead button. Our clone has only `[search] [Export CSV]`. | toolbar extraction + option extraction (Table→[Table, Cards]; empty→[Standard, Detailed]) |
| S8-4 | Med | **Leads search icon one size small.** Reference: `lucide-search w-5 h-5` + `pl-10 h-9` input (same anatomy as contacts). Ours: `h-4 w-4` icon + `pl-9`. | toolbar extraction |
| S8-5 | High | **Leads Filters is a popover, not an expander.** The reference's Filters button is `aria-haspopup="dialog"` (Radix Popover) — outline h-9 `w-full sm:w-auto`, Filter icon `w-4 h-4 mr-2`, text "Filters", **no chevron**. Content: `w-80 p-4` with `space-y-4` — Status select [All Status / New / Contacted / Qualified / Won / Lost], Source select [All Sources / Call / Email / Website / Partner / **Referral**], Min Deal Value (`input[type=number] h-9`, placeholder "0"), Follow-up Date (`input[type=date] h-9`), footer `flex gap-2 pt-2`: Clear (outline h-9 `flex-1`, X icon `w-4 h-4 mr-2`) + Save View (outline h-9 `flex-1`, Save icon `w-4 h-4 mr-2`). Ours renders a chevron expander with a different field set (Stage/Owner/Source/Value Range/Follow-up inline). | popover DOM + per-select option extraction |
| S8-6 | Med | **Log WhatsApp is a solid emerald button.** Reference: `bg-emerald-600 hover:bg-emerald-700 text-primary-foreground shadow h-8 rounded-md px-3 text-xs`. Ours: ghost. (Reference regression since session 6/7 — the session-6 pin recorded "plain GHOST".) | quick-log extraction (all four buttons) |
| S8-7 | Med | **Settings picklist add buttons are dark, not blue.** The reference's "+" buttons are `bg-primary` where the reference's `--primary` token is the STOCK shadcn `0 0% 9%` — computed `rgb(23,23,23)`. Our `bg-primary` resolves to blue-600. Same neutral-900 treatment as the profile Save Changes button (which we already pinned correctly). | computed-color probe rgb(23,23,23) + token readout |
| S8-8 | Low | **Login inner padding md: variant missing.** Reference: `p-8 sm:p-10 md:pt-12 md:pb-10 md:px-10`. Ours stops at `p-8 sm:p-10` (flat 40px at md — top padding 8px short). | login card extraction |

**Verified-aligned (no action):** topbar (static py-4, search hidden <sm, mail/bell
h-9 w-9, rectangular user button, plain menu), sidebar (hidden md:flex w-64,
p-6 brand, px-4 py-3 links, footer group), calendar header (search +
subtitle-sm + outline nav buttons), reports bar (Saved Reports + Reset +
h-8 icon buttons + leading-icon selects), activities rail (More Filters (1)),
accounts rail, contacts toolbar (max-w-md search + Filters button), page
subtitles (accounts/activities none; contacts/leads 16px; calendar/reports
sm; settings 16px), profile Save Changes (neutral-900 = rgb(23,23,23) ✓),
dashboard filter search placeholder "Stage: Source", More... ghost button,
view-switcher dead status on the reference (Table select on accounts: picking
"Cards" leaves the table), 767/768 boundary exact, zero horizontal overflow at
390 on all nine routes, e2e mobile suite domain.

**Reference quirks deliberately mirrored, not fixed** (additions to the
quirk register): the dead **Standard/Detailed** select (accounts toolbar)
and the dead **More** button (accounts toolbar) render as inert affordances —
same treatment as the dead mail/bell buttons. The **Table/Cards** switchers
are dead on the reference but get a functional superset in our clone (the
project's established pattern: reports Reset, calendar search).

---

## Remediation ToDo (TDD)

### Phase A — layout contracts, red first
- [x] **A1** Extend `tests/page-layout.test.ts` with failing pins:
      - `MOBILE_NAV_LAYOUT.autoCloseQuery === "(min-width: 768px)"` (and a
        guard assertion that it does NOT contain 1024) — the S8-P1 pin.
      - `DASHBOARD_HEADER.primaryExport` (always-visible label contract).
      - `FILTER_BAR` middle-select slot replaced by a
        `VIEW_SWITCHER` record (trigger `w-full sm:w-32`, empty placeholder,
        options Table/Cards).
      - `TABLE_CARD.toolbarWithSwitchers` for accounts ([Table select][density
        select][More button] + search + Export CSV, `flex flex-col sm:flex-row
        gap-3`).
      - `LEADS_TOOLBAR.searchIcon` w-5 + `pl-10`.
      - `LEADS_FILTERS_POPOVER` record (trigger, content w-80, field labels
        `text-sm font-medium mb-2 block`, selects h-9 w-full, number input,
        date input, footer `flex gap-2 pt-2`, Clear/Save View outline h-9
        flex-1 icons mr-2).
      - `ACTIVITY_QUICKLOG.whatsapp` solid emerald contract.
      - `SETTINGS_PICKLIST.addButton` dark-neutral contract.
      - `LOGIN_LAYOUT.inner` md: padding variant.
- [x] **A2** Implement to green in `src/lib/page-layout.ts`.

### Phase B — the drawer bug (S8-P1)
- [x] **B1** Playwright regression FIRST (red): extend
      `tests/e2e/mobile-navigation.spec.ts` — open the drawer at 390px,
      assert locks engaged, `page.setViewportSize(800×844)`, assert the
      drawer closed AND `main` scrollable (overflow not hidden) AND body
      unlocked. Fails before the fix, passes after.
- [x] **B2** `mobile-nav.tsx`: consume `MOBILE_NAV_LAYOUT.autoCloseQuery`
      (768px) instead of the hardcoded 1024px literal.

### Phase C — dashboard (S8-1, S8-2)
- [x] **C1** Primary Export button: bare always-visible "Export" text node
      (keep the distinct one-click leads-export behavior; drop the
      icon-only + aria-label form).
- [x] **C2** Replace the All Owners select with the reference's view-switcher
      (empty default label, Table/Cards). Functional superset: switching to
      "Cards" renders the Recent Deals section as a compact card list;
      "Table" restores the compact table. Remove the owner filter state
      (never on the reference).

### Phase D — accounts toolbar (S8-3)
- [x] **D1** Add `[Table select] [density select] [More button]` before the
      search. Table/Cards switcher functional (Cards = the mobile card-list
      pattern rendered at all widths). Density select (Standard/Detailed)
      and More button render as dead mirrors (empty label preserved on the
      density select — it is a documented reference defect).

### Phase E — leads (S8-4, S8-5)
- [x] **E1** Search anatomy: `w-5 h-5` icon + `pl-10` input.
- [x] **E2** Filters popover on the existing Dropdown (Radix Popover)
      primitive: `align="start"` w-80 content, Status/Source/Min Deal
      Value/Follow-up Date fields, Clear + Save View footer. Functional
      superset: the four filters apply live; Clear resets them; Save View
      persists the current set to localStorage (restored on next visit,
      confirmation toast). Replace the inline expander + its Stage/Owner
      filters. Source vocabulary: Call/Email/Website/Partner/Referral
      (popover-specific, 5 options — differs from the 4-option create
      dialog; both DOM-pinned).

### Phase F — activities (S8-6)
- [x] **F1** Log WhatsApp: solid `bg-emerald-600 hover:bg-emerald-700
      text-white shadow` h-8 (keep the other three outline).

### Phase G — settings (S8-7)
- [x] **G1** Picklist add buttons: dark `bg-neutral-900 hover:bg-neutral-800
      text-neutral-50` (matches computed rgb(23,23,23); same family as the
      profile Save Changes button).

### Phase H — login (S8-8)
- [x] **H1** `LOGIN_LAYOUT.inner` + login/signup wrappers: add
      `md:pt-12 md:pb-10 md:px-10`.

### Phase L — verification
- [x] **L1** Full gate: lint 0/0 · tsc · unit (112 + new pins) · build ·
      e2e (21 + resize regression; mobile-nav 5/5 + 1).
- [x] **L2** DOM re-verification on the dev server at 1512/1024/900/768/
      700/390: the three toolbars, the popover, the drawer lock release
      across the resize, zero horizontal overflow at 390 on all routes.
- [x] **L3** VLM spot-comparison on the restructured surfaces (dashboard,
      accounts, leads).

### Phase M — deliverables
- [x] **M1** Refresh `docs/screenshots/` (12 captures).
- [x] **M2** `.env.example` re-verified against the codebase (DATABASE_URL
      `file:../db/custom.db` contract, db/ at repo root — verified this
      session).
- [x] **M3** Docs realignment: AGENTS.md, CLAUDE.md, README.md,
      Project_Architecture_Document.md, `neo-crm_SKILL.md` (v1.5.0),
      `docs/session_8.md` session log, `worklog.md`, quirk-register
      additions.
- [x] **M4** Commit on main + SSH-wrapper push.

---

## Execution notes

- **Why the resize regression is an e2e test, not a unit test:** the bug is
  the interaction between a CSS breakpoint (`md:hidden`) and a JS media
  listener — only a real browser resize crossing 768px exercises it. The
  unit layer pins the shared constant instead (Phase A1).
- **Save View honesty:** the reference's Save View is inert. Our functional
  superset persists the filter set to localStorage and restores it on the
  next visit — a real, testable behavior (pinned by a unit test on the
  pure persist/restore seam in `src/lib/`), not a stub toast.
- **Owner filter removal (C2):** the dashboard never had an owner filter on
  the reference; ours was a misinterpretation of the empty view-switcher.
  Removing it also removes a client-side filter the e2e suite never asserts.
- **The `More` button and density select stay dead** — mirroring dead
  affordances is the established pattern (mail/bell). Functional supersets
  are reserved for controls with obvious semantics (view switching,
  filtering, reset).


## Addendum — execution record (same session)

All phases executed with the full gate green at every checkpoint:

- **Phase A:** 21 new pins across `tests/page-layout.test.ts` (session-8
  block: mobile-nav breakpoint contract, dashboard Export label, view
  switcher, accounts toolbar, leads search + popover anatomy + option
  vocabularies, Log WhatsApp, settings add button) and a new
  `tests/lead-filters.test.ts` suite (encode/decode round-trips, malformed
  payloads, vocabulary guards, storage key) — **133/133 unit**.
- **Phase B:** the e2e resize regression (open drawer at 700px → grow to
  800px → assert closed + both locks released + sidebar visible) was
  written BEFORE the fix and reproduced the bug exactly; after switching
  `mobile-nav.tsx` to `MOBILE_NAV_LAYOUT.autoCloseQuery` (768px) it passes
  — and the same scenario was re-verified live on the dev server.
- **Phases C–G:** implemented as planned. Two additional mid-verification
  refinements from VLM spot-comparison round 2 (both DOM-verified on the
  live reference): the accounts toolbar Export CSV is TEXT-ONLY (no icon,
  bare always-visible label — the header Export CSV keeps its icon) and the
  accounts view-switcher DEFAULTS to "Table" (the reference's trigger
  displays "Table", unlike the dashboard's empty middle select). The leads
  Filters button moved to its OWN row below the search (the reference
  stacks the two rows inside the `p-4 border-b space-y-4` toolbar).
- **Functional supersets delivered:** both Table/Cards view switchers work
  (dashboard Recent Deals ↔ card grid; accounts table ↔ card grid at all
  widths), the leads Filters popover filters for real (Status/Source/Min
  Deal Value/Follow-up Date), Clear resets, and Save View persists to
  localStorage via the `@/lib/lead-filters` pure seam and restores on the
  next visit (verified: filter Won → save → navigate away → back → 7 won
  rows restored). The reference's controls are all inert.
- **Dead mirrors kept (quirk register additions):** the accounts toolbar
  Standard/Detailed density select (empty label) and the More button.
- **Verification:** dev-server DOM re-verification at 1512/1024/900/768/
  700/390 (sidebar from 768, burger below, zero horizontal overflow on all
  nine routes at 390); drawer open → 8 links → locks → Escape → unlock;
  the resize scenario; two VLM comparison rounds on the restructured
  surfaces (dashboard, accounts, leads) — round-2 residual findings were
  all zero-data artifacts, two round-1 items disproven by DOM probes
  (sidebar active bg and table-header heights are identical).
- **Final gate:** lint 0/0 · tsc clean · **133/133 unit** · build clean ·
  **22/22 e2e** (mobile-nav 6/6 including the new resize regression).
- **Deliverables:** 12 screenshots refreshed; `.env.example` re-verified;
  docs realigned (README, AGENTS, CLAUDE, PAD, `neo-crm_SKILL.md` v1.5.0,
  session log, worklog).