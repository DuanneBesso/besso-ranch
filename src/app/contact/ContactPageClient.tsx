"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { EditableText, EditableImage } from "@/components/editing";

interface ContactPageClientProps {
  settings: Record<string, string>;
}

export default function ContactPageClient({ settings }: ContactPageClientProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Hero settings
  const heroAccent = settings.contact_hero_accent || "Get in Touch";
  const heroTitle = settings.contact_hero_title || "Contact Us";
  const heroSubtitle = settings.contact_hero_subtitle || "Have questions about our products, want to schedule a pickup, or just want to say hello? We'd love to hear from you.";

  // Contact info from settings
  const contactEmail = settings.contact_email || "hello@bessoranch.com";
  const contactPhone = settings.contact_phone || "(760) 555-1234";
  const contactLocation = settings.contact_location || "Yucca Valley, CA 92284";
  const contactHours = settings.contact_hours || "By appointment";

  // Map section
  const mapImage = settings.contact_map_image || "";
  const pickupTitle = settings.contact_pickup_title || "Pickup & Delivery";
  const pickupText = settings.contact_pickup_text || "We offer free pickup at our ranch in Yucca Valley. Delivery is available within a 25-mile radius for a small fee.";
  const pickupHours = settings.contact_pickup_hours || "Pickup Hours: By appointment, typically available Wednesday-Sunday, 9am-5pm.";

  // FAQ section
  const faqTitle = settings.contact_faq_title || "Frequently Asked Questions";
  const faq1Question = settings.contact_faq1_question || "Do you offer farm tours?";
  const faq1Answer = settings.contact_faq1_answer || "Yes! We offer tours by appointment. Contact us to schedule a visit and meet our animals.";
  const faq2Question = settings.contact_faq2_question || "What is your delivery radius?";
  const faq2Answer = settings.contact_faq2_answer || "We deliver within 25 miles of Yucca Valley, including Joshua Tree and Twentynine Palms. Free local pickup is always available.";
  const faq3Question = settings.contact_faq3_question || "Can I reserve eggs weekly?";
  const faq3Answer = settings.contact_faq3_answer || "Absolutely! We offer standing orders for regular customers. Contact us to set up a recurring delivery or pickup schedule.";
  const faq4Question = settings.contact_faq4_question || "Do you sell to restaurants?";
  const faq4Answer = settings.contact_faq4_answer || "Yes, we work with several local restaurants and cafes. Reach out to discuss wholesale pricing and availability.";

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: contactEmail,
      href: `mailto:${contactEmail}`,
      settingKey: "contact_email",
    },
    {
      icon: Phone,
      title: "Phone",
      value: contactPhone,
      href: `tel:${contactPhone.replace(/[^0-9+]/g, '')}`,
      settingKey: "contact_phone",
    },
    {
      icon: MapPin,
      title: "Location",
      value: contactLocation,
      href: null,
      settingKey: "contact_location",
    },
    {
      icon: Clock,
      title: "Hours",
      value: contactHours,
      href: null,
      settingKey: "contact_hours",
    },
  ];

  const faqs = [
    { question: faq1Question, answer: faq1Answer, qKey: "contact_faq1_question", aKey: "contact_faq1_answer" },
    { question: faq2Question, answer: faq2Answer, qKey: "contact_faq2_question", aKey: "contact_faq2_answer" },
    { question: faq3Question, answer: faq3Answer, qKey: "contact_faq3_question", aKey: "contact_faq3_answer" },
    { question: faq4Question, answer: faq4Answer, qKey: "contact_faq4_question", aKey: "contact_faq4_answer" },
  ];

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
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${settings.contact_hero_image || '/images/hero-contact.jpg'})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-warm-brown/90 via-warm-brown/75 to-forest-green/80" />
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EditableText
              value={heroAccent}
              contentType="setting"
              contentId="contact_hero_accent"
              contentField="value"
              as="p"
              className="font-accent text-soft-gold text-2xl mb-4"
            />
            <EditableText
              value={heroTitle}
              contentType="setting"
              contentId="contact_hero_title"
              contentField="value"
              as="h1"
              className="font-display text-4xl md:text-5xl text-cream mb-4"
            />
            <EditableText
              value={heroSubtitle}
              contentType="setting"
              contentId="contact_hero_subtitle"
              contentField="value"
              as="p"
              className="text-cream/80 max-w-xl mx-auto"
              multiline
              useModal
            />
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
                    <EditableText
                      value={info.value}
                      contentType="setting"
                      contentId={info.settingKey}
                      contentField="value"
                      as="span"
                      className=""
                    />
                  </a>
                ) : (
                  <EditableText
                    value={info.value}
                    contentType="setting"
                    contentId={info.settingKey}
                    contentField="value"
                    as="p"
                    className="text-charcoal-400"
                  />
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
              <div className="aspect-square bg-sage/20 rounded-xl overflow-hidden mb-6 relative">
                <EditableImage
                  src={mapImage || ""}
                  alt="Map showing Besso Ranch location"
                  contentType="setting"
                  contentId="contact_map_image"
                  contentField="value"
                  className="absolute inset-0 w-full h-full object-cover"
                  containerClassName="absolute inset-0"
                  placeholderText="Add Map Image"
                />
              </div>
              <div className="bg-cream p-6 rounded-xl">
                <EditableText
                  value={pickupTitle}
                  contentType="setting"
                  contentId="contact_pickup_title"
                  contentField="value"
                  as="h3"
                  className="font-heading text-warm-brown mb-2"
                />
                <EditableText
                  value={pickupText}
                  contentType="setting"
                  contentId="contact_pickup_text"
                  contentField="value"
                  as="p"
                  className="text-charcoal-400 text-sm mb-4"
                  multiline
                  useModal
                />
                <EditableText
                  value={pickupHours}
                  contentType="setting"
                  contentId="contact_pickup_hours"
                  contentField="value"
                  as="p"
                  className="text-charcoal-400 text-sm"
                  multiline
                  useModal
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-cream">
        <div className="container-custom">
          <EditableText
            value={faqTitle}
            contentType="setting"
            contentId="contact_faq_title"
            contentField="value"
            as="h2"
            className="section-title text-center mb-12"
          />
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.qKey}
                className="bg-white p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <EditableText
                  value={faq.question}
                  contentType="setting"
                  contentId={faq.qKey}
                  contentField="value"
                  as="h3"
                  className="font-heading text-warm-brown mb-2"
                />
                <EditableText
                  value={faq.answer}
                  contentType="setting"
                  contentId={faq.aKey}
                  contentField="value"
                  as="p"
                  className="text-charcoal-400"
                  multiline
                  useModal
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
