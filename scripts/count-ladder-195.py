#!/usr/bin/env python3
"""count-ladder-195.py — the session-195 count-ladder flip script.

The house form (assert-first, idempotent, unique-anchor): every site is
asserted to carry EXACTLY ONE of the accepted old forms before the
flip; a site already carrying the new form is a verified no-op; a site
carrying NONE is a hard error (the anchor drifted — re-derive, never
guess).

The full ladder: UNIT 2811 HELD · SUITES 138 HELD · E2E 192 -> 194
(+2 — the D-195a2 two-gate 404 registrations: the desktop + phone
scans of the one anon-reachable surface the 31-registration register
never adjudicated). The D-195a1 status freeze lands INSIDE the existing
S12-P2 e2e test (no census delta); the D-195a3 child-env scrubbing is
config-only. badge 3003 -> 3005 (the unit+e2e arithmetic: 2811+194).

The HEAD surgery (skill-head-195.py) ran FIRST — the SKILL head's live
layer already carries 2811/194, so this ladder has NO head flip (the
s188 lesson: a ladder old-form must NEVER match a retired block's ship
line — the demoted s194 block keeps `2811 unit checks + 192 e2e checks
… the session-194 layer` in its comment block, and that form is absent
from the accepted old-forms below by design).
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


# --- tests/docs-counts.test.ts — the E2E constant ---------------------------
flip(
    "tests/docs-counts.test.ts",
    ["const E2E = 192;"],
    "const E2E = 194;",
    1,
    "docs-counts E2E constant",
)

# --- README.md ---------------------------------------------------------------
flip("README.md", ["tests-3003%20checks"], "tests-3005%20checks", 1, "README badge")
flip(
    "README.md",
    ["| 🧪 Tested | 2811 Vitest unit checks + 192 Playwright E2E checks"],
    "| 🧪 Tested | 2811 Vitest unit checks + 194 Playwright E2E checks",
    1,
    "README Tested row count",
)
flip("README.md", ["Playwright (192 checks)"], "Playwright (194 checks)", 1, "README tree e2e line")
flip("README.md", ["# 192 Playwright checks"], "# 194 Playwright checks", 1, "README commands e2e line")

# --- AGENTS.md ---------------------------------------------------------------
flip("AGENTS.md", ["Browser E2E (192 checks)"], "Browser E2E (194 checks)", 1, "AGENTS commands e2e row")
flip(
    "AGENTS.md",
    ["`bun run test:e2e` (192) — or the one-command"],
    "`bun run test:e2e` (194) — or the one-command",
    1,
    "AGENTS gate-order e2e",
)

# --- CLAUDE.md ---------------------------------------------------------------
flip(
    "CLAUDE.md",
    ["`bun run test` (2811) → `bun run build` → `bun run test:e2e` (192)"],
    "`bun run test` (2811) → `bun run build` → `bun run test:e2e` (194)",
    1,
    "CLAUDE gate-order line",
)
flip(
    "CLAUDE.md",
    ["Playwright E2E (192 checks, needs build first)"],
    "Playwright E2E (194 checks, needs build first)",
    1,
    "CLAUDE commands e2e row",
)
flip(
    "CLAUDE.md",
    ["**E2E (Playwright, 192 checks)**"],
    "**E2E (Playwright, 194 checks)**",
    1,
    "CLAUDE test pyramid e2e",
)

# --- Project_Architecture_Document.md ----------------------------------------
flip(
    "Project_Architecture_Document.md",
    ["setup project — 192 checks"],
    "setup project — 194 checks",
    1,
    "PAD tree e2e line",
)
flip(
    "Project_Architecture_Document.md",
    ["| **Total** | **138** | **2811 unit + 192 e2e** | | |"],
    "| **Total** | **138** | **2811 unit + 194 e2e** | | |",
    1,
    "PAD §10 total row",
)
flip(
    "Project_Architecture_Document.md",
    ["HEAD: 138 Vitest suites with 2811 checks + 192 e2e"],
    "HEAD: 138 Vitest suites with 2811 checks + 194 e2e",
    1,
    "PAD §10 HEAD line",
)
flip(
    "Project_Architecture_Document.md",
    ["`bun run test:e2e` — 192/192"],
    "`bun run test:e2e` — 194/194",
    1,
    "PAD checklist e2e",
)
flip(
    "Project_Architecture_Document.md",
    ["| `bun run test:e2e` | root | 192 browser checks"],
    "| `bun run test:e2e` | root | 194 browser checks",
    1,
    "PAD §9 commands e2e",
)

# --- neo-crm_SKILL.md — the count sites (the head project_state is NOT
# here: the head surgery already wrote the 2811/194 live layer, and the
# demoted s194 block's ship line must never match an old form) --------------
flip(
    "neo-crm_SKILL.md",
    ["bun run test:e2e     # 192/192"],
    "bun run test:e2e     # 194/194",
    1,
    "SKILL commands e2e",
)
flip(
    "neo-crm_SKILL.md",
    ["| **e2e total** | 11 spec files + the setup project | **192** |"],
    "| **e2e total** | 11 spec files + the setup project | **194** |",
    1,
    "SKILL Appendix B e2e total",
)
flip(
    "neo-crm_SKILL.md",
    ["e2e ~6 m (192\nchecks"],
    "e2e ~6 m (194\nchecks",
    1,
    "SKILL wall-clock phrase",
)
# the Appendix B a11y row — the count (31 -> 33, the live per-spec census
# the docs-counts gate enforces) + the row label's s195 pair
flip(
    "neo-crm_SKILL.md",
    ["the five create dialogs + the contact edit dialog) | `tests/e2e/a11y.spec.ts` | 31 |"],
    "the five create dialogs + the contact edit dialog + the s195 404 pair) | `tests/e2e/a11y.spec.ts` | 33 |",
    1,
    "SKILL Appendix B a11y row",
)

print(f"\ncount-ladder-195: {flips} flip(s) — the docs land on 2811/194 (badge 3005)")
