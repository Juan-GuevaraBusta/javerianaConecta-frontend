'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #8ECAE6 0%, #e0f2fe 30%, #f0f9ff 60%, #ffffff 100%)' }}>
      <nav className="bg-white shadow-sm border-b border-[#8ECAE6] border-opacity-20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-xl font-bold text-[#219EBC] hover:text-[#1a7d96] transition-colors">
                  Javeriana Conecta
                </Link>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                <Link
                  href="/dashboard"
                  className="text-[#023047] hover:text-[#219EBC] inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md hover:bg-[#8ECAE6] hover:bg-opacity-10 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/templates"
                  className="text-[#6b7280] hover:text-[#023047] inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md hover:bg-[#8ECAE6] hover:bg-opacity-10 transition-colors"
                >
                  Plantillas
                </Link>
                <Link
                  href="/resumes"
                  className="text-[#6b7280] hover:text-[#023047] inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md hover:bg-[#8ECAE6] hover:bg-opacity-10 transition-colors"
                >
                  Mis CVs
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-[#219EBC] flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-[#023047]">
                  {user?.name || user?.email}
                </span>
              </div>
              <Button size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};


