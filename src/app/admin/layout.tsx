import { getAdminFromToken } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Dashboard | Besso Ranch',
  robots: 'noindex, nofollow',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminFromToken();

  // Allow login page without auth
  return (
    <div className="min-h-screen bg-gray-100">
      {admin ? (
        <div className="flex">
          <AdminSidebar admin={admin} />
          <main className="flex-1 ml-64">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
