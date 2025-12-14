/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/projects/mindforge",
  assetPrefix: "/projects/mindforge",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
