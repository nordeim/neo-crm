import {
  LayoutDashboard,
  Building2,
  Users,
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

/** Main nav (mirrors the reference app's sidebar order). */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: Building2 },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/leads", label: "Leads", icon: Target },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

/** Pinned to the sidebar bottom. */
export const NAV_FOOTER_ITEMS: NavItem[] = [{ href: "/settings", label: "Settings", icon: Settings }];
