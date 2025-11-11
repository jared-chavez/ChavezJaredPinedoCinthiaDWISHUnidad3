import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { vehicleDB } from '@/lib/db';
import Navbar from '@/components/Navbar';
import VehicleCard from '@/components/VehicleCard';
import Link from 'next/link';

export default async function InventoryPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  const vehicles = await vehicleDB.getAll();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Inventario de Vehículos
            </h1>
            {(session.user.role === 'admin' || session.user.role === 'employee') && (
              <Link
                href="/inventory/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                + Agregar Vehículo
              </Link>
            )}
          </div>

          {vehicles.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No hay vehículos en el inventario
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

