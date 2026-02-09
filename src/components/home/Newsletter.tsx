"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import FireflyGlows from "@/components/animations/FireflyGlows";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate API call - replace with actual newsletter signup
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="section bg-forest-green relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-sage/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-barn-red/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        {/* Firefly glows */}
        <FireflyGlows />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-accent text-soft-gold text-2xl mb-4">Stay Connected</p>
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">
            Join the Besso Ranch Community
          </h2>
          <p className="text-cream/80 mb-8">
            Subscribe to our newsletter for farm updates, seasonal availability,
            recipes, and sustainable living tips delivered to your inbox.
          </p>

          {status === "success" ? (
            <motion.div
              className="flex items-center justify-center space-x-3 text-soft-gold"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="w-6 h-6" />
              <span className="font-medium">Thanks for subscribing!</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-cream/20
                         text-cream placeholder:text-cream/50
                         focus:outline-none focus:ring-2 focus:ring-soft-gold focus:border-transparent
                         transition-all duration-200"
              />
              <motion.button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 bg-soft-gold text-warm-brown font-semibold rounded-lg
                         hover:bg-soft-gold-300 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-warm-brown/30 border-t-warm-brown rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          )}

          <p className="text-cream/50 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
