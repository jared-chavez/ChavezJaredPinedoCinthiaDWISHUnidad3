// API Route para gestión de ventas

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { saleDB, vehicleDB } from '@/lib/db';
import { saleSchema } from '@/lib/validations';

// GET - Obtener todas las ventas
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const sales = await saleDB.getAll();
    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    return NextResponse.json(
      { error: 'Error al obtener ventas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva venta
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Solo admin y employee pueden crear ventas
    if (session.user.role !== 'admin' && session.user.role !== 'employee') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const body = await request.json();
    
    // Validar con Zod
    const validated = saleSchema.parse(body);
    
    // Verificar que el vehículo existe y está disponible
    const vehicle = await vehicleDB.findById(validated.vehicleId);
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }
    
    if (vehicle.status !== 'available') {
      return NextResponse.json(
        { error: 'El vehículo no está disponible para venta' },
        { status: 400 }
      );
    }
    
    // Crear venta
    const sale = await saleDB.create({
      ...validated,
      userId: session.user.id,
    });
    
    // Actualizar estado del vehículo a "sold"
    await vehicleDB.update(validated.vehicleId, { status: 'sold' });
    
    return NextResponse.json(sale, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error al crear venta:', error);
    return NextResponse.json(
      { error: 'Error al crear venta' },
      { status: 500 }
    );
  }
}

