'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Loading } from '../../../components/ui/Loading';
import { useAuth } from '../../../lib/auth/auth-context';
import { templatesService } from '../../../lib/api/templates.service';
import { LatexTemplate } from '../../../lib/types';
import Link from 'next/link';

export default function TemplateDetailPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const templateId = parseInt(params.id as string);
  const [template, setTemplate] = useState<LatexTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && templateId && !isNaN(templateId)) {
      loadTemplate();
    } else if (isAuthenticated && isNaN(templateId)) {
      setError('ID de plantilla inválido');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, templateId]);

  const loadTemplate = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Cargando plantilla con ID:', templateId);
      const data = await templatesService.getTemplateById(templateId);
      console.log('Plantilla cargada:', data);
      setTemplate(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error al cargar plantilla:', err);
      let errorMessage = 'Error al cargar la plantilla';
      
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
      setLoading(false);
    }
  };

  if (authLoading || loading) {
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
        <div className="mb-8">
          <Button onClick={() => router.back()}>
            ← Volver
          </Button>
        </div>

        {error && (
          <Card className="mb-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold mb-2">Error</p>
              <p className="text-red-700">{error}</p>
              <div className="mt-4 flex gap-3">
                <Button size="sm" onClick={loadTemplate}>
                  Reintentar
                </Button>
                <Button size="sm" variant="outline" onClick={() => router.push('/templates')}>
                  Ver todas las plantillas
                </Button>
              </div>
            </div>
          </Card>
        )}

        {!error && template && (
          <Card title={template.name}>
            <div className="space-y-5">
              <div className="p-4 bg-[#8ECAE6] bg-opacity-10 rounded-lg border-l-4 border-[#219EBC]">
                <p className="text-xs font-semibold text-[#219EBC] uppercase mb-1">Facultad</p>
                <p className="font-semibold text-[#023047] text-lg">{template.faculty}</p>
              </div>
              <div className="p-4 bg-[#FFB703] bg-opacity-10 rounded-lg border-l-4 border-[#FB8500]">
                <p className="text-xs font-semibold text-[#FB8500] uppercase mb-1">Código de Carrera</p>
                <p className="font-semibold text-[#023047] text-lg">{template.careerCode}</p>
              </div>
              {template.description && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-[#6b7280] uppercase mb-2">Descripción</p>
                  <p className="text-[#023047]">{template.description}</p>
                </div>
              )}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-[#6b7280] uppercase mb-2">Estilo</p>
                <span className="inline-block px-3 py-1 bg-[#219EBC] text-white rounded-full text-sm font-semibold">
                  {template.style || 'modern'}
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-[#6b7280] uppercase mb-2">Campos Requeridos</p>
                <div className="flex flex-wrap gap-2">
                  {template.requiredFields && Array.isArray(template.requiredFields) && template.requiredFields.length > 0 ? (
                    template.requiredFields.map((field: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-[#8ECAE6] bg-opacity-20 text-[#023047] rounded-full text-sm font-medium">
                        {field}
                      </span>
                    ))
                  ) : (
                    <p className="text-[#6b7280] text-sm">No hay campos requeridos especificados</p>
                  )}
                </div>
              </div>
              {template.previewPdfUrl ? (
                <div>
                  <p className="text-sm font-semibold text-[#023047] mb-2">Preview PDF:</p>
                  <iframe
                    src={template.previewPdfUrl}
                    className="w-full h-96 border border-gray-300 rounded-lg"
                    title="Preview PDF"
                  />
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    No hay PDF de preview disponible para esta plantilla.
                  </p>
                </div>
              )}
              <div className="pt-4 flex gap-4">
                <Link href={`/resumes/new?templateId=${template.id}`}>
                  <Button>Usar esta Plantilla</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {!error && !template && !loading && (
          <Card>
            <div className="p-8 text-center">
              <p className="text-[#6b7280] text-lg">No se pudo cargar la plantilla</p>
              <Button className="mt-4" onClick={loadTemplate}>
                Reintentar
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}


