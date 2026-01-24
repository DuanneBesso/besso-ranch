import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/auth';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewProductPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
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
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600">Create a new product for your store.</p>
      </div>

      <ProductForm />
    </div>
  );
}
