# Session-37 Parity Remediation Plan (2026-10-03)

Session 37 on `main` @ `edf079e` (session-36 code at `1601436` + the
operator's `docs/session_66.md` transcript commit). Baseline gate on the
pulled tree: **lint 0/0 · tsc 0 · 838/838 unit (48 suites)** — the
documented state exactly. `.env` `DATABASE_URL="file:../db/custom.db"`
with `db/` at the repo root intact; the dev server alive and healthy
(`{"status":"healthy","db":"up"}`).

## The audits (two parallel review agents + manual validation)

### A. The session-36 re-audit (fresh eyes on commit `1601436`)

P1/P3/P4/P5 verified genuine and correctly implemented (the events PUT
merged-record invariant incl. its edge cases; the upload pre-gate
arithmetic, ordering and backstop; the photoUrl guard's exhaustive
writer set; the health 503; the reset `$transaction` child-first order;
the read-path doctrine consistently GET-unwrapped per the plan's scope).
**NEW findings (the claim again slightly broader than the ship):**

- **F1 (HIGH — the headline gap)** — the auth family's four mutating
  calls are unwrapped: `db.user.create` (signup `:61`), `db.user.update`
  ×2 (verify `:57` attempt-increment + `:70` success-clear), and
  `db.user.update` (resend `:36`). A Prisma/SQLITE_BUSY failure escapes
  as a raw non-envelope 500 — exactly the class the s36 headline claims
  closed ("every mutating DB call in every handler envelope-held"). The
  plan deferred only the auth routes' READ guards; the writes were
  neither fixed nor deferred.
- **F2 (MED)** — `activities/[id]` PUT still runs its existence fetch
  OUTSIDE the try (`:14-15`; the try starts ~`:49`) — the only one of
  the five `[id]` routes that does (its own DELETE has the fetch
  inside — an intra-file asymmetry). No pin catches it.
- **F3 (MED — test quality)** — the s36 `handlerBlock()` pins assert
  (mutation) ∧ (try) ∧ (ERR.INTERNAL) as independent presence checks;
  they never prove CONTAINMENT. Empirically demonstrated: moving a write
  back out of the try (within the same handler) keeps every pin green.
  The s36 critique of the s35 pins ("presence, not containment") still
  applies, one granularity finer — which is exactly how F2 slipped.
  Also missing: PUT containment pins for contacts/leads/accounts/events
  `[id]` (only DELETE has s36 pins; the PUT wraps ride the weak s35
  file-wide pin).
- **F4 (MED-LOW)** — the settings GET's `readSettings()` lazily runs
  `db.setting.create` when the singleton row is missing (`:18-21`) — a
  mutating call in a GET, outside any try (the PUT's `readSettings`
  call is inside its try; the GET's is not). Fires exactly on a
  fresh/empty DB.
- **F5 (LOW — doc accuracy)** — the s36 commit claims "the 300/500 cap
  drift normalized as a side effect"; it was NOT: users PATCH still
  `slice(0, 300)` vs contacts' `max: 500`. A 301–500-char `https://`
  URL stores fully on a contact but silently truncates on the profile.
- **F6 (LOW)** — dead imports carried from before s36: `asDate`
  (accounts `route.ts:2`), `LEAD_SOURCES` (leads `route.ts:3`) — the
  eslint config has `no-unused-vars: off`, so the gate can't see them.
- **F7 (LOW, no action)** — leads PUT fetch-before-parse ordering
  (404-vs-400 on nonexistent-id + malformed-body) — defensible,
  consistent with the other `[id]` routes, documented here only.
- **F8 (LOW — pin strength)** — the events-invariant pins don't pin the
  comparison DIRECTION (a flipped `<`/`>` stays green); the upload pin
  doesn't pin the `64 * 1024` overhead constant.
- **F9 (INFO, ledger only)** — `website`/`location` remain
  scheme-unvalidated but render as React-escaped text (no `href={…}`
  sink anywhere today); a future `<a href={a.website}>` would reopen
  the class — a deferred-list watch item, not a fix.

### B. The deferred-findings graduation audit (the s36 deferred ledger)

One graduation, several closures, everything else re-confirmed:

- **GRADUATE — the non-string FK coercion (silent data corruption).**
  `asString` coerces any non-string to `undefined` (lib/api.ts:42-48),
  and the `?? null` at **16 sites across 9 route files** turns
  `{"accountId": 123}` / `{}` / `true` into a SILENT FK clear on PUT
  (silent FK-absent on POST) instead of a 400. It is the only deferred
  item that fixes silent corruption; it completes the S35 FK-guard
  family (existence checks → type checks); UI-invisible (selects emit
  string ids or `""`; `""`/`null` keep their clear semantics) — zero
  parity surface; mechanical.
- **CLOSE as non-issues (evidence recorded):** the auth-routes' read
  guards (the only GET under `/api/auth` is `me` — the public session
  probe by design; login/verify/resend/signup are rate-limited
  pre-session POSTs; logout is an idempotent cookie clear) and the
  middleware/proxy question (none exists; page auth is enforced at the
  `(app)/layout.tsx` server redirect, API auth per-route
  `requireSession`; `/api/health`, `/api/auth/*`, `/api/uploads/[name]`
  are the documented intentional public set).
- **KEEP-DEFERRED (rationales sharpened):** reset role-gating (the
  seeded demo user IS role `"user"`; the wipe e2e runs as that user;
  PAD:1228 rules the role field informational — a gate would be the
  first RBAC in a codebase whose doctrine forbids it); list-endpoint
  caps (the client REQUIRES full sets — the store filters/sorts
  client-side; `take:` without pagination = silent truncation, worse
  than the theoretical cost at demo scale); trusted-proxy limiter
  (needs the deploy-posture decision; NEW quantified note: ~2 login
  POSTs per e2e run share the `"unknown"` bucket vs the 10/15-min
  limit — a 6th consecutive e2e run within 15 min would 429 the auth
  setup; dev-loop hazard only); updateLead supersede guard (the
  unconditional refetch IS the rollback — a guard would skip it);
  hydrate per-slice redesign (NEW insight: the naive fix — flip
  `hydrated` after `Promise.all` — does NOT dedupe, it only serializes
  the duplicate AND stalls every hydrated-gated effect on the slowest
  of 9 fetches); SavedReport dead model (removal = schema ripple for
  zero gain; the model preserves schema-decode parity); photoUrl
  onError fallback (six conditional `<img>` sites; the dangerous
  payload classes are already dead; cosmetic churn through
  parity-pinned surfaces).
- **e2e stability (assessed SOUND):** single-worker, no retries,
  idempotent in-place seed, shared auth state under the limiter. Two
  latent couplings for the ledger: 11 hardcoded `waitForTimeout` sleeps
  (convert to `expect.poll` on first observed flake, not before) and
  `mobile-navigation.spec.ts` running post-wipe by alphabetical file
  order (safe today — it asserts only nav structure; any future
  seeded-content assertion there must account for the wipe).

### C. The standing-layer drift re-sweep (live, this session)

33rd consecutive session, **NO DRIFT**: the reference bundle
md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes —
EIGHTH consecutive bundle-stable session); the reference's mobile-nav
absence at a TRUE 390px (8 links in DOM, 0 visible, nav w=0, no
hamburger — geometric census); the reference demo data still zero
(`$0.0k/$0.0k/$0k`); our clone — the seeded dashboard at the s32 scales
($337.0k/$126.0k/$0k), the drawer LIVE both directions (native-click
open: 8 links + dual scroll lock + focus on the close button; Escape:
`visibility:hidden` + unlocked + `aria-expanded:false`;
`history.back()`: closed + unlocked — the s35 ownership fix holds),
zero 390px overflow on all nine routes (sweep + direct-load spot
re-checks), the FK envelope 400 LIVE (`"Selected company does not
exist"`), the gitignore negative space holds (`src/app/api/uploads/`
not ignored, runtime `/uploads/` ignored).

## The remediation — S37-P1..P7

- **S37-P1 — the auth-family envelope completion (F1):** wrap the
  mutating sections → `ERR.INTERNAL()` in signup (findUnique + count +
  create), verify (findUnique → attempt-update → success-update →
  setSessionCookie — the whole DB tail; the 4xx returns inside the try
  bypass the catch by construction), resend (findUnique + update). The
  429/400 validation prefixes stay outside (no DB access). RED-first:
  containment pins for all three handlers.
- **S37-P2 — the structural stragglers (F2 + F4):** move the
  activities `[id]` PUT existence fetch + NOT_FOUND inside the existing
  try (mirroring the other four `[id]` routes; body/field parsing stays
  ahead of the try — the documented 404-vs-400 ordering note applies);
  wrap the settings GET's `readSettings()` in try/catch →
  `ERR.INTERNAL()` (the lazy singleton create is a mutating call in a
  GET — it gets the envelope). RED-first: pins for both.
- **S37-P3 — the non-string FK 400 family (the graduated item):**
  `asFKId(v)` + `isBadFK(v)` in lib/api.ts (null/`""` → null = explicit
  clear; a present non-string → a type error); the 16 sites across 9
  route files get a two-line guard → `ERR.BAD_REQUEST` with the family
  vocabulary ("Invalid company selection" / "Invalid owner selection" /
  "Invalid contact selection") before the assignment. RED-first:
  helper unit tests + per-route source-contract pins (the coercing
  `asString(body.<fk>)` pattern must be GONE from all nine files).
- **S37-P4 — the containment pins (F3 + F8):** a `trySpans()`/
  `mutationInsideTry()` helper pair; the s36 per-handler pins converted
  to containment style (every `db.<model>.<verb>` call in the handler
  block must sit inside a try→catch span); the missing `[id]` PUT
  containment pins added (contacts/leads/accounts/events); the events
  invariant pin strengthened to the exact comparison expression
  (`effectiveEnd < effectiveStart`); the upload pin strengthened to the
  `64 * 1024` constant.
- **S37-P5 — the hygiene (F5 + F6):** the users PATCH photoUrl cap
  normalized to 500 (matching contacts — the s36 claim finally true;
  pin: cap parity across the three photoUrl writers); the two dead
  imports removed.
- **S37-P6 — the gate:** lint 0/0 · tsc 0 · unit (838 + the new) ·
  build · e2e 106/106.
- **S37-P7 — the deliverables:** LIVE verification on the dev server
  (the FK-400s on a numeric AND an object payload; a valid string FK
  still stores; `null` still clears; the 400-char `https://` photoUrl
  now storing FULLY on the profile — the cap fix; the auth happy paths
  via the e2e suite; the drawer re-check), the screenshot set
  (`docs/screenshots/45-…` + the standing re-captures), `.env`/
  `.env.example` re-verified, docs realignment (README badge + the
  session-37 paragraph, AGENTS counts + the session-37 block, CLAUDE,
  PAD the s37 row, SKILL **v1.34.0** §16ac + frontmatter +
  project_state, `docs/session_67.md`, this plan's execution record,
  both worklogs) · commit + SSH-wrapper push.

## Validation gates

- RED-first: P1/P2/P3 add RED pins before their implementations; P4's
  containment pins must FAIL against the pre-fix states they target
  (the auth family with no try; the activities fetch outside) and PASS
  against the already-correct s36 wraps (they must not weaken the
  existing green).
- GREEN: lint 0/0 · tsc 0 · unit · build · e2e — the full gate order.
- LIVE: the FK-400s both payload shapes, the valid-FK round-trip, the
  photoUrl cap fix, the drawer, the seeded dashboard at the s32 scales.

## Deferred (documented, not this session)

Reset role-gating (the seed-role/e2e interaction + the no-RBAC
doctrine), list-endpoint caps, trusted-proxy limiter (+ the 6-runs/
15-min e2e margin note), updateLead supersede guard, hydrate per-slice
redesign (the naive fix only serializes), SavedReport dead model, the
photoUrl onError fallback, the 11 e2e `waitForTimeout` sleeps (on
first observed flake), the mobile-navigation post-wipe ordering
coupling, the `website`/`location` href-sink watch item (F9), the
base44-only AI extraction, the Opportunity create/edit UI (absent on
BOTH sides); the standing drift re-sweep continues next live visit.

---

## EXECUTION RECORD (2026-10-03, post-gate)

Executed as planned, S37-P1..P7 all landed:

- **S37-P1**: the auth family envelope-held — signup (findUnique +
  count + create), verify (the whole DB tail; the in-try 4xx returns
  bypass the catch), resend (findUnique + update). LIVE: signup 200
  requiresVerification; wrong-code verify → 400 "Invalid verification
  code. 4 attempts remaining."; resend 200; malformed body 400. The
  signup probe user removed from the dev DB after the verification
  (no user-DELETE API — a one-off Prisma deleteMany script).
- **S37-P2**: the activities `[id]` PUT fetch inside the try; the
  settings GET's `readSettings()` wrapped (the lazy singleton create
  now envelope-held from the GET side too).
- **S37-P3**: `asFKId`/`isBadFK` in lib/api.ts + the 16 sites across 9
  route files, all with the family vocabulary. LIVE: numeric → 400
  "Invalid company selection", object → 400 "Invalid owner selection",
  boolean → 400 "Invalid contact selection", null → 200 cleared, a
  valid string FK stores ("Al Noor Manufacturing").
- **S37-P4**: the containment pins — `trySpans()`/`allInsideTry()`
  with the span end anchored on the `} catch` CLAUSE. Gate-caught in
  the loop: the FIRST RED run showed 20 failures, not the predicted 18
  — the pin's own span-anchor flaw (a bare `indexOf("catch")`
  truncating at `req.json().catch(() => null)` inside leads'
  whole-handler try and at activities' fire-and-forget lastActivityAt
  updates) produced two false REDs; the re-anchored helper produced
  exactly the predicted 18. The events direction pin + the upload
  `64 * 1024` constant pin landed; the four missing `[id]` PUT
  containment pins added.
- **S37-P5**: the users PATCH photoUrl cap 300 → 500 (LIVE: a
  400-char `https://` URL stores whole, `wasFull:true`, then the
  profile restored); the dead `asDate`/`LEAD_SOURCES` imports removed.
- **S37-P6**: gate green — lint 0/0 · tsc 0 · **873/873 unit (+35:
  18 RED-first + 17 containment/strengthening)** · build clean ·
  **106/106 e2e**.
- **S37-P7**: LIVE verification of every fix (above) + the drawer
  re-check (open: 8 links + dual scroll lock + close-button focus;
  Escape: hidden + unlocked) + the seeded dashboard at the s32 scales;
  4 screenshots (02/11/12 re-captured + **45** the auth-signup surface
  NEW; 02 + 45 VLM-verified — styling verdicts clean; the VLM's
  field-list for 45 hallucinated a "Full Name" input, disproven
  against the code — the s21 no-name-field contract holds);
  `.env`/`.env.example` re-verified (no env surface change); docs
  realigned (README badge 979 + the session-37 paragraph, AGENTS 873 +
  the session-37 block, CLAUDE 873, PAD the s37 row / 873+106, SKILL
  **v1.34.0** §16ac + frontmatter + project_state + the stale
  title-version fix (v1.32.0 → v1.34.0 in the H1), this record,
  docs/session_67.md, both worklogs).
- Standing layers: 33rd session, NO DRIFT (the bundle md5-identical —
  EIGHTH consecutive stable session; the reference's mobile-nav
  absence at a TRUE 390px; the demo data still zero; our drawer live
  both directions; zero overflow on all nine routes; the FK envelope
  live; the gitignore negative space holds).
