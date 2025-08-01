import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["*"],
  },
  async rewrites() {
    if (process.env.NEXT_PUBLIC_RYBBIT_HOST) {
      return [
        {
          source: "/api/script.js",
          destination: `${process.env.NEXT_PUBLIC_RYBBIT_HOST}/api/script.js`,
        },
        {
          source: "/api/track",
          destination: `${process.env.NEXT_PUBLIC_RYBBIT_HOST}/api/track`,
        },
      ]
    }
    return [];
  },
};

export default nextConfig;
