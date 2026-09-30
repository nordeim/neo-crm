---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# NEO CRM

## Core Identity & Purpose

NEO CRM is a production-grade clone of the reference CRM workspace
(`https://neo-crm-8ab2c17c.base44.app/`) built as a single Next.js 16
application. It gives a small sales team everything the reference offers —
dashboard KPIs, pipeline analytics, accounts, contacts, leads, calendar,
activities, reports and settings — plus one deliberate upgrade: a fully
working mobile navigation drawer (the reference app leaves phone users
without navigation). Maintained by the repo owner (nordeim); agents work
directly on `main`.

Key technical decisions that shape everything else: Next.js 16 App Router
with a server-guarded `(app)` route group, Prisma + SQLite (zero-config,
path-normalized), hand-rolled scrypt + HMAC cookie sessions, one Zustand
store for all server state, and Tailwind CSS v4 configured CSS-first
(literal-hex `@theme` tokens, no JS config).

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

1. **ANALYZE** — Read the relevant files in full before planning; never work
   from partial excerpts. Identify explicit requirements, implicit needs and
   ambiguities. Check what the reference app actually does before assuming.
2. **PLAN** — Write a structured plan with sequential phases; confirm scope
   with the user before implementing when the request is ambiguous.
3. **VALIDATE** — Verify assumptions against executable truth (configs,
   lockfiles, running app) — prose docs may be stale.
4. **IMPLEMENT** — Incremental, testable components. Extend the pure seams in
   `src/lib/` rather than inlining logic. Keep lint green as you go.
5. **VERIFY** — Run the full gate: `bun run lint` → `bun run typecheck` →
   `bun run test` (148) → `bun run build` → `bun run test:e2e` (22). For UI
   changes, also drive the real app in a browser at both desktop and mobile
   widths — especially the mobile drawer regression suite.
6. **DELIVER** — Conventional Commit, push via the SSH wrapper, report what
   was Verified vs. Reasoned vs. Assumed.

### Project-Specific Principles

- **Match the reference, fix its defects.** Visual/behavioral parity with the
  reference app is the default; known reference bugs (e.g. missing mobile
  nav) are fixed, not copied.
- **One store, one envelope.** All server state flows through the Zustand
  store; all API responses use the `{ ok, data } | { ok, error }` envelope.
- **React 19 discipline is non-negotiable.** No setState-in-effect, no
  conditional hooks, no component definitions inside render.
- **Self-contained zero-config dev.** SQLite + seed must keep `bun install &&
  bun run db:push && bun run db:seed && bun run dev` working everywhere.

## Implementation Standards

### General Coding Practices

- Early returns over nested conditionals; composition over inheritance.
- Pure domain logic lives in `src/lib/*` seams with Vitest coverage; handlers
  and pages only orchestrate.
- Hand-rolled validation (`asString` / `asNumber` / `asDate` / enum
  membership) at every route boundary — no schema library by design.
- Named exports for components; kebab-case files; `@/` path alias only.

### Language & Framework Guidelines

- **Next.js 16 App Router**: `params`/`cookies()`/`headers()` are async —
  always `await` them. Page files export only `default` + metadata/config
  exports. Route handlers export only HTTP verbs + route config.
- **TypeScript** strict (except `noImplicitAny: false`), `isolatedModules`,
  no `any` in new code.
- **Tailwind v4 CSS-first**: tokens are literal hex in `src/app/globals.css`
  `@theme`; custom utilities via `@utility`, never `@layer utilities`. The
  `hidden` HTML attribute overrides display utilities — never combine them.
- **Radix primitives** for dialogs/selects/popovers; `tw-animate-css`
  (vendored at `src/app/vendor/tw-animate.css`) drives `data-[state]`
  animations.
- **recharts** for charts; every chart ships an empty-state fallback.
- **lucide-react** icons only.

## Development Workflow

### Environment Setup

```bash
bun install
cp .env.example .env            # then set AUTH_SECRET (openssl rand -hex 32)
bun run db:push                 # create db/custom.db from the schema
bun run db:seed                 # demo workspace (idempotent, in place)
bun run dev                     # http://localhost:3000
```

Demo login: `sepnetflix2023@outlook.com` / `$Abcd1234`.

### Build Commands

| Command             | Purpose                                       |
| ------------------- | --------------------------------------------- |
| `bun run dev`       | Dev server on port 3000 (Turbopack)           |
| `bun run build`     | Production standalone build                   |
| `bun run start`     | Boot the standalone production server         |
| `bun run lint`      | ESLint (flat config) — must be 0/0            |
| `bun run typecheck` | `tsc --noEmit` — the real type gate           |
| `bun run test`      | Vitest unit suites (148 checks)               |
| `bun run test:e2e`  | Playwright E2E (22 checks, needs build first) |
| `bun run db:push`   | Push Prisma schema (no migrations folder)     |
| `bun run db:seed`   | Reseed demo data in place                     |

## Testing Strategy

### Test Pyramid

- **Unit (Vitest, 148 checks)** — pure seams: `tests/db-path.test.ts`,
  `tests/auth.test.ts`, `tests/format.test.ts`, `tests/csv.test.ts`,
  `tests/rate-limit.test.ts`, `tests/avatar.test.ts`,
  `tests/constants.test.ts` (the DOM-pinned chart palette),
  `tests/lead-filters.test.ts` (the popover Save View encode/decode seam),
  `tests/page-layout.test.ts` (the DOM-pinned layout + chrome contracts,
  sessions 6–8: KPI ladders, page headers, rails, filter bars, the
  shell/sidebar/topbar anatomy, the login card, stat-card and card-header
  button pins, the mobile-nav breakpoint contract, view switchers and the
  leads filters popover). Node environment; `@` alias resolved.
- **E2E (Playwright, 22 checks)** — `tests/e2e/`: `auth.spec.ts`
  (logged-out surface), `auth.setup.ts` (one real login, storageState saved),
  `crm.spec.ts` (authenticated golden path across all 9 pages),
  `mobile-navigation.spec.ts` (6-check regression suite for the drawer —
  pinned because the reference app ships NO mobile navigation; includes the
  resize-past-md lock-release regression).

### Test Commands

```bash
bun run test                       # all unit suites
bunx vitest run tests/auth.test.ts # one suite
bun run build && bun run test:e2e  # E2E boots the standalone server on :3100
```

E2E uses an isolated scratch database (`db/e2e.db`) reseeded **in place** by
`tests/e2e/global-setup.ts`. Never delete that file between runs — a reused
server keeps reading the deleted inode and sees stale data.

### Coverage Targets

Unit coverage of the pure seams (`src/lib/*`) is the gate — every new pure
helper ships with tests. No hard percentage threshold; the count grows with
the seam (currently 148).

## Code Quality Standards

### Linting & Formatting

```bash
bun run lint   # eslint . — 0 errors, 0 warnings before every commit
```

React-hooks rules that matter here (violations are errors):
`set-state-in-effect`, `refs` (no ref writes during render),
`rules-of-hooks`, `static-components` (no components created during render).

## Git & Version Control

### Branching Strategy

- `main` only — no feature branches. Small, atomic, directly committed.

### Commit Standards

- Conventional Commits with emoji prefixes: `:tada: feat:`, `:bug: fix:`,
  `:memo: docs:`, `:recycle: refactor:`.
- Never commit `.env`, `*.key`, `db/*.db`, `node_modules/`.
- Push via `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/neo-crm.git` (runbook:
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`).

## Error Handling & Debugging

### Error Handling Approach

- Route handlers return typed errors through the envelope (`ERR.UNAUTHORIZED()`,
  `ERR.BAD_REQUEST(msg)`, `ERR.NOT_FOUND(what)`) — never throw across the
  boundary, never leak stack traces.
- Client actions surface failures via toasts (`toast.error(title, detail)`)
  and inline form alerts; the login card keeps its error state visible.
- Charts and lists render explicit empty states — never blank panels.

### Debugging Tools

- Dev server log: `dev.log` (tee'd by the `dev` script) — read the tail after
  any weirdness; Turbopack surfaces compile + runtime errors there.
- `agent-browser` (headless Chromium CLI) for reproducing UI issues at
  desktop/mobile widths without a display.
- E2E traces land in `test-results/*/trace.zip` — `bunx playwright show-trace`.

## Communication & Documentation

- Explain "why" in code comments only where the reason is not obvious
  (see `mobile-nav.tsx`, `db-path.ts` — they document the reference-app bug
  and the CLI-path rule respectively).
- `AGENTS.md` is the compact agent contract; this file is the full workflow
  reference; `Project_Architecture_Document.md` is the deep engineering
  blueprint. Keep all three in sync when architecture changes.

## Project-Specific Standards

### Architecture

- `(app)` route group: `src/app/(app)/layout.tsx` resolves the session
  server-side and redirects to `/login`; all authenticated pages live inside
  the group. `/login` and `/signup` sit outside it.
- Client shell: `AppShell` (sidebar ≥lg, topbar, mobile drawer) wraps every
  authenticated page; `hydrate()` bootstraps the store once.

### API Design

- REST handlers under `src/app/api/**/route.ts`, all `force-dynamic`,
  session-gated via `requireSession()`.
- Envelope: `{ ok: true, data } | { ok: false, error: { code, message } }`.
- CSV export/import lives at `/api/export` + `src/lib/csv.ts`.

### Database / Data Layer

- Prisma + SQLite; schema at `prisma/schema.prisma`; `db push` (no
  migrations); seed is idempotent in place.
- Singleton client via `globalThis` in `src/lib/db.ts`; path resolution in
  `src/lib/db-path.ts` mirrors the Prisma CLI's schema-relative rule —
  including undoing bun's `.env`-relative absolutization of
  `DATABASE_URL` (see `runtimeDatabaseUrl()`) — and `db:push` goes through
  the `scripts/prisma-env.ts` wrapper so the CLI lands on the same
  `<repo>/db/custom.db` file.
- Models: User, Account, Contact, Lead, Activity, Event, SavedReport,
  Setting (singleton row).

### Environment Variables

| Variable               | Purpose                                  | Example                       |
| ---------------------- | ---------------------------------------- | ----------------------------- |
| `DATABASE_URL`         | SQLite file URL, schema-relative         | `file:../db/custom.db`        |

Currency DISPLAY is always `$`-attached, with three DOM-pinned per-page
variants: dashboard compact lowercase (`$145.0k` / `$1.4M`), reports compact
UPPERCASE K (`$542.0K` won / `$196K` lost via `formatCompactCurrency`
options), leads FULL (`$687,000` via `formatCurrency`) — the reference app
ignores its own Default Currency setting and so do we (the Settings field
still stores `AED`).
| `AUTH_SECRET`          | HMAC secret for session cookies (≥16ch)  | `openssl rand -hex 32`        |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata            | `http://localhost:3000`       |

## Anti-Patterns to Avoid

- **setState inside useEffect bodies** — use remount-via-key forms,
  adjust-during-render, or yield-before-setState patterns instead.
- **`tailwind.config.js`** — dead config in v4; tokens belong in `@theme`.
- **Deleting the SQLite file under a running server** — reseed in place.
- **Trusting bun's `DATABASE_URL` at face value** — bun absolutizes
  relative `file:` values from `.env` against the `.env` location (one dir
  outside the repo); always derive through `runtimeDatabaseUrl()`.
- **Weakening the mobile-navigation e2e suite** — it pins the app's headline
  fix over the reference app's defect.
- **Inventing status vocabularies** — extend the `*_META` maps in
  `src/lib/constants.ts`.
- **`window.location.href` for downloads** — route through
  `downloadFile()` in `src/lib/download.ts`.
