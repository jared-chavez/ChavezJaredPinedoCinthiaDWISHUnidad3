// Tipos principales de la aplicación

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // Hasheada
  role: 'admin' | 'employee' | 'viewer';
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  status: 'available' | 'sold' | 'reserved' | 'maintenance';
  vin: string; // Vehicle Identification Number
  description?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
}

export interface Inventory {
  id: string;
  vehicleId: string;
  quantity: number;
  location: string;
  notes?: string;
  lastUpdated: Date;
}

export interface Sale {
  id: string;
  vehicleId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  salePrice: number;
  saleDate: Date;
  paymentMethod: 'cash' | 'credit' | 'financing';
  notes?: string;
}

