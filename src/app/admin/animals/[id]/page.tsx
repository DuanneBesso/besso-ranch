import { redirect, notFound } from 'next/navigation';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import AnimalForm from '@/components/admin/AnimalForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditAnimalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const animal = await prisma.animal.findUnique({
    where: { id },
  });

  if (!animal) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/animals"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Animals
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Animal</h1>
        <p className="text-gray-600">Update {animal.name}&apos;s profile.</p>
      </div>

      <AnimalForm
        animal={{
          id: animal.id,
          name: animal.name,
          type: animal.type,
          breed: animal.breed || '',
          description: animal.description || '',
          gender: animal.gender || 'Female',
          status: animal.status,
          price: animal.price,
          featured: animal.featured,
          imageUrl: animal.imageUrl || '',
          birthDate: animal.birthDate ? animal.birthDate.toISOString().split('T')[0] : '',
          livestockAppId: animal.livestockAppId,
        }}
      />
    </div>
  );
}
