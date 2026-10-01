# Session 21 Remediation Plan — The Login-Card Error + View-State Layer (2026-10-01)

**Scope:** Fresh-login live audit of the reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `e1f808e`
(pulled to the operator's session-20 transcript `docs/session_34.md` — the
ONLY change since `7dc7d17`; zero app-code drift, so every pinned family
from s20's live verification held by construction). Workspace intact:
`.env` with `DATABASE_URL="file:../db/custom.db"` + `db/` at the repo root,
dev server healthy on :3000, vitest + playwright configs in place.
**Baseline gate green: lint 0/0 · tsc clean · 349/349 unit.**

**Standing layers re-verified FIRST (moving-target rule) — NO drift:**

- **Mobile navigation (the standing priority), three ways**: (a) the
  reference at 390px still ships NO navigation (**17th consecutive
  session** — no `<aside>`, zero truly-visible nav links; the first probe
  this session false-positived 8 "visible" links — see the census-method
  lesson below); (b) our drawer's 7-check regression LIVE **7/7 PASS** —
  trigger hit-test 36×36 at (16,16); open + 8 links + focus entry + dual
  scroll locks (body + main); Escape + lock release + focus restore to the
  trigger under a REAL click; focus-trap wrap in BOTH directions (Close X
  → Shift+Tab → Settings; Settings → Tab → Close X); resize-past-md
  auto-close + lock release + the desktop sidebar swap (8 links @256px);
  route-change close (drawer link → /leads, closed + unlocked + h1
  "Leads"). (c) Drawer internals swept for Tailwind v4 hazards: zero
  `hidden` attributes on the overlay/panel (the one `[hidden]` element in
  the DOM is a benign 0×0 empty React portal placeholder), `h-dvh` 844 ===
  innerHeight, panel bg rgb(37,99,235), overlay `transition-[visibility]`
  intact. **Zero 390px overflow on all eleven routes.**
- **The document metadata + PWA + HTTP header layers (s18 + s19 + s20,
  standing)**: the full head census re-probed via curl-SSR — description
  408 bytes (405 chars + the em-dash), theme-color #000000, the manifest
  link + bytes, per-route og:title/canonical on /accounts, robots
  byte-identical, sitemap 9 locs + bare `application/xml`, manifest
  `application/json`, and the three security headers
  (Referrer-Policy / X-Content-Type-Options / HSTS) riding `/` AND the
  CSS asset — NO drift.
- **Demo data still zero (17th consecutive session)** — /Reports served
  the empty-state rows (Total Leads 0, Open Leads 0, Won Deals 0 $0.0K,
  Saved Reports (0)). The data-gated surfaces stay unverifiable.

**This session's NEW audit layers (four candidates swept):**

1. **The color-contrast census (WCAG 1.4.3)** — dashboard + login on both
   apps, computed-style tree-walk with effective-background blending:
   **PARITY** (both apps fail on the same tokens — green-500 "Won" 2.54,
   red-500 "Target" 3.76, green/red-600 deltas ~3.3 — the reference's own
   design choices, mirrored; login clean on both). Two probe-method
   lessons came out of it (below). The avatar-initial chips (white 10px on
   cyan/emerald-600) are OUR seeded-data surface — the reference's zero
   data renders no avatars (data-gated, palette seed-pinned).
2. **The focus-visible-ring census** — keyboard-Tab probes on both apps:
   the reference ships the UA-default outline (`1px auto rgba(10,10,10,.5)`);
   ours ships `focus-visible:ring-2 ring-white/50` — the documented
   accessible superset (sidebar.tsx:17), functional parity. No action.
3. **The @media census (reduced-motion / color-scheme / forced-colors)**:
   the reference's ONE reduced-motion rule targets only its sonner toasts;
   our global `prefers-reduced-motion` block (globals.css:253, scaffold-era,
   documented in SKILL §8) is the broader superset — kept. Both apps: zero
   print rules (s20 pin re-held), light-only (our `dark:scale-*` utilities
   are inert dead CSS), our forced-colors `outline-hidden` utilities inert.
   No action.
4. **The login-card error + view-state surface (THE actionable layer —
   never swept in 20 sessions, fully probeable without data)**: wrong-
   password / signup / verification probes on BOTH apps. SIX findings
   below — including two whole view states of the reference's login card
   we do not ship, and the s10 pin's "dead login button" claim DISPROVEN
   (the reference's "Need an account? Sign up" swaps the card in place to
   a working signup form).

---

## Identified Issues, Bugs and Gaps (all live-verified this session)

| # | Sev | Issue | Evidence (live probes) |
|---|-----|-------|------------------------|
| S21-P1 | **Med** | **Login error text drift.** The reference's inline banner: **"Invalid email or password"**. Ours: "Incorrect email or password" (`src/app/api/auth/login/route.ts:28`). | wrong-password probes on both apps |
| S21-P2 | **Med** | **Invented auth toasts.** The reference fires ZERO toasts on the auth flows: login failure = inline banner only; login success = silent redirect (probe: 0 `[data-sonner-toast]` at 1s/2s/3s/4s post-login). Ours fires `toast.error("Sign in failed", …)` on failure AND `toast.success("Signed in"/"Welcome to NEO CRM", …)` on success. | toast-count timelines on both apps |
| S21-P3 | **Med** | **Error banner visual contract drift.** The reference renders the shadcn **Callout** pattern (the same vocabulary the s11 pin froze for the green sent-callout, red variant): `relative w-full border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground text-foreground bg-red-50/70 border-red-200 rounded-xl` + inner `<div class="[&_p]:leading-relaxed text-red-700 text-sm">`. Ours ships a bare `<p class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">` — no border, full-opacity bg, red-600, tighter padding. TWO render sites (main form + reset view). | getComputedStyle + class captures on both apps |
| S21-P4 | **High** | **The in-place signup view is missing.** The reference's "Need an account? Sign up" (an onclick BUTTON, no href) swaps the login card IN PLACE (URL stays /login): "Back to sign in" (`flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition` + ArrowLeft svg, 127×20) → h2 "Create your account" (24px/700 slate-900) → form **Email / Password / Confirm Password** (NO Name field, NO Google button, NO OR divider, NO logo — the column is replaced entirely, same architecture as the s11 reset views) → "Create account" submit. Our clone NAVIGATES to the standalone `/signup` page instead (a `<Link href="/signup">`) and our signup form adds a Name field + Google button + divider. The s10 pin called the reference's button "dead" — disproven this session. Mismatch validation: "Passwords do not match" (banner, no field errors). Note: the reference's `/signup` URL itself 404s — our standalone `/signup` page stays as the documented working superset, now rendering the same minimal signup view for content parity. | eval-click + snapshots + style probes |
| S21-P5 | **High** | **The verify-email view is missing entirely.** The reference's signup success swaps to a third in-place view: "Back to sign in" → icon tile (`mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4`, 24×24 lucide Mail) → h2 "Verify your email" → paragraph `We've sent a 6-digit code to<br><span class="font-medium text-slate-900">{email}</span>` → **six code inputs** (`flex items-center justify-center gap-1.5` wrap; each = the stock shadcn Input + `text-center w-10 h-11 text-base font-semibold`, type text, inputMode numeric, first `autoComplete="one-time-code"` rest `"off"`) → "Verify email" submit (stock Button) → `<p class="text-sm text-slate-600">Didn't receive the code? <button class="font-medium text-slate-700 hover:text-slate-900 disabled:opacity-50 transition-colors">Resend</button></p>`. Error ladder (all banners, zero toasts): "Please enter all 6 digits" → "Invalid verification code. N attempts remaining." (N=4…1) → **"Too many failed attempts. Please request a new verification code."** (lockout after 5 total; button stays enabled, message repeats). Resend → "New verification code sent to your email" (info banner; the reference's email delivery is infra-gated — a self-hosted clone logs the code server-side). | 11 wrong-code submissions across two throwaway signups |
| S21-P6 | **Low** | **Signup error text drift.** The reference: "A user with this email already exists". Ours: "An account with this email already exists" (`src/app/api/auth/signup/route.ts`). | existing-email probes on both apps |
| — | Info | **Verified-aligned (no action):** the login-card palette (labels ≈ slate-700, subtitle slate-500, input borders slate-200 — ours serializes as v4 lab(), visually identical); the banner's form position (form child index 1, between the fields and the buttons — both apps); the reference's "Continue with Google" does a REAL Google OAuth redirect (unimplementable self-hosted — our `toast.info` fallback stays, documented); the reference's sonner toasts exist only as stylesheet boilerplate on these flows (`[data-sonner-toast]` count 0 across every auth probe); login/signup inputs h48 vs h44 (the reference's own inconsistency, mirrored). | probes above |

**Census-method lessons this session (→ SKILL §16m):**
- **The visibility-check inverse hazard**: `getComputedStyle(el).visibility
  !== 'hidden'` does NOT detect `display:none` ancestors (computed
  `visibility` stays `visible` under a hidden container) — it
  false-positived 8 "visible" nav links on the reference's 390px probe.
  The correct check: `el.getClientRects().length > 0`. (The inverse of
  the s20 §16l.3 `checkVisibility()` lesson.)
- **lab()/oklab() computed colors break rgb()-regex parsers**: Tailwind v4
  serializes opacity-modified colors as `oklab(...)/lab(...)` — a naive
  `rgb()` parser silently falls through to the parent background and
  mis-blends (the active-nav 4.32-vs-5.17 false positive).
- **Read the FULL computed box-shadow** before claiming a missing ring
  (a 90-char truncation cut the 4th shadow layer — the focus ring was
  rendering all along).
- **`role="alert"` ≠ a toast** — verify the element's container before
  classifying (the reference's "toast" was the inline form banner; the
  sonner count was 0).
- **`fill()` on the reference's controlled inputs can silently
  not-register in React state** — use the native value setter + an
  `input` event (the "Please enter all 6 digits" false error).

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. New `tests/login-views.test.ts` (~20 checks): the login/signup route
   message pins ("Invalid email or password", "A user with this email
   already exists"); the login-card source pins (no `toast.error`/
   `toast.success` in the auth submit path; the Callout class vocabulary
   at both render sites; "Need an account? Sign up" is a view-swap
   BUTTON, not a `<Link href="/signup">`; the signup view renders
   Email/Password/Confirm-Password with NO Name field; the verify view's
   layout vocabulary — icon tile, 6-input wrap, code-input classes, the
   resend line); the extended view machine transitions (signin→signup→
   verify→signin, back from everywhere); the verify API contract pins
   (attempts ladder, lockout at 5, resend reset, code hashing, expiry).
2. E2E additions in `tests/e2e/crm.spec.ts` (~8 checks): wrong-password →
   the Callout banner "Invalid email or password" + ZERO toasts; the
   in-place signup swap (click → h2 "Create your account" + 3 fields, no
   Google button, URL stays /login; back → signin); confirm-mismatch →
   "Passwords do not match"; fresh signup → the verify view (6 inputs +
   the email line); empty verify submit → "Please enter all 6 digits";
   wrong code → "Invalid verification code. 4 attempts remaining.";
   resend → "New verification code sent to your email"; the standalone
   /signup page renders the minimal signup view.
   (The verify HAPPY path stays unit-covered only — the code delivery is
   server-console-logged, invisible to the e2e browser; the reference's
   own email delivery is equally infra-gated.)

### Phase B — implementation

1. **S21-P1/P6 (messages)**: the two route files' error strings.
2. **S21-P2 (toasts)**: remove the auth toasts from `onSubmit` (the
   Google-button `toast.info` fallback stays — the documented
   self-hosted expression of the reference's real OAuth redirect).
3. **S21-P3 (Callout)**: both error-banner render sites upgrade to the
   reference's Callout vocabulary (the red variant of the s11-pinned
   `sentCallout` pattern, including the never-rendered `[&>svg]` icon
   classes — part of the reference's own Callout markup).
4. **S21-P4/P5 (views)**: extend `LoginView` in `src/lib/login-reset.ts`
   with `"signup" | "verify"` + intents; add the SIGNUP/VERIFY layout
   vocabularies (DOM-extracted strings above); rework `login-card.tsx` —
   the "Need an account? Sign up" footer becomes a view-swap button; the
   signup view (minimal form + Confirm Password + "Passwords do not
   match"); the verify view (6-input ref array, auto-advance, backspace,
   the ladder); the `/signup` page keeps `mode="signup"` as the initial
   view (the documented superset page, now content-aligned).
5. **The verify machinery**: Prisma `User` gains
   `verificationCodeHash String?` + `verificationAttempts Int @default(0)`
   + `verificationExpiresAt DateTime?` (db:push against `db/custom.db`);
   signup no longer sets the session cookie — it creates the unverified
   user + a 6-digit code (hashed, 15-min expiry, logged to the server
   console for the self-hosted delivery); new `POST /api/auth/verify`
   (constant-time compare, the attempts ladder → lockout at 5, success →
   session cookie) + `POST /api/auth/resend` (rate-limited, resets
   attempts, new code); login of an unverified user → re-send + swap to
   the verify view (the reference's own funnel discipline — mirroring the
   observable: an account that hasn't verified can't sign in).

### Phase C — gate + live re-verification

Full gate: `bun run lint` → `bun run typecheck` → `bun run test` (369+) →
`bun run build` → `bun run test:e2e` (68+). Live verification on the dev
server: the wrong-password Callout (classes + text), the signup swap +
mismatch, the fresh-signup → verify view + the ladder + resend, the
/login → /signup coherence, the standing layers spot-check (drawer
open/Escape, head census, security headers). The e2e DB stays isolated
(`db/e2e.db`) — the dev DB re-seeded after the schema push.

### Phase D — deliverables

Screenshots: the established 20 refreshed + 3 new shots (login error
banner, the in-place signup view, the verify-email view) under
`docs/screenshots/`; `.env` / `.env.example` re-verified (no new env
surface — the code delivery is console-logged); docs realigned (README
auth-flows row + counts, AGENTS counts + the session-21 contract block,
CLAUDE counts + the login-views suite, PAD matrix + §7.2, SKILL v1.18.0
§16m + frontmatter + project_state, `docs/session_35.md`, this plan's
addendum, both worklogs); commit on main + SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 31 checks written in `tests/login-views.test.ts`
with dynamic seam imports (the s18 granular-red pattern) — 27 confirmed
failing / 4 structural passes (the s11 regression guards, the Google
fallback pin, the type-array check) + 5 e2e checks appended to
`tests/e2e/auth.spec.ts` (with the wrong-credentials message flip).

**Phase B (implementation):** the login/signup route message fixes
(S21-P1/P6); the auth toasts removed (S21-P2 — the Google fallback
`toast.info` stays, the reference's button performs a real OAuth
redirect); the ErrorCallout/InfoCallout shared components in
`login-card.tsx` (S21-P3 — the red/green shadcn Callout vocabulary with
the `[&>svg]` classes verbatim); the five-view state machine + the
LOGIN_SIGNUP_LAYOUT/LOGIN_VERIFY_LAYOUT vocabularies in
`src/lib/login-reset.ts` (S21-P4/P5); the minimal signup form (Confirm
Password + the mismatch guard, NO name field — the name derives from
the email local part server-side); the verify view (six single-digit
inputs with auto-advance/backspace, the resend line); the Prisma
verification columns + `/api/auth/verify` + `/api/auth/resend` + the
client/server lib split (`verification.ts` client-safe with ZERO
imports vs `verification-server.ts` server-only). Gate-caught during
the e2e: `getByRole("alert")` also matches `__next_route_announcer__`
(scope with .filter); `getByLabel("Password")` substring-matches
"Confirm Password" (exact: true); the empty Notifications REGION ships
on both apps (assert zero role=status cards).

**One operational bug hit and fixed:** the schema push initially ran as
a bare `bunx prisma db push`, which fell into the documented bun
.env-absolutization trap (`src/lib/db-path.ts`) — it wrote
`<parent-of-repo>/db/custom.db` while the running server (correctly
normalized) read `<repo>/db/custom.db`, so every query failed P2022
"column does not exist". Fixed via `bun run db:push` (the
`scripts/prisma-env.ts` wrapper) + reseed; the stray outer db/ folder
deleted; the trap documented in SKILL §16m.6.

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**380/380 unit** (+31, 19 suites) · build · **64/64 e2e** (+4 net;
mobile-nav 7/7). LIVE on the dev server: the wrong-password Callout
(text/bg/border/padding/inner + zero toasts), the in-place signup swap
(URL stays /login, minimal form), the mismatch guard, the fresh-signup
→ verify view (40×44 centered inputs at exact computed parity — the
reference's own w-full+w-10 conflict resolves to 40px under its v3
cascade but flex-shrinks to ~56px under our v4, so only w-10 ships),
the full ladder + the green resend Callout + its ~3s auto-dismiss, the
HAPPY path (the server-console code → session → dashboard), the
/signup page, and the standing-layers spot-check (drawer, head census,
security headers, zero 390 overflow).

**Phase D (deliverables):** 23 screenshots (the 20 established +
21-login-error-callout / 22-signup-view / 23-verify-email-view) with
per-shot verification, zero duplicates; `.env`/`.env.example` verified
(no env surface); docs realigned (README badge 444 + auth row + counts,
AGENTS + the session-21 contract block, CLAUDE + the login-views
suite, PAD matrix 380/64 + §7.2, SKILL v1.18.0 §16m + the §8 contrast
re-pin, `docs/session_35.md`, this addendum, both worklogs). Committed
on main + SSH-wrapper push.
