import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Besso Ranch, our sustainable farming practices, and the family behind the farm in Yucca Valley, California.",
};

const aboutLinks = [
  {
    title: "Our Story",
    description: "Discover how Besso Ranch came to be and the family behind our sustainable farm.",
    href: "/about/our-story",
    image: "/images/about/story.jpg",
  },
  {
    title: "The Land",
    description: "Explore our 1.25-acre property in the heart of California's High Desert.",
    href: "/about/the-land",
    image: "/images/about/land.jpg",
  },
  {
    title: "Our Practices",
    description: "Learn about our regenerative agriculture and sustainable farming methods.",
    href: "/about/our-practices",
    image: "/images/about/practices.jpg",
  },
  {
    title: "Meet the Animals",
    description: "Get to know the chickens, ducks, turkeys, geese, and goats that call our ranch home.",
    href: "/about/animals",
    image: "/images/about/animals.jpg",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-warm-brown">
        <div className="container-custom text-center">
          <p className="font-accent text-soft-gold text-2xl mb-4">Get to Know Us</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream mb-6">
            About Besso Ranch
          </h1>
          <p className="text-cream/80 max-w-2xl mx-auto text-lg">
            A family-owned sustainable farm in Yucca Valley, California, dedicated to
            regenerative agriculture and producing the finest natural products.
          </p>
        </div>
      </section>

      {/* About Links Grid */}
      <section className="section bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {aboutLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="group card p-0 overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-video bg-cream overflow-hidden">
                  <img
                    src={link.image}
                    alt={link.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="font-display text-2xl text-warm-brown mb-2 group-hover:text-barn-red transition-colors">
                    {link.title}
                  </h2>
                  <p className="text-charcoal-400 mb-4">{link.description}</p>
                  <span className="inline-flex items-center text-barn-red font-medium group-hover:gap-3 gap-2 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
