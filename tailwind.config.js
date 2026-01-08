import defaultTheme from 'tailwindcss/defaultTheme.js';
import plugin from 'tailwindcss/plugin.js';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
        default: 'var(--aw-color-text-default)',
        muted: 'var(--aw-color-text-muted)',
        brand: {
          purple: 'rgb(var(--brand-purple) / <alpha-value>)',
          blue: 'rgb(var(--brand-blue) / <alpha-value>)',
          ink: 'rgb(var(--brand-ink) / <alpha-value>)',
          surface: 'rgb(var(--brand-surface) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--aw-font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif, ui-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
      },

      animation: {
        fade: 'fadeInUp 1s both',
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(2rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },

      /** 🔥 Sovrascrive la definizione di md:text-6xl */
      fontSize: {
        '6xl': ['3.75rem', { lineHeight: '1.2' }], // ✅ Tailwind ora usa line-height 1.2 per text-6xl
      },
    },
  },
  plugins: [
    typographyPlugin,
    plugin(({ addBase }) => {
      addBase({
        'h1': {
          lineHeight: '1.2', // ✅ Forza l'interlinea per tutti gli H1
        },
      });
    }),
  ],
  darkMode: 'class',
};
