import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  const where: Record<string, unknown> = {
    inStock: true,
  };

  if (category) {
    where.category = category;
  }

  if (featured === 'true') {
    where.featured = true;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      unit: true,
      category: true,
      subcategory: true,
      stockQuantity: true,
      inStock: true,
      featured: true,
      images: true,
    },
  });

  return NextResponse.json(products);
}
