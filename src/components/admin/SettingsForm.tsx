'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Store, Mail, Truck, Bell, Clock, ImageIcon, Instagram, RefreshCw, Eye, EyeOff, Grid3X3 } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface Settings {
  [key: string]: string | number | boolean;
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [refreshingToken, setRefreshingToken] = useState(false);
  const [instagramStatus, setInstagramStatus] = useState('');
  const [galleryPosts, setGalleryPosts] = useState<Array<{
    id: string;
    mediaUrl: string;
    thumbnailUrl: string | null;
    mediaType: string;
    caption: string | null;
    hidden: boolean;
    timestamp: string;
  }>>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [togglingPost, setTogglingPost] = useState<string | null>(null);

  const fetchGalleryPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('/api/admin/instagram/posts');
      if (res.ok) {
        const data = await res.json();
        setGalleryPosts(data.posts);
      }
    } catch {
      // silently fail — posts section just won't load
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleryPosts();
  }, [fetchGalleryPosts]);

  const togglePostVisibility = async (postId: string, currentHidden: boolean) => {
    setTogglingPost(postId);
    try {
      const res = await fetch('/api/admin/instagram/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, hidden: !currentHidden }),
      });
      if (res.ok) {
        setGalleryPosts(prev =>
          prev.map(p => p.id === postId ? { ...p, hidden: !currentHidden } : p)
        );
      }
    } catch {
      // silently fail
    } finally {
      setTogglingPost(null);
    }
  };

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

      {/* Site Logo */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-6">
          <ImageIcon className="h-5 w-5 text-forest-green" />
          <h2 className="text-lg font-semibold text-gray-900">Site Logo</h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Upload your site logo. This appears in the header, footer, and anywhere the logo is displayed.
          Recommended: square image, at least 200x200px. PNG with transparent background works best.
        </p>

        <ImageUpload
          value={String(formData.site_logo || '')}
          onChange={(url) =>
            setFormData((prev) => ({ ...prev, site_logo: url || '/images/logo.png' }))
          }
          folder="branding"
          label="Logo Image"
        />

        {!formData.site_logo && (
          <p className="mt-2 text-xs text-gray-400">
            Currently using default logo: /images/logo.png
          </p>
        )}
      </div>

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
          <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
        </div>

        <div className="mb-6">
          <label htmlFor="admin_notification_emails" className="block text-sm font-medium text-gray-700 mb-1">
            Admin Notification Emails
          </label>
          <input
            type="text"
            id="admin_notification_emails"
            name="admin_notification_emails"
            value={String(formData.admin_notification_emails || '')}
            onChange={handleChange}
            placeholder="hello@bessoranch.com, admin@bessoranch.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Comma-separated emails for order alerts and stock warnings. Falls back to Contact Email if empty.
          </p>
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-2">Quiet Hours</h3>
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

      {/* Instagram Integration */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-6">
          <Instagram className="h-5 w-5 text-forest-green" />
          <h2 className="text-lg font-semibold text-gray-900">Instagram Integration</h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Connect your Instagram Business account to display a photo gallery on the site. Posts are cached in the database for fast loading.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="instagram_user_id" className="block text-sm font-medium text-gray-700 mb-1">
                Instagram User ID
              </label>
              <input
                type="text"
                id="instagram_user_id"
                name="instagram_user_id"
                value={String(formData.instagram_user_id || '')}
                onChange={handleChange}
                placeholder="e.g. 17841400000000000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="instagram_profile_url" className="block text-sm font-medium text-gray-700 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                id="instagram_profile_url"
                name="instagram_profile_url"
                value={String(formData.instagram_profile_url || '')}
                onChange={handleChange}
                placeholder="https://instagram.com/bessoranch"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="facebook_profile_url" className="block text-sm font-medium text-gray-700 mb-1">
              Facebook Page URL
            </label>
            <input
              type="url"
              id="facebook_profile_url"
              name="facebook_profile_url"
              value={String(formData.facebook_profile_url || '')}
              onChange={handleChange}
              placeholder="https://facebook.com/bessoranch"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="instagram_access_token" className="block text-sm font-medium text-gray-700 mb-1">
              Access Token
            </label>
            <input
              type="password"
              id="instagram_access_token"
              name="instagram_access_token"
              value={String(formData.instagram_access_token || '')}
              onChange={handleChange}
              placeholder="Long-lived access token"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste a long-lived token from the Facebook Developer portal. It auto-refreshes via Vercel Cron.
            </p>
          </div>

          <div>
            <label htmlFor="gallery_posts_limit" className="block text-sm font-medium text-gray-700 mb-1">
              Posts Limit
            </label>
            <input
              type="number"
              id="gallery_posts_limit"
              name="gallery_posts_limit"
              value={Number(formData.gallery_posts_limit || 30)}
              onChange={handleChange}
              min="1"
              max="100"
              className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>

          {formData.instagram_last_sync && (
            <p className="text-sm text-gray-500">
              Last synced: {new Date(String(formData.instagram_last_sync)).toLocaleString()}
            </p>
          )}

          {instagramStatus && (
            <div className={`text-sm px-3 py-2 rounded-md ${instagramStatus.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {instagramStatus}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              disabled={syncing}
              onClick={async () => {
                setSyncing(true);
                setInstagramStatus('');
                try {
                  const res = await fetch('/api/admin/instagram/sync', { method: 'POST' });
                  const data = await res.json();
                  if (res.ok) {
                    setInstagramStatus(`Synced ${data.synced} posts successfully!`);
                    setFormData(prev => ({ ...prev, instagram_last_sync: new Date().toISOString() }));
                  } else {
                    setInstagramStatus(`Error: ${data.error}`);
                  }
                } catch {
                  setInstagramStatus('Error: Failed to connect');
                } finally {
                  setSyncing(false);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors disabled:opacity-50 text-sm"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>

            <button
              type="button"
              disabled={refreshingToken}
              onClick={async () => {
                setRefreshingToken(true);
                setInstagramStatus('');
                try {
                  const res = await fetch('/api/admin/instagram/refresh-token', { method: 'POST' });
                  const data = await res.json();
                  if (res.ok) {
                    setInstagramStatus(`Token refreshed! Expires: ${new Date(data.expiresAt).toLocaleDateString()}`);
                  } else {
                    setInstagramStatus(`Error: ${data.error}`);
                  }
                } catch {
                  setInstagramStatus('Error: Failed to refresh token');
                } finally {
                  setRefreshingToken(false);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
            >
              <RefreshCw className={`h-4 w-4 ${refreshingToken ? 'animate-spin' : ''}`} />
              {refreshingToken ? 'Refreshing...' : 'Refresh Token'}
            </button>
          </div>
        </div>
      </div>

      {/* Manage Gallery Posts */}
      {galleryPosts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-2">
            <Grid3X3 className="h-5 w-5 text-forest-green" />
            <h2 className="text-lg font-semibold text-gray-900">Manage Gallery Posts</h2>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Click a photo to hide or show it on the gallery page. Hidden posts are dimmed with an eye-slash icon.
          </p>

          <div className="flex gap-3 text-xs text-gray-500 mb-4">
            <span>{galleryPosts.filter(p => !p.hidden).length} visible</span>
            <span>&middot;</span>
            <span>{galleryPosts.filter(p => p.hidden).length} hidden</span>
          </div>

          {loadingPosts ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {galleryPosts.map(post => (
                <button
                  key={post.id}
                  type="button"
                  disabled={togglingPost === post.id}
                  onClick={() => togglePostVisibility(post.id, post.hidden)}
                  className={`relative aspect-square rounded-lg overflow-hidden group border-2 transition-all ${
                    post.hidden
                      ? 'opacity-40 border-red-300 hover:opacity-60'
                      : 'opacity-100 border-transparent hover:border-forest-green'
                  } ${togglingPost === post.id ? 'animate-pulse' : ''}`}
                  title={post.hidden ? 'Click to show on gallery' : 'Click to hide from gallery'}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.mediaType === 'VIDEO' ? (post.thumbnailUrl || post.mediaUrl) : post.mediaUrl}
                    alt={post.caption?.slice(0, 50) || 'Instagram post'}
                    className="w-full h-full object-cover"
                  />

                  {/* Hidden overlay icon */}
                  {post.hidden && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <EyeOff className="h-6 w-6 text-white drop-shadow-lg" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    {post.hidden ? (
                      <Eye className="h-6 w-6 text-white drop-shadow-lg" />
                    ) : (
                      <EyeOff className="h-6 w-6 text-white drop-shadow-lg" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
