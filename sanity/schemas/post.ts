export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Brief summary for previews',
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Farm Updates', value: 'farm-updates' },
          { title: 'Animal Spotlights', value: 'animal-spotlights' },
          { title: 'Seasonal Guides', value: 'seasonal-guides' },
          { title: 'Recipes', value: 'recipes' },
          { title: 'Sustainable Living', value: 'sustainable-living' },
          { title: 'Behind the Scenes', value: 'behind-the-scenes' },
        ],
      },
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
};
