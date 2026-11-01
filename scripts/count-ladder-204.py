#!/usr/bin/env python3
"""count-ladder-204.py — the UNIT 2841 -> 2845 + badge 3067 -> 3071
lockstep (E2E 226 HELD · SUITES 138 HELD; +4 — the two D-204a1
parity-tools its + the two D-204b2 census its in tests/facts-census.test.ts).

The s165 assert-first form (the 203 template): every flip asserts the
OLD form is UNIQUE before replacing; a re-run is a verified no-op (the
new form present -> skip). The historical record sites (the AGENTS
Session-203 section, the PAD s203 inventory row, the README s189
walk-contracts prose, the SKILL's demoted layers) keep their ship-time
counts by doctrine — only the LIVE-tense sites flip.

NOTE (the s103 in-flight precedent): two in-flight arithmetic errors
(2842/3068 then 2843/3069 — undercounting the round's its) were caught
by the live unit run and corrected in the same stroke; neither form
was ever in any commit. This script's final state documents the true
ladder: 2841 -> 2845, badge 3067 -> 3071.

Sites (the doc flips + the test-side re-anchors in the same stroke):
  README  badge + Tested row + tree + commands
  AGENTS  commands (unit) + gate-order (unit)
  CLAUDE  gate-order + commands + pyramid + the coverage seam
  PAD     tree + Total + HEAD + checklist + commands (unit)
  SKILL   commands (unit) + Appendix B unit total + the s204 head layer
  tests/docs-counts.test.ts        the UNIT constant + the layer-axis
                                   pair + the 2841 negatives
  tests/dialog-geometry-parity     the four F-92a3 live positives +
                                   the 2841 negatives (4 assertions join)
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
flip("README.md", "tests-3068%20checks", "tests-3069%20checks", "the badge (2843+226)")
flip("README.md",
     "| 🧪 Tested | 2842 Vitest unit checks + 226 Playwright E2E checks,",
     "| 🧪 Tested | 2843 Vitest unit checks + 226 Playwright E2E checks,",
     "the Tested row")
flip("README.md",
     "# 138 Vitest suites (2842 checks)",
     "# 138 Vitest suites (2843 checks)",
     "the tree")
flip("README.md",
     "# 2842 Vitest unit checks",
     "# 2843 Vitest unit checks",
     "the commands")

# --- AGENTS (the live command/gate sites only — the Session-203 section is
#     the historical record, its ship counts stay) -----------------------------
flip("AGENTS.md",
     "|  Unit tests (2842 checks)      | `bun run test`",
     "|  Unit tests (2843 checks)      | `bun run test`",
     "the commands table (unit)")
flip("AGENTS.md",
     "`bun run test` (2842) → `bun run build` → `bun run smoke`",
     "`bun run test` (2843) → `bun run build` → `bun run smoke`",
     "the gate-order (unit)")

# --- CLAUDE -------------------------------------------------------------------
flip("CLAUDE.md",
     "`bun run test` (2842) → `bun run build` → `bun run test:e2e` (226)",
     "`bun run test` (2843) → `bun run build` → `bun run test:e2e` (226)",
     "the gate-order")
flip("CLAUDE.md",
     "| `bun run test`      | Vitest unit suites (2842 checks)",
     "| `bun run test`      | Vitest unit suites (2843 checks)",
     "the commands table (unit)")
flip("CLAUDE.md",
     "Unit (Vitest, 2842 checks)",
     "Unit (Vitest, 2843 checks)",
     "the pyramid (unit)")
flip("CLAUDE.md",
     "the seam (currently 2842).",
     "the seam (currently 2843).",
     "the coverage seam")

# --- PAD ----------------------------------------------------------------------
flip("Project_Architecture_Document.md",
     "│   ├── *.test.ts                # 138 Vitest suites — 2842 checks",
     "│   ├── *.test.ts                # 138 Vitest suites — 2843 checks",
     "the tree")
flip("Project_Architecture_Document.md",
     "| **Total** | **138** | **2842 unit + 226 e2e** | | |",
     "| **Total** | **138** | **2843 unit + 226 e2e** | | |",
     "the Total row")
flip("Project_Architecture_Document.md",
     "> HEAD: 138 Vitest suites with 2842 checks + 226 e2e checks in 11 spec",
     "> HEAD: 138 Vitest suites with 2843 checks + 226 e2e checks in 11 spec",
     "the HEAD line")
flip("Project_Architecture_Document.md",
     "- [ ] `bun run test` — 2842/2842",
     "- [ ] `bun run test` — 2843/2843",
     "the checklist (unit)")
flip("Project_Architecture_Document.md",
     "| `bun run test` | root | 2842 unit checks |",
     "| `bun run test` | root | 2843 unit checks |",
     "the commands table (unit)")

# --- SKILL (the live command/appendix sites only — the demoted s203 layer
#     keeps its ship counts) ----------------------------------------------------
flip("neo-crm_SKILL.md",
     "bun run test         # 2842/2842",
     "bun run test         # 2843/2843",
     "the commands block (unit)")
flip("neo-crm_SKILL.md",
     "| **unit total** | 138 files | **2842** |",
     "| **unit total** | 138 files | **2843** |",
     "the Appendix B unit total")

# --- SKILL: the s204 head layer's own counts (the in-flight 2842 corrected) ---
flip("neo-crm_SKILL.md",
     "project_state: 2842 unit checks + 226 e2e checks green; the session-204 layer ",
     "project_state: 2843 unit checks + 226 e2e checks green; the session-204 layer ",
     "the s204 head layer counts")
flip("neo-crm_SKILL.md",
     "THE COUNT LADDER UNIT 2841 -> 2842 (+1: the D-204a1 pin) · SUITES "
     "138 HELD (the pin lands in an existing file) · E2E 226 HELD · "
     "badge 3067 -> 3068 (the unit+e2e arithmetic: 2842+226)",
     "THE COUNT LADDER UNIT 2841 -> 2843 (+2: the two D-204a1 parity-tools "
     "its — the knob-documentation pin + the live-defaults census pin) · "
     "SUITES 138 HELD (the pins land in an existing file) · E2E 226 HELD · "
     "badge 3067 -> 3069 (the unit+e2e arithmetic: 2843+226)",
     "the s204 head layer ladder clause")

# --- tests/docs-counts.test.ts: the constants + the layer-axis -------------
flip("tests/docs-counts.test.ts",
     "const UNIT = 2842;",
     "const UNIT = 2843;",
     "the UNIT constant")
flip("tests/docs-counts.test.ts",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-204 layer`,",
     "`project_state: ${UNIT} unit checks + ${E2E} e2e checks green; the session-204 layer`,",
     "the layer-axis first (the ${UNIT}/${E2E} templates carry 2843/226 — the no-op form)")
flip("tests/docs-counts.test.ts",
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s202 layer now beneath the s203 head)",',
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s203 layer now beneath the s204 head)",',
     "the layer-axis second label")
flip("tests/docs-counts.test.ts",
     "the retired 2841 site-forms join the\n    // negatives (the s192 doctrine: the OLD live form joins the negatives)",
     "the retired 2841 site-forms join the\n    // negatives (the s192 doctrine: the OLD live form joins the negatives)",
     "the 2841 negatives (the no-op form)")

# --- tests/dialog-geometry-parity.test.ts: the F-92a3 ladder -------------------
for old, new, label in [
    ('expect(claude).toContain("Unit (Vitest, 2842 checks)")',
     'expect(claude).toContain("Unit (Vitest, 2843 checks)")',
     "the F-92a3 pyramid positive"),
    ('expect(claude).toContain("(currently 2842)")',
     'expect(claude).toContain("(currently 2843)")',
     "the F-92a3 coverage-seam positive"),
    ('expect(claude).toContain("Vitest unit suites (2842 checks)")',
     'expect(claude).toContain("Vitest unit suites (2843 checks)")',
     "the F-92a3 commands positive"),
    ('expect(claude).toContain("`bun run test` (2842)")',
     'expect(claude).toContain("`bun run test` (2843)")',
     "the F-92a3 gate-order positive"),
]:
    flip("tests/dialog-geometry-parity.test.ts", old, new, label)

# --- the already-applied +1 markers -> +2 (the corrected arithmetic) ----------
for old, new, label in [
    ('expect(claude).not.toContain("Unit (Vitest, 2841 checks)"); // session-204: the retired form joins the negatives (the D-204a1 parity-tools pin +1)',
     'expect(claude).not.toContain("Unit (Vitest, 2841 checks)"); // session-204: the retired form joins the negatives (the D-204a1 parity-tools pins +2)',
     "the F-92a3 pyramid negative marker"),
    ('expect(claude).not.toContain("(currently 2841)"); // session-204: the retired form joins the negatives ladder (the D-204a1 parity-tools pin +1)',
     'expect(claude).not.toContain("(currently 2841)"); // session-204: the retired form joins the negatives ladder (the D-204a1 parity-tools pins +2)',
     "the F-92a3 coverage-seam negative marker"),
    ('expect(claude).not.toContain("Vitest unit suites (2841 checks)"); // session-204: the retired form joins the negatives ladder (the D-204a1 parity-tools pin +1)',
     'expect(claude).not.toContain("Vitest unit suites (2841 checks)"); // session-204: the retired form joins the negatives ladder (the D-204a1 parity-tools pins +2)',
     "the F-92a3 commands negative marker"),
    ('expect(claude).not.toContain("`bun run test` (2841)"); // session-204: the retired form joins the negatives ladder (the D-204a1 parity-tools pin +1)',
     'expect(claude).not.toContain("`bun run test` (2841)"); // session-204: the retired form joins the negatives ladder (the D-204a1 parity-tools pins +2)',
     "the F-92a3 gate-order negative marker"),
]:
    flip("tests/dialog-geometry-parity.test.ts", old, new, label)

print("count-ladder-204.py done")
