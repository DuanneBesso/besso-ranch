"use client";

import { motion } from "framer-motion";
import { Heart, Sprout, Sun, Users } from "lucide-react";

const timeline = [
  {
    year: "2020",
    title: "The Dream Begins",
    description: "Our family started with a vision of sustainable living and a small flock of chickens in our backyard.",
  },
  {
    year: "2021",
    title: "Growing the Flock",
    description: "We expanded to include ducks, turkeys, and geese, learning the art of poultry husbandry.",
  },
  {
    year: "2022",
    title: "Welcome the Goats",
    description: "Our Nigerian Dwarf goats joined the family, opening doors to dairy products.",
  },
  {
    year: "2023",
    title: "Besso Ranch is Born",
    description: "We officially launched Besso Ranch, sharing our products with the local community.",
  },
  {
    year: "2024",
    title: "Expanding Horizons",
    description: "Introduced goat milk soaps, lotions, and expanded our egg varieties.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Passion",
    description: "Every animal is treated with love and respect.",
  },
  {
    icon: Sprout,
    title: "Sustainability",
    description: "We prioritize practices that heal the land.",
  },
  {
    icon: Sun,
    title: "Transparency",
    description: "Know exactly where your food comes from.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building connections through quality products.",
  },
];

export default function OurStoryPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-warm-brown to-warm-brown-700">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-accent text-soft-gold text-2xl mb-4">The Besso Family</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream mb-6">
              Our Story
            </h1>
            <p className="text-cream/80 max-w-2xl mx-auto text-lg">
              From a small backyard dream to a thriving sustainable farm,
              this is the journey of Besso Ranch.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section bg-cream">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title mb-8">Our Mission</h2>
            <blockquote className="text-xl md:text-2xl text-charcoal italic font-heading leading-relaxed">
              &ldquo;To achieve a self-sustaining, organic, all-natural solution to everyday
              living and provide products and services to the community through regenerative
              agriculture and animal husbandry practices.&rdquo;
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-barn-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-barn-red" />
                </div>
                <h3 className="font-heading text-xl text-warm-brown mb-2">{value.title}</h3>
                <p className="text-charcoal-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-cream">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className="flex gap-6 mb-8 last:mb-0"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-barn-red text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.year}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-barn-red/20 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-heading text-xl text-warm-brown mb-2">{item.title}</h3>
                  <p className="text-charcoal-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Family Photo Section */}
      <section className="section bg-forest-green">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-accent text-soft-gold text-2xl mb-4">The Family</p>
              <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
                Meet the Bessos
              </h2>
              <p className="text-cream/80 leading-relaxed mb-4">
                We&apos;re a family passionate about sustainable living, animal welfare,
                and providing our community with the highest quality natural products.
              </p>
              <p className="text-cream/80 leading-relaxed">
                Every day on the ranch brings new adventures and learning opportunities.
                We&apos;re grateful to share this journey with you.
              </p>
            </motion.div>
            <motion.div
              className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-cream/50 font-heading">Family Photo</span>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
