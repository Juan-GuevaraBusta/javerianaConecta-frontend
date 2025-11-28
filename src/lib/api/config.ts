/**
 * Configuración base de la API
 * IMPORTANTE: Siempre usar URLs relativas para que Next.js API Route actúe como proxy
 * Esto evita completamente el error de Mixed Content (HTTPS -> HTTP)
 */
export const API_CONFIG = {
  // FORZADO: Siempre usar URL relativa '/api' - NUNCA usar URLs absolutas
  // El proxy está en /app/api/[...path]/route.ts
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Verificar que no se esté usando NEXT_PUBLIC_API_URL en el cliente
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
  console.warn('[API Config] ADVERTENCIA: NEXT_PUBLIC_API_URL está definida pero NO debe usarse en el cliente. Usar siempre URLs relativas.');
}

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  templates: {
    list: '/latex-templates',
    featured: '/latex-templates/featured',
    detail: (id: number) => `/latex-templates/${id}`,
    create: '/latex-templates',
    update: (id: number) => `/latex-templates/${id}`,
    delete: (id: number) => `/latex-templates/${id}`,
    uploadPdf: (id: number) => `/latex-templates/${id}/preview-pdf`,
  },
  resumes: {
    list: '/generated-resumes',
    detail: (id: number) => `/generated-resumes/${id}`,
    create: '/generated-resumes',
    generateWithText: '/generated-resumes/generate-with-text',
    generateWithAI: '/generated-resumes/ai-generate',
    update: (id: number) => `/generated-resumes/${id}`,
    delete: (id: number) => `/generated-resumes/${id}`,
    downloadPdf: (id: number) => `/generated-resumes/${id}/download-pdf`,
  },
};


