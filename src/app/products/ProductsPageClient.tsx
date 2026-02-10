"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Grid, List } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
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
  stockQuantity: number;
  inStock: boolean;
  images?: string | null;
}

interface ProductsPageClientProps {
  products: Product[];
  settings: Record<string, string>;
}

const categories = [
  { id: "all", name: "All Products" },
  { id: "eggs", name: "Eggs" },
  { id: "fertile-eggs", name: "Fertile Hatching Eggs" },
  { id: "poultry", name: "Live Poultry" },
  { id: "goat-milk", name: "Goat Milk Products" },
];

export default function ProductsPageClient({ products, settings }: ProductsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const heroTitle = settings.products_hero_title || "Our Products";
  const heroSubtitle = settings.products_hero_subtitle || "Farm fresh eggs, live poultry, and handcrafted goat milk products. All raised with care using sustainable practices.";
  const heroAccent = settings.products_hero_accent || "From Our Farm";

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${settings.products_hero_image || '/images/hero-products.jpg'})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-warm-brown/90 via-warm-brown/75 to-forest-green/80" />
        <div className="container-custom text-center relative z-10">
          <div>
            <EditableText
              value={heroAccent}
              contentType="setting"
              contentId="products_hero_accent"
              contentField="value"
              as="p"
              className="font-accent text-soft-gold text-2xl mb-4"
            />
            <EditableText
              value={heroTitle}
              contentType="setting"
              contentId="products_hero_title"
              contentField="value"
              as="h1"
              className="font-display text-4xl md:text-5xl text-cream mb-4"
            />
            <EditableText
              value={heroSubtitle}
              contentType="setting"
              contentId="products_hero_subtitle"
              contentField="value"
              as="p"
              className="text-cream/80 max-w-xl mx-auto"
              multiline
              useModal
            />
          </div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="section bg-cream">
        <div className="container-custom">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "bg-barn-red text-white"
                      : "bg-white text-charcoal hover:bg-barn-red/10"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-barn-red text-white" : "bg-white text-charcoal"}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-barn-red text-white" : "bg-white text-charcoal"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-charcoal-400 mb-6">
            Showing {filteredProducts.length} products
          </p>

          {/* Products Grid */}
          <div className={viewMode === "grid"
            ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredProducts.map((product, index) => {
              const productImages = product.images ? JSON.parse(product.images) : [];
              const firstImage = productImages[0] || "/images/products/placeholder.jpg";

              return (
                <motion.div
                  key={product.id}
                  className={viewMode === "grid" ? "card group" : "card group flex"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  {/* Product Image */}
                  <div className={`relative bg-sage/20 overflow-hidden ${
                    viewMode === "grid" ? "aspect-square" : "w-32 h-32 flex-shrink-0"
                  }`}>
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
                    {product.inStock && product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                      <div className="absolute top-3 left-3 badge-gold z-10">
                        Only {product.stockQuantity} left
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className={viewMode === "grid" ? "p-4" : "p-4 flex-1 flex flex-col justify-between"}>
                    <div>
                      <span className="text-xs text-charcoal-400 uppercase tracking-wider">
                        {product.category.replace('-', ' ')}
                      </span>
                      <h3 className="font-heading text-lg text-warm-brown mt-1 mb-2 group-hover:text-barn-red transition-colors">
                        <Link href={`/products/${product.category}/${product.slug}`}>
                          <EditableText
                            value={product.name}
                            contentType="product"
                            contentId={product.id}
                            contentField="name"
                            as="span"
                            className=""
                          />
                        </Link>
                      </h3>
                      <EditableText
                        value={product.description || ""}
                        contentType="product"
                        contentId={product.id}
                        contentField="description"
                        as="p"
                        className="text-sm text-charcoal-400 line-clamp-2 mb-3"
                        multiline
                        useModal
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-warm-brown">
                        ${product.price.toFixed(2)}
                        <span className="text-sm font-normal text-charcoal-400"> / {product.unit}</span>
                      </span>
                      <AddToCartButton
                        product={product}
                        className="!p-2 !px-3"
                        showIcon={false}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
