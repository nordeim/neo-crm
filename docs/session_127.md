Session 67 — the auth-seam honesty + the small-hole closures session
(docs/session_125.md, the s66 record + the operator's s66 transcript at
docs/session_126.md [9628bf4, the clone's HEAD — the numbering
convention: odd = the session record, even = the operator's transcript
of the PRIOR session]; the operator's brief = the standing cycle).
Workspace: the sandbox SURVIVED s66 — the pull fast-forwarded
2c748c3 → 9628bf4 (docs/session_126.md only, zero code drift). The
census reads file:/home/z/my-project/neo-crm/db/custom.db +
15/24/10/23/12 + 4 users + pristine: MATCH — db/ at the repo root, as
the operator's brief requires. The s63-s66 intake hazard STANDS: the
orchestration environment exports a STALE
DATABASE_URL=file:/home/z/my-project/db/custom.db (an absolute override
the db-path seam honors BY DESIGN) pointing at a NON-EXISTENT mirror —
all session-67 repo operations ran under `env -u DATABASE_URL` (the e2e
suite immune — its own E2E_DATABASE_URL). Intake hygiene: NO zombie dev
servers; ports 3000/3100 clear. Baseline gate GREEN: lint 0/0 (enforced)
· tsc 0 · 1245/1245 unit (76 suites) — the documented state exact; the
skills/ exclusion verified in all three configs (vitest include
allowlist, eslint ignores, tsconfig exclude).

The standing drift re-sweep (63rd session): the reference bundle
fresh-fetched (the Vite chunk assets/index-DZ-xbrIm.js, direct curl
with a browser UA) — **byte-identical** (size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — the **38th consecutive
stable session**). The reference census (63rd, agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(Total Leads 0 + "+5.3%", the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the
mobile-nav defect STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in
DOM, 0 visible, scrollW 390, NO hamburger); desktop nav normal (256px,
8 links); a reference 390px screenshot captured (outside the repo,
reference-390-s67.png).

The three parallel audit agents (67-a/67-b/67-c) + every finding
manually validated at file:line by the orchestrator. **67-a** — the
s66 re-audit: **12/12 checklist items GENUINE** (the F-66a1 agenda
revert at calendar-page.tsx:494; the N-66i Badge stock re-derivation at
badge.tsx:37/:39/:30-35 with zero old variant names repo-wide; the
N-66d count badge at ui/tabs.tsx:167 + activities-page.tsx:340; the
N-66a search Escape at topbar.tsx:140-149, its e2e re-run green; the
N-66b/c retirements; the N-66e .jsx filter; the N-66f inert/Tab-wrap
e2e re-run 8/8 green; the 17-RED pin set; the docs claims [SKILL
1.63.0, wc -l 6251 exact, the counts family]; the mid-flight repairs;
the screenshots present) — **the non-vacuousness REPLAYED in a pre-fix
603184e worktree: full suite 17 failed | 1228 passed (1245) — to the
digit; the four-suite isolation 17 | 82 (99) exact; clean teardown; the
census sanity MATCH**. ONE new finding: **F-67a1 (Low)** — the
75-activities-overdue-count.png is byte-identical to the re-captured
07-activities.png (md5 7e12b5b2aa4006998d55cbefdb87207b both — the
F-66a2 class reborn on s66's own record: both shots capture the
default view, which IS the Overdue tab, so the artifact carries zero
incremental evidence). **67-b** — the graduation audit: **ZERO
graduations — 13/13 CONFIRMED (24th consecutive session)**, the 8
mechanical censuses ALL CLEAN (localStorage exactly 2 live keys;
public/ og-image.png only; 19 runtime deps all consumed; API 27 routes/
39 handlers all consumed with doc parity; env parity 3-var exact; doc
anchors at 1245+113 with the unit suite re-run LIVE 1245/1245; zero
commented-out code; exactly 2 annotated e2e sleeps; the extra probes
all negative). **67-c** — the fresh-eyes ROTATION on the
AUTH/SESSION/UPLOAD SECURITY seam (the 6 auth routes + auth.ts +
verification.ts + verification-server.ts + rate-limit.ts +
login-reset.ts + uploads.ts + the upload routes + the login/signup
pages + next.config headers, ≈1,275 lines — never a dedicated rotation
target, only swept in the broad s63 server pass) finding the **N-67
family**, every claim manually re-validated at file:line: **N-67a
(Medium)** DEPLOYMENT.md:28-29 documents an X-Forwarded-Proto cookie-
scheme mechanism NO code implements (auth.ts:106 is pure
NODE_ENV — grep: 0 matches); **N-67b (Medium, documented-deferred)**
the rate-limit clientKey trusts raw XFF (the standing s36/s37
trusted-proxy ledger — re-confirmed); **N-67c (Low)** the verify
attempt counter is read-modify-write (verify/route.ts:66-70 —
concurrent submissions can overshoot the 5-wrong lockout); **N-67d
(Low)** all four public auth routes call req.json() with no
Content-Length pre-gate (the S36-P3 upload precedent never extended to
the family); **N-67e (Low)** the upload route — the one route that
writes user bytes to disk — carries NO rate limit; **N-67f (Low)**
/signup retains the authed redirect s23-P2 retired from /login (the
s43 deferred "signup-page session read" ledger entry); **N-67g (Nano
×3)** the stale flat-"10/IP/15min" carriers at AGENTS.md:52 +
playwright.config.ts:13 + auth.setup.ts:4-5 (the N-63e per-route
correction never reached them); **N-67h (Nano)** login hand-builds its
429 with Retry-After while the siblings ship ERR.RATE_LIMITED() with
no header; **N-67i (Nano — KEEP)** the auth ok() payload fields are
consumed by nobody client-side (the API's public self-hosted shape —
recorded as deliberate); **N-67j (Nano)** clearSessionCookie omits the
set-side sameSite/secure; **N-67k (Nano)** the resend link has no
in-flight guard (a double-click burns the 5/15-min budget); **N-67l
(Nano — the documented dead-?? class)** the resend confirmation reads
body?.message at the envelope ROOT (the field nests at body.data — the
?? fallback always fired, behavior-identical only because the strings
match); **N-67m/N-67n (Info — STAND)** the user-enumeration timing
oracle (the s38 deferred ledger) + scrypt at Node defaults;
**N-67o (Nano)** the ≥16-char AUTH_SECRET minimum (auth.ts:23)
documented nowhere in the env surface; **N-67p (Info)** the reference
contract VERIFIED seam-wide (the Callout strings, the 160 email-cap
family, the five-view machine, the edge handling). Coverage gaps
catalogued: the cookie flags, the per-route limit constants, the
ladder beyond rung 1, the upload negative paths — all unpinned.

The operator decisions: the **CSV formula-injection posture (b) STANDS**
(25th re-affirmation — the guard intact in both export families, the
`-` exclusion documented + pinned, safe cells byte-identical, the
reference bundle byte-stable for the 38th consecutive session; the
auth-seam rotation found NO CSV surface — no new evidence moves the (a)
parity / (c) full-OWASP alternatives); the **source-vocabulary
documented parity STANDS AND EXTENDS to the N-67 family** (the 67-b
census re-confirmed the anchors at file:line; the auth seam touches NO
vocabulary surface — its strings are the reference's own
live-verified banner family).

The plan (docs/plans/2026-10-05-session67-parity-remediation.md)
written and validated against the codebase (every anchor grepped at
file:line before execution; the blast radius pre-checked — no unit
pins on ERR.RATE_LIMITED's output, the verify update shape, the signup
redirect, the login 429 hand-build, or the resend button attributes
[the pinned class already carried disabled:opacity-50]; the e2e
budgets pre-computed: the new ladder test adds 1 signup + 6 verify + 1
resend, auth.spec totals login 2/10, signup 2/10, verify 8/20, resend
2/5 — the buckets per-process, fresh per CI=1 boot).

**RED**: the NEW tests/auth-contract.test.ts (12 its: the atomic
increment pin, the api.ts ceiling + helper pins, the gate-before-parse
ordering pins ×4 routes, the upload rate-limit placement pin, the
signup no-redirect pin, the Retry-After family pins, the clear-twin
flag pin, the resend guard pin, the honest-read pin + 2
green-through-RED keep-set records) — **10 failed | 2 passed (12)**
exactly, the intended fix-surface set isolated. Plus the NEW e2e
wrong-code ladder (a green-through-RED guard of working behavior — the
ladder was correct on HEAD, just never driven beyond rung 1).

**GREEN**: S67-P1 the atomic verify ladder (the DB-side increment +
the returned-record read). S67-P2 the auth body pre-gate
(MAX_AUTH_BODY_BYTES = 16 * 1024 + isBodyTooLarge in api.ts + the
gate before the parse in all four routes, the chunked-body limitation
documented in-file). S67-P3 the upload rate limit (20/15min/IP,
DELIBERATELY after the session guard with the placement rationale
recorded in-file). S67-P4 the /signup authed-redirect retirement (the
pure render; the s43 ledger entry closed). S67-P5 the small-honesty
set (ERR.RATE_LIMITED's optional retryAfterSec + all four routes
passing limit.retryAfterSec + login's hand-built NextResponse block
and import retired; the clear-twin flag symmetry; the resending state
+ the disabled link + the early return; the body?.data?.message
read). S67-P6 the doc carriers (the DEPLOYMENT.md cookie-scheme note
re-derived to the NODE_ENV reality; the AUTH_SECRET ≥16-char minimum
in .env.example + DEPLOYMENT.md §3). S67-P7 the stale carriers (all
three at the per-route numbers). S67-P8 the coverage closures (the
auth-contract suite + the e2e ladder). **Zero mid-flight repairs** —
the whole GREEN phase landed clean on the first pass (the s64-s66
needle-in-own-docs class avoided BY DESIGN this time: every absence
pin reads a comment-stripped source, and no record comment in the
touched files quotes a forbidden literal).

**Non-vacuousness**: pre-fix 9628bf4 worktree (node_modules
hard-linked via cp -al) + ONLY the new tests/auth-contract.test.ts →
**10 failed | 1247 passed (1257)** — exactly the RED set isolated
(the 12 new its minus the 2 green-through-RED keep-set guards). Full
clean teardown; `git worktree list` = the main checkout only; the
census sanity MATCH after cleanup.

**Full gate**: lint 0/0 · tsc 0 · **1257/1257 unit (77 suites, +12)**
· build clean · **114/114 e2e** on a fresh CI=1 boot (2.6m, all 8
mobile-nav checks green; the NEW wrong-code ladder test #114 — rungs
2-5 + the lockout repeat + the post-lockout resend — green on BOTH
fresh boots).

**LIVE battery**: the fix surfaces through real round-trips — the
body pre-gate (a 20KB login body answers 400 "Request body too
large", rejected before the parse); the 429 family (the 11th login
from one spoofed-XFF IP answers 429 with `Retry-After: 900` — the
header now on every auth route); the authed /signup RENDERS the card
with no redirect (the s23-P2 shape; the cookie stays httpOnly —
document.cookie empty); the logout round-trip (me → `{ok: true, data:
null}` — the clear twin); the resend banner through the honest
body.data.message read ("New verification code sent to your email");
the wrong-code ladder rung 1 live ("Invalid verification code. 4
attempts remaining." — the atomic-increment path); the drawer both
directions at a TRUE 390px (closed: inert, 0 truly visible by the
computed-visibility check; open: 8/8 truly visible, the body lock,
focus IN the dialog, scrollW 390; Escape → inert + unlocked + focus
RESTORED to the trigger); zero 390px overflow on all ten routes (both
Dashboard casings); NO Tailwind v4 bug (--blur-sm 4px + --shadow-sm
`0 1px 2px 0 #0000000d` + a live surface computing `rgba(0, 0, 0,
0.05) 0px 1px 2px 0px`); the closing db:census MATCH (the 2 throwaway
LIVE-probe users reseeded IN PLACE per the documented protocol —
never delete the .db file).

**Screenshots**: 01/02/07 re-captured + **75 re-captured in the
Due-Today-ACTIVE contrast state** (the red "4" pill on the INACTIVE
Overdue tab — the conditional evidence the byte-identical s66 shot
never carried; the F-67a1 closure) + **76-verify-ladder NEW** (the
verify view with the wrong-code banner — the s67 fix surface; all at
1440×900) — VLM-verified (02: 2/3 with the salesTarget $0k question
the reference's own HARDCODED value [the API + dashboard/route.ts:83
verified]; 07: 3/3; 75: 2/3 with the "due Oct 5" question a
date-context artifact [today IS 2026-10-05 — the due-today items are
correct]; 76: 3/3; 01: 2/3 with the accent-strip question a 4px
DOM-probe-verified sub-pixel artifact [the h-1 gradient strip computes
in the live DOM]).

**Docs realigned**: README (badge 1371 = 1257 + 114, the Tested row,
the tree/commands rows at 1257 + auth-contract, the e2e tree row
112→114 corrected, the session-67 paragraph), AGENTS (the commands
table at 1257/114 + the rate-limit row at the per-route numbers + the
session-67 block), CLAUDE (1257 ×4 + 114), PAD (the s67 inventory row
+ the Total 77/1257+114 + the :357 tree count), SKILL **v1.64.0**
(frontmatter + project_state + the new §16bg, applied atomically via
the assert-first scripts/skill_edits_s67.py at the sandbox root, 6251
→ 6309 lines by wc -l), this record, the plan's execution record,
both worklogs, the F-67a1 errata in session_125.md; .env/.env.example
verified (the AUTH_SECRET ≥16-char minimum note added — the only env
surface change this session; DATABASE_URL `file:../db/custom.db` with
db/ at the repo root).

**Ship**: the commit on main + the SSH-wrapper v3 push (with
`--remote git@github.com:nordeim/neo-crm.git` — the s64 wrapper-trap
note honored) + the remote verification + the operator key shredded.
