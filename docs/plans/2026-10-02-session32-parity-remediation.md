# Session 32 Plan — the currency-format + period-wire-id remediation

Date: 2026-10-02 · Branch: `main` · Base: `edb3723` (docs/session_56.md only — zero app-code drift)

## Context

Session-31 closed the LAST s51 pointer (the Opportunity-split — commits
`735f29f` + `eeb16e1`, gate 779/779 unit · 106/106 e2e, SKILL v1.28.0). The
s55 Next-steps named three pointers: the base44-only AI extraction (no action
possible), the standing drift re-sweep, and the REPORT_PERIODS wire-id
divergence documented in §16w. This session closes the third + a fresh
currency-format decode found in the re-sweep.

## Audit results

### Standing layers — 28th consecutive session, NO DRIFT

- Baseline gate GREEN FIRST TRY: lint 0/0 · tsc 0 · 779/779 unit · build
  clean · 106/106 e2e — matching the docs exactly.
- The reference bundle BYTE-IDENTICAL to the s30/s31 cache
  (`/assets/index-DZ-xbrIm.js`, 1,631,071 bytes, md5
  `a70a637fcf1d4291da8e0d965676dc11`) — no redeploy, every s29/s30/s31
  bundle contract intact.
- The reference at a TRUE 390px viewport (positional args — the §16w
  lesson): 8 nav links in the DOM, **0 visible** (nav box w=0), no
  hamburger — the mobile-nav defect STANDS.
- Our drawer spot-verified LIVE on the dev server (the REAL "Open
  navigation menu" trigger → 8 links visible + focus inside + body scroll
  lock; Escape → closed + unlocked + aria-expanded false).
- Zero 390px horizontal overflow on all nine reference routes.
- The reference demo data still ZERO (28th session) — parity targets
  structure + the bundle's literal formulas.
- The scandihaven ref stable at `cb0002a` (no new commits).

### The NEW decode — the currency-format layer + the period wire ids

The reference renders EVERY currency figure through a LITERAL scale
formula — never a magnitude-branching formatter. Three families:

1. **The dashboard's currency KPI cards (Eke)** — all three are LITERAL
   `/1e3` formulas:
   - Deals Closed: `$${(dealsClosedValue/1e3).toFixed(1)}k` — ALWAYS the
     k form: "$0.0k" at zero, "$337.0k" at 337k, "$1400.0k" at 1.4M
     (NEVER the M form, NEVER a bare number).
   - Revenue This Month: `$${(revenueThisMonth/1e3).toFixed(1)}k` — same.
   - Sales Target: `$${(salesTarget/1e3).toFixed(0)}k` — ZERO decimals:
     "$0k" at the hardcoded-0 quirk (visible on every load — both apps
     render the 0 target), "$50k" at 50000.
   OURS routes all three through `formatCompactCurrency()`'s default —
   the magnitude-branching formatter: bare "$0" sub-1k, "$1.4M" ≥1M.
   Divergence VISIBLE TODAY on the Sales Target card ("$0" vs "$0k"),
   and at zero-data (post-reset: "$0" vs "$0.0k") / ≥1M states.
   (The pipeline chips + Top Reps `$Xk` + Recent Deals `$ toLocaleString`
   were already mirrored as literals in s31 — verified at parity.)

2. **The accounts revenue family** — the LITERAL `/1e6` M form:
   - The Total Revenue KPI (zv card): `$${(totalRevenue/1e6).toFixed(1)}M`
     — "$0.0M" at zero, "$0.5M" at 500k (NEVER the k form).
   - The table row's Revenue cell: `$${(annual_revenue/1e6).toFixed(1)}M`
     or "-" — already mirrored at accounts-page.tsx:433 ✅.
   OUR KPI (line 239) routes the compact default: "$77.5M" matches at
   ≥1M but "$0" at zero (vs "$0.0M") and "$500.0k" sub-1M (vs "$0.5M").
   Our S8-3 Cards-view cell (line 346) shows "$900.0k" at Brightline's
   seeded 900k — the reference convention renders "$0.9M".

3. **REPORT_PERIODS wire ids (the §16w documented divergence)**: the
   bundle's reports period select is
   `today/thisWeek/thisMonth/quarter/ytd/all` — ours (s25) is
   `today/week/month/quarter/ytd/all`. The s25 test's own comment admits
   week/month were "inferred from the pattern" (only today/quarter/ytd
   were live-verified via saved-report probes; the bundle decode now
   proves the truth). Same labels, same behavior — only the wire ids
   differ. The ids flow: the reports page state → `fetchReports` →
   `?period=` → both API routes' periodStart + the export URL + the
   SavedReport dateRange (localStorage).

Verified at parity (no action): the leads KPI subvalues
(`$${v.toLocaleString()}` — our formatCurrency ✅), the contacts/
activities KPIs (counts, no currency), the Ece insights' `$X.XM`
(s31 ✅), the reference's topbar "Search Anything..." input (DEAD —
no value/onChange; our functional search is the documented non-mirror),
the reference's accounts View/Format selects (DEAD — pinned to literal
"table"/"standard"; our S8-3 functional switcher is the documented
superset).

## The remediation — S32-P1..P5

- **S32-P1 — the format seam**: extend `formatCompactCurrency`
  (src/lib/format.ts) with a `scale: "k" | "M"` option — the literal
  mirror of the reference's formulas: scale "k" →
  `$${(v/1e3).toFixed(decimals)}k` at ANY magnitude (0 → "$0.0k",
  1.4M → "$1400.0k"); scale "M" → `$${(v/1e6).toFixed(decimals)}M` at
  any magnitude (0 → "$0.0M", 900k → "$0.9M"). The default (no scale)
  keeps the current magnitude-branching behavior — the topbar hint +
  the s1-s24 pins ride it unchanged.
- **S32-P2 — the dashboard KPI values** (src/app/(app)/page.tsx):
  Deals Closed + Revenue This Month → `{ scale: "k" }`; Sales Target →
  `{ scale: "k", decimals: 0 }`.
- **S32-P3 — the accounts revenue family** (accounts-page.tsx): the
  Total Revenue KPI → `{ scale: "M" }`; the Cards-view cell →
  `{ scale: "M" }` (the table cell's literal stays).
- **S32-P4 — the REPORT_PERIODS wire ids**: constants.ts →
  thisWeek/thisMonth; the reports route's periodStart cases; the export
  route's periodStart cases; saved-reports.ts doc comments + a
  `normalizeSavedPeriod()` shim (legacy "week"→"thisWeek",
  "month"→"thisMonth", invalid→"quarter") wired into the reports page's
  onLoad so stale localStorage entries keep working; report-periods.test.ts
  pins updated (the s25 inference note corrected).
- **S32-P5 — the gate + deliverables**: lint 0/0 · tsc 0 · unit
  (779 + new) · build · e2e (106) · LIVE verification on the restarted
  dev server (the "$0k" target + "$337.0k"/"$126.0k" cards + the
  accounts "$77.5M"/"$0.9M" + the reports period round-trip) · the
  screenshot set · docs realignment (README badge + the session-32
  paragraph, AGENTS counts + the contract block, CLAUDE counts + the
  format seam, PAD test matrix, SKILL v1.29.0 §16x + frontmatter +
  project_state, docs/session_57.md, this plan's execution record, both
  worklogs) · .env/.env.example re-verified · commit + SSH-wrapper push.

## Validation gates

- RED-first: the new format-scale + period-id checks must fail against
  the current code (the s29/s30/s31 TDD doctrine).
- GREEN: lint 0/0 · tsc 0 · unit (779 + new) · build · e2e (106).
- LIVE: the seeded dashboard/accounts render the literal formulas'
  values; the reports period select + saved-view load work end-to-end.

## Deferred (documented, not this session)

The Scan Card / Import AI extraction (base44-only), the Opportunity
create/edit UI (absent on BOTH sides — the read-only entity mirrored),
the reference's dead topbar search + dead accounts View/Format selects
(our functional supersets, documented non-mirrors).

---

## EXECUTION RECORD (2026-10-02, post-gate)

Executed as planned, S32-P1..P5 all landed:

- **S32-P1**: the `scale: "k" | "M"` option in `formatCompactCurrency`
  (src/lib/format.ts) — the literal mirrors at ANY magnitude; the
  no-scale default keeps the legacy magnitude branching.
- **S32-P2**: the dashboard's three currency KPI call sites —
  Deals Closed + Revenue This Month `{ scale: "k" }`, Sales Target
  `{ scale: "k", decimals: 0 }` (the "$0k" quirk now byte-exact).
- **S32-P3**: the accounts' Total Revenue KPI + the Cards-view cell at
  `{ scale: "M" }` (the table cell's literal stays) — "$77.5M" / "$0.9M"
  live-verified.
- **S32-P4**: the REPORT_PERIODS wire ids (today/thisWeek/thisMonth/
  quarter/ytd/all) in constants + both API routes' periodStart;
  `normalizeSavedPeriod()` (week→thisWeek, month→thisMonth,
  unknown→quarter) in saved-reports.ts wired into the reports page's
  onLoad; the s25 test pins rewritten (the inference note corrected).
- **S32-P5**: RED 14 first (13 failed / 68 passed); GREEN at
  **793/793 unit (+14) · 106/106 e2e** · lint 0/0 · tsc 0 · build
  clean; LIVE-verified on the restarted dev server (the $0k target,
  the $0.9M/$77.5M accounts, the thisWeek round-trip, the stale-"week"
  saved-view load → "This Week", the API boundary both directions —
  thisWeek 200 / legacy week 400); 6 screenshots (40 new, 02 + 40
  VLM-verified); docs at SKILL v1.29.0 (§16x); .env/.env.example
  re-verified.
- Standing layers: 28th session, NO DRIFT (the bundle md5-identical,
  the reference's mobile-nav absence at a TRUE 390px, our drawer live,
  zero overflow, the demo data still zero).
- Gate-caught hazards: the float-rounding test trap
  ((950/1000).toFixed(1) = "0.9" — the expectation must compute the
  way the formula does) and the comment-anchor trap (stripComments
  removes comment anchors — re-anchor source pins on code).
