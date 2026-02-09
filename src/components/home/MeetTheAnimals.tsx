"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EditableImage, EditableText } from "@/components/editing";
import { useEditModeOptional } from "@/context/EditModeContext";

interface AnimalSettings {
  [key: string]: string | undefined;
}

interface MeetTheAnimalsProps {
  settings?: AnimalSettings;
}

const defaultAnimals = [
  {
    id: "chickens",
    name: "Chickens",
    description: "Our free-range hens provide delicious eggs daily",
    image: "/images/animals/chickens.jpg",
    href: "/about/animals#chickens",
  },
  {
    id: "ducks",
    name: "Ducks",
    description: "Friendly ducks with rich, flavorful eggs",
    image: "/images/animals/ducks.jpg",
    href: "/about/animals#ducks",
  },
  {
    id: "turkeys",
    name: "Turkeys",
    description: "Heritage breed turkeys raised naturally",
    image: "/images/animals/turkeys.jpg",
    href: "/about/animals#turkeys",
  },
  {
    id: "geese",
    name: "Geese",
    description: "Majestic geese with prized eggs",
    image: "/images/animals/geese.jpg",
    href: "/about/animals#geese",
  },
  {
    id: "goats",
    name: "Goats",
    description: "Friendly goats providing milk for our products",
    image: "/images/animals/goats.jpg",
    href: "/about/animals#goats",
  },
];

export default function MeetTheAnimals({ settings = {} }: MeetTheAnimalsProps) {
  const editMode = useEditModeOptional();
  const isEditing = editMode?.isEditMode && editMode?.isAdmin;

  // Merge default values with settings
  const animals = defaultAnimals.map((animal) => ({
    ...animal,
    image: settings[`animal_${animal.id}_image`] || animal.image,
    name: settings[`animal_${animal.id}_name`] || animal.name,
    description: settings[`animal_${animal.id}_description`] || animal.description,
  }));

  const sectionTitle = settings.animals_section_title || "Meet the Animals";
  const sectionSubtitle = settings.animals_section_subtitle ||
    "Our animals are raised with care, love, and respect. Each one plays a vital role in our regenerative farming system.";
  const sectionAccent = settings.animals_section_accent || "The Heart of Our Ranch";

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
          <EditableText
            value={sectionAccent}
            contentType="setting"
            contentId="animals_section_accent"
            contentField="value"
            as="p"
            className="font-accent text-soft-gold text-2xl mb-4"
          />
          <EditableText
            value={sectionTitle}
            contentType="setting"
            contentId="animals_section_title"
            contentField="value"
            as="h2"
            className="section-title"
          />
          <EditableText
            value={sectionSubtitle}
            contentType="setting"
            contentId="animals_section_subtitle"
            contentField="value"
            as="p"
            className="section-subtitle max-w-2xl mx-auto"
            multiline
            useModal
          />
        </motion.div>

        {/* Animals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {animals.map((animal, index) => (
            <motion.div
              key={animal.id}
              initial={isEditing ? false : { opacity: 0, scale: 0.9 }}
              whileInView={isEditing ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="block group">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-warm-brown/10">
                  {/* Editable Image */}
                  <EditableImage
                    src={animal.image}
                    alt={animal.name}
                    contentType="setting"
                    contentId={`animal_${animal.id}_image`}
                    contentField="value"
                    className="w-full h-full object-cover"
                    containerClassName="absolute inset-0"
                  />

                  {/* Overlay on hover - link to animal page (hidden in edit mode) */}
                  {!isEditing && (
                    <Link
                      href={animal.href}
                      className="absolute inset-0 bg-warm-brown/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10"
                    >
                      <span className="text-cream font-heading text-lg">Meet Them</span>
                    </Link>
                  )}
                </div>

                <div className="mt-3 text-center">
                  <EditableText
                    value={animal.name}
                    contentType="setting"
                    contentId={`animal_${animal.id}_name`}
                    contentField="value"
                    as="h3"
                    className="font-heading text-warm-brown group-hover:text-barn-red transition-colors"
                  />
                  <EditableText
                    value={animal.description}
                    contentType="setting"
                    contentId={`animal_${animal.id}_description`}
                    contentField="value"
                    as="p"
                    className="text-xs text-charcoal-400 mt-1 hidden md:block"
                  />
                </div>
              </div>
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
