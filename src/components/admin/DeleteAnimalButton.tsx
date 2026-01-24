'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteAnimalButton({
  animalId,
  animalName,
}: {
  animalId: string;
  animalName: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove "${animalName}" from the ranch? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/animals/${animalId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      router.refresh();
    } catch {
      alert('Failed to delete animal. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
      title="Delete"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
