import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { fetchInstagramPosts } from '@/lib/instagram';

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
    // Read Instagram credentials from Settings
    const settings = await prisma.setting.findMany({
      where: {
        key: { in: ['instagram_access_token', 'instagram_user_id', 'gallery_posts_limit'] },
      },
    });

    const settingsMap = settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>);

    const accessToken = settingsMap.instagram_access_token;
    const userId = settingsMap.instagram_user_id;
    const limit = parseInt(settingsMap.gallery_posts_limit || '30', 10);

    if (!accessToken || !userId) {
      return NextResponse.json(
        { error: 'Instagram credentials not configured. Set User ID and Access Token in Settings.' },
        { status: 400 }
      );
    }

    // Fetch posts from Instagram API
    const posts = await fetchInstagramPosts(accessToken, userId, limit);

    // Upsert each post into the database
    let synced = 0;
    for (const post of posts) {
      await prisma.instagramPost.upsert({
        where: { id: post.id },
        update: {
          caption: post.caption || null,
          mediaType: post.media_type,
          mediaUrl: post.media_url,
          thumbnailUrl: post.thumbnail_url || null,
          permalink: post.permalink,
          timestamp: new Date(post.timestamp),
        },
        create: {
          id: post.id,
          caption: post.caption || null,
          mediaType: post.media_type,
          mediaUrl: post.media_url,
          thumbnailUrl: post.thumbnail_url || null,
          permalink: post.permalink,
          timestamp: new Date(post.timestamp),
        },
      });
      synced++;
    }

    // Update last sync timestamp
    await prisma.setting.upsert({
      where: { key: 'instagram_last_sync' },
      update: { value: new Date().toISOString() },
      create: { key: 'instagram_last_sync', value: new Date().toISOString(), type: 'string' },
    });

    return NextResponse.json({ success: true, synced });
  } catch (error) {
    console.error('Instagram sync error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync Instagram posts' },
      { status: 500 }
    );
  }
}
