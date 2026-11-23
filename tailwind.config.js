import defaultTheme from 'tailwindcss/defaultTheme.js';
import plugin from 'tailwindcss/plugin.js';
import typographyPlugin from '@tailwindcss/typography';

/*
 * Redesign C.3 «Kinetic Graphite»: le palette storiche del sito vengono
 * rimappate sui token C.3, così tutte le pagine cambiano identità senza
 * riscrivere le classi una per una.
 * - viola / fucsia / rosa / porpora → «ione» (accento verde acqua)
 * - slate / gray / neutral / zinc → «grafite» (neutri caldi)
 * Contrasti verificati: testo bianco su -600 5,5:1, su -700 7,9:1.
 */
const ion = {
  50: '#EEF8F6',
  100: '#D8F0EB',
  200: '#B6E3DB',
  300: '#8FD3C8',
  400: '#5FB8AB',
  500: '#267A70',
  600: '#22756B',
  700: '#1F5A54',
  800: '#184641',
  900: '#12332F',
  950: '#0B201E',
};
const graphite = {
  50: '#F3F2EE',
  100: '#E8E6E1',
  200: '#D9D6CF',
  300: '#C9C6BF',
  400: '#9BA1A6',
  500: '#6E747A',
  600: '#4A5157',
  700: '#2B3035',
  800: '#1D2125',
  900: '#15181B',
  950: '#0D0F11',
};

export default {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        violet: ion,
        purple: ion,
        fuchsia: ion,
        pink: ion,
        slate: graphite,
        gray: graphite,
        neutral: graphite,
        zinc: graphite,
        primary: 'rgb(var(--aw-color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--aw-color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--aw-color-accent) / <alpha-value>)',
        default: 'var(--aw-color-text-default)',
        muted: 'var(--aw-color-text-muted)',
        brand: {
          purple: 'rgb(var(--brand-purple) / <alpha-value>)',
          blue: 'rgb(var(--brand-blue) / <alpha-value>)',
          ink: 'rgb(var(--brand-ink) / <alpha-value>)',
          surface: 'rgb(var(--brand-surface) / <alpha-value>)',
          magenta: 'rgb(var(--brand-magenta) / <alpha-value>)',
        },
      },
      spacing: {
        18: '4.5rem',
      },
      fontFamily: {
        sans: ['var(--aw-font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif, ui-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        display: ['"Archivo C3"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
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
