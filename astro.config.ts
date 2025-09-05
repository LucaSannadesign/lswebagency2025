// astro.config.ts
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
const whenExternalScripts = (items: any) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((f) => f()) : [items()]) : [];

export default defineConfig({
  output: 'server',
  adapter: vercel(),

  site: 'https://lswebagency.com',

  integrations: [
    preact(),
    react(),
    tailwind({ applyBaseStyles: false }),
    mdx(),
    // 👇 astro-icon: abilita anche il set "local" (src/icons)
    icon({
      iconDir: 'src/icons',               // <— cartella icone locali (whatsapp.svg / telegram.svg)
      include: {
        local: ['*'],                     // <— carica tutte le icone locali
        tabler: ['*'],
        'flat-color-icons': ['*'],
        'fa6-brands': ['*'],
        // Se in futuro vuoi usare anche simple-icons, abilita e installa il pacchetto:
        // 'simple-icons': ['whatsapp', 'telegram', 'linkedin', 'facebook', 'instagram'],
      },
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
    remarkPlugins: [readingTimeRemarkPlugin, remarkBreaks],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // 🔧 Workaround: normalizza i virtual id che includono "@/..." o "~/".
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