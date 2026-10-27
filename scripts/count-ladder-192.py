#!/usr/bin/env python3
"""count-ladder-192.py — the session-192 count-ladder flip script.

The house form (assert-first, idempotent, unique-anchor): every site is
asserted to carry EXACTLY ONE of the accepted old forms before the
flip; a site already carrying the new form is a verified no-op; a site
carrying NONE is a hard error (the anchor drifted — re-derive, never
guess).

The full ladder: UNIT 2795 -> 2801 (+6 — the walk65 battery in
tests/page-layout.test.ts [the walk65 decode freeze — the four-view
OPEN ledgers + the REAL Tab chain + the draft decode + the FAQ/menu
arms + the CTA faces at both axes · the LOGIN open-interior
construction freeze (the genuine battery gap: the s11/s21/s79/s111
pins hold OUR wiring regexes + the computed-style contracts, never the
call-site chains) · the LANDING marketing-arms construction freeze
(the same gap: the s142 pins hold the component-level regexes, never
the call-site chains) · the D-192a1 signup confirm literal-id cure pin
· the D-192a2 reset email literal-id cure pin · the D-192a3 dark
submits' REAL focus-ring cure pin — RED-first: exactly 3 RED at birth
-> the cures -> GREEN]). SUITES 138 HELD · E2E 192 — re-verified this
session (the round's product-code touch: login-card.tsx + page-layout.ts
+ login-reset.ts — all string swaps, zero line-count changes, the docs
census rows HELD) · badge 2987 -> 2993 (the unit+e2e arithmetic:
2801+192).

The +6 arithmetic verified at the full-suite count (2801 — the
s187/s188/s190/s191 undercount lesson applied: the TRUE count was
confirmed at the full-suite run BEFORE the ladder, no intermediate
forms shipped).

The HEAD surgery (skill-head-192.py) ran FIRST — the SKILL head's live
layer already carries 2801, so this ladder has NO head flip (the s188
lesson: a ladder old-form must NEVER match a retired block's ship
line — the demoted s191 block keeps `project_state: 2795 … the
session-191 layer` in its comment block, and that form is absent from
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
flip("README.md", ["tests-2987%20checks"], "tests-2993%20checks", 1, "README badge")
flip("README.md", ["| 🧪 Tested | 2795 Vitest unit checks"], "| 🧪 Tested | 2801 Vitest unit checks", 1, "README Tested row")
flip("README.md", ["# 138 Vitest suites (2795 checks)"], "# 138 Vitest suites (2801 checks)", 1, "README tree tests line")
flip("README.md", ["# 2795 Vitest unit checks"], "# 2801 Vitest unit checks", 1, "README commands unit line")

# --- AGENTS.md ---------------------------------------------------------------
flip("AGENTS.md", ["Unit tests (2795 checks)"], "Unit tests (2801 checks)", 1, "AGENTS commands unit row")
flip("AGENTS.md", ["`bun run test` (2795) →"], "`bun run test` (2801) →", 1, "AGENTS gate-order unit")

# --- CLAUDE.md ---------------------------------------------------------------
flip("CLAUDE.md", ["`bun run test` (2795) → `bun run build` → `bun run test:e2e` (192)"], "`bun run test` (2801) → `bun run build` → `bun run test:e2e` (192)", 1, "CLAUDE gate-order line")
flip("CLAUDE.md", ["Vitest unit suites (2795 checks)"], "Vitest unit suites (2801 checks)", 1, "CLAUDE commands unit row")
flip("CLAUDE.md", ["**Unit (Vitest, 2795 checks)**"], "**Unit (Vitest, 2801 checks)**", 1, "CLAUDE test pyramid unit")
flip("CLAUDE.md", ["the seam (currently 2795)"], "the seam (currently 2801)", 1, "CLAUDE coverage targets")

# --- Project_Architecture_Document.md ----------------------------------------
flip("Project_Architecture_Document.md", ["# 138 Vitest suites — 2795 checks"], "# 138 Vitest suites — 2801 checks", 1, "PAD tree unit line")
flip("Project_Architecture_Document.md", ["| **Total** | **138** | **2795 unit + 192 e2e** | | |"], "| **Total** | **138** | **2801 unit + 192 e2e** | | |", 1, "PAD §7.1 total row")
flip("Project_Architecture_Document.md", ["HEAD: 138 Vitest suites with 2795 checks + 192 e2e"], "HEAD: 138 Vitest suites with 2801 checks + 192 e2e", 1, "PAD §7.1 HEAD line")
flip("Project_Architecture_Document.md", ["`bun run test` — 2795/2795"], "`bun run test` — 2801/2801", 1, "PAD checklist unit")
flip("Project_Architecture_Document.md", ["| `bun run test` | root | 2795 unit checks |"], "| `bun run test` | root | 2801 unit checks |", 1, "PAD §9 commands unit")

# --- neo-crm_SKILL.md — the count sites (the head project_state is NOT
# here: the head surgery already wrote the 2801 live layer, and the
# demoted s191 block's ship line must never match an old form) --------------
flip("neo-crm_SKILL.md", ["bun run test         # 2795/2795"], "bun run test         # 2801/2801", 1, "SKILL commands unit")
flip("neo-crm_SKILL.md", ["| **unit total** | 138 files | **2795** |"], "| **unit total** | 138 files | **2801** |", 1, "SKILL Appendix B unit total")

# --- neo-crm_SKILL.md — the §5.6 census collateral ---------------------------
flip(
    "neo-crm_SKILL.md",
    ["`tests/page-layout.test.ts`, 268 checks —"],
    "`tests/page-layout.test.ts`, 274 checks —",
    1,
    "SKILL §5.6 census checks",
)
flip(
    "neo-crm_SKILL.md",
    ["the s191 census: the module untouched by the walk64 round [the id-family cure round — page-layout.ts test-only, the line count 1718 HELD];"],
    "the s192 census: the module's LOGIN_LAYOUT.submit ring swapped by the D-192a3 cure (a string swap, the line count 1718 HELD);",
    1,
    "SKILL §5.6 census era",
)
flip(
    "neo-crm_SKILL.md",
    ["the s190 census re-anchored by the 9 walk64 pins)."],
    "the s191 census re-anchored by the 6 walk65 pins).",
    1,
    "SKILL §5.6 census re-anchor",
)
flip(
    "neo-crm_SKILL.md",
    ["**RED-first:** 16 failed | 268 passed (284) at the still-unfixed src"],
    "**RED-first:** 16 failed | 274 passed (290) at the still-unfixed src",
    1,
    "SKILL the s190-era live-tense RED-first arithmetic site",
)

print(f"\ncount-ladder-192: {flips} flip(s) — the docs land on 2801/2993")
