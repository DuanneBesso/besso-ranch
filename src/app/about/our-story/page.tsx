import prisma from "@/lib/db";
import OurStoryClient from "./OurStoryClient";

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
