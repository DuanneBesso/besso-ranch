import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import prisma from "@/lib/db";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Farm Journal | Besso Ranch",
  description: "Updates, guides, recipes, and stories from our sustainable farm in the California High Desert.",
};

export const dynamic = 'force-dynamic';

async function getBlogPosts() {
  return prisma.blogPost.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      publishedAt: true,
      featuredImage: true,
    },
  });
}

async function getBlogSettings() {
  const settings = await prisma.setting.findMany({
    where: {
      key: { startsWith: 'blog_' },
    },
  });

  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
}

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([
    getBlogPosts(),
    getBlogSettings(),
  ]);

  return (
    <>
      <Header />
      <main className="pt-20">
        <BlogPageClient posts={posts} settings={settings} />
      </main>
      <Footer />
    </>
  );
}
