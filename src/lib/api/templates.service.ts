import apiClient from './client';
import { API_ENDPOINTS } from './config';
import { LatexTemplate, CreateTemplateDto, ApiResponse } from '../types';

/**
 * Servicio de plantillas LaTeX
 */
export const templatesService = {
  /**
   * Obtener todas las plantillas
   */
  async getAllTemplates(filters?: {
    name?: string;
    faculty?: string;
    careerCode?: string;
    style?: string;
    isActive?: boolean;
    isFeatured?: boolean;
  }): Promise<LatexTemplate[]> {
    const response = await apiClient.get<ApiResponse<LatexTemplate[]>>(
      API_ENDPOINTS.templates.list,
      { params: filters }
    );
    return response.data.data || [];
  },

  /**
   * Obtener plantilla por ID
   */
  async getTemplateById(id: number): Promise<LatexTemplate> {
    const response = await apiClient.get<ApiResponse<LatexTemplate>>(
      API_ENDPOINTS.templates.detail(id)
    );
    
    // El backend envuelve la respuesta en { success: true, data: {...} }
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Plantilla no encontrada');
    }
    
    return response.data.data;
  },

  /**
   * Obtener plantillas destacadas
   */
  async getFeaturedTemplates(): Promise<LatexTemplate[]> {
    const response = await apiClient.get<ApiResponse<LatexTemplate[]>>(
      API_ENDPOINTS.templates.featured
    );
    return response.data.data || [];
  },

  /**
   * Crear nueva plantilla
   */
  async createTemplate(data: CreateTemplateDto): Promise<LatexTemplate> {
    const response = await apiClient.post<ApiResponse<LatexTemplate>>(
      API_ENDPOINTS.templates.create,
      data
    );
    
    // El backend puede devolver { success: false, message: '...', data: null } en caso de error
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al crear plantilla');
    }
    
    return response.data.data;
  },

  /**
   * Actualizar plantilla
   */
  async updateTemplate(id: number, data: Partial<CreateTemplateDto>): Promise<LatexTemplate> {
    const response = await apiClient.patch<ApiResponse<LatexTemplate>>(
      API_ENDPOINTS.templates.update(id),
      data
    );
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar plantilla');
    }
    return response.data.data;
  },

  /**
   * Eliminar plantilla
   */
  async deleteTemplate(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.templates.delete(id));
  },

  /**
   * Subir PDF de preview para una plantilla
   */
  async uploadPreviewPdf(id: number, file: File): Promise<LatexTemplate> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<LatexTemplate>>(
      API_ENDPOINTS.templates.uploadPdf(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // El backend puede devolver { success: false, message: '...', data: null } en caso de error
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al subir PDF');
    }
    
    return response.data.data;
  },
};


