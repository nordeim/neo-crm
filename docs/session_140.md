Session 73 — the topbar/search + row-menu family session
(docs/session_138.md + docs/session_139.md, the s72 records; the
operator's brief = the standing cycle + this session's explicit
instructions: refresh the workspace from the remote, review the five
core docs + the four session records [session_138.md, the session72
plan, worklog.md, session_139.md], validate against the codebase,
audit with the repo skills, proceed on the two operator decisions,
iterate for parity with the reference, mind the mobile navigation +
the Tailwind v4 hazard class, keep DATABASE_URL at file:../db/custom.db
with db/ at the repo root, verify the vitest + playwright suites, plan
+ execute RED-first, capture screenshots, keep .env.example aligned,
realign the docs, ship to main via the SSH wrapper).
Workspace: the sandbox SURVIVED session 72 — the pull fast-forwarded
f723a85 → 06e50f7 (docs/session_139.md only, ZERO code drift); the
environment verified in place (the .env with
DATABASE_URL="file:../db/custom.db" + the AUTH_SECRET, db/custom.db +
db/e2e.db at the repo root, the census reading 15/24/10/23/12 + 4
users — MATCH). The documented intake hazard STANDS (the stale
platform DATABASE_URL override points at a NON-EXISTENT mirror, all
session-73 repo operations ran under `env -u DATABASE_URL`, the e2e
suite immune via its own pinned E2E_DATABASE_URL). Intake hygiene: NO
zombie servers; ports 3000/3100 clear. Baseline gate GREEN: lint 0/0
(enforced) · tsc 0 · 1330/1330 unit (81 suites) — the documented
state exact; the skills/ exclusion verified in all three configs.

The standing drift re-sweep (69th session): the reference bundle
fresh-fetched — byte-identical (size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — the 44th consecutive
stable session). The reference census (69th, agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the mobile-nav defect STANDS
at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW
390, NO hamburger); desktop nav normal (256px, 8 links, all
visible). NEW this session: the topbar live-measured in passing —
the reference's Mail/Bell icons carry `w-5 h-5` classes that COMPUTE
at 16px (the stock Button base's `[&_svg]:size-4` overrides them,
specificity (0,1,1) > (0,1,0)) — the discovery that became L-73c9.

The three parallel audit agents (73-a/73-b/73-c) + every finding
manually validated at file:line by the orchestrator (the
parity-bearing claims additionally BUNDLE-DECODED against the
fresh-fetched reference, and the icon-cascade claim LIVE-MEASURED).
**73-a** — the s72 re-audit: **9/9 checklist items GENUINE** (every
S72-P1..P9 fix at file:line; the counts corroborated [81 suites,
1330 its, playwright --list 122, tsc 0, lint 0/0]; the commit honest
[24 files, +1829/−251, zero strays]). Five Nano notes: the N-73a1
api.ts comment half-claim (the "re-anchored" sub-claim did NOT land
— api.ts:68-72 still said "12" without users; FIXED this session);
the N-73a2 RED-enumeration bookkeeping (26 parity its, not 25; the
unenumerated 35th = the profile-photo N-62b re-anchor); the N-73a3
DefaultsEditor dead single-child wrapper (FIXED this session); the
N-73a4 profile value-keyed remount (documented + dch-pinned — no
action); the N-73a5 add-input aria-label plural (the documented
accessible superset).

**73-b** — the graduation audit: **ZERO graduations, 13/13 (the
30th consecutive)** — every standing item re-verified at file:line.
The 8 mechanical censuses ALL CLEAN (localStorage exactly 2 live
keys; public/ og-image.png only; API 27 routes/39 handlers all
consumed [the /api/health gate exception]; env parity 3-var exact;
doc anchors at 1330+122 all four carriers exact, badge 1452; zero
commented-out code; TODO/FIXME 0, .skip/.only 0, console.log 0 with
the 4 documented exceptions; `new PrismaClient` exactly 2; the
e2e-waits census 5 annotated).

**73-c** — the fresh-eyes rotation on the topbar/search family (the
session_138 suggested target, never a dedicated rotation): the
family's foundations SOLID (the header/inner/search-block/wrap/icon/
input byte-exact decodes; the stock ghost user trigger; the avatar
family; the chevron; MENU_CONTENT/MENU_ITEM token-equal; MenuContent
align="end"; /api/search session-gated + envelope-held + asString
max-80 + the <2 short-circuit + take:5 ×3 + Prisma-safe contains on
SQLite; no leaks; no z-index conflicts; the two documented functional
supersets — the wired search vs the reference's UNWIRED decorative
input (bundle-confirmed: only placeholder+className props), the
working drawer vs the reference's broken 390px nav — both accurately
documented). **The N-73 family** (as validated + decoded + measured):

- **M-73c6 CONFIRMED (bundle-decoded)** — the four row-action menus
  rendered our Popover-based Dropdown (role=dialog, no arrow-key
  navigation); the reference ships REAL Radix DropdownMenus on every
  row menu (five `Yg align:"end"` contents decoded: the topbar
  account menu + accounts [Edit/View Insights/Delete] + contacts
  [Edit/Log Activity/Delete] + leads [Edit/Convert to Opportunity/
  Delete] + calendar [Edit/Delete], 13 stock `$s` items). The
  dropdown.tsx module comment's "unverifiable on the zero-data
  reference" rationale was STALE post-S29-P2.
- **M-73c7 CONFIRMED (bundle-decoded)** — our items carried icons
  (the Pencil on leads Edit, the Trash2 on every Delete) + a
  DropdownSeparator on leads; the reference's items are TEXT-ONLY
  (string children, no icon JSX, no separators).
- **M-73c8 CONFIRMED (bundle-decoded)** — the leads ⋮ trigger was
  `size="iconSm"` (h-7 w-7 = 28px); the reference ships the STOCK
  icon size (h-9 w-9 = 36px).
- **M-73c9 CONFIRMED (bundle-decoded)** — our Delete items carried
  `destructive` (text-danger #ef4444 + hover:bg-danger-soft); the
  reference ships the bare literal `className:"text-red-600"`
  (#dc2626) on the stock item base.
- **L-73c1/c2 CONFIRMED (bundle-decoded)** — the mail/bell raw
  `<button>`s rendered text-muted (gray-500, one step light) and
  missed the stock base's focus-visible ring.
- **L-73c3 CONFIRMED (bundle-decoded)** — TOPBAR_LAYOUT.header
  carried border-line (#e5e5e5); the reference's header carries the
  EXPLICIT border-gray-200 (#e5e7eb — exactly our --color-line-strong
  family). The globals.css S12-P3 inventory omitted the topbar header.
- **L-73c4 CONFIRMED (bundle-decoded)** — the "Hi, " chain: ours
  `user.name || user.email.split("@")[0]`; the reference
  `display_name || full_name || email || "Guest"` — NO @-split + the
  "Guest" terminal (our name is non-nullable + email-derived at
  signup per S21-P4, so the tail is dead-in-practice — the FORMULA
  is the parity).
- **L-73c5 CONFIRMED (bundle-decoded)** — the Profile menuitem was a
  router.push; the reference renders `$s asChild` wrapping a REAL
  anchor (the middle-click/open-in-new-tab semantics).
- **L-73c9 CONFIRMED (LIVE-measured)** — the mail/bell ICONS
  rendered 20px (ours); the reference's COMPUTE 16px (the
  `[&_svg]:size-4` cascade — measured live on the reference: class
  `w-5 h-5`, computed 16px; the same cascade governs the
  contact-detail close X, our twin construction).
- **N-73c1/c2/c4/c5/c6/c7/c10 CONFIRMED** — the avatar "G" terminal;
  the debounce success-path abort gate (the s46-P4 symmetry); the
  dead TOPBAR_LAYOUT.userMenu record; our Button base missing the
  stock `[&_svg]:size-4` (the L-73c9 carrier — the blast radius
  enumerated: exactly two Button consumers render >16px icons, BOTH
  reference-matching constructions); our Input base missing the
  stock `file:*` family; /api/search's unused owner/account
  includes; the MoreVertical/EllipsisVertical import inconsistency.
- **DISMISSED/STANDING at validation** — N-73c3 (the search dropdown
  a11y — the superset surface, the N-66a Escape fix stands);
  N-73c8 (the search rows navigate to list routes — the superset
  design); the contacts Log Activity wiring (ours opens the
  ContactDetailPanel — the reference's item is DEAD, bundle-confirmed
  — KEPT WIRED + documented in-code, the S29-P2 twin treatment);
  the row-delete window.confirm gates (the reference's deletes are
  DIRECT — zero window.confirm in the bundle — ours is the
  documented safety superset, e2e-pinned on the calendar round-trip);
  the aria-labels (the accessible superset); the accounts-trigger
  stopPropagation.

The operator decisions: the **CSV formula-injection posture (b)
STANDS** (the 32nd re-affirmation — the guard intact in both export
families [guardFormulaPrefix at csv.ts:31-33 applied in escapeCell
AND imported into entity-export.ts, the 73-b re-verification], the
`-` exclusion documented + pinned, the reference bundle byte-stable
for the 44th consecutive session; the 73-c rotation touched NO CSV
surface — no new evidence moves the (a) parity / (c) full-OWASP
alternatives). The **source-vocabulary documented parity STANDS AND
EXTENDS to the topbar/search family** (the 73-b census re-confirmed
every anchor at file:line; the session-73 fixes are menu-primitive
semantics, icon/separator retirements, a trigger size, class-literal
alignments, an anchor-semantics migration, fallback-chain formulas,
stock-base completions, and e2e additions — the row-menu VOCABULARIES
themselves [Edit / View Insights / Log Activity / Convert to
Opportunity / Delete / Profile / Logout] are untouched and now
bundle-verified verbatim).

The remediation set (S73-P1..P7, blast radius pre-checked, the
re-anchors identified for page-layout, leads-inline, calendar-cells,
route-case, dch, topbar-search, and the e2e ⋮ locators):

- **S73-P1 (M-73c6/c7/c8/c9)** — the four row-action menus migrated
  to the REAL Menu* primitives (Menu/MenuTrigger/MenuContent/
  MenuItem — role=menu, arrow-key navigation, the stock item base);
  MenuContent gains the S46-P7 click containment (the composed
  props.onClick + stopPropagation AFTER the spread); the items go
  TEXT-ONLY; the leads separator retires (and the now-dead
  DropdownSeparator component retires with it — DropdownLabel stays
  per the N-56e operator KEEP); the Delete items carry the bare
  `className="text-red-600"` literal; the leads trigger goes
  `size="icon"` (36px); accounts/contacts normalize MoreVertical →
  EllipsisVertical; the contacts Log Activity keeps its wiring with
  the S29-P2-style comment; the delete confirms stay (documented);
  the dashboard quick-create/export + the leads Filters stay on the
  Popover family (the three superset surfaces) with the dropdown.tsx
  comment re-anchored.
- **S73-P2 (the topbar sextet)** — the header border goes
  border-line-strong + the S12-P3 inventory gains the topbar header;
  the mail/bell become the STOCK construction (Button ghost icon +
  `text-gray-600 hidden sm:flex` — the ring + the computed-16px
  cascade arrive with the base); the "Hi," chain goes
  `user.name || user.email || "Guest"`; the avatar initial chain
  gains the "G" terminal; TOPBAR_LAYOUT.iconButton + userMenu RETIRE.
- **S73-P3 (L-73c5)** — `<MenuItem asChild><Link href="/Profile">`
  (the next/link anchor; the route-case pin re-anchored).
- **S73-P4 (N-73c5/c6)** — BUTTON_BASE.svgSize + INPUT_BASE.file
  (composed into the button/input bases — the exact stock mirror).
- **S73-P5 (N-73c2/c7)** — the debounce success-path abort gate +
  the /api/search include trim.
- **S73-P6 (N-73a1/a3)** — the api.ts 13-route comment + the
  body-pregate header re-anchor; the DefaultsEditor dead wrapper
  retirement.
- **S73-P7 (the coverage closures — four NEW e2e checks)** — the
  logout round-trip; the signup 4xx negatives (the duplicate in the
  card + the API trio: invalid email / short password / oversized
  body); the contact upload negative trio (the non-image client
  alert + the oversized pre-gate 400 + the unsupported svg — the
  run's own discovery that image/gif IS whitelisted); the
  quick-create dropdown smoke. 122 → 126.

RED: **38 failing pins exactly** (the topbar-rowmenu-parity suite's
26 [one green-through-RED by window accident — the abort-gate pin's
slice includes the else-if's own gate text, the S49-P3 class] + the
page-layout re-anchors 6 + the dch trio + the calendar-cells Menu*
pin + the leads-inline pair + the route-case anchor). GREEN:
S73-P1..P6 all landed. Non-vacuousness: **38 failed | 311 passed**
in the pre-fix 06e50f7 worktree (node_modules hard-linked via
cp -al, only the modified test files) — exactly the modified-pin
set; clean teardown.

Full gate: **lint 0/0 · tsc 0 · 1356/1356 unit (82 suites, +26) ·
build clean · 126/126 e2e on a fresh CI=1 boot (3.2m, all 9
mobile-nav checks green)** — THREE mid-flight e2e repairs the runs
caught (all on the NEW tests, none post-ship): the dashboard route
is "/" not "/dashboard" (the working tests' own convention); the
quick-create trigger disambiguated via aria-haspopup among THREE
"Add" buttons (the strict-mode violation); the upload trio's third
case rewritten from image/gif (whitelisted — the uploads-dir
artifact testified) to image/svg+xml.

The LIVE battery (dev server, real login): the topbar sextet (the
header border rgb(229,231,235) = gray-200 exact; the mail/bell
36×36 with COMPUTED 16px icons in gray-600 + the "Hi, sepnetflix2023"
label); the accounts row menu (role=menu, 3 TEXT-ONLY items, the
Delete at red-600); the ARROW-KEY navigation (Edit → View Insights
via ArrowDown, the roving focus on the menuitems); the S46-P7
containment under the Menu family (the accounts Edit click opens
ONLY "Edit Account" — zero row-click ghosts); the Profile item (a
REAL `<a href="/Profile">` with role=menuitem + the click-through to
"Profile & Settings"); the leads trigger at 36×36; the mobile drawer
at TRUE 390px (the real click: 8/8 links + focus in the panel + the
body lock; Escape: closed + unlocked + focus RESTORED to the burger);
**zero 390px overflow on all ten routes**; **NO Tailwind v4 bug**
(--blur-sm 4px + --shadow-sm `0 1px 2px 0 #0000000d`); the closing
census MATCH (15/24/10/23/12 + 4 users, pristine — zero probe
residue).

Two screenshots captured (85-accounts-row-menu + 86-leads-row-menu)
— VLM-verified 4/4 + 4/4 (the three text-only items with the red
Delete + zero icons/separators; the leads menu with the DEAD
Convert to Opportunity preserved + the topbar's search/mail/bell/
"Hi," row).

The docs realignment: SKILL v1.70.0 (the new §16bm + the
project_state prepend, applied atomically via the assert-first
scripts/skill_edits_s73.py at the sandbox root, 6619 → 6719 lines
by wc -l) + README (badge 1482, the 82/1356 + 126 carriers, the s73
narrative) + AGENTS (the commands + the s73 narrative) + CLAUDE (the
six count carriers) + PAD (the s73 unit + e2e rows, the totals) +
this record + the plan's execution record + the repo worklog; the
.env/.env.example verified (no env surface change; DATABASE_URL
file:../db/custom.db with db/ at the repo root).

Suggested next (session 74): the reports-page family (the KPI/filter
surfaces — the other never-audited page family); standing e2e gaps:
the settings/users surface smoke, the calendar month-boundary math,
the reports export round-trips.
