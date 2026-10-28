#!/usr/bin/env python3
"""count-ladder-196.py — the session-196 count-ladder flip script.

The house form (assert-first, idempotent, unique-anchor): every site is
asserted to carry EXACTLY ONE of the accepted old forms before the
flip; a site already carrying the new form is a verified no-op; a site
carrying NONE is a hard error (the anchor drifted — re-derive, never
guess).

The full ladder: UNIT 2811 HELD · SUITES 138 HELD · E2E 194 -> 195
(+1 — the D-196a1 drawer-open spine registration: the rendered
interior-geometry freeze in tests/e2e/mobile-navigation.spec.ts, the
walk50 re-walk's genuine battery gap). The mobile-nav spec's own census
10 -> 11 (MOBILE_NAV_E2E + the seven doc sites + the inventory-census
Bug #1 line + the SKILL Appendix B row). badge 3005 -> 3006 (the
unit+e2e arithmetic: 2811+195).

The HEAD surgery (skill-head-196.py) ran FIRST — the SKILL head's live
layer already carries 2811/195, so this ladder has NO head flip (the
s188 lesson: a ladder old-form must NEVER match a retired block's ship
line — the demoted s195 block keeps `2811 unit checks + 194 e2e checks
… the session-195 layer` in its comment block, and that form is absent
from the accepted old-forms below by design).

The s196 re-anchor wrinkle: the mobile-nav census flip 10 -> 11 makes
the s147-miscount 11-check negatives (the docs-counts s165 ladder)
the LIVE form — those test-side re-anchors are edited separately from
this ladder (the docs-counts negatives block + the inventory-census
checks pin + the login-family negatives ladder + the layer-axis pair).
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

flips = 0


def flip(path: str, olds: list[str], new: str, count: int = 1, label: str = "") -> None:
    """Flip a site carrying one of the accepted old forms to the new form."""
    global flips
    p = ROOT / path
    text = p.read_text(encoding="utf8")
    if text.count(new) >= count and sum(text.count(o) for o in olds) == 0:
        print(f"  no-op  [{label or path}] already {new!r}")
        return
    for old in olds:
        found = text.count(old)
        if found == count:
            p.write_text(text.replace(old, new), encoding="utf8")
            flips += 1
            print(f"  flip   [{label or path}] {old!r} -> {new!r} ({count} site(s))")
            return
    raise SystemExit(f"  ERROR  [{label or path}] no accepted old form found (drifted anchor)")


# --- tests/docs-counts.test.ts — the two constants ---------------------------
flip(
    "tests/docs-counts.test.ts",
    ["const E2E = 194;"],
    "const E2E = 195;",
    1,
    "docs-counts E2E constant",
)
flip(
    "tests/docs-counts.test.ts",
    ["const MOBILE_NAV_E2E = 10;"],
    "const MOBILE_NAV_E2E = 11;",
    1,
    "docs-counts MOBILE_NAV_E2E constant",
)

# --- README.md ---------------------------------------------------------------
flip("README.md", ["tests-3005%20checks"], "tests-3006%20checks", 1, "README badge")
flip(
    "README.md",
    ["| 🧪 Tested | 2811 Vitest unit checks + 194 Playwright E2E checks"],
    "| 🧪 Tested | 2811 Vitest unit checks + 195 Playwright E2E checks",
    1,
    "README Tested row count",
)
flip("README.md", ["# 194 Playwright checks"], "# 195 Playwright checks", 1, "README tree e2e line")
flip("README.md", ["Playwright (194 checks)"], "Playwright (195 checks)", 1, "README commands e2e line")
flip(
    "README.md",
    ["a 10-check mobile-nav regression suite"],
    "a 11-check mobile-nav regression suite",
    1,
    "README Tested-row mobile-nav suite",
)
flip(
    "README.md",
    ["and the 10-check\nmobile-navigation regression suite"],
    "and the 11-check\nmobile-navigation regression suite",
    1,
    "README walk-contracts mobile-nav line",
)

# --- AGENTS.md ---------------------------------------------------------------
flip("AGENTS.md", ["Browser E2E (194 checks)"], "Browser E2E (195 checks)", 1, "AGENTS commands e2e row")
flip(
    "AGENTS.md",
    ["`bun run test:e2e` (194) — or the one-command"],
    "`bun run test:e2e` (195) — or the one-command",
    1,
    "AGENTS gate-order e2e",
)
flip(
    "AGENTS.md",
    ["`tests/e2e/mobile-navigation.spec.ts` (10 checks, 390/700px"],
    "`tests/e2e/mobile-navigation.spec.ts` (11 checks, 390/700px",
    1,
    "AGENTS architecture-facts mobile-nav line",
)

# --- CLAUDE.md ---------------------------------------------------------------
flip(
    "CLAUDE.md",
    ["`bun run test` (2811) → `bun run build` → `bun run test:e2e` (194)"],
    "`bun run test` (2811) → `bun run build` → `bun run test:e2e` (195)",
    1,
    "CLAUDE gate-order line",
)
flip(
    "CLAUDE.md",
    ["Playwright E2E (194 checks, needs build first)"],
    "Playwright E2E (195 checks, needs build first)",
    1,
    "CLAUDE commands e2e row",
)
flip(
    "CLAUDE.md",
    ["**E2E (Playwright, 194 checks)**"],
    "**E2E (Playwright, 195 checks)**",
    1,
    "CLAUDE test pyramid e2e",
)
flip(
    "CLAUDE.md",
    ["`mobile-navigation.spec.ts` (10-check regression suite for the drawer —"],
    "`mobile-navigation.spec.ts` (11-check regression suite for the drawer —",
    1,
    "CLAUDE mobile-nav suite line",
)

# --- Project_Architecture_Document.md ----------------------------------------
flip(
    "Project_Architecture_Document.md",
    ["setup project — 194 checks"],
    "setup project — 195 checks",
    1,
    "PAD tree e2e line",
)
flip(
    "Project_Architecture_Document.md",
    ["| **Total** | **138** | **2811 unit + 194 e2e** | | |"],
    "| **Total** | **138** | **2811 unit + 195 e2e** | | |",
    1,
    "PAD §10 total row",
)
flip(
    "Project_Architecture_Document.md",
    ["HEAD: 138 Vitest suites with 2811 checks + 194 e2e"],
    "HEAD: 138 Vitest suites with 2811 checks + 195 e2e",
    1,
    "PAD §10 HEAD line",
)
flip(
    "Project_Architecture_Document.md",
    ["`bun run test:e2e` — 194/194"],
    "`bun run test:e2e` — 195/195",
    1,
    "PAD checklist e2e",
)
flip(
    "Project_Architecture_Document.md",
    ["| `bun run test:e2e` | root | 194 browser checks"],
    "| `bun run test:e2e` | root | 195 browser checks",
    1,
    "PAD §9 commands e2e",
)
flip(
    "Project_Architecture_Document.md",
    ["`tests/e2e/mobile-navigation.spec.ts` (10 checks, 390/700px viewports)."],
    "`tests/e2e/mobile-navigation.spec.ts` (11 checks, 390/700px viewports).",
    1,
    "PAD mobile-nav spec line",
)
flip(
    "Project_Architecture_Document.md",
    ["10-check mobile drawer regression suite"],
    "11-check mobile drawer regression suite",
    1,
    "PAD §11 census-table mobile-nav row",
)

# --- neo-crm_SKILL.md — the count sites (the head project_state is NOT
# here: the head surgery already wrote the 2811/195 live layer, and the
# demoted s195 block's ship line must never match an old form) --------------
flip(
    "neo-crm_SKILL.md",
    ["bun run test:e2e     # 194/194"],
    "bun run test:e2e     # 195/195",
    1,
    "SKILL commands e2e",
)
flip(
    "neo-crm_SKILL.md",
    ["| **e2e total** | 11 spec files + the setup project | **194** |"],
    "| **e2e total** | 11 spec files + the setup project | **195** |",
    1,
    "SKILL Appendix B e2e total",
)
flip(
    "neo-crm_SKILL.md",
    ["e2e ~6 m (194\nchecks"],
    "e2e ~6 m (195\nchecks",
    1,
    "SKILL wall-clock phrase",
)
flip(
    "neo-crm_SKILL.md",
    ["`tests/e2e/mobile-navigation.spec.ts` (10 checks, 390/700px viewports) is the regression suite."],
    "`tests/e2e/mobile-navigation.spec.ts` (11 checks, 390/700px viewports) is the regression suite.",
    1,
    "SKILL mobile-nav spec line",
)
flip(
    "neo-crm_SKILL.md",
    ["drawer + 10-check e2e suite."],
    "drawer + 11-check e2e suite.",
    1,
    "SKILL Bug #1 mobile-nav line",
)
flip(
    "neo-crm_SKILL.md",
    [
        "| e2e mobile nav regression (incl. focus entry) | `tests/e2e/mobile-navigation.spec.ts` | 10 | — |"
    ],
    "| e2e mobile nav regression (incl. focus entry) | `tests/e2e/mobile-navigation.spec.ts` | 11 | — |",
    1,
    "SKILL Appendix B mobile-nav row",
)

print(f"\ncount-ladder-196: {flips} flip(s) — the docs land on 2811/195 (badge 3006)")
