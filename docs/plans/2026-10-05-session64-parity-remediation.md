# Session-64 Parity Remediation Plan (2026-10-05)

Session 64 on `main` @ `f7760f7` (the session-63 ship f11c195 + the
operator's session-log update). Workspace NOTE: the sandbox was RESET —
fresh clone at `/home/z/my-project/neo-crm` (the OLD layout's path, but a
fresh clone, not the restructured `/home/z/neo-crm` of s63). The `.env`
contract recreated (`DATABASE_URL="file:../db/custom.db"` + fresh
AUTH_SECRET); `<repo>/db/custom.db` recreated (`db:push` + `db:seed`) and
the census reads `database: file:/home/z/my-project/neo-crm/db/custom.db`
+ 15/24/10/23/12 + 4 users + `pristine: MATCH` — db/ at the repo root, as
the operator's brief requires. The s63 intake hazard STANDS: the
orchestration environment exports a STALE
`DATABASE_URL=file:/home/z/my-project/db/custom.db` (an absolute override
the db-path seam honors BY DESIGN) — note it now points at a NON-EXISTENT
mirror (the sandbox reset removed it), which makes every un-guarded bun
process fail loudly rather than silently; all session-64 repo operations
run under `env -u DATABASE_URL` so the repo `.env` relative contract wins
(the e2e suite is immune — it sets its own `E2E_DATABASE_URL`). Intake
hygiene: NO zombie dev servers; ports 3000/3100 clear. **Baseline gate on
HEAD: lint 0/0 (enforced) · tsc 0 · 1216/1216 unit (75 suites)** — the
documented state exact. The `skills/` exclusion verified in all three
configs (vitest include allowlist, eslint ignores, tsconfig exclude).

## The standing layers (60th session, NO DRIFT)

Drift sweep #60: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 35th
consecutive stable session**. Reference census #60 (agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(Total Leads 0 + "+5.3%", `$0.0k`); the mobile-nav defect STANDS at a
TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW 390, NO
hamburger); desktop nav normal (256px, 8 links); a reference 390px
screenshot captured (outside the repo).

## The audits (three parallel agents + manual validation of every claim)

### A. The session-63 re-audit (64-a) — 13/15 FULLY GENUINE, 2 IMPRECISE

All headline s63 checklist items verified at file:line: the foreign-docs
retirement (both files absent from tree AND `git ls-files`; the absence
pin at dead-code-hygiene.test.ts:723-739), the dead-arm retirement (the
three exact-form sites + their construction-guarantee comments + the
dch exact-form pins :757-764), the defensive-DB-read annotations (the
reports triple :215-226/:401-403 + `o.stage` :200-205 + the dashboard
`: 0` arm :159-164, marker-pinned dch:767-768), the sweep extension
(41 → 71 named entries + the bare-string branch :1108-1114), the module
header correction + the 8 record annotations, the DEV_SECRET warn-once
(auth.ts:16-31), the login 160 cap (auth/login/route.ts:26), the
rate-limit comment (:2-5 at the real numbers), the server-TZ annotation
(format.ts:151-157), G-1/G-3/G-4, the O-map re-anchors, the docs
arithmetic (badge 1328, SKILL v1.60.0, wc -l 6053 exact), 1216/1216
re-run — and the **non-vacuousness REPLAYED** in a pre-fix d0129de
worktree: **7 failed | 272 passed (279)** — the s63 arithmetic reproduced
to the digit. TWO imprecise sub-claims: **P-2** the record's "the 3 test
its re-anchored" — only the out-of-month it carries the s63 note (the
current/today its are byte-identical to pre-s63; the execution record's
"stayed green-through-RED" phrasing implies re-anchors that never
happened); **P-1** the G-2 tree-block refresh (PAD:357) landed at "1210
checks" — the plan's own pre-session number (the plan S63-P4 literally
says "1210 + 112"), stale by the session's +6 its: the exact class G-2
was meant to close. Plus P-3 (the plan's S63-P4 pin placement — the
auth-warn + login-cap its live in the dch describe, not auth.test.ts /
api-robustness.test.ts as spec'd; the plan body retains the superseded
1215/1327 arithmetic silently) and I-1..I-6 INFO (the absence pin's
existsSync-only form; KPI_CHIP_BG unnamed in the sweep's exclusion list;
the "keeps only their class-string members" overstatement — every STRING
member rides, e.g. KPI_SPARK.line's `"monotone, strokeWidth: 2, dot:
false"`; session_119's "CLAUDE ×3" — actually 4 occurrences; the repo
worklog's "S62-P2" typo in the Session-63 section — should be S63-P2;
the login path abbreviation).

### B. The graduation audit (64-b) — ZERO graduations, 13/13 (21st consecutive)

All 13 standing items re-confirmed at file:line (line-tolerance drift
only). The INFO family unchanged (F-47c, N-48c, N-48f, N-48j, N-51c).
Both operator anchors standing. The 8 mechanical censuses ALL CLEAN
(localStorage exactly 2 live keys — crm_saved_reports +
neo-crm.leads.views; public/ og-image.png only; the package surface with
the 63-b #2 precision form — prisma/react-dom CLI/framework-consumed;
API 27 files / 39 verbs all consumed; env parity 3-var exact; doc
anchors 10/10 at 1216 + 112; zero commented-out code; exactly 2
annotated e2e sleeps).

### C. The fresh-eyes rotation (64-c: the TEST-CONTRACT + CLIENT-STATE
seam — tests/ 75 files ~14.3k lines + src/stores/crm-store.ts +
src/types/, never a dedicated rotation target; e2e specs surveyed)

The **N-64 family** (every anchor manually validated at file:line):
- **N-64b (Medium)** tests/leads-charts.test.ts:78-84 — the
  status-cumulative funnel pin is VACUOUS: `expect(counts).toMatch(
  /cumulative|LEADS_FUNNEL/)` over the `const funnel` region always
  matches (`LEADS_FUNNEL.map` sits inside it at leads-page.tsx:297), so
  the disjunct can never fail — while the actual cumulative forms
  `n(["contacted", "qualified", "won"])` / `n(["qualified", "won"])`
  (leads-page.tsx:301-304) are pinned nowhere else repo-wide. A
  bundle-parity contract with zero effective coverage — the s24/s63
  "guard over a stale copy" lesson at the assertion seam. Plus a dead
  `region` local at :80.
- **N-64j (Low — promoted to FIX this session)** src/stores/crm-store.ts
  — the logout seam: `logout()` clears every slice, but hydrate()'s nine
  parallel fetches (and the page effects' refetches) carry no generation
  token (only fetchEvents does, the s45 last-call-wins token :54/:186-
  189) — a logout landing mid-fetch lets the stale resolutions
  re-populate the cleared slices (the s35 leakage class via a narrow
  race window; self-healing on the next hydrate, but a cross-user flash
  on a fast logout → login). The s45 token family's THIRD seam: the
  topbar AbortController (s45-P3), the events token (s45-P4), and now
  the logout boundary.
- **N-64a (Low)** 13 stale line-anchor citations across 10 test files —
  the chronic self-shift family at its largest documented scale (each
  verified against the live sources): dch:275 ":385"→:388; dch:359
  ":384"→:388; insights-badge-case:13-14 (the activities idiom moved +
  changed form → :192, the reports site → :224, the META → :388);
  leads-inline-feedback:7 ":534/:546/:568"→:580/:594/:618;
  constants.test:81-82 "entity-dialogs:853/:920, page.tsx:298"→:725 +
  :305; mutation-feedback:9 ":167/:456/:742"→:168/:361/:1015 (the
  entity-dialogs toast convention sites); mutation-feedback:15 ":262"
  →:279; mutation-feedback:129 ":132"→(the leads-page storage-guard
  comment, re-derived at execution); settings-rollback:8 ":65/:68"
  →:98/:112 (the stage/tier membership guards); settings-debounce:8-9
  ":94/:103"→:98/:112; reports-filter-validation:34 ":373-375"→:386-388
  (the nPeriod/nStage/nStatus Load sites); create-dialog-single-mode:23
  ":206, :352/:424/:484"→:213, :370/:442/:507; dashboard-export:11
  ":284-291"→:312-331 (marginal — a comment citing a comment).
- **N-64c (Low)** tests/dashboard-contracts.test.ts:74-78 — a dead
  `const region` local (:76, never read) + the title's "text-gray-600"
  half unasserted (only `/toFixed\(1\)\}k/` is pinned; gray-600 lives in
  the PIPELINE_LEGEND pin at charts-internals:193-200).
- **N-64d (Nano)** tests/dashboard-contracts.test.ts:121 — the title
  "E<4 amber / E>=3 blue split" is self-contradictory (3 satisfies
  both arms); the source is `i < 4 ? "#fbbf24" : "#3b82f6"`
  (page.tsx:243) → "E<4 amber / E>=4 blue".
- **N-64e (Nano)** tests/charts-contracts.test.ts:14-17 — the header
  still says "our REPORTS_PIPELINE_SLUGS list" (retired at s54/N-54b;
  the absence is pinned at dch:167).
- **N-64f (Nano)** tests/login-reset.test.ts:149-152 +
  tests/login-views.test.ts:130-133 — `const views: LoginView[] = […];
  expect(views).toHaveLength(N)` is tautological at runtime (a local
  literal's own length); the residual value is the TYPE annotation
  through the tsc gate. ANNOTATE (the honest form).
- **N-64g (Nano)** the shared stripComments helper's SECOND replace
  (`.replace(/\{\/\*[\s\S]*?\*\/\}/g, "")`) is UNREACHABLE — the first
  replace already removes every `/*…*/` span, so the `{\/*…*\/}` pattern
  can never match afterward (an `/*` surviving replace #1 would need no
  following `*/` anywhere — but the second pattern requires one). Dead
  cargo duplicated across **54 test files** (rg -lF exact) — the s54
  dead-cargo class, HELPER variant. RETIRE in one sweep (provably
  zero-behavior: the line never fires).
- **N-64i (Nano)** tests/saved-reports.test.ts:98-109 — vestigial
  scaffolding: the one-element `candidates` array + the dead `.ts`
  fallback read (a `.ts` variant of a live `.tsx` component can never
  exist). Simplify to the direct existence check.
- **N-64h (Info)** tests/saved-reports.test.ts:62-72 — the comments say
  "all five keys"/"all six keys" while the regexes sample 2/5 + 2/6
  (deliberate ambiguity sampling; the type carries all 11). ANNOTATE.
- **N-64k (Info)** duplicate test titles across files (no masking;
  deliberate re-holds). Record-only.

## The operator decisions (session 64)

1. **The CSV formula-injection posture (b) STANDS** (22nd re-affirmation
   — the guard intact in both export families [csv.ts:31-33
   guardFormulaPrefix + entity-export.ts:43 qq()], the `-` exclusion
   documented at csv.ts:19-22 + pinned at csv-formula-guard.test.ts:71-80,
   the reference bundle byte-stable for the 35th consecutive session).
2. **The source-vocabulary documented parity STANDS AND EXTENDS to the
   N-64 family**: the vacuous funnel pin RE-ANCHORS to the exact
   cumulative forms (N-64b — a pin that cannot fail guards nothing); the
   logout write-guard LANDS (N-64j promoted from Info-record to fix —
   the s45 token family's completion, the rotation's only src-side
   finding, following the established token pattern + the existing
   store-fetch-guards pin file); the dead cargo RETIRES (N-64c dead
   local + N-64i scaffolding + N-64g the unreachable second replace
   across all 54 helper copies — the HELPER variant of the s54 class);
   the stale line-anchor family REFRESHES in one pass with token-form
   citations preferred (N-64a — the drift is generational); the
   precision carriers LAND (N-64d/N-64e titles + comments, N-64f/N-64h
   annotations, the 64-a I-2/I-3 sweep-comment precision); the
   record-accuracy corrections land (P-1/P-2/P-3 + I-4/I-5); N-64k
   record-only.

## The plan (every anchor validated at file:line; blast radius pre-checked)

### S64-P1 — the logout write-guard (N-64j, the src-side fix)

- RED-first: the session-64 describe in tests/store-fetch-guards.test.ts
  (the s45 pin file — the natural home): 4 RED its (the module-level
  `sessionWriteToken` exists; logout bumps BOTH tokens before the
  clearing set; every hydrate-fired fetch captures the session token and
  guards its set — the 8 non-events fetches; hydrate dies entirely on a
  mid-auth logout) + 1 guard it (fetchEvents keeps its s45 form
  byte-identical — the no-collateral pin).
- GREEN: src/stores/crm-store.ts — `let sessionWriteToken = 0` beside
  the s45 token (with the N-64j record comment); hydrate captures at
  entry + the `if (session !== sessionWriteToken) return;` early-return
  before any set; the 8 fetches (users/accounts/contacts/leads/
  opportunities/activities/settings/dashboard) capture + guard their
  sets; logout bumps `eventsFetchToken += 1; sessionWriteToken += 1;`
  immediately before the clearing set (an in-flight fetchEvents is
  invalidated through its own token; the s45 body stays untouched).
- Blast radius: the s45 pins unchanged (fetchEvents body byte-identical
  — verified in the guard it); the page effects' refetches capture the
  CURRENT token at entry (post-bump) so their writes stay legal; the
  `hydrated` flag's page-effect gating undisturbed; the e2e login/
  logout/hydrate flows cover the behavior.

### S64-P2 — the funnel-pin honesty (N-64b, Medium)

- GREEN (a re-anchor, green-through-RED — the chronic self-shift
  precedent): tests/leads-charts.test.ts:78-84 re-pinned to the EXACT
  cumulative forms — `f.id === "new-leads"`, `n(["new"])`,
  `n(["contacted", "qualified", "won"])`, `n(["qualified", "won"])`,
  `n(["won"]),` — with the N-64b record note; the dead `region` local
  and the vacuous `toMatch(/LEADS_FUNNEL/)` dropped.
- Non-vacuousness: a scratch perturbation of the leads-page cumulative
  forms (in the replay worktree) must FAIL the new pin.

### S64-P3 — the dead-cargo retirement (N-64c + N-64g + N-64i)

- RED-first: the session-64 describe in tests/dead-code-hygiene.test.ts
  gains the absence it — no `tests/*.test.ts` file contains the
  unreachable second-replace literal (the needle written ESCAPED in the
  pin so the pin's own bytes never self-match; scanned across the tests
  directory).
- GREEN: the second-replace line removed from all 54 helpers (one
  identical line each; the count 54 → 0 verified by rg); the dead
  `region` local dropped from dashboard-contracts.test.ts:76 (the s60
  formAvatar precedent — drop + record comment); saved-reports.test.ts
  :98-109 simplified to the direct existence check.
- Blast radius: provably zero behavior (the line never fires); the full
  unit gate re-proves it mechanically.

### S64-P4 — the stale-anchor refresh + the precision carriers
(N-64a + N-64d/e/f/h + the 64-a I-2/I-3)

- The 13 anchor refreshes across 10 files (each re-verified with rg at
  execution; token-form citations preferred over bare line numbers —
  e.g. "the timeAgo consumer in the activities timeline (:388)").
- dashboard-contracts:121 title → "E<4 amber / E>=4 blue";
  dashboard-contracts:74-78 title narrowed to the asserted half (the
  $X.Xk format) + the dead local dropped (S64-P3).
- charts-contracts:14-17 comment → the live slug vocabulary (the
  REPORTS_PIPELINE_SLUGS retirement note).
- login-reset + login-views tautology its: the ANNOTATE notes (the
  tsc-gate-only value, honestly stated).
- saved-reports:62-72: the sampling note ("2 of 5 / 2 of 6 — the
  ambiguity-tolerant regexes; the type carries all 11").
- page-layout.ts: the sweep's exclusion list gains KPI_CHIP_BG by name
  (I-2) + the "keeps only their class-string members" wording corrected
  to "keeps every STRING member" (I-3 — the KPI_SPARK.line ride-along
  documented).
- Blast radius: comments + titles only — zero assertion changes beyond
  S64-P2/P3.

### S64-P5 — the record-accuracy corrections (P-1/P-2/P-3 + I-4/I-5)

- PAD:357: "1210 checks" → "1222 checks" (the G-2 closure completed at
  the session's own final count — landing the s63 miss + the s64 adds in
  one edit).
- session_119.md: the P-2 correction bracket at the "3 test its
  re-anchored" claim (only the out-of-month it; the current/today its
  stayed byte-identical — the G-1 bracket precedent) + the I-4 bracket
  ("CLAUDE ×3" → 4 occurrences).
- The s63 plan's execution record: the P-3 note (the auth-warn +
  login-cap its live in the dch describe, not the spec'd files; the
  superseded 1215/1327 arithmetic noted).
- The repo worklog Session-63 section: the "S62-P2" typo → "S63-P2".

### S64-P6 — the docs realignment + the ship

- SKILL v1.61.0: frontmatter + project_state + the new §16bd (the
  session-64 layer) — applied atomically via an assert-first
  scripts/skill_edits_s64.py at the sandbox root; wc -l verified.
- README: the badge + the Tested row + the session-64 paragraph.
  AGENTS: the commands table + the session-64 block. CLAUDE: the counts.
  PAD: the s64 inventory row + the Total + the :357 refresh (S64-P5).
- session_121.md (this session's record — the odd-number convention; the
  operator's s63 transcript owns session_120.md) + this plan's execution
  record + both worklogs.
- Screenshots: 02/11/12 re-captured + **73-leads-funnel-cumulative NEW**
  (1440×900, the N-64b fix surface — the conversion funnel card) —
  VLM-verified.
- LIVE battery: the fix surfaces render (the leads funnel with the
  cumulative counts LIVE: 24 seeded leads → New/Contacted/Qualified/Won
  chips; the logout → login round-trip with the store cleared — the
  drawer both directions at TRUE 390px; zero 390px overflow ×10 routes;
  NO Tailwind v4 bug — the --blur-sm + pinned-shadow probes; the closing
  db:census MATCH).
- Ship: the commit on main + the SSH-wrapper v3 push +
  `git@github.com:nordeim/neo-crm.git` + the remote verification + the
  operator key shredded.

## The arithmetic

- RED: 5 failures expected (the 4 store its + the stripComments absence
  it); full suite through RED: **5 failed / 1216 passed (1221 total)**.
- GREEN: store-fetch-guards +5 its, dch +1 it → **1222 unit checks (75
  suites)**; e2e unchanged at 112; badge 1334.
- Non-vacuousness: pre-fix f7760f7 worktree (node_modules hard-linked
  via cp -al) + the two modified test files as the ONLY changes → the
  same 5-failure RED set isolated; the funnel re-anchor green-through-RED
  (a repair) but proven by a scratch perturbation of the source forms;
  the s45 guard it green-through-RED.

## Execution record (2026-10-05, session 64 — SHIPPED)

Executed as planned, with the discoveries noted:

- **Intake**: the sandbox RESET (fresh clone at the OLD layout's path
  — the stale platform DATABASE_URL override now points at a
  non-existent mirror, failing loudly instead of silently); baseline
  gate GREEN 1216/1216; drift sweep #60 byte-identical (35th
  consecutive); reference census #60: the defect stands at TRUE 390px.
- **RED exact**: 5 failed | 1217 passed (1222) — the 4 store its +
  the stripComments absence it; the s45 no-collateral guard
  green-through-RED as designed. (The plan's RED line under-counted
  by one — "5 failed / 1216 passed (1221)": the GREEN arithmetic at
  1222 was right; the RED line's total mis-added.)
- **GREEN**: S64-P1 through S64-P5 all landed as scoped. The
  stripComments sweep retired the dead line from all 54 helpers (the
  persisted scripts/strip_second_replace_s64.py; one identical line
  each; post-verified zero residue) with zero behavioral impact
  (1222/1222 at the sweep).
- **Mid-flight pin repairs (2, both chronic classes)**: the s45
  no-collateral guard's window narrowed 500 → 400 chars (the guarded
  neighborhood grew — fetchSettings's session capture follows
  fetchEvents; the wide window tripped the not-toMatch on the NEXT
  function's guard) + the dch absence it's documentation comment
  REWRITTEN pre-run (the first draft contained the exact needle bytes
  — the pin would have failed on its own docs post-sweep; caught at
  edit time).
- **Non-vacuousness**: pre-fix f7760f7 worktree → 5 failed | 49
  passed (54) — exactly the RED set; clean teardown; sanity census
  MATCH. The funnel re-anchor additionally PERTURBATION-PROVEN: a
  mutated cumulative form (contacted+qualified, dropping won) FAILED
  the new pin (1 failed | 6 passed) where the old pin would have
  stayed green — the N-64b defect demonstrated.
- **Full gate**: lint 0/0 · tsc 0 · 1222/1222 (75 suites, +6) ·
  build clean · 112/112 e2e on a fresh CI=1 boot (2.5m).
- **LIVE battery**: the funnel cumulative contract verified against
  the API (New=4, Contacted=12 [2+3+7], Qualified=10 [3+7], Won=7);
  the logout → login round-trip through the write-guard; the drawer
  both directions at TRUE 390px; zero 390px overflow ×10; NO
  Tailwind v4 bug (--blur-sm 4px + the exact pinned shadow); the
  closing census MATCH at <repo>/db/custom.db.
- **Screenshots**: 02/11/12 re-captured + 73-leads-funnel-cumulative
  NEW — all VLM-verified 4/4 (the first 02 capture caught the browser
  still on /Leads after the relative-path screenshot failure;
  re-captured on the Dashboard + re-verified).
- **Docs**: SKILL v1.61.0 (assert-first script, 6053 → 6116 by wc -l),
  README/AGENTS/CLAUDE/PAD at 1222 + 112 (badge 1334) + the
  P-1/P-2/P-3/I-4/I-5 record corrections; session_121.md; this
  record; both worklogs.
- **Ship**: commit on main + the SSH-wrapper v3 push + the remote
  verification + the operator key shredded.
