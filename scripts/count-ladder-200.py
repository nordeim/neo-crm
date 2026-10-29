#!/usr/bin/env python3
"""count-ladder-200.py — the UNIT 2822 -> 2827 + E2E 200 -> 206 + badge
3022 -> 3033 lockstep.

The s165 assert-first form: every flip asserts the OLD form is UNIQUE
before replacing; a re-run is a verified no-op (the new form present ->
skip). The historical record sites (the AGENTS Session-199 section, the
PAD s199 inventory row, the SKILL's demoted s199 layer) keep their
ship-time counts by doctrine — only the LIVE-tense sites flip.

Sites (the doc flips + the test-side re-anchors in the same stroke):
  README  badge + Tested row + tree + commands + the e2e tree/commands
  AGENTS  commands (unit + e2e) + gate-order (unit + e2e)
  CLAUDE  gate-order + commands (unit + e2e) + pyramid (unit + e2e)
          + the coverage seam + the a11y family description (the s200
          closure: the count-proof anon family + the marketing pair +
          the reset surface)
  PAD     tree (unit + e2e) + Total + HEAD + checklist (unit + e2e)
          + commands (unit + e2e) + the §11 a11y row (the line census
          526 -> 593 + the family) + the §11 dialog-controls row (236
          -> 306 + the s200 pins)
  SKILL   commands (unit + e2e) + Appendix B (unit total + the a11y row
          38 -> 44 + the e2e total)
  tests/docs-counts.test.ts        the UNIT + E2E constants + the
                                   layer-axis pair + the 2822 negatives
  tests/dialog-geometry-parity     the four F-92a3 live positives + the
                                   2822 negatives (4 assertions join)
  tests/login-family-parity        the E2E 200 negative joins + the live
                                   positive re-anchored 206
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
flip("README.md", "tests-3022%20checks", "tests-3033%20checks", "the badge (2827+206)")
flip("README.md",
     "| 🧪 Tested | 2822 Vitest unit checks + 200 Playwright E2E checks,",
     "| 🧪 Tested | 2827 Vitest unit checks + 206 Playwright E2E checks,",
     "the Tested row")
flip("README.md",
     "# 138 Vitest suites (2822 checks)",
     "# 138 Vitest suites (2827 checks)",
     "the tree")
flip("README.md",
     "# 2822 Vitest unit checks",
     "# 2827 Vitest unit checks",
     "the commands")
# the s102-P1 lockstep tree/commands sites (flipped only when E2E moves):
flip("README.md",
     "│   └── 📂 e2e/                       # Playwright (200 checks)",
     "│   └── 📂 e2e/                       # Playwright (206 checks)",
     "the file tree (e2e)")
flip("README.md",
     "bun run test:e2e      # 200 Playwright checks on :3100 with its own db/e2e.db",
     "bun run test:e2e      # 206 Playwright checks on :3100 with its own db/e2e.db",
     "the commands comment (e2e)")

# --- AGENTS (the live command/gate sites only — the Session-199 section is
#     the historical record, its ship counts stay) -----------------------------
flip("AGENTS.md",
     "|  Unit tests (2822 checks)      | `bun run test`",
     "|  Unit tests (2827 checks)      | `bun run test`",
     "the commands table (unit)")
flip("AGENTS.md",
     "|  Browser E2E (200 checks)        | `bun run test:e2e`",
     "|  Browser E2E (206 checks)        | `bun run test:e2e`",
     "the commands table (e2e)")
flip("AGENTS.md",
     "`bun run test` (2822) → `bun run build`",
     "`bun run test` (2827) → `bun run build`",
     "the gate-order (unit)")
flip("AGENTS.md",
     "`bun run test:e2e` (200) — or the one-command `bun run gate`",
     "`bun run test:e2e` (206) — or the one-command `bun run gate`",
     "the gate-order (e2e)")

# --- CLAUDE -------------------------------------------------------------------
flip("CLAUDE.md",
     "`bun run test` (2822) → `bun run build` → `bun run test:e2e` (200)",
     "`bun run test` (2827) → `bun run build` → `bun run test:e2e` (206)",
     "the gate-order")
flip("CLAUDE.md",
     "| `bun run test`      | Vitest unit suites (2822 checks)",
     "| `bun run test`      | Vitest unit suites (2827 checks)",
     "the commands table (unit)")
flip("CLAUDE.md",
     "| `bun run test:e2e`  | Playwright E2E (200 checks, needs build first) |",
     "| `bun run test:e2e`  | Playwright E2E (206 checks, needs build first) |",
     "the commands table (e2e)")
flip("CLAUDE.md",
     "Unit (Vitest, 2822 checks)",
     "Unit (Vitest, 2827 checks)",
     "the pyramid (unit)")
flip("CLAUDE.md",
     "**E2E (Playwright, 200 checks)**",
     "**E2E (Playwright, 206 checks)**",
     "the pyramid (e2e)")
flip("CLAUDE.md",
     "the seam (currently 2822).",
     "the seam (currently 2827).",
     "the coverage seam")
flip("CLAUDE.md",
     "pages × desktop + phone + the three anon surfaces × both widths +\n  the drawer-open state + session-172's dialog-open family (the five\n  create dialogs + the contact edit dialog — the closed-by-default\n  genus a page scan never sees; session-199's register-coverage closure\n  added the Edit Lead + Edit Account siblings + the Import/Insights/\n  Save-Report standalone dialogs — every Radix Dialog's open state now\n  registered); structural violations must be ZERO",
     "pages × desktop + phone + the anon family × both widths +\n  the drawer-open state + session-172's dialog-open family (the five\n  create dialogs + the contact edit dialog — the closed-by-default\n  genus a page scan never sees; session-199's register-coverage closure\n  added the Edit Lead + Edit Account siblings + the Import/Insights/\n  Save-Report standalone dialogs — every Radix Dialog's open state now\n  registered; session-200's page-surface closure added the /about +\n  /contact marketing interiors + the /reset-password anon surface —\n  every renderable page surface registered at both widths); structural\n  violations must be ZERO",
     "the a11y family description (the s200 closure)")

# --- PAD ----------------------------------------------------------------------
flip("Project_Architecture_Document.md",
     "│   └── e2e/                     # global-setup, auth.setup, 11 spec files + setup project — 200 checks",
     "│   └── e2e/                     # global-setup, auth.setup, 11 spec files + setup project — 206 checks",
     "the file tree (e2e)")
flip("Project_Architecture_Document.md",
     "# 138 Vitest suites — 2822 checks",
     "# 138 Vitest suites — 2827 checks",
     "the tree")
flip("Project_Architecture_Document.md",
     "| **Total** | **138** | **2822 unit + 200 e2e** | | |",
     "| **Total** | **138** | **2827 unit + 206 e2e** | | |",
     "the Total row")
flip("Project_Architecture_Document.md",
     "> HEAD: 138 Vitest suites with 2822 checks + 200 e2e checks in 11 spec",
     "> HEAD: 138 Vitest suites with 2827 checks + 206 e2e checks in 11 spec",
     "the HEAD line")
flip("Project_Architecture_Document.md",
     "- [ ] `bun run test` — 2822/2822",
     "- [ ] `bun run test` — 2827/2827",
     "the checklist (unit)")
flip("Project_Architecture_Document.md",
     "- [ ] `bun run test:e2e` — 200/200",
     "- [ ] `bun run test:e2e` — 206/206",
     "the checklist (e2e)")
flip("Project_Architecture_Document.md",
     "| `bun run test` | root | 2822 unit checks |",
     "| `bun run test` | root | 2827 unit checks |",
     "the commands table (unit)")
flip("Project_Architecture_Document.md",
     "| `bun run test:e2e` | root | 200 browser checks (build first) |",
     "| `bun run test:e2e` | root | 206 browser checks (build first) |",
     "the commands table (e2e)")
flip("Project_Architecture_Document.md",
     "| `tests/e2e/a11y.spec.ts` | 526 | the s171 a11y two-gate e2e battery + the s172 dialog-open family + the s195 404 pair + the s199 register-coverage closure (the §8.3 axe engine: 9 CRM pages × 2 widths + 3 anon surfaces × 2 + the drawer-open state + the five create dialogs + the contact edit dialog + the 404 surface at both widths + the Edit Lead + Edit Account siblings + the Import Contacts + Account Insights + Save Custom Report View dialogs; structural zero + the sanctioned citations) |",
     "| `tests/e2e/a11y.spec.ts` | 593 | the s171 a11y two-gate e2e battery + the s172 dialog-open family + the s195 404 pair + the s199 register-coverage closure + the s200 page-surface closure (the §8.3 axe engine: 9 CRM pages × 2 widths + the anon family × 2 + the drawer-open state + the five create dialogs + the contact edit dialog + the 404 surface at both widths + the Edit Lead + Edit Account siblings + the Import Contacts + Account Insights + Save Custom Report View dialogs + the /about + /contact marketing interiors + the /reset-password anon surface at both widths; structural zero + the sanctioned citations) |",
     "the §11 a11y row (the line census + the family)")
flip("Project_Architecture_Document.md",
     "| `tests/dialog-controls.test.ts` | 236 | the s172 dialog-surface named-control battery (the 136th suite — the create-dialog trigger census + the edit-dialog htmlFor/id wiring pins + the dialog-scan spec contract + the declared fast-check pin + the session-199 register-coverage closure pins) |",
     "| `tests/dialog-controls.test.ts` | 306 | the s172 dialog-surface named-control battery (the 136th suite — the create-dialog trigger census + the edit-dialog htmlFor/id wiring pins + the dialog-scan spec contract + the declared fast-check pin + the session-199 register-coverage closure pins + the session-200 page-surface closure pins) |",
     "the §11 dialog-controls row (the line census + the s200 pins)")

# --- SKILL (the live command/appendix sites only — the demoted s199 layer
#     keeps its ship counts) ----------------------------------------------------
flip("neo-crm_SKILL.md",
     "bun run test         # 2822/2822",
     "bun run test         # 2827/2827",
     "the commands block (unit)")
flip("neo-crm_SKILL.md",
     "bun run test:e2e     # 200/200 (build first; boots :3100 with db/e2e.db)",
     "bun run test:e2e     # 206/206 (build first; boots :3100 with db/e2e.db)",
     "the commands block (e2e)")
flip("neo-crm_SKILL.md",
     "| **unit total** | 138 files | **2822** |",
     "| **unit total** | 138 files | **2827** |",
     "the Appendix B unit total")
flip("neo-crm_SKILL.md",
     "| e2e a11y two-gate (the s171 §8.3 axe battery: 9 CRM pages × 2 widths + 3 anon × 2 + the drawer-open + the s172 dialog-open family: the five create dialogs + the contact edit dialog + the s195 404 pair + the s199 register-coverage closure: the Edit Lead + Edit Account siblings + the Import/Insights/Save-Report standalone dialogs) | `tests/e2e/a11y.spec.ts` | 38 | — |",
     "| e2e a11y two-gate (the s171 §8.3 axe battery: 9 CRM pages × 2 widths + the anon family × 2 + the drawer-open + the s172 dialog-open family: the five create dialogs + the contact edit dialog + the s195 404 pair + the s199 register-coverage closure: the Edit Lead + Edit Account siblings + the Import/Insights/Save-Report standalone dialogs + the s200 page-surface closure: the /about + /contact marketing interiors + the /reset-password anon surface) | `tests/e2e/a11y.spec.ts` | 44 | — |",
     "the Appendix B a11y row (the census + the family)")
flip("neo-crm_SKILL.md",
     "| **e2e total** | 11 spec files + the setup project | **200** |",
     "| **e2e total** | 11 spec files + the setup project | **206** |",
     "the Appendix B e2e total")

# --- tests/docs-counts.test.ts: the constants + the layer-axis -------------
flip("tests/docs-counts.test.ts",
     "const UNIT = 2822;",
     "const UNIT = 2827;",
     "the UNIT constant")
flip("tests/docs-counts.test.ts",
     "const E2E = 200;",
     "const E2E = 206;",
     "the E2E constant")
flip("tests/docs-counts.test.ts",
     "green; the session-199 layer`,",
     "green; the session-200 layer`,",
     "the layer-axis first (the ${UNIT}/${E2E} templates carry 2827/206)")
flip("tests/docs-counts.test.ts",
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s198 layer now beneath the s199 head)",\n    ).toContain(\n      "+ beneath it 2817 unit checks + 195 e2e checks green; the session-198 layer (THE ADVISORIES RE-TRIAGE",',
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s199 layer now beneath the s200 head)",\n    ).toContain(\n      "+ beneath it 2822 unit checks + 200 e2e checks green; the session-199 layer (THE A11Y REGISTER\'S DIALOG-OPEN",',
     "the layer-axis second (the s199 layer at its ship 2822/200)")

# --- tests/docs-counts.test.ts: the 2822 negatives join the block ---------
NEG_ANCHOR = '    expect(skill).not.toContain("| **unit total** | 138 files | **2817**");'
NEG_ADDITION = '''    // Session-200 (D-200a1/a2): the retired 2822 site-forms join the
    // negatives (the s192 doctrine: the OLD live form joins the negatives)
    expect(readme).not.toMatch(/# 2822 Vitest unit checks/);
    expect(readme).not.toMatch(/# 138 Vitest suites \\(2822 checks\\)/);
    expect(readme).not.toMatch(/\\| 🧪 Tested \\| 2822 Vitest unit checks/);
    expect(pad).not.toMatch(/# 138 Vitest suites — 2822 checks/);
    expect(pad).not.toMatch(/— 2822\\/2822/);
    expect(pad).not.toMatch(/\\| \\*\\*Total\\*\\* \\| \\*\\*138\\*\\* \\| \\*\\*2822 unit/);
    expect(claude).not.toContain("Unit (Vitest, 2822 checks)");
    expect(claude).not.toContain("(currently 2822)");
    expect(claude).not.toContain("Vitest unit suites (2822 checks)");
    expect(claude).not.toContain("`bun run test` (2822)");
    expect(agents).not.toContain("|  Unit tests (2822 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2822**");'''
p = ROOT / "tests/docs-counts.test.ts"
t = p.read_text(encoding="utf8")
if "the retired 2822 site-forms join the" in t:
    print("  no-op  [tests/docs-counts.test.ts] the 2822 negatives")
else:
    n = t.count(NEG_ANCHOR)
    assert n == 1, f"the negatives anchor found {n} times"
    t = t.replace(NEG_ANCHOR, NEG_ADDITION, 1)
    p.write_text(t, encoding="utf8")
    print("  flip   [tests/docs-counts.test.ts] the 2822 negatives join the block")

# --- tests/dialog-geometry-parity.test.ts: the F-92a3 ladder -------------------
# (the negatives' no-op check uses the unique +5 marker — the new form
#  CONTAINS the old as a prefix, so the generic substring no-op would
#  re-flip forever; the marker check is the true idempotent guard)
_dg = ROOT / "tests/dialog-geometry-parity.test.ts"
_dt = _dg.read_text(encoding="utf8")
_DG200_DONE = "the retired form joins the negatives (the D-200a1/a2 dialog-controls +5)" in _dt and "the retired form joins the negatives ladder (the D-200a1/a2 dialog-controls +5)" in _dt
for old, new, label in [
    ('expect(claude).toContain("Unit (Vitest, 2822 checks)")',
     'expect(claude).toContain("Unit (Vitest, 2827 checks)")',
     "the F-92a3 pyramid positive"),
    ('expect(claude).toContain("(currently 2822)")',
     'expect(claude).toContain("(currently 2827)")',
     "the F-92a3 coverage-seam positive"),
    ('expect(claude).toContain("Vitest unit suites (2822 checks)")',
     'expect(claude).toContain("Vitest unit suites (2827 checks)")',
     "the F-92a3 commands positive"),
    ('expect(claude).toContain("`bun run test` (2822)")',
     'expect(claude).toContain("`bun run test` (2827)")',
     "the F-92a3 gate-order positive"),
    ('expect(claude).not.toContain("Unit (Vitest, 2817 checks)"); // session-199: the retired form joins the negatives (the D-199a1/a2 dialog-controls +5)',
     'expect(claude).not.toContain("Unit (Vitest, 2817 checks)"); // session-199: the retired form joins the negatives (the D-199a1/a2 dialog-controls +5)\n    expect(claude).not.toContain("Unit (Vitest, 2822 checks)"); // session-200: the retired form joins the negatives (the D-200a1/a2 dialog-controls +5)',
     "the F-92a3 pyramid negative"),
    ('expect(claude).not.toContain("(currently 2817)"); // session-199: the retired form joins the negatives ladder (the D-199a1/a2 dialog-controls +5)',
     'expect(claude).not.toContain("(currently 2817)"); // session-199: the retired form joins the negatives ladder (the D-199a1/a2 dialog-controls +5)\n    expect(claude).not.toContain("(currently 2822)"); // session-200: the retired form joins the negatives ladder (the D-200a1/a2 dialog-controls +5)',
     "the F-92a3 coverage-seam negative"),
    ('expect(claude).not.toContain("Vitest unit suites (2817 checks)"); // session-199: the retired form joins the negatives ladder (the D-199a1/a2 dialog-controls +5)',
     'expect(claude).not.toContain("Vitest unit suites (2817 checks)"); // session-199: the retired form joins the negatives ladder (the D-199a1/a2 dialog-controls +5)\n    expect(claude).not.toContain("Vitest unit suites (2822 checks)"); // session-200: the retired form joins the negatives ladder (the D-200a1/a2 dialog-controls +5)',
     "the F-92a3 commands negative"),
    ('expect(claude).not.toContain("`bun run test` (2817)"); // session-199: the retired form joins the negatives ladder (the D-199a1/a2 dialog-controls +5)',
     'expect(claude).not.toContain("`bun run test` (2817)"); // session-199: the retired form joins the negatives ladder (the D-199a1/a2 dialog-controls +5)\n    expect(claude).not.toContain("`bun run test` (2822)"); // session-200: the retired form joins the negatives ladder (the D-200a1/a2 dialog-controls +5)',
     "the F-92a3 gate-order negative"),
]:
    if _DG200_DONE and "(the D-200a1/a2 dialog-controls +5)" in new:
        print(f"  no-op  [tests/dialog-geometry-parity.test.ts] {label} (the +5 marker present)")
        continue
    flip("tests/dialog-geometry-parity.test.ts", old, new, label)

# --- tests/login-family-parity.test.ts: the E2E negatives ladder --------------
flip("tests/login-family-parity.test.ts",
     '    expect(src).not.toContain("**E2E (Playwright, 195 checks)**");\n    expect(src).toContain("**E2E (Playwright, 200 checks)**");',
     '    expect(src).not.toContain("**E2E (Playwright, 195 checks)**");\n    // session-200 lockstep carry-forward: 200 -> 206 (the D-200a1\n    // page-surface registrations — the three un-registered surfaces;\n    // the retired form joins its negatives, the doctrine unchanged).\n    expect(src).not.toContain("**E2E (Playwright, 200 checks)**");\n    expect(src).toContain("**E2E (Playwright, 206 checks)**");',
     "the login-family E2E ladder")

print("count-ladder-200.py done")
