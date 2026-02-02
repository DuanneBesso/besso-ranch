"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { EditableText, EditableImage } from "@/components/editing";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  publishedAt: Date | null;
  featuredImage: string | null;
}

interface BlogPageClientProps {
  posts: Post[];
  settings: Record<string, string>;
}

const categories = [
  { id: "all", name: "All Posts" },
  { id: "farm-updates", name: "Farm Updates" },
  { id: "animal-spotlights", name: "Animal Spotlights" },
  { id: "seasonal-guides", name: "Seasonal Guides" },
  { id: "recipes", name: "Recipes" },
  { id: "behind-the-scenes", name: "Behind the Scenes" },
];

export default function BlogPageClient({ posts, settings }: BlogPageClientProps) {
  // Hero settings
  const heroAccent = settings.blog_hero_accent || "Stories from the Ranch";
  const heroTitle = settings.blog_hero_title || "Farm Journal";
  const heroSubtitle = settings.blog_hero_subtitle || "Updates, guides, recipes, and stories from our sustainable farm in the California High Desert.";

  // Newsletter settings
  const newsletterTitle = settings.blog_newsletter_title || "Never Miss a Post";
  const newsletterSubtitle = settings.blog_newsletter_subtitle || "Subscribe to our newsletter for farm updates, seasonal guides, and exclusive recipes.";

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-forest-green">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EditableText
              value={heroAccent}
              contentType="setting"
              contentId="blog_hero_accent"
              contentField="value"
              as="p"
              className="font-accent text-soft-gold text-2xl mb-4"
            />
            <EditableText
              value={heroTitle}
              contentType="setting"
              contentId="blog_hero_title"
              contentField="value"
              as="h1"
              className="font-display text-4xl md:text-5xl text-cream mb-4"
            />
            <EditableText
              value={heroSubtitle}
              contentType="setting"
              contentId="blog_hero_subtitle"
              contentField="value"
              as="p"
              className="text-cream/80 max-w-xl mx-auto"
              multiline
              useModal
            />
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-cream border-b border-warm-brown/10">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white text-charcoal hover:bg-barn-red hover:text-white transition-all"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section bg-cream">
        <div className="container-custom">
          {/* Featured Post */}
          {featuredPost && (
            <motion.article
              className="card mb-12 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto bg-sage/20 relative overflow-hidden">
                  <EditableImage
                    src={featuredPost.featuredImage || ""}
                    alt={featuredPost.title}
                    contentType="post"
                    contentId={featuredPost.id}
                    contentField="featuredImage"
                    className="absolute inset-0 w-full h-full object-cover"
                    containerClassName="absolute inset-0"
                    placeholderText="Featured Image"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    {featuredPost.category && (
                      <span className="badge-green">{featuredPost.category.replace("-", " ")}</span>
                    )}
                    {featuredPost.publishedAt && (
                      <span className="text-sm text-charcoal-400 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl text-warm-brown mb-4">
                    <Link href={`/blog/${featuredPost.slug}`} className="hover:text-barn-red transition-colors">
                      <EditableText
                        value={featuredPost.title}
                        contentType="post"
                        contentId={featuredPost.id}
                        contentField="title"
                        as="span"
                        className=""
                      />
                    </Link>
                  </h2>
                  <EditableText
                    value={featuredPost.excerpt || ""}
                    contentType="post"
                    contentId={featuredPost.id}
                    contentField="excerpt"
                    as="p"
                    className="text-charcoal-400 mb-6"
                    multiline
                    useModal
                  />
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center text-barn-red font-medium hover:gap-3 gap-2 transition-all"
                  >
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          )}

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Image */}
                <div className="aspect-video bg-sage/20 relative overflow-hidden">
                  <EditableImage
                    src={post.featuredImage || ""}
                    alt={post.title}
                    contentType="post"
                    contentId={post.id}
                    contentField="featuredImage"
                    className="absolute inset-0 w-full h-full object-cover"
                    containerClassName="absolute inset-0"
                    placeholderText="Photo"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && (
                      <span className="text-xs uppercase tracking-wider text-forest-green font-medium">
                        {post.category.replace("-", " ")}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-lg text-warm-brown mb-2 line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-barn-red transition-colors">
                      <EditableText
                        value={post.title}
                        contentType="post"
                        contentId={post.id}
                        contentField="title"
                        as="span"
                        className=""
                      />
                    </Link>
                  </h3>
                  <EditableText
                    value={post.excerpt || ""}
                    contentType="post"
                    contentId={post.id}
                    contentField="excerpt"
                    as="p"
                    className="text-sm text-charcoal-400 line-clamp-3 mb-4"
                    multiline
                    useModal
                  />
                  <div className="flex items-center justify-between">
                    {post.publishedAt && (
                      <span className="text-xs text-charcoal-400">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm text-barn-red font-medium hover:underline"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          {posts.length > 6 && (
            <div className="text-center mt-12">
              <button className="btn-outline">Load More Posts</button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-barn-red">
        <div className="container-custom text-center">
          <EditableText
            value={newsletterTitle}
            contentType="setting"
            contentId="blog_newsletter_title"
            contentField="value"
            as="h2"
            className="font-display text-3xl text-cream mb-4"
          />
          <EditableText
            value={newsletterSubtitle}
            contentType="setting"
            contentId="blog_newsletter_subtitle"
            contentField="value"
            as="p"
            className="text-cream/80 mb-6 max-w-md mx-auto"
            multiline
            useModal
          />
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-cream/20 text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-soft-gold"
            />
            <button className="px-6 py-3 bg-soft-gold text-warm-brown font-semibold rounded-lg hover:bg-soft-gold-300 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
