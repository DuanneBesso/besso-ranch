"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Calendar, ArrowLeft, Tag } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  tags: string | null;
  featuredImage: string | null;
  published: boolean;
  publishedAt: Date | null;
}

export default function BlogPostClient({ post }: { post: Post }) {
  const tags: string[] = post.tags ? JSON.parse(post.tags) : [];

  return (
    <>
      {/* Hero / Featured Image */}
      {post.featuredImage ? (
        <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.featuredImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/80 via-warm-brown/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {post.category && (
                  <span className="badge-green mb-3 inline-block">
                    {post.category.replace(/-/g, " ")}
                  </span>
                )}
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream">
                  {post.title}
                </h1>
              </motion.div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative py-16 bg-gradient-to-br from-forest-green/90 via-forest-green/75 to-warm-brown/80">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {post.category && (
                <span className="badge-green mb-3 inline-block">
                  {post.category.replace(/-/g, " ")}
                </span>
              )}
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream">
                {post.title}
              </h1>
            </motion.div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <article className="section bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-warm-brown/10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm text-barn-red hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Farm Journal
              </Link>
              {post.publishedAt && (
                <span className="text-sm text-charcoal-400 flex items-center gap-1 ml-auto">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Markdown content */}
            <div className="prose prose-lg prose-warm-brown max-w-none
              prose-headings:font-display prose-headings:text-warm-brown
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-charcoal-400 prose-p:leading-relaxed
              prose-a:text-barn-red prose-a:no-underline hover:prose-a:underline
              prose-strong:text-warm-brown
              prose-li:text-charcoal-400
              prose-img:rounded-xl prose-img:shadow-md
            ">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-warm-brown/10">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-charcoal-400" />
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-white px-3 py-1 rounded-full text-charcoal-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="btn-outline inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                More from the Farm Journal
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
