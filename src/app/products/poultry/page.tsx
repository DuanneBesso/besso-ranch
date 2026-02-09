"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Phone } from "lucide-react";

const poultry = [
  {
    id: 5,
    name: "Laying Hen - Rhode Island Red",
    breed: "Rhode Island Red",
    age: "Point of Lay (18-20 weeks)",
    description: "Excellent brown egg layer, friendly and hardy. Perfect for backyard flocks. These girls are ready to start laying within weeks of purchase.",
    price: 35.00,
    purpose: "Egg Production",
    inStock: true,
    stockQty: 5,
  },
  {
    id: 6,
    name: "Laying Hen - Ameraucana",
    breed: "Ameraucana",
    age: "Point of Lay (18-20 weeks)",
    description: "The famous 'Easter Egger' - lays beautiful blue-green eggs. Friendly, cold-hardy, and a great conversation starter.",
    price: 40.00,
    purpose: "Egg Production",
    inStock: true,
    stockQty: 3,
  },
  {
    id: 7,
    name: "Heritage Turkey - Bourbon Red",
    breed: "Bourbon Red",
    age: "Varies",
    description: "Beautiful heritage breed with rich, mahogany plumage. Excellent foragers and flavorful meat. Can also be kept for breeding.",
    price: 75.00,
    purpose: "Meat / Breeding",
    inStock: true,
    stockQty: 2,
  },
  {
    id: 8,
    name: "Khaki Campbell Duck",
    breed: "Khaki Campbell",
    age: "Varies",
    description: "One of the most prolific egg-laying duck breeds. Can produce 300+ eggs per year. Excellent foragers and pest control.",
    price: 25.00,
    purpose: "Egg Production",
    inStock: false,
    stockQty: 0,
  },
];

export default function PoultryPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-forest-green to-forest-green-700">
        <div className="container-custom">
          <Link href="/products" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Products
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-accent text-soft-gold text-2xl mb-4">Healthy & Happy</p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
              Live Poultry
            </h1>
            <p className="text-white/80 max-w-xl">
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
            {poultry.map((bird, index) => (
              <motion.div
                key={bird.id}
                className="card overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="grid md:grid-cols-2">
                  {/* Image */}
                  <div className="aspect-square bg-sage/20 flex items-center justify-center relative">
                    <span className="text-warm-brown/40 font-heading">Photo</span>
                    {!bird.inStock && (
                      <div className="absolute top-3 left-3 badge-red">Not Available</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6 flex flex-col">
                    <h2 className="font-heading text-xl text-warm-brown mb-1">{bird.name}</h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="badge-green text-xs">{bird.breed}</span>
                      <span className="badge-gold text-xs">{bird.purpose}</span>
                    </div>
                    <p className="text-charcoal-400 text-sm mb-4 flex-grow">{bird.description}</p>

                    <div className="text-sm text-charcoal-400 mb-4">
                      <strong>Age:</strong> {bird.age}
                    </div>

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
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-8">Before You Buy</h2>
            <div className="space-y-4">
              {[
                { title: "Organic & Natural", desc: "All our birds are raised on certified organic feed with no antibiotics, hormones, or synthetic medications — only organic natural remedies." },
                { title: "Housing Required", desc: "Ensure you have appropriate housing before purchasing. We're happy to advise on coop requirements." },
                { title: "Local Laws", desc: "Check your local ordinances regarding keeping poultry. Some areas have restrictions on roosters or flock sizes." },
                { title: "Commitment", desc: "Chickens can live 8-10 years. Ensure you're prepared for long-term care." },
                { title: "Pickup Only", desc: "We do not ship live birds. All purchases must be picked up at our Yucca Valley location." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-4 bg-cream rounded-lg">
                  <div className="w-2 h-2 bg-barn-red rounded-full mt-2" />
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
