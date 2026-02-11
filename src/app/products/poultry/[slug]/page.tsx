import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import ProductDetail from "@/components/products/ProductDetail";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

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
    title: product.name,
    description: product.description || `${product.name} from Besso Ranch`,
  };
}

export default async function PoultryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || product.category !== "poultry") {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Live Poultry', url: '/products/poultry' },
            { name: product.name, url: `/products/poultry/${product.slug}` },
          ])),
        }}
      />
      <ProductDetail product={product} />
    </>
  );
}
