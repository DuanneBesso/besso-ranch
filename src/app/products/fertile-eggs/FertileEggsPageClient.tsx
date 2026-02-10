"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Egg, TreePine, Leaf, WheatOff, ShieldCheck, Heart } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";

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

interface FertileEggsPageClientProps {
  products: Product[];
}

export default function FertileEggsPageClient({ products }: FertileEggsPageClientProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-barn-red to-warm-brown">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-accent text-soft-gold text-2xl mb-4">Hatch Your Own Flock</p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
              Fertile Hatching Eggs
            </h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Start or grow your flock with fertile eggs from our healthy, free-range heritage
              and specialty breeds. Each egg comes from well-nourished birds raised on organic,
              corn-free, soy-free feed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section bg-cream">
        <div className="container-custom">
          {products.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {products.map((product, index) => {
                const productImages = product.images ? JSON.parse(product.images) : [];
                const firstImage = productImages[0];
                const specs = product.specifications ? JSON.parse(product.specifications) : {};
                const breed: string = specs.breed || product.subcategory || "";
                const fertilityRate: string = specs.fertilityRate || "";
                const minOrder: string = specs.minOrder || "";

                return (
                  <motion.div
                    key={product.id}
                    className="card overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="grid md:grid-cols-2">
                      {/* Image */}
                      <Link href={`/products/fertile-eggs/${product.slug}`} className="aspect-square bg-sage/20 flex items-center justify-center relative overflow-hidden">
                        {firstImage ? (
                          <img src={firstImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <Egg className="w-16 h-16 text-warm-brown/30" />
                        )}
                        {!product.inStock && (
                          <div className="absolute top-3 left-3 badge-red z-10">Out of Stock</div>
                        )}
                        {product.inStock && product.stockQuantity <= 6 && product.stockQuantity > 0 && (
                          <div className="absolute top-3 left-3 badge-gold z-10">Only {product.stockQuantity} left</div>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="p-6 flex flex-col">
                        <Link href={`/products/fertile-eggs/${product.slug}`}>
                          <h2 className="font-heading text-xl text-warm-brown mb-1 hover:text-barn-red transition-colors">{product.name}</h2>
                        </Link>
                        {breed && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="badge-green text-xs">{breed}</span>
                          </div>
                        )}
                        <p className="text-charcoal-400 text-sm mb-4 flex-grow">{product.description}</p>

                        {(fertilityRate || minOrder) && (
                          <div className="text-sm text-charcoal-400 mb-4 space-y-1">
                            {fertilityRate && <div><strong>Fertility Rate:</strong> {fertilityRate}</div>}
                            {minOrder && <div><strong>Min. Order:</strong> {minOrder}</div>}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-warm-brown/10">
                          <span className="text-2xl font-bold text-warm-brown">
                            ${product.price.toFixed(2)}
                            <span className="text-sm font-normal text-charcoal-400"> / {product.unit}</span>
                          </span>
                          <AddToCartButton product={product} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Egg className="w-16 h-16 text-warm-brown/20 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-warm-brown mb-2">Coming Soon</h2>
              <p className="text-charcoal-400 max-w-md mx-auto">
                We&apos;re preparing our fertile egg listings. Check back soon or contact us to ask about availability!
              </p>
              <Link href="/contact" className="btn-primary mt-6 inline-block">
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-8">Why Choose Our Fertile Eggs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
              {[
                { title: "Free Range Parents", desc: "All breeding stock roams freely, producing stronger, healthier embryos", icon: TreePine },
                { title: "Organic Feed", desc: "Our birds eat certified organic feed — no synthetic pesticides or GMOs", icon: Leaf },
                { title: "No Corn, No Soy", desc: "Clean, corn-free, soy-free diet for optimal fertility and chick health", icon: WheatOff },
                { title: "No Antibiotics", desc: "Parent flocks raised naturally without medications", icon: ShieldCheck },
                { title: "Heritage Breeds", desc: "Carefully selected breeds for temperament, egg production, and hardiness", icon: Heart },
                { title: "Handled with Care", desc: "Eggs are collected daily and stored at ideal temperature for hatching", icon: Egg },
              ].map((item) => (
                <div key={item.title} className="p-4">
                  <item.icon className="w-8 h-8 text-barn-red mx-auto mb-3" />
                  <h3 className="font-heading text-warm-brown mb-2">{item.title}</h3>
                  <p className="text-charcoal-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
