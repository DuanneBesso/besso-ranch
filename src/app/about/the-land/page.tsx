import prisma from "@/lib/db";
import TheLandClient from "./TheLandClient";

export const dynamic = 'force-dynamic';

async function getSettings() {
  const settings = await prisma.setting.findMany({
    where: {
      key: { startsWith: 'land_' },
    },
  });

  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
}

export default async function TheLandPage() {
  const settings = await getSettings();
  return <TheLandClient settings={settings} />;
}
