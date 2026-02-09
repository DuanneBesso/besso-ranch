"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditableImage, EditableText } from "@/components/editing";

interface AboutPageClientProps {
  settings: Record<string, string>;
}

const defaultLinks = [
  {
    id: "story",
    title: "Our Story",
    description: "Discover how Besso Ranch came to be and the family behind our sustainable farm.",
    href: "/about/our-story",
    image: "/images/about/story.jpg",
  },
  {
    id: "land",
    title: "The Land",
    description: "Explore our 1.25-acre property in the heart of California's High Desert.",
    href: "/about/the-land",
    image: "/images/about/land.jpg",
  },
  {
    id: "practices",
    title: "Our Practices",
    description: "Learn about our regenerative agriculture and sustainable farming methods.",
    href: "/about/our-practices",
    image: "/images/about/practices.jpg",
  },
  {
    id: "animals",
    title: "Meet the Animals",
    description: "Get to know the chickens, ducks, turkeys, geese, and goats that call our ranch home.",
    href: "/about/animals",
    image: "/images/about/animals.jpg",
  },
];

export default function AboutPageClient({ settings }: AboutPageClientProps) {
  const heroTitle = settings.about_hero_title || "About Besso Ranch";
  const heroSubtitle = settings.about_hero_subtitle || "A family-owned sustainable farm in Yucca Valley, California, dedicated to regenerative agriculture and producing the finest natural products.";
  const heroAccent = settings.about_hero_accent || "Get to Know Us";

  const aboutLinks = defaultLinks.map((link) => ({
    ...link,
    title: settings[`about_${link.id}_title`] || link.title,
    description: settings[`about_${link.id}_description`] || link.description,
    image: settings[`about_${link.id}_image`] || link.image,
  }));

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${settings.about_hero_image || '/images/hero-about.jpg'})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-warm-brown/90 via-warm-brown/75 to-forest-green/80" />
        <div className="container-custom text-center relative z-10">
          <EditableText
            value={heroAccent}
            contentType="setting"
            contentId="about_hero_accent"
            contentField="value"
            as="p"
            className="font-accent text-soft-gold text-2xl mb-4"
          />
          <EditableText
            value={heroTitle}
            contentType="setting"
            contentId="about_hero_title"
            contentField="value"
            as="h1"
            className="font-display text-4xl md:text-5xl lg:text-6xl text-cream mb-6"
          />
          <EditableText
            value={heroSubtitle}
            contentType="setting"
            contentId="about_hero_subtitle"
            contentField="value"
            as="p"
            className="text-cream/80 max-w-2xl mx-auto text-lg"
            multiline
            useModal
          />
        </div>
      </section>

      {/* About Links Grid */}
      <section className="section bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {aboutLinks.map((link) => (
              <div key={link.id} className="group card p-0 overflow-hidden">
                {/* Image */}
                <div className="aspect-video bg-cream overflow-hidden relative">
                  <EditableImage
                    src={link.image}
                    alt={link.title}
                    contentType="setting"
                    contentId={`about_${link.id}_image`}
                    contentField="value"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    containerClassName="w-full h-full"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <EditableText
                    value={link.title}
                    contentType="setting"
                    contentId={`about_${link.id}_title`}
                    contentField="value"
                    as="h2"
                    className="font-display text-2xl text-warm-brown mb-2 group-hover:text-barn-red transition-colors"
                  />
                  <EditableText
                    value={link.description}
                    contentType="setting"
                    contentId={`about_${link.id}_description`}
                    contentField="value"
                    as="p"
                    className="text-charcoal-400 mb-4"
                  />
                  <Link
                    href={link.href}
                    className="inline-flex items-center text-barn-red font-medium group-hover:gap-3 gap-2 transition-all"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
