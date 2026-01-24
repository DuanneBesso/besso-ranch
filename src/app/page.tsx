import { Header, Footer } from "@/components/layout";
import { Hero, Introduction, FeaturedProducts, MeetTheAnimals, Newsletter } from "@/components/home";
import prisma from "@/lib/db";

export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: {
      featured: true,
      inStock: true,
    },
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    take: 4,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      unit: true,
      category: true,
      subcategory: true,
      inStock: true,
      images: true,
    },
  });
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <Header />
      <main className="pt-0">
        <Hero />
        <Introduction />
        <FeaturedProducts products={featuredProducts} />
        <MeetTheAnimals />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
