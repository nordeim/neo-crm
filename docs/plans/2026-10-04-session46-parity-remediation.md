# Session-46 Parity Remediation Plan (2026-10-04)

Session 46 on `main` @ `c706f01` (the session-45 code at `a7cd268` + the
operator's `docs/session_84.md` transcript commit — src identical, verified
by empty diff). Baseline gate on the pulled clone: **lint 0/0 (enforced) ·
tsc 0 · 1095/1095 unit (57 suites) · build clean** — the documented state
exactly. `.env` verified standing (`DATABASE_URL="file:../db/custom.db"`,
`db/` at the repo root); the database pristine (15 contacts / 24 leads /
10 accounts / 23 activities / 12 events / 4 users — counted via the
absolute-URL Prisma probe); the dev server healthy on :3000
(`/api/health` → ok/healthy/db up); `agent-browser 0.38.1` ready. The
vitest (5.0.1) + playwright (1.63) configs verified standing (`skills/`
excluded from lint/tsc/vitest by the established config trio).

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-45 re-audit (fresh eyes on `a7cd268`)

All five session-45 fix families verified GENUINE — P1 the reports PDF
rejection guard (`.catch` chained on the real promise; `pdf-export.ts`
has no internal catch so the guard is live; the happy path toast-free),
P2 the localStorage READ guards (the repo-wide census re-run: exactly 4
sites — 2 guarded writes + 2 now-guarded reads; timer lifecycle
byte-identical), P3 the topbar AbortController (controller per run,
signal on fetch, abort in cleanup, the aborted early-return BEFORE the
reset — the s43-P4 semantics preserved), P4 the calendar events
last-call-wins token (`call()` is total so the error path is unchanged;
the hydrate → calendar handoff proven by issuance order), P5 the
format.ts hygiene pair (zero remaining references; the NaN guard live).
The 15 pins verified non-vacuous (each fails on the pre-fix source) and
idiom-conformant; the five suites re-ran green 18/18. **No regressions**
(zero suppressions added; nothing beyond the five families in the diff).

Notes (INFO-grade, recorded): **N-46a** the topbar's s44-P5 envelope
reset lacks the abort-awareness the s45-P3 catch carries — an abort
landing during the body-parse window resolves `body` to null via the
swallowed `.catch(() => null)`, routing a SUPERSEDED run into the
envelope-reset branch (transient dropdown close; self-corrects within
250 ms + fetch). **N-46b** the events token is not bumped on
logout/resetData and no-arg refetches supersede the calendar window
(pre-existing, cosmetic). **N-46c** pin-span robustness (fixed char
spans + comment-stripping = false-RED risk on comment growth). One
worklog correction: the s45 happy-path guard lives in
`format-hygiene.test.ts`, not `report-pdf-guard.test.ts` (the pdf
"call stays" anchor is folded into pin 1) — totals reconcile at 15.

### B. The deferred-findings graduation audit

**ZERO graduations** — all 13 standing-ledger items re-confirmed at
file:line on HEAD (benign line drift only: the crm-store items +10 lines
from the s45-P4 token block; the topbar img sites +12 from the s45-P3
controller block). All four deferred pointers re-confirmed unchanged;
pointer (b) sharpened one notch — `CONTACT_SOURCES` (`constants.ts:231`)
is src-dead (the dialogs consume `CONTACT_SOURCE_OPTIONS`; only the
constant's own test pin reads it).

Fresh-eyes findings (each manually validated at file:line this session):

- **F-46a (LOW-MED, the headline) — the mutation-failure silence family
  (10 fix sites; the raw census finds 11 mutation call sites in the five
  pages, of which `importContacts` at `contacts-page.tsx:262` is already
  handled by the s39-P2 three-way banner).** The store's `call()` is total
  and toasts nothing; the codebase's own convention (entity-dialogs,
  profile, settings editors) toasts every failure. Ten page-level mutation
  sites discard the failure silently:
  3 EntityEditDialog submits — `accounts-page.tsx:620-636`,
  `leads-page.tsx:677-692`, `contacts-page.tsx:926-941` (`if (res.ok)
  { close }` with no else: a failed PUT strands the dialog open with a
  dead-feeling Save);
  5 inline deletes — `contacts-page.tsx:193-196`, `leads-page.tsx:287-290`,
  `accounts-page.tsx:173-179` (a literally empty `if (res.ok) {}` whose
  comment claims "toast handled globally by store refresh" — FALSE: the
  store has zero toast calls), `activities-page.tsx:390-392`,
  `calendar-page.tsx:492-494`;
  2 inline mutations — `activities-page.tsx:195-197` (toggleComplete),
  `contacts-page.tsx:189-191` (updateRole). A network blip or a 400
  leaves the user with zero feedback on all ten surfaces.
- **F-46b (LOW-MED) — the settings DefaultsEditor per-keystroke write
  seam.** `settings-page.tsx:407-415`: every keystroke on the free-text
  inputs (`:438` defaultCurrency, `:447` defaultLeadStage, `:456`
  defaultTier, `:468` followUpDays) fires an immediate full-defaults
  PUT. The s43-P3 membership guards (`settings/route.ts:94` stage /
  `:103` tier) now COLLIDE with the reference-mirrored immediate-persist
  idiom: typing "Negotiation" produces a guaranteed-failing PUT per
  keystroke ("N" → 400 "Default lead stage must be a valid stage") → a
  red toast per keystroke; the intermediate writes are
  last-RESOLVED-wins with no ordering; there is no rollback. The
  reference's own idiom works only because it validates nothing.
- **F-46c (LOW) — the settings editors' optimistic no-rollback + the
  remount-key collision.** `settings-page.tsx:340-348` `mutate()`: a
  failed picklist PUT (label > 60 chars / 41st entry → 400 at
  `settings/route.ts:65/:68`; no client-side cap) leaves the phantom
  item in the editor. The remount keys `cfg-${JSON.stringify(settings)
  .length}` / `def-…` (`:149`/`:158`) key on JSON LENGTH — same-length
  snapshots collide (an add+remove of equal-length items → no remount →
  stale local state).
- N-46d (INFO) `accounts-page.tsx:41` — `leads` destructured, never
  used (exactly one occurrence in the file: the destructure itself).
- N-46e (INFO) `entity-edit-dialog.tsx:145/:156/:231-232` — the
  `isLoading` prop is dead (no consumer passes it; "Saving…" unreachable;
  no double-submit guard). Deferred — wiring it is a product-shaped
  choice, removal changes a shared component's public surface.
- N-46f (INFO) the five client-side CSV exports ship no UTF-8 BOM (the
  server's `/api/export` does). Parity-preserving (the reference was
  BOM-less); seed data is ASCII. Deferred.
- N-46g (INFO) `activities-page.tsx:125-127` — the dead
  `?? a.createdAt` tail (`a.createdAt ?? a.dueAt ?? a.createdAt` — the
  trailing arm can only return the already-known-nullish createdAt; the
  s42 dead-?? class).
- N-46h (INFO) calendar KPIs mix filtered `visible` vs raw `events`
  baselines — cosmetic trend-text skew when a filter is active. Deferred.
- N-46i (INFO) `/api/upload` has no rate limit (the auth family only).
  Deferred (operator security posture).
- N-46j (INFO) `CONTACT_SOURCES` src-dead — folds into the pointer-(b)
  vocabulary reconciliation decision.

Clean surfaces verified in full by the audit: profile-page, login-card,
the auth API family, upload/uploads, search/users/opportunities/health,
the settings API (merge-semantics PUT confirmed — a defaults PUT cannot
wipe picklists), entity-dialogs' own six dialogs, all listener/timer
seams.

## The standing layers (42nd session, NO DRIFT)

The reference bundle fresh-fetched + md5-compared: **IDENTICAL**
(`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes — the SEVENTEENTH
consecutive stable session). Logged into the reference with the operator
credentials: demo data still zero (42nd session — Total Leads 0, Deals
Closed $, "No upcoming activities", empty Recent Deals); the mobile-nav
census at a TRUE 390px — the reference's defect stands (NAV w=0, 8 links
in DOM, 0 visible, no hamburger). OUR clone's drawer verified live in
every direction: OPEN via the REAL trigger ("Open navigation menu",
36×36, visible) → 8/8 links truly visible (getClientRects + computed
visibility) + dual scroll-lock (body AND main hidden) + the trigger's
`aria-expanded:"true"`; Escape → 0 visible + `inert` + unlocked +
`aria-expanded:"false"`. Zero 390px overflow on all nine routes
(scrollWidth 390 == clientWidth 390 everywhere incl. /Profile). NO
Tailwind v4 bug surfaced — the standing token contract re-verified
(literal-hex `@theme`, the re-pinned `--shadow-sm`/`--blur-sm`, the
vendored tw-animate.css, the `@tailwindcss/postcss` wiring; tailwindcss
4.3.3).

## The fixes (S46-P1..P5, RED-first)

### S46-P1 — the mutation-failure feedback sweep (F-46a, 11 sites)

The entity-dialogs convention verbatim — `toast.error(<title>,
res.error)` on the failed branch, the happy path untouched:

- 3 EntityEditDialog submits gain the else:
  `else { toast.error("Could not save account" | "Could not save lead" |
  "Could not save contact", res.error); }` (the dialog stays open — the
  user keeps their edit; the existing `if (res.ok) { close }` retained).
- 5 inline deletes capture the result:
  `const res = await deleteX(…); if (!res.ok) toast.error("Could not
  delete account" | "contact" | "lead" | "activity" | "event",
  res.error);` — the accounts site's empty `if (res.ok) {}` + its false
  "toast handled globally" comment replaced.
- 2 inline mutations: toggleComplete → "Could not update activity";
  updateRole → "Could not update contact".
- The toast import added to accounts/contacts/activities/calendar pages
  (leads-page already imports it — its own `:132` guard).

### S46-P2 — the DefaultsEditor debounced persist (F-46b)

One shared trailing debounce inside DefaultsEditor — the no-save-button
parity line preserved (changes still persist automatically; a 500 ms
window now elapses first):

- `set()` updates local state immediately, stores the snapshot in a ref,
  and (re)schedules a 500 ms trailing flush — no per-keystroke PUT, so
  the s43-P3 membership 400s meet only the FINAL value (one toast for a
  genuinely-invalid final value, zero toasts while typing).
- The flush is serialized (a `flushing` guard + re-schedule-on-completion
  if a newer snapshot arrived) — two PUTs can never race within the
  editor; the last-RESOLVED-wins window closes.
- The unmount cleanup clears the timer AND flushes a pending snapshot —
  a typed edit is not lost on navigation.
- All six fields ride the same `set()` (the Selects' 500 ms persist
  delay is imperceptible; uniform wiring, uniform pins).

### S46-P3 — the settings failure rollback + the remount key (F-46c)

- `mutate()` gains the guarded revert on failure: after the existing
  toast, `setLists((cur) => (cur[key] === next[key] ? { …cur, [key]:
  prev } : cur))` — the phantom item reverts unless the user kept
  editing (reference-equality guard on the array).
- The remount keys move off JSON length onto the full serialization —
  `cfg-${JSON.stringify(settings)}` / `def-${JSON.stringify(settings)}`
  — same-length snapshots can no longer collide.

### S46-P4 — the topbar envelope-reset abort-awareness (N-46a)

`topbar.tsx:81-88`: the `else` becomes `else if
(!controller.signal.aborted)` — the envelope reset now carries the same
handoff semantics the s45-P3 catch already has. A superseded run whose
body-parse resolves late (post-abort) can no longer close the newer
run's dropdown. **Pin evolution required**: the s44-P5 pin's regex pins
`} else {` — it evolves with this fix to match the gated shape (the
pinned INTENT — the envelope path resets BOTH results and dropdown — is
preserved; the evolution is documented in the pin's comment, the s46
note appended).

### S46-P5 — the dead-code hygiene pair (N-46d + N-46g)

- `accounts-page.tsx:41` — the unused `leads,` destructure removed.
- `activities-page.tsx:125-127` — `a.createdAt ?? a.dueAt ??
  a.createdAt` → `a.createdAt ?? a.dueAt` at both the todayCount and
  yesterdayCount filters (the trailing arm is unreachable-non-null by
  construction).

## The LIVE-probe findings (discovered during the S46-P1 verification)

The P1 offline probe refused to produce its toast through the edit
dialog — the diagnosis surfaced TWO pre-existing bugs (each reproduced
on the stashed pre-session code, so both pre-date session 46):

- **F-46f (LOW-MED, pre-existing) — the three EntityEditDialogs open
  with EMPTY fields.** `entity-edit-dialog.tsx:159-169`: the `form`
  useState initializer reads `initial` at the component's FIRST render —
  which happens at PAGE MOUNT, when `editTarget` is null and `initial`
  is all-empty. No key, no re-sync: the form state stays empty forever,
  regardless of which row's Edit opens the dialog (LIVE-verified on
  /accounts — the Edit Account form renders three empty inputs). The
  bug was MASKED by F-46a: the submit sent empty fields → the API's
  name-required 400 → the silent failure did nothing, the dialog just
  sat there. The fix, the repo's own settings-editor idiom ("local
  state initializes from props at mount — never via setState-in-
  effect"): a per-target remount key on the three page usages —
  `key={editTarget?.id ?? "none"}` — every open re-initializes the form
  from the live `initial`.
- **F-46g (LOW, pre-existing) — the ghost dialog under every row-menu
  action.** The custom Dropdown (`ui/dropdown.tsx`) renders its items in
  a Radix Popover portal; React synthetic clicks on portal content
  bubble through the REACT tree to the TableRow's onClick — so clicking
  Edit / View Insights / Delete ALSO opens the row-click dialog
  (accounts: the insights dialog; contacts: the detail slide-over, on
  rows AND cards). LIVE-verified with a native trusted click: two
  `[data-state=open]` dialogs after one Edit click (the insights
  underneath, `aria-hidden:"true"`), and after closing the edit dialog
  the ghost is revealed. Radix's `composeEventHandlers` does NOT stop
  propagation (source-verified). The fix: click containment in
  `DropdownContent` itself — compose `e.stopPropagation()` into the
  content's onClick (no caller passes onClick today — census-verified),
  so item handlers run but nothing bubbles to clickable ancestors.

### S46-P6 — the edit-dialog remount keys (F-46f)

`key={editTarget?.id ?? "none"}` on the EntityEditDialog usages in
accounts-page / leads-page / contacts-page (3 lines) — the settings
editors' own keyed-remount convention verbatim.

### S46-P7 — the dropdown click containment (F-46g)

`ui/dropdown.tsx` `DropdownContent`: `{...props}` then a composed
`onClick` that calls the caller's handler (if any) and
`e.stopPropagation()` — one guard covering every row-action menu
repo-wide.

## Pre-execution validation (done, at file:line)

- **Pin blast radius**: the only existing pin touching these surfaces is
  `tests/topbar-search.test.ts` s44-P5 (evolves with S46-P4, above —
  intent-preserving, documented). ZERO pins exist on `updateSettings`,
  DefaultsEditor/ConfigEditor, or the eleven mutation sites
  (`account-surfaces` pins the row/insights/filter surfaces;
  `settings-data-tab` pins the DATA tab; `entity-edit-dialog` pins the
  anatomy/configs — none on the mutation-feedback spans).
- **E2e census**: the nine "delete" references are UI-visibility
  assertions, API-level cleanup calls, and the reset confirm text — NO
  e2e performs a UI-driven entity delete, clicks Save Changes inside an
  EntityEditDialog, or types into the defaults inputs (the settings e2e
  asserts tab/label visibility only; the profile Save Changes at :2013
  is a different component). The debounce and the error-toasts cannot
  trip e2e.
- **The finding validation**: all 11 F-46a sites read at file:line; the
  store's zero-toast state grep-verified; the s43-P3 membership guards
  confirmed at `settings/route.ts:94/:103`; the picklist caps at
  `:65/:68`; the remount keys at `:149/:158`; N-46d (exactly one
  occurrence), N-46g (both sites), N-46a (the else span) confirmed.

## RED pins (planned: 20)

- `tests/mutation-feedback.test.ts` — 11 its (one per fix site — the res
  capture + the exact toast vocabulary + the retained happy path — plus
  the four-page toast-import census).
- `tests/settings-debounce.test.ts` — 4 its (the trailing-debounce
  scheduling; the unmount flush; the serialized flush chain; the
  happy-path persist through flush).
- `tests/settings-rollback.test.ts` — 2 its (the guarded revert; the
  full-serialization remount keys).
- `tests/topbar-search.test.ts` session-46 describe — 1 it (the
  abort-aware envelope reset) + the documented s44-P5 pin evolution.
- `tests/dead-code-hygiene.test.ts` — 2 its (the destructure absence;
  the dead-tail absence at both filters).
- `tests/edit-dialog-remount.test.ts` — 3 its (the remount key on each
  of the three EntityEditDialog usages — F-46f).
- `tests/dropdown-containment.test.ts` — 1 it (the DropdownContent
  stopPropagation composition — F-46g).

Predicted RED: 20 + 4 = 24 failures, all 1095 pre-existing checks green
through RED (the evolved s44 pin stays green — its new shape ships WITH
the P4 code in the GREEN phase; pin-count arithmetic per the s43/s44/s45
precedent may shift ±1 — the failure SET must match the code-change pin
set exactly).

## Gate + LIVE verification

Gate: lint 0/0 (enforced) · tsc 0 · full unit (1095 + the new pins) ·
build clean · 108/108 e2e on a fresh CI=1 boot (the 7 mobile-nav checks
included). LIVE battery on the dev server: (1) a failed edit-dialog save
(bad payload via the API-backed validation, or a network-level failure)
toasts and strands-open; (2) typing a stage name letter-by-letter in
Default Lead Stage produces ZERO interim toasts and persists the final
valid value; an invalid final value toasts once; (3) a picklist add over
the 60-char cap reverts after its toast; (4) the topbar rapid-typing
probe still ends with the newest query's results (the P4 hardening
direction); (5) zero probe residue (15/24/10/23/12 pristine).

## Deferred pointers (unchanged unless noted)

The reports/export filter membership asymmetry; the 2 source
enum-membership sites (the vocabulary-reconciliation product decision —
N-46j's CONTACT_SOURCES src-dead note folds in); the CSV
formula-injection decision for the operator ((a) parity / (b) =+@tab-CR
/ (c) full-OWASP — covering BOTH csv.ts and entity-export.ts); the 11
e2e sleeps; the standing ledger (13 items, zero graduations); the drift
re-sweep next live visit. New INFO notes deferred: N-46b (token on
logout / no-arg supersede), N-46c (pin-span robustness), N-46e
(isLoading wiring), N-46f (client CSV BOM), N-46h (calendar KPI
baselines), N-46i (upload rate limit).

## EXECUTION RECORD (2026-10-04, session 46 — SHIPPED)

Executed RED-first exactly as planned, with two LIVE-discovered
families added mid-session (S46-P6/P7 below):

- **RED**: exactly **20 failures** (11+4+2+1+2 — the prediction exact),
  all 1095 pre-existing checks green through RED. After the F-46f/F-46g
  discoveries: +4 pins (3 remount keys + 1 containment) — **RED 24
  total**, all pre-existing green.
- **GREEN (S46-P1..P5)**: the ten-site feedback sweep (the entity-dialogs
  convention verbatim; the toast import added to four pages); the
  DefaultsEditor 500 ms trailing debounce + serialized flush chain +
  unmount flush; the guarded picklist revert + the full-serialization
  remount keys; the topbar `else if (!controller.signal.aborted)` gate
  (the s44-P5 pin EVOLVED with it, intent preserved); the hygiene pair.
- **GREEN (S46-P6/P7, the LIVE discoveries)**: `key={editTarget?.id ??
  "none"}` on the three EntityEditDialog usages; the DropdownContent
  click containment (`e.stopPropagation()` composed after `{...props}`).
  Three pins retargeted mid-GREEN (the s45 precedent — anchor and
  comment-strip-gap corrections, no code changes).
- **Gate**: lint 0/0 (enforced) · tsc 0 · **1119/1119 unit (63 suites,
  +24)** · build clean · **108/108 e2e on a fresh CI=1 boot** (all 7
  mobile-nav checks green).
- **LIVE (the definitive runs)**: the edit dialog opens POPULATED with
  exactly ONE dialog (no ghost); offline Save → PUT + toast + dialog
  stays; online Save → closes, no toast; offline Delete → toast + row
  retained; View Insights unaffected by the containment; the debounce —
  zero interim toasts, final persists, exactly ONE PUT at t+502 ms (the
  apparent double-PUT was a stacked-fetch-wrapper instrumentation
  artifact — absolute-vs-relative timestamps, identical bodies); invalid
  final → exactly ONE toast with the API's validation message; the
  61-char picklist add → toast + revert + API clean; topbar "khalid" →
  the newest query owns the dropdown. Zero residue: 15/24/10/23/12 +
  settings at seed.
- **Screenshots**: 02/11/12 re-captured (within noise) + **54-edit-dialog-
  populated NEW** (1440×900). 02 + 54 VLM-verified.
- **Docs**: README (badge 1227) · AGENTS (1119/108) · CLAUDE (1119) ·
  PAD (s46 row / 63 suites / totals / checklist / command table) · SKILL
  **v1.43.0** (§16al) · `docs/session_85.md` · this record · both
  worklogs. `.env`/`.env.example` re-verified (no env surface change).
- **Shipped**: commit on main + the SSH-wrapper push (the operator
  ed25519, shredded after — the s43/s44/s45 runbook).
