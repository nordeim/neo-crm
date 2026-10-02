# Session 29 — Parity Remediation Plan (the leads interactive-table layer)

Date: 2026-10-02 · Branch: main · Operator brief: the standing workflow (docs → audit → parity → TDD → deliverables → push).

## Context

The session_49 "Next" pointer (the deferred C2): the leads-table INLINE
editing. Method: the s26/s27 bundle-extraction (the 1.63MB bundle cached at
the sandbox's `scripts/reference-bundle.js`) cross-checked LIVE on the
reference (logged in, 1512 + 390) — this session the popover layer was
live-exercisable, so the Gke contract below is bundle AND live verified.

## The audit (15 findings, bundle + live verified)

### A. The table row (the C2 pointer)

- **A1 — the Name cell** is the orange target box: `flex items-center gap-3` →
  `w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center
  flex-shrink-0` with the `Target` lucide glyph `w-5 h-5 text-orange-600` +
  `<p class="font-medium">{name}</p>`. Ours ships plain text.
- **A2 — Email/Phone/Company cells** carry `text-sm` and the `"-"` single-hyphen
  fallback (`z.email || "-"`). Ours ships `text-muted` + the `"—"` em dash.
- **A3 — Value is an INLINE number input** (`type="number"`, `w-24 h-8
  text-sm`, placeholder `"$0"`, `value: z.value || ""`, `onChange →
  parseFloat(v) || 0` → the IMMEDIATE mutation `M(id, "value", n)`). Ours
  ships a static formatted currency cell.
- **A4 — Status is an INLINE select** (`w-32 h-8` trigger, NO placeholder,
  `value: z.status || "new"`) with EXACTLY five options — new/contacted/
  qualified/won/lost (raw values, capitalized labels) → immediate mutation
  on the lead's stage field. Ours ships the STAGE_META badge. Unmatched
  stages (proposal/negotiation/unqualified — our merged-model artifacts)
  render a BLANK trigger (Radix's unmatched-value behavior — mirrored).
- **A5 — Source is an outline Badge** (`variant="outline" className="text-xs"`)
  carrying the RAW source value, `"-"` when absent. Ours ships plain text.
- **A6 — Next Follow-up is an INLINE date input** (`w-36 h-8 text-sm`) with
  the overdue state: `ee(z.next_follow_up) ? "border-red-500" : ""` + the
  `CircleAlert` glyph `w-4 h-4 text-red-500 flex-shrink-0` beside it.
  `ee = z => z ? new Date(z) < new Date() : false` — any PAST date (today is
  NOT overdue). Ours ships a static formatted date.
- **A7 — the actions menu**: the `EllipsisVertical` trigger (ours:
  MoreHorizontal) + three items — Edit (opens Mke), **"Convert to
  Opportunity" with NO onClick — a DEAD item** (the reference's own quirk,
  the dead-exports precedent), Delete with `className="text-red-600"`. Ours
  ships Edit / New Lead / Delete (destructive).
- **A8 — the row** carries an EXPLICIT `hover:bg-gray-50` (not the table
  kit's `hover:bg-line-soft/50`) and NO cursor-pointer/onClick (unlike the
  contacts/accounts rows).
- **A9 — the thead is STICKY** (`sticky top-0 bg-white z-10`) —
  live-confirmed on the reference at zero data. Ours ships the stock thead.
- **A10 — the sortable headers** wrap label + `ArrowUpDown` (w-4 h-4) in a
  `flex items-center gap-2` container inside a `cursor-pointer` th. Ours
  ships the th>button superset at gap-1 — align the gap to gap-2.
- **A11 — the actions header is `w-12`** (ours w-10).
- **A12 — the empty row**: `colSpan 9 text-center py-8 text-gray-500` "No
  leads found" (verify ours matches).
- **A13 — the "Loading..." row** (`colSpan 9 text-center py-8 text-gray-500`)
  is bundle-verified but TRANSIENT — only visible while the first fetch is
  in flight; the s25 live census (aborted fetch → error state → "No leads
  found") never caught it, and our instant-empty model is pinned by
  `tests/loading-layer.test.ts`. **Documented divergence — no action** (the
  bundle-contains-dead-paths class).

### B. The filters popover (`Gke`) — the s8 "inert Save View" pin DISPROVEN live

- **B1 — the Status select** stores RAW values with an explicit all-item:
  all/new/contacted/qualified/won/lost, placeholder "All Status" (the
  selected value binds "all"). LIVE-confirmed options.
- **B2 — the Source select** stores RAW values: all/call/email/website/
  partner/referral, placeholder "All Sources".
- **B3 — the "(Active)" suffix**: `Filters (Active)` when
  `Object.values(filters).some(v => v && v !== "all")` — LIVE-confirmed
  (select New → the trigger gains the suffix; Clear drops it).
- **B4 — Save View fires the NATIVE `prompt("Enter view name:")`** —
  LIVE-confirmed (agent-browser surfaced the blocking prompt). The s8
  "inert" conclusion was the s26 native-dialog auto-dismiss hazard.
- **B5 — the saved-views SELECT**: after saving, a `w-full sm:w-48` select
  (placeholder "Saved Views") lists the view NAMES; selecting one APPLIES
  the view's filters. LIVE-confirmed. The reference keeps them IN MEMORY
  (useState — no localStorage key, live-verified); our localStorage
  persistence stays the documented superset.
- **B6 — Clear** resets to `{status:"all", source:"all", minValue:"",
  followUpDate:""}` (the reference's state shape uses the "all" sentinel).

### C. The lead SOURCE vocabulary migration (the s28 contact precedent)

- **C1 — `LEAD_SOURCES`** becomes RAW value/label pairs: call→Call,
  email→Email, website→Website, partner→Partner (referral exists in the
  FILTER vocabulary only — creatable through no dialog).
- **C2 — the create dialog** (LeadDialog) stores raw values (the Tke default
  is `source:"email"`; the Mke edit config already stores raw — s28).
- **C3 — the seed's LEAD_SOURCE_MAP maps to RAW values** (the current map
  targets the capitalized labels; the invented vocabulary — Referral/Event/
  Phone/Cold Call/Social Media — maps onto the raw five).
- **C4 — flow-through surfaces ride the raw values automatically**: the
  dashboard's "Follow up with {source}" rows, the reports tab-4 by-source
  charts, the leads CSV export, the s26 raw-dump export, the table badge.
- **C5 — legacy acceptance**: the API's source field stays a free string
  (max 40 — raw passes); the localStorage decodeLeadFilters rejects the old
  capitalized vocabulary → falls back to defaults (the documented stale-
  vocabulary safety).

### D. The mutation seam (supporting)

- **D1 — the store's `updateLead` applies the patch LOCALLY before the
  await** (the reference's React-Query cache updates instantly on inline
  edits — the controlled inputs need the local apply to survive per-keystroke
  mutation). On failure the refetch rolls back to server truth.

## The remediation phases

### Phase 1 — the pure seams (S29-P1)

- `src/lib/lead-filters.ts`: the vocabularies go raw (status
  all/new/contacted/qualified/won/lost; source all/call/email/website/
  partner/referral), `DEFAULT_LEAD_FILTERS` uses the "all" sentinel, the
  `SavedView {name, filters}` type + `applySavedView` + `filtersActive()`
  (the "(Active)" predicate), `isOverdueFollowUp()` (the ee semantics), and
  the saved-views localStorage encode/decode (our persistence superset).
- `src/lib/constants.ts`: `LEAD_SOURCE_OPTIONS` (the value/label pairs),
  `LEAD_INLINE_STATUS_OPTIONS` (the 5 pairs).
- `src/lib/page-layout.ts`: `LEADS_FILTERS_POPOVER` re-scoped (the raw
  option lists, the savedViews select `w-full sm:w-48`).
- **Tests first**: `tests/lead-filters.test.ts` rewritten to the raw
  contract + the new helpers.

### Phase 2 — the row rebuild (S29-P2)

- The Name target box (A1), the text-sm/"-" cells (A2), the inline Value
  input (A3), the inline Status select (A4), the Source badge (A5), the
  inline date + overdue border + CircleAlert (A6), the ⋮ menu with the DEAD
  Convert item (A7), the explicit hover:bg-gray-50 (A8), the sticky thead +
  w-12 + gap-2 sort heads (A9-A11), the empty-row verify (A12).
- The store's optimistic updateLead (D1).
- **Tests first**: `tests/leads-inline.test.ts` (the row source contract +
  the seam helpers).

### Phase 3 — the Gke popover (S29-P3)

- The raw selects with the All Status/All Sources items (B1/B2), the
  "(Active)" suffix (B3), the Save View prompt + the saved-views select
  (B4/B5 — persisted to localStorage as our superset), Clear → the all
  sentinel (B6).
- The filter matching re-scoped: status filters match `stage === value`
  strictly (lost → "lost" only — the dropped/unqualified mapping retired to
  mirror the reference's exact semantics); source matches raw equality.

### Phase 4 — the source migration (S29-P4)

- `LEAD_SOURCES` → `LEAD_SOURCE_OPTIONS` pairs; the LeadDialog create form
  (default "email", raw values); the seed's LEAD_SOURCE_MAP → raw targets;
  db push NOT needed (no schema change) — re-seed only.

### Phase 5 — the gate + e2e (S29-P5)

- The e2e additions (ordered BEFORE the reset-wipe test): the inline
  editing round-trip (value input → the KPI/dashboard update; the status
  select; the date input + the overdue border + alert icon), the "(Active)"
  suffix, the Save View prompt round-trip (page.on("dialog")) + the Saved
  Views select, the dead Convert item, the orange name box + the sticky
  thead.
- The existing leads e2e re-scoped where it pins the old row (the stage
  badge cell, the MoreHorizontal trigger).
- Full gate: lint → tsc → unit (690+) → build → e2e (105+).

### Phase 6 — deliverables

- Screenshots: the 32 established re-captured + shot 33 the leads row
  inline editing (1512) + shot 34 the filters popover with "(Active)" + the
  Saved Views select — each verified open at capture.
- Docs realignment: README (the Leads row + badge), AGENTS (counts + the
  session-29 contract blocks), CLAUDE (counts + the suite — plus the stale
  duplicated account-health-tab entry + "currently 600" fix), PAD matrix,
  SKILL v1.26.0 (§16u + frontmatter + project_state — plus the stale
  project_state head count "525 + 87" and the internal v1.24.0 title),
  `docs/session_51.md`, this plan's addendum, both worklogs.
- Commit + the SSH-wrapper push (main only).

## Validation notes (checked against the codebase)

- Our page already ships the header/Export/New Lead/KPI row/search/popover
  shell at parity (sessions 5-8, re-verified this session) — only the row,
  the popover internals, and the source vocabulary change.
- The Mke edit config (`LEAD_EDIT_FIELDS`) already stores raw status/source
  pairs (s28) — no change.
- The leads API accepts value/source/nextFollowUp/stage on PUT (validated
  free strings + LEAD_STAGES membership — the 5 inline statuses all pass).
- The dashboard's leadSources groups by the raw source (no transformation)
  — the migration flows through automatically.
- The e2e "Follow up with" test is behavioral (no source-name pins) — safe.
- The leads CSV e2e pins the HEADER set only — the raw source VALUES flow.
- The settings `contactSources` picklist (capitalized) is the contacts-side
  list — out of scope, unchanged.
- `tests/page-layout.test.ts` pins `LEADS_FILTERS_POPOVER.statusOptions/
  sourceOptions` (the capitalized lists) — re-scope to the raw contract.
- The seed keeps proposal/negotiation stages (the reports 8-slug pipeline
  buckets depend on them) — those rows render a blank inline-select trigger
  (Radix unmatched-value behavior, the reference's own semantics).

---

## Addendum — the executed session (2026-10-02, post-execution)

Executed as planned with these refinements discovered during TDD:

- **The audit grew two layers beyond the pointer** (both bundle-extracted
  after the row work started): (C6) the **filtered-set doctrine** — the
  reference's H/U useMemos derive the KPIs, the charts, AND the Export
  from the FILTERED list ("Open Leads" = new+contacted+qualified,
  "Dropped" = lost strictly, the avg cycle = the won leads' average AGE,
  the conversion rate = toFixed(1)); the Export button is a CLIENT-SIDE
  blob (the UNQUOTED 8-column header + quoted values + `leads_` prefix —
  `/api/export?type=leads` retired, the route serves type=report only);
  and (C7) the **live-verified Gke machinery** — the "(Active)" suffix,
  the NATIVE prompt-based Save View, and the loadable Saved Views select
  (the s8 "inert" pin was the s26 native-dialog auto-dismiss hazard; the
  reference keeps its views IN MEMORY — no localStorage key, live-probed).
- **The store's updateLead became optimistic** (D1 as planned): the local
  apply BEFORE the await is required for per-keystroke CONTROLLED inputs
  (a stale server refetch would clobber mid-typing); the refetch
  reconciles, failure rolls back.
- **The DropdownItem now closes the popover on click** (`PopoverPrimitive.Close
  asChild`) — discovered when the dead-Convert e2e found our menus don't
  auto-close like the reference's real DropdownMenus (its dead item closes
  the menu too).
- **The "today is overdue" quirk**: the reference's `ee` compares
  `new Date(dateOnly)` (UTC midnight) < now — so a follow-up set for TODAY
  renders the red border for most of the day. Mirrored; the unit pin uses
  the UTC date string (timezone-safe).
- **The filters no longer auto-restore on load** — the reference starts
  every load at the defaults (its views are in-memory); our superset
  persists the views LIST only. The s8 auto-restore behavior retired.
- **Gate-caught**: the orphaned else in the export route after the branch
  retirement (tsc + lint); three test-scope refinements (the header-line
  scoping, the Convert-dead element pin, the report-block anchor); the
  e2e `waitForEvent` pattern HANGS on a synchronous prompt (→ the
  `page.once("dialog")` reset-flow pattern); the popover-closed ordering
  in the final saved-views assertion.
- **Gate**: lint 0/0 · tsc 0 · **697/697 unit (+34: leads-inline 25 new +
  the lead-filters rewrite 18 + the re-scoped constants/csv-contract/
  entity-export pins)** · build clean · **104/104 e2e (+4)**.
- **Live-verified**: the full row contract (the orange box, the inline
  inputs at the exact classes, the raw "call" badge, the sticky thead),
  the KPIs at the reference's semantics (9/4/29.2%/82 days), the inline
  round-trip PERSISTING across reload, the popover loop ((Active) →
  prompt → the Saved Views select → Clear → re-apply), the dashboard's
  "Follow up with {raw}" rows.
- **Deliverables**: 34 screenshots (the 32 established re-captured + 33
  the inline-editing row + 34 the popover with (Active) + Saved Views —
  the agent-browser `:has-text()` hazard: its selector engine is plain
  CSS, so the capture batch was re-driven with eval-based clicks).
- **Docs**: SKILL v1.26.0 (§16u + frontmatter + project_state — the
  stale "525 + 87" head and the internal v1.24.0 title corrected), README
  badge 801 + the Leads row, AGENTS counts + three contract blocks,
  CLAUDE counts + the suite + the duplicated-entry fix, PAD 43 suites /
  697+104 (the four missing s28 rows added — an s28 gap), docs/session_51.md,
  this addendum, both worklogs.
