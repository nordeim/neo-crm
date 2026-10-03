# Session-45 Parity Remediation Plan (2026-10-03)

Session 45 on `main` @ `a4430e8` (the session-44 code at `65a315a` + the
operator's `docs/session_82.md` transcript commit — src identical). Baseline
gate on the fresh clone: **lint 0/0 (enforced) · tsc 0 · 1080/1080 unit
(53 suites) · build clean** — the documented state exactly. `.env`
recreated (`DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root,
`db:push` + the idempotent seed — 4 users / 10 accounts / 15 contacts /
24 leads / 23 activities / 12 events, the pristine state); the dev server
healthy on :3000 (`/api/health` → `{"ok":true,"data":{"status":"healthy",
"db":"up"}}`); `agent-browser 0.38.1` ready. The vitest (5.0.1) +
playwright (1.63) configs verified standing (skills/ excluded from
lint/tsc/vitest by the established config trio).

## The audits (two parallel review agents + manual validation of every claim)

### A. The session-44 re-audit (fresh eyes on `65a315a`)

All six session-44 fix families verified GENUINE — P1 the accounts
health pair (constant + POST create-default + PUT branch), P2 the
contacts POST status, P3 the 21-site clear sweep (create-mode identity
re-derived: `asFKId(null)` → null, `asDate(null)` → undefined → null,
`JSON.stringify` keeps null), P4 the reports saveReport guard, P5 the
topbar envelope-reset, P6 the dead include removal. **No regressions**
(the five pin suites re-ran green 256/256; the full unit 1080/1080).
New findings (each manually validated at file:line this session):

- **N-45c (LOW)** — the topbar search still has no AbortController
  (`topbar.tsx:53-89`): the 250 ms debounce only prevents same-window
  timer races; two in-flight fetches can resolve out of order ("ab"
  fires A → "abc" fires B → A resolves last → stale "ab" results
  overwrite B's). The N-44g half that survived s44-P5. Cosmetic,
  self-correcting — but the fix is one controller.
- N-45a (INFO) — `Account.health` remains API-only (no UI writer; the
  reference's dialog ships no health field — the deliberate parity
  scope). A product-decision pointer, not a defect.
- N-45b (INFO) — exactly 3 `|| undefined` payload mappings survive
  repo-wide, all in the CSV import mapper (`contacts-page.tsx:250-252`
  phone/company/position) — create-path only where undefined ≡ absent
  ≡ null. Semantics-identical; consistency-only residue. Documented,
  untouched (the import path posts per-row CREATEs, never PUTs).
- N-45d (INFO) — the accounts POST health parse carries `max: 20`
  while the sibling status/tier parses are bare `{optional:true}`.
  Cosmetic, zero behavioral delta (membership bounds the value).

The mobile-nav + app-shell drawer wiring re-audited CLEAN on all four
dimensions (focus trap with bounded rAF retry, dual scroll-lock with
original-value cleanup, route-change close via the sanctioned
adjust-during-render, `matchMedia("(min-width: 768px)")` auto-close
matching `md:hidden` exactly).

### B. The deferred-findings graduation audit

**ZERO graduations** — all 13 standing-ledger items re-confirmed at
file:line (one mechanical drift: events findMany `:17 → :27`, the
documented s43-P5 guard block). The operator decisions remain open (the
CSV formula-injection posture — scope SHARPENED to include
`entity-export.ts:35`, the client-side quote-wrap family, since
quote-wrapping does NOT neutralize `=/+/-/@` cells; the
source-vocabulary reconciliation — five disagreeing surfaces; the
reset-route role gate). The 11 e2e sleeps re-confirmed at the exact
lines. Fresh-eyes findings (each manually validated this session):

- **F-45a (LOW-MED, the headline)** — the reports PDF button discards
  a genuinely rejectable promise: `reports-page.tsx:206`
  `onClick={() => void exportReportsPdf()}` — `void` swallows the
  rejection surface, `exportReportsPdf` (`pdf-export.ts:66-94`) has no
  internal catch, and html2canvas-pro rejects on huge-canvas/memory
  failures and mid-capture DOM mutations. An unhandled rejection with
  a dead-feeling button and no toast — the only rejectable `void`-async
  in src (the s43-P4/s44-P4 unwrapped-surface family, DOM-capture
  seam). The per-table `exportTablePdf` twins (`:572`, `:614`) are
  synchronous jsPDF text layouts — out of scope (not rejectable).
- **F-45b (LOW)** — the localStorage READ paths are unguarded (s44-P4
  guarded only the WRITE): `saved-reports.ts:160-163`
  `listSavedReports()` reads `window.localStorage.getItem` bare —
  merely touching `window.localStorage` throws SecurityError in
  all-cookies-blocked Chromium — consumed inside the uncaught
  `setTimeout` callback (`reports-page.tsx:68-75`); the leads twin
  (`leads-page.tsx:103-109`) reads
  `window.localStorage.getItem(LEAD_VIEWS_STORAGE_KEY)` inside its own
  uncaught timer (its WRITE at `:121-125` IS guarded — the same
  convention inconsistency F-44b was). Full census: exactly 2 unguarded
  READ sites repo-wide (the 2 writes are both guarded).
- F-45c (INFO) — three dead exports in `format.ts`:
  `formatCompactNumber` (:52-58), `monthName` (:233-235), `monthShort`
  (:237-239) — zero callers in src + tests (grep-verified both).
- F-45d (INFO) — `formatMonthYear` (:84-87) lacks the NaN guard every
  sibling carries (`if (Number.isNaN(date.getTime())) return "—"`) —
  a bad input renders "undefined NaN". Sole caller passes a controlled
  Date today; latent only.
- F-45e (INFO) — the calendar events refetch race
  (`calendar-page.tsx:106-111` + `crm-store.ts:175-179`): no
  AbortController/token, last-RESOLVED-wins — rapid month flips can
  strand the stale month's slice in the store. The same stale-response
  class as N-45c.

## Standing layers (41st session, NO DRIFT)

- The reference bundle md5-IDENTICAL (`a70a637fcf1d4291da8e0d965676dc11`,
  1,631,071 bytes — SIXTEENTH consecutive stable session, fresh-fetched
  from `/assets/index-DZ-xbrIm.js` + byte-compared).
- The reference's mobile-nav absence at a TRUE 390px (8 links in DOM,
  0 visible, no hamburger — 41st session).
- The reference demo data still zero (0 / $0.0k / $0.0k / $0k / 0% / 0).
- Our drawer live in every direction at 390px (open via the REAL
  trigger: 8/8 links truly visible + body AND main `overflow:hidden` +
  `aria-expanded:"true"`; Escape: `inert` + 0 visible + unlocked +
  `aria-expanded:"false"`).
- Zero 390px overflow on all nine routes (scrollWidth 390 ==
  clientWidth 390 everywhere incl. /Profile).
- No Tailwind v4 bug surfaced: the standing token contract re-verified
  (literal-hex `@theme`, the re-pinned `--shadow-sm`/`--blur-sm`, the
  vendored tw-animate.css, `postcss.config.mjs` → `@tailwindcss/postcss`)
  — the mobile drawer's `md:hidden`/`translate-x`/`h-dvh`/`transition-
  [visibility]` classes all compile and behave correctly at 390px.

## The fixes (S45-P1..P5, RED-first)

### S45-P1 — the reports PDF export rejection guard (F-45a)

The s44-P4 convention applied to the last rejectable unwrapped surface:
the button's rejection gets a toast, the happy path is unchanged.

```tsx
// reports-page.tsx:206 — the header PDF button:
<Button
  variant="outline"
  size="sm"
  onClick={() => {
    // Session-45 (S45-P1): html2canvas-pro rejects on huge-canvas /
    // memory failures and mid-capture DOM mutations — the `void` alone
    // left an unhandled rejection + a dead-feeling button. The s44-P4
    // convention: surface it, never strand it.
    void exportReportsPdf().catch(() => {
      toast.error("Could not export PDF", "Please try again.");
    });
  }}
>
```

RED pins: a new `tests/report-pdf-guard.test.ts` (2 — the
`.catch(() =>` wrap on the exportReportsPdf call + the
`toast.error("Could not export PDF"` vocabulary; the
report-save-guard 2-pin-file precedent).

### S45-P2 — the localStorage READ guards (F-45b)

The s44-P4 write-guard family completed on the read side — a blocked
storage falls back to the empty list (the first-paint default), never
an uncaught timer exception:

```ts
// src/lib/saved-reports.ts — listSavedReports:
export function listSavedReports(): SavedReport[] {
  if (typeof window === "undefined") return [];
  try {
    return decodeSavedReports(window.localStorage.getItem(SAVED_REPORTS_STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

// src/app/(app)/leads/leads-page.tsx — the mount-effect read:
const t = setTimeout(() => {
  try {
    const views = decodeSavedLeadViews(window.localStorage.getItem(LEAD_VIEWS_STORAGE_KEY));
    if (views && views.length > 0) setSavedViews((prev) => (prev.length === 0 ? views : prev));
  } catch {
    // Blocked storage (all-cookies-blocked Chromium) — keep the empty
    // list; the write path already toasts.
  }
}, 0);
```

RED pins: a new `tests/storage-read-guards.test.ts` (3 — the
listSavedReports try/catch + `return []`, the leads timer read wrap,
and the census: zero unguarded `localStorage.getItem` reads repo-wide
— both writes stay guarded).

### S45-P3 — the topbar search AbortController (N-45c)

A controller per effect run, aborted in the cleanup — a superseded
fetch hands its state ownership to the newer run instead of
clobbering it:

```tsx
React.useEffect(() => {
  if (timer.current) clearTimeout(timer.current);
  const controller = new AbortController();
  timer.current = setTimeout(async () => {
    if (query.trim().length < 2) { setResults(null); setOpen(false); return; }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
        signal: controller.signal,
      });
      const body = await res.json().catch(() => null);
      if (body?.ok) { setResults(body.data); setOpen(true); }
      else { setResults(null); setOpen(false); }
    } catch {
      // A superseded run hands state to the newer effect — only a
      // REAL failure resets (the s43-P4 reset, unchanged).
      if (controller.signal.aborted) return;
      setResults(null);
      setOpen(false);
    }
  }, 250);
  return () => {
    controller.abort();
    if (timer.current) clearTimeout(timer.current);
  };
}, [query]);
```

RED pins: the session-45 describe in `tests/topbar-search.test.ts`
(3 — the `new AbortController()` per run, the `signal: controller
.signal` on the fetch, the cleanup `controller.abort()` + the aborted
early-return; the s43/s44 pins stay green).

### S45-P4 — the calendar events last-call-wins token (F-45e)

The stale-response twin at the store seam: a monotonically increasing
token; only the newest call's resolution may write the slice.

```ts
// src/stores/crm-store.ts — module scope (after the imports):
let eventsFetchToken = 0;

// fetchEvents:
fetchEvents: async (from, to) => {
  const token = ++eventsFetchToken;
  const qs = from || to ? `?${new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) })}` : "";
  const res = await call<CrmEvent[]>(`/api/events${qs}`);
  if (res.ok && token === eventsFetchToken) set({ events: res.data });
},
```

Sequential flows are unaffected (the token only skips a write when a
NEWER call exists — the hydrate → calendar-effect handoff resolves in
the calendar's favor, the correct owner). RED pins: a new
`tests/store-fetch-guards.test.ts` (2 — the token increment + the
`token === eventsFetchToken` guard on the set; the store source-shape
precedent, loading-layer.test.ts).

### S45-P5 — the format.ts hygiene pair (F-45c + F-45d)

The three dead exports removed (zero callers, grep-verified) and the
NaN guard added to `formatMonthYear` (the sibling convention):

```ts
export function formatMonthYear(d: Date | string | number): string {
  const date = asDate(d);
  if (Number.isNaN(date.getTime())) return "—";
  return `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}
```

RED pins: a new `tests/format-hygiene.test.ts` (3 negative source
pins — no `export function formatCompactNumber` / `monthName` /
`monthShort`) + a behavioral pin in the same file importing
`formatMonthYear` from `@/lib/format`: `formatMonthYear("not-a-date")`
→ `"—"` (the pure-seam precedent, format.test.ts).

## Execution order

All pins RED together (predicted **13**: 2 + 3 + 3 + 2 + 3 — confirm
with the exact count; all 1080 pre-existing checks stay green through
RED) → the implementations (P1 the PDF catch + toast, P2 the two read
guards, P3 the AbortController, P4 the store token, P5 the dead-export
removal + the NaN guard) → target suites GREEN → the full gate (lint ·
tsc · unit · build · e2e 108/108 on a fresh CI=1 boot) → LIVE
verification on the dev server (the PDF happy path still exports a
file; the saved-reports read still populates the count; the topbar
search still returns results; the calendar month flip still refetches;
a rapid month-flip probe confirms the newest month wins; zero probe
residue) → screenshots (02/11/12 re-captured + the session's new
surface: 53-reports-pdf-button — P1's exact fix surface, the reports
filter bar with the Export CSV + PDF buttons) → docs realignment
(README badge + the session-45 paragraph + the suite counts, AGENTS +
the session-45 block, CLAUDE, PAD the s45 row / totals / checklist /
command table, SKILL frontmatter + project_state + the H1 + the new
§16ak, docs/session_83.md, this plan's execution record, both worklogs)
→ commit on main + the SSH-wrapper push.

## Validation checklist (pre-execution)

- [x] All five fix surfaces read at exact file:line this session (the
      PDF button :206 + exportReportsPdf :66-94; listSavedReports
      :160-163 + the reports timer :68-75 + the leads timer :103-109;
      the topbar effect :53-89; fetchEvents crm-store :175-179 + the
      calendar effect :106-111; format.ts :52-58 / :84-87 / :233-239).
- [x] The localStorage access census: exactly 4 sites repo-wide — 2
      writes (both guarded) + 2 reads (both unguarded) — the P2 scope
      is the complete class.
- [x] The dead-export census: zero callers for all three functions in
      src + tests (grep-verified).
- [x] The toast vocabulary convention verified (`toast.error(title,
      description?)` — profile/leads/reports precedent) + the reports
      page already imports toast (:7, used at :309).
- [x] The store token semantics derived: hydrate's fetchEvents() and
      the calendar effect are the only callers; last-call-wins is the
      correct ownership (the calendar's narrower window supersedes
      hydrate's full fetch).
- [x] The e2e census: no e2e asserts on a rejected PDF export, a
      blocked storage read, a superseded search response, or a stale
      calendar fetch — no e2e can trip the new guard semantics; the
      mobile-nav 7-check suite untouched by all five families.
- [x] Zero pin blast radius: no existing pin touches the PDF onClick,
      the listSavedReports read, the leads mount timer, the topbar
      controller (the s43/s44 pins assert shapes that remain), the
      fetchEvents set guard, or the three dead exports (grep-verified
      against the pin suites).
- [x] The reference drift re-sweep completed BEFORE the plan (the
      41st): bundle md5-identical, demo zero, mobile-nav defect stands,
      our drawer verified live in every direction, zero 390px overflow
      on all nine routes — no new parity surface to chase.

## Execution record (filled during execution)

- [x] RED phase — exactly **14 failing pins** before the code (P1: 2 +
      1 happy-path regression guard on the `exportReportsPdf()` call
      staying; P2: 3; P3: 3; P4: 2; P5: 4 [3 negative source pins + 1
      behavioral `formatMonthYear("not-a-date")` → `"—"` pin] — the
      plan's 13 was pin-count arithmetic, the s43/s44 precedent). Full
      suite through RED: **14 failed / 1081 passed** — all 1080
      pre-existing checks stayed green.
- [x] GREEN — all five families implemented exactly as planned (one pin
      retargeted mid-GREEN: it matched the import statement instead of
      the call site). Target suites 18/18.
- [x] Unit gate: **lint 0/0 (enforced) · tsc 0 · 1095/1095 (57 suites,
      +15 tests)**. Build clean.
- [x] E2E: **108/108 on a fresh CI=1 boot** — all 7 mobile-navigation
      checks green; no e2e tripped a guard (the pre-validated census
      held).
- [x] LIVE battery on the dev server: the Saved Reports read populates
      (P2 happy path); the topbar rapid-typing probe — "khalid" →
      exactly the Khalid contact + his 4 leads (the newest query won);
      the calendar rapid month-flip probe — 3 rapid flips → January 2027
      owns the slice (zero chips / zero upcoming; a stale October slice
      would show the 12 seeded events), flip back → October's 11 seeded
      chips restore (sequential flows unaffected, both directions);
      **zero probe residue — 15/24/10/23/12 pristine**.
- [x] Screenshots: 02/11/12 re-captured (within the established
      chart-animation/raster noise of HEAD) + **53-reports-pdf-button
      NEW** (P1's exact fix surface, 1440×900). 02 + 53 VLM-verified
      (02: six KPI cards + sidebar + both charts, no defects; 53: the
      Reports & Analytics filter bar with the Export CSV + PDF buttons).
- [x] Post-restart re-verification (a tool-infrastructure interruption
      after the capture): tree intact, unit gate re-verified green
      (lint 0/0 · tsc 0 · 1095/1095) before the docs phase.
- [x] Docs realignment: README (badge + the session-45 paragraph + the
      suite list), AGENTS (counts + the session-45 block), CLAUDE
      (counts), PAD (the s45 row / 57 suites / totals / checklist /
      command table), SKILL v1.42.0 (frontmatter + project_state + H1 +
      the new §16ak), docs/session_83.md, both worklogs.
- [x] Commit on main + the SSH-wrapper push to
      `git@github.com:nordeim/neo-crm.git` (the operator ed25519,
      shredded after the push — the s43/s44 runbook).
