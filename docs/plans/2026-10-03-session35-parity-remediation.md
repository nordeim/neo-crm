# Session 35 Plan — the uploads-GET-route recovery + the API robustness layer

Date: 2026-10-03 · Branch: `main` · Base: `f63608e` (docs/session_62.md — the operator's session-34 transcript; zero app-code drift)

## Context

Session-34 shipped the standalone-launch database-path recovery (commits `2cba6a0` + `cfa0e72` + `f63608e`, gate 802/802 unit · 106/106 e2e, SKILL v1.31.0 §16z). This session executes on a **FRESH CLONE** (not the long-lived sandbox) — which is exactly what exposed the critical finding below: a file the old sandbox carried as an untracked leftover, keeping every gate green there while the repository itself ships broken.

## Audit results

### Baseline gate on the fresh clone — RED for the first time since session-4

- lint 0/0 · tsc 0 · **799/802 unit (3 FAILED)** · build clean · 106/106 e2e.
- The 3 failures live in `tests/upload-api.test.ts` describe "the uploads GET
  route serves the bytes" — `src/app/api/uploads/[name]/route.ts` does not
  exist in the repository.

### THE CRITICAL FINDING — the uploads GET route was never committed (gitignore shadowing)

- The session-30 commit `dcf942b` documents "+ GET /api/uploads/[name]
  (public … immutable caching)" in its message and `tests/upload-api.test.ts`
  pins the file — but the file is absent from the commit AND from all history
  (`git log --all -- src/app/api/uploads/` is empty).
- **Root cause (proven with `git check-ignore -v`):** `.gitignore:55` pattern
  `uploads/` is UNANCHORED — a gitignore segment without a leading or interior
  slash matches a directory of that name at ANY depth, so it matches
  `src/app/api/uploads/` just as much as the runtime `<repo>/uploads/`. The
  route file was authored in the session-30 sandbox but silently never
  tracked by git; the long-lived sandbox kept the untracked file on disk, so
  the session-31..34 gates stayed green (802/802) — a FRESH CLONE ships the
  gate red and the feature broken.
- **User-visible impact on fresh clones:** (a) the 3 red unit checks; (b)
  EVERY uploaded photo renders as a broken image forever — `POST /api/upload`
  stores the bytes and returns `file_url: "/api/uploads/<name>"`, the contact
  + profile photo flows persist that URL into the DB, and
  `GET /api/uploads/<name>` 404s (topbar avatar, contact rows, profile
  avatars all render `<img src="/api/uploads/…">` against a missing route).
- **The e2e mask:** `tests/e2e/crm.spec.ts` (S30-P2/P3) asserts only that the
  `src` ATTRIBUTE matches `/api/uploads/` — never that the image actually
  loads — so the 106-check suite stayed green over a 404 route.

### Standing layers — 31st consecutive session, NO DRIFT (live-verified)

- The reference bundle BYTE-IDENTICAL to the s30..s34 cache
  (`/assets/index-DZ-xbrIm.js`, 1,631,071 bytes, md5
  `a70a637fcf1d4291da8e0d965676dc11`) — SIX consecutive bundle-stable
  sessions, no redeploy.
- The reference at a TRUE 390px viewport: 8 nav links in the DOM, **0
  visible** (nav box w=0), no hamburger — the mobile-nav defect STANDS
  (31st session).
- Our drawer spot-verified LIVE both directions on :3000 (the REAL "Open
  navigation menu" trigger → 8 links visible inside the dialog + body scroll
  lock + focus landed inside the panel + aria-expanded true; Escape → 0
  visible + unlocked + the wrapper's computed visibility:hidden +
  aria-expanded false).
- Zero 390px horizontal overflow on all nine routes (our app, swept live).
- The reference demo data still ZERO (31st) — the zero-data dashboard
  live-confirms the s32 currency doctrine again ("$0.0k" / "$0.0k" / "$0k").
  Our seeded dashboard renders the documented superset ($337.0k / $126.0k /
  $0k at 1512).
- The Tailwind v4 stack audited healthy: the postcss plugin, the literal-hex
  `@theme` (with the s9 `--shadow-sm` and s10 `--blur-sm` re-pins intact),
  the vendored `tw-animate.css`, the app-shell body computing #f9fafb.
- The production start (`bun run start` from the repo root) verified on the
  FRESH CLONE: `/api/health` `{"status":"healthy","db":"up"}`, login 200
  with a session, `/api/dashboard` serving the seeded workspace (337000 /
  126000 / 0 / 29.2 / 83) — the session-34 fix holds outside the sandbox
  that built it.
- Environment contract: `.env` `DATABASE_URL="file:../db/custom.db"` +
  `db/` at the repo root (recreated via `db:push` + `db:seed`; the folder is
  auto-mkdir'd by `urlForRoot` on first boot — but is NOT present in a fresh
  clone, see S35-P1c).

### The code audit (two parallel review agents + manual verification)

**CRITICAL**
1. The missing uploads GET route (above).

**HIGH**
2. **PUT `[id]` routes lack FK validation** — `contacts/[id]` (accountId,
   ownerId), `leads/[id]` (both), `accounts/[id]` (ownerId), `events/[id]`
   (accountId, contactId) assign the ids straight into `data` with no
   existence check, and the POST-side checks on `activities` (accountId) and
   `events` (accountId) are missing too (their `contactId` IS checked). A
   stale dropdown value or crafted PUT throws Prisma `P2003` — unhandled, so
   the client gets a raw non-envelope 500 instead of "Selected company does
   not exist".
3. **No try/catch around the mutating Prisma calls** — every DB failure
   mode (FK above, `SQLITE_BUSY`, unique constraint, corrupted file) escapes
   as an unhandled rejection outside the `{ ok, error }` envelope;
   `ERR.INTERNAL()` exists in `src/lib/api.ts` but is never used.

**MEDIUM**
4. **mobile-nav.tsx:41-44 calls the PARENT's `onOpenChange` during the
   CHILD's render** — React's cross-component render warning ("Cannot update
   a component while rendering a different component"); the sanctioned
   adjust-during-render pattern covers a component's OWN state only. Fires
   on non-link navigation (browser back/forward with the drawer open); the
   click path closes first in the common case.
5. **db-path.ts:199-208 — the session-34 launch-dir branch tests the bun
   signature without the `isRelativeFileUrl` guard on `launchEnvUrl`** (the
   guard exists only on the cwd-side value). An absolute launch `.env` (the
   documented production form) + a stale traced
   `.next/standalone/.env` would re-anchor a corrupted path
   (`<repo>/prisma/var/lib/x.db`) instead of honoring the override —
   contradicting the file's own header contract.
6. **Store hygiene** — `resetData()` omits `fetchOpportunities()` (the reset
   route wipes opps; the reports owner dropdown stays stale until reload);
   `logout()` leaves the `settings` slice populated (the previous user's
   picklists linger into the next session's memory).

**LOW (documented, deferred with rationale)**
- `/api/reset` not role-gated (the reference has no roles surface to mirror;
  documented superset posture).
- `/api/health` returns 200 with `db:"down"` (monitoring-correctness; the
  playwright webServer keys on the 200).
- Unbounded `findMany` on list endpoints (demo scale; the reference loads
  its full tables too).
- `X-Forwarded-For` rate-limit spoofing (the per-process limiter is
  documented single-node).
- `users` PATCH accepts arbitrary `photoUrl` URLs; upload POST buffers the
  body before the size check; `updateLead` per-keystroke refetch race;
  `hydrate()` sets `hydrated` before its fetches resolve; events PUT drops
  the end≥start invariant; the year-agnostic dashboard revenue grouping
  (**documented reference parity — do not "fix"**); the `SavedReport` Prisma
  model written by nothing (the localStorage mirror is the documented
  contract).

## The remediation — S35-P1..P7

- **S35-P1 — THE CRITICAL FIX (three parts):**
  - **a) `.gitignore` anchor:** `uploads/` → `/uploads/` (anchored to the
    repo root — the runtime uploads folder stays ignored,
    `src/app/api/uploads/` becomes trackable).
  - **b) Recreate `src/app/api/uploads/[name]/route.ts`** per the
    session-30 contract: GET, PUBLIC (the reference's file_urls are public
    CDN links — no session guard), the name validated by `UPLOAD_NAME_RE`
    (the pinned 32-hex charset — no traversal surface), the bytes served
    from `uploadsDir()` with `CONTENT_TYPES[ext]`, 404 unknown names,
    immutable caching (`Cache-Control: public, max-age=31536000, immutable`
    — names are content-random and never rewritten).
  - **c) `db/.gitkeep`** committed so the `db/` folder exists on fresh
    clones (the `db/*.db` ignore still covers the databases; the
    folder-at-root contract becomes explicit — the operator's standing
    `.env` contract).
- **S35-P2 — the e2e mask closure:** extend the S30-P3 profile-photo e2e
  with an assertion that the uploaded image URL actually RETURNS 200 with an
  image content-type (`page.request.get` on the topbar avatar's src) — a
  missing GET route can never hide behind a src-attribute assertion again.
- **S35-P3 — the db-path launch-dir guard (RED-first):** add
  `isRelativeFileUrl(launchEnvUrl)` to the session-34 branch + a regression
  check (an ABSOLUTE launch `.env` value is honored as-is — passthrough,
  never re-anchored) in `tests/db-path.test.ts`.
- **S35-P4 — the mobile-nav ownership fix:** move the
  close-on-route-change adjust-during-render INTO `AppShell` (where
  `mobileNavOpen` lives — the sanctioned own-state pattern);
  `mobile-nav.tsx` drops its `prevPathname` block. Behavior identical (the
  click path closes first; the pathname branch catches back/forward), the
  cross-component render warning gone.
- **S35-P5 — the API robustness layer (RED-first via a new unit suite
  `tests/api-robustness.test.ts`, source-contract pins like the existing
  suites):**
  - FK validation on the PUT bodies: `contacts/[id]` (accountId → account,
    ownerId → user), `leads/[id]` (both), `accounts/[id]` (ownerId),
    `events/[id]` (accountId, contactId) — mirroring the POST vocabulary
    ("Selected company does not exist" / "Selected owner does not exist" /
    the events pair).
  - The POST-side `accountId` checks on `activities` + `events`
    (`contactId` already checked).
  - try/catch → `ERR.INTERNAL()` around the mutating DB calls in the
    touched routes (the envelope contract holds on failure).
  - Store: `resetData()` + `fetchOpportunities()`; `logout()` clears
    `settings`.
- **S35-P6 — the gate:** lint 0/0 · tsc 0 · unit (802 + the new checks) ·
  build · e2e (106 + the image-load check).
- **S35-P7 — the deliverables:** the screenshot set re-captured on the dev
  server (the key routes incl. the mobile drawer + a photo-uploaded shot),
  `.env`/`.env.example` re-verified, docs realigned (README badge + the
  session-35 paragraph, AGENTS counts + the session-35 block, CLAUDE, PAD,
  SKILL v1.32.0 §16aa + frontmatter + project_state, `docs/session_63.md`,
  this plan's execution record, both worklogs) · commit + SSH-wrapper push.

## Validation gates

- RED-first: S35-P1's 3 failing checks are ALREADY RED on the fresh clone
  (the proof); P3/P5 add RED checks before their implementations.
- GREEN: lint 0/0 · tsc 0 · unit · build · e2e — the full gate order.
- LIVE: the photo round-trip end-to-end on the dev server (upload → GET 200
  `image/png` → the img renders + persists), the drawer both directions,
  the seeded dashboard at the s32 scales, the Tailwind token render.

## Deferred (documented, not this session)

The reset role-gating, the health 503, the list-endpoint caps, the
trusted-proxy limiter, the photoUrl prefix validation, the upload
Content-Length pre-check, the updateLead debounce, the hydrate ordering,
the events PUT invariant, the `SavedReport` dead model (all LOW with
rationale above); the Scan Card / Import AI extraction (base44-only); the
Opportunity create/edit UI (absent on BOTH sides — the read-only entity
mirrored); the standing drift re-sweep continues next live visit.

---

## EXECUTION RECORD (2026-10-03, post-gate)

Executed as planned, S35-P1..P7 all landed:

- **S35-P1**: `.gitignore` `uploads/` → the ANCHORED `/uploads/` (with
  the session-35 comment recording the lesson);
  `src/app/api/uploads/[name]/route.ts` recreated per the session-30
  contract — public GET, `UPLOAD_NAME_RE` gate BEFORE any filesystem
  lookup, bytes from `uploadsDir()` with `CONTENT_TYPES[ext]`, 404
  unknown names via the envelope's `fail("NOT_FOUND", …, 404)`,
  `Cache-Control: public, max-age=31536000, immutable`; `db/.gitkeep`
  committed. The 3 RED checks turned GREEN (upload-api 11/11).
  Gate-caught in the loop: the 404 pin demands the literal `404` in
  source (ERR.NOT_FOUND alone does not match /404|NotFound|notFound/ —
  the route uses `fail(...)` with the explicit status), and the ORIGINAL
  gitignore pin `/^uploads\/$/m` encoded the DEFECT — re-anchored to the
  `/uploads/` form with a negative guard.
- **S35-P2**: the profile-photo e2e (S30-P3) extended — the topbar
  avatar's src is `page.request.get`'d demanding 200 + `image/*` (the
  mask can never hide a missing route again).
- **S35-P3**: RED 1/20 first (the absolute-launch-.env check failed
  against the pre-fix seam exactly as predicted), then GREEN 20/20 —
  `isRelativeFileUrl(launchEnvUrl)` added to the session-34 launch-dir
  branch + the no-junk-directories guard in the check.
- **S35-P4**: the close-on-route-change adjust-during-render moved into
  AppShell (own-state — the sanctioned pattern); MobileNav dropped its
  prevPathname block. LIVE-verified: drawer open (8 links + lock +
  focus), `history.back()` with the drawer open → closed + unlocked (the
  exact path that used to fire the cross-component warning).
- **S35-P5**: RED 14/14 first (after fixing a tautological slice anchor —
  `indexOf("resetData:")` matched the TYPE declaration; re-anchored on
  `"resetData: async"`), then GREEN 14/14 — the FK guards on all four
  PUT `[id]` routes + the activities/events POST `accountId` checks +
  try/catch → `ERR.INTERNAL()` on all six touched routes + the store's
  resetData-fetchOpportunities + logout-clears-settings.
  LIVE-verified: PUT with a bogus accountId → the envelope 400
  "Selected company does not exist" (was a raw non-envelope 500); a
  valid PUT still 200s.
- **S35-P6**: gate green — lint 0/0 · tsc 0 · **817/817 unit (+15)** ·
  build clean · **106/106 e2e**.
- **S35-P7**: LIVE verification on the dev server — the full photo
  round-trip (upload → GET 200 `image/png` → the form + Account-card
  imgs render → save → the 500ms reload → the TOPBAR avatar img with
  the SAME URL; all three `<img>`s `complete: true` with decoded
  naturalWidth), the seeded dashboard at the s32 scales ($337.0k /
  $126.0k / $0k), the drawer both directions, zero 390px overflow on
  all nine routes. 4 screenshots (02 re-captured + 11/12 the mobile
  standing shots + **43** the uploaded-photo-served proof NEW);
  `.env`/`.env.example` re-verified (no env surface change);
  docs realigned (README badge 923 + the session-35 paragraph, AGENTS
  817 + the session-35 block, CLAUDE 817, PAD the s35 row / 48 suites /
  817+106, SKILL **v1.32.0** §16aa + frontmatter + project_state,
  docs/session_63.md, this execution record, both worklogs).
- Standing layers: 31st session, NO DRIFT (the bundle md5-identical —
  SIX consecutive stable sessions; the reference's mobile-nav absence at
  a TRUE 390px; our drawer live both directions + the back/forward
  close; zero overflow; the demo data still zero; the production start
  verified on the FRESH clone).
