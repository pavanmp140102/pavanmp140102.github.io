import { getCollection } from 'astro:content';

export async function getSortedBlogs() {
  return (await getCollection('blogs')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function getReadingTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}
