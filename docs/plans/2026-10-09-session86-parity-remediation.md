# Session-86 Parity Remediation Plan (2026-10-09)

Session 86 on `main` @ `d51de2c` (the s85 ship `f7a605a` + the
docs-only session-log commit). The workspace was RECLONED (the sandbox
had been reset); the environment rebuilt and verified intact
(`bun install`; `.env` from `.env.example` with a fresh AUTH_SECRET;
`DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root; the
census MATCH 15/24/10/23/12 + 4 users; vitest + playwright configured;
the `skills/` exclusion verified in eslint/tsconfig/vitest/playwright;
the sitemap/robots/manifest route handlers + the site.ts seam + the
og-image all present). The platform `DATABASE_URL` override hazard
STANDS (it points at the non-existent sandbox-root mirror) — all
session-86 repo operations run under `env -u DATABASE_URL`.

**Baseline gate on HEAD: lint 0/0 · tsc 0 · 1687/1687 unit (94 suites)
· build + e2e deferred to the post-fix gate** (the 86-a subaudit
re-ran the full unit suite live at HEAD: 94 files, 1687/1687 green;
lint + tsc re-verified by the orchestrator; the build + e2e legs run
once, on the FIXED tree, per the one-gate discipline — the reference
bundle was re-fetched fresh and verified byte-stable first, so the
baseline risk is the working tree only, and the RED checkpoint below
proves the pre-fix state of every new pin).

## The standing layers (82nd session, NO APP DRIFT)

Drift sweep #82: the APP bundle re-fetched fresh from the reference
and served byte-identical from `/assets/index-DZ-xbrIm.js` — size
1,631,071 + md5 `a70a637fcf1d4291da8e0d965676dc11` exact — **the 57th
consecutive stable session** (the stylesheet `index-Be9epoFc.css`
79,581 bytes exact too). The LIVE app post-login loads ONLY the old
`/assets` pair. Reference census #82 (agent-browser, live login + a
TRUE 390px viewport): the demo data still zero (the $0.0k KPI
family); the mobile-nav defect STANDS at a TRUE 390px (vw=390, nav
w=0, 8 links in DOM, 0 visible, no mobile menu — the 7th consecutive
census); desktop nav normal (256px, 8 links, all visible). Our mobile
drawer stays the deliberate documented superset (the LIVE battery
re-verified post-fix below).

## The audits (two parallel subagents + the orchestrator's own fresh-eyes rotation, every parity claim decoded from the byte-stable 1.63MB reference bundle + LIVE-probed on BOTH apps)

**86-a** — the s85 re-audit: **6/6 GENUINE (S85-P1..P6), ZERO
material findings** (the bare account cells at
reports-page.tsx:520/:756; the overdue DATE-PRESENT guard at
api/reports/route.ts:410 + the guaranteed-date map :418 + the bare
formatDate render :842 + the narrowed wire type types/index.ts:268;
the tab-1 TWO 2-chart grids :423/:451; the ChartCard headerClassName
escape :1120-1141 + the Forecasting card :590 + the caption div>p
:608-613; the 17-it suite re-run live 17/17 + the full unit gate
re-verified 94/1687; the doc carriers incl. the H1 re-join at
v1.82.0). 1 nano: **N-86a1** the PAD:778 counting-convention footnote
still reads "93 Vitest suites with 1670 checks" — the s85 doc pass
updated the Total row but missed the footnote 7 lines below (the
N-83a1 stale-carrier genus; folded into S86-P7).

**86-b** — the graduation audit: **ZERO graduations, 13/13 (the 43rd
consecutive)** — every standing ledger rationale verified UNCHANGED at
HEAD (the mobile drawer's < md coverage + the 768px autoCloseQuery;
the row-delete confirm gates x4; the contacts Log Activity wiring; the
dashboard search/Add supersets; the view switchers; the vendored
tw-animate-css; the inert+visibility close pattern; the roving
tabindex; the functional /signup; the blob downloads; the login reset
flow; the API 0-90 guard; the (app)/layout direct session read). The
8 mechanical censuses **8/8 CLEAN** (the localStorage 2-key set
`crm_saved_reports` + `neo-crm.leads.views`; public/ og-image only;
the 19/19 deps; the 27-route/39-handler API census; the 3-var env
parity; the doc anchors at 1687+132/README 1819/SKILL v1.82.0; zero
commented-out code; the 5 annotated e2e sleeps + the mobile-nav suite
intact at 9 checks). Both operator decisions' evidence INTACT.

**86-c** — the fresh-eyes rotation on the **ACCOUNTS FILTER-RAIL
FAMILY** (the standing session_165 alternate — "the Oce rail's own
chrome" — chosen over the dashboard KPI-family alternate). Full decode
of the reference's accounts page family from the byte-stable bundle
(the Oce rail @488221 + the accounts page memo/filter/row/KPI family
@498100-505200 + the bce create dialog @477337 + the wce edit dialog
@479865) + the LIVE probe on BOTH apps (the reference's rail DOM
censused at 1440 — the labels/checkbox-rows/Save-All/Filter-button
classes all LIVE-computed; our dev server's table/search/rail
DOM-censused side-by-side). **The foundations SOLID**: the rail
anatomy (the CardHeader pb-3 + the flex justify-between header row +
the CardTitle text-base + the ghost sm Save All + the space-y-4 body +
the mb-2/mb-3 label split + the space-y-2 checkbox stack + the
text-sm cursor-pointer checkbox labels + the stock CHECKBOX anatomy +
the pt-2 wrapper + the w-full bg-blue-600 hover:bg-blue-700 Filter
button); the toolbar (the w-full sm:w-32 switcher triggers + the dead
density select + the dead More + the search icon anatomy + the Export
CSV pair); the row chrome (the cursor-pointer + the w-10 building box
+ the email subtext + the w-6 owner initials box + the "No activity"
fallback + the health badge under the Status header + the row-menu
family); the KPI row (the five zv cards + the static sparkbars + the
M-75c1-1 overdue derivation); the tier/health badge maps (B/H decoded
verbatim — ours match byte-for-byte); the page root; the insights
dialog (s84); the export's 10-column set + the quoted-CSV builder +
the `accounts_ISO-date.csv` filename. **The N-86 family: 2 M + 2 L +
3 N**:

- **M-86c1 CONFIRMED (bundle: both dialogs' Select items + the API's
  rejection)** — THE ACCOUNT STATUS VOCABULARY SPLIT: the reference's
  bce AND wce both ship the Status trio **Active/Inactive/Prospect**
  (value "prospect"); OUR edit dialog ships the same trio (the s28
  wce decode was RIGHT) but the CREATE dialog maps ACCOUNT_STATUSES
  (active/inactive/**churned**) and BOTH API routes validate against
  it — so selecting **Prospect** in the Edit Account dialog and
  saving ALWAYS 400s ("Invalid status"). The s54 retirement killed
  the dead ACCOUNT_EDIT_STATUSES constant but kept the divergent live
  vocabulary (its "stale s28 decode" note mis-read which surface the
  trio rode). LIVE-exercisable on the seed (any account, any edit).
- **M-86c2 CONFIRMED (bundle: the N memo's te + the row/KPI/filter/
  export consumers; LIVE: our table renders 4 Key)** — THE
  COMPUTED-TIER DERIVATION: the reference DERIVES every account's
  tier from its revenue — `annual_revenue > 1e6 ? "Key" : > 5e5 ? "A"
  : > 1e5 ? "B" : "C"` (the N memo's te) — and consumes the COMPUTED
  value at the row (the bg-yellow-50/30 tint + the filled star + the
  tier badge), the Key Accounts KPI (`N.filter(te => te.tier ===
  "Key")`), the tier checkbox filter (`d.tiers.includes(U.tier)`,
  with "Key Account" mapping to computed "Key"), and the CSV export
  (E.map's fe.tier). OURS reads the STORED isKey/tier everywhere —
  on our seed the reference's formula renders **9 Key + 1 A**; ours
  renders **4 Key + an A/B/C spread** (LIVE-probed: tierBadges
  [B,C,B,Key,B,Key,Key,Key,B,C], 4 stars, 4 tints). The reference
  models NO tier field (its dialogs offer none; its settings
  default_account_tier is its own dead default — the Default
  Currency AED genus). Our stored columns are the invented mechanism.
- **L-86c3 CONFIRMED (bundle: the E filter memo + LIVE: the search
  probe)** — THE SEARCH SCOPE: the reference's accounts search
  filters **NAME ONLY** (`U.name?.toLowerCase().includes(e
  .toLowerCase())`); OURS matches `name + industry + email` — the
  LIVE probe: searching "logistics" (an INDUSTRY value) returns 2
  rows on ours (Emirates + Sahara) where the reference returns 0.
  Never walked since the s10 scaffold.
- **L-86c4 CONFIRMED (bundle: the R export fn + the header button)**
  — THE EXPORT ROW BASIS + THE HEADER BINDING: the reference's export
  maps the **FILTERED** rows (`ee = E.map(...)` — E is the filter
  memo) under the **zero-RAW guard** (`if (m.length === 0) return`),
  and its header Export CSV binds `disabled: m.length === 0` (RAW);
  OURS maps ALL accounts (`rows = accounts.map`) and binds
  `disabled: filtered.length === 0`. The s26 comment's "The export
  covers the FULL list, not the filtered view" is a misdecode of the
  same bundle; the N-62e annotation flagged the binding ambiguity —
  today's decode RESOLVES it (raw, not filtered).
- **N-86c5 CONFIRMED (bundle: the three Fr placeholders)** — THE
  DEAD SELECTVALUE PLACEHOLDERS: the reference's rail selects carry
  `placeholder:"John Kuy"` / `"Technology"` / `"$1M to $5M"` — dead
  in both apps (the defaults are the "all" values, which always
  match an item); OURS ships bare `<SelectValue />`. The N-83c5
  mirror precedent.
- **N-86c6 CONFIRMED (bundle: the Ct className)** — THE SEARCH
  INPUT'S EXPLICIT h-9: the reference's input carries `pl-9 h-9`
  (the h-9 redundant with its stock base — computed-equal to ours);
  ours ships `pl-9` (the base's h-9). Mirrored for source parity (the
  N-85c6 precedent).
- **N-86c7 (the documentation genus)** — THE UNDOCUMENTED SUPERSETS:
  (a) the Owner + Revenue Range selects **filter LIVE** on ours (the
  reference's are DEAD — its memo never reads d.owner/d.revenue);
  (b) the Save All button **resets** the filters on ours (the
  reference's has NO onClick); (c) the Owner/Industry item sets are
  DYNAMIC on ours (real users + settings industries) where the
  reference ships STATIC literals (All Owners/John Kuy + the five
  industries); (d) the search icon carries `pointer-events-none` on
  ours (our click-through fix over the reference's 16x16 dead-zone
  icon). All four are fix-over-defect keeps that lack the in-code
  superset comments the S33-P1/S47-P1/S73-P1 conventions require.

## The operator decisions (46th re-affirmation)

The **CSV formula-injection posture (b) STANDS** — the 86-b
re-verification: `guardFormulaPrefix` intact at csv.ts:31-33 applied
in `escapeCell` AND imported into entity-export.ts's `qq`
(:24/:43); the `-` exclusion documented; ZERO new unguarded builders
(every CSV surface consumes the central builders — the 86-b census;
the accounts family rides the same two export seams: the page-level
quoted-CSV builder + the dashboard's). The **source-vocabulary
documented parity STANDS** — the 86-b census re-confirmed every
anchor at file:line. The accounts rail family introduces ONE
vocabulary change — the account STATUS trio unifies on the
reference's own active/inactive/prospect (a parity RESTORATION, not
an invention: the reference's dialogs are the source); the tier
vocabulary RETIRES from the stored model (the reference ships no
stored tier — the computed seam carries the same four-value display
vocabulary the reference itself renders).

## The remediation set (TDD — RED first, then GREEN)

- **S86-P1 (M-86c1)** — the status vocabulary unification:
  `ACCOUNT_STATUSES` → `["active","inactive","prospect"]`;
  `ACCOUNT_STATUS_META` loses churned, gains prospect (label
  "Prospect"; the badge/color are ours — the reference never badges
  account status); the seed's Sahara `churned` → `inactive`; the
  schema comment re-derived; the s54 constants comment corrected.
  The create dialog + both API validators follow ACCOUNT_STATUSES
  automatically; the edit dialog's trio now SAVES.
- **S86-P2 (M-86c2)** — the computed-tier derivation + the
  stored-field retirement: the NEW `src/lib/account-tier.ts` pure
  seam (`accountTierFromRevenue(revenue)` → "Key" | "A" | "B" | "C"
  — >1M Key / >500k A / >100k B / else C, null-safe); consumed at
  the row (tier/tint/star), the Key Accounts KPI, the tier checkbox
  filter, BOTH CSV exports (the accounts page + the dashboard), and
  the Cards badge. The stored `tier`/`isKey` RETIRE: the schema
  columns + `@@index([tier])`, the Account type members, both API
  routes' write/validation blocks, the create dialog's hidden
  payload fields, and the seed's values. The settings defaultTier
  editor STAYS (the reference's own surface — its
  default_account_tier is equally unconsumed; the s43 comment
  re-derived to the honest dead-default parity).
- **S86-P3 (L-86c3 + N-86c6)** — the search mirror: the filter
  narrows to NAME ONLY; the input gains the explicit `h-9`; the
  icon's pointer-events-none gains its superset comment.
- **S86-P4 (L-86c4)** — the export basis: the rows map `filtered`;
  the header binding re-anchors to `accounts.length === 0`; the s26
  + N-62e comments re-derived to the resolved decode.
- **S86-P5 (N-86c5 + N-86c7)** — the rail: the three dead
  SelectValue placeholders mirrored + the four superset comments
  (the dead Owner/Revenue filters, the dead Save All, the static
  item sets, the icon fix).
- **S86-P6 (the tests)** — the NEW `tests/accounts-rail-parity.test.ts`
  RED-first pin suite: the status trio at BOTH dialog configs + the
  ACCOUNT_STATUSES/META pins + the seed's no-churned negative + the
  API validation pins; the accountTierFromRevenue unit matrix (null,
  0, 100k, 100_001, 500k, 500_001, 1M, 1_000_001, 22M) + the page's
  computed consumption pins (the row/KPI/filter/export/Cards) + the
  schema/type/API/create-payload no-stored-tier negatives; the
  name-only search pin + the industry/email negative + the h-9 pin;
  the filtered-basis export pin + the raw guard + the header
  binding; the three placeholder pins + the superset-comment pins.
  Plus the lockstep re-anchors: the api-robustness isKey it.each rows
  retire (allDay stays), the contact-model s54 comment re-derives,
  the dead-code-hygiene N-65d comment re-derives, the account-surfaces
  Oce pins survive (verified: the class pins are computation-
  independent).
- **S86-P7 (the docs)** — SKILL v1.83.0 (§16bz + project_state + the
  H1 in lockstep, via the assert-first scripts/skill_edits_s86.py at
  the sandbox root) + README badge + the suite list + AGENTS/CLAUDE/
  PAD at the new counts (+ the PAD s86 inventory row + the Total row
  + the N-86a1 PAD:778 footnote fix) + the AGENTS carrier updates
  (the tier-derivation note, the status-vocabulary note, the
  search-scope note, the "NO base w-full" precision note — the
  reference's stock trigger base DOES carry w-full, ours is
  per-surface, computed-equal everywhere) + session_169.md + this
  plan's execution record + the repo worklog.

No new e2e: every fix surface is derivation/source-level (the S17-P3
checkbox e2e reads the rail anatomy — untouched; the S25-P5 per-table
export e2e runs UNFILTERED — the full-rows-at-no-filter behavior is
identical; no e2e pins the KPI values, the star count, or the status
options — verified by grep). The unit pins + the LIVE computed-probe
battery cover the family (the s76-s85 precedent for derivation-level
rotations).

## Blast radius (pre-checked)

The pins that RE-ANCHOR in lockstep: the api-robustness isKey rows
(retire with the API blocks); the contact-model s54 comment (the
wiring pin itself survives); the dead-code-hygiene N-65d comment; the
dashboard-export region pin (the `accounts.length === 0` guard +
columns survive — only the row basis changes, unpinned). SURVIVES
untouched: account-surfaces (the class pins — bg-yellow-50/30, the
star classes, the Oce structure — all computation-independent),
account-health-tab (the health field — separate), the S17-P3/S25-P5
e2e (verified above), the settings suites (the defaultTier editor
stays), the auth/store suites. The GREEN-hazard sweep: the
accountTierFromRevenue seam is new (zero callers change beyond the
six consumption sites); the schema retirement cascades through
`prisma generate` + `db push --accept-data-loss` (the e2e
global-setup re-pushes per run — verified); the Account type
narrowing touches the two API routes + the pages' type reads (all
six consumption sites switch in the same commit); the seed change
requires a dev-db reseed (census re-verified after).

## The execution record (2026-10-09, session-86)

EXECUTED AS PLANNED, 5 anchor-side pin-shape repairs (2 at RED — both on
green anchors: the railRegion slice + the Save All quote form; 3 at
GREEN — the table-row/Cards-badge/header-binding windows, the fixes all
in place). RED: **19 failed | 1693 passed (1712 total)** at the pre-fix
state — exactly the new suite's failing pin set (19 of its 25; the 6
green anchors passed through RED by design) + ZERO collateral (the
pre-fix run executed the OLD api-robustness table: the 3 retiring rows
green there, retired at GREEN in the same commit as the suite landed).
GREEN: S86-P1..P7 all landed (P1 the trio unification + the seed/
schema/comment carriers; P2 the account-tier seam + the six consumption
sites + the five retirement surfaces; P3 the name-only filter + the
h-9 + the icon comment; P4 the filtered export basis + the RAW binding
+ the re-derived comments; P5 the three placeholders + the four
superset comments; P6 the suite at 25 its + the lockstep re-anchors
[the api-robustness isKey x2 + POST tier rows retire; the
entity-export header pin re-anchors to the RAW form; the contact-model
s54 + dead-code-hygiene N-65d comments re-derive]; P7 the docs).
GREEN-phase hazard: the rewritten filter memo tripped
react-hooks/preserve-manual-memoization — bisected live to
exportAccounts FORWARD-REFERENCING the later-declared filtered const
(the compiler's component-level bail reports at the first manual
memo); fixed by the zero-cost reorder (function below the memo),
documented in SKILL §16bz. GATE: lint 0/0 · tsc 0 · **1709/1709 unit
(95 suites, +22 net: +25 new − 3 lockstep-retired)** · build clean ·
**132/132 e2e on a fresh CI=1 boot (3.2m, FIRST run green — all 9
mobile-nav checks green)**. LIVE (the fixed dev server, both apps
probed): the computed family (tierBadges 9 Key + 1 A [was 4 Key + a
spread], 9 stars [was 4], 9 tints [was 4], the Key Accounts KPI at 9
[was 4]); the name-only search ("logistics" → 1 row, the name match —
the industry match excluded [was 2]); the header Export CSV enabled at
a non-empty filter; the Prospect save selected → saved → persisted
(the dialog re-opens at "Prospect"; the db reset after); the rail trio
rendering their "All X" values + Save All + the blue Filter button;
the drawer at TRUE 390px (the full-bleed overlay, the w-72 panel at
left-0, 8 links all visible, focus INSIDE [the close button], dual
scroll-lock, navigate-close + locks released, the closed overlay
inert + visibility:hidden); zero overflow; the closing census MATCH
(db pristine after the probe reset + the reference md5-exact
re-fetched — the 57th consecutive stable session). Screenshots 112
(the accounts rail + the computed-tier table) + 113 (the edit dialog's
Status trio) + 114 (the mobile drawer at 390) NEW — VLM 112 = 3/5
[both NOs DOM-disproven VLM-scale artifacts: the "Kev" badge-text
misread + the 16px-icon star undercount] + 113 = 3/3 + 114 = 4/4.
Docs: SKILL v1.83.0 (§16bz + project_state + the H1 in lockstep, via
the assert-first scripts/skill_edits_s86.py at the sandbox root) +
README badge 1841 + the suite list + AGENTS/CLAUDE/PAD at 1709+132 (+
the PAD s86 inventory row + the Total 95/1709 + the N-86a1 footnote
fix 93/1670 → 95/1709) + the AGENTS carriers (the derived-tier note +
the status-vocabulary note + the w-full precision note) + session_169
+ this record + the repo worklog; .env/.env.example verified (no env
surface change). Estimate drift: +22 net its exact · 132 e2e exact ·
the e2e-waits census unchanged at 5.
