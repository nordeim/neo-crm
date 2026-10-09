/**
 * Session-86 (M-86c2): the COMPUTED account tier — the reference derives
 * every account's tier from its revenue at render time (the bundle's N
 * memo: `te = U.annual_revenue > 1e6 ? "Key" : U.annual_revenue > 5e5 ?
 * "A" : U.annual_revenue > 1e5 ? "B" : "C"`) and consumes the computed
 * value at the row (the bg-yellow-50/30 tint + the filled star + the
 * tier badge), the Key Accounts KPI, the tier checkbox filter, and the
 * CSV exports. It models NO stored tier field — its dialogs offer none
 * and its settings default_account_tier is its own dead default (the
 * Default Currency AED genus). Our stored tier/isKey columns were the
 * invented mechanism (they rendered a DIFFERENT distribution than the
 * reference's formula on the same data — 4 Key vs its 9 on our seed)
 * and are retired; every consumer derives through this seam instead.
 *
 * Null/undefined revenue arithmetic-coerces through every comparison
 * to false — the reference's formula yields "C" there (mirrored).
 */
export function accountTierFromRevenue(
  revenue: number | null | undefined,
): "Key" | "A" | "B" | "C" {
  if (revenue !== null && revenue !== undefined && revenue > 1_000_000) return "Key";
  if (revenue !== null && revenue !== undefined && revenue > 500_000) return "A";
  if (revenue !== null && revenue !== undefined && revenue > 100_000) return "B";
  return "C";
}
