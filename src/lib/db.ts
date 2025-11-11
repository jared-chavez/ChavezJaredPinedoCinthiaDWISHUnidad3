// Base de datos PostgreSQL con Prisma
// Reemplaza la base de datos en memoria

import { User, Vehicle, Sale } from '@/types';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

// Inicializar con un usuario admin por defecto si no existe
export async function initializeDB() {
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@agencia.com' },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    await prisma.user.create({
      data: {
        email: 'admin@agencia.com',
        name: 'Administrador',
        password: hashedPassword,
        role: 'admin',
      },
    });
  }
}

// Funciones para usuarios
export const userDB = {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user ? {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role as 'admin' | 'employee' | 'viewer',
      createdAt: user.createdAt,
    } : null;
  },
  
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user ? {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role as 'admin' | 'employee' | 'viewer',
      createdAt: user.createdAt,
    } : null;
  },
  
  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role,
      },
    });
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      password: newUser.password,
      role: newUser.role as 'admin' | 'employee' | 'viewer',
      createdAt: newUser.createdAt,
    };
  },
  
  async getAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role as 'admin' | 'employee' | 'viewer',
      createdAt: user.createdAt,
    }));
  },
};

// Funciones para vehículos
export const vehicleDB = {
  async getAll(): Promise<Vehicle[]> {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return vehicles.map((v: any) => ({
      id: v.id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      color: v.color,
      price: v.price,
      mileage: v.mileage,
      fuelType: v.fuelType as Vehicle['fuelType'],
      transmission: v.transmission as Vehicle['transmission'],
      status: v.status as Vehicle['status'],
      vin: v.vin,
      description: v.description || undefined,
      images: v.images,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
      createdBy: v.createdBy,
    }));
  },
  
  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });
    if (!vehicle) return null;
    return {
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      price: vehicle.price,
      mileage: vehicle.mileage,
      fuelType: vehicle.fuelType as Vehicle['fuelType'],
      transmission: vehicle.transmission as Vehicle['transmission'],
      status: vehicle.status as Vehicle['status'],
      vin: vehicle.vin,
      description: vehicle.description || undefined,
      images: vehicle.images,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
      createdBy: vehicle.createdBy,
    };
  },
  
  async create(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    const newVehicle = await prisma.vehicle.create({
      data: {
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        price: vehicle.price,
        mileage: vehicle.mileage,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        status: vehicle.status,
        vin: vehicle.vin,
        description: vehicle.description,
        images: vehicle.images || [],
        createdBy: vehicle.createdBy,
      },
    });
    return {
      id: newVehicle.id,
      brand: newVehicle.brand,
      model: newVehicle.model,
      year: newVehicle.year,
      color: newVehicle.color,
      price: newVehicle.price,
      mileage: newVehicle.mileage,
      fuelType: newVehicle.fuelType as Vehicle['fuelType'],
      transmission: newVehicle.transmission as Vehicle['transmission'],
      status: newVehicle.status as Vehicle['status'],
      vin: newVehicle.vin,
      description: newVehicle.description || undefined,
      images: newVehicle.images,
      createdAt: newVehicle.createdAt,
      updatedAt: newVehicle.updatedAt,
      createdBy: newVehicle.createdBy,
    };
  },
  
  async update(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
    try {
      const updatedVehicle = await prisma.vehicle.update({
        where: { id },
        data: {
          ...(updates.brand && { brand: updates.brand }),
          ...(updates.model && { model: updates.model }),
          ...(updates.year && { year: updates.year }),
          ...(updates.color && { color: updates.color }),
          ...(updates.price !== undefined && { price: updates.price }),
          ...(updates.mileage !== undefined && { mileage: updates.mileage }),
          ...(updates.fuelType && { fuelType: updates.fuelType }),
          ...(updates.transmission && { transmission: updates.transmission }),
          ...(updates.status && { status: updates.status }),
          ...(updates.vin && { vin: updates.vin }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.images && { images: updates.images }),
        },
      });
      return {
        id: updatedVehicle.id,
        brand: updatedVehicle.brand,
        model: updatedVehicle.model,
        year: updatedVehicle.year,
        color: updatedVehicle.color,
        price: updatedVehicle.price,
        mileage: updatedVehicle.mileage,
        fuelType: updatedVehicle.fuelType as Vehicle['fuelType'],
        transmission: updatedVehicle.transmission as Vehicle['transmission'],
        status: updatedVehicle.status as Vehicle['status'],
        vin: updatedVehicle.vin,
        description: updatedVehicle.description || undefined,
        images: updatedVehicle.images,
        createdAt: updatedVehicle.createdAt,
        updatedAt: updatedVehicle.updatedAt,
        createdBy: updatedVehicle.createdBy,
      };
    } catch (error) {
      return null;
    }
  },
  
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.vehicle.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  },
  
  async findByStatus(status: Vehicle['status']): Promise<Vehicle[]> {
    const vehicles = await prisma.vehicle.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
    return vehicles.map((v: any) => ({
      id: v.id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      color: v.color,
      price: v.price,
      mileage: v.mileage,
      fuelType: v.fuelType as Vehicle['fuelType'],
      transmission: v.transmission as Vehicle['transmission'],
      status: v.status as Vehicle['status'],
      vin: v.vin,
      description: v.description || undefined,
      images: v.images,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
      createdBy: v.createdBy,
    }));
  },
};

// Funciones para ventas
export const saleDB = {
  async getAll(): Promise<Sale[]> {
    const sales = await prisma.sale.findMany({
      orderBy: { saleDate: 'desc' },
    });
    return sales.map((s: any) => ({
      id: s.id,
      vehicleId: s.vehicleId,
      userId: s.userId,
      customerName: s.customerName,
      customerEmail: s.customerEmail,
      customerPhone: s.customerPhone,
      salePrice: s.salePrice,
      saleDate: s.saleDate,
      paymentMethod: s.paymentMethod as Sale['paymentMethod'],
      notes: s.notes || undefined,
    }));
  },
  
  async findById(id: string): Promise<Sale | null> {
    const sale = await prisma.sale.findUnique({
      where: { id },
    });
    if (!sale) return null;
    return {
      id: sale.id,
      vehicleId: sale.vehicleId,
      userId: sale.userId,
      customerName: sale.customerName,
      customerEmail: sale.customerEmail,
      customerPhone: sale.customerPhone,
      salePrice: sale.salePrice,
      saleDate: sale.saleDate,
      paymentMethod: sale.paymentMethod as Sale['paymentMethod'],
      notes: sale.notes || undefined,
    };
  },
  
  async create(sale: Omit<Sale, 'id' | 'saleDate'>): Promise<Sale> {
    const newSale = await prisma.sale.create({
      data: {
        vehicleId: sale.vehicleId,
        userId: sale.userId,
        customerName: sale.customerName,
        customerEmail: sale.customerEmail,
        customerPhone: sale.customerPhone,
        salePrice: sale.salePrice,
        paymentMethod: sale.paymentMethod,
        notes: sale.notes,
      },
    });
    return {
      id: newSale.id,
      vehicleId: newSale.vehicleId,
      userId: newSale.userId,
      customerName: newSale.customerName,
      customerEmail: newSale.customerEmail,
      customerPhone: newSale.customerPhone,
      salePrice: newSale.salePrice,
      saleDate: newSale.saleDate,
      paymentMethod: newSale.paymentMethod as Sale['paymentMethod'],
      notes: newSale.notes || undefined,
    };
  },
  
  async getByVehicleId(vehicleId: string): Promise<Sale[]> {
    const sales = await prisma.sale.findMany({
      where: { vehicleId },
      orderBy: { saleDate: 'desc' },
    });
    return sales.map((s: any) => ({
      id: s.id,
      vehicleId: s.vehicleId,
      userId: s.userId,
      customerName: s.customerName,
      customerEmail: s.customerEmail,
      customerPhone: s.customerPhone,
      salePrice: s.salePrice,
      saleDate: s.saleDate,
      paymentMethod: s.paymentMethod as Sale['paymentMethod'],
      notes: s.notes || undefined,
    }));
  },
};
