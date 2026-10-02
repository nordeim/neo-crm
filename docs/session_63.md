# Session 63 Log — the uploads-GET-route recovery + the API robustness layer (session-35)

The workspace refresh: a **FRESH CLONE** of `https://github.com/nordeim/neo-crm.git`
at `f63608e` (the long-lived sandbox was reset; docs/session_62.md = the
operator's session-34 transcript, the latest commit — zero app-code drift).
The full doc set reviewed (SKILL v1.31.0's §16z + project_state,
AGENTS/CLAUDE/README/PAD at the 802+106 counts) and the seams verified in
code before the baseline gate. The environment rebuilt from scratch: `bun
install`, `.env` with `DATABASE_URL="file:../db/custom.db"` + a fresh
`AUTH_SECRET`, `db/` at root via `bun run db:push` + `bun run db:seed`,
the scandihaven reference re-cloned, agent-browser 0.38.1, the reference
bundle cache re-established (md5-verified identical).

Baseline gate on the fresh clone: **lint 0/0 · tsc 0 · 799/802 unit (3
FAILED) · build clean · 106/106 e2e** — the FIRST red baseline since
session-4, and the finding of the session.

**THE CRITICAL FINDING — the uploads GET route was never in git.** The 3
failures: `tests/upload-api.test.ts`'s "the uploads GET route serves the
bytes" block — `src/app/api/uploads/[name]/route.ts` does not exist, not
in HEAD, not in history (`git log --all` for the path is empty). The
session-30 commit `dcf942b` DOCUMENTS the route in its message and the
test file PINS it — but the commit's file list never included it. Root
cause, proven with `git check-ignore -v`: the `.gitignore` pattern
`uploads/` is UNANCHORED (a gitignore segment with no leading/interior
slash matches at ANY depth), so it ignored `src/app/api/uploads/` exactly
like the runtime `<repo>/uploads/`. The route was authored in the
session-30 sandbox but silently never tracked; the long-lived sandbox
carried the untracked file through sessions 31–34 (git pull never deletes
untracked files — their gates stayed green THERE), while the REPOSITORY
shipped broken: 3 red checks + every uploaded photo 404ing behind an e2e
mask (the S30-P2/P3 specs asserted only the `src` attribute; a broken
`<img>` still carries its src).

Standing layers re-verified (31st session) — NO DRIFT: the reference
bundle BYTE-IDENTICAL (`/assets/index-DZ-xbrIm.js`, 1,631,071 bytes, md5
`a70a637fcf1d4291da8e0d965676dc11` — SIX consecutive bundle-stable
sessions); the reference at a TRUE 390px still ships NO navigation (8
links in the DOM, 0 visible, the nav box w=0, no hamburger); our drawer
spot-verified live both directions (open: 8 links + body scroll lock +
focus inside the panel + aria-expanded; Escape: closed + unlocked + the
wrapper's computed visibility:hidden); zero 390px overflow on all nine
routes; the reference demo data still ZERO (31st — the s32 currency
doctrine re-confirmed at $0.0k/$0.0k/$0k); the Tailwind v4 stack audited
healthy (postcss plugin + literal-hex @theme + the s9/s10 shadow+blur
re-pins + the vendored tw-animate.css; body computes #f9fafb); the
production start (`bun run start` from the repo root) verified on the
FRESH clone — health db:"up", login 200, the seeded dashboard — the
session-34 fix holds outside its birth sandbox.

The code audit (two parallel review agents + manual verification)
surfaced beyond the critical: the PUT `[id]` routes assign
accountId/ownerId/contactId with NO existence check (stale dropdown ids →
raw Prisma P2003 500s OUTSIDE the { ok, error } envelope), no try/catch
around any mutating DB call (ERR.INTERNAL never used), the db-path
session-34 launch-dir branch missing the isRelativeFileUrl guard on the
launch value (an absolute production .env would re-anchor into a
corrupted <repo>/prisma/var/… path), the mobile-nav calling its PARENT's
setter during render (React's cross-component warning on back/forward),
and the store's resetData omitting fetchOpportunities + logout leaving
settings populated.

TDD remediation (S35-P1..P7, docs/plans/2026-10-03-session35-parity-remediation.md
— written, validated against the codebase, then executed):

- **S35-P1** the critical fix: `.gitignore` `uploads/` → the ANCHORED
  `/uploads/`; the GET route recreated per the session-30 contract
  (public, `UPLOAD_NAME_RE` before any filesystem lookup, CONTENT_TYPES,
  immutable caching, the envelope 404); `db/.gitkeep` committed (the
  db/-at-root contract exists on fresh clones); the gitignore pin
  RE-ANCHORED with a negative guard. upload-api 11/11.
- **S35-P2** the mask closure: the profile-photo e2e now fetches the
  topbar avatar's src demanding 200 + image/* bytes.
- **S35-P3** RED 1/20 → GREEN 20/20: `isRelativeFileUrl(launchEnvUrl)`
  on the launch-dir branch (absolute .env values are honored as-is).
- **S35-P4** the ownership move: the close-on-route-change
  adjust-during-render now lives in AppShell (own-state — the sanctioned
  React pattern); LIVE-verified including the history.back() close.
- **S35-P5** RED 14/14 → GREEN 14/14 (`tests/api-robustness.test.ts`):
  the FK guards on all four PUT routes + the activities/events POST
  accountId checks + try/catch → ERR.INTERNAL() on all six touched
  routes + the store hygiene. LIVE: a bogus accountId PUT now returns
  the envelope 400 "Selected company does not exist" (was a raw 500).

Phase C gate: **lint 0/0 · tsc 0 · 817/817 unit (+15) · build clean ·
106/106 e2e** + LIVE verification on the dev server: the full photo
round-trip (upload → GET 200 image/png → the form + Account-card imgs →
save → the 500ms reload → the TOPBAR avatar with the same URL, all three
imgs complete with decoded naturalWidth), the seeded dashboard at the
s32 scales ($337.0k/$126.0k/$0k), the drawer both directions, zero 390px
overflow on all nine routes.

Phase D: **4 screenshots** (02-dashboard re-captured + 11/12 the mobile
standing shots + **43** the uploaded-photo-served proof NEW — the fix in
action); `.env`/`.env.example` re-verified (no env surface change; the
root contract DATABASE_URL="file:../db/custom.db" + db/ at root + the
placeholder AUTH_SECRET). Docs realigned: README badge 923 + the
session-35 paragraph, AGENTS 817 + the session-35 block, CLAUDE 817, PAD
the s35 row / 48 suites / 817+106, SKILL **v1.32.0** §16aa + frontmatter
+ project_state, this transcript, the plan's execution record, both
worklogs.

**What happened:** the repository is whole again — the uploads GET route
is tracked, the gitignore can no longer silently ban source paths, the
db/ folder exists on fresh clones, DB failures stay inside the API
envelope with proper FK vocabulary, the db-path seam honors absolute
production .env values, the mobile-nav follows the sanctioned React
own-state pattern, and the e2e can never again mask a 404 image behind a
src attribute. The §16aa census-method lessons: an unanchored gitignore
segment is a repo-wide name ban; a long-lived sandbox can mask repository
rot (only a FRESH CLONE gate proves wholeness); an e2e src-attribute
assertion does not prove an image loads; a unit-suite slice anchor can
swallow the wrong block (anchor on implementation signatures).

**817/817 unit · 106/106 e2e · 4 screenshots** — docs realigned at SKILL
v1.32.0.

**Next steps:** the deferred LOW findings are documented with rationale
(the reset role-gating, the health 503, the list-endpoint caps, the
trusted-proxy limiter, the photoUrl prefix validation, the upload
Content-Length pre-check, the updateLead debounce, the hydrate ordering,
the events PUT invariant); the Scan Card / Import AI extraction stays
base44-only (no action possible); the Opportunity create/edit UI stays
absent on BOTH sides (the read-only entity mirrored); the standing drift
re-sweep continues next live visit (the reference bundle-stable six
consecutive sessions).
