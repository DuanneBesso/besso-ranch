import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 30;

    const posts = await prisma.instagramPost.findMany({
      where: { hidden: false },
      orderBy: { timestamp: 'desc' },
      take: Math.min(limit, 100),
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Fetch Instagram posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
