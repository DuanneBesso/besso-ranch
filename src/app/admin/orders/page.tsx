import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';

export const dynamic = 'force-dynamic';

const statusFilters = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'ready', label: 'Ready' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const params = await searchParams;
  const statusFilter = params.status || 'all';

  const where = statusFilter !== 'all' ? { status: statusFilter } : {};

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const orderStats = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
  });

  const statsMap = orderStats.reduce((acc, stat) => {
    acc[stat.status] = stat._count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders and fulfillment.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-yellow-600 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Pending</span>
          </div>
          <p className="text-2xl font-bold">{statsMap['pending'] || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Paid</span>
          </div>
          <p className="text-2xl font-bold">{statsMap['paid'] || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Package className="h-4 w-4" />
            <span className="text-xs font-medium">Processing</span>
          </div>
          <p className="text-2xl font-bold">{statsMap['processing'] || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Truck className="h-4 w-4" />
            <span className="text-xs font-medium">Ready</span>
          </div>
          <p className="text-2xl font-bold">{statsMap['ready'] || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Delivered</span>
          </div>
          <p className="text-2xl font-bold">{statsMap['delivered'] || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <XCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Cancelled</span>
          </div>
          <p className="text-2xl font-bold">{statsMap['cancelled'] || 0}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === 'all' ? '/admin/orders' : `/admin/orders?status=${filter.value}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              statusFilter === filter.value
                ? 'bg-barn-red text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.deliveryMethod}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-gray-900">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.customerEmail}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">
                    {order.items.map((item) => item.productName).join(', ')}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm text-forest-green hover:text-forest-green-600"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
