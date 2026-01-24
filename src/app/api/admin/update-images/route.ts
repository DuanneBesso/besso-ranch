import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

const productImages: Record<string, string[]> = {
  'chicken-eggs': ['/images/products/chicken-eggs.jpg'],
  'duck-eggs': ['/images/animals/ducks.jpg'],
  'turkey-eggs': ['/images/animals/turkeys.jpg'],
  'goose-eggs': ['/images/animals/geese.jpg'],
  'rhode-island-red-hen': ['/images/animals/chickens.jpg'],
  'ameraucana-hen': ['/images/animals/chickens.jpg'],
  'bourbon-red-turkey': ['/images/animals/turkeys.jpg'],
  'goat-milk-soap-lavender': ['/images/products/soap-lavender.jpg'],
  'goat-milk-soap-oatmeal-honey': ['/images/products/soap-lavender.jpg'],
  'goat-milk-soap-unscented': ['/images/products/soap-lavender.jpg'],
  'goat-milk-lotion': ['/images/products/soap-lavender.jpg'],
  'goat-milk-lip-balm': ['/images/products/soap-lavender.jpg'],
};

const featuredProducts = ['chicken-eggs', 'duck-eggs', 'goat-milk-soap-lavender', 'goose-eggs'];

export async function POST() {
  try {
    // Update products with images and featured status
    for (const [slug, images] of Object.entries(productImages)) {
      const isFeatured = featuredProducts.includes(slug);
      const displayOrder = featuredProducts.indexOf(slug) + 1 || 99;

      await prisma.product.update({
        where: { slug },
        data: {
          images: JSON.stringify(images),
          featured: isFeatured,
          displayOrder: isFeatured ? displayOrder : 99,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Product images updated successfully',
      updated: Object.keys(productImages).length
    });
  } catch (error) {
    console.error('Error updating images:', error);
    return NextResponse.json({ success: false, error: 'Failed to update images' }, { status: 500 });
  }
}
