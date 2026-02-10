"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook } from "lucide-react";
import { EditableText } from "@/components/editing";
import InstagramGrid from "@/components/gallery/InstagramGrid";
import InstagramLightbox from "@/components/gallery/InstagramLightbox";

interface Post {
  id: string;
  caption: string | null;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string;
  timestamp: Date;
}

interface GalleryPageClientProps {
  posts: Post[];
  settings: Record<string, string>;
}

export default function GalleryPageClient({ posts, settings }: GalleryPageClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const heroAccent = settings.gallery_hero_accent || "Follow Our Journey";
  const heroTitle = settings.gallery_hero_title || "Gallery";
  const heroSubtitle = settings.gallery_hero_subtitle || "Life on the ranch through our lens — the animals, the land, and the beauty of the California High Desert.";
  const profileUrl = settings.instagram_profile_url || "";
  const facebookUrl = settings.facebook_profile_url || "";

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${settings.gallery_hero_image || '/images/hero-gallery.jpg'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-warm-brown/90 via-warm-brown/75 to-forest-green/80" />
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EditableText
              value={heroAccent}
              contentType="setting"
              contentId="gallery_hero_accent"
              contentField="value"
              as="p"
              className="font-accent text-soft-gold text-2xl mb-4"
            />
            <EditableText
              value={heroTitle}
              contentType="setting"
              contentId="gallery_hero_title"
              contentField="value"
              as="h1"
              className="font-display text-4xl md:text-5xl text-cream mb-4"
            />
            <EditableText
              value={heroSubtitle}
              contentType="setting"
              contentId="gallery_hero_subtitle"
              contentField="value"
              as="p"
              className="text-cream/80 max-w-xl mx-auto"
              multiline
              useModal
            />
          </motion.div>
        </div>
      </section>

      {/* Social Follow Strip */}
      <section className="bg-cream pt-10 pb-2">
        <div className="container-custom text-center">
          <p className="text-charcoal-400 text-sm md:text-base mb-4 max-w-lg mx-auto">
            Fresh from the coop, the pasture, and the desert sky. Follow along for daily ranch life, new arrivals, and behind-the-scenes moments.
          </p>
          <div className="flex items-center justify-center gap-4">
            {profileUrl && (
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-warm-brown text-cream font-medium rounded-full hover:bg-warm-brown/90 transition-colors text-sm"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-green text-cream font-medium rounded-full hover:bg-forest-green/90 transition-colors text-sm"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-6 md:py-8 bg-cream">
        <div className="container-custom">
          {posts.length > 0 ? (
            <InstagramGrid
              posts={posts}
              onPostClick={(index) => setLightboxIndex(index)}
            />
          ) : (
            <div className="text-center py-16">
              <Instagram className="w-16 h-16 text-charcoal-400/30 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-warm-brown mb-2">
                No Photos Yet
              </h2>
              <p className="text-charcoal-400 max-w-md mx-auto">
                Our gallery is being set up. Check back soon for photos from life on the ranch!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Follow Us CTA */}
      {profileUrl && (
        <section className="py-16 bg-barn-red">
          <div className="container-custom text-center">
            <Instagram className="w-10 h-10 text-cream mx-auto mb-4" />
            <h2 className="font-display text-3xl text-cream mb-4">
              Follow Us on Instagram
            </h2>
            <p className="text-cream/80 mb-6 max-w-md mx-auto">
              See daily updates, behind-the-scenes moments, and more from Besso Ranch.
            </p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-soft-gold text-warm-brown font-semibold rounded-lg hover:bg-soft-gold-300 transition-colors"
            >
              <Instagram className="w-5 h-5" />
              @bessoranch
            </a>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <InstagramLightbox
          posts={posts}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(index) => setLightboxIndex(index)}
        />
      )}
    </>
  );
}
