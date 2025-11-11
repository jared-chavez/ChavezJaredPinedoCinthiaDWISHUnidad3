# 🔐 Sistema de Roles y Permisos

## 📋 Roles Definidos

El sistema implementa tres roles principales con diferentes niveles de acceso:

### 👑 Administrador (admin)

**Descripción:** Acceso completo al sistema. Puede gestionar usuarios, vehículos, ventas y configuración.

**Permisos:**
- ✅ **Gestión de usuarios**: Crear, editar, ver y eliminar usuarios
- ✅ **Gestión de vehículos**: CRUD completo (crear, leer, actualizar, eliminar)
- ✅ **Gestión de ventas**: Crear, ver y editar ventas
- ✅ **Dashboard**: Acceso completo con todas las métricas y gráficos
- ✅ **Reportes**: Acceso a todos los reportes y análisis
- ✅ **Analíticas**: Acceso a gráficos y estadísticas avanzadas
- ✅ **Configuración**: Gestionar configuraciones del sistema

**Uso típico:** Gerentes, dueños de la agencia, supervisores.

---

### 👔 Empleado (employee)

**Descripción:** Puede crear y editar vehículos, registrar ventas y ver reportes básicos.

**Permisos:**
- ❌ **Gestión de usuarios**: Sin acceso
- ✅ **Crear vehículos**: Puede agregar nuevos vehículos al inventario
- ✅ **Editar vehículos**: Puede modificar información de vehículos
- ❌ **Eliminar vehículos**: No puede eliminar vehículos
- ✅ **Ver vehículos**: Acceso completo al inventario
- ✅ **Crear ventas**: Puede registrar nuevas ventas
- ✅ **Ver ventas**: Puede ver todas las ventas
- ❌ **Editar ventas**: No puede modificar ventas existentes
- ✅ **Dashboard**: Acceso con métricas básicas
- ✅ **Reportes**: Acceso a reportes básicos
- ❌ **Analíticas**: Sin acceso a gráficos avanzados
- ❌ **Configuración**: Sin acceso

**Uso típico:** Vendedores, personal de ventas, personal de inventario.

---

### 👁️ Visualizador (viewer)

**Descripción:** Solo lectura. Puede ver inventario y estadísticas básicas.

**Permisos:**
- ❌ **Gestión de usuarios**: Sin acceso
- ❌ **Crear vehículos**: Sin acceso
- ❌ **Editar vehículos**: Sin acceso
- ❌ **Eliminar vehículos**: Sin acceso
- ✅ **Ver vehículos**: Solo lectura del inventario
- ❌ **Crear ventas**: Sin acceso
- ✅ **Ver ventas**: Puede ver ventas (solo lectura)
- ❌ **Editar ventas**: Sin acceso
- ✅ **Dashboard**: Acceso con métricas básicas
- ❌ **Reportes**: Sin acceso a reportes detallados
- ❌ **Analíticas**: Sin acceso
- ❌ **Configuración**: Sin acceso

**Uso típico:** Consultores externos, auditores, personal de soporte.

---

## 🔧 Implementación Técnica

### Archivo: `src/lib/roles.ts`

```typescript
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: { /* permisos completos */ },
  employee: { /* permisos limitados */ },
  viewer: { /* solo lectura */ },
};
```

### Uso en Componentes

```typescript
import { ROLE_PERMISSIONS } from '@/lib/roles';

const permissions = ROLE_PERMISSIONS[userRole];
if (permissions.canCreateVehicles) {
  // Mostrar botón de crear vehículo
}
```

### Uso en API Routes

```typescript
if (session.user.role !== 'admin' && session.user.role !== 'employee') {
  return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
}
```

### Uso en Middleware

El middleware (`src/middleware.ts`) valida roles automáticamente para rutas protegidas.

---

## 🎯 Matriz de Permisos

| Funcionalidad | Admin | Employee | Viewer |
|--------------|-------|----------|--------|
| Ver Dashboard | ✅ | ✅ | ✅ |
| Ver Analíticas | ✅ | ❌ | ❌ |
| Ver Reportes | ✅ | ✅ | ❌ |
| Gestionar Usuarios | ✅ | ❌ | ❌ |
| Crear Vehículos | ✅ | ✅ | ❌ |
| Editar Vehículos | ✅ | ✅ | ❌ |
| Eliminar Vehículos | ✅ | ❌ | ❌ |
| Ver Vehículos | ✅ | ✅ | ✅ |
| Crear Ventas | ✅ | ✅ | ❌ |
| Ver Ventas | ✅ | ✅ | ✅ |
| Editar Ventas | ✅ | ❌ | ❌ |
| Configuración | ✅ | ❌ | ❌ |

---

## 🔒 Seguridad

1. **Validación en Backend**: Todas las API routes validan roles
2. **Validación en Frontend**: Componentes ocultan/muestran según permisos
3. **Middleware**: Protege rutas a nivel de servidor
4. **Type Safety**: TypeScript asegura que los roles sean válidos

---

## 📝 Agregar Nuevos Roles

Para agregar un nuevo rol:

1. Agregar el tipo en `src/lib/roles.ts`:
```typescript
export type UserRole = 'admin' | 'employee' | 'viewer' | 'nuevo_rol';
```

2. Agregar permisos:
```typescript
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  // ... roles existentes
  nuevo_rol: {
    canManageUsers: false,
    // ... definir permisos
  },
};
```

3. Actualizar el schema de Prisma si es necesario
4. Actualizar validaciones en API routes

---

## 🧪 Testing de Permisos

Para probar permisos:

1. Crear usuarios con diferentes roles
2. Iniciar sesión con cada rol
3. Verificar que solo se muestren las opciones permitidas
4. Intentar acceder a rutas protegidas directamente
5. Verificar que las API routes rechacen peticiones no autorizadas

