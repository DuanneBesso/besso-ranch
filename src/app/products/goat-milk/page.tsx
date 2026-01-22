"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Sparkles } from "lucide-react";

const products = [
  {
    id: 8,
    name: "Goat Milk Soap - Lavender",
    description: "Our bestseller! Gentle, moisturizing soap infused with calming lavender essential oil. Perfect for sensitive skin.",
    price: 8.00,
    unit: "bar (4 oz)",
    inStock: true,
    stockQty: 20,
    ingredients: ["Goat Milk", "Olive Oil", "Coconut Oil", "Lavender Essential Oil"],
    benefits: ["Moisturizing", "Calming", "Gentle"],
  },
  {
    id: 9,
    name: "Goat Milk Soap - Oatmeal Honey",
    description: "Gentle exfoliation meets deep moisturizing. Ground oatmeal and local honey make this bar perfect for dry skin.",
    price: 8.00,
    unit: "bar (4 oz)",
    inStock: true,
    stockQty: 15,
    ingredients: ["Goat Milk", "Olive Oil", "Oatmeal", "Local Honey"],
    benefits: ["Exfoliating", "Nourishing", "Soothing"],
  },
  {
    id: 10,
    name: "Goat Milk Soap - Unscented",
    description: "Pure and simple. Our unscented formula is perfect for those with fragrance sensitivities or for baby's delicate skin.",
    price: 8.00,
    unit: "bar (4 oz)",
    inStock: true,
    stockQty: 12,
    ingredients: ["Goat Milk", "Olive Oil", "Coconut Oil", "Shea Butter"],
    benefits: ["Hypoallergenic", "Pure", "Baby-safe"],
  },
  {
    id: 11,
    name: "Goat Milk Lotion",
    description: "Luxuriously creamy lotion that absorbs quickly without greasy residue. Your skin will drink it in!",
    price: 12.00,
    unit: "4 oz bottle",
    inStock: true,
    stockQty: 10,
    ingredients: ["Goat Milk", "Shea Butter", "Jojoba Oil", "Vitamin E"],
    benefits: ["Deep Moisturizing", "Fast Absorbing", "All-Day Hydration"],
  },
  {
    id: 12,
    name: "Goat Milk Lip Balm",
    description: "Keep your lips soft and protected with our nourishing lip balm. Lightly flavored with natural vanilla.",
    price: 4.00,
    unit: "tube",
    inStock: true,
    stockQty: 30,
    ingredients: ["Goat Milk", "Beeswax", "Coconut Oil", "Vanilla"],
    benefits: ["Moisturizing", "Protective", "Natural"],
  },
];

export default function GoatMilkPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-sage to-forest-green">
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
            <p className="font-accent text-cream text-2xl mb-4">Handcrafted with Love</p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
              Goat Milk Products
            </h1>
            <p className="text-white/80 max-w-xl">
              Made from fresh milk from our Nigerian Dwarf goats. Each product is
              handcrafted in small batches using time-honored methods.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="bg-cream py-6">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              "Rich in Vitamins A, D & E",
              "Natural Lactic Acid",
              "Gentle pH Balance",
              "Deeply Moisturizing",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-soft-gold" />
                <span className="text-warm-brown font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Image */}
                <div className="aspect-square bg-sage/20 flex items-center justify-center relative">
                  <span className="text-warm-brown/40 font-heading">Photo</span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h2 className="font-heading text-lg text-warm-brown mb-2">{product.name}</h2>
                  <p className="text-charcoal-400 text-sm mb-4">{product.description}</p>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.benefits.map(benefit => (
                      <span key={benefit} className="text-xs bg-sage/20 text-forest-green px-2 py-1 rounded">
                        {benefit}
                      </span>
                    ))}
                  </div>

                  {/* Ingredients */}
                  <div className="text-xs text-charcoal-400 mb-4">
                    <strong>Key Ingredients:</strong> {product.ingredients.join(", ")}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-warm-brown/10">
                    <span className="text-xl font-bold text-warm-brown">
                      ${product.price.toFixed(2)}
                      <span className="text-sm font-normal text-charcoal-400"> / {product.unit}</span>
                    </span>
                    <motion.button
                      className="p-2 bg-barn-red text-white rounded-lg hover:bg-barn-red-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Goat Milk Section */}
      <section className="section bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title mb-8">Why Goat Milk?</h2>
            <p className="text-charcoal-400 leading-relaxed mb-8">
              Goat milk has been used for skincare for thousands of years, and for good reason.
              It&apos;s naturally rich in vitamins, minerals, and fatty acids that nourish and protect your skin.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { title: "Gentle & Nourishing", desc: "The proteins in goat milk are smaller and easier for skin to absorb" },
                { title: "Natural Exfoliation", desc: "Lactic acid gently removes dead skin cells" },
                { title: "pH Balanced", desc: "Similar to human skin's natural pH level" },
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-xl">
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
