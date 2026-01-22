"use client";

import { motion } from "framer-motion";
import { Leaf, Heart, Recycle } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Sustainable",
    description: "Closed-loop systems that nurture the land for future generations.",
  },
  {
    icon: Heart,
    title: "Quality",
    description: "Organic, all-natural products you can feel good about.",
  },
  {
    icon: Recycle,
    title: "Regenerative",
    description: "Farming practices that heal the earth while feeding our community.",
  },
];

export default function Introduction() {
  return (
    <section className="section bg-cream">
      <div className="container-custom">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-accent text-soft-gold text-2xl mb-4">Our Mission</p>
          <h2 className="section-title">Welcome to Besso Ranch</h2>
          <p className="text-charcoal-400 text-lg leading-relaxed">
            To achieve a self-sustaining, organic, all-natural solution to everyday living
            and provide products and services to the community through regenerative
            agriculture and animal husbandry practices.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="text-center p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <motion.div
                className="w-16 h-16 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <value.icon className="w-8 h-8 text-forest-green" />
              </motion.div>
              <h3 className="font-heading text-xl text-warm-brown mb-3">{value.title}</h3>
              <p className="text-charcoal-400">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
