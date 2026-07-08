import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["impit", "undici"],
};

export default nextConfig;
