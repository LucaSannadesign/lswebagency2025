/**
 * Contenuti della homepage C.3.
 *
 * - Portfolio: descrizione, stato, tecnologie e logo arrivano dalla collection
 *   `portfolio` (fonte unica); qui solo i dati di presentazione (anteprima,
 *   tinta, accento, ruolo, funzionalità visibili sul sito pubblicato).
 * - Recensioni: testi e autori identici alla homepage precedente.
 * - FAQ: alimentano sia l'elenco visibile sia il JSON-LD FAQPage.
 */

export interface PortfolioExtra {
  id: string;
  name: string;
  url: string;
  domain: string;
  shot: string;
  shot2?: { src: string; alt: string };
  logo: string;
  logoBg?: string;
  tint: string;
  accent: string;
  kind: string;
  fallbackStage?: string;
  role: string;
  features: string[];
}

export const PORTFOLIO: PortfolioExtra[] = [
  {
    id: 'preventivodentale',
    name: 'PreventivoDentale',
    url: 'https://www.preventivodentale.it/',
    domain: 'preventivodentale.it',
    shot: '/images/c3/pf-preventivodentale.webp',
    logo: '/images/portfolio/brand-preventivodentale.svg',
    tint: '#10142A',
    accent: '#6FC79C',
    kind: 'Pilota',
    role: 'Identità visiva, UX/UI e sviluppo',
    features: [
      'Richiesta guidata in due passi: esigenza (impianti, protesi, allineatori, estetica o solo orientamento), poi recapiti',
      'Codice pratica e pagina «Verifica stato» per seguire la richiesta',
      'Area riservata per le cliniche e pagina dedicata agli studi',
      'Blog, guide e un vademecum gratuito per il paziente',
    ],
  },
  {
    id: 'canapalandia-blog',
    name: 'Canapalandia',
    url: 'https://canapalandia.com/',
    domain: 'canapalandia.com',
    shot: '/images/c3/pf-canapalandia.webp',
    logo: '/images/portfolio/logo-canapalandia.webp',
    tint: '#0E1B14',
    accent: '#8CCB7A',
    kind: 'Online',
    fallbackStage: 'Progetto editoriale indipendente · Online',
    role: 'Progetto proprio: identità, design e sviluppo del magazine',
    features: [
      'Sezioni editoriali: Notizie, Normativa, CBD, Canapa e Blog',
      'Versione italiana e inglese, con collegamenti hreflang tra le lingue',
      'Tema chiaro e scuro e ricerca interna',
      'Sezione Lab con strumenti sperimentali, feed RSS e gestione del consenso privacy',
    ],
  },
  {
    id: 'lughe',
    name: 'LUGHE',
    url: 'https://lugheproperty.com/',
    domain: 'lugheproperty.com',
    shot: '/images/c3/pf-lughe.webp',
    logo: '/images/portfolio/brand-lughe.svg',
    logoBg: '#F4F0E6',
    tint: '#0E1A2B',
    accent: '#E9A23B',
    kind: 'In validazione',
    role: 'Identità visiva ed esperienza digitale',
    features: [
      'Percorso in tre passi, dal link dell’annuncio alla proposta separata',
      'Controllo di fattibilità gratuito richiesto via email, senza invio di documenti',
      '«Semaforo LUGHE»: tre categorie di lettura (chiaro, da verificare, domanda da fare)',
      'Esempio di Pre-Deposit Check su annuncio simulato e rubrica «Il punto cieco»',
    ],
  },
  {
    id: 'yoartly',
    name: 'YoArtly',
    url: 'https://yoartlyplay.com/',
    domain: 'yoartlyplay.com',
    shot: '/images/c3/pf-yoartly.webp',
    shot2: { src: '/images/c3/pf-yoartly-color.webp', alt: 'Pagina Color Explorer del sito yoartlyplay.com' },
    logo: '/images/portfolio/brand-yoartly.svg',
    tint: '#18142C',
    accent: '#A79BFF',
    kind: 'Pre-lancio',
    role: 'Brand identity (logo geometrico con il panda, sistema visivo) ed esperienza web',
    features: [
      'Logotipo geometrico con la testa di panda nella O e pois colorati',
      'Pagine dedicate ai libri Nature Explorer e Color Explorer, con rimando alla scheda Amazon',
      'Sezione «Feste e colori»',
      'Il sito dichiara apertamente di non gestire acquisti o prenotazioni dirette',
    ],
  },
];

export const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/place/LS+Web+Agency/@40.7201392,8.5761945,16z/data=!4m16!1m7!3m6!1s0x12dc6402a0911c99:0x572a199f1be0a9b!2sLS+Web+Agency!8m2!3d40.7201392!4d8.5787694!16s%2Fg%2F1tg_164p!3m7!1s0x12dc6402a0911c99:0x572a199f1be0a9b!8m2!3d40.7201392!4d8.5787694!9m1!1b1!16s%2Fg%2F1tg_164p?entry=ttu';

export interface Review {
  author: string;
  context?: string;
  text: string;
  lang?: string;
}

/** Recensioni Google già pubblicate in homepage (testi invariati) */
export const REVIEWS: Review[] = [
  {
    author: 'Emanuel Orrù',
    context: 'Ema Detailing District',
    text: 'Ho affidato a Luca e alla sua LS Web Agency la realizzazione del sito Ema Detailing District e sono rimasto molto soddisfatto. Professionalità, disponibilità e attenzione ai dettagli hanno reso il lavoro semplice ed efficace. Consiglio sicuramente a chi cerca un sito veloce, moderno e ottimizzato per farsi trovare online.',
  },
  {
    author: 'Francesco Pinna',
    text: 'Ottimo grafico e web designer, uno dei migliori a Sassari con prezzi contenuti e realizzazione siti web di ottima qualità!',
  },
  { author: 'Andrea Pazzola', text: 'Luca Sanna è un Web Designer molto bravo, onesto e molto preparato. Lo consiglio a tutti.' },
  { author: 'Francesca Bandino', text: 'Luca ha realizzato per noi un stupendo ed efficiente sito web!! Ottimo grafico e web designer!' },
  {
    author: 'Chromatic Filters',
    text: 'He did a fantastic job, he delivered to us a fresh and creative design! Thumb up! Ciao',
    lang: 'en',
  },
  {
    author: 'Patrizia Sabbadin',
    text: 'Esperienza straordinaria con LS Web Design Agency! Il loro team creativo ha trasformato la mia visione in un sito web. Professionalità, creatività e tempi rapidi. Altamente raccomandato per chi cerca una Web Design Agency di alto livello.',
  },
  {
    author: 'Even Flow',
    text: "Lavorare con Luca Sanna e il team di LS Web Design Agency per il nostro sito e-commerce è stata un'esperienza al top. Hanno colto al volo la nostra visione, trasformandola in un sito che non solo è bellissimo da vedere ma super funzionale per i nostri clienti. Ho trovato un team dedicato e appassionato e il risultato parla da solo. Non potrei essere più contento e li raccomando a chiunque cerchi professionalità e creatività nel web design.",
  },
  {
    author: 'Diasbelys Lamas Martinez',
    text: "Ho avuto un'ottima esperienza con LS WEB Design Agency. Luca ha fatto un lavoro eccezionale: ha rispettato i tempi di consegna e mi ha restituito un prodotto professionale. Sono molto soddisfatta del servizio ricevuto. Il design del sito è accattivante e ottimizzato per la visualizzazione su tutti i dispositivi. Consiglio vivamente i loro servizi per chiunque abbia bisogno di competenza in web design e aspetto grafico.",
  },
  {
    author: 'Marce',
    text: 'La mia esperienza con la LS WEB DESIGN AGENCY nella creazione del mio sito web è stata eccezionale. Il team ha trasformato la mia visione in realtà con un design moderno, intuitivo e perfettamente funzionale. La loro attenzione al dettaglio e la capacità di catturare esattamente ciò che desideravo hanno reso il processo senza stress e incredibilmente soddisfacente. La comunicazione è stata eccellente, rendendo ogni passo del progetto chiaro e comprensibile. Consiglio vivamente la LS WEB DESIGN AGENCY a chiunque cerchi un servizio di web design di qualità superiore.',
  },
];

export interface Service {
  title: string;
  desc: string;
  includes: string;
  price: string;
  priceNote: string;
  href: string;
  cta: string;
  badge?: string;
}

/** Percorso invariato: valutazione gratuita → audit → sprint → sito strategico */
export const SERVICES: Service[] = [
  {
    title: 'Valutazione iniziale',
    desc: 'Un primo sguardo leggero al sito per capire se ha problemi evidenti di chiarezza, messaggio o percorso verso il contatto.',
    includes: 'Prima impressione sulla homepage · problemi principali · passo successivo consigliato',
    price: 'Gratuita',
    priceNote: 'senza report strutturato',
    href: '/mini-analisi',
    cta: 'Richiedi la valutazione gratuita',
  },
  {
    title: 'Audit del sito',
    desc: 'Analisi tecnica e verifica manuale selettiva: cosa frena i contatti e cosa sistemare per primo, con evidenze e priorità.',
    includes: 'UX e messaggio · SEO tecnica e performance · accessibilità · fino a 10 pagine',
    price: '349 €',
    priceNote: 'prezzo complessivo',
    href: '/servizi/audit-rapido',
    cta: 'Scopri l’audit del sito',
    badge: 'Primo step consigliato',
  },
  {
    title: 'Sprint tecnico',
    desc: 'Interventi mirati su homepage, CTA, pagine servizio, percorso di prenotazione e presenza locale, senza rifare tutto.',
    includes: 'Modifiche verificabili · priorità dall’audit · SEO locale quando serve',
    price: 'Su preventivo',
    priceNote: 'calibrato sulle priorità',
    href: '/servizi/sprint-ottimizzazione',
    cta: 'Scopri lo sprint tecnico',
  },
  {
    title: 'Sito web strategico',
    desc: 'Un sito nuovo o rifatto, costruito intorno a ciò che i clienti cercano e a come ti contattano, con form, SEO e tracciamento integrati.',
    includes: 'Struttura e testi · design responsive · SEO tecnica · moduli e gestione richieste',
    price: 'Su preventivo',
    priceNote: 'calibrato sul progetto',
    href: '/servizi/siti-web',
    cta: 'Scopri il sito web strategico',
  },
];

export interface Faq {
  q: string;
  a: string;
}

/** Le stesse domande della homepage precedente, più una sulle animazioni */
export const FAQS: Faq[] = [
  {
    q: 'Quanto costa indicativamente un sito web?',
    a: 'Dipende da struttura, numero di pagine, contenuti e obiettivi. Preparo sempre un preventivo chiaro prima di iniziare, calibrato sul progetto.',
  },
  {
    q: 'Posso partire da un audit prima di rifare il sito?',
    a: 'Sì. L’audit del sito, su UX, SEO tecnica, performance e accessibilità, serve proprio a capire cosa funziona, cosa frena i contatti e quali interventi hanno priorità. In alcuni casi non serve rifare tutto: può bastare migliorare struttura, testi, CTA o percorso utente.',
  },
  {
    q: 'Quanto tempo serve per mettere online un sito?',
    a: 'Per un sito essenziale i tempi medi possono andare da 2 a 4 settimane, in base alla disponibilità di testi, immagini, feedback e materiali. Prima di iniziare definisco sempre tempi e passaggi principali.',
  },
  {
    q: 'È possibile pagare in più fasi?',
    a: 'Sì, per i progetti completi è possibile concordare un pagamento a fasi: acconto iniziale, saldo intermedio o finale, in base al tipo di lavoro e alla durata del progetto.',
  },
  {
    q: 'Mi aiuti anche dopo la pubblicazione?',
    a: 'Sì. Posso occuparmi di aggiornamenti, piccole modifiche, manutenzione, controlli tecnici e miglioramenti progressivi. L’obiettivo è evitare che il sito venga pubblicato e poi lasciato fermo.',
  },
  {
    q: 'Un sito con animazioni è lento o poco accessibile?',
    a: 'Non se è progettato bene: le animazioni partono solo dopo il caricamento, si fermano fuori schermo e si spengono per chi ha chiesto meno movimento al proprio dispositivo. Sui dispositivi meno potenti resta un’immagine statica.',
  },
  {
    q: 'Lavori solo a Sassari?',
    a: 'No. Lavoro con attività locali e professionisti di Sassari e della Sardegna, ma posso seguire progetti anche a distanza tramite email, videochiamata e strumenti condivisi.',
  },
  {
    q: 'Devo avere già testi e immagini pronti?',
    a: 'Non necessariamente. Se hai già materiali possiamo partire da quelli; se invece mancano, posso aiutarti a organizzare testi, struttura dei contenuti e immagini coerenti con il progetto.',
  },
];
