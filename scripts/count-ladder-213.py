#!/usr/bin/env python3
"""count-ladder-213.py — the UNIT 2867 -> 2873 + badge 3093 -> 3099
lockstep (E2E 226 HELD · SUITES 138 HELD; +6 — the F-213a
semantic-prose conventions census pins: the six AGENTS
"Conventions that differ from defaults" block its in
tests/facts-census.test.ts [the validation-seam + icon-cascade +
delta-text + z-scale census + eslint-ignores + the charts bullet's
AGENTS face]).

The s165 assert-first form (the 204-212 template): every flip asserts
the OLD form is UNIQUE before replacing; a re-run is a verified no-op
(the new form present -> skip). The historical record sites (the AGENTS
Session-212 section, the PAD s212 inventory row, the SKILL's demoted
layers) keep their ship-time counts by doctrine — only the LIVE-tense
sites flip.

Sites (the doc flips + the test-side re-anchors in the same stroke):
  README  badge + Tested row + tree + commands
  AGENTS  commands (unit) + gate-order (unit)
  CLAUDE  gate-order + commands + pyramid + the coverage seam
  PAD     tree + Total + HEAD + checklist + commands (unit)
  SKILL   commands (unit) + Appendix B unit total
  tests/docs-counts.test.ts        the UNIT constant + the layer-axis
                                   pair + the 2867 negatives
  tests/dialog-geometry-parity     the four F-92a3 live positives +
                                   the 2867 negatives (4 assertions join)
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
flip("README.md", "tests-3093%20checks", "tests-3099%20checks", "the badge (2873+226)")
flip("README.md",
     "| 🧪 Tested | 2867 Vitest unit checks + 226 Playwright E2E checks,",
     "| 🧪 Tested | 2873 Vitest unit checks + 226 Playwright E2E checks,",
     "the Tested row")
flip("README.md",
     "# 138 Vitest suites (2867 checks)",
     "# 138 Vitest suites (2873 checks)",
     "the tree")
flip("README.md",
     "# 2867 Vitest unit checks",
     "# 2873 Vitest unit checks",
     "the commands")

# --- AGENTS (the live command/gate sites only — the Session-212 section is
#     the historical record, its ship counts stay) -----------------------------
flip("AGENTS.md",
     "|  Unit tests (2867 checks)      | `bun run test`",
     "|  Unit tests (2873 checks)      | `bun run test`",
     "the commands table (unit)")
flip("AGENTS.md",
     "`bun run test` (2867) → `bun run build` → `bun run smoke`",
     "`bun run test` (2873) → `bun run build` → `bun run smoke`",
     "the gate-order (unit)")

# --- CLAUDE -------------------------------------------------------------------
flip("CLAUDE.md",
     "`bun run test` (2867) → `bun run build` → `bun run test:e2e` (226)",
     "`bun run test` (2873) → `bun run build` → `bun run test:e2e` (226)",
     "the gate-order")
flip("CLAUDE.md",
     "| `bun run test`      | Vitest unit suites (2867 checks)",
     "| `bun run test`      | Vitest unit suites (2873 checks)",
     "the commands table (unit)")
flip("CLAUDE.md",
     "Unit (Vitest, 2867 checks)",
     "Unit (Vitest, 2873 checks)",
     "the pyramid (unit)")
flip("CLAUDE.md",
     "the seam (currently 2867).",
     "the seam (currently 2873).",
     "the coverage seam")

# --- PAD ----------------------------------------------------------------------
flip("Project_Architecture_Document.md",
     "│   ├── *.test.ts                # 138 Vitest suites — 2867 checks",
     "│   ├── *.test.ts                # 138 Vitest suites — 2873 checks",
     "the tree")
flip("Project_Architecture_Document.md",
     "| **Total** | **138** | **2867 unit + 226 e2e** | | |",
     "| **Total** | **138** | **2873 unit + 226 e2e** | | |",
     "the Total row")
flip("Project_Architecture_Document.md",
     "> HEAD: 138 Vitest suites with 2867 checks + 226 e2e checks in 11 spec",
     "> HEAD: 138 Vitest suites with 2873 checks + 226 e2e checks in 11 spec",
     "the HEAD line")
flip("Project_Architecture_Document.md",
     "- [ ] `bun run test` — 2867/2867",
     "- [ ] `bun run test` — 2873/2873",
     "the checklist (unit)")
flip("Project_Architecture_Document.md",
     "| `bun run test` | root | 2867 unit checks |",
     "| `bun run test` | root | 2873 unit checks |",
     "the commands table (unit)")

# --- SKILL (the live command/appendix sites only — the demoted s212 layer
#     keeps its ship counts) ----------------------------------------------------
flip("neo-crm_SKILL.md",
     "bun run test         # 2867/2867",
     "bun run test         # 2873/2873",
     "the commands block (unit)")
flip("neo-crm_SKILL.md",
     "| **unit total** | 138 files | **2867** |",
     "| **unit total** | 138 files | **2873** |",
     "the Appendix B unit total")

# --- tests/docs-counts.test.ts: the constants + the layer-axis -------------
flip("tests/docs-counts.test.ts",
     "const UNIT = 2867;",
     "const UNIT = 2873;",
     "the UNIT constant")
flip("tests/docs-counts.test.ts",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-212 layer`,",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-213 layer`,",
     "the layer-axis first (the head's first layer = s213)")
flip("tests/docs-counts.test.ts",
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s211 layer now beneath the s212 head)",',
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s212 layer now beneath the s213 head)",',
     "the layer-axis second label")
flip("tests/docs-counts.test.ts",
     '"+ beneath it 2863 unit checks + 226 e2e checks green; the session-211 layer (THE LOGIN SEM-ISLAND PARITY EVENT"',
     '"+ beneath it 2867 unit checks + 226 e2e checks green; the session-212 layer (THE STANDALONE BUN-LAUNCH DB RE-ANCHOR"',
     "the layer-axis second content (the s212 layer at its ship 2867/226 — the held-count form)")

# --- tests/docs-counts.test.ts: the 2867 negatives (the retired forms) -----
flip("tests/docs-counts.test.ts",
     """    expect(agents).not.toContain("|  Unit tests (2863 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2863**");
  });""",
     """    expect(agents).not.toContain("|  Unit tests (2863 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2863**");
    // Session-213 (D-213a1): the retired 2867 site-forms join the
    // negatives (the s192 doctrine: the OLD live form joins the negatives)
    expect(readme).not.toMatch(/# 2867 Vitest unit checks/);
    expect(readme).not.toMatch(/# 138 Vitest suites \\(2867 checks\\)/);
    expect(readme).not.toMatch(/\\| 🧪 Tested \\| 2867 Vitest unit checks/);
    expect(pad).not.toMatch(/# 138 Vitest suites — 2867 checks/);
    expect(pad).not.toMatch(/— 2867\\/2867/);
    expect(pad).not.toMatch(/\\| \\*\\*Total\\*\\* \\| \\*\\*138\\*\\* \\| \\*\\*2867 unit/);
    expect(claude).not.toContain("Unit (Vitest, 2867 checks)");
    expect(claude).not.toContain("(currently 2867)");
    expect(claude).not.toContain("Vitest unit suites (2867 checks)");
    expect(claude).not.toContain("`bun run test` (2867)");
    expect(agents).not.toContain("|  Unit tests (2867 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2867**");
  });""",
     "the 2867 negatives block (the s213 join)")

# --- tests/dialog-geometry-parity.test.ts: the F-92a3 ladder -------------------
for old, new, label in [
    ('expect(claude).not.toContain("Unit (Vitest, 2863 checks)"); // session-212: the retired form joins the negatives ladder (the D-212a1/D-212a2 standalone bun-launch re-anchor pins +4)\n    expect(claude).toContain("Unit (Vitest, 2867 checks)");',
     'expect(claude).not.toContain("Unit (Vitest, 2863 checks)"); // session-212: the retired form joins the negatives ladder (the D-212a1/D-212a2 standalone bun-launch re-anchor pins +4)\n    expect(claude).not.toContain("Unit (Vitest, 2867 checks)"); // session-213: the retired form joins the negatives ladder (the D-213a1 semantic-prose conventions census pins +6)\n    expect(claude).toContain("Unit (Vitest, 2873 checks)");',
     "the F-92a3 pyramid positive"),
    ('expect(claude).not.toContain("(currently 2863)"); // session-212: the retired form joins the negatives ladder (the D-212a1/D-212a2 standalone bun-launch re-anchor pins +4)\n    expect(claude).toContain("(currently 2867)");',
     'expect(claude).not.toContain("(currently 2863)"); // session-212: the retired form joins the negatives ladder (the D-212a1/D-212a2 standalone bun-launch re-anchor pins +4)\n    expect(claude).not.toContain("(currently 2867)"); // session-213: the retired form joins the negatives ladder (the D-213a1 semantic-prose conventions census pins +6)\n    expect(claude).toContain("(currently 2873)");',
     "the F-92a3 coverage-seam positive"),
    ('expect(claude).not.toContain("Vitest unit suites (2863 checks)"); // session-212: the retired form joins the negatives ladder (the D-212a1/D-212a2 standalone bun-launch re-anchor pins +4)\n    expect(claude).toContain("Vitest unit suites (2867 checks)");',
     'expect(claude).not.toContain("Vitest unit suites (2863 checks)"); // session-212: the retired form joins the negatives ladder (the D-212a1/D-212a2 standalone bun-launch re-anchor pins +4)\n    expect(claude).not.toContain("Vitest unit suites (2867 checks)"); // session-213: the retired form joins the negatives ladder (the D-213a1 semantic-prose conventions census pins +6)\n    expect(claude).toContain("Vitest unit suites (2873 checks)");',
     "the F-92a3 commands positive"),
    ('expect(claude).not.toContain("`bun run test` (2863)"); // session-212: the retired form joins the negatives ladder (the D-212a1/D-212a2 standalone bun-launch re-anchor pins +4)\n    expect(claude).toContain("`bun run test` (2867)");',
     'expect(claude).not.toContain("`bun run test` (2863)"); // session-212: the retired form joins the negatives ladder (the D-212a1/D-212a2 standalone bun-launch re-anchor pins +4)\n    expect(claude).not.toContain("`bun run test` (2867)"); // session-213: the retired form joins the negatives ladder (the D-213a1 semantic-prose conventions census pins +6)\n    expect(claude).toContain("`bun run test` (2873)");',
     "the F-92a3 gate-order positive"),
]:
    flip("tests/dialog-geometry-parity.test.ts", old, new, label)

print("count-ladder-213.py done")
