/**
 * Gerarchia dei servizi C.3.4 (pagina /servizi).
 * Quattro pratiche principali + percorsi secondari. Ogni voce punta a una
 * pagina servizio ESISTENTE; le descrizioni brevi riassumono la sua meta
 * description. Nessun servizio nuovo, nessun URL modificato.
 */
export interface ServiceLink {
  label: string;
  href: string;
  note?: string;
}
export interface Practice {
  id?: string;
  title: string;
  desc: string;
  tags: string[];
  links: ServiceLink[];
}
export interface SecondaryPath {
  title: string;
  desc: string;
  links: ServiceLink[];
}

export const PRACTICES: Practice[] = [
  {
    title: 'Web design strategico',
    desc: 'Siti costruiti intorno a ciò che i clienti cercano e a come ti contattano: struttura, contenuti, interfaccia e conversione progettati insieme fin dall’inizio.',
    tags: ['Architettura dei contenuti', 'Identità visiva', 'Form e misurazione'],
    links: [
      { label: 'Sito web strategico', href: '/servizi/siti-web', note: 'Struttura, form, SEO e tracciamento integrati' },
      { label: 'Landing page professionale', href: '/servizi/landing-page-professionale', note: 'Pagine orientate a un’azione precisa' },
      { label: 'E-commerce', href: '/servizi/realizzazione-siti-ecommerce', note: 'Dallo shop essenziale ai progetti integrati' },
      { label: 'Branding e grafica', href: '/servizi/branding-e-grafica-siti-web', note: 'Loghi, sistemi visivi e coerenza UX' },
    ],
  },
  {
    title: 'UX/UI e accessibilità',
    desc: 'Analisi e progettazione dell’esperienza: gerarchie, percorsi verso il contatto, accessibilità verificata e interfacce che si adattano a chi le usa.',
    tags: ['Audit UX', 'Criteri WCAG', 'Interfacce adattive'],
    links: [
      { label: 'Audit del sito', href: '/servizi/audit-rapido', note: 'UX, SEO tecnica, performance e accessibilità · 349 €' },
      { label: 'Accessibilità digitale', href: '/servizi/accessibilita-digitale-avanzata', note: 'Verifica tecnica su criteri WCAG selezionati' },
      { label: 'UX personalizzata con AI', href: '/servizi/personalizzazione-ux-intelligenza-artificiale', note: 'Esperienze che si adattano in tempo reale' },
      { label: 'Web design etico', href: '/servizi/web-design-etico-sostenibile', note: 'Progettazione attenta a inclusione, trasparenza e risorse' },
    ],
  },
  {
    title: 'Sviluppo front-end su misura',
    desc: 'Codice scritto per il progetto, non adattato da un tema: siti statici e headless, performance, ottimizzazioni mirate e sviluppo per altre agenzie.',
    tags: ['Astro, React, WebGL', 'Statico e headless', 'Core Web Vitals'],
    links: [
      { label: 'WordPress Slim · statico e headless', href: '/servizi/wordpress-slim-siti-statici-headless', note: 'Performance, sicurezza e SEO' },
      { label: 'Fix performance e SEO', href: '/servizi/fix-performance-seo', note: 'Interventi mirati e misurabili · da 399 €' },
      { label: 'Sprint di ottimizzazione', href: '/servizi/sprint-ottimizzazione', note: '10–15 giorni su conversione e misurazione' },
      { label: 'Sviluppo white label', href: '/servizi/sviluppo-web-white-label', note: 'Per agenzie e studi digitali' },
    ],
  },
  {
    id: 'ai',
    title: 'Prodotti digitali e AI',
    desc: 'Automazioni, assistenti AI e prodotti digitali per semplificare le attività ripetitive, organizzare le richieste e supportare il lavoro quotidiano, con supervisione umana.',
    tags: ['Automazioni', 'Assistenti', 'Prodotti indipendenti'],
    links: [
      { label: 'AI Operations per PMI', href: '/servizi/ai-operations-pmi', note: 'Sito, email, CRM e calendario collegati' },
      { label: 'Assistente AI per sito e WhatsApp', href: '/servizi/assistente-ai-sito-whatsapp', note: 'Risposte e raccolta richieste fuori orario' },
      { label: 'AI Blog Engine', href: '/servizi/ai-blog-engine', note: 'Piano editoriale con revisione umana' },
      { label: 'Automation Fit Score', href: '/process-fit-check', note: 'Verifica gratuita di un processo' },
    ],
  },
];

export const SECONDARY: SecondaryPath[] = [
  {
    title: 'Visibilità e SEO',
    desc: 'Farsi trovare su Google e su Maps, con interventi tecnici e contenuti.',
    links: [
      { label: 'Ottimizzazione SEO', href: '/servizi/ottimizzazione-seo-siti-web' },
      { label: 'SEO locale', href: '/servizi/seo-locale' },
      { label: 'Local SEO Booster', href: '/servizi/local-seo-booster' },
    ],
  },
  {
    title: 'Settori e territorio',
    desc: 'Percorsi dedicati a settori specifici e al presidio di Sassari e della Sardegna.',
    links: [
      { label: 'Pre-accoglienza digitale per studi dentistici', href: '/servizi/pre-accoglienza-digitale' },
      { label: 'Transizione digitale per il turismo', href: '/transizione-digitale-turismo' },
      { label: 'Siti web a Sassari', href: '/servizi/creazione-siti-web-sassari' },
    ],
  },
  {
    title: 'Assistenza ed evoluzione',
    desc: 'Dopo il lancio: aggiornamenti, controlli tecnici e miglioramenti progressivi.',
    links: [
      { label: 'Assistenza e manutenzione', href: '/servizi/assistenza-manutenzione' },
    ],
  },
  {
    title: 'Consulenza per creativi',
    desc: 'Digital Presence: analisi della presenza professionale online, revisione del portfolio e risorse per artisti, designer, fotografi e freelance.',
    links: [
      { label: 'Digital Presence · consulenza specialistica ↗', href: 'https://digitalpresence.lswebagency.com/' },
    ],
  },
];
