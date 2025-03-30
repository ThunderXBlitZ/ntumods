import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'build',
  basePath: '/ntumods',
  assetPrefix: '/ntumods/',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
