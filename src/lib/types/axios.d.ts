/**
 * Declaración de tipos para axios
 * Esto ayuda a TypeScript a reconocer axios hasta que se instalen las dependencias
 */

declare module 'axios' {
  export interface AxiosRequestConfig {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
    params?: any;
    data?: any;
    responseType?: 'json' | 'blob' | 'text' | 'arraybuffer' | 'document' | 'stream';
  }

  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosRequestConfig;
  }

  export interface AxiosError<T = any> extends Error {
    config: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: AxiosResponse<T>;
    isAxiosError: boolean;
  }

  export interface InternalAxiosRequestConfig extends AxiosRequestConfig {
    headers: any;
    _retry?: boolean;
  }

  export interface AxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    interceptors: {
      request: {
        use(
          onFulfilled?: (value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
          onRejected?: (error: any) => any
        ): number;
      };
      response: {
        use(
          onFulfilled?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
          onRejected?: (error: AxiosError) => any
        ): number;
      };
    };
  }

  export interface AxiosStatic extends AxiosInstance {
    create(config?: AxiosRequestConfig): AxiosInstance;
  }

  const axios: AxiosStatic;
  export default axios;
}

