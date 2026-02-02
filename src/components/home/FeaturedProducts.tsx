"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { EditableImage, EditableText } from "@/components/editing";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  unit: string;
  category: string;
  subcategory: string | null;
  inStock: boolean;
  images: string | null;
}

interface FeaturedProductsProps {
  products: Product[];
  settings?: Record<string, string>;
}

export default function FeaturedProducts({ products, settings = {} }: FeaturedProductsProps) {
  const sectionAccent = settings.featured_products_accent || "From Our Farm";
  const sectionTitle = settings.featured_products_title || "Featured Products";
  const sectionSubtitle = settings.featured_products_subtitle || "Fresh from the ranch to your table. All our products are raised with love using sustainable, organic practices.";

  return (
    <section className="section bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <EditableText
            value={sectionAccent}
            contentType="setting"
            contentId="featured_products_accent"
            contentField="value"
            as="p"
            className="font-accent text-soft-gold text-2xl mb-4"
          />
          <EditableText
            value={sectionTitle}
            contentType="setting"
            contentId="featured_products_title"
            contentField="value"
            as="h2"
            className="section-title"
          />
          <EditableText
            value={sectionSubtitle}
            contentType="setting"
            contentId="featured_products_subtitle"
            contentField="value"
            as="p"
            className="section-subtitle max-w-2xl mx-auto"
            multiline
            useModal
          />
        </motion.div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {products.map((product, index) => {
            const productImages = product.images ? JSON.parse(product.images) : [];
            const firstImage = productImages[0] || "/images/products/placeholder.jpg";

            return (
              <motion.div
                key={product.id}
                className="card group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-cream overflow-hidden">
                  <EditableImage
                    src={firstImage}
                    alt={product.name}
                    contentType="product"
                    contentId={product.id}
                    contentField="images[0]"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    containerClassName="absolute inset-0"
                  />

                  {/* Stock Badge */}
                  {!product.inStock && (
                    <div className="absolute top-3 left-3 badge-red z-10">
                      Out of Stock
                    </div>
                  )}

                  {/* Quick Add Button */}
                  {product.inStock && (
                    <motion.button
                      className="absolute bottom-3 right-3 w-10 h-10 bg-barn-red text-white rounded-full
                               flex items-center justify-center opacity-0 group-hover:opacity-100
                               transition-opacity shadow-lg z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <span className="text-xs text-charcoal-400 uppercase tracking-wider">
                    {product.category.replace('-', ' ')}
                  </span>
                  <h3 className="font-heading text-lg text-warm-brown mt-1 mb-2 group-hover:text-barn-red transition-colors">
                    <Link href={`/products/${product.category}/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-charcoal-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-warm-brown">
                      ${product.price.toFixed(2)}{" "}
                      <span className="text-sm font-normal text-charcoal-400">
                        / {product.unit}
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 text-barn-red hover:text-barn-red-600 font-semibold transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
