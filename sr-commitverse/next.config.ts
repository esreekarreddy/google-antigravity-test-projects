import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Redirect from Vercel default domain to custom domain
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'sr-commitverse.vercel.app',
          },
        ],
        destination: 'https://commitverse.sreekarreddy.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
