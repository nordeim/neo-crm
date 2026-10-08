# Session 79 (2026-10-08) — the login-family rotation + the N-77c17 adjudication

The workspace SURVIVED s78 (the pull fast-forwarded da8d2b6 → 8c679b6, docs/session_152.md only — the session-78 execution narrative, zero code drift). Environment verified in place (DATABASE_URL="file:../db/custom.db" with db/ at the repo root; census MATCH 15/24/10/23/12 + 4 users). The platform DATABASE_URL override hazard stands — all ops under env -u DATABASE_URL.

Baseline gate GREEN: lint 0/0 · tsc 0 · 1523/1523 unit (87 suites) · playwright --list 132 in 4 files — the documented state exact; the skills/ exclusion verified in all three configs.

Drift sweep #75 CLEAN — the reference bundle fresh-fetched from /assets/index-DZ-xbrIm.js: 1,631,071 bytes, md5 a70a637fcf1d4291da8e0d965676dc11 exact — the 50th consecutive stable session.

Reference census #75 (agent-browser, live login at 1440 then a TRUE 390px viewport): the demo data zero (0/$0.0k/$0.0k/$0k/0%); the mobile-nav defect STANDS at a TRUE 390px (vw=390, nav w=0, 8 links in DOM, 0 visible, no hamburger); desktop normal (256px, 8 links, all visible). Our mobile drawer stays the deliberate documented superset.

Session 78 shipped at da8d2b6. My task is **Session 79** — the session_151 suggested targets: the never-rotated login/signup card family (the primary) + the N-77c17 TableHead token sweep (the deferred family-wide question — folded in and adjudicated).

The triple audits ran in parallel (79-a the s78 re-audit + 79-b the graduation audit as subagents; 79-c the fresh-eyes rotation on the login family by the orchestrator — the login card is PLATFORM code, not app-bundle code: zero auth markers exist in the 1.63MB bundle, so every claim was LIVE-EXTRACTED from the reference at 1440 AND 390 and cross-probed on our own dev server):

- **79-a: 12/12 checklist items GENUINE** — every S78-P1..P10 fix verified at file:line, the parity suite re-ran 28/28, the da8d2b6 commit honest (20 files, +1066/−196, 5 added / 15 modified, zero strays), 8c679b6 docs-only. Two nano notes (the P1 shorthand omission — the plan's own wording exact; the Sparkline docstring's loose opening phrase).
- **79-b: ZERO graduations, 13/13 (the 36th consecutive)** — the 8 mechanical censuses 7 CLEAN + ONE finding: CLAUDE.md:115 + :299 still read "(131 checks)" for the e2e layer (stale since the s76 131→132 bump — three realignments + three census sweeps missed the e2e-carrier lines; the N-50a class). Both operator decisions' evidence INTACT.
- **79-c: the N-79 family — 5 M + 6 L + 5 N** on the login/signup card family, every M/L claim live-extracted at BOTH widths and cross-probed on our dev server (the M-79c2 overlap measured -8px on ours vs the reference's +8px at both 390 and 1440; the text ladder measured 14px vs our 16px; the focus ring probed on both apps; the N-77c17 th probed rgb(115,115,115) vs our rgb(107,114,128)).

**The operator decisions (38th re-affirmation):** the CSV formula-injection posture (b) STANDS — the guard intact (csv.ts:31-33 → escapeCell → entity-export.ts's qq), ZERO new unguarded builders (the login family ships ZERO CSV surfaces), the bundle byte-stable for the 50th consecutive session. The source-vocabulary documented parity STANDS — every anchor re-confirmed at file:line; the login family introduces NO vocabularies (freeform fields with hand-rolled validation at the route boundary).

The plan (S79-P1..P15) written + validated against the codebase (the blast radius pre-checked: the login-reset back pin + the login-views -mb-2 pin re-anchor; the page-layout toContain pins survive the class additions; no e2e count change).

RED: **34 failing pins exactly** (the new login-family-parity suite's 32 + the 2 re-anchors). Non-vacuousness PROVEN at the pre-fix state: 34 failed | 1526 passed — exactly the modified-pin set, ZERO collateral.

GREEN applied in full: the auth text-size ladder (text-base md:text-sm + text-sm across the input/submit records — the send record fixes three surfaces at once); the back-button ladders (mb-2 flat on signup/verify + mb-2 sm:mb-4 responsive on reset — the v4-falsified verbatim -mb-2 retired with the comments re-derived); the ShieldCheck tile; the solid-ring focus construction (focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 on the three input records); the text-muted-ink TableHead sweep (the N-77c17 adjudication — one line, family-wide, per-surface overrides untouched); the mobile nbsp spacer (after the card, inside the max-w-md wrapper); the verify hint line + its plain wrapper div; the verify stack/form space-y-4 sm:space-y-6; the slate-400 icon split (the reset/signup inputIcon records); the flat stock code inputs (shadow-sm / transition-colors / ring-offset-2 retired); the submit chrome (disabled + keyboard rings); the bare-text callouts; the dead back2 member retired; the CLAUDE.md 131-count pair repaired.

Five mid-flight pin-shape repairs (the runs' own catches — the s77/s78 class: the mb-4 negative regex, the Mail-glyph needle scope, the hint literal living in the record not the card, the wrapper-div regex, the send-record re-anchor) + one structural repair (the spacer's first insertion landed inside the card — moved to the reference's own position after the card close).

Typecheck clean. **FULL UNIT: 1561/1561 (88 suites, +38).** Lint 0/0 + build clean. **FULL E2E GATE: 132/132 on a fresh CI=1 boot (all 9 mobile-nav checks green; the first run caught the documented s72 settings flake — the S72-P2 test re-ran green in isolation AND the full re-run green, the s74/s76 precedent).**

LIVE battery: the signin input + submit computing 14px at 1440 (was 16px); the focused input's box-shadow `rgb(255,255,255) 0 0 0 2px, slate-400 0 0 0 4px` — byte-identical to the reference's construction; the signup back→h2 gap +8px (was −8px OVERLAP); the reset ladder 8px at 390 / 16px at 1440 (both ends live-measured on both apps); the mobile spacer visible at 390 (16px tall); the reset/signup icons slate-400; the verify tile `lucide-shield-check h-7 w-7 sm:h-8 sm:w-8 text-slate-700`; the hint line present at 12px slate-500; the code inputs shadow-none at 44px; the table th rgb(115,115,115) = the reference's exact #737373; the drawer at TRUE 390px (full-bleed, 8 links, focus inside, body locked; Escape → inert + hidden + unlocked); zero overflow on all ten routes; NO Tailwind v4 bug (blur 4px + the shadow-sm re-pin + rounded-sm 4px); the closing census MATCH (256px/8) + the pristine census restored post-probe (db:seed → MATCH 15/24/10/23/12 + 4 users).

Screenshots 97 (the login text-ladder + focus ring at desktop) + 98 (the reset mobile ladder + spacer at 390) NEW — VLM 5/5 + 4/4 PASS.

Docs realignment: SKILL v1.76.0 (§16bs + project_state, 7065 → 7129, via the assert-first scripts/skill_edits_s79.py at the sandbox root — the frontmatter + H1 bumped together per the s78 promise) + README badge 1693 + AGENTS/CLAUDE/PAD at 1561+132 (+ the PAD s79 inventory row) + session_153.md + the plan's execution record + the repo worklog. .env/.env.example verified (no env surface change; DATABASE_URL file:../db/custom.db with db/ at the repo root).

## Summary

The full session-79 cycle completed on the **login/signup card family** (the session_151 suggested target — never a dedicated rotation) with the **N-77c17 TableHead sweep** folded in and adjudicated:

- **Audits**: 79-a s78 re-audit 12/12 genuine · 79-b zero graduations 13/13 (36th consecutive), 7/8 censuses clean + the CLAUDE.md 131-count finding · 79-c the fresh-eyes rotation found the N-79 family (5 M + 6 L + 5 N, every M/L claim live-extracted at both widths + cross-probed on our dev server — the PLATFORM-code lesson: the login card lives in the base44 shell, not the app bundle)
- **Key fixes**: the 14px auth text ladder, the -8px back-button overlap (the s21 v4-math claim live-falsified — a 58-session-old overlap), the ShieldCheck verify tile (the s21 misrecord), the solid-ring focus construction, the text-muted-ink TableHead sweep (the N-77c17 deferral closed with a live probe), the mobile nbsp spacer, the verify hint line + stack/form family, the slate-400 icon split, the flat stock code inputs
- **Gate**: lint 0/0 · tsc 0 · **1561/1561 unit (88 suites, +38)** · build · **132/132 e2e** — all RED-first, non-vacuousness proven (34 | 1526 pre-fix)
- **LIVE-verified** incl. the mobile drawer at 390px, no Tailwind v4 bug, 2 VLM-passed screenshots (5/5 + 4/4)
- **Both operator decisions standing** (the 38th re-affirmation, evidence-first)

**Suggested next (session 80)**: the remaining never-rotated seams (the topbar chrome got its s73 rotation but the profile page's own surfaces have not had a dedicated pass; the settings defaults editors' deeper family) or a re-rotation on the contacts rail (the s75 panel work left the slide-over's deeper chrome unprobed); standing: the insights-dialog icon identities remain unresolvable-in-bundle.
