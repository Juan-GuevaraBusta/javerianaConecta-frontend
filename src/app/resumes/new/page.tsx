'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { Loading } from '../../../components/ui/Loading';
import { useAuth } from '../../../lib/auth/auth-context';
import { resumesService } from '../../../lib/api/resumes.service';
import { templatesService } from '../../../lib/api/templates.service';
import { LatexTemplate, GenerateWithFreeTextDto } from '../../../lib/types';
import { useForm } from 'react-hook-form';

export default function NewResumePage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('templateId');
  const [templates, setTemplates] = useState<LatexTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    templateIdParam ? parseInt(templateIdParam) : null
  );
  const [selectedTemplate, setSelectedTemplate] = useState<LatexTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ResumeFormData = {
    customTitle?: string;
    userFreeText?: string;
    additionalContext?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResumeFormData>();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTemplates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedTemplateId && templates.length > 0) {
      loadSelectedTemplate();
    } else {
      setSelectedTemplate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId, templates]);

  const loadTemplates = async () => {
    try {
      const data = await templatesService.getAllTemplates({ isActive: true });
      setTemplates(data);
      
      // Si hay un templateId en la URL, cargar esa plantilla
      if (templateIdParam) {
        const template = data.find(t => t.id === parseInt(templateIdParam));
        if (template) {
          setSelectedTemplate(template);
        }
      }
    } catch (error: unknown) {
      console.error('Error al cargar plantillas:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const loadSelectedTemplate = async () => {
    if (!selectedTemplateId) return;
    
    try {
      setLoadingTemplate(true);
      const template = await templatesService.getTemplateById(selectedTemplateId);
      setSelectedTemplate(template);
      reset(); // Limpiar el formulario cuando cambia la plantilla
    } catch (error: unknown) {
      console.error('Error al cargar plantilla:', error);
      setError('Error al cargar la plantilla seleccionada');
    } finally {
      setLoadingTemplate(false);
    }
  };

  const onSubmit = async (data: ResumeFormData) => {
    if (!selectedTemplateId || !selectedTemplate) {
      setError('Debes seleccionar una plantilla');
      return;
    }

    if (!user?.id) {
      setError('No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      // Construir datos estructurados desde los campos del formulario
      const structuredData: Record<string, string> = {};
      const requiredFields = selectedTemplate.requiredFields || [];
      
      // Mapear campos del formulario a los campos requeridos
      requiredFields.forEach((field: string) => {
        const fieldKey = field.toLowerCase().replace(/\s+/g, '_');
        const value = (data as Record<string, unknown>)[fieldKey];
        if (value && typeof value === 'string' && value.trim() !== '') {
          structuredData[field] = value.trim();
        }
      });

      // Combinar con texto libre si existe
      let userFreeText = '';
      
      // Si hay datos estructurados, crear texto en formato "campo: valor"
      if (Object.keys(structuredData).length > 0) {
        const structuredText = Object.entries(structuredData)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        userFreeText = structuredText;
        
        // Agregar texto libre adicional si existe
        if (data.userFreeText && data.userFreeText.toString().trim() !== '') {
          userFreeText += '\n\n' + data.userFreeText.toString().trim();
        }
      } else if (data.userFreeText) {
        // Si no hay datos estructurados, usar solo el texto libre
        userFreeText = data.userFreeText.toString().trim();
      }
      
      // Asegurar que hay algún contenido
      if (!userFreeText || userFreeText.trim() === '') {
        setError('Debes completar al menos los campos requeridos o proporcionar texto libre');
        setIsLoading(false);
        return;
      }

      const resumeData: GenerateWithFreeTextDto = {
        userId: user.id,
        templateId: selectedTemplateId,
        userFreeText: userFreeText || 'Información del CV',
        customTitle: data.customTitle || undefined,
        additionalContext: data.additionalContext || undefined,
      };

      const resume = await resumesService.generateWithFreeText(resumeData);
      router.push(`/resumes/${resume.id}`);
    } catch (err: unknown) {
      console.error('Error al generar CV:', err);
      let errorMessage = 'Error al generar CV';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; data?: { message?: string } } }; message?: string };
        errorMessage = axiosError.response?.data?.message || 
                      axiosError.response?.data?.data?.message ||
                      axiosError.message || 
                      errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || loadingTemplates) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#023047] mb-2">Generar Nuevo CV</h1>
        <p className="text-[#6b7280] font-medium mb-8">Crea un CV profesional usando una plantilla y texto libre</p>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert type="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Input
              label="Título del CV (opcional)"
              {...register('customTitle')}
              error={errors.customTitle?.message}
            />

            <div>
              <label className="block text-sm font-semibold text-[#023047] mb-2">
                Seleccionar Plantilla <span className="text-[#FB8500]">*</span>
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219EBC] focus:border-[#219EBC] transition-all duration-200"
                value={selectedTemplateId || ''}
                onChange={(e) => {
                  const newTemplateId = e.target.value ? parseInt(e.target.value) : null;
                  setSelectedTemplateId(newTemplateId);
                  setSelectedTemplate(null);
                  reset();
                }}
                disabled={loadingTemplate}
              >
                <option value="">Selecciona una plantilla</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.faculty}
                  </option>
                ))}
              </select>
              {loadingTemplate && (
                <p className="mt-2 text-sm text-[#6b7280]">Cargando plantilla...</p>
              )}
              {selectedTemplate && (
                <div className="mt-3 p-3 bg-[#8ECAE6] bg-opacity-10 rounded-lg border border-[#8ECAE6] border-opacity-20">
                  <p className="text-sm font-semibold text-[#023047] mb-2">
                    {selectedTemplate.name}
                  </p>
                  {selectedTemplate.description && (
                    <p className="text-sm text-[#6b7280] mb-2">{selectedTemplate.description}</p>
                  )}
                  <p className="text-xs text-[#6b7280]">
                    Campos requeridos: {selectedTemplate.requiredFields?.join(', ') || 'Ninguno'}
                  </p>
                </div>
              )}
            </div>

            {selectedTemplate && selectedTemplate.requiredFields && selectedTemplate.requiredFields.length > 0 && (
              <div className="space-y-4">
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-[#023047] mb-4">
                    Información Requerida
                  </h3>
                  <p className="text-sm text-[#6b7280] mb-4">
                    Por favor, completa los siguientes campos según la plantilla seleccionada:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTemplate.requiredFields.map((field: string) => {
                      const fieldKey = field.toLowerCase().replace(/\s+/g, '_');
                      const isTextArea = ['experience', 'education', 'projects', 'skills', 'programming skills'].some(f => 
                        field.toLowerCase().includes(f.toLowerCase())
                      );
                      
                      return isTextArea ? (
                        <div key={field} className="md:col-span-2">
                          <label className="block text-sm font-semibold text-[#023047] mb-2">
                            {field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-[#FB8500]">*</span>
                          </label>
                          <textarea
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219EBC] focus:border-[#219EBC] transition-all duration-200"
                            rows={4}
                            placeholder={`Ingresa tu ${field.toLowerCase()}`}
                            {...register(fieldKey, { required: `${field} es obligatorio` })}
                          />
                          {errors[fieldKey] && (
                            <p className="mt-1.5 text-sm text-[#FB8500] font-medium">
                              {errors[fieldKey]?.message as string}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div key={field}>
                          <Input
                            label={`${field.charAt(0).toUpperCase() + field.slice(1)} *`}
                            {...register(fieldKey, { required: `${field} es obligatorio` })}
                            error={errors[fieldKey]?.message as string}
                            placeholder={`Ingresa tu ${field.toLowerCase()}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#023047] mb-2">
                Texto Libre Adicional (opcional)
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219EBC] focus:border-[#219EBC] transition-all duration-200"
                rows={8}
                placeholder="Puedes agregar información adicional que no esté en los campos anteriores..."
                {...register('userFreeText')}
              />
            </div>

            <Input
              label="Contexto Adicional (opcional)"
              {...register('additionalContext')}
              error={errors.additionalContext?.message}
              placeholder="Información adicional que puede ayudar a generar mejor tu CV"
            />

            <div className="flex gap-4">
              <Button type="submit" isLoading={isLoading}>
                Generar CV
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}


