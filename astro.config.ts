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
import remarkBreaks from 'remark-breaks'; // ✅ Importato per evitare problemi con il Markdown
import '@iconify/react';
import '@iconify-json/fa6-brands';
import astrowind from './vendor/integration';
import type { AstroIntegration } from 'astro';

import {
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
  lazyImagesRehypePlugin,
} from './src/utils/frontmatter';

// 🔍 Riconoscere correttamente il percorso della directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;

// ✅ Funzione per integrare script esterni in base alla configurazione
const whenExternalScripts = (
  items: (() => AstroIntegration) | (() => AstroIntegration)[]
) =>
  hasExternalScripts
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

export default defineConfig({
  output: 'server', // ✅ Necessario per il deploy su Vercel
  adapter: vercel(),

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
    remarkPlugins: [readingTimeRemarkPlugin, remarkBreaks], // ✅ Aggiunto `remark-breaks` per correggere problemi di formattazione Markdown
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
