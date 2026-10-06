# Session-72 Parity Remediation Plan (2026-10-06)

Session 72 on `main` @ `0e40a09` (the s71 ship `91629f3` + `f38f675`
the session-log update + `0e40a09` the session_137 transcript). The
sandbox SURVIVED session 71 — the pull fast-forwarded `f38f675` →
`0e40a09` (docs/session_137.md only, zero code drift). Environment
verified in place: `.env` with `DATABASE_URL="file:../db/custom.db"`
+ the AUTH_SECRET, `db/custom.db` at the repo root, the census MATCH
(15/24/10/23/12 + 4 users, pristine). The documented intake hazard
STANDS (the platform `DATABASE_URL` override points at a non-existent
mirror; all session-72 repo operations run under `env -u
DATABASE_URL`; the e2e suite immune via its own pinned
E2E_DATABASE_URL). Ports 3000/3100 clear. **Baseline gate on HEAD:
lint 0/0 (enforced) · tsc 0 · 1300/1300 unit (80 suites)** — the
documented state exact. The `skills/` exclusion verified in all three
configs (vitest include allowlist `src/**` + `tests/**` only, eslint
ignores, tsconfig exclude); the skills/ folder excluded from code
checking, testing and compilation per the operator's brief.

## The standing layers (68th session, NO DRIFT)

Drift sweep #68: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 43rd
consecutive stable session**. Reference census #68 (agent-browser,
live login at 1280 then a TRUE 390px viewport): the demo data still
zero (the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the mobile-nav defect
STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible,
scrollW 390, NO hamburger); desktop nav normal (256px, 8 links, all
visible). The reference's live picklist create was probed (the
"Add new contact source" flow) — the platform backend silently
no-ops on this shared demo workspace (no row appears), so the
picklist-anatomy evidence rides the BUNDLE decode, the definitive
source.

## The audits (three parallel agents + manual validation of every claim)

### A. The session-71 re-audit (72-a) — 10/10 GENUINE

Every s71 checklist item verified at file:line (P1 the useOpenEpoch
twins at entity-dialogs.tsx:93-103 + entity-edit-dialog.tsx:56-66, the
five wrappers mounting forms unconditionally keyed by the epoch, the
render-time keys retired, the three call-site outer keys dropped; P2
the savingEdit brackets ×3 with the disabled/"Saving..." wiring; P3
the Event status literal labels; P4 the hygiene quartet — hideClose
retired, ContactForm's dead settings dropped, the dead `??` retired,
DIALOG_FIELDS_WRAPPER lead-only; P5 the store comment precision; P6
the two e2e additions with the 700ms window; the counts corroborated
— 1300/1300 in 80 suites, playwright --list 119, tsc 0, lint 0/0; the
commit honest — 24 files +1279/−143, zero strays; zero regressions —
all 18 Date.now() hits enumerated, none in keys; the sleeps census 3
annotated). NEW: three Nano notes — the documented useOpenEpoch twin
(deliberate, cross-referenced); the settings/profile value-keyed
remount seam (72-a's own flag — exactly this session's rotation
target); the 119-count bookkeeping nuance (the lister's own count,
internally consistent).

### B. The graduation audit (72-b) — ZERO graduations, 13/13 (29th consecutive)

All 13 standing items re-verified at file:line (F-47c the lead
blank-select parity; N-48c the dashboard zero-guards; N-48f the
raw-dump String() cells; N-48j the duplicated dashboard builders; the
CSV posture (b) — guardFormulaPrefix intact in BOTH export families;
the source-vocabulary parity — the raw lowercase values + the
Capitalized settings defaults + NO enum-membership on source; the
stock-mirror Badge; the N-58c internally-live export-keyword
boundary; the defensive annotations; the foreign-docs retirement;
the 19/19 deps; the mobile-nav standing fixes; the F-46f + s46-P1
contracts under the epoch mechanism). The 8 mechanical censuses ALL
CLEAN (localStorage exactly 2 live keys — `neo-crm.leads.views`
[plural, canonical] + `crm_saved_reports`; public/ og-image.png
only; API 27 routes/39 handlers all consumed; env parity 3-var
exact; doc anchors at 1300+119 all four carriers exact, badge 1419;
zero commented-out code; TODO/FIXME 0, .skip/.only 0, console.log 0
with the 4 documented exceptions, `new PrismaClient` exactly 2; the
e2e-waits census 3 annotated — the s71 700ms settle window). The 6
standing-item guard suites re-run 48/48 GREEN.

### C. The fresh-eyes rotation (72-c: the settings/profile seam —
settings-page.tsx 549 + profile-page.tsx 349 + the settings/users/
upload(s) routes + uploads.ts + the store slices; session_134's own
suggested target, never a dedicated rotation; every claim manually
re-validated at file:line by the orchestrator, the parity-bearing
claims BUNDLE-DECODED against the fresh-fetched reference)

**The seam's foundations SOLID** (every route session-gated +
envelope-held; the nine documented raw-fetch call-sites exact; the
upload rate limit + the pinned name charset; the danger-zone
vocabulary bundle-pinned; the standing parities re-verified clean).
**The N-72 family** (as validated + decoded):

- **H-72c1 (High, parity — bundle-decoded)** `settings-page.tsx:45-61`
  — the picklist items render CHIP PILLS (`inline-flex … rounded-full
  border border-line bg-line-soft …` with an X-only remove). The
  reference's `ly` renders BORDERED LIST ROWS — `flex items-center
  gap-2 p-2 border rounded-lg hover:bg-gray-50` — each with a
  `span.flex-1` name + a Pencil ghost icon button (inline RENAME: the
  row swaps to Input flex-1 [Enter saves] + Save-icon + X) + a
  Trash2 ghost icon button (`text-red-600 hover:text-red-700`);
  entity CRUD by id (`onUpdate(id, {name})`). BUNDLE: zero
  `rounded-full` chip classes in the picklist (the 7 bundle hits are
  avatars/dots/pills elsewhere); icons DB=Pencil, kC=Save, Lg=X,
  FB=Trash2 confirmed. The S12-P8 record ("chip rows — ALIGNED") is
  CONTRADICTED — a 71-session misread (the S12 probe pinned the
  container + the add-row, never the item row; the page-layout pins
  have no item-row record — the coverage-gap that let it survive).
- **M-72c1 (Medium, behavioral)** `settings-page.tsx:152/161` — the
  editors' remount keys `cfg-/def-${JSON.stringify(settings)}`: every
  successful picklist PUT or debounced defaults PUT updates the store
  settings → the key changes → the editor REMOUNTS ~RTT after each
  save — the focused input loses focus, a half-typed next add-label
  is lost, continued typing after a >500ms pause visibly drops chars.
  The reference's React-Query data swap never remounts its inputs
  (the ly items render from PROPS; only the transient editing state
  is local).
- **M-72c2 (Medium, house-hygiene)** `api/users/route.ts:30` — the
  PATCH parses `request.json()` with NO `isBodyTooLarge` pre-gate —
  the 13th sessioned `req.json()` route while `api.ts:68-72` and
  `body-pregate.test.ts:6` both document "all 12" (accounts/
  activities/contacts/events/leads ×[root+[id]] + settings + reset).
  The one sessioned writer outside the family.
- **M-72c3 (Medium, parity — bundle-decoded)**
  `settings-page.tsx:529-531` + `settings/route.ts:141` — the
  invented "Agenda" calendar-view option. BUNDLE: the reference's
  Select ships exactly TWO options (`De value="month"` → "Month",
  `De value="week"` → "Week"). The route enum + the dch pin carry the
  invention (`["month", "week", "agenda"]`).
- **M-72c4 (Medium, parity — bundle-decoded)**
  `settings-page.tsx:150-155, 158-164` — the invented "Loading
  settings…" gates on both editor tabs. BUNDLE: the reference renders
  the Config tab instantly with `data:n=[]` ("No items yet" ×5) and
  the Defaults tab with fallback values (`(l?.default_currency) ||
  "AED"`, `|| "new"`, `|| "B"`, `||3`, `|| "month"`, `|| "monday"`).
  Violates the S25-P1 instant-render model on this page.
- **M-72c5 (Medium, parity — bundle-decoded)**
  `settings-page.tsx:167-169` — the Data panel is `mt-2 space-y-4` +
  an inner `flex flex-col gap-4` (16px between cards). BUNDLE: the
  reference's Data panel is `ra value="data" className="space-y-6"`
  (24px, directly on the panel — the three cards its children).
  Config/defaults panels match (`space-y-4` both apps).
- **L-72c1 (Low, parity — bundle-decoded)** `settings-page.tsx:229-256`
  — the four Export buttons are text-only. BUNDLE: every one carries
  the Download icon (`cs` at `w-4 h-4 mr-2`), same as the template
  buttons.
- **L-72c2 (Low, parity — bundle-decoded)** `profile-page.tsx:293-294,
  139` — the Account card renders the LOCAL photoUrl state instantly
  (the reference's card reads the session user `e.profile_picture` —
  stale until save), and our save path refreshes the users[] LIST
  (`fetchUsers`), not the user slice. BUNDLE: the reference's save
  does `t(await me())` — the user state updates from the PATCH
  round-trip, so the card's name + photo update in the pre-reload
  window. ⚠ `tests/e2e/crm.spec.ts:2239-2241` pins the divergent
  behavior (`toHaveCount(2)` imgs right after upload) — re-anchored
  in lockstep.
- **L-72c3 (Low, parity — bundle-decoded)** `profile-page.tsx:142,145`
  — the error toast carries a second description arg; BUNDLE: the
  reference is single-arg `Ix.error("Failed to update profile")`.
- **L-72c4 (Low, parity)** `profile-page.tsx:271` — "Saving…" (the
  single-char ellipsis); the reference and our own edit-dialog family
  use three dots ("Saving...").
- **L-72c6 (Low, React-discipline)** `settings-page.tsx:344-359,
  453-459` — impure state updaters: `mutate()` fires the PUT inside
  the `setLists` updater; `set()` writes refs + schedules the timer
  inside `setDefaults`. Nothing guards it today (StrictMode off,
  purity rule off) — retired structurally by the P1/P2 rewrite (the
  ConfigEditor goes props-driven; the DefaultsEditor's `set()`
  computes `next` outside the updater).
- **L-72c8 (Low, parity — bundle-decoded)**
  `settings-page.tsx:491,509` — the currency/tier inputs transform
  client-side (`toUpperCase().slice(0,6)` / `.slice(0,2)`); BUNDLE:
  the reference persists raw keystrokes. The route ALREADY
  uppercases + caps server-side (`max: 8` currency) — the client
  transforms are redundant invention.
- **L-72c9 (Low, parity — bundle-decoded)** `profile-page.tsx:38-39`
  — our loading state renders the full header + a `text-sm
  text-muted` "Loading profile…" paragraph. BUNDLE: the reference's
  else-branch is HEADERLESS — `p-4 sm:p-8 > max-w-4xl mx-auto >
  div.text-center.py-12` with the plain inherited-text "Loading...".
- **N-72c1 (Nano, parity — bundle-decoded)** the three free-text
  defaults inputs ship NO placeholders; BUNDLE: `placeholder: "AED"`
  / `"new"` / `"B"`.
- **N-72c2 (Nano, hygiene)** `settings-page.tsx:84` — the dead
  `size="sm"` on the picklist add button (fully overridden by
  SETTINGS_PICKLIST.addButton; the reference ships the default size).
- **N-72c3 (Nano, parity)** `profile-page.tsx:136` — the explicit
  empty-string second arg on the success toast (the reference passes
  no second arg; our falsy guard renders nothing — cosmetic debt).
- **N-72c7 (Nano, upload-button nuance)** during upload the
  reference renders "Uploading..." TEXT-ONLY (the Camera icon
  drops); ours keeps the icon beside the label.
- **DISMISSED / STANDING (recorded for the audit trail)**: L-72c5
  (the DefaultsEditor failed-PUT leaves the rejected value — the
  toast gives feedback; no reference behavior to mirror — ACCEPTED,
  documented); L-72c7 (the upload MIME trust — nosniff + the image
  Content-Type on serve mitigate; the standing security posture);
  N-72c4 (the settings GET lazy-create race — self-healing);
  N-72c5 (mkdirSync per call — idempotent + µs-cheap); N-72c6
  (orphaned uploads — a platform GC limitation, documented);
  N-72c7 (the XFF-spoofable rate-limit keys — the family-wide
  design, session-gated surface); N-72c8 (the file-input never
  resets after a failed upload — the reference's aCe is IDENTICAL —
  parity-pinned, no fix without an operator decision); the S48-P2
  entity-vs-string-array settings data model (STANDS — the UI
  anatomy fix rides the string arrays); the "Add new industrie"
  typo (bundle-confirmed); the 500ms reload; the topbar avatar
  pickup; the unconditional save (N-62b).
- **Coverage catalog (the rotation's)**: zero e2e on the picklist
  add/remove round-trip (the H-72c1 surface — how it survived 71
  sessions), zero on the defaults debounced persist, zero on the
  upload negatives (the documented standing gap), zero pins of any
  kind on the picklist item anatomy + the calendar-view option set.

## The operator decisions

The **CSV formula-injection posture (b) STANDS** (31st re-affirmation
— the guard intact in both export families [guardFormulaPrefix at
csv.ts:31-33 applied in escapeCell AND imported into
entity-export.ts, the 72-b re-verification], the `-` exclusion
documented + pinned, the reference bundle byte-stable for the 43rd
consecutive session; the 72-c rotation touched NO CSV surface — no
new evidence moves the (a) parity / (c) full-OWASP alternatives).

The **source-vocabulary documented parity STANDS AND EXTENDS to the
settings/profile seam** (the 72-b census re-confirmed the anchors at
file:line: CONTACT_SOURCE_OPTIONS/LEAD_SOURCE_OPTIONS/SOURCE_PAIRS
pinned, NO enum-membership on routes' source, the settings
Capitalized defaults verbatim; the session-72 fixes are UI-chrome
anatomy, mount-mechanics, an enum retirement, loading-state/
spacing/icon/vocabulary parities, and e2e additions — the picklist
VOCABULARIES themselves (the seeded Capitalized labels + the raw
lowercase source values) are untouched; the S48-P2 string-array data
model stands under the new row anatomy).

## The remediation set (TDD — RED first, then GREEN)

- **S72-P1 (H-72c1 — the picklist bordered-row anatomy)**: the
  ListEditor rewrites to the reference's `ly` geometry — the items
  render as `SETTINGS_PICKLIST.itemRow` rows (`flex items-center
  gap-2 p-2 border rounded-lg hover:bg-gray-50`, a NEW page-layout
  record + pin) each carrying `span.flex-1` (the name) + a Pencil
  ghost icon button (aria-label `Rename ${item}` — the accessible
  superset over the reference's unlabeled icons) + a Trash2 ghost
  icon button (`text-red-600 hover:text-red-700`, aria-label
  `Delete ${item}`); the RENAME mode swaps the row to an Input
  (`flex-1`, Enter saves) + a Save-icon ghost button + an X ghost
  button; the empty state renders INSIDE the `space-y-2 mb-4`
  container as the pinned `p` (a sibling of the mapped rows, the
  `&&` children-array form). The chip pills + the flex-wrap wrapper
  retire. The add row keeps the pinned anatomy (the dead `size="sm"`
  retired per N-72c2). The icons import from lucide-react
  (Pencil/Save join the existing Plus/Trash2/X).
- **S72-P2 (M-72c1 + M-72c4 + L-72c6 — the props-driven editors +
  the instant render)**: the ConfigEditor goes PROPS-DRIVEN — the
  five lists read `settings?.<key> ?? []` directly in render (the
  reference's React-Query architecture); the local `lists` state +
  the `mutate()` updater + the guarded revert all RETIRE (a failed
  PUT can no longer leave a phantom item — the props never changed);
  the handlers compute the next list from the current props and PUT
  the single-key patch (`updateSettings({ [key]: next })` — the
  route's per-key validation + the full-settings response make the
  partial form exact); the JSON.stringify remount key RETIRES (no
  key at all — the editor never remounts on its own saves). The
  DefaultsEditor keeps its local state + the S46-P2 debounce but
  keys on the RESOLVED EPOCH only — `key={settings ? "resolved" :
  "pending"}` — mounting with the reference's fallback values
  (`?? "AED"` / `?? "new"` / `?? "B"` / `?? 3` / `?? "month"` /
  `?? "monday"`, M-72c4) and NEVER remounting on its own saves
  (M-72c1); the `set()` computes `next` OUTSIDE the updater
  (L-72c6). Both "Loading settings…" gates RETIRE (the tabs render
  the editors unconditionally; the Config tab shows "No items yet"
  ×5 until the fetch resolves — exactly the reference's
  instant-render contract). The `{settings ? … : …}` conditional
  wrappers go with them.
- **S72-P3 (M-72c2 — the users PATCH body pre-gate)**: the 13th
  sessioned `req.json()` route joins the F-68a2 family — the
  `isBodyTooLarge` import + the gate line before the parse; the
  `api.ts` comment + the `body-pregate.test.ts` family re-anchor
  (12 → 13 routes).
- **S72-P4 (M-72c3 — the Agenda retirement)**: the invented
  `agenda` SelectItem retires from the settings page; the route enum
  re-anchors to `["month", "week"]` (the reference's exact set,
  bundle-decoded); the dch pin re-anchors in lockstep. The seed
  stores "month" (verified) — no stored-value hazard.
- **S72-P5 (M-72c5 — the Data panel spacing)**: the Data TabsPanel
  carries `mt-2 space-y-6` (the reference's panel-level 24px) and
  the inner `flex flex-col gap-4` wrapper RETIRES (the three cards
  become the panel's direct children, the reference's geometry).
- **S72-P6 (L-72c1 — the export-button icons)**: the four Export
  buttons carry the Download icon at `SETTINGS_DATA.buttonIcon`
  (`h-4 w-4`, the mr-2 gap riding BUTTON_BASE.iconGap) — the
  template buttons' exact chrome.
- **S72-P7 (L-72c2 + L-72c3 + L-72c4 + L-72c9 + N-72c3 + N-72c7 —
  the profile parity sextet)**: the save path moves to a NEW store
  action `updateUser(patch)` (the `call()` envelope client + the s64
  session write-guard + `set({ user: res.data })` — the reference's
  `t(await me())` contract, the user slice refreshed from the PATCH
  round-trip); the raw-fetch census drops to EIGHT call-sites across
  seven endpoints (the store comment re-anchors); the page drops
  `onSaved={fetchUsers}` (the reference calls me(), not the users
  list). The Account card reads the STORE user's photoUrl + name
  (not the local form state — the pre-reload window updates the
  card exactly like the reference). The error/success toasts go
  single-arg; "Saving…" → "Saving..."; the loading branch goes
  HEADERLESS (`div.text-center.py-12` "Loading..." inside
  PROFILE_LAYOUT.root, the header row moving into the loaded
  branch); the upload button renders "Uploading..." text-only (the
  Camera icon drops during upload, the reference's form). The
  N-62b JSON.stringify pin re-anchors to the store action's body.
- **S72-P8 (L-72c8 + N-72c1 — the defaults input parity)**: the
  three free-text defaults inputs drop the client transforms (the
  route's server-side uppercase + caps own the guard) and gain the
  reference's placeholders ("AED" / "new" / "B").
- **S72-P9 (the coverage closures — three NEW e2e checks)**:
  (a) **the picklist add/rename/delete round-trip** — the Config
  tab: add "Probe Source" via the add row → the bordered row
  appears; the Pencil → the rename Input → "Probe Renamed" saved;
  the Trash2 → the row gone (the H-72c1 surface, the ListEditor's
  first e2e, self-cleaning); (b) **the defaults debounce + focus
  contract** — fill "USD" in Default Currency → the input KEEPS
  FOCUS through the 500ms flush (the M-72c1 contract, the remount
  would blur it) → reload → "USD" persisted → restore "AED";
  (c) **the upload negative** — a text/plain file on the profile
  input → the "Failed to upload photo" toast + NO img (the
  server-side guard, the documented standing gap closed;
  green-through-RED by design — the S49-P3 precedent). 119 → 122.
- **The carriers**: the 72-a Nano (the settings/profile remount
  seam) resolved BY this session's P2 — recorded in the session
  record; the dismissed-finding audit trail recorded in the session
  record per the house convention.

## Blast radius (pre-checked)

No unit pins on: the chip-pill classes (zero matches in tests/ for
`rounded-full` on this surface); the `{settings ? … : Loading}`
gates (zero pins on "Loading settings"); the `size="sm"` add
button; the export buttons' icon absence; the profile loading
branch; the toast second-args. The pins that RE-ANCHOR in lockstep:
`tests/settings-rollback.test.ts` (the mutate-revert + the
JSON.stringify keys — REWRITTEN to pin the props-driven contract:
the failed-PUT phantom impossibility is now structural [no local
lists]; the remount keys gone); `tests/dead-code-hygiene.test.ts:770`
(the route enum agenda → month/week); `tests/body-pregate.test.ts`
(12 → 13 routes); `tests/page-layout.test.ts` (the SETTINGS_PICKLIST
record EXTENDS with itemRow — the existing items/empty/addRow/
addButton/industriesPlaceholder pins unchanged); the e2e
`crm.spec.ts:2239-2241` toHaveCount(2) (→ count(1) after upload,
count(2) after save — the reference's own sequencing); the
N-62b JSON.stringify pin (page → store). The settings-debounce
pins SURVIVE (the set()/flush()/unmount mechanics keep their
shapes — the set() pin's no-inline-PUT + setTimeout/500 + the flush
serialization all preserved under the out-of-updater restructure).
The settings e2e battery (tabs wiring, defaults single-column, data
tab chrome, 2-col grid, exports, reset flow) all SURVIVE — the
surfaces they assert are untouched. The `settings-page exposes the
three configuration tabs` e2e (`getByText("Contact Sources")`) —
the CardTitle stays. The S46-P3 guarded-revert intent is PRESERVED
STRUCTURALLY (the phantom cannot exist — the item appears only
when the store updates). The S46-P2 debounced-persist intent is
PRESERVED (the debounce + serialization + unmount-flush all stay).
The users PATCH route's own pins (upload-api.test.ts :56) SURVIVE.
The store's User type + the call() seam unchanged (the action is
additive). The `resetData` path: the editors are tab-unmounted
during the reset (the `{tab === …}` conditionals) — the fresh-mount
on tab return re-reads the reset settings (the stale-local-state
hazard does not exist). The DefaultsEditor's resolved-epoch key:
the "pending" mount shows the fallbacks (the reference's
instant-render), the resolution remount is the ONLY remount (the
fetch resolves before any typing in practice — and if it lands
mid-typing, the server truth wins, the reference's own
controlled-input behavior).

## The gate

lint 0/0 · tsc 0 · the full unit suite at 1300 + the new
session-72 its · build clean · e2e 122 on a fresh CI=1 boot (all 9
mobile-nav checks green) · the non-vacuousness replay in a pre-fix
`0e40a09` worktree (only the new/modified test files; the exact RED
set isolated) · the LIVE battery (the fix surfaces through real
round-trips — the picklist add/rename/delete, the defaults
focus-through-persist, the upload negative, the profile save → the
Account card's pre-reload update, the picklist row anatomy vs the
bundle + the mobile drawer regression at TRUE 390px + the Tailwind
v4 token probes + zero 390px overflow ×10 routes + the closing
db:census MATCH) · the screenshot set at 1440×900 · the docs
realignment (SKILL v1.69.0 + README/AGENTS/CLAUDE/PAD at the new
counts + session_138.md [the even-number record convention] + this
execution record + both worklogs).

## The execution record (2026-10-06, session-72)

EXECUTED AS PLANNED with THREE mid-flight repairs (all caught by the
runs themselves, none post-ship — the honest count): (1) the s57 dch
living-surfaces guard pinned the retired `onSaved={fetchUsers}` —
re-anchored to the updateUser wiring at the GREEN checkpoint (a
lockstep pin the blast-radius survey missed); (2) the s43
api-robustness calendarView message pin expected the old three-option
error string — re-anchored to the month/week form + a not-agenda
absence guard (the full-suite run caught it); (3) the e2e picklist
rename step timed out on a locator that had ALREADY matched its row
— input VALUES are not textContent, so the `hasText: "Probe Source"`
row filter resolves to nothing once the row swaps to edit mode; the
fill re-scoped to the card (the run caught it; the s71
strict-mode-anchor lesson's sibling). RED: **35 failed exactly** (the
settings-profile-parity suite's 25 [the 26th it — the N-72c7 upload
label — green-through-RED by design, the S49-P3 precedent] + the
rewritten settings-rollback 4 + the body-pregate 13th-route it + the
re-anchored dch agenda enum + the page-layout itemRow/deleteBtn pair +
the two mid-flight lockstep re-anchors). GREEN: S72-P1..P8 all landed
(P1 the ListEditor bordered-row rewrite with the itemRow/deleteBtn
page-layout records + the Pencil/Save/Trash2 icon imports; P2 the
props-driven ConfigEditor + the resolved-epoch DefaultsEditor + the
fallback initializers + the pure set(); P3 the users PATCH gate; P4
the agenda retirement in both the page + the route; P5 the Data panel
space-y-6 with the wrapper retired; P6 the four export icons; P7 the
updateUser store action + the Account card's store-user read + the
toast/label/loading-branch sextet; P8 the raw-keystroke inputs + the
placeholders); P9 the three e2e additions. Non-vacuousness: 35 failed
| 473 passed (508) in the pre-fix 0e40a09 worktree (node_modules
hard-linked via cp -al, only the seven modified test files); clean
teardown. Full gate: lint 0/0 · tsc 0 · **1330/1330 unit (81 suites,
+30)** · build clean · **122/122 e2e on a fresh CI=1 boot (3.0m, all
9 mobile-nav checks green)**. LIVE: the bordered rows (8/8 seeded,
zero chips, the red Trash2 pair); the rename round-trip in place
(restored pristine); the focus SURVIVING the debounce flush with the
PUT landing (stored USD confirmed, AED restored); the Data panel's
computed 24px; the four export icons; the placeholders; the profile
sequencing (form-only preview → the pre-reload Account-card img →
the post-reload topbar); the drawer at TRUE 390px with focus
restored (the offsetParent-null probe artifact for fixed elements
run down; the real-click precedent); zero overflow ×10; NO Tailwind
v4 bug; the closing census MATCH with the probe photo cleared. Docs:
SKILL v1.69.0 (§16bl + project_state, 6509 → 6619, via the
assert-first scripts/skill_edits_s72.py) + README/AGENTS/CLAUDE/PAD
at 1330+122 (badge 1452) + session_138.md + this record + the repo
worklog; .env/.env.example verified (no env surface change). Estimate
drift: +30 its (the plan's open count exact) · 122 e2e exact · the
e2e-waits census now 5 (the two annotated 1200ms defaults-debounce
settles, recorded for the next graduation census).
