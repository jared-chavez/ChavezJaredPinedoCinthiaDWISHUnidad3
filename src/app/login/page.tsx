'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciales inválidas');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 px-4 py-12">
      <div className="w-full max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 min-h-[600px]">
            {/* Lado Izquierdo - Imagen de fondo */}
            <div className="hidden md:flex relative overflow-hidden">
              {/* Imagen de fondo */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80"
                  alt="Agencia de vehículos"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay oscuro para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/70 to-purple-900/80"></div>
              </div>
              
              {/* Contenido sobre la imagen */}
              <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full">
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 logo-title drop-shadow-lg">
                    Nocturna Genesis
                  </h2>
                  <p className="text-blue-100 text-xl md:text-2xl drop-shadow-md">
                    Tu agencia de confianza
                  </p>
                </div>
              </div>
            </div>

            {/* Lado Derecho - Formulario */}
            <div className="flex flex-col justify-center p-8 md:p-12">
              <div className="w-full max-w-md mx-auto">
                {/* Avatar/Logo */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg ring-4 ring-gray-200 dark:ring-gray-700">
                    <Image
                      src="/images.jpeg"
                      alt="Logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Título */}
                <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white logo-title">
                  BIENVENIDO
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                  Inicia sesión en tu cuenta
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Campo Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-500 focus:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-800 dark:text-white transition-all"
                        placeholder="admin@agencia.com"
                      />
                    </div>
                  </div>

                  {/* Campo Contraseña */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-500 focus:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-800 dark:text-white transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Botón de Login */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 hover:from-gray-900 hover:to-gray-950 dark:hover:from-gray-600 dark:hover:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                    {loading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
                  </button>
                </form>

                {/* Link a Registro */}
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  ¿No tienes cuenta?{' '}
                  <Link href="/register" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors">
                    Regístrate
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600">
        <div className="text-white">Cargando...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
