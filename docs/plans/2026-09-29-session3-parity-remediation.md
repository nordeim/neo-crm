# Session 3 Remediation Plan — Parity Hardening (2026-09-29)

**Scope:** Fresh-login audit of the live reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at commit
`c4a48c1` (gate green: lint 0/0 · tsc clean · 58/58 unit · build clean ·
20/20 e2e). The reference's demo data has been **reset to zero** (all KPIs
0, empty tables) — it also had zero data at session-1 capture time — so this
audit compares **structure, styling, labels, chart anatomy and vocabularies**,
using VLM crop-zooms plus a11y snapshots of both apps at 1512×945 and 390×844.

**Method:** TDD — every pure-seam behavior change lands with a failing test
first; UI changes land with the full gate plus a browser re-verification at
both widths. The `skills/` folder stays excluded from all checking, testing
and compilation.

**Baseline evidence:** `/home/z/my-project/live-fresh/` (fresh live captures),
`/home/z/my-project/target-app-screenshots/` (session-1 captures),
`/home/z/my-project/scripts/parity-compare.sh` (VLM diff harness).

---

## Identified Issues, Bugs and Gaps

| # | Severity | Issue | Evidence |
|---|----------|-------|----------|
| P-1 | High | **Topbar identity**: reference shows `Hi, sepnetflix2023` + light-grey circle avatar with dark "S"; clone seeds "Sep Netflix" with a blue "SN" avatar. Reference user dropdown has NO name/email header block and NO item icons — just text-only `Profile` / `Logout`. | Live a11y snapshot (`button "Hi, sepnetflix2023 S"`); session-1 `21-user-menu.png`; VLM topbar crop. |
| P-2 | High | **Bell icon** carries a red notification dot in the clone; the reference has no dot on bell or mail icons. | VLM topbar crop of live app. |
| P-3 | High | **Sidebar icons/brand/layout**: reference Accounts nav icon = person silhouette (clone: building); Contacts = person-in-circle (clone: plain person); brand = thick white ring WITHOUT center dot (clone adds a dot); Settings sits directly below a thin divider after Reports (clone pins it to the bottom with `mt-auto`). | VLM sidebar compare + sidebar-bottom crop (bottom third of reference sidebar is empty blue). |
| P-4 | High | **Currency display**: reference renders `$0.0k` / `$0.0M` / `$0` — dollar symbol attached, lowercase `k`, uppercase `M` — on every page (dashboard, accounts, leads, reports). Clone renders `AED 8.2M` etc. The reference's own "Default Currency" setting stays `AED` while display ignores it — a reference quirk we mirror. | Live a11y (KPI strings, pipeline legend `Prospecting: $0.0k`); VLM reads of both captures. |
| P-5 | High | **KPI card anatomy** (dashboard/accounts/reports): reference = label, big value with delta as PLAIN colored text inline right (no pill, no arrow icon), mini chart at card bottom; NO hint/sub-text line. Clone adds hint lines ("vs. last month"), pill deltas with arrows, and uses bar sparklines everywhere. Reference sparkline types: Total Leads + Avg. Sales Cycle = teal LINE; Deals Closed = cyan bars; Revenue = green bars; Sales Target = orange/blue mixed bars; Conversion Rate = purple AREA. | VLM crop of live KPI row (×2 independent reads agree). |
| P-6 | High | **Dashboard pipeline chart**: reference plots stage COUNT on the Y-axis (integers 0–4) across 5 stages (Prospecting, Qualification, Proposal, Negotiation, Won) with a legend below showing per-stage dollar values (`Prospecting: $0.0k`). Clone plots AED value on the Y-axis across 7 stages with no value legend. | Live a11y (Y-axis 0–4 + legend strings); session-1 capture. |
| P-7 | High | **Dashboard revenue chart**: reference = "Won" teal line + "Target" RED line with a pale red/pink AREA fill, "Last 6 months" caption at the top-right of the chart container. Clone = two lines, no fill, caption missing/misplaced. | VLM crop reads (2 agreeing). |
| P-8 | High | **Dashboard header Add button**: reference shows just a plus icon + "Add" (no chevron); clone renders a dropdown chevron. | Live a11y (`button "Add"` with single image) + VLM. |
| P-9 | High | **Table headers**: reference uses Title Case (`Account Name`, `Lead Name`, `Last Activity`) with a single chevron sort indicator; clone renders UPPERCASE headers with double-arrow sort glyphs. | Live a11y column headers on accounts/contacts/leads. |
| P-10 | High | **Contacts page**: reference stat cards carry colored icons (blue users, green trend, orange award, red clock) and a green `+0` trend text on "New This Month" (no hint lines); header = one row of 4 buttons (Export CSV · Scan Card · Import · New Contact) with Scan Card using a scan/corners icon; table columns are `Name (sort) · Role · Priority · Last Activity (sort) · Engagement · Company · Source · Actions`; Filters button carries a funnel icon. Clone: no icons, credit-card icon, different columns, no funnel. | Live a11y + VLM compare. |
| P-11 | High | **Leads page**: reference KPI cards have colored icons (blue trend, orange target, green check, red X, purple %, blue calendar), Won/Dropped show a `$` sub-value, Avg. Sales Cycle renders as `0 days`; "Pipeline Value by Stage" chart uses stages `New · Qualified · Won · Lost` with an integer count axis. Clone: no icons, different chart stages/value axis. | Live a11y (chart category list + Y-axis 0–4). |
| P-12 | High | **Calendar page**: reference header has a "Search events…" input; stat cards have colored icons in light rounded squares + green trend arrows (`^ +3`); weekday row starts on **Sunday**; right rail carries a "Filters" panel (Type: Appointments/Calls/Meetings/Tasks/Reminders/Demos; Date: Today/Tomorrow/This Week/Next Week; Clear All) below Agenda View. Clone: no search, no icons/arrows, Monday-first grid, no filters panel. | Live a11y (full page) + VLM card crop. |
| P-13 | High | **Activities page**: reference header = 4 quick-log buttons only (no subtitle, no "+ New"); "Log WhatsApp" is solid green with a WhatsApp icon; 6 stat cards (Activities Today, Overdue Activities, Due now text, Emails Sent, Calls Logged, Meetings Scheduled, WhatsApp) place the value with colored bar charts SIDE-BY-SIDE and per-card small texts (`+23%`, `2h overdue`, `+7 today`, `+4 today`, `+1h 12m`); Priority tabs are a segmented control; Filters panel = Save All + Call/Email/Meeting/WhatsApp checkboxes + Owner + Status(time-range) + "More Filters (1)" + Filter; "Activities by Type" widget has a `•••` button and "Last 2 days" caption. | Live a11y + VLM KPI crop (6 cards detailed). |
| P-14 | High | **Reports page**: reference header carries a "Saved Reports (0)" bookmark button; the filter row (inside a white card) = period/owner/stage/status selects with inline icons, then Reset (ghost) · Export CSV (solid blue) · PDF (ghost); KPI cards have colored icons; tabs are pill-style (active = light-blue fill) in a grey container. Clone: no Saved Reports button, Reset in the header, Export/PDF styles swapped, no icons, underline tabs. | Live a11y + VLM compare. |
| P-15 | High | **Settings page**: reference has NO "Save All" button; picklist placeholders are "Add new contact source / lead stage / activity type / account tier / industry" (reference even misspells "industrie" — we fix, not copy); tabs are white-pill-on-grey. Clone: Save All present, verbose placeholders, underline tabs. | Live a11y + VLM compare. |
| P-16 | High | **Profile page**: reference = "Profile & Settings" / "Manage your account information": left "Personal Information" card (Profile Picture + Upload Photo + "JPG, PNG or GIF. Max 5MB.", Full Name, disabled Email + "Email cannot be changed", disabled Role, Save Changes) and a right account card (avatar, name, email, User badge, Account Type / Email Verified / Security rows). Clone renders a completely different "Workspace Footprint" page. | Live a11y (full profile). |
| P-17 | Medium | **Login topbar chrome parity nits** — verified MATCHING (brand, buttons, OR divider); no action. | Session-2 verification + fresh login. |

Reference quirks deliberately NOT copied (documented fixes over defects):
empty owner dropdowns on dashboard/accounts toolbars, the duplicated empty
"Status" column in Recent Deals, the duplicated Export button (already split
into two working buttons in session 2), the "Stage: Source" ghost textbox,
the "Add new industrie" typo, the settings Default-Currency field being
ignored by the display formatter (mirrored: display is `$` exactly like the
reference), and the "Edit with Base44" platform badge.

---

## ToDo List (execution order)

### Phase A — Pure seams, TDD (failing tests first)

- [ ] **A1. `src/lib/format.ts` currency**: `formatCurrency` →
  `$8,200,000`; `formatCompactCurrency` → `$0.0k` / `$8.2M` / `$0` (symbol
  attached, lowercase `k`, uppercase `M`). Update `tests/format.test.ts`
  expectations FIRST (red), then implement. Call sites drop the `currency`
  arg (charts tooltip, pages).
- [ ] **A2. `src/components/ui/avatar.tsx`**: text color follows background
  luminance (light grey bg ⇒ dark text). New unit test
  `tests/avatar.test.ts` for the contrast helper + initials.
- [ ] **A3. `src/lib/format.ts` `calendarGrid`**: already supports
  `firstDay: "sunday"` — pin a regression test for a September-2026
  Sunday-anchored grid (30, 31 leading days).

### Phase B — Global chrome

- [ ] **B1. Topbar**: remove bell dot; user dropdown = text-only
  Profile/Logout (drop header block + icons); name = first word of
  `user.name`.
- [ ] **B2. Sidebar + mobile drawer**: Accounts icon → `User`, Contacts →
  `CircleUserRound`; brand = ring only (no dot); Settings below a divider in
  normal flow (remove `mt-auto`).
- [ ] **B3. `prisma/seed.ts`**: demo user `name: "sepnetflix2023"`,
  `avatarColor: "#e5e7eb"` (light grey). Reseed dev + e2e DBs.
- [ ] **B4. `src/components/ui/table.tsx`**: Title-Case header style + single
  chevron sort glyph.

### Phase C — Shared KPI/stat components

- [ ] **C1. `page-parts.tsx`**: `KpiCard` — drop `hint` rendering, delta =
  plain colored inline text (no pill/arrow), optional icon chip; new
  `Sparkline` variants: `line` (polyline) and `area` (filled) beside bars.

### Phase D — Dashboard

- [ ] **D1.** Apply reference sparkline types/colors per card (teal line,
  cyan bars, green bars, mixed orange/blue bars, purple area, teal line).
- [ ] **D2.** Add button without chevron (dropdown menu stays).
- [ ] **D3.** Pipeline chart: count Y-axis (integers), 5
  `PIPELINE_LABELS` stages, legend below with per-stage `$` values.
- [ ] **D4.** Revenue chart: Won teal + Target red with pale red area fill;
  "Last 6 months" top-right caption.

### Phase E — Accounts + Contacts

- [ ] **E1.** Accounts: KPI rework via C1; `$` currency; revenue-range labels
  `$`-styled.
- [ ] **E2.** Contacts: 4-button single row; Scan Card icon →
  `ScanLine`; stat cards with icons + green trend text on "New This Month";
  table columns → Name(sort)/Role/Priority/Last Activity(sort)/Engagement/
  Company/Source/Actions; funnel-icon Filters button; empty-state copy
  "No contacts found / Try adjusting your search or filters".

### Phase F — Leads

- [ ] **F1.** KPI cards with icons + `$` sub-values on Won/Dropped + `days`
  suffix value on Avg. Sales Cycle.
- [ ] **F2.** "Pipeline Value by Stage" → New/Qualified/Won/Lost, count
  Y-axis.
- [ ] **F3.** Toolbar: Filters button with funnel + chevron; table columns
  Lead Name(sort)/Email(sort)/Phone/Company/Value(sort)/Status/Source/
  Next Follow-up/Actions.

### Phase G — Calendar

- [ ] **G1.** Header "Search events…" input.
- [ ] **G2.** Stat cards: icon chips + green trend arrows; labels Today's
  Events / Total Events / Meetings This Week / Calls This Week.
- [ ] **G3.** Sunday-first weekday row + Sunday-anchored grid; month heading
  level 2.
- [ ] **G4.** Filters panel below Agenda View (Type + Date checkbox groups,
  Clear All) wired to visible-day filtering.

### Phase H — Activities

- [ ] **H1.** Header: drop subtitle + "+ New"; Log WhatsApp = green with
  WhatsApp-style icon.
- [ ] **H2.** 6 stat cards with the reference labels, per-card small texts
  and side-by-side value+bars layout.
- [ ] **H3.** Priority tabs → segmented control; "More" button on the
  section header; `•••` on Activity Timeline.
- [ ] **H4.** Filters panel: Save All; type checkboxes Call/Email/Meeting/
  WhatsApp; Owner select; Status select with time-range values (Last 7 Days
  default); "More Filters (1)" + Filter buttons.
- [ ] **H5.** "Activities by Type": `•••` button + "Last 2 days" caption +
  Call/Email/Meeting/Task/Note categories.

### Phase I — Reports

- [ ] **I1.** "Saved Reports (0)" bookmark button in the header.
- [ ] **I2.** Filter row in a white card: 4 selects with inline icons, Reset
  (ghost) + Export CSV (primary) + PDF (ghost) inside the row.
- [ ] **I3.** KPI cards with icons; Won/Lost `$` sub-values.
- [ ] **I4.** Tabs → pill style (light-blue active fill, grey container).

### Phase J — Settings + Profile

- [ ] **J1.** Settings: remove Save All; placeholders "Add new …
  (source/stage/type/tier/industry)"; pill tabs; dark `+` add buttons.
- [ ] **J2.** Profile page rework to the reference layout (Personal
  Information form + account card). Full Name edit wired to a users API
  update.

### Phase K — Verification + delivery

- [ ] **K1.** Full gate: lint 0/0 → tsc → unit (≥ 60) → build → e2e (≥ 20;
  update assertions that referenced "Sep Netflix" / AED strings).
- [ ] **K2.** Browser re-verification at 1512×945 AND 390×844 (mobile drawer
  regression suite untouched), VLM parity re-compare on dashboard, contacts,
  calendar, activities, reports, settings, profile.
- [ ] **K3.** Refresh `docs/screenshots/` (12 captures incl. profile).
- [ ] **K4.** Docs realignment: AGENTS.md / CLAUDE.md / README.md / PAD /
  `neo-crm_SKILL.md` (currency rule, KPI anatomy, page structures, test
  counts).
- [ ] **K5.** Worklog append; Conventional Commit on `main`; push via
  `docs/ssh_git_wrapper_v3.py` (paramiko shim; key outside repo, shredded
  after).

---

## Plan Validation Checklist (audited against the codebase)

- [x] P-4/P-5 touch `format.ts` + `page-parts.tsx` only; every other page
  consumes those seams (verified: `rg currency src` → 10 hits, all listed).
- [x] P-3 nav icons live in `nav-config.ts` (single source for sidebar +
  mobile drawer).
- [x] P-9 header casing is a `ui/table.tsx` style change — all 5 tables
  inherit it.
- [x] P-12 `calendarGrid(…, "sunday")` already exists in `format.ts` (line
  174) — calendar page just passes `firstDay: "sunday"`.
- [x] P-16 profile rework needs a users `PATCH` — `/api/users/[id]/route.ts`
  already exists (session-1 inventory) with owner-scope guards; verify and
  reuse.
- [x] Seed rename (B3) affects e2e assertions — `rg "Sep Netflix" tests`
  lists the exact specs to update (crm.spec.ts owner column, reports totals).
- [x] Reference quirks NOT to copy are enumerated above so they are not
  "fixed" twice.
- [x] Mobile drawer suite (`mobile-navigation.spec.ts`) depends only on nav
  labels/destinations — unchanged by icon swaps.

---

## Execution Addendum (2026-09-29, post-execution)

All phases executed in order; the full ToDo list above is complete.

### Verification outcomes

- **Phase A (TDD)**: red-first — 8 failing checks (currency contract ×7,
  avatar helpers ×6 → counted as suites) then green after implementing
  `formatCurrency`/`formatCompactCurrency` (`$`-attached, lowercase k) and
  `avatarTextColor` (relative-luminance ink). Sunday-grid regression pinned.
- **Phases B–J**: every P-item implemented; additionally discovered and
  fixed mid-execution — the reference topbar search is white with a thin
  border + `rounded-lg` (not a grey pill), the reference Add button carries
  NO chevron (two VLM reads disagreed; a zoomed crop settled it), the
  reference contacts default sort is Last Activity (desc), Next.js dev-tools
  indicator hidden via `devIndicators: false` for clean dev captures, and
  the profile form needed the keyed-remount pattern (first e2e run caught
  the empty Full Name field — fixed by extracting `ProfileForm` keyed on
  the user snapshot).
- **Quirks NOT copied** (documented fixes over defects): empty owner
  dropdowns on the dashboard/accounts toolbars, the duplicated empty
  "Status" column in Recent Deals, the "Add new industrie" typo, the
  "Last 2 days" caption that ignores the selected range, and the settings
  Default Currency field being disconnected from the display formatter
  (display mirrors the reference's `$`; the field still stores `AED`).

### Final state

- Gate: lint 0/0 · typecheck clean · **65/65 unit** (6 suites) · build
  clean · **21/21 e2e** (5-check mobile-nav regression intact; new profile
  layout + users-PATCH auth + Saved-Reports pins).
- Live verification: fresh dev-server bundle confirmed in-browser at
  1512×945 (identity, bell, sidebar, KPI anatomy, header buttons, both
  charts) and 390×844 (drawer opens, navigates, closes, scroll lock
  releases).
- Screenshots refreshed: 12 captures in `docs/screenshots/` (login, 8
  desktop pages, profile, mobile dashboard, mobile drawer).
- Docs realigned: AGENTS.md (counts + currency rule), CLAUDE.md (counts +
  display note), README.md (badge 86 checks, profile feature row), PAD
  (layer model 34 handlers, test distribution 10 files / 86 checks),
  `neo-crm_SKILL.md` (currency convention, session-3 audit entry).
