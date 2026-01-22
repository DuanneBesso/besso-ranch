"use client";

import { useState } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Truck, MapPin } from "lucide-react";

// Mock cart data - will be replaced with actual cart state
const initialCartItems = [
  {
    id: 1,
    name: "Farm Fresh Chicken Eggs",
    price: 8.00,
    quantity: 2,
    unit: "dozen",
    image: "/images/products/chicken-eggs.jpg",
  },
  {
    id: 8,
    name: "Goat Milk Soap - Lavender",
    price: 8.00,
    quantity: 3,
    unit: "bar",
    image: "/images/products/soap-lavender.jpg",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === "delivery" ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-cream">
        {/* Header */}
        <section className="py-8 bg-white border-b">
          <div className="container-custom">
            <h1 className="font-display text-3xl text-warm-brown">Your Cart</h1>
          </div>
        </section>

        <section className="section">
          <div className="container-custom">
            {cartItems.length === 0 ? (
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
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          className="flex gap-4 p-4 border-b last:border-b-0"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                        >
                          {/* Image */}
                          <div className="w-24 h-24 bg-sage/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <span className="text-warm-brown/40 text-xs">Photo</span>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-warm-brown truncate">{item.name}</h3>
                            <p className="text-sm text-charcoal-400">
                              ${item.price.toFixed(2)} / {item.unit}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center border border-charcoal-200 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="p-2 hover:bg-cream transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="p-2 hover:bg-cream transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-charcoal-400 hover:text-barn-red transition-colors"
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

                    {/* Delivery Method */}
                    <div className="mb-6">
                      <p className="text-sm font-medium text-warm-brown mb-3">Delivery Method</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setDeliveryMethod("pickup")}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            deliveryMethod === "pickup"
                              ? "border-barn-red bg-barn-red/5"
                              : "border-charcoal-200"
                          }`}
                        >
                          <MapPin className={`w-5 h-5 mx-auto mb-2 ${
                            deliveryMethod === "pickup" ? "text-barn-red" : "text-charcoal-400"
                          }`} />
                          <p className="text-sm font-medium">Local Pickup</p>
                          <p className="text-xs text-charcoal-400">Free</p>
                        </button>
                        <button
                          onClick={() => setDeliveryMethod("delivery")}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            deliveryMethod === "delivery"
                              ? "border-barn-red bg-barn-red/5"
                              : "border-charcoal-200"
                          }`}
                        >
                          <Truck className={`w-5 h-5 mx-auto mb-2 ${
                            deliveryMethod === "delivery" ? "text-barn-red" : "text-charcoal-400"
                          }`} />
                          <p className="text-sm font-medium">Local Delivery</p>
                          <p className="text-xs text-charcoal-400">$5.00</p>
                        </button>
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="space-y-3 mb-6 py-4 border-y border-charcoal-100">
                      <div className="flex justify-between text-charcoal-400">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-charcoal-400">
                        <span>Delivery</span>
                        <span>{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-warm-brown text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <motion.button
                      className="btn-primary w-full flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>

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
