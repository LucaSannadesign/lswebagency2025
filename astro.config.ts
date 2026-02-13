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

// attiva/disattiva caricamento script esterni con Partytown
const hasExternalScripts = false;
const whenExternalScripts = (items: () => any | Array<() => any>) =>
  hasExternalScripts
    ? (Array.isArray(items) ? items.map((fn) => fn()) : [items()])
    : [];

export default defineConfig({
  output: 'server',
  adapter: vercel({ mode: 'serverless' }),

  site: 'https://www.lswebagency.com',
  trailingSlash: 'never',

  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    mdx(),

    icon({
      iconDir: 'src/icons',
      include: { local: ['*'], tabler: ['*'] },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: {
          forward: ['dataLayer.push'],
        },
      })
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
});