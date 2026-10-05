# Session-67 Parity Remediation Plan (2026-10-05)

Session 67 on `main` @ `9628bf4` (the session-66 ship 2c748c3 + the
session-log update — docs/session_126.md, the operator's s66 transcript;
the numbering convention: odd = the session record, even = the
operator's transcript of the PRIOR session). Workspace: the sandbox
SURVIVED s66 — the pull fast-forwarded 2c748c3 → 9628bf4 (session_126.md
only, zero code drift). The census reads
`database: file:/home/z/my-project/neo-crm/db/custom.db` + 15/24/10/23/12
+ 4 users + `pristine: MATCH` — db/ at the repo root, as the operator's
brief requires. The s63-s66 intake hazard STANDS: the orchestration
environment exports a STALE
`DATABASE_URL=file:/home/z/my-project/db/custom.db` (an absolute override
the db-path seam honors BY DESIGN) pointing at a NON-EXISTENT mirror —
all session-67 repo operations run under `env -u DATABASE_URL` (the e2e
suite immune — its own E2E_DATABASE_URL). Intake hygiene: NO zombie dev
servers; ports 3000/3100 clear. **Baseline gate on HEAD: lint 0/0
(enforced) · tsc 0 · 1245/1245 unit (76 suites)** — the documented state
exact. The `skills/` exclusion verified in all three configs (vitest
include allowlist, eslint ignores, tsconfig exclude).

## The standing layers (63rd session, NO DRIFT)

Drift sweep #63: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 38th
consecutive stable session**. Reference census #63 (agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(Total Leads 0 + "+5.3%", the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the
mobile-nav defect STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in
DOM, 0 visible, scrollW 390, NO hamburger); desktop nav normal (256px,
8 links); a reference 390px screenshot captured (outside the repo,
reference-390-s67.png).

## The audits (three parallel agents + manual validation of every claim)

### A. The session-66 re-audit (67-a) — 12/12 GENUINE

Every s66 checklist item verified at file:line: the F-66a1 agenda revert
exact (`calendar-page.tsx:494` items-start + the upcoming-bar
:429 items-center); the N-66i Badge stock re-derivation exact
(`badge.tsx:37` DIV, :39 base, :30-35 the four stock variants, zero old
variant names repo-wide, the accounts :441 rename diffed); the N-66d
count badge exact (`ui/tabs.tsx:167` the literal span classes +
`activities-page.tsx:340` the guarded Overdue-only count); the N-66a
search Escape exact (`topbar.tsx:140-149`, the e2e green); the N-66b/c
retirements exact (the dead names exist only in record comments; the
Sparkline guard reorder at `page-parts.tsx:531-532`); the N-66e .jsx
filter exact (`route-case.test.ts:203`); the N-66f inert/Tab-wrap e2e
exact (the 8th check, run live green); the 17-RED pin set exact
(badge-contract 10 + dch :891-924 4 + the calendar pin + tabs-aria 3 =
+18 its = 1245); the docs claims exact (SKILL 1.63.0, wc -l 6251, the
counts family at 1245+113, the F-66a2 errata, the plan execution
record); the mid-flight repairs exact (the JS comment at :489-492, the
blur-then-focus at crm.spec:499-501, the Account Health locator at
:1751, the stripComments at badge-contract:45-49); the screenshots
present (75 NEW + 02/03/04/07 re-captured). **The non-vacuousness
REPLAYED in a pre-fix 603184e worktree: full suite 17 failed | 1228
passed (1245) — to the digit; the four-suite isolation 17 | 82 (99)
exact; clean teardown; the census sanity MATCH after cleanup.** ONE new
finding: **F-67a1 (Low)** — `75-activities-overdue-count.png` is
byte-identical to the re-captured `07-activities.png` (md5
`7e12b5b2aa4006998d55cbefdb87207b` both) — the F-66a2 class reborn on
s66's own record: the artifact carries zero incremental visual evidence
(the default view IS the Overdue tab both shots capture). The wiring
itself stands (unit pin + live e2e + code).

### B. The graduation audit (67-b) — ZERO graduations, 13/13 (24th consecutive)

All 13 standing items re-verified at file:line (the INFO family
F-47c/N-48c/N-48f/N-48j/N-51c; both operator anchors; the stock-mirror
KEEP; the N-58c boundary; the s63/s65 defensive annotations; the
foreign-docs retirement; the never-imported deps posture — 19/19
consumed; the dead-arm retirements + profile PATCH + sessionWriteToken +
the 8 zero-consumer page-layout records). The 8 mechanical censuses ALL
CLEAN (localStorage exactly 2 live keys; public/ og-image.png only; API
27 routes/39 handlers all consumed with doc parity; env parity 3-var
exact; doc anchors all at 1245+113 — the unit suite re-run LIVE
1245/1245; zero commented-out code; exactly 2 annotated e2e sleeps).
Extra probes all negative (zero TODO/.skip/console.log in src/; new
PrismaClient only in db.ts + the annotated seed client). One precision
note: PAD's "4 spec" counts auth.setup's single setup test as the
fourth (9+95+8+1 = 113 — the house convention).

### C. The fresh-eyes rotation (67-c: the AUTH/SESSION/UPLOAD SECURITY
seam — 6 auth routes + auth/verification/verification-server/rate-limit/
login-reset/uploads libs + the upload routes + login/signup pages +
next.config.ts headers, ≈1,275 lines; never a dedicated rotation target,
only swept in the broad s63 server pass; every finding manually
re-validated at file:line by the orchestrator)

The **N-67 family** (as validated):
- **N-67a (Medium)** `docs/DEPLOYMENT.md:28-29` — the doc tells
  operators to forward `X-Forwarded-Proto` "so cookie attributes derive
  the right scheme", but NO code reads that header anywhere in src
  (grep: 0 matches; `auth.ts:106` is pure
  `secure: NODE_ENV === "production"`). The documented mechanism does
  not exist — a plain-HTTP production boot ships Secure cookies
  browsers silently drop (a login loop) regardless of proxy config.
  Fix: the DOC re-derived to the NODE_ENV reality (reading a spoofable
  request header to drive the Secure flag would be its own hazard —
  the trusted-proxy question is the N-67b ledger).
- **N-67b (Medium, documented-deferred — STANDS)** `rate-limit.ts:38-43`
  — clientKey trusts raw XFF first entry + x-real-ip (spoofable when
  not behind an XFF-overwriting proxy; conversely header-less clients
  share one "unknown" bucket). The trusted-proxy limiter remains in
  the s36/s37 deferred ledger — deploy-specific config, re-confirmed.
- **N-67c (Low)** `verify/route.ts:66-70` — the attempt counter is
  read-modify-write (`user.verificationAttempts + 1` then update), not
  `{ increment: 1 }` — concurrent submissions can exceed the 5-wrong
  lockout against one code (bounded by the 20/IP verify limit).
  Fix: the atomic increment (Prisma returns the post-increment record;
  the lockout/remaining logic reads it).
- **N-67d (Low)** `login:20`, `signup:39`, `verify:36`, `resend:26` —
  all four public auth routes call `req.json()` with NO Content-Length
  pre-gate (App Router handlers buffer with no default body cap); the
  s36-P3 upload pre-gate exists for exactly this class but was never
  extended to the auth family. Fix: a shared `MAX_AUTH_BODY_BYTES`
  (16KB — the honest bodies are email ≤160 + password + a 6-digit
  code) + `isBodyTooLarge(req)` in `api.ts`, applied before the parse
  in all four routes (the upload precedent's documented limitation
  inherited: chunked bodies without Content-Length bypass the gate).
- **N-67e (Low)** `upload/route.ts` — the one route that writes user
  bytes to disk carries NO rate limit (any sessioned user can disk-fill
  via 5MB uploads in a tight loop). Fix: 20 uploads / 15 min / IP (the
  verify budget), DELIBERATELY placed after the session guard (the
  auth family limits first because it is public; here the unauth 401 is
  already cheap — cookie parse, no DB read without a valid signature —
  and bucketing pre-auth would let an attacker exhaust a legitimate
  IP's upload budget without a session).
- **N-67f (Low)** `signup/page.tsx:20-21` — /signup retains the authed
  `redirect("/")` that s23-P2 retired from /login as the "invented
  scaffold pattern" (the reference serves the login card to authed
  visitors). /signup is our documented superset (the reference 404s
  it) — no reference behavior exists to mirror, so the same no-redirect
  shape applies. Fix: retire the redirect + the session read (closes
  the s43 "signup-page session read" deferred ledger entry; the page
  becomes a pure render — no DB round-trip per visit).
- **N-67g (Nano ×3)** `AGENTS.md:52`, `playwright.config.ts:13`,
  `tests/e2e/auth.setup.ts:4-5` — the s63 N-63e per-route correction
  (login 10 / signup 10 / resend 5 / verify 20 per 15 min) never
  reached these three stale flat-"10/IP/15min" carriers. Fix: refresh
  all three (the AGENTS row also gains the upload route's 20).
- **N-67h (Nano)** `login/route.ts:13-17` vs the siblings — login
  hand-builds its 429 with `Retry-After` (bypassing `fail()`); the
  siblings use `ERR.RATE_LIMITED()` with no `Retry-After`. Fix:
  `ERR.RATE_LIMITED(retryAfterSec?)` gains the optional header; ALL
  FOUR routes pass `limit.retryAfterSec` — the family consistent AND
  the header everywhere (login's hand-built block + its NextResponse
  import retire).
- **N-67i (Nano — KEEP, record-only)** the auth `ok()` payload fields
  (`id`/`email`/`name`/`requiresVerification`/…) are consumed by
  nobody client-side (LoginCard checks only res.ok/body.ok). The
  payload is the API's public self-hosted shape (a REST endpoint
  returning the authenticated entity is normal contract design);
  stripping it is API churn with zero parity gain. Recorded as
  deliberate.
- **N-67j (Nano)** `auth.ts:112-115` — `clearSessionCookie` omits the
  `sameSite`/`secure` its set-side twin carries (deletion unaffected —
  name+path match). Fix: the twin symmetry (cosmetic-but-correct; a
  future cookie-policy change stays consistent across set/clear).
- **N-67k (Nano)** `login-card.tsx` onResend — no in-flight guard: a
  double-click burns the 5/15-min resend budget. Fix: a `resending`
  state + `disabled={resending}` on the link (the pinned class already
  carries `disabled:opacity-50` — the design anticipated it).
- **N-67l (Nano — the documented dead-?? class)** `login-card.tsx:189`
  — `body?.message` reads the envelope ROOT on the resend success path;
  the field lives at `body.data.message`, so `?? verificationResentMessage()`
  always fires (behavior-identical only because the route ships the
  same string). Fix: the honest `body?.data?.message` read.
- **N-67m/N-67n (Info — STAND)** the user-enumeration timing oracle
  (the s38 deferred ledger) + scrypt at Node defaults (the documented
  convention). No action.
- **N-67o (Nano)** `.env.example` + `DEPLOYMENT.md:36` — the ≥16-char
  AUTH_SECRET minimum (`auth.ts:23`) is documented nowhere in the env
  surface (only the runtime warning carries it). Fix: both carriers.
- **N-67p (Info — parity VERIFIED)** seam-wide: the reference contract
  holds (Callout banners with the exact live-verified strings, the 160
  email-cap family consistent, the five-view in-place machine, the
  malformed-cookie/expired-session/Unicode-password edges handled and
  unit-pinned). No action.

**Coverage gaps found (67-c)**: the cookie flag family unpinned; the
per-route limit constants unpinned; the verify ladder beyond rung 1
never driven; the upload negative paths source-pinned only. Closures
landed at S67-P8.

## The operator decisions

The **CSV formula-injection posture (b) STANDS** (25th re-affirmation —
the guard intact in both export families [guardFormulaPrefix at
csv.ts:31-33 applied in escapeCell AND entity-export.ts:24], the `-`
exclusion documented + pinned, safe cells byte-identical [the s41-P2
precedent], the reference bundle byte-stable for the 38th consecutive
session; the auth-seam rotation found NO CSV surface — no new evidence
moves the (a) parity / (c) full-OWASP alternatives).

The **source-vocabulary documented parity STANDS AND EXTENDS to the
N-67 family** (the 67-b census re-confirmed the anchors at file:line:
CONTACT_SOURCE_OPTIONS/LEAD_SOURCE_OPTIONS/SOURCE_PAIRS pinned, NO
enum-membership on routes' source [free-form, string-ness + 40 chars],
the settings Capitalized defaults verbatim, the in-file records at
constants.ts + settings/route.ts + the validation routes; the reference
bundle byte-identical; the N-67 family touches NO vocabulary surface —
the auth seam's strings are the reference's own live-verified banner
family).

## The remediation set (TDD — RED first, then GREEN)

- **S67-P1 (N-67c)** the atomic verify ladder: the `{ increment: 1 }`
  update + the returned-record read for the lockout/remaining logic.
- **S67-P2 (N-67d)** the auth-family body pre-gate:
  `MAX_AUTH_BODY_BYTES = 16 * 1024` + `isBodyTooLarge(req)` in api.ts,
  applied before `req.json()` in all four auth routes.
- **S67-P3 (N-67e)** the upload rate limit (20/15min, post-guard, the
  documented placement rationale in-file).
- **S67-P4 (N-67f)** the /signup authed-redirect retirement.
- **S67-P5 (the small-honesty set)**: N-67h the Retry-After family
  (ERR.RATE_LIMITED gains the optional param; all four routes pass it;
  login's hand-built block + NextResponse import retire); N-67j the
  clear-twin flag symmetry; N-67k the resend in-flight guard; N-67l the
  honest `body?.data?.message` read.
- **S67-P6 (the doc carriers)**: N-67a the DEPLOYMENT.md
  X-Forwarded-Proto re-derive; N-67o the AUTH_SECRET ≥16-char minimum
  in .env.example + DEPLOYMENT.md §3.
- **S67-P7 (the stale carriers)**: N-67g ×3 (AGENTS.md:52 +
  playwright.config.ts:13 + auth.setup.ts:4-5 at the per-route numbers).
- **S67-P8 (the coverage closures)**: the NEW
  `tests/auth-contract.test.ts` (the source-contract suite: the cookie
  flag family + the clear twin, the per-route limit constants + the
  upload addition, the body pre-gate family, the atomic increment, the
  Retry-After family, the signup no-redirect, the resend guard + the
  honest read) + the NEW e2e full wrong-code ladder (5 wrong →
  lockout → the 6th repeats; the resend non-leaking banner) — the
  114th e2e check. Plus **F-67a1**: re-capture
  75-activities-overdue-count.png in the Due-Today-active state (the
  count pill visible on the INACTIVE Overdue tab — the conditional
  evidence the byte-identical default-view shot never carried) + the
  errata in session_125.md.

## Blast radius (pre-checked)

No unit pins on: ERR.RATE_LIMITED's exact output (only the limiter's
retryAfterSec at rate-limit.test.ts:12), the verify update shape, the
signup redirect (route-case pins only the capital-alias ABSENCE;
page-titles imports the metadata — untouched; pwa-metadata reads the
pageMetadata line — untouched), the login 429 hand-built shape, or the
resend button attributes (login-views pins the CLASS, which already
carries disabled:opacity-50). The e2e budgets fit: the new ladder test
adds 1 signup + 6 verify + 1 resend (auth.spec totals: login 2/10,
signup 2/10, verify 8/20, resend 2/5 — the buckets per-process, fresh
per CI=1 boot).

## The gate

lint 0/0 · tsc 0 · the full unit suite at 1245 + the new auth-contract
its · build clean · e2e 113 + 1 = 114 on a fresh CI=1 boot (all 8
mobile-nav checks green) · the non-vacuousness replay in a pre-fix
9628bf4 worktree (only the new/modified test files; the exact RED set
isolated) · the LIVE battery (the fix surfaces through real keyboard
and network round-trips; the mobile drawer regression; zero 390px
overflow; the Tailwind v4 token probes; the closing db:census MATCH).

## The execution record (2026-10-05, session-67)

EXECUTED AS PLANNED, zero mid-flight repairs. RED: the NEW
tests/auth-contract.test.ts (12 its) — 10 failed | 2 passed exactly
(the intended fix-surface set; the 2 keep-set records green-through-RED
guards). GREEN: S67-P1..P8 all landed (P1 the atomic increment; P2
MAX_AUTH_BODY_BYTES + isBodyTooLarge + the four gates; P3 the upload
20/15min post-guard; P4 the signup pure render; P5 the Retry-After
family + the clear twin + the resend guard + the honest read; P6/P7
the five doc carriers; P8 the closures). Non-vacuousness: 10 failed |
1247 passed (1257) in the pre-fix 9628bf4 worktree — the exact RED
set. Full gate: lint 0/0 · tsc 0 · 1257/1257 unit (77 suites, +12) ·
build clean · 114/114 e2e on a fresh CI=1 boot (the ladder test green
on BOTH fresh boots). LIVE: the pre-gate 400 on a 20KB body; the 429
Retry-After: 900; the authed /signup render; the logout round-trip;
the resend banner; the ladder rung; the drawer both directions at TRUE
390px; zero overflow ×10; NO Tailwind v4 bug; the closing census MATCH
(the 2 throwaway probe users reseeded in place). Screenshots: 01/02/07
re-captured + 75 re-captured in the Due-Today-active contrast state
(the F-67a1 closure) + 76-verify-ladder NEW — VLM-verified with 3
artifacts explained (the reference's own hardcoded salesTarget, the
date-context, the 4px strip). Docs: SKILL v1.64.0 (§16bg, 6251 →
6309) + README/AGENTS/CLAUDE/PAD at 1257+114 (badge 1371) +
session_127.md + this record + both worklogs + the F-67a1 errata.
Estimate drift: none (the plan's 10-RED / +12-its / 114-e2e numbers
all exact).
