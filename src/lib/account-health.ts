/**
 * Session-27 (S27-P1): the reference's COMPUTED account health —
 * bundle-extracted from its reports Account Health tab (`r3e`).
 *
 * The reference does NOT store health on a status distribution — it
 * computes it client-side from each account's latest related activity and
 * its lost deals:
 *
 *   daysSinceActivity = latest activity ? diffDays(now, latest) : 999
 *   health = (days > 60 || account has a closed_lost deal) ? "At Risk"
 *          : days > 30                              ? "Needs Attention"
 *          :                                          "Healthy"
 *
 * (The stored `Account.health` column from session-26 remains — it feeds
 * the s26 accounts-export contract — but the REPORTS tab computes its own
 * health from activity + deals, exactly like the reference.)
 */

export const HEALTH_STATES = ["Healthy", "Needs Attention", "At Risk"] as const;

export type HealthState = (typeof HEALTH_STATES)[number];

/** The reference's Account Health Distribution pie fills (in HEALTH_STATES order). */
export const HEALTH_PIE_FILLS = ["#10b981", "#f59e0b", "#ef4444"] as const;

/** The reference's sentinel for "no activity ever" (its `p ? diff : 999`). */
export const NO_ACTIVITY_DAYS = 999;

export function daysSince(date: Date | null, now: Date = new Date()): number {
  if (!date) return NO_ACTIVITY_DAYS;
  const ms = now.getTime() - date.getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

export function accountHealth(input: {
  lastActivityAt: Date | null;
  hasLostDeals: boolean;
  now?: Date;
}): { health: HealthState; daysSinceActivity: number } {
  const d = daysSince(input.lastActivityAt, input.now);
  const health: HealthState =
    d > 60 || input.hasLostDeals ? "At Risk" : d > 30 ? "Needs Attention" : "Healthy";
  return { health, daysSinceActivity: d };
}

/** The At Risk table's Last Activity text: `Nd ago` / `Never` at the sentinel. */
export function lastActivityText(days: number): string {
  return days === NO_ACTIVITY_DAYS ? "Never" : `${days}d ago`;
}
