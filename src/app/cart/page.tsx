"use client";

import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-cream">
        {/* Header */}
        <section className="py-8 bg-white border-b">
          <div className="container-custom">
            <h1 className="font-display text-3xl text-warm-brown">
              Your Cart {itemCount > 0 && `(${itemCount})`}
            </h1>
          </div>
        </section>

        <section className="section">
          <div className="container-custom">
            {items.length === 0 ? (
              /* Empty Cart */
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ShoppingBag className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
                <h2 className="font-heading text-2xl text-warm-brown mb-2">Your cart is empty</h2>
                <p className="text-charcoal-400 mb-6">
                  Looks like you haven&apos;t added any items yet.
                </p>
                <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl overflow-hidden">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          className="flex gap-4 p-4 border-b last:border-b-0"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                        >
                          {/* Image */}
                          <div className="w-24 h-24 bg-sage/20 rounded-lg flex-shrink-0 overflow-hidden">
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-warm-brown/40" />
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-warm-brown truncate">
                              {item.name}
                              {item.isPreorder && (
                                <span className="text-xs text-amber-600 font-medium ml-1">(Pre-Order)</span>
                              )}
                            </h3>
                            <p className="text-sm text-charcoal-400">
                              ${item.price.toFixed(2)} / {item.unit}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center border border-charcoal-200 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 hover:bg-cream transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.maxQuantity}
                                  className="p-2 hover:bg-cream transition-colors disabled:opacity-50"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-charcoal-400 hover:text-barn-red transition-colors"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="font-semibold text-warm-brown">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-barn-red mt-4 hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                  </Link>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl p-6 sticky top-24">
                    <h2 className="font-heading text-xl text-warm-brown mb-6">Order Summary</h2>

                    {/* Totals */}
                    <div className="space-y-3 mb-6 py-4 border-y border-charcoal-100">
                      <div className="flex justify-between text-charcoal-400">
                        <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-charcoal-400">
                        <span>Shipping</span>
                        <span className="text-sm">Calculated at checkout</span>
                      </div>
                      <div className="flex justify-between font-semibold text-warm-brown text-lg">
                        <span>Total</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Link href="/checkout">
                      <motion.div
                        className="btn-primary w-full flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Proceed to Checkout
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </Link>

                    <p className="text-xs text-charcoal-400 text-center mt-4">
                      Secure checkout powered by Stripe
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
