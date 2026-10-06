# Session-73 Parity Remediation Plan (2026-10-06)

Session 73 on `main` @ `06e50f7` (the s72 ship `f723a85` + `06e50f7` the
session_139 transcript). The sandbox SURVIVED session 72 — the pull
fast-forwarded `f723a85` → `06e50f7` (docs/session_139.md only, ZERO code
drift). Environment verified in place: `.env` with
`DATABASE_URL="file:../db/custom.db"` + the AUTH_SECRET, `db/custom.db` at
the repo root (with e2e.db), the census reading 15/24/10/23/12 + 4 users —
MATCH. The documented intake hazard STANDS (the platform `DATABASE_URL`
override points at a non-existent mirror; all session-73 repo operations
run under `env -u DATABASE_URL`; the e2e suite immune via its own pinned
E2E_DATABASE_URL). Ports 3000/3100 clear. **Baseline gate on HEAD: lint
0/0 (enforced) · tsc 0 · 1330/1330 unit (81 suites)** — the documented
state exact. The `skills/` exclusion verified in all three configs
(vitest include allowlist `src/**` + `tests/**` only, eslint ignores,
tsconfig exclude).

## The standing layers (69th session, NO DRIFT)

Drift sweep #69: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 44th
consecutive stable session**. Reference census #69 (agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero (the
KPI values 0/$0.0k/$0.0k/$0k/0%/0); the mobile-nav defect STANDS at a
TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW 390, NO
hamburger); desktop nav normal (256px, 8 links, all visible); the topbar
anatomy live-measured (the search 576px/36px bg-gray-50; the Mail/Bell
buttons 36×36 ghost with **computed 16px icons** — the `[&_svg]:size-4`
cascade LIVE-verified: the icons carry `w-5 h-5` classes that the stock
Button base's `[&_svg]:size-4` OVERRIDES, specificity (0,1,1) > (0,1,0);
ours renders them at a real 20px — the L-73c9 divergence).

## The audits (three parallel agents + manual validation of every claim)

### A. The session-72 re-audit (73-a) — 9/9 GENUINE

Every S72-P1..P9 checklist item verified at file:line (the picklist
bordered-row anatomy at settings-page.tsx:41-154 + page-layout.ts:397-403;
the props-driven ConfigEditor + the resolved-epoch DefaultsEditor; the
users PATCH pre-gate at api/users/route.ts:33; the month/week enum at
settings/route.ts:142; the Data panel space-y-6 at :223; the four export
icons; the updateUser store action at crm-store.ts:392-407; the raw
keystrokes + placeholders; the three e2e additions). Counts corroborated:
81 suites / 1330 its / playwright --list 122. Commit honest (24 files,
+1829/−251, zero strays). Five Nano notes: **N-73a1** the session record's
"api.ts comment re-anchored" sub-claim did NOT land (api.ts:68-72 still
enumerates the family without users; body-pregate.test.ts:6-8 still opens
"All 12 routes"); **N-73a2** the RED-enumeration bookkeeping (26 parity
its, not 25; the unenumerated 35th = the profile-photo N-62b re-anchor);
**N-73a3** the DefaultsEditor retains a dead single-child
`flex flex-col gap-4` wrapper (settings-page.tsx:544 — the Data-panel
M-72c5 retirement's last sibling); **N-73a4** the profile form's
value-keyed remount documented + dch-pinned (no action); **N-73a5** the
add-input aria-label plural formula (the documented accessible superset).

### B. The graduation audit (73-b) — ZERO graduations, 13/13 (30th consecutive)

All 13 standing items re-verified at file:line (F-47c, N-48c, N-48f,
N-48j, the CSV posture (b) — guardFormulaPrefix intact in BOTH export
families at csv.ts:31-33 + entity-export.ts:24/43; the source-vocabulary
parity — the raw lowercase values + the Capitalized settings defaults +
NO enum-membership on source; the stock-mirror Badge; the N-58c boundary;
the defensive annotations; the foreign-docs retirement; the 19/19 deps;
the mobile-nav standing fixes; the F-46f + s46-P1 contracts under the
epoch mechanism). The 8 mechanical censuses ALL CLEAN (localStorage
exactly 2 live keys; public/ og-image.png only; API 27 routes/39 handlers
all consumed; env parity 3-var exact; doc anchors at 1330+122 all four
carriers exact, badge 1452; TODO/FIXME 0, .skip/.only 0, console.log 0
with the 4 documented exceptions; `new PrismaClient` exactly 2; the
e2e-waits census 5 annotated).

### C. The fresh-eyes rotation (73-c: the topbar/search family — the
session_138 suggested target, never a dedicated rotation; every claim
manually re-validated at file:line by the orchestrator, the parity
claims BUNDLE-DECODED against the fresh-fetched reference, and the
icon-cascade claim LIVE-MEASURED)

**The family's foundations SOLID** (the header/inner/search-block/
search-wrap/search-icon/input byte-exact decodes; the stock ghost user
trigger; the avatar root/fallback/img; the chevron; MENU_CONTENT/
MENU_ITEM token-equal; MenuContent align="end" default; /api/search
session-gated + envelope-held + asString max-80 + the <2 short-circuit +
take:5 ×3 + Prisma-safe contains on SQLite [no mode:"insensitive" —
correctly avoided]; no memory leaks; no z-index conflicts; the two
documented functional supersets [the wired search vs the reference's
UNWIRED decorative input — bundle-confirmed: only placeholder+className
props; the working drawer vs the reference's broken 390px nav] both
accurately documented). **The N-73 family** (as validated + decoded +
measured):

- **M-73c6 (Medium, parity — bundle-decoded)** — the four row-action
  menus (accounts/contacts/leads/calendar) render our Popover-based
  Dropdown (role=dialog, no arrow-key navigation); the reference ships
  REAL Radix DropdownMenus on every row menu (five `Yg align:"end"`
  contents decoded: the topbar account menu + accounts
  [Edit/View Insights/Delete] + contacts [Edit/Log Activity/Delete] +
  leads [Edit/Convert to Opportunity/Delete] + calendar [Edit/Delete],
  13 stock `$s` items). The dropdown.tsx module comment's rationale
  ("row actions … unverifiable on the zero-data reference") is STALE
  post-S29-P2.
- **M-73c7 (Medium, parity — bundle-decoded)** — the row-menu items
  carry icons (the Pencil on leads Edit, the Trash2 on every Delete) +
  a DropdownSeparator on leads; the reference's items are TEXT-ONLY
  (`children:"Edit"` — string children, no icon JSX, no separators).
- **M-73c8 (Medium, parity — bundle-decoded)** — the leads ⋮ trigger is
  `size="iconSm"` (h-7 w-7 = 28px); the reference ships the STOCK icon
  size (h-9 w-9 = 36px, `c.jsx(Ke,{variant:"ghost",size:"icon",
  children:c.jsx(Bw,{className:"w-4 h-4"})})`).
- **M-73c9 (Medium, parity — the destructive literal)** — our Delete
  items carry `destructive` (text-danger #ef4444 + hover:bg-danger-soft);
  the reference ships the bare literal `className:"text-red-600"`
  (#dc2626) on the stock item base (calendar already carries the
  literal — the family normalizes to it).
- **L-73c1 (Low, parity — bundle-decoded)** — the mail/bell buttons
  render `text-muted` (gray-500 #6b7280); the reference ships
  `text-gray-600` (#4b5563) — one gray step light.
- **L-73c2 (Low, parity — bundle-decoded)** — the mail/bell are raw
  `<button>`s missing the stock Button base's `focus-visible:ring-1
  focus-visible:ring-ring` (keyboard focus = the UA default outline, not
  the reference's 1px near-black ring).
- **L-73c3 (Low, parity — bundle-decoded)** — TOPBAR_LAYOUT.header
  carries `border-line` (#e5e5e5); the reference's header carries the
  EXPLICIT `border-gray-200` (#e5e7eb — exactly our `--color-line-strong`
  family). The globals.css S12-P3 gray-200 inventory omits the topbar
  header — a record inaccuracy feeding the token choice.
- **L-73c4 (Low, parity — bundle-decoded)** — the "Hi, " label chain:
  ours `user.name || user.email.split("@")[0]`; the reference
  `display_name || full_name || email || "Guest"` — NO @-split (the raw
  email when nameless) + the "Guest" terminal. Our name is non-nullable
  (schema) + derived from the email local part at signup (S21-P4), so
  the fallback is dead-in-practice — the FORMULA is the parity.
- **L-73c5 (Low, parity — bundle-decoded)** — the Profile menuitem is a
  router.push; the reference renders `$s asChild` wrapping a real
  anchor (`ox` Link `to:Yx("Profile")` → `<a href="/Profile">`), keeping
  middle-click/cmd-click/open-in-new-tab semantics.
- **L-73c9 (Low, parity — LIVE-measured)** — the mail/bell ICONS render
  20px (ours, the `h-5 w-5` on a raw button); the reference's compute
  **16px** (the stock Button base's `[&_svg]:size-4` overrides the
  icon's own `w-5 h-5` classes — measured live: class `w-5 h-5`,
  computed 16px; the same cascade applies to the reference's
  slide-over-close X, our contact-detail-panel:79 twin construction).
- **N-73c1** — the avatar fallback initial chain lacks the terminal "G"
  (rides with L-73c4's chain work).
- **N-73c2** — the debounce SUCCESS path lacks the abort gate (the
  catch + envelope paths both carry it — s45-P3/s46-P4; a superseded
  run whose body buffered pre-abort can transiently flash stale
  results).
- **N-73c4** — the dead `TOPBAR_LAYOUT.userMenu` record (zero
  consumers; MenuContent carries MENU_CONTENT's own min-w-[8rem]).
- **N-73c5 (now parity-bearing)** — our Button base misses the stock
  `[&_svg]:size-4` — the L-73c9 carrier (blast radius enumerated:
  exactly two Button consumers render >16px icons — the mail/bell +
  the contact-detail X — BOTH reference-matching constructions that
  compute 16px in the reference; every other Button icon is h-4 w-4;
  the Google svg + the sidebar/mobile-nav/stat-card icons live outside
  the Button component).
- **N-73c6** — our Input base misses the stock `file:*` family
  (`file:border-0 file:bg-transparent file:text-sm file:font-medium
  file:text-foreground` — live-dumped on the reference's search input);
  latent (no type=file input uses the Input component).
- **N-73c7** — /api/search over-fetches (the `include: { owner,
  account }` on all three entities; the topbar consumes only
  id/name/stage/value).
- **N-73c10** — the accounts/contacts ⋮ triggers import MoreVertical
  where leads/calendar import EllipsisVertical (the same SVG — lucide's
  rename; the S29-P2 comment itself claims "the VERTICAL dots (the
  contacts/accounts family)" — the code says otherwise).
- **DISMISSED / STANDING at validation**: N-73c3 (the search dropdown
  a11y — our superset surface, no reference counterpart; the N-66a
  Escape fix stands, the full combobox semantics out of scope without
  a reference); N-73c8 (the search rows navigate to list routes, the
  fetched ids unused — the superset design, documented); the contacts
  "Log Activity" wiring (ours opens the ContactDetailPanel — the
  documented superset's entry point; the reference's own item is DEAD,
  bundle-confirmed `c.jsx($s,{children:"Log Activity"})` with no
  onClick — the S29-P2 Convert-to-Opportunity twin — KEPT WIRED +
  documented in-code); the row-delete `window.confirm` gates (the
  reference's deletes are DIRECT — zero window.confirm in the bundle,
  the mutations decode bare — ours is the documented safety superset,
  e2e-pinned on the calendar round-trip); the accounts-trigger
  stopPropagation + the aria-labels (the accessible superset); the
  mail/bell `pointer-events-none` on the search icon (the wired-input
  nicety); the 27-route /api/health exception (the gate endpoint).

## The operator decisions

The **CSV formula-injection posture (b) STANDS** (the 32nd
re-affirmation — the guard intact in both export families
[guardFormulaPrefix at csv.ts:31-33 applied in escapeCell AND imported
into entity-export.ts, the 73-b re-verification], the `-` exclusion
documented + pinned, the reference bundle byte-stable for the 44th
consecutive session; the 73-c rotation touched NO CSV surface — no new
evidence moves the (a) parity / (c) full-OWASP alternatives).

The **source-vocabulary documented parity STANDS AND EXTENDS to the
topbar/search family** (the 73-b census re-confirmed every anchor at
file:line; the session-73 fixes are menu-primitive semantics, icon/
separator retirements, a trigger size, class-literal alignments, an
anchor-semantics migration, fallback-chain formulas, stock-base
completions, and e2e additions — the row-menu VOCABULARIES themselves
[Edit / View Insights / Log Activity / Convert to Opportunity / Delete /
Profile / Logout] are untouched and now bundle-verified verbatim).

## The remediation set (TDD — RED first, then GREEN)

- **S73-P1 (M-73c6/c7/c8/c9 — the row-menu migration)**: the four
  row-action menus (accounts/contacts/leads/calendar) migrate from the
  Popover-based Dropdown to the REAL Menu* primitives (Menu/
  MenuTrigger/MenuContent/MenuItem — role=menu, arrow-key navigation,
  the stock item base). MenuContent gains the S46-P7 click containment
  (the composed `props.onClick?.(e); e.stopPropagation()` AFTER the
  {...props} spread — the same pattern DropdownContent carries; React
  synthetic clicks on DropdownMenu portals bubble through the React
  tree exactly the same way). The items go TEXT-ONLY (the Pencil/Trash2
  icons retire); the leads DropdownSeparator retires (and the now-dead
  DropdownSeparator component + its dch living-surfaces pin retire with
  it); the Delete items carry the bare `className="text-red-600"`
  literal (the reference's form; calendar already matches); the leads
  trigger goes `size="icon"` (36px); accounts/contacts normalize
  MoreVertical → EllipsisVertical (the same SVG, the S29-P2 comment's
  own claim); the contacts Log Activity keeps its ContactDetailPanel
  wiring with the S29-P2-style comment documenting the reference's dead
  item; the delete confirms stay (the documented safety superset); the
  dashboard quick-create/export + the leads Filters stay on the
  Popover family (the three superset surfaces, no reference menu
  counterpart) with the dropdown.tsx module comment re-anchored (the
  stale "unverifiable" rationale retired).
- **S73-P2 (L-73c1/c2/c3/c4/c9 + N-73c1/c4/c10 — the topbar sextet)**:
  the header border goes `border-line-strong` (the reference's explicit
  gray-200 family) + the globals.css S12-P3 inventory comment gains the
  topbar header; the mail/bell buttons become the STOCK construction —
  `<Button type="button" variant="ghost" size="icon"
  className="text-gray-600 hidden sm:flex" aria-label>` with the
  `w-5 h-5`-classed icons (the ring + the computed-16px cascade arrive
  with the stock base; the class noise is the reference's own); the
  "Hi, " chain goes `user.name || user.email || "Guest"` (the @-split
  retired); the avatar initial chain gains the terminal "G"
  (`(user.name || user.email || "G").charAt(0).toUpperCase()`);
  TOPBAR_LAYOUT.iconButton + TOPBAR_LAYOUT.userMenu RETIRE (zero
  consumers after the migration) with their page-layout pins.
- **S73-P3 (L-73c5 — the Profile anchor)**: `<MenuItem asChild><Link
  href="/Profile">Profile</Link></MenuItem>` (next/link — the real
  anchor with client-side nav; the route-case pin re-anchors from
  router.push to the Link form).
- **S73-P4 (N-73c5/c6 — the stock-mirror completion)**: BUTTON_BASE
  gains `svgSize: "[&_svg]:size-4"` (composed into the button base
  between pointer-events-none and shrink-0 — the reference's exact
  order); the Input base gains the `file:*` family (INPUT_BASE.file).
- **S73-P5 (N-73c2/c7 — the search hygiene pair)**: the debounce
  success path gains the abort gate (`if (body?.ok &&
  !controller.signal.aborted)` — the s46-P4 symmetry); /api/search
  drops the unused `include: { owner, account }` from all three
  entities (the topbar consumes id/name/stage/value only).
- **S73-P6 (N-73a1/a3 — the settings stragglers)**: the api.ts
  family comment gains users (the honest 13-route enumeration) + the
  body-pregate.test.ts opening comment re-anchors (12 → 13); the
  DefaultsEditor's dead single-child `flex flex-col gap-4` wrapper
  retires (the Card becomes the direct return — the M-72c5 sibling).
- **S73-P7 (the coverage closures — four NEW e2e checks)**: (a) the
  **logout round-trip** — the account menu → Logout → the /login
  redirect + a protected route now redirecting (the session cleared);
  (b) the **signup 4xx negatives** — the invalid email / the short
  password / the duplicate email surfacing their exact server messages;
  (c) the **contact upload negative trio** — a text/plain file (the
  client-side native alert "Please upload an image file (JPG or PNG)"
  + NO photoUrl), an oversized image (the server 400 → the
  "Failed to upload photo. Please try again." alert), an unsupported
  image MIME (image/gif → the same failure alert); (d) the **dashboard
  quick-create dropdown smoke** — the Add dropdown opens with the five
  items (Lead/Contact/Account/Event/Activity) + one click-through
  opens the create dialog. 122 → 126. The row-menu e2e re-anchors:
  the ⋮ tests' item locators go `getByRole("menuitem", …)` (the items
  are no longer buttons) + the accounts ⋮ test gains the role=menu
  assertion.

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: `tests/page-layout.test.ts`
(TOPBAR_LAYOUT.header border; the iconButton/userMenu pins retire;
BUTTON_BASE.svgSize + INPUT_BASE.file pins arrive); `tests/leads-inline.
test.ts:145-158` (the bare-Convert pin → the MenuItem form; the trigger
pins; the EllipsisVertical family); `tests/calendar-cells.test.ts:177-
182` (DropdownContent/Item → MenuContent/Item in the agenda region);
`tests/dropdown-containment.test.ts` (EXTENDS to the MenuContent
containment); `tests/route-case.test.ts:167-172` (the router.push pin →
the Link form); `tests/dead-code-hygiene.test.ts:270-300 + 367-378` (the
DropdownSeparator living-surfaces lines retire with the component; the
contacts/accounts MoreVertical pins → EllipsisVertical); the e2e ⋮ tests
(1934/1997/2012/2089 + the 2374 calendar round-trip — the menuitem
locators); `tests/topbar-search.test.ts` (the debounce pins SURVIVE —
the success-path abort gate is additive); `tests/topbar-import-hygiene.
test.ts` (the import-block exclusions — the topbar gains Button/Link
imports, keeps the Dropdown* exclusions); `tests/body-pregate.test.ts`
(the opening comment only — the USERS_ROUTE pin itself is s72-correct);
`tests/dashboard-export.test.ts` (SURVIVES — the dashboard export menu
stays Popover). No pins on: the mail/bell raw-button construction (the
page-layout pin re-anchors), the row-menu icons (zero pins on Pencil/
Trash2 inside the row menus), the leads separator beyond the living-
surfaces line, the "Hi," chain, the avatar "G", the /api/search includes,
the DefaultsEditor wrapper. The quick-create/export/Filters Popovers
untouched. The S46-P7 containment INTENT preserved (the MenuContent
composition is the same contract). The S29-P2 dead-Convert intent
PRESERVED (the bare MenuItem, no onClick).

## The gate

lint 0/0 · tsc 0 · the full unit suite at 1330 + the new session-73 its
· build clean · e2e 126 on a fresh CI=1 boot (all 9 mobile-nav checks
green) · the non-vacuousness replay in a pre-fix `06e50f7` worktree
(only the new/modified test files; the exact RED set isolated) · the
LIVE battery (the four row menus as real role=menu with arrow-key
navigation + text-only items + the red Delete literal; the topbar
header border + the stock mail/bell with computed 16px icons + the
"Hi," chain; the Profile anchor; the mobile drawer regression at TRUE
390px + the Tailwind v4 token probes + zero 390px overflow ×10 routes +
the closing db:census MATCH) · the screenshot set at 1440×900 · the
docs realignment (SKILL v1.70.0 + README/AGENTS/CLAUDE/PAD at the new
counts + session_140.md [the even-number record convention] + this
execution record + both worklogs).

## The execution record (2026-10-06, session-73)

EXECUTED AS PLANNED with THREE mid-flight e2e repairs (all on the
NEW tests, all caught by the runs themselves, none post-ship): (1)
the logout + quick-create tests navigated to "/dashboard" — the
working tests' own convention is "/" (the strict-mode/heading
failures pointed straight at it); (2) the quick-create trigger hit
a strict-mode violation among THREE "Add" buttons — disambiguated
via aria-haspopup (the Popover trigger is the only one); (3) the
upload trio's third case was drafted as image/gif "unsupported" —
the run failed with one rejection alert short, and the uploads-dir
artifact (81d38...gif WRITTEN) testified that gif IS whitelisted in
EXT_BY_MIME (with webp); the genuinely unsupported MIME is
image/svg+xml. RED: **38 failed exactly** (the
topbar-rowmenu-parity suite's 26 [one green-through-RED by window
accident — the abort-gate pin's slice includes the else-if's own
gate text, the S49-P3 class] + the page-layout re-anchors 6 + the
dch trio + the calendar-cells Menu* pin + the leads-inline pair +
the route-case anchor). GREEN: S73-P1..P6 all landed (P1 the
four-menu migration with the MenuContent containment + the
text-only items + the red literal + the 36px trigger + the
EllipsisVertical normalization + the DropdownSeparator retirement
[DropdownLabel stays per the N-56e operator KEEP]; P2 the topbar
sextet + the two record retirements; P3 the Profile anchor; P4
BUTTON_BASE.svgSize + INPUT_BASE.file; P5 the abort gate + the
include trim; P6 the api.ts/body-pregate comments + the DefaultsEditor
wrapper); P7 the four e2e closures. Non-vacuousness: 38 failed |
311 passed (349) in the pre-fix 06e50f7 worktree (node_modules
hard-linked via cp -al, only the modified test files); clean
teardown. Full gate: lint 0/0 · tsc 0 · **1356/1356 unit (82
suites, +26)** · build clean · **126/126 e2e on a fresh CI=1 boot
(3.2m, all 9 mobile-nav checks green)**. LIVE: the topbar sextet
(border gray-200 + 36×36 mail/bell with computed 16px icons +
"Hi,"); the accounts menu role=menu with 3 text-only items + the
red Delete; the ARROW-KEY roving; the containment (Edit opens ONLY
"Edit Account"); the Profile anchor + click-through; the leads
trigger 36×36; the drawer at TRUE 390px with focus restored; zero
overflow ×10; NO Tailwind v4 bug; the closing census MATCH. Docs:
SKILL v1.70.0 (§16bm + project_state, 6619 → 6719, via the
assert-first scripts/skill_edits_s73.py) + README/AGENTS/CLAUDE/PAD
at 1356+126 (badge 1482) + session_140.md + this record + the repo
worklog; .env/.env.example verified (no env surface change).
Estimate drift: +26 its exact (the plan's open count) · 126 e2e
exact · the e2e-waits census unchanged at 5 (no new waits — the
upload trio polls, the smoke uses role waits).
