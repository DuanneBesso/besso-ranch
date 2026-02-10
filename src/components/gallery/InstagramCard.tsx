"use client";

import { Play, Layers } from "lucide-react";

interface Post {
  id: string;
  caption: string | null;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string;
  timestamp: Date;
}

interface InstagramCardProps {
  post: Post;
  onClick: () => void;
}

export default function InstagramCard({ post, onClick }: InstagramCardProps) {
  const imageSrc = post.mediaType === "VIDEO" && post.thumbnailUrl
    ? post.thumbnailUrl
    : post.mediaUrl;

  return (
    <button
      onClick={onClick}
      className="relative aspect-square w-full overflow-hidden rounded-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-barn-red focus:ring-offset-2"
    >
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={post.caption ? post.caption.slice(0, 100) : "Instagram post"}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />

      {/* Media type indicator */}
      {post.mediaType === "VIDEO" && (
        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5">
          <Play className="w-4 h-4 text-white fill-white" />
        </div>
      )}
      {post.mediaType === "CAROUSEL_ALBUM" && (
        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5">
          <Layers className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
        {post.caption && (
          <p className="text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
            {post.caption}
          </p>
        )}
      </div>
    </button>
  );
}
