/*
 * Costruisce un riepilogo deterministico della Mini‑Analisi a partire dalle
 * risposte e dal profilo calcolato da computeProfile.
 * Non usa AI: i contenuti derivano direttamente dai punteggi, così il risultato
 * è coerente, verificabile e privo di costi o dipendenze esterne.
 */

import type { Answers, PriorityKey, Profile } from './computeProfile';
import { deriveAssistantTier, formatAssistantPackage } from './assistantFlow';

const PRIORITY_LABELS: Record<PriorityKey, string> = {
  chiarezza: 'Chiarezza del messaggio e della struttura',
  visibilita: 'Visibilità su Google (SEO locale)',
  conversione: 'Percorso verso il contatto (conversione)',
  contenuti: 'Contenuti (testi, immagini, logo)',
  automazioni: 'Automazioni e gestione delle richieste',
};

const LEVEL_NOTES: Record<string, string> = {
  'Intervento leggero':
    'Pochi interventi mirati: ottimizzazioni rapide a basso impatto, ideali per partire con un budget contenuto.',
  'Intervento standard':
    'Un progetto strutturato ma proporzionato, adatto alla maggior parte delle attività.',
  'Intervento avanzato':
    'Un progetto più completo, con diversi ambiti da coordinare per ottenere un risultato solido.',
};

// Tempi indicativi: riflettono l'urgenza dichiarata dall'utente, non promettono consegne.
const TIMELINE_BY_URGENCY: Record<string, string> = {
  'Entro 1 mese': 'In linea con la tua urgenza: avvio rapido, entro circa un mese.',
  '1–3 mesi': 'Tempistica indicativa di 1–3 mesi, da definire insieme.',
  '3–6 mesi': 'Tempistica indicativa di 3–6 mesi, con calendario condiviso.',
  'Non c’è scadenza': 'Nessuna scadenza stringente: pianifichiamo con calma le priorità.',
};

export type SummaryPriority = {
  key: PriorityKey;
  label: string;
  score: number;
};

export type Summary = {
  headline: string;
  intro: string;
  topPriorities: SummaryPriority[];
  service: string;
  reason: string;
  level: string;
  levelNote: string;
  cta: string;
  // Campi aggiuntivi mostrati dall'assistente guidato (variant="assistant").
  priceBand: string;
  priceDisclaimer: string;
  timeline: string;
};

export default function buildSummary(answers: Answers, profile: Profile): Summary {
  const business = answers.businessType && answers.businessType !== 'Altro' ? answers.businessType.toLowerCase() : 'la tua attività';

  const goal = answers.mainGoal && answers.mainGoal !== 'Altro' ? answers.mainGoal.toLowerCase() : 'crescere online';

  // Ordina le priorità per punteggio e tiene solo quelle realmente emerse (> 0)
  const topPriorities: SummaryPriority[] = (Object.entries(profile.priorities) as [PriorityKey, number][])
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, score]) => ({ key, label: PRIORITY_LABELS[key], score }));

  const intro =
    topPriorities.length > 0
      ? `In base alle tue risposte, per ${business} l’obiettivo “${goal}” passa soprattutto da questi punti:`
      : `In base alle tue risposte, per ${business} possiamo costruire un percorso chiaro verso l’obiettivo “${goal}”.`;

  // Fascia economica: prezzi reali SOLO per il percorso "automazioni" (Assistente AI);
  // per gli altri percorsi nessun importo inventato, valutazione rimandata all'analisi.
  const isAutomations = answers.initialIntent === 'automazioni';
  const priceBand = isAutomations
    ? formatAssistantPackage(deriveAssistantTier(answers))
    : 'Valutazione economica da definire dopo l’analisi del progetto.';
  const priceDisclaimer = isAutomations
    ? 'La soluzione e i costi dovranno essere confermati dopo una verifica del progetto.'
    : '';

  return {
    headline: 'Ecco la tua valutazione guidata',
    intro,
    topPriorities,
    service: profile.service,
    reason: profile.reason,
    level: profile.level,
    levelNote: LEVEL_NOTES[profile.level] ?? '',
    cta: 'Questo è un primo orientamento basato sulle informazioni che hai inserito, non un preventivo. Lasciami i tuoi contatti e ti preparo una proposta personalizzata.',
    priceBand,
    priceDisclaimer,
    timeline: (answers.urgency && TIMELINE_BY_URGENCY[answers.urgency]) || 'Tempistica da concordare in base alle priorità.',
  };
}
