import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { Plus, Pencil, RefreshCw } from 'lucide-react';
import DeleteAnimalButton from '@/components/admin/DeleteAnimalButton';

export const dynamic = 'force-dynamic';

const animalTypeIcons: Record<string, string> = {
  Chicken: '🐔',
  Duck: '🦆',
  Turkey: '🦃',
  Goose: '🪿',
  Goat: '🐐',
  Pig: '🐷',
  Sheep: '🐑',
  Cow: '🐄',
  Horse: '🐴',
  Rabbit: '🐰',
};

const statusColors: Record<string, string> = {
  'Active': 'bg-green-100 text-green-700',
  'For Sale': 'bg-amber-100 text-amber-700',
  'Breeding': 'bg-purple-100 text-purple-700',
  'Sold': 'bg-gray-100 text-gray-700',
  'Deceased': 'bg-red-100 text-red-700',
};

export default async function AnimalsPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const animals = await prisma.animal.findMany({
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  });

  const animalTypes = Array.from(new Set(animals.map((a) => a.type)));
  const syncedCount = animals.filter((a) => a.livestockAppId).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Animals</h1>
          <p className="text-gray-600">Manage your ranch animals for the &quot;Meet the Animals&quot; section.</p>
        </div>
        <Link
          href="/admin/animals/new"
          className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Animal
        </Link>
      </div>

      {/* Sync Status */}
      {syncedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-blue-600" />
          <span className="text-blue-700">
            {syncedCount} animal{syncedCount !== 1 ? 's' : ''} synced from Livestock App
          </span>
        </div>
      )}

      {/* Animal Count by Type */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {['Chicken', 'Duck', 'Turkey', 'Goose', 'Goat'].map((type) => {
          const count = animals.filter((a) => a.type === type).length;
          return (
            <div key={type} className="bg-white rounded-lg shadow p-4 text-center">
              <span className="text-3xl">{animalTypeIcons[type] || '🐾'}</span>
              <p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
              <p className="text-sm text-gray-500">{type}s</p>
            </div>
          );
        })}
      </div>

      {/* Animals by Type */}
      {animalTypes.map((type) => (
        <div key={type} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>{animalTypeIcons[type] || '🐾'}</span>
            {type}s
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {animals
              .filter((a) => a.type === type)
              .map((animal) => (
                <div
                  key={animal.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  {/* Image or placeholder */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                    {animal.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={animal.imageUrl}
                        alt={animal.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">{animalTypeIcons[animal.type] || '🐾'}</span>
                    )}
                    {animal.livestockAppId && (
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Synced
                      </span>
                    )}
                    {animal.featured && (
                      <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{animal.name}</h3>
                        {animal.breed && (
                          <p className="text-sm text-gray-500">{animal.breed}</p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          statusColors[animal.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {animal.status}
                      </span>
                    </div>

                    {animal.gender && (
                      <p className="text-sm text-gray-600 mt-2">{animal.gender}</p>
                    )}

                    {animal.status === 'For Sale' && animal.price && (
                      <p className="text-sm font-medium text-amber-600 mt-1">
                        ${animal.price.toFixed(2)}
                      </p>
                    )}

                    {animal.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {animal.description}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                      <Link
                        href={`/admin/animals/${animal.id}`}
                        className="p-2 text-gray-600 hover:text-forest-green transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteAnimalButton animalId={animal.id} animalName={animal.name} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {animals.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No animals yet.</p>
          <Link
            href="/admin/animals/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Your First Animal
          </Link>
        </div>
      )}
    </div>
  );
}
