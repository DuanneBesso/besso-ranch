"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Grid, List } from "lucide-react";
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
  images?: string | null;
  preorderEnabled?: boolean;
  preorderLimit?: number;
  preorderCount?: number;
}

const categories = [
  { id: "all", name: "All Products" },
  { id: "eggs", name: "Eggs" },
  { id: "poultry", name: "Live Poultry" },
  { id: "goat-milk", name: "Goat Milk Products" },
];

export default function ProductsGrid({ products }: { products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <>
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
        {filteredProducts.map((product, index) => (
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
              {product.images ? (
                <img
                  src={JSON.parse(product.images)[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-warm-brown/40 font-heading text-sm">Photo</span>
                </div>
              )}

              {/* Stock Badge */}
              {!product.inStock && product.preorderEnabled && ((product.preorderLimit || 0) - (product.preorderCount || 0)) > 0 ? (
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Pre-Order
                </div>
              ) : !product.inStock ? (
                <div className="absolute top-3 left-3 badge-red">
                  Out of Stock
                </div>
              ) : null}
              {product.inStock && product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                <div className="absolute top-3 left-3 badge-gold">
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
                    {product.name}
                  </Link>
                </h3>
                <p className="text-sm text-charcoal-400 line-clamp-2 mb-3">
                  {product.description}
                </p>
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
        ))}
      </div>
    </>
  );
}
