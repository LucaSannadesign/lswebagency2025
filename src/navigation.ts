// src/navigation.ts

import { serviceName } from './config/services';

export const headerData = {
  links: [
    { text: 'Home', href: '/' },
    {
      text: 'Servizi',
      href: '/servizi',
      links: [
        { text: 'Sito web strategico', href: '/servizi/siti-web' },
        { text: 'Audit del sito', href: '/servizi/audit-rapido' },
        // Nome letto dal catalogo: la voce diceva "Sprint tecnico", nome che sulla
        // pagina non compare e che appartiene invece a un livello del white label.
        { text: serviceName('sprint-ottimizzazione'), href: '/servizi/sprint-ottimizzazione' },
        { text: 'divider' },
        {
          text: 'Digital Presence ↗',
          href: 'https://digitalpresence.lswebagency.com/',
        },
        { text: 'divider' },
        { text: 'Tutti i servizi', href: '/servizi#servizi-principali' },
      ],
    },
    { text: 'Portfolio', href: '/portfolio' },
    { text: 'Blog', href: '/blog' },
    { text: 'Contatti', href: '/contatti' },
  ],
  actions: [
    // CTA autonoma: strumento gratuito di acquisizione lead, distinto dai servizi.
    { text: 'Valutazione iniziale gratuita', href: '/mini-analisi', variant: 'primary' },
  ],
};

export const footerData = {
  links: [
    { text: 'Home', href: '/' },
    { text: 'Servizi', href: '/servizi' },
    { text: 'Digital Presence ↗', href: 'https://digitalpresence.lswebagency.com/' },
    { text: 'SEO Locale', href: '/servizi/seo-locale' },
    { text: 'Pagamenti', href: '/pagamenti' },
    { text: 'Portfolio', href: '/portfolio' },
    { text: 'Blog', href: '/blog' },
    { text: 'Contatti', href: '/contatti' },

    { text: 'Privacy & Cookie Policy', href: '/privacy' },
    { text: 'Termini di Servizio', href: '/terms' },
  ],
  socialLinks: [
    { ariaLabel: 'Linkedin', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/ls-web-agency' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/lswebdesignagency' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/ls_web_agency' },
  ],
  secondaryLinks: [],
};