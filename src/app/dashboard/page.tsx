'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/DashboardStats';
import { ROLE_PERMISSIONS } from '@/lib/roles';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const canViewDashboard = ROLE_PERMISSIONS[session.user.role as keyof typeof ROLE_PERMISSIONS]?.canViewDashboard;

  if (!canViewDashboard) {
    redirect('/inventory');
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Métricas y estadísticas del sistema
            </p>
          </div>

          <DashboardStats />
        </div>
      </div>
    </>
  );
}

