/**
 * Tipos TypeScript para la aplicación
 */

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  age?: number;
  city?: string;
  career?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  age?: number;
  city?: string;
  career?: string;
}

export interface LatexTemplate {
  id: number;
  name: string;
  faculty: string;
  careerCode: string;
  description?: string;
  latexContent: string;
  style: string;
  requiredFields: string[];
  templateConfig?: Record<string, unknown>;
  isActive: boolean;
  isFeatured: boolean;
  version: string;
  previewPdfUrl?: string;
  previewPdfS3Key?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateDto {
  name: string;
  faculty: string;
  careerCode: string;
  description?: string;
  latexContent: string;
  style?: string;
  requiredFields: string[];
  templateConfig?: Record<string, unknown>;
  isFeatured?: boolean;
  version?: string;
}

export interface GeneratedResume {
  id: number;
  title: string;
  userId: number;
  templateId: number;
  userData: Record<string, unknown>;
  generatedLatex?: string;
  pdfPath?: string;
  s3Url?: string;
  s3Key?: string;
  generationStatus: 'generating' | 'completed' | 'failed' | 'pending_review';
  aiSuggestions?: Record<string, unknown>;
  notes?: string;
  isFavorite: boolean;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeDto {
  title: string;
  templateId: number;
  userData: Record<string, unknown>;
  notes?: string;
  isFavorite?: boolean;
}

export interface GenerateWithFreeTextDto {
  userId: number;
  templateId: number;
  userFreeText: string;
  customTitle?: string;
  additionalContext?: string;
  baseResumeId?: number;
  aiConfig?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  count?: number;
}


