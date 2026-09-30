I'm continuing from session 12 (pushed at 2adc126). This is the next parity iteration — reviewing session_17/session_18 docs. Let me set up my task plan and refresh the workspace.
Pull brought `docs/session_18.md` (new session-12 completion transcript). Now let me review the required docs.
Now let me review the session-12 plan and session_17 docs to refresh context.
Session-12 context refreshed. Now let me verify the 5 core docs' state and validate against the codebase.
Environment verified. I noticed a possible README badge drift (192 vs 206). Let me check, then run the baseline gate.
Minor README drift spotted (badge says 192, actual 206). Now let me run the baseline gate.
**基准检查通过 (Baseline gate green)**：lint 0/0 · tsc clean · 206/206 unit · 开发服务器在 :3000 端口健康运行。让我验证一下 skills catalog，然后开始实时参考审计。
Skills folder unchanged since scaffold (my prior reviews stand). Let me refresh the Tailwind v4 hazards table quickly, then start the live-reference audit.
v4 hazards confirmed in AGENTS.md. Now let me start the live-reference audit — session 13. First, checking my browser tooling setup.
Logged in. First check: has the reference's demo data returned (9th consecutive session)?
Demo data STILL zero (9th consecutive session) — parity remains structural. Now re-probing previously-pinned families first (the reference is a moving target). Starting with dashboard KPI cards.
KPI cards unchanged from session-12 pin. Checking sparklines + full dashboard structure for drift.
Reference KPI family unchanged. Now opening our clone in a parallel session for comparison.
**发现潜在 Bug**：我们克隆版本的登录页面标题显示为 "NEO CRM | NEO CRM" —— 这与第 12 会话中针对 404 页面修复的标题后缀重复 bug 是同一个。让我来验证一下。
Title settles to "NEO CRM" after hydration, but the load-time header showed doubled. Let me check the raw server HTML.
**已确认的实际 Bug (S13-P1)**：原始 SSR HTML 在登录页面渲染出了 `NEO CRM | NEO CRM`。让我检查一下这是否在水合作用（hydration）后依然存在，以及参考项目是如何处理的。
Reference login title = "NEO CRM"; ours SSR = "NEO CRM | NEO CRM" — real bug. Let me find the metadata source.
已定位 Bug 原因：登录页面使用了相对 `title: "NEO CRM"` → 模板生成 "NEO CRM | NEO CRM"。正在检查注册页面是否存在相同的 bug：
**S13-P1 影响两个页面**（登录 + 注册均使后缀翻倍）。现在开始对比两个应用的所有路由标题：
All app-route titles match; only /login + /signup are bugged. Now probing new layers — starting with the topbar user-menu dropdown (never deep-compared).
Reference user menu = stock Radix DropdownMenu with Profile + Logout items. Testing Profile action, then comparing our clone.
Profile 导航至 `/Profile` ——这是一个我从未对比过的页面！让我检查一下。
**主要发现 (S13-P2)**：参考网站有一个完整的 **个人资料页面** (`/Profile`)，其中包含个人资料图片、账号信息、安全设置版块——从未进行过对比！让我来转储它的完整结构。
A full page structure mapped. Now checking our clone's user menu — do we even have a Profile route?
Our clone uses a Radix Popover; the reference uses a stock DropdownMenu — with anatomy diffs (rounded-lg vs rounded-md, shadow-lg vs shadow-md, z-60 vs z-50, item classes). Testing where our Profile item goes:
我们的克隆版本拥有 /profile 并带有匹配的内容。正在检查引用的路由大小写行为（/Profile 大写 P）：
Reference serves both /Profile and /profile. Now deep-comparing the Profile page internals — form groups and right-column cards:
现在转储我们克隆的 profile 页面结构以进行对比：
Top-level structure matches but class diffs spotted. Dumping clone form + right cards deeper:
Selector conflict — let me target the actual "user" role badge on both apps precisely.
Reference badge = stock shadcn Badge default variant (`shadow`, `hover:bg-primary/80`, focus ring). Checking our Badge component:
Our Badge is hand-rolled (rounded-full) vs reference's stock (rounded-md + shadow). Checking how the reference uses badges elsewhere (tables):
Reference tables have zero data (no badges render) — profile badge is the only badge surface. Now examining our clone's profile source:
**发现关键差异**：参考按钮使用的是 `rounded-md` + stock variants；而我们的个人资料按钮使用的是 `rounded-lg`。正在检查我们的 Button 组件以及其他位置的对话按钮：
我们的 Button 默认使用 rounded-lg（在之前的会话中已固定）。正在验证参考按钮在其他地方实际渲染的效果 —— 打开一个对话框：
**主要发现**：参考按钮均为 `rounded-md` —— 我们的 Button 默认为 `rounded-lg`。这可能是参考按钮发生了变化（动态目标）。正在调查两个应用中所有页面的按钮：
All reference buttons are `rounded-md` universally. Checking our clone's buttons on the same surfaces:
Divergence mapped precisely: our clone has `rounded-lg` on **contacts, calendar, reports (Saved Reports), profile** buttons — reference is `rounded-md` everywhere. Finding the source:
已找到根本原因：accounts 使用了 `size="sm"`（→ rounded-md），contacts 使用了默认大小（→ rounded-lg 基础）。正在检查参考联系人的按钮高度，以确定它们使用的大小变体：
Button map building: reference = rounded-md universally; our default-size buttons render 8px. Checking icon buttons, login button, and dialog buttons on both apps:
Reference radius map: icon buttons h-9 rounded-md, dialog buttons rounded-md, login rounded-xl (own family). Checking our size usages + reference row-action buttons:
Reference row-actions are bare `text-gray-400` ••• buttons (no radius/bg) vs our iconSm ghost buttons. Comparing activities rows on both apps:
**结构性发现**：参考卡片包含我们的克隆所缺失的 `count-chips` 行和 `border-t` activities 页脚。正在截图两个卡片以进行视觉确认：
VLM notes data-driven diffs, but the DOM showed chips + footer rows exist on the reference. Dumping their exact anatomy:
Reference card has: header-with-subtitle structure, type-count chips row, and a checkbox footer — our clone lacks all three. Checking our clone's activities page source:
已确认：“最近 2 天”是静态的（过滤器不会改变它）。正在检查参考站点的活动空状态与我们的对比：
Empty states are data-driven (ours has data — documented superset). Now sweeping card-title sizes across both apps — reference showed 16px vs our 18px:
Reference has FOUR per-page CardTitle styles. Getting our clone's map:
**已找到卡片标题差异**：/reports + /profile 应该是原生的 CardTitle（16px），/activities “按类型活动” 16px，/settings 所有宽度均为 text-lg。正在检查我们的 CardTitle 组件：
The by-type card header follows the FILTER_RAIL pattern. Probing its ••• button classes specifically:
Shell escaping issues — writing a probe script file instead:
Reference card-header ••• = bare text button (`text-gray-400 hover:text-gray-600`). Surveying all reference card-action buttons across pages:
The timeline card matches ✓. The by-type card needs the full rebuild. Checking our clone's byType colors:
**发现图表颜色不匹配**：参考网站的按类型系列 = blue/violet/amber/emerald/teal；我们的是 blue/cyan/amber/violet/gray。现在也在检查日历日期单元格（我们的渲染为 rounded-lg）：
Reference day cells aren't buttons. Probing their actual element type:
Reference day cells are divs (rounded-lg ✓) but with `p-1 sm:p-2` padding and per-state classes. Enumerating all reference day-cell states:
Day-cell diff found: out-of-month cells hide the border (transparent) vs reference's visible default border. Now switching to the mobile layer (user's standing priority) — running the mobile-nav regression on our clone at 390px:
抽屉打开，焦点落在内部（session-12 修复有效），滚动已锁定。正在验证 inert + Escape + 恢复：
Escape/restore pass, but `inert` probe found no inert elements while open. Checking mobile-nav source for the inert implementation:
`inert={!open}` is on the drawer itself (correct — removes closed drawer from a11y tree). Verifying focus-trap wrap:
Focus trap wraps correctly. Testing resize-past-md auto-close and route-change close:
**Mobile-nav regression: 7/7 PASS** — the drawer is fully healthy. Now the 390px overflow sweep across all routes:
Zero overflow on all 9 routes. Quick mobile visual comparison on the profile page (new surface) at 390:
VLM caught a possible role-value case diff ("User" vs "user"). Checking the reference's role input for a capitalize class:
Role input needs `capitalize` + `bg-gray-50`. Checking reference right-column icon colors:
Icons match (inline styles vs classes — computed-equal). Final audit layer: full-dashboard VLM comparison at desktop:
The clone screenshot was taken at 390px (leftover viewport). Retaking at desktop width:
VLM found dashboard diffs: area vs line chart, KPI delta positioning, dashed grid, extra "+1d" badge. DOM-verifying each:
KPI layout + area chart MATCH (VLM misreads). But **grid dashes differ**: reference `3 3` dashed, ours solid (null). Probing all charts on both apps:
Reference grids are dashed `3 3`; ours solid. Checking our charts.tsx for what happened to the session-10 dash fix:
我们的代码使用了裸的 `<CartesianGrid />`，但渲染出的网格却缺少虚线效果。正在检查渲染出的 grid line 属性：
Reference passes `strokeDasharray="3 3"` explicitly (the session-10 "dashed default" was a misread — recharts default is SOLID). Mapping all our chart components:
**新发现**：参考报告中的 Conversion Funnel 包含一个 15 行的虚线网格 —— 而我们的没有网格。正在检查参考中的漏斗结构：
克隆版本的探测已在 `leads` 上运行。正在 `reports` 上重新运行克隆版本的 funnel probe：
Reference reports funnel = chart WITH grid+axes (not a FunnelChart). Dumping its axis ticks to identify the type:
Reference reports funnel = horizontal BAR chart (8 raw stage keys on Y). Checking the reference's LEADS funnel (different surface):
参考 leads funnel 在无数据时未渲染任何内容（无法验证 — 因数据驱动）。但 reports funnel 已确认不同：水平条形图 + 虚线网格 + 原始阶段键。正在检查我们的 reports funnel 源码：
我们的漏斗图使用的是 `FunnelChart`；而参考网站在报告页面使用的是水平 `BarChart`。正在检查我们的数据接口（data seam）提供了什么：
我们的阶段词汇与参考的漏斗刻度不同。正在检查参考的 tab-1 流水线刻度以获取对比：
Tab-1 charts: no ticks at zero except the funnel (fixed 8 raw stages + grid 15). Verifying the dashboard pipeline ticks for comparison:
图表在结构上是一致的（仅网格虚线不同）。正在验证 VLM 的 “+1d” 声明，即关于我们 Avg. Sales Cycle 卡片的：
Our Avg. Sales Cycle has an extra "+1d" delta the reference lacks. Also checking the KPI value's leading/tracking literal diff:
KPI 值存在计算出的差异：行高 (36 vs 30)、字间距 (normal vs -0.75px)、颜色 (#0a0a0a vs #111827)。正在检查参考站点的卡片前景色 token：
Reference default foreground = #0a0a0a (ours #111827). Checking how deep this token diff goes — table cells, card bodies, buttons:
Reference default fg #0a0a0a covers card titles/KPI values/buttons; h1s are explicit gray-900. Surveying our h1 classes to scope the token flip:
Token-flip scoping: checking reference dialog-title + login h1 colors:
LOGIN title matches ✓. Verifying reference dashboard h1 + our th colors before finalizing the token scope:
审计已接近完成。正在验证我们的 reports tab-1 pipeline ticks 以及 "+1d" KPI 来源：
我们的 tab-1 pipeline 已经渲染了原始别名 (raw slugs)。正在检查为其提供数据的 slug 词汇表：
All data for the plan is gathered. Now writing the session-13 remediation plan:
Plan written. Now validating it against the codebase — reading the key implementation files:
`@radix-ui/react-dropdown-menu` isn't installed. Checking all Dropdown usages before deciding the conversion scope:
The Dropdown is used in 5 places. Checking the reference's row-action and Add menus for their anatomy:
Reference dashboard Add = dead plain button (no popup). Checking our clone's Add trigger appearance:
我们的 Add 按钮在视觉上是一致的（功能性超集）。S13-P4 范围 = 仅限账户菜单。正在阅读 `KpiCard` 结构：
计划已针对代码库进行全面验证。正在启动 **阶段 A — 红灯测试优先**。正在检查测试文件结构：
Writing the red tests — first the new page-titles test:
Now the page-layout red tests — appending the session-13 pins:
All reference h1s = `text-gray-900`. Now appending the session-13 red pins to page-layout.test.ts:
Adding the new imports to page-layout.test.ts:
Now the charts-contracts test (grid dashes + funnel type):
Now the e2e red tests — account menu, funnel, by-type card:
**RED confirmed** — 35 failing tests. Now **Phase B — implementation**. Starting with the auth titles, token flip, and contracts:
Now the globals.css foreground flip:
Now the page-layout.ts contracts. First PAGE_HEADER titles → text-gray-900:
STAT_CARD/ACTIVITY_CARD keep text-foreground (now =#0a0a0a, computed-correct). Now adding the new contract groups:
Now the FILTER_RAIL cleanup, PROFILE_LAYOUT additions, BY_TYPE_CARD and CALENDAR_CELL:
Now appending BY_TYPE_CARD and CALENDAR_CELL contracts:
Now registering the new groups in the aggregator:
Contracts in place. Now the component implementations — button.tsx, card.tsx, dialog.tsx:
Now the stock Menu primitives in dropdown.tsx (S13-P4):
Now wiring the topbar account menu to the Menu primitives:
Now the KpiCard value string in page-parts.tsx:
Now the avg-cycle delta removal on the dashboard:
Now the CardTitle overrides at the page call sites — dashboard (6), leads (3), settings (5), activities by-type:
Now adding the missing imports to the three pages:
Now the profile page rebuild (S13-P2). Reading the current source first:
Checking where the root wrapper classes come from and what the reference uses on other pages:
The shell inner needs the re-pin, and PROFILE_LAYOUT.root should be the page-level `max-w-4xl mx-auto`. Fixing the contract:
Updating the two affected test pins (s7 shell re-pin + my profile root):
Now rewriting the profile page component with all S13-P2 fixes:
Checking the primary token (badge bg rides `bg-primary`):
参考网站的 **profile** 页面主色为 `#171717`（与它自己的蓝色 `--primary` 不同）—— 因此 badge/save 必须保留中性的字面量系列。正在检查 `cn` 的合并行为，然后修复合约：
The reference's blue buttons are explicit `bg-blue-600`; its `bg-primary` = #171717 (profile only). Fixing the save button to the neutral family:
Cleaning up the unused PageHeader import and fixing the badge test pin:
The neutral-900 family is already established (settings/dialogs) — my save button is consistent. Now the **activities by-type card rebuild** (S13-P5):
Typecheck clean. Now the calendar day cells (S13-P7):
议程视图（Agenda View）在计算上相等（`mb-4` 在包装器上）—— 跳过。现在图表有了**虚线 + FunnelBarChart** (S13-P8)：
Now adding the FunnelBarChart component (horizontal bar chart for reports):
Now swapping the reports funnel usage to FunnelBarChart:
9 left — mostly old pins needing the s13 re-pin + my test/contract mismatches. Examining each:
All old pins need the documented s13 re-pin. Updating them:
**Unit GREEN: 242/242** (+36 new checks). Running build + e2e:
1 个 e2e 失败（按类型卡片的 chip 定位器）。正在检查错误上下文：
The footer checkbox needs the right selector. Checking our filter-rail checkbox pattern for consistency:
Our Checkbox is a native input (established pattern). Fixing the footer to use the Checkbox component + updating the e2e selector:
**E2E GREEN: 31/31**. Now Phase C — live DOM re-verification. First the titles and the dev server state:
**S13-P1 fixed live**. Now verifying all other surfaces on the dev server:
S13-P9/P10 verified (36px lh, #0a0a0a, no +1d). Now button radii + card titles sweep:
Card titles all verified. The empty button probes suggest an auth redirect — checking:
Authenticated. Measuring the previously-divergent button radii directly:
S13-P3 verified (all 6px; day cells correctly 8px rounded-lg). Now profile form details:
Profile nearly perfect, but CardTitle renders 14px (reference: 16px) — a base font-size question. Checking both apps:
**Base font-size diff found**: reference body = 16px, ours = 14px. Locating our base:
Reference body = 16px globally (S13-P12 — new finding). Checking why we pinned 14px:
Scaffold-era assumption, never verified. Fixing to the reference's 16px default:
The test regex caught my own comment. Making it comment-aware:
**243/243 GREEN**. Verifying the font-size fix live + checking for regressions on inheriting surfaces:
**S13-P5 verified perfectly** (chips, swatches, footer, subtitle). Now calendar cells + charts:
Today cell leaks the current-month hover. Making the state selection exclusive:
Calendar states now exact. Verifying the account menu (S13-P4):
**S13-P4 verified** (role=menu, 6px, z-50, stock items). Spot-checking inheriting surfaces for font-size regressions:
Dialog title/input match. Label: ours 12px vs reference 14px — checking the reference's dialog label class:
**New diff (S13-P13)**: our Label is 12px custom; reference = stock `text-sm font-medium leading-none` (14px). Checking Label usages before fixing:
No direct pins — safe to fix the Label to stock:
**244/244 green**. Rebuilding + full e2e re-run (font changes could affect pinned expectations):
**E2E 31/31**. Now the breakpoint sweep + 390px overflow on all routes:
The viewport reset to desktop — re-running the sweep at 390:
Zero overflow on all 10 routes. Now VLM comparison rounds — capturing both apps at 1512:
VLM 发现了几个问题。让我直接查看截图并对每一项进行 DOM 验证：
E2E verified the chips (on :3100) — the dev server may be stale after the production build. Checking:

I can see the state clearly now: the session-13 remediation work is complete (all gates were green: 244 unit / 31 e2e) but **uncommitted** — the session was cut off during final VLM verification. Let me set up my plan and continue from there.
Workspace is current with remote (22aeb95). Now let me review the key docs and validate the state of the uncommitted session-13 work.
计划已审阅。第 13 次会话的补救工作（S13-P1..P13）已实施，所有门控均为通过（根据上个会话的日志，为 244 个单元测试 / 31 个端到端测试），并在最后的 VLM 验证过程中被中断。让我快速验证一下第 17/18 次会话的文档，然后对未提交的工作运行完整的门控检查。
上下文已确认。现在让我对未提交的 session-13 工作运行完整的门控检查（lint → tsc → unit tests）。
Lint 0/0 · tsc clean · 244/244 unit. Now the production build + e2e suite:
认证设置超时——这是上个会话结束时正在调查的问题：开发服务器在 `next build` 覆盖了 `.next` 后变旧了。让我检查一下服务器状态。
E2E config 启动了 :3100 端口上的独立生产服务器。认证设置超时——我来手动调试一下该端口上的登录流程。
Rate limiter is per-process in-memory — fresh boots reset it. Let me boot the standalone server manually and run the debug script to see the actual login response.
The S13-P1 title fix works, but ~26 resources 404 and the form did a **native GET submit** (`/login?`) — meaning the client JS never hydrated. Let me identify the 404 URLs.
All 404s are `/_next/static/*` assets missing from the standalone server. Let me compare what the HTML references vs what exists on disk.
The standalone build is missing its entire `.next/static` folder. Let me inspect the standalone tree:
**Root cause found**: the `build` script is `next build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/` — I ran `npx next build` directly, skipping the static+public copy steps. That's why the standalone server has no assets. This is my own tooling mistake this session, not a codebase bug. Let me rebuild properly and re-run e2e:
Build fixed — 28 chunks + public files now in standalone. Re-running the full e2e suite:
**Full gate GREEN**: lint 0/0 · tsc · 244/244 unit · proper build · **31/31 e2e** (mobile-nav 7/7). Now let me restore the dev server (it went stale after the builds overwrote `.next`) and complete the live verification.
Dev server fresh on :3000. Now completing Phase C live verification. Let me check my browser tooling setup:
agent-browser is available. Let me log in to the clone on :3000 and run the consolidated verification probe:
已登录。正在仪表盘上运行整合验证探针：
Core dashboard fixes all verified live on the fresh server (body #0a0a0a, KPI 36px lh/normal ls, no +1d, 6px buttons, dashed 3 3 grids #ccc, monotone sparks). The cardTitle key didn't print — let me find the right viewport command and probe card titles:
`viewport` lives under `set`. Setting 1512×945 and re-probing card titles:
All dashboard fixes confirmed at 1512×945. CardTitle selector missed — let me probe the actual title elements and continue through the other pages:
Dashboard CardTitle = `text-base sm:text-lg` ✓ (S13-P6 map). Now sweeping reports (funnel + stock titles):
The funnel is a card in tab-1 (default). Let me verify it live plus the reports CardTitle:
Reports titles = stock string at 16px base ✓. Now profile + activities + calendar + settings in sequence:
Profile nearly all verified (gray-50 disabled inputs, capitalize, 6px/36px stock buttons, 16px stock CardTitle). The badge didn't match my probe — let me check it directly:
Profile card + stock badge (rounded-md, bg-neutral-900, shadow, transition) all verified. Now activities by-type + calendar + settings + contacts:
All four pages verified — by-type card complete (correct chip colors, static subtitle, checkbox footer), settings 18px titles, calendar borders visible with correct state classes, contacts 6px/36px buttons. Now the account menu (S13-P4) + auth SSR titles:
The trigger found was a Popover (dialog role) — but other S13 fixes are live, so I may have clicked the wrong button. Let me check the topbar source and the e2e assertion:
The topbar code uses the new stock Menu primitives. My probe clicked the wrong button — let me use the accessible name like the e2e does:
The dialog is the sidebar wrapper (expected). The issue is synthetic `.click()` doesn't fire pointerdown (Radix DropdownMenu opens on pointerdown) — need a real agent-browser click:
S13-P4 verified live (z-50, 6px, stock items with cursor-default/rounded-sm). Now auth SSR titles + 390px overflow sweep:
SSR titles all correct. Now the 390px overflow sweep on all routes:
390px 清理完成：所有 10 条路由均无溢出。现在进行最后的 VLM 对比阶段 —— 让我检查一下之前会话是如何调用 VLM 的：
VLM pattern found (`z-ai vision` CLI). Let me capture the reference at 1512, then the clone, and compare:
**VLM rounds complete**: all remaining diffs are data-driven (reference demo data = zero, 9th+ session) or OCR/platform artifacts — structural parity confirmed. The "Üser" claim is an OCR artifact (DOM-verified: both render "User" via capitalize). Phase C is done. Let me log progress and move to Phase D deliverables:
Environment verified: `.env` → `file:../db/custom.db`, db/ at repo root, `.env.example` matches, vitest/playwright intact. Now refreshing the screenshots with the remediated codebase:
脚本在登录步骤失败 —— 浏览器仍持有我的会话 cookie，所以 `/login` 发生了重定向。让我检查一下上个会话的处理方式：
已刷新所有 13 张截图。对最新捕获的两张（drawer + profile）进行快速 VLM 完整性检查：
两项截图均正常（蓝色抽屉 = 预期的 blue-600 侧边栏系列；个人资料结构匹配）。现在进行 Phase D 文档对齐——首先检查所有文档中的当前测试计数：
Now updating all docs. Starting with README:
Now AGENTS.md — update counts and add the session-13 contract block:
Now adding the session-13 contract block at the end of the Architecture facts section:
Now CLAUDE.md:
Now PAD:
Let me verify the actual per-file test counts to make the PAD table precise:
正在将 PAD 表格修正为实际统计数 (page-layout 112, design-tokens 14, charts-contracts 4, page-titles 2):
All counts verified (244 unit / 31 e2e). Now SKILL.md — bump to v1.10.0 with §16e:
现在在 §16d 之后添加 §16e（会话-13 层）：
SKILL.md at v1.10.0 with §16e. Now writing the session completion log `docs/session_19.md`:
Now filling the plan addendum with the execution record:
Now the repo worklog:
All docs aligned. Final sanity gate + commit preparation:
Staged diff clean (48 files, +1584). Let me check the commit message convention then commit:
已提交 `b2da6bd`，工作树干净。现在进行推送 —— 首先阅读 SSH wrapper 技能文档：
SSH tooling ready (paramiko shim at `/home/z/my-project/bin/ssh`). Let me check the wrapper's remote default, then execute the push sequence:
Dry-run clean (`22aeb95..b2da6bd` fast-forward). Executing the real push:
**Pushed and verified**: remote main @ `b2da6bd` == local HEAD, tree clean, key shredded. Final worklog update:
The interrupted session-13 remediation is now complete and delivered. Here's what happened this session:

**Resumed from the cutoff**: The session-13 parity work (13 findings: doubled auth titles, profile page parity, rounded-md buttons, CardTitle map, by-type card rebuild, dashed grids, funnel-as-bar-chart, #0a0a0a foreground, 16px base font, stock account menu) was fully implemented but uncommitted — I verified it end-to-end rather than redoing it.

**One real root-cause on the way**: the e2e auth setup was timing out because a bare `next build` leaves the standalone server without static chunks (pages never hydrate). The fix — always build via `bun run build` — is now documented in AGENTS/PAD/SKILL so it can't recur.

**Full gate green**: lint 0/0 · tsc · **244/244 unit** · **31/31 e2e** (mobile-nav 7/7) · live DOM re-verified at 1512+390 · zero 390px overflow on all ten routes · VLM rounds confirm structural parity (remaining diffs are data-driven — the reference's demo data is still zero, 9th consecutive session).

**Delivered**: 13 screenshots refreshed, `.env`/`.env.example`/db paths verified, all docs realigned (SKILL → v1.10.0 §16e, new session_19.md completion log), and pushed via the SSH wrapper — remote `main @ b2da6bd` verified equal to local HEAD, key shredded.

**Suggested next steps**: (1) Next parity iteration should re-probe the previously-pinned families first — the base44 reference is live-edited and has moved twice already; the unprobed layers and pointers are listed in `docs/session_19.md`. (2) If the reference's demo data ever returns, every data-driven surface (tables, charts at non-zero) becomes comparable — that's the highest-value moment to re-audit.
