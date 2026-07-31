/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'racqueteer.websplash.pro',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'racqueteer.vercel.app',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
