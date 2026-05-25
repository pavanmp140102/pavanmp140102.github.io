import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://pavanmp140102.github.io',
  integrations: [tailwind()],
});
