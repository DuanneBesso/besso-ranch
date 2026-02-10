import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { refreshInstagramToken } from '@/lib/instagram';

export async function POST(request: NextRequest) {
  // Auth: admin JWT cookie OR cron secret
  const secret = request.nextUrl.searchParams.get('secret');
  const isCron = secret && secret === process.env.CRON_SECRET;

  if (!isCron) {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const tokenSetting = await prisma.setting.findUnique({
      where: { key: 'instagram_access_token' },
    });

    if (!tokenSetting?.value) {
      return NextResponse.json(
        { error: 'No Instagram access token configured.' },
        { status: 400 }
      );
    }

    const { accessToken, expiresIn } = await refreshInstagramToken(tokenSetting.value);

    // Store the refreshed token
    await prisma.setting.update({
      where: { key: 'instagram_access_token' },
      data: { value: accessToken },
    });

    return NextResponse.json({
      success: true,
      expiresIn,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
