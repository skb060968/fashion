/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Let Next.js optimize local images
    unoptimized: false,

    // Viewport-based scaling (mobile, tablet, desktop)
    deviceSizes: [320, 420, 640, 768, 1024, 1200],

    // Fixed layout widths based on your actual <Image> blocks
    imageSizes: [
      // Logos & utility icons
      40, 80, 100, 140, 150, 176, 200, 220,

      // Thumbnails & cards
      348, 356, 464, 475, 500, 526, 600, 701,

      // Larger hero / cover images
      700, 900, 1200
    ],

    // Modern formats for better performance
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;