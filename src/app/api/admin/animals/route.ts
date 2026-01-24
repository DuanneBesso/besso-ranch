import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const animals = await prisma.animal.findMany({
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  });

  return NextResponse.json(animals);
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const animal = await prisma.animal.create({
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

    return NextResponse.json(animal, { status: 201 });
  } catch (error) {
    console.error('Create animal error:', error);
    return NextResponse.json(
      { error: 'Failed to create animal' },
      { status: 500 }
    );
  }
}
