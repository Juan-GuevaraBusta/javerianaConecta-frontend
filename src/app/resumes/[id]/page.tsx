'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Loading } from '../../../components/ui/Loading';
import { useAuth } from '../../../lib/auth/auth-context';
import { resumesService } from '../../../lib/api/resumes.service';
import { GeneratedResume } from '../../../lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export default function ResumeDetailPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const resumeId = parseInt(params.id as string);
  const [resume, setResume] = useState<GeneratedResume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && resumeId) {
      loadResume();
    }
  }, [isAuthenticated, resumeId]);

  const loadResume = async () => {
    try {
      const data = await resumesService.getResumeById(resumeId);
      setResume(data);
    } catch (error) {
      console.error('Error al cargar CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resume) return;
    try {
      const blob = await resumesService.downloadResumePdf(resumeId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cv-${resume.title}-${resumeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
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

  if (!isAuthenticated || !resume) {
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

        <Card title={resume.title}>
          <div className="space-y-5">
            <div className="p-4 bg-gradient-to-r from-[#8ECAE6] to-[#8ECAE6] bg-opacity-10 rounded-xl border border-[#8ECAE6] border-opacity-20">
              <p className="text-xs font-semibold text-[#219EBC] uppercase mb-3">Estado</p>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${
                  resume.generationStatus === 'completed'
                    ? 'bg-[#8ECAE6] bg-opacity-20 text-[#219EBC] border-[#8ECAE6] border-opacity-40'
                    : resume.generationStatus === 'failed'
                    ? 'bg-[#FB8500] bg-opacity-20 text-[#FB8500] border-[#FB8500] border-opacity-40'
                    : resume.generationStatus === 'generating'
                    ? 'bg-[#FFB703] bg-opacity-20 text-[#023047] border-[#FFB703] border-opacity-40'
                    : 'bg-[#FFB703] bg-opacity-20 text-[#023047] border-[#FFB703] border-opacity-40'
                }`}
              >
                {resume.generationStatus === 'completed' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {resume.generationStatus === 'failed' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {resume.generationStatus === 'generating' && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {resume.generationStatus === 'pending_review' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                )}
                {resume.generationStatus === 'completed' 
                  ? 'Completado' 
                  : resume.generationStatus === 'failed'
                  ? 'Fallido'
                  : resume.generationStatus === 'generating'
                  ? 'Generando...'
                  : resume.generationStatus === 'pending_review'
                  ? 'Pendiente de Revisión'
                  : resume.generationStatus}
              </span>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#FFB703] to-[#FFB703] bg-opacity-10 rounded-xl border border-[#FFB703] border-opacity-20">
              <p className="text-xs font-semibold text-[#FB8500] uppercase mb-2">Creado</p>
              <p className="font-semibold text-[#023047] text-lg">
                {format(new Date(resume.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
              <p className="text-sm text-[#6b7280] mt-1">
                {format(new Date(resume.createdAt), 'HH:mm', { locale: es })} horas
              </p>
            </div>
            {resume.notes && (
              <div className="p-4 bg-[#8ECAE6] bg-opacity-10 rounded-lg border-l-4 border-[#219EBC]">
                <p className="text-xs font-semibold text-[#219EBC] uppercase mb-2">Notas</p>
                <p className="text-[#023047]">{resume.notes}</p>
              </div>
            )}
            {resume.s3Url && resume.generationStatus === 'completed' && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Vista Previa:</p>
                <iframe
                  src={resume.s3Url}
                  className="w-full h-96 border border-gray-300 rounded-lg"
                  title="Preview PDF"
                />
              </div>
            )}
            <div className="pt-4 flex gap-4">
              {resume.generationStatus === 'completed' && (
                <Button onClick={handleDownload}>Descargar PDF</Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

