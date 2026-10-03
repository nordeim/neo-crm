# Session-43 Parity Remediation Plan (2026-10-03)

Session 43 on `main` @ `81e53c7` (the session-42 code at `a8b83f5` + the
operator's `docs/session_78.md` transcript commit). Baseline gate on the
pulled tree: **lint 0/0 (enforced) · tsc 0 · 1032/1032 unit (50 suites)** —
the documented state exactly. `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root
verified intact; the dev server healthy on :3000
(`/api/health` → `{"ok":true,"data":{"status":"healthy","db":"up"}}`);
no stale :3100 listener; `agent-browser 0.38.1` ready.

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-42 re-audit (fresh eyes on commit `a8b83f5`)

All six session-42 fix families verified GENUINE — P1 the 11 GET wraps
(requireSession outside the try everywhere; query objects byte-identical
pre/post; the IIFE + null-guard typing preserved; the pins
non-vacuous — the pre-wrap code had zero try spans), P2 `isBadBool` +
the four strict-bool sites, P3 the activities/[id] FK branches, P4 the
contacts status non-optional parse (absent → no change; present
""/null/garbage → 400), P5 the hygiene, P6 the period optional parse.
**No regressions** (happy-path return shapes unchanged; the export CSV
`Response` construction sits outside the try — behaviorally equivalent,
the builders are pure). **New findings (each manually validated at
file:line; the headline pair LIVE-proven with probe records, all cleaned
by exact ID):**

- **N-43a (LOW-MED, LIVE-proven)** — `Lead.contactId` is a dead relation
  end-to-end: the schema (`prisma/schema.prisma:129,135`) and the wire
  type (`types/index.ts:82`) carry it, but NO leads route accepts it
  (the POST create data has no `contactId`; the PUT has no branch) —
  LIVE: POST `{"name":"…","contactId":<real id>}` → 200 +
  `contactId:null`, the caller's payload dropped without error on BOTH
  verbs. The N-42b shape one level up (activities was the same class,
  fixed s42-P3). No UI writer sends it (API-only surface); the wire type
  has no `contact` object, so no include changes.
- **N-43b (LOW)** — the dead-`??` enum-default family survives on NINE
  PUT sites: `leads/[id]:79` (`?? "new"`), `activities/[id]:44/49/54`
  (`?? "normal"` / `?? "call"` / `?? "scheduled"`), `events/[id]:68/73`
  (`?? "meeting"` / `?? "scheduled"`), `accounts/[id]:65/70`
  (`?? "active"` / `?? "B"`), `contacts/[id]:62` (`?? "Standard"`) —
  non-optional `asString` returns `""` (never undefined) so the
  fallbacks can never fire; `""` already 400s on the enum below. The
  exact shape s42-P5 removed from settings, ×9. (The auth
  `?? ""` twins at login:23 / resend:29 / signup:58 / verify:39 are
  runtime-dead but TYPE-load-bearing — `asString` types
  `string | undefined` and the `??` narrows for `.toLowerCase()` — NOT
  this class; documented, untouched.)
- **N-43c (LOW)** — reports + export GET validate `period` (400 on
  garbage) but not `stage/status/source/owner` — a garbage filter
  silently yields an EMPTY report (GET-only, no corruption).
- **N-43d (LOW)** — events GET `from`/`to` are lenient
  (`events/route.ts:12-13`): `asDate("garbage")` → undefined → the
  window filter silently DROPS (the caller asked for a window, got
  everything). The only caller (the calendar UI) sends ISO strings.
- **N-43e (LOW-MED, LIVE-proven)** — the settings defaults trio lacks
  membership: `defaultLeadStage` (:86), `defaultTier` (:90),
  `calendarView` (:100) accept any string — LIVE: PUT
  `{"defaultLeadStage":"banana-probe"}` → 200 + saved verbatim. A
  poisoned default flows into the create dialogs' initial values
  (`entity-dialogs.tsx:731` stage, `:138` tier) making every subsequent
  create 400 confusingly. The free-text UI inputs are the vector (the
  settings page ships raw Inputs for both). Same family as
  `firstDayOfWeek`, which already checks.
- **N-43f (INFO)** — `firstDayOfWeek` lacks the `isBadString` guard its
  sibling settings quintet has (a non-string 400s with the enum message,
  not "Invalid first day of week").
- **N-43g (INFO)** — `CONTACT_SOURCES` (`constants.ts:231`) is
  production-dead after the s42-P5 import deletion — kept alive only by
  its own vocabulary pin (`tests/constants.test.ts:73`). The pin IS the
  purpose (the DOM-pinned reference "How did you meet?" vocabulary) —
  intentional, not the s41-P5 dead-export class.
- **N-43h (INFO)** — `ownerId` can't be reassigned on events/activities
  PUTs while contacts/leads/accounts accept it — mirrors the UI (those
  edit dialogs have no owner control); reference parity.
- **N-43i (INFO)** — dashboard's outer `rows` (`route.ts:50`, the s42-P1
  IIFE) is shadowed by the pre-existing inner `rows` in the pipeline map
  (`:105`) — cosmetic only, zero behavior.

### B. The deferred-findings graduation audit

**ZERO ledger/pointer graduations** — the mechanical well is dry: the
complete unguarded-payload census (every field on the 5 POST + 5 [id]
PUT routes + users PATCH + settings PUT + auth family + reset) comes
back CLEAN; the s40/41/42 coercion families closed the space. The 13
standing-ledger items re-confirmed at file:line (strict-bool verified
landed as graduated). The operator decisions remain open (the CSV
formula-injection posture (a)/(b)/(c) and the source-vocabulary
reconciliation — no decision given this session). The 11 e2e sleeps
re-confirmed at the exact lines (all hold post-s42). The
signup-page session read stays (the honest-500 doctrine). Fresh-eyes
findings: **F-B1 (LOW)** the topbar global search's debounced fetch is
the ONLY unwrapped fetch in src (`topbar.tsx:61-66`) — a network
failure rejects the setTimeout callback → unhandled rejection + silently
stale results (the s39 N-B3 profile-save class); blast radius zero (no
unit pins touch topbar; the global-search e2e is happy-path only).
F-B2 = N-43d. F-B3 (INFO) leads/accounts email lack the format regex
contacts has; accounts website has no URL-shape check. F-B4 (INFO)
side effects inside setState updaters double-fire under StrictMode dev
— idempotent, dev-only. CLEAN: every db call awaited, all JSON.parse
guarded, cookies sound, the upload chain solid end-to-end.

## Standing layers (39th session, NO DRIFT)

- The reference bundle md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`,
  1,631,071 bytes — FOURTEENTH consecutive stable session, fresh-fetched
  + byte-compared against the s42 cache).
- The reference's mobile-nav absence at a TRUE 390px (8 links in DOM,
  0 visible, nav w=0, no hamburger — 39th session).
- The reference demo data still zero (Total Leads 0 / $0.0k / $0.0k /
  $0k — 39th session).
- Our drawer live in every direction (open via the REAL trigger
  `button[aria-label="Open navigation menu"]`: trigger
  `aria-expanded:"true"` + the portal panel at 288px + all 8 links
  truly visible + the body+main dual scroll-lock + focus on the Close
  button; Escape: `visibility:hidden` + `pointer-events:none` +
  unlocked + `aria-expanded:"false"` + panel `translate:-100%`;
  history.back() on an in-app route change: closed — the s35 ownership
  fix holds). NOTE this session's probe lesson: `visibility:hidden`
  PRESERVES the layout box, so `offsetWidth > 0` is NOT a visibility
  proof — the census must check `getClientRects().length > 0 &&
  computed visibility !== 'hidden'` (the first probe of the session was
  fooled by clicking the overlay's Close button, whose aria-label also
  matches /menu/i).
- Zero 390px overflow on all nine routes (scrollWidth 390 ==
  clientWidth 390 on every route incl. /Profile).
- The FK envelope 400 LIVE (re-proven: the leads POST `{"value":true}`
  → 400 "Invalid value").
- The gitignore negative space holds (`src/app/api/uploads/[name]/route.ts`
  tracked; the anchored `/uploads/` ignores only the runtime dir).

## The fixes (S43-P1..P5, RED-first)

### S43-P1 — leads POST + PUT accept `contactId` (the headline, N-43a)

The s42-P3 activities shape, mirrored verbatim (the wire type already
carries `contactId: string | null`; NO include changes — the wire type
has no `contact` object):

```ts
// POST (inside the try, after the accountId existence check):
if (isBadFK(body.contactId)) return ERR.BAD_REQUEST("Invalid contact selection");
const contactId = asFKId(body.contactId);
if (contactId) {
  const contact = await db.contact.findUnique({ where: { id: contactId } });
  if (!contact) return ERR.BAD_REQUEST("Selected contact does not exist");
}
// + `contactId,` in the create data.

// PUT parse side (with the other FK branches):
if ("contactId" in body) {
  if (isBadFK(body.contactId)) return ERR.BAD_REQUEST("Invalid contact selection");
  data.contactId = asFKId(body.contactId);
}
// PUT try side (after the accountId existence check):
if (typeof data.contactId === "string" && data.contactId) {
  const contact = await db.contact.findUnique({ where: { id: data.contactId } });
  if (!contact) return ERR.BAD_REQUEST("Selected contact does not exist");
}
```

RED pins: the FK_SITES census rows for both leads routes
(`["src/app/api/leads/route.ts", ["ownerId","accountId","contactId"]]`
+ `["src/app/api/leads/[id]/route.ts", ["accountId","ownerId","contactId"]]`
— the it.each asserts `isBadFK(body.contactId)` + `asFKId(body.contactId)`,
both currently absent) + the create-data pin (the POST block must match
`contactId,`) + the PUT existence pin (the PUT block must match
`Selected contact does not exist`). **4 pins.**

### S43-P2 — the nine dead-`??` enum-default sweep (N-43b)

Each site: remove the dead fallback + add the `!x ||` narrow (tsc —
`asString` types `string | undefined`; the s42-P5 self-fix shape):

| site | current | fixed check |
|---|---|---|
| leads/[id]:79 | `asString(body.stage) ?? "new"` | `!stage \|\| !(LEAD_STAGES…).includes(stage)` |
| activities/[id]:44 | `?? "normal"` | `!priority \|\| !["high","normal","low"].includes(priority)` |
| activities/[id]:49 | `?? "call"` | `!type \|\| !(ACTIVITY_TYPES…).includes(type)` |
| activities/[id]:54 | `?? "scheduled"` | `!status \|\| !["scheduled","completed"].includes(status)` |
| events/[id]:68 | `?? "meeting"` | `!type \|\| !(EVENT_TYPES…).includes(type)` |
| events/[id]:73 | `?? "scheduled"` | `!status \|\| !["scheduled","completed","cancelled"].includes(status)` |
| accounts/[id]:65 | `?? "active"` | `!status \|\| !(ACCOUNT_STATUSES…).includes(status)` |
| accounts/[id]:70 | `?? "B"` | `!tier \|\| !(ACCOUNT_TIERS…).includes(tier)` |
| contacts/[id]:62 | `?? "Standard"` | `!raw` early-400, then the existing map + membership |

Behavior-identical: `""` is not nullish (the fallbacks were dead) and
`""` already 400s on the enums; a present garbage string still 400s; a
valid string still stores. RED pins: a 9-row it.each
`[file, verb, field]` asserting the handler block does NOT match
`/asString\(body\.<field>\)\s*\?\?/` (all 9 currently fail). **9 pins.**

### S43-P3 — the settings defaults quartet completes (N-43e + N-43f)

The `firstDayOfWeek` sibling shape applied to the trio + the missing
type guard:

```ts
// defaultLeadStage — membership vs LEAD_STAGES (the same vocabulary
// the leads POST/PUT enforce; a poisoned default made every subsequent
// dialog create 400):
if (!stage || !(LEAD_STAGES as readonly string[]).includes(stage))
  return ERR.BAD_REQUEST("Default lead stage must be a valid stage");
// defaultTier — membership vs ACCOUNT_TIERS:
if (!tier || !(ACCOUNT_TIERS as readonly string[]).includes(tier))
  return ERR.BAD_REQUEST("Default account tier must be A, B or C");
// calendarView — the settings UI's own Select vocabulary:
if (!view || !["month", "week", "agenda"].includes(view))
  return ERR.BAD_REQUEST("Calendar view must be month, week or agenda");
// firstDayOfWeek — the isBadString guard its sibling quintet has:
if (isBadString(body.firstDayOfWeek)) return ERR.BAD_REQUEST("Invalid first day of week");
```

RED pins: 4 (the settings PUT block must match each membership/guard
shape; zero existing pins touch these messages — blast radius zero).
**4 pins.**

### S43-P4 — the topbar search fetch joins the wrap family (F-B1)

The last unwrapped fetch in src — the s39 profile-save shape: a
try/catch around fetch+parse; the catch resets
(`setResults(null)` + `setOpen(false)`) so a network failure neither
strands an unhandled rejection nor leaves stale results open.

RED pins: a new `tests/topbar-search.test.ts` (the one-suite-per-contract
convention) — the effect block must match the try-wrap around the
fetch + the catch-reset. **2 pins.**

### S43-P5 — events GET `from`/`to` reject garbage (N-43d)

```ts
const fromRaw = url.searchParams.get("from");
const toRaw = url.searchParams.get("to");
if (isBadDate(fromRaw)) return ERR.BAD_REQUEST("Invalid from date");
if (isBadDate(toRaw)) return ERR.BAD_REQUEST("Invalid to date");
const from = asDate(fromRaw);
const to = asDate(toRaw);
```

`isBadDate` semantics verified for URL params: absent (null) passes,
empty `""` passes (≡ absent, the house GET convention), a garbage
string rejects. RED pins: the events GET block must match the
`isBadDate(fromRaw)` → "Invalid from date" and `isBadDate(toRaw)` →
"Invalid to date" guards. **2 pins.**

## Execution order

All pins RED together (predicted **21**: 4 + 9 + 4 + 2 + 2 — confirmed
with the exact count; all 1032 pre-existing checks stay green through
RED) → the implementations (P1 the leads FK branches, P2 the nine
dead-`??` removals, P3 the settings quartet, P4 the topbar wrap, P5 the
events date guards) → target suites GREEN → the full gate (lint · tsc ·
unit · build · e2e 108/108 on a fresh CI=1 boot) → LIVE verification on
the dev server (leads contactId: set → linked, "" → cleared, a stale id
→ "Selected contact does not exist", a non-string → "Invalid contact
selection", on BOTH verbs; the settings trio: garbage → the exact 400s,
valid values still save, firstDayOfWeek non-string → "Invalid first day
of week"; the dead-`??` sites: present "" still 400s with the enum
vocabulary, valid still stores; the events from/to: garbage → 400, ISO
→ 200 windowed; the topbar search survives an aborted /api/search
network route — no unhandled rejection, the dropdown closes; every
probe cleaned BY EXACT ID) → screenshots (02/11/12 re-captured + the
session's new surface) → docs realignment (README badge + the
session-43 paragraph + the suite counts, AGENTS + the session-43 block,
CLAUDE, PAD the s43 row / totals / checklist / command table, SKILL
v1.40.0 frontmatter + project_state + the H1 + §16ai, docs/session_79.md,
this plan's execution record, both worklogs) → commit on main + the
SSH-wrapper push.

## Validation checklist (pre-execution)

- [x] All nine P2 sites read at exact file:line this session (the
      handler blocks sliced with the same `handlerBlock` boundaries the
      pins use).
- [x] The headline pair LIVE-proven with probe records (leads
      contactId → 200 + null; settings "banana-probe" → 200 + saved) —
      all probes cleaned BY EXACT ID; zero residue (15/15 seeded
      contacts + 24 leads + 10 accounts + 23 activities + 12 events;
      defaultLeadStage restored to "new").
- [x] The P1 mirror shapes read: activities/[id] parse-side (:64-71) +
      try-side (:85-92); the FK_SITES census table (:396-410); the wire
      type carries `contactId` with NO `contact` object (no include
      changes).
- [x] The UI census: no UI writer sends contactId on leads (the
      entity-dialogs lead form has no contact control — API-only
      surface); the settings free-text Inputs are the poison vector
      (now guarded); the topbar has zero unit pins; the calendar sends
      ISO from/to only.
- [x] Zero settings-pin blast radius (no existing pin touches the
      trio/firstDayOfWeek messages — grep-verified).
- [x] `isBadDate` semantics verified for URL params (null/"" pass,
      garbage rejects — api.ts:89-93 read).
- [x] The dead-`??` behavior proof: `asString` non-optional returns
      `""` (api.ts:51-57 read) — `""` is not nullish, the fallbacks
      were dead, the enums already 400 on `""`.

## Execution record (filled during execution)

- [x] S43-P1 RED: 4 failing pins (the 2 FK_SITES rows + create-data +
      PUT existence). GREEN after the branches + create data + the
      existence checks.
- [x] S43-P2 RED: 9 failing pins (the it.each rows). GREEN after the
      nine removals + `!x ||` narrows (one self-fix shape pre-planned:
      the contacts priority block's early `!raw` 400).
- [x] S43-P3 RED: 4 failing pins. GREEN after the trio memberships +
      the firstDayOfWeek guard.
- [x] S43-P4 RED: 2 failing pins. GREEN after the try/catch wrap.
- [x] S43-P5 RED: 2 failing pins were predicted, but the pin was
      written as ONE combined from/to guard — the actual RED total
      settled at **20** (the s42 arithmetic-slip precedent). GREEN
      after the from/to guards.
- [x] RED total: exactly 20 (2 FK_SITES rows + 16 new api-robustness
      tests + 2 topbar pins; the plan's 21 was an arithmetic slip — P5
      is 1 pin, not 2); all 1032 pre-existing checks stayed green
      through RED (1030 passed + the 2 edited FK_SITES rows).
- [x] Gate (after ALL changes): lint 0/0 (enforced) · tsc 0 ·
      **1050/1050 unit (51 suites, +18 tests / +20 RED pins)** · build
      clean · **108/108 e2e** on a fresh boot (CI=1) — no e2e tripped
      a guard.
- [x] LIVE both directions: leads POST `{"contactId":<id>}` → 200 +
      linked (was null); PUT re-assigns + clears; stale → "Selected
      contact does not exist"; non-string → "Invalid contact
      selection". Settings: `{"defaultLeadStage":"banana"}` → 400
      "Default lead stage must be a valid stage";
      `{"defaultTier":"Z"}` → 400; `{"calendarView":"day"}` → 400;
      `{"firstDayOfWeek":123}` → 400 "Invalid first day of week"; valid
      values still save. Dead-`??` sites: `{"status":""}` on
      accounts/activities/events PUT → 400 "Invalid status" (unchanged);
      valid still stores. Events `?from=banana` → 400 "Invalid from
      date"; ISO → 200. Topbar search with /api/search aborted → no
      unhandled rejection, dropdown closed, recovery on un-abort. All
      probes cleaned BY EXACT ID; zero residue (15/15 contacts + 24
      leads + 10 accounts + 23 activities + 12 events).
- [x] Screenshots: 02/11/12 re-captured (11 byte-identical to HEAD —
      the deterministic seed; 02/12 within chart-animation/raster
      noise, VLM-verified) + **51-topbar-search-results NEW** (the P4
      fix's domain surface — the topbar global search dropdown open
      with categorized results: Meridian Financial / James Whitfield /
      Robert Chen / the three Meridian leads; 41-dashboard-search-
      filtered shows the input CLOSED, so the open dropdown is a
      genuinely new surface). 02 + 12 + 51 VLM-verified.
- [x] Docs realigned: README badge 1158 + the session-43 paragraph +
      the suite counts, AGENTS 1050/108 + the session-43 block, CLAUDE
      1050, PAD the s43 row / 1050+108 / the checklist / the command
      table, SKILL **v1.40.0** frontmatter + project_state + the H1 +
      §16ai, docs/session_79.md, this record, both worklogs.
      `.env`/`.env.example` re-verified (no env surface change).
