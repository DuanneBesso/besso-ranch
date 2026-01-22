"use client";

import { useState } from "react";
import { Header, Footer } from "@/components/layout";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@bessoranch.com",
    href: "mailto:hello@bessoranch.com",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "(760) 555-1234",
    href: "tel:+17605551234",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Yucca Valley, CA 92284",
    href: null,
  },
  {
    icon: Clock,
    title: "Hours",
    value: "By appointment",
    href: null,
  },
];

const faqs = [
  {
    question: "Do you offer farm tours?",
    answer: "Yes! We offer tours by appointment. Contact us to schedule a visit and meet our animals.",
  },
  {
    question: "What is your delivery radius?",
    answer: "We deliver within 25 miles of Yucca Valley, including Joshua Tree and Twentynine Palms. Free local pickup is always available.",
  },
  {
    question: "Can I reserve eggs weekly?",
    answer: "Absolutely! We offer standing orders for regular customers. Contact us to set up a recurring delivery or pickup schedule.",
  },
  {
    question: "Do you sell to restaurants?",
    answer: "Yes, we work with several local restaurants and cafes. Reach out to discuss wholesale pricing and availability.",
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate form submission - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-16 bg-warm-brown">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-accent text-soft-gold text-2xl mb-4">Get in Touch</p>
              <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
                Contact Us
              </h1>
              <p className="text-cream/80 max-w-xl mx-auto">
                Have questions about our products, want to schedule a pickup,
                or just want to say hello? We&apos;d love to hear from you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 bg-cream">
          <div className="container-custom">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  className="bg-white p-6 rounded-xl text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-barn-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-barn-red" />
                  </div>
                  <h3 className="font-heading text-warm-brown mb-1">{info.title}</h3>
                  {info.href ? (
                    <a href={info.href} className="text-charcoal-400 hover:text-barn-red transition-colors">
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-charcoal-400">{info.value}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="section-title mb-6">Send Us a Message</h2>

                {status === "success" ? (
                  <motion.div
                    className="bg-forest-green/10 p-8 rounded-xl text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <CheckCircle className="w-16 h-16 text-forest-green mx-auto mb-4" />
                    <h3 className="font-heading text-xl text-forest-green mb-2">Message Sent!</h3>
                    <p className="text-charcoal-400">
                      Thanks for reaching out. We&apos;ll get back to you within 24-48 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-warm-brown mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          className="input"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-warm-brown mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className="input"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-warm-brown mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        className="input"
                      >
                        <option value="">Select a topic</option>
                        <option value="order">Order Inquiry</option>
                        <option value="products">Product Question</option>
                        <option value="wholesale">Wholesale Inquiry</option>
                        <option value="visit">Farm Visit / Tour</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-warm-brown mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        className="input resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {status === "loading" ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="section-title mb-6">Find Us</h2>
                <div className="aspect-square bg-sage/20 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-warm-brown/50 font-heading">Interactive Map</span>
                </div>
                <div className="bg-cream p-6 rounded-xl">
                  <h3 className="font-heading text-warm-brown mb-2">Pickup & Delivery</h3>
                  <p className="text-charcoal-400 text-sm mb-4">
                    We offer free pickup at our ranch in Yucca Valley. Delivery is available
                    within a 25-mile radius for a small fee.
                  </p>
                  <p className="text-charcoal-400 text-sm">
                    <strong>Pickup Hours:</strong> By appointment, typically available
                    Wednesday-Sunday, 9am-5pm.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section bg-cream">
          <div className="container-custom">
            <h2 className="section-title text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  className="bg-white p-6 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <h3 className="font-heading text-warm-brown mb-2">{faq.question}</h3>
                  <p className="text-charcoal-400">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
