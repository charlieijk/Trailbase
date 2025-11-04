/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Basic Config */
  reactStrictMode: true,
  swcMinify: true,

  /* TypeScript */
  typescript: {
    // Set to false to allow production builds even with type errors
    // Change to true in production
    ignoreBuildErrors: false,
  },

  /* ESLint */
  eslint: {
    // Set to false to allow production builds even with ESLint errors
    // Change to true in production
    ignoreDuringBuilds: false,
  },

  /* Images */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /* Experimental Features */
  experimental: {
    // Enable Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Enable PPR (Partial Prerendering) when stable
    // ppr: 'incremental',
  },

  /* Environment Variables */
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  /* Headers */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  /* Redirects */
  async redirects() {
    return [
      {
        source: '/camp',
        destination: '/campsites',
        permanent: true,
      },
      {
        source: '/camps',
        destination: '/campsites',
        permanent: true,
      },
    ];
  },

  /* Webpack Config */
  webpack: (config, { dev, isServer }) => {
    // Add custom webpack config if needed
    return config;
  },

  /* Performance */
  poweredByHeader: false,
  compress: true,

  /* Output */
  output: 'standalone', // For Docker deployment
};

module.exports = nextConfig;
