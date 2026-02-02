"use client";

import { motion } from "framer-motion";
import { MapPin, Sun, Mountain, Droplets } from "lucide-react";
import { EditableImage, EditableText } from "@/components/editing";

interface TheLandClientProps {
  settings: Record<string, string>;
}

const defaultFeatures = [
  { icon: MapPin, id: "acres", title: "1.25 Acres", description: "Our compact but productive property in the heart of Yucca Valley." },
  { icon: Sun, id: "sunny", title: "300+ Sunny Days", description: "The High Desert climate provides abundant sunshine year-round." },
  { icon: Mountain, id: "elevation", title: "3,200 ft Elevation", description: "Cool nights and warm days create ideal growing conditions." },
  { icon: Droplets, id: "water", title: "Water Conservation", description: "Efficient irrigation and rainwater collection systems." },
];

const defaultAreas = [
  { id: "animal", title: "Animal Areas", description: "Spacious coops, runs, and pastures for our poultry and goats to roam freely." },
  { id: "garden", title: "Garden Zones", description: "Raised beds and growing areas for supplemental feed and family produce." },
  { id: "processing", title: "Processing Area", description: "Clean, organized spaces for egg collection and product preparation." },
];

export default function TheLandClient({ settings }: TheLandClientProps) {
  const heroTitle = settings.land_hero_title || "The Land";
  const heroSubtitle = settings.land_hero_subtitle || "Nestled in California's stunning High Desert, our land provides the perfect environment for sustainable farming.";
  const heroAccent = settings.land_hero_accent || "Yucca Valley, California";

  const aerialImage = settings.land_aerial_image || "/images/about/aerial.jpg";

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
            <EditableText
              value={heroAccent}
              contentType="setting"
              contentId="land_hero_accent"
              contentField="value"
              as="p"
              className="font-accent text-soft-gold text-2xl mb-4"
            />
            <EditableText
              value={heroTitle}
              contentType="setting"
              contentId="land_hero_title"
              contentField="value"
              as="h1"
              className="font-display text-4xl md:text-5xl lg:text-6xl text-cream mb-6"
            />
            <EditableText
              value={heroSubtitle}
              contentType="setting"
              contentId="land_hero_subtitle"
              contentField="value"
              as="p"
              className="text-cream/80 max-w-2xl mx-auto text-lg"
              multiline
              useModal
            />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section bg-cream">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {defaultFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="text-center p-6 bg-white rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-forest-green" />
                </div>
                <EditableText
                  value={settings[`land_feature_${feature.id}_title`] || feature.title}
                  contentType="setting"
                  contentId={`land_feature_${feature.id}_title`}
                  contentField="value"
                  as="h3"
                  className="font-heading text-xl text-warm-brown mb-2"
                />
                <EditableText
                  value={settings[`land_feature_${feature.id}_description`] || feature.description}
                  contentType="setting"
                  contentId={`land_feature_${feature.id}_description`}
                  contentField="value"
                  as="p"
                  className="text-charcoal-400 text-sm"
                />
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
              <EditableText
                value={settings.land_advantage_title || "The High Desert Advantage"}
                contentType="setting"
                contentId="land_advantage_title"
                contentField="value"
                as="h2"
                className="section-title mb-6"
              />
              <EditableText
                value={settings.land_advantage_text1 || "Yucca Valley sits at the gateway to Joshua Tree National Park, offering a unique microclimate that's perfect for raising healthy animals and growing organic produce."}
                contentType="setting"
                contentId="land_advantage_text1"
                contentField="value"
                as="p"
                className="text-charcoal-400 leading-relaxed mb-4"
                multiline
                useModal
              />
              <EditableText
                value={settings.land_advantage_text2 || "The dry climate means fewer pests and diseases, while the cool desert nights help our animals thrive. Our elevation provides natural temperature regulation that benefits both our livestock and any crops we grow."}
                contentType="setting"
                contentId="land_advantage_text2"
                contentField="value"
                as="p"
                className="text-charcoal-400 leading-relaxed mb-4"
                multiline
                useModal
              />
              <EditableText
                value={settings.land_advantage_text3 || "We've designed our property to work with the land, not against it. From strategic shade structures to efficient water systems, every element is thoughtfully planned."}
                contentType="setting"
                contentId="land_advantage_text3"
                contentField="value"
                as="p"
                className="text-charcoal-400 leading-relaxed"
                multiline
                useModal
              />
            </motion.div>
            <motion.div
              className="aspect-video bg-sage/20 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <EditableImage
                src={aerialImage}
                alt="Aerial view of Besso Ranch"
                contentType="setting"
                contentId="land_aerial_image"
                contentField="value"
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Layout */}
      <section className="section bg-cream">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">Property Layout</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {defaultAreas.map((area, index) => (
              <motion.div
                key={area.id}
                className="bg-white p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="aspect-video bg-sage/20 rounded-lg mb-4 overflow-hidden">
                  <EditableImage
                    src={settings[`land_area_${area.id}_image`] || `/images/about/${area.id}.jpg`}
                    alt={area.title}
                    contentType="setting"
                    contentId={`land_area_${area.id}_image`}
                    contentField="value"
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                </div>
                <EditableText
                  value={settings[`land_area_${area.id}_title`] || area.title}
                  contentType="setting"
                  contentId={`land_area_${area.id}_title`}
                  contentField="value"
                  as="h3"
                  className="font-heading text-xl text-warm-brown mb-2"
                />
                <EditableText
                  value={settings[`land_area_${area.id}_description`] || area.description}
                  contentType="setting"
                  contentId={`land_area_${area.id}_description`}
                  contentField="value"
                  as="p"
                  className="text-charcoal-400"
                />
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
          <div className="aspect-video bg-white/10 rounded-2xl overflow-hidden">
            <EditableImage
              src={settings.land_map_image || "/images/about/map.jpg"}
              alt="Location map"
              contentType="setting"
              contentId="land_map_image"
              contentField="value"
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
