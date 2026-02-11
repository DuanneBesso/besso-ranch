import prisma from "@/lib/db";
import GoatMilkPageClient from "./GoatMilkPageClient";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Goat Milk Products",
  description: "Handcrafted goat milk soaps, lotions, and lip balms from our Nigerian Dwarf goats at Besso Ranch in Yucca Valley, CA.",
};

async function getGoatMilkProducts() {
  return prisma.product.findMany({
    where: { category: "goat-milk" },
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

export default async function GoatMilkPage() {
  const products = await getGoatMilkProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Goat Milk Products', url: '/products/goat-milk' },
          ])),
        }}
      />
      <GoatMilkPageClient products={products} />
    </>
  );
}
