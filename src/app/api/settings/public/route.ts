import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Public settings that are safe to expose (no auth required)
const PUBLIC_SETTING_KEYS = [
  'site_logo',
  'site_name',
  'site_tagline',
  'pickup_scheduling_url',
  'tour_scheduling_url',
];

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: { in: PUBLIC_SETTING_KEYS },
      },
    });

    const settingsObj = settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsObj, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch {
    return NextResponse.json({});
  }
}
