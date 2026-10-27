#!/usr/bin/env python3
"""Insert the README walk-contracts paragraph's s195 clause after the
walk67 (session-194) clause — the D-190a2 clause-unique doctrine form."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
README = ROOT / "README.md"

text = README.read_text(encoding="utf8")

ANCHOR = "the re-walk proves the cures live (43 deltas -> 23, every remaining delta a documented genus or pinned superset)), and the session-30 photo-upload"
assert text.count(ANCHOR) == 1, f"the walk67 clause anchor drifted: {text.count(ANCHOR)}"

if "the session-195 404 gate-coverage contract" in text:
    print("  no-op  [README walk-contracts] the s195 clause already present")
else:
    S195_CLAUSE = (
        "the re-walk proves the cures live (43 deltas -> 23, every remaining "
        "delta a documented genus or pinned superset)), and the session-195 "
        "404 gate-coverage contract (the two-skill audit round — the "
        "skills/web-application v1.2.0 rubric over the s193/s194 product "
        "changes + the standing infrastructure, 0 Critical/High/Medium; "
        "three cures: the TRUE-HTTP-404 wire freeze inside the S12-P2 e2e "
        "test — the D-194a5 ship claim's zero-teeth gap closed, "
        "mutation-proven by the planted catch-all redirect flipping the "
        "status pin RED exactly once; the a11y two-gate's 404 "
        "registrations +2 — the one anon-reachable surface the register "
        "never adjudicated, its display heading cited as the reference's "
        "own designed 404 palette, mutation-proven by the neutralized "
        "matcher tripping GATE 2 at both widths; the playwright child-env "
        "kill-switch scrubbing — the NEO_DISABLE_IN_APP_* pins that make "
        "the e2e ladder deterministic regardless of shell state; the "
        "seven declined findings recorded considered-and-declined in the "
        "plan under the parity doctrine), and the session-30 photo-upload"
    )
    text = text.replace(ANCHOR, S195_CLAUSE, 1)
    README.write_text(text, encoding="utf8")
    print("  flip   [README walk-contracts] the s195 clause inserted after the walk67 clause")
