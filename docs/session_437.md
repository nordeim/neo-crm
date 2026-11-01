I'll continue the neo-crm workflow. Let me first check the current workspace state, then set up a plan.
仓库已存在且处于 main 分支。这是一个全新的验证轮次（session-207 模式）。让我来制定任务计划并刷新工作区。
拉取成功 — 所有者的最新提交 `f990276` 仅添加了 `docs/session_435.md`（s206 执行记录）。这是本次新轮次的轮换触发条件。现在让我来查看文档。首先，检查文件大小：
AGENTS.md (13.8k lines) and neo-crm_SKILL.md (12.6k lines) are huge — I'll read them head/tail strategically. Starting with the status docs (smallest, most current):
session_435.md confirms the rotation trigger (`f990276` — the s206 transcript). The named candidate for this round: the general doc-claim census genus. Now the s206 plan and worklog tail:
s206 已完全理解。现在正在审查核心文档 —— 优先读取 `AGENTS.md` 的 head/structure（因其太庞大，无法完整读取）：
Now the Conventions/Git sections and the tail (latest session sections):
AGENTS.md understood. Now reading CLAUDE.md fully:
Now README.md and the PAD's key sections:
PAD understood (Total: 138 suites, 2851 unit + 226 e2e). Now the SKILL head and the repo skills catalog:
Interesting — I spotted a potential stale claim: SKILL §2 table says recharts `2.15.x` while PAD says `3.10.1`. Let me verify the live state and the SKILL head layers:
The live head layer needs locating — let me inspect the file top and the skill-head script:
Found it — live s206 layer at line 303 (2851/226). Now I've spotted a potential stale claim in SKILL §2 (recharts `2.15.x` + "empty-state fallback" vs the s10 retirement doctrine). Let me finish the doc review with the skills catalog and web-application skill:
Core docs and skills reviewed. Now validating the environment and codebase state:
Environment intact: `.env` carries the standing contract, `db/custom.db` at repo root, src/ unchanged since s206 ship. Now the db census + baseline fast gates:
Lint 0/0 · tsc 0. Now the unit suite (expecting 138/2851):
138/2851 unit — exact s206 ship state. Now the production build:
Smoke 14/14. Now the e2e suite (226 checks, ~8 min). Checking browser binary first:
One e2e failure (225/226) — a debounce/focus test. Let me investigate the failure detail:
The isolated re-run shows the failure detail but then "1 passed" — let me check the retry config and rerun:
Let me see exactly which tests ran in that isolated invocation:
The test passed this time — it's intermittent. Let me reproduce a few more times and inspect the DefaultsEditor to find the root cause:
The isolated runs now pass — an intermittent flake with a real root-cause candidate: the `useState` fallback values (`AED/new/B/3/month/monday`) equal the seed values, so the s119 `toHaveValue("AED")` epoch gate is **value-blind** — it passes on the pending epoch too. The fill can still race the settings GET → the M-72c4 remount resets the input + drops focus (exactly the observed failure: `value="AED"`, inactive).

Let me check house precedent for the cure idiom and inspect the facts-census pins (for the doc-claim genus):
`networkidle` is a house idiom (a11y spec) and src/ has no polling — safe. The only fill-based settings test is the flaky one. Now the facts-census pins for the doc-claim genus:
**F-207b confirmed**: facts-census WP-1a pins the PAD's full stack table (recharts 3.10) but the SKILL §2 pin covers ONLY next+playwright rows — the recharts row (`2.15.x`) rode 31 sessions stale, plus its "empty-state fallback" note contradicts the s10 retirement doctrine. Checking the full extent of stale recharts claims in the SKILL:
Let me check the charting doctrine in SKILL §11 and the actual charts source:
The §10 line numbers I need to verify. Let me check the exact SKILL §2/§10 sites and the live versions for every unpinned row:
The audit crystallizes: **only the recharts row is stale** in SKILL §2 (rode 31 sessions), plus the two empty-state doctrine notes. Let me check the README stack table + the CLAUDE stack row for the same genus:
**README:76 also carries the stale recharts 2.15 row** — the genus widens. Checking CLAUDE's charts row form:
CLAUDE's charts row is the live doctrine — README + SKILL rows are the stale instances. Let me see the README's full stack table to size the genus pin:
The audit's doc findings are firm. Now the remaining verification legs — booting the dev server and running the drift gates:
probe:ref STABLE. Now the four-band sweep:
All four bands clean. Now the fullpage sweep + interior census:
All six drift gates CLEAN. Now the SEO/sitemap legs:
SEO verified. Now the hygiene legs:
Audit census matches (4h/5m/1l). Now the scandihaven reference review:
No local scandihaven — cloning it for the standing reference review:
Scandihaven reviewed — its highest-leverage patterns are already embodied (as s204-206 records claimed). Now the live parity re-verification — the operator's named focus. Checking the agent-browser skill:
agent-browser 0.40.0 ready. Starting the reference app battery — login first:

继续 session-207 轮次。让我检查一下环境状态（开发服务器 + 浏览器会话可能已被重置）：
在轮换触发器 `f990276` 处全新克隆。正在重建环境：
数据库统计匹配。对全新克隆中的树结构进行快速验证：
在全新克隆上执行 138/2851。正在启动开发服务器，并继续参考移动端导航测试组：
参考仪表盘已达到。现在是手机抽屉（mobile drawer）的电池组（操作员指定的焦点）：
抽屉已打开，包含 Close + CRM h2 + 8 个目的地。正在验证遮罩层 + 滚动锁定：
Reference drawer verified: overlay `rgba(0,0,0,0.8)`, body locked while open, link ride navigates + auto-closes + releases lock. Now the Escape test:
Reference Escape 已验证。现在是 landing disclosure menu（第二个移动端界面）：
Reference battery complete (both mobile surfaces working; no aria-expanded on reference — ours is the documented superset). Now our local app — same battery:
已确认双重滚动锁定 (body + main hidden — 记录的超集)。现在是链接点击测试：
本地 Escape 已验证。重新打开抽屉以捕获 VLM 对：
两个抽屉截图已捕获。现在进行本地着陆页展示菜单测试：
所有移动端界面均已在两个应用上验证。现在进行抽屉对的 VLM 对比：
**VLM 判定：一致**（唯一说明：Base44 徽章，从未镜像）。一致性验证已完成。现在正在确认新克隆上审计发现的行号：
两项发现均已确认。现在开始检查 `facts-census` 辅助工具以及整个流程中用到的 pins：
`crm.spec.ts` 没有被行数锁定（很好 —— e2e 修改不会触发 `inventory-census`）。现在让我研究一下 `docs-counts` 的梯次结构：
模型已理解。现在正在为 pin 设计验证确切锚点的唯一性：
现在检查 `facts-census` 中的 `section-scoping` 惯用法：
设计已定。正在检查截图命名规范和 e2e 设置以确定最终方案：
All conventions confirmed. Writing the session-207 remediation plan:
计划已编写。现在正在根据代码库验证每个梯形锚点：
All 21 ladder anchors unique. Checking the F-92a3 + negatives-block tails:
所有锚点已验证 — 计划与代码库对齐。**TDD 第 1 步 — 优先进行红（RED）**：编写 D-207b1 pins：
**RED 已验证**：46 个测试 | 2 个失败 —— 正好是两个新的 it，没有产生附带影响。**第 2 步 — GREEN**：三个文档修复：
三项修复均已顺利落地。正在验证 GREEN：
**绿色：46/46。** 现在进行变异证明 ×3：
M2 已验证（在 genus it 处正好 1 RED）。现在进行 M3 —— §10 注释：
**D-207b1 complete**: RED-first ×2, GREEN 46/46, mutation-proven ×3, src/ untouched. Now **D-207a1** — the e2e epoch-gate cure:
已应用 D-207a1。现在进行单元计数验证（在进行任何文档更新之前）：
**138/2853** —— 正好增加 2，在任何 doc flip 之前已验证。徽章：2853+226 = 3079。现在进行头部 surgery 脚本：
Head surgery done + idempotent. Now `count-ladder-207.py`:
所有 26 处翻转已完成。幂等性 + 完整单元验证：
**138/2853 GREEN**，且每个 doc pin 都已就位。接下来进行 docs lockstep —— AGENTS Session-207 部分：
现在是 PAD §7.1 s207 的 inventory 行（在 Total 行之前）：
现在是 worklog Task 207 条目以及该计划的执行记录：
现在正在填写计划执行记录（§5）：
计划记录已填写。现在正在截取 692-696：
抽屉已确认关闭（之前的评估存在竞态）。现在是 695 —— 落地移动端菜单：
所有 5 个已捕获。正在通过 VLM 验证每一个（s204 课程）：
所有 5 个捕获均已通过 VLM 验证。正在关闭浏览器并运行 **FINAL GATE**：
Smoke 14/14 (the 2 Turbopack warnings are the pre-existing tracing heuristics, not errors). Now the e2e — the F-207a cure proof:
E2E setup 失败——正在调查：
The fresh sandbox lacks the Playwright browser binary (the s206 precedent — environment-only, zero code involvement). Curing:
**E2E 226/226 — F-207a 修复已在实际捕获到该偶发故障（flake）的 full-suite 上下文中得到验证。** 目前剩余的环节：
**最终检查全部通过。** 正在编写 session_436.md 记录：
记录已写入。正在停止开发服务器并准备提交。首先，查看 SSH 推送操作手册：
No ssh binary and no paramiko (fresh sandbox). Reading Appendix A for the shim:
Installing paramiko + deploying the shim:
Shim deployed. Now materializing the operator key outside the repo:
Key verified. Creating the house-style commit:
已在 main 分支提交 `18b1f74` — 共 19 个文件。现在通过 SSH 包装器进行推送 — 先进行预运行 (dry-run)：
Dry-run clean — remote at `f990276`, our `18b1f74` fast-forwards. Real push:
**已推送并经远程验证。** 正在销毁操作员密钥并确认最终状态：
**Session-207 is complete and pushed to `main` as `18b1f74`** (remote-verified via the SSH wrapper; the operator key is shredded; the working tree is clean).

## Round summary

**Baseline** (fresh clone at `f990276`, the session_435 trigger): lint 0/0 · tsc 0 · 138/2851 unit · build · smoke 14/14 · **e2e 225/226 — one live catch** · all six drift gates CLEAN (byte-parity census, fullpage 0.093%/0.316%, probe:ref STABLE at `46bc2d9c`) · db census MATCH at `<repo>/db/custom.db` with the standing `DATABASE_URL="file:../db/custom.db"` contract.

**Parity re-verification** (agent-browser, both apps logged in): mobile nav **both surfaces working** — drawer (Close + CRM h2 + 8 destinations, overlay `rgba(0,0,0,0.8)` vs our `oklab(0 0 0 / 0.8)`, Escape, link-ride auto-close + dual lock release) and the landing disclosure menu (6 links, FAQ → `/#faq`); **VLM verdict: identical** (sole note: the Base44 badge, never mirrored). Tailwind v4 clean; SEO/sitemap verified (11 routes + robots + manifest + OG/canonical).

**The round's two materials:**
- **F-207a (the live catch)**: the settings e2e flake — the s119 epoch gate was *value-blind* (pending-epoch fallbacks equal the seed values), letting the fill race the settings GET. **Cure (D-207a1)**: a `waitForResponse("/api/settings")` boundary, test-side only — proven by the final gate's clean 226/226 in the exact full-suite context that caught it.
- **F-207b (the audit's doc finding)**: the stale recharts rows — SKILL §2 (both cells: `2.15.x` + the pre-s10 empty-state note), SKILL §10, and README — rode 31 sessions. **Cure (D-207b1)**: three doc flips + a live-read pin family in facts-census (RED-first ×2 → GREEN 46/46, mutation-proven ×3).

**Lockstep**: UNIT 2851 → **2853** · badge 3077 → **3079** · SKILL v1.204.0 · 26-flip idempotent ladder · AGENTS/session_436/PAD/worklog/plan updated · screenshots 692-696 (VLM-verified) · final gate fully green at the cured tree.

Next step when you're ready: commit the session_437 transcript as the rotation trigger — the full general doc-claim census remains the named candidate if the chart-stack genus ever shows a sibling.
