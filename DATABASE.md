# 🗄️ Guía de Base de Datos - PostgreSQL con Prisma

## 📋 Configuración Inicial

### 1. Instalar PostgreSQL

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Descarga e instala desde [postgresql.org](https://www.postgresql.org/download/windows/)

**Docker (Recomendado):**
```bash
docker run --name nocturna-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=nocturna_genesis \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Crear Base de Datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE nocturna_genesis;

# Salir
\q
```

### 3. Configurar Variables de Entorno

Crea `.env.local` con:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/nocturna_genesis?schema=public"
AUTH_SECRET=tu-secret-key-super-segura
```

## 🚀 Comandos Prisma

### Generar Cliente
```bash
npm run db:generate
```
Ejecuta esto después de modificar `prisma/schema.prisma`.

### Migraciones

**Crear migración:**
```bash
npm run db:migrate
```
Crea una nueva migración basada en los cambios del schema.

**Aplicar migraciones:**
```bash
npx prisma migrate deploy
```
Aplica migraciones pendientes (útil en producción).

**Resetear base de datos:**
```bash
npx prisma migrate reset
```
⚠️ **Cuidado:** Elimina todos los datos y recrea la base de datos.

### Desarrollo Rápido

**Push schema (sin migraciones):**
```bash
npm run db:push
```
Útil en desarrollo para aplicar cambios rápidamente sin crear migraciones.

### Seed (Datos Iniciales)

```bash
npm run db:seed
```
Pobla la base de datos con datos de ejemplo (usuario admin, vehículos, etc.).

### Prisma Studio

```bash
npm run db:studio
```
Abre una interfaz visual en http://localhost:5555 para explorar y editar datos.

## 📊 Estructura de la Base de Datos

### Tabla: `users`
- `id` (String, PK)
- `email` (String, Unique)
- `name` (String)
- `password` (String, hasheada)
- `role` (String: admin, employee, viewer)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Tabla: `vehicles`
- `id` (String, PK)
- `brand` (String)
- `model` (String)
- `year` (Int)
- `color` (String)
- `price` (Float)
- `mileage` (Int)
- `fuelType` (String)
- `transmission` (String)
- `status` (String: available, sold, reserved, maintenance)
- `vin` (String, Unique)
- `description` (String, Optional)
- `images` (String[])
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `createdBy` (String, FK -> users.id)

### Tabla: `sales`
- `id` (String, PK)
- `vehicleId` (String, FK -> vehicles.id)
- `userId` (String, FK -> users.id)
- `customerName` (String)
- `customerEmail` (String)
- `customerPhone` (String)
- `salePrice` (Float)
- `saleDate` (DateTime)
- `paymentMethod` (String: cash, credit, financing)
- `notes` (String, Optional)

## 🔍 Consultas Útiles

### Conectar con psql
```bash
psql -U postgres -d nocturna_genesis
```

### Ver todas las tablas
```sql
\dt
```

### Ver estructura de una tabla
```sql
\d users
\d vehicles
\d sales
```

### Consultas de ejemplo
```sql
-- Contar vehículos por estado
SELECT status, COUNT(*) FROM vehicles GROUP BY status;

-- Ventas del último mes
SELECT * FROM sales WHERE sale_date >= NOW() - INTERVAL '1 month';

-- Usuarios por rol
SELECT role, COUNT(*) FROM users GROUP BY role;
```

## 🔧 Servicios en la Nube

### Supabase (Recomendado - Gratis)
1. Crea cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > Database
4. Copia la connection string
5. Actualiza `DATABASE_URL` en `.env.local`

### Neon (Gratis)
1. Crea cuenta en [neon.tech](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la connection string
4. Actualiza `DATABASE_URL` en `.env.local`

### Railway
1. Crea cuenta en [railway.app](https://railway.app)
2. Crea un nuevo proyecto PostgreSQL
3. Copia la connection string
4. Actualiza `DATABASE_URL` en `.env.local`

## 🛠️ Solución de Problemas

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Verifica la URL en `DATABASE_URL`
- Verifica el puerto (por defecto 5432)

### Error: "Database does not exist"
```bash
createdb nocturna_genesis
```

### Error: "Permission denied"
```bash
# En psql
GRANT ALL PRIVILEGES ON DATABASE nocturna_genesis TO postgres;
```

### Resetear todo
```bash
# Eliminar base de datos
dropdb nocturna_genesis

# Crear de nuevo
createdb nocturna_genesis

# Aplicar migraciones
npm run db:migrate

# Poblar datos
npm run db:seed
```

## 📝 Migraciones en Producción

1. **Nunca** uses `db:push` en producción
2. Siempre crea migraciones con `db:migrate`
3. Revisa las migraciones antes de aplicarlas
4. Haz backup antes de migraciones importantes
5. Aplica migraciones en horarios de bajo tráfico

## 🔐 Seguridad

- ✅ Nunca commitees `.env.local` o `.env`
- ✅ Usa contraseñas fuertes en producción
- ✅ Habilita SSL en producción (`?sslmode=require`)
- ✅ Limita acceso a la base de datos por IP
- ✅ Usa connection pooling en producción
- ✅ Haz backups regulares

## 📚 Recursos

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Prisma Migrate Guide](https://www.prisma.io/docs/guides/migrate)

