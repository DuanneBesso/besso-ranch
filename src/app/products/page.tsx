import { ProductsGrid } from "@/components/products";
import prisma from "@/lib/db";

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
    },
  });
}

export const metadata = {
  title: 'Products | Besso Ranch',
  description: 'Farm fresh eggs, live poultry, and handcrafted goat milk products from Besso Ranch in Yucca Valley, CA.',
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-warm-brown">
        <div className="container-custom text-center">
          <div>
            <p className="font-accent text-soft-gold text-2xl mb-4">From Our Farm</p>
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
              Our Products
            </h1>
            <p className="text-cream/80 max-w-xl mx-auto">
              Farm fresh eggs, live poultry, and handcrafted goat milk products.
              All raised with care using sustainable practices.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="section bg-cream">
        <div className="container-custom">
          <ProductsGrid products={products} />
        </div>
      </section>
    </>
  );
}
