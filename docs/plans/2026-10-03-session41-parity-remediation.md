# Session-41 Parity Remediation Plan (2026-10-03)

Session 41 on `main` @ `1e088a6` (the session-40 code at `e3b410e` + the
operator's `docs/session_74.md` transcript commit). Baseline gate on the
pulled tree: **lint 0/0 (enforced) · tsc 0 · 966/966 unit (50 suites)** —
the documented state exactly. `.env` `DATABASE_URL="file:../db/custom.db"`
with `db/` at the repo root verified intact; the dev server healthy on
:3000 (`/api/health` → `{"status":"healthy","db":"up"}`); no stale :3100
listener; `agent-browser 0.38.1` ready.

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-40 re-audit (fresh eyes on commit `e3b410e`)

All six session-40 fix families verified GENUINE (P1 the three predicates
with real behavior tests; P2 the 30-site PUT sweep with the status enum;
P3 the settings revival + guards; P4 the 7 inventing twins; P5 the login
envelope; P6 the hygiene) — no regressions, no vacuous pins, no legit
payload can trip a guard (the UI-payload census re-verified
independently). **New findings (each manually validated at file:line):**

- **N1 (LOW-MED)** — the shared session read is outside the envelope on
  every route: `getSessionUser()`'s `db.user.findUnique`
  (`src/lib/auth.ts:123`) is awaited by `requireSession()`
  (`src/lib/api.ts:31`) with no try/catch — a SQLITE_BUSY-class failure
  during the session read answers a raw non-JSON 500 on every protected
  route. `auth/me` (the only route that reads the session directly) has
  the same hole and is absent from the auth-reads containment it.each.
- **N2 (LOW)** — the GET list routes' reads are also outside the envelope
  (dashboard :47, reports :83, search :15, export :71, opportunities :15,
  users :10 + the five entity GETs). Never claimed, caught by `call()`.
  **Stays deferred** (one family per session; the session-42 candidate).
- **N3 (INFO)** — `isBadNumber`'s non-finite branch is unpinned
  (`{"value":1e999}` → Infinity → correctly 400s, but no behavior test
  covers NaN/Infinity). A strengthening pin.
- **N6 (MED-LOW, deferred)** — the 11 e2e sleeps: four back one-shot
  non-retrying assertions (`crm.spec.ts:1366/:2064/:2079/:2084`) —
  zero flakes in 40 sessions, stays deferred.

### B. The deferred-findings graduation audit — the headline

**The POST-side lenient-create family GRADUATES, split:** the ledger's
"no data destroyed" rationale is FALSE as stated — a present non-string
payload IS silently destroyed (`POST {"phone":123}` → **200 + phone:
null** — the caller's data dropped without error; LIVE-proven this
session, probe cleaned by exact ID). Every one of the 19 string-null
sites has a PUT twin already guarded in s40 with the identical predicate
+ message. The 12 enum-field type-gaps silently invent defaults
(`POST {"stage":123}` → **200 + stage "new"**; `{"type":{}}` → "call";
`{"priority":[]}` → "normal" — all LIVE-proven). **Stays deferred with
sharpened rationale:** the 2 `source` enum-membership sites (source is a
settings-configurable vocabulary — `settings-page.tsx` edits
`contactSources` — and the CSV import sends arbitrary source strings; a
static enum would reject operator-customized sources), the strict-bool
`isKey`/`allDay` idioms, the CSV formula-injection half (deploy-posture
— see P2), the Excel accept (S26-P6), the partial-import conflation, the
11 sleeps, and the standing ledger (all 13 re-confirmed, zero drift).

**Two more graduations from fresh eyes:**

- **The CSV embedded-quote escaping (the item-3 split):**
  `toQuotedCsv`/`entityDumpCsv`/`unquotedHeaderCsv`
  (`src/lib/entity-export.ts:32/:51/:62`) wrap every value in plain
  `"${v}"` with NO quote doubling — a contact `Acme "Best" Inc` exports
  as `"Acme "Best" Inc"` (malformed CSV: column shift on re-parse,
  corrupting our own export→import round-trip). The fix is
  byte-identical for every quote-free cell (the pinned export contract
  untouched; the e2e pins filenames + headers only).
- **The relatedType vocabulary split (new finding, MED-LOW):** the
  Activity/Event dialogs send lowercase related types
  (`ACTIVITY_RELATED_OPTIONS` = "contact"/"account"/"opportunity"/"lead",
  `entity-dialogs.tsx:81-86`), the seed stores capitalized
  `"Opportunity"` (`prisma/seed.ts:366-368`), and the reports join is
  case-SENSITIVE (`reports-data.ts:198` — `a.relatedType ===
  "Opportunity"`): **a UI-logged "Related To: Opportunity" activity
  never joins the Deals at Risk table.** The reference joins on a real
  FK (`related_to_id`), so its UI-created activities always join — the
  freeform model introduced this divergence. LIVE-shape confirmed (a
  lowercase probe activity stored `relatedType: "opportunity"`,
  cleaned by exact ID).

**Hygiene (fresh eyes):** the dead `sources` var
(`contacts-page.tsx:183` — zero reads; the kke filter panel uses
`sourcesF` + the static options) and the dead `DEFAULT_SETTINGS` export
(`constants.ts:463` — zero consumers repo-wide, still carrying the
pre-s28 emoji vocabulary). The s40-P6 dead-export precedent.

## Standing layers (37th session, NO DRIFT)

- The reference bundle md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`,
  1,631,071 bytes — TWELFTH consecutive stable session, fresh-fetched
  + byte-compared against the cache).
- The reference's mobile-nav absence at a TRUE 390px (8 links in DOM,
  0 visible, nav w=0, no hamburger — 37th session).
- The reference demo data still zero ($0.0k/$0.0k/$0k).
- Our drawer live in every direction (open: the portal nav at 288px
  with all 8 links + the body+main dual scroll-lock + focus on the Close
  button; Escape: `visibility:hidden` + `pointer-events:none` + unlocked
  + `aria-expanded:"false"`; history.back() on an in-app route change:
  closed — the s35 ownership fix holds).
- Zero 390px overflow on all nine routes (scrollWidth 390 ==
  clientWidth 390 on every route).
- The FK envelope 400 LIVE (re-proven: `{"value":true}` on the leads
  POST → 400 "Invalid value" — the s40 guard held while the unguarded
  `stage:123` sailed through, the exact gap this session closes).
- The gitignore negative space holds (the uploads GET route tracked;
  the anchored `/uploads/` ignores only the runtime dir).

## The fixes (S41-P1..P5, RED-first)

### S41-P1 — the POST-side lenient-create completion (the headline, 31 sites)

The s40 PUT-guard shape applied to every POST-side lenient member —
`isBadString(body.X)` → 400 with the PUT vocabulary VERBATIM, placed at
the parse site (before the `?? default`/`?? null` parse or before the
create for inline parses). null/absent keep the default/null semantics
(a create cannot "clear" a field that does not exist yet); `""` keeps
the optional-parse default. **Zero new vocabulary.**

| route | field | message |
|---|---|---|
| contacts/route.ts:29 | email | Invalid email |
| contacts/route.ts:38 | priority | Invalid priority |
| contacts/route.ts:48 | role | Invalid role |
| contacts/route.ts:52 | engagementLevel | Invalid engagement level |
| contacts/route.ts:56 | companySize | Invalid company size |
| contacts/route.ts:97 | phone | Invalid phone number |
| contacts/route.ts:98 | company | Invalid company |
| contacts/route.ts:99 | position | Invalid position |
| contacts/route.ts:100 | source | Invalid source |
| leads/route.ts:30 | stage | Invalid stage |
| leads/route.ts:33 | source | Invalid source |
| leads/route.ts:63 | email | Invalid email |
| leads/route.ts:64 | phone | Invalid phone number |
| leads/route.ts:65 | company | Invalid company |
| accounts/route.ts:30 | tier | Invalid tier |
| accounts/route.ts:33 | status | Invalid status |
| accounts/route.ts:54 | industry | Invalid industry |
| accounts/route.ts:55 | email | Invalid email |
| accounts/route.ts:56 | phone | Invalid phone number |
| accounts/route.ts:57 | website | Invalid website |
| activities/route.ts:31 | type | Invalid activity type |
| activities/route.ts:34 | status | Invalid status |
| activities/route.ts:37 | priority | Invalid priority |
| activities/route.ts:66 | notes | Invalid notes |
| activities/route.ts:71 | relatedType | Invalid related type |
| activities/route.ts:72 | relatedName | Invalid related name |
| events/route.ts:44 | type | Invalid event type |
| events/route.ts:47 | status | Invalid status |
| events/route.ts:79 | description | Invalid description |
| events/route.ts:85 | location | Invalid location |
| events/route.ts:86 | relatedType | Invalid related type |

The enum fields keep their existing membership checks (bad STRINGS
still 400 there); the new type guards close the non-string silent
path. The `source` ENUM-membership question stays deferred
(settings-configurable vocabulary + the CSV import's arbitrary source
strings). RED pins first: 31 it.each rows in
`tests/api-robustness.test.ts` (the s40-P2/P4 table style — the POST
`handlerBlock()` + `guardCall("isBadString", field)` + the message).

### S41-P2 — the CSV embedded-quote escaping

`src/lib/entity-export.ts` — a private `qq(v)` cell-quoter
(`'"' + String(v).replace(/"/g, '""') + '"'`) applied by all three
builders (`entityDumpCsv` :32, `toQuotedCsv` :50-51,
`unquotedHeaderCsv` :62 — the header stays unquoted per the S29 bundle
extract). **Byte-identical for every quote-free cell** — the pinned
export contract is untouched (the e2e pins filenames + headers, none
pin quote-bearing bytes). `toCsv`'s `escapeCell` already does this
correctly — no change there. RED pins first in
`tests/entity-export.test.ts` (~5: the quote-doubling per builder, the
round-trip `toQuotedCsv → parseCsv → original values`, and the
byte-exactness pin for quote-free data).

### S41-P3 — the relatedType case-insensitive join

`src/lib/reports-data.ts:198` — the at-risk join's filter becomes
case-insensitive (`(a.relatedType ?? "").toLowerCase() ===
"opportunity"`), restoring the reference's FK-join semantics for
UI-created activities (any casing joins; the seeded capitalized values
unchanged). RED pins first in `tests/reports-data.test.ts` (2: a
lowercase-"opportunity" activity joins the at-risk computation; an
uppercase one too — the strengthening direction).

### S41-P4 — the session-read envelope (N1)

- `src/lib/api.ts` `requireSession()` — the `getSessionUser()` await
  wrapped in try/catch → `{ response: ERR.INTERNAL() }` on failure (a
  DB-down session read now answers the `{ ok, error }` envelope on
  every protected route, not a raw non-JSON 500). The 401 path
  unchanged.
- `src/app/api/auth/me/route.ts` — the direct read wrapped in
  try/catch → `ERR.INTERNAL()` (the route's `ok(user | null)` happy
  path unchanged; it is NOT session-gated by design).
- The `(app)` layout keeps its direct `getSessionUser()` call — a DB
  failure there throws to Next's error boundary (an honest 500 page);
  redirecting to /login would conflate DB-down with logged-out (the
  documented hydrate-error-vs-logged-out deferred item). RED pins
  first (2 source-contract checks in `tests/api-robustness.test.ts`).

### S41-P5 — the hygiene (drive-by)

- The dead `sources` var deleted (`contacts-page.tsx:183` — zero
  reads, grep-verified).
- The dead `DEFAULT_SETTINGS` export deleted (`constants.ts:463-485` —
  zero consumers repo-wide, grep-verified; still carrying the pre-s28
  emoji vocabulary).
- `isBadNumber`'s non-finite edge matrix pinned (NaN + Infinity
  behavior rows in `tests/coercion-guards.test.ts` — GREEN-on-arrival
  strengthening, the s38-P4 precedent).
- No RED pins for the deletions (grep-verifiable + e2e-held — the
  s40-P6 precedent).

## Execution order

P1..P4 pins (all RED written together, confirmed failing with the exact
predicted count — **40 predicted**: 31 + 5 + 2 + 2) → the
implementations (the five POST-route sweeps first, then entity-export,
then the join, then the session envelope, then hygiene) → target suites
GREEN → the full gate (lint · tsc · unit · build · e2e 108/108 on a
fresh CI=1 boot) → LIVE verification on the dev server (the previously
silent POST mutations now 400 with the exact messages; null/absent
still default; valid payloads still create; the auth/me + login happy
paths intact; the at-risk join LIVE-proven with a lowercase probe
activity; all probes cleaned BY EXACT ID) → screenshots → docs
realignment (README badge/paragraph + the suite list, AGENTS counts +
the session-41 block, CLAUDE counts, PAD the s41 row, SKILL v1.38.0
§16ag + frontmatter + project_state + the H1, docs/session_75.md, this
plan's execution record, both worklogs) → commit on main + the
SSH-wrapper push.

## Validation checklist (pre-execution)

- [x] The 31 P1 sites: every file:line read in source this session
      (contacts/leads/accounts/activities/events POST routes, full
      files).
- [x] The silent classes LIVE-proven with probe records (all cleaned by
      exact ID; 15/15 seeded contacts + zero residue verified after):
      `POST {"phone":123,"company":{"evil":1}}` → 200 + both null;
      `POST {"stage":123}` → 200 + "new"; `POST {"type":{},"priority":[]}`
      → 200 + "call"/"normal"; the lowercase relatedType stored
      verbatim.
- [x] The PUT vocabulary table: read from the five [id] routes
      (grep-verified, exact message strings).
- [x] P2: the three builders read in full; the no-quote-doubling
      confirmed; the e2e CSV pins checked (filenames + headers only);
      the existing entity-export tests checked (quote-free fixtures —
      byte-identical after the fix).
- [x] P3: the join + the UI options + the seed values read; the
      case-split confirmed in source + LIVE.
- [x] P4: requireSession + auth/me + the (app) layout read; the
      auth-reads it.each located (login joined s40; auth/me the gap).
- [x] P5: both dead symbols grep-verified zero-consumer
      (repo-wide, prisma/ + src/ + tests/ + scripts/).
- [x] The UI-payload census (audit B re-verified): all five create
      dialogs send typed payloads — no guard can break a real payload,
      the surface is API-only.
- [x] No existing pins match the POST parse calls or the entity-export
      quoting (grep-verified — no re-anchor risk).

## Execution record (filled during execution)

- [x] S41-P1 RED: 31 failing pins (the POST lenient-create table). GREEN
      after the five POST-route guard sweeps (contacts 9, leads 5,
      accounts 6, activities 6, events 5).
- [x] S41-P2 RED: 4 failing pins (the quote-doubling per builder ×3 +
      the round-trip; the byte-exactness pin GREEN-on-arrival — it IS
      the contract-preservation proof, which is why the 40 prediction
      was one off). GREEN after the qq() helper landed in entity-export.ts
      (one self-fix: the replace's second arg is TWO quotes, not three —
      caught on read-through before any run). The s26 "every value is
      double-quoted" source pin re-anchored on the qq() shape (the
      `"${v}"` regex no longer matches — an intentional contract update,
      the quoting family's evolution documented in-code).
- [x] S41-P3 RED: 2 failing pins (the lowercase + uppercase join rows).
      GREEN after the case-insensitive filter at reports-data.ts:203.
- [x] S41-P4 RED: 2 failing pins (requireSession's try/catch + auth/me's
      wrap). GREEN after the envelope edits.
- [x] S41-P5: the dead `sources` var + `DEFAULT_SETTINGS` deleted
      (grep-verified zero consumers; lint/tsc green after); the
      NaN/Infinity strengthening rows GREEN-on-arrival (2).
- [x] RED total: exactly 39 (31 api-robustness + 4 entity-export +
      2 reports-data + 2 api-robustness P4; the prediction said 40 — one
      arithmetic slip on the byte-exactness pin, the failure SET matched
      the code-change pin set exactly; all 966 pre-existing checks stayed
      green through RED).
- [x] Gate: lint 0/0 (enforced) · tsc 0 · **1008/1008 unit (50 suites,
      +42: 39 RED-first + 3 GREEN-on-arrival strengthening)** · build
      clean · **108/108 e2e** on a fresh boot (CI=1) — no e2e tripped a
      guard.
- [x] LIVE: the previously-silent POST mutations now 400 with the exact
      house vocabulary (contacts {"phone":123} → "Invalid phone number",
      leads {"stage":123} → "Invalid stage", activities {"type":{}} →
      "Invalid activity type", events {"type":[]} → "Invalid event type",
      accounts {"tier":123} → "Invalid tier"); null/absent still default
      (leads without stage → "new"; value "5000" → 5000); a valid full
      contact creates whole (quotes-in-company + all enums; the first
      attempt's "Invalid company size" was the probe's own wrong
      vocabulary — the s28 enum, not a guard regression); login 200 +
      auth/me 200 with the wraps; the at-risk join LIVE-proven BOTH
      directions (a lowercase "opportunity" probe activity pulled
      "Supply chain visibility" OUT of the at-risk list; the deal
      returned after the probe's cleanup). All probes cleaned BY EXACT
      ID; 15/15 seeded contacts + zero residue across all four entity
      lists.
- [x] Screenshots: 02/11/12 re-captured (11 byte-identical to HEAD — the
      deterministic seed; 02/12 differ within chart-animation raster
      noise) + **49-reports-deals-at-risk NEW** (the P3 fix's
      user-visible surface — the tab-2 table at the All Time period; the
      default-quarter capture showed "No at-risk deals", the CORRECT
      pre-existing s31 period scoping — opps filter by createdAt >= Oct 1
      and the seed predates Q4). 02 + 49 VLM-verified: the KPIs
      24/$337.0k/$126.0k/$0k/29.2%/83 days + the blue sidebar layout
      clean; the five at-risk deals + all three charts rendering.
- [x] Docs realigned: README badge 1116 + the session-41 paragraph + the
      suite counts, AGENTS 1008/108 + the session-41 block, CLAUDE 1008,
      PAD the s41 row / 53 files / 1008+108 / the checklist / the command
      table, SKILL **v1.38.0** frontmatter + project_state + the H1 +
      §16ag, docs/session_75.md, this record, both worklogs.
      `.env`/`.env.example` re-verified (no env surface change;
      DATABASE_URL file:../db/custom.db with db/ at the repo root).
