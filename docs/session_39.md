# Session 23 — The ARIA Tabs Contract + Keyboard Layer (completion log)

> Picked up from the session-22 completion point (pushed at `1d43558` +
> the worklog record `3700ca1` + the operator's `docs/session_38.md`
> transcript commit at `d6b5593`). This file is the completion record for
> **Session 23** (the remediation plan lives at
> `docs/plans/2026-10-01-session23-parity-remediation.md`); the next
> session should treat it as the brief.

## What happened

1. **Workspace refresh** — `git pull` fast-forwarded to `d6b5593` (the
   operator's session-22 transcript, `docs/session_38.md` — the ONLY
   change; zero app-code drift since `1d43558`). The five core docs
   (AGENTS/CLAUDE/README/PAD/SKILL v1.19.0) + session_37 + session_38 +
   the session-22 plan + both worklogs re-read in full; the operating
   instructions re-internalized. Environment intact (`.env` with
   `DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root, dev
   server healthy on :3000, vitest + playwright configs in place).
   **Baseline gate green: lint 0/0 · tsc clean · 391/391 unit.**

2. **The standing priorities re-verified FIRST — all healthy, NO drift.**
   (a) The reference at 390px: still NO navigation (**19th consecutive
   session** — `getClientRects().length` probe). (b) Our drawer's
   7-check regression LIVE **7/7 PASS** — with the backward-wrap probe
   re-sequenced per the s22 focus-race lesson (natural post-open focus
   on Close X, then ONE Shift+Tab → Settings; the first attempt's
   programmatic-focus-then-press landed on BODY exactly as documented).
   (c) Drawer internals clean (844px height, the #2563eb slide panel,
   zero `hidden` attrs). (d) The s18+s19+s20 metadata/header census via
   curl-SSR — plus a direct robots.txt BYTE-DIFF against the reference
   (identical modulo the origin line). (e) The s21 login-card Callout
   spot-probe (the wrong-password banner, zero toasts). (f) The s22
   typography layer: the computed font-family byte-identical on both
   apps, `document.fonts` empty on both, smoothing `auto`, and the
   controlled-span metric EXACTLY equal (509.7/573.5 on this session's
   probe string — pixel convergence re-confirmed). (g) Demo data STILL
   zero (**19th consecutive session**). (h) Zero 390px overflow on all
   eleven routes.

3. **The NEW audit layer — the ARIA role/property census (never swept in
   22 sessions; the s20 tab-order census covered focus order only), plus
   the zero-data interactive-behavior probes it surfaced.** A per-route
   DOM extraction (roles, `aria-*` counts, native semantic counts)
   across all 10 routes on both apps, then targeted probes. Findings,
   all live-verified: **S23-P1 (High)** the reference's tab strips are
   Radix Tabs shipping the FULL contract (trigger `id` +
   `aria-controls` → panel `id`; panel `id` + `aria-labelledby` →
   trigger; ALL N shells mounted with the inactive ones hidden + EMPTY;
   ArrowLeft/Right with WRAP + Home/End + automatic activation) while
   our custom tabs shipped NO wiring, NO keyboard model, one unwired
   panel — and /activities shipped a REDUNDANT EMPTY tabpanel (the
   built-in panel rendered with `{null}` children inside the toolbar)
   plus a hand-rolled unwired content panel. **S23-P2 (Low)** our
   `/login` redirected authenticated users to `/` — an invention; the
   reference serves the card to authed visitors (verified twice: the
   census row + an authed wrong-password attempt rendering the banner).
   **S23-P3 (Med, found mid-remediation)** the reference's activities
   priority card is ONE `p-4 border-b` region (title + tab strip +
   content inside it; the border-b renders BELOW the content at the
   card's bottom) — our s15-era CardContent split drew a separator line
   the reference does not ship, missed its bottom line, and inset the
   rows at p-6 instead of p-4 (found by pixel-scanning both apps'
   screenshots for horizontal ~rgb(229,229,229) lines + DOM-ancestor
   probes). The 500 error-state page: UNPROBEABLE on the reference
   (unknown routes → SPA-fallback 200; garbage API → 404) — documented
   unverifiable, no action. Verified at parity: the combobox layer
   (3/3, 5/5, 2/2, 4/4 per route), the calendar day cells (the
   reference's are clickable DIVs with the `bg-blue-600` selected state
   — our BUTTON cells = the documented s13 superset; "Agenda View" /
   "Upcoming Events" headings match), the login banner `role=alert` on
   BOTH apps, the reference's 2 imgs/page = base44 platform badges
   (deliberately not mirrored), its /login empty `aria-live=polite`
   section = platform announcer chrome.

4. **TDD** — 15 red-first checks in `tests/tabs-aria.test.ts` (14
   failing / 1 structural pass initially; one check strengthened
   mid-red when it passed vacuously on the old source) → **406/406
   unit** (+15, 21 suites) · +1 e2e test (the wiring + shells +
   keyboard contract on all three strips) → **68/68 e2e**
   (mobile-nav 7/7).

5. **Implementation** — `tabs.tsx` rewritten: `useId()` + a
   TabsContext, `id`/`aria-controls` on every trigger, the exported
   `TabsPanel` (the wired shell — stock Radix `TabsContent` focus-ring
   family + per-page `mt-4 space-y-2` / `mt-2 space-y-4` / `mt-2`
   classes, `hidden` when inactive), the keydown handler (arrows with
   wrap + Home/End + focus-follows-selection + preventDefault), and the
   reference's wrapper anatomy (the component root div carries the
   page's Tabs-region classes — `space-y-6` on settings/reports, bare
   on activities — rendering `[tablist, children]`). The three pages
   migrated to one `TabsPanel` per tab with per-tab conditional content
   (`PriorityRows` / `ReportSkeletons` extracted as module-level
   components). The activities CardContent retired (S23-P3); the login
   redirect retired (S23-P2). TWO gate-caught corrections: (a) the
   first architecture rendered the panels as SIBLINGS outside the
   Provider — the context read `null` and every panel id lost its uid
   prefix (caught by the live wiring probe: `wired: 0`); (b) the e2e
   evaluate raced the reports skeleton pass (`loading && !data`
   unmounts the whole Tabs region — the first run read ZERO tabs after
   a passing `toBeVisible`; fixed by waiting for the post-load
   `.recharts-wrapper`). One tsc catch: the keydown handler typed for
   the button but attached to the tablist div.

6. **Verification** — full gate: lint 0/0 · tsc clean · **406/406
   unit** · build · **68/68 e2e**. LIVE on the dev server: the tab
   wiring complete on all three strips (4/4, 5/5, 3/3 wired +
   backWired; inactive shells hidden + EMPTY); the keyboard model
   live-driven (ArrowRight → focus+selection, End → last, ArrowRight →
   wrap to first, Home → first — identical to the reference's
   live-probed behavior); the panel contracts BYTE-IDENTICAL to the
   reference (wrapper `""`/`space-y-6`, the shell class strings, the
   16px/24px/24px gaps — live-measured equal on both apps); the
   activities card's line structure fixed (no mid-card separator, the
   border-b below the content, the 16px content inset — pixel-scanned);
   the authed /login serves the card; **the 390px overflow sweep re-run
   clean on all 11 routes** post-restructure; the standing layers
   spot-checked post-change.

7. **Deliverables** — all 23 screenshots re-captured under
   `docs/screenshots/` with per-shot URL + content verification (zero
   md5 duplicates; shot 23 re-shot with a fresh signup email — the s22
   run's address persisted in the demo DB and tripped "user already
   exists"); `.env`/`.env.example` re-verified (no env surface); docs
   realigned (README badge 474 + the tabs feature row + counts, AGENTS
   counts + the session-23 contract block, CLAUDE counts + the
   tabs-aria suite + the e2e layer, PAD matrix 406/68 + the §5
   tab-contract block + the checklist, SKILL v1.20.0 §16o + frontmatter
   + project_state, this log, the plan addendum, the outer worklog).

## Next session pointers

- The tabs layer joins the standing surfaces — re-run the session-23
  e2e test + the wiring spot-probe (the `wired`/`backWired`/`empty`
  counts) each session; the keyboard model is pinned by the e2e
  arrow-key assertions.
- The ARIA census method is now established (the per-route role/aria
  extraction script at `/home/z/my-project/scripts/aria-census.sh`) —
  but ALWAYS re-login before sweeping and verify each row's
  `location.pathname` inside the probe (the auth-state hazard bit once
  this session).
- The reference's demo data has been zero for NINETEEN consecutive
  sessions — keep re-checking `/Reports` on login (it would unlock the
  edit dialogs, the picklist add flow, the avatar upload, and every
  data-gated surface).
- Unprobed layers remaining: the reference's EDIT dialogs, the
  picklist add flow, toast/export behaviors, the avatar UPLOAD — all
  data-gated on the same anomaly. Beyond those: the loading/suspense
  states, the print stylesheet family (both zero today), URL-state
  behaviors (filters/views in the address bar).
- The s6-era pin lesson: a class-level pin can record the right classes
  with the wrong CONTENT SCOPE — the activities toolbar pin was
  accurate about `p-4 border-b` but never said what renders INSIDE it.
  When a region's arrangement matters, pin the arrangement (children +
  geometry), not just the classes.
