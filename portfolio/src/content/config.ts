import { defineCollection, z } from 'astro:content';

const experienceCollection = defineCollection({
  type: 'content',
  schema: z.object({
    role: z.string(),
    company: z.string(),
    duration: z.string(),
    startDate: z.string(),
    description: z.string(),
  }),
});

const projectCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.string(),
    github: z.string(),
    image: z.string(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
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
