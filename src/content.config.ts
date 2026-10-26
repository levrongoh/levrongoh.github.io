import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { site } from './site.config';

const coords = z.tuple([z.number(), z.number()]); // [latitude, longitude]

// Journal: one Markdown file per trip or encounter, in src/content/journal/
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      location: z.string(),
      country: z.string().optional(),
      coords: coords.optional(),
      cover: image().optional(),
      summary: z.string(),
      draft: z.boolean().default(false),
    }),
});

// Photos: one image + one .yaml file per photo, in src/content/photos/
// (`npm run add-photo` creates both for you).
const photos = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/photos' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      alt: z.string().optional(),
      category: z.enum(site.categories as [string, ...string[]]).default('Other'),
      species: z.string().optional(),
      scientific: z.string().optional(),
      date: z.coerce.date(),
      location: z.string(),
      country: z.string().optional(),
      coords: coords.optional(),
      trip: reference('journal').optional(),
      story: z.string().optional(),
      camera: z.string().optional(),
      lens: z.string().optional(),
      settings: z.string().optional(), // e.g. "600mm · f/6.3 · 1/500s · ISO 1600"
      featured: z.boolean().default(false),
      rating: z.number().int().min(0).max(5).default(0), // 1–5 stars; higher shows first
      hidden: z.boolean().default(false), // true = keep the file but don't show it on the site
      sample: z.boolean().default(false),
    }),
});

export const collections = { journal, photos };
