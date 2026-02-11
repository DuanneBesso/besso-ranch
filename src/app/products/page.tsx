import prisma from "@/lib/db";
import ProductsPageClient from "./ProductsPageClient";

export const dynamic = 'force-dynamic';

async function getAllProducts() {
  return prisma.product.findMany({
    orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }, { name: 'asc' }],
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
      images: true,
    },
  });
}

async function getSettings() {
  const settings = await prisma.setting.findMany({
    where: { key: { startsWith: 'products_' } },
  });
  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
}

export const metadata = {
  title: 'Products',
  description: 'Farm fresh eggs, live poultry, and handcrafted goat milk products from Besso Ranch in Yucca Valley, CA.',
};

export default async function ProductsPage() {
  const [products, settings] = await Promise.all([
    getAllProducts(),
    getSettings(),
  ]);

  return <ProductsPageClient products={products} settings={settings} />;
}
