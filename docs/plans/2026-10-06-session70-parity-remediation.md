# Session-70 Parity Remediation Plan (2026-10-06)

Session 70 on `main` @ `047f3be` (the s69 ship `94aab54` + the
session-log update — docs/session_131.md the s69 record,
docs/session_132.md the operator's s69 transcript). Workspace: the
sandbox SURVIVED s69 (the pull fast-forwarded 94aab54 → 047f3be,
docs/session_132.md only, zero code drift; tree clean). The census
after the pull reads `database: file:/home/z/neo-crm/db/custom.db` +
15/24/10/23/12 + 4 users + `pristine: MATCH` — db/ at the repo root,
as the operator's brief requires (.env already correct:
DATABASE_URL `file:../db/custom.db` + a generated AUTH_SECRET; the
documented intake hazard STANDS — the stale platform DATABASE_URL
override points at a NON-EXISTENT mirror, all session-70 repo
operations run under `env -u DATABASE_URL`, the e2e suite immune via
its own pinned E2E_DATABASE_URL). Intake hygiene: NO zombie servers;
ports 3000/3100 clear. **Baseline gate on HEAD: lint 0/0 (enforced) ·
tsc 0 · 1279/1279 unit (79 suites)** — the documented state exact.
The `skills/` exclusion verified in all three configs (vitest include
allowlist `src/**` + `tests/**` only, eslint ignores, tsconfig
exclude); the skills/ folder excluded from code checking, testing and
compilation per the operator's brief.

## The standing layers (66th session, NO DRIFT)

Drift sweep #66: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 41st
consecutive stable session**. Reference census #66 (agent-browser,
live login at 1280 then a TRUE 390px viewport): the demo data still
zero (the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the mobile-nav defect
STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible,
scrollW 390, NO hamburger — the visible-button census lists only the
user-menu/Add/Export cluster); desktop nav normal (256px, 8 links, all
visible). The reference's calendar KPI values compute rgb(17,24,39) =
gray-900 at 24px/700/32px (the F-70a1 computed-style evidence — the
bundle's literal `text-2xl font-bold text-gray-900`).

## The audits (three parallel agents + manual validation of every claim)

### A. The session-69 re-audit (70-a) — 12/12 GENUINE

Every s69 checklist item verified at file:line: the leads-variant bare
family-order form exact (page-parts.tsx:338); the leads/[id] gate hoist
exact (:21 above the :29 try, sibling-level indent byte-identical);
MONTHS_SHORT exported + the panel riding it (format.ts:60,
contact-detail-panel.tsx:44/:51, zero re-declarations repo-wide); the
format comment re-scope exact; the playwright N-69a annotation exact
(:67-73 + the N-69h comment :25-30); the redundant assertion retired
(zero `not.toHaveCount` in tests/); the e2e-port single source exact
(both consumers import; zero hardcoded 3100 in code); the auth comment
carriers exact (spends 1 + the four budgets); the two new e2e checks
exact (the pre-gate 400 probe + the ten-route sweep; mobile-nav total
= 9); the counts corroborated (79 suites, 116 e2e static, +4-its delta
exact in the 94aab54 diff); the docs carriers exact (SKILL v1.66.0 /
6399 / §16bi, README badge 1395, AGENTS 9-check mobile-nav, CLAUDE
zero stale 112, PAD Total row); the commit honest (24 files, +969/−43,
zero strays). NEW: **F-70a1 (Nano)** `page-layout.ts:342` —
`STAT_CARD.value = "text-2xl font-bold text-foreground"` — the
TrendStatCard (calendar KPI) value family, the 5th stat-card family the
s68/s69 sweeps never enumerated, still carrying the semantic-foreground
class; consumed ×4 (calendar-page.tsx:237/245/253/261) AND pinned
AS-CORRECT at `tests/page-layout.test.ts:393` — the F-69a1 class
reborn with an affirmative stale pin. **F-70a2 (Nano, record
precision)** session_131.md:195 claims "CLAUDE (1279 ×5 + 116 ×2)";
the actual is ×4 (lines 38/114/125/371) + ×3 (38/115/299). Straggler
hunt otherwise clean (the other 11 routes' gates first-post-guard; no
month-array dupes; no redundant assertions; no hardcoded 3100).

### B. The graduation audit (70-b) — ZERO graduations, 13/13 (27th consecutive)

All 13 standing items re-verified at file:line (F-47c, N-48c, N-48f,
N-48j, N-51c, the CSV posture (b), the source-vocabulary parity, the
stock-mirror, the N-58c boundary, the defensive annotations, the
foreign-docs retirement, the 19/19 deps, the standing fixes). The 8
mechanical censuses ALL CLEAN (localStorage exactly 2 live keys —
`crm_saved_reports` + `neo-crm.leads.views`; public/ og-image.png only;
API 27 routes/39 handlers all consumed; env parity 3-var exact; doc
anchors at 1279+116 all four carriers exact, badge 1395; zero
commented-out code; exactly 2 annotated e2e sleeps). Extra probes all
negative (TODO/FIXME = 0; .skip/.only = 0; console.log = 0 with the 4
documented exceptions; new PrismaClient exactly 2; zero strays).
Doc-hygiene infos: N-70b1 (anchor drift 1-4 lines, all attributable to
the documented s69 edits; this ledger quotes the 70-b anchors), N-70b2
(the AGENTS.md:185 singular `neo-crm.leads.view` abbreviation — the
documented pre-s29 typo class, unchanged).

### C. The fresh-eyes rotation (70-c: the Zustand store + charts family seam —
crm-store.ts 378 + charts.tsx 361 + app-shell bootstrap + 13 consumers
+ the chart call-sites; never a dedicated rotation target; every claim
manually re-validated at file:line by the orchestrator, the
parity-bearing claims BUNDLE-DECODED)

**Zero Medium/High findings — the seam SOLID.** The **N-70 family** (as
validated):
- **N-70c4 (Low)** the pie fill arrays pinned NOWHERE —
  reports-page.tsx:596/:744/:856 carry the reference's literal palettes
  (`["#3b82f6","#06b6d4","#8b5cf6","#ec4899"]` + the 5-color
  `[…,"#f97316"]` ×2, bundle-verified byte-identical) but `#ec4899`
  appears in ZERO test assertions — a fill drift would pass all 1279
  units (contrast: HEALTH_PIE_FILLS + LEADS_FUNNEL fills ARE pinned).
- **N-70c5 (Nano)** activities-page.tsx:548-557 — the by-type chart is
  a hand-rolled BarChart duplicate of the SingleBarChart family AND an
  invented `name="Logged"` (the bundle's Bar carries NO name — our
  tooltip reads "Logged : 3" where the reference reads "count : 3");
  XAxis dataKey "label" vs the reference's "type" (equivalent — our
  rows carry both).
- **N-70c6 (Nano)** charts.tsx:354 — the ConversionFunnel carries
  `isAnimationActive={false}`; the reference's funnel (bundle: Kd with
  LabelList + per-datum Cells) passes NO animation prop — it ANIMATES.
  The same prop rides the Sparkline Area/Line arms (page-parts.tsx:548/
  :559) — and the reference's KPI sparkline (bundle: Fc Area
  fillOpacity .3) passes none either; ALL 38 bundle occurrences of the
  prop are recharts LIBRARY INTERNALS, zero application call-sites.
- **N-70c2 (Nano, scoped by the orchestrator)** the mutation-path sets
  sit outside the s64 write-guard family — `updateSettings`'s
  `if (res.ok) set({ settings: res.data })` (:350) is a POST-AWAIT
  write a logout can interleave with (the s35 leakage class via a
  narrow window). The audit's updateLead half (:303) resolves to
  NO-OP: the optimistic set is SYNCHRONOUS with the onChange task —
  no logout continuation can land between the keystroke and the set
  (documented instead of guarded; the post-await refetches already
  ride the guarded fetchers).
- **N-70c10 (Nano)** updateLead's comment "on failure it rolls back to
  server truth" overstates (a NETWORK-level failure also fails the
  refetch — the patch stays until the next refetch) + the failure path
  refetches fetchDashboard needlessly (server truth unchanged on a
  failed PUT).
- **N-70c3 (Nano)** the store header comment: "`call()` is the only
  sanctioned fetch client" — overstated (8 documented raw-fetch
  exceptions: topbar AbortController, login-card ×4, multipart ×2,
  blob export, profile PATCH); "refresh the affected slice" —
  fetchReports refreshes none (reports data is page-local).
- **N-70c1 (Nano)** the first-load duplicate GETs — hydrate's nine
  fetches + each page's hydrated-flip effect fire CONCURRENT duplicate
  GETs of the same slice (2× /api/dashboard on /, …); the reference's
  React Query dedupes same-key fetches; ours documents the duplicate
  as the page-effect's one-shot retry semantics.
- **N-70c7/8/9 (Info)** the whole-store destructuring (the documented
  simplicity trade), the fetchOpportunities page-consumer asymmetry
  (read-only slice, reset refetches it — consistent), the six
  `--color-chart-*` tokens unconsumed (the documented s60 KEEP).
- **Clean bills**: the call() envelope totality; hydrate me-guard
  ordering; the s45/s64 guards on all fetchers; logout clears
  settings; no loadingFlags exist (s25); the s29 optimistic apply +
  the s51 calendarFetchBounds intact at all three layers; the 5/5
  parity cross-checks vs the fresh bundle byte-identical.

**Coverage catalog**: e2e-pinned (hydrate, leads optimistic round-trip,
calendar flip, funnel-as-bar, health pie, by-type bars exist, reset
wipe); unit-only (the store's entire runtime — source pins; dialog
failure toasts; chart internals); **LIVE-only gaps**: the pie fill
arrays + the by-type tooltip name + the funnel animation props
(N-70c4/5/6), charts at zero data post-wipe, slice-fetch failure
silence, the mutation-failure toasts in vivo.

## The operator decisions

The **CSV formula-injection posture (b) STANDS** (29th re-affirmation —
the guard intact in both export families [guardFormulaPrefix at
csv.ts:31-33 applied in escapeCell AND imported into entity-export.ts,
the 70-b re-verification], the `-` exclusion documented + pinned, the
reference bundle byte-stable for the 41st consecutive session; the
70-c rotation touched NO CSV surface — no new evidence moves the (a)
parity / (c) full-OWASP alternatives).

The **source-vocabulary documented parity STANDS AND EXTENDS to the
N-70 family** (the 70-b census re-confirmed the anchors at file:line:
CONTACT_SOURCE_OPTIONS/LEAD_SOURCE_OPTIONS/SOURCE_PAIRS pinned, NO
enum-membership on routes' source, the settings Capitalized defaults
verbatim; the session-70 fixes touch NO vocabulary surface — the fixes
are a class string, pie-fill constants, a chart family rewire, an
animation-prop retirement, a store write-guard, comments, and e2e
additions).

## The remediation set (TDD — RED first, then GREEN)

- **S70-P1 (F-70a1)** the STAT_CARD.value retirement: `"text-2xl
  font-bold"` (the text-foreground retired — the bare family form; the
  reference's calendar KPI value is `text-2xl font-bold text-gray-900`
  [bundle-decoded + computed rgb(17,24,39)/24px/700/32px LIVE], the
  same gray-900-carrying reference surface the s69 leads precedent
  normalized to the bare family form, accepting the inherited
  #0a0a0a). The page-layout.test.ts:393 pin updates in lockstep; the
  stat-value-contract suite gains the STAT_CARD.value it (the 5th
  family enumerated — the constant-consumption form).
- **S70-P2 (N-70c4)** the pie fill constants:
  `REPORTS_PIE_FILLS.four`/`.five` in constants.ts (the reference's
  literal palettes, bundle-verified) + the three reports call-sites
  consume them; pinned in tests/constants.test.ts (the palette
  family) — a fill drift can no longer pass the suite.
- **S70-P3 (N-70c5)** the by-type chart rides the family:
  `<SingleBarChart data={byType} xKey="label" dataKey="count"
  fill="#3b82f6" radius={[4,4,0,0]} tickFontSize={10} height={150}
  grid={false} />` — the invented `name="Logged"` retired (the
  reference's Bar carries no name; the tooltip reads "count : N"),
  the hand-rolled duplicate retired. Pinned in charts-internals.
- **S70-P4 (N-70c6)** the animation-prop retirement ×3: the funnel +
  the Sparkline Area/Line arms drop `isAnimationActive={false}` (the
  reference NEVER disables chart animation at a call-site — all 38
  bundle occurrences are recharts library internals). Absence pin:
  zero `isAnimationActive` in src/.
- **S70-P5 (N-70c2, scoped)** updateSettings' post-await set gains
  the s64 write-guard (capture the token at entry, guard the set —
  the fetcher pattern); updateLead's optimistic set documented as
  task-synchronous (no guard — no interleaving possible). Pinned in
  store-fetch-guards.
- **S70-P6 (N-70c10)** updateLead: fetchLeads stays unconditional
  (the rollback/reconcile), fetchDashboard gated on `res.ok`; the
  comment re-scoped (the network-failure caveat — the patch may stay
  until the next refetch when the refetch itself fails). Pinned.
- **S70-P7 (N-70c3, comment-only)** the store header re-scope: call()
  = the only sanctioned JSON-ENVELOPE client (the 8 documented
  exceptions own their own justification); fetchReports' page-local
  note.
- **S70-P8 (N-70c1, comment-only)** the hydrate/page-effect
  duplicate-GET documentation: the page-effect's duplicate doubles as
  the one-shot retry (the reference's React Query dedupes; our
  one-store architecture accepts the duplicate GET per page load).
- **S70-P9 (the 70-c coverage closures — the two NEW-gap e2e checks)**:
  (a) the reports pie sector-fills check (the "Activity & Productivity"
  tab's Activities-by-Type pie — every sector fill ∈ the pinned
  5-color palette, the first sector #3b82f6, ≥3 distinct fills — the
  LIVE-only surface N-70c4 catalogued); (b) the post-wipe zero-bar
  chart assertion (the reset test extended: the dashboard's chart
  wrapper VISIBLE + `.recharts-bar-rectangle` count 0 after the wipe —
  the s10 "real chart renders empty" parity, LIVE-only until now).
  Both are green-through-RED guards of LIVE-verified behavior (the
  s67/s69 precedent). 116 → 118.
- **The carriers**: F-70a2 (the ×5/×2-vs-×4/×3 precision) recorded as
  errata in session_133.md per the F-67a1 convention; N-70b1/b2
  recorded in the session record.

## Blast radius (pre-checked)

No unit pins on: the STAT_CARD.value string except the ONE lockstep pin
(page-layout.test.ts:393 — updated in the same commit); the pie fill
arrays (zero assertions on #ec4899 — the 70-c verification); the
by-type chart's source structure (charts-internals:90 pins the FAMILY's
grid prop, not the consumer); `isAnimationActive` (zero pins in
tests/); updateSettings' set (the store-fetch-guards fetcher pins
don't cover it; the :119 not.toMatch scopes to logout); updateLead's
refetch shape (the s47 feedback pins are page-level .then chains; the
s29 pins are the set-before-await + page call shapes — both
preserved). The e2e suite: no e2e asserts the calendar KPI classes,
the pie fills, the by-type tooltip name, the funnel animation, or the
post-wipe chart DOM; the two NEW e2e checks are additive (116 → 118);
the reset-test extension appends assertions inside the existing LAST
test (no count change). The comments (P7/P8) are comment-only. The
IconStatCard/Sparkline consumers: the Sparkline arms render inside
KpiCard (dashboard ×6) — animation on mount only, the e2e
sparkline-visible assertions are animation-safe (visibility, not
path coordinates — verified at crm.spec.ts:1796-1810); the funnel e2e
asserts text + card visibility only (crm.spec.ts:33).

## The gate

lint 0/0 · tsc 0 · the full unit suite at 1279 + the 6 new session-70
its (1285) · build clean · e2e 118 on a fresh CI=1 boot (all 9
mobile-nav checks green) · the non-vacuousness replay in a pre-fix
047f3be worktree (only the new/modified test files; the exact RED set
isolated) · the LIVE battery (the fix surfaces through real
round-trips + the mobile drawer regression at TRUE 390px + the
Tailwind v4 token probes + zero 390px overflow ×10 routes + the
closing db:census MATCH) · the screenshot set at 1440×900 · the docs
realignment (SKILL v1.67.0 + README/AGENTS/CLAUDE/PAD at the new
counts + session_133.md [the odd-number record convention] + this
execution record + both worklogs).

## The execution record (2026-10-06, session-70)

EXECUTED AS PLANNED with THREE mid-flight repairs (all caught by the
gate itself, none post-ship — the honest count): (1) the tsc import
typo (REPORT_PIE_FILLS → REPORTS_PIE_FILLS — typecheck caught it);
(2) the readonly-spread convention (the `as const` arrays meet
LabelPieChart's mutable `fills` prop via `[...REPORTS_PIE_FILLS.four]`,
the HEALTH_PIE_FILLS precedent at reports-page.tsx:979 — typecheck
caught it); (3) the e2e zero-count draft corrected BY THE RUN (the
pipeline's 5 stages are the s10 FIXED LIST — the assertion re-derived
as count 5 + every bar height ≤ 1px, the RICHER pin: fixed lists
render flat bars at zero, the wrapper mounted, non-vacuous). RED: 8
failed exactly (the stat-value-contract STAT_CARD it + the constants
REPORTS_PIE_FILLS pair + the charts-internals by-type
family/animation pair + the store-fetch-guards updateSettings/
updateLead pair + the re-anchored by-type tickFontSize it); the ninth
new it (the TrendStatCard constant-consumption guard) green through
the RED by design. GREEN: S70-P1..P9 all landed (P1 the bare
text-2xl font-bold + the lockstep pin + the contract extension; P2
the constants + the three consumers; P3 the family rewire + the
invented name retired + the recharts import retired; P4 the animation
retirement ×3; P5 the updateSettings token guard + the updateLead
task-synchronous documentation; P6 the refetch shape + the comment
re-scope; P7/P8 the comment carriers; P9 the pie-fills e2e + the
fixed-list-flat-bars reset extension). Non-vacuousness: 10 failed |
286 passed (296) in the pre-fix 047f3be worktree (the 8 RED + the
page-layout lockstep pin + the dch s56 re-anchor — the re-anchored
s56 pin asserting ResponsiveContainer's acts presence superseded by
the SingleBarChart consumption form); clean teardown. Full gate: lint
0/0 · tsc 0 · 1287/1287 unit (79 suites, +8) · build clean · 117/117
e2e on a fresh CI=1 boot (2.7m, all 9 mobile-nav checks green). LIVE:
the calendar KPI bare form (24px/700/32px inherited); the pie fills;
the by-type tooltip "Email count : 3"; the funnel labels ×4; the
drawer both directions at TRUE 390px with focus restored (the JS-click
focus artifact run down and re-verified with the focused click); zero
overflow ×10; NO Tailwind v4 bug; the closing census MATCH. Docs: SKILL
v1.67.0 (§16bj, 6399 → 6446) + README/AGENTS/CLAUDE/PAD at 1287+117
(badge 1404) + session_133.md + the F-70a2 errata + this record +
both worklogs. Estimate drift: the plan's +6 its/1285 → the actual
+8/1287 (two deliberate green consumption-guards); the plan's 118
e2e → the actual 117 (the reset extension is inside the existing LAST
test — no count change); both drifts in the conservative direction.
