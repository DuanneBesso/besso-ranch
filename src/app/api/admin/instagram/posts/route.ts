import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const admin = await getAdminFromToken();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = await prisma.instagramPost.findMany({
      orderBy: { timestamp: 'desc' },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Fetch admin Instagram posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminFromToken();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, hidden } = await request.json();

    if (!id || typeof hidden !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: id (string), hidden (boolean)' },
        { status: 400 }
      );
    }

    const post = await prisma.instagramPost.update({
      where: { id },
      data: { hidden },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Toggle Instagram post visibility error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}
