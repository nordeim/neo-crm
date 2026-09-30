import type { Metadata } from "next";
import { NotFoundBody } from "./not-found-body";

// Session-12 (S12-P2): the reference's custom 404 — a designed slate-family
// surface (NOT the stock Next.js built-in): centered on bg-slate-50 with a
// font-light "404" display heading, "Page Not Found", the quoted-pathname
// message and a white bordered Go Home pill (lucide Home icon) that
// navigates to `/`. No app shell (the reference renders it bare). The
// pathname interpolation lives in the client body (usePathname); the title
// is the reference's `This Page Does Not Exist | NEO CRM` — an ABSOLUTE
// title, because the root layout's "%s | NEO CRM" template would double
// the suffix otherwise.
export const metadata: Metadata = {
  title: { absolute: "This Page Does Not Exist | NEO CRM" },
};

export default function NotFound() {
  return <NotFoundBody />;
}
