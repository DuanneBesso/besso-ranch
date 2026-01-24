import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check for duplicate slug (excluding current post)
    const slugConflict = await prisma.blogPost.findFirst({
      where: {
        slug: body.slug,
        id: { not: id },
      },
    });

    if (slugConflict) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }

    // Set publishedAt when first published
    const wasPublished = existing.published;
    const isNowPublished = body.published;
    const publishedAt = !wasPublished && isNowPublished
      ? new Date()
      : existing.publishedAt;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content,
        category: body.category,
        published: body.published ?? false,
        publishedAt,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
