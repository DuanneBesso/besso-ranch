"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-brown/90 via-warm-brown/70 to-forest-green/80">
        {/* When you have actual images, replace this with Image component */}
        <div className="absolute inset-0 bg-[url('/images/hero-placeholder.jpg')] bg-cover bg-center opacity-40" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-soft-gold/20 rounded-full blur-xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-32 h-32 bg-sage/20 rounded-full blur-xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Handwritten Accent */}
          <motion.p
            className="font-accent text-soft-gold text-2xl md:text-3xl mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome to
          </motion.p>

          {/* Main Title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream mb-6">
            Besso Ranch
          </h1>

          {/* Tagline */}
          <p className="font-heading text-xl md:text-2xl text-cream/90 mb-4 max-w-2xl mx-auto">
            Regenerative Agriculture, Naturally
          </p>

          {/* Location */}
          <p className="text-cream/70 text-lg mb-8">
            Yucca Valley, California
          </p>

          {/* Description */}
          <p className="text-cream/80 max-w-xl mx-auto mb-10 leading-relaxed">
            Experience the difference of truly sustainable farming. Farm fresh eggs,
            live poultry, and handcrafted goat milk products from our family to yours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/products"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Shop Our Products</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/about/our-story"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold
                         border-2 border-cream/50 text-cream hover:bg-cream/10 transition-all duration-300"
              >
                <span>Our Story</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-cream/50 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-3 bg-cream/70 rounded-full mt-2"
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
