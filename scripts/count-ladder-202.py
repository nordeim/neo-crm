#!/usr/bin/env python3
"""count-ladder-202.py — the UNIT 2832 -> 2837 + E2E 217 -> 223 + badge
3049 -> 3060 lockstep.

The s165 assert-first form: every flip asserts the OLD form is UNIQUE
before replacing; a re-run is a verified no-op (the new form present ->
skip). The historical record sites (the AGENTS Session-201 section, the
PAD s201 inventory row, the SKILL's demoted s201 layer) keep their
ship-time counts by doctrine — only the LIVE-tense sites flip.

Sites (the doc flips + the test-side re-anchors in the same stroke):
  README  badge + Tested row + tree + commands + the e2e tree/commands
  AGENTS  commands (unit + e2e) + gate-order (unit + e2e)
  CLAUDE  gate-order + commands (unit + e2e) + pyramid (unit + e2e)
          + the coverage seam + the a11y family description (the s202
          closure: the login card's three in-card view states
          registered at both widths — the client-state arm)
  PAD     tree (unit + e2e) + Total + HEAD + checklist (unit + e2e)
          + commands (unit + e2e) + the §11 a11y row (the line census
          764 -> 881 + the family) + the §11 dialog-controls row (391
          -> 510 + the s202 pins)
  SKILL   commands (unit + e2e) + Appendix B (unit total + the a11y row
          55 -> 61 + the e2e total)
  tests/docs-counts.test.ts        the UNIT + E2E constants + the
                                   layer-axis pair + the 2832 negatives
  tests/dialog-geometry-parity     the four F-92a3 live positives + the
                                   2832 negatives (4 assertions join)
  tests/login-family-parity        the E2E 217 negative joins + the live
                                   positive re-anchored 223
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
flip("README.md", "tests-3049%20checks", "tests-3060%20checks", "the badge (2837+223)")
flip("README.md",
     "| 🧪 Tested | 2832 Vitest unit checks + 217 Playwright E2E checks,",
     "| 🧪 Tested | 2837 Vitest unit checks + 223 Playwright E2E checks,",
     "the Tested row")
flip("README.md",
     "# 138 Vitest suites (2832 checks)",
     "# 138 Vitest suites (2837 checks)",
     "the tree")
flip("README.md",
     "# 2832 Vitest unit checks",
     "# 2837 Vitest unit checks",
     "the commands")
# the s102-P1 lockstep tree/commands sites (flipped only when E2E moves):
flip("README.md",
     "│   └── 📂 e2e/                       # Playwright (217 checks)",
     "│   └── 📂 e2e/                       # Playwright (223 checks)",
     "the file tree (e2e)")
flip("README.md",
     "bun run test:e2e      # 217 Playwright checks on :3100 with its own db/e2e.db",
     "bun run test:e2e      # 223 Playwright checks on :3100 with its own db/e2e.db",
     "the commands comment (e2e)")

# --- AGENTS (the live command/gate sites only — the Session-201 section is
#     the historical record, its ship counts stay) -----------------------------
flip("AGENTS.md",
     "|  Unit tests (2832 checks)      | `bun run test`",
     "|  Unit tests (2837 checks)      | `bun run test`",
     "the commands table (unit)")
flip("AGENTS.md",
     "|  Browser E2E (217 checks)        | `bun run test:e2e`",
     "|  Browser E2E (223 checks)        | `bun run test:e2e`",
     "the commands table (e2e)")
flip("AGENTS.md",
     "`bun run test` (2832) → `bun run build`",
     "`bun run test` (2837) → `bun run build`",
     "the gate-order (unit)")
flip("AGENTS.md",
     "`bun run test:e2e` (217) — or the one-command `bun run gate`",
     "`bun run test:e2e` (223) — or the one-command `bun run gate`",
     "the gate-order (e2e)")

# --- CLAUDE -------------------------------------------------------------------
flip("CLAUDE.md",
     "`bun run test` (2832) → `bun run build` → `bun run test:e2e` (217)",
     "`bun run test` (2837) → `bun run build` → `bun run test:e2e` (223)",
     "the gate-order")
flip("CLAUDE.md",
     "| `bun run test`      | Vitest unit suites (2832 checks)",
     "| `bun run test`      | Vitest unit suites (2837 checks)",
     "the commands table (unit)")
flip("CLAUDE.md",
     "| `bun run test:e2e`  | Playwright E2E (217 checks, needs build first) |",
     "| `bun run test:e2e`  | Playwright E2E (223 checks, needs build first) |",
     "the commands table (e2e)")
flip("CLAUDE.md",
     "Unit (Vitest, 2832 checks)",
     "Unit (Vitest, 2837 checks)",
     "the pyramid (unit)")
flip("CLAUDE.md",
     "**E2E (Playwright, 217 checks)**",
     "**E2E (Playwright, 223 checks)**",
     "the pyramid (e2e)")
flip("CLAUDE.md",
     "the seam (currently 2832).",
     "the seam (currently 2837).",
     "the coverage seam")
flip("CLAUDE.md",
     "  /contact marketing interiors + the /reset-password anon surface —\n"
     "  every renderable page surface registered at both widths); structural",
     "  /contact marketing interiors + the /reset-password anon surface —\n"
     "  every renderable page surface registered at both widths; session-202's\n"
     "  client-state closure registered the login card's three in-card view\n"
     "  states (reset/sent/verify) at both widths — every LoginView state the\n"
     "  machine names rides the two-gate, the criterion's state axis held by\n"
     "  its state-machine census pin); structural",
     "the a11y family description (the s202 closure)")

# --- PAD ----------------------------------------------------------------------
flip("Project_Architecture_Document.md",
     "│   └── e2e/                     # global-setup, auth.setup, 11 spec files + setup project — 217 checks",
     "│   └── e2e/                     # global-setup, auth.setup, 11 spec files + setup project — 223 checks",
     "the file tree (e2e)")
flip("Project_Architecture_Document.md",
     "# 138 Vitest suites — 2832 checks",
     "# 138 Vitest suites — 2837 checks",
     "the tree")
flip("Project_Architecture_Document.md",
     "| **Total** | **138** | **2832 unit + 217 e2e** | | |",
     "| **Total** | **138** | **2837 unit + 223 e2e** | | |",
     "the Total row")
flip("Project_Architecture_Document.md",
     "> HEAD: 138 Vitest suites with 2832 checks + 217 e2e checks in 11 spec",
     "> HEAD: 138 Vitest suites with 2837 checks + 223 e2e checks in 11 spec",
     "the HEAD line")
flip("Project_Architecture_Document.md",
     "- [ ] `bun run test` — 2832/2832",
     "- [ ] `bun run test` — 2837/2837",
     "the checklist (unit)")
flip("Project_Architecture_Document.md",
     "- [ ] `bun run test:e2e` — 217/217",
     "- [ ] `bun run test:e2e` — 223/223",
     "the checklist (e2e)")
flip("Project_Architecture_Document.md",
     "| `bun run test` | root | 2832 unit checks |",
     "| `bun run test` | root | 2837 unit checks |",
     "the commands table (unit)")
flip("Project_Architecture_Document.md",
     "| `bun run test:e2e` | root | 217 browser checks (build first) |",
     "| `bun run test:e2e` | root | 223 browser checks (build first) |",
     "the commands table (e2e)")
flip("Project_Architecture_Document.md",
     "| `tests/e2e/a11y.spec.ts` | 764 | the s171 a11y two-gate e2e battery + the s172 dialog-open family + the s195 404 pair + the s199 register-coverage closure + the s200 page-surface closure + the s201 width-scope closure (the §8.3 axe engine: 9 CRM pages × 2 widths + the anon family × 2 + the drawer-open state + the five create dialogs + the contact edit dialog + the 404 surface at both widths + the Edit Lead + Edit Account siblings + the Import Contacts + Account Insights + Save Custom Report View dialogs + the /about + /contact marketing interiors + the /reset-password anon surface at both widths + the eleven phone dialog-open twins at 390×844 — every Radix Dialog's open state registered at BOTH widths, the register's head criterion held by its width-pair census pin; the open-dialog scan mechanics decoded: GATE 1 sees the dialog content only [hideOthers aria-hides the app root], GATE 2 cites the painted page behind; structural zero + the sanctioned citations) |",
     "| `tests/e2e/a11y.spec.ts` | 881 | the s171 a11y two-gate e2e battery + the s172 dialog-open family + the s195 404 pair + the s199 register-coverage closure + the s200 page-surface closure + the s201 width-scope closure + the s202 client-state closure (the §8.3 axe engine: 9 CRM pages × 2 widths + the anon family × 2 + the drawer-open state + the five create dialogs + the contact edit dialog + the 404 surface at both widths + the Edit Lead + Edit Account siblings + the Import Contacts + Account Insights + Save Custom Report View dialogs + the /about + /contact marketing interiors + the /reset-password anon surface at both widths + the eleven phone dialog-open twins at 390×844 — every Radix Dialog's open state registered at BOTH widths + the login card's three in-card view states (reset/sent/verify) at both widths — every LoginView state the machine names rides the two-gate, the register's head criterion held on the state axis by its state-machine census pin; the open-dialog scan mechanics decoded: GATE 1 sees the dialog content only [hideOthers aria-hides the app root], GATE 2 cites the painted page behind; the view rides: the sent view's demo-email forgot-password POST renders the resetUrl anchor [the in-app delivery, the richer face], the verify view's in-card signup ladder on a throwaway email; structural zero + the sanctioned citations) |",
     "the §11 a11y row (the line census + the family)")
flip("Project_Architecture_Document.md",
     "| `tests/dialog-controls.test.ts` | 391 | the s172 dialog-surface named-control battery (the 136th suite — the create-dialog trigger census + the edit-dialog htmlFor/id wiring pins + the dialog-scan spec contract + the declared fast-check pin + the session-199 register-coverage closure pins + the session-200 page-surface closure pins + the session-201 width-scope closure pins [the containment pair + the phone census + the width-pair census + the criterion pair]) |",
     "| `tests/dialog-controls.test.ts` | 514 | the s172 dialog-surface named-control battery (the 136th suite — the create-dialog trigger census + the edit-dialog htmlFor/id wiring pins + the dialog-scan spec contract + the declared fast-check pin + the session-199 register-coverage closure pins + the session-200 page-surface closure pins + the session-201 width-scope closure pins [the containment pair + the phone census + the width-pair census + the criterion pair] + the session-202 client-state closure pins [the containment pair + the client-state census + the state-machine census + the state-pair census; the s200 (g) page-family census re-anchored to subtract BOTH non-page families]) |",
     "the §11 dialog-controls row (the line census + the s202 pins)")

# --- SKILL (the live command/appendix sites only — the demoted s201 layer
#     keeps its ship counts) ----------------------------------------------------
flip("neo-crm_SKILL.md",
     "bun run test         # 2832/2832",
     "bun run test         # 2837/2837",
     "the commands block (unit)")
flip("neo-crm_SKILL.md",
     "bun run test:e2e     # 217/217 (build first; boots :3100 with db/e2e.db)",
     "bun run test:e2e     # 223/223 (build first; boots :3100 with db/e2e.db)",
     "the commands block (e2e)")
flip("neo-crm_SKILL.md",
     "| **unit total** | 138 files | **2832** |",
     "| **unit total** | 138 files | **2837** |",
     "the Appendix B unit total")
flip("neo-crm_SKILL.md",
     "| e2e a11y two-gate (the s171 §8.3 axe battery: 9 CRM pages × 2 widths + the anon family × 2 + the drawer-open + the s172 dialog-open family: the five create dialogs + the contact edit dialog + the s195 404 pair + the s199 register-coverage closure: the Edit Lead + Edit Account siblings + the Import/Insights/Save-Report standalone dialogs + the s200 page-surface closure: the /about + /contact marketing interiors + the /reset-password anon surface + the s201 width-scope closure: the eleven phone dialog-open twins — every Radix Dialog's open state registered at both widths) | `tests/e2e/a11y.spec.ts` | 55 | — |",
     "| e2e a11y two-gate (the s171 §8.3 axe battery: 9 CRM pages × 2 widths + the anon family × 2 + the drawer-open + the s172 dialog-open family: the five create dialogs + the contact edit dialog + the s195 404 pair + the s199 register-coverage closure: the Edit Lead + Edit Account siblings + the Import/Insights/Save-Report standalone dialogs + the s200 page-surface closure: the /about + /contact marketing interiors + the /reset-password anon surface + the s201 width-scope closure: the eleven phone dialog-open twins — every Radix Dialog's open state registered at both widths + the s202 client-state closure: the login card's three in-card view states (reset/sent/verify) at both widths — every LoginView state the machine names rides the two-gate) | `tests/e2e/a11y.spec.ts` | 61 | — |",
     "the Appendix B a11y row (the census + the family)")
flip("neo-crm_SKILL.md",
     "| **e2e total** | 11 spec files + the setup project | **217** |",
     "| **e2e total** | 11 spec files + the setup project | **223** |",
     "the Appendix B e2e total")

# --- tests/docs-counts.test.ts: the constants + the layer-axis -------------
flip("tests/docs-counts.test.ts",
     "const UNIT = 2832;",
     "const UNIT = 2837;",
     "the UNIT constant")
flip("tests/docs-counts.test.ts",
     "const E2E = 217;",
     "const E2E = 223;",
     "the E2E constant")
flip("tests/docs-counts.test.ts",
     "green; the session-201 layer`,",
     "green; the session-202 layer`,",
     "the layer-axis first (the ${UNIT}/${E2E} templates carry 2837/223)")
flip("tests/docs-counts.test.ts",
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s200 layer now beneath the s201 head)",\n    ).toContain(\n      "+ beneath it 2827 unit checks + 206 e2e checks green; the session-200 layer (THE A11Y REGISTER\'S PAGE-SURFACE",',
     '"the head\'s SECOND layer must be the previous session\'s — the F-108a1 face (the s201 layer now beneath the s202 head)",\n    ).toContain(\n      "+ beneath it 2832 unit checks + 217 e2e checks green; the session-201 layer (THE A11Y REGISTER\'S PHONE-WIDTH",',
     "the layer-axis second (the s201 layer at its ship 2832/217)")

# --- tests/docs-counts.test.ts: the 2832 negatives join the block ---------
NEG_ANCHOR = '    expect(skill).not.toContain("| **unit total** | 138 files | **2827**");'
NEG_ADDITION = '''    expect(skill).not.toContain("| **unit total** | 138 files | **2827**");
    // Session-202 (D-202a1/a2): the retired 2832 site-forms join the
    // negatives (the s192 doctrine: the OLD live form joins the negatives)
    expect(readme).not.toMatch(/# 2832 Vitest unit checks/);
    expect(readme).not.toMatch(/# 138 Vitest suites \\(2832 checks\\)/);
    expect(readme).not.toMatch(/\\| 🧪 Tested \\| 2832 Vitest unit checks/);
    expect(pad).not.toMatch(/# 138 Vitest suites — 2832 checks/);
    expect(pad).not.toMatch(/— 2832\\/2832/);
    expect(pad).not.toMatch(/\\| \\*\\*Total\\*\\* \\| \\*\\*138\\*\\* \\| \\*\\*2832 unit/);
    expect(claude).not.toContain("Unit (Vitest, 2832 checks)");
    expect(claude).not.toContain("(currently 2832)");
    expect(claude).not.toContain("Vitest unit suites (2832 checks)");
    expect(claude).not.toContain("`bun run test` (2832)");
    expect(agents).not.toContain("|  Unit tests (2832 checks)");
    expect(skill).not.toContain("| **unit total** | 138 files | **2832**");'''
p = ROOT / "tests/docs-counts.test.ts"
t = p.read_text(encoding="utf8")
if "the retired 2832 site-forms join the" in t:
    print("  no-op  [tests/docs-counts.test.ts] the 2832 negatives")
else:
    n = t.count(NEG_ANCHOR)
    assert n == 1, f"the negatives anchor found {n} times"
    t = t.replace(NEG_ANCHOR, NEG_ADDITION, 1)
    p.write_text(t, encoding="utf8")
    print("  flip   [tests/docs-counts.test.ts] the 2832 negatives join the block")

# --- tests/dialog-geometry-parity.test.ts: the F-92a3 ladder -------------------
# (the negatives' no-op check uses the unique +5 marker — the new form
#  CONTAINS the old as a prefix, so the generic substring no-op would
#  re-flip forever; the marker check is the true idempotent guard)
_dg = ROOT / "tests/dialog-geometry-parity.test.ts"
_dt = _dg.read_text(encoding="utf8")
_DG202_DONE = "the retired form joins the negatives (the D-202a1/a2 dialog-controls +5)" in _dt and "the retired form joins the negatives ladder (the D-202a1/a2 dialog-controls +5)" in _dt
for old, new, label in [
    ('expect(claude).toContain("Unit (Vitest, 2832 checks)")',
     'expect(claude).toContain("Unit (Vitest, 2837 checks)")',
     "the F-92a3 pyramid positive"),
    ('expect(claude).toContain("(currently 2832)")',
     'expect(claude).toContain("(currently 2837)")',
     "the F-92a3 coverage-seam positive"),
    ('expect(claude).toContain("Vitest unit suites (2832 checks)")',
     'expect(claude).toContain("Vitest unit suites (2837 checks)")',
     "the F-92a3 commands positive"),
    ('expect(claude).toContain("`bun run test` (2832)")',
     'expect(claude).toContain("`bun run test` (2837)")',
     "the F-92a3 gate-order positive"),
    ('expect(claude).not.toContain("Unit (Vitest, 2827 checks)"); // session-201: the retired form joins the negatives (the D-201a1/a2 dialog-controls +5)',
     'expect(claude).not.toContain("Unit (Vitest, 2827 checks)"); // session-201: the retired form joins the negatives (the D-201a1/a2 dialog-controls +5)\n    expect(claude).not.toContain("Unit (Vitest, 2832 checks)"); // session-202: the retired form joins the negatives (the D-202a1/a2 dialog-controls +5)',
     "the F-92a3 pyramid negative"),
    ('expect(claude).not.toContain("(currently 2827)"); // session-201: the retired form joins the negatives ladder (the D-201a1/a2 dialog-controls +5)',
     'expect(claude).not.toContain("(currently 2827)"); // session-201: the retired form joins the negatives ladder (the D-201a1/a2 dialog-controls +5)\n    expect(claude).not.toContain("(currently 2832)"); // session-202: the retired form joins the negatives ladder (the D-202a1/a2 dialog-controls +5)',
     "the F-92a3 coverage-seam negative"),
    ('expect(claude).not.toContain("Vitest unit suites (2827 checks)"); // session-201: the retired form joins the negatives ladder (the D-201a1/a2 dialog-controls +5)',
     'expect(claude).not.toContain("Vitest unit suites (2827 checks)"); // session-201: the retired form joins the negatives ladder (the D-201a1/a2 dialog-controls +5)\n    expect(claude).not.toContain("Vitest unit suites (2832 checks)"); // session-202: the retired form joins the negatives ladder (the D-202a1/a2 dialog-controls +5)',
     "the F-92a3 commands negative"),
    ('expect(claude).not.toContain("`bun run test` (2827)"); // session-201: the retired form joins the negatives ladder (the D-201a1/a2 dialog-controls +5)',
     'expect(claude).not.toContain("`bun run test` (2827)"); // session-201: the retired form joins the negatives ladder (the D-201a1/a2 dialog-controls +5)\n    expect(claude).not.toContain("`bun run test` (2832)"); // session-202: the retired form joins the negatives ladder (the D-202a1/a2 dialog-controls +5)',
     "the F-92a3 gate-order negative"),
]:
    if _DG202_DONE and "(the D-202a1/a2 dialog-controls +5)" in new:
        print(f"  no-op  [tests/dialog-geometry-parity.test.ts] {label} (the +5 marker present)")
        continue
    flip("tests/dialog-geometry-parity.test.ts", old, new, label)

# --- tests/login-family-parity.test.ts: the E2E negatives ladder --------------
flip("tests/login-family-parity.test.ts",
     '    expect(src).not.toContain("**E2E (Playwright, 206 checks)**");\n    expect(src).toContain("**E2E (Playwright, 217 checks)**");',
     '    expect(src).not.toContain("**E2E (Playwright, 206 checks)**");\n    // session-202 lockstep carry-forward: 217 -> 223 (the D-202a1\n    // client-state registrations — the login card\'s three view states\n    // at both widths, the client-state arm; the retired form joins its\n    // negatives, the doctrine unchanged).\n    expect(src).not.toContain("**E2E (Playwright, 217 checks)**");\n    expect(src).toContain("**E2E (Playwright, 223 checks)**");',
     "the login-family E2E ladder")

print("count-ladder-202.py done")
