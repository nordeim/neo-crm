The workspace has been reset — no neo-crm repo. Let me set up the task plan and clone the repo.
Repo cloned — 94 sessions of prior work, latest commit is session-94. Now let me review the documentation. Given the massive doc sizes (AGENTS.md 233KB, worklog 778KB), I'll read strategically.
session_190.md is the s94 process narrative — the previous session shipped tabs-family parity at 390 + phone-width sweep mode. My session is #95. Let me verify what the latest commit contains and read session_189.md + worklog tail.
Session 94 shipped; my session is #95. Now the worklog tail and skills catalog.
Worklog confirms s94 shipped fully. Now let me review the core docs — CLAUDE.md (compact contract) first, plus the heads of the others.
CLAUDE.md absorbed. Now AGENTS.md head and the skills catalog.
Now let me check the skills catalog and the AGENTS session-history tail.
目录已吸收。现在让我验证环境：.env、db/、package.json，并执行安装。
Fresh clone — `.env` missing, `db/` empty. Let me set up the environment (noting the documented platform `DATABASE_URL` override hazard).
Platform override hazard confirmed (`file:/home/z/my-project/db/custom.db` — parent of repo). All repo ops will run under `env -u DATABASE_URL`. Now push schema + seed:
Census MATCH — environment verified. Now the baseline gate:
Baseline green: lint 0/0 · tsc 0 · 1832/1832 (102 suites) — matches the s94 ship state exactly. Let me check the s94 delta for the audit scope:
The s94 delta is clear: sweep tool phone-mode + docs (zero src/ changes). Now let me update todos, write the worklog intake, and dispatch the two audit subagents in parallel.
Now dispatching both audit subagents in parallel (95-a: s94 delta re-audit; 95-b: graduation audit + operator-decision evidence):
Both audits clean — 13/13 GENUINE, zero unguarded CSV builders, decisions stand. Only docs nanos found (F-95a1: SKILL §5.6 stale "300 lines/37 checks" vs actual 1520/180). Now the live parity work. Let me check tooling and boot the dev server:
Tooling verified. Booting the dev server detached (the documented setsid pattern — the sandbox reaps background processes):
Server died between calls — the documented sandbox behavior (processes reaped between Bash calls; the sweep tool boots its own). The drift sweep is self-contained, so let me run desktop sweep #91 directly:
Desktop sweep #91 CLEAN — zero new drift (identical standing table: settings 4.73% picklist genus, dashboard 0.32% chart artifact). Now the phone-width sweep at TRUE 390×844:
Phone sweep reproduces the s94 table exactly — zero new drift at both viewports, seed restored. Now the reference-side live work (drift-sweep md5, census #91, the 95-c table-family rotation, drawer battery). Let me check the agent-browser skill usage:
Now the reference-side live work. Bundled: login → bundle md5 (drift sweep #91) → census #91:
Logged into the reference. Now the bundle md5 (drift sweep #91):
**Drift sweep #91 CLEAN** — bundle md5 `a70a637f…` EXACT (1,631,071 bytes), the 66th consecutive stable session. Now the reference census #91 — demo data, desktop nav, then TRUE 390:
Desktop census clean (demo-zero, 256px/8 links). Now TRUE 390×844:
**Census #91: the mobile-nav defect STANDS on the reference at TRUE 390** (nav w=0, 0 visible links, no menu button — 16th consecutive). Now the 95-c rotation: the **table family at TRUE 390** on the reference first:
Reference contacts decoded: table scrolls inside `relative w-full overflow-auto` (w=324) within the 326px card. Now the reference leads table (the sticky-thead family):
Sticky thead confirmed on reference leads (sticks to container top, white bg). The accounts page showed a different genus — main itself h-scrolls. Let me verify its chain:
Reference accounts decoded: the `flex gap-6` row lets the 472px table column overflow — main itself h-scrolls (the reference's own mobile behavior). Reference census complete. Now our app — bundled command (boot server → login → probe all three tables at 390):
The server was reaped between calls — everything must run in one process. Let me write a Playwright probe script (the sweep-tool pattern):
I have the sweep pattern. Now writing the table-probe script (one bundled process: boot → zero-data → login → probe 3 table pages at 390):
**Outstanding results — the table family at TRUE 390:**

| Surface | Reference | Ours | Verdict |
|---------|-----------|------|---------|
| **leads** | table 380, sticky thead top:0 h:63 bg:white, thW [81,79,0,0,78,61,0,65,16], y=1142, stuck@342 | **identical on every value** | FULL GEOMETRY MATCH |
| **contacts** | table 633 in 324 scroll-box, card 326, empty row 201px | **identical** | FULL MATCH |
| **accounts** | table 472, thead 43, row 85, y=1040 — but card pokes out (472), main h-scrolls | table surface **identical** (472/43/85/1040 exact); ours constrains via `flex-1 min-w-0` — table scrolls in-box, main never h-scrolls | MATCH + one explained genus |

The accounts overflow mechanism is the one difference — visually equivalent (sweep floor 0.53%), ours is the standard pattern. Now the drawer battery (the standing mobile-nav ask):
The drawer opened (locks engaged) but my panel selector missed — the s94 probe-trap lesson: read the source first:
The panel is a `div.h-dvh.w-72` inside the dialog root (not an aside). Fixing the battery with exact selectors:
OPEN probe FULLY GREEN (panel 288px @x0, blue, 8 links, focus inside, dual lock). But `[h` keeps vanishing from the locator — let me check the actual file bytes:
The file literally contains `aref=` — the `[h` was eaten by the edit pipeline. Fixing via sed directly:
The sed replacement also got mangled — something in the pipeline eats the `[h` sequence. Let me test this quirk:
Confirmed: the literal `[h` sequence is stripped by a pipeline sanitizer. Workaround — use `getByRole` instead of the href attribute selector:
The mystery is solved — the file actually contains the correct `a[href` all along; the DISPLAY pipeline strips `[h` from outputs (the od dump proves it). The real bug: our nav uses **capitalized hrefs** (`/Leads` — the s24 route-case construction), my locator used lowercase. Patching:
Battery nearly fully green — the nav-close shows the drawer released (inert/hidden/pe-none, locks freed) but pathname still "/" — the dev-server first-compile of /Leads takes longer than my 1200ms wait. Fixing with a URL-based wait:
**THE DRAWER BATTERY: FULLY GREEN at TRUE 390×844** — trigger (16,16) 36×36 · panel 288px @x0 blue · 8 links · focus inside · dual lock · navigate-close → **/Leads** with full release · Escape-close · resize-past-md lock release. The mobile nav is verified working (the user's particular ask).

Now the TDD remediation — the `--pages` filter (s94 suggested-next #3). First, the current pin style:
The pin style is clear. Let me verify the F-95a1 numbers before writing the plan:
F-95a1 confirmed (1520 lines / 180 checks vs the stale "300 lines / 37 checks"). Now writing the session-95 remediation plan:
Plan written. Now the RED phase — the 4 new pins (appending the session-95 block):
Now the RED run — the new pins must fail against the pre-fix source:
**RED verified: 4 failed | 12 passed** — exactly the new pin set. Now GREEN — implementing the seam:
Now the wiring — captureAll takes the list, main() parses, both loops ride it:
Now the header doc — add `--pages` and fix the B-95a8 `--max-diff` form:
Now fix the original B-95a8 carrier (the `--max-diff=<pct>` text in the intro block):
Now the GREEN run + typecheck:
Two TS fixes — the Set typing and the regex flag:
16/16 GREEN. The two TS errors are in my probe scripts — the drawer battery is worth committing (the s94 probe-trap protocol encoded as a tool), the table probe is a one-off. Fixing the casts and removing the one-off:
tsc 0. Now the non-vacuousness stash proof:
The stash-proof output got swallowed — redoing it with explicit capture:
**Non-vacuousness PROVEN**: stash → 4 failed | 12 passed; pop → 16/16. Now the maiden filtered run:
S95-P0 complete (fail-fast clean, census MATCH). Now S95-P1 — the F-95a1 docs nano:
Now S95-P2 — screenshots. Let me check the existing numbering and format:
Screenshots run 1–138; mine are 139–141. Let me check the VLM skill for the verification battery:
Now the screenshot capture script (bundled, seeded state for demonstrative rows):
All three captured. Now the VLM 5-question battery (house protocol):
139: 4/5 YES — Q4's NO is the DOM-verified shared genus (table 380px in the 358px scroll box — the horizontal-scroll affordance, identical on the reference). Now 140 and 141:
Both Q1=NO — the tables are below the 844px fold at seeded state (stats sections push them down). Re-capturing with the table scrolled into view:
140 now 5/5 YES. But 141 regressed — the contacts page has its own full-height scroll construction. Let me probe its geometry:
The contacts page at 390: table starts at y=887 (below the 844 fold) and main can only scroll 5px — the full-height construction squeezes the table card. Let me probe the visible region precisely:
The contacts page nests its own scroller (`div.flex-1.overflow-auto`, scrollH 5946) inside main — my script scrolled the wrong element. Fixing 141's capture:
**VLM: 139 4/5 (one adjudicated shared-genus NO), 140 5/5, 141 5/5.** Now let me finalize the drawer-battery tool header (committing it — it encodes the s94 probe-trap protocol for future sessions) and clean up:
**1836/1836 (102 suites, +4 net)** — as planned. Now build + e2e:
**FULL GATE GREEN: lint 0/0 · tsc 0 · 1836/1836 unit · build clean · 132/132 e2e (3.1m, zero flakes, mobile-nav suite green).** Now the docs realignment — first the lockstep pin:
Now the lockstep re-anchor (1832 → 1836, the s92/s93/s94 pattern) + all count updates:
Now the CLAUDE.md count updates (4 sites):
Now AGENTS.md counts + README badge/Tested row:
AGENTS history lines stay (s94's own record). Updating the current-state counts in PAD + README, and adding the s95 inventory row:
Now insert the s95 inventory row before the PAD Total:
Now the AGENTS §Session-95 history block:
Now the SKILL v1.92.0 updates — frontmatter, H1, project_state, §16ci:
Now append the §16ci section to the SKILL:
SKILL done. Now the formal session log — session_191.md:
Now the repo worklog entry:
Now re-run the full unit suite (doc edits may surface lockstep pins):
Tree is 9 modified + 6 new. Removing the one-off shots script (lessons documented in the docs; the battery tool stays), then verifying the final state:
All verified. Now the commit — then the SSH-wrapper push. Reading the runbook first:
Runbook absorbed. Now the commit (house style):
Commit `1a7b063` landed, tree clean. Now the push — deploying the key outside the repo and checking the ssh binary:
paramiko 5.0.0 (the runbook-validated version). Now deploying the key (outside the repo, per the runbook) and the shim:
Key parses (ed25519). Now the Appendix A shim:
Dry-run green (`c215904..1a7b063 HEAD -> main`). Now the real push:
**PUSHED — remote verified: `main @ 1a7b063` == local HEAD.** Now shredding the operator key per the runbook:
Session 95 shipped. Final housekeeping — the sandbox worklog completion record:
**Session 95 shipped to `main` @ `1a7b063`** (remote verified, key shredded, tree clean).

**What was delivered:**

- **The 95-c rotation — the TABLE family at TRUE 390×844** on both apps: the leads table achieved **full geometry match** (the sticky thead's 9 column widths, y=1142, and the live stuck-on-scroll behavior all exact), the contacts table matched fully, and the accounts table matched on its surface with one explained genus (ours keeps the table in its scroll box via `min-w-0`; the reference lets it poke out and scrolls main — visually equivalent, ours the cleaner pattern).
- **The mobile-nav drawer battery: FULLY GREEN** at 390 (trigger, panel geometry, focus trap, dual scroll-lock, navigate-close → /Leads, Escape, resize-release) — now productized as `scripts/drawer-battery-390.ts`.
- **The sweep `--pages` filter** (TDD, RED-first, stash-proven): `bun run sweep -- --pages leads,settings` for targeted runs, with fail-fast on typos.
- **Audits clean**: s94 delta GENUINE, zero graduations (13/13), CSV census 17 sites zero unguarded, SEO/sitemap + configs verified; one docs nano fixed. Both operator decisions re-affirmed (55th).
- **Gate green**: lint 0/0 · tsc 0 · **1836/1836** unit (+4) · build · **132/132** e2e; both sweeps zero new drift; reference bundle stable (66th consecutive); 3 new VLM-verified screenshots; docs realigned (SKILL v1.92.0).

**Suggested next (session 96):** walk the form family at 390 (login card + filter rows — the last unwalked static family), add a `--fail-on-drift` CI mode to the sweep, or stress the table reflow at a second phone width (375×812). Want me to proceed with any of these?
