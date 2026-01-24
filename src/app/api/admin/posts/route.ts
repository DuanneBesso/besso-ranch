import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Check for duplicate slug
    const existing = await prisma.blogPost.findUnique({
      where: { slug: body.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content,
        category: body.category,
        published: body.published ?? false,
        publishedAt: body.published ? new Date() : null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
