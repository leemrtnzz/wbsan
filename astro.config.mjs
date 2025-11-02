// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import solidJs from '@astrojs/solid-js';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://wbsan.vercel.app',

  vite: {
      plugins: [tailwindcss()],
  },

  integrations: [mdx(), sitemap(), react(), solidJs()],
  adapter: vercel(),
});