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
import preact from '@astrojs/preact'; // ✅ Corretta la posizione di Preact
import remarkBreaks from 'remark-breaks'; // ✅ Evita problemi con Markdown
import '@iconify/react';
import '@iconify-json/fa6-brands';
import astrowind from './vendor/integration';
import type { AstroIntegration } from 'astro';

import {
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
  lazyImagesRehypePlugin,
} from './src/utils/frontmatter';

// 🔍 Riconoscere il percorso della directory attuale
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;

// ✅ Funzione per aggiungere script esterni in base alla configurazione
const whenExternalScripts = (
  items: (() => AstroIntegration) | (() => AstroIntegration)[]
) =>
  hasExternalScripts
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

export default defineConfig({
  output: 'server', // ✅ Configurazione richiesta per il deploy su Vercel
  adapter: vercel(),

  integrations: [
    preact(), // ✅ Corretto l'inserimento di Preact
    react(), // ✅ Assicura compatibilità con React
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

    // ✅ Integrazione di Partytown per migliorare le performance
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
    remarkPlugins: [readingTimeRemarkPlugin, remarkBreaks], // ✅ Evita problemi di formattazione nel Markdown
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
