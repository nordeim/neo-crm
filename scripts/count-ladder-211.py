#!/usr/bin/env python3
"""count-ladder-211.py — the UNIT 2858 -> 2863 + badge 3084 -> 3089
lockstep (E2E 226 HELD · SUITES 138 HELD; +5 — the F-211a login
sem-island pins: the three login-views its [the re-anchored S96-P0
construction pin is an existing it] + the two design-tokens its).

The s165 assert-first form (the 204-210 template): every flip
asserts the OLD form is UNIQUE before replacing; a re-run is a
verified no-op (the new form present -> skip). The historical record
sites (the AGENTS Session-210 section, the PAD s210 inventory row,
the SKILL's demoted layers) keep their ship-time counts by doctrine —
only the LIVE-tense sites flip.

Sites (the doc flips + the test-side re-anchors in the same stroke):
  README  badge + Tested row + tree + commands
  AGENTS  commands (unit) + gate-order (unit)
  CLAUDE  gate-order + commands + pyramid + the coverage seam
  PAD     tree + Total + HEAD + checklist + commands (unit)
  SKILL   commands (unit) + Appendix B unit total
  tests/docs-counts.test.ts        the UNIT constant + the layer-axis
                                   pair + the 2858 negatives
  tests/dialog-geometry-parity     the four F-92a3 live positives +
                                   the 2858 negatives (4 assertions join)
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
flip("README.md", "tests-3084%20checks", "tests-3089%20checks", "the badge (2863+226)")
flip("README.md",
     "| 🧪 Tested | 2858 Vitest unit checks + 226 Playwright E2E checks,",
     "| 🧪 Tested | 2863 Vitest unit checks + 226 Playwright E2E checks,",
     "the Tested row")
flip("README.md",
     "# 138 Vitest suites (2858 checks)",
     "# 138 Vitest suites (2863 checks)",
     "the tree")
flip("README.md",
     "# 2858 Vitest unit checks",
     "# 2863 Vitest unit checks",
     "the commands")

# --- AGENTS (the live command/gate sites only — the Session-210 section is
#     the historical record, its ship counts stay) -----------------------------
flip("AGENTS.md",
     "|  Unit tests (2858 checks)      | `bun run test`",
     "|  Unit tests (2863 checks)      | `bun run test`",
     "the commands table (unit)")
flip("AGENTS.md",
     "`bun run test` (2858) → `bun run build` → `bun run smoke`",
     "`bun run test` (2863) → `bun run build` → `bun run smoke`",
     "the gate-order (unit)")

# --- CLAUDE -------------------------------------------------------------------
flip("CLAUDE.md",
     "`bun run test` (2858) → `bun run build` → `bun run test:e2e` (226)",
     "`bun run test` (2863) → `bun run build` → `bun run test:e2e` (226)",
     "the gate-order")
flip("CLAUDE.md",
     "| `bun run test`      | Vitest unit suites (2858 checks)",
     "| `bun run test`      | Vitest unit suites (2863 checks)",
     "the commands table (unit)")
flip("CLAUDE.md",
     "Unit (Vitest, 2858 checks)",
     "Unit (Vitest, 2863 checks)",
     "the pyramid (unit)")
flip("CLAUDE.md",
     "the seam (currently 2858).",
     "the seam (currently 2863).",
     "the coverage seam")

# --- PAD ----------------------------------------------------------------------
flip("Project_Architecture_Document.md",
     "│   ├── *.test.ts                # 138 Vitest suites — 2858 checks",
     "│   ├── *.test.ts                # 138 Vitest suites — 2863 checks",
     "the tree")
flip("Project_Architecture_Document.md",
     "| **Total** | **138** | **2858 unit + 226 e2e** | | |",
     "| **Total** | **138** | **2863 unit + 226 e2e** | | |",
     "the Total row")
flip("Project_Architecture_Document.md",
     "> HEAD: 138 Vitest suites with 2858 checks + 226 e2e checks in 11 spec",
     "> HEAD: 138 Vitest suites with 2863 checks + 226 e2e checks in 11 spec",
     "the HEAD line")
flip("Project_Architecture_Document.md",
     "- [ ] `bun run test` — 2858/2858",
     "- [ ] `bun run test` — 2863/2863",
     "the checklist (unit)")
flip("Project_Architecture_Document.md",
     "| `bun run test` | root | 2858 unit checks |",
     "| `bun run test` | root | 2863 unit checks |",
     "the commands table (unit)")

# --- SKILL (the live command/appendix sites only — the demoted s210 layer
#     keeps its ship counts) ----------------------------------------------------
flip("neo-crm_SKILL.md",
     "bun run test         # 2858/2858",
     "bun run test         # 2863/2863",
     "the commands block (unit)")
flip("neo-crm_SKILL.md",
     "| **unit total** | 138 files | **2858** |",
     "| **unit total** | 138 files | **2863** |",
     "the Appendix B unit total")

# --- tests/docs-counts.test.ts: the constants + the layer-axis -------------
flip("tests/docs-counts.test.ts",
     "const UNIT = 2858;",
     "const UNIT = 2863;",
     "the UNIT constant")
flip("tests/docs-counts.test.ts",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-210 layer`,",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-211 layer`,",
     "the layer-axis first (the head's first layer = s211)")
flip("tests/docs-counts.test.ts",
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s209 layer now beneath the s210 head)",',
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s210 layer now beneath the s211 head)",',
     "the layer-axis second label")
flip("tests/docs-counts.test.ts",
     '"+ beneath it 2858 unit checks + 226 e2e checks green; the session-209 layer (THE PUSH-RITUAL REMOTE CONTRACT"',
     '"+ beneath it 2858 unit checks + 226 e2e checks green; the session-210 layer (THE CENSUS CHECKOUT-PORTABILITY CONTRACT"',
     "the layer-axis second content (the s210 layer at its ship 2858/226 — the held-count form)")

# --- tests/docs-counts.test.ts: the 2858 negatives (the retired forms) -----
flip("tests/docs-counts.test.ts",
     """    expect(agents).not.toContain("|  Unit tests (2856 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2856**");
  });""",
     """    expect(agents).not.toContain("|  Unit tests (2856 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2856**");
    // Session-211 (D-211a1/D-211a2): the retired 2858 site-forms join the
    // negatives (the s192 doctrine: the OLD live form joins the negatives)
    expect(readme).not.toMatch(/# 2858 Vitest unit checks/);
    expect(readme).not.toMatch(/# 138 Vitest suites \\(2858 checks\\)/);
    expect(readme).not.toMatch(/\\| 🧪 Tested \\| 2858 Vitest unit checks/);
    expect(pad).not.toMatch(/# 138 Vitest suites — 2858 checks/);
    expect(pad).not.toMatch(/— 2858\\/2858/);
    expect(pad).not.toMatch(/\\| \\*\\*Total\\*\\* \\| \\*\\*138\\*\\* \\| \\*\\*2858 unit/);
    expect(claude).not.toContain("Unit (Vitest, 2858 checks)");
    expect(claude).not.toContain("(currently 2858)");
    expect(claude).not.toContain("Vitest unit suites (2858 checks)");
    expect(claude).not.toContain("`bun run test` (2858)");
    expect(agents).not.toContain("|  Unit tests (2858 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2858**");
  });""",
     "the 2858 negatives block (the s211 join)")

# --- tests/dialog-geometry-parity.test.ts: the F-92a3 ladder -------------------
for old, new, label in [
    ('expect(claude).not.toContain("Unit (Vitest, 2856 checks)"); // session-209: the retired form joins the negatives ladder (the D-209a1/D-209a2 push-ritual remote-contract pins +2)\n    expect(claude).toContain("Unit (Vitest, 2858 checks)");',
     'expect(claude).not.toContain("Unit (Vitest, 2856 checks)"); // session-209: the retired form joins the negatives ladder (the D-209a1/D-209a2 push-ritual remote-contract pins +2)\n    expect(claude).not.toContain("Unit (Vitest, 2858 checks)"); // session-211: the retired form joins the negatives ladder (the D-211a1/D-211a2 login sem-island pins +5)\n    expect(claude).toContain("Unit (Vitest, 2863 checks)");',
     "the F-92a3 pyramid positive"),
    ('expect(claude).not.toContain("(currently 2856)"); // session-209: the retired form joins the negatives ladder (the D-209a1/D-209a2 push-ritual remote-contract pins +2)\n    expect(claude).toContain("(currently 2858)");',
     'expect(claude).not.toContain("(currently 2856)"); // session-209: the retired form joins the negatives ladder (the D-209a1/D-209a2 push-ritual remote-contract pins +2)\n    expect(claude).not.toContain("(currently 2858)"); // session-211: the retired form joins the negatives ladder (the D-211a1/D-211a2 login sem-island pins +5)\n    expect(claude).toContain("(currently 2863)");',
     "the F-92a3 coverage-seam positive"),
    ('expect(claude).not.toContain("Vitest unit suites (2856 checks)"); // session-209: the retired form joins the negatives ladder (the D-209a1/D-209a2 push-ritual remote-contract pins +2)\n    expect(claude).toContain("Vitest unit suites (2858 checks)");',
     'expect(claude).not.toContain("Vitest unit suites (2856 checks)"); // session-209: the retired form joins the negatives ladder (the D-209a1/D-209a2 push-ritual remote-contract pins +2)\n    expect(claude).not.toContain("Vitest unit suites (2858 checks)"); // session-211: the retired form joins the negatives ladder (the D-211a1/D-211a2 login sem-island pins +5)\n    expect(claude).toContain("Vitest unit suites (2863 checks)");',
     "the F-92a3 commands positive"),
    ('expect(claude).not.toContain("`bun run test` (2856)"); // session-209: the retired form joins the negatives ladder (the D-209a1/D-209a2 push-ritual remote-contract pins +2)\n    expect(claude).toContain("`bun run test` (2858)");',
     'expect(claude).not.toContain("`bun run test` (2856)"); // session-209: the retired form joins the negatives ladder (the D-209a1/D-209a2 push-ritual remote-contract pins +2)\n    expect(claude).not.toContain("`bun run test` (2858)"); // session-211: the retired form joins the negatives ladder (the D-211a1/D-211a2 login sem-island pins +5)\n    expect(claude).toContain("`bun run test` (2863)");',
     "the F-92a3 gate-order positive"),
]:
    flip("tests/dialog-geometry-parity.test.ts", old, new, label)

print("count-ladder-211.py done")
