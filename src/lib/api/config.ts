/**
 * Configuración base de la API
 */
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

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


