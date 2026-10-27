#!/usr/bin/env python3
"""count-ladder-190.py — the session-190 count-ladder flip script.

The house form (assert-first, idempotent, unique-anchor): every site is
asserted to carry EXACTLY ONE of the accepted old forms before the
flip; a site already carrying the new form is a verified no-op; a site
carrying NONE is a hard error (the anchor drifted — re-derive, never
guess).

The full ladder: UNIT 2781 -> 2786 (+5 — the walk63 battery in
tests/page-layout.test.ts [the walk63 decode freeze — the one-arm OPEN
ledger at both axes + the REAL Tab/Save drives + the save/reopen
round-trips + the checkbox-toggle ride · the Saved-Reports TRIGGER
call-site construction freeze (the genuine battery gap: the s25 pins
hold the wiring regex, never the trigger's own chain) · the
Save-Report-Dialog open-interior construction freeze (the genuine gap:
the content words as regexes, never the call-site chains) · the
D-190a1 cure pin (the six column checkboxes' literal id/for
construction — RED-first: exactly 1 RED at birth -> the cure ->
GREEN)]). SUITES 138 HELD · E2E 192 — re-verified this session (the
round's product-code touch: save-report-dialog.tsx +8 lines [the
id={col.key} cure + its comment] — the MODULE line count 1718 HELD,
page-layout.ts untouched) · badge 2973 -> 2978 (the unit+e2e arithmetic: 2786+192).

The +5 arithmetic verified at the full-suite count (2786 — the first
pass carried +4/2785 [the stash-proof's restored count] before the
D-190a2 pin's +1 was caught at the full-suite count, the s187/s188
undercount lesson repeating as the worklog predicted; this corrected
ladder accepts BOTH the 2785 intermediate and the 2781 ship form as
old-forms).

The HEAD surgery (skill-head-190.py) ran FIRST — the SKILL head's live
layer already carries 2785, so this ladder has NO head flip (the s188
lesson: a ladder old-form must NEVER match a retired block's ship
line — the demoted s189 block keeps `project_state: 2781 … the
session-189 layer` in its comment block, and that form is absent from
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
flip("README.md", ["tests-2973%20checks", "tests-2977%20checks", "tests-2981%20checks"], "tests-2978%20checks", 1, "README badge")
flip("README.md", ["| 🧪 Tested | 2785 Vitest unit checks"], "| 🧪 Tested | 2786 Vitest unit checks", 1, "README Tested row")
flip("README.md", ["# 138 Vitest suites (2785 checks)"], "# 138 Vitest suites (2786 checks)", 1, "README tree tests line")
flip("README.md", ["# 2785 Vitest unit checks"], "# 2786 Vitest unit checks", 1, "README commands unit line")

# --- AGENTS.md ---------------------------------------------------------------
flip("AGENTS.md", ["Unit tests (2785 checks)"], "Unit tests (2786 checks)", 1, "AGENTS commands unit row")
flip("AGENTS.md", ["`bun run test` (2785) →"], "`bun run test` (2786) →", 1, "AGENTS gate-order unit")

# --- CLAUDE.md ---------------------------------------------------------------
flip("CLAUDE.md", ["`bun run test` (2785) → `bun run build` → `bun run test:e2e` (192)"], "`bun run test` (2786) → `bun run build` → `bun run test:e2e` (192)", 1, "CLAUDE gate-order line")
flip("CLAUDE.md", ["Vitest unit suites (2785 checks)"], "Vitest unit suites (2786 checks)", 1, "CLAUDE commands unit row")
flip("CLAUDE.md", ["**Unit (Vitest, 2785 checks)**"], "**Unit (Vitest, 2786 checks)**", 1, "CLAUDE test pyramid unit")
flip("CLAUDE.md", ["the seam (currently 2785)"], "the seam (currently 2786)", 1, "CLAUDE coverage targets")

# --- Project_Architecture_Document.md ----------------------------------------
flip("Project_Architecture_Document.md", ["# 138 Vitest suites — 2785 checks"], "# 138 Vitest suites — 2786 checks", 1, "PAD tree unit line")
flip("Project_Architecture_Document.md", ["| **Total** | **138** | **2785 unit + 192 e2e** | | |"], "| **Total** | **138** | **2786 unit + 192 e2e** | | |", 1, "PAD §7.1 total row")
flip("Project_Architecture_Document.md", ["HEAD: 138 Vitest suites with 2785 checks + 192 e2e"], "HEAD: 138 Vitest suites with 2786 checks + 192 e2e", 1, "PAD §7.1 HEAD line")
flip("Project_Architecture_Document.md", ["`bun run test` — 2785/2785"], "`bun run test` — 2786/2786", 1, "PAD checklist unit")
flip("Project_Architecture_Document.md", ["| `bun run test` | root | 2785 unit checks |"], "| `bun run test` | root | 2786 unit checks |", 1, "PAD §9 commands unit")

# --- neo-crm_SKILL.md — the count sites (the head project_state is NOT
# here: the head surgery already wrote the 2785 live layer, and the
# demoted s189 block's ship line must never match an old form) --------------
flip("neo-crm_SKILL.md", ["bun run test         # 2785/2785"], "bun run test         # 2786/2786", 1, "SKILL commands unit")
flip("neo-crm_SKILL.md", ["| **unit total** | 138 files | **2785** |"], "| **unit total** | 138 files | **2786** |", 1, "SKILL Appendix B unit total")

# --- neo-crm_SKILL.md — the §5.6 census collateral ---------------------------
flip(
    "neo-crm_SKILL.md",
    ["`tests/page-layout.test.ts`, 255 checks —"],
    "`tests/page-layout.test.ts`, 259 checks —",
    1,
    "SKILL §5.6 census checks",
)
flip(
    "neo-crm_SKILL.md",
    ["the s189 census: the module untouched by the walk62 round [the zero-fix round — page-layout.ts test-only, the line count 1718 HELD];"],
    "the s190 census: the module untouched by the walk63 round [the one-cure round — page-layout.ts test-only, the line count 1718 HELD];",
    1,
    "SKILL §5.6 census era",
)
flip(
    "neo-crm_SKILL.md",
    ["the s188 census re-anchored by the 3 walk62 pins)."],
    "the s189 census re-anchored by the 4 walk63 pins).",
    1,
    "SKILL §5.6 census re-anchor",
)
flip(
    "neo-crm_SKILL.md",
    ["**RED-first:** 16 failed | 255 passed (271) at the still-unfixed src"],
    "**RED-first:** 16 failed | 259 passed (275) at the still-unfixed src",
    1,
    "SKILL the s189-era live-tense RED-first arithmetic site",
)

print(f"\ncount-ladder-190: {flips} flip(s) — the docs land on 2786/2978")
