'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ResponsiveTable from '@/components/ResponsiveTable';
import { apiClient } from '@/lib/api-client';
import { Sale } from '@/types';

interface SaleWithVehicle extends Sale {
  vehicle: string;
}

export default function SalesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sales, setSales] = useState<SaleWithVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user.role !== 'admin' && session.user.role !== 'emprendedores') {
      router.push('/dashboard');
      return;
    }

    fetchSales();
  }, [session, status, router]);

  const fetchSales = async () => {
    try {
      const [salesData, vehiclesData] = await Promise.all([
        apiClient.getSales(),
        apiClient.getVehicles(),
      ]);

      const salesWithVehicles: SaleWithVehicle[] = salesData.map((sale) => {
        const vehicle = vehiclesData.find((v) => v.id === sale.vehicleId);
        return {
          ...sale,
          vehicle: vehicle
            ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}`
            : 'Vehículo no encontrado',
        };
      });

      setSales(salesWithVehicles);
      setTotalRevenue(salesWithVehicles.reduce((sum, sale) => sum + sale.salePrice, 0));
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </>
    );
  }

  if (!session || (session.user.role !== 'admin' && session.user.role !== 'emprendedores')) {
    return null;
  }

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

          <ResponsiveTable
            data={sales}
            columns={[
              {
                key: 'saleDate',
                label: 'Fecha',
                mobileLabel: 'Fecha',
                render: (sale) => (
                  <span>{new Date(sale.saleDate).toLocaleDateString()}</span>
                ),
              },
              {
                key: 'vehicle',
                label: 'Vehículo',
                mobileLabel: 'Vehículo',
              },
              {
                key: 'customerName',
                label: 'Cliente',
                mobileLabel: 'Cliente',
                render: (sale) => (
                  <div>
                    <div className="font-medium">{sale.customerName}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      {sale.customerEmail}
                    </div>
                  </div>
                ),
              },
              {
                key: 'salePrice',
                label: 'Precio',
                mobileLabel: 'Precio de Venta',
                render: (sale) => (
                  <span className="font-semibold text-green-600">
                    ${sale.salePrice.toLocaleString()}
                  </span>
                ),
              },
              {
                key: 'paymentMethod',
                label: 'Método de Pago',
                mobileLabel: 'Método de Pago',
                render: (sale) => (
                  <span>
                    {sale.paymentMethod === 'cash'
                      ? 'Efectivo'
                      : sale.paymentMethod === 'credit'
                      ? 'Tarjeta'
                      : 'Financiamiento'}
                  </span>
                ),
              },
            ]}
            emptyMessage="No hay ventas registradas"
          />
        </div>
      </div>
    </>
  );
}

