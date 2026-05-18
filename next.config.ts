import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve("."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;