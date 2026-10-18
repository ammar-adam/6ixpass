import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static files: fast, cheap, nothing to run on a server.
  output: "export",
  // No Next.js badge in the corner while the app mock runs with `npm run app`.
  devIndicators: false,
  images: { unoptimized: true },
  // Real accounts (supabase-js) only ship in builds that turn them on. See src/lib/auth/remote.ts.
  turbopack: {
    resolveAlias: process.env.NEXT_PUBLIC_AUTH_MODE === "supabase" ? {} : { "@/lib/auth/remote": "./src/lib/auth/remote-off.ts" },
  },
};

export default nextConfig;
