/**
 * Declaraciones de tipos globales
 * Este archivo ayuda a TypeScript a reconocer los módulos
 */

declare module 'js-cookie' {
  export interface CookieAttributes {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  }

  export function set(name: string, value: string, options?: CookieAttributes): string | undefined;
  export function get(name: string): string | undefined;
  export function remove(name: string, options?: CookieAttributes): void;
  
  const Cookies: {
    set: typeof set;
    get: typeof get;
    remove: typeof remove;
  };
  
  export default Cookies;
}


