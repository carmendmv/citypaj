/** @type {import('next').NextConfig} */
const fs = require('fs');

const nextConfig = {
  // appDir ya no es experimental en Next.js 14
  images: {
    domains: [
      'localhost',
      'citypaj.s3.amazonaws.com',
      'images.citypaj.es',
      'citypaj.es',
      'www.citypaj.es',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'citypaj.es' }],
        destination: 'https://www.citypaj.es/:path*',
        permanent: true,
      },
      { source: '/ocio', destination: '/anuncios?categoria=ocio', permanent: false },
      { source: '/servicios', destination: '/anuncios?categoria=servicios', permanent: false },
      { source: '/educacion', destination: '/anuncios?categoria=formacion', permanent: false },
      { source: '/formacion', destination: '/anuncios?categoria=formacion', permanent: false },
      { source: '/empleo', destination: '/anuncios?categoria=empleo', permanent: false },
      { source: '/vivienda', destination: '/anuncios?categoria=vivienda', permanent: false },
    ];
  },
  async rewrites() {
    const apiUrlRaw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    const apiUrlCandidate = apiUrlRaw.replace(/\/api\/?$/, '');
    const isDocker = fs.existsSync('/.dockerenv');
    let apiUrl = apiUrlCandidate;
    
    // En desarrollo local, usar siempre localhost:3002
    if (!isDocker) {
      apiUrl = 'http://localhost:3002';
    }
    
    // En Docker, usar backend:3002 si está disponible
    if (isDocker && process.env.NODE_ENV === 'production') {
      apiUrl = process.env.API_URL_DOCKER || 'http://backend:3002';
    }
    
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
