#!/usr/bin/env python3
"""count-ladder-197.py — the session-197 count-ladder flip script.

The house form (assert-first, idempotent, unique-anchor): every site is
asserted to carry EXACTLY ONE of the accepted old forms before the
flip; a site already carrying the new form is a verified no-op; a site
carrying NONE is a hard error (the anchor drifted — re-derive, never
guess).

The full ladder: UNIT 2811 -> 2813 (+2 — the D-197a1 sweep-tool
registration pins: the waitFor override pin + the not-found baselines
pin). SUITES 138 HELD · E2E 195 HELD. badge 3006 -> 3008 (the
unit+e2e arithmetic: 2813+195).

The HEAD surgery (skill-head-197.py) ran FIRST — the SKILL head's live
layer already carries 2813/195, so this ladder has NO head flip (the
s188 lesson: a ladder old-form must NEVER match a retired block's ship
line — the demoted s196 block keeps `2811 unit checks + 195 e2e checks
… the session-196 layer` in its comment block, and that form is absent
from the accepted old-forms below by design).

The test-side re-anchors (the docs-counts layer-axis pair: first =
s197, second = s196 at its ship 2811/195 · the unit negatives ladder:
the retired 2811 site-forms join the negatives) are edited separately
from this ladder.
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


# --- tests/docs-counts.test.ts — the UNIT constant ----------------------------
flip(
    "tests/docs-counts.test.ts",
    ["const UNIT = 2811;"],
    "const UNIT = 2813;",
    1,
    "docs-counts UNIT constant",
)

# --- README.md ---------------------------------------------------------------
flip("README.md", ["tests-3006%20checks"], "tests-3008%20checks", 1, "README badge")
flip(
    "README.md",
    ["| 🧪 Tested | 2811 Vitest unit checks + 195 Playwright E2E checks"],
    "| 🧪 Tested | 2813 Vitest unit checks + 195 Playwright E2E checks",
    1,
    "README Tested row count",
)
flip("README.md", ["# 138 Vitest suites (2811 checks)"], "# 138 Vitest suites (2813 checks)", 1, "README tree tests line")
flip(
    "README.md",
    ["bun run test          # 2811 Vitest unit checks (nav-config,"],
    "bun run test          # 2813 Vitest unit checks (nav-config,",
    1,
    "README commands unit line",
)

# --- AGENTS.md ---------------------------------------------------------------
flip("AGENTS.md", ["|  Unit tests (2811 checks)      |"], "|  Unit tests (2813 checks)      |", 1, "AGENTS commands unit row")
flip(
    "AGENTS.md",
    ["`bun run test` (2811) → `bun run build` → `bun run smoke` (the standalone"],
    "`bun run test` (2813) → `bun run build` → `bun run smoke` (the standalone",
    1,
    "AGENTS gate-order unit",
)

# --- CLAUDE.md ---------------------------------------------------------------
flip(
    "CLAUDE.md",
    ["`bun run test` (2811) → `bun run build` → `bun run test:e2e` (195)"],
    "`bun run test` (2813) → `bun run build` → `bun run test:e2e` (195)",
    1,
    "CLAUDE gate-order line",
)
flip(
    "CLAUDE.md",
    ["| `bun run test`      | Vitest unit suites (2811 checks)            |"],
    "| `bun run test`      | Vitest unit suites (2813 checks)            |",
    1,
    "CLAUDE commands unit row",
)
flip("CLAUDE.md", ["**Unit (Vitest, 2811 checks)**"], "**Unit (Vitest, 2813 checks)**", 1, "CLAUDE test pyramid unit")
flip("CLAUDE.md", ["the seam (currently 2811)."], "the seam (currently 2813).", 1, "CLAUDE coverage targets")

# --- Project_Architecture_Document.md -----------------------------------------
flip(
    "Project_Architecture_Document.md",
    ["# 138 Vitest suites — 2811 checks"],
    "# 138 Vitest suites — 2813 checks",
    1,
    "PAD tree unit line",
)
flip(
    "Project_Architecture_Document.md",
    ["| **Total** | **138** | **2811 unit + 195 e2e** | | |"],
    "| **Total** | **138** | **2813 unit + 195 e2e** | | |",
    1,
    "PAD §7.1 total row",
)
flip(
    "Project_Architecture_Document.md",
    ["HEAD: 138 Vitest suites with 2811 checks + 195 e2e checks in 11 spec"],
    "HEAD: 138 Vitest suites with 2813 checks + 195 e2e checks in 11 spec",
    1,
    "PAD §7.1 HEAD line",
)
flip(
    "Project_Architecture_Document.md",
    ["- [ ] `bun run test` — 2811/2811"],
    "- [ ] `bun run test` — 2813/2813",
    1,
    "PAD checklist unit",
)
flip(
    "Project_Architecture_Document.md",
    ["| `bun run test` | root | 2811 unit checks |"],
    "| `bun run test` | root | 2813 unit checks |",
    1,
    "PAD §9 commands unit",
)

# --- neo-crm_SKILL.md ----------------------------------------------------------
# no head flip here: the head surgery already wrote the 2813 live layer, and
# the demoted s196 block keeps its ship counts under the unit gate.
flip(
    "neo-crm_SKILL.md",
    ["bun run test         # 2811/2811"],
    "bun run test         # 2813/2813",
    1,
    "SKILL commands unit",
)
flip(
    "neo-crm_SKILL.md",
    ["| **unit total** | 138 files | **2811** |"],
    "| **unit total** | 138 files | **2813** |",
    1,
    "SKILL Appendix B unit total",
)

print(f"\ncount-ladder-197: {flips} flip(s) — the docs land on 2813/3008")
