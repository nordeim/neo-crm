Session 68 — the stat-value honesty + the small-wiring session
(docs/session_127.md, the s67 record; the operator's brief = the
standing cycle + this session's explicit instructions: refresh the
workspace from the remote, review the five core docs + the four
session records, validate against the codebase, audit with the repo
skills, proceed on the two operator decisions, iterate for parity
with the reference, mind the mobile navigation + the Tailwind v4
hazard class, keep DATABASE_URL at file:../db/custom.db with db/ at
the repo root, verify the vitest + playwright suites, plan + execute
RED-first, capture screenshots, keep .env.example aligned, realign
the docs, ship to main via the SSH wrapper).
Workspace: a FRESH CLONE (git clone https://github.com/nordeim/
neo-crm.git — HEAD 3d60a20, the s67 ship e7f7d6b + the session-log
update; zero drift, tree clean). The census after the fresh
db:push + db:seed reads file:/home/z/my-project/neo-crm/db/custom.db
+ 15/24/10/23/12 + 4 users + pristine: MATCH — db/ at the repo root,
as the operator's brief requires (.env re-created from .env.example
with a generated AUTH_SECRET; the documented intake hazard STANDS —
the stale platform DATABASE_URL override points at a NON-EXISTENT
mirror, all session-68 repo operations ran under `env -u
DATABASE_URL`, the e2e suite immune via its own E2E_DATABASE_URL).
Intake hygiene: NO zombie servers; ports 3000/3100 clear. Baseline
gate GREEN: lint 0/0 (enforced) · tsc 0 · 1257/1257 unit (77 suites)
— the documented state exact; the skills/ exclusion verified in all
three configs (vitest include allowlist, eslint ignores, tsconfig
exclude — the folder excluded from code checking, testing and
compilation per the brief).

The standing drift re-sweep (64th session): the reference bundle
fresh-fetched (the Vite chunk assets/index-DZ-xbrIm.js, direct curl
with a browser UA) — byte-identical (size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` exact — the 39th consecutive
stable session). The reference census (64th, agent-browser, live
login at 1280 then a TRUE 390px viewport): the demo data still zero
(Total Leads 0 + "+5.3%", the KPI values 0/$0.0k/$0.0k/$0k/0%/0); the
mobile-nav defect STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in
DOM, 0 visible, scrollW 390, NO hamburger); desktop nav normal
(256px, 8 links); reference screenshots captured at 1280 + 390
(outside the repo). The scandihaven tech-stack patterns reviewed
(AGENTS/PAD: pnpm + Turborepo, Next 16.3 App Router + async params,
Tailwind v4 CSS-first with the @source + var()-chain hazards,
Vitest + Playwright — the same stack family; no pattern contradicts
our single-app architecture).

The three parallel audit agents (68-a/68-b/68-c) + every finding
manually validated at file:line by the orchestrator (the two Medium
fixes additionally BUNDLE-DECODED before planning). **68-a** — the
s67 re-audit: **12/12 checklist items GENUINE** (the atomic ladder
exact at verify/route.ts:77-81; the pre-gate exact at api.ts:68/:73-75
+ the four routes; the upload limit exact; the signup pure render
exact; the small-honesty set exact; the doc carriers exact; the
coverage exact — auth-contract 12 its, e2e 10+95+8+1 = 114; the docs
claims exact — SKILL 1.64.0/6309/badge 1371; the screenshots present
with 75 ≠ 07 by md5 — F-67a1 closed; the unit suite re-run LIVE
1257/1257; the commit diff mapped to every claim, zero strays). NEW:
**F-68a1 (Nano)** neo-crm_SKILL.md:16 — the body H1 still read
"(SKILL.md v1.59.0)" vs the 1.64.0 frontmatter (stale since s63);
**F-68a2 (Low)** the sessioned CRUD family still buffers unbounded —
12 routes call req.json() with no pre-gate (the N-67d gate scoped to
the public auth family); **F-68a3 (Nano)** rate-limit.ts:2-5 — the
header enumerates only the four auth budgets, the s67 upload-20 join
not reflected. **68-b** — the graduation audit: **ZERO graduations —
13/13 CONFIRMED (25th consecutive session)**, the 8 mechanical
censuses ALL CLEAN, both operator anchors standing; one doc-hygiene
nano: **F-68b1** — five "22-era" API-count numerics survive the s62
sweep (PAD:158/:255/:292/:614 + SKILL:822) vs the current 27 files/
39 handlers. **68-c** — the fresh-eyes ROTATION on the
page-layout.ts + format.ts seam (1,344 + 264 lines + 27 + 10
consumers + the 2,066 + 199-line test files; never a dedicated
rotation target) finding the **N-68 family**, every claim manually
re-validated at file:line + the two Medium fixes bundle-decoded:
**N-68a (Medium)** the incomplete s13 sweep — the retired KPI-value
decoration trio (leading-none/tracking-tight/leading-tight/
text-foreground) survived on BarStatCard :265 + IconStatCard :355 +
CircleStatCard :416 (the bundle census: text-2xl sm:text-3xl
font-bold ×15, text-3xl font-bold ×4, text-2xl font-bold ×10 — ALL
bare; the decorations appear ONLY on the Label/DialogTitle/CardTitle
primitives); **N-68b (Medium)** format.ts:48 — the sub-1000 + options
window misreads amounts 1000× ($950 → "$950.0K"; the reference's
reports formula is ALWAYS /1e3 — `value/1e3 toFixed(1)` won,
`toFixed(0)` lost — exactly our scale:"k" path the dashboard KPIs
already use); **N-68c (Low)** the stale "dashboard + reports hover"
comment pair (the dashboard half retired at s12); **N-68d (Low)** the
unwired byte-identical duplicates (the edit dialogs' wide shell +
footer, the save-report wide shell, the settings "Add new industrie"
typo, the contacts mobile-cards grid — the source pins pinning the
INLINE copies); **N-68e (Low)** the unpinned production-reachable
format branches (timeAgo upcoming/>=7d, timeUntil in-1m/in-Nd, the
startOf* family, addDays rollover); **N-68f/g/h/i (Nano)** the
formatDateShort N-58c boundary record; the timeUntil "Today" doc
promise; the formatMonthDayTime month-array re-declaration; the
CARD_TITLE_OVERRIDE.filters zero-consumer duplicate;
**N-68j/k/l (Info — STAND)** the member-level annotation precision,
the export TZ split, the clean bill (all 72 exports censused, every
snapshot matching its live carrier, format.ts correct on every pinned
path).

The operator decisions: the **CSV formula-injection posture (b)
STANDS** (26th re-affirmation — the guard intact in both export
families, the `-` exclusion documented + pinned, safe cells
byte-identical, the reference bundle byte-stable for the 39th
consecutive session; the page-layout/format rotation found NO CSV
surface — no new evidence moves the (a) parity / (c) full-OWASP
alternatives); the **source-vocabulary documented parity STANDS AND
EXTENDS to the N-68 family** (the 68-b census re-confirmed the anchors
at file:line; the rotation touches NO vocabulary surface — its
strings are layout classes and date formats; the Never/Today/N-days
ce vocabulary stays in its documented home; N-68g is a comment
re-derivation, not a vocabulary change).

The plan (docs/plans/2026-10-06-session68-parity-remediation.md)
written and validated against the codebase (every anchor grepped at
file:line before execution; the blast radius pre-checked — the
entity-edit-dialog + contact-photo source pins identified as the
re-anchor set; the e2e suite verified free of stat-value/currency/
dialog-chrome assertions).

**RED**: the NEW tests/stat-value-contract.test.ts (6 its: the three
bare stat-value forms + the decoration-trio absence + the two
reports scale:"k" call-site pins) + the NEW tests/body-pregate.test.ts
(3 its: the 12-route import family, the ordering-pinned
gate-before-parse, the exact 400 form) + the format.test.ts session-68
describe (5 its — the reports K-scale window at upper-K + the
timeAgo/timeUntil/startOf* coverage, green-through-RED guards of
working behavior; two test-side arithmetic corrections during RED —
the toFixed(0) 0.5-rounds-up family + the 7-day boundary flips AT 7
days, both re-derived to the actual formula behavior) + the
entity-edit-dialog re-anchors (2) + the saved-reports wiring pin (1) +
the dch session-68 describe (3) + the page-layout CARD_TITLE_OVERRIDE
absence pin (1) — **18 failed** (the 16 planned + the 2
contact-photo s30 twins found at the GREEN checkpoint — the collateral
pin set the blast-radius pre-check missed, re-anchored like-for-like).

**GREEN**: S68-P1 the stat-value typography (the three bare forms;
LIVE-probed at 36px/32px line-heights + normal letter-spacing on
accounts/contacts/reports). S68-P2 the reports fixed-scale (scale:"k"
at both call-sites; LIVE: "4 $337.0K" + "$92K" at the ytd period —
byte-identical at the reference's zero state, correct at nonzero).
S68-P3 the stale hover-comment re-scope (both carriers). S68-P4 the
wiring set (DIALOG_CONTENT.wide + DIALOG_FOOTER_WIDE at the edit
family + save-report; SETTINGS_PICKLIST.industriesPlaceholder at
settings; CONTACTS_LAYOUT.mobileCards at contacts; all five pin sets
re-anchored to the constant-consumption form). S68-P5 the format
coverage closures (7 its). S68-P6 the nano pair (the timeUntil doc
re-derived; formatMonthDayTime rides MONTHS_SHORT). S68-P7 the
sessioned body pre-gate (isBodyTooLarge after requireSession + before
req.json() in all 12 routes, applied via the persisted
scripts/body-pregate-s68.js at the sandbox root; the api.ts comment
extended to the family scope). S68-P8 the carriers (the SKILL H1
re-versioned to 1.65.0; the rate-limit header gains the upload line;
the five 22-era numerics refreshed to 27/39; the
CARD_TITLE_OVERRIDE.filters member retired, absence-pinned). **One
mid-flight repair**: the contact-photo twin re-anchors (the
blast-radius miss, closed same-session).

**Non-vacuousness**: pre-fix 3d60a20 worktree (node_modules
hard-linked via cp -al) + ONLY the new/modified test files →
**18 failed | 1257 passed (1275)** — exactly the RED set isolated.
Full clean teardown; `git worktree list` = the main checkout only;
the census sanity MATCH after cleanup.

**Full gate**: lint 0/0 · tsc 0 · **1275/1275 unit (79 suites, +18)**
· build clean · **114/114 e2e** on a fresh CI=1 boot (2.6m, all 8
mobile-nav checks green).

**LIVE battery**: the fix surfaces through real round-trips — the
sessioned pre-gate (a 20KB PUT /api/settings answers 400 "Request
body too large" rejected before the parse; the honest small body
parses — the settings keep-if-absent semantics held, zero residue);
the reports KPIs at nonzero (the ytd period: Won "4 $337.0K" inline +
Lost "2" with the "$92K" subtitle — the reference's literal formula);
the three stat-value computed-style probes (accounts-BarStat
text-2xl sm:text-3xl font-bold at 30px/36px/normal; contacts-IconStat
text-3xl font-bold at 30px/36px/normal; reports-CircleStat text-2xl
font-bold at 24px/32px/normal — the s13-proved reference geometry on
all three); the drawer both directions at a TRUE 390px (closed:
inert + the burger visible + scrollW 390; open: 8/8 truly visible +
the body lock + focus IN the drawer; Escape → inert + unlocked +
focus RESTORED to the trigger); zero 390px overflow on all ten routes
(both Dashboard casings); NO Tailwind v4 bug (--blur-sm 4px +
--shadow-sm `0 1px 2px 0 #0000000d` + a live surface computing
`rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`); the closing db:census MATCH.

**Screenshots**: 01/02/03/04/08 re-captured + **77-reports-kpi-scale
NEW** (the fix surface at the ytd period with nonzero won/lost) +
**78-mobile-nav-drawer NEW** (the s68 mobile-regression evidence at
390×844) — VLM-verified (77: 3/3 — the exact Won/Lost values read
back; 78: 4/4 — the drawer, 8 links, the close X, the dimmed
overlay).

**Docs realigned**: README (badge 1389 = 1275 + 114, the Tested row
+ the stat-value/pre-gate/fixed-scale entries, the tree/commands rows
at 79 suites/1275 + stat-value-contract + body-pregate, the
session-68 paragraph), AGENTS (the commands table at 1275 + the
session-68 block), CLAUDE (1275 ×4), PAD (the s68 inventory row + the
Total 79/1275+114 + the counting-convention note + the four 22-era
numerics refreshed), SKILL **v1.65.0** (frontmatter + project_state +
the new §16bh, applied atomically via the assert-first
scripts/skill_edits_s68.py at the sandbox root, 6309 → 6352 lines by
wc -l), this record, the plan's execution record, both worklogs;
.env/.env.example verified (no env surface change; DATABASE_URL
`file:../db/custom.db` with db/ at the repo root).

**Ship**: the commit on main + the SSH-wrapper v3 push (with
`--remote git@github.com:nordeim/neo-crm.git` — the s64 wrapper-trap
note honored) + the remote verification + the operator key shredded.
