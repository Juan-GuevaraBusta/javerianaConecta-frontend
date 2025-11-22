'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { useAuth } from '../../lib/auth/auth-context';
import { templatesService } from '../../lib/api/templates.service';
import { LatexTemplate } from '../../lib/types';
import Link from 'next/link';

export default function TemplatesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<LatexTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTemplates();
    }
  }, [isAuthenticated]);

  const loadTemplates = async () => {
    try {
      const data = await templatesService.getAllTemplates({ isActive: true });
      setTemplates(data);
    } catch (error) {
      console.error('Error al cargar plantillas:', error);
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
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#023047] mb-2">Plantillas</h1>
            <p className="text-[#6b7280] font-medium">Gestiona tus plantillas LaTeX</p>
          </div>
          <Link href="/templates/new">
            <Button>Nueva Plantilla</Button>
          </Link>
        </div>

        {templates.length === 0 ? (
          <Card>
            <p className="text-center text-[#6b7280] py-8">
              No hay plantillas disponibles. Crea tu primera plantilla.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} title={template.name}>
                <div className="space-y-4">
                  <div className="p-3 bg-[#8ECAE6] bg-opacity-10 rounded-lg">
                    <p className="text-xs font-semibold text-[#219EBC] uppercase mb-1">Facultad</p>
                    <p className="font-semibold text-[#023047]">{template.faculty}</p>
                  </div>
                  <div className="p-3 bg-[#FFB703] bg-opacity-10 rounded-lg">
                    <p className="text-xs font-semibold text-[#FB8500] uppercase mb-1">Carrera</p>
                    <p className="font-semibold text-[#023047]">{template.careerCode}</p>
                  </div>
                  {template.description && (
                    <p className="text-sm text-[#6b7280] line-clamp-2">
                      {template.description}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/templates/${template.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/resumes/new?templateId=${template.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        Usar
                      </Button>
                    </Link>
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


