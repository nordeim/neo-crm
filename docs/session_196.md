The workspace has been reset (no neo-crm repo present). Let me check the uploaded files briefly, then clone the repo fresh.
Repo cloned successfully. Let me check the recent git history and read the key documentation files.
Repo is on `main`, clean, with `db/`, `tests/`, `vitest.config.ts`, `playwright.config.ts` already present. Now let me read the core documentation files.
Let me read the files directly from the repo instead.
CLAUDE.md fully read. Now let me read the session docs and the session96 remediation plan.
Session 193/194 read — this is session 97. Now the session96 plan and worklog tail.
Now the worklog tail:
Session 96 shipped at `f33020d` (HEAD `b48cac9` = s96 ship + docs-only). This new task is **session 97**. Let me read the remaining core docs — README, Project Architecture Doc, and the AGENTS.md contract.
Now let me review AGENTS.md key sections and the Project Architecture Document summary.
Now let me look at the Project Architecture Document overview and the skills catalog.
Now the skills catalog:
Documentation reviewed. Now let me set up the environment and validate against the codebase. Key hazard noted from session docs: the platform `DATABASE_URL` override — all repo ops must run under `env -u DATABASE_URL`.
Confirmed the platform `DATABASE_URL` hazard (`file:/home/z/my-project/db/custom.db` — parent-of-repo). `.env` missing (fresh clone). Let me set up.
DB synced and seeded. Let me run the census and the baseline gate (lint → typecheck → unit).
Census MATCH at repo-root `db/custom.db`. Now the baseline gate:
**Baseline gate GREEN: lint 0/0 · tsc 0 · 1849/1849 unit (103 suites)** — exactly the s96 ship state. The codebase validates against the documented status. Now the audit phase — let me examine the s96 ship delta and dispatch audit subagents.
The s96 delta is clear: 3 src/ files (the login-card v4 fix), 2 scripts (sweep --fail-on-drift, drawer battery), 5 test files, and docs. Now let me check the skills folder structure and dispatch the audit subagents.
Skills folder confirmed (276 entries; relevant: `code-quality-standards`, `tdd`, `agent-browser`, `tailwind-patterns`, `verification-and-review-protocol`). Now dispatching the two audit subagents in parallel — **97-a** (s96 ship delta) and **97-b** (graduation ledger + operator decisions + config/SEO layers):
Both audits are back **clean**:
- **97-a**: s96 ship delta 7/7 GENUINE (non-vacuousness independently re-proven: 10 failed | 50 passed reproduced). Zero REAL findings; B-97a1 (reset-view field scope), B-97a2 (`--drift-margin` NaN disarms gate), N-97a1 (stale 9-page comments).
- **97-b**: **ZERO graduations** 13/13 (~54th consecutive). CSV census 17 sites ZERO unguarded; source-vocabulary CLEAN; config + SEO/sitemap layers VERIFIED. **Both operator decisions STAND (57th re-affirmation)**.
Now the standing layers. Let me read the sweep tool's usage docs first.
Let me start the dev server in the background, then run the standing layers.
Dev server up. Now the **drift sweep #93** — the reference bundle md5 check + reference census via a Playwright probe:
**Drift sweep #93 CLEAN — the 68th consecutive stable session**: bundle md5 `a70a637f…` EXACT (1,631,071 bytes); demo data zero; desktop nav 256px/8 links; **mobile-nav defect STANDS at TRUE 390** (navW=0, 0 links, no menu button — 18th consecutive census). Now the desktop sweep with the drift gate:
Desktop sweep #93 clean (drift gate passed; dashboard 0.43% within margin of 0.31 baseline; settings 4.73% standing genus; login 0.27% standing logo genus). Now the phone sweep at TRUE 390×844:
Phone sweep #93 clean — the standing table reproduced exactly (floor 0.51–0.56%, reports 0.71%, settings 7.34%, login 0.75%). All standing layers verified. Now the **97-c rotation**. Per the s96 suggested nexts, I'll walk: (1) the dashboard chart cards at TRUE 390 (the last unwalked chart surface), (2) the 768×1024 tablet maiden sweep, (3) the B-97a1 reset-view field re-walk.
Now let me write the 97-c rotation probe — the dashboard chart cards at TRUE 390×844 walked live on BOTH apps:
Output truncated. Let me re-run with full log capture:
KPI grids are **byte-identical** on both apps (6× 358×130 KPI cards; chart grid 494/398; bottom grid 131/106/158). But my card selector matched nothing. Let me check the Card component classes and refine:
**THE DASHBOARD CHART CARDS AT TRUE 390×844: FULL GEOMETRY MATCH — Δ=+0 on ALL 13 elements** (KPI cards 358×130 ×6 with 324×32 sparks; Pipeline 358×494 + SVG 308×300 + 5 bars + 5 chips; Revenue 358×398 + SVG 308×300; Top Reps 131, Lead Sources 106, Upcoming Activities 158, Recent Deals 155 — every y-position identical). The last chart surface is walked CLEAN. Now the **768×1024 tablet maiden sweep** (the md boundary):
Tablet maiden run: zero catastrophic drift; **accounts 0.72%** is a new tablet-width genus to decode (desktop standing is 0.00). Let me locate the diverging region:
Divergence concentrated at x≈448–768, y≈544–703 (right side, mid-page — the table region). Let me decode it live on both apps at 768:
**The accounts tablet genus DECODED**: the documented s95 STANDING overflow genus at the md boundary — the reference's table rides bare `flex-1` and pokes out (scrollW 567 > clientW 512, main h-scroll) while ours scrolls in-box (`min-w-0`); th distribution differs downstream (ref 90/…/48 vs ours 73/…/16). Same mechanism as the phone walk, not new drift.

Now the B-97a1 re-walk — the reset view's email field on both apps:
**B-97a1 已关闭 — 重置视图重新遍历：全几何匹配**（card 358×358 @ (16,243)，label inline 14px，labelToInputGap **两者均为 10**，input 294×40，submit y 481 — 每个值都相同）。s96 修复的范围扩展验证无误。

现在特别要求的是：实时运行 **移动端导航抽屉电池** (drawer battery)：
**The drawer battery FULLY GREEN live** (trigger 16,16 36×36; panel 288px @ x0 blue; 8 links; focus inside; dual scroll lock; nav-close → /Leads with full release; Escape; reopen-then-resize released). The mobile navigation menu works as expected.

Now let me examine the sweep tool's seams for the remediation plan (the tablet class + B-97a2 fail-fast):
The display sanitizer ate the `[` chars (the documented s94/s95 lesson — actual source is fine). I found all three remediation targets: the md split at `standingBaseline()`, the NaN-hazard flag parsing, and the stale 9-page comments. Let me check the gate-script test pattern:
I have the full picture. Let me read the sweep-tool test patterns, then write the remediation plan:
All patterns confirmed. Now let me write the remediation plan:
Plan written and validated. Now the **RED phase** — the new pins:
Now appending the session-97 RED pins to `tests/sweep-tool.test.ts`:
Let me check the `--max-diff` usage to fix the wiring pin's fallback design:
Now the gate:full pins in `tests/gate-script.test.ts`:
Now let me confirm the RED state:
**RED confirmed: 12 new-behavior pins failing | 29 passed** (the 13th — the plain-gate-unchanged guard — green from the start). Now **GREEN**. First the tablet baselines + 3-way split in `sweep.ts`:
Now the `parseNumberArg` seam — added beside `parsePagesArg`:
Now wire the four flags in `main()` and fix the stale comments:
Now the header docs for the tablet class + the `gate:full` script:
**All 41 GREEN**. Now the non-vacuousness stash proof:
**Non-vacuousness PROVEN**: stash → 12 failed | 29 passed → pop → 41/41 GREEN. Now lint + typecheck + full unit, then the tablet drift-gate verification:
**lint 0/0 · tsc 0 · 1862/1862 unit (+13 net)**. Now verify the tablet drift gate with the new baselines:
**Tablet drift gate CLEAN** with the new baselines. Now verify the B-97a2 fail-fast live:
The stack traces show the throw working — but my `EXIT=$?` captured `tail`'s exit code, not bun's. Let me re-verify properly:
**B-97a2 已关闭** — 快速失败并以正确的消息退出 1。接下来是 S97-P4 —— 截图。让我检查一下现有的约定：
Both captured. Now the VLM verification battery per the house protocol:
**144: VLM 5/5.** Now 145:
**145: VLM 5/5** (Q5's edge crop = the documented accounts overflow genus at tablet width, adjudicated green — a viewport crop, not a rendering error). Both screenshots pass clean.

Now the **full gate** — build + e2e:
**FULL GATE GREEN: lint 0/0 · tsc 0 · 1862/1862 unit · build clean · 132/132 e2e (3.3m, fresh CI=1 boot).** Now the docs realignment. Let me find the count sites and the lockstep pin:
All count sites located. Let me do the comprehensive realignment — first the lockstep pin and CLAUDE.md:
Now the PAD s97 inventory row and the AGENTS §Session-97 block:
PAD row inserted. The AGENTS anchor wraps differently — let me append the Session-97 block after the file's end:
Now the SKILL.md v1.94.0 update:
Lockstep verified (19/19). Now the formal session log `docs/session_195.md`:
Now fill the plan's execution record and append the worklog entry:
Now the full unit re-run to verify all docs-count pins pass post-realignment:
**Gate re-verified: lint 0/0 · tsc 0 · 1862/1862.** Final tree review + census:
Tree is exactly as planned. Now the commit — house style — then the push. Let me first read the SSH wrapper runbook:
No `ssh` binary — the paramiko shim (Appendix A) is needed. Let me read it:
I have the full procedure. Now the commit — house style:
Commit `1160405` created. Now the push — deploy the key outside the repo, the paramiko shim on PATH, dry-run, then push:
Key parses (ed25519). Now the paramiko ssh shim:
**Dry-run GREEN** (`b48cac9..1160405 HEAD -> main`). Now the real push:
**PUSHED — remote verified: `main @ 1160405` == local HEAD.** Now shred the operator key per the runbook:
The shred script had a bug — fixing immediately:
Key and shim shredded. Let me stop the dev server and do the final verification:
**Session 97 shipped and pushed to `main @ 1160405`** (remote verified, operator key + shim shredded, tree clean).

**What was delivered:**
- **The chart-surface walk program CLOSED** — the dashboard chart cards at TRUE 390×844 verified live on both apps: **Δ=+0 on all 13 elements** (the last chart family; every interactive surface now walked)
- **The 768×1024 tablet maiden sweep** — zero new drift; the accounts 0.72% decoded live as the documented s95 overflow genus at the md boundary, then productized into the sweep's **3-way md/lg baseline banding** (the tablet drift gate verified clean)
- **B-97a2 fixed** — a typo'd `--drift-margin` can no longer silently disarm the drift gate (pure `parseNumberArg` fail-fast on all four numeric flags, verified live)
- **`bun run gate:full`** — one command chaining the standing gate + all three viewport drift sweeps
- B-97a1 closed by the reset-view re-walk (gap 10/10); audits clean (zero graduations, ~54th consecutive); **both operator decisions standing** (57th re-affirmation); the mobile-nav drawer battery fully green; the reference bundle stable for the 68th consecutive session; gate green at **1862/1862 + 132/132**; 2 VLM-verified screenshots; docs realigned (SKILL v1.94.0)

**Suggested next (session 98):** the reports tabs' chart family at TRUE 390 (funnel/forecasting/PIE at phone width), the sweep's diff-clustering promoted into the tool, or the 1024×768 landscape-tablet maiden run. Want me to proceed with any of these?
