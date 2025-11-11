// Middleware de seguridad para proteger rutas

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;
  
  // Rutas públicas
  const publicRoutes = ['/login', '/register', '/api/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Si es una ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Si no hay sesión y no es ruta pública, redirigir a login
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Proteger rutas de API (excepto auth)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
    // Verificar roles para rutas administrativas
    if (pathname.startsWith('/api/users') && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

