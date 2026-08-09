/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Note: 'remotePatterns' is preferred in newer Next.js versions over 'domains'
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;