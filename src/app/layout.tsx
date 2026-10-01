import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import { PWA_META, SITE_DESCRIPTION, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  // Session-18: the document metadata layer — the reference's 405-char
  // description paragraph + the full OG/Twitter card family + the
  // build-time-inlined canonical origin (NEXT_PUBLIC_SITE_URL, consumed
  // through src/lib/site.ts since that session).
  // Session-19: + the PWA/installable family (the manifest link, the
  // apple-touch-icon, the mobile-web-app-capable/apple metas, the
  // #000000 theme-color — all live-verified on the reference) + the root
  // canonical link (the reference ships link[rel=canonical] per-route).
  // The apple-touch-icon rides the src/app/apple-icon.png FILE
  // CONVENTION (180x180 BrandMark tile) — declaring metadata.icons would
  // REPLACE the file-convention link[rel=icon] (gate-caught: the s18
  // favicon test failed with icons present), so both icons ship as file
  // conventions and this object declares NEITHER.
  metadataBase: new URL(siteUrl()),
  manifest: `${siteUrl()}/manifest.json`,
  title: {
    default: "NEO CRM",
    // Session-10 (S10-10): the reference's separator is a pipe
    // ("Accounts | NEO CRM" — document.title probes on all 10 routes).
    template: "%s | NEO CRM",
  },
  description: SITE_DESCRIPTION,
  // The reference's canonical link: origin + route (the dashboard's is
  // the bare origin). Next's URL resolution strips the root's trailing
  // slash (verified live: `${siteUrl()}/` emits the same slashless href —
  // the s18 "viewport 1 vs 1.0" cosmetic-serialization class). Inner
  // pages override this through pageMetadata().
  alternates: { canonical: "/" },
  openGraph: {
    title: "NEO CRM",
    description: SITE_DESCRIPTION,
    url: siteUrl(),
    type: "website",
    siteName: "NEO CRM",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEO CRM",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  // The Next twitter metadata object has no url field (verified against
  // next 16.3.6's twitter-types) — the reference ships twitter:url, so it
  // rides the `other` escape hatch. PWA_META adds the reference's
  // mobile-web-app-capable + apple pair (also without first-class
  // fields). NOTE: page-level metadata REPLACES this map (shallow merge),
  // which is why pageMetadata() re-declares all of it per page.
  other: {
    "twitter:url": siteUrl(),
    ...PWA_META,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Session-19 (S19-P2): the reference's meta[name=theme-color] is
  // #000000 (black — probed on both its login page and the authed shell).
  // Ours had shipped #2563eb since the scaffold.
  themeColor: "#000000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
