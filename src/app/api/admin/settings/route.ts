import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await prisma.setting.findMany();

  // Convert to object
  const settingsObj = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  return NextResponse.json(settingsObj);
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Update each setting
    for (const [key, value] of Object.entries(body)) {
      const type = typeof value === 'number'
        ? 'number'
        : typeof value === 'boolean'
        ? 'boolean'
        : 'string';

      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value), type },
        create: { key, value: String(value), type },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
