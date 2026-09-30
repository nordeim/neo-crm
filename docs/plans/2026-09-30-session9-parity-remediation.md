# Session 9 Remediation Plan — Component-Anatomy Parity + Tailwind v4 Shadow-Scale Bug (2026-09-30)

**Scope:** Fresh-login DOM audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `2c6eb3e`
(baseline gate green: lint 0/0 · tsc clean · 133/133 unit · dev server healthy
on :3000 with `db/custom.db` at the repo root; `.env` / `.env.example` /
`db/` / vitest + playwright configs all verified). The reference's demo data
is STILL zero (fifth consecutive session) — parity remains structural. All
page HTML was captured from both apps at **1512×945** (the 390px first pass
produced recharts tick-dropping artifacts that were disproven at desktop
width — e.g. the "pipeline stage vocabulary diff" was a false positive).
Sessions 1–8 covered data/API, visual details, dialogs, the layout system,
the app chrome, and the functional controls. This session's audit targeted
the layer below the layout contracts: **component anatomy** — buttons,
inputs, card titles, focus states, empty states, table cards — plus the
mobile-nav regression suite re-run (the user's standing concern), which
surfaced one **real Tailwind CSS v4 bug in our own build**.

**Method:** TDD — new contracts land in `src/lib/page-layout.ts` and a new
`tests/design-tokens.test.ts` with failing tests first; e2e assertions that
depend on the `h3` card titles are updated in the same commit as the tag
change. UI changes land with the full gate plus browser re-verification at
1512/1024/900/768/700/390. The `skills/` folder stays excluded from all
checking, testing and compilation.

**Baseline evidence:** full-page DOM captures at
`/home/z/my-project/s9-audit/{live,clone}-d1512/` (9 routes each) + computed
style probes; mobile sweeps at 390×844 (drawer open/navigate/Escape/resize,
zero horizontal overflow on all nine routes — the session-8 resize fix
re-verified intact).

---

## Identified Issues, Bugs and Gaps (all DOM-verified unless noted)

| # | Sev | Issue | Evidence (live DOM / reproduction) |
|---|-----|-------|-----------------------------------|
| S9-P0 | **High (Tailwind v4 bug)** | **`shadow-sm` compiles one scale-step too heavy.** Tailwind v4 renamed the shadow scale (`shadow-sm`→`shadow-xs`, `shadow`→`shadow-sm` — documented in `skills/avant-garde-design-v4/references/02-tailwind-v4-deep-dive.md`). The reference app ships the pre-rename scale: its `.shadow-sm` computes `0 1px 2px 0 rgb(0 0 0 / .05)` (tiny). Our v4.3.3 `.shadow-sm` computes `0 1px 3px 0 …, 0 1px 2px -1px …` (the renamed old `shadow`). Every `shadow-sm` surface (buttons, inputs, outline controls) renders one step heavier than the reference. Bare `shadow` (cards) is identical on both sides and must NOT change; `rounded-sm` is 4px on both (no radius issue). | generated-CSS extraction + computed probes on the outline Add button: live `0 1px 2px 0.05`, clone `0 1px 3px 0.1 + 0 1px 2px -1px 0.1` |
| S9-1 | High | **Button icon-text gap is 8px, reference is 16px.** Reference icons in text buttons carry `mr-2` (`w-4 h-4 mr-2`) in addition to the button's `gap-2` → measured 16px between icon and label. Ours rely on `gap-2` alone → 8px. Icon-only buttons (mail/bell `w-5 h-5`, ellipsis `w-4 h-4`) carry NO margin on either side ✓. | measured: live iconTextGap=16, clone=8; svg classes live `lucide-plus w-4 h-4 mr-2` vs clone `lucide-plus h-4 w-4` |
| S9-2 | High | **Dialog submit buttons are dark, not blue.** The reference's in-dialog primary submits (Create Lead, Create Account, Log Activity — and by pattern every entity dialog) are `bg-primary` where the reference `--primary` is the STOCK shadcn dark `rgb(23,23,23)` with `shadow` + `hover:bg-primary/90`. Ours render the app blue `rgb(37,99,235)`. Header primary buttons (New Lead/New Account/New Contact/New Event) ARE blue-600 on the reference and stay blue ✓. Same treatment the profile Save Changes + settings add buttons already received (session-8). | computed bg probes on three live dialogs vs clone |
| S9-3 | Med | **Card titles are `<div>`s on the reference, `<h3>` in our CardTitle.** The reference renders card titles as `div.font-semibold.tracking-tight.text-base.sm:text-lg` (no heading semantics on any card except activities' pinned h2s and the profile name h3). Affects dashboard/leads/reports/accounts/activities/profile cards. Two e2e assertions use `getByRole("heading")` for card titles and must move to text locators. | heading inventories: live h3s=[] on 8 of 9 routes; clone h3s = card titles |
| S9-4 | Med | **Settings header is the plain variant.** Reference: `<div class="mb-6"><h1 class="text-3xl font-bold …">Settings</h1><p class="text-gray-500 mt-1">…</p></div>` — no flex row (the page has no header buttons), h1 NOT responsive (`text-3xl` at all widths). Ours render the standard flex-row header with `text-2xl sm:text-3xl`. (Contacts' distinct header — `text-3xl` + `flex items-center justify-between mb-6` + `flex gap-3` — is already implemented correctly ✓.) | header extraction; settings h1 wrapper = plain `mb-6` inside `max-w-6xl mx-auto` |
| S9-5 | Med | **Leads header button group stacks below sm.** Reference group: `flex flex-col sm:flex-row gap-2 w-full sm:w-auto` and BOTH buttons carry `w-full sm:w-auto`. Ours: always-row group, no per-button stretch. | header HTML both sides |
| S9-6 | Med | **Activities quick-log group wraps.** Reference: `flex flex-wrap gap-2 w-full sm:w-auto`. Ours: no `flex-wrap` (4 buttons squeeze on narrow widths instead of wrapping). | header HTML both sides |
| S9-7 | Low | **Reports header button is unwrapped.** The reference's Saved Reports button is a DIRECT child of the header row (no `flex gap-2` group div). Ours wrap it. | header HTML both sides |
| S9-9 | Med | **Recent Deals table: 8 columns + empty tbody.** The reference renders EIGHT headers — `Lead, Company, Deal Value, Status, Owner, Close Date, Status, ''` — a DUPLICATE Status column (visible quirk). At zero rows it renders the headers with an EMPTY tbody (no empty-state paragraph). Ours render 7 columns and a "No deals match the current filters" paragraph. **Decision: mirror the duplicate column** (strict-mirror precedent: the "Add new industrie" typo, dead controls, empty-label selects) — reversing the prior session's "defect we do not copy" call, documented here and in the code comment. Row cells render the same stage badge twice (best-supported reading of the duplicated header; reference rows unverifiable at zero data). | th extraction (8 headers, `text-left py-2 font-medium` + trailing `w-8`); empty tbody probe |
| S9-10 | Med | **Empty-state anatomy differs on four surfaces.** (a) dashboard "No upcoming activities": live `text-sm text-gray-500 text-center py-4` (14px, py-4) vs ours `py-6 text-xs` (12px); (b) dashboard "Lead Sources" at zero: live renders an EMPTY `space-y-3` div — ours render a "No lead sources yet" paragraph; (c) calendar "No upcoming events"/"No events found": live `text-center text-gray-500 py-8` (16px inherited, py-8) vs ours `py-4 text-xs`; (d) reports tables: live renders IN-TABLE empty rows (`td text-center text-gray-500`, NO vertical padding) — ours render a paragraph OUTSIDE the table and the table disappears entirely. Activities' empty panel already matches ✓. | empty-state <p> inventory both sides; computed 16px on live calendar/activities |
| S9-11 | Med | **Reports table cards inset their tables.** Reference CardContent: `p-6 pt-0` (tables sit inside 24px gutters). Ours: `px-0 py-0` (tables flush to the card edges). | card child class extraction both sides |
| S9-12 | Med (mobile) | **Inputs are 16px below md on the reference.** The reference's stock Input base is `text-base md:text-sm` — page searches, settings picklist inputs, profile fields, dialog fields all render 16px text below 768px. Ours: `text-sm` (14px) at every width. Select triggers are `text-sm` on both ✓ (no change). | input class extraction + computed 14px@1512 on live dialog inputs (`md:text-sm` present) |
| S9-16 | Med | **Focus rings differ.** Reference inputs/buttons focus to `focus-visible:ring-1 focus-visible:ring-ring` where `--ring = 0 0% 3.9%` (near-black): 1px black ring, border color unchanged. Ours: `ring-2 ring-primary/20-40` (2px translucent blue) + `border-primary` on inputs. Verified computed on the focused leads search. | focus probes both sides |
| S9-17 | Med | **Top Performing Sales Reps is a div list, not a table.** Reference content: `div.space-y-4` > `div.flex.items-center.justify-between.text-xs.text-gray-500.pb-2.border-b` with `<span>Sales Rep</span>` + `div.flex.gap-8` [Deals, Owner] — and no rows at zero data. Ours render a real 3-column table. | card content HTML extraction |
| S9-8 | Med | **Profile card surface.** (a) name input placeholder: live "Enter your full name" vs ours "Your full name"; (b) Upload Photo: live outline default `h-9 px-4 py-2` + `w-full sm:w-auto` vs ours h-8 sm-variant; (c) Save Changes: live carries `w-full sm:w-auto`, ours doesn't; (d) avatar: live = Avatar primitive (`relative flex shrink-0 overflow-hidden rounded-full w-20 h-20 sm:w-24 sm:h-24`) wrapping `div.w-full.h-full.bg-blue-100.flex.items-center.justify-center` with a lucide-user `w-10 h-10 sm:w-12 sm:h-12 text-blue-600` at **stroke-width 2** — ours render a single span with the icon at strokeWidth 1.5; (e) name column wrapper `space-y-4 sm:space-y-6` + `p-6` on its own parent div (ours: `flex flex-col gap-4 sm:gap-6` + `p-6` on the name wrapper itself + `h-fit` on the card). | profile HTML both sides + avatar computed probes |

**Verified-aligned (no action):** shell (h-screen flex root, main sole
scroller, window never scrolls), topbar (static py-4, search
`pl-10 bg-gray-50 border-gray-200` computed-equal, mail/bell `w-5 h-5`,
user button `gap-1 sm:gap-2` + "Hi, name" text), sidebar, login (slate card,
`h-11 sm:h-12` inputs, slate-900 submit), contacts header (text-3xl variant
already correct), all page toolbars + combobox vocabularies, charts
(pipeline = Prospecting/Qualification/Proposal/Negotiation/Won at desktop,
revenue = 7-tick window incl. current month, legends, funnel
New/Qualified/Won/Lost), KPI cards, h1 computed color (`text-foreground` =
gray-900), entity tables (headers, stock density, accounts py-8 / contacts
py-12 empty rows), settings picklists + tabs + computed-dark add buttons,
greeting text, mobile drawer (burger + 8 links + dual locks + Escape +
route-change close + 700→800 resize unlock — session-8 fix intact), zero
horizontal overflow at 390 on all nine routes, `rounded-sm` = 4px both
sides, all page subtitles.

**Quirk-register updates:** the Recent Deals duplicate Status column
(mirrored); reports empty rows carry no vertical padding; the Top Reps
header shows two right-aligned columns (Deals/Owner) in a `flex gap-8` —
the "Owner" column header is a misnomer (it renders the owner avatar, not a
labelled column).

---

## Remediation ToDo (TDD)

### Phase A — contracts, red first
- [x] **A1** New `tests/design-tokens.test.ts`: parse `src/app/globals.css`
      and pin `--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)` (the S9-P0 pin —
      the reference's computed shadow-sm) and the new `--color-ring` token
      (`#0a0a0a`, the reference's `--ring` 0 0% 3.9%).
- [x] **A2** Extend `tests/page-layout.test.ts` with failing pins:
      - `PAGE_HEADER.settings` (plain `mb-6` row, `text-3xl` title,
        `text-muted mt-1` subtitle, no actions wrapper).
      - `PAGE_HEADER.leads.actions` = `flex flex-col sm:flex-row gap-2
        w-full sm:w-auto` + `PAGE_HEADER.leads.buttonStretch` =
        `w-full sm:w-auto`.
      - `PAGE_HEADER.activities` with `actions` = `flex flex-wrap gap-2
        w-full sm:w-auto`.
      - `BUTTON_BASE` record: `iconGap` = `[&_svg]:mr-2
        [&_svg:only-child]:mr-0`, `focusRing` = `focus-visible:ring-1
        focus-visible:ring-ring` (S9-1, S9-16).
      - `INPUT_BASE` record: `text-base md:text-sm` + ring-1 focus (S9-12,
        S9-16).
      - `DIALOG_SUBMIT` record: dark `bg-neutral-900 hover:bg-neutral-800
        text-neutral-50 shadow` (S9-2 — same family as the session-8
        settings/profile treatment).
      - `CARD.title` classes `font-semibold tracking-tight text-base
        sm:text-lg` (tag change documented in the record comment).
      - `RECENT_DEALS.headers` = 8 entries incl. the duplicate Status
        (quirk) + `emptyTbody: true`.
      - `EMPTY_STATE` record: dashboard `py-4 text-center text-sm
        text-muted`, calendar/activities `text-center py-8 text-muted`,
        reports in-table `text-center text-muted` (no py), leadSources
        renders an empty container (no paragraph).
      - `TOP_REPS.headerRow` + `TOP_REPS.colRight` (`flex gap-8`).
      - `REPORTS_TABLE_CARD.content` = `p-6 pt-0`.
      - `PROFILE_LAYOUT`: `uploadBtn` (outline default + `w-full
        sm:w-auto`), `saveBtn` stretch, `avatarIcon` stroke 2 +
        `w-10 h-10 sm:h-12 sm:w-12`, `nameWrap` (no p-6 — parent carries
        it), `columnWrap` = `space-y-4 sm:space-y-6`, `card` without
        `h-fit`, `namePlaceholder` = "Enter your full name".

### Phase B — e2e dependencies (same commit as the tag change)
- [x] **B1** `tests/e2e/crm.spec.ts`: card-title `getByRole("heading")`
      assertions → `getByText`/locator equivalents (h3→div fallout); sweep
      all specs for heading-role assertions that target CardTitles.

### Phase C — implementation to green
- [x] **C1** `globals.css`: `--shadow-sm` re-pin + `--color-ring` token
      (S9-P0, S9-16).
- [x] **C2** `button.tsx`: base += `[&_svg]:mr-2 [&_svg:only-child]:mr-0`
      + ring-1 focus ring (S9-1, S9-16).
- [x] **C3** `input.tsx` + `textarea`: `text-base md:text-sm`, ring-1
      ring-ring focus, drop `focus-visible:border-primary` (S9-12, S9-16).
      Login inputs stay on LOGIN_LAYOUT (slate-pinned, unchanged).
- [x] **C4** `card.tsx`: CardTitle h3 → div, drop `text-foreground`
      (computed-equal inherit) (S9-3).
- [x] **C5** `entity-dialogs.tsx`: all five submit buttons →
      `DIALOG_SUBMIT` (S9-2).
- [x] **C6** Settings page: plain header variant (S9-4).
- [x] **C7** Leads page: header group + per-button `w-full sm:auto` (S9-5).
- [x] **C8** Activities page: `flex-wrap` group (S9-6).
- [x] **C9** Reports page: unwrapped Saved Reports button (S9-7); table
      cards `p-6 pt-0` (S9-11); in-table empty rows without py (S9-10d).
- [x] **C10** Dashboard: Recent Deals 8-column mirror + empty tbody
      (S9-9); empty-state fixes (S9-10a/b); Top Reps div-header list
      (S9-17).
- [x] **C11** Calendar: empty states → `text-center py-8 text-muted`
      (S9-10c).
- [x] **C12** Profile: placeholder + button sizes/stretch + avatar
      structure/stroke + wrappers (S9-8).

### Phase D — verification
- [x] **D1** Full gate: lint 0/0 · tsc · unit (133 + new pins) · build ·
      e2e (22; mobile-nav 6/6 must stay green).
- [x] **D2** DOM re-verification at 1512/1024/900/768/700/390: icon gap
      16px, computed `shadow-sm` = `0 1px 2px 0.05`, dark dialog submits,
      settings header, leads stacking, activities wrap, 8-column Recent
      Deals, reports inset tables, profile surface, drawer regression +
      390 overflow sweep.
- [x] **D3** VLM spot-comparison on the restructured surfaces (dashboard,
      reports, profile, settings).

### Phase E — deliverables
- [x] **E1** Refresh `docs/screenshots/` (12 captures).
- [x] **E2** `.env.example` re-verified (unchanged contract).
- [x] **E3** Docs realignment: README, AGENTS, CLAUDE,
      Project_Architecture_Document, `neo-crm_SKILL.md` (v1.6.0), this
      plan's addendum, `docs/session_11.md` (session-9 completion log),
      repo worklog, quirk-register updates.
- [ ] **E4** Commit on main + SSH-wrapper push.

---

## Execution notes

- **Why the shadow fix is a token, not a find/replace:** re-pinning
  `--shadow-sm` in `@theme` corrects every existing `shadow-sm` class in
  one line and documents the v4-rename hazard where it lives. Rewriting
  class strings to `shadow-xs` would touch dozens of files and break the
  class-level parity with the reference (which literally ships
  `shadow-sm` in its DOM).
- **The duplicate Status column reversal:** session-8's code comment
  called it "a defect we do not copy", but the project's strict-mirror
  precedent (the "Add new industrie" typo, dead mail/bell, the empty-label
  switcher) treats VISIBLE reference quirks as parity surface. The
  8-vs-7 header diff is visible; mirroring it removes a standing DOM diff.
  The cells render the same badge twice — the best-supported reading of a
  duplicated header, and functionally inert.
- **Focus-ring alignment scope:** Button/Input/Textarea get the ring-1
  near-black treatment; the login card keeps its slate-pinned focus
  (LOGIN_LAYOUT is separately pinned and the reference's login inputs use
  slate-400 rings); the leads popover + settings picklist inputs inherit
  from Input.
- **CardTitle → div is an a11y trade-off accepted for parity** (the
  reference has no card-heading semantics; activities' h2 titles and the
  profile name h3 are separately pinned and stay). The e2e heading
  assertions move to text locators in the same commit — B1 runs before C4
  lands so the suite never breaks at an intermediate commit.
- **The mobile-nav suite must stay 6/6** — no drawer code is touched this
  session; the D2 re-run guards the standing regression.


## Addendum — execution record (same session)

All phases executed with the full gate green at every checkpoint:

- **Phase A:** `tests/design-tokens.test.ts` (3 checks — parses
  globals.css for the `--shadow-sm` re-pin and the `--color-ring` token)
  plus a 12-check session-9 block in `tests/page-layout.test.ts` — RED
  confirmed first (14 failing), then **148/148** after the contracts
  landed.
- **Phase B:** the four dashboard card-title heading assertions in
  `crm.spec.ts` moved to text locators (h3→div fallout); every other
  heading assertion targets real h1/h2/h3 elements (the calendar rail
  cards kept their literal h3s — verified on the live reference — and were
  restructured to `Card p-6` + literal h3, matching the reference's
  no-header/content-split rail cards).
- **Phase C:** all twelve items implemented via the pinned contracts.
  Two VLM-driven refinements (both re-verified on the live DOM): the
  profile Save Changes is ENABLED at rest on the reference (our
  disabled-at-unchanged rendered gray at 50% opacity) and the Role input
  carries the raw lowercase `user` value; the role badge also moved
  span→div (the reference renders the stock Badge as a div).
- **Phase D:** full gate green (lint 0/0 · tsc · **148/148 unit** · build
  clean · **22/22 e2e**, mobile-nav 6/6 incl. the resize lock-release);
  DOM re-verification at 1512/1024/900/768/700/390 + zero overflow at 390
  on all nine routes + the drawer regression; five VLM page comparisons —
  all residuals were zero-data artifacts, profile round-2 **ALIGNED**.
- **Phase E:** 12 screenshots refreshed (login captured logged-out);
  `.env.example` re-verified unchanged; docs realigned (README, AGENTS,
  CLAUDE, PAD, `neo-crm_SKILL.md` v1.6.0, `docs/session_11.md`, repo
  worklog, quirk-register additions: the duplicate Status column, the
  reports no-py empty rows, the Top Reps flex gap-8 header, the lowercase
  role input).
- **Decision reversal recorded:** session-5 had documented the Recent
  Deals duplicate "Status" column as "a defect we do not copy"; session-9
  mirrors it instead (strict-mirror precedent: the "Add new industrie"
  typo, dead controls, empty-label selects). The code comment and quirk
  register were updated accordingly.
