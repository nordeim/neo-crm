# Session 20 Remediation Plan — The HTTP Response-Header Layer (2026-10-01)

**Scope:** Fresh-login live audit of the reference
(`https://neo-crm-8ab2c17c.base44.app/`) against the clone at `17e1b02`
(pulled to the operator's session-19 transcript `docs/session_32.md` — the
ONLY change since `f377507`; `git diff f377507..17e1b02` on src/tests/
prisma/public is EMPTY, so every pinned family from s19's live verification
held by construction). Workspace intact: `.env` with
`DATABASE_URL="file:../db/custom.db"` + `db/` at the repo root (re-seeded),
dev server healthy on :3000, vitest + playwright configs in place.
**Baseline gate green: lint 0/0 · tsc clean · 340/340 unit.**

**Standing layers re-verified FIRST (moving-target rule) — NO drift:**

- **Mobile navigation (the standing priority), three ways**: (a) the
  reference at 390px still ships NO navigation (**16th consecutive
  session** — no `<aside>`, zero visible links); (b) our drawer's 7-check
  regression LIVE **7/7 PASS** — trigger hit-test 36×36 at (16,16); open +
  8 links + focus entry + dual scroll locks (body + main); Escape + lock
  release + focus restore to the trigger under a REAL click; focus-trap
  wrap in BOTH directions (panel-first Close X → Shift+Tab → Settings;
  Settings → Tab → Close X — the trap boundary is the PANEL; the overlay
  button before it is unreachable in natural keyboard flow, the s19
  documented artifact); resize-past-md auto-close + lock release + the
  desktop sidebar swap; route-change close (drawer link → /leads, closed +
  unlocked). (c) Drawer internals swept for Tailwind v4 hazards: zero
  `hidden` attributes, `h-dvh` 844 === innerHeight, panel bg
  rgb(37,99,235) = the exact v3 blue, overlay blur 2px. **Zero 390px
  overflow on all eleven routes** (incl. /Profile + the 404).
  *Probe-method note:* `Element.checkVisibility()` WITHOUT options does NOT
  test the `visibility` property (it only checks display/content-visibility
  — the fixed-position drawer panel is never display:none), so the open/
  closed probe must read `getComputedStyle(el).visibility` — this session's
  census-census lesson, now documented here.
- **The document metadata layer (s18 + s19, standing)**: the full head
  census re-probed on the dev server via curl-SSR — description 405 (408
  bytes: the em-dash is 3 UTF-8 bytes), the full OG/Twitter family, the
  icon link + apple-touch-icon 180x180, theme-color #000000, the PWA meta
  family, the manifest link + bytes, per-route og/canonical on /accounts
  (og:title "Accounts | NEO CRM", og:url + canonical + twitter:url all
  per-route, the "<Page> on NEO CRM. " description prefix), robots.txt
  byte-identical (incl. `User-agent:` capitalization), sitemap 9 locs — NO
  drift.
- **Demo data still zero (16th consecutive session)** — /Reports served
  the empty-state rows (Total Leads 0, Open Leads 0, Won Deals 0 $0.0K,
  Saved Reports (0)). Parity remains structural; the data-gated surfaces
  (edit dialogs, picklist add flow, avatar upload) stay unverifiable.

**The audit layers this session (three never-swept candidates):**

1. **The HTTP response-header surface** — never swept in nineteen prior
   sessions. Census method: `curl -I` / `curl -D -` GET probes on both
   apps (HEAD vs GET matter — the reference's platform answers HEAD /manifest
   .json with 200 text/html but the real GET chain is 302 →
   /api/apps/manifests/… → 200 `application/json`). The reference ships a
   consistent three-header security set on **every** response (HTML routes,
   authed routes, static CSS, manifest, 404/SPA-fallback): `referrer-policy:
   strict-origin-when-cross-origin`, `x-content-type-options: nosniff`,
   `strict-transport-security: max-age=31536000` (HSTS verified on all
   HTML routes + the CSS asset; its platform's per-asset variance is edge
   noise). FOUR findings below.
2. **The keyboard tab-order census** — never swept. Login + authed
   dashboard + /leads on both apps at 1512×844: **FULL PARITY, no
   findings** — identical focus sequences (sidebar 8 links → search →
   topbar icons → account → page controls). The reference ships FIVE
   unnamed interactive elements on the dashboard (two topbar icon buttons,
   the view-switcher combobox, two table-area buttons — WCAG 4.1.2
   failures) where ours carries aria-labels — the documented
   accessible-superset pattern, kept. The reference's filter input
   placeholder IS "Stage: Source" (ours matches exactly; my first census
   read accessible names, not placeholders — false alarm, verified in
   source at topbar.tsx:105). The leads-table sortable headers (Lead
   Name / Email / Value) are at G-5 parity: the reference ships them as
   clickable divs with the arrow-up-down SVG + onclick + cursor:pointer
   (the platform pattern), ours as proper `<th><button>` — the accessible
   expression of the same affordance.
3. **The print-styles sweep** — never swept. Both apps ship ZERO
   `@media print` rules (document.styleSheets census): **PARITY, no
   action.** (The /Reports "PDF" button is a data-gated behavior, not a
   print stylesheet.)

---

## Identified Issues, Bugs and Gaps (all HTTP-verified this session)

| # | Sev | Issue | Evidence (live probes) |
|---|-----|-------|------------------------|
| S20-P1 | **Med** | **No `Referrer-Policy` header.** The reference ships `strict-origin-when-cross-origin` on EVERY response (login, /Dashboard, /Leads, /settings, /signup, /Reports, the CSS asset, manifest.json, the SPA-fallback 200). Ours ships none. | `curl -I` both apps, 8+ reference responses |
| S20-P2 | **Med** | **No `X-Content-Type-Options` header.** The reference ships `nosniff` on every response. Ours ships none. Same class as S20-P1 — both are set once at the platform edge (Cloudflare/Caddy) on the reference; the self-hosted expression is `next.config.ts headers()`. | same census |
| S20-P3 | **Low-Med** | **No `Strict-Transport-Security` header.** The reference ships `max-age=31536000` (no includeSubDomains, no preload) on its HTML routes + the CSS asset. Ours ships none. Per RFC 6797 §7.1 a UA MUST NOT process HSTS over non-secure transport — the header is inert on our http://localhost dev/e2e servers and correct when a self-hosted deployment runs behind HTTPS, which is exactly the reference's topology. Ship the reference's exact value. | same census |
| S20-P4 | **Low** | **sitemap.xml content-type charset drift.** Ours serves `application/xml; charset=utf-8`; the reference serves bare `application/xml` (GET-verified). The s18 "viewport 1 vs 1.0" cosmetic-serialization class — one line in the route handler. (robots.txt `text/plain; charset=utf-8` and manifest `application/json` already match the reference exactly — verified, untouched.) | `curl -D -` both apps |
| — | Info | **Verified-aligned (no action):** the tab-order census (full parity, above); the print-styles sweep (both zero); our login "Need an account? Sign up" is a real `<a href=/signup>` vs their onclick BUTTON — the documented semantic-superset class; our 404 returns HTTP 404 where the reference's SPA catch-all returns 200 for any path — our server-rendered router's correct behavior (the s18 sitemap casing decision class), NOT mirrored. | probes above |

---

## ToDo — execution order (TDD)

### Phase A — red tests first

1. New `tests/http-headers.test.ts` (~10 checks, the s18/s19 dynamic seam
   + guarded source-read pattern):
   - `next.config.ts` source pins: an `async headers()` export exists and
     declares a `source: "/:path*"` block carrying
     `Referrer-Policy: strict-origin-when-cross-origin`,
     `X-Content-Type-Options: nosniff`, and
     `Strict-Transport-Security: max-age=31536000` (the reference's exact
     values, nothing more — no invented includeSubDomains/preload).
   - The config object still carries the standing pins (standalone output,
     outputFileTracingRoot, devIndicators false) — no regression to the
     e2e boot path.
   - `src/app/sitemap.xml/route.ts` source pin: the content-type is
     exactly `"application/xml"` (no charset suffix).
   - The robots/manifest content-types stay pinned at their
     reference-matching values (regression guards).
2. e2e additions (`tests/e2e/crm.spec.ts`, +4-5 checks):
   - `GET /` response: `referrer-policy` === `strict-origin-when-cross-origin`
     AND `x-content-type-options` === `nosniff` (the production standalone
     server on :3100 — the real parity surface).
   - `GET /login` carries the same two headers (route coverage).
   - A static asset (`/_next/static/...css` or any) carries the same two
     headers (the reference sets them on its CSS too).
   - `GET /sitemap.xml` content-type === `application/xml` exactly.
   - `GET /manifest.json` still `application/json` (regression).

### Phase B — implementation

1. `next.config.ts`: add the `headers()` field — one `/:path*` block, the
   three security headers, the reference's exact values. Comment block
   citing the session-20 census (the reference's edge set, self-hosted).
2. `src/app/sitemap.xml/route.ts`: `"application/xml; charset=utf-8"` →
   `"application/xml"` (update the comment: the reference serves the bare
   form — GET-verified this session).

### Phase C — full gate + live re-verification

lint → typecheck → 340+ unit → `bun run build` (NEVER bare `next build`)
→ e2e (56+) → live curl re-verification on the dev server: the three
headers present on `/`, `/login`, `/accounts`, a CSS asset, `/manifest.json`,
`/robots.txt`, `/sitemap.xml`; the sitemap content-type bare; HSTS present
(browsers ignore it over plain-HTTP localhost per RFC 6797 §7.1 — verified
empirically that the dev server + browser flows stay healthy); the drawer
7/7 re-run + zero 390px overflow sweep; the metadata head census spot-check.

**Serializer hazards to verify live (the standing lesson):** Next's
`headers()` merge order vs route-handler-set headers on /sitemap.xml +
/robots.txt + /manifest.json (both sources must survive — the config
headers must not REPLACE the route handler's content-type), and dev-server
vs standalone-build behavior (the e2e hits the production standalone).

### Phase D — deliverables

Screenshots refreshed (the 20 established shots); `.env` / `.env.example`
re-verified; docs realigned (README counts + the security-header row,
AGENTS counts + the session-20 contract block, CLAUDE counts + suite list,
PAD matrix + §7.2/§7.4, SKILL v1.17.0 §16l + frontmatter,
`docs/session_33.md`, this addendum, both worklogs), commit on main +
SSH-wrapper push.

---

## Addendum — execution record (same session)

**Phase A (red tests):** 9 failing checks confirmed RED before any
implementation — `tests/http-headers.test.ts` written with
existence-guarded source reads (the headers() source pins ×6 incl. the
standing-config regression guards, the sitemap content-type pin, the
robots/manifest content-type regression guards) + 4 e2e checks appended
to `tests/e2e/crm.spec.ts`.

**Phase B (implementation):** the `async headers()` field in
`next.config.ts` (one `/:path*` block — Referrer-Policy
strict-origin-when-cross-origin, X-Content-Type-Options nosniff,
Strict-Transport-Security max-age=31536000, the reference's exact
values) + the sitemap route handler's content-type tightened to bare
`application/xml`. ONE gate-caught correction: the first pass annotated
the method's return type as `Promise<NextConfig["headers"]>` — but
`NextConfig["headers"]` IS the function type itself (the annotation
produced `Promise<() => Header[]>` and failed tsc); the annotation was
dropped for inference and the test regex re-scoped.

**Phase C (gate + live re-verification):** lint 0/0 · tsc clean ·
**349/349 unit** (+9 net, 18 suites) · build · **60/60 e2e** (+4;
mobile-nav 7/7). The first e2e run failed at browser LAUNCH
(`pthread_create: Resource temporarily unavailable`) — resource
exhaustion from the session's open agent-browser contexts, not the
code; closing them and re-running went 60/60 clean. Live curl
verification BEFORE the build: the three headers on /, /login,
/manifest.json, /robots.txt, /sitemap.xml, the CSS asset, /icon.png —
no content-type conflicts with the route handlers (the flagged merge
hazard did not materialize); HSTS verified inert over plain-HTTP
localhost (browser flows + the full suite healthy). Post-change live
re-verification: the drawer open/Escape/close cycle + dual locks +
focus restore, the 390px overflow sweep (all eleven routes exactly
390), the metadata head census spot-check — all intact.

**Phase D (deliverables):** all 20 screenshots re-captured with
per-shot URL + content verification (zero duplicates, fresh
timestamps; the s19 capture script reused); `.env` / `.env.example`
re-verified (no change needed — the header layer has no env surface);
docs realigned (README badge 409 + the security-header feature row +
counts + the history note, AGENTS counts + the suite-list addition +
the session-20 contract block, CLAUDE counts + the http-headers suite,
PAD matrix 349/60 + the §7.2 session-20 pattern note + the §7.4
checklist, SKILL v1.17.0 §16l + frontmatter + project_state,
`docs/session_33.md`, this addendum, both worklogs). Committed on
main + SSH-wrapper push.
