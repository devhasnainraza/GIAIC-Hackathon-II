/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration for Vercel
  output: 'standalone',

  // Performance optimizations
  experimental: {
    // Enable optimizations compatible with Next.js 16
    optimizePackageImports: ['lucide-react'],
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimization
  images: {
    // Enable image optimization
    formats: ['image/webp', 'image/avif'],
    // Configure remote patterns for backend avatar uploads (Next.js 13+ recommended approach)
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
    // Allow unoptimized images for development (fixes localhost private IP blocking)
    unoptimized: process.env.NODE_ENV === 'development',
    // Optimize image loading
    minimumCacheTTL: 60,
  },

  // Turbopack configuration for Next.js 16
  turbopack: {
    // Enable turbopack optimizations
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=60',
          },
        ],
      },
    ];
  },

  // Compression
  compress: true,

  // Power optimizations
  poweredByHeader: false,

  // Strict mode for better performance
  reactStrictMode: true,

  // Trailing slash handling
  trailingSlash: false,
};

module.exports = nextConfig;