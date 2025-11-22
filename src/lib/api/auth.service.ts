import apiClient from './client';
import { API_ENDPOINTS } from './config';
import { AuthResponse, LoginDto, RegisterDto, User } from '../types';
import { saveTokens, removeToken } from '../auth/token-manager';

/**
 * Servicio de autenticación
 */
export const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<{ success: boolean; data: AuthResponse }>(API_ENDPOINTS.auth.login, credentials);
    
    // El backend envuelve la respuesta en { success: true, data: {...} }
    const data = response.data.data || response.data;
    
    if (!data.accessToken || !data.refreshToken) {
      throw new Error('Respuesta de autenticación inválida');
    }
    
    // Guardar tokens
    saveTokens(data.accessToken, data.refreshToken);
    
    return data;
  },

  /**
   * Registrarse
   */
  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<{ success: boolean; data: AuthResponse }>(API_ENDPOINTS.auth.register, userData);
    
    // El backend envuelve la respuesta en { success: true, data: {...} }
    const data = response.data.data || response.data;
    
    if (!data.accessToken || !data.refreshToken) {
      throw new Error('Respuesta de autenticación inválida');
    }
    
    // Guardar tokens
    saveTokens(data.accessToken, data.refreshToken);
    
    return data;
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      removeToken();
    }
  },

  /**
   * Obtener perfil del usuario
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: User }>(API_ENDPOINTS.auth.profile);
    // El backend envuelve la respuesta en { success: true, data: {...} }
    return response.data.data || response.data;
  },

  /**
   * Refrescar token de acceso
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await apiClient.post<{ success: boolean; data: { accessToken: string } }>(
      API_ENDPOINTS.auth.refresh,
      { refreshToken }
    );
    // El backend envuelve la respuesta en { success: true, data: {...} }
    const data = response.data.data || response.data;
    return data;
  },
};


