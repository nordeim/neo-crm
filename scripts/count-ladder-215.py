#!/usr/bin/env python3
"""count-ladder-215.py — the UNIT 2878 -> 2886 + badge 3104 -> 3112
lockstep (E2E 226 HELD · SUITES 138 HELD; +8 — the F-215a
tailwind-bullet semantic census pins: the eight AGENTS "Architecture
facts" Tailwind-v4-bullet its in tests/facts-census.test.ts [the
CSS-first census + the postcss guard + the shadow/blur re-pins + the
space-y flip family + the outline-none doctrine + the cursor rule +
the tw-animate vendoring]).

The s165 assert-first form (the 204-214 template): every flip asserts
the OLD form is UNIQUE before replacing; a re-run is a verified no-op
(the new form present -> skip). The historical record sites (the AGENTS
Session-214 section, the PAD s214 inventory row, the SKILL's demoted
layers) keep their ship-time counts by doctrine — only the LIVE-tense
sites flip.

Sites (the doc flips + the test-side re-anchors in the same stroke):
  README  badge + Tested row + tree + commands
  AGENTS  commands (unit) + gate-order (unit)
  CLAUDE  gate-order + commands + pyramid + the coverage seam
  PAD     tree + Total + HEAD + checklist + commands (unit)
  SKILL   commands (unit) + Appendix B unit total
  tests/docs-counts.test.ts        the UNIT constant + the layer-axis
                                   pair + the 2878 negatives
  tests/dialog-geometry-parity     the four F-92a3 live positives +
                                   the 2878 negatives (4 assertions join)
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def flip(path: str, old: str, new: str, label: str) -> None:
    p = ROOT / path
    t = p.read_text(encoding="utf8")
    if new in t and old not in t:
        print(f"  no-op  [{path}] {label}")
        return
    n = t.count(old)
    assert n == 1, f"[{path}] {label}: the old form found {n} times (expected 1)"
    p.write_text(t.replace(old, new, 1), encoding="utf8")
    print(f"  flip   [{path}] {label}")


# --- README ------------------------------------------------------------------
flip("README.md", "tests-3104%20checks", "tests-3112%20checks", "the badge (2886+226)")
flip("README.md",
     "| 🧪 Tested | 2878 Vitest unit checks + 226 Playwright E2E checks,",
     "| 🧪 Tested | 2886 Vitest unit checks + 226 Playwright E2E checks,",
     "the Tested row")
flip("README.md",
     "# 138 Vitest suites (2878 checks)",
     "# 138 Vitest suites (2886 checks)",
     "the tree")
flip("README.md",
     "# 2878 Vitest unit checks",
     "# 2886 Vitest unit checks",
     "the commands")

# --- AGENTS (the live command/gate sites only — the Session-214 section is
#     the historical record, its ship counts stay) -----------------------------
flip("AGENTS.md",
     "|  Unit tests (2878 checks)      | `bun run test`",
     "|  Unit tests (2886 checks)      | `bun run test`",
     "the commands table (unit)")
flip("AGENTS.md",
     "`bun run test` (2878) → `bun run build` → `bun run smoke`",
     "`bun run test` (2886) → `bun run build` → `bun run smoke`",
     "the gate-order (unit)")

# --- CLAUDE -------------------------------------------------------------------
flip("CLAUDE.md",
     "`bun run test` (2878) → `bun run build` → `bun run test:e2e` (226)",
     "`bun run test` (2886) → `bun run build` → `bun run test:e2e` (226)",
     "the gate-order")
flip("CLAUDE.md",
     "| `bun run test`      | Vitest unit suites (2878 checks)",
     "| `bun run test`      | Vitest unit suites (2886 checks)",
     "the commands table (unit)")
flip("CLAUDE.md",
     "Unit (Vitest, 2878 checks)",
     "Unit (Vitest, 2886 checks)",
     "the pyramid (unit)")
flip("CLAUDE.md",
     "the seam (currently 2878).",
     "the seam (currently 2886).",
     "the coverage seam")

# --- PAD ----------------------------------------------------------------------
flip("Project_Architecture_Document.md",
     "│   ├── *.test.ts                # 138 Vitest suites — 2878 checks",
     "│   ├── *.test.ts                # 138 Vitest suites — 2886 checks",
     "the tree")
flip("Project_Architecture_Document.md",
     "| **Total** | **138** | **2878 unit + 226 e2e** | | |",
     "| **Total** | **138** | **2886 unit + 226 e2e** | | |",
     "the Total row")
flip("Project_Architecture_Document.md",
     "> HEAD: 138 Vitest suites with 2878 checks + 226 e2e checks in 11 spec",
     "> HEAD: 138 Vitest suites with 2886 checks + 226 e2e checks in 11 spec",
     "the HEAD line")
flip("Project_Architecture_Document.md",
     "- [ ] `bun run test` — 2878/2878",
     "- [ ] `bun run test` — 2886/2886",
     "the checklist (unit)")
flip("Project_Architecture_Document.md",
     "| `bun run test` | root | 2878 unit checks |",
     "| `bun run test` | root | 2886 unit checks |",
     "the commands table (unit)")

# --- SKILL (the live command/appendix sites only — the demoted s214 layer
#     keeps its ship counts) ----------------------------------------------------
flip("neo-crm_SKILL.md",
     "bun run test         # 2878/2878",
     "bun run test         # 2886/2886",
     "the commands block (unit)")
flip("neo-crm_SKILL.md",
     "| **unit total** | 138 files | **2878** |",
     "| **unit total** | 138 files | **2886** |",
     "the Appendix B unit total")

# --- tests/docs-counts.test.ts: the constants + the layer-axis -------------
flip("tests/docs-counts.test.ts",
     "const UNIT = 2878;",
     "const UNIT = 2886;",
     "the UNIT constant")
flip("tests/docs-counts.test.ts",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-214 layer`,",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-215 layer`,",
     "the layer-axis first (the head's first layer = s215)")
flip("tests/docs-counts.test.ts",
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s213 layer now beneath the s214 head)",',
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s214 layer now beneath the s215 head)",',
     "the layer-axis second label")
flip("tests/docs-counts.test.ts",
     '"+ beneath it 2873 unit checks + 226 e2e checks green; the session-213 layer (THE SEMANTIC-PROSE LAYOUT-CONTRACT CENSUS"',
     '"+ beneath it 2878 unit checks + 226 e2e checks green; the session-214 layer (THE AUTH-BULLET SEMANTIC-PROSE CENSUS"',
     "the layer-axis second content (the s214 layer at its ship 2878/226 — the held-count form)")

# --- tests/docs-counts.test.ts: the 2878 negatives (the retired forms) -----
flip("tests/docs-counts.test.ts",
     """    expect(agents).not.toContain("|  Unit tests (2873 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2873**");
  });""",
     """    expect(agents).not.toContain("|  Unit tests (2873 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2873**");
    // Session-215 (D-215a1): the retired 2878 site-forms join the
    // negatives (the s192 doctrine: the OLD live form joins the negatives)
    expect(readme).not.toMatch(/# 2878 Vitest unit checks/);
    expect(readme).not.toMatch(/# 138 Vitest suites \\(2878 checks\\)/);
    expect(readme).not.toMatch(/\\| 🧪 Tested \\| 2878 Vitest unit checks/);
    expect(pad).not.toMatch(/# 138 Vitest suites — 2878 checks/);
    expect(pad).not.toMatch(/— 2878\\/2878/);
    expect(pad).not.toMatch(/\\| \\*\\*Total\\*\\* \\| \\*\\*138\\*\\* \\| \\*\\*2878 unit/);
    expect(claude).not.toContain("Unit (Vitest, 2878 checks)");
    expect(claude).not.toContain("(currently 2878)");
    expect(claude).not.toContain("Vitest unit suites (2878 checks)");
    expect(claude).not.toContain("`bun run test` (2878)");
    expect(agents).not.toContain("|  Unit tests (2878 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2878**");
  });""",
     "the 2878 negatives block (the s215 join)")

# --- tests/dialog-geometry-parity.test.ts: the F-92a3 ladder -------------------
for old, new, label in [
    ('expect(claude).not.toContain("Unit (Vitest, 2873 checks)"); // session-214: the retired form joins the negatives ladder (the D-214a1 auth-bullet semantic census pins +5)\n    expect(claude).toContain("Unit (Vitest, 2878 checks)");',
     'expect(claude).not.toContain("Unit (Vitest, 2873 checks)"); // session-214: the retired form joins the negatives ladder (the D-214a1 auth-bullet semantic census pins +5)\n    expect(claude).not.toContain("Unit (Vitest, 2878 checks)"); // session-215: the retired form joins the negatives ladder (the D-215a1 tailwind-bullet semantic census pins +8)\n    expect(claude).toContain("Unit (Vitest, 2886 checks)");',
     "the F-92a3 pyramid positive"),
    ('expect(claude).not.toContain("(currently 2873)"); // session-214: the retired form joins the negatives ladder (the D-214a1 auth-bullet semantic census pins +5)\n    expect(claude).toContain("(currently 2878)");',
     'expect(claude).not.toContain("(currently 2873)"); // session-214: the retired form joins the negatives ladder (the D-214a1 auth-bullet semantic census pins +5)\n    expect(claude).not.toContain("(currently 2878)"); // session-215: the retired form joins the negatives ladder (the D-215a1 tailwind-bullet semantic census pins +8)\n    expect(claude).toContain("(currently 2886)");',
     "the F-92a3 coverage-seam positive"),
    ('expect(claude).not.toContain("Vitest unit suites (2873 checks)"); // session-214: the retired form joins the negatives ladder (the D-214a1 auth-bullet semantic census pins +5)\n    expect(claude).toContain("Vitest unit suites (2878 checks)");',
     'expect(claude).not.toContain("Vitest unit suites (2873 checks)"); // session-214: the retired form joins the negatives ladder (the D-214a1 auth-bullet semantic census pins +5)\n    expect(claude).not.toContain("Vitest unit suites (2878 checks)"); // session-215: the retired form joins the negatives ladder (the D-215a1 tailwind-bullet semantic census pins +8)\n    expect(claude).toContain("Vitest unit suites (2886 checks)");',
     "the F-92a3 commands positive"),
    ('expect(claude).not.toContain("`bun run test` (2873)"); // session-214: the retired form joins the negatives ladder (the D-214a1 auth-bullet semantic census pins +5)\n    expect(claude).toContain("`bun run test` (2878)");',
     'expect(claude).not.toContain("`bun run test` (2873)"); // session-214: the retired form joins the negatives ladder (the D-214a1 auth-bullet semantic census pins +5)\n    expect(claude).not.toContain("`bun run test` (2878)"); // session-215: the retired form joins the negatives ladder (the D-215a1 tailwind-bullet semantic census pins +8)\n    expect(claude).toContain("`bun run test` (2886)");',
     "the F-92a3 gate-order positive"),
]:
    flip("tests/dialog-geometry-parity.test.ts", old, new, label)

print("count-ladder-215.py done")
