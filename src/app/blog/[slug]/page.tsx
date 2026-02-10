import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/db";
import { Header, Footer } from "@/components/layout";
import BlogPostClient from "./BlogPostClient";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.metaTitle || `${post.title} | Besso Ranch Farm Journal`,
    description: post.metaDescription || post.excerpt || `${post.title} — from the Besso Ranch Farm Journal`,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <BlogPostClient post={post} />
      </main>
      <Footer />
    </>
  );
}
