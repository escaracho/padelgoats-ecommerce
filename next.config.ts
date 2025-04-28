import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['padelgoats-images.s3.sa-east-1.amazonaws.com'],
    formats: ['image/webp'],
  }
};

export default nextConfig;
