"use client";

import { motion } from "framer-motion";
import { MapPin, Sun, Mountain, Droplets } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "1.25 Acres",
    description: "Our compact but productive property in the heart of Yucca Valley.",
  },
  {
    icon: Sun,
    title: "300+ Sunny Days",
    description: "The High Desert climate provides abundant sunshine year-round.",
  },
  {
    icon: Mountain,
    title: "3,200 ft Elevation",
    description: "Cool nights and warm days create ideal growing conditions.",
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    description: "Efficient irrigation and rainwater collection systems.",
  },
];

export default function TheLandPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-forest-green to-forest-green-700">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-accent text-soft-gold text-2xl mb-4">Yucca Valley, California</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream mb-6">
              The Land
            </h1>
            <p className="text-cream/80 max-w-2xl mx-auto text-lg">
              Nestled in California&apos;s stunning High Desert, our land provides
              the perfect environment for sustainable farming.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section bg-cream">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 bg-white rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-forest-green" />
                </div>
                <h3 className="font-heading text-xl text-warm-brown mb-2">{feature.title}</h3>
                <p className="text-charcoal-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Location */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title mb-6">The High Desert Advantage</h2>
              <p className="text-charcoal-400 leading-relaxed mb-4">
                Yucca Valley sits at the gateway to Joshua Tree National Park, offering
                a unique microclimate that&apos;s perfect for raising healthy animals and
                growing organic produce.
              </p>
              <p className="text-charcoal-400 leading-relaxed mb-4">
                The dry climate means fewer pests and diseases, while the cool desert
                nights help our animals thrive. Our elevation provides natural temperature
                regulation that benefits both our livestock and any crops we grow.
              </p>
              <p className="text-charcoal-400 leading-relaxed">
                We&apos;ve designed our property to work with the land, not against it.
                From strategic shade structures to efficient water systems, every element
                is thoughtfully planned.
              </p>
            </motion.div>
            <motion.div
              className="aspect-video bg-sage/20 rounded-2xl flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-warm-brown/50 font-heading">Aerial Photo / Map</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Layout */}
      <section className="section bg-cream">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">Property Layout</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Animal Areas",
                description: "Spacious coops, runs, and pastures for our poultry and goats to roam freely.",
              },
              {
                title: "Garden Zones",
                description: "Raised beds and growing areas for supplemental feed and family produce.",
              },
              {
                title: "Processing Area",
                description: "Clean, organized spaces for egg collection and product preparation.",
              },
            ].map((area, index) => (
              <motion.div
                key={area.title}
                className="bg-white p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="aspect-video bg-sage/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-warm-brown/50 font-heading text-sm">Photo</span>
                </div>
                <h3 className="font-heading text-xl text-warm-brown mb-2">{area.title}</h3>
                <p className="text-charcoal-400">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section bg-warm-brown">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl text-cream mb-4">Find Us</h2>
            <p className="text-cream/70">
              Located in Yucca Valley, CA - serving the High Desert community
            </p>
          </div>
          <div className="aspect-video bg-white/10 rounded-2xl flex items-center justify-center">
            <span className="text-cream/50 font-heading">Interactive Map</span>
          </div>
        </div>
      </section>
    </>
  );
}
