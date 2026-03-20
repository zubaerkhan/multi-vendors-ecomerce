// import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'https://lh3.googleusercontent.com' },
      { hostname: 'res.cloudinary.com' },
    ],
  },
  experimental: {
    optimizeCss: false,
  },
}

module.exports = nextConfig
