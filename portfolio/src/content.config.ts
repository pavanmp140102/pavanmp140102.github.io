import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const experienceCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experiences' }),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    duration: z.string(),
    startDate: z.string(),
    description: z.string().optional(),
  }),
});

const projectCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.string(),
    github: z.url(),
    image: z.string(),
    featured: z.boolean().optional().default(false),
    order: z.number().optional().default(100),
    liveUrl: z.url().optional(),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blogs' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  experiences: experienceCollection,
  projects: projectCollection,
  blogs: blogCollection,
};
