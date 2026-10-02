# Session 65 (2026-10-03) — Session-36: the envelope completion + the input-hardening family

## The setup

Workspace refreshed (`git pull` → `8264312`: the session-35 code at
`1468867` + the operator's `docs/session_64.md` transcript commit). The
sandbox survived from session 35 — the tree clean and identical to
remote HEAD, the environment intact (`.env` `DATABASE_URL=
"file:../db/custom.db"`, `db/` at the repo root, node_modules, the
reference bundle cache). Baseline gate on the pulled tree: **lint 0/0 ·
tsc 0 · 817/817 unit (48 suites)** — the documented state, exactly.

## The audits

Two parallel review agents + manual validation:

1. **The session-35 re-audit (fresh eyes on `1468867`)** — the headline
   fixes all verified genuine (uploads route traversal-proof with exact
   POST-name parity; db-path guard complete; mobile-nav ownership move
   correct; store hygiene complete; FK guards' null-vs-absent edge
   semantics correct). The NEW findings: the envelope layer's claim was
   broader than its implementation — the five DELETE handlers, the
   three POST creates (contacts/leads/accounts), the users PATCH
   update, the settings PUT upsert and the activities `[id]` update all
   unwrapped (raw non-envelope 500s on SQLITE_BUSY-class failures); the
   activities/events POST `contactId` guards and the `[id]` routes'
   existence fetches outside the try; `/api/reset` running its seven
   `deleteMany` calls sequentially OUTSIDE a transaction (partial-wipe
   risk); and the s35 `it.each` try/catch pins matching anywhere in a
   file (presence, not containment).

2. **The deferred-findings audit (the ten session-35 LOW items)** — one
   graduated to HIGH: the events PUT drops the end≥start invariant its
   own POST enforces (a real user-hitable inconsistency via the
   calendar chip → EventDialog's free `datetime-local` fields). Three
   MEDIUM hardening candidates: the upload POST buffering the whole
   multipart body before the 5MB check, the photoUrl accepting
   arbitrary URLs (wider than documented — the contacts photoUrl is
   shared data rendered to all viewers), and the health 200-on-db-down
   (with a MEASURED playwright caveat: the 1.63 readiness probe accepts
   only 200–403 and webServer setup precedes globalSetup — but SQLite
   auto-creates `db/e2e.db` on first connect so a fresh boot still
   probes 200). The other six stay deferred with re-confirmed and
   extended rationales — notably reset role-gating would break the
   demo-user e2e (the seeded role is `"user"`), and the naive hydrate
   fix would regress first paint (every page keys its own refetch on
   the `hydrated` flag).

## The standing-layer drift re-sweep (live)

32nd consecutive session, **NO DRIFT**: the reference bundle
md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes —
SEVENTH consecutive bundle-stable session); the reference's mobile-nav
absence at a TRUE 390px (8 links in DOM, 0 visible, nav w=0, no
hamburger); the reference demo data still zero (`$0.0k`); our clone —
the seeded dashboard at the s32 scales ($337.0k / $126.0k / $0k), the
drawer LIVE both directions (native-click open: 8 links + dual scroll
lock + focus on the close button; Escape: closed + unlocked +
`aria-expanded:false`; `history.back()`: closed — the s35 ownership fix
holds), zero 390px overflow on all nine routes, the FK envelope 400
LIVE (`"Selected company does not exist"`), the gitignore negative
space holds.

Census-method notes: an `eval`-dispatched `.click()` does NOT trigger
the React handler path (the native CDP click does — recurring hazard);
`offsetParent !== null` is not on-screen (the `-translate-x-full`
slide-out sidebar keeps its links "visible" to it — assert
`getBoundingClientRect().x >= 0 && width > 0` instead).

## The remediation (S36-P1..P7, all RED-first: 17 + 2 failing pins)

- **S36-P1 — the events PUT end≥start invariant (HIGH)** — checked
  against the MERGED record (`effectiveStart`/`effectiveEnd` vs
  `existing`), the POST's exact message. LIVE: end-only inversion →
  400 "End time must be after start time"; consistent reorder → 200;
  valid extension → 200 persisted.
- **S36-P2 — the envelope completion + the reset transaction** — every
  mutating DB call in every handler inside try/catch → `ERR.INTERNAL()`
  (five DELETEs, three POST creates, users PATCH, settings PUT,
  activities `[id]` update; the outside-try guards/fetches moved in;
  leads' PUT is one whole-handler try — its stage parsing reads
  `existing.closedAt`); the reset wipe ATOMIC inside `$transaction`.
  The pins are per-handler `handlerBlock()` slices — STRONGER than the
  s35 file-wide regexes.
- **S36-P3 — the upload Content-Length pre-gate** — declared CL >
  `MAX_UPLOAD_BYTES + 64KB` rejected BEFORE `formData()` buffers.
  LIVE: a 99,999,999-byte declared CL → 400 in 54ms. Chunked-encoding
  bypass documented; post-parse ceiling the backstop.
- **S36-P4 — the photoUrl prefix guard** — users PATCH + contacts
  POST/PUT accept only `null`, `/api/uploads/…` or `https://…`.
  LIVE: `data:` → 400, `javascript:` → 400, `null` → 200 cleared,
  https stores (the reference's own CDN-shaped data). The 300/500 cap
  drift normalized.
- **S36-P5 — the honest health 503** — `fail("SERVICE_UNAVAILABLE",
  "Database unavailable", 503)` on db-down; the fresh-boot e2e
  verification closed the playwright caveat (db/e2e.db + .auth
  deleted → full e2e 106/106 — SQLite auto-creates the file, the probe
  passes).
- **S36-P6 — the gate** — lint 0/0 · tsc 0 · **838/838 unit (+21)** ·
  build clean · **106/106 e2e (fresh-boot)**.
- **S36-P7 — the deliverables** — LIVE verification (all of the above
  + the drawer re-check + a small-upload regression + health 200),
  4 screenshots (02/11/12 re-captured + **44** the calendar
  events-invariant surface NEW), `.env`/`.env.example` re-verified (no
  env surface change), docs realigned (README badge 838 + the
  session-36 paragraph, AGENTS 838 + the session-36 block, CLAUDE 838,
  PAD the s36 row / 838+106, SKILL **v1.33.0** §16ab + frontmatter +
  project_state, this log, the plan's execution record, both worklogs).

## The census-method lessons (§16ab)

An `offsetParent` check is not a visibility check under CSS transforms;
`stripComments` eats `//` inside string literals (pin the bare
`https:`); a file-wide try/catch regex pin proves presence, not
containment (slice per handler); a readiness probe is a contract —
measure its accepted range and the boot order before flipping a health
status, then prove it with a fresh-boot run.

## The deferred pointers

Reset role-gating (the seed-role/e2e interaction), list-endpoint caps,
trusted-proxy limiter, updateLead supersede guard, hydrate per-slice
redesign, SavedReport dead model, the non-string-FK coercion, the
photoUrl onError fallback, the auth-routes' read guards, the
double-fetch on first load (harmless); the base44-only AI extraction;
the Opportunity create/edit UI (absent on BOTH sides); the standing
drift re-sweep continues next live visit.
