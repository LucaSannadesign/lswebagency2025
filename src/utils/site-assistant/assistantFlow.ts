/*
 * Configurazione DETERMINISTICA dell'assistente virtuale interno al sito.
 * Nessuna AI, nessun accesso a database o API: solo dati statici + funzioni pure.
 *
 * Contenuti (servizi, prezzi, tempi) basati esclusivamente sulle pagine reali del sito
 * LS Web Agency. Dove un prezzo fisso non esiste (es. siti su misura), si rimanda al
 * preventivo: nessun importo, tempo o promessa inventati.
 *
 * Da NON confondere con:
 *  - src/utils/mini-analisi/assistantFlow.ts (assistente commerciale della mini-analisi);
 *  - src/components/MiniAnalisi.tsx (questionario guidato).
 */

// ===== Tipi =====

export type AssistantIntentId =
  | 'new-site'
  | 'restyling'
  | 'seo'
  | 'landing'
  | 'ai-automation'
  | 'pricing'
  | 'human'
  | 'fallback';

/** Una scelta rapida mostrata sotto un messaggio del bot. */
export type AssistantOption = {
  label: string;
  /** Id del nodo successivo: DEVE esistere in ASSISTANT_NODES. */
  nextNodeId: string;
};

/** Un nodo conversazionale: messaggio del bot + scelte rapide. */
export type AssistantNode = {
  id: string;
  message: string;
  /** Scelte rapide. Ogni nodo ne ha almeno una: nessun vicolo cieco. */
  options: AssistantOption[];
  /** Se true, il nodo invita a lasciare i contatti (il widget mostra il form). */
  isContactCta?: boolean;
  /** Interesse di servizio da registrare se l'utente arriva qui. */
  serviceInterest?: string;
};

/** Intento di alto livello selezionabile dall'utente. */
export type AssistantIntent = {
  id: AssistantIntentId;
  label: string;
  /** Nodo di ingresso del percorso: DEVE esistere in ASSISTANT_NODES. */
  entryNodeId: string;
};

/** Una FAQ controllata, riconosciuta per parole chiave (matching deterministico). */
export type AssistantFaq = {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
};

/** Stato accumulato dal widget durante la conversazione. */
export type AssistantContext = {
  intentId?: AssistantIntentId;
  /** Etichette delle scelte rapide selezionate, in ordine. */
  selections?: string[];
  /** Domande FAQ riconosciute durante la conversazione. */
  faqAsked?: string[];
};

// ===== Costanti =====

export const START_NODE_ID = 'start';
export const FALLBACK_NODE_ID = 'fallback';
export const LEAD_NODE_ID = 'lead';
export const HUMAN_NODE_ID = 'human';

export const INITIAL_MESSAGE =
  'Ciao! 👋 Sono l’assistente di LS Web Agency. Posso darti informazioni sui servizi e, se vuoi, farti ricontattare. Da dove vuoi partire?';

// ===== Nodi del percorso =====

export const ASSISTANT_NODES: Record<string, AssistantNode> = {
  start: {
    id: 'start',
    message: INITIAL_MESSAGE,
    options: [
      { label: 'Voglio un nuovo sito', nextNodeId: 'new-site' },
      { label: 'Voglio migliorare il mio sito', nextNodeId: 'restyling' },
      { label: 'Voglio essere trovato su Google', nextNodeId: 'seo' },
      { label: 'Mi servono più richieste / una landing', nextNodeId: 'landing' },
      { label: 'AI e automazioni', nextNodeId: 'ai-automation' },
      { label: 'Costi e modalità', nextNodeId: 'pricing' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
    ],
  },

  // --- Nuovo sito ---
  'new-site': {
    id: 'new-site',
    message:
      'Realizziamo siti su misura, pensati per portare richieste e clienti: struttura chiara, velocità e SEO di base. Non lavoriamo a “sito vetrina” standard, quindi il prezzo si definisce dopo aver capito obiettivi, pagine e contenuti.',
    serviceInterest: 'Nuovo sito web',
    options: [
      { label: 'Come funziona il percorso', nextNodeId: 'new-site-info' },
      { label: 'Costi e tempi', nextNodeId: 'pricing' },
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
    ],
  },
  'new-site-info': {
    id: 'new-site-info',
    message:
      'Partiamo dagli obiettivi, definiamo struttura e contenuti, poi sviluppo e messa online — tutto orientato a farti contattare, senza template generici. Dopo una breve chiacchierata ti preparo una proposta su misura.',
    serviceInterest: 'Nuovo sito web',
    options: [
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
      { label: 'Torna all’inizio', nextNodeId: 'start' },
    ],
  },

  // --- Restyling ---
  restyling: {
    id: 'restyling',
    message:
      'Se hai già un sito possiamo migliorarlo: immagine, chiarezza del messaggio, velocità e correzioni mirate. Per capire dove intervenire è utile un Audit Rapido del sito (da 299 €, esito in 48 ore); per soli interventi di velocità/correzioni c’è Fix performance/SEO (da 399 €).',
    serviceInterest: 'Restyling sito',
    options: [
      { label: 'Fai un audit del sito', nextNodeId: 'lead' },
      { label: 'Costi e tempi', nextNodeId: 'pricing' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
      { label: 'Torna all’inizio', nextNodeId: 'start' },
    ],
  },

  // --- SEO / visibilità ---
  seo: {
    id: 'seo',
    message:
      'Per farti trovare su Google lavoriamo soprattutto sulla visibilità locale: scheda Google Business Profile, pagine ottimizzate e segnali locali della tua zona.',
    serviceInterest: 'SEO / visibilità locale',
    options: [
      { label: 'SEO locale (Google Business)', nextNodeId: 'seo-local' },
      { label: 'Audit del sito', nextNodeId: 'lead' },
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
    ],
  },
  'seo-local': {
    id: 'seo-local',
    message:
      'Local SEO: Audit Express del tuo Google Business Profile a 99 € (esito in 48 ore) e Setup completo da 490 € per una sede. Se fai prima l’Audit Express, i 99 € vengono scalati dal Setup. La manutenzione mensile è facoltativa e interrompibile.',
    serviceInterest: 'Local SEO',
    options: [
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
      { label: 'Torna all’inizio', nextNodeId: 'start' },
    ],
  },

  // --- Landing page / acquisizione richieste ---
  landing: {
    id: 'landing',
    message:
      'Landing page progettate per convertire: UX orientata all’azione, copy chiaro e CTA visibili. Consegna in 7-10 giorni. Versione Base da 690 €, versione Pro 990 €.',
    serviceInterest: 'Landing page',
    options: [
      { label: 'Cosa include', nextNodeId: 'landing-info' },
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
    ],
  },
  'landing-info': {
    id: 'landing-info',
    message:
      'Un flusso breve e controllato: capiamo cosa vendi, a chi e qual è la CTA migliore, poi mettiamo online la landing in 7-10 giorni. Possibili aggiunte: Google Business Profile (da 490 €), integrazione calendario/prenotazioni (da 200 €), versione multilingua (da 300 €), setup mini-campagna Google Ads (da 150 €).',
    serviceInterest: 'Landing page',
    options: [
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
      { label: 'Torna all’inizio', nextNodeId: 'start' },
    ],
  },

  // --- AI e automazioni ---
  'ai-automation': {
    id: 'ai-automation',
    message:
      'L’Assistente AI risponde 24/7 su sito e WhatsApp alle domande frequenti, raccoglie le richieste e passa a una persona quando serve. Piani: Starter da 300 € + 29 €/mese, Pro da 600 € + 59 €/mese, Plus da 900 € + 99 €/mese. Attivazione in 5-10 giorni lavorativi.',
    serviceInterest: 'Assistente AI',
    options: [
      { label: 'Cosa fa di preciso', nextNodeId: 'ai-info' },
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
    ],
  },
  'ai-info': {
    id: 'ai-info',
    message:
      'Risponde a orari, prezzi, disponibilità e FAQ in modo coerente, con passaggio a una persona su richiesta o per casi delicati. Privacy by design: minimizzazione dei dati e nessun training su dati sensibili. Non prende decisioni legali o mediche e non gestisce pagamenti in chat.',
    serviceInterest: 'Assistente AI',
    options: [
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
      { label: 'Torna all’inizio', nextNodeId: 'start' },
    ],
  },

  // --- Costi e modalità ---
  pricing: {
    id: 'pricing',
    message:
      'Ogni progetto ha un preventivo su misura. Alcuni riferimenti reali: Landing da 690 €, Audit Rapido del sito da 299 €, Fix performance/SEO da 399 €, Local SEO (Audit Express 99 €, Setup da 490 €), Assistente AI da 300 € + 29 €/mese. Per i siti su misura il prezzo si definisce dopo una breve analisi.',
    serviceInterest: 'Costi e modalità',
    options: [
      { label: 'Come funziona il pagamento', nextNodeId: 'pricing-modalita' },
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
    ],
  },
  'pricing-modalita': {
    id: 'pricing-modalita',
    message:
      'Il pagamento viene concordato dopo la conferma del servizio e l’accettazione del preventivo. Eventuali attività ricorrenti (es. manutenzione) sono facoltative e interrompibili secondo gli accordi stabiliti.',
    serviceInterest: 'Costi e modalità',
    options: [
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
      { label: 'Torna all’inizio', nextNodeId: 'start' },
    ],
  },

  // --- Passaggio a Luca ---
  human: {
    id: 'human',
    message:
      'Posso passarti a Luca Sanna (LS Web Agency, Sassari). Negli orari di ufficio ti risponde a breve; fuori orario lascia nome ed email e ti ricontatta. Puoi anche scrivere su WhatsApp dal sito.',
    serviceInterest: 'Contatto con Luca',
    options: [
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Torna all’inizio', nextNodeId: 'start' },
    ],
  },

  // --- Cattura contatto ---
  lead: {
    id: 'lead',
    message:
      'Perfetto. Lasciami nome ed email e ti ricontatto al più presto. Sito, telefono e un messaggio sono facoltativi.',
    isContactCta: true,
    options: [
      { label: 'Parlare con Luca', nextNodeId: 'human' },
      { label: 'Torna all’inizio', nextNodeId: 'start' },
    ],
  },

  // --- Fallback (input non riconosciuto) ---
  fallback: {
    id: 'fallback',
    message:
      'Non sono sicuro di aver capito 🤔. Posso aiutarti su questi temi: scegli un’opzione oppure lascia i tuoi dati e ti ricontatto.',
    options: [
      { label: 'Voglio un nuovo sito', nextNodeId: 'new-site' },
      { label: 'Voglio migliorare il mio sito', nextNodeId: 'restyling' },
      { label: 'Voglio essere trovato su Google', nextNodeId: 'seo' },
      { label: 'Mi servono più richieste / una landing', nextNodeId: 'landing' },
      { label: 'AI e automazioni', nextNodeId: 'ai-automation' },
      { label: 'Costi e modalità', nextNodeId: 'pricing' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
    ],
  },
};

// ===== Intenti selezionabili =====

export const ASSISTANT_INTENTS: AssistantIntent[] = [
  { id: 'new-site', label: 'Nuovo sito', entryNodeId: 'new-site' },
  { id: 'restyling', label: 'Migliorare il sito', entryNodeId: 'restyling' },
  { id: 'seo', label: 'Visibilità su Google', entryNodeId: 'seo' },
  { id: 'landing', label: 'Landing / più richieste', entryNodeId: 'landing' },
  { id: 'ai-automation', label: 'AI e automazioni', entryNodeId: 'ai-automation' },
  { id: 'pricing', label: 'Costi e modalità', entryNodeId: 'pricing' },
  { id: 'human', label: 'Parlare con Luca', entryNodeId: 'human' },
];

const INTENT_LABEL: Partial<Record<AssistantIntentId, string>> = Object.fromEntries(
  ASSISTANT_INTENTS.map((i) => [i.id, i.label]),
);

// ===== FAQ controllate (solo contenuti reali del sito) =====

export const ASSISTANT_FAQ: AssistantFaq[] = [
  {
    id: 'faq-sito-prezzo',
    question: 'Quanto costa un sito?',
    keywords: ['quanto costa un sito', 'prezzo sito', 'costo sito', 'sito quanto', 'prezzo del sito'],
    answer:
      'I siti sono su misura: non vendiamo “sito vetrina” a prezzo fisso. Il prezzo si definisce dopo una breve analisi di obiettivi e contenuti. Posso farti ricontattare per una stima.',
  },
  {
    id: 'faq-landing-prezzo',
    question: 'Quanto costa una landing page?',
    keywords: ['landing', 'pagina di atterraggio'],
    answer: 'Landing page da 690 € (Base) e 990 € (Pro), con consegna in 7-10 giorni.',
  },
  {
    id: 'faq-seo-prezzo',
    question: 'Quanto costa la SEO locale / Google Business?',
    keywords: ['seo', 'google business', 'gbp', 'locale', 'trovato su google', 'visibilita', 'mappe'],
    answer:
      'Local SEO: Audit Express del Google Business Profile a 99 € (48 ore) e Setup da 490 € per una sede (l’Audit Express viene scalato dal Setup). Manutenzione mensile facoltativa e interrompibile.',
  },
  {
    id: 'faq-ai-prezzo',
    question: 'Quanto costa l’assistente AI?',
    keywords: ['assistente', 'chatbot', 'automazione', 'automatizzare', 'whatsapp', 'intelligenza artificiale'],
    answer:
      'Assistente AI: Starter da 300 € + 29 €/mese, Pro da 600 € + 59 €/mese, Plus da 900 € + 99 €/mese. Attivazione in 5-10 giorni lavorativi.',
  },
  {
    id: 'faq-audit',
    question: 'Fate un audit del sito?',
    keywords: ['audit', 'analisi sito', 'sito lento', 'performance', 'problema sito', 'controllo sito'],
    answer:
      'Sì: Audit Rapido del sito da 299 € con esito in 48 ore (UX, SEO tecnica, performance). Per soli interventi di velocità/correzioni c’è Fix performance/SEO da 399 €.',
  },
  {
    id: 'faq-tempi',
    question: 'In quanto tempo consegnate?',
    keywords: ['quanto tempo', 'tempi di consegna', 'in quanto tempo', 'quando consegnate', 'quanto ci vuole', 'tempi di realizzazione', 'consegna'],
    answer:
      'Dipende dal servizio: landing 7-10 giorni, assistente AI 5-10 giorni lavorativi, e-commerce 3-5 settimane (Start) o 6-10 settimane (Pro). Per i siti su misura definiamo i tempi nel preventivo.',
  },
  {
    id: 'faq-pagamento',
    question: 'Come funziona il pagamento?',
    keywords: ['pagamento', 'pagare', 'fattura', 'modalita di pagamento', 'come si paga'],
    answer:
      'Il pagamento si concorda dopo l’accettazione del preventivo. Le attività ricorrenti (es. manutenzione) sono facoltative e interrompibili.',
  },
  {
    id: 'faq-dove',
    question: 'Dove siete?',
    keywords: ['dove siete', 'sede', 'sassari', 'dove vi trovate', 'indirizzo', 'citta'],
    answer:
      'LS Web Agency è di Luca Sanna, con sede a Sassari. Lavoriamo con clienti in tutta Italia. Posso farti ricontattare per i dettagli.',
  },
  {
    id: 'faq-persona',
    question: 'Posso parlare con una persona?',
    keywords: ['persona', 'umano', 'luca', 'telefono', 'chiamare', 'parlare con qualcuno', 'contatto'],
    answer:
      'Certo: ti metto in contatto con Luca. Lascia nome ed email, oppure scrivi su WhatsApp dal sito.',
  },
  {
    id: 'faq-privacy',
    question: 'L’assistente è conforme al GDPR / privacy?',
    keywords: ['gdpr', 'privacy', 'dati personali', 'dati sensibili', 'trattamento dati'],
    answer:
      'Sì: privacy by design, minimizzazione dei dati e nessun training su dati sensibili. L’assistente non prende decisioni legali o mediche e non gestisce pagamenti in chat.',
  },
];

// ===== Funzioni pure =====

/** Restituisce il nodo richiesto, oppure undefined se l'id non esiste. */
export function getAssistantNode(id: string): AssistantNode | undefined {
  return ASSISTANT_NODES[id];
}

function normalize(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Riconosce una FAQ dal testo libero con matching deterministico per parole chiave.
 * Restituisce la FAQ con più corrispondenze (>0), altrimenti null.
 */
export function findFaqAnswer(text: string): AssistantFaq | null {
  const t = normalize(text);
  if (!t) return null;

  let best: { faq: AssistantFaq; score: number } | null = null;
  for (const faq of ASSISTANT_FAQ) {
    let score = 0;
    for (const kw of faq.keywords) {
      if (t.includes(normalize(kw))) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { faq, score };
    }
  }
  return best ? best.faq : null;
}

/**
 * Costruisce un riepilogo leggibile della conversazione, da usare nelle note CRM /
 * nel campo conversationSummary. Niente righe vuote inutili; "—" per i valori assenti.
 */
export function buildAssistantSummary(ctx: AssistantContext): string {
  const intentLabel = ctx.intentId ? INTENT_LABEL[ctx.intentId] ?? ctx.intentId : '—';
  const selections = ctx.selections && ctx.selections.length ? ctx.selections.join(' › ') : '—';
  const faq = ctx.faqAsked && ctx.faqAsked.length ? ctx.faqAsked.join(' | ') : '—';
  return [
    `Intento: ${intentLabel}`,
    `Percorso: ${selections}`,
    `FAQ consultate: ${faq}`,
  ].join('\n');
}
