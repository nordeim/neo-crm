# The session-209 plan — THE PUSH-RITUAL REMOTE CONTRACT (the operational docs family joins the pin, and the sibling-repo remote retires)

Date: 2026-11-02 · Rotation: 209
Task: the operator's standing instruction set — audit + validate the
shipped session-208 state (commit `bb2c402` + the owner's transcript
commit `399bda3` — the session_439 transcript is this round's rotation
trigger), re-verify visual + functional parity with the live reference
(`https://neo-crm-8ab2c17c.base44.app/`, logged in with the documented
demo credentials), re-run the standing gates, remediate the identified
gaps, capture the round's screenshots, update the docs, and push to
`main`.

## 0. The audit (the baseline + the discovery — EXECUTED, all green, one live catch in the operational family)

The baseline gate at the shipped s208 state (the workspace carried
over — `git pull` fast-forward to `399bda3`; the standing `.env`
intact with `DATABASE_URL="file:../db/custom.db"`, `db/` at the repo
root, db census MATCH 15/24/10/23/12 + 4 users at `<repo>/db/custom.db`):

- lint 0/0 · tsc 0 · **138/2856** unit · build (compiled successfully —
  the 2 warnings the pre-existing Turbopack tracing heuristics) ·
  smoke 14/14 · **e2e 226/226 — CLEAN FIRST RUN** (8.0m; one
  environment-only wrinkle: a `nohup`-backgrounded e2e launch died
  with the spawning shell — the sandbox reaps orphans — re-run in the
  foreground, clean; zero code involvement).
- THE SIX DRIFT GATES: the four-band sweep CLEAN at `--fail-on-drift`
  (desktop 1280 · phone 390×844 · tablet 768×1024 · landscape
  1024×768) · the fullpage sweep CLEAN (desktop 0.093% / phone
  0.316%, both inside the standing margins) · the interior census
  CLEAN (exit 0, byte-parity, zero unexplained deltas at all four
  axes). One environment-only wrinkle: the dev server does not
  survive across tool invocations (the sandbox reaps spawned
  processes) — every gate re-ran with the server booted in-session.
- probe:ref STABLE — the reference bundle md5 `46bc2d9c`, the demo
  data still ZERO, the nav census standing. The conditional gates
  stay killed (no fresh bundle, no recharts 4.0).

THE PARITY RE-VERIFICATION (the operator's named focus, probed live
this round with the agent-browser CLI against BOTH apps logged in):

- **THE MOBILE NAVIGATION — BOTH SURFACES, WORKING.** The reference
  battery: the app drawer open at 390×844 (the Close button + the
  "CRM" h2 + the 8 destinations; the overlay computing
  `rgba(0, 0, 0, 0.8)`; body-locked while open, main `auto`; Escape
  closes with the lock released; the "Leads" link ride navigates
  `/Dashboard` → `/Leads` AND auto-closes AND releases the lock) +
  the landing disclosure menu (the 6-link panel — Features / Preview
  / Pricing / FAQ / Contact / Open dashboard; NO aria-expanded; the
  FAQ click closes it + lands on `/#faq`). Our battery: the identical
  drawer anatomy; the overlay computing `oklab(0 0 0 / 0.8)` (the
  same 80% black — the v4 serialization); the DUAL lock (body +
  main both `hidden` — the documented superset); Escape closes with
  every lock released; the Leads ride navigates + auto-closes +
  releases both locks (body `visible` · main `auto`); the disclosure
  menu carrying `aria-expanded` `true` → `false` through the FAQ
  ride (the accessible superset). The VLM comparison of the
  drawer-open pair: **IDENTICAL** — the sole note the reference's own
  Base44 platform badge (never mirrored, the standing doctrine).
- **TAILWIND V4 STATE CLEAN** (no config file, the CSS-first
  `@theme`).
- **SEO/SITEMAP live-verified**: the 11-route `/sitemap.xml` ·
  `/robots.txt` 200 (the Sitemap line) · `/manifest.json` 200
  `application/json` · the landing head's OG/Twitter cards +
  canonical (curl-verified on the dev server).
- **Hygiene**: no TODO/FIXME · no `console.log` · no `any` (both
  single hits are comment words — the standing doctrine) · `.env` +
  `db/*.db` git-ignored · `bun audit` at the pinned census 10 (4 high
  / 5 moderate / 1 low — all dev-toolchain transitive, zero runtime
  exposure; the zod advisory's flagged face is
  `eslint-config-next › eslint-plugin-react-hooks › zod`, our direct
  zod is ^4.6.7 ≥ the patched 4.6.6; the standing
  no-mid-rotation-bump posture holds).
- **The recent-changes audit**: the owner's newest commit `399bda3`
  adds `docs/session_439.md` only; src/ UNCHANGED since the s205 ship
  (the s206/s207/s208/s209 rounds all test-side + docs only).
- The scandihaven reference repo re-pulled (`61711c3`, unchanged
  since the s208 review — the highest-leverage borrows already
  embodied; no new material).

## 1. The round's material — the fresh-eyes walk's catch (F-209a)

**THE PUSH-RITUAL REMOTE CONTRACT.** The s208 close named the next
rotation's candidates: "whatever the fresh-eyes audit surfaces (the
semantic-prose residue or a new genus the tree grows)." The walk
surfaced a new genus — not prose semantics but an uncensused DOC
FAMILY: the operational push-ritual pair
(`docs/ssh_git_wrapper_v3.py` +
`docs/how-to-git-push-using-ssh-wrapper_SKILL.md`), which the
D-208a2 totality census never scoped (its live-section map covers
the six core docs + `.env.example` only).

**The finding:** both files carry the SIBLING REPO's remote —
`task-management` — inherited verbatim from the initial scaffold
(`b48fc3d`, the repo's first commit; the wrapper's "Field-tested
2026-09-16" header narrates the task-management field test that
produced it). The sites:

- the wrapper: `DEFAULT_REMOTE = "git@github.com:nordeim/task-management.git"`
  (L102) + the "Why this exists" docstring's canonical-remote claim
  (L13-14) + the Options default (L44);
- the runbook: the purpose claim (L4) · `cd task-management` (L34) ·
  the expected-output block's push lines (L77/L80) · the variant
  invocations `--remote git@github.com:nordeim/task-management.git`
  (L89/L93) · the troubleshooting sites (L160 "push rights on
  `nordeim/task-management`" · L176 the `git ls-remote` line) · and
  the factually WRONG AGENTS-corroboration claim (L189: "AGENTS.md:
  clone remote is `https://github.com/nordeim/task-management.git`" —
  the live AGENTS.md:7 says `https://github.com/nordeim/neo-crm.git`).

**The exposure:** the runbook's PRIMARY sequence (L57/L60) invokes
the wrapper with NO `--remote` — it rides `DEFAULT_REMOTE`, i.e. an
agent following the runbook verbatim pushes this repo's commits at
the sibling repo. Every round so far pushed safely ONLY because
AGENTS.md's git island (L3151) and the operator's briefs carry the
explicit `--remote git@github.com:nordeim/neo-crm.git` — the same
correct-and-lucky pattern as F-206a (the strictness row) and F-207b
(the recharts row): every gate green, the doc wrong, since the
scaffold. The skills/ mirror
(`skills/how-to-git-push-using-ssh-wrapper/`) carries the same stale
forms — the operator's own domain (see the declined list).

## 2. The cures (TDD — RED-first, the D-206a1/D-207b1 pattern)

**D-209a1 — THE REMOTE-CONTRACT FLIPS.** Every stale site flips to
the repo's own canonical remote (`git@github.com:nordeim/neo-crm.git`
/ `https://github.com/nordeim/neo-crm.git` / `cd neo-crm`):

- the wrapper: `DEFAULT_REMOTE` + the docstring claim + the Options
  default (the "Field-tested notes (2026-09-16 …)" header keeps its
  ship-time narration — it names no repo URL, the historical-quote
  doctrine);
- the runbook: the purpose · the `cd` · the expected-output block ·
  the variants · the troubleshooting pair · the AGENTS
  corroboration (now quoting the live AGENTS.md:7 form).
- src/ untouched (docs/tooling only — the baseline-inert
  construction: nothing in the build reads these files; smoke #14
  proves the artifact excludes docs/).

**D-209a2 — THE PUSH-RITUAL REMOTE CONTRACT PIN (the genus closes).**
A new describe in `tests/facts-census.test.ts` (the F-169f home —
the D-208a2 continuation), two its:

- **it-1 (the wrapper arm):** the repo's canonical remote read LIVE
  from AGENTS.md's own head claim (the `Clone remote: \`https://…\``
  line → the SSH transform), asserted equal to the wrapper's
  `DEFAULT_REMOTE` (read live from the code — the F-109a1 doctrine)
  + the freeze anchor (`git@github.com:nordeim/neo-crm.git`) + the
  wrapper's own doc faces (the docstring parenthetical + the Options
  default) + the cross-doc arm (AGENTS's git-island invocation
  carries the same explicit `--remote`). Either face drifting — a
  wrapper default change, an AGENTS remote change, or a lost
  invocation site — fails with a named message.
- **it-2 (the runbook arm):** the runbook carries the canonical SSH
  remote at its claim sites (the purpose line · the `--remote`
  variants · the `git ls-remote` troubleshooting line) + the
  AGENTS-corroboration claim quotes the LIVE AGENTS clone remote +
  the STALE FORM BAN: neither operational file contains
  `task-management` anywhere (file-wide — the flip removes every
  site; the historical field-test note names no repo).

**MUTATION-PROVEN ×4 (each planted → exactly 1 RED at its arm →
restored → GREEN):** M1 the wrapper's `DEFAULT_REMOTE` re-planted
stale → exactly 1 RED (it-1) · M2 the runbook's variant `--remote`
re-planted stale → exactly 1 RED (it-2) · M3 the runbook's
AGENTS-corroboration line re-planted stale → exactly 1 RED (it-2) ·
M4 the AGENTS git-island invocation's remote flipped → exactly 1 RED
(it-1, the cross-doc arm).

**The .env.example bidirectionality holds**: the standing face (the
six app knobs + the four s204 parity knobs + E2E_PORT + HEADLESS =
the D-205a2 totality) is unchanged this round; the working `.env`
carried over intact at the pull (db census MATCH at the standing
contract).

## 3. The re-anchors (the count ladder + the docs lockstep)

- `scripts/count-ladder-209.py` (the 208 form, unit-only): UNIT
  **2856 → 2858** (+2 — the two D-209a2 its) · SUITES 138 HELD (the
  pins land in an existing file) · E2E 226 HELD · badge **3082 →
  3084** (the unit+e2e arithmetic: 2858+226). The retired 2856
  site-forms join the negatives (the s192 doctrine). Sites: the
  README badge · Tested row · tree · commands; the AGENTS commands
  table · gate-order; the CLAUDE gate-order · commands · pyramid ·
  coverage seam; the PAD tree · Total · HEAD · checklist · commands;
  the SKILL commands · Appendix B unit total; the test-side
  re-anchors (the docs-counts UNIT constant + the layer-axis pair
  [first = s209, second = s208 at its ship 2856/226] + the 2856
  negatives · the dialog-geometry-parity F-92a3 ladder).
- `scripts/skill-head-209.py`: the SKILL frontmatter v1.205.0 →
  **v1.206.0**, `last_updated` stays 2026-11-02 (the same-day form —
  the flip is version-only), the H1 lockstep, the s208 layer
  comment-demoted at its ship counts (2856/226), the new s209 head
  layer at 2858/226.
- The AGENTS Session-209 section · the PAD §7.1 s209 inventory row ·
  `docs/session_440.md` (the transcript) · the worklog Task ID 209
  entry · this plan's execution record (§5).

## 4. The final gate

lint 0/0 · tsc 0 · **138/2858** unit · build · smoke 14/14 ·
`CI=1 bun run test:e2e` 226/226 · the desktop + phone sweeps re-run
CLEAN (the cures are baseline-inert by construction — test files +
operational docs never enter the build — but the house proves it) ·
db census MATCH · `git status` clean of secrets/dbs.

## 5. The execution record (filled at execution — all claims live-verified)

- §0 the audit: executed in full before the plan landed (the
  baseline gate + the six drift gates + the probe + the parity
  re-verification with agent-browser against BOTH apps + the VLM
  drawer comparison + the SEO/sitemap curl legs + the hygiene greps
  + the bun-audit tally + the recent-changes diff + the scandihaven
  re-pull + the fresh-eyes walk that found F-209a).
- D-209a2: **RED-first at birth** — the pin written before the
  flips; the run at the stale tree failed EXACTLY 2 (both its, the
  named messages: the wrapper default mismatch + the runbook purpose
  claim), zero collateral (49 skipped) — the proof the pin catches
  the finding. Then D-209a1's 12 flips (the wrapper ×3 · the runbook
  ×9) → GREEN (2 passed).
- MUTATION-PROOF ×4 (each planted → exactly 1 RED at its arm →
  restored → GREEN): M1 the wrapper `DEFAULT_REMOTE` re-planted
  stale → exactly 1 RED (the wrapper arm) · M2 the runbook variant's
  `--remote` re-planted stale → exactly 1 RED (the runbook arm) · M3
  the AGENTS-corroboration line re-planted stale → exactly 1 RED
  (the runbook arm) · M4 the AGENTS git-island invocation's remote
  flipped → exactly 1 RED (the wrapper arm, the cross-doc arm). One
  arm-ownership correction at birth: the FIRST M1 run produced 2 RED
  (the wrapper-ban assert lived in the runbook arm) — the
  restructure moved each arm's ban onto its own file; every
  mutation then proved exactly-1 — the correction the mutation
  proof exists to force.
- The arithmetic verified against the live unit run BEFORE any doc
  flip: **138/2858** (exactly +2, clean first pass); the full
  facts-census file 51/51.
- The ladder: `skill-head-209.py` (3 flips: the s209 layer live at
  2858/226 · the frontmatter 1.205.0 → 1.206.0 · the H1 lockstep;
  last_updated stays 2026-11-02 — the same-day form; idempotent —
  the re-run a verified no-op) + `count-ladder-209.py` (**26
  flips** — the README/AGENTS/CLAUDE/PAD/SKILL live sites + the
  docs-counts UNIT constant + the layer-axis pair [first = s209,
  second = s208 at its ship 2856/226] + the 2856 negatives + the
  dialog-geometry-parity F-92a3 four positives + negatives; the
  re-run 26 no-ops) → **138/2858 GREEN** with every doc pin passing.
- The wrapper bytes verified at the flip (the runbook's own
  troubleshooting ritual): the key-delimiter constant's REAL bytes
  confirmed intact on disk via the byte-probe (the agent-tooling
  display layer shows a redaction placeholder for that constant —
  the documented artifact the runbook's troubleshooting section
  describes; never "repaired" based on a redacted display).
- The `.env` bidirectionality: the carried-over `.env` verified at
  the pull (db census MATCH at the standing contract). The standing
  env face unchanged this round.
- The captures 702-706: VLM-verified (each confirmed showing the
  intended page/state — the dashboard at desktop + at 390 · the
  drawer OPEN at phone · the landing mobile menu OPEN at phone ·
  the login card; one capture re-shot — 702 initially rode the
  390 viewport after a failed first save, re-captured at 1280, the
  distinct file sizes the proof).
- The wrapper field-verification: this round's own push runs through
  the CURED wrapper (the default now the repo's own remote; the
  explicit `--remote` still passed per the AGENTS:3151 form — belt
  and suspenders) — see the transcript close.
- The final gate: see the session_440.md transcript close.

## The declined list (this round)

- The skills/ mirror flip
  (`skills/how-to-git-push-using-ssh-wrapper/` carries the same
  stale forms) — skills/ is the operator's own domain (the standing
  brief excludes it from code checking; no session round has ever
  modified it — only the operator's `update skills` commits touch
  it). Noted here for the operator; the docs/ family (the files the
  operator's own briefs reference) is cured.
- A mid-rotation eslint/vite-family bump to cure the advisories —
  the standing no-mid-rotation-bump posture (a toolchain bump forces
  the pixel baselines' re-derivation — its own rotation).
- A semantic-prose-claim census — the fresh-eyes walk surfaced the
  operational family instead (this round's genus); the prose residue
  stays under the rotation audit's fresh-eyes walk.
- The `.env` working-tree refresh as a repo change — `.env` is
  operator-local and untracked; the bidirectional ritual (the
  carried-over `.env` verified by the db census at the pull) covers
  the verification.
- Committing the round's one-shot walker scripts (if any) — the PIN
  is the permanent census.
