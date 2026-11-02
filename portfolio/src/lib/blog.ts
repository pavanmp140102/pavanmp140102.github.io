import { getCollection } from 'astro:content';

export async function getSortedBlogs() {
  return (await getCollection('blogs')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// Frontmatter dates parse as UTC midnight; format in UTC so the day doesn't shift with the build machine's timezone
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export function getReadingTime(body: string | undefined): string {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}
