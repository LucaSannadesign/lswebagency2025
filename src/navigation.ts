// src/navigation.ts

export const headerData = {
  links: [
    { text: 'Home', href: '/' },
    { text: 'Chi Siamo', href: '/chi-siamo' },
    {
      text: 'Servizi',
      href: '/servizi',
      links: [
        { text: 'Tutti i servizi', href: '/servizi' },

        { text: 'Siti Web', href: '/servizi/creazione-siti-web-sassari' },
        { text: 'E-commerce', href: '/servizi/realizzazione-siti-ecommerce' },
        { text: 'SEO & Local SEO', href: '/servizi/ottimizzazione-seo-siti-web' },
        { text: 'Local SEO Booster', href: '/servizi/local-seo-booster' },

        { text: 'AI & Automazioni', href: '/servizi/assistente-ai-sito-whatsapp' },
        { text: 'AI Blog Engine', href: '/servizi/ai-blog-engine' },

        { text: 'WordPress Slim', href: '/servizi/wordpress-slim-siti-statici-headless' },
      ],
    },
    { text: 'Local', href: '/local' },
    { text: 'Pagamenti', href: '/pagamenti' },
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
    { text: 'Local', href: '/local' },
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