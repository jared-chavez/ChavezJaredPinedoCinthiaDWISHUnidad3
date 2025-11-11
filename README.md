<div align="center">
  <img src="./public/images.jpeg" alt="Nocturna Genesis Logo" width="200" height="200" style="border-radius: 12px; margin-bottom: 20px;" />
  
  # Agencia de Vehículos - Nocturna Genesis
  
  Sistema completo de gestión de inventario y ventas para una agencia de vehículos, desarrollado con Next.js 16, TypeScript, NextAuth y Tailwind CSS.
</div>

## Características

### Mecanismos de Seguridad
- **Autenticación segura** con NextAuth v5 y bcryptjs para hash de contraseñas
- **Validación de datos** con Zod en todas las entradas
- **Middleware de seguridad** que protege rutas y valida roles
- **Control de acceso basado en roles** (Admin, Emprendedores, Usuarios Regulares)
- **Protección CSRF** integrada en NextAuth
- **Validación de sesiones** JWT

### Web Services Propios
- **API REST completa** para gestión de vehículos (CRUD)
- **API de usuarios** con control de acceso
- **API de ventas** con validación de inventario
- **API de estadísticas** para dashboard
- **Búsqueda y filtros avanzados** con paginación
- **Endpoints protegidos** con autenticación y autorización

### Web Services de Terceros
- **NHTSA VIN Decoder** - Decodificación de VIN (gratuita, sin API key)
- **Market Pricing API** - Precios de mercado (simulada, lista para integración real)
- **OpenWeatherMap API** - Información del clima (opcional)
- **ExchangeRate API** - Conversión de monedas (opcional)

## Tecnologías Utilizadas

- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **NextAuth v5** - Autenticación y autorización
- **PostgreSQL** - Base de datos relacional
- **Prisma** - ORM para PostgreSQL
- **Tailwind CSS** - Estilos y diseño responsive
- **Zod** - Validación de esquemas
- **bcryptjs** - Hash de contraseñas
- **Axios** - Cliente HTTP para APIs
- **Recharts** - Gráficos y visualizaciones

## Requisitos Previos

- Node.js 18+ 
- npm, yarn, pnpm o bun
- **PostgreSQL 14+** (o acceso a una base de datos PostgreSQL)

## Instalación Rápida

### 1. Clonar y Instalar

```bash
git clone <tu-repositorio>
cd nocturna-genesis
npm install
```

### 2. Configurar PostgreSQL

**Opción A: Docker (Recomendado)**
```bash
docker run --name nocturna-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=nocturna_genesis \
  -p 5432:5432 \
  -d postgres:15
```

**Opción B: PostgreSQL Local**
```bash
# macOS
brew install postgresql
brew services start postgresql
createdb nocturna_genesis

# Ubuntu/Debian
sudo apt-get install postgresql
sudo systemctl start postgresql
createdb nocturna_genesis
```

**Opción C: Servicios en la Nube**
- [Supabase](https://supabase.com) (gratis)
- [Neon](https://neon.tech) (gratis)
- [Railway](https://railway.app) (gratis con límites)

### 3. Variables de Entorno

```bash
cp .env.example .env.local
```

Edita `.env.local`:
```env
# NextAuth Secret (genera con: openssl rand -base64 32)
AUTH_SECRET=tu-secret-key-super-segura

# PostgreSQL Database URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/nocturna_genesis?schema=public"

# Opcional: APIs de terceros
OPENWEATHER_API_KEY=tu_api_key_aqui
```

**Ejemplos de DATABASE_URL:**
- Local: `postgresql://postgres:password@localhost:5432/nocturna_genesis?schema=public`
- Docker: `postgresql://postgres:password@localhost:5432/nocturna_genesis?schema=public`
- Supabase: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require`

### 4. Configurar Base de Datos

```bash
# Generar cliente de Prisma
npm run db:generate

# Crear tablas (migraciones)
npm run db:migrate

# Poblar con datos de ejemplo
npm run db:seed
```

### 5. Iniciar Servidor

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Credenciales por Defecto

- **Email:** `admin@agencia.com`
- **Password:** `Admin123!`

## Roles y Permisos

### Administrador (admin)
- Acceso completo al sistema
- Gestión de usuarios (CRUD)
- CRUD completo de vehículos
- Eliminar vehículos
- Registrar y editar ventas
- Dashboard completo con todas las métricas

### Emprendedores (emprendedores)
- Crear y editar vehículos
- No puede eliminar vehículos
- Registrar ventas
- Ver inventario y estadísticas
- No puede gestionar usuarios

### Usuarios Regulares (usuarios_regulares)
- Ver inventario (solo lectura)
- Ver ventas (solo lectura)
- Dashboard básico
- No puede crear/editar/eliminar

## API Endpoints

### Autenticación
- `POST /api/auth/signin` - Iniciar sesión
- `POST /api/auth/signout` - Cerrar sesión
- `GET /api/auth/session` - Obtener sesión actual

### Vehículos
- `GET /api/vehicles` - Listar vehículos
- `GET /api/vehicles/search` - Búsqueda avanzada con filtros y paginación
- `GET /api/vehicles/[id]` - Obtener vehículo
- `POST /api/vehicles` - Crear vehículo (Admin/Emprendedores)
- `PUT /api/vehicles/[id]` - Actualizar vehículo (Admin/Emprendedores)
- `DELETE /api/vehicles/[id]` - Eliminar vehículo (Admin)

### Usuarios
- `GET /api/users` - Listar usuarios (Admin)
- `POST /api/users` - Crear usuario (Admin)

### Ventas
- `GET /api/sales` - Listar ventas
- `POST /api/sales` - Registrar venta (Admin/Emprendedores)

### Estadísticas
- `GET /api/stats/dashboard` - Estadísticas del dashboard

### Web Services de Terceros
- `GET /api/external/vehicle-info?vin=XXX` - Información del vehículo por VIN (NHTSA)
- `GET /api/external/pricing?brand=X&model=Y&year=Z` - Precios de mercado
- `GET /api/external/weather?city=XXX` - Información del clima (opcional)
- `GET /api/external/currency?from=USD&to=MXN&amount=100` - Conversión de moneda (opcional)

## Comandos de Base de Datos

```bash
# Generar cliente de Prisma (después de cambios en schema.prisma)
npm run db:generate

# Crear y aplicar migraciones
npm run db:migrate

# Aplicar cambios sin migraciones (solo desarrollo)
npm run db:push

# Poblar base de datos con datos de ejemplo
npm run db:seed

# Abrir Prisma Studio (interfaz visual)
npm run db:studio
```

## Conexión desde TablePlus

### Configuración
1. **Abrir TablePlus** → Crear Nueva Conexión → PostgreSQL
2. **Configurar:**
   - **Host:** `localhost`
   - **Puerto:** `5432`
   - **Usuario:** `postgres`
   - **Contraseña:** `password`
   - **Base de datos:** `nocturna_genesis`
   - **SSL:** Desactivado (local)

### String de Conexión
```
postgresql://postgres:password@localhost:5432/nocturna_genesis
```

### Verificar Docker (si usas Docker)
```bash
docker ps                    # Ver contenedores activos
docker start nocturna-postgres  # Iniciar si está detenido
```

## Estructura del Proyecto

```
src/
├── app/                    # Páginas y rutas
│   ├── api/               # API Routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── vehicles/     # CRUD de vehículos
│   │   ├── users/        # Gestión de usuarios
│   │   ├── sales/        # Gestión de ventas
│   │   ├── stats/        # Estadísticas
│   │   └── external/      # Web Services de terceros
│   ├── dashboard/        # Dashboard principal
│   ├── inventory/        # Gestión de inventario
│   ├── sales/            # Gestión de ventas
│   ├── users/            # Gestión de usuarios (admin)
│   ├── login/           # Página de login
│   └── register/        # Página de registro
├── components/           # Componentes React reutilizables
│   ├── SearchAndFilters.tsx
│   ├── Pagination.tsx
│   ├── ToastProvider.tsx
│   ├── ConfirmDialog.tsx
│   └── ...
├── lib/                  # Utilidades y configuración
│   ├── auth.ts          # Configuración NextAuth
│   ├── db.ts            # Funciones de base de datos (Prisma)
│   ├── prisma.ts        # Cliente Prisma singleton
│   ├── roles.ts         # Definición de roles y permisos
│   ├── api-client.ts    # Cliente API centralizado
│   └── validations.ts   # Schemas de validación Zod
├── hooks/               # Custom React Hooks
│   ├── useVehicles.ts
│   ├── useDashboard.ts
│   └── ...
├── prisma/               # Configuración de Prisma
│   ├── schema.prisma    # Schema de la base de datos
│   └── seed.ts          # Script de seed para datos iniciales
└── types/                # Definiciones TypeScript
```

## Seguridad Implementada

1. **Autenticación JWT** con NextAuth
2. **Hash de contraseñas** con bcryptjs (10 rounds)
3. **Validación de entrada** con Zod en todos los endpoints
4. **Middleware de protección** de rutas
5. **Control de acceso basado en roles** (RBAC)
6. **Sanitización de datos** en formularios
7. **Protección CSRF** integrada
8. **Confirmaciones** para acciones destructivas
9. **Toast notifications** para feedback de usuario

## Funcionalidades Implementadas

### Completadas
- Autenticación y autorización
- CRUD completo de vehículos
- Gestión de usuarios con roles
- Registro de ventas
- Dashboard con métricas y gráficos
- Búsqueda y filtros avanzados
- Paginación en listados
- Confirmaciones en acciones destructivas
- Sistema de notificaciones (Toast)
- Integración con APIs de terceros
- Base de datos PostgreSQL con Prisma
- Diseño responsive completo
- Dark mode
- Landing page profesional
- Tablas responsive

## Estado del Proyecto

### **Progreso: ~85% Completado**

La aplicación está en un estado muy avanzado y funcional. Los aspectos críticos (seguridad, autenticación, CRUD básico) están completamente implementados.

### Métricas de Cobertura

| Categoría | Completado | Estado |
|-----------|------------|--------|
| Autenticación | 100% | Completo |
| Autorización (RBAC) | 100% | Completo |
| CRUD Vehículos | 100% | Completo |
| CRUD Ventas | 90% | Falta editar/eliminar |
| CRUD Usuarios | 80% | Falta editar/eliminar |
| Dashboard | 95% | Casi completo |
| Búsqueda/Filtros | 100% | Completo |
| Paginación | 100% | Completo |
| Web Services Propios | 100% | Completo |
| Web Services Terceros | 75% | 1 simulado |
| UI Responsive | 100% | Completo |
| Seguridad | 95% | Muy completo |
| Base de Datos | 100% | Completo |

### Fortalezas
- Arquitectura sólida y escalable
- Seguridad robusta (NextAuth, bcryptjs, Zod, RBAC)
- UI/UX profesional y responsive
- Código bien organizado y documentado
- Base de datos PostgreSQL con Prisma

### Áreas de Mejora
- Integración real de Market Pricing API (actualmente simulado)
- Sistema de subida de imágenes de vehículos
- Testing automatizado
- Funcionalidades de edición/eliminación en ventas y usuarios

## Desarrollo

### Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Producción
npm run build            # Compilar para producción
npm run start            # Iniciar servidor de producción

# Calidad de Código
npm run lint             # Ejecutar linter

# Base de Datos
npm run db:generate      # Generar cliente Prisma
npm run db:migrate       # Crear migraciones
npm run db:push          # Aplicar cambios (dev)
npm run db:seed          # Poblar datos
npm run db:studio        # Abrir Prisma Studio
```

## Solución de Problemas

### Error: "Can't reach database server"
```bash
# Verificar PostgreSQL (Docker)
docker ps
docker start nocturna-postgres

# Verificar PostgreSQL (Local)
brew services list  # macOS
sudo systemctl status postgresql  # Linux
```

### Error: "Database does not exist"
```bash
createdb nocturna_genesis
```

### Error: "Prisma Client not generated"
```bash
npm run db:generate
```

### Error: "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

## Próximos Pasos para Producción

1. **Base de datos**: PostgreSQL con Prisma implementado
2. **Variables de entorno**: Configurar todas las variables en producción
3. **API Keys**: Obtener API keys reales para servicios de terceros
4. **Logging**: Implementar sistema de logs estructurado
5. **Monitoreo**: Configurar herramientas de monitoreo
6. **Backup**: Implementar estrategia de respaldo para PostgreSQL
7. **HTTPS**: Configurar certificados SSL
8. **Rate Limiting**: Implementar límites de tasa para APIs
9. **Connection Pooling**: Configurar pool de conexiones para Prisma
10. **Migrations**: Configurar migraciones automáticas en producción

## Notas

- **Base de datos PostgreSQL** implementada con Prisma ORM
- **3 roles de usuario**: Admin, Emprendedores, Usuarios Regulares
- **Búsqueda y filtros** implementados con paginación
- **APIs de terceros**: NHTSA (funcional), Pricing (simulada), Weather y Currency (opcionales)
- **Web Services propios**: API REST completa con autenticación
- En producción, reemplazar APIs simuladas por APIs reales con API keys
- Usa `npm run db:studio` para visualizar y editar datos directamente

## Mecanismos de Seguridad Detallados

### Autenticación
- **NextAuth v5** - Sistema de autenticación robusto con JWT sessions
- **bcryptjs** - Hash de contraseñas (10 rounds)
- **CSRF Protection** - Protección integrada en NextAuth

### Validación de Datos
- **Zod** - Validación de esquemas en todas las entradas:
  - Registro de usuarios
  - Creación/edición de vehículos
  - Registro de ventas
  - Todas las entradas de API

### Control de Acceso
- **Middleware de Seguridad** (`src/middleware.ts`)
  - Protección de rutas protegidas
  - Validación de sesiones
  - Redirección automática a login
  - Protección de APIs

### Autorización Basada en Roles (RBAC)
- **3 Roles Definidos:**
  - `admin` - Acceso completo
  - `emprendedores` - Crear/editar vehículos, registrar ventas
  - `usuarios_regulares` - Solo lectura

- **Permisos Granulares:**
  - Gestión de usuarios
  - CRUD de vehículos
  - Gestión de ventas
  - Acceso a dashboard y reportes
  - Configuración del sistema

### Protección de APIs
- Todas las APIs requieren autenticación (excepto públicas)
- Validación de roles en endpoints administrativos
- Manejo de errores de autorización

### Seguridad de Base de Datos
- Prepared statements (Prisma)
- Validación de tipos
- Relaciones con cascada controlada

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## Licencia

Este proyecto es parte del curso de desarrollo web.

---

Desarrollado con Next.js y TypeScript
