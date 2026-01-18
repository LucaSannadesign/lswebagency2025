// Updated Astro configuration file
// This version adds trailingSlash to unify URL format and retains the canonical domain.

import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

// Adapter e integrazioni Astro
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// abilita/disabilita caricamento script esterni con Partytown
// DISABILITATO: Google Analytics non è configurato (id: null), quindi Partytown non è necessario
const hasExternalScripts = false;
const whenExternalScripts = (items: () => any | Array<() => any>) =>
  hasExternalScripts
    ? (Array.isArray(items) ? items.map((fn) => fn()) : [items()])
    : [];

export default defineConfig({
  // NECESSARIO per avere le API (/api/contact, ecc.) su Vercel
  output: 'server',
  adapter: vercel({ mode: 'serverless' }),

  // Dominio canonico
  site: 'https://www.lswebagency.com',

  // Gestione degli slash finali: produce URL senza slash finale
  trailingSlash: 'never',

  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    mdx(),

    // Icone locali + Tabler
    icon({
      iconDir: 'src/icons',
      include: { local: ['*'], tabler: ['*'] },
    }),

    // Script terzi gestiti con Partytown (dopo consenso)
    ...whenExternalScripts(() =>
      partytown({
        config: {
          forward: ['dataLayer.push'],
        },
      })
    ),

    // Compressione "safe"
    compress({
      CSS: true,
      HTML: { 'html-minifier-terser': { removeAttributeQuotes: false } },
      JavaScript: true,
      Image: false,
      SVG: false,
      Logger: 1,
    }),

    // Integrazione AstroWind
    astrowind({ config: './src/config.yaml' }),

    // Sitemap coerente con `site`
    sitemap({
      serialize(item) {
        return {
          url: item.url,
          changefreq: item.changefreq ?? 'weekly',
          priority: item.priority ?? 0.7,
          lastmod: item.lastmod,
        };
      },
    }),
  ],

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin, remarkBreaks],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      {
        name: 'fix-astro-entry-alias-in-virtual-ids',
        enforce: 'pre',
        resolveId(id: string) {
          if (id.startsWith('\0astro-entry:@/')) {
            return id.replace('\0astro-entry:@/', '\0astro-entry:/src/');
          }
          if (id.startsWith('\0astro-entry:~/')) {
            return id.replace('\0astro-entry:~/', '\0astro-entry:/src/');
          }
          return null;
        },
      },
    ],
    optimizeDeps: {
      esbuildOptions: {
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      },
    },
    esbuild: {
      tsconfigRaw: { compilerOptions: {} },
    },
  },

  // GA e altri script sono gestiti dal layout globale (niente headScripts qui)
});