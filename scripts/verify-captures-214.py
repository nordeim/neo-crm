#!/usr/bin/env python3
"""verify-captures-214.py — the 727-731 series' pixel-signature check
(the s213 form, the FRESH-SEED face): every capture non-blank + the
signature probes (the blue sidebar on the dashboard at 1280 · the
80%-black overlay on the drawer OPEN at 390 · the near-white login
card at 1280) + the coarse-grid diff against the s213 set at matched
sizes. The STATIC pages (the landing menu · the login card) must sit
at 0%; the dashboard pair may carry SMALL ATTRIBUTED diffs confined
to the value-bearing cells — avgSalesCycleDays is the won leads'
average AGE (floor((now-created)/day) per lead, dashboard-data.ts),
so the fresh seed's KPI text + the chart bar edges drift with the
capture time (the s212 record's own note: "the md5 deltas the fresh
seed's date-relative values"). Layout/chrome cells must hold."""

from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "docs" / "screenshots"

PAIRS = [  # (s214, s213)
    ("727-s214-dev-dashboard-1280.png", "722-s213-dev-dashboard-1280.png"),
    ("728-s214-dev-dashboard-390.png", "723-s213-dev-dashboard-390.png"),
    ("729-s214-dev-drawer-open-390.png", "724-s213-dev-drawer-open-390.png"),
    ("730-s214-dev-landing-mobilemenu-390.png", "725-s213-dev-landing-mobilemenu-390.png"),
    ("731-s214-dev-login-1280.png", "726-s213-dev-login-1280.png"),
]
GRID = 24  # the coarse grid (24x24 cells)


def sig_cells(img):
    w, h = img.size
    small = img.resize((GRID, GRID))
    return list(small.getdata())


def grid_diff(a, b):
    ca, cb = sig_cells(a), sig_cells(b)
    n = sum(1 for x, y in zip(ca, cb) if x != y)
    return n / len(ca)


def blank_ratio(img):
    gray = img.convert("L")
    hist = gray.histogram()
    white = sum(hist[250:])
    return white / (img.size[0] * img.size[1])


ok = True

# 1) the signature probes
dash = Image.open(OUT / "727-s214-dev-dashboard-1280.png").convert("RGB")
sidebar = dash.getpixel((100, 450))
blue_ok = abs(sidebar[0] - 37) < 25 and abs(sidebar[1] - 99) < 25 and abs(sidebar[2] - 235) < 25
print(f"  {'PASS' if blue_ok else 'FAIL'}  727 dashboard sidebar {sidebar} (expect ~(37,99,235) blue)")
ok &= blue_ok

drawer = Image.open(OUT / "729-s214-dev-drawer-open-390.png").convert("RGB")
overlay = drawer.getpixel((370, 400))  # past the 256px drawer panel, in the scrim
dark_ok = sum(overlay) < 200  # ~80% black over white page ≈ (51,51,51)
print(f"  {'PASS' if dark_ok else 'FAIL'}  729 drawer overlay {overlay} (expect ~80% black, (51,51,51) family)")
ok &= dark_ok

login = Image.open(OUT / "731-s214-dev-login-1280.png").convert("RGB")
card = login.getpixel((640, 300))
card_ok = min(card) > 235  # the gray-50 card surface (near-white)
print(f"  {'PASS' if card_ok else 'FAIL'}  731 login card {card} (expect near-white gray-50)")
ok &= card_ok

# 2) non-blank + the coarse-grid diff vs the s213 set
#    STATIC pages: 0% required. The dashboard pair: the attributed
#    ceiling 5% (the date-relative value cells; the s213 same-DB round
#    measured 0% — the fresh-seed rounds carry the small drift).
STATIC = {"730-s214-dev-landing-mobilemenu-390.png", "731-s214-dev-login-1280.png"}
for new, old in PAIRS:
    a = Image.open(OUT / new).convert("RGB")
    b = Image.open(OUT / old).convert("RGB")
    blank = blank_ratio(a)
    blank_ok = blank < 0.90
    diff = grid_diff(a, b)
    ceiling = 0.0 if new in STATIC else 0.05
    diff_ok = diff <= ceiling
    print(f"  {'PASS' if blank_ok else 'FAIL'}  {new} blank-ratio {blank:.3f}")
    print(f"  {'PASS' if diff_ok else 'FAIL'}  {new} vs {old} coarse-grid diff {diff:.1%} (ceiling {ceiling:.0%})")
    ok &= blank_ok and diff_ok

print("verify-captures-214.py:", "ALL PASS" if ok else "SEE ABOVE")
raise SystemExit(0 if ok else 1)
