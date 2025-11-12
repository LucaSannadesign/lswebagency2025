// astro.config.ts
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

// Adapter e integrazioni Astro
import vercel from '@astrojs/vercel/serverless';
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hasExternalScripts = true;
const whenExternalScripts = (items: any) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((f) => f()) : [items()]) : [];

export default defineConfig({
  // Usiamo output server per avere API routes su Vercel
  output: 'server',

  // Adapter Vercel serverless (runtime Node implicito)
  // Preview: usa `vercel build && vercel serve .vercel/output`
  adapter: vercel(),

  // Dominio canonico con www
  site: 'https://www.lswebagency.com',

  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    mdx(),

    // astro-icon
    icon({
      iconDir: 'src/icons',
      include: { local: ['*'], tabler: ['*'] },
    }),

    // Caricamento script terzi dopo consenso
    ...whenExternalScripts(() =>
      partytown({ config: { forward: ['dataLayer.push'] } })
    ),

    // Compressione sicura
    compress({
      CSS: true,
      HTML: { 'html-minifier-terser': { removeAttributeQuotes: false } },
      JavaScript: true,
      Image: false,
      SVG: false,
      Logger: 1,
    }),

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
    // Workaround per virtual ids con "@/..." o "~/".
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

  // Niente headScripts/scripts qui:
  // GA è già caricato SOLO dopo consenso nel layout globale.
});