I'll start by setting up the workspace and understanding the task scope. Since the user has provided detailed instructions and explicitly asked me to proceed with best judgment on open decisions, I'll dive right in.
The workspace is fresh. Let me clone the neo-crm repository and set up a task plan.
The repo is cloned. It's a Next.js 16 + React 19 + Prisma/SQLite + Tailwind v4 app with existing vitest/playwright configs. The docs are massive (AGENTS.md is 856KB, worklog 1.7MB), so I'll delegate deep document review to parallel subagents while I explore the codebase structure myself.
Much of the requested infra already exists (likely from prior sessions). Let me dispatch parallel subagents to review the massive docs while I explore the codebase state directly.
I now have a solid understanding: neo-crm is a self-hostable clone of the reference CRM, at session-203 state with a fully green gate. The user's asks (env, db path, tests, sitemap, screenshots, .env.example) largely exist — my job is to **validate, audit, fix gaps, and verify parity**. Let me check the runtime environment and install dependencies.
DB seeded and census matches. Now let me run the core gates and clone scandihaven in parallel.
Lint ✅, typecheck ✅, 2841/2841 unit tests ✅. Now let me build and clone scandihaven in parallel.
Build succeeded with all routes (both casings), sitemap.xml and robots.txt present. Let me review the repo's skills catalog as instructed.
Let me read the key skills the user pointed to, especially for web-application, Tailwind v4, and mobile nav debugging.
Now let me examine the actual mobile nav implementation and key layout components in the codebase.
Mobile nav is a well-implemented Radix Dialog Sheet (session-147 remediation). Now let me start the dev server and access the reference app for parity comparison.
Dev server is up. Now let me use the agent-browser skill to access the reference app for parity comparison.
Login succeeded — the reference lands on the marketing page with an "Open dashboard" link. Let me navigate to the dashboard.
The dashboard loaded. Let me capture screenshots of the reference app for visual comparison — dashboard at desktop and mobile nav at phone width.
Let me use the VLM skill to analyze screenshots for visual comparison.
Now let me capture the reference app's mobile navigation state at phone width.
The mobile nav trigger appears at phone width. Let me open it and capture the reference mobile menu.
Reference mobile nav confirmed working (Close + CRM header + 8 links). Now let me test the local app's mobile nav the same way.
Local app matches reference post-login behavior (lands on marketing page). Let me open the local dashboard and test its mobile nav.
Local dashboard structure matches the reference (with a11y supersets). Now let me open the local mobile nav and verify.
Local mobile nav works identically. Let me test Escape close and navigation, then do a visual comparison.
Mobile nav navigation works: `/Leads` reached, drawer auto-closed, scroll locks released. Now let me visually compare the two mobile nav screenshots with VLM.
The VLM flagged a possible missing overlay in the local drawer. Let me verify this carefully with a fresh capture — it could be a screenshot timing issue.
Overlay IS present (`bg-black/80`, computed `oklab(0 0 0 / 0.8)`). The earlier screenshot caught the fade-in mid-animation. Let me retake it now.
**移动端导航（Mobile nav）已确认与参考标准一致（pixel-identical）**（仅是 Base44 徽章遗留物不同，系特意未进行镜像）。现在让我运行该仓库的全量测试套件——冒烟测试（smoke test）和端到端（e2e）测试——以验证完整状态。
The e2e setup failed — let me diagnose.
Just missing Playwright browsers. Installing Chromium:
All 226 e2e tests pass (8.0m). Now the drift sweep — the pixel parity check against committed baselines.
The sweep reuses the dev server on :3000 (still running). Let me run the four-band drift sweep.
All gates green: 4-band sweep clean, reference STABLE. Let me update progress and audit the specific areas the user called out: db-path wiring, sitemap/SEO, and test configs.
db-path.ts is a complete, battle-tested implementation (bun absolutization bug handled, pinned by tests). Now the sitemap/SEO:
SEO is comprehensively implemented. Let me verify the live responses and check remaining audit items.
SEO fully verified live. Now a deeper audit — security, env hygiene, and recent changes:
All advisories are dev-toolchain (vite/eslint/minimatch family) — zero runtime exposure, matching the documented posture. Let me check the landing page's mobile menu (the second mobile nav surface) and scan API security.
Line 333 looks suspicious — let me verify the actual file content:
File is correct (grep display artifact). Let me verify the landing mobile menu works live at phone width:
Landing mobile menu verified working. Let me dispatch a scandihaven pattern review while running the interior census gate:
Scandihaven review complete. The interior census crashed — likely Chromium contention with my agent-browser session. Let me close it and retry:
Interior census: byte-parity, zero unexplained deltas. The full gate is GREEN. Now let me audit `.env.example` completeness against actual env usage in code:
The sweep vars have defaults but aren't in `.env.example` — a genuine gap worth fixing. Let me check the screenshots folder state:
My mistake — paths include the folder prefix. All screenshots are tracked and the tree is clean:
All screenshots tracked. Let me check how `.env.example` is pinned by tests (the docs mention a bidirectional pin):
The pins are `toContain`-style, so additions are safe. Let me look at the count-ladder mechanism since adding a test changes the documented counts:
Now I have the full picture. Let me check the test-count constants that would need re-anchoring:
The session doc format is clear (my round = session-204, doc session_430.md). Let me finish the audit with a few final health checks before writing the remediation plan:
Code hygiene is clean. The audit is complete. Now let me review the plan-doc format and write the remediation plan:
Now let me scope the count-ladder work — how many live-tense sites carry the current unit count:
Let me check the live-census mechanism in docs-counts (whether test counts are verified live):
Now I understand the full house ceremony. Let me examine the AGENTS.md session-section structure and PAD inventory for where session-204 records go:
The full ceremony is scoped. Let me check one more pin — whether the PAD session-table row count is itself pinned:
I have everything needed. Let me write the session-204 remediation plan document:
Plan validated against the codebase. Now executing **TDD Step 1 — RED**: let me study the facts-census test structure first:
Now let me write the RED pin test (TDD step 1):
Now verify RED-at-birth (both new tests must fail, zero collateral):
**RED verified**: exactly 2 new tests fail, 36 existing pass. Now **GREEN** — add the block to `.env.example`:
**GREEN**: 38/38. Now the house mutation-proof — plant the defect, verify the pin trips, restore:
Mutation-proof: 1 RED on planted defect → GREEN on restore. Now the count ladder — let me map all live-tense 2841 sites:
Now I understand the complete re-anchor structure. Let me examine the SKILL head surgery target precisely:
I have the complete pattern. Now let me write `skill-head-204.py`:
SKILL head updated. Now let me get the exact current forms at each ladder site:
Now writing the count ladder script:
All 29 flips applied. Now verify the full unit suite (expect 2842 with all doc pins green):
**Arithmetic error caught**: 2843 tests, not 2842 — my D-204a1 describe added TWO its, not one. The house count-ladder must be exact. Let me correct the ladder to the true arithmetic (2841 → 2843, badge 3067 → 3069):
Let me rewrite the ladder script cleanly with the corrected arithmetic:
2843/2843 GREEN. Let me verify no stray 2842 forms remain in the live sites:
Let me fix the skill-head script's idempotency markers to match the corrected counts:
The self-referential marker flip breaks idempotency. Let me remove that one-shot entry (its target state is already baked in):
Tests still 2843/2843. Now let me correct the plan doc's arithmetic and fill its execution record:
Now let me capture the session screenshots. First check the dev server is still up:
All 5 screenshots captured. Let me verify their content with VLM:
Screenshot 677 caught the post-login landing page, not the dashboard. Let me retake it at the dashboard URL:
All screenshots verified. Now the AGENTS Session-204 section — let me check the Session-203 section's format:
Now let me append the Session-204 section to AGENTS.md:
Now the PAD session inventory row — let me check the table structure around the s203 row:
Still green. Now the worklog Task ID 204 entry — let me check the Task 203 format:
Now the session_430.md transcript:
Session transcript written. Now the **final gate** — full chain at the cured tree:
Build killed (OOM — dev server + other processes consuming memory). Let me free resources and retry:
The documented s164-lineage flake (S72-P2 settings-defaults focus, 1-in-3 runs) hit this run. Let me verify it passes isolated, then re-run the suite:
Confirmed: passes isolated (4.3s) — the documented starved-read lineage flake. Let me re-run the full suite:
Different tests failed this time (a11y citation gates) — varying failures indicate resource starvation. Let me check system load:
Memory is clean now. Re-running the e2e suite on a quiet system:
Persistent failures now — let me examine the actual failure details:
Both failures are /calendar a11y tests — and today (Nov 1) is a month-boundary trigger date! Let me examine the failure context:
**Root cause emerging**: a color-contrast flag on a November calendar event chip (`Call — Khalid (EGT)`) that doesn't appear in October — the calendar a11y registration is **month-dependent**. Let me investigate the seed data:
The seed uses **relative day offsets** — the calendar's current-month content is date-dependent. Let me examine the a11y spec's sanctioned matchers for /calendar and the chip construction:
The failing node is an **event chip** (`span[title=...]`), not covered by the calendar's day-cell matchers. Let me examine the chip tint construction:
The today-cell chips render `bg-white/20 text-white`. Let me see the full day-cell construction and understand what changed at the month rollover:
Let me run axe on the calendar page right now to see the live violations and understand the date dependence:
Let me reproduce the axe flag live against the dev server:
Empty violations — suspicious. Let me verify the page actually rendered the event chips:
Login didn't complete. Let me redo it properly:
Reproduced! Two color-contrast flags. Let me identify exactly which elements these are:
The dev db is a day stale (sweep reseeded yesterday) — but this reveals the real flags: the **today chip** AND the **page header title** (`bg-white/10`). Let me check which axe version the e2e uses and the page-header construction:
The `.bg-white/10` is the **active sidebar link**. Let me check the installed axe version vs my CDN version, and see what the e2e actually flagged:
Both e2e failures cite the today chip. Let me check when this today-chip treatment landed — maybe it's newer than the last green a11y run on a chip-bearing today cell:
Let me reproduce against the exact e2e environment (standalone build + e2e db):
Full reproduction — 3 flagged nodes. Let me see the complete SANCTIONED register to check which of these are covered:
The chips' axe targets use TITLE selectors (not class form), missing the `bg-white\/` sanctioned matcher. Let me find all `bg-white/20` usages and understand the selector-form difference:
Let me check an October-era calendar screenshot to see the today-cell state then:
The today chips existed in October with the same styling. Let me examine axe's actual selector-generation logic to understand the form switch:
The selector form depends on **class uniqueness**. Let me check the seed history — were both today events always there?
Let me directly test the selector-uniqueness theory — remove one today chip and re-run axe:
The mechanism is confirmed (1 chip → class-form target → sanctioned). Now let me check `filterAttributes` — which attributes axe considers:
`MAXATTRIBUTELENGTH = 31` — titles under 31 chars get attribute-form selectors. Let me check the a11y spec's git history for the white-wash matcher:
The matcher existed since s171 (Oct 23). Let me check `eventsOn` and the fetch-window logic for a month-dependent filter:
I've confirmed the mechanism. Now let me scope the fix properly — check which elements across the app carry `title` attributes:
Only calendar chips carry `title` attributes app-wide — a scoped matcher arm is safe. Let me verify the dialog-open state too:
Let me examine the October screenshot's today cell chip count precisely:
Let me simulate the October-like state (2 chips on a mid-month today cell) by moving events in the db:
Let me dump the actual class counts for the today chip's classes in the live page:
**Root cause fully verified**: the today-chip's classes all have count ≥2 (bg-white/20: 2), so axe falls to the unique `title` attribute → title-form target → escapes the class-based sanctioned matcher. This is the same white-wash genus (the reference's own palette) — the register's blind arm. Per house doctrine (the reference's own palette is sanctioned with citations, like the drawer links), the cure is extending the register. Let me execute the TDD cure:
Now the D-204b2 source-census pin (TDD — write it, verify it's born-green, then mutation-prove):
The landing's `MockDashboard title={row.title}` is a React prop, not an HTML attribute — let me verify and refine the census:
The prop renders as text content, not an HTML attribute. Let me refine the census to exclude component-prop passing:
40/40 — born-green. Mutation-proof the census, then get the exact final count:
The mutation used `title="..."` (string form) but my census only catches `title={`. Let me fix the census to catch both forms:
The widened regex over-matches something. Let me see the failure detail:
The regex catches multiline component props (`<PageHeader\n title="...">`). Let me implement a proper backward-tag-scan census:
Born-green. Now the mutation-proof (plant `title=` on a DOM element elsewhere):
Mutation-proven, src/ untouched. Now verify the e2e cure — run the a11y spec:
65/65 a11y GREEN. Now the exact unit count and the final ladder flip:
The inventory-census pin caught the a11y.spec line-count drift — I need to re-anchor the PAD §11 row:
Inventory census green. Now the final ladder pass — 2843 → 2845, badge → 3071 (counting D-204b2's +2):
The first flip script aborted midway. Let me check the current state of all sites:
README flipped but UNIT constant and some sites didn't. Let me find and fix all remaining 2843 sites:
**2845/2845 GREEN.** Now let me update all the session docs to include the D-204b cure:
The SKILL head update failed on line-wrapping mismatch. Let me fix with the actual one-line form:
Let me finalize the ladder script's docstring and run the complete final gate:
**FULL GATE GREEN: 2845 unit + 226 e2e.** Now the baseline-inertness sweep proof and db census:
All gates green. Now the commit — let me review the full change set:
Two remnant 2843 references in the PAD row. Let me fix them:
Now the commit. Let me stage everything and create the house-style commit:
Commit `eced926` on main. Now the SSH push — let me read the wrapper runbook:
No ssh binary — I need the paramiko shim from the runbook's Appendix A:
I have the complete shim. Let me set up the key and shim outside the repo:
Dry-run clean — remote at `257cf15`, our `eced926` fast-forwards. Real push:
**Push successful** — `eced926` verified on GitHub main, key shredded, tree clean. Let me finalize the task list:
Session-204 is complete and pushed to `main` as **`eced926`**. Here's what happened:

## Audit & Verification (everything you asked about, live-verified)

- **Baseline gate at the shipped s203 state**: lint 0/0 · tsc 0 · 138/2841 unit · build · smoke 14/14 · **e2e 226/226** · db census MATCH at `<repo>/db/custom.db`
- **Six drift gates clean**: four-band pixel sweep (desktop/phone/tablet/landscape), interior census **byte-parity**, probe:ref STABLE (`46bc2d9c`)
- **Mobile navigation — both surfaces working**, tested live against the reference app with agent-browser (logged in): the app drawer (open/Escape/link-ride/auto-close/dual scroll-lock release, overlay `oklab(0 0 0 / 0.8)`) and the landing disclosure menu — **VLM comparison: pixel-identical** (only the reference's own Base44 badge differs, intentionally never mirrored)
- **Tailwind v4 state clean** (CSS-first, no config file, vendored tw-animate), **SEO/sitemap live-verified** (11-route sitemap, robots, manifest, per-route OG/canonical), `.env` contract confirmed

## Two real gaps found & fixed (TDD, mutation-proven)

1. **D-204a1**: `.env.example` didn't document the four parity-gate tool vars (`OUR_URL/REF_URL/REF_EMAIL/REF_PASSWORD`) — RED-first pin → commented block added → GREEN
2. **D-204b (the live catch)**: the final-gate e2e run tripped the /calendar a11y tests. Root cause decoded live: the today-cell event chips (`bg-white/20 text-white`, the reference's own palette, 3.63:1) escape the class-based sanctioned matcher when axe falls back to `span[title=…]` attribute-form selectors (≥2 chips = no unique class). Fixed via the `span[title=` matcher arm + a title-attribute source-census scoping pin — **src/ untouched** (pixel parity preserved)

## Delivered

Final gate **fully green: 138 suites / 2845 unit + 226 e2e (badge 3071)**, screenshots 677-681, `.env.example` committed, docs lockstep (session_430.md, worklog Task 204, AGENTS/PAD/CLAUDE/README/SKILL v1.201.0, count ladder), pushed via the SSH wrapper with remote verification and key shredding.

One honest caveat: why October's runs passed this same calendar state remains not fully explained (recorded transparently in session_430.md); the fix covers both selector forms regardless.
