import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://coaching-sand-ten.vercel.app',
  integrations: [sitemap()],
});
