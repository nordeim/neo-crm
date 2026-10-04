# Session-52 Parity Remediation Plan (2026-10-04)

Session 52 on `main` @ `6ce8572` (= the session-51 code `988f69a` + the
operator's `docs/session_96.md` transcript; zero app-code drift).
Workspace refreshed via git pull (fast-forward); the environment intact
from the s51 ship (bun install — no changes; no :3000/:3100 listeners at
intake, `ss -tlnp` verified — the s51 zombie lesson applied). Baseline
gate on the fresh tree: **lint 0/0 (enforced) · tsc 0 · 1171/1171 unit
(74 suites)** — the documented state exact. DB pristine (15/24/10/23/12
+ 4 users, counted); `.env` correct (`DATABASE_URL=file:../db/custom.db`
+ AUTH_SECRET set); `.env.example` present + parity (only the AUTH_SECRET
line differs); the `skills/` exclusion holds in all three configs.

## The standing layers (48th session, NO DRIFT)

Drift sweep #48: the reference bundle fresh-fetched (logged in via
agent-browser) + curl byte-compared against the cached copy —
**byte-identical** (size 1,631,071 + md5 `a70a637fcf1d4291da8e0d965676
dc11` exact — the **23rd consecutive stable session**). Reference census
#48: the demo data still zero (Total Leads 0, `$0.0k`/`$0.0k`/`$0k`,
`0%`, `0` days); the mobile-nav defect stands at a TRUE 390px (nav w=0,
8 links in DOM, 0 visible, no hamburger, scrollW 390).

## The audits (two parallel agents + manual validation of every claim)

### A. The session-51 re-audit (52-a, fresh eyes on the b7c928c..988f69a diff)

All ten checklist items verified GENUINE at file:line — the
`calendarFetchBounds` seam (format.ts:240-246: `from` the full
prev-month over-coverage, `to` the untrimmed 42-cell grid's final cell;
the worked examples re-computed), the page rewire (the effect :107-115
derives from the seam; the old month-end BOUND form absent — :138's
`new Date(year, month + 1, 0).getDate()` is the daysInMonth COUNT inside
the untouched days memo, a different, pre-existing purpose), the three
KPI baselines reading `visible` (:164/:168/:174), the pin file's 4+1
shape (5 `it(` declarations), the four docs/comment carriers, zero
suppressions, the docs counts exact, 1171/1171 by run. The mechanical
non-vacuousness proof REPRODUCED: a pre-fix `b7c928c` worktree with only
the HEAD pin file → **4 failed | 1 passed** there (the documented
arithmetic exact), 5/5 at HEAD; the worktree cleaned up after.

### B. The graduation audit (52-b: the ledger + the fresh-eyes sweep)

**ZERO graduations — 13/13 CONFIRMED (9th consecutive session)**. The
drift map since 51-b is a single translation: the entity-dialogs photo
img :431-432→:433-434 (+2 — the s51 N-51g header-comment re-wording,
zero code change). The INFO family ALL UNCHANGED (F-47c, N-48c, N-48f,
N-48j — anchors verified; N-51c KEEP documented). The two operator
decisions' code anchors verified STANDING. Counts exact BY RUN
(74 files / 1171/1171; `--list` → 111 tests in 4 files = 94 crm + 9
auth + 7 mobile-nav + 1 setup; the sleep census at exactly 2 annotated
keeps, crm.spec:454/:2204 — zero drift). Fresh-eyes on the
leads/reports/activities pages (read in full): React-19 discipline
holds, all mutations guarded/toasted, zero staleness vs doc claims.

### C. The new findings (all manually validated at file:line by the orchestrator)

- **N-52a (INFO, docs-accuracy — the chronic N-51e class)** — three
  sibling carriers still say the mobile-nav suite has "5 checks" vs the
  actual **7** (7 `test(` declarations in
  `tests/e2e/mobile-navigation.spec.ts`; PAD's own :206/:727 rows say 7;
  the s51 fix corrected only the one carrier):
  `Project_Architecture_Document.md:1278` (the per-file inventory row
  "5-check mobile drawer regression suite"), `neo-crm_SKILL.md:342`
  ("(5 checks) is the regression suite"), `neo-crm_SKILL.md:608`
  ("`mobile-nav.tsx` drawer + 5-check e2e suite").
- **N-52b (INFO, docs-accuracy)** — `README.md:55` (the Tested feature
  row) leads with the frozen session-45 pair "1095 Vitest unit checks +
  108 Playwright E2E checks" and only the trailing growth clause ("grown
  to 1171 unit + 111 e2e through session-51") is current — the leading
  pair matches no current state (the row should state the current counts
  directly).
- **N-52c (INFO→FIX, code-style — the session's headline)** —
  `src/app/(app)/leads/leads-page.tsx:148-159`: saveView's
  `window.localStorage.setItem` sits INSIDE the `setSavedViews` updater
  (an impure setState callback — React may re-invoke updaters, and the
  storage side effect belongs in the handler body per the reports-page
  `saveReport` convention, S44-P4). Harmless today (the write is
  idempotent + try/catch'd) but it violates the updater-purity
  discipline the codebase enforces everywhere else. The hoist is
  behavior-identical: the view still joins the in-memory list when
  storage is blocked (the toast reports the persistence failure), the
  prompt flow + the e2e round-trip unchanged.

## The operator-decision standings (re-verified, unchanged)

The two standing operator decisions — the **CSV formula-injection
posture (b)** (`guardFormulaPrefix` at csv.ts:31-33, applied in BOTH
families — `escapeCell` :37 server-side, `qq` entity-export.ts:43
client-side; `-` deliberately NOT guarded; templates + parser outside)
and the **source-vocabulary documented-parity reconciliation**
(CONTACT_SOURCES/LEAD_SOURCES gone; the living `*_SOURCE_OPTIONS` pair
at constants.ts:132/:258; free-form source on the routes with the
in-file rationales) — were landed in session 48, re-verified genuine by
the 49-a/50-a/51-a/52-a audits, and carry no new evidence (the bundle
byte-identical for the 23rd consecutive session). **Both stand
as-decided; nothing to re-litigate.** The INFO family also stands as
triaged (F-47c, N-48c, N-48f, N-48j — all KEEP with recorded rationale;
N-51c KEEP).

## The fixes (S52-P1..P4, RED-first)

### S52-P1 — the saveView updater-purity hoist (the headline)

`src/app/(app)/leads/leads-page.tsx` saveView:

```ts
function saveView() {
  const name = window.prompt("Enter view name:");
  if (!name) return;
  const next = [...savedViews, { name, filters }];
  try {
    window.localStorage.setItem(LEAD_VIEWS_STORAGE_KEY, encodeSavedLeadViews(next));
  } catch {
    toast.error("Could not save view", "Browser storage is unavailable.");
  }
  setSavedViews(next);
}
```

The storage write + its guard hoisted to the handler body (the S44-P4
convention); the updater becomes the plain `setSavedViews(next)` — no
callback, nothing impure. Behavior-identical: prompt-cancelled → no-op;
storage OK → persisted + listed; storage blocked → toast + still listed
in memory. `savedViews` is the render-closure state (safe here: the
prompt is modal — no two saveView calls can share a frame).

### S52-P2 — the four docs carriers (N-52a ×3 + N-52b)

- `Project_Architecture_Document.md:1278`: "5-check mobile drawer
  regression suite" → **"7-check mobile drawer regression suite"**.
- `neo-crm_SKILL.md:342`: "`tests/e2e/mobile-navigation.spec.ts` (5
  checks) is the regression suite." → **"(7 checks, 390/700px
  viewports)"** (the PAD:206 form).
- `neo-crm_SKILL.md:608`: "`mobile-nav.tsx` drawer + 5-check e2e suite"
  → **"+ 7-check e2e suite"**.
- `README.md:55`: the Tested row → "1172 Vitest unit checks + 111
  Playwright E2E checks, including a 7-check mobile-nav regression suite
  (resize lock-release + drawer focus-entry included)" (the current
  counts stated directly; the frozen 1095/108 leading pair retired; the
  growth clause retired with it — the badge already carries the
  session-relative arithmetic).

### S52-P3 — the triage records + the standard docs suite

N-52c FIXED (S52-P1); N-52a/N-52b FIXED (S52-P2); the keep-decisions
recorded in SKILL v1.49.0's new §16ar + `docs/session_97.md`. The
standard suite: README (badge 1283 = 1172 + 111, the session-52
paragraph, the suite list + counts), AGENTS (1172/111 + the session-52
block), CLAUDE (1172 ×3 + the storage-read-guards suite description
updated for the new pin), PAD (the s52 row / 74 suites / 1172+111 / the
carrier fix), SKILL **v1.49.0** (frontmatter + project_state + the H1 +
the new §16ar), `docs/session_97.md`, this plan's execution record,
both worklogs. `.env`/`.env.example` re-verified (no env surface
change).

### S52-P4 — the gate + the LIVE verification battery

Gate: lint 0/0 (enforced) · tsc 0 · full unit (**1172** = 1171 + 1, 74
suites) · build clean · 111/111 e2e on a fresh CI=1 boot (the 7
mobile-nav checks included). LIVE battery on the dev server: the
**saveView round-trip probe** (save a view through the prompt → the
select lists it → reload → the view persists → remove it → zero
residue); the standing battery — the mobile drawer in every direction
at a TRUE 390px (trigger → 8/8 truly visible + aria-expanded + dual
scroll-lock; Escape → inert + 0/8 + unlocked), zero 390px overflow on
all ten routes (both Dashboard casings), the Tailwind v4 token contract
(`--blur-sm` → blur(4px), `--shadow-sm` → the exact pinned
rgba(0,0,0,0.05) 0px 1px 2px), zero probe residue (15/24/10/23/12
pristine).

Screenshots: 02/11/12 re-captured (the standing set) +
**61-leads-saved-view-persisted NEW** (the fix surface at 1440×900: the
filters popover with a saved view listed + the select after a reload —
the superset feature the purity hoist preserves).

## Pre-execution validation (done, at file:line)

- **Pin blast radius (verified)**:
  `tests/storage-read-guards.test.ts` pins the leads READ site (the
  mount-effect timer try/catch) + the census "the leads WRITE — guarded
  inline" (`setItem` + a catch within 1200 chars) — the hoist KEEPS the
  setItem + its try/catch, so both stay green;
  `tests/report-save-guard.test.ts` pins only the reports-page handler;
  `tests/lead-filters.test.ts` pins the encode/decode seam (untouched);
  the session-29 e2e save-view round-trip (the prompt + the "(Active)"
  suffix) rides the same flow — the prompt, the storage key, the
  vocabulary, and the listing behavior are all unchanged. No existing
  pin describes the updater's internal shape (grep-verified).
- **Lint surface**: the fix replaces an updater callback with a plain
  value + three handler-body statements — `next` is consumed by both
  the setItem and the setState; no unused-var hazard; `savedViews` and
  `filters` are already in scope.
- **The e2e prompt flow**: `crm.spec.ts` handles the native prompt via
  the dialog API — the call site (`window.prompt`) is unchanged.

## RED pin (planned: 1 RED)

`tests/storage-read-guards.test.ts` (the natural home — it already
reads the leads-page source + pins the storage guard shapes; the s50
source-structure idiom):

```ts
it("session-52: the leads-page saveView updater is PURE — the storage write hoisted to the handler body (N-52c)", () => {
  const src = leads();
  const at = src.indexOf("function saveView");
  expect(at).toBeGreaterThanOrEqual(0);
  const end = src.indexOf("function applyView", at);
  const fn = src.slice(at, end > at ? end : at + 700);
  // The write + its guard live in the handler body (the S44-P4
  // saveReport convention)…
  expect(fn).toMatch(/const next = \[\.\.\.savedViews, \{ name, filters \}\]/);
  expect(fn).toMatch(/localStorage\.setItem/);
  // …and the setSavedViews call passes the precomputed list — the
  // updater region carries NO storage access (updaters must be pure).
  const setAt = fn.indexOf("setSavedViews(");
  expect(setAt).toBeGreaterThanOrEqual(0);
  expect(fn.slice(setAt)).not.toMatch(/localStorage/);
});
```

RED on HEAD (the `const next` form does not exist — the array is built
inside the updater from `prev`; and the tail after `setSavedViews(`
contains the setItem). Predicted RED: **1 failure** in the suite; full
suite through RED: **1 failed / 1171 passed** — all pre-existing checks
green. The failure SET must equal the code-change pin set.

## EXECUTION RECORD (2026-10-04, session 52 — SHIPPED)

- **RED**: exactly **1 failure** (the `const next` form absent on
  HEAD + the storage access present after the `setSavedViews(`
  call); the 3 pre-existing its green). Full suite through RED:
  **1 failed / 1171 passed (1172)** — all 1171 pre-existing checks
  green.
- **GREEN (S52-P1)**: the saveView hoist in
  src/app/(app)/leads/leads-page.tsx (the `const next` computation +
  the guarded write in the handler body + the plain
  `setSavedViews(next)`), the s52 comment in-file. The FINAL pin
  file re-proven mechanically non-vacuous in a pre-fix `6ce8572`
  worktree (node_modules hard-linked): **1 failed | 3 passed**
  there, **4/4** at the fix; the worktree cleaned up after
  (`git worktree list` = the main checkout only). **S52-P2**: the
  four docs carriers (PAD:1278 + SKILL:342 + SKILL:608 — the three
  "5 checks" siblings → 7; README:55 — the Tested row's frozen
  leading pair retired for the current counts).
- **Gate**: lint 0/0 (enforced) · tsc 0 · **1172/1172 unit (74
  suites, +1)** · build clean · **111/111 e2e on a fresh CI=1
  boot** (all 7 mobile-nav checks green).
- **LIVE**: the saveView round-trip probe (the Filters popover →
  Save View → the prompt accepted with "PROBE52 VIEW" via the
  agent-browser dialog API → the Saved Views select lists it →
  **reload → the view PERSISTS** [the localStorage key + the
  decoded list verified] → removed → zero residue, 15/24/10/23/12
  pristine). The drawer both directions (288px portal, 8/8 truly
  visible, aria-expanded, dual lock; Escape → 0/8 [with
  `{visibilityProperty:true}`] + unlocked); zero 390px overflow on
  all ten routes (both Dashboard casings); NO Tailwind v4 bug
  (blur(4px) + the exact pinned shadow, probe-verified on a live
  element).
- **Screenshots**: 02/11/12 re-captured +
  **61-leads-saved-view-persisted NEW** (1440×900: the Filters
  popover with the Saved Views select open listing the persisted
  probe view). **61 VLM-verified** (the page + the option + the
  chrome; nothing broken or clipped).
- **Docs**: README (badge 1283 + the session-52 paragraph + the
  suite comment + the Tested row); AGENTS (1172/111 + the
  session-52 block); CLAUDE (1172 ×3); PAD (the s52 row / the
  repo-tree counts / the Total / the checklist / the command table
  / the per-file inventory row); SKILL **v1.49.0** (frontmatter +
  project_state + the H1 + the new §16ar + the two carrier fixes);
  `docs/session_97.md`; this record; both worklogs.
  `.env`/`.env.example` re-verified (no env surface change).
- **Shipped**: commit on main + the SSH-wrapper push to
  `git@github.com:nordeim/neo-crm.git` (the operator ed25519,
  shredded after — the s43-s51 runbook).
