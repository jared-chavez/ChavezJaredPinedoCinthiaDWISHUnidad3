# 📧 Plan de Implementación: Registro con Verificación por Email e IP

## 🎯 Objetivo

Implementar un sistema de registro de usuarios que requiera:
1. **Verificación por correo electrónico** - Token único enviado al email
2. **Validación de IP** - Registrar y validar la IP desde donde se registra el usuario
3. **Doble capa de seguridad** - Prevenir registros fraudulentos y spam

---

## 📊 Nivel de Complejidad: **MEDIO** ⚠️

### ⏱️ Tiempo Estimado: **4-6 horas**

### 🔧 Dependencias Necesarias:
- Servicio de email (Resend, SendGrid, Nodemailer con SMTP)
- Base de datos para tokens de verificación
- Sistema de logging de IPs

---

## 🏗️ Arquitectura Propuesta

### **Flujo de Registro:**

```
1. Usuario llena formulario de registro
   ↓
2. Sistema captura IP del usuario
   ↓
3. Validar IP (rate limiting, blacklist, etc.)
   ↓
4. Crear usuario con estado "pending_verification"
   ↓
5. Generar token único de verificación
   ↓
6. Enviar email con link de verificación
   ↓
7. Usuario hace clic en link
   ↓
8. Validar token y IP
   ↓
9. Activar cuenta (cambiar estado a "active")
   ↓
10. Permitir login
```

---

## 📋 Plan de Implementación Detallado

### **FASE 1: Preparación de Base de Datos** (30 min)

#### 1.1 Actualizar Schema de Prisma

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  password      String
  role          String   @default("usuarios_regulares")
  status        String   @default("pending_verification") // pending_verification, active, suspended
  emailVerified Boolean  @default(false)
  registeredIp  String?  // IP desde donde se registró
  verifiedIp    String?  // IP desde donde verificó
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  verifiedAt    DateTime?
  
  vehicles      Vehicle[]
  sales         Sale[]
  verifications EmailVerification[]

  @@map("users")
}

model EmailVerification {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  email     String
  ipAddress String
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("email_verifications")
  @@index([token])
  @@index([userId])
  @@index([expiresAt])
}

model IpWhitelist {
  id        String   @id @default(cuid())
  ipAddress String   @unique
  reason    String?  // "trusted", "corporate", etc.
  createdAt DateTime @default(now())
  expiresAt DateTime?

  @@map("ip_whitelist")
  @@index([ipAddress])
}

model IpBlacklist {
  id        String   @id @default(cuid())
  ipAddress String   @unique
  reason    String
  createdAt DateTime @default(now())

  @@map("ip_blacklist")
  @@index([ipAddress])
}
```

#### 1.2 Comandos

```bash
# Generar migración
npm run db:migrate

# O aplicar cambios directamente (desarrollo)
npm run db:push
```

---

### **FASE 2: Configuración de Email** (45 min)

#### 2.1 Instalar Dependencias

```bash
# Opción 1: Resend (Recomendado - más fácil)
npm install resend

# Opción 2: Nodemailer (más flexible)
npm install nodemailer @types/nodemailer

# Opción 3: SendGrid
npm install @sendgrid/mail
```

#### 2.2 Variables de Entorno

```env
# Resend (Recomendado)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# O Nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
SMTP_FROM=noreply@nocturnagenesis.com

# O SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

#### 2.3 Crear Servicio de Email

**`src/lib/email.ts`**

```typescript
import { Resend } from 'resend';
// O import nodemailer from 'nodemailer';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: 'Nocturna Genesis <noreply@nocturnagenesis.com>',
      to: email,
      subject: 'Verifica tu cuenta - Nocturna Genesis',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; 
                       color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>¡Bienvenido a Nocturna Genesis, ${name}!</h1>
              <p>Gracias por registrarte. Para activar tu cuenta, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:</p>
              <a href="${verificationUrl}" class="button">Verificar Email</a>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p>${verificationUrl}</p>
              <p><strong>Este enlace expirará en 24 horas.</strong></p>
              <p>Si no solicitaste este registro, puedes ignorar este email.</p>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Nocturna Genesis. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error enviando email:', error);
    return { success: false, error };
  }
}
```

---

### **FASE 3: Utilidades de IP** (30 min)

#### 3.1 Crear Helper de IP

**`src/lib/ip-utils.ts`**

```typescript
import { NextRequest } from 'next/server';

/**
 * Obtiene la IP real del cliente
 * Considera proxies, load balancers, etc.
 */
export function getClientIp(request: NextRequest): string {
  // Intentar obtener IP de headers comunes
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare

  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwarded) {
    // x-forwarded-for puede tener múltiples IPs
    return forwarded.split(',')[0].trim();
  }

  // Fallback a IP del request
  return request.ip || 'unknown';
}

/**
 * Valida si una IP está en la whitelist
 */
export async function isIpWhitelisted(ip: string): Promise<boolean> {
  const { prisma } = await import('@/lib/prisma');
  
  const whitelist = await prisma.ipWhitelist.findUnique({
    where: { ipAddress: ip },
  });

  if (!whitelist) return false;
  
  // Verificar si expiró
  if (whitelist.expiresAt && whitelist.expiresAt < new Date()) {
    return false;
  }

  return true;
}

/**
 * Valida si una IP está en la blacklist
 */
export async function isIpBlacklisted(ip: string): Promise<boolean> {
  const { prisma } = await import('@/lib/prisma');
  
  const blacklist = await prisma.ipBlacklist.findUnique({
    where: { ipAddress: ip },
  });

  return !!blacklist;
}

/**
 * Rate limiting por IP
 * Previene registros masivos desde la misma IP
 */
export async function checkIpRateLimit(ip: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}> {
  const { prisma } = await import('@/lib/prisma');
  
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const recentRegistrations = await prisma.user.count({
    where: {
      registeredIp: ip,
      createdAt: {
        gte: oneHourAgo,
      },
    },
  });

  const maxRegistrationsPerHour = 3; // Configurable
  const allowed = recentRegistrations < maxRegistrationsPerHour;

  return {
    allowed,
    remaining: Math.max(0, maxRegistrationsPerHour - recentRegistrations),
    resetAt: new Date(Date.now() + 60 * 60 * 1000),
  };
}
```

---

### **FASE 4: API de Registro Mejorada** (1 hora)

#### 4.1 Crear Endpoint de Registro Público

**`src/app/api/auth/register/route.ts`** (NUEVO)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations';
import { userDB } from '@/lib/db';
import { getClientIp, isIpBlacklisted, isIpWhitelisted, checkIpRateLimit } from '@/lib/ip-utils';
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
          resetAt: rateLimit.resetAt,
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
      token
    );

    if (!emailResult.success) {
      // Si falla el email, eliminar usuario y token
      await prisma.user.delete({ where: { id: user.id } });
      return NextResponse.json(
        { error: 'Error al enviar email de verificación. Intenta más tarde.' },
        { status: 500 }
      );
    }

    // 11. Retornar éxito (sin datos sensibles)
    return NextResponse.json(
      {
        message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.',
        email: validated.email,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}
```

#### 4.2 Crear Endpoint de Verificación

**`src/app/api/auth/verify-email/route.ts`** (NUEVO)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from '@/lib/ip-utils';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token de verificación requerido' },
        { status: 400 }
      );
    }

    // 1. Buscar token de verificación
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'Token de verificación inválido' },
        { status: 400 }
      );
    }

    // 2. Verificar si ya fue usado
    if (verification.usedAt) {
      return NextResponse.json(
        { error: 'Este token ya fue utilizado' },
        { status: 400 }
      );
    }

    // 3. Verificar expiración
    if (verification.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'El token de verificación ha expirado. Solicita uno nuevo.' },
        { status: 400 }
      );
    }

    // 4. Obtener IP del cliente
    const clientIp = getClientIp(request);

    // 5. Actualizar usuario
    await prisma.user.update({
      where: { id: verification.userId },
      data: {
        emailVerified: true,
        status: 'active',
        verifiedIp: clientIp,
        verifiedAt: new Date(),
      },
    });

    // 6. Marcar token como usado
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { usedAt: new Date() },
    });

    // 7. Redirigir a login con mensaje de éxito
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('verified', 'true');
    
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Error en verificación:', error);
    return NextResponse.json(
      { error: 'Error al verificar email' },
      { status: 500 }
    );
  }
}
```

---

### **FASE 5: Actualizar Autenticación** (30 min)

#### 5.1 Modificar Login para Validar Estado

**`src/lib/auth.ts`** (Actualizar)

```typescript
// En la función authorize, agregar validación:

const user = await userDB.findByEmail(credentials.email);
if (!user) return null;

// Verificar si la cuenta está activa
if (user.status !== 'active' || !user.emailVerified) {
  throw new Error('Tu cuenta no está verificada. Revisa tu correo electrónico.');
}

// ... resto del código de autenticación
```

---

### **FASE 6: Actualizar Frontend** (1 hora)

#### 6.1 Actualizar Página de Registro

**`src/app/register/page.tsx`** (Modificar)

```typescript
// Cambiar endpoint de /api/users a /api/auth/register
const response = await axios.post('/api/auth/register', {
  name: formData.name,
  email: formData.email,
  password: formData.password,
});

// Mostrar mensaje de verificación
if (response.status === 201) {
  router.push('/login?registered=true&verify=true');
}
```

#### 6.2 Crear Página de Verificación

**`src/app/verify-email/page.tsx`** (NUEVO)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no proporcionado');
      return;
    }

    // Llamar a API de verificación
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        if (res.redirected) {
          // Redirección exitosa
          router.push('/login?verified=true');
        } else {
          const data = await res.json();
          if (res.ok) {
            setStatus('success');
            setMessage('Email verificado exitosamente');
          } else {
            setStatus('error');
            setMessage(data.error || 'Error al verificar email');
          }
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Error al conectar con el servidor');
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando tu email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Email Verificado!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de Verificación</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/register"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Intentar de Nuevo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### **FASE 7: Funcionalidades Adicionales** (Opcional - 1 hora)

#### 7.1 Reenvío de Email de Verificación

**`src/app/api/auth/resend-verification/route.ts`**

```typescript
// Permitir reenviar email si expiró
```

#### 7.2 Panel de Administración de IPs

- Whitelist/Blacklist de IPs
- Ver registros por IP
- Estadísticas de registros

---

## 🔒 Consideraciones de Seguridad

### ✅ **Implementadas:**
1. Tokens únicos y aleatorios (32 bytes)
2. Expiración de tokens (24 horas)
3. Rate limiting por IP
4. Blacklist de IPs
5. Validación de email antes de activar cuenta
6. Registro de IPs para auditoría

### ⚠️ **Recomendaciones Adicionales:**
1. **CAPTCHA** - Agregar reCAPTCHA v3 en formulario de registro
2. **Honeypot** - Campo oculto para detectar bots
3. **Email Domain Validation** - Validar dominios de email temporales
4. **IP Geolocation** - Verificar ubicación sospechosa
5. **2FA Opcional** - Para usuarios privilegiados

---

## 📦 Dependencias a Instalar

```bash
# Email (elegir uno)
npm install resend
# O
npm install nodemailer @types/nodemailer
# O
npm install @sendgrid/mail

# Ya incluidas
# - bcryptjs (hash de contraseñas)
# - crypto (tokens, ya viene con Node.js)
# - zod (validación)
```

---

## 🧪 Testing

### Casos de Prueba:
1. ✅ Registro exitoso con IP válida
2. ✅ Email enviado correctamente
3. ✅ Verificación con token válido
4. ✅ Token expirado rechazado
5. ✅ Token usado dos veces rechazado
6. ✅ IP blacklistada bloqueada
7. ✅ Rate limiting funciona
8. ✅ Login bloqueado sin verificación

---

## 📊 Resumen de Complejidad

| Tarea | Complejidad | Tiempo |
|-------|-------------|--------|
| Schema DB | Baja | 30 min |
| Servicio Email | Media | 45 min |
| Utilidades IP | Media | 30 min |
| API Registro | Alta | 1 hora |
| API Verificación | Media | 30 min |
| Actualizar Auth | Baja | 30 min |
| Frontend | Media | 1 hora |
| Testing | Media | 1 hora |
| **TOTAL** | **Media** | **4-6 horas** |

---

## 🚀 Orden de Implementación Recomendado

1. **FASE 1** - Base de datos (fundación)
2. **FASE 2** - Servicio de email (crítico)
3. **FASE 3** - Utilidades IP (necesario)
4. **FASE 4** - API de registro (core)
5. **FASE 5** - API de verificación (core)
6. **FASE 6** - Frontend (UX)
7. **FASE 7** - Funcionalidades extra (opcional)

---

## 💡 Alternativas Más Simples

Si necesitas algo más rápido, puedes:

1. **Solo Email (sin IP)** - Eliminar validación de IP
2. **Email con código OTP** - En lugar de link, código de 6 dígitos
3. **Verificación manual** - Admin aprueba registros

---

¿Quieres que comience con alguna fase específica?

