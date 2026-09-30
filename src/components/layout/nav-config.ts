import {
  LayoutDashboard,
  // Session-17 (S17-P2a): the reference's sidebar glyphs — `users`
  // (two-person), `circle-user` (head r=3 + shoulders path) and
  // `calendar` (blank body, no day dots). lucide-react 0.525 exports
  // all three under the renamed canonical names (path-verified equal);
  // our old User/CircleUserRound/CalendarDays were DIFFERENT glyphs.
  Users,
  CircleUser,
  Target,
  Calendar,
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
  { href: "/accounts", label: "Accounts", icon: Users },
  { href: "/contacts", label: "Contacts", icon: CircleUser },
  { href: "/leads", label: "Leads", icon: Target },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

/** Rendered directly below a thin divider (reference layout — not pinned to the bottom). */
export const NAV_FOOTER_ITEMS: NavItem[] = [{ href: "/settings", label: "Settings", icon: Settings }];
