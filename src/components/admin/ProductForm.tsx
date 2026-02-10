'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  subcategory: string;
  stockQuantity: number;
  lowStockThreshold: number;
  inStock: boolean;
  featured: boolean;
  displayOrder: number;
  images: string;
  preorderEnabled: boolean;
  preorderLimit: number;
  preorderCount: number;
}

const categories = [
  { value: 'eggs', label: 'Eggs' },
  { value: 'poultry', label: 'Poultry' },
  { value: 'goat-milk', label: 'Goat Milk Products' },
];

const subcategories: Record<string, { value: string; label: string }[]> = {
  eggs: [
    { value: 'chicken', label: 'Chicken' },
    { value: 'duck', label: 'Duck' },
    { value: 'turkey', label: 'Turkey' },
    { value: 'goose', label: 'Goose' },
  ],
  poultry: [
    { value: 'chicken', label: 'Chicken' },
    { value: 'duck', label: 'Duck' },
    { value: 'turkey', label: 'Turkey' },
    { value: 'goose', label: 'Goose' },
  ],
  'goat-milk': [
    { value: 'soap', label: 'Soap' },
    { value: 'lotion', label: 'Lotion' },
    { value: 'lip-balm', label: 'Lip Balm' },
  ],
};

const defaultProduct: Product = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  unit: 'each',
  category: 'eggs',
  subcategory: 'chicken',
  stockQuantity: 0,
  lowStockThreshold: 5,
  inStock: true,
  featured: false,
  displayOrder: 0,
  images: '',
  preorderEnabled: false,
  preorderLimit: 0,
  preorderCount: 0,
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Product>(product || defaultProduct);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!product?.id;

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
          ? parseFloat(value) || 0
          : value,
    }));

    // Auto-generate slug from name
    if (name === 'name' && !isEditing) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }

    // Reset subcategory when category changes
    if (name === 'category') {
      const subs = subcategories[value];
      setFormData((prev) => ({
        ...prev,
        subcategory: subs?.[0]?.value || '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = isEditing
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
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

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used in URLs: /products/{formData.slug || 'your-slug'}
          </p>
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
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
        </div>

        <ImageUpload
          value={formData.images ? (JSON.parse(formData.images)[0] || '') : ''}
          onChange={(url) => setFormData(prev => ({ ...prev, images: url ? JSON.stringify([url]) : '' }))}
          folder="products"
          label="Product Image"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              {(subcategories[formData.category] || []).map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unit *
            </label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              placeholder="dozen, each, bar, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700 mb-1">
              Low Stock Alert At
            </label>
            <input
              type="number"
              id="lowStockThreshold"
              name="lowStockThreshold"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Display Options</h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="w-4 h-4 text-forest-green border-gray-300 rounded focus:ring-forest-green"
            />
            <span className="text-sm text-gray-700">Product is available for purchase</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-forest-green border-gray-300 rounded focus:ring-forest-green"
            />
            <span className="text-sm text-gray-700">Featured product (shows on homepage)</span>
          </label>
        </div>

        <div>
          <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-1">
            Display Order
          </label>
          <input
            type="number"
            id="displayOrder"
            name="displayOrder"
            value={formData.displayOrder}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Pre-Order Settings</h2>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="preorderEnabled"
            checked={formData.preorderEnabled}
            onChange={handleChange}
            className="w-4 h-4 text-forest-green border-gray-300 rounded focus:ring-forest-green"
          />
          <span className="text-sm text-gray-700">Accept pre-orders when out of stock</span>
        </label>

        {formData.preorderEnabled && (
          <>
            <div>
              <label htmlFor="preorderLimit" className="block text-sm font-medium text-gray-700 mb-1">
                Pre-Order Limit
              </label>
              <input
                type="number"
                id="preorderLimit"
                name="preorderLimit"
                value={formData.preorderLimit}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum number of units that can be pre-ordered</p>
            </div>

            {isEditing && formData.preorderCount > 0 && (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
                <span className="text-sm text-amber-800">
                  Pre-Orders Received: <strong>{formData.preorderCount}</strong> / {formData.preorderLimit}
                </span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, preorderCount: 0 }))}
                  className="text-sm text-amber-700 hover:text-amber-900 font-medium underline"
                >
                  Reset Count
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
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
