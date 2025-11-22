'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginDto, RegisterDto } from '../types';
import { authService } from '../api/auth.service';
import { getToken, removeToken } from './token-manager';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token y cargar el usuario
    const token = getToken();
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error: any) {
      console.error('Error al cargar usuario:', error);
      // Solo eliminar token si es un error 401 (no autenticado)
      // No eliminar por otros errores (red, servidor, etc.)
      if (error.response?.status === 401 || error.response?.status === 403) {
        removeToken();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginDto) => {
    try {
      const response: AuthResponse = await authService.login(credentials);
      setUser(response.user);
      setLoading(false);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterDto) => {
    const response: AuthResponse = await authService.register(userData);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}


