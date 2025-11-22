'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth/auth-context';
import { Loading } from '../components/ui/Loading';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading />
    </div>
  );
}
