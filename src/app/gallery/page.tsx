import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import prisma from "@/lib/db";
import GalleryPageClient from "./GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery | Besso Ranch",
  description: "Photos from life on the ranch — our animals, the land, and the beauty of the California High Desert.",
};

export const dynamic = 'force-dynamic';

async function getInstagramPosts() {
  return prisma.instagramPost.findMany({
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

  // Also fetch the Instagram profile URL for the CTA
  const profileUrl = await prisma.setting.findUnique({
    where: { key: 'instagram_profile_url' },
  });

  const settingsMap = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  if (profileUrl) {
    settingsMap.instagram_profile_url = profileUrl.value;
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
