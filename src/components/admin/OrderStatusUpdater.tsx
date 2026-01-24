'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const statuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'ready', label: 'Ready for Pickup/Delivery' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    if (status === currentStatus) return;

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        disabled={saving || status === currentStatus}
        className="w-full px-4 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Updating...' : 'Update Status'}
      </button>
    </div>
  );
}
