# Session 57 Log — the currency-format + period-wire-id remediation (session-32)

The workspace refresh: `git pull` brought `eeb16e1 → edb3723` (`docs/session_56.md`
— the operator's session-31 transcript only, zero app-code drift). The full doc
set reviewed (SKILL v1.28.0's §16w + project_state, AGENTS/CLAUDE/README/PAD at
the 779+106 counts) and the seams verified in code before the baseline gate.
The environment: `.env` `file:../db/custom.db` + `db/` at root verified, the
bundle cache alive (`scripts/reference-bundle.js` outside the repo tree), the
scandihaven ref alive at `cb0002a`, agent-browser 0.38.1, the ssh shim intact.

Baseline gate: **lint 0/0 · tsc 0 · 779/779 unit · build clean · 106/106 e2e**
— first try, no flakes.

Standing layers re-verified (28th session) — NO DRIFT: the reference bundle
BYTE-IDENTICAL to the s30/s31 cache (`/assets/index-DZ-xbrIm.js`, 1,631,071
bytes, md5 `a70a637fcf1d4291da8e0d965676dc11` — no redeploy); the reference at
a TRUE 390px viewport (positional args — the §16w lesson re-applied) still
ships NO navigation (8 links in the DOM, 0 visible, the nav box w=0, no
hamburger); our drawer spot-verified live on the dev server (the REAL "Open
navigation menu" trigger → 8 links + focus inside + body scroll lock; Escape →
closed + unlocked + aria-expanded false); zero 390px overflow on all nine
reference routes; the reference demo data still ZERO (28th session).

**The NEW audit — the currency-format layer + the period wire ids.** The
reference renders EVERY currency figure through a LITERAL scale formula,
never a magnitude-branching formatter. Three families decoded from the
bundle: (1) the dashboard's currency KPI cards are ALWAYS
`$${(v/1e3).toFixed(1)}k` (Deals Closed, Revenue This Month) and
`$${(v/1e3).toFixed(0)}k` (Sales Target — the "$0k" hardcoded-0 quirk,
visible on every load) at ANY magnitude — "$0.0k" at zero, "$1400.0k" at
1.4M, NEVER the M form, NEVER a bare number — ours routed all three through
the compact default (bare "$0" sub-1k, "$1.4M" ≥1M); (2) the accounts'
revenue family is ALWAYS `$${(v/1e6).toFixed(1)}M` (the Total Revenue KPI +
the table cells; ours matched at ≥1M but showed "$0" at zero and "$900.0k"
at Brightline's seeded 900k in the Cards view); (3) the REPORT_PERIODS wire
ids are `today/thisWeek/thisMonth/quarter/ytd/all` — the s25 week/month ids
were INFERRED (the s25 test's own comment admits it; only today/quarter/ytd
were live-verified via saved-report probes), and the bundle's i3e reports
filter (`dateRange==="thisWeek"?Zu(O):..."thisMonth"?mK(O)...`) disproves
them. PLUS the dead-control decode, verified live: the reference's topbar
"Search Anything..." input has NO value/onChange (purely decorative — our
functional search is the documented non-mirror) and its accounts View
(Table/Cards) + Format (Standard/Detailed) selects are PINNED to literals
(clicking "Cards" leaves the trigger at "Table" — our S8-3 functional
switcher is the documented superset). Verified at parity: the leads KPI
subvalues ($ toLocaleString), the s31 pipeline chips + Top Reps + Recent
Deals literals, the contacts/activities KPIs (counts), the Ece $X.XM, the
reports uppercase-K variants.

TDD Phase A: **14 red checks** across the four suites — format (the 5 new
fixed-scale checks), dashboard-contracts (the 3 KPI formula pins),
account-surfaces (the 3 M-scale pins), report-periods (the rewritten id pins
+ the normalizeSavedPeriod migration + the onLoad wiring) — RED confirmed (13
failed / 68 pre-existing passes; the 14th was the passing legacy-default
guard). Phase B: the `scale: "k" | "M"` option in `formatCompactCurrency`
(the no-scale default keeps the legacy magnitude branching — the topbar hint
+ the s1-s24 pins ride it unchanged), the three dashboard call sites
(`{ scale: "k" }` ×2 + `{ scale: "k", decimals: 0 }`), the accounts KPI +
Cards-view cell (`{ scale: "M" }`), the REPORT_PERIODS ids (thisWeek/
thisMonth) in constants + both API routes' periodStart, and
`normalizeSavedPeriod()` in saved-reports.ts wired into the reports page's
onLoad (week→thisWeek, month→thisMonth, unknown→quarter — a Load never
400s). Gate-caught: the float-rounding test trap ((950/1000).toFixed(1) is
"0.9" — the expectation must compute the way the formula does) and the
comment-anchor trap (the Cards-view pin first anchored on the "S8-3
functional superset" COMMENT, which stripComments removes — re-anchored on
the `view === "Cards"` code).

Phase C gate: **lint 0/0 · tsc 0 · 793/793 unit (+14) · build clean ·
106/106 e2e** + LIVE verification on the restarted dev server: the dashboard
(Deals Closed **$337.0k**, Revenue This Month **$126.0k**, Sales Target
**$0k + 0%** — the quirk now byte-exact, Conversion 29.2%), the accounts
(Total Revenue **$77.5M**, Brightline's 900k → **$0.9M**), the reports (the
six-option period vocabulary, the thisWeek round-trip live-exercised →
correctly empty, the stale-"week" saved view injected + loaded → "This
Week" applied, the API boundary verified both directions — thisWeek 200 /
legacy week 400), the mobile dashboard at a TRUE 390px ($0k + $337.0k).

Phase D: **6 screenshots** (02-dashboard, 03-accounts, 08-reports re-captured
+ **40** the reports period dropdown expanded — the new shot — + the 11/12
mobile standing shots; 02 + 40 VLM-verified: the "$0k 0%" target + the exact
six options). `.env`/`.env.example` re-verified (no new env surface). Docs
realigned: README badge 899 + the session-32 paragraph, AGENTS counts + the
session-32 contract block (the s31 KNOWN-COSMETIC-DIVERGENCE note replaced
with its closure), CLAUDE counts + the report-periods re-scope + the
currency-DISPLAY paragraph rewrite, PAD the session-32 test row / 793+106,
SKILL **v1.29.0** §16x + frontmatter + project_state, this transcript, the
plan's execution record, both worklogs.

**What happened:** the reference's literal-scale currency doctrine mirrored
through the format seam (every dashboard KPI and accounts revenue figure now
renders the exact formula output at any magnitude), the s25 period-id
inference corrected to the bundle's wire ids with the localStorage
migration shim, and the reference's dead topbar search + dead accounts
view/format selects confirmed live as documented supersets on our side.
**793/793 unit · 106/106 e2e · 6 screenshots** — docs realigned at SKILL
v1.29.0.

**Next steps:** the Scan Card / Import AI extraction stays base44-only
(documented divergence), the Opportunity create/edit UI stays absent on BOTH
sides (the reference ships none — read-only entity, mirrored), and the
standing drift re-sweep on the next live visit.
