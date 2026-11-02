#!/usr/bin/env python3
"""count-ladder-209.py — the UNIT 2856 -> 2858 + badge 3082 -> 3084
lockstep (E2E 226 HELD · SUITES 138 HELD; +2 — the two D-209a2
push-ritual remote-contract its in tests/facts-census.test.ts).

The s165 assert-first form (the 204-208 template): every flip
asserts the OLD form is UNIQUE before replacing; a re-run is a
verified no-op (the new form present -> skip). The historical record
sites (the AGENTS Session-208 section, the PAD s208 inventory row,
the SKILL's demoted layers) keep their ship-time counts by doctrine —
only the LIVE-tense sites flip.

Sites (the doc flips + the test-side re-anchors in the same stroke):
  README  badge + Tested row + tree + commands
  AGENTS  commands (unit) + gate-order (unit)
  CLAUDE  gate-order + commands + pyramid + the coverage seam
  PAD     tree + Total + HEAD + checklist + commands (unit)
  SKILL   commands (unit) + Appendix B unit total
  tests/docs-counts.test.ts        the UNIT constant + the layer-axis
                                   pair + the 2856 negatives
  tests/dialog-geometry-parity     the four F-92a3 live positives +
                                   the 2856 negatives (4 assertions join)
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
flip("README.md", "tests-3082%20checks", "tests-3084%20checks", "the badge (2858+226)")
flip("README.md",
     "| 🧪 Tested | 2856 Vitest unit checks + 226 Playwright E2E checks,",
     "| 🧪 Tested | 2858 Vitest unit checks + 226 Playwright E2E checks,",
     "the Tested row")
flip("README.md",
     "# 138 Vitest suites (2856 checks)",
     "# 138 Vitest suites (2858 checks)",
     "the tree")
flip("README.md",
     "# 2856 Vitest unit checks",
     "# 2858 Vitest unit checks",
     "the commands")

# --- AGENTS (the live command/gate sites only — the Session-208 section is
#     the historical record, its ship counts stay) -----------------------------
flip("AGENTS.md",
     "|  Unit tests (2856 checks)      | `bun run test`",
     "|  Unit tests (2858 checks)      | `bun run test`",
     "the commands table (unit)")
flip("AGENTS.md",
     "`bun run test` (2856) → `bun run build` → `bun run smoke`",
     "`bun run test` (2858) → `bun run build` → `bun run smoke`",
     "the gate-order (unit)")

# --- CLAUDE -------------------------------------------------------------------
flip("CLAUDE.md",
     "`bun run test` (2856) → `bun run build` → `bun run test:e2e` (226)",
     "`bun run test` (2858) → `bun run build` → `bun run test:e2e` (226)",
     "the gate-order")
flip("CLAUDE.md",
     "| `bun run test`      | Vitest unit suites (2856 checks)",
     "| `bun run test`      | Vitest unit suites (2858 checks)",
     "the commands table (unit)")
flip("CLAUDE.md",
     "Unit (Vitest, 2856 checks)",
     "Unit (Vitest, 2858 checks)",
     "the pyramid (unit)")
flip("CLAUDE.md",
     "the seam (currently 2856).",
     "the seam (currently 2858).",
     "the coverage seam")

# --- PAD ----------------------------------------------------------------------
flip("Project_Architecture_Document.md",
     "│   ├── *.test.ts                # 138 Vitest suites — 2856 checks",
     "│   ├── *.test.ts                # 138 Vitest suites — 2858 checks",
     "the tree")
flip("Project_Architecture_Document.md",
     "| **Total** | **138** | **2856 unit + 226 e2e** | | |",
     "| **Total** | **138** | **2858 unit + 226 e2e** | | |",
     "the Total row")
flip("Project_Architecture_Document.md",
     "> HEAD: 138 Vitest suites with 2856 checks + 226 e2e checks in 11 spec",
     "> HEAD: 138 Vitest suites with 2858 checks + 226 e2e checks in 11 spec",
     "the HEAD line")
flip("Project_Architecture_Document.md",
     "- [ ] `bun run test` — 2856/2856",
     "- [ ] `bun run test` — 2858/2858",
     "the checklist (unit)")
flip("Project_Architecture_Document.md",
     "| `bun run test` | root | 2856 unit checks |",
     "| `bun run test` | root | 2858 unit checks |",
     "the commands table (unit)")

# --- SKILL (the live command/appendix sites only — the demoted s208 layer
#     keeps its ship counts) ----------------------------------------------------
flip("neo-crm_SKILL.md",
     "bun run test         # 2856/2856",
     "bun run test         # 2858/2858",
     "the commands block (unit)")
flip("neo-crm_SKILL.md",
     "| **unit total** | 138 files | **2856** |",
     "| **unit total** | 138 files | **2858** |",
     "the Appendix B unit total")

# --- tests/docs-counts.test.ts: the constants + the layer-axis -------------
flip("tests/docs-counts.test.ts",
     "const UNIT = 2856;",
     "const UNIT = 2858;",
     "the UNIT constant")
flip("tests/docs-counts.test.ts",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-208 layer`,",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-209 layer`,",
     "the layer-axis first (the head's first layer = s209)")
flip("tests/docs-counts.test.ts",
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s207 layer now beneath the s208 head)",',
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s208 layer now beneath the s209 head)",',
     "the layer-axis second label")
flip("tests/docs-counts.test.ts",
     '"+ beneath it 2853 unit checks + 226 e2e checks green; the session-207 layer (THE OPERATOR\'S STANDING VERIFICATION ROUND"',
     '"+ beneath it 2856 unit checks + 226 e2e checks green; the session-208 layer (THE DOC-CLAIM TOTALITY CENSUS"',
     "the layer-axis second content (the s208 layer at its ship 2856/226)")

# --- tests/docs-counts.test.ts: the 2856 negatives (the retired forms) -----
flip("tests/docs-counts.test.ts",
     """    expect(agents).not.toContain("|  Unit tests (2853 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2853**");
  });""",
     """    expect(agents).not.toContain("|  Unit tests (2853 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2853**");
    // Session-209 (D-209a1/D-209a2): the retired 2856 site-forms join the
    // negatives (the s192 doctrine: the OLD live form joins the negatives)
    expect(readme).not.toMatch(/# 2856 Vitest unit checks/);
    expect(readme).not.toMatch(/# 138 Vitest suites \\(2856 checks\\)/);
    expect(readme).not.toMatch(/\\| 🧪 Tested \\| 2856 Vitest unit checks/);
    expect(pad).not.toMatch(/# 138 Vitest suites — 2856 checks/);
    expect(pad).not.toMatch(/— 2856\\/2856/);
    expect(pad).not.toMatch(/\\| \\*\\*Total\\*\\* \\| \\*\\*138\\*\\* \\| \\*\\*2856 unit/);
    expect(claude).not.toContain("Unit (Vitest, 2856 checks)");
    expect(claude).not.toContain("(currently 2856)");
    expect(claude).not.toContain("Vitest unit suites (2856 checks)");
    expect(claude).not.toContain("`bun run test` (2856)");
    expect(agents).not.toContain("|  Unit tests (2856 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2856**");
  });""",
     "the 2856 negatives block (the s209 join)")

# --- tests/dialog-geometry-parity.test.ts: the F-92a3 ladder -------------------
for old, new, label in [
    ('expect(claude).not.toContain("Unit (Vitest, 2853 checks)"); // session-208: the retired form joins the negatives ladder (the D-208a1/D-208a2 doc-claim totality-census pins +3)\n    expect(claude).toContain("Unit (Vitest, 2856 checks)");',
     'expect(claude).not.toContain("Unit (Vitest, 2853 checks)"); // session-208: the retired form joins the negatives ladder (the D-208a1/D-208a2 doc-claim totality-census pins +3)\n    expect(claude).not.toContain("Unit (Vitest, 2856 checks)"); // session-209: the retired form joins the negatives ladder (the D-209a1/D-209a2 push-ritual remote-contract pins +2)\n    expect(claude).toContain("Unit (Vitest, 2858 checks)");',
     "the F-92a3 pyramid positive"),
    ('expect(claude).not.toContain("(currently 2853)"); // session-208: the retired form joins the negatives ladder (the D-208a1/D-208a2 doc-claim totality-census pins +3)\n    expect(claude).toContain("(currently 2856)");',
     'expect(claude).not.toContain("(currently 2853)"); // session-208: the retired form joins the negatives ladder (the D-208a1/D-208a2 doc-claim totality-census pins +3)\n    expect(claude).not.toContain("(currently 2856)"); // session-209: the retired form joins the negatives ladder (the D-209a1/D-209a2 push-ritual remote-contract pins +2)\n    expect(claude).toContain("(currently 2858)");',
     "the F-92a3 coverage-seam positive"),
    ('expect(claude).not.toContain("Vitest unit suites (2853 checks)"); // session-208: the retired form joins the negatives ladder (the D-208a1/D-208a2 doc-claim totality-census pins +3)\n    expect(claude).toContain("Vitest unit suites (2856 checks)");',
     'expect(claude).not.toContain("Vitest unit suites (2853 checks)"); // session-208: the retired form joins the negatives ladder (the D-208a1/D-208a2 doc-claim totality-census pins +3)\n    expect(claude).not.toContain("Vitest unit suites (2856 checks)"); // session-209: the retired form joins the negatives ladder (the D-209a1/D-209a2 push-ritual remote-contract pins +2)\n    expect(claude).toContain("Vitest unit suites (2858 checks)");',
     "the F-92a3 commands positive"),
    ('expect(claude).not.toContain("`bun run test` (2853)"); // session-208: the retired form joins the negatives ladder (the D-208a1/D-208a2 doc-claim totality-census pins +3)\n    expect(claude).toContain("`bun run test` (2856)");',
     'expect(claude).not.toContain("`bun run test` (2853)"); // session-208: the retired form joins the negatives ladder (the D-208a1/D-208a2 doc-claim totality-census pins +3)\n    expect(claude).not.toContain("`bun run test` (2856)"); // session-209: the retired form joins the negatives ladder (the D-209a1/D-209a2 push-ritual remote-contract pins +2)\n    expect(claude).toContain("`bun run test` (2858)");',
     "the F-92a3 gate-order positive"),
]:
    flip("tests/dialog-geometry-parity.test.ts", old, new, label)

print("count-ladder-209.py done")
