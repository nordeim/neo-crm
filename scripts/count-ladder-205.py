#!/usr/bin/env python3
"""count-ladder-205.py — the UNIT 2845 -> 2849 + badge 3071 -> 3075
lockstep (E2E 226 HELD · SUITES 138 HELD; +4 — the two D-205a1
env-knob its + the two D-205a2 totality-census its in
tests/facts-census.test.ts).

The s165 assert-first form (the 204 template): every flip asserts the
OLD form is UNIQUE before replacing; a re-run is a verified no-op (the
new form present -> skip). The historical record sites (the AGENTS
Session-204 section, the PAD s204 inventory row, the SKILL's demoted
layers) keep their ship-time counts by doctrine — only the LIVE-tense
sites flip.

Sites (the doc flips + the test-side re-anchors in the same stroke):
  README  badge + Tested row + tree + commands
  AGENTS  commands (unit) + gate-order (unit)
  CLAUDE  gate-order + commands + pyramid + the coverage seam
  PAD     tree + Total + HEAD + checklist + commands (unit)
  SKILL   commands (unit) + Appendix B unit total
  tests/docs-counts.test.ts        the UNIT constant + the layer-axis
                                   pair + the 2845 negatives
  tests/dialog-geometry-parity     the four F-92a3 live positives +
                                   the 2845 negatives (4 assertions join)
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
flip("README.md", "tests-3071%20checks", "tests-3075%20checks", "the badge (2849+226)")
flip("README.md",
     "| 🧪 Tested | 2845 Vitest unit checks + 226 Playwright E2E checks,",
     "| 🧪 Tested | 2849 Vitest unit checks + 226 Playwright E2E checks,",
     "the Tested row")
flip("README.md",
     "# 138 Vitest suites (2845 checks)",
     "# 138 Vitest suites (2849 checks)",
     "the tree")
flip("README.md",
     "# 2845 Vitest unit checks",
     "# 2849 Vitest unit checks",
     "the commands")

# --- AGENTS (the live command/gate sites only — the Session-204 section is
#     the historical record, its ship counts stay) -----------------------------
flip("AGENTS.md",
     "|  Unit tests (2845 checks)      | `bun run test`",
     "|  Unit tests (2849 checks)      | `bun run test`",
     "the commands table (unit)")
flip("AGENTS.md",
     "`bun run test` (2845) → `bun run build` → `bun run smoke`",
     "`bun run test` (2849) → `bun run build` → `bun run smoke`",
     "the gate-order (unit)")

# --- CLAUDE -------------------------------------------------------------------
flip("CLAUDE.md",
     "`bun run test` (2845) → `bun run build` → `bun run test:e2e` (226)",
     "`bun run test` (2849) → `bun run build` → `bun run test:e2e` (226)",
     "the gate-order")
flip("CLAUDE.md",
     "| `bun run test`      | Vitest unit suites (2845 checks)",
     "| `bun run test`      | Vitest unit suites (2849 checks)",
     "the commands table (unit)")
flip("CLAUDE.md",
     "Unit (Vitest, 2845 checks)",
     "Unit (Vitest, 2849 checks)",
     "the pyramid (unit)")
flip("CLAUDE.md",
     "the seam (currently 2845).",
     "the seam (currently 2849).",
     "the coverage seam")

# --- PAD ----------------------------------------------------------------------
flip("Project_Architecture_Document.md",
     "│   ├── *.test.ts                # 138 Vitest suites — 2845 checks",
     "│   ├── *.test.ts                # 138 Vitest suites — 2849 checks",
     "the tree")
flip("Project_Architecture_Document.md",
     "| **Total** | **138** | **2845 unit + 226 e2e** | | |",
     "| **Total** | **138** | **2849 unit + 226 e2e** | | |",
     "the Total row")
flip("Project_Architecture_Document.md",
     "> HEAD: 138 Vitest suites with 2845 checks + 226 e2e checks in 11 spec",
     "> HEAD: 138 Vitest suites with 2849 checks + 226 e2e checks in 11 spec",
     "the HEAD line")
flip("Project_Architecture_Document.md",
     "- [ ] `bun run test` — 2845/2845",
     "- [ ] `bun run test` — 2849/2849",
     "the checklist (unit)")
flip("Project_Architecture_Document.md",
     "| `bun run test` | root | 2845 unit checks |",
     "| `bun run test` | root | 2849 unit checks |",
     "the commands table (unit)")

# --- SKILL (the live command/appendix sites only — the demoted s204 layer
#     keeps its ship counts) ----------------------------------------------------
flip("neo-crm_SKILL.md",
     "bun run test         # 2845/2845",
     "bun run test         # 2849/2849",
     "the commands block (unit)")
flip("neo-crm_SKILL.md",
     "| **unit total** | 138 files | **2845** |",
     "| **unit total** | 138 files | **2849** |",
     "the Appendix B unit total")

# --- tests/docs-counts.test.ts: the constants + the layer-axis -------------
flip("tests/docs-counts.test.ts",
     "const UNIT = 2845;",
     "const UNIT = 2849;",
     "the UNIT constant")
flip("tests/docs-counts.test.ts",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-204 layer`,",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-205 layer`,",
     "the layer-axis first (the head's first layer = s205)")
flip("tests/docs-counts.test.ts",
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s203 layer now beneath the s204 head)",',
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s204 layer now beneath the s205 head)",',
     "the layer-axis second label")
flip("tests/docs-counts.test.ts",
     '"+ beneath it 2841 unit checks + 226 e2e checks green; the session-203 layer (THE A11Y REGISTER\'S LANDING-PAGE CLIENT-STATE"',
     '"+ beneath it 2845 unit checks + 226 e2e checks green; the session-204 layer (THE OPERATOR\'S STANDING VERIFICATION ROUND"',
     "the layer-axis second content (the s204 layer at its ship 2845/226)")

# --- tests/docs-counts.test.ts: the 2845 negatives (the retired forms) -----
flip("tests/docs-counts.test.ts",
     """    expect(skill).not.toContain("| **unit total** | 138 files | **2841**");
    expect(skill).not.toContain("| **unit total** | 138 files | **2813**");
    expect(skill).not.toContain("| **unit total** | 138 files | **2811**");
  });""",
     """    expect(skill).not.toContain("| **unit total** | 138 files | **2841**");
    expect(skill).not.toContain("| **unit total** | 138 files | **2813**");
    expect(skill).not.toContain("| **unit total** | 138 files | **2811**");
    // Session-205 (D-205a1/a2): the retired 2845 site-forms join the
    // negatives (the s192 doctrine: the OLD live form joins the negatives)
    expect(readme).not.toMatch(/# 2845 Vitest unit checks/);
    expect(readme).not.toMatch(/# 138 Vitest suites \\(2845 checks\\)/);
    expect(readme).not.toMatch(/\\| 🧪 Tested \\| 2845 Vitest unit checks/);
    expect(pad).not.toMatch(/# 138 Vitest suites — 2845 checks/);
    expect(pad).not.toMatch(/— 2845\\/2845/);
    expect(pad).not.toMatch(/\\| \\*\\*Total\\*\\* \\| \\*\\*138\\*\\* \\| \\*\\*2845 unit/);
    expect(claude).not.toContain("Unit (Vitest, 2845 checks)");
    expect(claude).not.toContain("(currently 2845)");
    expect(claude).not.toContain("Vitest unit suites (2845 checks)");
    expect(claude).not.toContain("`bun run test` (2845)");
    expect(agents).not.toContain("|  Unit tests (2845 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2845**");
  });""",
     "the 2845 negatives block (the s205 join)")

# --- tests/dialog-geometry-parity.test.ts: the F-92a3 ladder -------------------
for old, new, label in [
    ('expect(claude).not.toContain("Unit (Vitest, 2841 checks)"); // session-204: the retired form joins the negatives (the D-204a1 parity-tools pins +2)\n    expect(claude).toContain("Unit (Vitest, 2845 checks)");',
     'expect(claude).not.toContain("Unit (Vitest, 2841 checks)"); // session-204: the retired form joins the negatives (the D-204a1 parity-tools pins +2)\n    expect(claude).not.toContain("Unit (Vitest, 2845 checks)"); // session-205: the retired form joins the negatives ladder (the D-205a1/a2 env-face totality pins +4)\n    expect(claude).toContain("Unit (Vitest, 2849 checks)");',
     "the F-92a3 pyramid positive"),
    ('expect(claude).not.toContain("(currently 2841)"); // session-204: the retired form joins the negatives ladder (the D-204a1 parity-tools pins +2)\n    expect(claude).toContain("(currently 2845)");',
     'expect(claude).not.toContain("(currently 2841)"); // session-204: the retired form joins the negatives ladder (the D-204a1 parity-tools pins +2)\n    expect(claude).not.toContain("(currently 2845)"); // session-205: the retired form joins the negatives ladder (the D-205a1/a2 env-face totality pins +4)\n    expect(claude).toContain("(currently 2849)");',
     "the F-92a3 coverage-seam positive"),
    ('expect(claude).not.toContain("Vitest unit suites (2841 checks)"); // session-204: the retired form joins the negatives ladder (the D-204a1 parity-tools pins +2)\n    expect(claude).toContain("Vitest unit suites (2845 checks)");',
     'expect(claude).not.toContain("Vitest unit suites (2841 checks)"); // session-204: the retired form joins the negatives ladder (the D-204a1 parity-tools pins +2)\n    expect(claude).not.toContain("Vitest unit suites (2845 checks)"); // session-205: the retired form joins the negatives ladder (the D-205a1/a2 env-face totality pins +4)\n    expect(claude).toContain("Vitest unit suites (2849 checks)");',
     "the F-92a3 commands positive"),
    ('expect(claude).not.toContain("`bun run test` (2841)"); // session-204: the retired form joins the negatives ladder (the D-204a1 parity-tools pins +2)\n    expect(claude).toContain("`bun run test` (2845)");',
     'expect(claude).not.toContain("`bun run test` (2841)"); // session-204: the retired form joins the negatives ladder (the D-204a1 parity-tools pins +2)\n    expect(claude).not.toContain("`bun run test` (2845)"); // session-205: the retired form joins the negatives ladder (the D-205a1/a2 env-face totality pins +4)\n    expect(claude).toContain("`bun run test` (2849)");',
     "the F-92a3 gate-order positive"),
]:
    flip("tests/dialog-geometry-parity.test.ts", old, new, label)

print("count-ladder-205.py done")
