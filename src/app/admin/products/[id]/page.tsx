import { redirect, notFound } from 'next/navigation';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600">Update {product.name}.</p>
      </div>

      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          price: product.price,
          unit: product.unit,
          category: product.category,
          subcategory: product.subcategory || '',
          stockQuantity: product.stockQuantity,
          lowStockThreshold: product.lowStockThreshold,
          inStock: product.inStock,
          featured: product.featured,
          displayOrder: product.displayOrder,
          images: product.images || '',
          preorderEnabled: product.preorderEnabled,
          preorderLimit: product.preorderLimit,
          preorderCount: product.preorderCount,
        }}
      />
    </div>
  );
}
