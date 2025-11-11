# 🔌 Cliente API - Vinculación Backend/Frontend

## 📋 Arquitectura

El sistema implementa una arquitectura cliente-servidor clara con separación entre:

- **Backend (API Routes)**: Endpoints REST en `/api/*`
- **Frontend (API Client)**: Cliente centralizado en `src/lib/api-client.ts`
- **Hooks personalizados**: Abstracción React en `src/hooks/*`

```
┌─────────────────┐
│   Components    │  (UI Components)
└────────┬────────┘
         │
┌────────▼────────┐
│  Custom Hooks   │  (useVehicles, useSales, etc.)
└────────┬────────┘
         │
┌────────▼────────┐
│   API Client    │  (apiClient - Axios wrapper)
└────────┬────────┘
         │
┌────────▼────────┐
│   API Routes    │  (Next.js API Routes)
└────────┬────────┘
         │
┌────────▼────────┐
│   Database      │  (Prisma + PostgreSQL)
└─────────────────┘
```

---

## 🔧 Cliente API (`src/lib/api-client.ts`)

### Características

- ✅ **Singleton Pattern**: Una sola instancia para toda la aplicación
- ✅ **Interceptores Axios**: Manejo automático de errores y autenticación
- ✅ **Type Safety**: TypeScript para todas las respuestas
- ✅ **Manejo de Errores**: Función helper `handleApiError()`

### Métodos Disponibles

#### Autenticación
```typescript
apiClient.signIn(email, password)
apiClient.signOut()
apiClient.getSession()
```

#### Usuarios
```typescript
apiClient.getUsers(): Promise<User[]>
apiClient.createUser(userData): Promise<User>
```

#### Vehículos
```typescript
apiClient.getVehicles(status?): Promise<Vehicle[]>
apiClient.getVehicle(id): Promise<Vehicle>
apiClient.createVehicle(data): Promise<Vehicle>
apiClient.updateVehicle(id, data): Promise<Vehicle>
apiClient.deleteVehicle(id): Promise<void>
```

#### Ventas
```typescript
apiClient.getSales(): Promise<Sale[]>
apiClient.getSale(id): Promise<Sale>
apiClient.createSale(data): Promise<Sale>
```

#### Web Services de Terceros
```typescript
apiClient.getVehicleInfo(vin)
apiClient.getMarketPricing(brand, model, year)
```

#### Estadísticas
```typescript
apiClient.getDashboardStats()
apiClient.getSalesStats(startDate?, endDate?)
apiClient.getInventoryStats()
```

---

## 🎣 Hooks Personalizados

### `useVehicles`

```typescript
const { vehicles, loading, error, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
```

**Características:**
- Carga automática de vehículos
- Estado de carga y error
- Métodos para CRUD
- Actualización automática del estado

### `useVehicle(id)`

```typescript
const { vehicle, loading, error, loadVehicle } = useVehicle(vehicleId);
```

**Características:**
- Carga un vehículo específico
- Recarga manual disponible

### `useSales`

```typescript
const { sales, loading, error, createSale } = useSales();
```

**Características:**
- Lista todas las ventas
- Crear nuevas ventas
- Estado reactivo

### `useUsers`

```typescript
const { users, loading, error, createUser } = useUsers();
```

**Características:**
- Lista todos los usuarios
- Crear nuevos usuarios
- Solo para administradores

### `useDashboard`

```typescript
const { stats, loading, error, refresh } = useDashboard();
```

**Características:**
- Carga estadísticas del dashboard
- Métricas completas
- Función de refresco manual

---

## 🔄 Flujo de Datos

### Ejemplo: Crear un Vehículo

1. **Componente** llama al hook:
```typescript
const { createVehicle } = useVehicles();
await createVehicle(formData);
```

2. **Hook** llama al cliente API:
```typescript
const newVehicle = await apiClient.createVehicle(vehicleData);
```

3. **Cliente API** hace petición HTTP:
```typescript
POST /api/vehicles
Body: { brand, model, year, ... }
```

4. **API Route** procesa y guarda:
```typescript
// src/app/api/vehicles/route.ts
const vehicle = await vehicleDB.create(validated);
```

5. **Base de datos** persiste:
```typescript
// Prisma guarda en PostgreSQL
```

6. **Respuesta** fluye de vuelta:
```
DB → API Route → API Client → Hook → Component → UI Update
```

---

## 🛡️ Manejo de Errores

### En el Cliente API

```typescript
// Interceptor automático
this.client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### En los Hooks

```typescript
try {
  const data = await apiClient.getVehicles();
  setVehicles(data);
} catch (err) {
  setError(handleApiError(err));
}
```

### En los Componentes

```typescript
const { error } = useVehicles();

{error && (
  <div className="error-message">{error}</div>
)}
```

---

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/signin` - Iniciar sesión
- `POST /api/auth/signout` - Cerrar sesión
- `GET /api/auth/session` - Obtener sesión

### Vehículos
- `GET /api/vehicles` - Listar vehículos
- `GET /api/vehicles?status=available` - Filtrar por estado
- `GET /api/vehicles/[id]` - Obtener vehículo
- `POST /api/vehicles` - Crear vehículo
- `PUT /api/vehicles/[id]` - Actualizar vehículo
- `DELETE /api/vehicles/[id]` - Eliminar vehículo

### Ventas
- `GET /api/sales` - Listar ventas
- `POST /api/sales` - Crear venta

### Usuarios
- `GET /api/users` - Listar usuarios (Admin)
- `POST /api/users` - Crear usuario (Admin)

### Estadísticas
- `GET /api/stats/dashboard` - Estadísticas del dashboard

### Web Services Externos
- `GET /api/external/vehicle-info?vin=XXX` - Info por VIN
- `GET /api/external/pricing?brand=X&model=Y&year=Z` - Precios

---

## 🔐 Autenticación

El cliente API usa las cookies de sesión de NextAuth automáticamente. No es necesario enviar tokens manualmente.

```typescript
// Automático - NextAuth maneja las cookies
const response = await apiClient.getVehicles();
```

---

## 🚀 Uso en Componentes

### Ejemplo Completo

```typescript
'use client';

import { useVehicles } from '@/hooks/useVehicles';
import { useState } from 'react';

export default function VehicleList() {
  const { vehicles, loading, error, createVehicle } = useVehicles();
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      await createVehicle(formData);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {vehicles.map(vehicle => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
```

---

## 📝 Mejores Prácticas

1. **Siempre usa hooks**: No llames `apiClient` directamente en componentes
2. **Maneja errores**: Siempre captura y muestra errores al usuario
3. **Loading states**: Muestra estados de carga apropiados
4. **Type safety**: Usa los tipos de TypeScript proporcionados
5. **Optimistic updates**: Actualiza UI antes de confirmar con servidor (opcional)

---

## 🔄 Actualizaciones Futuras

Posibles mejoras:

- [ ] Cache con React Query
- [ ] Optimistic updates
- [ ] Retry automático en fallos
- [ ] Request debouncing
- [ ] Paginación automática
- [ ] Infinite scroll

