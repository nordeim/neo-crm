# Session 20 — The HTTP Response-Header Layer (completion log)

> Picked up from the session-19 completion point (pushed at `f377507` +
> the worklog record `7367765` + the operator's `docs/session_32.md`
> transcript commit at `17e1b02`). This file is the completion record for
> **Session 20** (the 31st/32nd task-book brief — the remediation plan
> lives at `docs/plans/2026-10-01-session20-parity-remediation.md`); the
> next session should treat it as the brief.

## What happened

1. **Workspace refresh** — `git pull` fast-forwarded to `17e1b02` (the
   operator's session-19 transcript, `docs/session_32.md` + a worklog
   line — the ONLY changes; `git diff f377507..17e1b02` on src/tests/
   prisma/public is EMPTY, so every pinned family from s19's live
   verification held by construction). The five core docs (AGENTS/CLAUDE/
   README/PAD/SKILL v1.16.0) + session_31 + session_32 + the session-19
   plan + both worklogs re-read in full; the operating instructions
   (upload/coding_agent_prompt.md) re-internalized. Environment intact
   (`.env` with `DATABASE_URL="file:../db/custom.db"`, `db/` at the repo
   root re-seeded, dev server healthy on :3000, vitest + playwright
   configs in place). **Baseline gate green: lint 0/0 · tsc clean ·
   340/340 unit.**

2. **The standing priorities re-verified FIRST — all healthy, NO drift.**
   (a) The reference at 390px: still NO navigation (**16th consecutive
   session** — no `<aside>`, zero visible links). (b) Our drawer's
   7-check regression LIVE **7/7 PASS** — trigger hit-test 36×36 at
   (16,16); open + 8 links + focus entry + dual scroll locks (body +
   main, BOTH verified); Escape + lock release + focus restore to the
   trigger under a REAL click; focus-trap wrap in BOTH directions
   (panel-first Close X → Shift+Tab → Settings; Settings → Tab → Close
   X); resize-past-md auto-close + lock release + the desktop sidebar
   swap (display:flex); route-change close (drawer link → /leads,
   closed + unlocked + h1 "Leads"). (c) Drawer internals: zero `hidden`
   attributes, `h-dvh` 844 === innerHeight, panel bg rgb(37,99,235),
   overlay blur 2px. **Zero 390px overflow on all eleven routes.** (d)
   The s18+s19 metadata head census re-probed via curl-SSR: description
   405 (408 bytes — the em-dash), the full OG/Twitter family, the icon
   link + apple-touch-icon 180x180, theme-color #000000, the PWA meta
   family, the manifest link + bytes, per-route og/canonical on
   /accounts, robots byte-identical, sitemap 9 locs — NO drift. (e) Demo
   data STILL zero (**16th consecutive session** — Total Leads 0, Open
   Leads 0, Won Deals 0 $0.0K, Saved Reports (0)).
   *Probe-method lesson (§16l.3):* `Element.checkVisibility()` WITHOUT
   options does NOT test the `visibility` property — it false-positived
   the drawer-open probe on the closed panel (the fixed-position panel
   is never display:none). Read `getComputedStyle(el).visibility`.

3. **The audit layers this session — three never-swept candidates:**
   - **The HTTP response-header surface** (the actionable one): the
     reference's edge (Cloudflare/Caddy) injects a three-header security
     set on EVERY response (login, /Dashboard, /Leads, /settings,
     /signup, /Reports, its hashed CSS, /manifest.json after its 302 →
     /api/apps/manifests/… hop, its SPA-fallback 200s): `referrer-policy:
     strict-origin-when-cross-origin`, `x-content-type-options: nosniff`,
     `strict-transport-security: max-age=31536000` (bare). FOUR findings:
     S20-P1 (no Referrer-Policy), S20-P2 (no X-Content-Type-Options),
     S20-P3 (no HSTS), S20-P4 (our sitemap's `application/xml;
     charset=utf-8` vs the reference's bare `application/xml` — robots
     `text/plain; charset=utf-8` and manifest `application/json` already
     matched).
   - **The keyboard tab-order census** (login + dashboard + /leads, both
     apps, 1512×844): **FULL PARITY, no findings** — identical focus
     sequences. The reference ships FIVE unnamed interactive elements on
     its dashboard (two topbar icon buttons, the view-switcher combobox,
     two table-area buttons — WCAG 4.1.2 failures) where ours carries
     aria-labels — the documented accessible-superset pattern. Its
     filter input placeholder IS "Stage: Source" (ours matches; the
     first census read accessible names — false alarm). Its leads-table
     sortable headers (Lead Name/Email/Value, the G-5 pin) are clickable
     divs with the arrow-up-down SVG + onclick + cursor:pointer — ours
     are proper `<th><button>`; the same affordance, the accessible
     expression.
   - **The print-styles sweep**: both apps ship ZERO `@media print`
     rules — **PARITY, no action** (the /Reports "PDF" button is a
     data-gated behavior, not a print stylesheet).

4. **TDD** — 9 red-first checks confirmed RED (the new
   `tests/http-headers.test.ts`: the headers() source pins ×6 + the
   sitemap content-type pin + the robots/manifest regression guards)
   → **349/349 unit** (+9 net, 18 suites). +4 e2e in `crm.spec.ts`
   (the three-route security set /, /login, /accounts; the CSS asset
   set; the bare sitemap content-type; the manifest + robots
   content-type regression) → **60/60 e2e** (mobile-nav 7/7).
   Gate-caught: (a) the first implementation annotated the method
   return as `Promise<NextConfig["headers"]>` — but `NextConfig
   ["headers"]` IS the function type itself, so the annotation produced
   `Promise<() => Header[]>` and failed tsc; fixed by omitting the
   annotation (the test regex re-scoped with it); (b) the first e2e run
   failed at browser LAUNCH with `pthread_create: Resource temporarily
   unavailable` — resource exhaustion from the session's open
   agent-browser contexts, NOT the code; closing them + re-running went
   60/60 clean (the lesson documented in §16l.4).

5. **Implementation** — one `async headers()` field in `next.config.ts`
   (a single `/:path*` block, the three headers at the reference's exact
   values — nothing invented: no includeSubDomains, no preload) + the
   sitemap route handler's content-type dropped its charset suffix.
   Live serializer verification BEFORE the build (curl on the dev
   server, post-config-restart): the three headers present on /, /login,
   /manifest.json, /robots.txt, /sitemap.xml, the CSS asset, and
   /icon.png — with NO content-type conflicts (the flagged
   config-vs-route-handler merge hazard did not materialize); HSTS
   verified inert over plain-HTTP localhost (RFC 6797 §7.1 — the
   browser flows + the full e2e suite stay healthy on http://…).

6. **Verification** — full gate: lint 0/0 · tsc clean · **349/349
   unit** · build via `bun run build` · **60/60 e2e** (the standalone
   server on :3100 — the real parity surface — verified carrying the
   set). Live re-verification after the changes: the drawer
   open/Escape/close cycle + locks + focus restore on the dev server,
   the 390px overflow sweep (all routes exactly 390), the metadata head
   census spot-check (theme-color, manifest link, per-route og:title,
   sitemap locs — all intact).

7. **Deliverables** — all 20 screenshots re-captured under
   `docs/screenshots/` with per-shot URL + content verification (zero
   duplicates, fresh timestamps; the s19 capture script reused + its
   header re-dated); `.env` re-verified (`DATABASE_URL=
   "file:../db/custom.db"`, `db/` at the repo root); `.env.example`
   re-verified (no change needed — the header layer has no env surface);
   docs realigned (README badge 409 + the security-header feature row +
   counts + the session-20 history note, AGENTS counts + the suite-list
   addition + the session-20 contract block, CLAUDE counts + the
   http-headers suite, PAD matrix 349/60 + the §7.2 session-20 pattern
   note + the §7.4 checklist, SKILL v1.17.0 §16l + frontmatter +
   project_state, this log, the plan addendum, both worklogs).

## Next session pointers

- The HTTP response-header layer joins the standing surfaces — re-probe
  with `curl -sI` on the dev server (headers() applies in dev) + the
  four e2e response-header checks each session; HEAD ≠ GET on the
  reference (its HEAD /manifest.json lies — always GET-verify
  content-types).
- The `NextConfig["headers"]`-is-the-function-type hazard is documented
  in SKILL §16l.2 — consult before ANY next.config.ts typing change.
- The reference's demo data has been zero for SIXTEEN consecutive
  sessions — keep re-checking `/Reports` on login for the data-bearing
  instance (it would unlock the edit dialogs, the picklist add flow,
  the avatar upload, and every data-gated surface).
- Unprobed layers remaining: the reference's EDIT dialogs, the picklist
  add flow, toast/export behaviors, the avatar UPLOAD — all data-gated
  on the same anomaly. Beyond those: color-contrast census (WCAG
  1.4.3), ARIA role/property census beyond the tab-order sweep, focus
  visible-ring parity, error-state page (500) parity.
