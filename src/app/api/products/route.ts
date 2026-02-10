import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  // Show products that are in stock OR have pre-orders enabled
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any[] = [{ inStock: true }, { preorderEnabled: true }];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    OR: filters,
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
      preorderEnabled: true,
      preorderLimit: true,
      preorderCount: true,
    },
  });

  return NextResponse.json(products);
}
