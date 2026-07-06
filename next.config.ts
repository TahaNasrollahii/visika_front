import type { NextConfig } from "next";

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
        destination: 'http://127.0.0.1:8000/:path*/',
      },
      // Match paths without trailing slash and add one (Django requires it)
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/:path*/',
      },
      {
        source: '/media/:path*',
        destination: 'http://127.0.0.1:8000/media/:path*',
      }
    ]
  }
};

export default nextConfig;
