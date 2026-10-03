Continuing the operator's standing brief. The workspace refreshed
(fresh `git clone` — the sandbox had been reset; `main` @ `75bda52`
= the session-46 code at `2aee8bb` + the operator's
`docs/session_86.md` transcript commit). Session 46 confirmed SHIPPED
(the commit + the verified push + the shredded key, all recorded in
the operator's transcript) — this session is **session 47** (docs
session_87.md).
The five core docs re-read (AGENTS/CLAUDE/README/PAD/SKILL v1.43.0),
then the session docs — `docs/session_85.md` (the s46 record),
`docs/session_86.md` (the operator's transcript), the session-46
parity plan with its execution record, and the worklog tail.
Environment verified: `.env` created from `.env.example` (+ a fresh
`AUTH_SECRET`), `db:push` + `db:seed` run — the database pristine
(15/24/10/23/12 + 4 users, counted via the absolute-URL Prisma
probe), the dev server healthy on :3000, `agent-browser 0.38.1`
ready, `skills/` excluded from lint/tsc/vitest by the established
config trio.
**Baseline gate GREEN: lint 0/0 (enforced) · tsc 0 · 1119/1119 unit
(63 suites)** — exactly the documented state.
The standing drift re-sweep (43rd session) BEFORE planning: the
reference bundle fresh-fetched + md5-compared — **IDENTICAL**
(`a70a637fcf1d4291da8e0d965676dc11`, 1,631,071 bytes — the
EIGHTEENTH consecutive stable session). Logged into the reference
with the operator credentials: demo data still zero (43rd — Total
Leads 0, "No upcoming activities", empty Recent Deals); the
mobile-nav census at a TRUE 390px — the reference's defect stands
(NAV w=0, 8 links in DOM, 0 visible, no hamburger). OUR clone's
drawer verified live in every direction: OPEN via the REAL trigger
("Open navigation menu", 36×36, visible) → 8/8 links truly visible
in the SECOND nav (the drawer — getClientRects + computed
visibility; the desktop sidebar is the w=0 first) + dual scroll-lock
(body AND main hidden) + the trigger's `aria-expanded:"true"`;
Escape → 0 visible + `inert` on the fixed inset-0 container +
unlocked + `aria-expanded:"false"`. Zero 390px overflow on all nine
routes (both Dashboard casings). NO Tailwind v4 bug surfaced (the
standing token contract re-verified: literal-hex `@theme`, the
re-pinned `--shadow-sm`/`--blur-sm`, the vendored tw-animate.css,
the `@tailwindcss/postcss` wiring; tailwindcss 4.3.3).
Dispatching the two parallel audit agents per the established
protocol (47-a: the session-46 re-audit with fresh eyes; 47-b: the
deferred-findings graduation audit).
Both audits returned: **zero regressions, zero graduations.** 47-a
verified all seven session-46 fix families GENUINE (the pins
non-vacuous — mechanically proven in a c706f01 worktree: exactly 24
failed there, 30/30 at HEAD; zero suppressions in the diff; the
full suite 1119/1119). 47-b re-confirmed all 13 standing-ledger
items at file:line (benign line drift only) + the four deferred
pointers, with the fresh-eyes findings: **F-47a (MED)** the
dashboard's five export affordances dead-since-s29 —
`page.tsx:120-123` + `:133` call
`downloadFile("/api/export?type=…&download=1")` but the s29
re-scoped route 400s every non-report type, and `downloadFile`
sets `window.location.href`, so every click NAVIGATED the browser
to the raw 400 JSON body (zero e2e coverage — how 18 green
sessions missed it); **F-47b (LOW)** the account-insights activity
icons vocabulary-dead — the dialog compared Capitalized
`"Email"`/`"Call"` against our lowercase storage, every row fell to
the purple CalendarDays fallback; **F-47f (LOW)** the leads
inline-edit trio fire-and-forget (the F-46a convention class,
missed because onChange arrows, not async/awaits); F-47c (INFO,
documented Mke parity — the lead edit dialog's 4-option Status
select renders blank for won/lost/negotiation/proposal leads);
N-47d (the three entity-dialogs edit-mode branches dead-in-practice)
+ N-47e (the CONTACT_SOURCES header comment contradiction) INFO.
Every headline claim manually validated at file:line this session
(the five sites + the route guard + the navigation seam + the
REFERENCE's own dead trio bundle-verified — its header buttons
carry NO onClick; the six Capitalized comparisons + the vocabulary
on both sides — the reference stores Capitalized
`["Call","Email","Meeting","Task","Note"]` so ITS dialog works,
ours stores lowercase so OURS must compare lowercase; the three
onChange arrows + updateLead's string-error envelope; the topbar's
dead import block vs its 10 Menu* usages). The pin blast radius
checked (dashboard-contracts pins the trio's LABELS not handlers;
account-surfaces pins the tint classes — kept verbatim;
leads-inline pins the call shapes — kept verbatim inside the
`.then` wrap; zero pins on the topbar imports) and the e2e census
clean (no e2e clicks the dashboard exports, the insights activity
rows, or the leads inline controls). The plan written
(`docs/plans/2026-10-04-session47-parity-remediation.md`).
**RED phase**: the pins written — `tests/dashboard-export.test.ts`
(6), `tests/insights-vocabulary.test.ts` (2 — one the happy-path
regression guard, green through RED by design), 
`tests/leads-inline-feedback.test.ts` (3),
`tests/topbar-import-hygiene.test.ts` (1). **RED confirmed:
exactly 11 failures** (the planned 12 = 11 RED pins + 1 regression
guard, the s45-precedent arithmetic). Full suite through RED: 11
failed / 1120 passed — all pre-existing checks green.
**GREEN phase — the four families:** P1 the dashboard export
rewire (all five affordances to the CLIENT-side entity-export
family — the pages' own conventions verbatim: leads
`unquotedHeaderCsv` 8-col `leads_ISO.csv`, contacts `toQuotedCsv`
7-col `contacts_ISO.csv` + zero-guard, accounts `toQuotedCsv`
10-col `accounts_ISO.csv` + zero-guard, activities the settings
raw-dump `activity_ISO.csv`; the store's four slices destructured;
`downloadFile` → `downloadBlob`; zero `/api/export` references
remain; ONE new download e2e closing the coverage gap); P2 the
insights icon vocabulary (the six comparison sites lowercased; the
tint classes + icon mapping VERBATIM); P3 the leads inline-edit
feedback (the three `.then(onLeadEditResult)` chains + ONE shared
500 ms trailing debounced failure toast + the unmount cleanup —
the s46-P2 lesson applied so a failing per-keystroke burst
collapses into a single "Could not update lead"); P4 the topbar
dead-import removal. Four pins retargeted mid-GREEN (the s45/s46
precedent — anchor corrections only: the DropdownItem anchor lands
AFTER the onClick → backward slices; the bare handler reference
has no call parens; the filters popover shares the input types →
aria-label anchors; the cleanup-only arrow is `() => () =>`, not
`return () =>`).
**FULL GATE GREEN: lint 0/0 (enforced) · tsc 0 · 1131/1131 unit
(67 suites, +12 tests) · build clean · 109/109 e2e on a fresh
CI=1 boot** — the new dashboard-export download e2e included
(#77, 2.0s: the menu's Leads item + the primary Export both
download `leads_ISO.csv` with the URL staying `/`); all 7
mobile-nav checks green.
LIVE verification battery on the dev server (the definitive runs):
the dashboard export menu's FOUR items each download their CSV —
`leads_2026-10-03.csv`, `contacts_2026-10-03.csv`,
`accounts_2026-10-03.csv`, `activity_2026-10-03.csv` (blob-anchor
instrumentation; the menu auto-closes per item — the s29
Popover.Close behavior — so one menu-open per item) with the URL
STAYING `/` (was the raw 400 JSON navigation); the primary Export
fires the one-click leads export; the insights dialog on Al Noor
Manufacturing renders "Overdue: pricing call-back" (call) with the
GREEN Phone box and "Onsite workshop at Al Noor" (meeting) with
the purple CalendarDays fallback (was all-purple — the vocabulary
now matches the storage); the offline leads inline-edit burst — 5
rapid keystrokes → maxConcurrentToasts EXACTLY 1 (the debounced
"Could not update lead · Network error — check your connection
and try again"), the value reverting to server truth on the online
reload; **zero probe residue: 15/24/10/23/12 pristine** (no odd
values persisted — the offline PUTs never landed).
Screenshots: 02/11/12 re-captured (11/12 byte-identical to HEAD —
the deterministic seed; 02 within the established
chart-animation/raster noise) + **55-insights-activity-icons NEW**
(the F-47b fix's exact domain surface — the Account Insights
dialog's Recent Activities tab with the green Phone icon row,
1440×900). 02 + 55 VLM-verified (02: the six KPI cards + sidebar +
both charts, no defects; 55: the Al Noor insights modal with the
stat cards + the GREEN phone-glyph icon box on "Overdue: pricing
call-back" + the three tabs, no defects).
Docs realignment: the plan's execution record; README (badge 1240
+ the session-47 paragraph + the four new suites + the e2e count);
AGENTS (1131/109 + the session-47 block); CLAUDE (1131 ×3 + 109
×2); PAD (the s47 row / 67 suites / 1131+109 / the golden-path 91
/ the checklist / the command table); SKILL v1.44.0 (frontmatter +
project_state + the H1 + the new §16am); this session record; both
worklogs. `.env`/`.env.example` re-verified (no env surface
change; DATABASE_URL file:../db/custom.db with db/ at the repo
root).
Commit on main + the SSH-wrapper push to
`git@github.com:nordeim/neo-crm.git` (the operator ed25519,
shredded after the push — the s43-s46 runbook).

**The headline**: the dashboard's five export affordances — dead
for 18 sessions, every click navigating to a raw 400 JSON body —
now build the client-side CSVs with the pages' own conventions
verbatim, guarded by a new download e2e; the insights dialog's
activity icons match our storage vocabulary (email/call render
their blue Mail / green Phone icons, was all-purple); the three
leads inline edits toast their failures through one debounced
window (a failing typing burst = one toast); the topbar's dead
Dropdown import block removed.

**Gate**: lint 0/0 · tsc 0 · **1131/1131 unit (+11 RED-first pins
+ 1 regression guard)** · **109/109 e2e** (fresh boot, +1) · 43rd
drift-sweep clean (18th stable reference bundle) · live-verified
both directions, zero probe residue · docs at SKILL v1.44.0 +
`docs/session_87.md`.

**Suggested next**: the two operator decisions remain open — the
CSV formula-injection posture (a/b/c, covering both csv.ts and
entity-export.ts) and the source-vocabulary reconciliation (five
disagreeing surfaces + the src-dead CONTACT_SOURCES whose header
comment now contradicts the s28 correction beneath it). New
deferred notes from this session: F-47c (the lead blank-select
parity note), N-47d (the dead entity-dialog edit branches — wire
or remove), N-47h..l (the s46-a INFO family). The mobile-nav and
Tailwind v4 checks both passed clean again — the drawer works in
every direction and no v4-related bug surfaced.
