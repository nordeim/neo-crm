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

/** Main nav (mirrors the reference app's sidebar order + icon shapes).
 * Session-24 (S24-P2): the hrefs are the reference's CAPITALIZED paths —
 * byte-extracted from its live DOM (its sidebar links point at
 * /Dashboard, /Accounts, … /Settings, and every capital URL renders the
 * page in place per S24-P1). The lowercase routes stay canonical; the
 * active-state matching in sidebar.tsx is case-insensitive exactly like
 * the reference's (it highlights Reports at lowercase /reports). */
export const NAV_ITEMS: NavItem[] = [
  { href: "/Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/Accounts", label: "Accounts", icon: Users },
  { href: "/Contacts", label: "Contacts", icon: CircleUser },
  { href: "/Leads", label: "Leads", icon: Target },
  { href: "/Calendar", label: "Calendar", icon: Calendar },
  { href: "/Activities", label: "Activities", icon: Activity },
  { href: "/Reports", label: "Reports", icon: BarChart3 },
];

/** Rendered below a thin divider and pinned to the sidebar's bottom via the
 * flex column's `mt-auto` footer group (NAV_LAYOUT.footerGroup — session-7). */
export const NAV_FOOTER_ITEMS: NavItem[] = [{ href: "/Settings", label: "Settings", icon: Settings }];
