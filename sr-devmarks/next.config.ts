import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            // Permissive CSP to ensure no breakage while providing a baseline
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: https:; img-src 'self' blob: data: https:; font-src 'self' data: https:; connect-src 'self' https:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
