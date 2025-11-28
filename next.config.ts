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
  // Los rewrites no funcionan para peticiones HTTP del cliente
  // Usamos API Routes en /app/api/[...path]/route.ts como proxy
};

export default nextConfig;
