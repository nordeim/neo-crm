# Session 21 — The Login-Card Funnel Layer (completion log)

> Picked up from the session-20 completion point (pushed at `6b8809e` +
> the worklog record `7dc7d17` + the operator's `docs/session_34.md`
> transcript commit at `e1f808e`). This file is the completion record for
> **Session 21** (the remediation plan lives at
> `docs/plans/2026-10-01-session21-parity-remediation.md`); the next
> session should treat it as the brief.

## What happened

1. **Workspace refresh** — `git pull` fast-forwarded to `e1f808e` (the
   operator's session-20 transcript, `docs/session_34.md` — the ONLY
   change; zero app-code drift since `6b8809e`). The five core docs
   (AGENTS/CLAUDE/README/PAD/SKILL v1.17.0) + session_33 + session_34 +
   the session-20 plan + both worklogs re-read in full; the operating
   instructions re-internalized. Environment intact (`.env` with
   `DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root, dev
   server healthy on :3000, vitest + playwright configs in place).
   **Baseline gate green: lint 0/0 · tsc clean · 349/349 unit.**

2. **The standing priorities re-verified FIRST — all healthy, NO drift.**
   (a) The reference at 390px: still NO navigation (**17th consecutive
   session** — zero truly-visible nav links, no `<aside>`). (b) Our
   drawer's 7-check regression LIVE **7/7 PASS** — trigger hit-test
   36×36 at (16,16); open + 8 links + focus entry + dual scroll locks;
   Escape + lock release + focus restore under a REAL click; focus-trap
   wrap BOTH directions; resize-past-md auto-close + the desktop sidebar
   swap; route-change close; zero 390px overflow on all eleven routes.
   (c) Drawer internals clean (the one `[hidden]` element is a benign
   0×0 React portal placeholder). (d) The s18+s19+s20 metadata + header
   census re-probed via curl-SSR — description 408 bytes, theme-color
   #000000, manifest bytes, per-route og/canonical, robots
   byte-identical, sitemap 9 locs + bare application/xml, the three
   security headers on `/` + the CSS asset. (e) Demo data STILL zero
   (**17th consecutive session**).

3. **Four never-swept audit candidates this session:**
   - **The color-contrast census (WCAG 1.4.3)** — computed-style
     tree-walk with effective-background blending, dashboard + login on
     both apps: **PARITY** (both fail on the same tokens — green-500
     "Won" 2.54, red-500 "Target" 3.76, the ~3.3 delta chips — the
     reference's own design, mirrored; login clean on both).
   - **The focus-visible-ring census** — the reference ships the
     UA-default outline; ours the documented ring superset: functional
     parity, no action.
   - **The @media census** — the reference's ONE reduced-motion rule
     guards only its sonner toasts; our global block is the documented
     broader superset; both apps light-only + zero print rules.
   - **The login-card error + view-state surface (THE actionable
     layer)** — wrong-password / signup / verification probes on BOTH
     apps, SIX findings, all live-verified:
     **S21-P1** the login error text ("Invalid email or password" vs our
     "Incorrect…"); **S21-P2** our invented auth toasts (the reference
     fires ZERO — login failure = the inline banner only, success = a
     silent redirect); **S21-P3** the error banner's Callout visual
     contract (bg-red-50/70 + border-red-200 + p-4 + the inner red-700
     text-sm div vs our bare red-50 p); **S21-P4** the IN-PLACE SIGNUP
     VIEW (the reference's "Need an account? Sign up" is an onclick
     BUTTON that swaps the card — the s10 "dead login button" pin
     DISPROVEN live — a minimal Email/Password/Confirm form with no
     name field, no Google button, no divider, and "Passwords do not
     match" on mismatch); **S21-P5** the VERIFY-EMAIL VIEW (the
     6-digit code inputs, the 5-attempt ladder → "Too many failed
     attempts. Please request a new verification code.", the resend
     with its auto-dismissing GREEN Callout, the unverified-login
     refusal); **S21-P6** the signup error text ("A user with this
     email already exists" vs our "An account with…").

4. **TDD** — 31 red-first checks confirmed granular RED (27 failing /
   4 structural passes; dynamic seam imports per the s18 pattern) in
   `tests/login-views.test.ts` → **380/380 unit** (+31, 19 suites) ·
   +5 e2e in `auth.spec.ts` (the Callout + zero toasts, the signup swap
   + back, the mismatch guard, the verify ladder + resend, the /signup
   superset page) → **64/64 e2e** (mobile-nav 7/7).
   Gate-caught: (a) Playwright's `getByRole("alert")` also matches
   Next's built-in `__next_route_announcer__` — scope with `.filter`;
   `getByLabel("Password")` substring-matches "Confirm Password" —
   `exact: true`; (b) the empty Notifications REGION ships on both apps
   — assert zero `role=status` CARDS, not a missing region.

5. **Implementation** — the login/signup route message fixes; the auth
   toasts removed (the Google fallback `toast.info` stays — the
   reference's button performs a REAL Google OAuth redirect, verified
   live); the ErrorCallout/InfoCallout shared components (the red/green
   shadcn Callout vocabulary, `[&>svg]` classes verbatim); the
   five-view state machine (signin → signup → verify → signin, the s11
   reset flow untouched); the six single-digit code inputs with
   auto-advance/backspace; the Prisma verification columns
   (`verificationCodeHash` hashed + `verificationAttempts` +
   `verificationExpiresAt`, NULL expiry = no verification pending — the
   seeded demo users pass straight through); `/api/auth/verify` +
   `/api/auth/resend` (rate-limited, the ladder + lockout + reset);
   the client/server split (`src/lib/verification.ts` client-safe with
   ZERO imports vs `src/lib/verification-server.ts` server-only — the
   import-boundary rule); the code logged to the SERVER console
   (self-hosted delivery). ONE operational bug hit and fixed: a bare
   `bunx prisma db push` fell into the documented bun .env-absolutization
   trap (it wrote `<parent-of-repo>/db/custom.db` while the server read
   `<repo>/db/custom.db` — every query failed P2022); the fix is
   `bun run db:push` (the `scripts/prisma-env.ts` wrapper) — the trap
   is now documented in SKILL §16m.6.

6. **Verification** — full gate: lint 0/0 · tsc clean · **380/380
   unit** · build · **64/64 e2e**. LIVE verification on the dev server:
   the wrong-password Callout (text/bg/border/padding/inner-color +
   zero toasts), the in-place signup swap (URL stays /login, minimal
   form, no Google/divider), the mismatch guard, the fresh-signup →
   verify view (the 40×44 centered inputs at exact computed parity —
   the reference's own w-full+w-10 conflict resolves differently under
   v4, so only w-10 ships), the full ladder + the green resend Callout
   + its ~3s auto-dismiss, the HAPPY path (the server-console code →
   session → dashboard redirect, zero toasts), the /signup page (the
   minimal view + the s13-pinned absolute title), and the standing
   layers spot-check (drawer open/Escape + locks + focus restore at
   390, the head census, the security headers, zero overflow).

7. **Deliverables** — all 23 screenshots under `docs/screenshots/`
   with per-shot URL + content verification (the 20 established shots
   refreshed + THREE new: `21-login-error-callout.png`,
   `22-signup-view.png`, `23-verify-email-view.png`; zero duplicates,
   fresh timestamps); `.env` re-verified (`DATABASE_URL=
   "file:../db/custom.db"`); `.env.example` re-verified (no change —
   the verification layer has no env surface; the code delivery is
   console-logged); docs realigned (README badge 444 + the auth-flows
   feature row + counts + the history note, AGENTS counts + the
   session-21 contract block + the suite-list addition, CLAUDE counts
   + the login-views suite + the e2e list, PAD matrix 380/64 + the
   §7.2 session-21 pattern note + the schema row + the §7.4 checklist,
   SKILL v1.18.0 §16m + frontmatter + project_state + the §8 contrast
   re-pin (the stale "soft backgrounds" claim corrected by the live
   census), this log, the plan addendum, both worklogs).

## Next session pointers

- The login-card funnel joins the standing surfaces — re-run the five
  auth e2e checks + spot-probe the Callout classes live each session.
- The `__next_route_announcer__` hazard: ANY e2e `getByRole("alert")`
  must scope with `.filter({ hasText })` (Next's announcer div also
  carries role=alert on every page).
- The reference's demo data has been zero for SEVENTEEN consecutive
  sessions — keep re-checking `/Reports` on login for the data-bearing
  instance (it would unlock the edit dialogs, the picklist add flow,
  the avatar upload, and every data-gated surface).
- Unprobed layers remaining: the reference's EDIT dialogs, the picklist
  add flow, toast/export behaviors, the avatar UPLOAD — all data-gated
  on the same anomaly. Beyond those: ARIA role/property census beyond
  the tab-order sweep, the 500 error-state page, keyboard shortcut
  parity (the reference's "Notifications alt+T" region hint).
- The verify-email HAPPY path is unit-covered only (the plaintext code
  rides the server console — invisible to the e2e browser); if a
  future session wires SMTP, revisit.
