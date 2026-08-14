/*
 * Catalogo dei servizi: sorgente unica di nomi, slug e prezzi.
 *
 * Prima di questo file gli stessi importi vivevano in almeno quattro punti
 * indipendenti — le pagine servizio, l'assistente del sito, la mini-analisi e le
 * mappe di /contatti — e ogni ritocco di listino poteva allinearne tre su quattro.
 * Da qui in avanti i consumatori leggono, non ripetono.
 *
 * Regola di compilazione, non negoziabile: la PAGINA SERVIZIO è la fonte.
 * Ogni importo qui sotto è stato confrontato con quello che la pagina pubblica
 * oggi; dove il confronto non tornava il valore non è stato scelto d'ufficio, ed
 * è annotato caso per caso.
 *
 * Cosa questo file NON fa:
 *  - non contiene testo di vendita: i messaggi restano dei consumatori;
 *  - non decide se un servizio vada offerto in un certo flusso: quella è una
 *    scelta del consumatore, che può leggere `status` per regolarsi;
 *  - non calcola sconti, totali o preventivi.
 */

// ===== Tipi =====

/** Chiave stabile: non cambia se cambiano nome pubblico o slug. */
export type ServiceKey =
  | 'valutazione-iniziale'
  | 'audit-sito'
  | 'fix-performance-seo'
  | 'sprint-ottimizzazione'
  | 'sito-web-strategico'
  | 'landing-page'
  | 'ecommerce'
  | 'wordpress-slim'
  | 'white-label'
  | 'branding'
  | 'seo-locale'
  | 'local-seo-booster'
  | 'assistente-ai'
  | 'pre-accoglienza-digitale'
  | 'assistenza-manutenzione';

/**
 * `attivo` = proponibile senza riserve.
 * `in-revisione` = pagina online, ma il posizionamento è in discussione: i
 * generatori di testo non devono proporlo spontaneamente.
 */
export type ServiceStatus = 'attivo' | 'in-revisione';

/** Un livello acquistabile del servizio (pacchetto, taglia, piano). */
export type ServiceTier = {
  key: string;
  /** Nome come compare sulla pagina servizio. */
  name: string;
  /** Importo una tantum in euro; null quando il livello è solo ricorrente o a preventivo. */
  setupEur: number | null;
  /** Canone mensile in euro, quando previsto. */
  monthlyEur?: number;
  /** true quando la pagina scrive "da X €" e l'importo è una base, non un totale. */
  from?: boolean;
  /** Riga già formattata per la visualizzazione. */
  priceLabel: string;
  note?: string;
};

/** Estensione facoltativa, venduta in aggiunta a un livello. */
export type ServiceAddon = {
  key: string;
  name: string;
  fromEur: number;
  priceLabel: string;
};

export type Service = {
  key: ServiceKey;
  /** Nome pubblico, identico a quello che il visitatore legge sulla pagina. */
  name: string;
  /** Percorso della pagina servizio. */
  slug: string;
  status: ServiceStatus;
  /**
   * Prezzo pronto da mostrare, in una riga. È la forma che i generatori devono
   * usare quando non entrano nel dettaglio dei livelli.
   */
  priceLabel: string;
  /**
   * Importo di ingresso in euro, per i calcoli e gli ordinamenti.
   * null quando il servizio non ha un prezzo pubblicato (gratuito o a preventivo).
   */
  fromEur: number | null;
  /** true quando `fromEur` è una base ("da 490 €") e non un totale. */
  fromIsMinimum?: boolean;
  tiers?: ServiceTier[];
  addons?: ServiceAddon[];
  /**
   * Slug accettati dal parametro ?servizio= delle CTA interne. Servono a /contatti
   * per risolvere un'etichetta senza inventarla a partire dallo slug.
   */
  ctaSlugs: string[];
  /** Condizione da riportare accanto al prezzo quando c'è spazio. */
  note?: string;
};

// ===== Catalogo =====

/*
 * Nota tipografica: le pagine alternano "399€" e "349 €". Qui la forma è sempre
 * con lo spazio fra cifra e valuta; è una normalizzazione di resa, non un cambio
 * di prezzo.
 */
export const SERVICES: Record<ServiceKey, Service> = {
  'valutazione-iniziale': {
    key: 'valutazione-iniziale',
    name: 'Valutazione iniziale gratuita',
    slug: '/mini-analisi',
    status: 'attivo',
    priceLabel: 'Gratuita',
    fromEur: null,
    ctaSlugs: [],
    note: 'Orientamento iniziale, non un preventivo e non un audit tecnico.',
  },

  'audit-sito': {
    key: 'audit-sito',
    name: 'Audit del sito',
    slug: '/servizi/audit-rapido',
    status: 'attivo',
    priceLabel: '349 €',
    fromEur: 349,
    ctaSlugs: ['audit-rapido'],
    note: 'IVA non applicata · fino a 10 pagine.',
  },

  // Livelli con i nomi della pagina: "Fix Mirato" e "Fix Completo".
  'fix-performance-seo': {
    key: 'fix-performance-seo',
    name: 'Fix Performance & SEO',
    slug: '/servizi/fix-performance-seo',
    status: 'attivo',
    priceLabel: '399 € o 699 €',
    fromEur: 399,
    tiers: [
      { key: 'mirato', name: 'Fix Mirato', setupEur: 399, priceLabel: '399 €' },
      { key: 'completo', name: 'Fix Completo', setupEur: 699, priceLabel: '699 €' },
    ],
    ctaSlugs: ['fix-performance-seo'],
  },

  // Il nome pubblico è quello della pagina. La voce di menu dice ancora
  // "Sprint tecnico": disallineamento noto, da correggere altrove.
  'sprint-ottimizzazione': {
    key: 'sprint-ottimizzazione',
    name: 'Sprint di Ottimizzazione',
    slug: '/servizi/sprint-ottimizzazione',
    status: 'attivo',
    priceLabel: 'Su preventivo',
    fromEur: null,
    ctaSlugs: ['sprint-ottimizzazione'],
  },

  'sito-web-strategico': {
    key: 'sito-web-strategico',
    name: 'Sito web strategico',
    slug: '/servizi/siti-web',
    status: 'attivo',
    priceLabel: 'Su preventivo',
    fromEur: null,
    ctaSlugs: ['sito-web', 'siti-web', 'creazione-siti-web-sassari'],
    note: 'Il prezzo si definisce dopo un confronto su obiettivi, pagine e contenuti.',
  },

  // Il secondo livello sulla pagina si chiama "Landing Plus", non "Pro".
  'landing-page': {
    key: 'landing-page',
    name: 'Landing page professionale',
    slug: '/servizi/landing-page-professionale',
    status: 'attivo',
    priceLabel: 'Da 690 €',
    fromEur: 690,
    fromIsMinimum: true,
    tiers: [
      { key: 'base', name: 'Landing Base', setupEur: 690, priceLabel: '690 €' },
      { key: 'plus', name: 'Landing Plus', setupEur: 990, priceLabel: '990 €' },
    ],
    addons: [
      // Sulla pagina questo add-on è etichettato con il nome di un altro prodotto
      // ("Local SEO Booster (Google Business Profile)"). Qui resta il solo
      // perimetro tecnico: i generatori non devono proporre un prodotto diverso.
      { key: 'google-business', name: 'Google Business Profile', fromEur: 490, priceLabel: 'da 490 €' },
      { key: 'prenotazioni', name: 'Integrazione calendario e prenotazioni', fromEur: 200, priceLabel: 'da 200 €' },
      { key: 'multilingua', name: 'Versione multilingua', fromEur: 300, priceLabel: 'da 300 €' },
      { key: 'ads', name: 'Setup mini-campagna Google Ads', fromEur: 150, priceLabel: 'da 150 €' },
    ],
    ctaSlugs: ['landing-page', 'contatti-rapidi'],
    note: 'Consegna in 7-10 giorni.',
  },

  // La pagina non pubblica importi: espone due livelli e i soli tempi.
  ecommerce: {
    key: 'ecommerce',
    name: 'E-commerce',
    slug: '/servizi/realizzazione-siti-ecommerce',
    status: 'attivo',
    priceLabel: 'Su preventivo',
    fromEur: null,
    tiers: [
      { key: 'start', name: 'E-commerce Start', setupEur: null, priceLabel: 'Su preventivo', note: '3-5 settimane.' },
      { key: 'pro', name: 'E-commerce Pro', setupEur: null, priceLabel: 'Su preventivo', note: '6-10 settimane, come la versione headless.' },
    ],
    ctaSlugs: ['ecommerce'],
  },

  'wordpress-slim': {
    key: 'wordpress-slim',
    name: 'WordPress Slim',
    slug: '/servizi/wordpress-slim-siti-statici-headless',
    status: 'attivo',
    priceLabel: 'Su preventivo',
    fromEur: null,
    ctaSlugs: ['wordpress-slim'],
    note: 'Migrazione verso soluzioni statiche o headless.',
  },

  /*
   * Servizio rivolto ad agenzie, non al cliente finale: l'unico del catalogo con
   * un listino articolato per formula.
   *
   * Da segnalare: il livello "Sprint tecnico white label" occupa la stessa
   * locuzione che la voce di menu usa per lo Sprint di Ottimizzazione. Sono due
   * servizi diversi e la sovrapposizione di nome è precedente a questo file.
   */
  'white-label': {
    key: 'white-label',
    name: 'Sviluppo web white label per agenzie',
    slug: '/servizi/sviluppo-web-white-label',
    status: 'attivo',
    priceLabel: 'Da 600 € a 2.200 €, per formula',
    fromEur: 600,
    fromIsMinimum: true,
    tiers: [
      { key: 'landing-design-pronto', name: 'Landing da design pronto', setupEur: 1200, priceLabel: '1.200 €', note: 'Tariffa base, con preventivo definito prima di iniziare.' },
      { key: 'prima-collaborazione', name: 'Prima collaborazione white label', setupEur: 960, priceLabel: '960 €', note: 'Il 20% in meno rispetto alla tariffa base di 1.200 €.' },
      { key: 'piccolo-sito', name: 'Piccolo sito white label', setupEur: 2200, from: true, priceLabel: 'da 2.200 €', note: 'Fino a 5 pagine da design approvati.' },
      { key: 'sprint-tecnico', name: 'Sprint tecnico white label', setupEur: 600, from: true, priceLabel: 'da 600 €', note: 'Elenco chiuso di interventi su un progetto esistente.' },
      { key: 'ux-ui', name: 'Progettazione UX/UI', setupEur: null, priceLabel: 'Su preventivo' },
    ],
    ctaSlugs: ['white-label'],
  },

  // L'unico importo sulla pagina è un riferimento in negativo ("un logo a
  // 20-50 € tanto per avere qualcosa"): non è un prezzo del servizio.
  branding: {
    key: 'branding',
    name: 'Branding e grafica',
    slug: '/servizi/branding-e-grafica-siti-web',
    status: 'attivo',
    priceLabel: 'Su preventivo',
    fromEur: null,
    ctaSlugs: ['branding'],
  },

  'seo-locale': {
    key: 'seo-locale',
    name: 'SEO locale',
    slug: '/servizi/seo-locale',
    status: 'attivo',
    priceLabel: 'Setup da 490 € + 49 €/mese facoltativi',
    fromEur: 490,
    fromIsMinimum: true,
    tiers: [
      { key: 'setup', name: 'Setup', setupEur: 490, from: true, priceLabel: 'da 490 €', note: 'Per una sede. La verifica locale iniziale confluisce nel Setup, senza costi doppi.' },
      { key: 'manutenzione', name: 'Manutenzione', setupEur: null, monthlyEur: 49, priceLabel: '49 €/mese', note: 'Facoltativa, mese per mese, interrompibile.' },
    ],
    ctaSlugs: ['seo-locale'],
  },

  'local-seo-booster': {
    key: 'local-seo-booster',
    name: 'Local SEO Booster',
    slug: '/servizi/local-seo-booster',
    status: 'attivo',
    priceLabel: 'Setup 490 € + piani mensili',
    fromEur: 490,
    tiers: [
      { key: 'setup', name: 'Setup (una tantum)', setupEur: 490, priceLabel: '490 €' },
      { key: 'manutenzione', name: 'Manutenzione (opzionale)', setupEur: null, monthlyEur: 49, priceLabel: '49 €/mese' },
      { key: 'recensioni-booster', name: 'Recensioni Booster', setupEur: null, monthlyEur: 39, priceLabel: '39 €/mese' },
    ],
    ctaSlugs: ['local-seo-booster'],
    note: 'Setup e Manutenzione si sovrappongono a quelli di SEO locale, con la differenza che qui il Setup è 490 € esatti e là “da 490 €”: il confine fra i due prodotti è ancora da chiarire.',
  },

  /*
   * La pagina servizio non pubblica alcun importo: i prezzi sono stati rimossi
   * con il commit 31b0f728 ("remove unsupported claims"). Il prezzo pubblico è
   * quindi "su preventivo", e i pacchetti sopravvivono solo come dato interno —
   * vedi ASSISTANT_INTERNAL_PACKAGES qui sotto.
   */
  'assistente-ai': {
    key: 'assistente-ai',
    name: 'Assistente AI per sito e WhatsApp',
    slug: '/servizi/assistente-ai-sito-whatsapp',
    status: 'attivo',
    priceLabel: 'Su preventivo',
    fromEur: null,
    ctaSlugs: ['assistente-ai'],
    note: 'Dipende da canali, flussi, integrazioni e volume delle richieste.',
  },

  'pre-accoglienza-digitale': {
    key: 'pre-accoglienza-digitale',
    name: 'Pre-Accoglienza Digitale',
    slug: '/servizi/pre-accoglienza-digitale',
    status: 'attivo',
    priceLabel: 'Pilota di 90 giorni',
    fromEur: null,
    ctaSlugs: ['pre-accoglienza-digitale'],
    note: 'Percorso pilota misurabile, non un impegno a lungo termine.',
  },

  // Piani mensili descritti sulla pagina senza importi: il canone si definisce
  // sul perimetro concordato.
  'assistenza-manutenzione': {
    key: 'assistenza-manutenzione',
    name: 'Assistenza e manutenzione',
    slug: '/servizi/assistenza-manutenzione',
    status: 'attivo',
    priceLabel: 'Su preventivo',
    fromEur: null,
    ctaSlugs: ['manutenzione', 'assistenza'],
    note: 'Piano mensile a costi prevedibili, definito sul perimetro concordato.',
  },
};

/** Ordine di lettura del catalogo, dal primo contatto ai servizi continuativi. */
export const SERVICE_ORDER: ServiceKey[] = [
  'valutazione-iniziale',
  'audit-sito',
  'fix-performance-seo',
  'sprint-ottimizzazione',
  'sito-web-strategico',
  'landing-page',
  'ecommerce',
  'wordpress-slim',
  'white-label',
  'branding',
  'seo-locale',
  'local-seo-booster',
  'assistente-ai',
  'pre-accoglienza-digitale',
  'assistenza-manutenzione',
];

// ===== Pacchetti interni dell'Assistente AI =====

export type AssistantTierKey = 'Starter' | 'Pro' | 'Plus';

export type AssistantInternalPackage = { tier: AssistantTierKey; setup: number; monthly: number };

/*
 * Fasce di riferimento dell'Assistente AI. NON sono un prezzo pubblico: la
 * pagina servizio non le espone più, quindi nessun testo diretto a un cliente o
 * a un prospect deve stamparle. Restano qui perché servono a orientare la
 * proposta e possono comparire nelle note interne, dove sono utili a me e non
 * costituiscono un'offerta.
 *
 * Gli importi originali della pagina erano formulati con "da": vanno letti come
 * base di partenza, mai come listino chiuso.
 */
export const ASSISTANT_INTERNAL_PACKAGES: Record<AssistantTierKey, AssistantInternalPackage> = {
  Starter: { tier: 'Starter', setup: 300, monthly: 29 },
  Pro: { tier: 'Pro', setup: 600, monthly: 59 },
  Plus: { tier: 'Plus', setup: 900, monthly: 99 },
};

// ===== Funzioni pure =====

/** Servizio per chiave stabile. */
export function getService(key: ServiceKey): Service {
  return SERVICES[key];
}

/** Nome pubblico per chiave stabile. Scorciatoia del caso d'uso più frequente. */
export function serviceName(key: ServiceKey): string {
  return SERVICES[key].name;
}

/** Tutti i servizi nell'ordine di lettura del catalogo. */
export function allServices(): Service[] {
  return SERVICE_ORDER.map((key) => SERVICES[key]);
}

/** Solo i servizi proponibili senza riserve. */
export function activeServices(): Service[] {
  return allServices().filter((service) => service.status === 'attivo');
}

/**
 * Risolve uno slug di CTA (?servizio=…) nel servizio corrispondente.
 * Restituisce undefined quando lo slug non appartiene al catalogo: il chiamante
 * deve gestire il caso con un'etichetta neutra, mai indovinando un nome.
 */
export function serviceByCtaSlug(slug: string): Service | undefined {
  const wanted = slug.trim().toLowerCase();
  if (!wanted) return undefined;
  return allServices().find((service) => service.ctaSlugs.includes(wanted));
}

/** Servizio a partire dal percorso della sua pagina. */
export function serviceBySlug(path: string): Service | undefined {
  const wanted = path.trim().replace(/\/+$/, '');
  if (!wanted) return undefined;
  return allServices().find((service) => service.slug === wanted);
}

/** Livello di un servizio per chiave, quando il servizio ha livelli. */
export function serviceTier(key: ServiceKey, tierKey: string): ServiceTier | undefined {
  return SERVICES[key].tiers?.find((tier) => tier.key === tierKey);
}
