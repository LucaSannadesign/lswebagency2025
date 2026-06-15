/*
 * Calcolo del profilo progetto a partire dalle risposte della Mini‑Analisi.
 * Logica deterministica: a partire dalle risposte produce punteggi di priorità,
 * il servizio consigliato e la fascia orientativa di intervento.
 * Nessuna chiamata esterna: può girare sia lato client sia lato server.
 */

export type Answers = {
  siteStatus?: string;
  businessType?: string;
  mainGoal?: string;
  primaryNeed?: string;
  assets?: string;
  contactMethod?: string;
  urgency?: string;
};

export type PriorityKey = 'chiarezza' | 'visibilita' | 'conversione' | 'contenuti' | 'automazioni';

export type Profile = {
  priorities: Record<PriorityKey, number>;
  service: string;
  level: string;
  reason: string;
  urgencyScore: number;
};

export default function computeProfile(answers: Answers): Profile {
  // Definizione delle priorità con punteggio iniziale a zero
  const priorities: Record<PriorityKey, number> = {
    chiarezza: 0, // chiarezza dei contenuti/pagine
    visibilita: 0, // visibilità su Google / SEO
    conversione: 0, // percorso verso il contatto
    contenuti: 0, // presenza di testi e immagini
    automazioni: 0, // esigenze di automazioni e CRM
  };

  // Attribuzione punteggi in base allo stato del sito
  if (answers.siteStatus === 'Parto da zero' || answers.siteStatus === 'Solo presenza social') {
    priorities.chiarezza += 2;
    priorities.contenuti += 2;
  } else if (answers.siteStatus === 'Ho già un sito') {
    priorities.chiarezza += 1;
  }

  // Obiettivo principale
  switch (answers.mainGoal) {
    case 'Ricevere più richieste':
      priorities.conversione += 3;
      break;
    case 'Essere trovato su Google':
      priorities.visibilita += 3;
      break;
    case 'Migliorare immagine e fiducia':
      priorities.chiarezza += 3;
      break;
    case 'Vendere online':
      priorities.conversione += 3;
      priorities.chiarezza += 2;
      break;
    case 'Automatizzare risposte':
      priorities.automazioni += 3;
      break;
    default:
      break;
  }

  // Necessità percepita
  switch (answers.primaryNeed) {
    case 'Sito strategico nuovo':
      priorities.chiarezza += 2;
      priorities.conversione += 2;
      break;
    case 'Restyling del sito':
      priorities.chiarezza += 2;
      priorities.conversione += 1;
      break;
    case 'Audit rapido / SEO locale':
      priorities.visibilita += 2;
      break;
    case 'Landing page':
      priorities.conversione += 2;
      break;
    case 'Automazioni AI':
      priorities.automazioni += 2;
      break;
    default:
      break;
  }

  // Disponibilità di contenuti
  switch (answers.assets) {
    case 'Solo logo':
      priorities.contenuti += 1;
      break;
    case 'Nessun contenuto pronto':
      priorities.contenuti += 2;
      break;
    default:
      // 'Testi e logo pronti' non aggiunge peso ai contenuti
      break;
  }

  // Modalità di gestione delle richieste
  if (answers.contactMethod === 'In modo poco ordinato') {
    priorities.automazioni += 2;
    priorities.conversione += 1;
  }

  // Urgenza
  let urgencyScore = 0;
  switch (answers.urgency) {
    case 'Entro 1 mese':
      urgencyScore = 3;
      break;
    case '1–3 mesi':
      urgencyScore = 2;
      break;
    case '3–6 mesi':
      urgencyScore = 1;
      break;
    default:
      urgencyScore = 0;
      break;
  }

  // Determinazione del servizio consigliato
  const totalPriority = Object.values(priorities).reduce((acc, val) => acc + val, 0);
  let service = '';
  let level = '';
  let reason = '';

  // Scelta del servizio: i bisogni specifici scelti dall'utente hanno priorità
  // sui fallback generici basati sullo stato del sito.
  if (answers.primaryNeed === 'Audit rapido / SEO locale') {
    service = 'Audit e SEO locale';
    reason = 'la visibilità su Google è la priorità principale';
  } else if (answers.primaryNeed === 'Landing page') {
    service = 'Landing page';
    reason = 'ti serve una singola pagina con percorso di conversione rapido';
  } else if (answers.primaryNeed === 'Automazioni AI') {
    service = 'Automazioni e CRM';
    reason = 'vuoi organizzare meglio le richieste e automatizzare i processi';
  } else if (answers.primaryNeed === 'Sito strategico nuovo' || answers.siteStatus === 'Parto da zero') {
    service = 'Sito web strategico';
    reason = 'parti da zero o necessiti di una struttura completa';
  } else if (answers.primaryNeed === 'Restyling del sito' || answers.siteStatus === 'Ho già un sito') {
    service = 'Restyling del sito';
    reason = 'hai un sito esistente ma desideri migliorare l’immagine o le prestazioni';
  } else {
    // fallback basato sui punteggi
    if (priorities.conversione >= Math.max(priorities.chiarezza, priorities.visibilita)) {
      service = 'Sito web strategico';
      reason = 'l’obiettivo principale è convertire più visite in richieste';
    } else if (priorities.visibilita >= Math.max(priorities.chiarezza, priorities.conversione)) {
      service = 'Audit e SEO locale';
      reason = 'la visibilità su Google è la priorità principale';
    } else {
      service = 'Restyling del sito';
      reason = 'è importante migliorare la chiarezza e l’immagine';
    }
  }

  // Determinazione della fascia in base al punteggio complessivo
  if (totalPriority <= 5) {
    level = 'Intervento leggero';
  } else if (totalPriority <= 10) {
    level = 'Intervento standard';
  } else {
    level = 'Intervento avanzato';
  }

  return {
    priorities,
    service,
    level,
    reason,
    urgencyScore,
  };
}
