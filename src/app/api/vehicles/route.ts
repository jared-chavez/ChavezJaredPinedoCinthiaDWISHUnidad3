// API Route para gestión de vehículos (CRUD)

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { vehicleDB } from '@/lib/db';
import { vehicleSchema, updateVehicleSchema } from '@/lib/validations';

// GET - Obtener todos los vehículos
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let vehicles;
    if (status) {
      vehicles = await vehicleDB.findByStatus(status as any);
    } else {
      vehicles = await vehicleDB.getAll();
    }
    
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    return NextResponse.json(
      { error: 'Error al obtener vehículos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo vehículo
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Solo admin y employee pueden crear vehículos
    if (session.user.role !== 'admin' && session.user.role !== 'employee') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const body = await request.json();
    
    // Validar con Zod
    const validated = vehicleSchema.parse(body);
    
    // Crear vehículo
    const vehicle = await vehicleDB.create({
      ...validated,
      createdBy: session.user.id,
    });
    
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error al crear vehículo:', error);
    return NextResponse.json(
      { error: 'Error al crear vehículo' },
      { status: 500 }
    );
  }
}

