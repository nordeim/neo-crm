# Session-42 Parity Remediation Plan (2026-10-03)

Session 42 on `main` @ `3b07abc` (the session-41 code at `1982776` + the
operator's `docs/session_76.md` transcript commit). Baseline gate on the
pulled tree: **lint 0/0 (enforced) · tsc 0 · 1008/1008 unit (50 suites)** —
the documented state exactly. `.env` `DATABASE_URL="file:../db/custom.db"`
with `db/` at the repo root verified intact; the dev server healthy on
:3000 (`/api/health` → `{"status":"healthy","db":"up"}`); no stale :3100
listener; `agent-browser 0.38.1` ready.

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-41 re-audit (fresh eyes on commit `1982776`)

All five session-41 fix families verified GENUINE — P1 the 31 POST guards
(counts exact: contacts 9, leads 5, accounts 6, activities 6, events 5,
each `ERR.BAD_REQUEST` with the house vocabulary; null/absent pass; `''`
keeps the optional default; no legit UI payload can trip one — the
dialog/inline writers re-checked), P2 the RFC-4180 `qq()` quoter (all
three builders route through it; behavior-pinned), P3 the widening
case-insensitive join, P4 the session-read envelope, P5 the hygiene. No
regressions, no vacuous pins.

**New findings (each manually validated at file:line, the headline three
LIVE-proven with probe records — all cleaned by exact ID):**

- **N-42a (MED, LIVE-proven)** — the strict-bool silent-clear family:
  `isKey: body.isKey === true` (accounts POST :72) and `allDay:
  body.allDay === true` (events POST :94) silently store FALSE for a
  present non-boolean (`{"isKey":"yes"}` → 200 + false), and the PUT
  twins (`accounts/[id]:51`, `events/[id]:37`) silently CLEAR an existing
  true — LIVE: a key account PUT `{"isKey":"yes"}` → 200 + `isKey:false`.
  The exact s41 silent-drop class, one type-shape over (boolean). The UI
  writers are real booleans (Radix checkbox `onCheckedChange`) or absent
  (the event dialog has no all-day control) — the surface is API-only.
- **N-42b (MED, LIVE-proven)** — activities/[id] PUT silently IGNORES
  `contactId`/`accountId`: no branch exists in the PUT handler (the POST
  route accepts both at :49-52) — LIVE: PUT `{"contactId":<id>}` → 200 +
  `contactId` still null, the caller's payload dropped without error.
  An activity's account/contact links can never be re-assigned or
  cleared via the API. The s37 FK_SITES census omits activities/[id].
  The UI edit path sends no FK fields (ActivityForm payload:
  type/subject/notes/dueAt/status/priority/relatedType/relatedName) —
  blast radius zero.
- **N-42c (LOW-MED, LIVE-proven)** — contacts/[id] PUT `{"status":""}`
  silently RESETS an inactive contact to "active": `asString(body.status,
  {optional: true, max: 20}) ?? "active"` (:117) — the ONLY optional-parse
  enum on PUT whose `??` default passes the membership check (the
  full-repo sweep found no other member of this class; every sibling
  enum parses non-optionally so `''` fails with 400). LIVE: set
  "inactive" → PUT `{"status":""}` → 200 + "active".
- **N-42d (LOW, test-strength)** — the two s41-P4 pins are presence-only
  (try + getSessionUser + ERR.INTERNAL co-presence, no `allInsideTry`) —
  the suite's own containment standard wasn't applied to its newest
  family.
- **N-42e (INFO)** — `signup/page.tsx:20` has an unwrapped direct session
  read — the same honest-500-page class as the (app) layout (a DB
  failure throws to Next's error boundary, not a logged-out redirect);
  absent from the ledger, which names only auth/me and the layout.
  Documented this session, not fixed (the s41-P4 doctrine).
- **N-42f (INFO)** — `neo-crm_SKILL.md` still lists `DEFAULT_SETTINGS`
  in the constants inventory (stale since the s41-P5 deletion).
- **N-42g (INFO)** — `settings/route.ts:103` `?? "monday"` is a dead
  fallback (non-optional `asString` returns `""`, never undefined —
  the s40 dead-`??` shape; `''` already 400s on the enum check).

### B. The deferred-findings graduation audit

- **The GET list routes' reads GRADUATE (the session-42 headline,
  LOW-MED):** the full census is 11 handlers — contacts :10, leads :10,
  accounts :10, activities :10, events :15, opportunities :15, users :10
  (single `findMany` each) + dashboard :47-51, reports :83-98, search
  :15-60 (`Promise.all` families) + export :71 (serves raw CSV). A
  SQLITE_BUSY-class failure during any list read answers a raw non-JSON
  500; the store degrades it to "Request failed (500)" instead of the
  house message (`crm-store.ts:34-38`). The deliberate keeps: the
  `(app)` layout + signup page (honest 500 pages) and health (its own
  503 shape). **Fix shape: per-route try/catch → ERR.INTERNAL, NOT a
  HOC wrapper** — the pin machinery slices `export async function
  ${verb}` (`tests/api-robustness.test.ts:131-136`) and the
  `allInsideTry` containment family assumes it. Blast radius on
  existing pins: zero (every GET-route pin is a positive
  regex/indexOf slice, indentation-insensitive — grep-verified against
  opportunity-model / dashboard-contracts / report-periods /
  csv-contract / account-health-tab).
- **The 2 source enum-membership sites STAY DEFERRED, sharpened:** the
  vocabulary is fragmented across five disagreeing surfaces (create
  dialog raw lowercase, edit dialog raw lowercase, seed raw lowercase,
  import arbitrary/"email", settings CAPITALIZED defaults) — a
  membership-vs-settings check would 400 every dialog-created contact
  and every default-path import row. A vocabulary-reconciliation
  product decision must come first.
- **The CSV formula-injection half STAYS DEFERRED** (the operator's
  (a) parity / (b) `=`+`@`+tab+CR / (c) full-OWASP decision — no
  decision given this session; all three pinned templates ship
  `+1234567890` phones and the seed's `+971…` phones ride every export,
  so option (b) would mangle legit data and break the byte-exact pins).
- **The 11 e2e sleeps STAY DEFERRED, sharpened** (exactly 11, all in
  `crm.spec.ts`: :449, :1366, :1586, :1598, :1612, :1624, :2015, :2060,
  :2064, :2079, :2084; only ~4 back true one-shot assertions; zero
  flakes in 41 sessions).
- **The standing ledger (13 items) re-confirmed** — strict-bool idioms
  (GRADUATING this session as N-42a), Excel .xlsx accept,
  partial-import conflation, hydrate-error-vs-logged-out, reset
  role-gating, list caps, trusted-proxy limiter, updateLead supersede,
  hydrate redesign, SavedReport dead model, photoUrl onError,
  mobile-nav post-wipe coupling, href-sink watch.
- **Fresh-eyes hygiene:** the dead `CONTACT_SOURCES` import
  (`entity-dialogs.tsx:46`, survives lint because `no-unused-vars` is
  disabled) and the dead `EDIT_SOURCE_OPTIONS` export
  (`constants.ts:257`, zero consumers repo-wide).

## Standing layers (38th session, NO DRIFT)

- The reference bundle md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`,
  1,631,071 bytes — THIRTEENTH consecutive stable session, fresh-fetched
  + byte-compared against the s41 cache).
- The reference's mobile-nav absence at a TRUE 390px (8 links in DOM,
  0 visible, nav w=0, no hamburger — 38th session).
- The reference demo data still zero ($0.0k/$0.0k/$0k — 38th session).
- Our drawer live in every direction (open: the portal panel at 288px
  with all 8 links + the body+main dual scroll-lock + focus on the Close
  button; Escape: `visibility:hidden` + `pointer-events:none` +
  unlocked + `aria-expanded:"false"` + panel `translate:-100%`;
  history.back() on an in-app route change: closed — the s35 ownership
  fix holds).
- Zero 390px overflow on all nine routes (scrollWidth 390 ==
  clientWidth 390 on every route).
- The FK envelope 400 LIVE (re-proven: the leads POST `{"value":true}`
  → 400 "Invalid value").
- The gitignore negative space holds (`src/app/api/uploads/[name]/route.ts`
  tracked; the anchored `/uploads/` ignores only the runtime dir).

## The fixes (S42-P1..P5, RED-first)

### S42-P1 — the GET list routes join the envelope (the headline, 11 routes)

Per-route `try { <the existing read(s) + derivation + return ok(...)>
} catch { return ERR.INTERNAL() }` — the handler bodies move INSIDE the
try wholesale (every db call + every derived return stays inside; the
`requireSession` guard + param parsing stay outside, matching the
enveloped siblings' shape). For `export/route.ts` the CSV `Response`
construction moves inside the try too; the catch answers `ERR.INTERNAL()`
(JSON) — the download flow only consumes the CSV on 200.

| route | read sites |
|---|---|
| src/app/api/contacts/route.ts | GET :10 findMany |
| src/app/api/leads/route.ts | GET :10 findMany |
| src/app/api/accounts/route.ts | GET :10 findMany |
| src/app/api/activities/route.ts | GET :10 findMany |
| src/app/api/events/route.ts | GET :15 findMany |
| src/app/api/opportunities/route.ts | GET :15 findMany |
| src/app/api/users/route.ts | GET :10 findMany |
| src/app/api/dashboard/route.ts | GET :47-51 Promise.all ×3 |
| src/app/api/reports/route.ts | GET :83-98 Promise.all ×4 |
| src/app/api/search/route.ts | GET :15-60 Promise.all ×3 |
| src/app/api/export/route.ts | GET :71 findMany → CSV |

RED pins first: an it.each over the 11 routes in
`tests/api-robustness.test.ts` (the s37 containment family's shape):
`handlerBlock(route, "GET")` must match `DB_CALL` (presence pairing —
the §16ad vacuous-lesson), `allInsideTry(get, DB_CALL)` true, and
`ERR.INTERNAL` present. 11 pins.

### S42-P2 — the strict-bool silent-clear family (N-42a, 4 sites)

A new predicate in `src/lib/api.ts` — `isBadBool(v)`: true only for a
PRESENT non-boolean (`v !== undefined && v !== null && typeof v !==
"boolean"`), the isBadString/isBadFK shape one type over. Applied at:

| site | guard | message |
|---|---|---|
| accounts/route.ts POST :72 (isKey) | isBadBool before the create | Invalid key account |
| accounts/[id]/route.ts PUT :51 (isKey) | inside the `"isKey" in body` branch | Invalid key account |
| events/route.ts POST :94 (allDay) | isBadBool before the create | Invalid all-day flag |
| events/[id]/route.ts PUT :37 (allDay) | inside the `"allDay" in body` branch | Invalid all-day flag |

Absent/null keep the `=== true` false-default on POST and the
no-change semantics on PUT (`''` is a present non-boolean → 400; a
boolean checkbox payload is true/false only). RED pins first: the
isBadBool behavior edge matrix in `tests/coercion-guards.test.ts`
(undefined/null/true/false pass; "yes"/1/{}/[]/0 reject — the s40-P1
behavior-test precedent) + 4 guard rows in `tests/api-robustness.test.ts`
(the it.each [route, field, message] table style).

### S42-P3 — activities/[id] PUT accepts contactId/accountId (N-42b)

The contacts/[id] FK shape, mirrored verbatim (parse-side guards +
try-side existence checks):

```ts
// parse side (before the try, with the other field branches):
if ("contactId" in body) {
  if (isBadFK(body.contactId)) return ERR.BAD_REQUEST("Invalid contact selection");
  data.contactId = asFKId(body.contactId);
}
if ("accountId" in body) {
  if (isBadFK(body.accountId)) return ERR.BAD_REQUEST("Invalid company selection");
  data.accountId = asFKId(body.accountId);
}
// try side (after the existence fetch, before the update — the
// activities POST's own vocabulary):
if (typeof data.contactId === "string" && data.contactId) {
  const contact = await db.contact.findUnique({ where: { id: data.contactId } });
  if (!contact) return ERR.BAD_REQUEST("Selected contact does not exist");
}
if (typeof data.accountId === "string" && data.accountId) {
  const account = await db.account.findUnique({ where: { id: data.accountId } });
  if (!account) return ERR.BAD_REQUEST("Selected company does not exist");
}
```

RED pins first: the FK_SITES census row added
(`activities/[id]` + `["contactId","accountId"]` — the it.each asserts
the coercing pattern is gone and every FK field is guarded) + 1 pin for
the two existence checks inside the PUT block.

### S42-P4 — contacts/[id] PUT status `""` is a 400, not a silent reset (N-42c)

`asString(body.status, { optional: true, max: 20 }) ?? "active"` → the
sibling enum shape (non-optional parse + membership):

```ts
const status = asString(body.status, { max: 20 });
if (!status || !(CONTACT_STATUSES as readonly string[]).includes(status)) {
  return ERR.BAD_REQUEST("Invalid status");
}
```

A present-but-empty status is now the documented 400 (status is a
required enum — the PUT twins' semantics: `''` is NOT a clear, it is a
bad value). RED pin first: the PUT block must not match
`/status[^;]*\?\?\s*"active"/` and must match the non-optional parse +
membership check.

### S42-P5 — the hygiene + strengthening (drive-by)

- The dead `CONTACT_SOURCES` import deleted (`entity-dialogs.tsx:46` —
  grep-verified single occurrence, the import itself).
- The dead `EDIT_SOURCE_OPTIONS` export deleted (`constants.ts:257` —
  grep-verified zero consumers repo-wide).
- The dead `?? "monday"` removed (`settings/route.ts:103` — behavior
  unchanged, `''` already 400s on the enum; the s40 dead-`??` shape).
- The two s41-P4 pins strengthened with `allInsideTry` (GREEN-on-
  arrival — requireSession's block + auth/me's GET, the containment
  standard applied to the newest family, closing N-42d's shape).
- No RED pins for the deletions (grep-verifiable + e2e-held — the
  s40-P6/s41-P5 precedent).

## Execution order

P1..P4 pins (all RED written together, confirmed failing with the exact
predicted count — **20 predicted**: 11 + 7 + 2 + 2... precisely: 11
GET-containment + 3 isBadBool behavior + 4 strict-bool guard rows + 2
activities-FK + 1 FK_SITES row + 1 status-shape... final arithmetic in
the record) → the implementations (the 11 GET wraps first, then
isBadBool + the 4 boolean guards, then the activities FK branches, then
the status parse, then hygiene) → target suites GREEN → the full gate
(lint · tsc · unit · build · e2e 108/108 on a fresh CI=1 boot) → LIVE
verification on the dev server (a GET route's failure envelope is
source-proven + the previously-silent mutations now 400: accounts
`{"isKey":"yes"}` PUT → "Invalid key account", events `{"allDay":"yes"}`
→ "Invalid all-day flag"; the activities PUT now APPLIES contactId/
accountId — set + clear + a stale id → "Selected contact does not
exist"; contacts `{"status":""}` → "Invalid status"; null/absent still
default; valid booleans still store; every probe cleaned BY EXACT ID) →
screenshots → docs realignment (README badge/counts + the session-42
paragraph, AGENTS counts + the session-42 block, CLAUDE counts, PAD the
s42 row + checklist + command table, SKILL v1.39.0 frontmatter +
project_state + the H1 + §16ah + the N-42f constants-inventory fix,
docs/session_77.md, this plan's execution record, both worklogs) →
commit on main + the SSH-wrapper push.

## Validation checklist (pre-execution)

- [x] The 11 P1 sites: every file read in source this session (the GET
      handlers sliced with the same `handlerBlock` boundaries the pins
      use).
- [x] The three headline classes LIVE-proven with probe records (all
      cleaned by exact ID; zero residue; 15/15 seeded contacts, 10
      accounts, 24 leads after).
- [x] The strict-bool UI census: the account dialog's checkbox sends a
      real boolean; the event dialog has NO all-day control (API-only
      surface); the activities edit dialog sends no FK fields.
- [x] P3's mirror shapes read: contacts/[id] parse-side (:51-58) +
      try-side (:133-140); the activities POST's own existence
      vocabulary (:59-66).
- [x] P4's sibling enum shapes read: leads/[id] stage, accounts/[id]
      status/tier (non-optional parses whose `''` fails the enum).
- [x] P5's dead symbols grep-verified zero-consumer repo-wide
      (excluding skills/).
- [x] The blast radius on existing pins: zero (every GET-route pin is
      a positive slice; the FK_SITES `not.toMatch` covers only the
      coercing `asString(body.<fk>` pattern which P3 replaces with the
      guarded shape).
- [x] The optional-parse-enum sweep: contacts status is the ONLY
      member of the N-42c class repo-wide (the settings quartet is the
      documented s40-P3 revival; the POST-side `??` defaults are the
      s41 doctrine).

## Execution record (filled during execution)

- [x] S42-P1 RED: 11 failing pins (the GET containment it.each).
      GREEN after the 11 per-route wraps (the single-read routes
      whole-body; the dashboard/reports/search Promise.all families
      via the type-safe IIFE-wrap + null-guard — every derivation
      below the reads is pure).
- [x] S42-P2 RED: 7 failing pins (the isBadBool export/behavior
      matrix ×3 + the 4 strict-bool guard rows). GREEN after the
      predicate in api.ts + the four sites (accounts isKey POST/PUT,
      events allDay POST/PUT).
- [x] S42-P3 RED: 3 failing pins (the FK-branch pair + the FK_SITES
      census row). GREEN after the contacts/[id] shape mirrored
      (parse-side guards + try-side existence checks).
- [x] S42-P4 RED: 1 failing pin (the status non-optional parse).
      GREEN after the sibling-enum shape.
- [x] S42-P5: the dead CONTACT_SOURCES import + EDIT_SOURCE_OPTIONS
      export deleted (grep-verified zero consumers); the settings
      `?? "monday"` dead fallback removed (one self-fix on the way:
      the `!dow ||` narrow for the string|undefined union — tsc
      caught it); the two s41-P4 pins strengthened to allInsideTry
      (GREEN-on-arrival).
- [x] RED total: exactly 22 for P1-P4 (11 + 7 + 3 + 1) — the
      prediction matched; all 1008 pre-existing checks stayed green
      through RED.
- [x] S42-P6 (LIVE-DISCOVERED during the post-fix warm-up battery):
      the bare `/api/reports` + `/api/export?type=report` requests
      answered 400 "Invalid period" — the `?? "quarter"` defaults
      were dead code. RED: 2 failing pins. GREEN after the optional
      parse in both routes. LIVE: both now 200 with the
      default-quarter data.
- [x] Gate (after ALL changes incl. P6): lint 0/0 (enforced) · tsc 0
      · **1032/1032 unit (50 suites, +24)** · build clean ·
      **108/108 e2e** on a fresh boot (CI=1) — no e2e tripped a
      guard.
- [x] LIVE both directions: the strict-bool rejections 400 with the
      exact vocabulary (accounts `{"isKey":"yes"}` PUT → "Invalid key
      account"; events `{"allDay":"yes"}` POST → "Invalid all-day
      flag") while null still false-defaults and true still stores;
      the activities PUT FK payload now APPLIES (set → linked, "" →
      cleared, a stale id → "Selected contact does not exist", a
      non-string → "Invalid contact selection"); the contacts
      `{"status":""}` → 400 "Invalid status"; every GET happy path
      200 with data. All probes cleaned BY EXACT ID; zero residue;
      15/15 seeded contacts + 10 accounts + 24 leads + 23 activities
      + 12 events after.
- [x] Screenshots: 02/11/12 re-captured (11/12 byte-identical to
      HEAD; 02 within chart-animation raster noise) +
      **50-activities-related-links NEW** (the P3 fix's domain
      surface). 02 + 50 VLM-verified (the KPIs
      24/$337.0k/$126.0k/$0k/29.2%/83 days; the six activity KPIs
      5/5/6/7/1/2 + the priority rows + the charts).
- [x] Docs realigned: README badge 1140 + the session-42 paragraph +
      the suite counts, AGENTS 1032/108 + the session-42 block, CLAUDE
      1032, PAD the s42 row / 1032+108 / the checklist / the command
      table, SKILL **v1.39.0** frontmatter + project_state + the H1 +
      §16ah + the N-42f constants-inventory fix, docs/session_77.md,
      this record, both worklogs. `.env`/`.env.example` re-verified
      (no env surface change).
