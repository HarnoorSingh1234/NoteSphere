import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['img.clerk.com'],
  },
  // Disable ESLint during builds
  eslint: {
    // Skip the ESLint build step
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
