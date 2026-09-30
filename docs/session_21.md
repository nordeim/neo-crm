# Session 14 — Settings Defaults/Data Tab Structure + Danger Zone Rebuild + /Profile Casing Alias + line-soft Re-Pin (completion log)

> Picked up from the session-13 completion point (pushed at `b2da6bd`,
> plus the operator's `docs/session_20.md` commit at `08ed611`). This
> file is the completion record for **Session 14** (the 19th/20th
> task-book brief — the remediation plan lives at
> `docs/plans/2026-09-30-session14-parity-remediation.md`); the next
> session should treat it as the brief.

## What happened

1. **Workspace refresh** — pulled to `08ed611` (the only new remote
   commit was `docs/session_20.md`, the previous session's transcript);
   re-read the five core docs (v1.10.0) + session_19/20 + the
   session-13 plan + both worklogs. Baseline gate green: lint 0/0 ·
   tsc clean · 244/244 unit · dev server healthy on :3000 with
   `db/custom.db` at the repo root; `.env` (`DATABASE_URL=
   "file:../db/custom.db"`) / `.env.example` / vitest + playwright
   configs verified.

2. **Re-probe of every previously-pinned family FIRST (the moving-target
   rule)** — the reference did NOT move this session: dashboard KPI
   cards/labels/values/deltas/sparks, `#0a0a0a` foreground + 16px base
   font, dashed `3 3` `#ccc` grids, 6px button radii, the per-page
   CardTitle map, stock th/td densities, calendar day cells (all three
   states + border), the account menu (role=menu, z-50/6px/shadow-md,
   stock items), the by-type card family, reports tabs 1+2 structure,
   the login family (h1/subtitle/Google/footer), border tokens. Demo
   data STILL zero (10th consecutive session) — parity remains
   structural.

3. **The mobile-nav regression re-verified LIVE at 390px before any
   change (the standing priority)** — 7/7 PASS: the header trigger
   hit-test (a probing lesson: the drawer's overlay close button also
   matches `navigation menu` regexes — scope burger probes to
   `header button[aria-expanded]`), drawer open with 8 links + focus
   landing INSIDE the dialog (on the in-panel close button), dual
   scroll locks (body + main), Escape + lock restore, focus-trap wrap
   (last link → first focusable), resize-past-md auto-close,
   route-change close. 390px overflow sweep clean on all ten routes
   (eleven after the alias landed).

4. **The audit then went after the unprobed layers** named in
   `docs/session_19.md` — and the settings **Defaults and Data tabs**
   (only the CRM Configuration tab had ever been deep-compared) carried
   the session's real findings: our Defaults tab shipped a responsive
   **3-column grid** where the reference is a single-column
   `space-y-4` stack of `space-y-2` groups with the STOCK CardTitle and
   the stock CardDescription subtitle (14px/#737373 — ours was
   12px/#6b7280, both size and color wrong); the Data tab said
   "Templates" instead of "**Import** Templates", wrapped its buttons
   horizontally in secondary/sm size (h-8 text-xs) where the reference
   stacks stock outline default-size buttons (`w-full sm:w-auto`, icon
   `w-4 h-4`); the Danger Zone missed the `bg-red-50` tint, the
   circle-alert `w-5 h-5` title icon, `text-red-700` (ours used the
   #ef4444 danger token), the `max-w-xs` confirm input, the
   stacked button-below-input layout and the #fafafa destructive
   foreground — and shipped an extra warning paragraph the reference
   does not have.

5. **Two token/routing finds** — `--color-line-soft` was a scaffold-era
   #f3f4f6 (gray-100) where the reference's muted/accent computes
   **#f5f5f5** (verified on the live segmented tab tracks + a bg-accent
   probe; 27 class usages ride the token — the same class of finding as
   the s13 14px-base-font assumption); and `/Profile` (capital P)
   404ed on the clone where the reference serves BOTH casings (its
   account menu links the capital one).

6. **The session's root-cause find — a NEW Tailwind v4 hazard (the v4
   space-y flip's second face):** after the Defaults layout fix landed,
   live measurement showed the label→control gap at ~3px where the
   reference computes 12px. Cause: v4's `:where(& > :not(:last-child))
   { margin-bottom }` lands on the INLINE `<label>`, and vertical
   margins on inline elements DO NOT APPLY — the gap silently
   collapsed. The reference's v3-era semantics put margin-TOP on the
   block-level control instead. Fix pattern: KEEP the literal
   `space-y-2` group class (parity) + explicit `mt-2` on every control
   (`SETTINGS_DEFAULTS.controlMt` / `SETTINGS_DANGER.controlMt`) —
   after the fix the label-top-to-control-top distance is 28px on BOTH
   apps (the residual 1px rect difference is inline-box font-metric
   rounding). Same re-derive-from-computed-gap rule as the s11 `-mb-2`
   hazard; documented in AGENTS/PAD/SKILL.

7. **The /Profile implementation lesson (two e2e-caught failures):** a
   next.config.ts redirect is the WRONG tool for casing aliases —
   Next.js matches config redirects CASE-INSENSITIVELY, so
   `/Profile -> /profile` also matches its own destination and loops
   into ERR_TOO_MANY_REDIRECTS; the `caseSensitive` escape hatch is
   not a valid per-redirect property in Next 16 ("Invalid redirect
   found" at build). The shipped fix is a thin route folder —
   `src/app/Profile/page.tsx` → `redirect("/profile")`, outside the
   (app) group (a pure alias skips the shell + guard; unauthenticated
   visits chain to /profile's own guard). Route folders are case-exact
   on the filesystem and cannot loop.

8. **Reference drift on the auth surface (documented, no action):** the
   reference REMOVED its signup flow — the login "Need an account? Sign
   up" button no longer navigates and `/signup` renders the 404 view
   (SSR title still "Signup | NEO CRM"). Our functional `/signup`
   stays the documented superset (the dead-exports precedent). Its
   logout also leaves it on `/` as "Hi, Guest" (ours redirects to
   /login — the safer behavior). Also verified-aligned: the picklist
   add flow is DEAD on the reference (button + Enter both no-op, no
   toast) — ours stays the functional superset; keyboard focus order
   through the dashboard matches (our aria-labels are the accessible
   superset); the login footer utility set is identical.

9. **TDD** — 18 red-first checks (12 new page-layout pins:
   SETTINGS_DEFAULTS/SETTINGS_DATA/SETTINGS_DANGER groups + the
   settings CardTitle override-scope refinement + the controlMt fix; 1
   design-tokens re-pin: line-soft #f5f5f5; 4 profile-route checks; 1
   override-scope source assertion) confirmed RED before
   implementation → **262/262 unit** (+18; the profile-route test was
   rewritten mid-flight when the config-redirect approach failed — the
   final 4 checks pin the alias-page shape). +3 e2e (the Defaults
   single-column layout, the Data tab + Danger Zone structure, the
   /Profile alias redirect) → **34/34 e2e** (mobile-nav 7/7).

10. **Verification** — full gate: lint 0/0 · tsc clean · **262/262
    unit** · build clean (via `bun run build`) · **34/34 e2e**. Live
    DOM re-verified on a fresh dev server at 1512 + 390 on every
    touched surface: the Defaults single-column body + 28px
    label-to-control geometry + stock 16px title + 14px/#737373
    subtitle, the Data tab stacks (36px/6px `w-full sm:w-auto` buttons
    + `w-4 h-4` icons), the Danger Zone tinted card + icon title +
    max-w-xs input + stacked destructive button (#fafafa fg), the
    `/Profile` 307 alias, the #f5f5f5 tab tracks; zero 390px overflow
    on all ELEVEN routes (incl. `/Profile`). VLM rounds on the touched
    tabs: two usable rounds returned ALIGNED/SAME; two other rounds
    hallucinated non-existent elements ("General Settings", "Notify
    Owner" — and one literally said "I cannot see the actual images")
    and were DOM-discounted per the standing rule.

11. **Deliverables** — 13 screenshots refreshed under
    `docs/screenshots/` (login logged-out, 9 app routes at 1512×945,
    mobile dashboard + open drawer at 390×844, custom 404); `.env`
    still `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo
    root and `.env.example` matching; docs realigned (README badge 296
    + counts + the settings feature row, AGENTS counts + 6 session-14
    contract blocks + the space-y inline-label hazard + the auth-drift
    note, CLAUDE counts, PAD tree + matrix + session-14 notes, SKILL
    v1.11.0 §16f + the stale color-reference table fixed, this log, the
    plan addendum, both worklogs).

## Next session pointers

- The reference's demo data has been zero for TEN consecutive
  sessions — parity remains structural; re-check on login (it may
  return and change every data-driven surface).
- The reference is a moving target: it removed the SIGNUP flow this
  session (after moving its KPI cards twice). Re-probe previously-
  pinned families before new layers; watch the auth surface.
- Unprobed layers remaining: toast/export behaviors at non-zero data
  (still unverifiable), the reference's `/Profile` link vs our
  functional-superset menu item (its Profile menuitem is a real
  `<a href>`; ours is a div menuitem + router.push — the accessible
  superset, documented), deeper dialog edit flows at non-zero data,
  and dark mode (neither app ships it).
- Standing rule: verify with raw-HTML/computed-style probes; VLM
  claims are hypotheses until DOM-proven (two of this session's four
  VLM rounds hallucinated).
