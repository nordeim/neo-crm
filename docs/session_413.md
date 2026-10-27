I'll start by internalizing the operating instructions and then work through this complex multi-phase task systematically. Let me first check the workspace state and set up the repository.
The workspace has been reset — no neo-crm clone exists. I need to clone the repository. Let me set up the workspace and create a task plan.
The workspace has been reset. I'll clone the neo-crm repository and set up my task plan.
Repo cloned successfully. Key observations: `db/` folder already exists at root, vitest/playwright configs exist, and docs are massive (AGENTS.md is 788KB, worklog.md is 1.6MB). Let me review the structure and docs strategically.
Excellent — the repo already has substantial infrastructure. Let me explore the source structure and check what's already in place.
This is a mature codebase with extensive test infrastructure. Given the massive documentation files (1MB+), let me dispatch parallel agents to digest them while I examine the code state.
The project has 411 sessions of history. Let me dispatch parallel agents to digest the massive documentation while I examine the recent code changes myself.
Two comprehensive digests received. Now let me dispatch agents for the session docs and skills catalog, while installing dependencies.
All documentation digested. The project is at its healthiest recorded state (Session-194 delivered, main @ `facdd56`, fully GREEN). Now let me install dependencies and establish the baseline.
The ambient `DATABASE_URL` shadow exists (the F-123a1 hazard documented in the repo). The `scripts/prisma-env.ts` wrapper should scrub it. Let me push the schema and seed.
Database setup confirmed: `db/custom.db` at repo root, census MATCH. Now let me run the baseline gate — lint, typecheck, and unit tests first.
Lint 0/0 and typecheck clean. Now the unit tests:
138 suites / 2811 checks all green — matches documented state exactly. Now the build:
Smoke 14/14 — including sitemap/robots/manifest verification. Now the e2e battery (192 checks):
The e2e auth setup failed. Let me diagnose the root cause:
Infrastructure issue — Playwright browser binary missing in this fresh sandbox (not source-code debt). Installing:
**Full gate verified GREEN**: lint 0/0 · tsc 0 · 138/2811 unit · build · smoke 14/14 · e2e 192/192. The documented state aligns exactly with the codebase. Now let me check the reference app's bundle state and start the parity validation.
probe:ref **STABLE** — the reference bundle (md5 `46bc2d9c`) is unchanged since session 194, demo data still ZERO, mobile census STANDING. No parity event. Now let me run the drift sweeps to verify our build holds the pinned baselines:
Sweeps pass with baselines held. Now let me start the dev server and visually verify the app — including the mobile navigation menu the user flagged. First, let me load the agent-browser skill:
Dev server up. Now let me login to our app and verify the dashboard:
Login redirected to the landing page `/` instead of `/dashboard`. Let me verify auth state and check the login flow behavior:
Login succeeded (auth/me returns user). The redirect to `/` with no `from_url` is code behavior — let me examine the full context to confirm this matches the reference:
This is documented session-147 behavior: plain login lands at `/` (the reference's own flow), while `from_url` round-trips return you to the original target. Let me verify against the live reference app now — logging in with the provided credentials:
The reference also lands at `/` after plain login — our clone matches its behavior exactly. Now let me capture the reference dashboard for comparison:
Now let me test the reference's mobile menu at 390px:
Reference mobile menu works — 8 nav links, Close button, CRM heading. Now the same flow on our local app:
Our dashboard renders with seeded data (reference has zero demo data — documented standing state). Now the mobile nav test at 390px:
Our mobile menu opens with identical structure. Let me verify the behavioral contract — link click navigation and auto-close:
Mobile nav verified: link click navigates to `/Contacts` and the menu closes. Let me check for console errors and visually compare the captured screenshots:
No page errors on either app. Let me verify the screenshots aren't blank and compare them visually:
The screenshots folder already has a historical capture library. Let me verify my new captures and compare them with VLM:
Now let me compare the local vs reference captures with VLM:
VLM confirms desktop parity. Now the mobile menu comparison:
VLM confirms mobile menu parity — zero structural differences. Let me run the final mobile comparison and then scope the code audit to recent changes:
Now I have full context on recent changes. Let me dispatch the code audit against the web-application skill rubric, focusing on recent changes and the user-flagged areas:
Both audits complete — **0 Critical/High/Medium findings**. The codebase is clean; the findings are gate-coverage gaps and documented trade-offs. Let me validate the audit findings myself before building the remediation plan:
Both findings confirmed at the code level. Let me examine the a11y spec helper structure to plan the fix precisely:
The a11y pattern is fully clear. Now let me check the count-lockstep enforcement before writing the remediation plan:
The lockstep machinery is fully mapped. Let me verify the exact current census before writing the remediation plan:
Census verified: 31 a11y tests, sum = 192. Adding 2 → 194. Now let me examine the house plan format, then write the remediation plan:
I have the house plan format. Now let me write the comprehensive remediation plan:
Plan created. Now let me validate it against the codebase before executing — checking the 404 page classes and enumerating the exact live-tense count sites:
Plan fully validated against the codebase — all anchors confirmed. Now let me execute the TDD remediation:
**R1 — the true-HTTP-404 status pin.** Adding the assertion to the existing S12-P2 e2e test:
R1 已完成。现在开始 **R2 — a11y 双门注册**。让我检查完整的 404 布局类，以构建正确的 sanctioned matcher：
Only the `text-slate-300` h1 will be axe-flagged (slate-600/700/800 all pass AA). Now adding the sanctioned matcher and the two registrations:
R2 已完成。现在进行 **R3 — 确定来自被污染 shell 的 in-app 交付 kill-switches**：
All three cures applied. Now the **mutation-proofing** phase — first verifying the new pins are born-green against the standing build:
The crm.spec 404 test passed, but the new a11y scans failed — let me examine the violation details:
GATE 1 (structural) passed clean on the 404 — the failure is GATE 2's matcher form: axe emits the bare `h1` target (the page's only h1), not a class selector. Fixing the matcher to the axe target form:
Both 404 a11y scans **GREEN**. Now the mutation-proof phase — first, removing the sanctioned matcher to prove GATE 2 has unique teeth:
**Mutation 2 proven** — GATE 2 trips exactly once per 404 surface, restored → GREEN. Now Mutation 1 for the HTTP-404 status pin (requires rebuild):
The mutation tripped the visibility pins but NOT the status pin — the 404 status survived the in-boundary redirect (Next commits the 404 before rendering). The realistic regression shape is a **catch-all route** — let me mutate that way instead:
Build was killed (exit 137 — resource pressure). Let me free the dev server and browser, then retry:
**Mutation 1b proven** — the status pin trips RED exactly at line 944 (`Expected: 404, Received: 200`). This is precisely the regression the old pins could not catch (a catch-all rendering the 404 design at 200 status would pass every visibility pin). Restoring:
Build failed — let me see the full error:
Stale dev-mode type validator referencing the removed mutation route. Clearing `.next` and rebuilding fresh:
All pins GREEN. Now the full e2e battery to confirm the new count:
**194/194 e2e — the new count verified at the full battery.** Now the count ladder + skill head surgery. First, the head surgery script:
Now writing `skill-head-195.py` following the house form:
Head surgery complete. Now the count ladder:
The walk67 clause lives at README:287. Now let me check the AGENTS litany and write the count ladder:
All anchors verified. Writing the count ladder:
19 flips, all anchors unique. Verifying the docs-counts lockstep holds:
Three live-census pins tripped — exactly the enforcement machinery working. Let me examine each:
The layer-axis assertion needs its standing per-session re-anchor (first layer = s195, second = s194). Let me check the other two failures:
All three failures are the standing per-session re-anchors the lockstep requires. Making the three re-anchor edits:
I broke the describe block boundary — fixing with the full intended edit:
Now the PAD §11 a11y row re-anchor (407 → 436):
**138/2811 unit GREEN** — the lockstep holds. Now the remaining docs: AGENTS Session-195 section, session_412.md, worklog entry, README clause, PAD inventory row. Let me examine the house forms:
Now writing the session record, worklog entry, AGENTS section, PAD row, and README clause:
Appending the worklog entry {Task ID: 195}:
Now the AGENTS.md Session-195 section. Let me find the Session-194 section's structure:
Appending the AGENTS.md Session-195 section:
Inserting the PAD §7.1 session-195 inventory row after the s194 row:
Now the README walk-contracts clause:
Unit suite GREEN with the README clause. Now the plan execution record:
Now capturing the dev-server screenshot set for the remediated codebase, following the repo's numbered convention (575-588 exist from s194):
Session lost auth — logging in again and completing the mobile captures:
All 11 dev-server captures landed (589-599). Now the final gate — shutting down the dev server and running the complete gate:
One failure in the settings Defaults tab test (passed in the earlier run — possible flake). Let me diagnose:
Reproducible in isolation — not a flake. Let me examine the test and the state:
The visibility pre-wait passed but the boundingBox read still got null — the starved-read class. Let me check the error context:
The error context shows a **textbox** "Default Currency" (placeholder AED) — let me examine the settings Defaults tab structure:
Let me determine whether this failure exists on the pristine s194 tree — stashing my changes and running the test:
The stash failed (untracked files) — so the tree still has my changes, and the test **passed**. This is the documented s164 "starved-read" flake class, not a regression. Let me verify flakiness and check the house pattern for box-read robustness:
3/3 clean isolation runs — confirmed flake (the s164 starved-read class). Let me check the house expect.poll idiom before hardening:
Applying the house expect.poll hardening to the flaky box reads:
Hardening verified. Let me record the flake hardening (D-195a4) in the session docs:
First two docs updated; the AGENTS anchor didn't match. Fixing:
The 589-596 captures landed at repo root (agent-browser daemon CWD) — moving them into docs/screenshots/:
All captures verified. Now the final full e2e battery:
**194/194 — final gate fully GREEN.** Now the pre-push probe:ref and census re-checks:
All standing layers verified. Now the git commit + push. Let me read the SSH wrapper skill instructions first:
No ssh binary and no paramiko — the Appendix A path. Let me read the shim spec and install paramiko:
Shim ready. Key sanity check, then stage + commit:
All 34 files staged — the intended set, no secrets, no db files. Now the commit in the house emoji-Conventional-Commits style:
Commit `9ff0d37` created on main. Now the SSH wrapper push — dry-run first:
The dry-run used the wrapper's default remote (`task-management.git` — the skill doc's origin repo). I need to pass the neo-crm remote explicitly:
Dry-run verified — fast-forward `facdd56..9ff0d37`. Now the real push:
**Pushed and remote-verified: `main @ 9ff0d37` == local HEAD.** Now shredding the operator key per the procedure:
All done. Here's the session summary:

**Session-195 delivered ✅** — the post-194 audit round, shipped to `main @ 9ff0d37` (remote-verified via the SSH wrapper, key shredded).

**What happened:**
- **Validated** the documented state against the fresh clone: full baseline gate GREEN (lint 0/0 · tsc 0 · 138/2811 unit · build · smoke 14/14 · e2e 192/192 · probe:ref STABLE · census MATCH)
- **Audited** with the repo's `web-application` skill rubric: **0 Critical/High/Medium** — the codebase is clean; findings were gate-coverage gaps and documented trade-offs
- **Live parity walk** on the reference app: login → landing, dashboard, and **mobile menu verified working on both apps** (VLM 3/3: zero structural differences)
- **Remediated (TDD, mutation-proven):** HTTP-404 wire freeze · a11y two-gate 404 registrations (+2 → e2e 194/194) · Playwright env determinism · a starved-read flake hardening caught in the final gate
- **Verified your asks:** `DATABASE_URL="file:../db/custom.db"` at repo root, vitest+playwright suites, sitemap/SEO, `.env.example` bidirectional — all standing
- Docs lockstep updated (SKILL v1.192.0, AGENTS, session_412, worklog, PAD, README, 11 dev-server screenshots committed)

**Suggested next steps:** verify `9ff0d37` on GitHub; the next rotation (196) triggers on your next transcript commit — its standing material is the re-walk staleness ladder (walk50 drawer) unless the reference gains data or ships a new bundle.
