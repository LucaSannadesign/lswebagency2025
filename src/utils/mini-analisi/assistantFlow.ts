/*
 * Configurazione dei percorsi condizionali dell'Assistente commerciale guidato
 * (MiniAnalisi in variant="assistant"). Deterministico, nessuna AI.
 *
 * La scelta iniziale (intent) imposta un "preset" sulle chiavi note di Answers,
 * così computeProfile/buildSummary producono servizio + livello + fascia senza
 * modifiche. Le domande del percorso raccolgono le altre chiavi note e alcune
 * chiavi "extra" (URL, località, canale…) trasportate solo nelle note CRM/Resend.
 *
 * IMPORTANTE: per le chiavi note (mainGoal, assets, contactMethod, urgency,
 * siteStatus, primaryNeed) le opzioni usano le STESSE stringhe di questions.json,
 * altrimenti i punteggi deterministici non scattano.
 */

import type { Answers } from './computeProfile';

export type AssistantQuestion = {
  key: keyof Answers;
  text: string;
  type: 'choice' | 'text';
  options?: string[];
  placeholder?: string;
  optional?: boolean;
};

export type AssistantIntent = {
  id: string;
  label: string;
  /** Valori preimpostati sulle chiavi note di Answers in base all'intento scelto. */
  preset: Partial<Answers>;
  questions: AssistantQuestion[];
};

export const INITIAL_QUESTION = 'Come posso aiutarti con il tuo progetto?';

// Opzioni riutilizzate, allineate a questions.json per coerenza col motore.
const URGENCY_OPTIONS = ['Entro 1 mese', '1–3 mesi', '3–6 mesi', 'Non c’è scadenza'];
const ASSETS_OPTIONS = ['Testi e logo pronti', 'Solo logo', 'Nessun contenuto pronto'];

export const assistantIntents: AssistantIntent[] = [
  {
    id: 'nuovo-sito',
    label: 'Voglio creare un nuovo sito',
    preset: { primaryNeed: 'Sito strategico nuovo', siteStatus: 'Parto da zero' },
    questions: [
      {
        key: 'businessType',
        text: 'Che tipo di attività hai?',
        type: 'choice',
        options: ['Professionista', 'Azienda locale', 'E‑commerce', 'Altro'],
      },
      {
        key: 'mainGoal',
        text: 'Qual è l’obiettivo principale del sito?',
        type: 'choice',
        options: ['Ricevere più richieste', 'Essere trovato su Google', 'Migliorare immagine e fiducia', 'Vendere online'],
      },
      {
        key: 'assets',
        text: 'Hai già logo, testi e immagini?',
        type: 'choice',
        options: ASSETS_OPTIONS,
      },
      {
        key: 'features',
        text: 'Di quali funzionalità pensi di aver bisogno?',
        type: 'choice',
        options: ['Sito vetrina semplice', 'Più pagine e servizi', 'Prenotazioni o preventivi', 'Vendita online'],
      },
      {
        key: 'urgency',
        text: 'Quanto è urgente il progetto?',
        type: 'choice',
        options: URGENCY_OPTIONS,
      },
    ],
  },
  {
    id: 'restyling',
    label: 'Voglio migliorare il mio sito',
    preset: { primaryNeed: 'Restyling del sito', siteStatus: 'Ho già un sito' },
    questions: [
      {
        key: 'websiteUrl',
        text: 'Qual è l’indirizzo del tuo sito attuale?',
        type: 'text',
        placeholder: 'esempio.it (facoltativo)',
        optional: true,
      },
      {
        key: 'problem',
        text: 'Qual è il problema principale oggi?',
        type: 'choice',
        options: ['Immagine datata', 'Pochi contatti', 'Sito lento', 'Messaggio poco chiaro'],
      },
      {
        key: 'mainGoal',
        text: 'Cosa vorresti ottenere dal restyling?',
        type: 'choice',
        options: ['Migliorare immagine e fiducia', 'Ricevere più richieste', 'Essere trovato su Google', 'Vendere online'],
      },
      {
        key: 'desiredAction',
        text: 'Quale azione dovrebbe compiere chi visita il sito?',
        type: 'choice',
        options: ['Contattarti o chiedere un preventivo', 'Chiamarti', 'Acquistare online', 'Prenotare un appuntamento'],
      },
      {
        key: 'urgency',
        text: 'Quanto è urgente il progetto?',
        type: 'choice',
        options: URGENCY_OPTIONS,
      },
    ],
  },
  {
    id: 'seo',
    label: 'Voglio essere trovato su Google',
    preset: { primaryNeed: 'Audit rapido / SEO locale', mainGoal: 'Essere trovato su Google' },
    questions: [
      {
        key: 'location',
        text: 'In quale zona o mercato vuoi essere trovato?',
        type: 'text',
        placeholder: 'es. Sassari, Nord Sardegna…',
      },
      {
        key: 'serviceToPromote',
        text: 'Quale servizio o prodotto vuoi promuovere?',
        type: 'text',
        placeholder: 'Descrivilo in breve (facoltativo)',
        optional: true,
      },
      {
        key: 'siteStatus',
        text: 'Hai già un sito online?',
        type: 'choice',
        options: ['Ho già un sito', 'Parto da zero', 'Solo presenza social', 'Non sono sicuro'],
      },
      {
        key: 'googleBusiness',
        text: 'Hai un profilo Google Business attivo?',
        type: 'choice',
        options: ['Sì, è attivo', 'No', 'Non lo so'],
      },
    ],
  },
  {
    id: 'landing',
    label: 'Mi serve una landing page',
    preset: { primaryNeed: 'Landing page' },
    questions: [
      {
        key: 'product',
        text: 'Quale prodotto o servizio vuoi promuovere?',
        type: 'text',
        placeholder: 'Descrivilo in breve',
      },
      {
        key: 'trafficSource',
        text: 'Da dove arriverà il traffico?',
        type: 'choice',
        options: ['Google Ads', 'Social', 'Email', 'Passaparola', 'Non lo so ancora'],
      },
      {
        key: 'desiredAction',
        text: 'Qual è l’azione finale desiderata?',
        type: 'choice',
        options: ['Compilare un modulo', 'Telefonare', 'Scrivere su WhatsApp', 'Acquistare', 'Prenotare'],
      },
      {
        key: 'assets',
        text: 'Hai già testi e materiali pronti?',
        type: 'choice',
        options: ASSETS_OPTIONS,
      },
      {
        key: 'urgency',
        text: 'Quanto è urgente?',
        type: 'choice',
        options: URGENCY_OPTIONS,
      },
    ],
  },
  {
    id: 'automazioni',
    label: 'Voglio automatizzare richieste e risposte',
    preset: { primaryNeed: 'Automazioni AI', mainGoal: 'Automatizzare risposte' },
    questions: [
      {
        key: 'channel',
        text: 'Su quale canale ti serve l’assistente?',
        type: 'choice',
        options: ['Sito', 'WhatsApp', 'Entrambi'],
      },
      {
        key: 'repetitiveQuestions',
        text: 'Quali domande ricevi più spesso?',
        type: 'choice',
        options: ['Orari e sede', 'Prezzi e preventivi', 'Disponibilità', 'Assistenza post-vendita', 'Un po’ di tutto'],
      },
      {
        key: 'needLeads',
        text: 'Vuoi anche raccogliere i contatti di chi scrive?',
        type: 'choice',
        options: ['Sì, raccogliere i contatti', 'No, solo risposte'],
      },
      {
        key: 'needHandover',
        text: 'Serve il passaggio a una persona quando necessario?',
        type: 'choice',
        options: ['Sì, con passaggio a una persona', 'No, non serve'],
      },
      {
        key: 'sensitiveData',
        text: 'Tratti dati sensibili nelle conversazioni?',
        type: 'choice',
        options: ['Sì', 'No', 'Non lo so'],
      },
      {
        key: 'requestVolume',
        text: 'Che volume di richieste hai indicativamente?',
        type: 'choice',
        options: ['Poche a settimana', 'Alcune al giorno', 'Molte al giorno'],
      },
    ],
  },
  {
    id: 'non-so',
    label: 'Non so ancora cosa mi serve',
    preset: { primaryNeed: 'Non so ancora' },
    questions: [
      {
        key: 'problem',
        text: 'Qual è il problema principale che senti oggi?',
        type: 'choice',
        options: ['Ho pochi contatti', 'Non mi trovano su Google', 'Immagine poco professionale', 'Gestione disordinata', 'Non saprei'],
      },
      {
        key: 'mainGoal',
        text: 'Qual è l’obiettivo che ti interessa di più?',
        type: 'choice',
        options: ['Ricevere più richieste', 'Essere trovato su Google', 'Migliorare immagine e fiducia', 'Vendere online', 'Automatizzare risposte'],
      },
      {
        key: 'siteStatus',
        text: 'Hai già un sito online o parti da zero?',
        type: 'choice',
        options: ['Ho già un sito', 'Parto da zero', 'Solo presenza social', 'Non sono sicuro'],
      },
      {
        key: 'contactMethod',
        text: 'Come gestisci oggi le richieste dei clienti?',
        type: 'choice',
        options: ['Email', 'Telefono', 'WhatsApp', 'Form sul sito', 'Social', 'In modo poco ordinato'],
      },
      {
        key: 'urgency',
        text: 'Quanto è urgente?',
        type: 'choice',
        options: URGENCY_OPTIONS,
      },
    ],
  },
];

// Mappa id intento → label leggibile (per note CRM e riepilogo).
export const intentLabelById: Record<string, string> = Object.fromEntries(
  assistantIntents.map((i) => [i.id, i.label]),
);

// === Pacchetti reali Assistente AI ===
// Fonte unica degli importi, allineata ai prezzi già presenti nella pagina servizio e
// nel JSON-LD (Starter 300/29, Pro 600/59, Plus 900/99). Nessun importo inventato.
export type AssistantTier = 'Starter' | 'Pro' | 'Plus';

export const ASSISTANT_PACKAGES: Record<AssistantTier, { tier: AssistantTier; setup: number; monthly: number }> = {
  Starter: { tier: 'Starter', setup: 300, monthly: 29 },
  Pro: { tier: 'Pro', setup: 600, monthly: 59 },
  Plus: { tier: 'Plus', setup: 900, monthly: 99 },
};

// Derivazione deterministica del pacchetto dal percorso "automazioni", da valori ammessi.
// Usata sia lato client (display) sia lato server (salvataggio): stesso risultato per costruzione.
export function deriveAssistantTier(answers: Partial<Answers>): AssistantTier {
  if (answers.requestVolume === 'Molte al giorno' || answers.sensitiveData === 'Sì') return 'Plus';
  if (answers.channel === 'Entrambi') return 'Pro';
  if (answers.channel === 'Sito' || answers.channel === 'WhatsApp') return 'Starter';
  return 'Pro';
}

// Riga orientativa con prezzi reali per il risultato dell'assistente (percorso automazioni).
export function formatAssistantPackage(tier: AssistantTier): string {
  const p = ASSISTANT_PACKAGES[tier];
  return `Soluzione orientativa: ${p.tier} — ${p.setup} € di configurazione + ${p.monthly} €/mese.`;
}

// Etichette leggibili per le chiavi extra, usate nel riepilogo e nelle note.
export const EXTRA_FIELD_LABELS: Partial<Record<keyof Answers, string>> = {
  websiteUrl: 'Sito attuale',
  features: 'Funzionalità',
  problem: 'Problema principale',
  desiredAction: 'Azione desiderata',
  location: 'Area / mercato',
  serviceToPromote: 'Servizio da promuovere',
  googleBusiness: 'Google Business Profile',
  product: 'Prodotto/servizio',
  trafficSource: 'Provenienza traffico',
  channel: 'Canale',
  repetitiveQuestions: 'Domande ricorrenti',
  needLeads: 'Raccolta lead',
  needHandover: 'Passaggio umano',
  sensitiveData: 'Dati sensibili',
  requestVolume: 'Volume richieste',
};
