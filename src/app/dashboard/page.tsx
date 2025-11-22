'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { useAuth } from '../../lib/auth/auth-context';
import { templatesService } from '../../lib/api/templates.service';
import { resumesService } from '../../lib/api/resumes.service';
import { LatexTemplate, GeneratedResume } from '../../lib/types';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [featuredTemplates, setFeaturedTemplates] = useState<LatexTemplate[]>([]);
  const [recentResumes, setRecentResumes] = useState<GeneratedResume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const [templates, resumes] = await Promise.all([
        templatesService.getFeaturedTemplates(),
        resumesService.getAllResumes(),
      ]);
      setFeaturedTemplates(templates.slice(0, 3));
      setRecentResumes(resumes.slice(0, 5));
    } catch (error) {
      console.error('Error al cargar datos:', error);
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
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#023047] mb-3">Dashboard</h1>
          <p className="text-[#6b7280] text-lg">Bienvenido a Javeriana Conecta</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="Accesos Rápidos" className="bg-white bg-opacity-95 backdrop-blur-sm">
            <div className="space-y-4">
              <Link href="/templates/new">
                <Button className="w-full" size="lg">
                  Crear Nueva Plantilla
                </Button>
              </Link>
              <Link href="/resumes/new">
                <Button className="w-full" size="lg">
                  Generar Nuevo CV
                </Button>
              </Link>
            </div>
          </Card>

          <Card title="Estadísticas" className="bg-white bg-opacity-95 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#8ECAE6] to-[#8ECAE6] bg-opacity-10 rounded-xl border border-[#8ECAE6] border-opacity-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#219EBC] bg-opacity-10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#219EBC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-[#023047] font-semibold">Plantillas disponibles</span>
                </div>
                <span className="font-bold text-[#219EBC] text-2xl">{featuredTemplates.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#FFB703] to-[#FFB703] bg-opacity-10 rounded-xl border border-[#FFB703] border-opacity-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFB703] bg-opacity-20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#FB8500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-[#023047] font-semibold">CVs generados</span>
                </div>
                <span className="font-bold text-[#FB8500] text-2xl">{recentResumes.length}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Plantillas Destacadas" className="bg-white bg-opacity-95 backdrop-blur-sm">
            {featuredTemplates.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8ECAE6] bg-opacity-10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#219EBC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-[#6b7280]">No hay plantillas destacadas</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {featuredTemplates.map((template) => (
                  <li key={template.id} className="flex justify-between items-center p-4 hover:bg-[#8ECAE6] hover:bg-opacity-5 rounded-xl transition-all duration-200 border border-transparent hover:border-[#8ECAE6] hover:border-opacity-20">
                    <div className="flex-1 min-w-0">
                      <span className="text-[#023047] font-semibold block truncate">{template.name}</span>
                      <span className="text-sm text-[#6b7280] mt-1">{template.faculty}</span>
                    </div>
                    <Link href={`/templates/${template.id}`} className="ml-4">
                      <Button size="sm">
                        Ver
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="CVs Recientes" className="bg-white bg-opacity-95 backdrop-blur-sm">
            {recentResumes.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFB703] bg-opacity-10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#FB8500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-[#6b7280]">No has generado ningún CV aún</p>
                <Link href="/resumes/new" className="mt-4 inline-block">
                  <Button size="sm" className="mt-4">
                    Crear tu primer CV
                  </Button>
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {recentResumes.map((resume) => (
                  <li key={resume.id} className="flex justify-between items-center p-4 hover:bg-[#8ECAE6] hover:bg-opacity-5 rounded-xl transition-all duration-200 border border-transparent hover:border-[#8ECAE6] hover:border-opacity-20">
                    <div className="flex-1 min-w-0">
                      <span className="text-[#023047] font-semibold block truncate">{resume.title}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full inline-block mt-2 font-medium ${
                        resume.generationStatus === 'completed' 
                          ? 'bg-[#8ECAE6] bg-opacity-20 text-[#219EBC] border border-[#8ECAE6] border-opacity-30'
                          : resume.generationStatus === 'failed'
                          ? 'bg-[#FB8500] bg-opacity-20 text-[#FB8500] border border-[#FB8500] border-opacity-30'
                          : 'bg-[#FFB703] bg-opacity-20 text-[#023047] border border-[#FFB703] border-opacity-30'
                      }`}>
                        {resume.generationStatus === 'completed' ? 'Completado' : 
                         resume.generationStatus === 'failed' ? 'Fallido' : 
                         resume.generationStatus === 'generating' ? 'Generando...' : 
                         resume.generationStatus === 'pending_review' ? 'Pendiente' : resume.generationStatus}
                      </span>
                    </div>
                    <Link href={`/resumes/${resume.id}`} className="ml-4">
                      <Button size="sm">
                        Ver
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}


