import type { NextConfig } from "next";
import path from "node:path";

// Standalone output keeps the production server self-contained (the e2e
// suite boots .next/standalone/server.js on an isolated port with its own
// SQLite file). outputFileTracingRoot is pinned so the traced
// prisma/schema.prisma copy lands at a stable location for the db-path
// resolver (src/lib/db-path.ts).

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.resolve(import.meta.dirname),
  // Hide the Next.js dev-tools indicator (the floating "N" button) so dev
  // server screenshots stay clean — it never ships in production anyway.
  devIndicators: false,
  // The scaffold family keeps the explicit `bun run typecheck` step as the
  // type gate; build errors stay visible without breaking container builds.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Session-20 (S20-P1/P2/P3): the reference's edge (Cloudflare/Caddy)
  // injects a three-header security set on EVERY response — HTML routes,
  // authed routes, its hashed CSS asset, /manifest.json, and its SPA
  // fallback 200s (curl-verified on 10+ responses, 2026-10-01). The
  // self-hosted expression is this headers() block. HSTS ships as the
  // reference's exact bare value; per RFC 6797 §7.1 a UA MUST NOT process
  // it over non-secure transport, so it is inert on plain-HTTP localhost
  // and correct whenever a deployment runs behind HTTPS.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
        ],
      },
    ];
  },
};

export default nextConfig;
