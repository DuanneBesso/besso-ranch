"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const animals = [
  {
    name: "Chickens",
    description: "Our free-range hens provide delicious eggs daily",
    image: "/images/animals/chickens.jpg",
    href: "/about/animals#chickens",
  },
  {
    name: "Ducks",
    description: "Friendly ducks with rich, flavorful eggs",
    image: "/images/animals/ducks.jpg",
    href: "/about/animals#ducks",
  },
  {
    name: "Turkeys",
    description: "Heritage breed turkeys raised naturally",
    image: "/images/animals/turkeys.jpg",
    href: "/about/animals#turkeys",
  },
  {
    name: "Geese",
    description: "Majestic geese with prized eggs",
    image: "/images/animals/geese.jpg",
    href: "/about/animals#geese",
  },
  {
    name: "Goats",
    description: "Friendly goats providing milk for our products",
    image: "/images/animals/goats.jpg",
    href: "/about/animals#goats",
  },
];

export default function MeetTheAnimals() {
  return (
    <section className="section bg-cream">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-accent text-soft-gold text-2xl mb-4">The Heart of Our Ranch</p>
          <h2 className="section-title">Meet the Animals</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Our animals are raised with care, love, and respect. Each one plays a vital role
            in our regenerative farming system.
          </p>
        </motion.div>

        {/* Animals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {animals.map((animal, index) => (
            <motion.div
              key={animal.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={animal.href} className="block group">
                <motion.div
                  className="relative aspect-square rounded-2xl overflow-hidden bg-warm-brown/10"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Placeholder - replace with actual Image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-forest-green/20 to-warm-brown/30 flex items-center justify-center">
                    <span className="text-warm-brown/50 font-heading text-sm">Photo</span>
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-warm-brown/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-cream font-heading text-lg">Meet Them</span>
                  </div>
                </motion.div>

                <div className="mt-3 text-center">
                  <h3 className="font-heading text-warm-brown group-hover:text-barn-red transition-colors">
                    {animal.name}
                  </h3>
                  <p className="text-xs text-charcoal-400 mt-1 hidden md:block">
                    {animal.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Link to full animals page */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            href="/about/animals"
            className="btn-outline"
          >
            Learn About Our Animals
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
