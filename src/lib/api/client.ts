import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import { getToken, removeToken, refreshAccessToken } from '../auth/token-manager';

/**
 * Cliente HTTP base con interceptores
 * FORZADO a usar URLs relativas para que Next.js API Route actúe como proxy
 * Esto evita completamente el error de Mixed Content
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api', // FORZADO: siempre usar URL relativa
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Interceptor CRÍTICO: Forzar URLs relativas y eliminar cualquier URL absoluta
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // FORZAR que baseURL sea siempre relativa
    if (config.baseURL && typeof config.baseURL === 'string' && config.baseURL.startsWith('http')) {
      config.baseURL = '/api';
    }
    
    // FORZAR que la URL sea siempre relativa
    if ('url' in config && config.url) {
      const url = config.url as string;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        // Convertir URL absoluta a relativa
        try {
          const urlObj = new URL(url);
          config.url = urlObj.pathname + urlObj.search;
          // Asegurar que baseURL sea relativa
          config.baseURL = '/api';
        } catch {
          // Si falla, simplemente usar '/api' + path
          config.url = '/api' + url.replace(/^https?:\/\/[^/]+/, '');
          config.baseURL = '';
        }
      } else if (!url.startsWith('/')) {
        // Si no empieza con /, asegurar que baseURL esté configurado
        config.baseURL = config.baseURL || '/api';
      }
    }
    
    // Asegurar que baseURL siempre sea relativa
    if (!config.baseURL || (typeof config.baseURL === 'string' && config.baseURL.startsWith('http'))) {
      config.baseURL = '/api';
    }
    
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debugging (solo en desarrollo)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[API Client] Request:', {
        baseURL: config.baseURL,
        url: 'url' in config ? config.url : 'N/A',
        fullURL: config.baseURL + ('url' in config && config.url ? config.url : ''),
      });
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores y refrescar token
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si el error es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient.request(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, eliminar tokens y redirigir a login
        removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;


