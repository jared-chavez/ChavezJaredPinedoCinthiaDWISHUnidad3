// Script de seed para inicializar la base de datos con datos de ejemplo

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuario administrador
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agencia.com' },
    update: {},
    create: {
      email: 'admin@agencia.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'admin',
    },
  });
  console.log('✅ Usuario administrador creado:', admin.email);

  // Crear usuario empleado de ejemplo
  const employeePassword = await bcrypt.hash('Employee123!', 10);
  const employee = await prisma.user.upsert({
    where: { email: 'empleado@agencia.com' },
    update: {},
    create: {
      email: 'empleado@agencia.com',
      name: 'Empleado Ejemplo',
      password: employeePassword,
      role: 'employee',
    },
  });
  console.log('✅ Usuario empleado creado:', employee.email);

  // Crear algunos vehículos de ejemplo
  const vehicles = [
    {
      brand: 'Toyota',
      model: 'Camry',
      year: 2023,
      color: 'Blanco',
      price: 35000,
      mileage: 0,
      fuelType: 'gasoline',
      transmission: 'automatic',
      status: 'available',
      vin: '1HGBH41JXMN109186',
      description: 'Sedán confiable y eficiente en combustible',
      createdBy: admin.id,
    },
    {
      brand: 'Honda',
      model: 'Civic',
      year: 2022,
      color: 'Negro',
      price: 28000,
      mileage: 15000,
      fuelType: 'gasoline',
      transmission: 'automatic',
      status: 'available',
      vin: '2HGFB2F59NH123456',
      description: 'Compacto deportivo con excelente rendimiento',
      createdBy: admin.id,
    },
    {
      brand: 'Tesla',
      model: 'Model 3',
      year: 2024,
      color: 'Rojo',
      price: 45000,
      mileage: 5000,
      fuelType: 'electric',
      transmission: 'automatic',
      status: 'available',
      vin: '5YJ3E1EA1KF123789',
      description: 'Vehículo eléctrico de alto rendimiento',
      createdBy: admin.id,
    },
  ];

  for (const vehicle of vehicles) {
    const created = await prisma.vehicle.upsert({
      where: { vin: vehicle.vin },
      update: {},
      create: vehicle,
    });
    console.log(`✅ Vehículo creado: ${created.brand} ${created.model}`);
  }

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

