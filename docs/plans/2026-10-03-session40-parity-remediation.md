# Session-40 Parity Remediation Plan (2026-10-03)

Session 40 on `main` @ `837a9b9` (session-39 code at `c568cee` + the
operator's `docs/session_72.md` transcript commit). Baseline gate on the
pulled tree: **lint 0/0 (enforced) · tsc 0 · 909/909 unit (49 suites)** —
the documented state exactly. `.env` `DATABASE_URL="file:../db/custom.db"`
with `db/` at the repo root verified intact; the dev server healthy on
:3000; `agent-browser 0.38.1` ready; no stale :3100 listener.

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-39 re-audit (fresh eyes on commit `c568cee`)

All seven session-39 fix families verified GENUINE (P1 the CI=1 gate
prefix — the pin really verifies it, and Playwright's installed source
fails CLOSED on a leftover listener; P2 the three-way banner — the
vocabulary verified against the reference bundle itself; P3 the profile
save envelope; P4 the signup name family; P5 the presence pairing; P6
the lint enforcement; P7 the sweep + cleanup hygiene). No consumer of
the old numeric `importContacts` return, no pin regressions, no e2e
residue. **New findings (each manually validated):**

- **N1 (LOW-MED)** — login's `db.user.findUnique` (login/route.ts:27)
  is the ONLY auth-route DB read outside the envelope: a bare await, so
  a SQLITE_BUSY-class failure answers a raw non-JSON 500 — inconsistent
  with the "auth family joins the envelope" posture (signup/verify/
  resend wrap theirs; login is also excluded from the auth-reads
  containment it.each).
- **N2 (LOW-LOW, parity-constrained)** — partial-import failure (0 <
  created < attempted) presents as plain success; the reference is
  atomic so it can never reach this state; the count shown is honest.
  Message changes would break the pinned S26-P6 vocabulary. STAYS
  DEFERRED.
- **N3 (INFO→hygiene)** — the two EARLIER import tests' toolbar clicks
  (crm.spec.ts:1428, :1446) remain non-exact — safe today only
  positionally; any future reordering reintroduces the 5-way ambiguity
  class s39 fixed. Cheap uniformity fix.
- N4-N7 (INFO) — the "always boots" wording (fail-closed is better),
  the POSIX-only CI=1 prefix (house convention), the success-leg double
  refetch (reference parity), the signup email truncation (absurd
  edge). No action.

### B. The deferred-findings graduation audit — the headline

**The non-FK coercion family GRADUATES.** The ledger's "~15 PUT sites"
figure UNDERCOUNTED: the full census found **37 silent PUT members**
(the 19 `?? null` optional-string clears were never counted; 7 of the
named lines already 400) plus **40 silent POST members**. Every claim
manually validated at exact file:line; the three headline behaviors
LIVE-proven on the dev server with probe records (all probes cleaned):

- **N-B4 (MED, LIVE-proven)** — the settings dead-fallback quartet:
  settings/route.ts:73/76/77/83 use NON-optional
  `asString(...) ?? "default"` — `""` is not nullish, so the fallback
  NEVER fires and a present non-string **silently stores `""`**
  (LIVE: `{"defaultCurrency":123,"defaultTier":{"evil":1}}` → 200 +
  `''`/`''`). The §16ad ""-is-not-nullish lesson has 4 unapplied
  instances — the s38 signup bug's exact shape, still live.
- **N-B5 (MED-LOW, LIVE-proven)** — contacts PUT :94 `status` has NO
  type guard and NO enum check: `{"status":123}` **silently resets an
  "inactive" contact to "active"** (LIVE-proven), and
  `{"status":"banana"}` stores verbatim — `CONTACT_STATUSES`
  (constants.ts:309) is not even imported by the route.
- **N-B8 (LIVE-proven)** — events PUT :42 `endAt`: a bad-type payload
  **silently clears the end time AND bypasses the s36 end≥start
  invariant** (the merged-record check skips a null endAt) —
  `{"endAt":{"$gt":"..."}}` → 200 + `endAt: null`.
- **N-B6** — `asNumber` truthy/array edges: `true`→1, `[5]`→5, `[]`→0
  all pass `Number()` — a JSON array payload silently stores 5 on
  leads `value` / accounts `annualRevenue`+`employees`.
- The `?? null` optional-string clears (19 PUT sites): a non-string
  payload silently NULLs the field on PUT (email/phone/company/
  position/source/industry/website/notes/relatedType/relatedName/
  description/location/role/engagementLevel/companySize).

**Graduation scope (Tier 1 + Tier 2):** the PUT-side silent-mutation
family (35 guard sites) + the POST-side *inventing* twins (7 sites —
where a bad type silently invents data: `value→0`, `dueAt→NOW`, or
bypasses the events invariant). **Stays deferred with rationale:** the
POST-side enum defaults (10 sites — lenient-create, no data destroyed),
the POST-side string nulls (~19 sites — same), the strict-bool
`isKey`/`allDay` idioms (4 sites — deliberate `=== true`), plus every
other ledger item re-confirmed (CSV injection → deploy-posture; Excel
accept → S26-P6 parity; TOCTOU → impossible post-seed; hydrate →
contained by the layout redirect; the 11 e2e sleeps → zero flakes;
updateLead supersede → the refetch IS the rollback; upload MIME →
contained; dead api.ts helpers → zero call sites, delete as a
drive-by).

**The UI-payload census (the guard rollout's safety proof):** every
real writer sends properly-typed values — the dialogs send
strings-or-undefined/null, `Number()`/`parseFloat()` for numerics, ISO
strings for dates; the inline controls send strings/numbers; settings
sends strings + `Number()`; the e2e suite drives the UI only (no direct
API calls); the seed writes via Prisma directly. **No guard can break a
real payload — the entire surface is API-only**, the same posture as
the s37/s38/s39 guard families.

## Standing layers (36th session, NO DRIFT)

- The reference bundle md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`,
  1,631,071 bytes — ELEVENTH consecutive stable session, fresh-fetched
  + byte-compared against the cache).
- The reference's mobile-nav absence at a TRUE 390px (8 links in DOM,
  0 visible, nav w=0, no hamburger — 36th session).
- The reference demo data still zero ($0.0k/$0.0k/$0k).
- Our drawer live in every direction (open: the portal nav at 288px
  with all 8 links + the body scroll-lock + focus on the Close button;
  Escape: `visibility:hidden` + `pointer-events:none` + unlocked +
  `aria-expanded:"false"`; history.back() on an in-app route change
  /contacts → /: closed — the s35 ownership fix holds).
- Zero 390px overflow on all nine routes (scrollWidth 390 == clientWidth
  390 on every route).
- The FK envelope 400 LIVE (re-proven by the graduation audit's probes:
  `{"photoUrl":999}` → 400; the non-FK bad-type probes all sailed —
  the gap this session closes).
- The gitignore negative space holds (the uploads GET route tracked;
  the anchored `/uploads/` ignores only the runtime dir).

## The fixes (S40-P1..P6, RED-first)

### S40-P1 — the coercion-guard helper family (api.ts)

Three new predicates next to `isBadFK`, semantics documented in-code
(the isBadFK class generalized to the parse shapes the non-FK fields
use):

- `isBadString(v)` — present non-string (`v !== undefined && v !==
  null && typeof v !== "string"`); the general predicate `isBadFK`
  mirrors for FK ids. null/absent stay the explicit clear/absent.
- `isBadDate(v)` — present, non-empty, and (non-string OR unparseable):
  unlike FK ids, dates have a parseable shape, and garbage STRINGS
  currently clear too (`asDate("garbage")` → undefined → null). `""`
  stays the explicit clear (the `asFKId` convention).
- `isBadNumber(v)` — present, non-empty, and NOT (a finite number OR a
  numeric string): kills the `true`→1 / `[5]`→5 / `[]`→0 / `" "`→0
  edges (`Number(" ")` is 0 — the whitespace string is BAD, trimmed
  numeric strings are good, literal `""` stays absent per `asNumber`'s
  own special case).

RED pins first: `tests/coercion-guards.test.ts` (new, behavior tests —
the edge matrix for all three: absent/null/""/valid/garbage/boolean/
array/object per helper, ~14 checks).

### S40-P2 — the PUT-side type-guard sweep (the headline, 31 fields)

The s37 FK-guard shape applied to every silent PUT member, all inside
the existing `"field" in body` blocks, each guard a 400 with the house
"Invalid <thing>" vocabulary:

| route | field | guard | message |
|---|---|---|---|
| leads/[id]:33-37 | email, phone, company, source | isBadString | Invalid email / phone number / company / source |
| leads/[id]:36 | value | isBadNumber | Invalid value |
| leads/[id]:48-49 | expectedCloseDate, nextFollowUp | isBadDate | Invalid expected close date / follow-up date |
| contacts/[id]:24-33 | email, phone, company, position, source | isBadString | Invalid email / phone number / company / position / source |
| contacts/[id]:59-73 | role, engagementLevel, companySize | isBadString | Invalid role / engagement level / company size |
| contacts/[id]:94 | status | isBadString + **CONTACT_STATUSES enum** (N-B5) | Invalid status |
| accounts/[id]:23-26 | industry, email, phone, website | isBadString | Invalid industry / email / phone number / website |
| accounts/[id]:27-28 | annualRevenue, employees | isBadNumber | Invalid annual revenue / employee count |
| activities/[id]:23-25 | notes, relatedType, relatedName | isBadString | Invalid notes / related type / related name |
| activities/[id]:26 | dueAt | isBadDate | Invalid due date |
| events/[id]:23-25 | description, location, relatedType | isBadString | Invalid description / location / related type |
| events/[id]:42 | endAt | isBadDate (also re-arms the s36 invariant — N-B8) | Invalid end date |

RED pins first: it.each rows in tests/api-robustness.test.ts (~31
checks — the guard call + the message per site, the established s37
table style).

### S40-P3 — the settings dead-fallback revival + guards (N-B4)

settings/route.ts — the quartet gains `optional: true` (the s38
signup-name fix shape: `""`/whitespace/null now fall back to the
documented default instead of storing `""`) + `isBadString` guards →
400; `followUpDays` gains `isBadNumber` → 400 "Invalid follow-up days".
Five sites. RED pins first (5 rows + the optional-revival shape).

### S40-P4 — the POST-side inventing twins (7 sites)

Where a bad type silently INVENTS data on create: leads/route.ts:60
(value→0), :64/:66 (dates→null), accounts/route.ts:54-55
(revenue/employees→null), activities/route.ts:66 (dueAt→**NOW** — the
worst), events/route.ts:50 (endAt→null, the invariant twin). Same
guards, same vocabulary. RED pins first (7 rows).

### S40-P5 — the login envelope (N1)

login/route.ts — the read + verification + cookie-set tail wrapped in
try/catch → `ERR.INTERNAL()` (the signup/verify/resend posture), and
login joins the auth-reads containment it.each (the presence pairing
findUnique). RED pins first (2 checks).

### S40-P6 — the hygiene (drive-by)

- `asRequiredString` + `asOneOf` deleted from api.ts (zero call sites,
  grep-verified — the dead-export ledger item closed).
- `exact: true` on the two earlier import tests' toolbar clicks
  (crm.spec.ts:1428, :1446 — the N3 uniformity).
No RED pins (grep-verifiable + e2e-held).

## Execution order

P1 pins → P2/P3/P4/P5 pins (all RED written together, confirmed failing
with the exact predicted count) → the implementations (api.ts helpers
first, then the route sweeps, then settings, then the POST twins, then
login, then hygiene) → target suites GREEN → the full gate (lint · tsc ·
unit · build · e2e 108/108 on a fresh CI=1 boot) → LIVE verification on
the dev server (the three LIVE-proven silent mutations now 400 with the
exact messages; null/absent still clear; a valid payload still stores;
the settings round-trip restored; login still works) → screenshots →
docs realignment (README badge/paragraph, AGENTS counts + the session-40
block, CLAUDE counts, PAD the s40 row, SKILL v1.37.0 §16af + frontmatter
+ project_state + the H1, docs/session_73.md, this plan's execution
record, both worklogs) → commit on main + the SSH-wrapper push.

## Validation checklist (pre-execution)

- [x] N-B4: settings/route.ts:73-88 read; the non-optional `??` shapes
      confirmed; LIVE-proven (200 + `''` stored, then restored).
- [x] N-B5: contacts/[id]:94 read; CONTACT_STATUSES (constants.ts:309)
      unused by the route; LIVE-proven (inactive → active silent reset,
      probe cleaned).
- [x] N-B8: events/[id]:42 + the merged-record invariant at :63-67
      read; LIVE-proven (endAt cleared to null, probe cleaned).
- [x] The full census table: every file:line read in source this
      session (leads/contacts/accounts/activities/events [id] + POST +
      settings + api.ts).
- [x] N1: login/route.ts read (the bare findUnique at :27; the
      wrapped siblings in signup/verify/resend).
- [x] The UI-payload census: entity-dialogs.tsx (Account/Contact/Lead/
      Event/Activity forms), leads-page inline controls, contacts-page
      inline role + edit form, settings-page — all typed payloads.
- [x] The e2e census: no direct API calls in crm.spec.ts; the UI-driven
      payloads are typed.
- [x] The dead helpers: zero call sites (src/ + tests/, grep-verified).
- [x] No existing pins match the settings parse calls (grep-verified —
      no re-anchor risk).

## Execution record (filled during execution)

- [x] S40-P1 RED: tests/coercion-guards.test.ts (11 behavior checks —
      the REAL edge matrix: the absent/null/"" explicit-clear
      conventions, garbage date strings, Number()'s true/[5]/[]/"
      " truthy edges). GREEN after the three predicates landed in
      api.ts (+ the two dead helpers asRequiredString/asOneOf deleted
      in the same edit — P6's drive-by).
- [x] S40-P2 RED: 31 failing pins (30 it.each field rows + the
      CONTACT_STATUSES enum row). GREEN after the five [id]-route
      sweeps (leads 7, contacts 10 incl. the status type + enum,
      accounts 6, activities 4, events 4).
- [x] S40-P3 RED: 6 failing pins (5 guard rows + the optional-revival
      shape). GREEN after the settings edit (the quartet optional:
      true + the five guards; firstDayOfWeek untouched — its enum
      check already 400s).
- [x] S40-P4 RED: 7 failing pins (the inventing twins). GREEN after
      the four POST-route guards (leads 3, accounts 2, activities 1,
      events 1).
- [x] S40-P5 RED: 2 failing pins (the login it() + login joining the
      auth-reads it.each). GREEN after the try/catch wrap of the read
      + verification + cookie-set tail.
- [x] S40-P6: exact: true on the two earlier import tests' toolbar
      clicks (1428/1446) — all ten Import clicks now uniform; the
      dead exports deleted with P1.
- [x] RED total: exactly 57 (46 api-robustness + 11 coercion-guards;
      the prediction said 58 — one arithmetic slip, the FAILURE SET
      matched the pin set exactly; all 96 pre-existing checks stayed
      green through RED).
- [x] Gate: lint 0/0 (enforced) · tsc 0 · **966/966 unit (50 suites,
      +57)** · build clean · **108/108 e2e** on a fresh boot (CI=1) —
      the UI-payload census held: no e2e tripped a guard.
- [x] LIVE: every guard family both directions on the dev server —
      contacts {"status":123}/{"status":"banana"}/{"phone":123}/
      {"role":{}} all 400 with exact messages, the status UNCHANGED
      by the rejects, null phone clears, valid status stores;
      settings {"defaultCurrency":123} → 400 "Invalid currency", ""
      → the revived "AED" fallback, "aed" → "AED", followUpDays
      "abc" → 400, all restored; events endAt {} POST → 400 + endAt
      123 PUT → 400 + the 12:00 endAt intact through both; leads
      value "abc"/true → 400, "5000" → 5000, garbage date → 400,
      valid date stores; accounts [5]/" " → 400, numeric strings
      store; activities dueAt {} → 400, notes 123 → 400; login 200
      with the wrap. All probes cleaned BY EXACT ID.
- [x] INCIDENT + recovery: the first probe cleanup's `d[0]` on
      `?search=` deleted the seeded contact "Aisha Bakr" (the list
      endpoint does not filter server-side). Restored surgically to
      the seed loop's exact values (verified 15/15 + 4 users); the
      s36 "S36 Guard Probe" leftover + a junk 79-a user cleaned too.
      Documented as the session's census-method lesson (§16af).
- [x] Screenshots: 02/11/12 re-captured + **48-settings-defaults-
      guards NEW** (the N-B4 fix's user-visible surface). 02 + 48
      VLM-verified (the KPIs 24/$337.0k/$126.0k/$0k/29.2%/83 days;
      the Defaults tab clean with AED/new/B/3/Month/Monday restored).
- [x] Docs realigned: README badge 1074 + the session-40 paragraph +
      the suite list (+coercion-guards), AGENTS 966/108 + the
      session-40 block, CLAUDE 966, PAD the s40 row / 52 files /
      966+108 / the checklist / the command table, SKILL v1.37.0
      frontmatter + project_state + the H1 + §16af, docs/session_73.md,
      this record, both worklogs.
