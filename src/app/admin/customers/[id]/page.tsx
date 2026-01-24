import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const totalSpent = customer.orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {customer.firstName} {customer.lastName}
        </h1>
        <p className="text-gray-600">Customer since {new Date(customer.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${customer.email}`} className="hover:text-forest-green">
                  {customer.email}
                </a>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${customer.phone}`} className="hover:text-forest-green">
                    {customer.phone}
                  </a>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{customer.address}</p>
                    <p>{customer.city}, {customer.state} {customer.zipCode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{customer.orders.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Order</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${customer.orders.length > 0 ? (totalSpent / customer.orders.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Order</p>
                <p className="text-sm font-medium text-gray-900">
                  {customer.orders.length > 0
                    ? new Date(customer.orders[0].createdAt).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
            </div>

            {customer.orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No orders yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {customer.orders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-gray-900 hover:text-forest-green"
                        >
                          {order.orderNumber}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}:{' '}
                      {order.items.map((item) => item.productName).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
