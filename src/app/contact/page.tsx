import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import prisma from "@/lib/db";
import ContactPageClient from "./ContactPageClient";
import { faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact Us | Besso Ranch",
  description: "Get in touch with Besso Ranch. Questions about products, farm tours, or wholesale inquiries - we'd love to hear from you.",
};

export const dynamic = 'force-dynamic';

async function getContactSettings() {
  const settings = await prisma.setting.findMany({
    where: {
      key: { startsWith: 'contact_' },
    },
  });

  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
}

export default async function ContactPage() {
  const settings = await getContactSettings();

  const faqs = [
    {
      question: settings.contact_faq1_question || "Do you offer farm tours?",
      answer: settings.contact_faq1_answer || "Yes! We offer tours by appointment. Contact us to schedule a visit and meet our animals.",
    },
    {
      question: settings.contact_faq2_question || "What is your delivery radius?",
      answer: settings.contact_faq2_answer || "We deliver within 25 miles of Yucca Valley, including Joshua Tree and Twentynine Palms. Free local pickup is always available.",
    },
    {
      question: settings.contact_faq3_question || "Can I reserve eggs weekly?",
      answer: settings.contact_faq3_answer || "Absolutely! We offer standing orders for regular customers. Contact us to set up a recurring delivery or pickup schedule.",
    },
    {
      question: settings.contact_faq4_question || "Do you sell to restaurants?",
      answer: settings.contact_faq4_answer || "Yes, we work with several local restaurants and cafes. Reach out to discuss wholesale pricing and availability.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs)) }}
      />
      <Header />
      <main className="pt-20">
        <ContactPageClient settings={settings} />
      </main>
      <Footer />
    </>
  );
}
