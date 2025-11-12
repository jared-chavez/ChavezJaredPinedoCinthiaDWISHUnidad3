// API Route para registro público con verificación de email

import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations';
import { userDB } from '@/lib/db';
import { getClientIp, isIpBlacklisted, checkIpRateLimit } from '@/lib/ip-utils';
import { sendVerificationEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // 1. Obtener IP del cliente
    const clientIp = getClientIp(request);

    // 2. Validar IP (blacklist)
    if (await isIpBlacklisted(clientIp)) {
      return NextResponse.json(
        { error: 'Tu IP ha sido bloqueada. Contacta al administrador.' },
        { status: 403 }
      );
    }

    // 3. Rate limiting por IP
    const rateLimit = await checkIpRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Demasiados intentos de registro desde esta IP. Intenta más tarde.',
          resetAt: rateLimit.resetAt.toISOString(),
        },
        { status: 429 }
      );
    }

    // 4. Validar datos del formulario
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // 5. Verificar si el email ya existe
    const existingUser = await userDB.findByEmail(validated.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // 6. Hashear contraseña
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // 7. Crear usuario con estado "pending_verification"
    const user = await userDB.create({
      ...validated,
      password: hashedPassword,
      status: 'pending_verification',
      emailVerified: false,
      registeredIp: clientIp,
    });

    // 8. Generar token de verificación
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // 9. Guardar token en base de datos
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token,
        email: validated.email,
        ipAddress: clientIp,
        expiresAt,
      },
    });

    // 10. Enviar email de verificación
    const emailResult = await sendVerificationEmail(
      validated.email,
      validated.name,
      token,
      clientIp
    );

    if (!emailResult.success) {
      console.error('Error sending verification email:', emailResult.error);
      // No fallar el registro si el email falla, pero loguear el error
    }

    // 11. Retornar éxito (sin exponer información sensible)
    return NextResponse.json(
      {
        message: 'Registro exitoso. Por favor verifica tu email para activar tu cuenta.',
        email: validated.email,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && 'errors' in error) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: (error as { errors: unknown }).errors },
        { status: 400 }
      );
    }
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error al procesar el registro' },
      { status: 500 }
    );
  }
}

