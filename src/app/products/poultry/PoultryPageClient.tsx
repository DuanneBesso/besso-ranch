"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Leaf, Home, Scale, Heart, Truck, type LucideIcon } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  unit: string;
  category: string;
  subcategory: string | null;
  stockQuantity: number;
  inStock: boolean;
  images: string | null;
  specifications: string | null;
}

interface PoultryPageClientProps {
  products: Product[];
}

export default function PoultryPageClient({ products }: PoultryPageClientProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-forest-green to-forest-green-700">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-accent text-soft-gold text-2xl mb-4">Healthy & Happy</p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
              Live Poultry
            </h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Start or expand your own flock with our healthy, well-socialized birds.
              All birds are raised humanely and ready for their new homes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="bg-soft-gold/20 py-6">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-barn-red" />
              <span className="text-warm-brown">
                <strong>Local Pickup Only</strong> - Live animals must be picked up at our ranch in Yucca Valley
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-barn-red" />
              <span className="text-warm-brown">Questions? Call us to discuss availability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((bird, index) => {
              const productImages = bird.images ? JSON.parse(bird.images) : [];
              const firstImage = productImages[0];
              const specs = bird.specifications ? JSON.parse(bird.specifications) : {};

              return (
                <motion.div
                  key={bird.id}
                  className="card overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="grid md:grid-cols-2">
                    {/* Image */}
                    <Link href={`/products/poultry/${bird.slug}`} className="aspect-square bg-sage/20 flex items-center justify-center relative overflow-hidden">
                      {firstImage ? (
                        <img src={firstImage} alt={bird.name} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <span className="text-warm-brown/40 font-heading">Photo</span>
                      )}
                      {!bird.inStock && (
                        <div className="absolute top-3 left-3 badge-red z-10">Not Available</div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="p-6 flex flex-col">
                      <Link href={`/products/poultry/${bird.slug}`}>
                        <h2 className="font-heading text-xl text-warm-brown mb-1 hover:text-barn-red transition-colors">{bird.name}</h2>
                      </Link>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {specs.breed && <span className="badge-green text-xs">{specs.breed}</span>}
                        {specs.purpose && <span className="badge-gold text-xs">{specs.purpose}</span>}
                        {bird.subcategory && !specs.breed && <span className="badge-green text-xs">{bird.subcategory}</span>}
                      </div>
                      <p className="text-charcoal-400 text-sm mb-4 flex-grow">{bird.description}</p>

                      {specs.age && (
                        <div className="text-sm text-charcoal-400 mb-4">
                          <strong>Age:</strong> {specs.age}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-warm-brown/10">
                        <span className="text-2xl font-bold text-warm-brown">
                          ${bird.price.toFixed(2)}
                          <span className="text-sm font-normal text-charcoal-400"> each</span>
                        </span>
                        {bird.inStock ? (
                          <Link
                            href="/contact"
                            className="btn-secondary text-sm"
                          >
                            Inquire
                          </Link>
                        ) : (
                          <button className="px-4 py-2 bg-charcoal-200 text-charcoal-400 rounded-lg cursor-not-allowed text-sm">
                            Not Available
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-8">Before You Buy</h2>
            <div className="space-y-4">
              {([
                { title: "Organic & Natural", desc: "All our birds are raised on certified organic feed with no antibiotics, hormones, or synthetic medications — only organic natural remedies.", icon: Leaf },
                { title: "Housing Required", desc: "Ensure you have appropriate housing before purchasing. We're happy to advise on coop requirements.", icon: Home },
                { title: "Local Laws", desc: "Check your local ordinances regarding keeping poultry. Some areas have restrictions on roosters or flock sizes.", icon: Scale },
                { title: "Commitment", desc: "Chickens can live 8-10 years. Ensure you're prepared for long-term care.", icon: Heart },
                { title: "Pickup Only", desc: "We do not ship live birds. All purchases must be picked up at our Yucca Valley location.", icon: Truck },
              ] as { title: string; desc: string; icon: LucideIcon }[]).map((item) => (
                <div key={item.title} className="flex gap-4 p-4 bg-cream rounded-lg">
                  <item.icon className="w-6 h-6 text-barn-red shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading text-warm-brown">{item.title}</h3>
                    <p className="text-charcoal-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
