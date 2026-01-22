export default {
  name: 'animal',
  title: 'Animal',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'type',
      title: 'Animal Type',
      type: 'string',
      options: {
        list: [
          { title: 'Chicken', value: 'chicken' },
          { title: 'Duck', value: 'duck' },
          { title: 'Turkey', value: 'turkey' },
          { title: 'Goose', value: 'goose' },
          { title: 'Goat', value: 'goat' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'breed',
      title: 'Breed',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'role',
      title: 'Role on Farm',
      type: 'string',
      description: 'e.g., "Egg layer", "Breeding", "Milk production"',
    },
    {
      name: 'products',
      title: 'Related Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'breed',
      media: 'image',
    },
  },
};
