"use client";

import { motion } from "framer-motion";
import InstagramCard from "./InstagramCard";

interface Post {
  id: string;
  caption: string | null;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string;
  timestamp: Date;
}

interface InstagramGridProps {
  posts: Post[];
  onPostClick: (index: number) => void;
}

export default function InstagramGrid({ posts, onPostClick }: InstagramGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.8) }}
        >
          <InstagramCard
            post={post}
            onClick={() => onPostClick(index)}
          />
        </motion.div>
      ))}
    </div>
  );
}
