import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  // Next 16 blocks cross-origin dev requests by default; allow 127.0.0.1 so the
  // dev server hydrates whether opened via localhost or 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  async rewrites() {
    return [
      // Match paths that already end with a slash
      {
        source: '/api/:path*/',
        destination: `${BACKEND_URL}/:path*/`,
      },
      // Match paths without trailing slash and add one (Django requires it)
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/:path*/`,
      },
      {
        source: '/media/:path*',
        destination: `${BACKEND_URL}/media/:path*`,
      }
    ]
  }
};

export default nextConfig;
