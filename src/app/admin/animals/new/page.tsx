import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/auth';
import AnimalForm from '@/components/admin/AnimalForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewAnimalPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
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
        <h1 className="text-2xl font-bold text-gray-900">Add New Animal</h1>
        <p className="text-gray-600">Add a new animal to your ranch.</p>
      </div>

      <AnimalForm />
    </div>
  );
}
