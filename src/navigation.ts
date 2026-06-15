// src/navigation.ts

export const headerData = {
  links: [
    { text: 'Home', href: '/' },
    {
      text: 'Servizi',
      href: '/servizi',
      links: [
        { text: 'Sito web strategico', href: '/servizi/siti-web' },
        { text: 'Ottimizzazione SEO', href: '/servizi#seo' },
        { text: 'AI e automazioni', href: '/servizi#ai' },
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
    { text: 'Valutazione Gratuita', href: '/mini-analisi', variant: 'primary' },
    { text: 'Parliamo del progetto', href: '/contatti' },
  ],
};

export const footerData = {
  links: [
    { text: 'Home', href: '/' },
    { text: 'Servizi', href: '/servizi' },
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