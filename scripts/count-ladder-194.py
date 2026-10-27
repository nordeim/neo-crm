#!/usr/bin/env python3
"""count-ladder-194.py — the session-194 count-ladder flip script.

The house form (assert-first, idempotent, unique-anchor): every site is
asserted to carry EXACTLY ONE of the accepted old forms before the
flip; a site already carrying the new form is a verified no-op; a site
carrying NONE is a hard error (the anchor drifted — re-derive, never
guess).

The full ladder: UNIT 2805 -> 2811 (+6 — the walk67 battery: the 3
RED-first cure pins [D-194a1 the interpolation tail · D-194a3 the glyph
construction + the no-stroke-width negatives + the homeIcon class
order · D-194a4 the metadata-export negatives] + the 3 born-green
freezes [the walk67 decode freeze + the 404 open-interior construction
freeze + the D-194a5 ANON-posture construction freeze], all in
tests/page-layout.test.ts). SUITES 138 HELD · E2E 192 — re-verified
this session (the round's product-code touch: not-found.tsx +
not-found-body.tsx + page-layout.ts +7 lines — the PAD §11 row + the
SKILL §5.6 census site re-anchored 1718 -> 1725 / 277 -> 283 checks in
the same stroke, the s168 line-census doctrine — those two sites are
NOT in this ladder: they were re-anchored at the cure moment, the
same-commit form). badge 2997 -> 3003 (the unit+e2e arithmetic:
2811+192).

The +6 arithmetic verified at the full-suite count (2811 — the
s187/s188/s190/s191 undercount lesson applied: the TRUE count was
confirmed at the full-suite run BEFORE the ladder, no intermediate
forms shipped).

The HEAD surgery (skill-head-194.py) ran FIRST — the SKILL head's live
layer already carries 2811, so this ladder has NO head flip (the s188
lesson: a ladder old-form must NEVER match a retired block's ship
line — the demoted s193 block keeps `project_state: 2805 … the
session-193 layer` in its comment block, and that form is absent from
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
flip("README.md", ["tests-2997%20checks"], "tests-3003%20checks", 1, "README badge")
flip("README.md", ["| 🧪 Tested | 2805 Vitest unit checks"], "| 🧪 Tested | 2811 Vitest unit checks", 1, "README Tested row")
flip("README.md", ["# 138 Vitest suites (2805 checks)"], "# 138 Vitest suites (2811 checks)", 1, "README tree tests line")
flip("README.md", ["# 2805 Vitest unit checks"], "# 2811 Vitest unit checks", 1, "README commands unit line")

# --- AGENTS.md ---------------------------------------------------------------
flip("AGENTS.md", ["Unit tests (2805 checks)"], "Unit tests (2811 checks)", 1, "AGENTS commands unit row")
flip("AGENTS.md", ["`bun run test` (2805) →"], "`bun run test` (2811) →", 1, "AGENTS gate-order unit")

# --- CLAUDE.md ---------------------------------------------------------------
flip("CLAUDE.md", ["`bun run test` (2805) → `bun run build` → `bun run test:e2e` (192)"], "`bun run test` (2811) → `bun run build` → `bun run test:e2e` (192)", 1, "CLAUDE gate-order line")
flip("CLAUDE.md", ["Vitest unit suites (2805 checks)"], "Vitest unit suites (2811 checks)", 1, "CLAUDE commands unit row")
flip("CLAUDE.md", ["**Unit (Vitest, 2805 checks)**"], "**Unit (Vitest, 2811 checks)**", 1, "CLAUDE test pyramid unit")
flip("CLAUDE.md", ["the seam (currently 2805)"], "the seam (currently 2811)", 1, "CLAUDE coverage targets")

# --- Project_Architecture_Document.md ----------------------------------------
flip("Project_Architecture_Document.md", ["# 138 Vitest suites — 2805 checks"], "# 138 Vitest suites — 2811 checks", 1, "PAD tree unit line")
flip("Project_Architecture_Document.md", ["| **Total** | **138** | **2805 unit + 192 e2e** | | |"], "| **Total** | **138** | **2811 unit + 192 e2e** | | |", 1, "PAD §7.1 total row")
flip("Project_Architecture_Document.md", ["HEAD: 138 Vitest suites with 2805 checks + 192 e2e"], "HEAD: 138 Vitest suites with 2811 checks + 192 e2e", 1, "PAD §7.1 HEAD line")
flip("Project_Architecture_Document.md", ["`bun run test` — 2805/2805"], "`bun run test` — 2811/2811", 1, "PAD checklist unit")
flip("Project_Architecture_Document.md", ["| `bun run test` | root | 2805 unit checks |"], "| `bun run test` | root | 2811 unit checks |", 1, "PAD §9 commands unit")

# --- neo-crm_SKILL.md — the count sites (the head project_state is NOT
# here: the head surgery already wrote the 2811 live layer, and the
# demoted s193 block's ship line must never match an old form) --------------
flip("neo-crm_SKILL.md", ["bun run test         # 2805/2805"], "bun run test         # 2811/2811", 1, "SKILL commands unit")
flip("neo-crm_SKILL.md", ["| **unit total** | 138 files | **2805** |"], "| **unit total** | 138 files | **2811** |", 1, "SKILL Appendix B unit total")

print(f"\ncount-ladder-194: {flips} flip(s) — the docs land on 2811/3003")
