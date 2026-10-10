# Session 191 — the session-95 formal log (2026-10-10)

## Intake

The workspace was RESET — a fresh clone at `c215904` (the s94 ship
`2488878` + the operator's docs-only `session_190.md` addition). The
environment rebuilt from scratch: `.env` written
(`DATABASE_URL="file:../db/custom.db"` + a generated `AUTH_SECRET` +
`NEXT_PUBLIC_SITE_URL`) · `bun install` · `db:push` + `db:seed` · the
census MATCH (15/24/10/23/12 + 4 users). The platform `DATABASE_URL`
override hazard CONFIRMED on the fresh sandbox (it exports
`file:/home/z/my-project/db/custom.db` — a parent-of-repo path); all
session-95 repo operations ran under `env -u DATABASE_URL`.

Core docs absorbed: CLAUDE.md (full), AGENTS.md (head + the session
history), the SKILL frontmatter + project_state (v1.91.0),
`docs/session_189.md` + `docs/session_190.md` (the operator narrative)
+ the s94 plan + the worklog tail + the skills catalog. Session 94
shipped at `2488878`; my task is **Session 95** — the suggested nexts:
(1) the phone sweep on a ship cadence, (2) the TABLE family at 390,
(3) the sweep `--pages` filter — plus the operator's standing
instructions (audit, the two decisions, the parity iteration, the
mobile-nav verification, the SEO/sitemap check, screenshots, docs, the
SSH-wrapper push to `main`).

## Baseline

lint 0/0 · tsc 0 · 1832/1832 unit (102 suites) — exactly the s94 ship
state; build + e2e deferred to the post-fix gate (the one-gate
discipline).

## The standing layers (91st sweep, NO APP DRIFT)

Drift sweep #91: the reference bundle md5 `a70a637f…` EXACT
(1,631,071 bytes) — the **66th consecutive stable session**. The
desktop zero-data sweep reproduced the standing table (dashboard
0.32% · settings 4.73% · the rest 0.00–0.01%); the phone sweep
reproduced the s94 maiden table (the ~0.5% floor + settings 7.34%) —
ZERO new drift at BOTH viewports (the ship-cadence runs, the s94
suggested-next #1). Census #91: demo zero · desktop normal (256px/8
links) · the mobile-nav defect STANDS at TRUE 390×844 (nav w=0, 0
visible links, no menu button — the 16th consecutive).

## The audits

- **95-a (subagent)**: the s94 delta GENUINE — the phone-width mode
  verified end-to-end (the flags feed BOTH the capture context and
  the viewport-tagged dir; the seams untouched; 12/12 live; tsc 0
  with the uncast env), the non-vacuousness re-proven independently
  against `git show 7b43516:scripts/sweep.ts`, the docs counts
  verified against the live tree (badge 1964, CLAUDE 1832 ×4, PAD
  §11 all 24 rows, SKILL v1.91.0, the screenshots byte-exact). One
  real drift: **F-95a1** — the SKILL §5.6 CURRENT-STATE claim
  "page-layout.ts (300 lines; 37 checks)" vs the actual **1520 lines
  / 180 checks** (fixed this session); B-95a2–a9 borderline
  (historical-record wording, no action — B-95a8's `--max-diff=<pct>`
  header text fixed as part of S95-P0).
- **95-b (subagent)**: the graduation audit **13/13 GENUINE — zero
  graduations** (the ~52nd consecutive; the src tree byte-identical
  since the s94-b base). The CSV guard census: 17 sites, ZERO
  unguarded live-data builders. The source-vocabulary census CLEAN.
  The config layer + the SEO/sitemap layer VERIFIED (37/37 across
  the three SEO suites; the historical "47/47" figure counts
  csv-formula-guard's 10 in the four-suite sum — N-95b1's phrasing
  note). **F-95b1**: the 94-b worklog record misrecords ledger item
  13's first anchor (`:448-458` spans the contacts-arm LIVE trend
  row; the dead leads-arm row is `:424-429`, TrendStatCard at
  `:625`) — a citation correction carried forward (the worklog is
  append-only history), the construction intact at both true sites.

## The operator decisions (55th re-affirmation)

Both STAND, evidence re-verified live: **CSV posture (b)**
(guardFormulaPrefix + qq, the 17-site census, the (b)-vs-(c) line
unchanged) and **source-vocabulary parity** (raw storage, no
vocabulary introduced).

## The rotation (95-c) — the TABLE family at TRUE 390

Both apps at the zero-data state (ours via zero-data.ts, the seed
restored after):

- **The leads table: FULL GEOMETRY MATCH** — table 380px in the 358px
  scroll box in the 358px card; **thead STICKY top:0 h:63 bg white**;
  the 9 th widths [81,79,0,0,78,61,0,65,16] EXACT; thead y=1142
  EXACT; the LIVE sticky check (scroll main by 800 → the thead stuck
  at the container top) identical on both apps.
- **The contacts table: FULL MATCH** — 633px table in the 324px box
  in the 326px card; the 201px empty row identical. (Probing note:
  the contacts page scrolls its OWN inner column, not main.)
- **The accounts table: MATCH + one explained genus** — the table
  surface identical (472/43/85/y=1040 EXACT); the overflow MECHANISM
  differs (the reference's bare `flex-1` poke-out + main h-scroll vs
  our `min-w-0` in-box scroll) — visually equivalent at the sweep
  floor, ours the consistent pattern; documented as a STANDING
  EXPLAINED GENUS.

The interactive-surface program: dialogs s92 → popovers/menus s93 →
tabs s94 → **TABLES s95**.

## The drawer battery at TRUE 390 — FULLY GREEN

The corrected exact-selector protocol, re-verified and productized as
`scripts/drawer-battery-390.ts`: trigger (16,16) 36×36 · panel 288px
@ x0 computing rgb(37,99,235) · 8 links · focus inside · dual
body+main lock · navigate-close → **/Leads** with the full release ·
Escape-close · the resize-past-md lock release. One tooling decode on
the way: a pipeline sanitizer strips the literal `[h` two-char
sequence from DISPLAYED outputs (verify with od/python before
"fixing" a mangled-looking selector), and the nav-close wait must be
URL-based (the /Leads route is the s24 CAPITAL-route construction;
the dev server compiles it on first visit).

## The remediation (TDD — RED first)

- **RED**: the 4 new sweep-tool pins (the parsePagesArg subset pick
  in PAGES order, the no-flag default, the unknown-name fail-fast,
  the wiring + header doc) — 4 failed | 12 passed against the
  pre-fix source, exactly the new pin set.
- **Non-vacuousness stash-re-proven**: stash the implementation →
  4 failed | 12 passed → pop → 16/16.
- **GREEN (S95-P0)**: the pure `parsePagesArg` seam + the wiring
  through BOTH loops + the B-95a8 `--max-diff <pct>` header fix. The
  MAIDEN filtered run (`--pages leads,settings`): leads 0.00% +
  settings 4.73% — the standing values; the unknown-name fail-fast
  lists the valid names; the census MATCH after.
- **S95-P1**: the docs nanos — F-95a1 fixed (SKILL §5.6 → 1520
  lines / 180 checks); F-95b1's corrected anchors + N-95b1's
  four-suite phrasing carried in this session's docs.
- **S95-P2**: screenshots 139 (the leads sticky thead mid-scroll) +
  140 (the accounts table) + 141 (the contacts table) — VLM 5/5 +
  5/5 + 4/5 (one adjudication: 139's clipped-edge NO vs the
  DOM-verified shared horizontal-scroll genus). Two capture lessons:
  the tables sit below the 844px fold at seeded state (scroll into
  view), and the contacts page scrolls its OWN inner column.
- **S95-P3**: the docs — this log + the plan + its execution record +
  the worklog + the count realignment (README badge 1968 + the
  Tested row's --pages mention, AGENTS the counts + the §Session-95
  block, CLAUDE the counts ×4, PAD the s95 inventory row + the
  Total 102/1836, SKILL v1.92.0 §16ci + project_state + the H1) +
  the CLAUDE-count lockstep pin re-anchor (1832 → 1836).

## The gate

lint 0/0 · tsc 0 · **1836/1836 unit** (102 suites, +4 net) · build
clean · **132/132 e2e** fresh CI=1 (3.1m, zero flakes; the mobile-nav
suite green inside the run). The closing census MATCH.

## Summary

**Session 95 delivered — the TABLE family walked at TRUE 390: FULL
GEOMETRY MATCH on the leads sticky-thead (the th-width array + the
y-coordinate + the live-stuck behavior all exact) and the contacts
table, the accounts table matching on its surface with the one
explained overflow genus (ours the in-box pattern), closing the
table-family walk (dialogs s92 → popovers s93 → tabs s94 → tables
s95). The sweep tool gained the `--pages` filter (TDD, the maiden
targeted run reproducing the standing values), the drawer battery
re-verified FULLY GREEN and productized as a committed tool, the
audits clean (zero graduations ~52nd consecutive; one docs nano,
fixed), the gate green at 1836/1836 + 132/132, both sweeps clean at
both viewports, the reference bundle stable for the 66th consecutive
session, both operator decisions standing (55th).**

**Suggested next (session 96):** walk the FORM-family at 390 (the
login card + the filter rows at phone width — the last unwalked
static family), or add a `--fail-on-drift` exit-code mode to the
sweep for CI gating (the natural extension of --max-diff), or run
the full table walk at a SECOND phone width (375×812, the iPhone
baseline) to stress the fractional-column reflow.
