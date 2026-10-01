# Session 19 — The PWA/Installable + Per-Route Metadata Layer (completion log)

> Picked up from the session-18 completion point (pushed at `fe78bd5` +
> the worklog record `153c131` + the operator's `docs/session_30.md`
> transcript commit at `58b82e4`). This file is the completion record for
> **Session 19** (the 29th/30th task-book brief — the remediation plan
> lives at `docs/plans/2026-10-01-session19-parity-remediation.md`); the
> next session should treat it as the brief.

## What happened

1. **Workspace refresh** — `git pull` fast-forwarded to `58b82e4` (the
   operator's session-18 transcript, `docs/session_30.md` — the ONLY
   change; `git diff fe78bd5..58b82e4` on src/tests/prisma/public is
   EMPTY, so every pinned family from s18's live verification held by
   construction). The five core docs (AGENTS/CLAUDE/README/PAD/SKILL
   v1.15.0) + session_29 + session_30 + the session-18 plan + both
   worklogs re-read in full. Environment intact from session 18 (`.env`
   with `DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root,
   dev server healthy on :3000, vitest + playwright configs in place).
   **Baseline gate green: lint 0/0 · tsc clean · 326/326 unit.**

2. **The standing priorities re-verified FIRST — all healthy, NO drift.**
   (a) The reference at 390px: still NO navigation (**15th consecutive
   session** — no `<aside>`, zero visible links). (b) Our drawer's
   7-check regression LIVE **7/7 PASS** — trigger hit-test 36×36 at
   (16,16); open + 8 links + focus entry + dual scroll locks; Escape +
   lock release + focus restore under a REAL click; focus-trap wrap in
   BOTH directions (the trap's boundary is the PANEL — first = the
   panel Close X, last = Settings; a mid-flight probe "failure" was the
   overlay button, which natural keyboard flow never reaches);
   resize-past-md auto-close + both locks released + the desktop
   sidebar swap; route-change close. (c) The drawer internals swept for
   Tailwind v4 hazards: zero `hidden` attributes, `h-dvh` 844 ===
   innerHeight, panel bg rgb(37,99,235) — the exact v3 blue, overlay
   blur 2px. **Zero 390px overflow on all eleven routes.** (d) The s18
   metadata census re-probed: description 405, the OG/Twitter family,
   the icon link, robots.txt byte-identical, sitemap 9 locs — no drift.
   (e) Demo data STILL zero (**15th consecutive session**, 4/4 /Reports
   loads). No app-code drift since fe78bd5 → the icon census +
   mid-width sweeps hold from s18.

3. **The audit layer this session: the PWA/INSTALLABLE + PER-ROUTE
   metadata surface** — never swept in eighteen prior sessions — plus
   the create-dialog input attribute micro-contracts. EIGHT findings,
   all live-verified on both apps (manifest.json + link fetched in
   full; the apple/meta family censused on login + root + inner
   routes; the per-route OG/Twitter + canonical probed on all 10
   reference routes; every create dialog's inputs censused for
   type/required/placeholder/list/accept):
   - **S19-P1 (Med)**: no web app manifest (the reference ships
     `/manifest.json` + `<link rel=manifest>`).
   - **S19-P2 (Low)**: theme-color drift — the reference's is
     **#000000**; ours #2563eb (an s18 "harmless superset" mis-read).
   - **S19-P3 (Med)**: no `mobile-web-app-capable` /
     `apple-mobile-web-app-status-bar-style` /
     `apple-mobile-web-app-title` / `apple-touch-icon` (180×180).
   - **S19-P4 (Med)**: **PER-ROUTE OG/Twitter** — the reference's
     og:title = the page title, og:url = origin+route, og:description =
     `"<Page> on NEO CRM. " + the 405-char paragraph`, twitter:title/
     url/description likewise (root + /login unprefixed); ours shipped
     the root-static family on every page.
   - **S19-P5 (Low-Med)**: no per-route `<link rel=canonical>`.
   - **S19-P6 (Low-Med)**: the CONTACT dialog Phone is `type=tel` on
     the reference, plain text on ours (the LEAD dialog Phone is text
     on BOTH — the reference's own inconsistency, mirrored).
   - **S19-P7 (Low-Med)**: our two invented datalists (Account
     Industry + Contact Company) — the reference ships ZERO.
   - **S19-P8 (Low)**: the avatar file input accepts
     `image/jpeg,image/png,image/jpg`, not `image/*`.
   - Verified-aligned: the login form micro-contract (identical
     placeholders/required/`<form>`; our autoComplete attrs stay the
     documented accessible superset), Lead/Account/Event/Activity
     dialog input types at full parity, the reference's og:image static
     across routes (its inner-page transform params are CDN noise), its
     capitalized routes resolve via real navigation.

4. **TDD** — 14 red-first checks confirmed RED (the new
   `tests/pwa-metadata.test.ts`, dynamic seam imports + guarded reads,
   the s18 pattern) → **340/340 unit** (+14 net, 17 suites). +6 e2e in
   `crm.spec.ts` (the manifest JSON + link, the #000000 theme-color +
   the PWA metas, the resolving apple-touch-icon, the per-route
   /accounts family, the unprefixed root family, the Contact dialog
   tel/datalist/accept census) → **56/56 e2e** (mobile-nav 7/7).
   THREE gate-caught corrections: (a) **`metadata.icons` REPLACES the
   file-convention `link[rel=icon]`** — the first pass declared
   `icons: { apple }` and the s18 favicon e2e failed with zero icon
   links; the fix ships BOTH icons as file conventions
   (`src/app/apple-icon.png`, 180×180, alongside `src/app/icon.png`)
   and the layout declares NO icons field; (b) my new root-canonical
   e2e expected the reference's trailing slash — Next's URL resolution
   strips it (verified: even `${siteUrl()}/` emits the slashless href)
   — the test now pins the slashless form, the nuance documented; (c)
   the New Event dialog test flaked once under parallel load and
   passed cleanly on re-run (no code change). Three source-pin
   regexes were re-scoped after they matched the session's own doc
   comments (the s17 lesson re-applied preemptively).

5. **Implementation** — `src/app/manifest.json/route.ts` (force-static,
   the reference's exact key order, application/json, the same-src
   192+512 icon quirk self-hosted as `/icon.png`); `src/lib/site.ts`
   grew `pageOgDescription()` + `PWA_META` + the
   `pageMetadata({ page, route, title? })` factory (the full per-page
   og/twitter/other sets — page-level metadata REPLACES the layout's
   maps, so the factory re-declares PWA_META + twitter:url per page);
   the 8 inner page wrappers + login + signup consume the factory (the
   dashboard inherits the root layout — its og:url IS the origin
   root); the root layout: `themeColor: "#000000"`, the `manifest`
   field (absolute href — the reference's form), root
   `alternates.canonical`, PWA_META in `other`;
   `src/app/apple-icon.png` (the BrandMark tile at 180×180 — the
   adapted s18 generator); the entity-dialog fixes (ct-phone
   `type="tel"`, both datalists + their orphaned variables removed,
   the avatar accept list). All serializer emissions verified live on
   the dev server BEFORE the build: the manifest link/bytes,
   theme-color, apple-touch-icon (sizes 180x180), per-route
   canonical/og/twitter on all 10 routes, the PWA metas surviving on
   inner pages, the s13 login/signup absolute titles intact.

6. **Verification** — full gate: lint 0/0 · tsc clean · **340/340
   unit** · build via `bun run build` (`/manifest.json` +
   `/apple-icon.png` in the standalone manifest) · **56/56 e2e**.
   Live DOM re-verification: the Contact dialog (tel + accept + zero
   datalists), the final 390px overflow sweep (all eleven routes
   exactly 390).

7. **Deliverables** — all 20 screenshots re-captured under
   `docs/screenshots/` with per-shot URL + content verification (zero
   duplicates, all timestamps fresh); `.env` still
   `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root;
   `.env.example` re-verified and its NEXT_PUBLIC_SITE_URL comment now
   covers the manifest + the per-route family; docs realigned (README
   badge 396 + the PWA feature row + env table + counts, AGENTS counts
   + the session-19 contract block, CLAUDE counts + the pwa-metadata
   suite + e2e list + env table, PAD matrix 340/56 + the §7.2 pattern
   note + §7.4, SKILL v1.16.0 §16k + frontmatter, this log, the plan
   addendum, both worklogs).

## Next session pointers

- The PWA/per-route metadata layer joins the standing surfaces —
  re-probe the head census (now including the manifest link + bytes +
  per-route og/canonical) each session; the curl-SSR probe method
  (§16k.4) catches serializer drift before a build cycle.
- The `metadata.icons`-replaces-file-convention hazard and the
  `other`-map-replacement hazard are now documented in AGENTS §16-era
  contract blocks — consult them before ANY metadata-object change.
- The reference's demo data has been zero for FIFTEEN consecutive
  sessions — keep re-checking `/Reports` on login for the data-bearing
  instance (it would unlock the edit dialogs, the picklist add flow,
  the avatar upload, and every data-gated surface).
- Unprobed layers remaining: the reference's EDIT dialogs, the
  picklist add flow, toast/export behaviors, the avatar UPLOAD — all
  data-gated on the same anomaly. Beyond those: keyboard tab-order
  census, HTTP response-header parity, print styles.
