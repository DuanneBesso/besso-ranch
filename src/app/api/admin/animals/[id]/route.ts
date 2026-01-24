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
  const animal = await prisma.animal.findUnique({
    where: { id },
  });

  if (!animal) {
    return NextResponse.json({ error: 'Animal not found' }, { status: 404 });
  }

  return NextResponse.json(animal);
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

    const existing = await prisma.animal.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Animal not found' }, { status: 404 });
    }

    const animal = await prisma.animal.update({
      where: { id },
      data: {
        name: body.name,
        type: body.type,
        breed: body.breed || null,
        description: body.description || null,
        gender: body.gender || null,
        status: body.status || 'Active',
        price: body.price || null,
        featured: body.featured ?? false,
        imageUrl: body.imageUrl || null,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
      },
    });

    return NextResponse.json(animal);
  } catch (error) {
    console.error('Update animal error:', error);
    return NextResponse.json(
      { error: 'Failed to update animal' },
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

    const existing = await prisma.animal.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Animal not found' }, { status: 404 });
    }

    await prisma.animal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete animal error:', error);
    return NextResponse.json(
      { error: 'Failed to delete animal' },
      { status: 500 }
    );
  }
}
