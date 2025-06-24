import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { defineConfig } from 'astro/config';
import type { AstroIntegration } from 'astro';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import react from '@astrojs/react';
import preact from '@astrojs/preact';
import remarkBreaks from 'remark-breaks';
import 'dotenv/config';
import '@iconify/react';
import '@iconify-json/fa6-brands';
import astrowind from './vendor/integration';

import {
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
  lazyImagesRehypePlugin,
} from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hasExternalScripts = true;
const whenExternalScripts = (
  items: (() => AstroIntegration) | Array<() => AstroIntegration>
) =>
  hasExternalScripts
    ? (Array.isArray(items) ? items.map((f) => f()) : [items()])
    : [];

export default defineConfig({
  output: 'server',
  adapter: vercel(),

  integrations: [
    preact({ include: ['src/components/preact/**/*.{js,jsx,ts,tsx}'] }),
    react({ exclude: ['src/components/preact/**/*.{js,jsx,ts,tsx}'] }),
    tailwind({ applyBaseStyles: false }),
    mdx(),
    icon({
      include: { tabler: ['*'], 'flat-color-icons': ['*'], 'fa6-brands': ['*'] },
    }),
    ...whenExternalScripts(() => partytown({ config: { forward: ['dataLayer.push'] } })),
    compress({
      CSS: true,
      HTML: { 'html-minifier-terser': { removeAttributeQuotes: false } },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),
    astrowind({ config: './src/config.yaml' }),
    // sitemap(),
  ],

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin, remarkBreaks],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

vite: {
  resolve: {},        // NESSUN alias!
  esbuild: {
    tsconfigRaw: readFileSync(
      path.resolve(__dirname, 'tsconfig.json'),
      'utf-8'
    ),
  },
},

  site: 'https://lswebagency.com',

  headScripts: [
    {
      children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);} 
        function loadAnalytics() {
          if (localStorage.getItem("cookiesAccepted") === "true") {
            let s = document.createElement("script");
            s.src = "https://www.googletagmanager.com/gtag/js?id=G-FX8HDJJM7B";
            s.async = true;
            document.head.appendChild(s);
            s.onload = () => {
              gtag('js', new Date());
              gtag('config', 'G-FX8HDJJM7B', { anonymize_ip: true });
            };
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