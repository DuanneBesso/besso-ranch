import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Hero, Introduction, FeaturedProducts, MeetTheAnimals, Newsletter } from "@/components/home";
import prisma from "@/lib/db";
import { localBusinessJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Besso Ranch | Farm Fresh Eggs, Live Poultry & Goat Milk Products — Yucca Valley, CA",
  description: "Sustainable family farm in Yucca Valley, California. Shop farm fresh eggs, live poultry, fertile hatching eggs, and handmade goat milk products. No corn, no soy, no antibiotics.",
};

export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: {
      featured: true,
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

async function getHomeSettings() {
  // Get all settings for homepage sections
  const settings = await prisma.setting.findMany({
    where: {
      OR: [
        { key: { startsWith: 'hero_' } },
        { key: { startsWith: 'animal_' } },
        { key: { startsWith: 'animals_section_' } },
        { key: { startsWith: 'featured_products_' } },
        { key: { startsWith: 'introduction_' } },
      ],
    },
  });

  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
}

export default async function Home() {
  const [featuredProducts, homeSettings] = await Promise.all([
    getFeaturedProducts(),
    getHomeSettings(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />
      <Header />
      <main className="pt-0">
        <Hero settings={homeSettings} />
        <Introduction />
        <FeaturedProducts products={featuredProducts} settings={homeSettings} />
        <MeetTheAnimals settings={homeSettings} />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
