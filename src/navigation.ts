export const headerData = {
  links: [
    { text: 'Home', href: '/' },
    { text: 'Chi Siamo', href: '/chi-siamo' },
    {
      text: 'Servizi',
      href: '/servizi',
      links: [
        { text: 'Creazione siti web', href: '/servizi/creazione-siti-web-sassari' },
        { text: 'Realizzazione E-commerce', href: '/servizi/realizzazione-siti-ecommerce' },
        { text: 'Ottimizzazione SEO', href: '/servizi/ottimizzazione-seo-siti-web' },
        { text: 'Branding e Grafica', href: '/servizi/branding-e-grafica-siti-web' },
        { text: 'Accessibilità Digitale', href: '/servizi/accessibilita-digitale-avanzata' },
        { text: 'UX con AI', href: '/servizi/personalizzazione-ux-intelligenza-artificiale' },
        { text: 'Web Design Etico', href: '/servizi/web-design-etico-sostenibile' },
        { text: 'Voucher Digitali', href: '/servizi/voucher-digitali-sassari' }
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
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Termini di Servizio', href: '/terms' },
    { text: 'Voucher Digitali', href: '/servizi/voucher-digitali-sassari' }
  ],
  socialLinks: [
    { ariaLabel: 'Linkedin', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/ls-web-agency' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/lswebdesignagency' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/ls_web_agency' },
  ],
  secondaryLinks: [],
};