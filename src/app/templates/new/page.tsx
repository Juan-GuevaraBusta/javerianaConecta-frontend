'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { FileUpload } from '../../../components/forms/FileUpload';
import { Alert } from '../../../components/ui/Alert';
import { Loading } from '../../../components/ui/Loading';
import { useAuth } from '../../../lib/auth/auth-context';
import { templatesService } from '../../../lib/api/templates.service';
import { CreateTemplateDto } from '../../../lib/types';
import { useForm } from 'react-hook-form';

export default function NewTemplatePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingTemplateId, setExistingTemplateId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CreateTemplateDto & { requiredFieldsString: string }>();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      setIsLoading(true);

      const templateData: CreateTemplateDto = {
        name: data.name,
        faculty: data.faculty,
        careerCode: data.careerCode,
        description: data.description,
        latexContent: data.latexContent,
        style: data.style || 'modern',
        requiredFields: data.requiredFieldsString
          ? data.requiredFieldsString.split(',').map((f: string) => f.trim()).filter((f: string) => f.length > 0)
          : [],
        templateConfig: data.templateConfig ? (typeof data.templateConfig === 'string' ? JSON.parse(data.templateConfig) : data.templateConfig) : undefined,
        isFeatured: data.isFeatured || false,
        version: data.version || '1.0.0',
      };

      console.log('Creando plantilla con datos:', templateData);
      const template = await templatesService.createTemplate(templateData);
      console.log('Plantilla creada:', template);

      // Si hay un PDF, subirlo
      if (pdfFile) {
        try {
          console.log('Subiendo PDF para plantilla:', template.id);
          await templatesService.uploadPreviewPdf(template.id, pdfFile);
          console.log('PDF subido exitosamente');
        } catch (pdfError: any) {
          console.error('Error al subir PDF:', pdfError);
          setError(`Plantilla creada pero error al subir PDF: ${pdfError.response?.data?.message || pdfError.message || 'Error desconocido'}`);
          // Continuar de todas formas, la plantilla ya está creada
        }
      }

      router.push(`/templates/${template.id}`);
    } catch (err: any) {
      console.error('Error completo:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.data?.message ||
                          err.message || 
                          'Error al crear plantilla';
      
      // Si el error es porque ya existe una plantilla con ese código de carrera
      if (errorMessage.includes('Ya existe una plantilla para la carrera')) {
        // Intentar buscar la plantilla existente usando los valores del formulario
        try {
          const formValues = getValues();
          const templates = await templatesService.getAllTemplates({ careerCode: formValues.careerCode });
          if (templates.length > 0) {
            setExistingTemplateId(templates[0].id);
            setError(
              `${errorMessage}. ¿Deseas actualizar la plantilla existente?`
            );
          } else {
            setError(errorMessage);
          }
        } catch (searchError) {
          setError(errorMessage);
        }
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateExisting = async () => {
    if (!existingTemplateId) return;
    
    try {
      setError(null);
      setIsLoading(true);

      const data = getValues();
      const templateData: Partial<CreateTemplateDto> = {
        name: data.name,
        faculty: data.faculty,
        careerCode: data.careerCode,
        description: data.description,
        latexContent: data.latexContent,
        style: data.style || 'modern',
        requiredFields: data.requiredFieldsString
          ? data.requiredFieldsString.split(',').map((f: string) => f.trim()).filter((f: string) => f.length > 0)
          : [],
        templateConfig: data.templateConfig ? (typeof data.templateConfig === 'string' ? JSON.parse(data.templateConfig) : data.templateConfig) : undefined,
        isFeatured: data.isFeatured || false,
        version: data.version || '1.0.0',
      };

      const template = await templatesService.updateTemplate(existingTemplateId, templateData);

      // Si hay un PDF, subirlo
      if (pdfFile) {
        try {
          await templatesService.uploadPreviewPdf(template.id, pdfFile);
        } catch (pdfError: any) {
          setError(`Plantilla actualizada pero error al subir PDF: ${pdfError.response?.data?.message || pdfError.message || 'Error desconocido'}`);
        }
      }

      router.push(`/templates/${template.id}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.data?.message ||
                          err.message || 
                          'Error al actualizar plantilla';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
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
        <h1 className="text-4xl font-bold text-[#023047] mb-2">Nueva Plantilla</h1>
        <p className="text-[#6b7280] font-medium mb-8">Crea una nueva plantilla LaTeX para CVs</p>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert type="error" onClose={() => { setError(null); setExistingTemplateId(null); }}>
                <div className="space-y-3">
                  <p>{error}</p>
                  {existingTemplateId && (
                    <div className="flex gap-3 mt-3">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleUpdateExisting}
                        isLoading={isLoading}
                      >
                        Actualizar Plantilla Existente
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/templates/${existingTemplateId}`)}
                      >
                        Ver Plantilla Existente
                      </Button>
                    </div>
                  )}
                </div>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                {...register('name', { required: 'El nombre es obligatorio' })}
                error={errors.name?.message}
              />
              <Input
                label="Facultad"
                {...register('faculty', { required: 'La facultad es obligatoria' })}
                error={errors.faculty?.message}
              />
            </div>

            <Input
              label="Código de Carrera"
              {...register('careerCode', { required: 'El código de carrera es obligatorio' })}
              error={errors.careerCode?.message}
            />

            <Input
              label="Descripción"
              {...register('description')}
              error={errors.description?.message}
            />

            <div>
              <label className="block text-sm font-semibold text-[#023047] mb-2">
                Contenido LaTeX
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219EBC] focus:border-[#219EBC] transition-all duration-200 font-mono text-sm"
                rows={10}
                {...register('latexContent', { required: 'El contenido LaTeX es obligatorio' })}
              />
              {errors.latexContent && (
                <p className="mt-1.5 text-sm text-[#FB8500] font-medium">{errors.latexContent.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Estilo"
                {...register('style')}
                placeholder="modern, classic, minimalist, academic"
              />
              <Input
                label="Campos Requeridos (separados por comas)"
                {...register('requiredFieldsString')}
                placeholder="name, email, phone, experience"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#023047] mb-2">
                PDF de Preview (opcional)
              </label>
              <FileUpload
                onFileSelect={setPdfFile}
                accept="application/pdf"
                maxSize={10 * 1024 * 1024}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" isLoading={isLoading}>
                Crear Plantilla
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


