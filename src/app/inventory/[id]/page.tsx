import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { vehicleDB } from '@/lib/db';
import Navbar from '@/components/Navbar';
import VehicleDetail from '@/components/VehicleDetail';

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  const { id } = await params;
  const vehicle = await vehicleDB.findById(id);

  if (!vehicle) {
    redirect('/inventory');
  }

  return (
    <>
      <Navbar />
      <VehicleDetail vehicle={vehicle} session={session} />
    </>
  );
}

