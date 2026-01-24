import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/auth';
import PostForm from '@/components/admin/PostForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewPostPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
        <p className="text-gray-600">Write a new post for the farm journal.</p>
      </div>

      <PostForm />
    </div>
  );
}
