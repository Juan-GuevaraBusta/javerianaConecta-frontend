'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '../../../components/forms/LoginForm';
import { Card } from '../../../components/ui/Card';
import { useAuth } from '../../../lib/auth/auth-context';
import { Loading } from '../../../components/ui/Loading';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8ECAE6] via-white to-[#8ECAE6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="h-16 w-16 rounded-full bg-[#219EBC] flex items-center justify-center mx-auto shadow-lg">
              <span className="text-white text-2xl font-bold">JC</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#023047] mb-2">Javeriana Conecta</h1>
          <p className="text-[#6b7280] font-medium">Inicia sesión en tu cuenta</p>
        </div>
        <Card>
          <LoginForm />
        </Card>
        <p className="mt-6 text-center text-sm text-[#6b7280]">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-[#219EBC] hover:text-[#1a7d96] font-semibold transition-colors">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}


