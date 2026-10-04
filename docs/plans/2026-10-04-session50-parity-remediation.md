# Session-50 Parity Remediation Plan (2026-10-04)

Session 50 on `main` @ `c543b36` (the session-49 code `07d66b5` + the
operator's `docs/session_92.md` transcript + a 271-file `skills/` refresh;
`git diff c543b36 07d66b5 -- src tests` is EMPTY — zero app-code drift).
Baseline gate on the refreshed tree: **lint 0/0 (enforced) · tsc 0 ·
1160/1160 unit (72 suites)** — the documented state exactly. `.env`
re-verified (`DATABASE_URL="file:../db/custom.db"`, `AUTH_SECRET` set,
db/ at the repo root); `db:push` + `db:seed` run — the database pristine
(15 contacts / 24 leads / 10 accounts / 23 activities / 12 events + 4
users, API-counted); the dev server healthy on :3000; the vitest (5.0.1)
+ playwright (1.63) configs verified standing (`skills/` excluded from
lint/tsc/vitest by the established config trio — re-verified by 50-b).

## The standing layers (46th session, NO DRIFT)

The reference bundle fresh-fetched + hash-compared BEFORE planning (the
agent-browser login → the in-page arrayBuffer fetch of
`/assets/index-DZ-xbrIm.js` → the rolling-hash comparison against the
cached `/tmp/ref-bundle-app.js`): **IDENTICAL** — size 1,631,071, h1
982956926, h2 172713453, first/last 16 bytes exact (the md5
`a70a637fcf1d4291da8e0d965676dc11` line — the TWENTY-FIRST consecutive
stable session). The reference census (46th): the demo data still zero
(KPIs "0"/"$0.0k"/"$0k"/"0%"); the mobile-nav defect stands at a TRUE
390px (nav w=0, 8 links in DOM, 0 visible, no hamburger, scrollW 390).

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-49 re-audit (50-a, fresh eyes on the 21-file diff)

All five session-49 fix families verified GENUINE at file:line — P1 the
filter-membership validation (reports:84-85 + export:73-74,
`REPORT_STATUSES` at constants:459-473, owner/source open with the
in-file rationale, the status select re-wired), P2 the AND-wrap
(reports:108-110 + export:87-89, the bare overwrite form gone), P3 the
normalizers (saved-reports:108-117 + the Load wiring
reports-page:381-382), P4 the stale-toast hoist (leads-page:136-137),
P5 the LEAD_SOURCES removal (the pin re-anchored, consumers verified).
The e2e layer: exactly 2 annotated `waitForTimeout` keeps (:454, :2204),
the N-48e tightening at :1532, **111 exact**. Pins mechanically
non-vacuous in a `1c76660` worktree: **9 failed | 17 passed** (the
documented arithmetic EXACT — the 17 = 16 pre-existing + the 1
green-through-RED guard); the same three files **26/26 at HEAD**; full
suite 1160/1160. Zero suppressions in the diff. **No regressions.**

### B. The graduation audit (50-b: the ledger + the fresh-eyes sweep)

**ZERO graduations** — all 13 standing-ledger items re-confirmed at
file:line on HEAD (7th consecutive session; the only drift the s49 code
itself: reports/export findMany anchors +30/+18, the crm.spec reset test
:2108→:2179). The INFO family ALL UNCHANGED (F-47c with the page-side
anchor drifted :702→:709, N-47d with leads :339→:346, N-48c, N-48f,
N-48j). The .env parity HOLDS (exactly one line differs: AUTH_SECRET).
The skills/ exclusion HOLDS in all three configs. Fresh-eyes on
topbar/crm-store/Dashboard: zero staleness.

### C. The new findings (the session-50 mandate)

- **N-50a/N-50k (INFO, docs-accuracy)** — `CLAUDE.md:115`: the Build
  Commands table still says e2e "110 checks" while :38 and :290 say 111
  (the `--list` truth: 111 tests in 4 files — 94 crm + 9 auth + 7
  mobile-nav + 1 setup; s49 fixed 3 of the 4 carriers in the file,
  missed the table row).
- **N-50b (INFO, docs-accuracy)** — `Project_Architecture_Document.md`
  :724: the golden-path e2e row says **93** but `crm.spec.ts` has 94
  tests; the table's e2e rows sum to 110 vs the Total's 111 (a chronic
  off-by-one — each session bumps only its own row's +1).
- **N-50c (LOW, living-inventory staleness)** — `neo-crm_SKILL.md:272`
  (§4.4): the constants inventory still lists `LEAD_SOURCES` as living
  after S49-P5 removed it — the paragraph's own s42 DEFAULT_SETTINGS
  precedent note describes the exact fix this case needed.
- **N-50d (LOW, same class)** — `AGENTS.md:214-216`: the living guidance
  still cites the "DOM-pinned source vocabularies" as `LEAD_SOURCES` =
  Call/Email/Website/Partner and `CONTACT_SOURCES` = the five emoji
  options — **both constants removed** (s48/s49); the living lists are
  `LEAD_SOURCE_OPTIONS` / `CONTACT_SOURCE_OPTIONS`.

## The operator-decision standings (re-verified, unchanged)

The two standing operator decisions — the **CSV formula-injection
posture (b)** (the =/+/@/tab/CR guard via `guardFormulaPrefix`, '-'
deliberately excluded, templates + parser outside) and the
**source-vocabulary documented-parity reconciliation** (no enum
membership on source; the five-vocabulary fragmentation is the
reference's product design) — were landed in session 48, re-verified
genuine by the 49-a and 50-a worktree proofs, and carry no new evidence
this session (the bundle is byte-identical for the 21st consecutive
time). **Both stand as-decided; nothing to re-litigate.**

## The INFO-family triage (the session-49 "suggested next", DECIDED)

- **N-47d (the dead entity-dialog edit branches) → FIX THIS SESSION
  (S50-P1, the headline).** The three create dialogs
  (ContactDialog/AccountDialog/LeadDialog in
  `src/components/shared/entity-dialogs.tsx`) carry full dual-mode
  machinery — the `contact`/`account`/`lead` entity props, the
  `createMode` locals, the `!createMode` edit branches (~170 lines: the
  AccountForm edit superset with Tier/Owner/Key, the ContactForm
  Priority select, the LeadForm edit grid), the update-verb submit
  ternaries, the "Edit X"/"Save Changes" title/footer ternaries — but
  every caller passes `setEditing(null)` ONLY (accounts:87/:203/:662,
  contacts:102/:346/:703/:969, leads:86/:346/:735): the branches are
  UNREACHABLE. The live edit surface is the EntityEditDialog family
  (W7/wce/Mke, `editTarget`-driven) — and the reference itself NEVER
  reuses its create dialogs for editing (the s28 bundle extraction).
  This is the exact src-dead-removal class the house has executed twice
  (s48 CONTACT_SOURCES, s49 LEAD_SOURCES), with one difference: the
  dead code is a branch family inside living components, not a constant.
  Removal is behavior-preserving (unreachable by construction), pin-safe
  (verified: zero pins on `createMode`/the edit branches —
  contact-photo pins the photo HANDLERS :515/:530 not the initializer,
  dialog-clear-parity pins the shared payload mappings, page-layout pins
  the no-description/no-placeholder contracts, entity-edit-dialog pins
  the SEPARATE edit file + the pages' EntityEditDialog wiring), and
  parity-safe (the reference's own create dialogs are create-only).
- **F-47c (the lead blank-select parity quirk) → KEEP DOCUMENTED
  PARITY.** The reference's own Mke edit dialog offers the 4-option
  Status set that renders blank for won/lost/negotiation/proposal leads
  — its own inconsistency (the s28 record), mirrored exactly. Fixing it
  would diverge from the reference's edit-dialog vocabulary.
- **N-48c (the dashboard activities zero-guard) → KEEP AS-PLANN.** The
  s47 guard is a deliberate choice on a surface the reference does not
  have (its dashboard export menu is entirely dead — bundle-verified);
  a silent no-op on a zero-count menu item beats a confusing empty
  artifact there, while the settings surface (the reference's real
  surface) keeps the empty-artifact download.
- **N-48f (the raw-dump "[object Object]" cells) → KEEP DOCUMENTED
  PARITY.** The reference's own String()-based dumps render the same.
- **N-48j (the duplicated dashboard builders) → KEEP MAINTAINABILITY
  NOTE.** The duplication is a deliberate consequence of the s47
  client-side-export rewire (the pages' own conventions, verbatim);
  consolidation is a refactor with churn risk and zero parity gain.

## The fixes (S50-P1..P4, RED-first)

### S50-P1 — the N-47d dead-edit-branch retirement

`src/components/shared/entity-dialogs.tsx`:
- **AccountDialog/AccountForm** — drop the `account` prop from both;
  the title → `"Create New Account"`; the form state initializers → the
  plain create defaults (tier keeps the `settings?.defaultTier ?? "B"`
  fallback — the payload's workspace-default carriage, documented since
  s5); the submit → `createAccount(payload)` only; the toast →
  `"Account created"`; the footer → `"Create Account"`; the
  `createMode` ternary at the body → the create branch unwrapped (the
  8-field reference set); the edit superset branch (Tier/Owner/Key) →
  DELETED; `updateAccount` + `users` dropped from the store destructure
  (users feeds only the dead Owner select); the s5 comment's "EDIT
  keeps our full superset" line → the s50 retirement record.
- **ContactDialog/ContactForm** — same treatment: prop dropped, title
  `"Create New Contact"`, initializers plain (source "email", priority
  "warm" — the payload spread keeps carrying both), submit
  `createContact` only, toast `"Contact created"`, footer `"Create
  Contact"`, the two `{createMode && (<h3>…)}` section headers →
  unconditional, the `{createMode ? "Email *" : "Email"}` label →
  `"Email *"`, `required={createMode}` → `required`, the
  `{!createMode && (Priority select)}` block → DELETED,
  `updateContact` dropped from the destructure, `key={contact?.id ??
  "new"}` → `key="new"`.
- **LeadDialog/LeadForm** — same: prop dropped, title `"Create New
  Lead"`, initializers plain (value "", stage `settings?.
  defaultLeadStage ?? "new"`, source "email", dates ""), submit
  `createLead` only, toast `"Lead created"`, footer `"Create Lead"`,
  the `createMode` ternary → the create branch unwrapped (the 7-field
  reference set with the Status+Source pair), the edit grid (the
  LEAD_STAGES superset + the date pair) → DELETED, `updateLead` dropped
  from the destructure.
- **EventDialog/ActivityDialog UNTOUCHED** — their edit modes are LIVE
  (activities-page:206, calendar:352/:424/:484).

The three pages — the dead `editing` states + their `setEditing(null)`
calls + the `contact={editing}`-family props removed:
`accounts-page.tsx` (:87, :203, :662), `contacts-page.tsx` (:102, :346,
:703, :969), `leads-page.tsx` (:86, :346, :735). The `Account`/
`Contact`/`Lead` type imports stay (the `editTarget` states use them);
the dashboard's quick-create trio (page.tsx:660-662) already mounts the
dialogs entity-prop-free — unchanged.

### S50-P2 — the four docs-accuracy carriers (N-50a–d)

- `CLAUDE.md:115`: "Playwright E2E (110 checks, needs build first)" →
  **111**.
- `Project_Architecture_Document.md:724`: the golden-path e2e row 93 →
  **94** (the table then sums 9+1+94+7 = 111 = the Total).
- `neo-crm_SKILL.md` §4.4 (~:272): `LEAD_SOURCES` out of the living
  constants inventory (the s50 record in its place, the s42
  DEFAULT_SETTINGS precedent idiom).
- `AGENTS.md:214-216`: the source-vocabularies guidance → the living
  `LEAD_SOURCE_OPTIONS` (Call/Email/Website/Partner — the dialogs' own
  list) / `CONTACT_SOURCE_OPTIONS` (the five emoji options) pair.

### S50-P3 — the INFO-family triage records

The keep-decisions above (F-47c, N-48c, N-48f, N-48j — each with its
rationale) + the N-47d closure recorded in SKILL v1.47.0's new §16ap
and `docs/session_93.md` (the standing-ledger INFO family shrinks by
one; the re-anchored list: F-47c, N-48c, N-48f, N-48j).

### S50-P4 — the standard docs suite

README (badge 1271 → the new unit count + the session-50 paragraph),
AGENTS (the counts + the session-50 block + the S50-P2 fix), CLAUDE
(the counts), PAD (the s50 row / the new suite / the e2e row fix),
SKILL **v1.47.0** (frontmatter + project_state + the H1 + the new
§16ap), `docs/session_93.md`, this plan's execution record, both
worklogs. `.env`/`.env.example` re-verified (no env surface change).

## Pre-execution validation (done, at file:line)

- **Pin blast radius (verified)**: `contact-photo.test.ts` pins the
  photo handlers (:515 `photoUrl: body.data!.file_url!`, :530
  `photoUrl: ""`) — NOT the initializer; `dialog-clear-parity.test.ts`
  pins the shared payload mappings (`industry: form.industry || null`
  etc.) — all stay verbatim in the create payloads;
  `page-layout.test.ts` pins no-DialogDescription + the John-Doe-only
  placeholder census — both preserved; `entity-edit-dialog.test.ts`
  pins the SEPARATE edit file + the pages' EntityEditDialog wiring —
  untouched; `contact-surfaces.test.ts` pins the h3 section headers —
  they become unconditional (still present); `leads-inline.test.ts`
  pins the store's updateLead (the store verb, not the form);
  `mutation-feedback.test.ts` pins the submit else-branches — the
  failure toasts stay. Zero pins on `createMode`, the edit branches,
  the entity props, or the pages' `editing` states.
- **E2e census**: the create paths are pinned (crm.spec:42-47 the Lead
  create round-trip with the "Lead created" toast; :2097 the Create
  Contact submit); no e2e exercises an edit mode through the create
  dialogs (they never could — the branches were unreachable); the
  mobile-nav + geometry families untouched.
- **Lint surface**: the `users`/`updateAccount`/`updateContact`/
  `updateLead` destructure drops are REQUIRED for the 0/0 gate (unused
  vars are errors); the type imports stay (onSaved + editTarget).

## RED pins (planned: 6 RED + 3 guards)

`tests/create-dialog-single-mode.test.ts` (new file, the house
source-structure idiom):
1. The three Dialog wrappers carry NO entity prop (the
   ContactDialog/AccountDialog/LeadDialog signature regions contain no
   `contact?:`/`account?:`/`lead?:`) — RED on HEAD.
2. The three Form regions carry NO `createMode` local and NO
   `!createMode` branch — RED on HEAD (the regions are sliced between
   function boundaries; EventForm/ActivityForm are OUTSIDE them).
3. `entity-dialogs.tsx` references NO `updateContact`/`updateAccount`/
   `updateLead` (the store verbs stay in the store + the edit dialog;
   the FILE's references go to zero) — RED on HEAD.
4. The three pages declare NO dead `editing` state and mount the
   dialogs WITHOUT entity props (`setEditing` count = 0 per page) — RED
   on HEAD.
5. GUARD (green through RED): the create-mode surfaces intact — the
   three "Create New X" titles, the three "X created" toasts, the
   CREATE_LEAD_STAGES select, the CONTACT_SOURCE_OPTIONS "How did you
   meet?" select, the 8-field account create set.
6. GUARD: EventDialog/ActivityDialog keep their dual-mode (the `event`
   prop + `createMode` present in their regions) — the live edit
   surface untouched.

Predicted RED: **4 failures + 2 green-through-RED guards** (the failure
SET must equal the code-change pin set).

## Gate + LIVE verification

Gate: lint 0/0 (enforced) · tsc 0 · full unit (1160 − the re-anchored
constants-family count + the new pins) · build clean · 111/111 e2e on a
fresh CI=1 boot (the 7 mobile-nav checks included). LIVE battery on the
dev server: the three create dialogs open + submit + toast (the
create round-trips through the API), the ⋮-menu Edit paths still route
through EntityEditDialog (the edit round-trips), the drawer verified in
every direction, zero 390px overflow on all nine routes, NO Tailwind v4
bug (the standing token contract re-verified), zero probe residue
(15/24/10/23/12 pristine).

## Deferred pointers (carried forward)

The standing ledger (13 items, 7 sessions zero graduations — the N-47d
graduation expected this session is a DELIBERATE closure, not drift);
the INFO family re-anchored to F-47c, N-48c, N-48f, N-48j (all triaged
KEEP with rationale); the drift re-sweep next live visit; the e2e sleep
census stands at 2 (both annotated no-op-contract keeps).

## EXECUTION RECORD (2026-10-04, session 50 — SHIPPED)

- **RED**: exactly **4 failures + 2 green-through-RED guards** (the
  plan's arithmetic exact — the create-dialog-single-mode file's 4
  target its + the 2 guards). Full suite through RED: 4 failed / 1162
  passed — all 1160 pre-existing checks green. One pin-shape
  correction during RED verification (the toast guards re-pointed at
  the STRINGS so they ride the ternaries green through RED — the
  s49-precedent class); the FINAL pin file re-proven in the pre-fix
  worktree: **4 failed | 2 passed** there, 6/6 at the fix.
- **GREEN (S50-P1)**: the N-47d retirement — the three create dialogs
  create-only (entity props, createMode locals, the ~170-line edit
  branches, the update-verb ternaries, the title/footer ternaries
  removed; the create field sets byte-preserved), the three pages'
  dead `editing` states removed, the unused imports dropped
  (Checkbox, ACCOUNT_TIERS, CONTACT_PRIORITIES, LEAD_STAGES),
  EventDialog/ActivityDialog untouched. One pre-existing pin
  re-anchored (leads-inline's create-default → the create-only
  initializer, the raw "email" unchanged).
- **S50-P2**: the four docs carriers (CLAUDE 110→111, PAD 93→94, SKILL
  §4.4, AGENTS vocabularies).
- **Gate**: lint 0/0 (enforced) · tsc 0 · **1166/1166 unit (73
  suites, +6)** · build clean · **111/111 e2e on a fresh CI=1 boot**
  (all 7 mobile-nav checks green).
- **LIVE**: the create round-trip (probe lead created → row + API →
  deleted via the confirm → zero residue); the ⋮ Edit routes through
  the EntityEditDialog (populated "Edit Lead"); the contact/account
  create dialogs verified structurally; the drawer both directions
  (288px portal nav, 8/8 truly visible, aria-expanded, dual lock;
  Escape → visibility:hidden, 0/8, unlocked); zero 390px overflow on
  all nine routes; NO Tailwind v4 bug (blur(4px) + the pinned
  shadow); zero probe residue (15/24/10/23/12 pristine).
- **Screenshots**: 02/05 + 11/12 re-captured + **59-create-dialog-
  single-mode NEW** (the fix surface, 1440×900) — 59 VLM-verified 4/4
  PASS.
- **Docs**: README (badge 1277 + the session-50 paragraph + the suite
  list + counts); AGENTS (1166/111 + the session-50 block + the
  vocabulary fix); CLAUDE (1166 ×3 + the e2e 111); PAD (the s50 row /
  73 suites / 1166+111 / the golden-path 94 / the checklist / the
  command table); SKILL **v1.47.0** (frontmatter + project_state +
  the H1 + the new §16ap + the §4.4 fix); `docs/session_93.md`; this
  record; both worklogs. `.env`/`.env.example` re-verified (no env
  surface change).
- **Shipped**: commit on main + the SSH-wrapper push to
  `git@github.com:nordeim/neo-crm.git` (the operator ed25519,
  shredded after — the s43-s49 runbook).
