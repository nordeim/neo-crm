# Session-36 Parity Remediation Plan (2026-10-03)

Session 36 on `main` @ `8264312` (session-35 code at `1468867` + the
operator's `docs/session_64.md` transcript commit). Baseline gate on the
pulled tree: **lint 0/0 · tsc 0 · 817/817 unit (48 suites) · e2e 106/106
(documented)** — the tree is whole, the working tree clean, `.env`
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root intact.

## The audits (two parallel review agents + manual validation)

### A. The session-35 re-audit (fresh eyes on commit `1468867`)

The headline fixes are all genuine and correctly implemented — verified
CLEAN: the uploads GET route (traversal-proof, exact POST-name parity,
correct caching), the db-path guard (no remaining absolute re-anchor
path), the mobile-nav ownership move (own-state only; both close paths),
the store hygiene (complete vs the reset route's wipe set), and the FK
guards' null-vs-absent edge semantics.

**NEW findings (the envelope layer's asymmetry):**

- **A (MED-LOW)** — the five DELETE handlers are unwrapped:
  `contacts/[id]`, `accounts/[id]`, `events/[id]`, `leads/[id]`,
  `activities/[id]` — `db.X.delete` with no try/catch. SQLITE_BUSY-class
  failures escape as raw non-envelope 500s — exactly the class the
  session-35 commit message claims to have closed.
- **B (MED-LOW)** — the sibling POST creates are unwrapped:
  `contacts/route.ts` create, `leads/route.ts` create,
  `accounts/route.ts` create (asymmetric with activities/events POST,
  which got the wrap).
- **C (LOW)** — `contactId` findUnique sits OUTSIDE the try in
  activities POST and events POST; the `[id]` routes' initial existence
  `findUnique` is outside too (internal structural asymmetry).
- **D (LOW)** — `users` PATCH update, `settings` PUT upsert, and
  `activities/[id]` update are unwrapped (same doctrine, outside the
  six-route scope).
- **F (LOW)** — non-string FK values silently coerce to `null` via
  `asString` optional semantics (silently CLEAR the FK instead of 400) —
  pre-existing on both sides, documented, not this session.
- **Weak-pin class** — the `it.each` try/catch pins match anywhere in the
  file, not that the mutating call sits inside the try.

### B. The deferred-findings audit (the ten session-35 LOW items)

- **F9 — events PUT drops the end≥start invariant: HIGH-VALUE (top of
  the shortlist).** POST enforces `"End time must be after start time"`
  (`events/route.ts`); PUT parses both dates with no cross-check despite
  fetching `existing` — a real user-hitable inconsistency (calendar chip
  → EventDialog has free `datetime-local` fields, no client validation).
  Zero parity risk (a defensive superset at most).
- **F6 — upload POST buffers the whole multipart body before the 5MB
  check: MEDIUM.** `formData()` at `upload/route.ts:24` runs before the
  ceiling check at `:38` — a session-holder can POST a multi-GB body and
  buffer it in memory before rejection.
- **F5 — photoUrl accepts arbitrary URLs: MEDIUM (wider than
  documented).** `users` PATCH (`slice(0,300)`), contacts POST
  (`max:500`) AND contacts `[id]` PUT — the contacts photoUrl is shared
  data any session-holder can set, rendered to all viewers (tracking
  pixels / defacement-ish broken images). Not XSS (`javascript:` is
  inert in img src). The only UI writer returns `/api/uploads/<32hex>`;
  the seed writes none.
- **F2 — health returns 200 with `db:"down"`: MEDIUM.** The session-34
  incident is the existence proof. VERIFIED CAVEAT: Playwright 1.63's
  readiness probe accepts only 200–403, and webServer setup precedes
  globalSetup — but on a fresh boot the probe passes because SQLite
  auto-creates `db/e2e.db` (the folder exists via `.gitkeep`) and
  `SELECT 1` succeeds on an empty file. The 503 only fires when SELECT 1
  actually fails — the state where an honest 5xx matters.
- **Keep deferred (rationales re-confirmed):** F1 reset role-gating
  (parity restriction; the seeded demo user's role is `"user"` — a gate
  would break the demo-user e2e), F3 list caps (silent truncation is
  worse; pagination unmirrored), F4 XFF limiter (needs a deploy-posture
  decision; wrong-mode = global bucket self-DoS), F7 updateLead race
  (the unconditional refetch is load-bearing rollback; the supersede
  guard is below the value line), F8 hydrate ordering (naive fix
  regresses first paint; true fix = per-slice loading redesign),
  F10 SavedReport dead model (schema ripple, zero gain).
- **NEW alongside:** `/api/reset` runs its seven `deleteMany` calls
  sequentially outside a transaction — a mid-chain failure leaves a
  PARTIAL WIPE plus a raw 500; photoUrl cap inconsistency (300 vs 500);
  no `onError` fallback on photoUrl imgs (self-noticing only, deferred).

### C. The standing-layer drift re-sweep (live, this session)

32nd consecutive session, **NO DRIFT**: the reference bundle
md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes —
SEVENTH consecutive bundle-stable session; the login page's
`/static/index-D96eRrlv.js` is the documented unauth bundle, not the
drift instrument); the reference's mobile-nav absence at a TRUE 390px
(8 links in DOM, 0 visible, nav w=0, no hamburger); the reference demo
data still zero (`$0.0k`); our clone verified — the seeded dashboard at
the s32 scales ($337.0k / $126.0k / $0k), the drawer LIVE both
directions (native-click open: 8 links + dual scroll lock + focus on the
close button; Escape: closed + unlocked + `aria-expanded:false`;
`history.back()`: closed + unlocked — the s35 ownership fix holds), zero
390px overflow on all nine routes, the FK envelope 400 LIVE
(`{"ok":false,"code":"BAD_REQUEST","msg":"Selected company does not
exist"}`), the gitignore negative space holds
(`git check-ignore src/app/api/uploads/x.ts` → not ignored).

## The remediation — S36-P1..P7

- **S36-P1 — the events PUT end≥start invariant (HIGH):** after field
  parsing, before the update, merge with `existing` (patch semantics):
  `effectiveStart = data.startAt ?? existing.startAt`,
  `effectiveEnd = data.endAt !== undefined ? data.endAt : existing.endAt`;
  reject `effectiveEnd && effectiveEnd < effectiveStart` with the POST's
  exact `"End time must be after start time"`. RED-first: pins in
  `tests/api-robustness.test.ts` asserting BOTH event routes carry the
  invariant + the exact message.
- **S36-P2 — the envelope completion + the reset transaction:**
  - Wrap the five DELETE handlers → `ERR.INTERNAL()`.
  - Wrap the three POST creates (contacts, leads, accounts) — moving
    their FK-guard lookups inside the try while at it (finding C).
  - Wrap `users` PATCH update, `settings` PUT upsert, `activities/[id]`
    update (finding D).
  - Move the activities/events POST `contactId` guards + the `[id]`
    routes' initial `findUnique` inside the try (structural symmetry —
    every DB call inside the envelope).
  - `/api/reset`: the seven `deleteMany` inside `db.$transaction([...])`
    + try/catch → `ERR.INTERNAL()` (atomic wipe — no partial state).
  - STRONGER pins (the weak-pin critique): slice per HANDLER
    (`DELETE`/`PUT`/`POST` export block) and assert try + ERR.INTERNAL
    INSIDE the slice, so a moved-out write fails the pin.
- **S36-P3 — the upload Content-Length pre-gate:** before `formData()`,
  read `content-length`; reject with the SAME `"File too large (max
  5MB)"` vocabulary when `CL > MAX_UPLOAD_BYTES + 64*1024` (multipart
  overhead). Documented limitation: chunked uploads without
  Content-Length bypass the pre-gate (the post-parse check remains the
  backstop). RED-first: a source-contract pin that the CL gate precedes
  `formData()` in the route source.
- **S36-P4 — the photoUrl prefix guard:** in `users` PATCH + contacts
  POST + contacts `[id]` PUT — accept `null`, or a string matching
  `^/api/uploads/` (the documented writer) or `^https://` (the
  reference's CDN-shaped data); anything else →
  `ERR.BAD_REQUEST("Invalid photo URL")`. Normalizes the 300/500 cap
  drift as a side effect. RED-first: per-route pins.
- **S36-P5 — health 503 on db-down:** catch →
  `fail("SERVICE_UNAVAILABLE", "Database unavailable", 503)` (stays
  inside the envelope). RED-first: a source-contract pin. Then the
  verified fresh-clone e2e boot check: delete `db/e2e.db` +
  `tests/e2e/.auth`, run the e2e suite — the webServer probe must still
  pass (SQLite auto-creates the file; `SELECT 1` succeeds) and the full
  106 must stay green.
- **S36-P6 — the gate:** lint 0/0 · tsc 0 · unit (817 + the new) ·
  build · e2e 106/106.
- **S36-P7 — the deliverables:** LIVE verification on the dev server
  (the events invariant both directions on a seeded event — a valid edit
  still 200s, an inverted edit → the envelope 400; the CL pre-gate via
  an oversized `content-length` POST; the photoUrl guard via a bogus
  `data:` URL PATCH; health still 200/`db:"up"` with the 503 path
  source-pinned; the drawer re-check), the screenshot set
  (`docs/screenshots/44-…`), `.env`/`.env.example` re-verified, docs
  realignment (README badge + the session-36 paragraph, AGENTS counts +
  the session-36 block, CLAUDE, PAD, SKILL **v1.33.0** §16ab +
  frontmatter + project_state, `docs/session_65.md`, this plan's
  execution record, both worklogs) · commit + SSH-wrapper push.

## Validation gates

- RED-first: P1/P3/P4/P5 add RED checks before their implementations;
  P2's per-handler slices must FAIL against the current unwrapped
  handlers (proving the pins bite) before the wraps land.
- GREEN: lint 0/0 · tsc 0 · unit · build · e2e — the full gate order.
- LIVE: the invariant both directions, the CL pre-gate, the photoUrl
  guard, the health 200, the drawer, the seeded dashboard at the s32
  scales.

## Deferred (documented, not this session)

F1 (reset role-gating — parity restriction + the seed-role/e2e
interaction), F3 (list-endpoint caps), F4 (trusted-proxy limiter), F7
(updateLead supersede guard), F8 (hydrate per-slice redesign), F10
(SavedReport dead model), the non-string-FK coercion (F), the photoUrl
`onError` fallback, the auth-routes' read guards, the double-fetch on
first load (harmless, wasteful); the base44-only AI extraction; the
Opportunity create/edit UI (absent on BOTH sides); the standing drift
re-sweep continues next live visit.

---

## EXECUTION RECORD (2026-10-03, post-gate)

Executed as planned, S36-P1..P7 all landed:

- **S36-P1**: the events PUT invariant, checked against the MERGED
  record (`effectiveStart`/`effectiveEnd` vs `existing` — an endAt-only
  patch can no longer slip past an unchanged later startAt), the
  POST's exact "End time must be after start time". LIVE: inverted
  end-only → 400 with the message; consistent reorder → 200; valid
  extension → 200 persisted.
- **S36-P2**: every mutating DB call in every handler envelope-held —
  the five DELETEs, the three POST creates, users PATCH, settings PUT,
  activities `[id]` update; the activities/events POST `contactId`
  guards + the `[id]` routes' existence fetches moved INSIDE the try
  (leads' PUT is one whole-handler try — its stage parsing reads
  `existing.closedAt`); the reset wipe ATOMIC inside `db.$transaction`.
  The pins are per-handler `handlerBlock()` slices (from `export async
  function <verb>` to the next export) — STRONGER than the s35
  file-wide regexes, which would keep passing if a write moved back
  out of the try.
- **S36-P3**: the Content-Length pre-gate BEFORE `formData()` (declared
  CL > MAX_UPLOAD_BYTES + 64KB overhead allowance, the same "File too
  large (max 5MB)" vocabulary). LIVE: a 99,999,999-byte declared CL →
  400 in 54ms, no buffering. Chunked-encoding bypass documented;
  post-parse ceiling the backstop. A small real upload still 200s.
- **S36-P4**: the photoUrl prefix guard on users PATCH + contacts
  POST/PUT (only `null`, `/api/uploads/…`, `https://…`). LIVE:
  `data:` → 400 "Invalid photo URL"; `javascript:` → 400; `null` →
  200 cleared; an https URL stores (the reference's CDN-shaped data —
  the killed surface is the payload class). The 300/500 cap drift
  normalized.
- **S36-P5**: the honest health 503 (`fail("SERVICE_UNAVAILABLE",
  "Database unavailable", 503)`); the playwright caveat CLOSED by
  measurement + a fresh-boot e2e run (db/e2e.db + tests/e2e/.auth
  deleted → the full suite 106/106 — SQLite auto-creates the file,
  `SELECT 1` succeeds, the probe passes). Health still 200/`db:"up"`
  live on the dev server.
- **S36-P6**: gate green — lint 0/0 · tsc 0 · **838/817+21 unit** ·
  build clean · **106/106 e2e (fresh-boot)**.
- **S36-P7**: LIVE verification of every fix (above) + the drawer
  re-check (open/Escape/back all clean) + the seeded dashboard at the
  s32 scales; 4 screenshots (02/11/12 re-captured + **44** the
  calendar events-invariant surface NEW); `.env`/`.env.example`
  re-verified (no env surface change); docs realigned (README badge
  838 + the session-36 paragraph, AGENTS 838 + the session-36 block,
  CLAUDE 838, PAD the s36 row / 838+106, SKILL **v1.33.0** §16ab +
  frontmatter + project_state, docs/session_65.md, this record, both
  worklogs).
- Gate-caught in the loop: the photoUrl pin initially matched
  `https://` — but `stripComments` eats the `//` inside the string
  literal, so the pin could never match its own implementation;
  re-anchored on the bare `https:` (a §16ab census-method lesson).
- Standing layers: 32nd session, NO DRIFT (the bundle md5-identical —
  SEVENTH consecutive stable session; the reference's mobile-nav
  absence at a TRUE 390px; the demo data still zero; our drawer live
  both directions; zero overflow; the FK envelope live; the gitignore
  negative space holds).
