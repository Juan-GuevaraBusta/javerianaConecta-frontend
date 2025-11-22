import apiClient from './client';
import { API_ENDPOINTS } from './config';
import { GeneratedResume, CreateResumeDto, GenerateWithFreeTextDto, ApiResponse } from '../types';

/**
 * Servicio de CVs generados
 */
export const resumesService = {
  /**
   * Obtener todos los CVs del usuario
   */
  async getAllResumes(filters?: {
    title?: string;
    templateId?: number;
    generationStatus?: string;
    isFavorite?: boolean;
  }): Promise<GeneratedResume[]> {
    const response = await apiClient.get<ApiResponse<GeneratedResume[]>>(
      API_ENDPOINTS.resumes.list,
      { params: filters }
    );
    return response.data.data || [];
  },

  /**
   * Obtener CV por ID
   */
  async getResumeById(id: number): Promise<GeneratedResume> {
    const response = await apiClient.get<ApiResponse<GeneratedResume>>(
      API_ENDPOINTS.resumes.detail(id)
    );
    if (!response.data.data) {
      throw new Error('CV no encontrado');
    }
    return response.data.data;
  },

  /**
   * Crear nuevo CV
   */
  async createResume(data: CreateResumeDto): Promise<GeneratedResume> {
    const response = await apiClient.post<ApiResponse<GeneratedResume>>(
      API_ENDPOINTS.resumes.create,
      data
    );
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al crear CV');
    }
    return response.data.data;
  },

  /**
   * Generar CV con texto libre
   */
  async generateWithFreeText(data: GenerateWithFreeTextDto): Promise<GeneratedResume> {
    const response = await apiClient.post<ApiResponse<GeneratedResume>>(
      API_ENDPOINTS.resumes.generateWithText,
      data
    );
    
    // El backend envuelve la respuesta en { success: true, data: {...} }
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al generar CV');
    }
    
    return response.data.data;
  },

  /**
   * Generar CV con IA
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async generateWithAI(data: any): Promise<GeneratedResume> {
    const response = await apiClient.post<ApiResponse<GeneratedResume>>(
      API_ENDPOINTS.resumes.generateWithAI,
      data
    );
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al generar CV con IA');
    }
    return response.data.data;
  },

  /**
   * Actualizar CV
   */
  async updateResume(id: number, data: Partial<CreateResumeDto>): Promise<GeneratedResume> {
    const response = await apiClient.patch<ApiResponse<GeneratedResume>>(
      API_ENDPOINTS.resumes.update(id),
      data
    );
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar CV');
    }
    return response.data.data;
  },

  /**
   * Eliminar CV
   */
  async deleteResume(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.resumes.delete(id));
  },

  /**
   * Descargar PDF del CV
   */
  async downloadResumePdf(id: number): Promise<Blob> {
    const response = await apiClient.get<Blob>(
      API_ENDPOINTS.resumes.downloadPdf(id),
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
};


