import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static files: fast, cheap, nothing to run on a server.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
