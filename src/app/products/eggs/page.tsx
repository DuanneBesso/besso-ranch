import prisma from "@/lib/db";
import EggsPageClient from "./EggsPageClient";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Farm Fresh Eggs | Besso Ranch",
  description: "Farm fresh chicken, duck, turkey, and goose eggs from free-range birds at Besso Ranch in Yucca Valley, CA.",
};

async function getEggs() {
  return prisma.product.findMany({
    where: { category: "eggs" },
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

export default async function EggsPage() {
  const products = await getEggs();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Farm Fresh Eggs', url: '/products/eggs' },
          ])),
        }}
      />
      <EggsPageClient products={products} />
    </>
  );
}
