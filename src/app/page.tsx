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

async function getHeroSettings() {
  const settingKeys = [
    'hero_background_image',
    'hero_welcome_text',
    'hero_title',
    'hero_tagline',
    'hero_location',
    'hero_description',
  ];

  const settings = await prisma.setting.findMany({
    where: { key: { in: settingKeys } },
  });

  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
}

export default async function Home() {
  const [featuredProducts, heroSettings] = await Promise.all([
    getFeaturedProducts(),
    getHeroSettings(),
  ]);

  return (
    <>
      <Header />
      <main className="pt-0">
        <Hero settings={heroSettings} />
        <Introduction />
        <FeaturedProducts products={featuredProducts} />
        <MeetTheAnimals />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
