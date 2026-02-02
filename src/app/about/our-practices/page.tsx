import prisma from "@/lib/db";
import OurPracticesClient from "./OurPracticesClient";

export const dynamic = 'force-dynamic';

async function getSettings() {
  const settings = await prisma.setting.findMany({
    where: {
      key: { startsWith: 'practices_' },
    },
  });

  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
}

export default async function OurPracticesPage() {
  const settings = await getSettings();
  return <OurPracticesClient settings={settings} />;
}
