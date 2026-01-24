import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { Plus, Pencil } from 'lucide-react';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

export default async function ProductsPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const products = await prisma.product.findMany({
    orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }, { name: 'asc' }],
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your farm products and inventory.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </Link>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
            {category.replace('-', ' ')}
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products
                  .filter((p) => p.category === category)
                  .map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-gray-900">
                          ${product.price.toFixed(2)}/{product.unit}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-sm rounded-full ${
                            product.stockQuantity === 0
                              ? 'bg-red-100 text-red-700'
                              : product.stockQuantity <= product.lowStockThreshold
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-sm rounded-full ${
                            product.inStock
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-2 text-gray-600 hover:text-forest-green transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <DeleteProductButton productId={product.id} productName={product.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No products yet.</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
}
