import {
  LayoutDashboard,
  CircleUserRound,
  User,
  Target,
  CalendarDays,
  Activity,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Main nav (mirrors the reference app's sidebar order + icon shapes). */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: User },
  { href: "/contacts", label: "Contacts", icon: CircleUserRound },
  { href: "/leads", label: "Leads", icon: Target },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

/** Rendered directly below a thin divider (reference layout — not pinned to the bottom). */
export const NAV_FOOTER_ITEMS: NavItem[] = [{ href: "/settings", label: "Settings", icon: Settings }];
