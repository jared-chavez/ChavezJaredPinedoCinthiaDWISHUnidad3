import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { saleDB, vehicleDB } from '@/lib/db';
import Navbar from '@/components/Navbar';

export default async function SalesPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  if (session.user.role !== 'admin' && session.user.role !== 'employee') {
    redirect('/dashboard');
  }

  const sales = await saleDB.getAll();
  const vehicles = await vehicleDB.getAll();
  
  // Enriquecer ventas con información del vehículo
  const salesWithVehicles = sales.map(sale => {
    const vehicle = vehicles.find(v => v.id === sale.vehicleId);
    return {
      ...sale,
      vehicle: vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : 'Vehículo no encontrado',
    };
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.salePrice, 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ventas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Total de ingresos: <span className="font-bold text-green-600">${totalRevenue.toLocaleString()}</span>
            </p>
          </div>

          {salesWithVehicles.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No hay ventas registradas
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Método de Pago
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {salesWithVehicles.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(sale.saleDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {sale.vehicle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>
                          <div className="font-medium">{sale.customerName}</div>
                          <div className="text-gray-500 dark:text-gray-400">{sale.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        ${sale.salePrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {sale.paymentMethod === 'cash' ? 'Efectivo' : 
                         sale.paymentMethod === 'credit' ? 'Tarjeta' : 'Financiamiento'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

