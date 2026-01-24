'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  LogOut,
  Bird,
  ExternalLink,
} from 'lucide-react';

interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Animals', href: '/admin/animals', icon: Bird },
  { name: 'Blog Posts', href: '/admin/posts', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ admin }: { admin: AdminPayload }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-charcoal-800 text-white">
      <div className="p-6">
        <Link href="/admin" className="block">
          <h1 className="text-xl font-display text-soft-gold">Besso Ranch</h1>
          <p className="text-xs text-charcoal-400 mt-1">Admin Dashboard</p>
        </Link>
      </div>

      <nav className="mt-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-forest-green text-white'
                  : 'text-charcoal-300 hover:bg-charcoal-700 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-charcoal-700">
        <div className="mb-4">
          <p className="text-sm font-medium text-white">{admin.name}</p>
          <p className="text-xs text-charcoal-400">{admin.email}</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-xs text-charcoal-300 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-xs text-charcoal-300 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
