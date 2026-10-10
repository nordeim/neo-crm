# Session-96 Parity Remediation Plan (2026-10-10)

Session 96 on `main` @ `1d9e722` (the s95 ship `1a7b063` + the operator's
docs-only `session_192.md` addition). The workspace SURVIVED from session 95
(same sandbox — node_modules, `db/`, `.env` all standing); refreshed via
`git pull` (fast-forward, one file: `docs/session_192.md`). The platform
`DATABASE_URL` override hazard re-confirmed (it exports a parent-of-repo
path) — all session-96 repo operations ran under `env -u DATABASE_URL`.

## Baseline gate

- lint 0/0 ✓ · tsc 0 ✓ · 1836/1836 unit (102 suites) ✓ — exactly the s95
  ship state; build + e2e deferred to the post-fix gate (the one-gate
  discipline). Census MATCH (24 leads / 15 contacts / 10 accounts /
  12 opportunities / 23 activities + 4 users — the sqlite table names are
  `Opportunity`/`Activity`, not `Deal`).

## The standing layers (92nd sweep, NO APP DRIFT)

- **Drift sweep #92**: the reference app-shell bundle re-fetched post-login
  — `https://neo-crm-8ab2c17c.base44.app/assets/index-DZ-xbrIm.js`, md5
  `a70a637fcf1d4291da8e0d965676dc11` EXACT (1,631,071 bytes) — the **67th
  consecutive stable session**. (Decode note: the PRE-AUTH login shell
  references `/static/*` chunks — a rolldown layout that is NOT the tracked
  bundle; the census extracts the bundle from the POST-LOGIN shell.)
- **The desktop zero-data sweep**: the standing table reproduced —
  dashboard 0.31% · accounts/contacts/leads/reports/profile 0.00% ·
  calendar/activities 0.01% · settings 4.73% (the picklist genus) — ZERO
  new drift.
- **The phone sweep (390×844)**: the standing table reproduced — the ~0.5%
  mobile-nav-superset floor on every page (0.51–0.56%) · reports 0.71% ·
  settings 7.34% — ZERO new drift.
- **The second-width sweep (375×812 — the s95 suggested-next #3, maiden
  run)**: the SAME standing genera at the iPhone baseline width — the
  ~0.55% floor on every page (the displaced glyphs are a marginally larger
  share of the narrower 375×812 frame) · settings 7.52% (the picklist
  genus) · reports 0.55% — ZERO new drift; the fractional-column reflow
  holds at the second phone width.
- **Reference census #92**: demo data zero · desktop nav normal (256px/8
  links) · the mobile-nav defect STANDS at TRUE 390×844 (nav w=0, 0
  visible links, NO menu button — the 17th consecutive census).

## The audits (the triple-audit pattern)

- **96-a (subagent)** — the s95 ship delta (c215904..1a7b063) GENUINE:
  the `--pages` filter verified line-by-line (the pure fail-fast
  `parsePagesArg` seam at :83, both loops riding it, the B-95a8 header
  fix); 16/16 live; the non-vacuousness independently re-proven (4/4 pins
  RED against `git show c215904:scripts/sweep.ts`); the lockstep re-anchor
  (1832→1836) with CLAUDE ×4 verified; the docs counts verified against
  the live tree (badge 1968, PAD §11 24/24 rows, SKILL v1.92.0, the
  screenshots byte-exact); src/ untouched; `.env.example` 3 vars.
  Findings: **F-96a1** (REAL, tool-coverage) — the drawer battery's step-5
  resize-past-md probe runs against a CLOSED drawer (the auto-close
  listener at `mobile-nav.tsx:54-62` only registers while OPEN — the
  probe cannot go red for an s8-class regression; the true regression
  stays e2e-pinned at `mobile-navigation.spec.ts:114-144`). B-96a2–a5
  (the probe-JSON genus, the hardcoded REPO path, the `[m` sanitizer
  decode extending N-96a4, the `--pages=a,b` equals-form).
- **96-b (subagent)** — the graduation audit **13/13 GENUINE — ZERO
  graduations** (~53rd consecutive; `git diff 1a7b063..HEAD --stat --
  src/` EMPTY). The CSV guard census: 17 sites, ZERO unguarded
  live-data builders (csv-formula-guard 10/10 live). The
  source-vocabulary census CLEAN (constants 12/12 live). The config layer
  + the SEO/sitemap layer VERIFIED (37/37 three-suite, 47/47 four-suite —
  the N-95b1 phrasing honored; db-path 20/20). Findings: none real
  (B-96b1 record-keeping; N-96b1/N-96b2 phrasing nanos).

## The operator decisions (56th re-affirmation)

Both STAND, evidence re-verified live: **CSV posture (b)**
(guardFormulaPrefix at csv.ts:32 + qq() at entity-export.ts:43; the
17-site census, ZERO unguarded; the (b)-vs-(c) `-` exclusion unchanged)
and **source-vocabulary parity** (raw storage, no vocabulary introduced).

## The rotation (96-c) — the FORM family at TRUE 390 (the s95 suggested-next #1)

Walked live on BOTH apps at 390×844 (ours zero-data via `zero-data.ts`,
the seed restored after; the reference at its own standing zero state):

- **The FILTER ROWS: FULL GEOMETRY MATCH — every value identical.** The
  leads Filters popover's form controls: the trigger (32,1089) 326×36
  radius 6; the content (32,36) 320×398 radius 6 white p-16; the rows
  64/64/64/64/44 at y 53/133/213/293/373 w 286; the labels (Status /
  Source / Min Deal Value / Follow-up Date) 14px/500 rgb(10,10,10) h 20;
  the combobox triggers 286×36 radius 6 border 1 p-8/12; the number/date
  inputs 286×36 16px radius 6 p-4/12; the footer Clear + Save View
  buttons 139×36 each. The form family's in-app half closes CLEAN.
- **The LOGIN CARD: THREE RHYTHM DELTAS — the Tailwind v4 space-y genus
  on the auth surface, decoded.** All boxes/fonts/colors/radii EXACT
  (h1 24px/700, inputs 294×44 radius 12 border slate-200 pl-40, the
  Google button 294×54 radius 12, the submit 294×44 slate-900). The
  deltas (present at BOTH 390 and 1440 — measured, and net +12px card
  height at 390 / +20px at 1440):
  1. **The Google→divider gap: REF 24, OURS 48 (+24 at 390; 56 vs 24 at
     1440).** The reference nests google + divider + form inside ONE
     `w-full` BLOCK section (DOM-verified: the form's parent chain runs
     form → `div.w-full` m=[24/0] → centered) — inside it the adjacent
     margins COLLAPSE (googleWrap mb 0 vs divider my-6 mt 24 → 24; divider
     mb 24 vs form mt 0 → 24). OURS has the google wrap, the divider and
     the form as DIRECT children of the `flex flex-col` centered column —
     flex containers do NOT collapse margins, so v4's space-y-6
     margin-BOTTOM (on the google wrap) STACKS with the divider's my-6
     margin-top → 48.
  2. **The field label→input gap: REF 10, OURS 4 (−6 per field × 2
     fields).** The reference's `space-y-1.5` is v3 — margin-TOP on the
     FOLLOWING block (the inputWrap, measured m=[6px/0px]). Our v4
     `space-y-1.5` puts margin-BOTTOM on the PRECEDING child — the
     label — which is a non-replaced INLINE element (`text-sm font-medium`,
     box h 16): vertical margins on inline elements are IGNORED, so the
     6px is silently LOST. The same genus class as M-79c2 (the back
     button's −mb-2 → mb-2 fix) — the login fields were never walked
     before (the login page is not in the sweep's PAGES and the form
     family was the last unwalked static family).
  3. **The card's top offset (−6 at 390): downstream** — the +12px card
     height (fix 1 −24, fix 2 +6+6) shifts the page-centered card up by
     half. Resolves with fixes 1+2.

  The popover family's labels do NOT bite (`fieldLabel:
  "text-sm font-medium mb-2 block"` — a BLOCK label with an explicit
  margin, the s29-era construction).

## The remediation set (TDD — RED first, then GREEN)

- **S96-P0 — the login-card v4-genus fix** (the rotation's remediation,
  the first src/ change since s90):
  (a) `LOGIN_LAYOUT.field` + `LOGIN_SIGNUP_LAYOUT.field`:
  `space-y-1.5` → `[&>*+*]:mt-1.5` (the v4-correct expression of the
  reference's computed 6px gap — margin on the FOLLOWING block, the
  label stays INLINE exactly like the reference's own 16px inline box;
  the M-79c2 doctrine);
  (b) the signin column restructure in `login-card.tsx`: ONE `w-full`
  section wrapping [the google button (its wrap `space-y-3`, the
  reference's own inert class) + the divider + the form] — inside the
  block section the margins collapse to 24/24 exactly like the
  reference; the reset/sent/signup/verify views are untouched (they
  replace the column entirely);
  (c) **`login` added to the sweep's PAGES** (10 pages) — the reference
  serves the login card to AUTHENTICATED visitors too (the S23-P2
  finding) and ours mirrors it, so the post-login capture works on both
  apps: the auth surface joins the STANDING pixel sweep (this bug class
  never ships silently again); the PAGES pin + the header docs updated.
- **S96-P1 — the F-96a1 drawer-battery fix**: the step-5 resize-past-md
  probe REOPENS the drawer before resizing (the auto-close listener only
  registers while open — the probe must be able to go red); pinned in a
  new `tests/drawer-battery-tool.test.ts` (the reopen construction + the
  exact-selector protocol + the URL-based wait — the s94/s95 lessons
  encoded as pins).
- **S96-P2 — the sweep `--fail-on-drift` mode** (the s95
  suggested-next #2): a per-page standing-baseline table (desktop +
  phone classes by viewport width) + a PURE `driftVerdict` seam —
  `--fail-on-drift` exits 1 when any page exceeds ITS OWN standing
  baseline + margin (default 0.5pct; override `--drift-margin <pct>`),
  unlike the global `--max-diff` gate which must sit above the worst
  standing genus and so cannot see a 0.00% page drifting to 5%. RED-first
  pins (the baselines, the verdict logic, the wiring).
- **S96-P3 — the screenshots**: 142 (the login card at 390 post-fix) +
  143 (the filters popover at 390) — the VLM 5-question battery per the
  house protocol.
- **S96-P4 — the docs realignment**: this plan + its execution record +
  `docs/session_193.md` + the worklog + the count realignment (README
  badge + the Tested row's login mention, AGENTS the counts + the
  §Session-96 block, CLAUDE the counts ×4, PAD the s96 inventory row +
  the Total, SKILL v1.93.0 §16cj + project_state + the H1) + the
  CLAUDE-count lockstep pin re-anchor (1836 → the new total, the
  s92–s95 lockstep pattern).

## Blast radius (pre-checked)

- `src/lib/page-layout.ts` (LOGIN_LAYOUT.field — consumed by the signin +
  reset views), `src/lib/login-reset.ts` (LOGIN_SIGNUP_LAYOUT.field — the
  signup view), `src/components/layout/login-card.tsx` (the signin branch
  restructure only — the other views replace the column), `scripts/
  sweep.ts` (PAGES + the fail-on-drift seam + header docs),
  `scripts/drawer-battery-390.ts` (the reopen step), the unit test files
  (login-views + sweep-tool + the new drawer-battery suite + the
  dialog-geometry lockstep re-anchor).
- The e2e auth.spec uses role/text selectors (no wrap-structure
  selectors) — verified by grep before editing.
- The pins that anchor `space-y-1.5` verbatim (none found — the s21 pins
  anchor the signup STACK classes, not the field class; verified by grep
  before editing).
- The gate re-run decides everything else (the one-gate discipline).

## The execution record (2026-10-10, session-96)

Executed exactly as planned, RED-first:

- **RED**: 13 new-behavior pins failed against the pre-fix source (3
  login-views + 5 sweep-tool incl. the 10-page PAGES re-anchor + 1
  battery reopen) — zero collateral; 4 guard pins (the inline label,
  the exact-selector protocol, the URL wait, the dual lock) green from
  the start.
- **Non-vacuousness stash-proven**: `git stash push` the 5
  implementation files (page-layout, login-reset, login-card, sweep,
  drawer-battery) → 10 failed | 50 passed → pop → 60/60.
- **GREEN (S96-P0)**: the `[&>*+*]:mt-1.5` fields ×2 + the w-full
  section restructure + login in PAGES. The LIVE re-walk: the login
  card FULL GEOMETRY MATCH — **Δ=+0 on ALL 11 elements** (h1 209 ·
  subtitle 249 · google 293 · divider 371 · emailLabel 415 ·
  emailInput 441 · pwLabel 501 · pwInput 527 · submit 587 · forgot 643
  · signup 671; the rhythm gaps 24/10/10 exact); the filter rows
  byte-identical (re-verified in the same probe).
- **GREEN (S96-P1)**: the battery reopen-before-resize + 4 pins in the
  new tests/drawer-battery-tool.test.ts; the battery re-verified FULLY
  GREEN live (REOPEN-BEFORE-GROW: panel visible + dual lock engaged →
  RESIZE-PAST-MD: released).
- **GREEN (S96-P2)**: the STANDING_BASELINES + standingBaseline +
  driftVerdict seams + the wiring + the header docs; both maiden runs
  gated CLEAN. The login baselines set from the maiden values (0.3
  desktop / 0.8 phone — the CSS brand-mark logo genus).
- **The maiden 10-page sweeps**: desktop — the standing table
  reproduced + login 0.27%; phone — the standing table reproduced +
  login 0.75%. The 375×812 run (the suggested next #3) completed
  pre-fix with the same standing genera (floor ~0.55 · settings 7.52)
  — zero new drift at all three viewports.
- S96-P3: the screenshots 142 + 143 (VLM 5/5 + 5/5, zero
  adjudications); S96-P4: the docs realignment + the lockstep re-anchor
  (1836 → 1849) + the space-y census re-anchor (112 → 111).
- **GATE**: lint 0/0 · tsc 0 · unit (103 suites, +13 net → 1849) ·
  build clean · e2e fresh CI=1 (132/132).
- **LIVE**: both 10-page sweeps re-run clean post-fix with the drift
  gate; the census MATCH; the reference md5-exact (the 67th
  consecutive stable session).
