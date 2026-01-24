import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
  const [
    totalProducts,
    inStockProducts,
    lowStockProducts,
    totalOrders,
    pendingOrders,
    totalRevenue,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { inStock: true } }),
    prisma.product.count({
      where: {
        stockQuantity: { lte: prisma.product.fields.lowStockThreshold },
        inStock: true,
      },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
  ]);

  return {
    totalProducts,
    inStockProducts,
    lowStockProducts,
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders,
  };
}

async function getLowStockProducts() {
  return prisma.product.findMany({
    where: {
      stockQuantity: { lte: 5 },
      inStock: true,
    },
    take: 5,
    orderBy: { stockQuantity: 'asc' },
  });
}

export default async function AdminDashboard() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const stats = await getDashboardStats();
  const lowStockProducts = await getLowStockProducts();

  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/products',
    },
    {
      name: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-yellow-500',
      href: '/admin/orders?status=pending',
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      href: '/admin/orders',
    },
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      href: '/admin/orders',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {admin.name}</h1>
        <p className="text-gray-600">Here&apos;s what&apos;s happening at the ranch today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
            </div>
          </div>
          <div className="p-6">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-sm">All products are well stocked!</p>
            ) : (
              <ul className="space-y-4">
                {lowStockProducts.map((product) => (
                  <li key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.stockQuantity === 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {product.stockQuantity} left
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
          </div>
          <div className="p-6">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No orders yet.</p>
            ) : (
              <ul className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <li key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors"
          >
            Add New Product
          </Link>
          <Link
            href="/admin/posts/new"
            className="px-4 py-2 bg-barn-red text-white rounded-md hover:bg-barn-red-600 transition-colors"
          >
            Write Blog Post
          </Link>
          <Link
            href="/admin/animals/new"
            className="px-4 py-2 bg-soft-gold text-white rounded-md hover:bg-soft-gold-600 transition-colors"
          >
            Add Animal
          </Link>
        </div>
      </div>
    </div>
  );
}
