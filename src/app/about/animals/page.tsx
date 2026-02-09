import { Metadata } from "next";
import prisma from "@/lib/db";
import AnimalsPageClient from "./AnimalsPageClient";

export const metadata: Metadata = {
  title: "Our Animals | Besso Ranch",
  description: "Meet the chickens, ducks, turkeys, geese, and Nigerian Dwarf goats of Besso Ranch - our free-range family in Yucca Valley, CA.",
};

export const dynamic = 'force-dynamic';

async function getSettings() {
  const settings = await prisma.setting.findMany({
    where: {
      key: { startsWith: 'animals_page_' },
    },
  });

  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
}

export default async function AnimalsPage() {
  const settings = await getSettings();
  return <AnimalsPageClient settings={settings} />;
}
