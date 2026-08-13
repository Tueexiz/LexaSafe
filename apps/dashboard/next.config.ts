import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@lexasafe/ui", "@lexasafe/motion"],
  output: "standalone",
};

export default nextConfig;
