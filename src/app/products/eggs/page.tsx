"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft } from "lucide-react";

const eggs = [
  {
    id: 1,
    name: "Farm Fresh Chicken Eggs",
    description: "Our free-range hens produce eggs with rich, golden yolks and superior flavor. Available in a beautiful variety of colors from brown to blue to green.",
    price: 8.00,
    unit: "dozen",
    inStock: true,
    stockQty: 24,
    colors: ["Brown", "White", "Blue", "Green"],
  },
  {
    id: 2,
    name: "Duck Eggs",
    description: "Larger than chicken eggs with a richer, creamier taste. Duck eggs are prized by bakers for creating fluffier baked goods and richer custards.",
    price: 12.00,
    unit: "half dozen",
    inStock: true,
    stockQty: 12,
    colors: ["White", "Blue-Green"],
  },
  {
    id: 3,
    name: "Turkey Eggs",
    description: "A rare treat! Turkey eggs are about 50% larger than chicken eggs with a creamier texture. Perfect for special breakfasts or baking.",
    price: 15.00,
    unit: "half dozen",
    inStock: false,
    stockQty: 0,
    colors: ["Speckled Brown"],
  },
  {
    id: 4,
    name: "Goose Eggs",
    description: "The largest eggs we offer! One goose egg equals about three chicken eggs. Seasonal availability - these are a true delicacy.",
    price: 8.00,
    unit: "each",
    inStock: true,
    stockQty: 6,
    colors: ["White"],
  },
];

export default function EggsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-soft-gold to-barn-red">
        <div className="container-custom">
          <Link href="/products" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Products
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-accent text-cream text-2xl mb-4">Farm Fresh</p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
              Eggs
            </h1>
            <p className="text-white/80 max-w-xl">
              From our happy, free-range birds to your table. Experience the difference
              that sustainable farming and proper nutrition makes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {eggs.map((product, index) => (
              <motion.div
                key={product.id}
                className="card overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="grid md:grid-cols-2">
                  {/* Image */}
                  <div className="aspect-square bg-sage/20 flex items-center justify-center relative">
                    <span className="text-warm-brown/40 font-heading">Photo</span>
                    {!product.inStock && (
                      <div className="absolute top-3 left-3 badge-red">Out of Stock</div>
                    )}
                    {product.inStock && product.stockQty <= 6 && (
                      <div className="absolute top-3 left-3 badge-gold">Only {product.stockQty} left</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6 flex flex-col">
                    <h2 className="font-heading text-xl text-warm-brown mb-2">{product.name}</h2>
                    <p className="text-charcoal-400 text-sm mb-4 flex-grow">{product.description}</p>

                    <div className="mb-4">
                      <span className="text-xs text-charcoal-400 uppercase">Shell Colors:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.colors.map(color => (
                          <span key={color} className="text-xs bg-white px-2 py-1 rounded">{color}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-warm-brown/10">
                      <span className="text-2xl font-bold text-warm-brown">
                        ${product.price.toFixed(2)}
                        <span className="text-sm font-normal text-charcoal-400"> / {product.unit}</span>
                      </span>
                      {product.inStock ? (
                        <motion.button
                          className="btn-primary flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </motion.button>
                      ) : (
                        <button className="px-4 py-2 bg-charcoal-200 text-charcoal-400 rounded-lg cursor-not-allowed">
                          Sold Out
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-8">Why Our Eggs Are Different</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              {[
                { title: "Free Range", desc: "Our birds roam freely, foraging for bugs and greens" },
                { title: "No Antibiotics", desc: "Raised naturally without medications" },
                { title: "Fresh Daily", desc: "Eggs collected and packaged the same day" },
              ].map((item) => (
                <div key={item.title} className="p-4">
                  <h3 className="font-heading text-warm-brown mb-2">{item.title}</h3>
                  <p className="text-charcoal-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
