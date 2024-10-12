/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commentez ou supprimez cette ligne
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
