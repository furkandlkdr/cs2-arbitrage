import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  // basePath: isProd ? '/cs2-arbitraj' : '',
  // assetPrefix: isProd ? '/cs2-arbitraj/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
