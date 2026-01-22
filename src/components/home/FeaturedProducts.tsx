"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";

// Placeholder products - will be replaced with data from CMS/API
const products = [
  {
    id: 1,
    name: "Farm Fresh Chicken Eggs",
    description: "Free-range, pasture-raised chicken eggs from happy hens",
    price: 8.00,
    unit: "dozen",
    image: "/images/products/chicken-eggs.jpg",
    category: "eggs",
    inStock: true,
  },
  {
    id: 2,
    name: "Duck Eggs",
    description: "Rich, creamy duck eggs perfect for baking",
    price: 12.00,
    unit: "half dozen",
    image: "/images/products/duck-eggs.jpg",
    category: "eggs",
    inStock: true,
  },
  {
    id: 3,
    name: "Goat Milk Soap - Lavender",
    description: "Handcrafted soap with soothing lavender essential oil",
    price: 8.00,
    unit: "bar",
    image: "/images/products/soap-lavender.jpg",
    category: "goat-milk",
    inStock: true,
  },
  {
    id: 4,
    name: "Turkey Eggs",
    description: "Large, nutrient-rich eggs from heritage turkeys",
    price: 15.00,
    unit: "half dozen",
    image: "/images/products/turkey-eggs.jpg",
    category: "eggs",
    inStock: false,
  },
];

export default function FeaturedProducts() {
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
          <p className="font-accent text-soft-gold text-2xl mb-4">From Our Farm</p>
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Fresh from the ranch to your table. All our products are raised with love
            using sustainable, organic practices.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {products.map((product, index) => (
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
                {/* Placeholder - replace with actual Image component */}
                <div className="absolute inset-0 bg-gradient-to-br from-sage/30 to-warm-brown/20 flex items-center justify-center">
                  <span className="text-warm-brown/50 font-heading text-sm">Product Image</span>
                </div>

                {/* Stock Badge */}
                {!product.inStock && (
                  <div className="absolute top-3 left-3 badge-red">
                    Out of Stock
                  </div>
                )}

                {/* Quick Add Button */}
                {product.inStock && (
                  <motion.button
                    className="absolute bottom-3 right-3 w-10 h-10 bg-barn-red text-white rounded-full
                             flex items-center justify-center opacity-0 group-hover:opacity-100
                             transition-opacity shadow-lg"
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
                  {product.category}
                </span>
                <h3 className="font-heading text-lg text-warm-brown mt-1 mb-2 group-hover:text-barn-red transition-colors">
                  <Link href={`/products/${product.category}/${product.id}`}>
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
          ))}
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
