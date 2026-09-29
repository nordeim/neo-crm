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
  // The scaffold family keeps the explicit `bun run typecheck` step as the
  // type gate; build errors stay visible without breaking container builds.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
