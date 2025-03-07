
export const headerData = {
  links: [
    { text: 'Home', href: '/' },
    { text: 'Chi Siamo', href: '/chi-siamo' },
    {
      text: 'Servizi',
      links: [
        { text: 'Creazione siti web', href: '/servizi/creazione-siti-web-sassari' },
        { text: 'Realizzazione E-commerce', href: '/servizi/realizzazione-siti-ecommerce' },
        { text: 'Branding e Grafica', href: '/servizi/branding-e-grafica-siti-web' },
        { text: 'Ottimizzazione SEO', href: '/servizi/ottimizzazione-seo-siti-web' },
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
  ],
  socialLinks: [
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/LucaSannadesign/lswebagency2025' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/lswebdesignagency' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/ls_web_design_agency/' },
  ],
  secondaryLinks: [], // ✅ Aggiunto per evitare l'errore
};
