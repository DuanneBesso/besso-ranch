'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
}

const categories = [
  { value: 'farm-updates', label: 'Farm Updates' },
  { value: 'animal-spotlights', label: 'Animal Spotlights' },
  { value: 'recipes', label: 'Recipes' },
  { value: 'tips-and-tricks', label: 'Tips & Tricks' },
  { value: 'seasonal', label: 'Seasonal' },
];

const defaultPost: Post = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'farm-updates',
  published: false,
  metaTitle: '',
  metaDescription: '',
};

export default function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Post>(post || defaultPost);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!post?.id;

  const generateSlug = (title: string) => {
    return title
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
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generate slug from title
    if (name === 'title' && !isEditing) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = isEditing
        ? `/api/admin/posts/${post.id}`
        : '/api/admin/posts';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save post');
      }

      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Post title"
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
                /blog/{formData.slug || 'your-slug'}
              </p>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                placeholder="Brief summary for previews and SEO"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={15}
                placeholder="Write your post content here... (Markdown supported)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Markdown formatting is supported
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Publish</h3>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
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

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-4 h-4 text-forest-green border-gray-300 rounded focus:ring-forest-green"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>

            <div className="pt-4 border-t flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : isEditing ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">SEO</h3>

            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="Custom title for search engines"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={3}
                placeholder="Custom description for search engines"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
