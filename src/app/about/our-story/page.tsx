import { Metadata } from "next";
import prisma from "@/lib/db";
import OurStoryClient from "./OurStoryClient";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Besso Ranch in Yucca Valley, CA grew from a dream into a thriving sustainable family farm raising poultry and goats in the high desert.",
};

export const dynamic = 'force-dynamic';

async function getSettings() {
  const settings = await prisma.setting.findMany({
    where: {
      key: { startsWith: 'story_' },
    },
  });

  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
}

export default async function OurStoryPage() {
  const settings = await getSettings();
  return <OurStoryClient settings={settings} />;
}
