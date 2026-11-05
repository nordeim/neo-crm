I'll start by internalizing the operating instructions and setting up the workspace. Let me create a structured plan for this complex multi-phase task.
The workspace was reset. Let me clone the neo-crm repo fresh.
Repo cloned. The doc files are very large (942KB AGENTS.md, 1.2MB neo-crm_SKILL.md). Let me first understand the project structure and tech stack directly, then use agents for the massive docs.
Good — Next.js 16 + React 19 + Prisma/SQLite + Tailwind v4 stack. Let me check the docs structure and the session files mentioned.
The repo has 451 sessions of history — this is a mature, heavily-iterated project. Let me delegate the massive document reviews to parallel agents while I clone scandihaven and inspect the codebase hands-on.
Both document reviews are complete and comprehensive. I now understand: this repo runs a disciplined "rotation" protocol — the next round is **session-215** (trigger: `36aee3e` / session_451.md), with named candidate material being the Tailwind-v4 bullet family census. Let me update my todo list and bootstrap the workspace.
Environment is clean — no stale parent-of-repo db (the s212 hazard). Now bootstrapping dependencies.
`.env` now has `DATABASE_URL="file:../db/custom.db"` exactly as required, with the `db/` folder at the repo root. Now pushing the schema and seeding.
DB census: **MATCH (15/24/10/23/12 + 4 users)** with the database resolved inside the repo root `db/` folder — the s212/s214 anchor contract holds. Now let me read the repo skills the user pointed to, and check the Playwright browser binary (a known fresh-clone hazard).
The Playwright cache has chromium-1200 but the project expects 1248 — I'll fix that before the e2e leg. Now let me read the repo's governing skills.
The repo skill is clear on all contracts. Now let me start the baseline gate battery while examining the named session-215 material — the AGENTS.md Tailwind-v4 bullet family.
Now let me examine the existing test pins to understand what's already covered — this determines the session-215 material scope.
The pattern is clear. Let me check what's already pinned in `design-tokens.test.ts` vs what the Tailwind-v4 bullet claims, to scope the session-215 material precisely.
Coverage map established: the live-source pins exist (design-tokens, spacey-hazard, settings parity), but the **doc-face census of the AGENTS Tailwind-v4 bullet** has no teeth, and critically the **postcss-plugin claim** and **no-tailwind-config claim** have NO pin anywhere. That's the session-215 material. Let me study the s214 pin form to follow the established conventions.
The s213/s214 census form is clear. Now let me run the baseline unit test suite (the rotation protocol's baseline gate battery).
Baseline unit: **138/2878 GREEN** — matches the s214 ship state. Now the build.
**Baseline gate battery fully GREEN**: lint 0/0 · tsc 0 · 138/2878 unit · build · smoke 14/14 · e2e 226/226. Now the fresh-eyes parity walk — booting the dev server and driving both apps. Let me check the agent-browser tooling first.
Dev server is up. Let me verify the listener's DB anchor (the standing s212 hazard check), then walk the reference app.
Logged into the reference — it lands on `/` (the marketing page), matching the clone's behavior. Now the mobile navigation check at 390px, the user's named focus.
The reference at 390px shows the "Open navigation" hamburger — let me open the drawer and exercise it.
Reference mobile nav verified: opens as dialog, body-only scroll lock, closes on route change and Escape with lock release. Now the same battery on our clone.
Mobile nav parity confirmed with the documented supersets (dual body+main scroll lock). Let me test the resize-past-768px auto-close — the clone's behavioral superset.
That's the landing page's "Toggle navigation" disclosure — need to check if it's actually visible at 1280px or correctly hidden.
Correctly hidden at desktop — no bug. Let me verify the landing mobile menu at 390px on both apps, then check SEO surfaces.
Landing mobile menu verified with aria-expanded superset. Now the SEO surface check on the live clone.
SEO surface fully verified. Now the Tailwind v4 state check.
All live faces verified. Let me run the reference drift probe to confirm the reference hasn't moved (the standing battery leg).
Reference is **STABLE at 46bc2d9c** — no drift. The audit is complete with zero live defects. Now let me study the s214 plan format and write the session-215 remediation plan.
Now let me verify the vitest and playwright configs are sound (the user asked to ensure test suites), then write the session-215 plan.
Both configs are sound and battle-hardened — verified green in the baseline. Now writing the session-215 remediation plan.
Plan created. Now validating it against the codebase before execution — checking every anchor string I plan to pin.
All 16 doc anchors verified. Now the live faces:
Two checks need refinement — the tw-animate census matched a comment, and I found a THIRD controlMt site. Let me investigate.
All live faces validated. Let me check the @theme block boundary structure for a robust test-side slice.
The @theme block spans lines 30–310 (first column-0 close). Let me check how existing tests walk the repo root with skills/ exclusions, then write the census pin.
Let me verify the exact token export names and cursor rule structure before writing the pin.
All token forms verified. Now writing the session-215 census pin (RED-first discipline: the pin ships, then each mutation must prove its teeth).
The pin is written. Running it now — expecting born-green per the audit's live verification.
**BORN-GREEN: 70/70** at the file (62 + 8 new). Now the mutation proofs — each planted defect must trip exactly its own pin RED.
M6 and M7 didn't apply (line-wrapping defeats sed; quoting issue in the python one-liner). Let me debug and re-run those two properly.
The mutation landed in the bullet yet the test passed — let me investigate it-6 directly with a fresh mutation.
The end-marker `**Stock-primitive inks**` doesn't exist — the slice runs to EOF! Let me find the real boundary.
**Mutation M6 exposed a real defect in my pin**: the end-marker doesn't exist, so the slice ran to EOF making the doc-face vacuous. This is exactly what mutation-proofing is for. Fixing the boundary:
The boundary fix revealed it-8's claim lives in its OWN bullet (after Stock-primitive inks). Let me check the actual bullet order.
it-8 needs its own bullet slice — the tw-animate claim is a separate bullet. Fixing:
Born-green 70/70 with honest boundaries. Now the full 8-mutation proof with the fixed pin:
M1–M6, M8 each trip exactly 1 RED. **M7 exposed another pin defect** — the comment above the rule contains the literal rule text, so the pin is comment-blind. And M9 crashed the whole suite (boundary guard works). Let me fix the comment-blindness:
All anchors survive comment-stripping. Applying the fix — the globals live-face goes comment-stripped:
M7 still passes — there must be a second matching rule. Investigating:
M7's script was removing the *comment text* (which literally contains the rule), not the rule itself. The pin is correct — the mutation was wrong. Fixing M7 to operate comment-stripped:
M7 trips RED but 2 tests failed — need to check which:
The second failure is collateral — my script rewrote the file comment-stripped, tripping an unrelated s169 token-count pin. Making M7 surgical (remove only the rule span from the raw file):
M7 now trips exactly 1 RED. Running the complete final mutation battery:
**All 9 mutation proofs pass** — each planted defect trips exactly 1 RED (M9 as a suite-level guard, exit 1). Two birth defects in the pin itself were caught and cured by the mutation battery. Now the stash-proof:
**STASH-PROOF: 138/2878 → restored → 138/2886.** The count ladder is verified. Now the ladder scripts — let me study the s214 forms to replicate.
I have the full ladder pattern. Let me check the current doc sites to write exact s215 flips.
Now writing both ladder scripts:
Ladder verified idempotent, **138/2886 GREEN**. Now the docs lockstep — starting with the AGENTS Session-215 section. Let me check the s214 section form.
The s214 section is the last in AGENTS.md. Writing the Session-215 section now:
Now the PAD §7.1 inventory row:
Now the captures 732-736. Let me study the s214 capture script form:
Captures landed. Fixing the header comment and verifying the pixel signatures:
All pixel signatures verified (blue sidebar, open drawer, non-blank content). Now the round transcript — `docs/session_452.md`:
Now filling the plan's execution record with the live-verified results:
Docs lockstep complete. Now the final gate battery:
Core gate fully green. Now the six drift gates:
The dev server died under e2e memory pressure (the s214 round's known wrinkle). Relaunching and re-probing the DB anchor:
**All six drift gates CLEAN** (probe STABLE, 4 sweep bands, fullpage at the exact standing margins, interior census exit 0/unexplained 0). Final pre-commit checks:
All checks pass — 19 files (9 modified + 10 new), zero secrets/dbs. Updating the plan's final-gate tally, then committing:
Commit landed. Now the push ritual — let me read the SSH wrapper runbook and check the shim requirements:
I have the full shim spec. Checking paramiko and deploying the shim:
Key materialized outside the repo (0600). Running the wrapper — dry-run first:
Dry-run green — auth validated, remote at `36aee3e`, fast-forward to my commit confirmed. Real push:
**Pushed and remote-verified**: `refs/heads/main @ 5685b9f == local HEAD`, key shredded. Now the rotation trigger — writing session_453.md (the raw execution record):
Both pushes remote-verified. Cleaning up the key material and running the final verification:
All work is complete and remote-verified. Let me finalize the todo list:
**Session-215 complete — pushed to `main` and remote-verified.** Following the repo's rotation protocol (trigger: `36aee3e`/session_451), I ran the full audit round as **THE TAILWIND-BULLET SEMANTIC-PROSE CENSUS**:

**The audit (zero live defects):** fresh-clone rebuild with `DATABASE_URL="file:../db/custom.db"` (db census MATCH at the repo-root anchor), baseline gates green (138/2878 unit · smoke 14/14 · e2e 226/226), probe:ref STABLE, and the full parity battery on **both apps logged in** — the mobile navigation verified working at 390px on the reference and ours (plus our documented supersets: dual scroll-lock, resize-past-768px auto-close), Tailwind v4 state clean, SEO/sitemap all live-verified, test configs sound.

**The cure (D-215a1):** eight census pins in `tests/facts-census.test.ts` giving the AGENTS Tailwind-v4 bullet's claims their first teeth — including two claims that had *no* test anywhere (the postcss-plugin guard, the no-tailwind-config census). **Mutation-proofing caught two defects in my own pin** (a boundary-blind slice and a comment-blind match) — both cured in-round, then **×9 mutations each tripping exactly 1 RED**, stash-proof 138/2878→138/2886.

**The ship:** count ladder to badge 3112, SKILL v1.212.0, full docs lockstep, captures 732-736, all six drift gates clean, and both commits (`5685b9f` session-215 + `d38f6a2` update session log) pushed via the SSH wrapper with remote-ref verification and key shredding.

**Next step:** the s216 rotation is triggered by `d38f6a2` — the named candidate is the architecture-facts section's remaining bullets (stock-primitive-inks, SQLite-path doc face, store/effects), or whatever live defect the next fresh-eyes walk finds first.
