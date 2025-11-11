'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ROLE_PERMISSIONS } from '@/lib/roles';
import RoleBadge from './RoleBadge';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  };

  if (!session) return null;

  const role = session.user.role as keyof typeof ROLE_PERMISSIONS;
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.viewer;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center px-2 py-2 text-xl font-bold text-gray-900 dark:text-white">
              🚗 Agencia de Vehículos
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {permissions.canViewDashboard && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-300 hover:text-blue-600"
                >
                  Dashboard
                </Link>
              )}
              {permissions.canViewVehicles && (
                <Link
                  href="/inventory"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-300 hover:text-blue-600"
                >
                  Inventario
                </Link>
              )}
              {permissions.canViewSales && (
                <Link
                  href="/sales"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-300 hover:text-blue-600"
                >
                  Ventas
                </Link>
              )}
              {permissions.canViewUsers && (
                <Link
                  href="/users"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-300 hover:text-blue-600"
                >
                  Usuarios
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {session.user.name}
              </span>
              <RoleBadge role={role} />
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

