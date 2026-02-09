import prisma from "@/lib/db";
import PoultryPageClient from "./PoultryPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Live Poultry | Besso Ranch",
  description: "Healthy, well-socialized chickens, ducks, turkeys, and geese available for local pickup at Besso Ranch in Yucca Valley, CA.",
};

async function getPoultry() {
  return prisma.product.findMany({
    where: { category: "poultry" },
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

export default async function PoultryPage() {
  const products = await getPoultry();
  return <PoultryPageClient products={products} />;
}
