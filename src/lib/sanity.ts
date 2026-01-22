import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});

const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

// Queries
export const queries = {
  // Products
  allProducts: `*[_type == "product"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    price,
    unit,
    category,
    images,
    inStock,
    stockQuantity
  }`,

  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    price,
    unit,
    category,
    images,
    inStock,
    stockQuantity,
    specifications
  }`,

  productsByCategory: `*[_type == "product" && category == $category] | order(name asc) {
    _id,
    name,
    slug,
    description,
    price,
    unit,
    category,
    images,
    inStock,
    stockQuantity
  }`,

  // Blog posts
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    categories
  }`,

  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    mainImage,
    publishedAt,
    categories
  }`,

  // Animals
  allAnimals: `*[_type == "animal"] | order(name asc) {
    _id,
    name,
    slug,
    breed,
    description,
    image,
    role
  }`,
};
