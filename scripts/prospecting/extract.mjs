/**
 * Estrazione dei contatti dal markup pubblico di una pagina.
 *
 * Spostate qui dal corpo di run.mjs per la stessa ragione di classify.mjs:
 * run.mjs esegue la discovery al primo livello del modulo, quindi non è
 * importabile da un test senza far partire una chiamata reale. Le funzioni sono
 * pure e il comportamento è quello di prima, con una sola correzione — la
 * deduplica delle email, descritta sotto.
 */

/** Scarta i valori vuoti e i duplicati, preservando l'ordine di arrivo. */
export function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

/** Valori di href per uno schema dato (`mailto`, `tel`), già decodificati. */
export function extractHrefValues(html, scheme) {
  const regex = new RegExp(`href=["']${scheme}:([^"'#?]+)[^"']*["']`, 'gi');
  const out = [];
  let match;
  while ((match = regex.exec(html))) out.push(decodeURIComponent(match[1]).trim());
  return unique(out);
}

/**
 * Indirizzi email trovati negli href `mailto:` e nel testo.
 *
 * La normalizzazione precede la deduplica: nell'ordine opposto lo stesso
 * indirizzo scritto con maiuscole diverse nel link e nel testo passava per due
 * contatti distinti — è così che `saleepepesassari@gmail.com` compariva due
 * volte nello stesso record.
 */
export function extractEmails(html) {
  const mailto = extractHrefValues(html, 'mailto').map((value) => value.split('?')[0]);
  const textMatches = String(html).match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  return unique([...mailto, ...textMatches].map((value) => value.trim().toLowerCase()))
    .filter((value) => !value.endsWith('@example.com') && !value.includes('wixpress.com'))
    .slice(0, 5);
}

/** Numeri dagli href `tel:`, ridotti a cifre e prefisso. */
export function extractPhones(html) {
  const tel = extractHrefValues(html, 'tel')
    .map((value) => value.replace(/[^+\d]/g, ''))
    .filter((value) => value.replace(/\D/g, '').length >= 7);
  return unique(tel).slice(0, 5);
}

/**
 * Chiave di confronto fra numeri di telefono.
 *
 * Serve perché la stessa utenza arriva in forme diverse a seconda della fonte:
 * il sito scrive `+39 079 123456`, Google restituisce `079 123456`. Tolte le
 * non-cifre e il prefisso internazionale italiano, i due coincidono — e senza
 * questo passaggio finirebbero in tabella come due recapiti distinti.
 *
 * Il prefisso si toglie solo quando resta un numero di lunghezza plausibile:
 * non si accorcia un numero che comincia per 39 ed è già corto.
 */
export function phoneKey(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.startsWith('39') && digits.length > 9) return digits.slice(2);
  return digits;
}

/** Forma normalizzata di un numero: solo `+` iniziale e cifre. */
export function normalizePhone(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  const plus = trimmed.startsWith('+') ? '+' : '';
  const digits = trimmed.replace(/\D/g, '');
  return digits ? `${plus}${digits}` : '';
}

/**
 * Unisce i recapiti telefonici di più fonti, scartando gli equivalenti.
 *
 * L'ordine degli argomenti è l'ordine di preferenza: i numeri letti dal sito
 * vengono prima di quello della scheda Google, che resta comunque l'unico
 * appiglio per un'attività senza sito.
 */
export function mergePhones(...sources) {
  const out = [];
  const seen = new Set();

  for (const value of sources.flat()) {
    const normalized = normalizePhone(value);
    if (!normalized) continue;
    const key = phoneKey(normalized);
    if (key.length < 7 || seen.has(key)) continue;
    seen.add(key);
    out.push(normalized);
  }

  return out.slice(0, 5);
}
