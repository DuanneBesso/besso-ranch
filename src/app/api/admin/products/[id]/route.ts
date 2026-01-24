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
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
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

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check for duplicate slug (excluding current product)
    const slugConflict = await prisma.product.findFirst({
      where: {
        slug: body.slug,
        id: { not: id },
      },
    });

    if (slugConflict) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
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
      },
    });

    // Log inventory change if quantity changed
    if (existing.stockQuantity !== product.stockQuantity) {
      await prisma.inventoryLog.create({
        data: {
          productId: product.id,
          changeType: 'manual_adjust',
          quantity: product.stockQuantity - existing.stockQuantity,
          previousQty: existing.stockQuantity,
          newQty: product.stockQuantity,
          source: 'admin',
          notes: `Inventory updated by ${admin.name}`,
        },
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
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

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if product has any order items
    const orderItems = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItems > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders. Mark it as out of stock instead.' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
