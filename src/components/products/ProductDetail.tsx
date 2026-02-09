"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, Shield, Leaf } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  unit: string;
  category: string;
  subcategory: string | null;
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
  images: string | null;
  specifications: string | null;
}

interface ProductDetailProps {
  product: Product;
}

const categoryLabels: Record<string, string> = {
  eggs: "Eggs",
  poultry: "Live Poultry",
  "goat-milk": "Goat Milk Products",
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const productImages: string[] = product.images ? JSON.parse(product.images) : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const specs: Record<string, any> = product.specifications ? JSON.parse(product.specifications) : {};
  const categoryLabel = categoryLabels[product.category] || product.category;
  const isPoultry = product.category === "poultry";

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-cream border-b border-warm-brown/10">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-charcoal-400">
            <Link href="/products" className="hover:text-barn-red transition-colors">Products</Link>
            <span>/</span>
            <Link href={`/products/${product.category}`} className="hover:text-barn-red transition-colors">{categoryLabel}</Link>
            <span>/</span>
            <span className="text-warm-brown font-medium">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="section bg-white">
        <div className="container-custom">
          <Link
            href={`/products/${product.category}`}
            className="inline-flex items-center text-charcoal-400 hover:text-barn-red mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {categoryLabel}
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-square bg-sage/20 rounded-xl overflow-hidden relative">
                {productImages.length > 0 ? (
                  <img
                    src={productImages[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="text-warm-brown/40 font-heading text-xl">Photo Coming Soon</span>
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute top-4 left-4 badge-red text-base px-4 py-2">Out of Stock</div>
                )}
              </div>

              {/* Additional images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {productImages.slice(1, 5).map((img: string, i: number) => (
                    <div key={i} className="aspect-square bg-sage/20 rounded-lg overflow-hidden">
                      <img src={img} alt={`${product.name} ${i + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="mb-2">
                <span className="text-xs text-charcoal-400 uppercase tracking-wider">{categoryLabel}</span>
                {product.subcategory && (
                  <span className="text-xs text-charcoal-400 uppercase tracking-wider"> &middot; {product.subcategory}</span>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-4xl text-warm-brown mb-4">{product.name}</h1>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-barn-red">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-charcoal-400">/ {product.unit}</span>
              </div>

              {product.description && (
                <p className="text-charcoal-400 leading-relaxed mb-6">{product.description}</p>
              )}

              {/* Specifications */}
              {Object.keys(specs).length > 0 && (
                <div className="mb-6 space-y-3">
                  {specs.breed && (
                    <div className="flex gap-2">
                      <span className="text-sm font-medium text-warm-brown w-28">Breed:</span>
                      <span className="text-sm text-charcoal-400">{specs.breed as string}</span>
                    </div>
                  )}
                  {specs.age && (
                    <div className="flex gap-2">
                      <span className="text-sm font-medium text-warm-brown w-28">Age:</span>
                      <span className="text-sm text-charcoal-400">{specs.age as string}</span>
                    </div>
                  )}
                  {specs.purpose && (
                    <div className="flex gap-2">
                      <span className="text-sm font-medium text-warm-brown w-28">Purpose:</span>
                      <span className="text-sm text-charcoal-400">{specs.purpose as string}</span>
                    </div>
                  )}
                  {Array.isArray(specs.colors) && specs.colors.length > 0 && (
                    <div className="flex gap-2">
                      <span className="text-sm font-medium text-warm-brown w-28">Shell Colors:</span>
                      <div className="flex flex-wrap gap-1">
                        {(specs.colors as string[]).map((color: string) => (
                          <span key={color} className="text-xs bg-cream px-2 py-1 rounded">{color}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {Array.isArray(specs.ingredients) && specs.ingredients.length > 0 && (
                    <div className="flex gap-2">
                      <span className="text-sm font-medium text-warm-brown w-28">Ingredients:</span>
                      <span className="text-sm text-charcoal-400">{(specs.ingredients as string[]).join(", ")}</span>
                    </div>
                  )}
                  {Array.isArray(specs.benefits) && specs.benefits.length > 0 && (
                    <div className="flex gap-2 items-start">
                      <span className="text-sm font-medium text-warm-brown w-28">Benefits:</span>
                      <div className="flex flex-wrap gap-1">
                        {(specs.benefits as string[]).map((b: string) => (
                          <span key={b} className="text-xs bg-sage/20 text-forest-green px-2 py-1 rounded">{b}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Stock info */}
              <div className="mb-6">
                {product.inStock ? (
                  <span className="text-sm text-forest-green font-medium">
                    {product.stockQuantity <= 5 && product.stockQuantity > 0
                      ? `Only ${product.stockQuantity} left in stock`
                      : "In Stock"}
                  </span>
                ) : (
                  <span className="text-sm text-barn-red font-medium">Currently out of stock</span>
                )}
              </div>

              {/* Add to Cart / Inquire */}
              <div className="mb-8">
                {isPoultry ? (
                  product.inStock ? (
                    <Link href="/contact" className="btn-primary inline-block">
                      Inquire About This Bird
                    </Link>
                  ) : (
                    <button className="px-6 py-3 bg-charcoal-200 text-charcoal-400 rounded-lg cursor-not-allowed">
                      Not Currently Available
                    </button>
                  )
                ) : (
                  <AddToCartButton product={product} />
                )}
              </div>

              {/* Trust Badges */}
              <div className="border-t border-warm-brown/10 pt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-charcoal-400">
                  <Leaf className="w-4 h-4 text-forest-green" />
                  <span>Organic feed, no antibiotics or hormones</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-charcoal-400">
                  <Shield className="w-4 h-4 text-forest-green" />
                  <span>Raised with care using sustainable practices</span>
                </div>
                {!isPoultry && (
                  <div className="flex items-center gap-3 text-sm text-charcoal-400">
                    <Truck className="w-4 h-4 text-forest-green" />
                    <span>Local delivery within 25 miles of Yucca Valley</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
