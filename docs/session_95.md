Session 51 — the calendar window + KPI-baseline session
(docs/session_95.md, the s51 record; the operator's brief =
docs/session_94.md's standing cycle). The workspace had been RESET
(the repo folder was gone; the sandbox `db/custom.db` +
`worklog.md` survived) — the repo freshly cloned to
`/home/z/my-project/neo-crm`, `main` @ `b7c928c` (the session-50
code `0d5dbab` + the operator's `docs/session_94.md` transcript
commit). The surviving `db/custom.db` restored into the clone
(15/24/10/23/12 + 4 users, API-counted — pristine); `.env` rebuilt
per contract (DATABASE_URL `file:../db/custom.db`).

The five core docs re-read (AGENTS/CLAUDE/README/PAD/SKILL v1.47.0),
then the session docs (session_93, the s50 plan + execution record,
the worklog tail, session_94). **Baseline gate GREEN: lint 0/0
(enforced) · tsc 0 · 1166/1166 unit (73 suites)** — the documented
state exact. The skills/ exclusion verified in all three configs.

The standing drift re-sweep (47th session): the reference bundle
fresh-fetched + hash-compared — **byte-identical** (size 1,631,071 +
md5 `a70a637fcf1d4291da8e0d965676dc11` exact — the 22nd consecutive
stable session). The reference census (47th): the demo data still
zero (KPIs "0"/"$0.0k"/"$0.0k"/"$0k"/"0%"/"0"); the mobile-nav
defect stands at a TRUE 390px (nav w=0, 8 links in DOM, 0 visible,
no hamburger, scrollW 390) — agent-browser live-verified.

The two parallel audit agents dispatched (Tasks 51-a/51-b) + every
headline claim manually validated at file:line: **51-a** — all six
session-50 checklist items GENUINE (the N-47d retirement verified
with the create field sets byte-preserved MECHANICALLY — AccountForm
1522/1522 chars, LeadForm 1738/1738 exact; EventDialog/ActivityDialog
untouched; the pins re-proven non-vacuous in a `c543b36` worktree:
create-dialog-single-mode **4 failed | 2 passed** there — the
documented arithmetic EXACT — plus the re-anchored leads-inline pin
itself RED pre-fix [**1 failed | 24 passed**] — a FIFTH mechanical
witness the s50 records did not claim; 31/31 combined at HEAD;
blast-radius families 264/264; zero suppressions); **51-b** — ZERO
graduations (**13/13 CONFIRMED, 8th consecutive session**; the only
drift line-number translation from the s50 retirement), the INFO
family unchanged, the counts exact BY RUN (1166/1166;
`--list` → 111 in 4 files), the operator decisions standing, and the
fresh-eyes sweep on reports/settings/calendar producing the session's
findings. **The new findings (all validated at file:line)**: N-51a
(LOW-MED, CODE — the calendar month-flip fetch window missed the
trailing next-month cells), N-51b (the KPI trend baselines mixing
filtered/unfiltered populations), N-51c (INFO — the DealTables/
DealsTables naming pair, KEEP), N-51d (the fresh workspace's empty
AUTH_SECRET, local env), N-51e (PAD's "(5 checks…)" vs the actual 7),
N-51f (PAD's frozen repo-tree counts), N-51g (the entity-dialogs.tsx
header comment stale after the s50 retirement), N-51h (AGENTS'
chart-placeholder bullet contradicting the s10 reversal).

The two standing operator decisions re-verified UNCHANGED (the CSV
formula-injection posture (b) + the source-vocabulary
documented-parity reconciliation — landed s48, the bundle
byte-identical for the 22nd consecutive session; nothing to
re-litigate).

The plan written
(docs/plans/2026-10-04-session51-parity-remediation.md) with the
families S51-P1..P4. **RED**: tests/calendar-fetch-bounds.test.ts —
the behavioral pins import the seam dynamically (clean per-it RED);
**exactly 4 failures + 1 green-through-RED guard** (one pin-shape
correction vs the plan's prediction: the from-overage assertions
folded into its 1-2, so 5 its not 6 — the s50 precedent class); full
suite through RED: **4 failed / 1167 passed** — all 1166 pre-existing
checks green.

**GREEN (S51-P1)**: P1a — the new pure seam
`calendarFetchBounds(year, month)` in `src/lib/format.ts` (`from` =
the deliberate full-prev-month over-coverage; `to` = the UNTRIMMED
42-cell Sunday-anchored grid's final cell — always ≥ the trimmed
render's last day), the calendar effect rewired to it, the `days`
memo untouched; P1b — the three KPI baselines
(`yesterdaysEvents`, `meetingsLastWeek`, `callsLastWeek`) switched
`events.filter` → `visible.filter` (no-filter behavior
byte-identical; the Total Events pseudo-delta + trend() untouched).
The FINAL pin file re-proven mechanically non-vacuous in a pre-fix
`b7c928c` worktree: **4 failed | 1 passed** there, **5/5** at the
fix. **S51-P2**: the four docs/comment carriers (PAD 5→7 + the
repo-tree counts → 74/1171+111, the entity-dialogs header comment,
AGENTS' chart bullet → the s10 contract).

**FULL GATE GREEN: lint 0/0 (enforced) · tsc 0 · 1171/1171 unit (74
suites, +5) · build clean · 111/111 e2e on a fresh CI=1 boot** (all 7
mobile-nav checks green).

**LIVE verification battery on the dev server** — with a mid-battery
environment incident fully diagnosed: the intake dev boot had silently
died on EADDRINUSE behind a ZOMBIE dev server from a prior session
still bound to :3000 (its own stale bundle + the old sandbox DB via
the absolute URL in the leftover `/home/z/my-project/.env`); the
pre-restart probe through the zombie accidentally demonstrated the
PRE-FIX symptom live (the trailing-cell event vanishing after a month
flip — a perfect A/B), before the pkill + fresh boot put the fixed
code on the repo DB. Verified on the fixed server: **the N-51a
end-to-end probe** (an event created on a trailing December cell
through the New Event dialog → the chip renders on the Dec 2 cell →
flip away to October and back to November → **the chip PERSISTS**
[the network log confirms the November window `to=2026-12-12` — the
new untrimmed bound] → deleted via the agenda ⋮ menu with the confirm
→ zero residue, 12 events pristine); the KPI no-filter parity; the
drawer both directions at a TRUE 390px (the trigger → the 288px
portal nav with 8/8 truly visible links + aria-expanded + dual
scroll-lock; Escape → visibility:hidden + 0/8 truly visible
[with `{visibilityProperty: true}` — plain checkVisibility() does
NOT test visibility] + unlocked); **zero 390px overflow on all ten
routes** (both Dashboard casings); **NO Tailwind v4 bug** (the token
contract: `--blur-sm` computes blur(4px), `--shadow-sm` the exact
pinned rgba(0,0,0,0.05) 0px 1px 2px); zero probe residue.

Screenshots: 02/11/12 re-captured (the standing set) +
**60-calendar-trailing-cells NEW** (the fix surface at 1440×900: the
November 2026 view with the December 1-5 trailing cells + the probe
event chip on Dec 2 — the first viewport capture cut the grid at the
fold; re-captured with the month card scrolled into view).
**60 VLM-verified 4/4 PASS** (the November title, the muted December
trailing cells, the probe chip on Dec 2, the normal chrome).

Docs realignment: README (badge 1282, the session-51 paragraph, the
suite list + calendar-fetch-bounds, the counts), AGENTS (1171/111 +
the session-51 block + the S51-P2h chart bullet), CLAUDE (1171 ×3 +
the calendar-fetch-bounds suite entry), PAD (the s51 row / 74 suites
/ 1171+111 / the two carrier fixes / the checklist / the command
table), SKILL **v1.48.0** (frontmatter + project_state + the H1 +
the new §16aq), this record, the plan's execution record, both
worklogs. `.env`/`.env.example` re-verified (no env surface change;
DATABASE_URL `file:../db/custom.db` with db/ at the repo root — the
runtimeDatabaseUrl re-anchor proven working under bun by direct
probe).

**The headline**: the calendar's month-flip fetch window is now a
pinned pure seam that covers everything the grid renders (the
trailing-cell events no longer vanish after a flip — LIVE-proven
with a create → flip → persist → delete round-trip), the KPI trends
measure symmetric populations, and the four docs/comment carriers
are aligned — all RED-first with the worktree proof, gated
1171/111, at documented parity with the 22nd consecutive stable
reference bundle.

**Gate**: lint 0/0 · tsc 0 · **1171/1171 unit (+4 RED-first pins + 1
regression guard)** · **111/111 e2e** (fresh boot) · 47th
drift-sweep clean (22nd consecutive stable reference bundle) ·
live-verified both directions, zero probe residue · docs at SKILL
v1.48.0 + `docs/session_95.md`.

**Suggested next**: the standing ledger (13 items, 8 sessions zero
graduations), the INFO family unchanged (F-47c, N-48c, N-48f, N-48j
— all triaged), N-51c KEEP documented, the drift re-sweep next live
visit, and the OPTIONAL month-flip trailing-cell e2e if the operator
wants the date-fragile coverage. Process lesson for every future
session: verify WHO owns :3000 at intake (`ss -tlnp`) — a zombie
server from a prior session serves stale code and a foreign DB.
