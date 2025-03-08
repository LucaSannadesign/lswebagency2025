import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import react from '@astrojs/react';
import '@iconify/react';
import '@iconify-json/fa6-brands';
import astrowind from './vendor/integration';
import type { AstroIntegration } from 'astro';
import crypto from 'crypto';

import {
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
  lazyImagesRehypePlugin,
} from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;

// Genera un nonce sicuro per la CSP
const generateNonce = () => crypto.randomBytes(16).toString('base64');

const nonce = generateNonce();

// Funzione per gestire l'integrazione di script esterni
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

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': ['*'],
        'fa6-brands': ['*'],
      },
    }),
    react(),

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
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    server: {
      headers: {
        "Content-Security-Policy": `
          default-src 'self'; 
          script-src 'self' 'nonce-${nonce}' https://trusted-cdn.com; 
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
          img-src 'self' data: https://trusted-images.com https://maps.gstatic.com; 
          font-src 'self' https://fonts.gstatic.com; 
          frame-src https://www.google.com https://maps.google.com;
        `.replace(/\s+/g, ' '), // Rimuove spazi extra
      },
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
