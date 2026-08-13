import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@lexasafe/ui", "@lexasafe/motion"],
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@lexasafe/ui", "@lexasafe/motion"],
  },
};

export default nextConfig;
