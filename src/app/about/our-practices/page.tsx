"use client";

import { motion } from "framer-motion";
import { Leaf, RefreshCw, Shield, Zap, Droplets, Sun } from "lucide-react";

const practices = [
  {
    icon: RefreshCw,
    title: "Closed-Loop Systems",
    description: "Our animals and gardens work together. Manure becomes compost, compost feeds the soil, and healthy soil grows nutritious feed.",
    details: [
      "Composting all animal waste",
      "Using compost to enrich garden beds",
      "Growing supplemental feed on-site",
      "Minimal external inputs needed",
    ],
  },
  {
    icon: Leaf,
    title: "Organic Methods",
    description: "We never use synthetic pesticides, herbicides, or chemical fertilizers. Everything on our ranch is as nature intended.",
    details: [
      "No synthetic chemicals ever",
      "Natural pest management",
      "Organic feed sources",
      "Heritage seed preservation",
    ],
  },
  {
    icon: Shield,
    title: "Animal Welfare",
    description: "Happy animals produce better products. Our animals have space to roam, express natural behaviors, and live stress-free lives.",
    details: [
      "Free-range access daily",
      "Spacious, clean housing",
      "Natural flock dynamics",
      "Veterinary care when needed",
    ],
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    description: "In the High Desert, every drop counts. We employ efficient irrigation and water recycling throughout our property.",
    details: [
      "Drip irrigation systems",
      "Rainwater collection",
      "Gray water recycling",
      "Drought-tolerant landscaping",
    ],
  },
  {
    icon: Sun,
    title: "Solar Integration",
    description: "We harness the abundant desert sunshine to power our operations and reduce our environmental footprint.",
    details: [
      "Solar-powered water pumps",
      "LED lighting in coops",
      "Energy-efficient equipment",
      "Minimal grid dependence",
    ],
  },
  {
    icon: Zap,
    title: "Regenerative Agriculture",
    description: "We don't just sustain—we regenerate. Our practices actively improve soil health and biodiversity over time.",
    details: [
      "Building soil organic matter",
      "Increasing biodiversity",
      "Carbon sequestration",
      "Ecosystem restoration",
    ],
  },
];

export default function OurPracticesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-sage to-forest-green">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-accent text-soft-gold text-2xl mb-4">Sustainable by Design</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream mb-6">
              Our Practices
            </h1>
            <p className="text-cream/80 max-w-2xl mx-auto text-lg">
              Regenerative agriculture isn&apos;t just a buzzword—it&apos;s our way of life.
              Every decision we make considers the long-term health of our land, animals, and community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section bg-cream">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-6">Farming for the Future</h2>
            <p className="text-charcoal-400 text-lg leading-relaxed">
              At Besso Ranch, we believe that the best products come from the healthiest
              systems. That&apos;s why we&apos;ve built our entire operation around principles
              of regeneration, sustainability, and respect for nature.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Practices Grid */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practices.map((practice, index) => (
              <motion.div
                key={practice.title}
                className="bg-cream rounded-xl p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 bg-forest-green/10 rounded-full flex items-center justify-center mb-4">
                  <practice.icon className="w-7 h-7 text-forest-green" />
                </div>
                <h3 className="font-heading text-xl text-warm-brown mb-3">{practice.title}</h3>
                <p className="text-charcoal-400 mb-4">{practice.description}</p>
                <ul className="space-y-2">
                  {practice.details.map((detail) => (
                    <li key={detail} className="flex items-center text-sm text-charcoal-400">
                      <span className="w-1.5 h-1.5 bg-forest-green rounded-full mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="section bg-forest-green">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-accent text-soft-gold text-2xl mb-4">Why It Matters</p>
              <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
                The Difference You Can Taste
              </h2>
              <p className="text-cream/80 leading-relaxed mb-4">
                When animals are raised humanely on healthy land, the quality of their
                products speaks for itself. Our eggs have richer yolks, more flavor, and
                better nutrition than conventional alternatives.
              </p>
              <p className="text-cream/80 leading-relaxed mb-4">
                But it&apos;s not just about taste—it&apos;s about knowing your food comes
                from a place that cares. A place that&apos;s actively making the world better,
                one egg at a time.
              </p>
              <p className="text-cream/80 leading-relaxed">
                When you buy from Besso Ranch, you&apos;re supporting a food system that
                nourishes rather than depletes, that regenerates rather than destroys.
              </p>
            </motion.div>
            <motion.div
              className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-cream/50 font-heading">Photo</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section bg-cream">
        <div className="container-custom text-center">
          <h2 className="section-title mb-4">Our Commitment</h2>
          <p className="text-charcoal-400 max-w-2xl mx-auto mb-12">
            While we may not carry every certification, our practices exceed
            most standards. We invite you to visit the ranch and see for yourself.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {["Pasture Raised", "No Antibiotics", "No Hormones", "Non-GMO Feed", "Humanely Treated"].map((badge) => (
              <div key={badge} className="px-6 py-3 bg-white rounded-full shadow-sm">
                <span className="text-forest-green font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
