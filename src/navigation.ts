// src/navigation.ts

export const headerData = {
  links: [
    { text: 'Home', href: '/' },
    {
      text: 'Servizi',
      href: '/servizi',
      links: [
        { text: 'Siti Web', href: '/servizi#siti-web' },
        { text: 'SEO', href: '/servizi#seo' },
        { text: 'AI & Automazioni', href: '/servizi#ai' },
        { text: 'divider' },
        { text: 'Tutti i servizi', href: '/servizi#tutti-servizi' },
      ],
    },
    { text: 'Portfolio', href: '/portfolio' },
    { text: 'Blog', href: '/blog' },
    { text: 'Contatti', href: '/contatti' },
  ],
  actions: [{ text: 'Richiedi un Preventivo', href: '/contatti' }],
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