/** @type {import('next').NextConfig} */
const fs = require('fs');

const nextConfig = {
  // appDir ya no es experimental en Next.js 14
  images: {
    domains: [
      'localhost',
      'citypaj.s3.amazonaws.com',
      'images.citypaj.es',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    const apiUrlRaw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
<<<<<<< HEAD
    const apiUrlCandidate = apiUrlRaw.replace(/\/api\/?$/, '');
    const isDocker = fs.existsSync('/.dockerenv');
    let apiUrl = apiUrlCandidate;
    if (!isDocker && /\bbackend:3002\b/.test(apiUrl)) {
      apiUrl = 'http://localhost:3002';
    }
    if (/(:3001\b|localhost:3001\b|127\.0\.0\.1:3001\b)/.test(apiUrl)) {
      apiUrl = 'http://localhost:3002';
    }
=======
    const apiUrl = apiUrlRaw.replace(/\/api\/?$/, '');
>>>>>>> 887dc43 (Añadidos cambios de frontend, backend y configs, excluyendo Dockerfile)
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
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
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Configuración personalizada si es necesario
    return config;
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },
};

module.exports = nextConfig;
