# Session-61 Parity Remediation Plan (2026-10-05)

Session 61 on `main` @ `b01bd01` (= the session-60 code `6ab90ab` + the
operator's `docs/session_114.md` transcript commit; zero app-code drift —
`git diff 6ab90ab..b01bd01 --stat` = 1 docs file, 109 insertions). Workspace
INTACT from s60 (no sandbox reset): the tree refreshed by `git pull`
(6ab90ab..b01bd01, docs-only). Intake hygiene: ONE zombie dev-server
generation killed (pids 11474/11476/11477/11490/11523 — the s51 lesson);
ports 3000/3100 clear; no outer sandbox-root `.env` (the s58 quarantine
held). **Baseline gate on the intact tree: lint 0/0 (enforced) · tsc 0 ·
1204/1204 unit (75 suites)** — the documented state exact. The DB census
through the sanctioned seam:
`database: file:/home/z/my-project/neo-crm/db/custom.db` + counts 15/24/10/23/12
+ 4 users + `pristine: MATCH`. The `skills/` exclusion verified in all three
configs (vitest include allowlist, eslint ignores, tsconfig exclude).

## The standing layers (57th session, NO DRIFT)

Drift sweep #57: the reference bundle fresh-fetched (the Vite chunk
`assets/index-DZ-xbrIm.js`, URL cross-checked through the logged-in page's
performance API + a direct curl with a browser UA) — size 1,631,071 + md5
`a70a637fcf1d4291da8e0d965676dc11` **exact — the 32nd consecutive stable
session**. Reference census #57 (agent-browser, live login): the demo data
still zero (Total Leads 0 + "+5.3%", `$0.0k`); the mobile-nav defect stands
at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, scrollW 390,
NO hamburger); desktop nav normal (256px, 8 links); a reference 390px
screenshot captured (outside the repo, reference-screenshots/).

## The audits (two parallel agents + manual validation of every claim)

### A. The session-60 re-audit (61-a, fresh eyes on the b077443..6ab90ab diff)

All eight checklist items verified GENUINE at file:line — the six-key
CHART_COLORS retirement (record comment at constants.ts:475-480; the ten
live keys :481-492; zero dotted retired-key reads, zero computed access,
zero `key: "#hex"` patterns outside the dch pins + record comments; the
live consumers verified at dashboard/accounts/activities/constants.test),
the formAvatar retirement (zero executable hits; the profile-photo-upload
assertions intact), the session_111.md bracket correction (independently
re-derived: d8d50a3 SKILL wc -l = 5763, newline-terminated, the s59
script's `+1` formula over-counts), the SKILL §15.4/§19 carriers
(cyan400 at :861; the rewritten note :4918-4923; the CSS token family
whole in globals.css :121-126), the pin set (exactly 3 its; the guard's
anchors match real sites), the **non-vacuousness mechanically REPLAYED**
in a pre-fix b077443 worktree: **2 failed | 35 passed (37)** — the
commit's arithmetic reproduced to the digit — plus the regression scan
(zero import-line changes; tsc 0; lint 0/0) and the docs-arithmetic
cross-check (badge 1316; wc -l 5829 exact; the e2e 112 = 111 spec + 1
setup). ONE task-prompt correction (the -400 family's sixth member is
**amber400**, not gray400 — every repo doc already says it right). TWO
plan-doc micro-nits (the plan's own `:475-481`/`:4855-4858` range
anchors — the shipped records carry the correct ones). ONE pre-existing
doc drift found (61-a #1 below — the SKILL §19 chart row).

### B. The graduation audit (61-b: the ledger + the fresh-eyes sweep)

**ZERO graduations — 13/13 CONFIRMED (18th consecutive session).** All 13
standing items re-verified at file:line (the strict-bool idioms, the xlsx
accept, the partial-import INFO, the hydrate-error-vs-logged-out, the
reset role-gating, the list caps, the clientKey, the updateLead, the
hydrate-9, the SavedReport model deferral, the photoUrl `<img>` sites,
the mobile-nav test layer, the href-sink). Two chronic record-anchor
drifts noted (line-only, substance anchored by the annotations). The INFO
family ALL UNCHANGED (F-47c, N-48c, N-48f, N-48j, N-51c — anchors
verified, substance identical). Both operator decisions' code anchors
STANDING (the CSV (b) guard in both families + the `-` exclusion; all
retired vocabulary tokens absent from executable src including the s60
retirements; the stock-mirror KEEP intact; the N-58c boundary guard
present). The e2e sleep census at exactly 2 annotated keeps. The
fresh-eyes sweep (the ROTATION angle: dead localStorage keys, dead public
assets, dead package.json scripts/deps, dead API route surface, env-surface
parity, stale doc anchors, commented-out code — plus 11 lib/auth/infra
files read in full): the storage census CLEAN (exactly 2 keys, both
live), the API surface CLEAN (40 handlers all consumed/infra), the env
surface exact (3-var parity), zero commented-out code — with the
**N-61 family** below. `tw-animate-css` and the 9 route-case `.jsx` stubs
run to ground as LIVE (the ADR-005 vendoring story; the s24 route-case
layer).

### C. The findings (all manually validated at file:line this session)

- **N-61a (Low, dead public asset — the s54 fully-dead class, PUBLIC-ASSET
  variant — a NEW face after IMPORT/PROP-TYPE/DESTRUCTURED/TEST-LOCAL/
  KEY/TYPE/INTERFACE/ALIAS)**: `public/neo-crm-dashboard.png` (131,012 B)
  — byte-identical duplicate of `docs/neo-crm-dashboard.png` (both md5
  `a7b963b0…`), **zero tracked references** (the only 3 doc references —
  the prompt docs — point at the GitHub `docs/` path), and it **ships in
  every standalone build** via the `cp -r public` build step. Dead weight
  in the deploy artifact. Disposition: RETIRE the public/ copy (the
  docs/ original stays — it is the referenced one).
- **N-61b (Low, dead runtime deps — the session-2 R-4 unused-scaffold
  class, RUNTIME-DEP variant)**: `@radix-ui/react-alert-dialog` +
  `@radix-ui/react-radio-group` (package.json:23/:28) — **zero imports
  repo-wide** (src + tests), zero git history beyond the initial scaffold
  (`git log -S` empty), and no ui components exist for them (the ui/
  folder ships 13 files — no alert-dialog.tsx, no radio-group.tsx). The
  other 7 radix packages are all live (dialog/dropdown-menu/label/
  popover/select/slot/toast — each with a verified import site).
  Carriers: SKILL:106 (the deps-table "9 pkgs" row listing them) +
  SKILL:128-129 (the "9 `@radix-ui/*` packages" runtime-deps paragraph) +
  scripts/install_packages.sh:1 + both lockfiles. Disposition: RETIRE
  both + the carriers follow.
- **N-61c (Info, the stale doc-numerics family — the chronic
  comment-accuracy class, this time in the count columns)**: SIX flagged
  tree-block numerics + the fuller census found at validation:
  README:108 "16 REST route handlers" (actual: 27 route files / 39 verb
  handlers), README:122 + PAD:313 "8 models" (actual: 9 — User, Account,
  Contact, Lead, Event, Activity, Opportunity, SavedReport, Setting),
  README:125 "38 Vitest suites (600 checks)" (actual: 75 / 1204),
  README:126 "Playwright (92 checks)" (actual: 112) — PLUS the PAD §11
  "Key Files Reference" Lines column, mechanically re-censused by `wc -l`:
  ~20 of 25 rows stale (crm-store 296→343, auth 129→133, api 75→137,
  db-path 175→227, format 221→257, constants 172→498, lead-filters
  90→174, login-reset 100→245, reports-data ~200→~210, page-layout
  627→1258, csv 74→104, mobile-nav 170→206, app-shell 55→70,
  entity-dialogs ~810→~1080, globals.css 171→269, (app)/layout 12→11,
  schema 196→242, seed 349→468, mobile-nav spec ~100→~150, postcss 9→8,
  next.config 24→47; db.ts 22 / rate-limit 47 / wrapper 336 already
  exact). Disposition: FIX — refresh all to the mechanical census.
- **N-61d (Low, dead devDep — the R-4 class, DEV-DEP variant)**:
  `bun-types` (package.json devDependencies) — **zero references** (zero
  `Bun.` usage repo-wide across src/tests/scripts/prisma; no tsconfig
  `"types"` field; not `@types/`-scoped so never auto-included by tsc;
  zero triple-slash directives). Dev-type-only weight: `tsc --noEmit`
  never reads it, `bun` does not typecheck at runtime. Carrier: SKILL:131
  (the dev-deps "11" list). Disposition: RETIRE + the carrier follows
  (11 → 10).
- **61-a #1 (Info, the SKILL §19 chart-row drift — stale since session
  4)**: neo-crm_SKILL.md:4916 — the `chart-1…6` row carries
  `#3b82f6 #06b6d4 #f59e0b #f97316 #10b981 #ef4444` while globals.css
  (the file of record) ships `chart-3: #eab308` + `chart-5: #9ca3af`
  (and the SKILL's own §4 mirror :240-242 matches globals exactly) — the
  row sits under §19's "fix both if either changes" contract.
  Disposition: FIX — sync the row to globals.css.
- **Found at validation (the lockfile-staleness carrier)**:
  `package-lock.json` has been stale since s25 — it lacks `jspdf` +
  `html2canvas-pro` (added s25) and `@radix-ui/react-dropdown-menu`
  (added s13); only bun.lock tracked the dep changes. The regeneration
  method validated by dry-run this session (`npm install
  --package-lock-only --ignore-scripts`: 310 pure insertions, zero
  version churn on existing entries). Disposition: regenerate alongside
  the N-61b/d edits — the lockfile returns to package.json parity.

## The operator decisions (session 61)

1. **The CSV formula-injection posture (b) STANDS** (19th consecutive
   re-affirmation). Anchors verified by 61-b (csv.ts:31-33 the
   `/^[=+@\t\r]/` guard with `-` deliberately excluded, applied inside
   `escapeCell` :35-42 + entity-export.ts:43 `qq`; the static templates
   outside the guard; parseCsv untouched); the reference bundle
   byte-identical for the 32nd consecutive session — no new evidence; the
   data-flow scoping remains correct.
2. **The source-vocabulary documented parity STANDS AND EXTENDS to the
   N-61 family** (the standing policy, applied to this session's finds):
   - **Fully-dead surfaces retire** (the s48/s49/s54/s58/s59/s60 policy):
     the public/ duplicate asset (N-61a — the PUBLIC-ASSET variant of
     the fully-dead class) and the three never-referenced dependencies
     (N-61b + N-61d — the session-2 R-4 unused-scaffold precedent,
     extended to the RUNTIME-DEP and DEV-DEP variants) with their
     carriers (SKILL:106/:128-133, install_packages.sh, the lockfiles).
   - The doc-numerics carriers refresh (N-61c + 61-a #1 — the chronic
     comment-accuracy class, count-column edition; the §16ba lesson
     records the fully-mechanical census method).
   - `tw-animate-css` KEEPS (the ADR-005 vendoring story — the dep is
     the re-vendor source; run to ground as LIVE by 61-b).
   - The CSS `--color-chart-1…6` token family stays whole (the s60
     boundary — a different surface, unchanged).
   - The N-58c module type-contract boundary + the vendored ui
     stock-surface mirror stay whole (guard-pinned, not re-litigated).
   - The package-lock.json staleness closes with the regeneration (the
     lockfile returns to package.json parity for the first time since
     s25).

## The families

### S61-P1 — the dead-surface narrowing (N-61a + N-61b + N-61d)

- `public/neo-crm-dashboard.png`: the duplicate retired (the docs/
  original stays — it is the referenced one).
- `package.json`: the three deps dropped (`@radix-ui/react-alert-dialog`,
  `@radix-ui/react-radio-group` from dependencies; `bun-types` from
  devDependencies) with the record comment convention NOT applicable
  (JSON carries no comments — the record lives in the dch pin + the
  session record).
- `bun.lock` regenerated (`bun install`); `package-lock.json` regenerated
  (`npm install --package-lock-only --ignore-scripts`) — the regeneration
  closes the s25/s13 staleness as a side effect.
- `scripts/install_packages.sh`: the three tokens dropped from the
  scaffold line.
- `neo-crm_SKILL.md:106`: the deps-table row `@radix-ui/*` (9 pkgs) →
  `(7 pkgs)` with the list narrowed to the live set (dialog, select,
  popover, dropdown, label, toast, slot).
- `neo-crm_SKILL.md:126-133`: the runtime-deps paragraph — found at
  validation, the paragraph is ALSO stale since s25 (it claims "19
  total" and never listed `jspdf` + `html2canvas-pro`, the s25 PDF-seam
  additions; the actual count is 22 pre-fix → 20 post-fix) — refreshed
  to "(20 total)" with the two missing deps listed + "9 `@radix-ui/*`
  packages" → 7; the dev-deps list "Dev dependencies (11)" → (10) with
  `bun-types` dropped.

### S61-P2 — the doc-numerics refresh (N-61c)

- README:108: "16 REST route handlers (auth → reset)" → "27 REST route
  files (accounts → users)" (both the count and the span refreshed to
  the mechanical census).
- README:122 + PAD:313: "8 models" → "9 models".
- README:125: "38 Vitest suites (600 checks)" → "75 Vitest suites (1204
  checks)".
- README:126: "Playwright (92 checks)" → "Playwright (112 checks)".
- PAD §11 Lines column: the ~20 stale rows refreshed to the `wc -l`
  census (the approximate-marker rows keep their `~` style, refreshed).

### S61-P3 — the SKILL §19 chart-row sync (61-a #1)

- neo-crm_SKILL.md:4916: the `chart-1…6` row's hex list synced to
  globals.css — `#3b82f6 #06b6d4 #eab308 #f97316 #9ca3af #ef4444`
  (chart-3 `#f59e0b` → `#eab308`; chart-5 `#10b981` → `#9ca3af`). The
  note three lines below (the s60 carrier) already carries the
  two-surface story — untouched.

### S61-P4 — the pin set (RED-first)

The new `describe("session-61: the dead-surface narrowing (S61-P1)")` in
tests/dead-code-hygiene.test.ts — 3 its = 2 RED + 1 guard:

1. RED: public/ carries no neo-crm-dashboard.png
   (`read("public/neo-crm-dashboard.png")` returns null — the
   existsSync-based read helper's null path, the s56 misc.tsx-absence
   idiom).
2. RED: package.json carries none of the three dead dep tokens
   (`"@radix-ui/react-alert-dialog"`, `"@radix-ui/react-radio-group"`,
   `"bun-types"` — JSON.parse'd, key-anchored lookups in
   `dependencies` + `devDependencies`; word-anchored raw-source match as
   the belt-and-braces).
3. GUARD: the living dependency surface stays — the 7 live radix
   packages present in package.json AND their real import sites intact
   (ui/dialog.tsx reads `@radix-ui/react-dialog`; ui/button.tsx reads
   `@radix-ui/react-slot`; ui/select.tsx reads `@radix-ui/react-select`;
   ui/dropdown.tsx reads `@radix-ui/react-dropdown-menu` +
   `@radix-ui/react-popover`), `tw-animate-css` still in devDependencies
   (the ADR-005 vendoring story), jspdf + html2canvas-pro still in
   dependencies (the pdf-export seam), AND the docs/
   neo-crm-dashboard.png original present (the referenced copy).

**RED arithmetic**: add 3 its (1204 → 1207); the RED run = 2 failed (the
new RED pair) / 1205 passed (1207 total). No stale its to retire (zero
test pins on the three deps or the public png — the package.json-reading
tests pin the gate script / the census scripts / jspdf+html2canvas-pro
only; the metadata test reads og-image.png + robots.txt only).

### S61-P5 — the docs carriers

- README.md: the badge (1316 → 1319 = 1207 + 112) + the Tested row
  (1204 → 1207) + the session-61 paragraph.
- AGENTS.md: the counts (1204 → 1207 ×2) + the session-61 block.
- CLAUDE.md: the counts (1204 → 1207 ×3).
- PAD: the s61 test-inventory row + the Total (1207 + 112) + the §11
  Lines-column refresh (S61-P2).
- neo-crm_SKILL.md: v1.58.0 — frontmatter (version + last_updated +
  project_state) + the H1 + the new §16ba (the lesson: the fully-dead
  class reached the DEPENDENCY MANIFEST and the PUBLIC-ASSET tree — the
  RUNTIME-DEP/DEV-DEP/PUBLIC-ASSET variants; the fresh-eyes rotation
  must sweep OUTSIDE src/ — the manifest, the lockfiles, the public
  tree, the scaffold scripts; plus the lockfile-staleness lesson:
  package-lock.json drifted 36 sessions behind package.json because
  only bun.lock tracked the dep edits — regenerate BOTH on every
  package.json change) + the s61 session record row + the S61-P1/P2/P3
  carriers — applied atomically via an assert-first script at the
  sandbox root, counted by wc -l semantics.
- docs/session_115.md: the session record.
- The plan's own execution record + both worklogs.
- `.env`/`.env.example` re-verified (no env surface change expected —
  the example matches the three-var code surface exactly: DATABASE_URL /
  AUTH_SECRET / NEXT_PUBLIC_SITE_URL).

### S61-P6 — the verification suite

- **Non-vacuousness proof**: a pre-fix `b01bd01` worktree (node_modules
  hard-linked via cp -al), the post-fix dead-code-hygiene.test.ts copied
  in as the ONLY change → the 2-RED set must fail there (expect 2 failed
  | 35 passed of 37); cleanup after.
- **Full gate**: lint 0/0 · tsc 0 · 1207/1207 unit (75 suites, +3) ·
  build clean · 112/112 e2e on a fresh CI=1 boot (all 7 mobile-nav
  checks green) — the e2e boot re-exercises the standalone build with
  the pruned node_modules (the radix surface intact).
- **LIVE battery**: the fix surfaces render — the radix-driven surfaces
  (a stock dialog + dropdown + select round-trip on a live page) with
  zero page errors post-dep-removal; the standing drawer battery both
  directions at a TRUE 390px; zero 390px overflow on all ten routes; the
  Tailwind v4 token contract probe (blur 4px + the exact pinned shadow);
  zero probe residue through the seam (db:census MATCH).
- **Screenshots**: the standing set (02/11/12) re-captured + one NEW
  fix-surface shot (70-stock-primitives.png — a page exercising the
  surviving radix stock components, 1440×900) — VLM-verified per the
  house convention.
- **Ship**: the commit + the SSH-wrapper v3 push to main (with
  `--remote git@github.com:nordeim/neo-crm.git` explicitly — the wrapper
  defaults to the task-management remote) + the remote verification +
  the operator key shredded.

## The blast-radius pre-check (validated before this plan)

- The three deps: zero code consumers (exhaustive grep — src, tests,
  scripts, prisma); zero git history beyond the scaffold; no ui
  components; THREE doc/scaffold carriers (SKILL:106 + :128-133,
  install_packages.sh — all in S61-P1); both lockfiles regenerate; the
  7 live radix packages' import sites verified (dialog.tsx,
  dropdown.tsx ×2, label.tsx, select.tsx, button.tsx, toast.tsx).
- The public png: zero tracked references (the 3 prompt docs point at
  the GitHub docs/ path); the docs/ original stays; `cp -r public`
  copies whatever remains; the metadata test reads og-image.png +
  robots.txt only; zero e2e/spec references.
- The package.json-reading tests: gate-script.test.ts pins the `gate`
  script chain; db-census.test.ts pins the census scripts;
  pdf-export.test.ts pins jspdf + html2canvas-pro — none touch the
  three retiring deps (guard-pinned instead).
- The bun-types removal: tsc never reads it (no "types" field, not
  @types-scoped); bun does not typecheck at runtime; the full gate's
  tsc step is the proof.
- The doc numerics: the PAD §11 refresh is mechanically derived (wc -l
  census run this session); the README tree block refresh crosses no
  test pins (zero tests read the README).
- The N-58c KEEP set + the stock mirror + the CSS chart tokens: zero
  changes (guard-pinned, not re-litigated).
- prisma / seed / scripts/census.ts: untouched.
- The SKILL §19 row: a hex-only sync to the file of record; the s60
  carrier note below it untouched; grep-verified no other doc carries
  the stale `#f59e0b #f97316 #10b981` chart sequence.

## Execution record (appended as executed)

- **RED** (exactly as planned): the dead-code-hygiene session-61
  describe added (2 RED + 1 guard — the guard pins the 7 live radix
  packages + their real import sites, tw-animate-css, jspdf +
  html2canvas-pro, and the docs/ dashboard original). RED run:
  **exactly 2 failures**; full suite through RED: **2 failed / 1205
  passed (1207 total)**. No mid-flight repairs needed.
- **GREEN**: S61-P1 — the narrowing: public/neo-crm-dashboard.png
  retired (the docs/ original stays); the three deps dropped from
  package.json; `bun install` regenerated bun.lock (9 pure deletions);
  package-lock.json regenerated via
  `npm install --package-lock-only --ignore-scripts` (308 insertions /
  86 deletions — the s13 dropdown-menu + s25 jspdf/html2canvas-pro
  additions landing, the three retired deps' entries leaving);
  `@types/node` verified surviving through the vite/vitest peer chain
  (tsc green on the regenerated tree); scripts/install_packages.sh
  synced to the live 30-token set (20 runtime + 10 dev — it was also
  missing dropdown-menu/recharts/jspdf/html2canvas-pro, stale since
  s10-s25); the SKILL §2 deps-table row (9 → 7 pkgs) + the
  runtime/dev-deps paragraphs landed (the json.dump em-dash-escaping
  slip caught by diff review and fixed before proceeding — the
  write_text/UTF-8 method used instead). S61-P2 — the doc-numerics
  refresh: the README tree block (27 REST route files / 39 verb
  handlers, 9 models, 75 Vitest suites / 1207 checks, 112 e2e) + the
  PAD :313 tree row + the §11 Lines column re-censused by `wc -l`
  (~20 rows refreshed, the approximate-marker rows keeping their `~`
  style). S61-P3 — the SKILL §19 chart-row hex sync (chart-3
  `#eab308`, chart-5 `#9ca3af`; the s60 two-surface note below the
  row untouched). Touched suite: **40/40** (dead-code-hygiene, +3);
  lint 0/0; tsc 0.
- **Non-vacuousness**: pre-fix `b01bd01` worktree (node_modules
  hard-linked via cp -al) + the post-fix dead-code-hygiene.test.ts as
  the ONLY change → **2 failed | 38 passed (40)** — exactly the RED
  set; the guard green-through-RED. Worktree cleaned; `git worktree
  list` = the main checkout only; the main node_modules intact
  (sanity db-path suite 20/20 after cleanup).
- **Full gate**: lint 0/0 · tsc 0 · **1207/1207 unit (75 suites,
  +3)** · build clean (the one Turbopack warning pre-existing — the
  upload route) · the standalone artifact verified no longer shipping
  the duplicate png (og-image.png only) · **112/112 e2e** on a fresh
  CI=1 boot (2.6m, all 7 mobile-nav checks green).
- **LIVE battery**: the fix surfaces — the radix surfaces render
  post-dep-removal (the Edit Contact dialog round-trip: the ellipsis
  menu → the W7 dialog with the populated field set + Status/Source
  selects + Cancel/Save Changes, the save closing cleanly with 15 rows
  intact, zero page errors — exercising dropdown + dialog + select +
  label through the 7 surviving packages); the drawer both directions
  at TRUE 390px (open: the 288px inner panel, 8/8 truly visible,
  aria-expanded, the body+scroller dual lock, focus in panel; close:
  0/8 truly visible + visibility:hidden + unlocked); zero 390px
  overflow ×10 routes (both Dashboard casings); the Tailwind v4 token
  probe (`--blur-sm` 4px + the exact pinned shadow
  `rgba(0,0,0,0.05) 0 1px 2px 0` on a live dialog input); the closing
  db:census MATCH (zero probe residue).
- **Screenshots**: 02/11/12 re-captured + **70-stock-primitives NEW**
  (1440×900, the fix surface — the Edit Contact dialog exercising the
  surviving radix stock components) — all four VLM-verified 4/4 (the
  first pass caught 02/11/12 capturing the login redirect — the
  session had expired mid-battery; all three re-captured live and
  re-verified; 11/12 ended byte-identical to HEAD through the
  deterministic seed).
- **Docs**: README (badge 1319, the session-61 paragraph, the Tested
  row, the command row, the tree-block numerics), AGENTS (1207/112 +
  the session-61 block), CLAUDE (1207 ×3), PAD (the s61 inventory row,
  the Total, the counting note, the tree row, the §11 Lines column),
  SKILL **v1.58.0** (frontmatter + project_state + H1 + §16ba, applied
  atomically via scripts/skill_edits_s61.py at the sandbox root —
  5830 → 5901 lines by wc -l semantics [the count verified against
  `wc -l` exactly]; zero anchor repairs; the §2 deps-table +
  runtime-deps + §19 chart-row carriers landed pre-script),
  session_115.md, this record, both worklogs.
- **Env**: `.env`/`.env.example` re-verified — no env surface change
  (DATABASE_URL `file:../db/custom.db`, AUTH_SECRET,
  NEXT_PUBLIC_SITE_URL; the example matches the code's three-var
  surface exactly).
- **Ship**: the commit on main + the SSH-wrapper v3 push to
  `git@github.com:nordeim/neo-crm.git` + the remote verification +
  the operator key shredded.
