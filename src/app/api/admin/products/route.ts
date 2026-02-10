import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }, { name: 'asc' }],
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Check for duplicate slug
    const existing = await prisma.product.findUnique({
      where: { slug: body.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        price: body.price,
        unit: body.unit,
        category: body.category,
        subcategory: body.subcategory || null,
        stockQuantity: body.stockQuantity || 0,
        lowStockThreshold: body.lowStockThreshold || 5,
        inStock: body.inStock ?? true,
        featured: body.featured ?? false,
        displayOrder: body.displayOrder || 0,
        preorderEnabled: body.preorderEnabled ?? false,
        preorderLimit: body.preorderLimit || 0,
        preorderCount: 0,
      },
    });

    // Log inventory creation
    await prisma.inventoryLog.create({
      data: {
        productId: product.id,
        changeType: 'set',
        quantity: product.stockQuantity,
        previousQty: 0,
        newQty: product.stockQuantity,
        source: 'admin',
        notes: `Product created by ${admin.name}`,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
