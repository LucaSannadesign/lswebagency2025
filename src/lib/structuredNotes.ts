// src/lib/structuredNotes.ts
// Serializzazione del blocco "Dati strutturati" delle note CRM.
// Garantisce SEMPRE JSON valido: mai troncamento con slice (che può spezzare
// il JSON a metà). Degrada da { answers, summary } a { answers } e, se anche
// questa versione supera il limite, restituisce null (blocco omesso).
// Funzione pura: non modifica answers né summary.

export const MAX_STRUCTURED_NOTES_LEN = 4000;

function tryStringify(value: unknown): string | null {
  try {
    const s = JSON.stringify(value);
    return typeof s === 'string' ? s : null;
  } catch {
    // Strutture circolari o non serializzabili: nessun blocco strutturato.
    return null;
  }
}

export function serializeStructuredNotes(
  answers: unknown,
  summary: unknown,
  maxLen: number = MAX_STRUCTURED_NOTES_LEN,
): string | null {
  const full = tryStringify({ answers, summary });
  if (full !== null && full.length <= maxLen) return full;

  const partial = tryStringify({ answers });
  if (partial !== null && partial.length <= maxLen) return partial;

  return null;
}
