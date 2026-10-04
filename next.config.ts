import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static files: fast, cheap, nothing to run on a server.
  output: "export",
  // No Next.js badge in the corner while the app mock runs with `npm run app`.
  devIndicators: false,
  images: { unoptimized: true },
};

export default nextConfig;
