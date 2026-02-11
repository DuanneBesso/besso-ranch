import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import prisma from "@/lib/db";
import GalleryPageClient from "./GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from life on the ranch — our animals, the land, and the beauty of the California High Desert.",
};

export const dynamic = 'force-dynamic';

async function getInstagramPosts() {
  return prisma.instagramPost.findMany({
    where: { hidden: false },
    orderBy: { timestamp: 'desc' },
    take: 30,
  });
}

async function getGallerySettings() {
  const settings = await prisma.setting.findMany({
    where: {
      key: { startsWith: 'gallery_' },
    },
  });

  // Also fetch social profile URLs for the CTA
  const socialSettings = await prisma.setting.findMany({
    where: {
      key: { in: ['instagram_profile_url', 'facebook_profile_url'] },
    },
  });

  const settingsMap = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  for (const s of socialSettings) {
    settingsMap[s.key] = s.value;
  }

  return settingsMap;
}

export default async function GalleryPage() {
  const [posts, settings] = await Promise.all([
    getInstagramPosts(),
    getGallerySettings(),
  ]);

  return (
    <>
      <Header />
      <main className="pt-20">
        <GalleryPageClient posts={posts} settings={settings} />
      </main>
      <Footer />
    </>
  );
}
