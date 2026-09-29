// Pure formatting/date helpers (unit-tested seam — tests/format.test.ts).

export function formatCurrency(value: number | null | undefined, currency = "AED"): string {
  const v = value ?? 0;
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  const num = abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return `${sign}${currency} ${num}`;
}

/** $1.2K / $34K / $1.4M compact form used by KPI cards. */
export function formatCompactCurrency(value: number | null | undefined, currency = "AED"): string {
  const v = value ?? 0;
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}${currency} ${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${currency} ${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${currency} ${Math.round(abs)}`;
}

export function formatCompactNumber(value: number | null | undefined): string {
  const v = value ?? 0;
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(abs / 1_000).toFixed(1)}K`;
  return `${Math.round(abs)}`;
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function asDate(d: Date | string | number): Date {
  return d instanceof Date ? d : new Date(d);
}

export function formatDate(d: Date | string | number | null | undefined): string {
  if (!d) return "—";
  const date = asDate(d);
  if (Number.isNaN(date.getTime())) return "—";
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatDateShort(d: Date | string | number | null | undefined): string {
  if (!d) return "—";
  const date = asDate(d);
  if (Number.isNaN(date.getTime())) return "—";
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
}

export function formatMonthYear(d: Date | string | number): string {
  const date = asDate(d);
  return `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatTime(d: Date | string | number | null | undefined): string {
  if (!d) return "—";
  const date = asDate(d);
  if (Number.isNaN(date.getTime())) return "—";
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/** "just now" / "5m ago" / "3h ago" / "2d ago" / "Mar 4" */
export function timeAgo(d: Date | string | number | null | undefined, now = Date.now()): string {
  if (!d) return "—";
  const t = asDate(d).getTime();
  if (Number.isNaN(t)) return "—";
  const diff = now - t;
  if (diff < 0) return "upcoming";
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return formatDateShort(t);
}

/** "in 2d" / "in 3h" / "Today" style relative future label. */
export function timeUntil(d: Date | string | number | null | undefined, now = Date.now()): string {
  if (!d) return "—";
  const t = asDate(d).getTime();
  if (Number.isNaN(t)) return "—";
  const diff = t - now;
  if (diff <= 0) return "overdue";
  const hr = Math.floor(diff / 3_600_000);
  if (hr < 1) return `in ${Math.max(1, Math.floor(diff / 60_000))}m`;
  if (hr < 24) return `in ${hr}h`;
  return `in ${Math.floor(hr / 24)}d`;
}

export function isSameDay(a: Date | string | number, b: Date | string | number): boolean {
  const x = asDate(a);
  const y = asDate(b);
  return (
    x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate()
  );
}

export function startOfDay(d: Date | string | number): Date {
  const x = new Date(asDate(d));
  x.setHours(0, 0, 0, 0);
  return x;
}

export function endOfDay(d: Date | string | number): Date {
  const x = new Date(asDate(d));
  x.setHours(23, 59, 59, 999);
  return x;
}

export function addDays(d: Date | string | number, days: number): Date {
  const x = new Date(asDate(d));
  x.setDate(x.getDate() + days);
  return x;
}

export function addMonths(d: Date | string | number, months: number): Date {
  const x = new Date(asDate(d));
  const day = x.getDate();
  x.setMonth(x.getMonth() + months);
  if (x.getDate() < day) x.setDate(0); // clamp to end of month
  return x;
}

export function startOfWeek(d: Date | string | number, firstDay: "monday" | "sunday" = "monday"): Date {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 = Sunday
  if (firstDay === "monday") {
    const diff = day === 0 ? 6 : day - 1;
    x.setDate(x.getDate() - diff);
  } else {
    x.setDate(x.getDate() - day);
  }
  return x;
}

export function startOfMonth(d: Date | string | number): Date {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

export function startOfQuarter(d: Date | string | number): Date {
  const x = startOfMonth(d);
  x.setMonth(Math.floor(x.getMonth() / 3) * 3);
  return x;
}

export function startOfYear(d: Date | string | number): Date {
  const x = startOfMonth(d);
  x.setMonth(0);
  return x;
}

/** Calendar grid for a month. With `leading`, a full 6-week Monday/Sunday-
 * anchored grid (previous-month days included); without, only the month's
 * own days. */
export function calendarGrid(
  year: number,
  month: number, // 0-indexed
  firstDay: "monday" | "sunday" = "monday",
  leading = true,
): Date[] {
  const first = new Date(year, month, 1);
  const offset = firstDay === "monday" ? (first.getDay() + 6) % 7 : first.getDay();
  const start = leading
    ? new Date(year, month, 1 - offset)
    : new Date(year, month, 1);
  const total = leading ? 42 : new Date(year, month + 1, 0).getDate();
  const days: Date[] = [];
  for (let i = 0; i < total; i += 1) {
    days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return days;
}

export function monthName(month: number): string {
  return MONTHS_LONG[month] ?? "";
}

export function monthShort(month: number): string {
  return MONTHS_SHORT[month] ?? "";
}

export function toLocalInputValue(d: Date | string | number | null | undefined): string {
  if (!d) return "";
  const x = asDate(d);
  if (Number.isNaN(x.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}T${pad(x.getHours())}:${pad(x.getMinutes())}`;
}

/** Average of N day-differences in whole days. */
export function avgDaysBetween(starts: Array<Date | string | number>, ends: Array<Date | string | number>): number {
  if (starts.length === 0 || starts.length !== ends.length) return 0;
  let total = 0;
  let n = 0;
  for (let i = 0; i < starts.length; i += 1) {
    const a = asDate(starts[i]).getTime();
    const b = asDate(ends[i]).getTime();
    if (Number.isNaN(a) || Number.isNaN(b)) continue;
    total += Math.max(0, b - a);
    n += 1;
  }
  if (n === 0) return 0;
  return Math.round(total / n / 86_400_000);
}

export function percentDelta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}
