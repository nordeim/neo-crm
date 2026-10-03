# Session-38 Parity Remediation Plan (2026-10-03)

Session 38 on `main` @ `6d62bc4` (session-37 code at `8bb35ba` + the
operator's `docs/session_68.md` transcript commit). Baseline gate on the
pulled tree: **lint 0/0 · tsc 0 · 873/873 unit (48 suites)** — the
documented state exactly. `.env` `DATABASE_URL="file:../db/custom.db"`
with `db/` at the repo root verified intact; the dev server alive and
healthy (`{"status":"healthy","db":"up"}`).

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-37 re-audit (fresh eyes on commit `8bb35ba`)

All four session-37 claims verified GENUINE (a full db-call census of all
27 route files: every mutating call inside a try→catch span; the FK
helpers' edge semantics correct at all 16 sites with zero coercing
remnants; the containment helpers real; the photoUrl cap + dead-import
removals real). **NEW findings (every one manually validated, two
LIVE-proven):**

- **F1 (MED — the headline, 16 sessions old)** — the signup
  `nameFromEmail` fallback is DEAD CODE: `asString(body.name,
  { max: 80 })` (non-optional) returns `""` for an absent name, and
  `"" ?? fallback` never fires (empty string is not nullish). The UI
  signup posts `{email, password}` only (the s21 no-name-field contract),
  so EVERY UI signup creates a user with `name: ""` — `initialsOf("")`
  renders `"?"`, the owners dropdown shows a blank owner, the profile
  starts nameless. The in-file contract (signup:12-14 "the account
  carries the local part until edited") has been false since s21; the
  e2e never asserts the derived name, so it survived.
- **F2 (MED-LOW — LIVE-proven this session)** — `photoUrl` carries the
  exact silent-coercion class s37 graduated for FKs, one field over:
  a numeric/object/boolean `photoUrl` SILENTLY CLEARS the photo on the
  contacts PUT (LIVE: `PUT {"photoUrl": 999}` → 200, `photoUrl: null`)
  and is silently IGNORED on the users PATCH (absent semantics). The two
  writer families also disagree on trim (F12 — contacts trims via
  asString, users slices raw, so `" https://…"` is accepted+trimmed on
  contacts but 400s on users).
- **F3 (MED-LOW — test quality)** — the reset POST (the single most
  destructive handler) still has only the s36 PRESENCE-style pin; the
  `$transaction` could move back out of the try and every pin stays
  green — the precise failure mode the s37 containment pins were built
  to close.
- **F4 (MED-LOW — test quality)** — the settings-GET containment pin is
  vacuously satisfiable: `allInsideTry(get, /readSettings\(/)` returns
  true when the regex matches NOTHING; deleting the `readSettings()`
  call while keeping any try/catch keeps the pin green. Every other s37
  pin pairs containment with a `toMatch` presence check; this one
  doesn't.
- **F5 (MED-LOW)** — the upload POST has NO try/catch at all:
  `writeFile` (route:55) and the `uploadsDir()` `mkdirSync` throw raw
  non-envelope 500s on ENOSPC/EACCES — an I/O failure class outside the
  DB-worded envelope claim but identical in user-facing effect.
- **F6 (LOW — pin strength)** — the auth-family containment pin checks
  only `/db\.user\.(create|update)\(/`; the wrapped `findUnique`/`count`
  reads could migrate outside the try without failing any pin.
- **F7 (LOW — ledger)** — the asString/asDate/asNumber optional
  coercion class survives on every non-FK field (activities `[id]:26`
  `asDate(body.dueAt) ?? null` silently nulls a numeric dueAt on PUT;
  non-string status → `"active"`; non-numeric value → `0`). Deliberate
  s37 FK-first scope — ledger with the surface quantified.
- **F8 (INFO — ledger)** — the signup admin TOCTOU race (count → create
  not atomic; two concurrent first-signups can both read `count===0`).
- **F9 (INFO)** — FK guard placement is stylistically split (before the
  try vs inside) — semantically equal, no action.
- **F10 (INFO — ledger)** — two dead EXPORTED helpers in api.ts
  (`asRequiredString`, `asOneOf`) — exported so `no-unused-vars:off`
  can't see them (the same gate blindness as the s37 dead imports).
- **F11 (INFO — doctrine restated)** — the read-path holes
  (`getSessionUser`'s findUnique outside every try via `requireSession`;
  login's findUnique) — documented read-path doctrine, non-issues.
- **Pin-helper blind spots (Part 4)** — module-level helpers with db
  calls escape every handlerBlock slice (only `readSettings` today,
  compensated by its call-site pin); `DB_CALL` misses Prisma `$`-APIs
  (health's `$queryRaw` is invisible to the containment machinery).

### B. The deferred-findings graduation audit (the s37 ledger)

**ZERO graduations, ZERO closures** — all 12 ledger descriptions verified
accurate against today's code, all rationales still sound. Sharpened:
the `sweepRateLimits()` sweep runs ONLY from the login route (signup/
verify/resend buckets sweep only when someone next logs in — bounded,
single-node-fine, but cheap to make honest). **NEW deferred-class
findings:**

- **N3 (MEDIUM — the one clear GRADUATE)** — the tested `parseCsv` seam
  is UNUSED by the Import feature: csv.ts:38's comment claims "used by
  the Import feature" but the import loop uses naive `row.split(",")` +
  `replace(/^"|"$/g, "")` — a quoted cell with an embedded comma
  SILENTLY CORRUPTS the row (wrong name, shifted email), and each row's
  `createContact` triggers a FULL-LIST refetch (O(N²) network on
  import). Unlike the CSV-injection class, the naive parser is OUR OWN
  bug, not a parity artifact (the reference's import round-trips
  base44's API; ours is the documented local divergence).
- **N1/N2 (MEDIUM/LOW-MED — LEDGER, decision item)** — CSV formula
  injection (`escapeCell` quotes only on `[",\n\r]`; `=cmd()` passes
  through raw — and the reference's always-quote format is NOT a
  mitigation, Excel evaluates `"=1+1"` after unquoting) + the
  embedded-quote escaping gap in entity-export's builders (no `""`
  doubling — the reference is byte-identical, so it's a shared defect).
  **Deferred with sharpened rationale**: the byte-exact reference format
  is itself the pinned contract; fix lands the moment the deploy-posture
  decision (the same one blocking the trusted-proxy limiter) goes
  multi-user.
- **N4 (LOW — ledger)** — hydrate() network failure renders "logged
  out" client-side until reload (contained: only the profile page
  consumes store `user`; page auth is server-enforced per navigation).
- **N5 (LOW — watch)** — silent fetch failures render the zero-data
  empty state (doctrine-aligned with the s25 instant-render model).
- **N6 (LOW — ledger)** — login/verify timing side-channel (no dummy
  scrypt for unknown emails; message content non-leaking; rate-limited).
- **N7 (LOW — fix the script half this session)** — no `gate` umbrella
  script (the documented gate order is manual) + the stale-server e2e
  hazard (`reuseExistingServer: !CI` + `test:e2e` not depending on
  build — a leftover :3100 server silently tests stale code).
- **N8 (INFO — accepted)** — upload trusts client-declared MIME
  (contained: extension locked to the MIME map, nosniff repo-wide,
  randomUUID names; polyglot-class residual only).

### C. The standing-layer drift re-sweep (live, this session)

34th consecutive session, **NO DRIFT**: the reference bundle
md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes —
NINTH consecutive bundle-stable session, fresh-fetched and compared);
the reference's mobile-nav absence at a TRUE 390px (8 links in DOM, 0
visible, nav w=0, no hamburger — geometric census); the reference demo
data still zero (`$0.0k/$0.0k/$0k/0`); our clone — the seeded dashboard
at the s32 scales ($337.0k / $126.0k / $0k), the drawer LIVE both
directions (native-click open: 8 links + dual scroll lock + focus on
the close button; Escape: `visibility:hidden` + unlocked +
`aria-expanded:false`; `history.back()`: gone + unlocked — the s35
ownership fix holds), zero 390px overflow on all nine routes (sweep +
direct-load spot re-checks), the FK envelope 400 LIVE ("Invalid company
selection"), the gitignore negative space holds (`/uploads/` anchored,
`src/app/api/uploads/` not ignored).

## The remediation — S38-P1..P7

- **S38-P1 — the signup name-fallback revival (F1):**
  `asString(body.name, { max: 80, optional: true })` so the absent-name
  path returns `undefined` and `?? nameFromEmail(...)` finally fires
  (every UI signup derives "Sepnetflix2023"-class names; an explicit
  API `name` still wins). RED-first: a source-contract pin that the
  signup POST block's name parse carries `optional: true` before the
  `?? nameFromEmail(` fallback (the `""`-is-not-nullish trap is the
  same class as the s37 "presence ≠ containment" lesson). LIVE: a probe
  signup → verify (the code read from the dev-server console) → the
  stored `name` equals the derived local part → probe user removed from
  the dev DB (the s37 one-off deleteMany pattern).
- **S38-P2 — the photoUrl type-guard family (F2 + F12):** the
  `isBadFK(body.photoUrl)` guard (the exact s37 semantics: present +
  non-string + non-null → bad) on all three writers — contacts POST,
  contacts `[id]` PUT (inside the `"photoUrl" in body` branch), users
  PATCH — each → `ERR.BAD_REQUEST("Invalid photo URL")`; plus the trim
  harmonization in users PATCH (`body.photoUrl.trim().slice(0, 500)`)
  so both writer families accept+store a leading-space `https://` URL
  identically. RED-first: source-contract pins on all three writers
  (the guard adjacent to the parse; the users trim form). LIVE: the
  numeric 400 on BOTH surfaces (contacts PUT + users PATCH — the
  silent-clear/ignore split closed), a valid string still stores, `null`
  still clears.
- **S38-P3 — the import parser graduation (N3):** the store gains
  `importContacts(inputs)` — serial `call("/api/contacts", POST)` per
  row, ONE `fetchContacts()` after the loop (kills the O(N²) refetch);
  the page's `runImport` swaps the naive `split(",")` +
  `replace(/^"|"$/g)` for the tested `parseCsv` seam (BOM + CRLF +
  quoted-comma + blank-row handling all already unit-pinned in
  tests/csv.test.ts — the csv.ts:38 comment finally TRUE). RED-first:
  source-contract pins (the page's runImport references `parseCsv` +
  `importContacts`; the store's `importContacts` block carries exactly
  ONE `fetchContacts(` AFTER the loop's close — the per-row-refetch
  regression guard). E2E: a NEW test importing a quoted-comma row
  (`"Quoted, Comma","quoted@test.local","Acme, Inc"`) asserting the
  imported name renders WHOLE + the green result box, then deleting the
  probe contact via `page.request` (the s35 precedent) so later
  row-order assertions stand. Zero parity surface (import is already
  the documented divergence; the dialog chrome + result vocabulary
  untouched).
- **S38-P4 — the proof-coverage completion (F3 + F4 + F6 + the `$`-API
  blind spot):** the reset POST joins the containment `it.each`
  (`allInsideTry(post, /db\.\w+\.deleteMany\(/)` + presence — the
  `$transaction` can no longer slide out of the try unseen); the
  settings-GET pin gains its `toMatch(/readSettings\(/)` presence check
  (no more vacuous truth); the auth-family containment regex extends to
  `/db\.user\.(create|update|findUnique|count)\(/` (the wrapped reads
  now pinned); the health route's `db.$queryRaw` gets an explicit
  containment pin (the `DB_CALL` `$`-API blind spot, closed per-route).
  These are strengthening pins — GREEN-on-arrival against the
  already-correct code (the s37 P4 precedent), each guarding a
  demonstrated escape hatch.
- **S38-P5 — the upload write envelope (F5):** the upload POST's write
  path (`uploadsDir()` mkdir + `writeFile`) wrapped in try/catch →
  `ERR.INTERNAL()` — ENOSPC/EACCES mid-upload answers the envelope, not
  a raw non-JSON 500. RED-first: the containment pin (`writeFile` +
  `uploadsDir` inside a try span — the file has NO try today, so the
  pin is RED until the wrap). LIVE: a small real upload still 200s (the
  round-trip unbroken).
- **S38-P6 — the sweep hygiene + the gate script (N7's script half +
  the sharpened ledger note):** `sweepRateLimits()` at the top of
  signup/verify/resend (matching login's placement — the opportunistic
  cleanup runs on every rate-limited auth route, not just login);
  package.json gains the `gate` umbrella script chaining the documented
  order (`lint → typecheck → test → build → test:e2e`) — one command
  encodes the AGENTS.md gate order and closes the stale-server class
  when used (the build runs before the e2e boot check). RED-first:
  source pins (each auth route calls `sweepRateLimits()` before its
  `rateLimit` — RED today on three of four) + a `tests/gate-script.test.ts`
  pinning the script's existence + the five-step order. AGENTS.md /
  CLAUDE.md / PAD command tables gain the `bun run gate` row (the docs
  realignment).
- **S38-P7 — the deliverables:** the full gate (lint 0/0 · tsc 0 · unit
  +~19 · build · e2e 107/107), LIVE verification (the signup
  name-derive round-trip incl. the probe cleanup; the photoUrl 400s on
  both surfaces + the trim harmonization; the import quoted-comma
  round-trip through the real dialog; the small-upload 200; the drawer
  re-check; the seeded dashboard at the s32 scales), the screenshot set
  (`docs/screenshots/46-…` NEW the signup-derived-name surface + the
  standing 02/11/12 re-captures), `.env`/`.env.example` re-verified (no
  env surface change), docs realignment (README badge + the session-38
  paragraph, AGENTS counts + the session-38 block + the gate row,
  CLAUDE counts + the gate row, PAD the s38 row, SKILL **v1.35.0**
  §16ad + frontmatter + project_state, `docs/session_69.md`, this
  plan's execution record, both worklogs) · commit + SSH-wrapper push.

## Validation gates

- RED-first: P1/P2/P3/P5/P6 add failing pins before their
  implementations (P1: the optional-parse pin; P2: the three writer
  guards + the users trim; P3: the parseCsv/importContacts wiring + the
  single-refetch shape; P5: the upload containment; P6: the three sweep
  call-sites + the gate script). P4's strengthening pins must PASS
  against the already-correct code (they must not weaken the existing
  green) and each targets a demonstrated escape hatch.
- GREEN: lint 0/0 · tsc 0 · unit · build · e2e — the full gate order,
  via the NEW `bun run gate` where practical.
- LIVE: the signup name-derive, the photoUrl 400s + trim, the import
  quoted-comma round-trip, the small-upload 200, the drawer, the
  seeded dashboard.

## Deferred (documented, not this session)

The non-FK asString/asDate/asNumber coercion surface (F7 — silent
mutation on PUT across dueAt/status/value/endAt-class fields, FK-first
scope deliberate), the CSV formula-injection + embedded-quote family
(N1/N2 — the byte-exact reference format is itself the pinned contract;
lands with the deploy-posture decision), the signup admin TOCTOU race
(F8), the dead exported api.ts helpers (F10), hydrate error vs
logged-out (N4), silent fetch failures (N5 — doctrine-aligned watch),
the login/verify timing side-channel (N6), the upload MIME trust (N8 —
accepted, contained), the trusted-proxy limiter (+ the e2e margin
note), reset role-gating, list-endpoint caps, updateLead supersede
guard, hydrate per-slice redesign, SavedReport dead model, photoUrl
onError fallback, the 11 e2e `waitForTimeout` sleeps, the
mobile-navigation post-wipe ordering coupling, the website/location
href-sink watch, the base44-only AI extraction, the Opportunity
create/edit UI; the standing drift re-sweep continues next live visit.

---

## EXECUTION RECORD (2026-10-03, post-gate)

Executed as planned, S38-P1..P7 all landed:

- **S38-P1**: the name parse flipped to `optional: true` — the
  `?? nameFromEmail(...)` fallback fires for the first time since s21.
  LIVE: the probe signup stores `name: "Probe S38"` (verified in the
  DB via the repo's db singleton); the probe user removed after.
- **S38-P2**: `isBadFK(body.photoUrl)` → 400 "Invalid photo URL" on
  all three writers + the users trim harmonization. LIVE: numeric →
  400 on contacts PUT AND users PATCH; `" https://…"` stores trimmed
  on users; `null` clears; a valid string stores; the probe data
  restored.
- **S38-P3**: the store's `importContacts` (ONE refetch after the
  loop) + the page's `runImport` on `parseCsv`. LIVE: "Live, Quoted" +
  "Acme, Inc" import whole through the real dialog on the dev server;
  the probe contact removed. E2E: the quoted-comma round-trip test
  (107th) — the first run's DOM-count cleanup assertion failed on the
  dual-mounted views + the stale store slice (the page doesn't refetch
  after an out-of-band delete); re-anchored API-side.
- **S38-P4**: the four strengthening pins landed GREEN-on-arrival (the
  reset containment, the settings-GET presence check, the auth-reads
  extension, the health `$queryRaw`).
- **S38-P5**: the upload write path wrapped. LIVE: a small real upload
  still 200s (`/api/uploads/<hex>.png`).
- **S38-P6**: the three sweep call-sites + the `gate` script. The
  first RED run failed on LOGIN too — the pin demanded
  sweep-before-rateLimit while login sweeps after; relaxed to the
  contract (presence in the handler block). The gate-script pins
  enforce the exact five-step chain.
- **S38-P7**: gate green — lint 0/0 · tsc 0 · **896/896 unit (+23:
  15 RED-first + 8 strengthening)** · build clean · **107/107 e2e**.
  LIVE: all five fix families + the drawer re-check + the seeded
  dashboard at the s32 scales. 4 screenshots (02/11/12 re-captured +
  46 the signup-derived-name surface NEW; 02 + 46 VLM-verified — the
  styling verdicts clean; the VLM's "expected 38 leads" was the
  prompt's own wrong guess — the seed ships 24 — and the "cut off"
  note is the viewport convention). `.env`/`.env.example` re-verified
  (no env surface change). Docs realigned (README badge 1003 + the
  session-38 paragraph + the gate row, AGENTS 896/107 + the gate row +
  the session-38 block, CLAUDE 896/107 + the gate row, PAD the s38
  row / 896+107 / the checklist / the command table, SKILL v1.35.0
  §16ad + frontmatter + project_state + the H1, docs/session_69.md,
  this record, both worklogs).
- Standing layers: 34th session, NO DRIFT (the bundle md5-identical —
  NINTH consecutive stable session; the reference's mobile-nav absence
  at a TRUE 390px; the demo data still zero; our drawer live both
  directions; zero overflow on all nine routes; the FK envelope live;
  the gitignore negative space holds).
