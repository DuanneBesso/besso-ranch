import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import SettingsForm from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const settingsRaw = await prisma.setting.findMany();

  // Convert to object for easier use
  const settings = settingsRaw.reduce((acc, s) => {
    let value: string | number | boolean = s.value;
    if (s.type === 'number') {
      value = parseFloat(s.value);
    } else if (s.type === 'boolean') {
      value = s.value === 'true';
    }
    acc[s.key] = value;
    return acc;
  }, {} as Record<string, string | number | boolean>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your website and business settings.</p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
