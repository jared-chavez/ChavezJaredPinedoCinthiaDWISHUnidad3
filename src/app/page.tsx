import LandingNavbar from '@/components/LandingNavbar';
import HeroCarousel from '@/components/HeroCarousel';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      <LandingNavbar />
      
      {/* Hero Section con Carousel */}
      <section className="relative min-h-screen overflow-hidden">
        <HeroCarousel />
        
        {/* Botones de acción sobre el carousel */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-2xl hover:shadow-3xl hover:-translate-y-1 backdrop-blur-sm"
            >
              Ver Inventario
            </Link>
            <Link
              href="#promociones"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-900 transition-all duration-200 backdrop-blur-sm"
            >
              Ver Promociones
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Por qué elegir Nocturna Genesis?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Tu confianza es nuestra prioridad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Calidad Garantizada
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Todos nuestros vehículos pasan por un riguroso proceso de inspección y certificación.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Financiamiento Flexible
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Opciones de pago adaptadas a tus necesidades. Crédito, leasing y autofinanciamiento.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Servicio Integral
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mantenimiento, refacciones y servicio técnico especializado para tu vehículo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promociones Section */}
      <section id="promociones" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Descubre todas las promociones
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Ofertas especiales y condiciones preferenciales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
                title: 'Promoción Financiamiento',
                description: 'Tasa de interés preferencial del 8.9% en créditos automotrices',
              },
              {
                id: 2,
                image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
                title: 'Descuento en Seminuevos',
                description: 'Hasta 15% de descuento en vehículos seminuevos certificados',
              },
              {
                id: 3,
                image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
                title: 'Mantenimiento Incluido',
                description: 'Primer año de mantenimiento gratuito con tu compra',
              },
            ].map((promo) => (
              <div key={promo.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {promo.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {promo.description}
                  </p>
                  <Link
                    href="/inventory"
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm inline-flex items-center gap-1"
                  >
                    Ver más
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financiamiento Section */}
      <section id="financiamiento" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Financiamiento a tu medida
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Encuentra la opción de financiamiento que mejor se adapte a tus necesidades. 
                Ofrecemos crédito tradicional, leasing y autofinanciamiento con las mejores tasas del mercado.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Crédito Automotriz</h3>
                    <p className="text-gray-600 dark:text-gray-400">Tasas competitivas y aprobación rápida</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Leasing</h3>
                    <p className="text-gray-600 dark:text-gray-400">Renta con opción a compra</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Autofinanciamiento</h3>
                    <p className="text-gray-600 dark:text-gray-400">Planes flexibles sin intermediarios</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Calculadora de Financiamiento</h3>
              <p className="mb-6 opacity-90">
                Calcula tu pago mensual estimado en segundos
              </p>
              <Link
                href="/inventory"
                className="inline-block px-6 py-3 bg-white text-blue-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Calcular Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Servicio Section */}
      <section id="servicio" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Servicio y Mantenimiento
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Mantén tu vehículo en perfecto estado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                name: 'Precios de Mantenimiento', 
                image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80',
                alt: 'Herramientas de mantenimiento'
              },
              { 
                name: 'Agenda una Cita', 
                image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&q=80',
                alt: 'Calendario y agenda'
              },
              { 
                name: 'Service Express', 
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
                alt: 'Servicio rápido'
              },
              { 
                name: 'Carrocería y Pintura', 
                image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=80',
                alt: 'Carrocería y pintura automotriz'
              },
            ].map((service) => (
              <div key={service.name} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {service.name}
                </h3>
                <Link
                  href="#contacto"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm inline-flex items-center gap-1"
                >
                  Más información
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Contáctanos
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Estamos aquí para ayudarte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Teléfono</h3>
              <p className="text-gray-600 dark:text-gray-400">(844) 123-4567</p>
            </div>

            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">WhatsApp</h3>
              <p className="text-gray-600 dark:text-gray-400">+52 844 123 4567</p>
            </div>

            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">contacto@nocturnagenesis.com</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Horarios de Atención
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Ventas</h4>
                <p className="text-gray-600 dark:text-gray-400">Lunes - Viernes: 9:00 AM - 8:00 PM</p>
                <p className="text-gray-600 dark:text-gray-400">Sábado: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-600 dark:text-gray-400">Domingo: 11:00 AM - 6:00 PM</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Servicio</h4>
                <p className="text-gray-600 dark:text-gray-400">Lunes - Viernes: 8:00 AM - 7:00 PM</p>
                <p className="text-gray-600 dark:text-gray-400">Sábado: 8:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">Nocturna Genesis</span>
              </div>
              <p className="text-gray-400 text-sm">
                Tu agencia de confianza para encontrar el vehículo perfecto.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Vehículos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/inventory" className="hover:text-white transition-colors">Inventario</Link></li>
                <li><Link href="/inventory?status=available" className="hover:text-white transition-colors">Seminuevos</Link></li>
                <li><Link href="#promociones" className="hover:text-white transition-colors">Promociones</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#financiamiento" className="hover:text-white transition-colors">Financiamiento</Link></li>
                <li><Link href="#servicio" className="hover:text-white transition-colors">Servicio</Link></li>
                <li><Link href="#contacto" className="hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Información</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#contacto" className="hover:text-white transition-colors">Horarios</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Aviso de Privacidad</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2024 Nocturna Genesis. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
