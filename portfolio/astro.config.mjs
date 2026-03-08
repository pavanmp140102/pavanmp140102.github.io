import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://pavanpatil.github.io',
  base: '/Webpage/',
  integrations: [tailwind()],
});
