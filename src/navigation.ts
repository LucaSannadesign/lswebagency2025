import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
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
        { text: 'Creazione siti web', href: '/servizi/creazione-siti-web-sassari' },
        { text: 'Realizzazione E-commerce', href: '/servizi/realizzazione-siti-ecommerce' },
        { text: 'Branding e Grafica', href: '/servizi/branding-e-grafica-siti-web' },
        { text: 'Ottimizzazione SEO', href: '/servizi/ottimizzazione-seo-siti-web' },
      ],
    },
    {
      text: 'Portfolio',
      href: getPermalink('/portfolio'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Contatti',
      href: getPermalink('/contatti'),
    },
  ],
  actions: [{ text: 'Richiedi un Preventivo', href: '/contatti', target: '_self' }],
};

export const footerData = {
  links: [
    {
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
      ],
    },
    {
      title: 'Supporto',
      links: [
        { text: 'Documentazione', href: '#' },
        { text: 'Forum', href: '#' },
        { text: 'Servizi Professionali', href: '#' },
        { text: 'Assistenza', href: '#' },
      ],
    },
    {
      title: 'Azienda',
      links: [
        { text: 'Chi Siamo', href: getPermalink('/chi-siamo') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Lavora con noi', href: '#' },
        { text: 'Press', href: '#' },
      ],
    },
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
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/LucaSannadesign/lswebagency2025' },
  ],
  footNote: `
    <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" 
    src="https://lswebagency.com/favicon/favicon-32x32.png" alt="LS Web Agency logo" loading="lazy"></img>
    Realizzato da <a class="text-blue-600 underline dark:text-muted" href="https://lswebagency.com/"> LS Web Agency</a> · Tutti i diritti riservati.
  `,
};
