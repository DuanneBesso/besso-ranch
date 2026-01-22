import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'besso-ranch',
  title: 'Besso Ranch',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
});
