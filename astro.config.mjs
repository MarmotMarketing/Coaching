import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://leadscalepro.com.au',
  base: '/marmot-coaching',
  integrations: [sitemap()],
});
