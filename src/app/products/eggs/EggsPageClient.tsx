"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
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

interface EggsPageClientProps {
  products: Product[];
}

export default function EggsPageClient({ products }: EggsPageClientProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-soft-gold to-barn-red">
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
            <p className="font-accent text-cream text-2xl mb-4">Farm Fresh</p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
              Eggs
            </h1>
            <p className="text-white/80 max-w-xl">
              From our happy, free-range birds to your table. Experience the difference
              that sustainable farming and proper nutrition makes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product, index) => {
              const productImages = product.images ? JSON.parse(product.images) : [];
              const firstImage = productImages[0];
              const specs = product.specifications ? JSON.parse(product.specifications) : {};
              const colors: string[] = specs.colors || [];

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
                    <Link href={`/products/eggs/${product.slug}`} className="aspect-square bg-sage/20 flex items-center justify-center relative overflow-hidden">
                      {firstImage ? (
                        <img src={firstImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <span className="text-warm-brown/40 font-heading">Photo</span>
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
                      <Link href={`/products/eggs/${product.slug}`}>
                        <h2 className="font-heading text-xl text-warm-brown mb-2 hover:text-barn-red transition-colors">{product.name}</h2>
                      </Link>
                      <p className="text-charcoal-400 text-sm mb-4 flex-grow">{product.description}</p>

                      {colors.length > 0 && (
                        <div className="mb-4">
                          <span className="text-xs text-charcoal-400 uppercase">Shell Colors:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {colors.map((color: string) => (
                              <span key={color} className="text-xs bg-white px-2 py-1 rounded">{color}</span>
                            ))}
                          </div>
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
        </div>
      </section>

      {/* Info Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-8">Why Our Eggs Are Different</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { title: "Free Range", desc: "Our birds roam freely, foraging for bugs and greens" },
                { title: "Organic", desc: "Fed certified organic feed with no synthetic pesticides or GMOs" },
                { title: "No Antibiotics", desc: "Raised naturally without medications" },
                { title: "Fresh Daily", desc: "Eggs collected and packaged the same day" },
              ].map((item) => (
                <div key={item.title} className="p-4">
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
