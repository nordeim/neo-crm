Session 72 — the settings/profile seam session
(docs/session_136.md + docs/session_137.md, the s71 records; the
operator's brief = the standing cycle + this session's explicit
instructions: refresh the workspace from the remote, review the five
core docs + the four session records [session_136.md, the session71
plan, worklog.md, session_137.md], validate against the codebase,
audit with the repo skills, proceed on the two operator decisions,
iterate for parity with the reference, mind the mobile navigation +
the Tailwind v4 hazard class, keep DATABASE_URL at file:../db/custom.db
with db/ at the repo root, verify the vitest + playwright suites, plan
+ execute RED-first, capture screenshots, keep .env.example aligned,
realign the docs, ship to main via the SSH wrapper).
Workspace: the sandbox SURVIVED session 71 — the pull fast-forwarded
f38f675 → 0e40a09 (docs/session_137.md only, ZERO code drift); the
environment verified in place (the .env with
DATABASE_URL="file:../db/custom.db" + the AUTH_SECRET, db/custom.db
at the repo root, the census reading 15/24/10/23/12 + 4 users +
pristine: MATCH — db/ at the repo root, as the operator's brief
requires). The documented intake hazard STANDS in this sandbox's
shape (the stale platform DATABASE_URL override points at a
NON-EXISTENT mirror, all session-72 repo operations ran under
`env -u DATABASE_URL`, the e2e suite immune via its own pinned
E2E_DATABASE_URL). Intake hygiene: NO zombie servers; ports 3000/
3100 clear. Baseline gate GREEN: lint 0/0 (enforced) · tsc 0 ·
1300/1300 unit (80 suites) — the documented state exact; the skills/
exclusion verified in all three configs (vitest include allowlist,
eslint ignores, tsconfig exclude — the folder excluded from code
checking, testing and compilation per the brief).

The standing drift re-sweep (68th session): the reference bundle
fresh-fetched (the Vite chunk assets/index-DZ-xbrIm.js, direct curl
with a browser UA) — byte-identical (size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — the 43rd consecutive
stable session). The reference census (68th, agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the mobile-nav defect
STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible,
scrollW 390, NO hamburger); desktop nav normal (256px, 8 links, all
visible). A NEW census nuance this session: the reference's live
picklist create was probed (the "Add new contact source" flow typed
+ submitted twice) — the platform backend silently NO-OPS on this
shared demo workspace (no row appears, no error surfaces), so the
picklist-anatomy evidence rides the BUNDLE decode — the definitive
source for a surface the live reference cannot demonstrate.

The three parallel audit agents (72-a/72-b/72-c) + every finding
manually validated at file:line by the orchestrator (the
parity-bearing claims additionally BUNDLE-DECODED against the
fresh-fetched reference). **72-a** — the s71 re-audit: **10/10
checklist items GENUINE** (every S71-P1..P6 fix at file:line — the
useOpenEpoch twins, the five unconditionally-mounted wrappers, the
retired render-time keys, the dropped outer keys, the savingEdit
brackets, the Event literal labels, the hygiene quartet, the store
comment, the two e2e additions; the counts corroborated LIVE
[1300/1300 in 80 suites, playwright --list 119, tsc 0, lint 0/0];
the commit honest [24 files, +1279/−143, zero strays]; zero
regressions [all 18 Date.now() hits enumerated, none in keys]).
NEW: three Nano notes — the documented useOpenEpoch twin
(deliberate, cross-referenced in comments); the settings/profile
value-keyed remount seam (72-a's own flag — exactly this session's
rotation target, resolved by S72-P2); the 119-count bookkeeping
nuance (the lister's own count, internally consistent).

**72-b** — the graduation audit: **ZERO graduations, 13/13 (the
29th consecutive)** — every standing item re-verified at file:line
(F-47c, N-48c, N-48f, N-48j, N-51c, the CSV posture (b), the
source-vocabulary parity, the stock-mirror Badge, the N-58c
boundary, the defensive annotations, the foreign-docs retirement,
the 19/19 deps, the mobile-nav standing fixes, the F-46f + s46-P1
contracts under the epoch mechanism). The 8 mechanical censuses ALL
CLEAN (localStorage exactly 2 live keys — `neo-crm.leads.views`
[plural, canonical] + `crm_saved_reports`; public/ og-image.png
only; API 27 routes/39 handlers all consumed; env parity 3-var
exact; doc anchors at 1300+119 all four carriers exact, badge 1419;
zero commented-out code; TODO/FIXME 0, .skip/.only 0, console.log 0
with the 4 documented exceptions, `new PrismaClient` exactly 2; the
e2e-waits census 3 annotated). The 6 standing-item guard suites
re-run 48/48 GREEN.

**72-c** — the fresh-eyes rotation on the settings/profile seam
(settings-page.tsx 549 + profile-page.tsx 349 + the settings/users/
upload(s) routes + uploads.ts + the store slices — session_134's
own suggested target, NEVER a dedicated rotation): the seam's
foundations SOLID (every route session-gated + envelope-held; the
nine documented raw-fetch call-sites exact; the upload rate limit +
the pinned name charset; the danger-zone vocabulary bundle-pinned)
with the **N-72 family** found. The orchestrator's validation
verdicts:

- **H-72c1 CONFIRMED (bundle-decoded)** — the picklist items render
  CHIP PILLS (`inline-flex … rounded-full border border-line
  bg-line-soft …`, an X-only remove) where the reference's ly
  renders BORDERED LIST ROWS — `flex items-center gap-2 p-2 border
  rounded-lg hover:bg-gray-50` — each with a `span.flex-1` name + a
  Pencil ghost icon button (the inline RENAME: the row swaps to an
  Input [Enter saves] + a Save-icon + an X) + a Trash2 ghost icon
  button (`text-red-600 hover:text-red-700`), entity CRUD by id.
  BUNDLE: zero `rounded-full` chip classes in the picklist (the 7
  bundle hits are all avatars/dots/pills elsewhere); the icon
  aliases DB=Pencil, kC=Save, Lg=X, FB=Trash2 confirmed; the full ly
  component decoded (title/items/onAdd/onUpdate/onDelete/isLoading,
  `order: items.length` on create, the `Add new
  ${title.toLowerCase().slice(0,-1)}` placeholder formula, the
  "No items yet" p inside the space-y-2 mb-4 container). The S12-P8
  record ("chip rows — ALIGNED") is CONTRADICTED — a 71-session
  misread (the s12 probe pinned the container + the add-row, never
  the item row).
- **M-72c1 CONFIRMED** — the editors' remount keys
  `cfg-/def-${JSON.stringify(settings)}` remount the editors ~RTT
  after every own save (the focused input loses focus, a half-typed
  next add-label is lost, continued typing past a debounce window
  visibly drops characters). The reference's React-Query data swap
  never remounts its inputs (the ly items render from PROPS; only
  the transient editing state is local).
- **M-72c2 CONFIRMED** — the users PATCH parses request.json() with
  NO isBodyTooLarge pre-gate — the 13th sessioned req.json() route
  while api.ts + body-pregate.test.ts both document "all 12".
- **M-72c3 CONFIRMED (bundle-decoded)** — the invented "Agenda"
  calendar-view option; the reference's Select ships exactly two
  (`De value="month"` → "Month", `De value="week"` → "Week").
- **M-72c4 CONFIRMED (bundle-decoded)** — the invented "Loading
  settings…" gates; the reference renders the Config tab instantly
  with `data:n=[]` ("No items yet" ×5) and the Defaults tab with
  the fallback values (`(l?.default_currency) || "AED"`, `|| "new"`,
  `|| "B"`, `||3`, `|| "month"`, `|| "monday"`).
- **M-72c5 CONFIRMED (bundle-decoded)** — the Data panel is 16px
  (an inner flex-col gap-4) where the reference's panel carries
  `space-y-6` directly (24px, the three cards its children; the
  config/defaults panels match at space-y-4 both apps).
- **L-72c1 CONFIRMED (bundle-decoded)** — the four Export buttons
  are text-only; the reference carries the Download icon
  (`w-4 h-4 mr-2`) on every one.
- **L-72c2 CONFIRMED (bundle-decoded)** — the Account card renders
  the LOCAL photoUrl state instantly (the reference's card reads
  the session user `e.profile_picture` — stale until save), and our
  save path refreshes the users[] LIST (`fetchUsers`), not the user
  slice; the reference's save does `t(await me())` — the card's
  name + photo update in the pre-reload window. ⚠ The e2e pin at
  crm.spec.ts:2239 (`toHaveCount(2)` right after upload) pinned the
  divergent behavior — re-anchored in lockstep.
- **L-72c3/L-72c4/L-72c9/N-72c1/N-72c3/N-72c7 CONFIRMED
  (bundle-decoded)** — the two-arg error toast vs the reference's
  single-arg `Ix.error("Failed to update profile")`; the
  single-char-ellipsis "Saving…" vs the three-dot "Saving..." (the
  reference + our own edit-dialog family); the full-header loading
  paragraph vs the reference's HEADERLESS `text-center py-12`
  "Loading..." branch; the missing AED/new/B placeholders; the
  explicit empty-string toast arg; the Camera icon kept beside the
  "Uploading..." label (the reference drops the icon mid-upload).
- **L-72c6 CONFIRMED** — impure state updaters (the PUT fired
  inside the setLists updater; the set() wrote refs + scheduled the
  timer inside setDefaults — nothing guards it today).
- **L-72c8 CONFIRMED (bundle-decoded)** — the currency/tier inputs
  transform client-side (toUpperCase().slice()) where the reference
  persists raw keystrokes; our route ALREADY uppercases + caps
  server-side (max 8) — the client transforms were redundant
  invention.
- **DISMISSED/STANDING at validation** — L-72c5 (the DefaultsEditor
  failed-PUT leaves the rejected value — the toast gives feedback;
  no reference behavior to mirror — ACCEPTED, documented); L-72c7
  (the upload MIME trust — nosniff + the image Content-Type on
  serve mitigate; the standing security posture); N-72c4 (the
  settings GET lazy-create race — self-healing); N-72c5 (mkdirSync
  per call — idempotent + µs-cheap); N-72c6 (orphaned uploads — a
  platform GC limitation, documented); N-72c7 (the XFF-spoofable
  rate-limit keys — the family-wide design, session-gated surface);
  N-72c8 (the file-input never resets after a failed upload — the
  reference's aCe is IDENTICAL — parity-pinned, no fix without an
  operator decision); the S48-P2 entity-vs-string-array settings
  data model (STANDS — the UI anatomy fix rides the string arrays);
  the "Add new industrie" typo (bundle-confirmed); the 500ms reload;
  the topbar avatar pickup; the unconditional save (N-62b).

The operator decisions: the **CSV formula-injection posture (b)
STANDS** (the 31st re-affirmation — the guard intact in both export
families [guardFormulaPrefix at csv.ts:31-33 applied in escapeCell
AND imported into entity-export.ts, the 72-b re-verification], the
`-` exclusion documented + pinned, the reference bundle byte-stable
for the 43rd consecutive session; the 72-c rotation touched NO CSV
surface — no new evidence moves the (a) parity / (c) full-OWASP
alternatives). The **source-vocabulary documented parity STANDS AND
EXTENDS to the settings/profile seam** (the 72-b census re-confirmed
every anchor at file:line; the session-72 fixes are UI-chrome
anatomy, mount-mechanics, an enum retirement, loading/spacing/icon/
vocabulary parities, and e2e additions — the picklist vocabularies
themselves untouched; the S48-P2 string-array data model stands
under the new row anatomy).

The remediation set (S72-P1..P9, blast radius pre-checked: no pins
on the chip classes, the Loading gates, the size="sm", the icon
absences, the loading branch, or the toast args; the re-anchors
identified for settings-rollback, the dch agenda enum,
body-pregate, page-layout, the e2e toHaveCount(2), and the N-62b
payload pin):

- **S72-P1 (H-72c1)** — the ListEditor rewritten to the reference's
  ly geometry: the items render as SETTINGS_PICKLIST.itemRow rows
  carrying `span.flex-1` + the Pencil rename + the red Trash2; the
  rename mode swaps the row to Input(flex-1, Enter saves) + Save + X;
  the empty state as the rows' sibling inside the items container;
  the chip pills + the flex-wrap wrapper retired; the dead size="sm"
  retired; the aria-labels kept as the accessible superset.
- **S72-P2 (M-72c1 + M-72c4 + L-72c6)** — the ConfigEditor
  PROPS-DRIVEN (the five lists read `settings?.<key> ?? []` in
  render; the local lists copy, the mutate-in-updater, and the
  guarded revert all RETIRED — a failed PUT can no longer leave a
  phantom item, the s46-P3 intent now structural; the handlers PUT
  single-key patches computed from the current props); the
  DefaultsEditor keyed on the RESOLVED EPOCH only
  (`key={settings ? "resolved" : "pending"}` — the s71 open-epoch
  sibling) with the reference's fallback initializers; both
  "Loading settings…" gates RETIRED; the set() computes next
  OUTSIDE the updater (pure updaters).
- **S72-P3 (M-72c2)** — the users PATCH body pre-gate (the 13th
  sessioned route); the api.ts comment + the body-pregate family
  re-anchored.
- **S72-P4 (M-72c3)** — the Agenda option retired (the page's
  SelectItem + the route enum + the dch/api-robustness pins).
- **S72-P5 (M-72c5)** — the Data panel `mt-2 space-y-6` with the
  three cards as direct children (the inner wrapper retired).
- **S72-P6 (L-72c1)** — the four Export buttons carry the Download
  icon at SETTINGS_DATA.buttonIcon.
- **S72-P7 (the profile sextet)** — the NEW store action updateUser
  (call() envelope + the s64 write-guard + `set({ user: res.data })`
  — the reference's t(await me()) contract; the raw-fetch census
  nine→eight call-sites across seven endpoints, the store header
  re-anchored); the Account card reads the STORE user's photo/name
  (the pre-reload update); the single-arg toasts; the three-dot
  "Saving..."; the HEADERLESS `text-center py-12` "Loading..."
  branch (the header row moved into the loaded branch); the
  icon-dropping "Uploading..." label; the page drops
  onSaved={fetchUsers}.
- **S72-P8 (L-72c8 + N-72c1)** — the defaults inputs persist raw
  keystrokes + carry the reference's placeholders.
- **S72-P9 (the coverage closures)** — three NEW e2e checks: the
  picklist add/rename/delete round-trip (self-cleaning), the
  defaults debounce + FOCUS-persistence contract (the input keeps
  focus through the flush; the value persists across reload; the
  seed default restored), and the upload negative (the documented
  standing gap closed). 119 → 122.

RED: **35 failing pins exactly** (the new settings-profile-parity
suite's 25 [one green-through-RED by design — the S49-P3 precedent]
+ the rewritten settings-rollback 4 + the body-pregate 13th-route it
+ the re-anchored dch agenda enum + the page-layout itemRow/deleteBtn
pair + the two MID-FLIGHT lockstep re-anchors the runs themselves
caught: the s57 dch living-surfaces guard [the onSaved={fetchUsers}
pin] and the s43 api-robustness calendarView message). GREEN:
S72-P1..P8 all landed. Non-vacuousness: **35 failed | 473 passed**
in the pre-fix 0e40a09 worktree (node_modules hard-linked via
cp -al, only the seven modified test files) — exactly the
modified-pin set; clean teardown.

Full gate: **lint 0/0 · tsc 0 · 1330/1330 unit (81 suites, +30) ·
build clean · 122/122 e2e on a fresh CI=1 boot (3.0m, all 9
mobile-nav checks green)** — ONE mid-flight e2e repair (the run
caught it): the picklist test's rename step timed out on a locator
that had ALREADY matched its row — input VALUES are not textContent,
so the `filter({ hasText: "Probe Source" })` row locator resolves to
nothing once the row swaps to edit mode; the fill re-scoped to the
card (the s71 strict-mode-anchor lesson's sibling).

The LIVE battery (dev server, real login): the bordered rows with
the Pencil/Trash2 red pair + ZERO chips (the H-72c1 anatomy, 8/8
seeded rows); the rename round-trip in place (Email → Email Probe →
Email, the row count stable at 8 — restored pristine after); the
M-72c1 contract (typed USD in Default Currency → the input STILL
FOCUSED + the value intact after the 500ms debounce + the PUT — the
stored value confirmed via the API, then AED restored); the Data
panel's computed 24px gap (space-y-6, three direct cards); the four
export buttons all with icons; the defaults placeholders (AED/new/B)
+ the Month select; the profile L-72c2 sequencing (the upload →
form-only preview [count 1] → the save → the PRE-RELOAD Account-card
img [count 2, the updateUser slice set] → the post-reload topbar
pickup [count 3]); the mobile drawer at TRUE 390px (the real click:
8/8 links + focus in the panel + the body lock; Escape: closed +
unlocked + focus RESTORED to the burger — the offsetParent-null
probe artifact for fixed elements run down, the s70/s71 JS-click
precedent); **zero 390px overflow on all ten routes**; **NO Tailwind
v4 bug** (--blur-sm 4px + --shadow-sm `0 1px 2px 0 #0000000d` + a
live surface computing `rgba(0,0,0,0.05) 0px 1px 2px 0px`); the
closing census MATCH with the probe photo cleared (the user's
photoUrl restored to null — zero probe residue).

Two screenshots captured (83-settings-picklist-rows + 
84-settings-defaults) — VLM-verified 4/4 + 4/4 (the bordered rows +
the Pencil/trash red pair + the add row's dark Plus; the single-
column Default Values + the AED value + the Month select + no
loading UI).

The docs realignment: SKILL v1.69.0 (the new §16bl + the
project_state prepend, applied atomically via the assert-first
scripts/skill_edits_s72.py at the sandbox root, 6509 → 6619 lines by
wc -l) + README (badge 1452, the 81/1330 + 122 carriers, the s72
narrative) + AGENTS (the commands + the s72 narrative) + CLAUDE (the
six count carriers) + PAD (the s72 unit + e2e rows, the totals) +
this record + the plan's execution record + the repo worklog; the
.env/.env.example verified (no env surface change; DATABASE_URL
file:../db/custom.db with db/ at the repo root).

Suggested next (session 73): the topbar/search family (the other
session_134 suggestion — never a dedicated rotation); standing e2e
gaps: the logout round-trip, the signup 4xx negatives, the contact
upload negative trio, the dashboard quick-create dropdown smoke.
