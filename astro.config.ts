// astro.config.mjs
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

// Adapter e integrazioni Astro
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import preact from '@astrojs/preact';
import icon from 'astro-icon';
import compress from 'astro-compress';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import astrowind from './vendor/integration';

import remarkBreaks from 'remark-breaks';
import {
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
  lazyImagesRehypePlugin,
} from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hasExternalScripts = true;
const whenExternalScripts = (items) =>
  hasExternalScripts
    ? (Array.isArray(items) ? items.map((f) => f()) : [items()])
    : [];

export default defineConfig({
  output: 'server',
  adapter: vercel(),

  site: 'https://lswebagency.com',

  integrations: [
    preact(),
    react(),
    tailwind({ applyBaseStyles: false }),
    mdx(),
    icon({
      include: { tabler: ['*'], 'flat-color-icons': ['*'], 'fa6-brands': ['*'] },
    }),
    ...whenExternalScripts(() =>
      partytown({ config: { forward: ['dataLayer.push'] } })
    ),
    compress({
      CSS: true,
      HTML: { 'html-minifier-terser': { removeAttributeQuotes: false } },
      JavaScript: true,
      Image: false,
      SVG: false,
      Logger: 1,
    }),
    astrowind({ config: './src/config.yaml' }),
    sitemap(),
  ],

  markdown: {
    remarkPlugins: [
      readingTimeRemarkPlugin,
      remarkBreaks,
    ],
    rehypePlugins: [
      responsiveTablesRehypePlugin,
      lazyImagesRehypePlugin,
    ],
  },

vite: {
  resolve: {
    alias: { '~': path.resolve(__dirname, './src') },
  },
  // rimosso il blocco esbuild.tsconfig perché non valido
},

  headScripts: [
    {
      children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        function loadAnalytics() {
          if (localStorage.getItem("cookiesAccepted")==="true") {
            const s=document.createElement("script");
            s.src="https://www.googletagmanager.com/gtag/js?id=G-FX8HDJJM7B";
            s.async=true;document.head.appendChild(s);
            s.onload=()=>{gtag('js',new Date());gtag('config','G-FX8HDJJM7B',{anonymize_ip:true});};
          }
        }
        document.addEventListener("DOMContentLoaded", loadAnalytics);
      `,
    },
  ],

  scripts: [
    {
      type: 'text/javascript',
      src: 'https://www.googletagmanager.com/gtag/js?id=G-FX8HDJJM7B',
      async: true,
      defer: true,
    },
  ],
});