import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { Eye, Mail, Phone, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        select: {
          id: true,
          total: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">View and manage your customer base.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Total Customers</p>
          <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">With Orders</p>
          <p className="text-3xl font-bold text-gray-900">
            {customers.filter((c) => c.orders.length > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">
            ${customers
              .reduce((sum, c) => sum + c.orders.reduce((s, o) => s + o.total, 0), 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => {
              const totalSpent = customer.orders.reduce((sum, o) => sum + o.total, 0);

              return (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${customer.email}`} className="hover:text-forest-green">
                          {customer.email}
                        </a>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <a href={`tel:${customer.phone}`} className="hover:text-forest-green">
                            {customer.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {customer.city && customer.state ? (
                      <span>{customer.city}, {customer.state}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{customer.orders.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    ${totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm text-forest-green hover:text-forest-green-600"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {customers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No customers yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
