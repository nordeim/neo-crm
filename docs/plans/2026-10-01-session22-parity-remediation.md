# Session 22 Remediation Plan — The Typography / Base-Cascade Layer (2026-10-01)

**Scope:** Fresh-login live audit of the reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `4b4843d`
(pulled to the operator's session-21 transcript `docs/session_36.md` —
the ONLY change since `677dd9b`; zero app-code drift, so every pinned
family from s21's live verification held by construction). Workspace
intact: `.env` with `DATABASE_URL="file:../db/custom.db"` + `db/` at the
repo root, dev server healthy on :3000, vitest + playwright configs in
place. **Baseline gate green: lint 0/0 · tsc clean · 380/380 unit.**

**Standing layers re-verified FIRST (moving-target rule) — NO drift:**

- **Mobile navigation (the standing priority)**: (a) the reference at
  390px still ships NO navigation (**18th consecutive session** — zero
  `getClientRects().length > 0` nav links, no `<aside>`, correct probe
  per the s21 §16m.5 lesson); (b) our drawer's 7-check regression LIVE
  **7/7 PASS** — trigger hit-test 36×36 at (16,16); open + 8 links +
  focus entry + dual scroll locks (body + main both `hidden`); Escape +
  lock release + focus restore to the trigger under a REAL click;
  focus-trap wrap in BOTH directions (Settings +Tab → Close X, Close X
  +Shift+Tab → Settings — one probe lesson below); resize-past-md
  auto-close + lock release + the desktop sidebar swap (8 links
  @256px); route-change close (drawer Leads link → /leads, closed,
  unlocked, h1 "Leads"); **zero 390px overflow on all eleven routes**
  (9 authenticated + /login + /signup logged out via the logout API —
  the httpOnly cookie cannot be cleared from document.cookie); (c)
  drawer internals clean (h-dvh 844 === innerHeight, the slide panel
  `rgb(37,99,235)`, zero `hidden` attributes, the wrapper
  `transition-[visibility]` + overlay `transition-opacity` split).
- **The document metadata + PWA + HTTP header layers (s18+s19+s20,
  standing)**: curl-SSR — description 408 bytes, theme-color #000000,
  the manifest link, per-route canonical + og:title "Accounts | NEO CRM"
  + og:url on /accounts, robots byte-identical with the Sitemap line,
  sitemap 9 locs + bare `application/xml`, manifest `application/json`,
  the three security headers on `/`.
- **The login-card funnel (s21, standing)**: wrong-password → the
  ErrorCallout ("Invalid email or password", red-50/70 bg + red-200
  border + 16px padding + red-700 inner text, ZERO toasts).
- **Demo data still zero (18th consecutive session)** — /Reports served
  the empty-state rows (Total Leads 0, Open Leads 0, Won Deals 0
  $0.0K, Saved Reports (0)). The data-gated surfaces stay
  unverifiable.

**This session's NEW audit layer — the typography / base-cascade
census (never swept in 21 sessions).** Every prior text-metric
comparison pinned font SIZE/WEIGHT/line-height/letter-spacing (all
font-INDEPENDENT computed properties) and fixed-dimension geometry —
the font FAMILY itself, the smoothing mode, and the selection styling
were never probed. Swept via computed styles + the reference's raw
stylesheet (79.5KB `index-*.css`) + `document.fonts` + controlled
metric measurements on both apps:

| # | Sev | Issue | Evidence (live probes) |
|---|-----|-------|------------------------|
| S22-P1 | **High** | **The Inter webfont drift.** The reference ships ZERO webfonts: its whole 79.5KB stylesheet contains NO `@font-face` rule, `document.fonts` is empty, and every surface (body, h1, buttons, the sidebar brand) computes Tailwind's stock default stack `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` (its preflight html rule — byte-extracted). Our clone loads **Inter** via `next/font/google` (`--font-inter`) and overrides `--font-sans` with a v3-style list (`var(--font-inter), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`). Measured impact on the same 62-char string at 16px: reference 466.8px regular / 522.4px bold vs ours 439px / 451.3px — every text surface renders in the wrong typeface (~6% narrower regular, ~14% narrower bold in this environment; on real hardware system-ui = Segoe UI / SF Pro, visibly different from Inter). | controlled spans on both apps + CSS bytes + document.fonts |
| S22-P2 | **Med** | **The antialiased smoothing drift (doubled).** The reference ships ZERO font-smoothing rules (its computed `-webkit-font-smoothing` = `auto`, no `text-rendering` override). Our clone ships the scaffold-era shadcn convention TWICE: `html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }` in globals.css AND the `antialiased` utility on the body className. On macOS this renders visibly thinner/lighter text than the reference. | computed styles on both apps + full-stylesheet grep |
| S22-P3 | **Low** | **The invented `::selection` rule.** Our globals.css ships `::selection { background-color: rgb(59 130 246 / 0.18); }` (a blue-tinted selection). The reference's stylesheet contains ZERO selection rules — the browser default selection color. | full-stylesheet grep on the reference's CSS |
| — | Info | **The disproven s21 pointer (documentation lesson):** session_35.md's "keyboard shortcut parity (the reference's 'Notifications alt+T' region hint)" lead is a PHANTOM — the reference ships no keyboard shortcuts and no Notifications UI text anywhere: zero matches in the live DOM (text nodes AND attributes), zero in its 1.6MB JS bundle ("notify" hits are all react-query internals), and Alt+T produces no behavior. The first "Alt+T focuses the bell" reading was a probe artifact (the preceding CLICK had focused the bell; the keypress did nothing). Lesson: next-session pointers are LEADS to re-verify live, never facts to plan around. | DOM/bundle greps + keypress probes from multiple focus states |
| — | Info | **Verified at parity (no action):** line-height 24px/1.5 both; tab-size 4; font-feature-settings `normal`; font-variation-settings `normal`; `-webkit-tap-highlight-color: transparent`; caret-color default; box-sizing border-box; the topbar mail/bell buttons dead on both apps (ours aria-labeled "Messages"/"Notifications" — the documented accessible superset over the reference's two unnamed buttons); the topbar search renders NO dropdown at zero data on BOTH apps (our `hasResults` gate; the functional results dropdown = the documented superset with data); the sidebar nav-link weight 400 both (an earlier 500-vs-400 reading was a span-vs-a measurement artifact); the dashboard Add button dead on the reference / wired on ours (the documented functional-superset pattern, visual contract pinned s6); the reference's page-level "New Lead" dialog opens fine (the s5 field-set source — re-confirmed working). | probes above |

**Census-method lessons this session (→ SKILL §16n):**
- **The session-env leak hazard**: `export AGENT_BROWSER_SESSION=clone22`
  persists across bash invocations — a subsequent "reference" probe in
  the same shell silently ran against the CLONE (the smoothing
  false-parity). Prefix reference probes with `env -u
  AGENT_BROWSER_SESSION` (or unset per command) whenever both sessions
  are live.
- **The focus-race wrap probe**: a programmatic `.focus()` in one eval
  followed by a `press Shift+Tab` in a separate CLI call can land on
  BODY (focus lost between commands) — re-establish focus and re-press
  before declaring the trap broken; the wrap verified clean on the
  second, properly-sequenced probe.
- **The font-metric controlled span**: comparing text-driven widths
  across apps requires a created `<span>` with pinned font-size/weight
  (element text widths mix in per-surface weight/class differences —
  the first "119 vs 115px Dashboard link" reading mixed a 500-weight
  reference span with our 400-weight link).

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. New `tests/typography.test.ts` (~10 checks, dynamic seam imports
   per the s18 pattern): layout.tsx imports NO `next/font/google` and
   applies NO font variable to `<html>`; the body className carries NO
   `antialiased`; globals.css references NO `--font-inter`, declares NO
   `--font-sans` override in `@theme` (the v4 stock default ships),
   ships NO `-webkit-font-smoothing` / `text-rendering` rule, and NO
   `::selection` rule; the stock default stack is the expected computed
   family (the v4 default, matching the reference's preflight bytes);
   the s13 16px body regression guards re-held (no font-size on body).
2. E2E additions in `tests/e2e/crm.spec.ts` (~4 checks): the body's
   computed font-family starts with `ui-sans-serif, system-ui` and does
   NOT contain "Inter"; `document.fonts` loads ZERO fonts;
   `-webkit-font-smoothing` computes `auto` on the body; the h1
   computes the same stock stack.

### Phase B — implementation (the three fixes)

1. **S22-P1**: remove the `Inter` import + const + `inter.variable`
   from `src/app/layout.tsx` (html keeps `lang="en"` only); delete the
   `--font-sans` override from the `@theme` block (v4's stock default
   — byte-identical to the reference's preflight stack — feeds both
   the `font-sans` utility on body and the `body { font-family:
   var(--font-sans) }` base rule).
2. **S22-P2**: remove the `html { -webkit-font-smoothing: antialiased;
   text-rendering: optimizeLegibility; }` rule from globals.css AND
   the `antialiased` class from the body className (both invented).
3. **S22-P3**: remove the `::selection` rule from globals.css.
4. Re-capture `public/og-image.png` (1200×630) post-fix — it is OUR
   live dashboard capture and should show the remediated (system-font)
   rendering.

### Phase C — gate + live re-verification

Full gate: `bun run lint` → `bun run typecheck` → `bun run test`
(390+) → `bun run build` → `bun run test:e2e` (68+). LIVE on the dev
server: the computed body font-family = the stock stack on / and
/login; `document.fonts` empty; smoothing `auto`; the controlled-span
metric now MATCHES the reference's 466.8px/522.4px readings; the
text-width shift guard — the full 390px overflow sweep re-run on all
11 routes (system-ui text runs wider than Inter: watch for new
overflow); the standing layers spot-check (drawer open/Escape, head
census, security headers, the login Callout).

### Phase D — deliverables

Screenshots: the established 23 refreshed under `docs/screenshots/`;
`.env` / `.env.example` re-verified (no new env surface — the font is
not env-configurable); docs realigned (README structure tree line,
AGENTS counts + the session-22 contract block, CLAUDE counts + the
typography suite, PAD matrix + the §7.2 pattern note + the typography
table rows (the stale Inter rows) + the §7.4 checklist, SKILL v1.19.0
§16n + frontmatter + project_state + the §4 typography section +
the stale "Inter typography" identity line, `docs/session_37.md`, this
plan's addendum, both worklogs); commit on main + SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 11 checks in `tests/typography.test.ts`
(dynamic seam imports) — 8 confirmed failing / 2 structural passes
initially, plus the s13 guard. Gate-caught TWICE during the red phase:
(a) the source-pin regexes matched the RETIREMENT COMMENTS I wrote into
the sources (the s21 own-doc-comment hazard, immediately) — fixed by
stripping comments before the pins (and `//` line comments in
layout.tsx, not just `/* */`); (b) the s13 font-size guard needed the
established design-tokens pattern (comment-strip + body-rule scoping —
the input-base utility's 0.875rem is a control surface, not the body).

**Phase B (implementation):** the Inter import + const +
`inter.variable` retired from `layout.tsx`; the `antialiased` body
class retired; the `html { -webkit-font-smoothing; text-rendering }`
rule retired; the `::selection` rule retired. ONE gate-caught
correction mid-implementation: the first `--font-sans` attempt relied
on Tailwind's own default (override simply deleted) — the live probe
showed Tailwind 4.3's default is the v4.0 `-apple-system,
BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans",
Arial, sans-serif, …` list, NOT the reference's v3-era stack; the fix
pins the reference's EXACT stack explicitly in `@theme` (version-proof
against future Tailwind default changes — the "never pin a default you
haven't byte-verified" lesson). The e2e font-count check filters off
Next's dev-overlay `__nextjs-Geist` faces (registered in dev with
status "unloaded"; absent from the production build).

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**391/391 unit** (+11, 20 suites) · build · **67/67 e2e** (+3
computed-style checks; mobile-nav 7/7). LIVE on the dev server: the
computed body font-family is BYTE-IDENTICAL to the reference's stack;
`document.fonts` empty of app fonts; smoothing `auto`; text-rendering
`auto`; the controlled-span metric MATCHES the reference exactly
(466.8px/522.4px — was 439px/451.3px under Inter); **the 390px
overflow sweep re-run clean on all 11 routes** (the wider system font
— ~14% wider bold — broke no layout); the standing layers spot-checked
post-change (drawer open/Escape + dual locks, the curl head census,
the security headers, the login Callout with zero toasts).

**Phase D (deliverables):** all 23 screenshots re-captured with
per-shot verification (zero md5 duplicates); `public/og-image.png`
re-captured at 1200×630 under the remediated rendering; `.env` /
`.env.example` re-verified (no env surface); docs realigned (README
badge 458 + the typography row + counts + the structure-tree line,
AGENTS counts + the session-22 contract block + the suite list,
CLAUDE counts + the typography suite, PAD matrix 391/67 + the §7.2
session-22 pattern note + the §5.1 typography table re-pinned + the
§7.4 checklist, SKILL v1.19.0 §16n + frontmatter + project_state +
the §4 @theme snippet + the design-thesis line, `docs/session_37.md`,
this addendum, both worklogs). Committed on main + SSH-wrapper push.
