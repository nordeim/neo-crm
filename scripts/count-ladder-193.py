#!/usr/bin/env python3
"""count-ladder-193.py — the session-193 count-ladder flip script.

The house form (assert-first, idempotent, unique-anchor): every site is
asserted to carry EXACTLY ONE of the accepted old forms before the
flip; a site already carrying the new form is a verified no-op; a site
carrying NONE is a hard error (the anchor drifted — re-derive, never
guess).

The full ladder: UNIT 2801 -> 2805 (+4 — the walk66 battery: the
walk66 decode freeze + the MARKETING open-interior construction freeze
+ the SIDEBAR ring construction freeze in tests/page-layout.test.ts
[the D-193a2 KEPT-SUPERSET pin — the ring-white/50 construction's
first test teeth] + the D-193a1 cure pin in tests/design-tokens.test.ts
[the globals.css base-layer outline-color contract — RED-first:
exactly 1 RED at birth -> the cure -> GREEN]). SUITES 138 HELD ·
E2E 192 — re-verified this session (the round's product-code touch:
globals.css +12 lines — the PAD 1834 row + the SKILL 413 census site
re-anchored 430 -> 442 in the same commit, the s168 line-census
doctrine) · badge 2993 -> 2997 (the unit+e2e arithmetic: 2805+192).

The +4 arithmetic verified at the full-suite count (2805 — the
s187/s188/s190/s191 undercount lesson applied: the TRUE count was
confirmed at the full-suite run BEFORE the ladder, no intermediate
forms shipped).

The HEAD surgery (skill-head-193.py) ran FIRST — the SKILL head's live
layer already carries 2805, so this ladder has NO head flip (the s188
lesson: a ladder old-form must NEVER match a retired block's ship
line — the demoted s192 block keeps `project_state: 2801 … the
session-192 layer` in its comment block, and that form is absent from
the accepted old-forms below by design).
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

flips = 0


def flip(path: str, olds: list[str], new: str, count: int = 1, label: str = "") -> None:
    """Flip a site carrying one of the accepted old forms to the new form."""
    global flips
    p = ROOT / path
    text = p.read_text(encoding="utf8")
    if text.count(new) >= count and sum(text.count(o) for o in olds) == 0:
        print(f"  no-op  [{label or path}] already {new!r}")
        return
    for old in olds:
        found = text.count(old)
        if found == count:
            p.write_text(text.replace(old, new), encoding="utf8")
            flips += 1
            print(f"  flip   [{label or path}] {old!r} -> {new!r} ({count} site(s))")
            return
    raise SystemExit(f"  ERROR  [{label or path}] no accepted old form found (drifted anchor)")


# --- README.md ---------------------------------------------------------------
flip("README.md", ["tests-2993%20checks"], "tests-2997%20checks", 1, "README badge")
flip("README.md", ["| 🧪 Tested | 2801 Vitest unit checks"], "| 🧪 Tested | 2805 Vitest unit checks", 1, "README Tested row")
flip("README.md", ["# 138 Vitest suites (2801 checks)"], "# 138 Vitest suites (2805 checks)", 1, "README tree tests line")
flip("README.md", ["# 2801 Vitest unit checks"], "# 2805 Vitest unit checks", 1, "README commands unit line")

# --- AGENTS.md ---------------------------------------------------------------
flip("AGENTS.md", ["Unit tests (2801 checks)"], "Unit tests (2805 checks)", 1, "AGENTS commands unit row")
flip("AGENTS.md", ["`bun run test` (2801) →"], "`bun run test` (2805) →", 1, "AGENTS gate-order unit")

# --- CLAUDE.md ---------------------------------------------------------------
flip("CLAUDE.md", ["`bun run test` (2801) → `bun run build` → `bun run test:e2e` (192)"], "`bun run test` (2805) → `bun run build` → `bun run test:e2e` (192)", 1, "CLAUDE gate-order line")
flip("CLAUDE.md", ["Vitest unit suites (2801 checks)"], "Vitest unit suites (2805 checks)", 1, "CLAUDE commands unit row")
flip("CLAUDE.md", ["**Unit (Vitest, 2801 checks)**"], "**Unit (Vitest, 2805 checks)**", 1, "CLAUDE test pyramid unit")
flip("CLAUDE.md", ["the seam (currently 2801)"], "the seam (currently 2805)", 1, "CLAUDE coverage targets")

# --- Project_Architecture_Document.md ----------------------------------------
flip("Project_Architecture_Document.md", ["# 138 Vitest suites — 2801 checks"], "# 138 Vitest suites — 2805 checks", 1, "PAD tree unit line")
flip("Project_Architecture_Document.md", ["| **Total** | **138** | **2801 unit + 192 e2e** | | |"], "| **Total** | **138** | **2805 unit + 192 e2e** | | |", 1, "PAD §7.1 total row")
flip("Project_Architecture_Document.md", ["HEAD: 138 Vitest suites with 2801 checks + 192 e2e"], "HEAD: 138 Vitest suites with 2805 checks + 192 e2e", 1, "PAD §7.1 HEAD line")
flip("Project_Architecture_Document.md", ["`bun run test` — 2801/2801"], "`bun run test` — 2805/2805", 1, "PAD checklist unit")
flip("Project_Architecture_Document.md", ["| `bun run test` | root | 2801 unit checks |"], "| `bun run test` | root | 2805 unit checks |", 1, "PAD §9 commands unit")

# --- neo-crm_SKILL.md — the count sites (the head project_state is NOT
# here: the head surgery already wrote the 2805 live layer, and the
# demoted s192 block's ship line must never match an old form) --------------
flip("neo-crm_SKILL.md", ["bun run test         # 2801/2801"], "bun run test         # 2805/2805", 1, "SKILL commands unit")
flip("neo-crm_SKILL.md", ["| **unit total** | 138 files | **2801** |"], "| **unit total** | 138 files | **2805** |", 1, "SKILL Appendix B unit total")

# --- neo-crm_SKILL.md — the §5.6 census collateral ---------------------------
flip(
    "neo-crm_SKILL.md",
    ["`tests/page-layout.test.ts`, 274 checks —"],
    "`tests/page-layout.test.ts`, 277 checks —",
    1,
    "SKILL §5.6 census checks",
)
flip(
    "neo-crm_SKILL.md",
    ["the s192 census: the module's LOGIN_LAYOUT.submit ring swapped by the D-192a3 cure (a string swap, the line count 1718 HELD);"],
    "the s193 census: the module untouched by the walk66 round [the outline-color base-rule cure round — globals.css only, page-layout.ts test-only, the line count 1718 HELD];",
    1,
    "SKILL §5.6 census era",
)
flip(
    "neo-crm_SKILL.md",
    ["the s191 census re-anchored by the 6 walk65 pins)."],
    "the s192 census re-anchored by the 3 walk66 pins).",
    1,
    "SKILL §5.6 census re-anchor",
)
flip(
    "neo-crm_SKILL.md",
    ["**RED-first:** 16 failed | 274 passed (290) at the still-unfixed src"],
    "**RED-first:** 16 failed | 277 passed (293) at the still-unfixed src",
    1,
    "SKILL the s190-era live-tense RED-first arithmetic site",
)

print(f"\ncount-ladder-193: {flips} flip(s) — the docs land on 2805/2997")
