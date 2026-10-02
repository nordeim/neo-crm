# Session 61 Log — the standalone-launch database-path recovery (session-34)

The workspace refresh: `git pull` reported `bee7211` — up to date
(`docs/session_60.md` = the operator's session-33 transcript, plus the
"update session log" commit; zero app-code drift). The full doc set
reviewed (SKILL v1.30.0's §16y + project_state, AGENTS/CLAUDE/README/PAD
at the 799+106 counts) and the seams verified in code before the baseline
gate. The environment: `.env` `file:../db/custom.db` + `db/` at root
verified, the bundle cache alive (`scripts/reference-bundle.js` outside
the repo tree, md5 `a70a637fcf1d4291da8e0d965676dc11`), the scandihaven
ref alive, agent-browser 0.38.1, the ssh shim intact, vitest (47 suites)
+ playwright + `.env.example` all in place.

Baseline gate: **lint 0/0 · tsc 0 · 799/799 unit · build clean · 106/106
e2e** — first try, no flakes.

Standing layers re-verified (30th session) — NO DRIFT: the reference
bundle BYTE-IDENTICAL to the s30..s33 cache (`/assets/index-DZ-xbrIm.js`,
1,631,071 bytes, md5 `a70a637fcf1d4291da8e0d965676dc11` — no redeploy,
FIVE consecutive bundle-stable sessions); the reference at a TRUE 390px
viewport still ships NO navigation (8 links in the DOM, 0 visible, the nav
box w=0, no hamburger); our drawer spot-verified live both directions on
:3000 (the REAL "Open navigation menu" trigger → 8 links visible inside
the dialog + body scroll lock; Escape → the wrapper's computed
visibility:hidden + unlocked + aria-expanded false); zero 390px overflow
on all nine routes BOTH apps; the reference demo data still ZERO (30th) —
its zero-data dashboard live-confirms the s32 currency doctrine again
("$0.0k" / "$0.0k" / "$0k"); the Tailwind v4 stack audited healthy
(postcss plugin + literal-hex @theme + the vendored tw-animate.css; the
app-shell body computes #f9fafb from the tokens).

**The NEW finding — the production start could not open the database.**
`bun run start` from the repo root boots and serves pages, but every
database-touching route failed: `POST /api/auth/login` HTTP 500,
`GET /api/health` reporting `"db":"down"`, the Prisma log `Error code 14:
Unable to open the database file`. Root cause — two directory rules
disagreeing: at LAUNCH, bun loads `<repo>/.env` and absolutizes the
relative `file:../db/custom.db` against the LAUNCH cwd →
`file:<parent-of-repo>/db/custom.db` (a directory that does not exist);
the standalone `server.js` then runs `process.chdir(__dirname)` (line 6)
into `<repo>/.next/standalone` BEFORE the Prisma client boots, so
`runtimeDatabaseUrl()`'s bun-signature comparison ran against the
post-chdir cwd (whose .env is the traced `.next/standalone` copy) — the
mismatch turned the launch-time absolutization into an apparent
"intentional override," and the parent-of-repo URL passed through to the
engine → SQLITE_CANTOPEN. Proven at all three levels: the live server
(login 500, health db:"down"), the seam (`cd .next/standalone &&
DATABASE_URL=<launch-absolutized> bun -e 'runtimeDatabaseUrl()'` →
returned the outside-repo passthrough), and the history — 33 sessions
never saw it because LIVE verification used the dev server (resolves from
the repo root — the original comparison matches) and the e2e suite runs
the standalone server under playwright's `DATABASE_URL` override (an
intentional override that the seam correctly re-anchors through the
standalone cwd anchor). The broken path was the DOCUMENTED production
start — `bun run start` from the repo root.

TDD Phase A: **3 new checks** in tests/db-path.test.ts — the RED
re-anchor (launch-from-repo-root) + two GREEN guards (the e2e-style
override; the launch-from-standalone traced-.env context). RED confirmed
(1 failed / 18 passed; the two guards passed against the current code as
expected). Phase B: the fix in src/lib/db-path.ts — `repoRootFromStandaloneCwd`
generalized to take a directory, a `readDatabaseUrlFromEnvAt()` helper,
and `runtimeDatabaseUrl()` now ALSO tests the bun signature of the .env at
the validated standalone repo root (the LAUNCH directory); on a match it
re-anchors through `urlForRoot()` (the schema rule, anchored exactly where
bun loaded it). The pinned public API is unchanged; the dev context is
byte-identical when the cwd is outside `.next`. Gate-caught during the
RED→GREEN loop: the first implementation re-anchored via
`resolveDatabaseUrl()` whose module anchor won over the standalone anchor
in the temp-repo layout — refined to `urlForRoot(launchDir, ref)` for an
exact anchor.

Phase C gate: **lint 0/0 · tsc 0 · 802/802 unit (+3) · build clean ·
106/106 e2e** + LIVE verification on the production server launched
exactly per the README: `/api/health` `{"status":"healthy","db":"up"}`,
login 200 with a session, `/api/dashboard` serving the seeded workspace
(dealsClosedValue 337000, revenueThisMonth 126000, salesTarget 0,
conversion 29.2, avg cycle 82), the s33 header trio + filter bar rendering
the documented parity, and the Tailwind v4 token render (body
#f9fafb). Production `server.log`: zero errors.

Phase D: **4 screenshots** (02-dashboard re-captured on the dev server +
**42** the production-start dashboard NEW — the fix in action, `bun run
start` with the database UP — + the 11/12 mobile standing shots, which
came out byte-identical re-captures; 02 + 42 VLM-verified: the trio, the
KPI scales $337.0k/$126.0k/$0k, the +5.3%/+15% deltas, the filter bar
vocabulary, and "styled properly, no error messages" on the production
shot). `.env`/`.env.example` re-verified (no env surface change). Docs
realigned: README badge 908 + the session-34 paragraph + the Deployment
note rewrite, AGENTS counts 802 + the session-34 block, CLAUDE counts +
the db-path paragraph, PAD the s34 test row / 802+106, SKILL **v1.31.0**
§16z + frontmatter + project_state, this transcript, the plan's execution
record, both worklogs.

**What happened:** the production start is whole again — the db-path seam
recognizes the standalone-launch bun absolutization and re-anchors on the
schema rule; the fix is pinned by 3 tests (RED-first) and verified live
at all three levels. The session also surfaced and recorded the sandbox
operational hazards in §16z: the tool-call reaper (servers must run
launch→verify→capture→kill inside ONE call), the orphaned next-server on
:3000 (playwright's `reuseExistingServer` can silently bind to a server
whose DATABASE_URL is not the configured one — `pkill` before every
launch), the OOM-killed neighbor that looks like a code crash (dmesg
`oom-kill` before debugging), and the wrapper-PID RSS sampling trap.

**802/802 unit · 106/106 e2e · 4 screenshots** — docs realigned at SKILL
v1.31.0.

**Next steps:** the Scan Card / Import AI extraction stays base44-only
(documented divergence — no action possible), the Opportunity create/edit
UI stays absent on BOTH sides (the read-only entity mirrored), and the
standing drift re-sweep continues next live visit (the reference has now
been bundle-stable for five consecutive sessions).
