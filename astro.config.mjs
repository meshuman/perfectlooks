// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import serviceWorker from './integrations/service-worker.mjs';

// TODO: replace with the real domain once it is chosen.
const SITE = 'https://perfectlooks.example';

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: {
    // /styles is built as styles.html, not styles/index.html. Hosts such as Cloudflare Pages
    // then serve /styles directly instead of redirecting to /styles/ first.
    format: 'file',
  },
  // Start loading a page when its link is touched or hovered, so taps feel instant.
  prefetch: { defaultStrategy: 'hover', prefetchAll: true },
  integrations: [
    preact(),
    sitemap({
      filter: (page) => !/\/(about-you|favourites|my-look|barber-card|feedback|offline|dev)(\/|$)/.test(page),
      // Language versions (/ne/..., /hi/...) are linked to each other in the sitemap.
      i18n: { defaultLocale: 'en', locales: { en: 'en', ne: 'ne-NP', hi: 'hi-IN' } },
    }),
    serviceWorker(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
