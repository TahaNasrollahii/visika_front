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
      {
        protocol: "https",
        hostname: "visika-back.vercel.app",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  async rewrites() {
    const defaultApiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://visika-back.vercel.app' 
      : 'http://127.0.0.1:8000';
    const API_URL = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;
    
    return [
      // Match paths that already end with a slash
      {
        source: '/api/:path*/',
        destination: `${API_URL}/:path*/`,
      },
      // Match paths without trailing slash and add one (Django requires it)
      {
        source: '/api/:path*',
        destination: `${API_URL}/:path*/`,
      },
      {
        source: '/media/:path*',
        destination: `${API_URL}/media/:path*`,
      }
    ]
  }
};

export default nextConfig;
