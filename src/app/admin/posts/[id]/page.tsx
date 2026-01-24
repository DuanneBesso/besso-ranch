import { redirect, notFound } from 'next/navigation';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import PostForm from '@/components/admin/PostForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
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
        <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
        <p className="text-gray-600">Update &quot;{post.title}&quot;</p>
      </div>

      <PostForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content,
          category: post.category,
          published: post.published,
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
        }}
      />
    </div>
  );
}
