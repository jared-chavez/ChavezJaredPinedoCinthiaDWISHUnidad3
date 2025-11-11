'use client';

import { Vehicle } from '@/types';
import Link from 'next/link';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    sold: 'bg-gray-100 text-gray-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    maintenance: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    available: 'Disponible',
    sold: 'Vendido',
    reserved: 'Reservado',
    maintenance: 'Mantenimiento',
  };

  return (
    <Link href={`/inventory/${vehicle.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{vehicle.year}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[vehicle.status]}`}>
            {statusLabels[vehicle.status]}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Color:</span>
            <span className="text-gray-900 dark:text-white font-medium">{vehicle.color}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Combustible:</span>
            <span className="text-gray-900 dark:text-white font-medium">{vehicle.fuelType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Transmisión:</span>
            <span className="text-gray-900 dark:text-white font-medium">{vehicle.transmission}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Kilometraje:</span>
            <span className="text-gray-900 dark:text-white font-medium">{vehicle.mileage.toLocaleString()} km</span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${vehicle.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}

