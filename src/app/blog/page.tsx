"use client";

import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

// Mock blog posts - will be replaced with Sanity data
const posts = [
  {
    id: 1,
    slug: "raising-chickens-in-the-desert",
    title: "Raising Chickens in the High Desert: A Complete Guide",
    excerpt: "Learn the unique challenges and rewards of keeping a backyard flock in Yucca Valley's arid climate, from water management to heat protection.",
    category: "seasonal-guides",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
  },
  {
    id: 2,
    slug: "duck-eggs-vs-chicken-eggs",
    title: "Duck Eggs vs Chicken Eggs: What's the Difference?",
    excerpt: "Discover why bakers and chefs prefer duck eggs, and how their nutritional profile compares to the humble chicken egg.",
    category: "farm-updates",
    publishedAt: "2024-01-08",
    readTime: "5 min read",
  },
  {
    id: 3,
    slug: "introducing-our-nigerian-dwarf-goats",
    title: "Meet Our Nigerian Dwarf Goats",
    excerpt: "Say hello to our newest ranch members! Learn about this wonderful dairy breed and the products they help us create.",
    category: "animal-spotlights",
    publishedAt: "2024-01-01",
    readTime: "4 min read",
  },
  {
    id: 4,
    slug: "goat-milk-soap-recipe",
    title: "How We Make Our Goat Milk Soap",
    excerpt: "Take a behind-the-scenes look at our soap-making process, from fresh goat milk to finished bar.",
    category: "behind-the-scenes",
    publishedAt: "2023-12-20",
    readTime: "6 min read",
  },
  {
    id: 5,
    slug: "winter-egg-production",
    title: "Keeping Egg Production Up During Winter",
    excerpt: "Tips and tricks for maintaining a steady egg supply through the cooler months without artificial lighting.",
    category: "seasonal-guides",
    publishedAt: "2023-12-15",
    readTime: "5 min read",
  },
  {
    id: 6,
    slug: "perfect-scrambled-eggs",
    title: "The Secret to Perfect Scrambled Eggs",
    excerpt: "Farm fresh eggs deserve the best preparation. Here's our family recipe for the creamiest scrambled eggs.",
    category: "recipes",
    publishedAt: "2023-12-10",
    readTime: "3 min read",
  },
];

const categories = [
  { id: "all", name: "All Posts" },
  { id: "farm-updates", name: "Farm Updates" },
  { id: "animal-spotlights", name: "Animal Spotlights" },
  { id: "seasonal-guides", name: "Seasonal Guides" },
  { id: "recipes", name: "Recipes" },
  { id: "behind-the-scenes", name: "Behind the Scenes" },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-16 bg-forest-green">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-accent text-soft-gold text-2xl mb-4">Stories from the Ranch</p>
              <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
                Farm Journal
              </h1>
              <p className="text-cream/80 max-w-xl mx-auto">
                Updates, guides, recipes, and stories from our sustainable farm
                in the California High Desert.
              </p>
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
            <motion.article
              className="card mb-12 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto bg-sage/20 flex items-center justify-center">
                  <span className="text-warm-brown/40 font-heading">Featured Image</span>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="badge-green">{posts[0].category.replace("-", " ")}</span>
                    <span className="text-sm text-charcoal-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(posts[0].publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl text-warm-brown mb-4">
                    <Link href={`/blog/${posts[0].slug}`} className="hover:text-barn-red transition-colors">
                      {posts[0].title}
                    </Link>
                  </h2>
                  <p className="text-charcoal-400 mb-6">{posts[0].excerpt}</p>
                  <Link
                    href={`/blog/${posts[0].slug}`}
                    className="inline-flex items-center text-barn-red font-medium hover:gap-3 gap-2 transition-all"
                  >
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.article>

            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(1).map((post, index) => (
                <motion.article
                  key={post.id}
                  className="card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Image */}
                  <div className="aspect-video bg-sage/20 flex items-center justify-center">
                    <span className="text-warm-brown/40 font-heading text-sm">Photo</span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs uppercase tracking-wider text-forest-green font-medium">
                        {post.category.replace("-", " ")}
                      </span>
                      <span className="text-xs text-charcoal-300">•</span>
                      <span className="text-xs text-charcoal-400">{post.readTime}</span>
                    </div>
                    <h3 className="font-heading text-lg text-warm-brown mb-2 line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-barn-red transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-charcoal-400 line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-charcoal-400">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
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
            <div className="text-center mt-12">
              <button className="btn-outline">Load More Posts</button>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-barn-red">
          <div className="container-custom text-center">
            <h2 className="font-display text-3xl text-cream mb-4">Never Miss a Post</h2>
            <p className="text-cream/80 mb-6 max-w-md mx-auto">
              Subscribe to our newsletter for farm updates, seasonal guides, and exclusive recipes.
            </p>
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
      </main>
      <Footer />
    </>
  );
}
