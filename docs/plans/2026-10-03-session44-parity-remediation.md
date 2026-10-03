# Session-44 Parity Remediation Plan (2026-10-03)

Session 44 on `main` @ `c4048b0` (= the session-43 code at `5ff767b` + the
operator's `docs/session_80.md` transcript commit — src identical). Baseline
gate on the pulled tree: **lint 0/0 (enforced) · tsc 0 · 1050/1050 unit
(51 suites)** — the documented state exactly. `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root verified
intact; the dev server healthy on :3000
(`/api/health` → `{"ok":true,"data":{"status":"healthy","db":"up"}}`);
no stale :3100 listener; `agent-browser 0.38.1` ready.

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-43 re-audit (fresh eyes on commit `5ff767b`)

All five session-43 fix families verified GENUINE — P1 the leads
contactId FK pair (parse branches + existence checks + create data +
census rows; the wire type matches, no include changes), P2 the nine
dead-`??` removals (all with live `!x ||` narrows; the auth `?? ""`
twins correctly kept — TYPE-load-bearing), P3 the settings quartet
(the optional-parse revival preserved), P4 the topbar wrap, P5 the
events from/to guards. **No regressions** (happy-path shapes
unchanged; touched suites 214/214 green). **New findings (each
manually validated at file:line; the headline trio LIVE-proven with
probe records, all cleaned by exact ID):**

- **N-44a (LOW-MED, LIVE-proven)** — `Account.health` is the last
  dead schema field end-to-end: the schema
  (`prisma/schema.prisma:62`, default "Healthy"), the wire type
  (`types/index.ts:31`), the seed (`prisma/seed.ts:88-97` —
  "Healthy"/"At Risk"/"Needs Attention") and two UI readers
  (`accounts-page.tsx:460-461` badge, `:73` CSV Health column) all
  carry it, but NEITHER accounts verb accepts it (the POST create
  data `accounts/route.ts:71-85` has no health field; the PUT
  branches `[id]/route.ts:18-76` stop at tier) — LIVE: POST
  `{"name":"N44a Health Probe","health":"At Risk"}` → 200 +
  `health:"Healthy"`; PUT `{"health":"Needs Attention"}` → 200 +
  `health:"Healthy"`. The stored column is frozen at its seed value
  forever (the badge can never change through any surface). The
  N-43a shape one model over.
- **N-44b (LOW, LIVE-proven)** — contacts POST silently drops
  `status`: the PUT accepts it (s42-P4, `contacts/[id]:116-129`) but
  the POST has no branch and no create-data field — LIVE: POST
  `{"name":"N44b Status Probe","status":"inactive"}` → 200 +
  `status:"active"`. Every contact is created "active" regardless of
  payload (the N-42b PUT-accepts-POST-drops mirror; API-only surface
  — the create dialog has no status control).
- **N-44c (INFO)** — reports still hardcodes `account: null` +
  `contact: null` (`reports/route.ts:367-368`); post-P1 the `...l`
  spread carries the real `contactId` into reports rows but `contact`
  is an extra key absent from the Lead wire type; the sources tab
  reads only name/source/stage — the drop is invisible.
- **N-44d (INFO)** — the P1 capability is API-only (LeadForm sends
  no contactId — the reference's 7-field dialog parity).
- **N-44e (INFO)** — settings `defaultCurrency` is the one remaining
  unvalidated default, but a census shows zero consumers outside the
  settings page itself — no poisoned-downstream trap.
- **N-44f (INFO)** — readSettings' leadStages fallback
  (`settings/route.ts:25`) omits "unqualified" vs `LEAD_STAGES` —
  but the SEED's stored list omits it too (both 7-value); entangled
  with the source-vocabulary product decision. Documented, untouched.
- **N-44g (INFO + a LOW micro)** — the topbar's `!body?.ok` path (a
  JSON 401/500 envelope) silently no-ops, leaving stale results open
  (only a network-level rejection hits the catch); no AbortController
  (an older in-flight response can overwrite a newer one's results —
  pre-existing, cosmetic blast radius). The MICRO: apply the catch's
  reset to the envelope path too.
- **N-44h (INFO)** — calendarView's `!view ||` narrow
  (`settings/route.ts:118`) is unreachable (after `?? "month"` view
  is always non-empty) — kept for symmetry with firstDayOfWeek where
  `!dow` IS live. Documented, untouched.

### B. The deferred-findings graduation audit

**ZERO ledger/pointer graduations** — all 13 standing-ledger items
re-confirmed at file:line (two mechanical line drifts from s43's own
P5 guard block: events findMany `:17→:27`, events POST isBadBool
`:95→:105` — rationale unchanged). The operator decisions remain
open (the CSV formula-injection posture, the source-vocabulary
reconciliation — the s43-P3 quartet makes the MECHANICS more
tractable, the calculus unchanged; all five surfaces still
disagree). The 11 e2e sleeps re-confirmed at the exact lines.
Fresh-eyes findings:

- **F-44a (LOW-MED, parity-PROVEN — the headline)** — the UI
  clear-gap family: the API's explicit-clear convention (present
  `""`/null → null) is unreachable from the five dual-verb dialogs —
  every `X: form.X || undefined` mapping DROPS the key when the user
  empties the field (JSON.stringify drops undefined), so the PUT's
  `"X" in body` branch skips and the OLD value persists while the
  save toasts success. Full census (all five dual-verb dialogs
  receive entity props for editing — leads-page:687,
  activities-page:570, calendar-page:555, accounts-page:653,
  contacts-page:953): **18 mapping sites** — AccountForm
  industry/email/phone/website/annualRevenue/employees/ownerId
  (:153-162), ContactForm accountId (:461-462 — the `{...form}`
  spread already clears the text fields via "", only the FK
  overrides), LeadForm email/phone/company/source (:748-753),
  EventForm description/location/relatedType (:1035-1041, the
  "none"→undefined ternary), ActivityForm notes/relatedType/
  relatedName (:1217-1222). The three EntityEditDialog pages
  (contacts/leads/accounts) already send `|| null` — the convention
  exists, the dual-verb layer missed it.
- **F-44b (LOW)** — the reports-page saveReport localStorage write
  is unguarded (`saved-reports.ts:180` setItem; the onSave handler
  `reports-page.tsx:292-301`): a quota/private-mode exception escapes
  the React event handler → uncaught error, no toast, dialog stays
  open. The leads-page saveView twin IS guarded
  (`leads-page.tsx:121-125` → `toast.error("Could not save view",
  "Browser storage is unavailable.")`) — a convention inconsistency.
- **F-44c (LOW)** — the dead account include: the reports leads
  findMany fetches `account: {select: {name: true}}`
  (`reports/route.ts:98`) but `serializeLead` unconditionally
  overwrites it with `account: null` (:367) — the fetched name is
  never delivered (the table renders name/source/stage only). Wasted
  LEFT JOIN on every reports read; the account-include half was
  never ledgered (the `contact: null` half is the documented s43
  decision).
- **F-44d (INFO)** — validation-depth family members (no
  non-negative floor on accounts annualRevenue/employees or leads
  value; the UI `min={0}` advisory-only) — depth-only.

## Standing layers (40th session, NO DRIFT)

- The reference bundle md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`,
  1,631,071 bytes — FIFTEENTH consecutive stable session, fresh-fetched
  from `/assets/index-DZ-xbrIm.js` + byte-compared against the s43
  cache).
- The reference's mobile-nav absence at a TRUE 390px (8 links in DOM,
  0 visible via the getClientRects+visibility census, nav w=0, no
  hamburger — 40th session).
- The reference demo data still zero (Total Leads 0 / $0.0k / $0.0k /
  $0k / 0% / 0 — 40th session).
- **The F-44a parity proof (NEW this session, both directions, on the
  reference)**: a probe event created → edit → clear the description →
  save → re-open: CLEARED (`""`); set Related To "Contact" → save →
  re-open: "Contact"; set Related To back to "None" → save → re-open:
  back to the "Select type" placeholder. **The reference PERSISTS
  clears** — our `|| undefined` drop-key is a real parity break. The
  probe event deleted afterward; the reference restored to zero (KPIs
  0/$0.0k/$0.0k/$0k, no probe residue on the calendar).
- Our drawer live in every direction (open via the REAL trigger: 8
  links truly visible + the body+main dual scroll-lock +
  `aria-expanded:"true"`; Escape: 0 visible + unlocked +
  `aria-expanded:"false"` — the s43 getClientRects+visibility census
  lesson applied).
- Zero 390px overflow on all nine routes (scrollWidth 390 ==
  clientWidth 390 on every route incl. /Profile).
- Our API's explicit-clear works end-to-end (LIVE: PUT
  `{"description":"","location":"","relatedType":""}` → all null) —
  the UI just never sends it. The Khalid probe event restored to its
  seeded state (description/location/relatedType/relatedName all
  null, contactId intact).
- Zero probe residue: 15 contacts + 24 leads + 10 accounts + 23
  activities + 12 events — the pristine seeded state.
- The gitignore negative space holds.

## The fixes (S44-P1..P6, RED-first)

### S44-P1 — accounts POST + PUT accept `health` (the headline, N-44a)

The N-43a shape one model over: the schema/wire type/seed/UI readers
carry the field, the routes must too. A new vocabulary constant (the
`ACCOUNT_STATUSES` pattern) + both verbs:

```ts
// src/lib/constants.ts (near ACCOUNT_HEALTH_BADGE:328):
export const ACCOUNT_HEALTH_STATUSES = ["Healthy", "At Risk", "Needs Attention"] as const;

// POST (with the other enum parses, before the create):
if (isBadString(body.health)) return ERR.BAD_REQUEST("Invalid health status");
const health = asString(body.health, { optional: true, max: 20 }) ?? "Healthy";
if (!(ACCOUNT_HEALTH_STATUSES as readonly string[]).includes(health)) {
  return ERR.BAD_REQUEST("Invalid health status");
}
// + `health,` in the create data (absent/""/null → the schema default
//   "Healthy" — the create-side default semantics, the priority shape).

// PUT (after the tier branch):
if ("health" in body) {
  if (isBadString(body.health)) return ERR.BAD_REQUEST("Invalid health status");
  const health = asString(body.health, { max: 20 });
  if (!health || !(ACCOUNT_HEALTH_STATUSES as readonly string[]).includes(health)) {
    return ERR.BAD_REQUEST("Invalid health status");
  }
  data.health = health;
}
```

RED pins: the constants export + the POST guard + the POST
create-data field + the PUT branch (4 — the s43-P1 pin granularity).

### S44-P2 — contacts POST accepts `status` (N-44b)

The PUT's own s42-P4 vocabulary, adapted to create-default semantics
(the POST priority shape — absent/""/null keep the "active" default,
a present garbage string 400s):

```ts
if (isBadString(body.status)) return ERR.BAD_REQUEST("Invalid status");
const status = asString(body.status, { optional: true, max: 20 }) ?? "active";
if (!(CONTACT_STATUSES as readonly string[]).includes(status)) {
  return ERR.BAD_REQUEST("Invalid status");
}
// + `status,` in the create data.
```

RED pins: the POST guard + membership + the create-data field (3).

### S44-P3 — the 18-site UI clear-parity sweep (F-44a, parity-proven)

Every dual-verb dialog payload maps emptied fields to the API's
explicit-clear convention instead of dropping the key (the
EntityEditDialog pages' own `|| null` convention, applied to the
layer that missed it). Behavior-identical on CREATE (null/"" ≡
absent through the optional parses); on UPDATE the user's clear now
applies (the parity proof):

| site | current | fixed |
|---|---|---|
| :153 industry | `\|\| undefined` | `\|\| null` |
| :154 email (account) | `\|\| undefined` | `\|\| null` |
| :155 phone (account) | `\|\| undefined` | `\|\| null` |
| :156 website | `\|\| undefined` | `\|\| null` |
| :158 annualRevenue | `: undefined` | `: null` |
| :159 employees | `: undefined` | `: null` |
| :162 ownerId | `\|\| undefined` | `\|\| null` |
| :461-462 accountId | `\|\| undefined` | `\|\| null` |
| :748 email (lead) | `\|\| undefined` | `\|\| null` |
| :749 phone (lead) | `\|\| undefined` | `\|\| null` |
| :750 company | `\|\| undefined` | `\|\| null` |
| :753 source | `\|\| undefined` | `\|\| null` |
| :1035 description | `\|\| undefined` | `\|\| null` |
| :1040 location | `\|\| undefined` | `\|\| null` |
| :1041 relatedType | `=== "none" ? undefined :` | `=== "none" ? "" :` |
| :1217 notes | `\|\| undefined` | `\|\| null` |
| :1221 relatedType (activity) | `\|\| undefined` | `\|\| null` |
| :1222 relatedName | `\|\| undefined` | `\|\| null` |

FK safety verified: all FK columns are `String?` (nullable) and
`asFKId(null)` → null (the documented explicit-clear convention).
RED pins: a new `tests/dialog-clear-parity.test.ts` — an 18-row
it.each asserting each POSITIVE mapping shape (all currently fail;
the s43-P2 it.each precedent).

### S44-P4 — the reports saveReport storage guard (F-44b)

The leads-page saveView convention applied to the reports-page
onSave (a storage failure → a surfaced toast, never an uncaught
error):

```ts
try {
  const count = saveReport({ ... });
  setSavedCount(count);
  setSavedList(listSavedReports());
  setSaveDialogOpen(false);
} catch {
  toast.error("Could not save report", "Browser storage is unavailable.");
}
```

RED pins: a new `tests/report-save-guard.test.ts` (2 — the
try/catch wrap + the toast.error vocabulary; the topbar-search
2-pin-file precedent).

### S44-P5 — the topbar envelope-reset (the N-44g micro)

The catch's reset applied to the `!body?.ok` path too (a JSON
401/500 envelope no longer silently strands stale results):

```ts
if (body?.ok) {
  setResults(body.data);
  setOpen(true);
} else {
  setResults(null);
  setOpen(false);
}
```

RED pins: a session-44 describe in `tests/topbar-search.test.ts`
(1 — the else-reset shape; the existing s43 pins stay green).

### S44-P6 — the dead account include removed (F-44c)

The reports leads findMany drops `account: {select: {name: true}}`
(the serializer nulls it at :367 — the fetched name is never
delivered; the owner include STAYS — it feeds `serializeLead`'s
consumers). Behavior-identical (the JSON payload already carried
`account: null`); the wasted LEFT JOIN goes.

RED pins: the api-robustness family (2 — the reports include block
must NOT match the account select; the owner select must stay).

## Execution order

All pins RED together (predicted **30**: 4 + 3 + 18 + 2 + 1 + 2 —
confirm with the exact count; all 1050 pre-existing checks stay
green through RED) → the implementations (P1 the accounts health
branches + the constant, P2 the contacts POST status, P3 the
18-site sweep, P4 the reports save guard, P5 the topbar else-reset,
P6 the include removal) → target suites GREEN → the full gate (lint
· tsc · unit · build · e2e 108/108 on a fresh CI=1 boot) → LIVE
verification on the dev server (accounts health: POST set → stored,
PUT re-assign → moved, garbage → 400 "Invalid health status",
non-string → 400, absent → default, on BOTH verbs; contacts POST
status: set → stored, absent → "active", garbage → 400; the UI
clear-parity: edit an event via the calendar → clear description +
location + Related To "None" → verify via the API + re-open the
dialog; the account edit → clear industry/website/revenue →
verify; the activity edit → clear notes → verify; the reports save
guard + the topbar envelope-reset verified by pin [storage-quota
and a 500-envelope are not cleanly LIVE-probeable]; every probe
cleaned BY EXACT ID) → screenshots (02/11/12 re-captured + the
session's new surface: the event edit dialog mid-clear — P3's
domain) → docs realignment (README badge + the session-44
paragraph + the suite counts, AGENTS + the session-44 block, CLAUDE,
PAD the s44 row / totals / checklist / command table, SKILL
frontmatter + project_state + the H1 + the new §, docs/session_81.md,
this plan's execution record, both worklogs) → commit on main + the
SSH-wrapper push.

## Validation checklist (pre-execution)

- [x] All 18 P3 sites read at exact file:line this session (the
      payload blocks in entity-dialogs.tsx; the five dual-verb usage
      sites verified: leads-page:687, activities-page:570,
      calendar-page:555, accounts-page:653, contacts-page:953).
- [x] The headline trio LIVE-proven with probe records (accounts
      health POST+PUT → 200 + "Healthy" both times; contacts POST
      status → 200 + "active"; the Khalid event clear round-trip)
      — all probes cleaned BY EXACT ID; zero residue (15/24/10/23/12;
      the Khalid event restored to its seeded state).
- [x] The F-44a parity proven on the REFERENCE both directions
      (description clear persists; Related To "None" persists) —
      the probe event deleted, the reference restored to zero.
- [x] The FK null-safety verified: all FK columns `String?`;
      `asFKId(null)` → null (api.ts:71-73 read).
- [x] The P1 vocabulary verified against the seed ("Healthy"/"At
      Risk"/"Needs Attention" — prisma/seed.ts:88-97) and the badge
      map (constants.ts:328-332 — the same three keys).
- [x] The P2 mirror read: the PUT's s42-P4 branch
      (contacts/[id]:116-129) + the POST's own priority shape
      (contacts/route.ts:47-58 — the create-default semantics).
- [x] Zero pin blast radius: no existing pin touches the health/
      status POST sites, the 18 dialog mappings, the reports-page
      onSave, the topbar else-path, or the reports include
      (grep-verified against the pin suites).
- [x] The e2e census: no e2e edits-and-clears a field through the
      dual-verb dialogs (the edit e2es set values, never empty them)
      — no e2e can trip the new clear semantics.

## Execution record (filled during execution)

- [x] S44-P1 RED: 3 failing pins (2 api-robustness + 1 constants —
      the plan's 4 was the pin-granularity arithmetic; the failure
      SET matched exactly). GREEN after the ACCOUNT_HEALTH_STATUSES
      constant + both verbs' branches + the create-data field.
- [x] S44-P2 RED: 1 failing pin (the combined guard+membership+
      create-data pin). GREEN after the POST branch + create data.
- [x] S44-P3 RED: 19 failing pins (18 sites + the class census).
      GREEN after the 18-site sweep — PLUS 3 date-ternary members
      discovered during implementation (lead expectedCloseDate +
      nextFollowUp, event endAt — the same `? X : undefined`
      drop-key class on user-clearable dates; the PUT branches all
      accept present-null → clear), fixed + pinned → **21 sites,
      22 pins total** (the s42 self-fix-shape precedent).
- [x] S44-P4 RED: 2 failing pins. GREEN after the try/catch guard +
      the toast import.
- [x] S44-P5 RED: 1 failing pin. GREEN after the else-reset.
- [x] S44-P6 RED: 1 failing pin (the combined owner-stays/account-
      gone pin — the plan's 2 was the granularity arithmetic).
      GREEN after the include removal.
- [x] RED total: exactly **27** (the plan's 30 was pin-count
      arithmetic — pins-as-it-blocks vs expects, the s43 precedent);
      all 1050 pre-existing checks stayed green through RED.
- [x] Gate (after ALL changes): lint 0/0 (enforced) · tsc 0 ·
      **1080/1080 unit (53 suites, +30 tests / +27 RED pins + 3
      date-site pins)** · build clean · **108/108 e2e** on a fresh
      boot (CI=1) — no e2e tripped a guard.
- [x] LIVE both directions: accounts health — POST {"health":"At
      Risk"} → 200 + "At Risk" (was silently "Healthy"), POST
      absent → "Healthy", PUT re-assign "Needs Attention" → stored,
      PUT/POST garbage ("banana"), non-string (123), present "" →
      400 "Invalid health status". Contacts POST status —
      {"status":"inactive"} → 200 + "inactive" (was silently
      "active"), absent → "active", garbage → 400 "Invalid status".
      The UI clear-parity end-to-end through the REAL calendar
      dialog: set description "p3-set-desc" + location "p3-set-loc"
      + Related To "Contact" → all three stored (API-verified);
      then cleared all three + Related To "None" → saved → **all
      three null, contactId intact** (the fix; the old code silently
      kept the values). P4/P5 pin-verified (storage-quota and a
      500-envelope are not cleanly LIVE-probeable). All probes
      cleaned BY EXACT ID; zero residue (15/24/10/23/12; the Khalid
      event back at its seeded all-null state).
- [x] Screenshots: 02/11/12 re-captured (11 + 12 BYTE-IDENTICAL to
      HEAD — the deterministic seed; 02 within chart-animation
      raster noise) + **52-event-related-none-option NEW** (the P3
      fix's domain surface — the Edit Event dialog with the Related
      To select open listing None/Contact/Account/Opportunity/Lead,
      the exact control whose "None" mapping was fixed). 02 + 52
      VLM-verified.
- [x] Docs realigned: README badge 1188 + the session-44 paragraph
      + the suite counts, AGENTS 1080/108 + the session-44 block,
      CLAUDE 1080, PAD the s44 row / totals / checklist / command
      table, SKILL **v1.41.0** frontmatter + project_state + the H1
      + the new section, docs/session_81.md, this record, both
      worklogs. `.env`/`.env.example` re-verified (no env surface
      change; DATABASE_URL file:../db/custom.db with db/ at the
      repo root).
