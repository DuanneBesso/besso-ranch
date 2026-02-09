"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EditableText, EditableImage } from "@/components/editing";
import NatureParticles from "@/components/animations/NatureParticles";

interface HeroSettings {
  hero_background_image?: string;
  hero_welcome_text?: string;
  hero_title?: string;
  hero_tagline?: string;
  hero_location?: string;
  hero_description?: string;
}

interface HeroProps {
  settings?: HeroSettings;
}

// Default values for when settings haven't been configured
const defaults: HeroSettings = {
  hero_background_image: "/images/hero-yucca-valley.jpg",
  hero_welcome_text: "Welcome to",
  hero_title: "Besso Ranch",
  hero_tagline: "Regenerative Agriculture, Naturally",
  hero_location: "Yucca Valley, California",
  hero_description:
    "Experience the difference of truly sustainable farming. Farm fresh eggs, live poultry, and handcrafted goat milk products from our family to yours.",
};

export default function Hero({ settings = {} }: HeroProps) {
  // Merge defaults with provided settings
  const content = { ...defaults, ...settings };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <EditableImage
        src={content.hero_background_image!}
        alt="Besso Ranch background"
        contentType="setting"
        contentId="hero_background_image"
        contentField="value"
        isBackground
        containerClassName="absolute inset-0 bg-gradient-to-br from-warm-brown/90 via-warm-brown/70 to-forest-green/80 bg-cover bg-center"
        style={{ backgroundBlendMode: "overlay" }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-warm-brown/90 via-warm-brown/70 to-forest-green/80" />
      </EditableImage>

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
        {/* Floating dust motes / dandelion seeds */}
        <NatureParticles />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Handwritten Accent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <EditableText
              value={content.hero_welcome_text!}
              contentType="setting"
              contentId="hero_welcome_text"
              contentField="value"
              as="p"
              className="font-accent text-soft-gold text-2xl md:text-3xl mb-4"
            />
          </motion.div>

          {/* Main Title */}
          <EditableText
            value={content.hero_title!}
            contentType="setting"
            contentId="hero_title"
            contentField="value"
            as="h1"
            className="font-display text-5xl md:text-7xl lg:text-8xl text-cream mb-6"
          />

          {/* Tagline */}
          <EditableText
            value={content.hero_tagline!}
            contentType="setting"
            contentId="hero_tagline"
            contentField="value"
            as="p"
            className="font-heading text-xl md:text-2xl text-cream/90 mb-4 max-w-2xl mx-auto"
          />

          {/* Location */}
          <EditableText
            value={content.hero_location!}
            contentType="setting"
            contentId="hero_location"
            contentField="value"
            as="p"
            className="text-cream/70 text-lg mb-8"
          />

          {/* Description */}
          <EditableText
            value={content.hero_description!}
            contentType="setting"
            contentId="hero_description"
            contentField="value"
            as="p"
            className="text-cream/80 max-w-xl mx-auto mb-10 leading-relaxed"
            multiline
            useModal
          />

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
