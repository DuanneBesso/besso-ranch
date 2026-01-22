"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Grid, List } from "lucide-react";

// Mock data - will be replaced with Sanity data
const allProducts = [
  // Eggs
  { id: 1, name: "Farm Fresh Chicken Eggs", description: "Free-range, pasture-raised eggs from happy hens", price: 8.00, unit: "dozen", category: "eggs", subcategory: "chicken", inStock: true, stockQty: 24 },
  { id: 2, name: "Duck Eggs", description: "Rich, creamy eggs perfect for baking", price: 12.00, unit: "half dozen", category: "eggs", subcategory: "duck", inStock: true, stockQty: 12 },
  { id: 3, name: "Turkey Eggs", description: "Large, nutrient-rich heritage turkey eggs", price: 15.00, unit: "half dozen", category: "eggs", subcategory: "turkey", inStock: false, stockQty: 0 },
  { id: 4, name: "Goose Eggs", description: "Seasonal delicacy, rich and flavorful", price: 8.00, unit: "each", category: "eggs", subcategory: "goose", inStock: true, stockQty: 6 },
  // Poultry
  { id: 5, name: "Laying Hen - Rhode Island Red", description: "Excellent layer, friendly disposition", price: 35.00, unit: "each", category: "poultry", subcategory: "chicken", inStock: true, stockQty: 5 },
  { id: 6, name: "Heritage Turkey - Bourbon Red", description: "Beautiful heritage breed for breeding or meat", price: 75.00, unit: "each", category: "poultry", subcategory: "turkey", inStock: true, stockQty: 3 },
  { id: 7, name: "Khaki Campbell Duckling", description: "Prolific egg layers, great foragers", price: 15.00, unit: "each", category: "poultry", subcategory: "duck", inStock: false, stockQty: 0 },
  // Goat Milk Products
  { id: 8, name: "Goat Milk Soap - Lavender", description: "Soothing lavender essential oil blend", price: 8.00, unit: "bar", category: "goat-milk", subcategory: "soap", inStock: true, stockQty: 20 },
  { id: 9, name: "Goat Milk Soap - Oatmeal Honey", description: "Gentle exfoliation with natural oats", price: 8.00, unit: "bar", category: "goat-milk", subcategory: "soap", inStock: true, stockQty: 15 },
  { id: 10, name: "Goat Milk Lotion", description: "Deeply moisturizing, all-natural formula", price: 12.00, unit: "4 oz", category: "goat-milk", subcategory: "lotion", inStock: true, stockQty: 10 },
  { id: 11, name: "Goat Milk Lip Balm", description: "Nourishing lip care, lightly flavored", price: 4.00, unit: "tube", category: "goat-milk", subcategory: "lip-balm", inStock: true, stockQty: 30 },
];

const categories = [
  { id: "all", name: "All Products" },
  { id: "eggs", name: "Eggs" },
  { id: "poultry", name: "Live Poultry" },
  { id: "goat-milk", name: "Goat Milk Products" },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = selectedCategory === "all"
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-warm-brown">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-accent text-soft-gold text-2xl mb-4">From Our Farm</p>
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
              Our Products
            </h1>
            <p className="text-cream/80 max-w-xl mx-auto">
              Farm fresh eggs, live poultry, and handcrafted goat milk products.
              All raised with care using sustainable practices.
            </p>
          </motion.div>
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
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className={viewMode === "grid" ? "card group" : "card group flex"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {/* Product Image */}
                <div className={`bg-sage/20 flex items-center justify-center ${
                  viewMode === "grid" ? "aspect-square" : "w-32 h-32 flex-shrink-0"
                }`}>
                  <span className="text-warm-brown/40 font-heading text-sm">Photo</span>

                  {/* Stock Badge */}
                  {!product.inStock && (
                    <div className="absolute top-3 left-3 badge-red">
                      Out of Stock
                    </div>
                  )}
                  {product.inStock && product.stockQty <= 5 && (
                    <div className="absolute top-3 left-3 badge-gold">
                      Only {product.stockQty} left
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className={viewMode === "grid" ? "p-4" : "p-4 flex-1 flex flex-col justify-between"}>
                  <div>
                    <span className="text-xs text-charcoal-400 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="font-heading text-lg text-warm-brown mt-1 mb-2 group-hover:text-barn-red transition-colors">
                      <Link href={`/products/${product.category}/${product.id}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-charcoal-400 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-warm-brown">
                      ${product.price.toFixed(2)}
                      <span className="text-sm font-normal text-charcoal-400"> / {product.unit}</span>
                    </span>
                    {product.inStock && (
                      <motion.button
                        className="p-2 bg-barn-red text-white rounded-lg hover:bg-barn-red-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
