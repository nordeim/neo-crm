import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import { SITE_DESCRIPTION, siteUrl } from "@/lib/site";
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
  // through src/lib/site.ts since this session).
  metadataBase: new URL(siteUrl()),
  title: {
    default: "NEO CRM",
    // Session-10 (S10-10): the reference's separator is a pipe
    // ("Accounts | NEO CRM" — document.title probes on all 10 routes).
    template: "%s | NEO CRM",
  },
  description: SITE_DESCRIPTION,
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
  // rides the `other` escape hatch.
  other: {
    "twitter:url": siteUrl(),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
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
