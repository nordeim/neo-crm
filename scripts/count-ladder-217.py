#!/usr/bin/env python3
"""count-ladder-217.py — the UNIT 2894 -> 2897 + badge 3120 -> 3123
lockstep (E2E 226 HELD · SUITES 138 HELD; +3 — the F-217a/b/c PAD
narrative-block semantic census pins: the three its in
tests/facts-census.test.ts [the §8.1 build-gate correction + the §2
diagram boundary correction + the header-date live-tense] — the first
draft's fourth it [the spec-count live census] was REMOVED at the
mutation battery's M1 catch: the arm already belongs to
docs-counts:1916, the s147 root-cause cure, and a sixth pin on a
five-pinned face breaks the exactly-1 discipline).

The s165 assert-first form (the 204-216 template): every flip asserts
the OLD form is UNIQUE before replacing; a re-run is a verified no-op
(the new form present -> skip). The historical record sites (the AGENTS
Session-216 section, the PAD s216 inventory row, the SKILL's demoted
layers) keep their ship-time counts by doctrine — only the LIVE-tense
sites flip.

Sites (the doc flips + the test-side re-anchors in the same stroke):
  README  badge + Tested row + tree + commands
  AGENTS  commands (unit) + gate-order (unit)
  CLAUDE  gate-order + commands + pyramid + the coverage seam
  PAD     tree + Total + HEAD + checklist + commands (unit)
  SKILL   commands (unit) + Appendix B unit total
  tests/docs-counts.test.ts        the UNIT constant + the layer-axis
                                   pair + the 2894 negatives
  tests/dialog-geometry-parity     the four F-92a3 live positives +
                                   the 2894 negatives (4 assertions join)
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
flip("README.md", "tests-3120%20checks", "tests-3123%20checks", "the badge (2897+226)")
flip("README.md",
     "| 🧪 Tested | 2894 Vitest unit checks + 226 Playwright E2E checks,",
     "| 🧪 Tested | 2897 Vitest unit checks + 226 Playwright E2E checks,",
     "the Tested row")
flip("README.md",
     "# 138 Vitest suites (2894 checks)",
     "# 138 Vitest suites (2897 checks)",
     "the tree")
flip("README.md",
     "# 2894 Vitest unit checks",
     "# 2897 Vitest unit checks",
     "the commands")

# --- AGENTS (the live command/gate sites only — the Session-216 section is
#     the historical record, its ship counts stay) -----------------------------
flip("AGENTS.md",
     "|  Unit tests (2894 checks)      | `bun run test`",
     "|  Unit tests (2897 checks)      | `bun run test`",
     "the commands table (unit)")
flip("AGENTS.md",
     "`bun run test` (2894) → `bun run build` → `bun run smoke`",
     "`bun run test` (2897) → `bun run build` → `bun run smoke`",
     "the gate-order (unit)")

# --- CLAUDE -------------------------------------------------------------------
flip("CLAUDE.md",
     "`bun run test` (2894) → `bun run build` → `bun run test:e2e` (226)",
     "`bun run test` (2897) → `bun run build` → `bun run test:e2e` (226)",
     "the gate-order")
flip("CLAUDE.md",
     "| `bun run test`      | Vitest unit suites (2894 checks)",
     "| `bun run test`      | Vitest unit suites (2897 checks)",
     "the commands table (unit)")
flip("CLAUDE.md",
     "Unit (Vitest, 2894 checks)",
     "Unit (Vitest, 2897 checks)",
     "the pyramid (unit)")
flip("CLAUDE.md",
     "the seam (currently 2894).",
     "the seam (currently 2897).",
     "the coverage seam")

# --- PAD ----------------------------------------------------------------------
flip("Project_Architecture_Document.md",
     "│   ├── *.test.ts                # 138 Vitest suites — 2894 checks",
     "│   ├── *.test.ts                # 138 Vitest suites — 2897 checks",
     "the tree")
flip("Project_Architecture_Document.md",
     "| **Total** | **138** | **2894 unit + 226 e2e** | | |",
     "| **Total** | **138** | **2897 unit + 226 e2e** | | |",
     "the Total row")
flip("Project_Architecture_Document.md",
     "> HEAD: 138 Vitest suites with 2894 checks + 226 e2e checks in 11 spec",
     "> HEAD: 138 Vitest suites with 2897 checks + 226 e2e checks in 11 spec",
     "the HEAD line")
flip("Project_Architecture_Document.md",
     "- [ ] `bun run test` — 2894/2894",
     "- [ ] `bun run test` — 2897/2897",
     "the checklist (unit)")
flip("Project_Architecture_Document.md",
     "| `bun run test` | root | 2894 unit checks |",
     "| `bun run test` | root | 2897 unit checks |",
     "the commands table (unit)")

# --- SKILL (the live command/appendix sites only — the demoted s216 layer
#     keeps its ship counts) ----------------------------------------------------
flip("neo-crm_SKILL.md",
     "bun run test         # 2894/2894",
     "bun run test         # 2897/2897",
     "the commands block (unit)")
flip("neo-crm_SKILL.md",
     "| **unit total** | 138 files | **2894** |",
     "| **unit total** | 138 files | **2897** |",
     "the Appendix B unit total")

# --- tests/docs-counts.test.ts: the constants + the layer-axis -------------
flip("tests/docs-counts.test.ts",
     "const UNIT = 2894;",
     "const UNIT = 2897;",
     "the UNIT constant")
flip("tests/docs-counts.test.ts",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-216 layer`,",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-217 layer`,",
     "the layer-axis first (the head's first layer = s217)")
flip("tests/docs-counts.test.ts",
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s215 layer now beneath the s216 head)"',
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s216 layer now beneath the s217 head)"',
     "the layer-axis second label")
flip("tests/docs-counts.test.ts",
     '"+ beneath it 2886 unit checks + 226 e2e checks green; the session-215 layer (THE TAILWIND-BULLET SEMANTIC-PROSE CENSUS"',
     '"+ beneath it 2894 unit checks + 226 e2e checks green; the session-216 layer (THE INK-BULLET SEMANTIC-PROSE CENSUS"',
     "the layer-axis second content (the s216 layer at its ship 2894/226 — the held-count form)")

# --- tests/docs-counts.test.ts: the 2894 negatives (the retired forms) -----
flip("tests/docs-counts.test.ts",
     """    expect(agents).not.toContain("|  Unit tests (2886 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2886**");
  });""",
     """    expect(agents).not.toContain("|  Unit tests (2886 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2886**");
    // Session-217 (D-217a2): the retired 2894 site-forms join the
    // negatives (the s192 doctrine: the OLD live form joins the negatives)
    expect(readme).not.toMatch(/# 2894 Vitest unit checks/);
    expect(readme).not.toMatch(/# 138 Vitest suites \\(2894 checks\\)/);
    expect(readme).not.toMatch(/\\| 🧪 Tested \\| 2894 Vitest unit checks/);
    expect(pad).not.toMatch(/# 138 Vitest suites — 2894 checks/);
    expect(pad).not.toMatch(/— 2894\\/2894/);
    expect(pad).not.toMatch(/\\| \\*\\*Total\\*\\* \\| \\*\\*138\\*\\* \\| \\*\\*2894 unit/);
    expect(claude).not.toContain("Unit (Vitest, 2894 checks)");
    expect(claude).not.toContain("(currently 2894)");
    expect(claude).not.toContain("Vitest unit suites (2894 checks)");
    expect(claude).not.toContain("`bun run test` (2894)");
    expect(agents).not.toContain("|  Unit tests (2894 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2894**");
  });""",
     "the 2894 negatives block (the s217 join)")

# --- tests/dialog-geometry-parity.test.ts: the F-92a3 ladder -------------------
for old, new, label in [
    ('expect(claude).not.toContain("Unit (Vitest, 2886 checks)"); // session-216: the retired form joins the negatives ladder (the D-216a2 ink/sqlite/store-bullet semantic census pins +8)\n    expect(claude).toContain("Unit (Vitest, 2894 checks)");',
     'expect(claude).not.toContain("Unit (Vitest, 2886 checks)"); // session-216: the retired form joins the negatives ladder (the D-216a2 ink/sqlite/store-bullet semantic census pins +8)\n    expect(claude).not.toContain("Unit (Vitest, 2894 checks)"); // session-217: the retired form joins the negatives ladder (the D-217a2 PAD narrative-block semantic census pins +3)\n    expect(claude).toContain("Unit (Vitest, 2897 checks)");',
     "the F-92a3 pyramid positive"),
    ('expect(claude).not.toContain("(currently 2886)"); // session-216: the retired form joins the negatives ladder (the D-216a2 ink/sqlite/store-bullet semantic census pins +8)\n    expect(claude).toContain("(currently 2894)");',
     'expect(claude).not.toContain("(currently 2886)"); // session-216: the retired form joins the negatives ladder (the D-216a2 ink/sqlite/store-bullet semantic census pins +8)\n    expect(claude).not.toContain("(currently 2894)"); // session-217: the retired form joins the negatives ladder (the D-217a2 PAD narrative-block semantic census pins +3)\n    expect(claude).toContain("(currently 2897)");',
     "the F-92a3 coverage-seam positive"),
    ('expect(claude).not.toContain("Vitest unit suites (2886 checks)"); // session-216: the retired form joins the negatives ladder (the D-216a2 ink/sqlite/store-bullet semantic census pins +8)\n    expect(claude).toContain("Vitest unit suites (2894 checks)");',
     'expect(claude).not.toContain("Vitest unit suites (2886 checks)"); // session-216: the retired form joins the negatives ladder (the D-216a2 ink/sqlite/store-bullet semantic census pins +8)\n    expect(claude).not.toContain("Vitest unit suites (2894 checks)"); // session-217: the retired form joins the negatives ladder (the D-217a2 PAD narrative-block semantic census pins +3)\n    expect(claude).toContain("Vitest unit suites (2897 checks)");',
     "the F-92a3 commands positive"),
    ('expect(claude).not.toContain("`bun run test` (2886)"); // session-216: the retired form joins the negatives ladder (the D-216a2 ink/sqlite/store-bullet semantic census pins +8)\n    expect(claude).toContain("`bun run test` (2894)");',
     'expect(claude).not.toContain("`bun run test` (2886)"); // session-216: the retired form joins the negatives ladder (the D-216a2 ink/sqlite/store-bullet semantic census pins +8)\n    expect(claude).not.toContain("`bun run test` (2894)"); // session-217: the retired form joins the negatives ladder (the D-217a2 PAD narrative-block semantic census pins +3)\n    expect(claude).toContain("`bun run test` (2897)");',
     "the F-92a3 gate-order positive"),
]:
    flip("tests/dialog-geometry-parity.test.ts", old, new, label)

print("count-ladder-217.py done")
