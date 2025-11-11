# 🚗 Agencia de Vehículos - Nocturna Genesis

Sistema completo de gestión de inventario y ventas para una agencia de vehículos, desarrollado con Next.js 16, TypeScript, NextAuth y Tailwind CSS.

## ✨ Características

### 🔐 Mecanismos de Seguridad
- **Autenticación segura** con NextAuth v5 y bcryptjs para hash de contraseñas
- **Validación de datos** con Zod en todas las entradas
- **Middleware de seguridad** que protege rutas y valida roles
- **Control de acceso basado en roles** (Admin, Empleado, Visualizador)
- **Protección CSRF** integrada en NextAuth
- **Validación de sesiones** JWT

### 🌐 Web Services Propios
- **API REST completa** para gestión de vehículos (CRUD)
- **API de usuarios** con control de acceso
- **API de ventas** con validación de inventario
- **Endpoints protegidos** con autenticación y autorización

### 🔌 Web Services de Terceros
- **API de información de vehículos** (NHTSA VIN Decoder)
- **API de precios de mercado** (simulada, lista para integración real)
- Integración con servicios externos para enriquecer datos de vehículos

## 🛠️ Tecnologías Utilizadas

- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **NextAuth v5** - Autenticación y autorización
- **PostgreSQL** - Base de datos relacional
- **Prisma** - ORM para PostgreSQL
- **Tailwind CSS** - Estilos y diseño responsive
- **Zod** - Validación de esquemas
- **bcryptjs** - Hash de contraseñas
- **Axios** - Cliente HTTP para APIs

## 📋 Requisitos Previos

- Node.js 18+ 
- npm, yarn, pnpm o bun
- **PostgreSQL 14+** (o acceso a una base de datos PostgreSQL)

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd nocturna-genesis
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura PostgreSQL:

   **Opción A: PostgreSQL local**
   ```bash
   # Instala PostgreSQL si no lo tienes
   # macOS: brew install postgresql
   # Ubuntu: sudo apt-get install postgresql
   # Windows: Descarga desde postgresql.org
   
   # Crea la base de datos
   createdb nocturna_genesis
   ```

   **Opción B: Docker (recomendado para desarrollo)**
   ```bash
   docker run --name nocturna-postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=nocturna_genesis \
     -p 5432:5432 \
     -d postgres:15
   ```

   **Opción C: Servicios en la nube**
   - [Supabase](https://supabase.com) (gratis)
   - [Neon](https://neon.tech) (gratis)
   - [Railway](https://railway.app) (gratis con límites)
   - [AWS RDS](https://aws.amazon.com/rds/)
   - [Google Cloud SQL](https://cloud.google.com/sql)

4. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

Edita `.env.local` y configura:
```env
AUTH_SECRET=tu-secret-key-super-segura
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nocturna_genesis?schema=public"
```

Para generar un secreto seguro:
```bash
openssl rand -base64 32
```

**Ejemplo de DATABASE_URL:**
- Local: `postgresql://postgres:password@localhost:5432/nocturna_genesis?schema=public`
- Docker: `postgresql://postgres:password@localhost:5432/nocturna_genesis?schema=public`
- Supabase: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require`

5. Configura la base de datos:
```bash
# Genera el cliente de Prisma
npm run db:generate

# Ejecuta las migraciones
npm run db:migrate

# (Opcional) Pobla la base de datos con datos de ejemplo
npm run db:seed
```

6. Inicia el servidor de desarrollo:
```bash
npm run dev
```

7. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 👤 Credenciales por Defecto

La aplicación se inicializa con un usuario administrador:

- **Email:** `admin@agencia.com`
- **Password:** `Admin123!`

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas y rutas
│   ├── api/               # API Routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── vehicles/     # CRUD de vehículos
│   │   ├── users/        # Gestión de usuarios
│   │   ├── sales/        # Gestión de ventas
│   │   └── external/      # Web Services de terceros
│   ├── dashboard/        # Dashboard principal
│   ├── inventory/        # Gestión de inventario
│   ├── sales/            # Gestión de ventas
│   ├── users/            # Gestión de usuarios (admin)
│   ├── login/           # Página de login
│   └── register/        # Página de registro
├── components/           # Componentes React reutilizables
├── lib/                  # Utilidades y configuración
│   ├── auth.ts          # Configuración NextAuth
│   ├── db.ts            # Funciones de base de datos (Prisma)
│   ├── prisma.ts        # Cliente Prisma singleton
│   └── validations.ts   # Schemas de validación Zod
├── prisma/               # Configuración de Prisma
│   ├── schema.prisma    # Schema de la base de datos
│   └── seed.ts          # Script de seed para datos iniciales
├── types/                # Definiciones TypeScript
└── middleware.ts         # Middleware de seguridad
```

## 🔑 Roles y Permisos

### Admin
- Acceso completo al sistema
- Gestión de usuarios
- CRUD completo de vehículos
- Registro de ventas
- Visualización de todas las estadísticas

### Employee (Empleado)
- CRUD de vehículos
- Registro de ventas
- Visualización de inventario y estadísticas

### Viewer (Visualizador)
- Solo lectura del inventario
- Visualización de estadísticas básicas

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/signin` - Iniciar sesión
- `POST /api/auth/signout` - Cerrar sesión
- `GET /api/auth/session` - Obtener sesión actual

### Vehículos
- `GET /api/vehicles` - Listar todos los vehículos
- `GET /api/vehicles?status=available` - Filtrar por estado
- `GET /api/vehicles/[id]` - Obtener un vehículo
- `POST /api/vehicles` - Crear vehículo (Admin/Employee)
- `PUT /api/vehicles/[id]` - Actualizar vehículo (Admin/Employee)
- `DELETE /api/vehicles/[id]` - Eliminar vehículo (Admin)

### Usuarios
- `GET /api/users` - Listar usuarios (Admin)
- `POST /api/users` - Crear usuario (Admin)

### Ventas
- `GET /api/sales` - Listar todas las ventas
- `POST /api/sales` - Registrar venta (Admin/Employee)

### Web Services de Terceros
- `GET /api/external/vehicle-info?vin=XXX` - Información del vehículo por VIN
- `GET /api/external/pricing?brand=X&model=Y&year=Z` - Precios de mercado

## 🔒 Seguridad Implementada

1. **Autenticación JWT** con NextAuth
2. **Hash de contraseñas** con bcryptjs (10 rounds)
3. **Validación de entrada** con Zod en todos los endpoints
4. **Middleware de protección** de rutas
5. **Control de acceso basado en roles** (RBAC)
6. **Sanitización de datos** en formularios
7. **Protección CSRF** integrada

## 🗄️ Comandos de Base de Datos

```bash
# Generar cliente de Prisma después de cambios en schema.prisma
npm run db:generate

# Crear y aplicar migraciones
npm run db:migrate

# Aplicar cambios al schema sin migraciones (desarrollo)
npm run db:push

# Poblar base de datos con datos de ejemplo
npm run db:seed

# Abrir Prisma Studio (interfaz visual para la BD)
npm run db:studio
```

## 🧪 Próximos Pasos para Producción

1. ✅ **Base de datos**: PostgreSQL con Prisma implementado
2. **Variables de entorno**: Configurar todas las variables necesarias en producción
3. **API Keys**: Obtener API keys reales para servicios de terceros
4. **Logging**: Implementar sistema de logs
5. **Monitoreo**: Configurar herramientas de monitoreo
6. **Backup**: Implementar estrategia de respaldo para PostgreSQL
7. **HTTPS**: Configurar certificados SSL
8. **Rate Limiting**: Implementar límites de tasa para APIs
9. **Connection Pooling**: Configurar pool de conexiones para Prisma
10. **Migrations**: Configurar migraciones automáticas en producción

## 📝 Notas

- ✅ **Base de datos PostgreSQL** implementada con Prisma ORM
- Los Web Services de terceros incluyen fallbacks simulados
- En producción, reemplazar por APIs reales con API keys
- Usa `npm run db:studio` para visualizar y editar datos directamente

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## 📄 Licencia

Este proyecto es parte del curso de desarrollo web.

---

Desarrollado con ❤️ usando Next.js y TypeScript
