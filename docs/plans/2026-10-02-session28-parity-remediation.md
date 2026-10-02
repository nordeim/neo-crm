# Session 28 — Parity Remediation Plan (the entity edit/detail layer)

Date: 2026-10-02 · Branch: main · Operator brief: the standing workflow (docs → audit → parity → TDD → deliverables → push).

## Context

The s47 pointers: the reference's contact-detail/edit dialog (`AAe`) and the
account-edit dialog's full field set — both data-gated on the live reference
(zero rows), so the session's method is the s27 systematized bundle-extraction
(the 1.63MB bundle cached at the sandbox's `scripts/reference-bundle.js`),
live cross-checked on every surface the DOM can express.

## The audit (17 findings, bundle + live verified)

### A. The contact layer (the `AAe` pointer, decomposed)

The "contact-detail/edit dialog" pointer decomposed into FIVE components:

- **A1 — model gaps.** The reference's contact ships `role` (Decision Maker /
  Key Contact / Influencer / End User / Other — an INLINE select in the table),
  `engagement_level` (High/Medium/Low — the 3-bar cell), `company_size`
  ("Small (1-50)"/"Medium (51-500)"/"Large (500+)" — the filter values),
  `photo_url`, and a DIFFERENT priority vocabulary: **Key / Standard / At
  Risk** (not our hot/warm/cold) with the badge map Key=amber-100/amber-800/
  amber-300, Standard=blue-100/blue-800/blue-300, At Risk=red-100/red-800/
  red-300. Its `source` stores RAW values (call/email/website/parterral/
  referral) — the emoji strings are CREATE-DIALOG LABELS ONLY (the table badge
  and the CSV export carry the raw value).
- **A2 — the `AAe` create dialog** ships TWO h3 section headers we lack:
  "Contact Details" + "Professional Details"
  (`text-sm font-semibold text-gray-700 uppercase tracking-wide`) —
  live-confirmed on the reference.
- **A3 — `W7`, the Edit Contact dialog** (a SEPARATE dialog, not the create
  form): max-w-2xl max-h-[90vh] overflow-y-auto, title "Edit Contact"
  (readOnly mode → "Contact Details" with disabled inputs + a Close footer),
  form space-y-4, grid-cols-2 rows Name*/Email, Phone(tel)/Company,
  Position (full width), Status(Active/Inactive)/Source(plain — NO emojis in
  the edit select), footer justify-end gap-3 pt-4 Cancel + "Save Changes"/
  "Saving...".
- **A4 — `Pke`, the Contact Details SLIDE-OVER** (row click): `fixed top-0
  right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto
  border-l`; sticky header "Contact Details" (text-xl font-bold) + ghost X;
  hero (text-center pb-6 border-b): w-20 h-20 gradient circle + FIRST INITIAL,
  name (text-2xl font-bold), position || "No position", the priority badge +
  optional role outline badge, the engagement 3-bar indicator (w-2 h-6,
  green-600/yellow-600/red-600); Call/Email/WhatsApp grid-cols-3 outline
  buttons; "Contact Information" Card with icon rows (Email/Phone/Company +
  size/Last Activity "MMM D, YYYY"); Tabs Activities/Deals/Notes (grid-cols-3)
  with the empty states "No activities yet"/"No deals found"/"No notes yet";
  activities = the contact's activities (slice 5), deals = the contact's
  opportunities.
- **A5 — the contacts table row**: cursor-pointer + hover:bg-blue-50/50
  hover:shadow-sm; Key priority → `bg-gradient-to-r from-amber-50/50
  to-amber-50/30 border-l-4 border-l-amber-400`; last activity ≥30d (or
  never) → opacity-70 + the red icon/text; Name cell: w-11 h-11 gradient
  avatar (blue-500 via blue-600 to blue-700, ring-2 ring-blue-100, shadow-md)
  + the amber Key overlay (w-5 h-5 bg-amber-400 + white icon) + name +
  position || "No position"; Role cell: the INLINE select (h-9 w-[140px]
  border-gray-300 hover:border-blue-400, placeholder "Set role", immediate
  update); Priority badge (px-3 py-1 border font-medium); Last Activity: AC
  icon (red-500/green-500) + `ce()` (Never/Today/1 day ago/N days ago/
  N months ago); Engagement: the 3-bar cell (w-2 h-6 rounded-full
  transition-all, High=3 bg-green-500 shadow-sm / Medium=2 bg-yellow-500 /
  Low=1 bg-red-500, unfilled bg-gray-200); Company: font-semibold text-sm
  text-gray-900 + company_size (text-xs text-gray-500 mt-0.5); Source: the
  outline badge `bg-blue-50 text-blue-700 border-blue-200 font-medium` (raw
  value); Actions (stopPropagation): Call (hover:bg-green-100
  hover:text-green-700) / Email (purple) / WhatsApp (blue) ghost icons +
  the ⋮ EllipsisVertical dropdown Edit / Log Activity / Delete (red).
- **A6 — the stats fix**: "Top Decision Makers" counts role === "Key Contact"
  (ours counts priority === "hot").
- **A7 — `kke`, the contacts FILTER PANEL**: the wrapper `fixed right-0
  top-16 bottom-0 w-80 bg-white shadow-2xl z-40 lg:static lg:shadow-none` +
  the panel (w-full lg:w-80 border-l): sticky Filters/Clear All header, then
  CHECKBOX CARD groups — Role (the 5), Priority (Key/Standard/At Risk), the
  single "No Recent Activity (30+ days)", Company Size (the 3), Source —
  NOT our invented select-dropdown toolbar.
- **A8 — the mobile card list**: the reference's cards (w-12 h-12 avatar +
  name/position + priority badge + company/email/"Last activity: X" + the
  Call/Email outline flex-1 row + card onClick → Pke).
- **A9 — `NAe`, the Scan Card dialog**: a REAL upload dialog (the dashed
  dropzone + "Upload a photo or image of the business card" + a VISIBLE file
  input + "Selected: {name}" green text + Cancel/Scan Card/"Scanning..."),
  wired to extract → prefill the create dialog — ours is the invented
  "Camera not available" stub. (The base44 AI extraction is replaced by the
  documented local divergence — a client-side file-name/manual flow, same
  treatment as the s26 import.)

### B. The account layer (the account-edit pointer)

- **B1 — `wce`, the Edit Account dialog**: the same family as W7 — max-w-2xl,
  "Edit Account"/"Account Details"(readOnly), Account Name*/Industry,
  Phone(tel)/Email(email), Website (full, url, placeholder
  "https://example.com"), Annual Revenue (number, "100000")/Employees
  (number, "50"), Status Active/Inactive/Prospect, Save Changes.
- **B2 — `Ece`, the Account Insights dialog** (row click + "View Insights"):
  max-w-3xl max-h-[80vh]; header = name (text-xl) + industry + the status
  badge; THREE stat cards (grid-cols-3 p-4 text-center): Total Revenue
  `$X.XM` (won deals sum) / Open Deals (not closed_lost) / Contacts; Tabs
  Recent Activities/Contacts/Open Deals — the type-tinted w-10 h-10 icon
  rows (Email=blue-100/blue-600, Call=green-100/green-600, else purple), the
  contacts initials rows, the open-deals rows ("Close Date: " + date +
  $amount + stage badge).
- **B3 — the accounts table row**: cursor-pointer hover:bg-gray-50; Key tier
  → bg-yellow-50/30; overdue > 0 → border-l-4 border-l-red-500 + the
  "{N} Overdue" destructive badge + the star (w-4 h-4 text-yellow-500
  fill-yellow-500); the w-10 h-10 bg-blue-100 rounded-lg building icon; the
  owner initials box (w-6 h-6 bg-blue-100 text-blue-600 text-xs); last
  activity `toLocaleDateString()` || "No activity"; the HEALTH badge in the
  Status column (Healthy=green-100/green-800, At Risk=yellow-100/yellow-800,
  Needs Attention=red-100/red-800 — the H map) — the header still says
  "Status" (the reference's own header/cell mismatch, mirrored); ⋮ Edit /
  View Insights / Delete; row click → Ece.
- **B4 — `Oce`, the accounts filter sidebar**: CardHeader "Filters"
  (text-base) + ghost "Save All"; Owner select (All Owners/"John Kuy"),
  Industry select (All Industries/technology/software/financial/healthcare),
  Revenue Range select (All Revenue/$0-$1M/$1M-$5M/$5M+), Tier CHECKBOXES
  (Key Account/A/B/C), the full-width blue Filter button.

### C. The lead layer (discovered during the audit)

- **C1 — `Mke`, the Edit Lead dialog**: the same family — max-w-2xl,
  Name*/Email, Phone(tel)/Company, Status (New/Contacted/Qualified/
  Unqualified — the EDIT vocabulary) / Source (Call/Email/Website/Partner —
  4 options, no Referral), Estimated Value (number, "50000"), Save Changes.
- **C2 — the leads table row** (NEXT SESSION — documented as the pointer):
  the orange target-icon name box, the INLINE Value number input / Status
  select (the 5-status set) / Next Follow-up date input with the overdue red
  border + alert icon, the ⋮ Edit/Convert to Opportunity/Delete menu.

### D. Test stability

- **D1 — the s15 New Event e2e flake** (escalated: 3 failed full runs this
  session): `boundingBox()` races the dialog's `zoom-in-95 duration-200`
  entrance animation (672×0.95 = 638.4 ≠ 672 mid-flight). Fix: the
  `expect.poll` idiom already used by the s15 New Lead test at line 582.

## The remediation phases

### Phase 1 — the model + seam layer (S28-P1)

- `prisma/schema.prisma`: Contact gains `role`, `engagementLevel`,
  `companySize`, `photoUrl`; the priority comment → key/standard/at_risk
  storage vocabulary (String, default "Standard").
- `src/lib/constants.ts`: `CONTACT_PRIORITY_META` (Key/Standard/At Risk with
  the amber/blue/red badge maps), `CONTACT_ROLES` (the 5), `ENGAGEMENT_LEVELS`
  (High/Medium/Low), `CONTACT_SOURCE_OPTIONS` (value/label pairs: call→"📞
  Phone Call" etc.), `COMPANY_SIZES` (the 3), `CONTACT_STATUSES`
  (active/inactive), `ACCOUNT_STATUSES` (active/inactive/prospect),
  `EDIT_SOURCE_OPTIONS` (the plain 4/5), `lastActivityCe()` (the ce
  formatter), the engagement-bars + priority-badge + health/tier badge class
  maps.
- `src/lib/format.ts` or the constants seam: `ce()` = Never/Today/
  "1 day ago"/"N days ago"/"N months ago" (floor 30).
- Seed: the priority vocabulary + role/engagementLevel/companySize values +
  raw sources; `db push` + re-seed.
- **Tests first**: `tests/contact-model.test.ts` — the vocabularies, the ce
  formatter, the badge maps, the source option pairs.

### Phase 2 — the EntityEditDialog family (S28-P2)

- `src/components/shared/entity-edit-dialog.tsx`: ONE parameterized
  component (the W7/wce/Mke family): props {open, onOpenChange, title,
  readOnly, fields (the grid layout), onSubmit, isLoading} — max-w-2xl,
  space-y-4, grid-cols-2 rows, the pt-4 footer, Save Changes/Saving...
  (readOnly → the disabled inputs + Close).
- Wire: contacts ⋮ Edit → the W7 config; accounts ⋮ Edit → the wce config;
  leads ⋮ Edit → the Mke config.
- **Tests first**: `tests/entity-edit-dialog.test.ts` — the three configs'
  field sets/titles/footers + the readOnly mode.

### Phase 3 — the contacts surfaces (S28-P3/P4/P5)

- The table row rebuild (A5): the inline role select (immediate update), the
  engagement bars, the priority badges, the ce last-activity cell, the
  company+size stack, the source badge, the Call/Email/WhatsApp + ⋮ actions,
  the row click + Key tint + opacity-70.
- The AAe h3 headers (A2) + the source select on value/label pairs.
- The stats fix (A6) + the mobile card list (A8).
- `Pke` → `src/components/contacts/contact-detail-panel.tsx` (A4): the
  slide-over + its data seams (activities by contactId, deals by contact).
- `kke` → the contacts filter panel (A7): the checkbox-card groups replacing
  our select-toolbar; the fixed wrapper at mobile / static at lg.
- The Scan Card rebuild (A9): the real dialog structure (local-parse
  divergence documented).
- **Tests first**: `tests/contact-surfaces.test.ts` (the row contract, the
  panel, the filter panel, the stats) + e2e additions.

### Phase 4 — the account surfaces (S28-P6)

- The accounts row rebuild (B3): the tints/badges/owner initials/health
  badge/actions/row click.
- `Ece` → `src/components/accounts/account-insights-dialog.tsx` (B2).
- `Oce` alignment (B4): the Save All ghost + Owner/Industry/Revenue selects +
  the Tier checkboxes (Key Account) + the blue Filter button.
- **Tests first**: `tests/account-surfaces.test.ts` + e2e additions.

### Phase 5 — the s15 flake + the gate (S28-P7)

- The expect.poll fix on the New Event boundingBox (D1).
- Full gate: lint → tsc → unit (675+) → build → e2e (97+).

### Phase 6 — deliverables

- Screenshots (the established set + the new surfaces: the contact
  slide-over, the account insights, the edit dialogs, the filter panel).
- Docs realignment: README, AGENTS, CLAUDE, PAD, SKILL v1.25.0 (§16t),
  `docs/session_49.md`, this plan's addendum, both worklogs.
- Commit + the SSH-wrapper push (main only).

## Validation notes (checked against the codebase)

- Our contacts page structure (contacts-page.tsx 631 lines) already ships the
  s6 mobile card family + the s16 full-height layout — the row/filter/panel
  rewrites slot into the existing page shell.
- The e2e contacts spec ("contacts page renders seeded contacts") pins the
  table cells — will need re-scoping to the new row family.
- The s26 export e2e pins the contacts 7-column CSV (Source included) — the
  raw-source migration changes the seeded Source VALUES (labels → raw); the
  export pin must be updated to the raw values.
- The accounts export pins the 10-column set incl. Health — unchanged.
- `db:push` + re-seed needed for the new model fields (the dev db AND the
  e2e scratch db both ride the global-setup push).

---

## Addendum — the executed session (2026-10-02, post-execution)

Executed as planned with these refinements discovered during TDD:

- **Phase 1** (the model + constants): the schema gained role/engagementLevel/
  companySize/photoUrl + the priority default "Standard"; the API routes accept
  the new fields on POST/PATCH with the LEGACY hot/warm/cold vocabulary still
  accepted (mapped hot→Key, warm→Standard, cold→At Risk — old clients don't
  break); the seed ships the full new vocabulary.
- **Phase 2** (the edit-dialog family): the EntityEditDialog supports
  value/label select OPTION PAIRS (the reference's status/source selects store
  RAW values with capitalized labels — value "call", label "Call") — the plan's
  plain-string options were refined mid-build.
- **Phase 3/4** (the surfaces): all executed; the Ece insights dialog rides
  our relational ids (accountId) where the reference matches by name — the
  documented seam equivalence.
- **Phase 5**: the s15 flake root-caused (the zoom-in-95 animation race) and
  fixed with the expect.poll idiom.
- **Gate**: lint 0/0 · tsc 0 · **663/663 unit (+63: contact-model 12,
  entity-edit-dialog 12, contact-surfaces 20, account-surfaces 19)** · build
  clean · **100/100 e2e (+8)**.
- **C2 deferred** (the leads-table inline editing: the value number input, the
  status select, the next-follow-up date input with the overdue red border +
  alert icon, the Convert to Opportunity menu item) — bundle-extracted,
  documented in AGENTS/the SKILL, the next session's first pointer.
- **Live-verified**: the full new surface set on the restarted dev server
  (the stale-Prisma-client lesson — the running server keeps the OLD field
  set after a schema push until restarted).
- **Deliverables**: 32 screenshots (28 re-captured + 29 the slide-over +
  30 the edit dialog + 31 the insights dialog + 32 the filter panel).
- **Docs**: SKILL v1.25.0 (§16t + project_state), README badge 763, AGENTS
  (counts + 7 contract blocks), CLAUDE (counts + the 4 suites), PAD (46
  suites / 663+100), docs/session_49.md, this addendum, both worklogs.
