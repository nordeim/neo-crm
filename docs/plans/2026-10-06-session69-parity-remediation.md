# Session-69 Parity Remediation Plan (2026-10-06)

Session 69 on `main` @ `57e692b` (the s68 ship `66bc17e` + the
session-log update — docs/session_129.md the s68 record,
docs/session_130.md the operator's s68 transcript). Workspace: a FRESH
CLONE (intake: `bun install` 533 packages + `db:push` + `db:seed` — the
census reads `database: file:/home/z/neo-crm/db/custom.db` + 15/24/10/
23/12 + 4 users + `pristine: MATCH`, db/ at the repo root as the
operator's brief requires). The documented intake hazard STANDS: the
orchestration environment exports a STALE
`DATABASE_URL=file:/home/z/my-project/db/custom.db` (an absolute
override the db-path seam honors BY DESIGN) pointing at a NON-EXISTENT
mirror — all session-69 repo operations run under `env -u DATABASE_URL`
(the e2e suite immune — its own pinned E2E_DATABASE_URL). `.env`
re-created from `.env.example` (DATABASE_URL `file:../db/custom.db`, a
generated AUTH_SECRET). Intake hygiene: NO zombie dev servers; ports
3000/3100 clear. **Baseline gate on HEAD: lint 0/0 (enforced) · tsc 0 ·
1275/1275 unit (79 suites)** — the documented state exact. The
`skills/` exclusion verified in all three configs (vitest include
allowlist, eslint ignores, tsconfig exclude); the skills/ folder
excluded from code checking, testing and compilation per the operator's
brief.

## The standing layers (65th session, NO DRIFT)

Drift sweep #65: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 40th
consecutive stable session**. Reference census #65 (agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the mobile-nav defect STANDS
at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW
390, NO hamburger — the visible-button census lists no menu button);
desktop nav normal (256px, 8 links, all visible). The scandihaven
tech-stack patterns reviewed (AGENTS/PAD: pnpm + Turborepo, Next 16.3
App Router + async params + the proxy.ts placement quirk, Tailwind v4
CSS-first with the @source + var()-chain hazards, Vitest + Playwright —
the same stack family; no pattern contradicts our single-app
architecture).

## The audits (three parallel agents + manual validation of every claim)

### A. The session-68 re-audit (69-a) — 12/12 GENUINE (9 clean + 3 with nano notes)

Every s68 checklist item verified at file:line: the three bare
stat-value forms exact (page-parts.tsx:265/:355/:416 — the trio absent
from every KPI value, confirmed against the fresh-fetched bundle); the
reports fixed-scale exact (`scale: "k"` + `decimals: 0` at
reports-page.tsx:302/:314, no options-without-scale consumer remains);
the hover-comment re-scopes exact; the five wirings exact (constants
consumed, pins re-anchored); the format closures exact; the 12-route
sessioned pre-gate exact (all 16 `req.json()` sites in src/app/api
gated); the carriers exact (SKILL H1 1.65.0, the upload-20 line, the
22-era numerics zero, the CARD_TITLE_OVERRIDE.filters retirement +
absence pin); the counts LIVE re-verified (79 files, 1275/1275); the
commit diff honest (44 files, +1057/−67, zero strays); the new tests
non-vacuous; the arithmetic consistent end-to-end. NEW findings:
**F-69a1 (Nano)** `page-parts.tsx:338` — the IconStatCard **leads
variant** value still carries `text-foreground` (the 4th class the
N-68a sweep named), pre-existing since `38bf22ee`, uncovered by the s68
pins (the absence it covers only the combined decoration strings); the
reference's leads values carry `text-xl sm:text-2xl font-bold
text-gray-900` (×2 in the bundle) — ours reads `text-xl font-bold
text-foreground sm:text-2xl` (order + the semantic-foreground class
the sweep retired everywhere else). **F-69a2 (Nano, record accuracy)**
the "7 screenshots" claim vs 6 evidenced in the commit (01
byte-identical since s67 — the F-67a1 class). **F-69a3 (Nano)**
`leads/[id]/route.ts:24-28` — the pre-gate sits INSIDE the try AFTER
the findUnique DB read, mis-indented (2-space vs the 4-space siblings);
the only one of the 12 routes where the gate is not the first
post-guard statement (the gate-before-parse ordering still holds).
**F-69a4 (Nano, record precision)** "the format coverage closures
(7 its)" vs the actual 5 its. **F-69a5 (Nano)**
`contact-detail-panel.tsx:45-50` — `mmmDyyyy` re-declares the
byte-identical month array (the N-68h class surviving outside
format.ts; MONTHS_SHORT is module-private). **F-69a6 (Info)**
`format.ts:45-48` — the sub-1000 `if (options)` branch is now
src-unreachable (every option-passing consumer passes a scale since
S68-P2; the topbar hint passes NO options) and its comment still
attributes it to "the reports cards" — stale-comment + test-only-branch
nano.

### B. The graduation audit (69-b) — ZERO graduations, 13/13 (26th consecutive)

All 13 standing items re-verified at file:line (F-47c, N-48c, N-48f,
N-48j, N-51c, the CSV posture (b), the source-vocabulary parity, the
stock-mirror, the N-58c boundary, the defensive annotations, the
foreign-docs retirement, the 19/19 deps, the standing fixes). The 8
mechanical censuses ALL CLEAN (localStorage exactly 2 live keys;
public/ og-image.png only; 19/19 deps consumed; API 27 routes/39
handlers all consumed; env parity 3-var exact; doc anchors at
1257+114 LIVE-verified — wait, 1275+114 — all four carriers exact,
badge 1389; zero commented-out code; exactly 2 annotated e2e sleeps).
Extra probes all negative (TODO/FIXME = 0; .skip/.only = 0; console.log
= 0 with the 4 documented exceptions; new PrismaClient exactly 2).
Doc-hygiene infos: F-69b1 (six standing anchors drifted 1-4 lines from
the 67-b record — all attributable to the documented s68 edits, zero
semantic drift; this ledger quotes the 69-b anchors), F-69b2 (the
27/39 census re-derived doc-exact).

### C. The fresh-eyes rotation (69-c: the e2e infrastructure seam —
tests/e2e/*.spec.ts + auth.setup.ts + global-setup.ts +
playwright.config.ts, 2,933 lines; never a dedicated rotation target;
every claim manually re-validated at file:line)

The **N-69 family** (as validated):
- **N-69a (Low)** `playwright.config.ts:60` — local reused-server
  limiter accumulation: `reuseExistingServer: !CI` keeps the in-memory
  rate buckets alive across runs while the DB is reseeded; run #3
  within 15 min trips resend (6>5) and verify (21>20) → spurious 429
  failures in the ladder tests (the gate's CI=1 fresh boots immune;
  self-heals in 15 min).
- **N-69b (Nano)** `auth.spec.ts:179-180` — the comment says the
  sibling test spends 2 verify POSTs; its incomplete guard is
  client-side (login-card.tsx:151-154 returns before the fetch), so
  the sibling spends exactly 1 (the wrong-code submission) — actual
  7/run, not 8 (the conservative direction).
- **N-69c (Nano)** `crm.spec.ts:1733` — `not.toHaveCount(0)`
  immediately after `sectors.first()).toBeVisible()` (:1732) — can
  never fail once the first passed; zero added coverage.
- **N-69d/e/f (Nano)** the loose-locator/near-zero-assert/dialog-handler
  hygiene set (crm.spec.ts:23, :1746, :954, :1476, :2059-2062) —
  recorded; the parity-bearing surfaces unaffected.
- **N-69g (Nano)** the E2E_PORT default "3100" hardcoded twice
  (playwright.config.ts:22 vs crm.spec.ts:507) — drift sends the 401
  probe at a dead port.
- **N-69h (Nano)** `playwright.config.ts:24` — `E2E_DATABASE_URL` is
  a const named like the env-driven E2E_PORT above it; implies
  overridability it lacks (the isolation itself deliberate and
  correct — needs the comment).
- **N-69i (Nano)** `auth.setup.ts:4-5` — the carrier lists only
  "login 10" of the four per-route budgets.
- **N-69j (Nano)** `/uploads/` accumulates uniquely-named photo files
  across runs (gitignored; DB rows reseeded away, files never cleaned)
  — recorded as the known local-hygiene class.
- **N-69k/l/m/n/o (Info)** the in-file order dependence
  (self-documented, deliberate); the 2 sleeps the ONLY waits (zero
  networkidle/bare waitFor/hardcoded dates); the s68 stat-value sweep
  broke NO e2e selector; the config honesty verified (production
  standalone server, isolated db/e2e.db, honest 503-capable health
  check, retries 0, storageState re-minted post-reseed); the src
  cross-checks pass (every asserted route exists, 25+ strings/labels
  match, the seed data matches, vitest never double-counts the specs).

**Coverage gaps (the rotation's catalog)**: the documented s67 gaps
standing (per-route limit constants pinned nowhere; the
unverified-login refusal banner; the upload negative paths; the logout
round-trip; the signup 4xx) + TWO NEW LIVE-only surfaces never e2e-
pinned: (9) the 10-route × zero-390px-overflow sweep (both Dashboard
casings) and (10) the body pre-gate 400s (the s67 auth + s68 sessioned
families — unit+LIVE only). The mobile drawer contracts are fully
e2e-pinned (NOT a gap).

## The operator decisions

The **CSV formula-injection posture (b) STANDS** (28th re-affirmation —
the guard intact in both export families [guardFormulaPrefix at
csv.ts:31-33 applied in escapeCell AND imported into entity-export.ts],
the `-` exclusion documented + pinned, the reference bundle byte-stable
for the 40th consecutive session; the e2e rotation found NO CSV
surface — no new evidence moves the (a) parity / (c) full-OWASP
alternatives).

The **source-vocabulary documented parity STANDS AND EXTENDS to the
N-69 family** (the 69-b census re-confirmed the anchors at file:line:
CONTACT_SOURCE_OPTIONS/LEAD_SOURCE_OPTIONS/SOURCE_PAIRS pinned, NO
enum-membership on routes' source, the settings Capitalized defaults
verbatim; the e2e rotation + the s68-straggler fixes touch NO
vocabulary surface — the fixes are class strings, a gate position, a
month array, comments, and e2e hygiene).

## The remediation set (TDD — RED first, then GREEN)

- **S69-P1 (F-69a1)** the leads-variant stat-value: `text-xl
  sm:text-2xl font-bold` (the `text-foreground` retired, the order
  normalized to the reference family order — the reference's leads
  values are `text-xl sm:text-2xl font-bold text-gray-900`).
- **S69-P2 (F-69a3)** the leads/[id] gate hoist: the pre-gate moves
  above the try (right after `const { id } = await params;`), matching
  the 11 siblings; re-indented.
- **S69-P3 (F-69a5)** MONTHS_SHORT exported from format.ts;
  contact-detail-panel's mmmDyyyy rides it (the N-68h class closed
  repo-wide).
- **S69-P4 (F-69a6)** the format.ts sub-1000 comment re-scope (the
  branch = the test-pinned zero-state guard, no src consumer since
  S68-P2).
- **S69-P5 (N-69a)** the playwright.config.ts webServer annotation:
  the local reused-server limiter hazard documented (CI=1 for repeated
  local runs; self-heals in 15 min).
- **S69-P6 (N-69c)** the redundant `not.toHaveCount(0)` retired (the
  N-66 retirement class — zero-coverage assertions are retired, not
  padded).
- **S69-P7 (N-69g/h)** the E2E_PORT dedupe: the new
  tests/e2e/e2e-port.ts owning the default + env resolution; both
  consumers import it; the E2E_DATABASE_URL const gains the
  deliberate-isolation comment.
- **S69-P8 (N-69b/i)** the comment carriers: auth.spec.ts:179-180
  "spends 2" → "spends 1" (the incomplete guard is client-side, never
  POSTs); auth.setup.ts:4-5 extended to the four budgets (login 10 /
  signup 10 / resend 5 / verify 20 per 15 min).
- **S69-P9 (the 69-c coverage closures — the two NEW-gap e2e checks)**:
  (a) crm.spec.ts gains the sessioned pre-gate 400 probe (PUT
  /api/settings with a >16KB body → 400 "Request body too large" — the
  s68 fix surface, unit+LIVE-only until now); (b) mobile-navigation.spec.ts
  gains the ten-route × zero-390px-overflow sweep (/, /Dashboard,
  /accounts, /contacts, /leads, /calendar, /activities, /reports,
  /settings, /profile — the LIVE-battery check, now pinned). Both are
  green-through-RED guards of LIVE-verified behavior (the s67
  wrong-code-ladder precedent).
- **The carriers**: F-69a2 (the "7 screenshots" precision) + F-69a4
  (the "7 its" vs 5) recorded as errata in session_131.md.

## Blast radius (pre-checked)

No unit pins on: the leads-variant value string (the stat-value-
contract absence it covers only the combined decoration strings — the
new pin is the S69-P1 RED); the leads/[id] gate position vs the DB
read (the body-pregate ordering pins gate-vs-parse only — the new
db-ordering pin is the S69-P2 RED); the contact-detail-panel month
array (no pins — the new dch it is the S69-P3 RED); the format
comment (comment-only); the "3100" literals (the gate-script comments
mention :3100 in prose — the new pin counts code, not comments); the
auth.spec/auth.setup comments (comment-only). The e2e suite: no e2e
asserts the leads-variant geometry, the gate position, or the month
array; the two NEW e2e checks are additive (114 → 116); the
`not.toHaveCount(0)` retirement removes an assertion inside an
existing test (no count change). The IconStatCard consumers verified
(leads-page ×5, all variant="leads"; the contacts default unaffected).

## The gate

lint 0/0 · tsc 0 · the full unit suite at 1275 + the 4 new session-69
its (1279) · build clean · e2e 116 on a fresh CI=1 boot (all 8+1
mobile-nav checks green) · the non-vacuousness replay in a pre-fix
57e692b worktree (only the new/modified test files; the exact RED set
isolated) · the LIVE battery (the fix surfaces through real
round-trips + the mobile drawer regression at TRUE 390px + the
Tailwind v4 token probes + zero 390px overflow ×10 routes + the
closing db:census MATCH) · the screenshot set at 1440×900 · the docs
realignment (SKILL v1.66.0 + README/AGENTS/CLAUDE/PAD at the new
counts + session_131.md + this execution record + both worklogs).

## The execution record (2026-10-06, session-69)

EXECUTED AS PLANNED with ZERO mid-flight repairs (the pre-checked
blast radius held exactly — the four RED surfaces were unpinned, the
e2e additions additive, no collateral pin sets found at the GREEN
checkpoint). RED: 4 failed exactly (the stat-value-contract
leads-variant it + the body-pregate handler-scoped DB-ordering it +
the dch MONTHS_SHORT it + the gate-script E2E_PORT it); the two NEW
e2e checks are green-through-RED guards of LIVE-verified behavior
(the s67 wrong-code-ladder precedent). GREEN: S69-P1..P9 all landed
(P1 the leads bare family-order form; P2 the gate hoist above the
try; P3 MONTHS_SHORT exported + the panel rewired; P4 the format
comment re-scope; P5 the playwright reuse-hazard annotation; P6 the
redundant assertion retired; P7 the e2e-port single source + the
E2E_DATABASE_URL comment; P8 the auth.setup/auth.spec carriers; P9
the pre-gate 400 probe + the ten-route overflow sweep). Non-
vacuousness: 4 failed | 74 passed (78) in the pre-fix 57e692b
worktree; clean teardown. Full gate: lint 0/0 · tsc 0 · 1279/1279
unit (79 suites, +4) · build clean · 116/116 e2e on a fresh CI=1
boot (2.7m, all 9 mobile-nav checks green). LIVE: the leads computed
styles at the bare form; the pre-gate 400 + honest 200; the drawer
both directions at TRUE 390px; zero overflow ×10; NO Tailwind v4
bug; the closing census MATCH — zero probe residue. Screenshots: 05
re-captured + 79-mobile-overflow-sweep NEW (VLM-verified 3/3 + 3/3).
Docs: SKILL v1.66.0 (§16bi, 6352 → 6399) + README/AGENTS/CLAUDE/PAD
at 1279+116 (badge 1395; the AGENTS 7→9 mobile-nav sub-count + the
CLAUDE stale "112" carrier closed in passing) + session_131.md + the
F-69a2/F-69a4 errata + this record + both worklogs. Estimate drift:
none (the plan's 4-RED/+4-its/114→116 numbers exact).
