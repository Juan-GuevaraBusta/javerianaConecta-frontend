import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configuración para Vercel
  output: 'standalone',
  // Deshabilitar verificación de ESLint durante el build (temporalmente)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Proxy para evitar Mixed Content (HTTPS -> HTTP)
  // Todas las peticiones a /api/* se redirigen al backend HTTP
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://34.217.206.3:3000/api';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
