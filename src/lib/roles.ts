// Definición de roles y permisos del sistema

export type UserRole = 'admin' | 'employee' | 'viewer';

export interface RolePermissions {
  // Gestión de usuarios
  canManageUsers: boolean;
  canViewUsers: boolean;
  
  // Gestión de vehículos
  canCreateVehicles: boolean;
  canEditVehicles: boolean;
  canDeleteVehicles: boolean;
  canViewVehicles: boolean;
  
  // Gestión de ventas
  canCreateSales: boolean;
  canViewSales: boolean;
  canEditSales: boolean;
  
  // Dashboard y reportes
  canViewDashboard: boolean;
  canViewReports: boolean;
  canViewAnalytics: boolean;
  
  // Configuración
  canManageSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    // Usuarios
    canManageUsers: true,
    canViewUsers: true,
    
    // Vehículos
    canCreateVehicles: true,
    canEditVehicles: true,
    canDeleteVehicles: true,
    canViewVehicles: true,
    
    // Ventas
    canCreateSales: true,
    canViewSales: true,
    canEditSales: true,
    
    // Dashboard
    canViewDashboard: true,
    canViewReports: true,
    canViewAnalytics: true,
    
    // Configuración
    canManageSettings: true,
  },
  
  employee: {
    // Usuarios
    canManageUsers: false,
    canViewUsers: false,
    
    // Vehículos
    canCreateVehicles: true,
    canEditVehicles: true,
    canDeleteVehicles: false,
    canViewVehicles: true,
    
    // Ventas
    canCreateSales: true,
    canViewSales: true,
    canEditSales: false,
    
    // Dashboard
    canViewDashboard: true,
    canViewReports: true,
    canViewAnalytics: false,
    
    // Configuración
    canManageSettings: false,
  },
  
  viewer: {
    // Usuarios
    canManageUsers: false,
    canViewUsers: false,
    
    // Vehículos
    canCreateVehicles: false,
    canEditVehicles: false,
    canDeleteVehicles: false,
    canViewVehicles: true,
    
    // Ventas
    canCreateSales: false,
    canViewSales: true,
    canEditSales: false,
    
    // Dashboard
    canViewDashboard: true,
    canViewReports: false,
    canViewAnalytics: false,
    
    // Configuración
    canManageSettings: false,
  },
};

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: 'Administrador',
    employee: 'Empleado',
    viewer: 'Visualizador',
  };
  return labels[role] || role;
}

export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    admin: 'Acceso completo al sistema. Puede gestionar usuarios, vehículos, ventas y configuración.',
    employee: 'Puede crear y editar vehículos, registrar ventas y ver reportes básicos.',
    viewer: 'Solo lectura. Puede ver inventario y estadísticas básicas.',
  };
  return descriptions[role] || '';
}

