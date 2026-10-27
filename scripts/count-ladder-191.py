#!/usr/bin/env python3
"""count-ladder-191.py — the session-191 count-ladder flip script.

The house form (assert-first, idempotent, unique-anchor): every site is
asserted to carry EXACTLY ONE of the accepted old forms before the
flip; a site already carrying the new form is a verified no-op; a site
carrying NONE is a hard error (the anchor drifted — re-derive, never
guess).

The full ladder: UNIT 2786 -> 2795 (+9 — the walk64 battery in
tests/page-layout.test.ts [the walk64 decode freeze — the three-arm
OPEN ledger at both axes + the REAL Tab drives + the select rides +
the conditional-Name appearance + the cancel-then-reopen decode · the
CONTACT open-interior construction freeze (the genuine battery gap: the
s19/s30 pins hold OUR wiring regexes, never the call-site chains) ·
the ACCOUNT open-interior construction freeze (the same gap: the
s15/s5 pins hold the field order + payload contracts, never the
chains) · the EVENT open-interior construction freeze (the same gap:
the s15/s76 pins hold the constants + the bundle decode, never the
chains) · the D-191a1 contact literal id/for cure pin · the D-191a2
account literal id/for cure pin · the D-191a3 selects' id/for wiring
cure pin · the D-191a4 file-input tabIndex retirement cure pin —
RED-first: exactly 5 RED at birth -> the cures -> GREEN]). SUITES 138
HELD · E2E 192 — re-verified this session (the round's product-code
touch: entity-dialogs.tsx 1226 -> 1245 [the four cure comment blocks]
— the PAD §11 row + the SKILL §5 line-count census sites re-anchored)
· badge 2978 -> 2987 (the unit+e2e arithmetic: 2795+192).

The +9 arithmetic verified at the full-suite count (2795 — the
D-191a5 pin's +1 [the event create-dialog's start-date pre-fill
retirement, the VLM battery's catch] landed AFTER the first pass's
+8/2794; the corrected ladder accepts BOTH intermediate forms — the
s187/s188/s190 undercount lesson repeating, as the worklog predicted).

The HEAD surgery (skill-head-191.py) ran FIRST — the SKILL head's live
layer already carries 2794, so this ladder has NO head flip (the s188
lesson: a ladder old-form must NEVER match a retired block's ship
line — the demoted s190 block keeps `project_state: 2786 … the
session-190 layer` in its comment block, and that form is absent from
the accepted old-forms below by design).
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
    raise SystemExit(f"ANCHOR ERROR [{label or path}]: no accepted old form found for {new!r}")


# --- README.md ---------------------------------------------------------------
flip("README.md", ["tests-2978%20checks", "tests-2986%20checks"], "tests-2987%20checks", 1, "README badge")
flip("README.md", ["| 🧪 Tested | 2794 Vitest unit checks", "| 🧪 Tested | 2786 Vitest unit checks"], "| 🧪 Tested | 2795 Vitest unit checks", 1, "README Tested row")
flip("README.md", ["# 138 Vitest suites (2794 checks)", "# 138 Vitest suites (2786 checks)"], "# 138 Vitest suites (2795 checks)", 1, "README tree tests line")
flip("README.md", ["# 2794 Vitest unit checks", "# 2786 Vitest unit checks"], "# 2795 Vitest unit checks", 1, "README commands unit line")

# --- AGENTS.md ---------------------------------------------------------------
flip("AGENTS.md", ["Unit tests (2794 checks)", "Unit tests (2786 checks)"], "Unit tests (2795 checks)", 1, "AGENTS commands unit row")
flip("AGENTS.md", ["`bun run test` (2794) →", "`bun run test` (2786) →"], "`bun run test` (2795) →", 1, "AGENTS gate-order unit")

# --- CLAUDE.md ---------------------------------------------------------------
flip("CLAUDE.md", ["`bun run test` (2794) → `bun run build` → `bun run test:e2e` (192)", "`bun run test` (2786) → `bun run build` → `bun run test:e2e` (192)"], "`bun run test` (2795) → `bun run build` → `bun run test:e2e` (192)", 1, "CLAUDE gate-order line")
flip("CLAUDE.md", ["Vitest unit suites (2794 checks)", "Vitest unit suites (2786 checks)"], "Vitest unit suites (2795 checks)", 1, "CLAUDE commands unit row")
flip("CLAUDE.md", ["**Unit (Vitest, 2794 checks)**", "**Unit (Vitest, 2786 checks)**"], "**Unit (Vitest, 2795 checks)**", 1, "CLAUDE test pyramid unit")
flip("CLAUDE.md", ["the seam (currently 2794)", "the seam (currently 2786)"], "the seam (currently 2795)", 1, "CLAUDE coverage targets")

# --- Project_Architecture_Document.md ----------------------------------------
flip("Project_Architecture_Document.md", ["# 138 Vitest suites — 2794 checks", "# 138 Vitest suites — 2786 checks"], "# 138 Vitest suites — 2795 checks", 1, "PAD tree unit line")
flip("Project_Architecture_Document.md", ["| **Total** | **138** | **2794 unit + 192 e2e** | | |", "| **Total** | **138** | **2786 unit + 192 e2e** | | |"], "| **Total** | **138** | **2795 unit + 192 e2e** | | |", 1, "PAD §7.1 total row")
flip("Project_Architecture_Document.md", ["HEAD: 138 Vitest suites with 2794 checks + 192 e2e", "HEAD: 138 Vitest suites with 2786 checks + 192 e2e"], "HEAD: 138 Vitest suites with 2795 checks + 192 e2e", 1, "PAD §7.1 HEAD line")
flip("Project_Architecture_Document.md", ["`bun run test` — 2794/2794", "`bun run test` — 2786/2786"], "`bun run test` — 2795/2795", 1, "PAD checklist unit")
flip("Project_Architecture_Document.md", ["| `bun run test` | root | 2794 unit checks |", "| `bun run test` | root | 2786 unit checks |"], "| `bun run test` | root | 2795 unit checks |", 1, "PAD §9 commands unit")

# --- neo-crm_SKILL.md — the count sites (the head project_state is NOT
# here: the head surgery already wrote the 2794 live layer, and the
# demoted s190 block's ship line must never match an old form) --------------
flip("neo-crm_SKILL.md", ["bun run test         # 2794/2794", "bun run test         # 2786/2786"], "bun run test         # 2795/2795", 1, "SKILL commands unit")
flip("neo-crm_SKILL.md", ["| **unit total** | 138 files | **2794** |", "| **unit total** | 138 files | **2786** |"], "| **unit total** | 138 files | **2795** |", 1, "SKILL Appendix B unit total")

# --- neo-crm_SKILL.md — the §5.6 census collateral ---------------------------
flip(
    "neo-crm_SKILL.md",
    ["`tests/page-layout.test.ts`, 267 checks —", "`tests/page-layout.test.ts`, 259 checks —"],
    "`tests/page-layout.test.ts`, 268 checks —",
    1,
    "SKILL §5.6 census checks",
)
flip(
    "neo-crm_SKILL.md",
    ["the s190 census: the module untouched by the walk63 round [the one-cure round — page-layout.ts test-only, the line count 1718 HELD];"],
    "the s191 census: the module untouched by the walk64 round [the id-family cure round — page-layout.ts test-only, the line count 1718 HELD];",
    1,
    "SKILL §5.6 census era",
)
flip(
    "neo-crm_SKILL.md",
    ["the s189 census re-anchored by the 4 walk63 pins)."],
    "the s190 census re-anchored by the 8 walk64 pins).",
    1,
    "SKILL §5.6 census re-anchor",
)
flip(
    "neo-crm_SKILL.md",
    ["**RED-first:** 16 failed | 267 passed (283) at the still-unfixed src", "**RED-first:** 16 failed | 259 passed (275) at the still-unfixed src"],
    "**RED-first:** 16 failed | 268 passed (284) at the still-unfixed src",
    1,
    "SKILL the s189-era live-tense RED-first arithmetic site",
)

print(f"\ncount-ladder-191: {flips} flip(s) — the docs land on 2795/2987")
