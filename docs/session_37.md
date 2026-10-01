# Session 22 — The Typography / Base-Cascade Layer (completion log)

> Picked up from the session-21 completion point (pushed at `a496713` +
> the worklog record `677dd9b` + the operator's `docs/session_36.md`
> transcript commit at `4b4843d`). This file is the completion record for
> **Session 22** (the remediation plan lives at
> `docs/plans/2026-10-01-session22-parity-remediation.md`); the next
> session should treat it as the brief.

## What happened

1. **Workspace refresh** — `git pull` fast-forwarded to `4b4843d` (the
   operator's session-21 transcript, `docs/session_36.md` — the ONLY
   change; zero app-code drift since `a496713`). The five core docs
   (AGENTS/CLAUDE/README/PAD/SKILL v1.18.0) + session_35 + session_36 +
   the session-21 plan + both worklogs re-read in full; the operating
   instructions re-internalized. Environment intact (`.env` with
   `DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root, dev
   server healthy on :3000, vitest + playwright configs in place).
   **Baseline gate green: lint 0/0 · tsc clean · 380/380 unit.**

2. **The standing priorities re-verified FIRST — all healthy, NO drift.**
   (a) The reference at 390px: still NO navigation (**18th consecutive
   session** — `getClientRects().length` probe). (b) Our drawer's
   7-check regression LIVE **7/7 PASS** — with one probe lesson: a
   programmatic `.focus()` followed by a separate CLI `press
   Shift+Tab` landed on BODY (focus lost between commands) and faked a
   broken trap; re-sequenced, the wrap verified clean BOTH directions
   (Settings +Tab → Close X; Close X +Shift+Tab → Settings). (c)
   Drawer internals clean (h-dvh, the #2563eb slide panel, zero
   `hidden` attrs). (d) The s18+s19+s20 metadata + header census via
   curl-SSR (description 408 bytes, theme-color #000000, manifest/
   canonical/per-route OG, robots bytes, sitemap 9 locs, the three
   security headers). (e) The s21 login-card funnel spot-probe (the
   wrong-password Callout, zero toasts). (f) Demo data STILL zero
   (**18th consecutive session**). (g) **Zero 390px overflow on all
   eleven routes** (the /login + /signup sweep done logged-out via the
   logout API — the httpOnly cookie cannot be cleared from
   `document.cookie`).

3. **The s21 pointer's "Notifications alt+T" lead: DISPROVEN** — zero
   keyboard shortcuts and no Notifications UI text exist on the
   reference (zero matches in the live DOM text + attributes, zero in
   its 1.6MB JS bundle — every "notify" hit is react-query internals;
   Alt+T does nothing from any focus state; the one "it focuses the
   bell" reading was a probe artifact — the preceding CLICK had
   focused the bell). Pointers are leads to re-verify, never facts.

4. **The NEW audit layer — the typography / base-cascade census (never
   swept in 21 sessions).** Every prior text-metric pin compared
   font-independent properties; the FAMILY, smoothing, and selection
   were never probed. Findings, all live-verified:
   **S22-P1 (High)** the reference ships ZERO webfonts (no
   `@font-face` in its 79.5KB stylesheet, `document.fonts` empty, the
   stock sans stack on every surface incl. the brand) while ours
   loaded Inter via `next/font/google` — every text surface rendered
   in the wrong typeface (measured: 466.8px/522.4px reference vs
   439px/451.3px ours on the same 62-char string at 16px);
   **S22-P2 (Med)** our double `antialiased` smoothing (the html CSS
   rule + the body class) + `text-rendering: optimizeLegibility` vs
   the reference's default `auto`/`auto`; **S22-P3 (Low)** our
   invented `::selection` blue tint vs the reference's browser
   default. Verified at parity (no action): line-height 24px, tab-size
   4, font-feature-settings normal, tap-highlight transparent, the
   dead mail/bell buttons (ours aria-labeled — the documented
   superset), the search's no-dropdown-at-zero-data, the nav-link
   weight 400 both, the reference's page-level New Lead dialog still
   working (the s5 field-set source).

5. **TDD** — 11 red-first checks in `tests/typography.test.ts` (8
   failing / 2 structural passes initially; gate-caught twice: the
   source-pin regexes matched the RETIREMENT COMMENTS themselves — the
   s21 own-doc-comment hazard, fixed by comment-stripping; and the
   s13 font-size guard needed the established body-rule scoping) →
   **391/391 unit** (+11, 20 suites) · +3 e2e computed-style checks →
   **67/67 e2e** (mobile-nav 7/7).

6. **Implementation** — the Inter import + `--font-inter` variable
   retired from `layout.tsx`; `@theme --font-sans` pins the reference's
   EXACT stack (gate-caught mid-implementation: Tailwind 4.3's own
   default is the v4.0 `-apple-system, BlinkMacSystemFont, …` list and
   NOT byte-identical to the reference's v3-era stack — the "just use
   the default" first attempt computed the wrong family; the explicit
   pin is version-proof); the double smoothing retired (html rule +
   body class); the `::selection` tint retired; the og-image
   re-captured (1200×630, the remediated rendering); the e2e font
   count filter scoped off Next's dev-overlay Geist faces (dev-only,
   status "unloaded").

7. **Verification** — full gate: lint 0/0 · tsc clean · **391/391
   unit** · build · **67/67 e2e**. LIVE on the dev server: the
   computed body font-family is BYTE-IDENTICAL to the reference's
   stack; `document.fonts` empty; smoothing `auto`; the controlled-span
   metrics now MATCH the reference exactly (466.8/522.4 — pixel
   convergence); **the 390px overflow sweep re-run clean on all 11
   routes** (the wider system font broke nothing); the standing layers
   spot-checked post-change (drawer open/Escape + locks, the head
   census, the security headers, the login Callout).

8. **Deliverables** — all 23 screenshots re-captured under
   `docs/screenshots/` with per-shot URL + content verification (zero
   duplicates, fresh timestamps); `public/og-image.png` re-captured;
   `.env`/`.env.example` re-verified (no env surface — the font is not
   env-configurable); docs realigned (README badge 458 + the
   typography feature row + counts, AGENTS counts + the session-22
   contract block + the suite list, CLAUDE counts + the typography
   suite, PAD matrix 391/67 + §7.2 + the §5.1 typography table rows +
   the §7.4 checklist, SKILL v1.19.0 §16n + frontmatter +
   project_state + the §4 snippet + the design-thesis line, this log,
   the plan addendum, both worklogs).

## Next session pointers

- The typography layer joins the standing surfaces — re-run the 3 e2e
  computed-style checks + the controlled-span metric spot-probe each
  session (the font is the widest-reach surface in the app; one
  `next/font` import regresses every text pixel).
- Never pin a Tailwind "default" without byte-verifying it against the
  live reference (4.3's default is the v4.0 list; the reference is v3
  — and a future minor could move it again).
- The reference's demo data has been zero for EIGHTEEN consecutive
  sessions — keep re-checking `/Reports` on login (it would unlock the
  edit dialogs, the picklist add flow, the avatar upload, and every
  data-gated surface).
- Unprobed layers remaining: the reference's EDIT dialogs, the
  picklist add flow, toast/export behaviors, the avatar UPLOAD — all
  data-gated on the same anomaly. Beyond those: ARIA role/property
  census beyond the tab-order sweep, the 500 error-state page.
- The `AGENT_BROWSER_SESSION` export leak: whenever both sessions are
  live, prefix reference probes with `env -u AGENT_BROWSER_SESSION`
  (bit once this session — a "reference" probe read the clone).
