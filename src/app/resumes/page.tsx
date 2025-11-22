'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { useAuth } from '../../lib/auth/auth-context';
import { resumesService } from '../../lib/api/resumes.service';
import { GeneratedResume } from '../../lib/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export default function ResumesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<GeneratedResume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadResumes();
    }
  }, [isAuthenticated]);

  const loadResumes = async () => {
    try {
      const data = await resumesService.getAllResumes();
      setResumes(data);
    } catch (error) {
      console.error('Error al cargar CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const blob = await resumesService.downloadResumePdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cv-${id}.pdf`;
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#023047] mb-2">Mis CVs</h1>
            <p className="text-[#6b7280] font-medium">Gestiona tus CVs generados</p>
          </div>
          <Link href="/resumes/new">
            <Button>Nuevo CV</Button>
          </Link>
        </div>

        {resumes.length === 0 ? (
          <Card>
            <p className="text-center text-[#6b7280] py-8">
              No has generado ningún CV aún. Crea tu primer CV.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} title={resume.title}>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-[#6b7280] uppercase mb-2">Estado</p>
                    <span
                      className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                        resume.generationStatus === 'completed'
                          ? 'bg-[#8ECAE6] bg-opacity-20 text-[#219EBC]'
                          : resume.generationStatus === 'failed'
                          ? 'bg-[#FB8500] bg-opacity-20 text-[#FB8500]'
                          : 'bg-[#FFB703] bg-opacity-20 text-[#023047]'
                      }`}
                    >
                      {resume.generationStatus}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-[#6b7280] uppercase mb-1">Creado</p>
                    <p className="text-sm font-medium text-[#023047]">
                      {format(new Date(resume.createdAt), 'PPP', { locale: es })}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/resumes/${resume.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver
                      </Button>
                    </Link>
                    {resume.generationStatus === 'completed' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownload(resume.id)}
                        className="flex-1"
                      >
                        Descargar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

