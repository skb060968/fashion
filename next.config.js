/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // remove unoptimized:true so Next can handle local images properly
    unoptimized: false,
  },
}

module.exports = nextConfig