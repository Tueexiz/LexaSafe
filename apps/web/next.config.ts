import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  transpilePackages: ["@lexasafe/ui", "@lexasafe/motion"],
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [{ source: "/createurs", destination: "/", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/portraits/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
