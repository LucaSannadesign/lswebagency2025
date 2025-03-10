import defaultTheme from 'tailwindcss/defaultTheme.js';
import plugin from 'tailwindcss/plugin.js';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // 🔹 Attiva il Dark Mode basato sulle classi

  theme: {
    extend: {
      colors: {
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
        default: 'var(--aw-color-text-default)',
        muted: 'var(--aw-color-text-muted)',
        page: 'var(--aw-color-bg-page)',
        pageDark: 'var(--aw-color-bg-page-dark)',
      },

      fontFamily: {
        sans: ['var(--aw-font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif, ui-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
      },

      fontSize: {
        default: '1.2rem',
        lg: '1.5rem',
      },
    },
  },

  plugins: [
    typographyPlugin,
    plugin(({ addVariant }) => {
      addVariant('intersect', '&:not([no-intersect])');
      addVariant('motion-safe', '@media (prefers-reduced-motion: no-preference)');
    }),
  ],

  safelist: [
    'bg-page', 'dark:bg-pageDark',
    'text-muted', 'dark:text-gray-400',
  ],

  important: true, // 🔹 Impedisce a stili esterni di sovrascrivere Tailwind
};
