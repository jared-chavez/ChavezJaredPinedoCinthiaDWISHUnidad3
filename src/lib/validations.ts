// Validaciones con Zod para seguridad

import { z } from 'zod';

// Validación de usuario
export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
  role: z.enum(['admin', 'employee', 'viewer']).optional().default('employee'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Validación de vehículo
export const vehicleSchema = z.object({
  brand: z.string().min(1, 'La marca es requerida'),
  model: z.string().min(1, 'El modelo es requerido'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().min(1, 'El color es requerido'),
  price: z.number().positive('El precio debe ser positivo'),
  mileage: z.number().nonnegative('El kilometraje no puede ser negativo'),
  fuelType: z.enum(['gasoline', 'diesel', 'electric', 'hybrid']),
  transmission: z.enum(['manual', 'automatic']),
  status: z.enum(['available', 'sold', 'reserved', 'maintenance']),
  vin: z.string().length(17, 'El VIN debe tener 17 caracteres'),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

export const updateVehicleSchema = vehicleSchema.partial();

// Validación de venta
export const saleSchema = z.object({
  vehicleId: z.string().min(1, 'El ID del vehículo es requerido'),
  customerName: z.string().min(2, 'El nombre del cliente es requerido'),
  customerEmail: z.string().email('Email inválido'),
  customerPhone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  salePrice: z.number().positive('El precio de venta debe ser positivo'),
  paymentMethod: z.enum(['cash', 'credit', 'financing']),
  notes: z.string().optional(),
});

// Tipos inferidos de los schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type SaleInput = z.infer<typeof saleSchema>;

