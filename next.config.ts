import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['img.clerk.com'],
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
