# Session-63 Parity Remediation Plan (2026-10-05)

Session 63 on `main` @ `d0129de` (the session-62 ship). Workspace NOTE: the
repo was RESTRUCTURED between sessions — it now lives at `/home/z/neo-crm`
(previously `/home/z/my-project/neo-crm`, the sandbox root's child). The
`.env` contract is location-independent and survived intact
(`DATABASE_URL="file:../db/custom.db"`); `<repo>/db/custom.db` was recreated
(`db:push` + `db:seed`) and the census reads
`database: file:/home/z/neo-crm/db/custom.db` + 15/24/10/23/12 + 4 users +
`pristine: MATCH`. NEW INTAKE HAZARD neutralized: the orchestration
environment exports a STALE `DATABASE_URL=file:/home/z/my-project/db/custom.db`
(the OLD layout's mirror) — an absolute override the db-path seam honors BY
DESIGN ("absolute URLs are intentional overrides"), which silently retargeted
every bun process at the orphaned mirror. All repo operations this session
run under `env -u DATABASE_URL` so the repo `.env` relative contract wins
(the e2e suite is immune — it sets its own `E2E_DATABASE_URL`). Intake
hygiene: NO zombie dev servers; ports 3000/3100 clear. **Baseline gate on
HEAD: lint 0/0 (enforced) · tsc 0 · 1210/1210 unit (75 suites)** — the
documented state exact. The `skills/` exclusion verified in all three configs
(vitest include allowlist, eslint ignores, tsconfig exclude).

## The standing layers (59th session, NO DRIFT)

Drift sweep #59: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size 1,631,071 +
md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 34th consecutive stable
session**. Reference census #59 (agent-browser, live login at 1280 then a
TRUE 390px viewport): the demo data still zero (Total Leads 0 + "+5.3%",
`$0.0k`); the mobile-nav defect STANDS at a TRUE 390px (vw=390, nav w=0,
8 links in DOM, 0 visible, scrollW 390, NO hamburger); desktop nav normal
(256px, 8 links visible); a reference 390px screenshot captured (outside the
repo).

## The audits (three parallel agents + manual validation of every claim)

### A. The session-62 re-audit (63-a) — ALL 23 CHECKLIST ITEMS GENUINE

The manifest honesty (react-toast absent from package.json + both lockfiles +
the 30-token install script; @types/node ^26.6.2 in devDeps with 26.6.4 +
undici-types RESOLVED in package-lock; the guard pinning all 6 surviving
radix packages to real import sites), the profile gate retirement (zero
`dirty`, `disabled={saving}` only, the unconditional PATCH), the dead-arm
retirement (one-arm forms, zero `?? a.dueAt`), the doc-numerics sweep (all
named anchors re-derived exact), the counts by run (dch 42/42; playwright
--list 112 in 4 files), the docs arithmetic (badge 1322, SKILL v1.59.0,
wc -l 5988 exact), and the **non-vacuousness REPLAYED** in a pre-fix
`6125f6b` worktree: **3 failed | 52 passed (55)** — the commit's arithmetic
reproduced to the digit. NINE record-precision findings (63-a G-1..G-9):
**G-1** session_117.md:112 "react-toast + its 13 transitives out" OVERSTATES
(only the one entry left; the 12 named transitives remain, shared by the
surviving radix packages); **G-2** PAD:357-358 still "1207 checks" / "111
checks" (HEAD 1210/112 — the 62-a#2 tree-block class, missed sibling);
**G-3** crm.spec.ts:2147 comment "The name must be dirty to save" — stale
post-N-62b; **G-4** the N-62e precision note landed on 1 of 3 sites
(contacts-page.tsx:328-332 + the entity-export.test.ts:165-166 pin comment
still claim "disabled at zero data"); G-5..G-9 INFO-grade (the "k6125f6b"
typo — not a resolvable object, the actual is `6125f6b`; the plan's "2 docs
files" actually 1; the "5913 → 5988" intermediate-base class; CLAUDE:371
silently healed; PAD:739's historical s61 row).

### B. The graduation audit (63-b) — ZERO graduations, 13/13 (20th consecutive)

All 13 standing items re-confirmed at file:line (line-tolerance drift only).
The INFO family unchanged (F-47c, N-48c, N-48f, N-48j, N-51c). Both operator
anchors standing. The 8 mechanical censuses ALL CLEAN (localStorage 2 live
keys; public/ og-image.png only; the package surface — with the 63-b #2
precision note: prisma/react-dom are framework/CLI-consumed, "import site OR
documented framework consumption" is the honest census form; API 27/39 all
consumed; env parity 3-var exact; doc anchors 10/10; zero commented-out code;
exactly 2 annotated e2e sleeps). ONE new finding: **63-b #1** —
`scandihaven_SKILL.md` (128,868 B) + `project-management_SKILL.md` (31,946 B)
tracked at the repo root since the initial scaffold `b48fc3d`, NEVER modified
in 62+ sessions, zero functional references (the operator's prompt templates
cite the GITHUB repo URL for scandihaven's docs; project-management_SKILL.md
documents ORBITAL — a different project entirely) — ~160 KB of foreign
manuals in every clone, the s54 fully-dead class, DOC-FILE variant.

### C. The fresh-eyes rotation (63-c: the SERVER SEAM — src/lib 23 files +
src/app/api 27 routes + prisma/seed.ts + scripts/, ≈7,700 lines read in full)

The **N-63 family** (every anchor manually validated at file:line):
- **N-63a (Medium)** page-layout.ts contract-vs-consumption divergence: 8
  exported records have ZERO page consumers (PAGE_TITLES :611,
  DIALOG_BARE_GROUP :737, RECENT_DEALS :846, STAT_SHADOWS :1060,
  CHART_GEOMETRY :1076, TABLE_SHADOWS :1103 — zero consumers anywhere outside
  the record file + its test; CALENDAR_CELL :963 + DELTA_TEXT :1169 live only
  in-file through allLayoutClasses). The module header's "Pages consume these
  records instead of hand-writing grid/header/rail classes" (:4-8) is FALSE
  for the family — the live pages hand-inline (calendar-page.tsx:338-348,
  page-parts.tsx, contacts/reports/leads/activities/dashboard surfaces), and
  CALENDAR_CELL.base has DRIFTED from the live page (the live cell carries
  `flex flex-col items-stretch` + the focus-ring pair the record lacks; the
  record's outOfMonth duplicates `transition-all` that base already carries).
  A test pinning a value the live page no longer renders is a guard pinning
  a stale copy — the s24 click-contract lesson at the layout seam.
- **N-63b (Low)** the surviving dead-arm set, split by risk class:
  construction-dead over INTERNAL constants — dashboard/route.ts:108
  `PIPELINE_LABELS[stage] ?? stage` (the PIPELINE_STAGES.map loop; all 5 keys
  verified present in PIPELINE_LABELS) + its client sibling (app)/page.tsx:278
  + settings/route.ts:131 `!view ||` (asString's optional+trim contract
  returns undefined-or-non-empty; `?? "month"` makes `!view` unreachable) →
  RETIRE; defensive over PERSISTED data — reports/route.ts:213/:215/:390 the
  ACTIVITY_TYPE_META[...]?.label triple, reports/route.ts:200
  `o.stage || "unknown"`, dashboard/route.ts:155 the `: 0` ternary arm (the
  filter guarantees dueAt but Activity.dueAt is `DateTime?` and the codebase
  has ZERO type-predicate/non-null-assertion patterns — the arm is
  statically required) → KEEP + ANNOTATE (the defensive-DB-read posture).
- **N-63c (Low)** the allLayoutClasses sweep (:993) claims "Every exported
  class string" but ~30 exported groups are absent (STAT_SHADOWS,
  TABLE_SHADOWS, DIALOG_BARE_GROUP, MENU_*, BUTTON_BASE, CHECKBOX,
  INPUT_BASE, SELECT_TRIGGER, PROFILE_LAYOUT, DIALOG_HEADER/OVERLAY/CLOSE/
  FOOTER/TITLE/TEXTAREA, PAGE_ROOT, CALENDAR_CARD, CONTACTS_LAYOUT,
  SETTINGS_GRID, REPORTS_TABLE_CARD, …) — the 62-a#4 coverage class.
- **N-63d (Low)** undocumented server-TZ dependence: the period windows
  (export/route.ts, reports/route.ts via startOf*) compute
  today/thisWeek/quarter/ytd in the SERVER's local TZ where the reference
  computes client-side. ANNOTATE.
- **N-63e (Nano)** rate-limit.ts:2 comment "10 attempts / 15 min / IP" vs
  the actual per-route limits (login 10, signup 10, resend 5, verify 20 — all
  per 15 min). FIX the comment.
- **N-63f (Nano)** new N-58c internally-live-export members (SESSION_TTL_MS,
  SessionPayload, NO_ACTIVITY_DAYS, daysSince, HealthState, generatedDate,
  encode/decodeSavedReports, DEFAULT_DATABASE_URL, urlForRoot,
  formatDateShort, CsvTemplate, the reports-data param types,
  OpportunityStage, StageMeta). Document alongside the N-58c boundary.
- **N-63g (Nano)** auth.ts:16-20 DEV_SECRET fires SILENTLY for a short
  (<16-char) AUTH_SECRET in production (the unset case is documented; the
  short case is not). FIX: a warn-once production console.warn.
- **N-63h (Nano)** seed trio: the demo user's `role: "user"` outside the
  schema comment's rep|admin vocabulary (inert — no RBAC; the seed line
  already documents the reference-mirror reason); the opportunity wipe at
  :283 outside the idempotency block; `iso()` a misleading alias. Record-only.
- **N-63i (Nano)** login/route.ts:23 email cap 500 (the asString default)
  vs the auth family's uniform `max: 160` (signup :57-58, resend :29, verify
  :39). FIX: align to 160 (truncation parity — a >160-char email stored
  truncated by signup currently CANNOT log in).
- **N-63j (Info)** duplicated date-suffix builders (csv.ts:56-63 vs
  pdf-export.ts:33-36, the N-48j family); the events "after start time"
  message vs the `<`-only check; login's hand-built 429 envelope. Record-only.

## The operator decisions (session 63)

1. **The CSV formula-injection posture (b) STANDS** (21st re-affirmation —
   the guard intact in both export families, the `-` exclusion documented,
   the reference bundle byte-stable for the 34th consecutive session).
2. **The source-vocabulary documented parity STANDS AND EXTENDS to the N-63
   family**: the two foreign doc files RETIRE (the s54 fully-dead class,
   DOC-FILE variant — zero functional references across 62+ sessions, the
   operator's prompts cite the GitHub repo; git history preserves them); the
   construction-dead arms RETIRE (the `?? stage` pair + the `!view` guard
   fragment — the N-62c class over internal constants); the CALENDAR_CELL
   snapshot RE-DERIVES from the live page (the drifted pin made honest, the
   s54 re-anchor precedent); the allLayoutClasses sweep EXTENDS to every
   exported class-string group (the coverage claim made true); the
   page-layout header claim CORRECTED + the 8 zero-page-consumer records
   ANNOTATED with their consumption status (the N-46e/N-62d wire-or-remove
   posture family — the records keep their documentary snapshot value,
   guard-pinned); the defensive-DB-read arms ANNOTATED as deliberate; the
   auth DEV_SECRET production warn LANDS; the login email cap aligns to the
   160 family; the comment/record-accuracy carriers (N-63e, G-1..G-4) land.

## The plan (every anchor validated at file:line; blast radius pre-checked)

### S63-P1 — the foreign-docs retirement (63-b #1)

- RED-first: the dead-code-hygiene session-63 describe gains the absence it
  (both files absent from the working tree AND from `git ls-files`).
- GREEN: `git rm scandihaven_SKILL.md project-management_SKILL.md` + a
  record note (the recovery path: `git show b48fc3d:scandihaven_SKILL.md`).
- Blast radius: zero functional references (the prompt templates cite the
  GitHub URL; the PAD's "sibling scandihaven" ADR prose describes the
  architecture provenance, not the local files — verified).

### S63-P2 — the dead-arm retirement + the defensive annotations (N-63b)

- RED-first: the exact-form pins — dashboard/route.ts `label:
  PIPELINE_LABELS[stage],` (no `??`), (app)/page.tsx
  `{PIPELINE_LABELS[s]}`, settings/route.ts the `includes(view)` form with
  zero `!view`; PLUS the defensive-family annotations pinned by marker (the
  reports triple + `o.stage || "unknown"` + the dashboard `: 0` arm carry
  the defensive-DB-read record comments).
- GREEN: the three retires (each with the record comment citing the
  construction guarantee) + the three annotation sites.
- Blast radius: zero test pins on `?? stage` / `!view` (verified); the
  constants.test.ts PIPELINE_LABELS pins target the record, not the routes.

### S63-P3 — the page-layout honesty package (N-63a + N-63c)

- RED-first: (a) the sweep-coverage it — representative values from the
  newly-added groups asserted present in `allLayoutClasses()`; (b) the three
  CALENDAR_CELL its RE-ANCHORED to the re-derived record (they go RED when
  the record changes — the re-derive is proven non-vacuous by the existing
  pins).
- GREEN: (a) CALENDAR_CELL re-derived from the live calendar-page cell
  (base gains `flex flex-col items-stretch` + the focus-ring pair documented
  as the clickable-superset extra; outOfMonth drops the duplicated
  `transition-all`); the three test its re-anchored with the s63 note.
  (b) The sweep extended to every exported CLASS-STRING group (enumerated
  mechanically at execution; the vocabulary/label groups + the numeric
  CHART_GEOMETRY stay out, documented in the sweep's comment). (c) The
  module header corrected (the "Pages consume these records" claim scoped
  to the consumed families; the 8-record family named as test-pinned
  reference snapshots). (d) Each of the 8 records annotated with its
  consumption status.
- Blast radius: the sweep extension only ADDS strings to the de-bracket
  guard's input; the existing its unaffected (verified: the guard's
  assertions are negative contains).

### S63-P4 — the micro-hygiene + record-accuracy carriers (N-63e/g/i, G-1..G-4)

- RED-first: the auth warn source-pin (auth.test.ts) + the login cap pin
  (api-robustness.test.ts — `max: 160` matching the family).
- GREEN: the auth.ts warn-once production branch; login/route.ts:23
  `{ max: 160 }`; the rate-limit.ts:2 comment at the real numbers; the
  server-TZ annotation at the period-window seam; crm.spec.ts:2147 comment
  updated (the unconditional save); the contacts-page + entity-export.test
  N-62e precision notes (completing the set); the session_117.md G-1
  correction bracket; the PAD:357-358 G-2 refresh (1210 + 112).
- Blast radius: the login cap change is behaviorally invisible for ≤160-char
  emails (every real case); the warn fires only in production.

### S63-P5 — the docs realignment + the ship

- SKILL v1.60.0: frontmatter + project_state + the new §16bc (the
  session-63 layer) — applied atomically via an assert-first
  scripts/skill_edits_s63.py at the sandbox root; wc -l verified.
- README: badge 1327 (1215 + 112), the Tested row, the session-63 paragraph.
- AGENTS: the commands table + the session-63 block. CLAUDE: 1215 ×3.
- PAD: the s63 inventory row + the Total (1215 + 112) + the :357-358 tree
  refresh rides in S63-P4.
- session_119.md (this session's record — the odd-number convention; the
  operator's s62 transcript owns session_118.md at fe17bd7) + this plan's
  execution record +
  both worklogs.
- Screenshots: 02/11/12 re-captured + the NEW fix-surface captures (the
  dashboard pipeline-by-stage card + the calendar day cells — the S63-P2/P3
  surfaces) at 1440×900.
- LIVE battery: the fix surfaces render (the dashboard KPI + pipeline cards;
  the calendar cells with the re-derived classes; the drawer both directions
  at TRUE 390px; zero 390px overflow ×10 routes; NO Tailwind v4 bug —
  --blur-sm + the pinned shadow probe; the closing db:census MATCH).
- Ship: the commit on main + the SSH-wrapper v3 push +
  `git@github.com:nordeim/neo-crm.git` + the remote verification + the
  operator key shredded.

## The arithmetic

- RED: 8 failures expected (the foreign-docs it + the dead-arms it + the
  sweep it + the auth-warn it + the login-cap it + the 3 re-anchored
  CALENDAR_CELL its); full suite through RED: **8 failed / 1207 passed
  (1215 total)**.
- GREEN: dch 45 (42 + 3), auth +1, api-robustness +1, page-layout net 0 →
  **1215 unit checks (75 suites)**; e2e unchanged at 112; badge 1327.
- Non-vacuousness: pre-fix d0129de worktree (node_modules hard-linked via
  cp -al) + the four modified test files as the ONLY changes → the same
  8-failure RED set isolated; the guards green-through-RED.

---

## Execution record (2026-10-05, session 63 — SHIPPED)

Executed as planned, with the discoveries noted:

- **Intake**: the repo-restructure discovery (the move from the sandbox
  root to /home/z/neo-crm orphaned the s62 dev db — recreated; the
  stale platform DATABASE_URL override neutralized via env -u for all
  repo operations); baseline gate GREEN 1210/1210; drift sweep #59
  byte-identical (34th consecutive); reference census #59: the defect
  stands at TRUE 390px.
- **RED exact**: 7 failed / 1209 passed (1216) — the foreign-docs it +
  the dead-arms it + the auth-warn it + the login-cap it + the sweep it
  + the two CALENDAR_CELL re-anchors. (The plan estimated 8: the base
  re-derive became its own NEW it while the current/today re-anchors
  stayed green-through-RED — the arithmetic note.)
- **GREEN**: S63-P1 through S63-P4 all landed as scoped.
- **Mid-flight pin repairs (2, both chronic classes)**: the three O-map
  its re-anchored to the `export const PIPELINE_LEGEND` definition form
  (the sweep extension made the bare token ambiguous — the s62
  self-shift lesson; dashboard-contracts ×2 + charts-internals ×1) +
  the sweep it's INPUT_BASE representative switched to `.size` (the
  record is an object).
- **Found at validation**: the PAD s63 inventory row first drafted at
  "2 files | 7 checks" — corrected to 4 files | 6 new + 4 re-anchored
  (the O-map re-anchors are touched files too, per the counting
  convention).
- **Non-vacuousness**: pre-fix d0129de worktree → 7 failed | 272
  passed (279) — exactly the RED set; the O-map re-anchors
  green-through-RED; clean teardown; sanity 20/20.
- **Full gate**: lint 0/0 · tsc 0 · 1216/1216 (75 suites, +6) · build
  clean (og-image.png only) · 112/112 e2e on a fresh CI=1 boot (2.5m).
- **LIVE battery**: the pipeline labels identical through the
  retired-arm path (API + page); the calendar cell matching the
  re-derived record byte-for-byte; the drawer both directions at TRUE
  390px; zero 390px overflow ×10; NO Tailwind v4 bug (--blur-sm 4px +
  the pinned shadow on the live John Doe input); the closing census
  MATCH at <repo>/db/custom.db.
- **Screenshots**: 02/11/12 re-captured + 72-calendar-cell-rederive
  NEW — all VLM-verified 4/4.
- **Docs**: SKILL v1.60.0 (assert-first script, 5988 → 6053 by wc -l;
  the doubled-word scan clean), README/AGENTS/CLAUDE/PAD at 1216 + 112
  (badge 1328) + the G-1..G-4 precision corrections; session_119.md;
  this record; both worklogs.
- **Ship**: commit on main + the SSH-wrapper v3 push + the remote
  verification + the operator key shredded.
