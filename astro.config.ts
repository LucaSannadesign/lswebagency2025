import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
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
import '@iconify/react';
import '@iconify-json/fa6-brands';
import astrowind from './vendor/integration';
import type { AstroIntegration } from 'astro';
import 'dotenv/config';

import {
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
  lazyImagesRehypePlugin,
} from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = true;

const whenExternalScripts = (
  items: (() => AstroIntegration) | (() => AstroIntegration)[]
) =>
  hasExternalScripts
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

export default defineConfig({
  output: 'static',
  adapter: vercel(),

  integrations: [
    preact(),
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
 // sitemap({
//   serialize: (page) => {
//     return page.replace('/blog/blog/', '/blog/');
//   },
// }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': ['*'],
        'fa6-brands': ['*'],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin, remarkBreaks],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
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
            let gaScript = document.createElement("script");
            gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-FX8HDJJM7B";
            gaScript.async = true;
            document.head.appendChild(gaScript);
  
            gaScript.onload = function () {
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
