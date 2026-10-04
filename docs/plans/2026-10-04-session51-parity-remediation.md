# Session-51 Parity Remediation Plan (2026-10-04)

Session 51 on `main` @ `b7c928c` (the session-50 code `0d5dbab` + the
operator's `docs/session_94.md` transcript commit; the workspace was RESET
so the repo was freshly cloned, the surviving `db/custom.db` restored,
`.env` rebuilt per contract). Baseline gate on the fresh tree: **lint 0/0
(enforced) · tsc 0 · 1166/1166 unit (73 suites)** — the documented state
exactly. DB pristine (15/24/10/23/12 + 4 users, API-counted); the dev
server healthy on :3000; the vitest (5.0.1) + playwright (1.63) configs
verified standing; the `skills/` exclusion holds in all three configs
(eslint ignores / vitest include / tsconfig exclude).

## The standing layers (47th session, NO DRIFT)

Drift sweep #47: the reference bundle fresh-fetched and hash-compared —
**byte-identical** (size 1,631,071 + md5 `a70a637fcf1d4291da8e0d965676
dc11` exact — the 22nd consecutive stable session). Reference census #47:
the demo data still zero (KPIs "0"/"$0.0k"/"$0.0k"/"$0k"/"0%"/"0"); the
mobile-nav defect stands at a TRUE 390px (nav w=0, 8 links in DOM, 0
visible, no hamburger, scrollW 390) — agent-browser live-verified.

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-50 re-audit (51-a, fresh eyes on the 17-file diff)

All six checklist items verified GENUINE at file:line — the N-47d
retirement (the three create dialogs create-only, zero entity props /
createMode / update-verb references, the create field sets
byte-preserved — AccountForm 1522/1522 chars, LeadForm 1738/1738 exact;
EventDialog/ActivityDialog untouched, their live mounts verified), the
three pages' dead states removed, the pin file's 4+2 shape, the
leads-inline re-anchor, the four docs carriers, zero suppressions.
Non-vacuousness mechanically re-proven in a `c543b36` worktree
(node_modules hard-linked): **create-dialog-single-mode 4 failed | 2
passed** there (the documented arithmetic EXACT), 6/6 at HEAD; the
re-anchored leads-inline pin itself RED pre-fix (**1 failed | 24 passed**
there — a fifth mechanical witness the s50 records did not claim but
which strengthens the proof); 31/31 combined at HEAD; blast-radius
families 264/264; 73 suites on disk; tree clean after.

### B. The graduation audit (51-b: the ledger + the fresh-eyes sweep)

**ZERO graduations — 13/13 CONFIRMED** (8th consecutive session; the only
drift line-number translation from the s50 retirement: contacts-page
:763→:760/:245→:244, the import branch :273-290→:274-289, entity-dialogs
photo img :540-541→:431-432). The INFO family ALL UNCHANGED (F-47c,
N-48c, N-48f, N-48j — all keep-rationales verified recorded). Counts
exact BY RUN (1166/1166; `--list` → 111 tests in 4 files = 94 crm + 9
auth + 7 mobile-nav + 1 setup). .env/.env.example parity holds
(AUTH_SECRET only — flagged N-51d, the fresh workspace's empty-secret
posture). Fresh-eyes on reports/settings/calendar pages: React-19
discipline, guarded mutations, envelope/call() contract all hold.

### C. The new findings (all manually validated at file:line by the orchestrator)

- **N-51a (LOW-MED, CODE — the session's headline)** —
  `src/app/(app)/calendar/calendar-page.tsx:107-112`: the month-flip
  fetch window is `[prev-month 1st, current-month end]`
  (`endOfDay(new Date(year, month + 1, 0))`), but the rendered grid is
  the Sunday-anchored `calendarGrid(year, month, "sunday", true)` TRIMMED
  to whole weeks (`weeks = max(ceil((lead + daysInMonth)/7), 4)`) — its
  TRAILING cells extend up to 6 days into the NEXT month (worked example:
  Nov 2026 → lead 0, 30 days, 5 weeks → Dec 1-5 rendered). After a month
  flip the s45 last-call-wins token makes the windowed fetch
  authoritative, so events on those trailing next-month days VANISH from
  the cells that render them (the leading side is deliberately
  over-covered by a full prev month — the asymmetry is the tell). The
  same-page KPI cards also read the store, so the window governs them
  too. Zero pins on the window; zero e2e on a month flip.
- **N-51b (INFO→FIX, the same calendar family)** —
  `calendar-page.tsx:160-173`: the KPI trend baselines mix populations —
  the CURRENT sides read `visible` (the filtered set: `todaysEvents` via
  `eventsOn`, `meetingsThisWeek`, `callsThisWeek`) while the BASELINE
  sides read raw `events` (`yesterdaysEvents`, `meetingsLastWeek`,
  `callsLastWeek`). With a filter active the delta compares a filtered
  current against an unfiltered baseline — a pseudo-delta. With no
  filters `visible ≡ events`, so the pinned no-filter behavior is
  unaffected; the reference is undecidable at its persistent zero data
  (no parity divergence is observable). The "Total Events" pseudo-delta
  (`trend={`+${visible.length}`}`) is the reference's own quirk —
  UNTOUCHED.
- **N-51c (INFO, KEEP)** — `reports-page.tsx:451/:456` `DealTables` vs
  `:601/:619` `DealsTables`: one letter apart, different live tables. A
  rename is pure churn with zero parity gain (the N-48j precedent).
- **N-51d (INFO, env posture)** — this fresh workspace's `.env`
  AUTH_SECRET is empty (the .env.example default). Local-only matter
  (`.env` untracked): set a dev secret before the LIVE battery to match
  the documented workspace posture.
- **N-51e (INFO, docs-accuracy)** — `Project_Architecture_Document.md`
  :206: "Pinned by `tests/e2e/mobile-navigation.spec.ts` (5 checks,
  390px viewport)" vs the actual **7** checks (PAD's own :726 row; the
  chronic N-50b class — the count was never bumped when the suite grew
  the focus-entry + resize regressions).
- **N-51f (INFO, docs-accuracy)** — `Project_Architecture_Document.md`
  :355-356: the repo-tree diagram frozen at "15 Vitest suites — 262
  checks" / "3 spec files — 31 checks" vs the current 73 suites / 1166
  checks and 111 e2e checks in 4 test files.
- **N-51g (INFO, s50-introduced comment staleness)** —
  `src/components/shared/entity-dialogs.tsx:6-7`: the file header says
  the forms are "keyed by entity id" — after the s50 retirement that is
  true only for the Event/Activity edit forms; the create forms mount
  open-gated with no key (unmount-on-close guarantees fresh initializers
  — functionally equivalent, but the comment now misdescribes the file).
- **N-51h (LOW, docs contradiction)** — `AGENTS.md:1965-1966`: "Charts
  are recharts with empty-state fallbacks …; every chart must render a
  friendly placeholder when its data is all-zero" directly contradicts
  the session-10 reversal recorded everywhere else (CLAUDE.md:84-88, the
  SKILL project_state, `charts.tsx:39-41`): the REAL chart renders at
  all-zero data; the ChartEmpty placeholders are retired from src.

## The operator-decision standings (re-verified, unchanged)

The two standing operator decisions — the **CSV formula-injection
posture (b)** (`guardFormulaPrefix` at csv.ts:31-33, applied in BOTH
families — `escapeCell` :37 server-side, `qq` entity-export:43
client-side; `-` deliberately NOT guarded; templates + parser outside)
and the **source-vocabulary documented-parity reconciliation**
(CONTACT_SOURCES/LEAD_SOURCES gone; the living `*_SOURCE_OPTIONS` pair;
free-form source on the routes with the in-file rationales) — were
landed in session 48, re-verified genuine by the 49-a/50-a/51-a worktree
proofs, and carry no new evidence (the bundle is byte-identical for the
22nd consecutive session). **Both stand as-decided; nothing to
re-litigate.** The INFO family also stands as triaged in s50 (F-47c,
N-48c, N-48f, N-48j — all KEEP with recorded rationale).

## The fixes (S51-P1..P4, RED-first)

### S51-P1 — the calendar window + KPI-baseline consistency family (the headline)

**P1a — the fetch-window seam.** Extract the window computation into a
pure seam next to `calendarGrid` in `src/lib/format.ts`:

```ts
/** Fetch window for a calendar month view. `from` deliberately
 * over-covers a FULL previous month (the leading cells + the today-side
 * KPI cards when viewing ahead); `to` covers the LAST day the grid can
 * render — the UNTRIMMED 42-cell Sunday-anchored grid's final cell, so
 * the trailing next-month cells are always inside the window (N-51a:
 * the old month-end bound lost their events after a month flip; the
 * untrimmed bound also survives future changes to the page's trim). */
export function calendarFetchBounds(year, month) {
  const grid = calendarGrid(year, month, "sunday", true);
  return {
    from: new Date(year, month - 1, 1).toISOString(),
    to: endOfDay(grid[grid.length - 1]).toISOString(),
  };
}
```

`calendar-page.tsx:107-112` rewires to `const { from, to } =
calendarFetchBounds(year, month)` (dep array unchanged — the seam is
pure on [year, month]). The page's `days` memo (the trim) is UNTOUCHED.
Worked examples to pin: Nov 2026 → untrimmed last cell Dec 12 (trimmed
render ends Dec 5 — covered); Oct 2026 → untrimmed last cell Nov 7
(trimmed render ends Oct 31 — zero trailing, over-covered by a week,
harmless).

**P1b — the KPI trend baselines.** `calendar-page.tsx:160-173`: the
three baseline computations (`yesterdaysEvents`, `meetingsLastWeek`,
`callsLastWeek`) switch `events.filter` → `visible.filter` — both sides
of every trend read the same filtered population. No-filter behavior is
byte-identical (`visible ≡ events` when all filters are empty); the
"Total Events" pseudo-delta and the `trend()` helper are UNTOUCHED (the
reference's own quirks).

### S51-P2 — the four docs/comment carriers (N-51e/f/g/h)

- `Project_Architecture_Document.md:206`: "(5 checks, 390px viewport)" →
  **"(7 checks, 390/700px viewports)"**.
- `Project_Architecture_Document.md:355-356`: "**15** Vitest suites —
  **262** checks" → "**73** Vitest suites — **1166** checks";
  "global-setup, auth.setup, 3 spec files — **31** checks" →
  "global-setup, auth.setup, 3 spec files + setup project — **111**
  checks" (the `--list` truth: 111 tests in 4 files).
- `src/components/shared/entity-dialogs.tsx:6-7`: the pattern comment →
  "each dialog shell mounts its form only while open — the Event/Activity
  edit forms keyed by entity id, the create forms unmounted on close —
  so every form initializes ALL state via useState initializers at
  mount. No setState-inside-effects, ever." (the s50 retirement record).
- `AGENTS.md:1965-1966`: the chart bullet → the session-10 contract:
  "Charts are recharts with recharts DEFAULTS (`src/components/charts/`);
  the REAL chart renders at all-zero data (session-10 reversal — the
  empty-state placeholder boxes are retired; fixed lists render ticks at
  zero, row-derived series render empty)."

### S51-P3 — the triage records

N-51a FIXED (P1a) + N-51b FIXED (P1b); N-51c KEEP documented (the
rename-is-churn rationale, the N-48j precedent); N-51d the workspace
`.env` AUTH_SECRET set (local posture, recorded in the session docs);
the keep-decisions recorded in SKILL v1.48.0's new §16aq +
`docs/session_95.md`.

### S51-P4 — the standard docs suite

README (badge 1283 = 1172 + 111, the session-51 paragraph, the suite
list + calendar-fetch-bounds), AGENTS (1172/111 + the session-51 block +
the S51-P2h chart bullet), CLAUDE (1172 ×3), PAD (the s51 row / 74
suites / 1172+111 / the two carrier fixes), SKILL **v1.48.0**
(frontmatter + project_state + the H1 + the new §16aq),
`docs/session_95.md`, this plan's execution record, both worklogs.
`.env`/`.env.example` re-verified (no env surface change).

## Pre-execution validation (done, at file:line)

- **Pin blast radius (verified)**: `tests/calendar-cells.test.ts` pins
  the EVENT_TYPE_CHIP tints / plain day numbers / clickable chips /
  tall-bar + agenda rows — none touch the fetch window or the KPI
  baselines; the e2e calendar tests (:67 the current-month + seeded
  events render, :732 the split grids) ride the hydrate-time full fetch
  (no window) — unaffected by P1a (the initial window now ALSO covers
  more, never less); `crm-store.ts` `fetchEvents` + the s45 token are
  pinned in the store suites — the verb's signature is unchanged. The
  `days` memo, `eventsOn`, `weekStart/weekEnd/lastWeekStart`, `trend()`,
  and the four TrendStatCards' labels/icons/classes are untouched by
  both fixes. Zero pins on `yesterdaysEvents`/`meetingsLastWeek`/
  `callsLastWeek` (grep-verified).
- **API contract (verified)**: `/api/events` validates `from`/`to`
  (400 on garbage, s13) and applies the window — the seam's ISO strings
  are the same shape the page already sends (`endOfDay(...).toISOString()`).
- **Lint surface**: the fixes REMOVE code from the effect (the inline
  bounds) and change three `.filter` sources — no unused-var hazard;
  the new seam export is consumed by the page + the tests.

## RED pins (planned: 5 RED + 1 guard)

`tests/calendar-fetch-bounds.test.ts` (new file — the behavioral pins
use a DYNAMIC import of the seam so each it fails individually on HEAD
with clean arithmetic; the source-structure pins read the page source,
the s50 idiom):

1. `calendarFetchBounds(2026, 10)` (November): `to` ===
   `endOfDay(new Date(2026, 11, 12)).toISOString()` (the untrimmed
   42nd cell) AND ≥ `endOfDay(new Date(2026, 11, 5))` (the trimmed
   render's last day — the trailing-cell coverage contract) — RED on
   HEAD (the export does not exist).
2. `calendarFetchBounds(2026, 9)` (October, zero-trailing): `to` ===
   `endOfDay(new Date(2026, 10, 7)).toISOString()` AND ≥
   `endOfDay(new Date(2026, 9, 31))` — RED on HEAD.
3. `from` over-coverage: `calendarFetchBounds(2026, 9).from` ===
   `new Date(2026, 8, 1).toISOString()` (Sep 1 — the full prev month) —
   RED on HEAD.
4. Source-structure: the calendar page's effect region derives the
   window from `calendarFetchBounds(` and the region contains NO
   `new Date(year, month + 1, 0)` month-end form — RED on HEAD.
5. Source-structure: the three KPI baselines read the SAME population as
   the currents — `yesterdaysEvents = visible.filter`,
   `meetingsLastWeek = visible.filter`, `callsLastWeek = visible.filter`
   — RED on HEAD (they read `events`).
6. GUARD (green through RED): the neighbors unchanged — `calendarGrid`
   keeps the 42-cell `leading` form + the monday default anchor; the
   page keeps `"sunday"` + the trim memo (`weeks * 7` slice + the
   `Math.max(..., 4)` floor); the "Total Events" pseudo-delta
   (`+${visible.length}`) + the `trend()` helper verbatim; the fetch
   verb still `fetchEvents(from, to)`.

Predicted RED: **5 failures + 1 green-through-RED guard** (the failure
SET must equal the code-change pin set); full suite through RED:
5 failed / 1167 passed.

## Gate + LIVE verification

Gate: lint 0/0 (enforced) · tsc 0 · full unit (**1172** = 1166 + 6, 74
suites) · build clean · 111/111 e2e on a fresh CI=1 boot (the 7
mobile-nav checks included). LIVE battery on the dev server (the
mandate's focus areas included): the **calendar trailing-cell probe**
(create an event on a trailing next-month cell date via the UI → flip to
the month whose grid renders it → the chip renders → flip away and back
→ still renders → delete → zero residue — the N-51a end-to-end proof);
the **KPI-baseline probe** (activate a type filter → the trend deltas
stay self-consistent); the standing battery — the mobile drawer in every
direction at a TRUE 390px (trigger → 8/8 truly visible + aria-expanded +
dual scroll-lock; Escape → inert + 0/8 + unlocked), zero 390px overflow
on all nine routes (both Dashboard casings), the Tailwind v4 token
contract (`--blur-sm` → blur(4px), `--shadow-sm` → the exact pinned
rgba(0,0,0,0.05) 0px 1px 2px), zero probe residue (15/24/10/23/12
pristine).

Screenshots: 02/11/12 re-captured (the standing set) +
**60-calendar-trailing-cells NEW** (the fix surface at 1440×900: the
November view with the December trailing cells + the probe event chip).
60 VLM-verified.

## Deferred pointers (carried forward)

The standing ledger (13 items, 8 sessions zero graduations — re-anchored
line numbers recorded by 51-b); the INFO family unchanged (F-47c, N-48c,
N-48f, N-48j — all triaged KEEP); N-51c KEEP documented; the drift
re-sweep next live visit; the e2e sleep census at 2 (both annotated
no-op-contract keeps); an OPTIONAL future e2e for the month-flip
trailing-cell behavior (date-fragile to author generically — the seam
pin + the LIVE probe carry the contract this session; noted for the
operator).

## EXECUTION RECORD (2026-10-04, session 51 — SHIPPED)

- **RED**: exactly **4 failures + 1 green-through-RED guard** (one
  pin-shape correction vs the plan's prediction — the from-overage
  assertions folded into its 1-2, so the file carries 5 its, not 6;
  the s50-precedent class). Full suite through RED: **4 failed / 1167
  passed** — all 1166 pre-existing checks green.
- **GREEN (S51-P1)**: the `calendarFetchBounds` seam in
  src/lib/format.ts (from = the full-prev-month over-coverage, to =
  the UNTRIMMED grid's final cell), the calendar effect rewired, the
  `days` memo untouched; the three KPI baselines switched to
  `visible.filter`. The FINAL pin file re-proven mechanically
  non-vacuous in a pre-fix `b7c928c` worktree: **4 failed | 1 passed**
  there, **5/5** at the fix. **S51-P2**: the four docs/comment
  carriers (PAD 5→7 + the repo-tree counts 74/1171+111, the
  entity-dialogs.tsx header comment, AGENTS' chart bullet).
- **Gate**: lint 0/0 (enforced) · tsc 0 · **1171/1171 unit (74
  suites, +5)** · build clean · **111/111 e2e on a fresh CI=1 boot**
  (all 7 mobile-nav checks green).
- **LIVE**: the N-51a end-to-end probe (created on a trailing
  December cell through the dialog → the chip renders → flip away +
  back → **the chip PERSISTS** [the network log: the November window
  `to=2026-12-12`, the new bound] → deleted via the agenda ⋮ menu →
  zero residue, 12 events pristine). Mid-battery incident fully
  diagnosed: a ZOMBIE dev server from a prior session had silently
  owned :3000 at intake (the fresh boot died on EADDRINUSE behind
  it); the pre-restart probe through the zombie accidentally
  demonstrated the PRE-FIX symptom live (the chip vanishing after
  the flip — a perfect A/B) before the pkill + fresh boot. The
  drawer both directions (288px portal, 8/8 truly visible, dual
  lock; Escape → visibility:hidden + 0/8 [with
  `{visibilityProperty:true}`] + unlocked); zero 390px overflow on
  all ten routes; NO Tailwind v4 bug (blur(4px) + the exact pinned
  shadow); the runtimeDatabaseUrl re-anchor proven working under
  bun by direct probe.
- **Screenshots**: 02/11/12 re-captured +
  **60-calendar-trailing-cells NEW** (the November 2026 view with
  the Dec 1-5 trailing cells + the probe chip on Dec 2; the first
  viewport capture cut the grid at the fold — re-captured with the
  month card scrolled into view). **60 VLM-verified 4/4 PASS**.
- **Docs**: README (badge 1282 + the session-51 paragraph + the
  suite list + counts); AGENTS (1171/111 + the session-51 block +
  the chart bullet); CLAUDE (1171 ×3 + the suite entry); PAD (the
  s51 row / 74 suites / 1171+111 / the two carriers / the checklist
  / the command table); SKILL **v1.48.0** (frontmatter +
  project_state + the H1 + the new §16aq); `docs/session_95.md`;
  this record; both worklogs. `.env`/`.env.example` re-verified (no
  env surface change).
- **Shipped**: commit on main + the SSH-wrapper push to
  `git@github.com:nordeim/neo-crm.git` (the operator ed25519,
  shredded after — the s43-s50 runbook).
