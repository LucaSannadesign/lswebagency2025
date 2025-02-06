import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
<<<<<<< HEAD
      text: 'Homes',
      links: [
        {
          text: 'SaaS',
          href: getPermalink('/homes/saas'),
        },
        {
          text: 'Startup',
          href: getPermalink('/homes/startup'),
        },
        {
          text: 'Mobile App',
          href: getPermalink('/homes/mobile-app'),
        },
        {
          text: 'Personal',
          href: getPermalink('/homes/personal'),
        },
=======
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Chi Siamo',
      href: getPermalink('/chi-siamo'),
    },
    {
      text: 'Servizi',
      links: [
        { text: 'Web Design', href: getPermalink('/servizi/web-design') },
        { text: 'E-commerce', href: getPermalink('/servizi/ecommerce') },
        { text: 'SEO', href: getPermalink('/servizi/seo') },
        { text: 'Grafica', href: getPermalink('/servizi/grafica') },
>>>>>>> 8487b4a (Aggiornamento navigazione e struttura del portfolio)
      ],
    },
    {
      text: 'Pages',
      links: [
        {
          text: 'Features (Anchor Link)',
          href: getPermalink('/#features'),
        },
        {
          text: 'Services',
          href: getPermalink('/services'),
        },
        {
          text: 'Pricing',
          href: getPermalink('/pricing'),
        },
        {
          text: 'About us',
          href: getPermalink('/about'),
        },
        {
          text: 'Contact',
          href: getPermalink('/contact'),
        },
        {
          text: 'Terms',
          href: getPermalink('/terms'),
        },
        {
          text: 'Privacy policy',
          href: getPermalink('/privacy'),
        },
      ],
    },
    {
      text: 'Landing',
      links: [
        {
          text: 'Lead Generation',
          href: getPermalink('/landing/lead-generation'),
        },
        {
          text: 'Long-form Sales',
          href: getPermalink('/landing/sales'),
        },
        {
          text: 'Click-Through',
          href: getPermalink('/landing/click-through'),
        },
        {
          text: 'Product Details (or Services)',
          href: getPermalink('/landing/product'),
        },
        {
          text: 'Coming Soon or Pre-Launch',
          href: getPermalink('/landing/pre-launch'),
        },
        {
          text: 'Subscription',
          href: getPermalink('/landing/subscription'),
        },
      ],
    },
    {
      text: 'Blog',
<<<<<<< HEAD
      links: [
        {
          text: 'Blog List',
          href: getBlogPermalink(),
        },
        {
          text: 'Article',
          href: getPermalink('get-started-website-with-astro-tailwind-css', 'post'),
        },
        {
          text: 'Article (with MDX)',
          href: getPermalink('markdown-elements-demo-post', 'post'),
        },
        {
          text: 'Category Page',
          href: getPermalink('tutorials', 'category'),
        },
        {
          text: 'Tag Page',
          href: getPermalink('astro', 'tag'),
        },
      ],
=======
      href: getBlogPermalink(),
>>>>>>> 8487b4a (Aggiornamento navigazione e struttura del portfolio)
    },
    {
      text: 'Widgets',
      href: '#',
    },
  ],
<<<<<<< HEAD
  actions: [{ text: 'Download', href: 'https://github.com/onwidget/astrowind', target: '_blank' }],
=======
  actions: [{ text: 'Richiedi un Preventivo', href: '/contatti', target: '_self' }],
>>>>>>> 8487b4a (Aggiornamento navigazione e struttura del portfolio)
};

export const footerData = {
  links: [
    {
<<<<<<< HEAD
      title: 'Product',
      links: [
        { text: 'Features', href: '#' },
        { text: 'Security', href: '#' },
        { text: 'Team', href: '#' },
        { text: 'Enterprise', href: '#' },
        { text: 'Customer stories', href: '#' },
        { text: 'Pricing', href: '#' },
        { text: 'Resources', href: '#' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { text: 'Developer API', href: '#' },
        { text: 'Partners', href: '#' },
        { text: 'Atom', href: '#' },
        { text: 'Electron', href: '#' },
        { text: 'AstroWind Desktop', href: '#' },
=======
      title: 'Prodotti',
      links: [
        { text: 'Caratteristiche', href: '#' },
        { text: 'Sicurezza', href: '#' },
        { text: 'Team', href: '#' },
        { text: 'Enterprise', href: '#' },
        { text: 'Testimonianze', href: '#' },
        { text: 'Prezzi', href: '#' },
        { text: 'Risorse', href: '#' },
      ],
    },
    {
      title: 'Piattaforma',
      links: [
        { text: 'API Developer', href: '#' },
        { text: 'Partner', href: '#' },
        { text: 'Community', href: '#' },
        { text: 'Supporto', href: '#' },
>>>>>>> 8487b4a (Aggiornamento navigazione e struttura del portfolio)
      ],
    },
    {
      title: 'Support',
      links: [
<<<<<<< HEAD
        { text: 'Docs', href: '#' },
        { text: 'Community Forum', href: '#' },
        { text: 'Professional Services', href: '#' },
        { text: 'Skills', href: '#' },
        { text: 'Status', href: '#' },
=======
        { text: 'Documentazione', href: '#' },
        { text: 'Forum', href: '#' },
        { text: 'Servizi Professionali', href: '#' },
        { text: 'Assistenza', href: '#' },
      ],
    },
    {
      title: 'Azienda',
      links: [
        { text: 'Chi Siamo', href: '#' },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Lavora con noi', href: '#' },
        { text: 'Press', href: '#' },
>>>>>>> 8487b4a (Aggiornamento navigazione e struttura del portfolio)
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#' },
        { text: 'Blog', href: '#' },
        { text: 'Careers', href: '#' },
        { text: 'Press', href: '#' },
        { text: 'Inclusion', href: '#' },
        { text: 'Social Impact', href: '#' },
        { text: 'Shop', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  secondaryLinks: [
    { text: 'Termini di Servizio', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
<<<<<<< HEAD
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/onwidget/astrowind' },
  ],
  footNote: `
    <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" src="https://onwidget.com/favicon/favicon-32x32.png" alt="onWidget logo" loading="lazy"></img>
    Made by <a class="text-blue-600 underline dark:text-muted" href="https://onwidget.com/"> onWidget</a> · All rights reserved.
=======
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/LucaSannadesign/lswebagency2025' },
  ],
  footNote: `
    <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" 
    src="https://lswebagency.com/favicon/favicon-32x32.png" alt="LS Web Agency logo" loading="lazy"></img>
    Realizzato da <a class="text-blue-600 underline dark:text-muted" href="https://lswebagency.com/"> LS Web Agency</a> · Tutti i diritti riservati.
>>>>>>> 8487b4a (Aggiornamento navigazione e struttura del portfolio)
  `,
};
