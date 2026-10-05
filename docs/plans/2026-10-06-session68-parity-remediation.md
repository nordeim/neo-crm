# Session-68 Parity Remediation Plan (2026-10-06)

Session 68 on `main` @ `3d60a20` (the session-67 ship `e7f7d6b` + the
session-log update — docs/session_128.md, the operator's s67 transcript;
the numbering convention: odd = the session record, even = the
operator's transcript of the PRIOR session). Workspace: a FRESH CLONE
(intake: `bun install` 533 packages + `db:push` + `db:seed` — the census
reads `database: file:/home/z/my-project/neo-crm/db/custom.db` +
15/24/10/23/12 + 4 users + `pristine: MATCH`, db/ at the repo root as
the operator's brief requires). The documented intake hazard STANDS: the
orchestration environment exports a STALE
`DATABASE_URL=file:/home/z/my-project/db/custom.db` (an absolute
override the db-path seam honors BY DESIGN) pointing at a NON-EXISTENT
mirror — all session-68 repo operations run under `env -u DATABASE_URL`
(the e2e suite immune — its own E2E_DATABASE_URL). `.env` was re-created
from `.env.example` in the fresh clone (DATABASE_URL
`file:../db/custom.db`, the documented 3-var surface). Intake hygiene:
NO zombie dev servers; ports 3000/3100 clear. **Baseline gate on HEAD:
lint 0/0 (enforced) · tsc 0 · 1257/1257 unit (77 suites)** — the
documented state exact. The `skills/` exclusion verified in all three
configs (vitest include allowlist, eslint ignores, tsconfig exclude);
the skills/ folder excluded from code checking, testing and compilation
per the operator's brief.

## The standing layers (64th session, NO DRIFT)

Drift sweep #64: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, direct curl with a browser UA) — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` **exact — the 39th
consecutive stable session**. Reference census #64 (agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(Total Leads 0 + "+5.3%", the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the
mobile-nav defect STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in
DOM, 0 visible, scrollW 390, NO hamburger); desktop nav normal (256px,
8 links); reference screenshots captured at 1280 + 390 (outside the
repo, /tmp/reference-{1280,390}-s68.png). The scandihaven tech-stack
patterns reviewed (AGENTS/PAD: pnpm+Turborepo monorepo, Next 16.3
App Router + async params, Tailwind v4 CSS-first with the @source and
var()-chain hazards, Vitest + Playwright — the same stack family; no
pattern contradicts our single-app architecture).

## The audits (three parallel agents + manual validation of every claim)

### A. The session-67 re-audit (68-a) — 12/12 GENUINE

Every s67 checklist item verified at file:line: the atomic verify
ladder exact (`verify/route.ts:77-81` — `{ increment: 1 }` + the
returned record feeding the ladder); the auth body pre-gate exact
(`api.ts:68` MAX_AUTH_BODY_BYTES + `:73-75` isBodyTooLarge, the gate
before the parse in all four routes); the upload rate limit exact
(`upload/route.ts:32` 20/15min post-guard with the rationale comment);
the /signup pure render exact (no session read, no redirect); the
small-honesty set exact (Retry-After family, the clear twin, the resend
guard, the honest `body?.data?.message` read); the doc carriers exact
(DEPLOYMENT.md re-derived; AUTH_SECRET ≥16 documented; the three stale
carriers refreshed); the coverage exact (auth-contract 12 its; the e2e
ladder; 10+95+8+1 = 114); the docs claims exact (SKILL 1.64.0, wc -l
6309, badge 1371); the screenshots present (75 ≠ 07 by md5 — F-67a1
closed); the unit suite re-run LIVE 1257/1257 (77 suites); the commit
diff maps to every claim, zero strays. NEW findings: **F-68a1 (Nano)**
`neo-crm_SKILL.md:16` — the body H1 still reads "(SKILL.md v1.59.0)"
vs the 1.64.0 frontmatter (stale since s63 — the script-based edits
stopped touching it); **F-68a2 (Low)** the sessioned CRUD family still
buffers unbounded — 12 routes call `req.json()` with no pre-gate
(accounts/activities/contacts/events/leads ×[id]+root, settings,
reset — all behind requireSession; N-67d scoped to the public auth
family); **F-68a3 (Nano)** `rate-limit.ts:2-5` — the header enumerates
only the four auth budgets, the s67 upload-20 join not reflected.

### B. The graduation audit (68-b) — ZERO graduations, 13/13 (25th consecutive)

All 13 standing items re-verified at file:line (F-47c, N-48c, N-48f,
N-48j, N-51c, the CSV posture (b), the source-vocabulary parity, the
stock-mirror, the N-58c boundary, the defensive annotations, the
foreign-docs retirement, the 19/19 deps, the standing fixes). The 8
mechanical censuses ALL CLEAN (localStorage exactly 2 live keys;
public/ og-image.png only; 19/19 deps consumed; API 27 routes/39
handlers all consumed; env parity 3-var exact; doc anchors at
1257+114 LIVE-verified; zero commented-out code; exactly 2 annotated
e2e sleeps). Extra probes all negative. One doc-hygiene nano: **F-68b1**
— five "22-era" numerics survive the s62 sweep (PAD:158 "All 22 API
handlers", PAD:255 mermaid "×22", PAD:292 "22 files / 34 handlers",
PAD:614 "across all 22 files", SKILL:822 "every one of the 22") —
internally inconsistent with the same docs' current 27/39 (README:108,
SKILL:320, PAD:332).

### C. The fresh-eyes rotation (68-c: the page-layout.ts + format.ts seam
— 1,344 + 264 lines + their 27 + 10 consumers + the 2,066 + 199-line
test files; never a dedicated rotation target; every finding manually
re-validated at file:line by the orchestrator, the two Medium fixes
additionally BUNDLE-DECODED)

The **N-68 family** (as validated):
- **N-68a (Medium)** `page-parts.tsx:265` (BarStatCard) `text-2xl
  font-bold leading-none tracking-tight text-foreground sm:text-3xl`,
  `:355` (IconStatCard) `text-3xl font-bold leading-none tracking-tight
  text-foreground`, `:416` (CircleStatCard) `text-2xl font-bold
  leading-tight text-foreground` — the s13 KPI-value decoration sweep
  (S13-P9: the trio proved "REAL computed diffs" — line-height 30 vs
  36px, letter-spacing −0.75px) fixed ONLY KpiCard/KPI_VALUE
  (`text-2xl sm:text-3xl font-bold`, pinned at page-layout.test.ts:1068).
  BUNDLE EVIDENCE (the byte-stable reference, fresh-fetched this
  session): the KPI-value forms are `text-2xl sm:text-3xl font-bold`
  ×15, `text-3xl font-bold` ×4, `text-2xl font-bold` ×10 — ALL BARE;
  `leading-none`/`tracking-tight` appear ONLY on the Label/DialogTitle/
  CardTitle primitives, NEVER on a KPI value. Every KPI value on
  accounts/activities/contacts/leads (BarStat), contacts (IconStat) and
  reports (CircleStat) renders with the retired geometry. Fix: the bare
  forms per family.
- **N-68b (Medium)** `format.ts:48` — the `if (options)` sub-1000
  branch: `formatCompactCurrency(950, { upper: true })` renders
  **"$950.0K"** (a 1000× misread) because the reports consumers
  (`reports-page.tsx:302/:314`) pass options with NO scale, falling
  into the legacy magnitude branching. BUNDLE EVIDENCE: the reference's
  reports formula is ALWAYS /1e3 — `value: `${wonDealsCount}
  $${(wonDealsValue/1e3).toFixed(1)}K`` and `subtitle:
  `$${(lostDealsValue/1e3).toFixed(0)}K`` — exactly our `scale: "k"`
  path (the S32-P1 literal-formula family the dashboard KPIs already
  use at page.tsx:232/:235/:240). At the reference's persistent zero
  state the fix is byte-identical ("$0.0K"/"$0K" both ways); at nonzero
  it is correct ("$0.9K"/"$1K") where the current code misreads 1000×.
  Fix: `scale: "k"` at the two consumers.
- **N-68c (Low)** `page-layout.ts:1133-1136` (the STAT_SHADOWS
  kpiHover comment) + `page-layout.test.ts:761-764` — both claim "the
  dashboard + reports KPI cards additionally carry hover:shadow-md";
  the dashboard half retired at s12 (S12-P5; `KPI_CARD.card` pinned
  `not.toContain("hover:shadow-md")` at test:881 — the
  needle-in-own-docs hazard). Fix: both comments re-scoped to the
  reports family.
- **N-68d (Low)** the unwired byte-identical duplicates:
  `entity-edit-dialog.tsx:191` (= `DIALOG_CONTENT.wide` exactly),
  `:232` (= `DIALOG_FOOTER_WIDE` exactly), `save-report-dialog.tsx:95`
  (= `DIALOG_CONTENT.wide`), `settings-page.tsx:398` (hand-inlines the
  "Add new industrie" mirrored typo where
  `SETTINGS_PICKLIST.industriesPlaceholder` exists — the typo can
  silently un-mirror), `contacts-page.tsx:627` (hand-inlines
  `CONTACTS_LAYOUT.mobileCards`, reordered). The edit family's source
  pins (entity-edit-dialog.test.ts:42-53) pin the INLINE copies — a
  future constant re-pin silently diverges the create/edit families.
  Fix: wire the constants + re-anchor the pins to the
  constant-consumption form.
- **N-68e (Low)** the unpinned production-reachable format branches:
  `timeAgo`'s "upcoming" + >7d "MMM d" arms; `timeUntil`'s "in Nd"
  (≥24h — live via activities dueAt) + the "in 1m" sub-minute edge;
  the `startOf*` family (the reports/export period windows — source-
  shape-pinned only); `addDays/startOfDay/endOfDay` behaviorally
  unpinned. Fix: the coverage closures in format.test.ts.
- **N-68f (Nano — record-only)** `format.ts` formatDateShort — zero
  EXTERNAL consumers but internally alive (timeAgo) + guard-pinned —
  the N-58c standing boundary, recorded as deliberate.
- **N-68g (Nano)** `format.ts:130` — timeUntil's doc promises a
  "Today" output it never returns (the Never/Today/N-days vocabulary
  lives in constants.ts:354-367 + account-health.ts:48, not here).
  Fix: the comment re-derived to the actual contract.
- **N-68h (Nano)** `format.ts:94` — formatMonthDayTime re-declares a
  local month array duplicating MONTHS_SHORT (:52). Fix: the dedupe.
- **N-68i (Nano)** `page-layout.ts:663` — `CARD_TITLE_OVERRIDE.filters`
  ("text-base") duplicates `FILTER_RAIL.title` with zero src consumers
  (the rails consume FILTER_RAIL.title; .dashboard ×3 + .settings ×1
  are live). Fix: the member retirement, absence-pinned.
- **N-68j/k (Info — STAND)** the N-63a 8-record annotation EXACT at the
  record level (member-level under-description recorded); the export
  route Close-Date TZ split (the N-63d family). No action.
- **N-68l (Info)** the clean bill: all 72 exports censused, every
  snapshot matches its live carrier, no constant contradicts the
  documented reference contract, format.ts correct on every pinned
  path (currency rounding, month rollovers, quarter rounding,
  DST-safe grid math, ISO fetch-window over-cover all verified sound).

**Coverage gaps found (68-c)**: the relative-time outer branches, the
startOf* boundary math, the sub-1000 currency window, and the three
stat-value strings — all unpinned; the edit-dialog chrome pinned only
against its own inline copies. Closures land at S68-P5 (+ the S68-P1/P4
pins).

## The operator decisions

The **CSV formula-injection posture (b) STANDS** (26th re-affirmation —
the guard intact in both export families [guardFormulaPrefix at
csv.ts:31-33 applied in escapeCell AND imported into entity-export.ts:24,
re-confirmed by the 68-b census], the `-` exclusion documented + pinned,
safe cells byte-identical [the s41-P2 precedent], the reference bundle
byte-stable for the 39th consecutive session; the page-layout/format
rotation found NO CSV surface — no new evidence moves the (a) parity /
(c) full-OWASP alternatives).

The **source-vocabulary documented parity STANDS AND EXTENDS to the
N-68 family** (the 68-b census re-confirmed the anchors at file:line:
CONTACT_SOURCE_OPTIONS/LEAD_SOURCE_OPTIONS/SOURCE_PAIRS pinned, NO
enum-membership on routes' source [free-form, string-ness + 40 chars],
the settings Capitalized defaults verbatim; the 68-c rotation touches NO
vocabulary surface — its strings are layout classes and date formats;
the Never/Today/N-days-ago ce vocabulary stays in its documented home
[constants.ts:354-367 + account-health.ts:48] — N-68g is a comment
re-derivation, not a vocabulary change).

## The remediation set (TDD — RED first, then GREEN)

- **S68-P1 (N-68a)** the KPI-value typography sweep: the three bare
  forms (BarStatCard `text-2xl sm:text-3xl font-bold`, IconStatCard
  `text-3xl font-bold`, CircleStatCard `text-2xl font-bold`) — the
  decorations (leading-none/tracking-tight/leading-tight/text-foreground)
  retired from the value <p> only.
- **S68-P2 (N-68b)** the reports won/lost fixed-scale: `scale: "k"` at
  reports-page.tsx:302 (won, decimals 1 default) + :314 (lost,
  decimals: 0) — the reference's literal /1e3 formula.
- **S68-P3 (N-68c)** the stale hover-comment re-scope ×2 (the constant
  comment + the test comment) — the reports family only.
- **S68-P4 (N-68d)** the wiring set: DIALOG_CONTENT.wide +
  DIALOG_FOOTER_WIDE consumed by entity-edit-dialog + the
  save-report-dialog wide shell; SETTINGS_PICKLIST.industriesPlaceholder
  consumed by the settings page; CONTACTS_LAYOUT.mobileCards consumed by
  the contacts page; the entity-edit-dialog source pins re-anchored to
  the constant-consumption form.
- **S68-P5 (N-68e)** the format coverage closures: timeAgo upcoming/
  >7d, timeUntil in-Nd/in-1m/overdue, the startOf* boundaries,
  addDays/startOfDay/endOfDay.
- **S68-P6 (N-68g/h)** the format nano pair: the timeUntil comment
  re-derived; formatMonthDayTime deduped to MONTHS_SHORT.
- **S68-P7 (F-68a2)** the sessioned body pre-gate: `isBodyTooLarge`
  after requireSession + before req.json() in all 12 sessioned routes
  (accounts/activities/contacts/events/leads ×[id]+root + settings +
  reset) — the N-67d family extended; the api.ts comment extended to
  document the family scope.
- **S68-P8 (the carriers + the retirement)**: F-68a1 the SKILL.md:16
  H1 re-versioned (1.65.0 this session); F-68a3 the rate-limit.ts
  header gains the upload line; F-68b1 the five 22-era numerics
  (PAD ×4 + SKILL ×1) refreshed to 27 files/39 handlers; N-68i the
  CARD_TITLE_OVERRIDE.filters member retired, absence-pinned.

## Blast radius (pre-checked)

No unit pins on: the three stat-value class strings (the
leading-none/tracking-tight test hits are CARD.title/DIALOG_TITLE/
PROFILE_LAYOUT.cardTitle/DANGER — different surfaces); the reports
consumers' options shape (format pins cover the scale:"k" path at
:36-38 — the S32 family); the comment-only carriers. The
entity-edit-dialog pins (:42-53) DO pin the inline literals — they are
the S68-P4 re-anchor set (RED on the current source, green at the
wiring). The e2e suite: no e2e asserts the stat-value geometry, the
currency strings at nonzero, or the edit-dialog class chrome (the
crm.spec assertions are text/role-anchored). The settings typo pin
(page-layout.test.ts:418) pins the CONSTANT — the page wiring keeps it
green. AUTH-contract pins on isBodyTooLarge untouched (the helper
unchanged; only new call sites).

## The gate

lint 0/0 · tsc 0 · the full unit suite at 1257 + the new session-68
its · build clean · e2e 114 on a fresh CI=1 boot (all 8 mobile-nav
checks green) · the non-vacuousness replay in a pre-fix 3d60a20
worktree (only the new/modified test files; the exact RED set
isolated) · the LIVE battery (the fix surfaces through real round-trips
+ the mobile drawer regression at TRUE 390px + the Tailwind v4 token
probes + zero 390px overflow ×10 routes + the closing db:census MATCH)
· the screenshot set at 1440×900 · the docs realignment (SKILL v1.65.0
+ README/AGENTS/CLAUDE/PAD at the new counts + session_129.md + this
execution record + both worklogs).

## The execution record (2026-10-06, session-68)

EXECUTED AS PLANNED with ONE mid-flight repair (the contact-photo
twin re-anchors — the blast-radius pre-check missed the s30 scroll-cap
pins on the same dialog surfaces; closed like-for-like at the GREEN
checkpoint). RED: the NEW stat-value-contract (6 its) + body-pregate
(3 its) suites + the format session-68 describe (5 its, green-through
RED guards — two test-side arithmetic corrections during RED: the
toFixed(0) 0.5-rounds-up family + the 7-day boundary flips AT 7 days)
+ the entity-edit-dialog re-anchors (2) + the saved-reports wiring pin
(1) + the dch session-68 describe (3) + the page-layout absence pin
(1) + the contact-photo re-anchors (2) — 18 failed exactly (the 16
planned + the 2 collateral). GREEN: S68-P1..P8 all landed (P1 the
three bare stat-value forms; P2 scale:"k" at the reports call-sites;
P3 the comment re-scopes; P4 the constant wiring + the five pin
re-anchors; P5 the 7 coverage its; P6 the nano pair; P7 the 12-route
pre-gate via scripts/body-pregate-s68.js; P8 the carriers + the
member retirement). Non-vacuousness: 18 failed | 1257 passed (1275)
in the pre-fix 3d60a20 worktree; clean teardown; census sanity MATCH.
Full gate: lint 0/0 · tsc 0 · 1275/1275 unit (79 suites, +18) · build
clean · 114/114 e2e on a fresh CI=1 boot (all 8 mobile-nav checks
green). LIVE: the 20KB pre-gate 400; the honest-body parse; the
reports KPIs at nonzero ("4 $337.0K" + "$92K"); the three
computed-style probes at the reference geometry; the drawer both
directions at TRUE 390px; zero overflow ×10; NO Tailwind v4 bug; the
closing census MATCH — zero probe residue. Screenshots: 01/02/03/04/08
re-captured + 77-reports-kpi-scale NEW + 78-mobile-nav-drawer NEW
(VLM-verified 3/3 + 4/4). Docs: SKILL v1.65.0 (§16bh, 6309 → 6352) +
README/AGENTS/CLAUDE/PAD at 1275+114 (badge 1389) + session_129.md +
this record + both worklogs. Estimate drift: none (the plan's
18-RED/+18-its numbers exact; the contact-photo pair the only
addition, recorded above).
