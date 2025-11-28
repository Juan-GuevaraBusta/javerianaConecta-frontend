import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import { getToken, removeToken, refreshAccessToken } from '../auth/token-manager';

/**
 * Cliente HTTP base con interceptores
 * Usa URLs relativas para que Next.js API Route actúe como proxy
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL, // '/api' - URL relativa para usar el proxy
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Interceptor para agregar token JWT a las peticiones
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Asegurar que la URL sea relativa (no absoluta)
    if ('url' in config && config.url && typeof config.url === 'string' && config.url.startsWith('http')) {
      // Si por alguna razón viene una URL absoluta, convertirla a relativa
      const url = new URL(config.url);
      config.url = url.pathname + url.search;
    }
    
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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


