"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditableImage, EditableText } from "@/components/editing";

interface AnimalsPageClientProps {
  settings: Record<string, string>;
}

const defaultAnimalGroups = [
  {
    id: "chickens",
    name: "Chickens",
    tagline: "The heart of our egg production",
    description: "Our diverse flock of chickens includes heritage and production breeds, providing a rainbow of egg colors and sizes. Each hen has her own personality and contributes to our daily egg harvest.",
    breeds: ["Rhode Island Red", "Barred Plymouth Rock", "Ameraucana", "Leghorn", "Orpington"],
    products: ["Fresh chicken eggs in various colors and sizes"],
    facts: ["Chickens can recognize over 100 individual faces", "They dream just like humans do", "Our hens enjoy over 8 hours of free-range time daily"],
    image: "/images/animals/chickens-detail.jpg",
  },
  {
    id: "ducks",
    name: "Ducks",
    tagline: "Masters of pest control",
    description: "Our ducks are not only wonderful egg layers but also serve as natural pest control, happily gobbling up slugs, snails, and insects. Their eggs are prized by bakers for their rich, creamy quality.",
    breeds: ["Khaki Campbell", "Welsh Harlequin", "Pekin"],
    products: ["Duck eggs - perfect for baking and gourmet cooking"],
    facts: ["Duck eggs have larger yolks than chicken eggs", "Ducks are more cold-hardy than chickens", "They can eat up to 200 slugs per day"],
    image: "/images/animals/ducks-detail.jpg",
  },
  {
    id: "turkeys",
    name: "Turkeys",
    tagline: "Heritage breeds with personality",
    description: "Our heritage turkeys are raised naturally, allowed to mature slowly for better flavor and texture. They're curious, social birds that often follow us around the property.",
    breeds: ["Bourbon Red", "Narragansett", "Bronze"],
    products: ["Turkey eggs - large and nutrient-rich", "Heritage turkeys (seasonal)"],
    facts: ["Turkey eggs are 50% larger than chicken eggs", "Heritage turkeys can fly short distances", "They have excellent eyesight and memory"],
    image: "/images/animals/turkeys-detail.jpg",
  },
  {
    id: "geese",
    name: "Geese",
    tagline: "Natural guardians of the flock",
    description: "Our geese serve as watchful protectors, alerting us to any disturbances. Their large, seasonal eggs are a delicacy prized by chefs and home cooks alike.",
    breeds: ["Embden", "Toulouse", "Pilgrim"],
    products: ["Goose eggs (seasonal) - rich and flavorful"],
    facts: ["Geese mate for life and are devoted parents", "One goose egg equals about 3 chicken eggs", "They're excellent 'guard dogs' for the flock"],
    image: "/images/animals/geese-detail.jpg",
  },
  {
    id: "goats",
    name: "Goats",
    tagline: "Providers of milk and joy",
    description: "Our Nigerian Dwarf goats are compact but mighty milk producers. Their milk is naturally homogenized and perfect for making our artisan soaps, lotions, and lip balms.",
    breeds: ["Nigerian Dwarf"],
    products: ["Goat milk soap", "Goat milk lotion", "Goat milk lip balm"],
    facts: ["Nigerian Dwarf goats produce milk with high butterfat", "Goats are incredibly intelligent and curious", "They can recognize their names and come when called"],
    image: "/images/animals/goats-detail.jpg",
  },
];

export default function AnimalsPageClient({ settings }: AnimalsPageClientProps) {
  const heroTitle = settings.animals_page_hero_title || "Meet the Animals";
  const heroSubtitle = settings.animals_page_hero_subtitle || "Every animal at Besso Ranch has a name, a personality, and a purpose. Get to know the wonderful creatures that make our products possible.";
  const heroAccent = settings.animals_page_hero_accent || "The Stars of the Show";

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-soft-gold to-barn-red">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EditableText
              value={heroAccent}
              contentType="setting"
              contentId="animals_page_hero_accent"
              contentField="value"
              as="p"
              className="font-accent text-cream text-2xl mb-4"
            />
            <EditableText
              value={heroTitle}
              contentType="setting"
              contentId="animals_page_hero_title"
              contentField="value"
              as="h1"
              className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6"
            />
            <EditableText
              value={heroSubtitle}
              contentType="setting"
              contentId="animals_page_hero_subtitle"
              contentField="value"
              as="p"
              className="text-white/80 max-w-2xl mx-auto text-lg"
              multiline
              useModal
            />
          </motion.div>
        </div>
      </section>

      {/* Animal Sections */}
      {defaultAnimalGroups.map((group, index) => (
        <section
          key={group.id}
          id={group.id}
          className={`section ${index % 2 === 0 ? "bg-cream" : "bg-white"}`}
        >
          <div className="container-custom">
            <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
              <motion.div
                className={index % 2 === 1 ? "md:order-2" : ""}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <EditableText
                  value={settings[`animals_page_${group.id}_tagline`] || group.tagline}
                  contentType="setting"
                  contentId={`animals_page_${group.id}_tagline`}
                  contentField="value"
                  as="p"
                  className="font-accent text-soft-gold text-xl mb-2"
                />
                <EditableText
                  value={settings[`animals_page_${group.id}_name`] || group.name}
                  contentType="setting"
                  contentId={`animals_page_${group.id}_name`}
                  contentField="value"
                  as="h2"
                  className="section-title mb-4"
                />
                <EditableText
                  value={settings[`animals_page_${group.id}_description`] || group.description}
                  contentType="setting"
                  contentId={`animals_page_${group.id}_description`}
                  contentField="value"
                  as="p"
                  className="text-charcoal-400 leading-relaxed mb-6"
                  multiline
                  useModal
                />

                <div className="mb-6">
                  <h4 className="font-heading text-warm-brown mb-2">Our Breeds:</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.breeds.map((breed) => (
                      <span key={breed} className="badge-green">{breed}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-heading text-warm-brown mb-2">Products:</h4>
                  <ul className="space-y-1">
                    {group.products.map((product) => (
                      <li key={product} className="text-charcoal-400 flex items-center">
                        <span className="w-1.5 h-1.5 bg-barn-red rounded-full mr-2" />
                        {product}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-sage/10 rounded-lg p-4">
                  <h4 className="font-heading text-warm-brown mb-2">Fun Facts:</h4>
                  <ul className="space-y-2">
                    {group.facts.map((fact) => (
                      <li key={fact} className="text-charcoal-400 text-sm flex items-start">
                        <span className="text-soft-gold mr-2">★</span>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div
                className={`aspect-square bg-warm-brown/10 rounded-2xl overflow-hidden ${index % 2 === 1 ? "md:order-1" : ""}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <EditableImage
                  src={settings[`animals_page_${group.id}_image`] || group.image}
                  alt={group.name}
                  contentType="setting"
                  contentId={`animals_page_${group.id}_image`}
                  contentField="value"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="section bg-barn-red">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">
              Taste the Difference
            </h2>
            <p className="text-cream/80 max-w-xl mx-auto mb-8">
              Our happy, healthy animals produce exceptional products.
              Try them for yourself and experience farm-fresh quality.
            </p>
            <Link href="/products" className="inline-flex items-center space-x-2 bg-white text-barn-red px-8 py-4 rounded-lg font-semibold hover:bg-cream transition-colors">
              <span>Shop Our Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
