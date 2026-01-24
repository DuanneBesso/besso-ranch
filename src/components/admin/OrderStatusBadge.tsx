const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  ready: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
        statusStyles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  );
}
