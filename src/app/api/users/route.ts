// API Route para gestión de usuarios

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { userDB } from '@/lib/db';
import { registerSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

// GET - Obtener todos los usuarios (solo admin)
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const users = await userDB.getAll();
    // No retornar contraseñas
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    
    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const body = await request.json();
    
    // Validar con Zod
    const validated = registerSchema.parse(body);
    
    // Verificar si el email ya existe
    const existingUser = await userDB.findByEmail(validated.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }
    
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(validated.password, 10);
    
    // Crear usuario
    const user = await userDB.create({
      ...validated,
      password: hashedPassword,
    });
    
    // No retornar contraseña
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}

