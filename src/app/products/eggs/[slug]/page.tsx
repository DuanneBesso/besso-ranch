import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import ProductDetail from "@/components/products/ProductDetail";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
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
      featured: true,
      images: true,
      specifications: true,
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Besso Ranch`,
    description: product.description || `${product.name} from Besso Ranch`,
  };
}

export default async function EggDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || product.category !== "eggs") {
    notFound();
  }

  return <ProductDetail product={product} />;
}
