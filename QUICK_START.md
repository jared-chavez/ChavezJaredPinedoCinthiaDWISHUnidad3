# 🚀 Guía Rápida de Inicio

## 📋 Comandos para Desarrollo Local

### 1. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

El servidor estará disponible en: **http://localhost:3000**

### 2. Comandos de Base de Datos

```bash
# Generar cliente de Prisma (después de cambios en schema.prisma)
npm run db:generate

# Crear y aplicar migraciones
npm run db:migrate

# Aplicar cambios sin migraciones (solo desarrollo)
npm run db:push

# Poblar base de datos con datos de ejemplo
npm run db:seed

# Abrir Prisma Studio (interfaz visual de la BD)
npm run db:studio
```

### 3. Otros Comandos Útiles

```bash
# Compilar para producción
npm run build

# Iniciar servidor de producción
npm run start

# Ejecutar linter
npm run lint
```

---

## 🔐 Variables de Entorno

### Crear archivo `.env.local`

```bash
cp .env.example .env.local
```

### Contenido de `.env.local`

```env
# NextAuth Secret
# Genera un secreto seguro: openssl rand -base64 32
AUTH_SECRET=tu-secret-key-super-segura-cambiar-en-produccion

# NextAuth URL (opcional, para producción)
# NEXTAUTH_URL=http://localhost:3000

# PostgreSQL Database URL
# Formato: postgresql://usuario:contraseña@host:puerto/nombre_base_datos
DATABASE_URL="postgresql://postgres:password@localhost:5432/nocturna_genesis?schema=public"
```

### Generar AUTH_SECRET

```bash
openssl rand -base64 32
```

---

## 🗄️ Configuración de PostgreSQL

### Opción 1: PostgreSQL Local

#### Instalar PostgreSQL

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
Descarga desde [postgresql.org](https://www.postgresql.org/download/windows/)

#### Crear Base de Datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE nocturna_genesis;

# Crear usuario (opcional)
CREATE USER nocturna_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE nocturna_genesis TO nocturna_user;

# Salir
\q
```

### Opción 2: Docker (Recomendado)

```bash
# Ejecutar PostgreSQL en Docker
docker run --name nocturna-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=nocturna_genesis \
  -p 5432:5432 \
  -d postgres:15

# Ver logs
docker logs nocturna-postgres

# Detener contenedor
docker stop nocturna-postgres

# Iniciar contenedor existente
docker start nocturna-postgres

# Eliminar contenedor
docker rm nocturna-postgres
```

### Opción 3: Servicios en la Nube

- **Supabase**: [supabase.com](https://supabase.com) (gratis)
- **Neon**: [neon.tech](https://neon.tech) (gratis)
- **Railway**: [railway.app](https://railway.app) (gratis con límites)

---

## 📊 Conexión desde TablePlus

### Configuración de Conexión

1. **Abrir TablePlus**
2. **Crear Nueva Conexión** → PostgreSQL
3. **Configurar:**

   **Nombre:** `Nocturna Genesis Local`
   
   **Host:** `localhost` (o `127.0.0.1`)
   
   **Puerto:** `5432`
   
   **Usuario:** `postgres` (o el usuario que creaste)
   
   **Contraseña:** `password` (o la que configuraste)
   
   **Base de datos:** `nocturna_genesis`
   
   **SSL:** Desactivado (para local)

4. **Probar Conexión** y **Guardar**

### Ejemplo de String de Conexión para TablePlus

```
postgresql://postgres:password@localhost:5432/nocturna_genesis
```

### Si usas Docker

```bash
# Verificar que el contenedor está corriendo
docker ps

# Si no está corriendo, iniciarlo
docker start nocturna-postgres

# Verificar el puerto
docker port nocturna-postgres
# Debería mostrar: 5432/tcp -> 0.0.0.0:5432
```

### Tablas que verás en TablePlus

- `users` - Usuarios del sistema
- `vehicles` - Vehículos en inventario
- `sales` - Ventas registradas

---

## 🔄 Flujo Completo de Inicio

### Primera Vez

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 3. Iniciar PostgreSQL (Docker)
docker run --name nocturna-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=nocturna_genesis \
  -p 5432:5432 \
  -d postgres:15

# 4. Generar cliente Prisma
npm run db:generate

# 5. Crear tablas
npm run db:migrate

# 6. Poblar datos iniciales
npm run db:seed

# 7. Iniciar servidor
npm run dev
```

### Día a Día

```bash
# 1. Iniciar PostgreSQL (si usas Docker)
docker start nocturna-postgres

# 2. Iniciar servidor
npm run dev
```

---

## 🔍 Verificar que Todo Funciona

### 1. Verificar PostgreSQL

```bash
# Conectar con psql
psql -U postgres -d nocturna_genesis

# Ver tablas
\dt

# Ver usuarios
SELECT * FROM users;

# Salir
\q
```

### 2. Verificar Servidor

- Abre: http://localhost:3000
- Deberías ver la página de login
- Credenciales: `admin@agencia.com` / `Admin123!`

### 3. Verificar TablePlus

- Conecta a la base de datos
- Deberías ver las 3 tablas
- Puedes ver/editar datos directamente

---

## 🐛 Solución de Problemas

### Error: "Can't reach database server"

```bash
# Verificar que PostgreSQL está corriendo
# Docker:
docker ps

# Local:
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
# Cambiar puerto
npm run dev -- -p 3001
```

### Error: "Port 5432 already in use"

```bash
# Ver qué está usando el puerto
lsof -i :5432

# O usar otro puerto en Docker
docker run -p 5433:5432 ...
```

---

## 📝 Credenciales por Defecto

### Usuario Administrador

- **Email:** `admin@agencia.com`
- **Password:** `Admin123!`

### PostgreSQL (Docker)

- **Usuario:** `postgres`
- **Password:** `password`
- **Base de datos:** `nocturna_genesis`
- **Puerto:** `5432`

---

## 🎯 URLs Importantes

- **Aplicación:** http://localhost:3000
- **Prisma Studio:** http://localhost:5555 (cuando ejecutas `npm run db:studio`)
- **Dashboard:** http://localhost:3000/dashboard
- **Inventario:** http://localhost:3000/inventory
- **Ventas:** http://localhost:3000/sales

---

## 💡 Tips

1. **TablePlus**: Úsalo para ver/editar datos rápidamente
2. **Prisma Studio**: Úsalo para explorar la BD desde el navegador
3. **Docker**: Facilita el desarrollo sin instalar PostgreSQL localmente
4. **Hot Reload**: Los cambios en código se reflejan automáticamente
5. **Logs**: Revisa la consola del servidor para ver errores

---

¡Listo para desarrollar! 🚀

