/*
 * Configurazione DETERMINISTICA dell'assistente virtuale interno al sito.
 * Nessuna AI, nessun accesso a database o API: solo dati statici + funzioni pure.
 *
 * Nomi e prezzi NON si scrivono più a mano nei messaggi: vengono da
 * src/config/services.ts, che a sua volta ricalca le pagine servizio. Dove un
 * prezzo fisso non esiste (es. siti su misura), si rimanda al preventivo:
 * nessun importo, tempo o promessa inventati.
 *
 * Da NON confondere con:
 *  - src/utils/mini-analisi/assistantFlow.ts (assistente commerciale della mini-analisi);
 *  - src/components/MiniAnalisi.tsx (questionario guidato).
 */

// Import con estensione .ts: è la forma che regge sia sotto Astro/Vite sia sotto
// il runner di test di Node, che risolve i moduli ESM per percorso esatto.
import { getService, serviceName, type ServiceKey } from '../../config/services.ts';

// ===== Servizi citati nei messaggi =====

const VALUTAZIONE = getService('valutazione-iniziale');
const AUDIT = getService('audit-sito');
const FIX = getService('fix-performance-seo');
const SPRINT = getService('sprint-ottimizzazione');
const LANDING = getService('landing-page');
const SEO_LOCALE = getService('seo-locale');

/** "Fix Mirato 399 €": nome del livello e prezzo, entrambi dalla sorgente. */
function tierLine(key: ServiceKey, tierKey: string): string {
  const tier = getService(key).tiers?.find((t) => t.key === tierKey);
  return tier ? `${tier.name} ${tier.priceLabel}` : serviceName(key);
}

/** Solo il prezzo di un livello ("da 490 €"), quando il nome è già nella frase. */
function tierPrice(key: ServiceKey, tierKey: string): string {
  const tier = getService(key).tiers?.find((t) => t.key === tierKey);
  return tier ? tier.priceLabel : getService(key).priceLabel;
}

/** "Google Business Profile (da 490 €), …": add-on nell'ordine del catalogo. */
function addonList(key: ServiceKey): string {
  return (getService(key).addons ?? []).map((addon) => `${addon.name} (${addon.priceLabel})`).join(', ');
}

// ===== Tipi =====

export type AssistantIntentId =
  | 'new-site'
  | 'restyling'
  | 'seo'
  | 'landing'
  | 'ai-automation'
  | 'sprint'
  | 'valutazione'
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
      { label: 'Interventi rapidi e misurabili', nextNodeId: 'sprint' },
      { label: 'Non so ancora cosa mi serve', nextNodeId: 'valutazione' },
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
    message: `Se hai già un sito possiamo migliorarlo: immagine, chiarezza del messaggio, velocità e correzioni mirate. Per capire dove intervenire è utile l’${AUDIT.name} (${AUDIT.priceLabel}), che copre UX, SEO tecnica, performance e accessibilità; per soli interventi di velocità/correzioni c’è ${FIX.name}, in due livelli: ${tierLine('fix-performance-seo', 'mirato')} e ${tierLine('fix-performance-seo', 'completo')}.`,
    serviceInterest: 'Restyling sito',
    options: [
      { label: 'Fai un audit del sito', nextNodeId: 'lead' },
      { label: 'Interventi rapidi e misurabili', nextNodeId: 'sprint' },
      { label: 'Costi e tempi', nextNodeId: 'pricing' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
      { label: 'Torna all’inizio', nextNodeId: 'start' },
    ],
  },

  // --- Sprint di Ottimizzazione ---
  sprint: {
    id: 'sprint',
    message: `${SPRINT.name}: un ciclo breve di interventi mirati su conversione, performance e misurazione, con consegna in 10-15 giorni. Il perimetro si definisce prima di iniziare, quindi il prezzo è ${SPRINT.priceLabel.toLowerCase()}.`,
    serviceInterest: SPRINT.name,
    options: [
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Costi e modalità', nextNodeId: 'pricing' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
      { label: 'Torna all’inizio', nextNodeId: 'start' },
    ],
  },

  // --- Valutazione iniziale gratuita ---
  valutazione: {
    id: 'valutazione',
    message: `Se non hai ancora deciso, c’è la ${VALUTAZIONE.name}: rispondi a poche domande e ricevi un orientamento su priorità, servizio consigliato e fascia indicativa. Raccoglie informazioni iniziali, non include verifiche tecniche complete e non sostituisce l’${AUDIT.name}. La trovi nel menu del sito, alla voce “${VALUTAZIONE.name}”.`,
    serviceInterest: VALUTAZIONE.name,
    options: [
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Fai un audit del sito', nextNodeId: 'lead' },
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
      { label: `${SEO_LOCALE.name} (Google Business)`, nextNodeId: 'seo-local' },
      { label: 'Audit del sito', nextNodeId: 'lead' },
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
    ],
  },
  'seo-local': {
    id: 'seo-local',
    message: `${SEO_LOCALE.name}: verifica locale iniziale del tuo Google Business Profile (su preventivo) e Setup completo ${tierPrice('seo-locale', 'setup')} per una sede. La verifica iniziale confluisce nel Setup, senza costi doppi. La manutenzione mensile (${tierPrice('seo-locale', 'manutenzione')}) è facoltativa e interrompibile.`,
    serviceInterest: SEO_LOCALE.name,
    options: [
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
      { label: 'Torna all’inizio', nextNodeId: 'start' },
    ],
  },

  // --- Landing page / acquisizione richieste ---
  landing: {
    id: 'landing',
    message: `Landing page progettate per convertire: UX orientata all’azione, copy chiaro e CTA visibili. Consegna in 7-10 giorni. ${tierLine('landing-page', 'base')}, ${tierLine('landing-page', 'plus')}.`,
    serviceInterest: LANDING.name,
    options: [
      { label: 'Cosa include', nextNodeId: 'landing-info' },
      { label: 'Lascia i tuoi dati', nextNodeId: 'lead' },
      { label: 'Parlare con Luca', nextNodeId: 'human' },
    ],
  },
  'landing-info': {
    id: 'landing-info',
    message: `Un flusso breve e controllato: capiamo cosa vendi, a chi e qual è la CTA migliore, poi mettiamo online la landing in 7-10 giorni. Possibili aggiunte: ${addonList('landing-page')}.`,
    serviceInterest: LANDING.name,
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
      'L’Assistente AI per sito e WhatsApp viene configurato sui contenuti della tua attività. Può rispondere automaticamente alle domande frequenti anche fuori orario, raccogliere le richieste e facilitare il passaggio a una persona. Canali, integrazioni, tempi e costi vengono definiti dopo una valutazione.',
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
      'Può rispondere a domande frequenti come orari, servizi e modalità di contatto, raccogliere i dati essenziali e inoltrare la richiesta quando serve. La configurazione applica minimizzazione dei dati e regole di conservazione; strumenti, eventuali costi esterni e condizioni privacy dipendono dal progetto. Non prende decisioni legali o mediche e non sostituisce il supporto umano nei casi complessi.',
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
    message: `Ogni progetto ha un preventivo su misura. Alcuni riferimenti reali: ${AUDIT.name} ${AUDIT.priceLabel}, ${FIX.name} ${FIX.priceLabel}, ${LANDING.name} ${LANDING.priceLabel.toLowerCase()}, ${SEO_LOCALE.name} (verifica locale iniziale su preventivo, Setup ${tierPrice('seo-locale', 'setup')}), ${SPRINT.name} e Assistente AI su preventivo, in base a perimetro, canali e volume delle richieste. Per i siti su misura il prezzo si definisce dopo una breve analisi, e la ${VALUTAZIONE.name} è sempre disponibile come primo orientamento.`,
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
      { label: 'Interventi rapidi e misurabili', nextNodeId: 'sprint' },
      { label: 'Non so ancora cosa mi serve', nextNodeId: 'valutazione' },
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
  { id: 'sprint', label: SPRINT.name, entryNodeId: 'sprint' },
  { id: 'valutazione', label: VALUTAZIONE.name, entryNodeId: 'valutazione' },
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
    answer: `${LANDING.name}: ${tierLine('landing-page', 'base')} e ${tierLine('landing-page', 'plus')}, con consegna in 7-10 giorni.`,
  },
  {
    id: 'faq-seo-prezzo',
    question: 'Quanto costa la SEO locale / Google Business?',
    keywords: ['seo', 'google business', 'gbp', 'locale', 'trovato su google', 'visibilita', 'mappe'],
    answer: `${SEO_LOCALE.name}: verifica locale iniziale del Google Business Profile (su preventivo) e Setup ${tierPrice('seo-locale', 'setup')} per una sede (la verifica iniziale confluisce nel Setup). Manutenzione mensile ${tierPrice('seo-locale', 'manutenzione')}, facoltativa e interrompibile.`,
  },
  {
    id: 'faq-ai-prezzo',
    question: 'Quanto costa l’assistente AI?',
    keywords: ['assistente', 'chatbot', 'automazione', 'automatizzare', 'whatsapp', 'intelligenza artificiale'],
    answer:
      'Il costo dipende dai canali, dal numero di flussi, dalle integrazioni e dal volume delle richieste. Dopo una valutazione ricevi una proposta che distingue configurazione, eventuali costi di servizi esterni e gestione opzionale.',
  },
  {
    id: 'faq-audit',
    question: 'Fate un audit del sito?',
    keywords: ['audit', 'analisi sito', 'sito lento', 'performance', 'problema sito', 'controllo sito'],
    answer: `Sì: ${AUDIT.name} a ${AUDIT.priceLabel} (UX, SEO tecnica, performance, accessibilità). Per soli interventi di velocità/correzioni c’è ${FIX.name}, in due livelli: ${tierLine('fix-performance-seo', 'mirato')} e ${tierLine('fix-performance-seo', 'completo')}.`,
  },
  {
    id: 'faq-valutazione-gratuita',
    question: 'C’è qualcosa di gratuito per capire da dove partire?',
    keywords: ['gratis', 'gratuito', 'gratuita', 'valutazione iniziale', 'da dove parto', 'non so da dove'],
    answer: `Sì: la ${VALUTAZIONE.name}. Rispondi a poche domande e ricevi un orientamento su priorità e servizio consigliato. Non include verifiche tecniche complete e non sostituisce l’${AUDIT.name}.`,
  },
  {
    id: 'faq-tempi',
    question: 'In quanto tempo consegnate?',
    keywords: ['quanto tempo', 'tempi di consegna', 'in quanto tempo', 'quando consegnate', 'quanto ci vuole', 'tempi di realizzazione', 'consegna'],
    answer: `Dipende dal servizio: landing 7-10 giorni, ${SPRINT.name} 10-15 giorni, per l’assistente AI i tempi vengono definiti dopo la valutazione dei canali e dei flussi, e-commerce 3-5 settimane (Start) o 6-10 settimane (Pro). Per i siti su misura definiamo i tempi nel preventivo.`,
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
      'Il servizio viene configurato applicando minimizzazione dei dati, regole di conservazione e controllo degli accessi. La configurazione definitiva dipende dagli strumenti utilizzati e dai trattamenti del cliente e non costituisce certificazione o consulenza legale.',
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
