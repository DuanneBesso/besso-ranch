import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { Plus, Pencil, Eye, Calendar, FileText, EyeOff } from 'lucide-react';
import DeletePostButton from '@/components/admin/DeletePostButton';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">Manage your farm journal and blog content.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-medium">Total Posts</span>
          </div>
          <p className="text-2xl font-bold">{posts.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <Eye className="h-4 w-4" />
            <span className="text-xs font-medium">Published</span>
          </div>
          <p className="text-2xl font-bold">{publishedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 text-yellow-600 mb-1">
            <EyeOff className="h-4 w-4" />
            <span className="text-xs font-medium">Drafts</span>
          </div>
          <p className="text-2xl font-bold">{draftCount}</p>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
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
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{post.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full capitalize">
                    {post.category.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      post.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {post.published && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-gray-600 hover:text-forest-green transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="p-2 text-gray-600 hover:text-forest-green transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeletePostButton postId={post.id} postTitle={post.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No blog posts yet.</p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-md hover:bg-forest-green-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Write Your First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
