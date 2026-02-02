import { Metadata } from "next";
import prisma from "@/lib/db";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Besso Ranch, our sustainable farming practices, and the family behind the farm in Yucca Valley, California.",
};

export const dynamic = 'force-dynamic';

async function getAboutSettings() {
  const settings = await prisma.setting.findMany({
    where: {
      key: { startsWith: 'about_' },
    },
  });

  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
}

export default async function AboutPage() {
  const settings = await getAboutSettings();

  return <AboutPageClient settings={settings} />;
}
