import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { ArrowLeft, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      customer: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order {order.orderNumber}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-gray-400">IMG</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      ${item.productPrice.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${item.total.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-900">${order.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Notes */}
          {order.deliveryNotes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Notes
              </h2>
              <p className="text-gray-600">{order.deliveryNotes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Update Status
            </h2>
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer</h2>
            <div className="space-y-3">
              <p className="font-medium text-gray-900">{order.customerName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${order.customerEmail}`} className="hover:text-forest-green">
                  {order.customerEmail}
                </a>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${order.customerPhone}`} className="hover:text-forest-green">
                    {order.customerPhone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {order.deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'}
            </h2>
            {order.deliveryMethod === 'pickup' ? (
              <p className="text-gray-600">Customer will pick up at the ranch</p>
            ) : (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{order.deliveryAddress}</p>
                  <p>
                    {order.deliveryCity}, {order.deliveryState} {order.deliveryZip}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
            <div className="space-y-2 text-sm">
              {order.stripePaymentId ? (
                <>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    <span>Paid via Stripe</span>
                  </div>
                  {order.paidAt && (
                    <p className="text-gray-500">
                      Paid on {new Date(order.paidAt).toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 font-mono">
                    {order.stripePaymentId}
                  </p>
                </>
              ) : (
                <p className="text-gray-600">Payment pending</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
