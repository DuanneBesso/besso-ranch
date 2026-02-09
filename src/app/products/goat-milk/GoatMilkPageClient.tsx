"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
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

interface GoatMilkPageClientProps {
  products: Product[];
}

export default function GoatMilkPageClient({ products }: GoatMilkPageClientProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-sage to-forest-green">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-accent text-cream text-2xl mb-4">Handcrafted with Love</p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
              Goat Milk Products
            </h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Made from fresh milk from our Nigerian Dwarf goats. Each product is
              handcrafted in small batches using time-honored methods.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="bg-cream py-6">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              "Rich in Vitamins A, D & E",
              "Natural Lactic Acid",
              "Gentle pH Balance",
              "Deeply Moisturizing",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-soft-gold" />
                <span className="text-warm-brown font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const productImages = product.images ? JSON.parse(product.images) : [];
              const firstImage = productImages[0];
              const specs = product.specifications ? JSON.parse(product.specifications) : {};
              const benefits: string[] = specs.benefits || [];
              const ingredients: string[] = specs.ingredients || [];

              return (
                <motion.div
                  key={product.id}
                  className="card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Image */}
                  <Link href={`/products/goat-milk/${product.slug}`} className="aspect-square bg-sage/20 flex items-center justify-center relative overflow-hidden block">
                    {firstImage ? (
                      <img src={firstImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-warm-brown/40 font-heading">Photo</span>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="p-5">
                    <Link href={`/products/goat-milk/${product.slug}`}>
                      <h2 className="font-heading text-lg text-warm-brown mb-2 hover:text-barn-red transition-colors">{product.name}</h2>
                    </Link>
                    <p className="text-charcoal-400 text-sm mb-4">{product.description}</p>

                    {/* Benefits */}
                    {benefits.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {benefits.map((benefit: string) => (
                          <span key={benefit} className="text-xs bg-sage/20 text-forest-green px-2 py-1 rounded">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Ingredients */}
                    {ingredients.length > 0 && (
                      <div className="text-xs text-charcoal-400 mb-4">
                        <strong>Key Ingredients:</strong> {ingredients.join(", ")}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-warm-brown/10">
                      <span className="text-xl font-bold text-warm-brown">
                        ${product.price.toFixed(2)}
                        <span className="text-sm font-normal text-charcoal-400"> / {product.unit}</span>
                      </span>
                      <AddToCartButton
                        product={product}
                        className="!p-2 !px-3"
                        showIcon={false}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Goat Milk Section */}
      <section className="section bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title mb-8">Why Goat Milk?</h2>
            <p className="text-charcoal-400 leading-relaxed mb-8">
              Goat milk has been used for skincare for thousands of years, and for good reason.
              It&apos;s naturally rich in vitamins, minerals, and fatty acids that nourish and protect your skin.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: "Organic & Natural", desc: "Our goats are fed certified organic feed with no antibiotics or hormones — only organic natural remedies" },
                { title: "Gentle & Nourishing", desc: "The proteins in goat milk are smaller and easier for skin to absorb" },
                { title: "Natural Exfoliation", desc: "Lactic acid gently removes dead skin cells" },
                { title: "pH Balanced", desc: "Similar to human skin's natural pH level" },
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-xl">
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
