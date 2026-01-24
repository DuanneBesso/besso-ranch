'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Store, Mail, Truck, Bell, Clock } from 'lucide-react';

interface Settings {
  [key: string]: string | number | boolean;
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 px-4 py-3 rounded-md text-sm">
          Settings saved successfully!
        </div>
      )}

      {/* Site Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-6">
          <Store className="h-5 w-5 text-forest-green" />
          <h2 className="text-lg font-semibold text-gray-900">Site Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="site_name" className="block text-sm font-medium text-gray-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              id="site_name"
              name="site_name"
              value={String(formData.site_name || '')}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="site_tagline" className="block text-sm font-medium text-gray-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              id="site_tagline"
              name="site_tagline"
              value={String(formData.site_tagline || '')}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="h-5 w-5 text-forest-green" />
          <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              value={String(formData.contact_email || '')}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              id="contact_phone"
              name="contact_phone"
              value={String(formData.contact_phone || '')}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-6">
          <Truck className="h-5 w-5 text-forest-green" />
          <h2 className="text-lg font-semibold text-gray-900">Delivery Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="delivery_radius_miles" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Radius (miles)
            </label>
            <input
              type="number"
              id="delivery_radius_miles"
              name="delivery_radius_miles"
              value={Number(formData.delivery_radius_miles || 0)}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="delivery_fee" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Fee ($)
            </label>
            <input
              type="number"
              id="delivery_fee"
              name="delivery_fee"
              value={Number(formData.delivery_fee || 0)}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-forest-green" />
          <h2 className="text-lg font-semibold text-gray-900">Quiet Hours</h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          No notifications will be sent during quiet hours.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quiet_hours_start" className="block text-sm font-medium text-gray-700 mb-1">
              Start Hour (24h)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="quiet_hours_start"
                name="quiet_hours_start"
                value={Number(formData.quiet_hours_start || 21)}
                onChange={handleChange}
                min="0"
                max="23"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Number(formData.quiet_hours_start || 21) > 12
                ? `${Number(formData.quiet_hours_start || 21) - 12}:00 PM`
                : `${formData.quiet_hours_start || 21}:00 AM`}
            </p>
          </div>

          <div>
            <label htmlFor="quiet_hours_end" className="block text-sm font-medium text-gray-700 mb-1">
              End Hour (24h)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="quiet_hours_end"
                name="quiet_hours_end"
                value={Number(formData.quiet_hours_end || 7)}
                onChange={handleChange}
                min="0"
                max="23"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Number(formData.quiet_hours_end || 7) > 12
                ? `${Number(formData.quiet_hours_end || 7) - 12}:00 PM`
                : `${formData.quiet_hours_end || 7}:00 AM`}
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
