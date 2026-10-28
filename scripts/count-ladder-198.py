#!/usr/bin/env python3
"""count-ladder-198.py — the UNIT 2813 -> 2817 + badge 3008 -> 3012 lockstep.

The s165 assert-first form: every flip asserts the OLD form is UNIQUE
before replacing; a re-run is a verified no-op (the new form present ->
skip). The historical record sites (the AGENTS Session-197 section, the
PAD s197 inventory row, the SKILL's demoted s197 layer) keep their
ship-time counts by doctrine — only the LIVE-tense sites flip.

Sites (18 doc flips + the two test-side re-anchors in the same stroke):
  README  badge + Tested row + tree + commands
  AGENTS  commands + gate-order
  CLAUDE  gate-order + commands + pyramid + the coverage seam
  PAD     tree + Total + HEAD + checklist + commands
  SKILL   commands + Appendix B unit total
  tests/docs-counts.test.ts        the UNIT constant + the layer-axis pair
                                   + the 2813 negatives (12 assertions join)
  tests/dialog-geometry-parity     the four F-92a3 live positives + the 2813
                                   negatives (4 assertions join)
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
flip("README.md", "tests-3008%20checks", "tests-3012%20checks", "the badge (2817+195)")
flip("README.md",
     "| 🧪 Tested | 2813 Vitest unit checks + 195 Playwright E2E checks",
     "| 🧪 Tested | 2817 Vitest unit checks + 195 Playwright E2E checks",
     "the Tested row")
flip("README.md",
     "# 138 Vitest suites (2813 checks)",
     "# 138 Vitest suites (2817 checks)",
     "the tree")
flip("README.md",
     "# 2813 Vitest unit checks",
     "# 2817 Vitest unit checks",
     "the commands")

# --- AGENTS (the live command/gate sites only — the Session-197 section is
#     the historical record, its ship counts stay) -----------------------------
flip("AGENTS.md",
     "|  Unit tests (2813 checks)      | `bun run test`",
     "|  Unit tests (2817 checks)      | `bun run test`",
     "the commands table")
flip("AGENTS.md",
     "`bun run test` (2813) → `bun run build`",
     "`bun run test` (2817) → `bun run build`",
     "the gate-order")

# --- CLAUDE -------------------------------------------------------------------
flip("CLAUDE.md",
     "`bun run test` (2813) → `bun run build` → `bun run test:e2e` (195)",
     "`bun run test` (2817) → `bun run build` → `bun run test:e2e` (195)",
     "the gate-order")
flip("CLAUDE.md",
     "| `bun run test`      | Vitest unit suites (2813 checks)",
     "| `bun run test`      | Vitest unit suites (2817 checks)",
     "the commands table")
flip("CLAUDE.md",
     "Unit (Vitest, 2813 checks)",
     "Unit (Vitest, 2817 checks)",
     "the pyramid")
flip("CLAUDE.md",
     "the seam (currently 2813).",
     "the seam (currently 2817).",
     "the coverage seam")

# --- PAD ----------------------------------------------------------------------
flip("Project_Architecture_Document.md",
     "# 138 Vitest suites — 2813 checks",
     "# 138 Vitest suites — 2817 checks",
     "the tree")
flip("Project_Architecture_Document.md",
     "| **Total** | **138** | **2813 unit + 195 e2e** |",
     "| **Total** | **138** | **2817 unit + 195 e2e** |",
     "the Total row")
flip("Project_Architecture_Document.md",
     "> HEAD: 138 Vitest suites with 2813 checks + 195 e2e checks in 11 spec",
     "> HEAD: 138 Vitest suites with 2817 checks + 195 e2e checks in 11 spec",
     "the HEAD line")
flip("Project_Architecture_Document.md",
     "- [ ] `bun run test` — 2813/2813",
     "- [ ] `bun run test` — 2817/2817",
     "the checklist")
flip("Project_Architecture_Document.md",
     "| `bun run test` | root | 2813 unit checks |",
     "| `bun run test` | root | 2817 unit checks |",
     "the commands table")

# --- SKILL (the live command/appendix sites only — the demoted s197 layer
#     keeps its ship counts) ----------------------------------------------------
flip("neo-crm_SKILL.md",
     "bun run test         # 2813/2813",
     "bun run test         # 2817/2817",
     "the commands block")
flip("neo-crm_SKILL.md",
     "| **unit total** | 138 files | **2813** |",
     "| **unit total** | 138 files | **2817** |",
     "the Appendix B unit total")

# --- tests/docs-counts.test.ts: the UNIT constant + the layer-axis -------------
flip("tests/docs-counts.test.ts",
     "const UNIT = 2813;",
     "const UNIT = 2817;",
     "the UNIT constant")
flip("tests/docs-counts.test.ts",
     "green; the session-197 layer`,",
     "green; the session-198 layer`,",
     "the layer-axis first (the ${UNIT} template carries 2817)")
flip("tests/docs-counts.test.ts",
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s196 layer now beneath the s197 head)",\n    ).toContain(\n      "+ beneath it 2811 unit checks + 195 e2e checks green; the session-196 layer (THE DRAWER-OPEN SPINE FREEZE",',
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s197 layer now beneath the s198 head)",\n    ).toContain(\n      "+ beneath it 2813 unit checks + 195 e2e checks green; the session-197 layer (THE SWEEP-STATE COVERAGE AUDIT",',
     "the layer-axis second (the s197 layer at its ship 2813/195)")

# --- tests/docs-counts.test.ts: the 2813 negatives join the s166 block ---------
NEG_ANCHOR = '    expect(skill).not.toContain("| **unit total** | 138 files | **2811**");'
NEG_ADDITION = '''    // Session-198 (D-198a1/a2): the retired 2813 site-forms join the
    // negatives (the s192 doctrine: the OLD live form joins the negatives)
    expect(readme).not.toMatch(/# 2813 Vitest unit checks/);
    expect(readme).not.toMatch(/# 138 Vitest suites \\(2813 checks\\)/);
    expect(readme).not.toMatch(/\\| 🧪 Tested \\| 2813 Vitest unit checks/);
    expect(pad).not.toMatch(/# 138 Vitest suites — 2813 checks/);
    expect(pad).not.toMatch(/— 2813\\/2813/);
    expect(pad).not.toMatch(/\\| \\*\\*Total\\*\\* \\| \\*\\*138\\*\\* \\| \\*\\*2813 unit/);
    expect(claude).not.toContain("Unit (Vitest, 2813 checks)");
    expect(claude).not.toContain("(currently 2813)");
    expect(claude).not.toContain("Vitest unit suites (2813 checks)");
    expect(claude).not.toContain("`bun run test` (2813)");
    expect(agents).not.toContain("|  Unit tests (2813 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2813**");
    expect(skill).not.toContain("| **unit total** | 138 files | **2811**");'''
p = ROOT / "tests/docs-counts.test.ts"
t = p.read_text(encoding="utf8")
if "the retired 2813 site-forms join the" in t:
    print("  no-op  [tests/docs-counts.test.ts] the 2813 negatives")
else:
    n = t.count(NEG_ANCHOR)
    assert n == 1, f"the negatives anchor found {n} times"
    t = t.replace(NEG_ANCHOR, NEG_ADDITION, 1)
    p.write_text(t, encoding="utf8")
    print("  flip   [tests/docs-counts.test.ts] the 2813 negatives join the block")

# --- tests/dialog-geometry-parity.test.ts: the F-92a3 ladder -------------------
for old, new, label in [
    ('expect(claude).toContain("Unit (Vitest, 2813 checks)")',
     'expect(claude).toContain("Unit (Vitest, 2817 checks)")',
     "the F-92a3 pyramid positive"),
    ('expect(claude).toContain("(currently 2813)")',
     'expect(claude).toContain("(currently 2817)")',
     "the F-92a3 coverage-seam positive"),
    ('expect(claude).toContain("Vitest unit suites (2813 checks)")',
     'expect(claude).toContain("Vitest unit suites (2817 checks)")',
     "the F-92a3 commands positive"),
    ('expect(claude).toContain("`bun run test` (2813)")',
     'expect(claude).toContain("`bun run test` (2817)")',
     "the F-92a3 gate-order positive"),
    ('expect(claude).not.toContain("Unit (Vitest, 2811 checks)"); // session-197: the retired form joins the negatives',
     'expect(claude).not.toContain("Unit (Vitest, 2811 checks)"); // session-197: the retired form joins the negatives\n    expect(claude).not.toContain("Unit (Vitest, 2813 checks)"); // session-198: the retired form joins the negatives',
     "the F-92a3 pyramid negative"),
    ('expect(claude).not.toContain("(currently 2811)"); // session-197: the retired form joins the negatives ladder',
     'expect(claude).not.toContain("(currently 2811)"); // session-197: the retired form joins the negatives ladder\n    expect(claude).not.toContain("(currently 2813)"); // session-198: the retired form joins the negatives ladder',
     "the F-92a3 coverage-seam negative"),
    ('expect(claude).not.toContain("Vitest unit suites (2811 checks)"); // session-197: the retired form joins the neg',
     'expect(claude).not.toContain("Vitest unit suites (2811 checks)"); // session-197: the retired form joins the neg\n    expect(claude).not.toContain("Vitest unit suites (2813 checks)"); // session-198: the retired form joins the neg',
     "the F-92a3 commands negative"),
    ('expect(claude).not.toContain("`bun run test` (2811)"); // session-197: the retired form joins the negatives ladd',
     'expect(claude).not.toContain("`bun run test` (2811)"); // session-197: the retired form joins the negatives ladd\n    expect(claude).not.toContain("`bun run test` (2813)"); // session-198: the retired form joins the negatives ladd',
     "the F-92a3 gate-order negative"),
]:
    flip("tests/dialog-geometry-parity.test.ts", old, new, label)

print("count-ladder-198.py done")
