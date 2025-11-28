import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Guardar tokens en cookies
 */
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1 }); // 1 día
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7 }); // 7 días
};

/**
 * Obtener access token
 */
export const getToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

/**
 * Obtener refresh token
 */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

/**
 * Eliminar tokens
 */
export const removeToken = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};

/**
 * Verificar si el token está expirado (básico)
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convertir a milisegundos
    return Date.now() >= exp;
  } catch {
    return true;
  }
};

/**
 * Refrescar access token
 * Usa /api para que Next.js API Route actúe como proxy
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    // Usar URL relativa para que el proxy de Next.js maneje la petición
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const result = await response.json();
    // El backend envuelve la respuesta en { success: true, data: {...} }
    const data = result.data || result;
    
    if (data.accessToken) {
      Cookies.set(ACCESS_TOKEN_KEY, data.accessToken, { expires: 1 });
      return data.accessToken;
    }

    return null;
  } catch (error) {
    removeToken();
    return null;
  }
};


