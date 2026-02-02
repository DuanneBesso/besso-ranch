import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import prisma from "@/lib/db";
import ContactPageClient from "./ContactPageClient";

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

  return (
    <>
      <Header />
      <main className="pt-20">
        <ContactPageClient settings={settings} />
      </main>
      <Footer />
    </>
  );
}
