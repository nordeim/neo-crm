# Session 2 Remediation Plan — 2026-09-29

**Scope:** Post-session-1 audit fixes, database-path hardening, dependency
hygiene, visual-parity iteration, documentation realignment, and
`neo-crm_SKILL.md` distillation. Baseline under audit: commit `9eb86eb`
(remote `main`), gate green at 47/47 unit + 20/20 e2e.

**Method:** TDD — every behavior change landed with a failing test first.
The `skills/` folder is excluded from all checking, testing and compilation.

**Status:** EXECUTED — see the execution addendum at the bottom.

---

## Identified Issues, Bugs and Gaps

| # | Severity | Issue | Evidence |
|---|----------|-------|----------|
| R-1 | **Critical** | First-boot SQLite path falls through to a CWD-relative resolution and the database is created **outside the repo** (`/home/z/my-project/db/custom.db` instead of `<repo>/db/custom.db`). | Running dev server (PID 14204) holds open fds on `/home/z/my-project/db/custom.db`; `db-path.ts` anchors are all gated on `existsSync(dirname(candidate))`, which fails on first boot when `db/` does not exist yet, so the raw `file:../db/custom.db` reaches the Prisma engine, which resolves it against the process CWD (`<repo>`) → parent directory. |
| R-2 | High | `.env.example` PostgreSQL example still names the scaffold's prior project (`project_management`). | `DATABASE_URL=postgresql://user:password@localhost:5432/project_management` in `.env.example`. |
| R-3 | Medium | `vitest.config.ts` header comment describes the previous project's seams ("router, clarify questions, plan sanitizer, check-in mapping"). | Lines 3–6 of `vitest.config.ts`. |
| R-4 | Medium | Two unused runtime dependencies: `tailwindcss-animate` (superseded by the vendored `src/app/vendor/tw-animate.css`) and `z-ai-web-dev-sdk` (no imports anywhere in app code). They are also listed in `scripts/install_packages.sh`. | `grep` over `src/`, `prisma/`, `scripts/` returns no usage; `globals.css` imports `./vendor/tw-animate.css`. |
| R-5 | Medium | Stray database directory outside the repo (`/home/z/my-project/db/`) created by bug R-1 must be retired after the fix so the dev server reads `<repo>/db/custom.db`. | `ls /home/z/my-project/db/` → `custom.db` (created 00:35, the dev-server boot time). |
| R-6 | Low | Docs drift after remediation: test counts, db-path contract, dependency tables, anti-pattern lists in `AGENTS.md`, `CLAUDE.md`, `README.md`, `Project_Architecture_Document.md`. | Counts change with new tests; db-path behavior changes with R-1. |
| R-7 | Low | No distilled engineering skill document exists for future agents. | `neo-crm_SKILL.md` absent from repo root. |

---

## ToDo List (execution order)

### Phase A — Code remediation (TDD)

- [ ] **A1. Pin R-1 with a failing unit test**, then fix `src/lib/db-path.ts`:
  - Extract the anchor→URL step into a pure, injectable seam
    (`urlForRoot(root, ref)`) that (a) joins `root/prisma/<ref>`, (b)
    `mkdirSync(dirname, { recursive: true })`, (c) returns `file:<abs>`.
  - Validated anchors (repo root proven by `prisma/schema.prisma` on disk)
    are now accepted **unconditionally** — first boot creates `db/` instead
    of falling through. The unvalidated `process.cwd()` fallback keeps the
    old existence guard (never mkdir from an unproven root).
  - New tests: `urlForRoot` creates a missing parent dir + returns the
    schema-relative absolute URL; regression test asserting the resolved
    URL for `file:../db/custom.db` always contains `<repo>/db/` even when
    the folder is absent (simulated via the pure seam).
- [ ] **A2. `.env.example`**: replace the stale PostgreSQL example with a
  `neo_crm` database name; keep every other line identical to the working
  contract.
- [ ] **A3. `vitest.config.ts`**: rewrite the header comment to describe the
  real seams (db-path, auth, format, csv, rate-limit).
- [ ] **A4. Dependency hygiene**: remove `tailwindcss-animate` and
  `z-ai-web-dev-sdk` from `package.json` and `scripts/install_packages.sh`;
  regenerate `bun.lock` + `package-lock.json`; verify zero references
  remain outside `skills/`.

### Phase B — Verification gate (unchanged order, per AGENTS.md)

- [ ] `bun run lint` → 0 errors / 0 warnings
- [ ] `bun run typecheck` → clean
- [ ] `bun run test` → all suites (≥ 50 checks after A1)
- [ ] `bun run build` → clean standalone output
- [ ] `bun run test:e2e` → 20/20 (includes the 5-check mobile-nav regression)

### Phase C — Runtime re-verification (R-1/R-5)

- [ ] Stop the dev server; remove the stray `/home/z/my-project/db/`
  directory; recreate `<repo>/db/custom.db` via `db:push` + `db:seed`.
- [ ] Restart `bun run dev`; confirm via `/proc/<pid>/fd` that every SQLite
  handle now points at `<repo>/db/custom.db`.
- [ ] Browser pass: login, dashboard data, all 9 pages, global search; mobile
  viewport (390px): drawer opens, all 8 destinations navigate, Escape +
  backdrop close, scroll lock — compared against the target-app screenshots
  in `/home/z/my-project/target-app-screenshots/`.

### Phase D — Screenshots

- [ ] Refresh the 11 captures in `docs/screenshots/` (login, 8 desktop
  pages, mobile dashboard, mobile drawer) from the remediated dev server.

### Phase E — Documentation realignment (R-6/R-7)

- [ ] `AGENTS.md`: db-path fact gains the first-boot mkdir rule + new test
  count; commands table counts refreshed.
- [ ] `CLAUDE.md`: test pyramid counts + db-path contract wording.
- [ ] `README.md`: tests badge, troubleshooting row for the parent-dir
  database bug.
- [ ] `Project_Architecture_Document.md`: ADR on the hardened resolver;
  testing-strategy counts; dependency list loses the two removed packages.
- [ ] **Create `neo-crm_SKILL.md`** at the repo root following
  `skills/to-distill-project-into-skill` (six-phase process, 20 core
  sections + appendices, every claim codebase-verified), informed by the
  structure reference in `skills/distill-codebase-skill`.

### Phase F — Delivery

- [ ] Append session-2 record to the repo `worklog.md`.
- [ ] `git add` + single Conventional Commit on `main`.
- [ ] Push via `docs/ssh_git_wrapper_v3.py` (paramiko shim on PATH; key
  stored outside the repo, shredded after); verify remote ref == local HEAD.

---

## Plan Validation Checklist (re-audited against the codebase)

- [x] R-1 mechanism traced line-by-line in `src/lib/db-path.ts` (anchors +
  `existsSync` guards) and confirmed against live process fds — fix touches
  only that file plus `tests/db-path.test.ts`.
- [x] R-2/R-3 are comment/example edits — no behavior change, no test
  impact.
- [x] R-4 removal is safe: no imports of either package outside
  `skills/`/lockfiles; `postcss.config.mjs` does not reference
  `tailwindcss-animate`; the app uses the vendored CSS.
- [x] R-5 sequence avoids the deleted-inode trap (server stopped before the
  file is removed; reseed happens before restart).
- [x] E2E flow unaffected by A1: `tests/e2e/global-setup.ts` pushes+seeds
  `db/e2e.db` **before** the standalone server boots, so the validated
  anchor finds an existing dir today and the mkdir is a no-op.
- [x] Docs list in Phase E covers every file that mentions test counts, the
  db-path contract, or the removed dependencies.

---

## Execution Addendum (2026-09-29, post-execution)

### R-1 root cause — deeper than planned

The planned "first-boot fallthrough" fix (A1) was necessary but not
sufficient. Controlled experiments (E1–E21) isolated the FULL mechanism:

| Source of the URL value                        | Resolution base                        | Observed landing          |
| ---------------------------------------------- | -------------------------------------- | ------------------------- |
| Process env (shell / execSync / webServer env) | `prisma/schema.prisma` (schema rule)  | `<repo>/db/<name>` ✓      |
| CLI/runtime loads a `.env` file itself         | the `.env` file's own directory        | `<parent>/db/<name>` ✗    |
| **bun** loads `.env` (every `bun run`/`bun x`) | **`.env` location, absolutized**       | `<parent>/db/custom.db` ✗ |

The live session-1 dev server held fds on `/home/z/my-project/db/custom.db`
because bun had exported `DATABASE_URL=file:/home/z/my-project/db/custom.db`
(absolute → passed through the resolver untouched by design). `prisma/.env`
does not help (bun keeps loading the root `.env` first), `bun --env-file`
does not chain into `bun x prisma`, and bunshell does not propagate
`set -a; . ./.env` to script children — all verified empirically.

### Final fix stack

1. `urlForRoot()` — validated anchors mkdir-on-demand (first boot).
2. `parseEnvFile()` / `effectiveDatabaseUrl()` / `runtimeDatabaseUrl()` —
   when `process.env.DATABASE_URL` is EXACTLY bun's absolutization of the
   cwd `.env` value, re-derive from the RAW value via the schema rule;
   every other value (e2e override, postgres, intentional absolute) wins.
3. Consumers rewired: `src/lib/db.ts`, `prisma/seed.ts`,
   `scripts/prisma-env.ts` (new `db:push` wrapper).
4. Dead `db:migrate` / `db:reset` scripts removed (no migrations folder).

### Visual-parity iteration (VLM-verified against the target captures)

- KPI labels: Title Case (removed `uppercase` styling) — all pages.
- Sparklines added: dashboard (cyan/green/orange-blue) + accounts
  (blue/green/cyan/violet/red per card) — matches the reference strips.
- Dashboard header: Add (outline, dropdown) + Export (outline, export-type
  menu) + Export (filled, one-click leads) — the reference's three-button
  row, with its duplicated-Export quirk turned into two distinct jobs.
- Filter bar: working "All Owners" dropdown (the reference renders this
  dropdown empty — its own defect) + "More..." link to /leads.
- Verdicts: dashboard HIGH parity, accounts HIGH parity (VLM re-check).

### Outcome

- Gate: lint 0/0 · typecheck clean · **58/58 unit** · build clean · 20/20
  e2e (5-check mobile-nav regression intact).
- Live verification: dev server restarted, every SQLite fd points at
  `<repo>/db/custom.db`; `bun run db:push` + `db:seed` land in-repo; the
  stray `/home/z/my-project/db/` directory is gone.
- Mobile drawer re-verified in-browser: opens, all 8 destinations navigate,
  Escape closes, scroll lock engages/releases.
- Screenshots refreshed in `docs/screenshots/` (11 captures).
- Docs realigned: AGENTS.md, CLAUDE.md, README.md, PAD (ADR-002 rewritten).
- `neo-crm_SKILL.md` distilled per the two repo skills.
