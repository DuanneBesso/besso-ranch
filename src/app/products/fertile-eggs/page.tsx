import prisma from "@/lib/db";
import FertileEggsPageClient from "./FertileEggsPageClient";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Fertile Hatching Eggs",
  description: "Fertile hatching eggs from heritage and specialty breeds at Besso Ranch in Yucca Valley, CA. Hatch your own flock from our healthy, free-range birds.",
};

async function getFertileEggs() {
  return prisma.product.findMany({
    where: { category: "fertile-eggs" },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
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
      specifications: true,
    },
  });
}

export default async function FertileEggsPage() {
  const products = await getFertileEggs();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Fertile Hatching Eggs', url: '/products/fertile-eggs' },
          ])),
        }}
      />
      <FertileEggsPageClient products={products} />
    </>
  );
}
