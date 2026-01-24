'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Animal {
  id?: string;
  name: string;
  type: string;
  breed: string;
  description: string;
  gender: string;
  status: string;
  price: number | null;
  featured: boolean;
  birthDate: string;
  imageUrl: string;
  livestockAppId?: string | null;
}

const animalTypes = [
  { value: 'Chicken', label: 'Chicken' },
  { value: 'Duck', label: 'Duck' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'Goose', label: 'Goose' },
  { value: 'Goat', label: 'Goat' },
  { value: 'Pig', label: 'Pig' },
  { value: 'Sheep', label: 'Sheep' },
  { value: 'Cow', label: 'Cow' },
  { value: 'Horse', label: 'Horse' },
  { value: 'Rabbit', label: 'Rabbit' },
];

const genders = [
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
];

const statuses = [
  { value: 'Active', label: 'Active' },
  { value: 'For Sale', label: 'For Sale' },
  { value: 'Breeding', label: 'Breeding' },
  { value: 'Sold', label: 'Sold' },
  { value: 'Deceased', label: 'Deceased' },
];

const defaultAnimal: Animal = {
  name: '',
  type: 'Chicken',
  breed: '',
  description: '',
  gender: 'Female',
  status: 'Active',
  price: null,
  featured: false,
  birthDate: '',
  imageUrl: '',
};

export default function AnimalForm({ animal }: { animal?: Animal }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Animal>(animal || defaultAnimal);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!animal?.id;
  const isSynced = !!animal?.livestockAppId;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? (value ? parseFloat(value) : null) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = isEditing
        ? `/api/admin/animals/${animal.id}`
        : '/api/admin/animals';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          birthDate: formData.birthDate || null,
          price: formData.status === 'For Sale' ? formData.price : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save animal');
      }

      router.push('/admin/animals');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save animal');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {isSynced && (
        <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-md text-sm">
          This animal is synced from the Livestock App. Some fields may be overwritten during sync.
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Henrietta, Buttercup"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              {animalTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
              Breed
            </label>
            <input
              type="text"
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="e.g., Rhode Island Red"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              {genders.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Tell visitors about this animal's personality..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Status & Sale</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {formData.status === 'For Sale' && (
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Sale Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>
          )}
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 text-forest-green border-gray-300 rounded focus:ring-forest-green"
          />
          <span className="text-sm text-gray-700">Featured on &quot;Meet the Animals&quot; page</span>
        </label>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Image</h2>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="/uploads/animals/photo.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Enter a URL or path to the animal&apos;s photo</p>
        </div>

        {formData.imageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.imageUrl}
              alt={formData.name || 'Animal preview'}
              className="w-48 h-48 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEditing ? 'Update Animal' : 'Add Animal'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
