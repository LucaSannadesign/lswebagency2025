// src/lib/siteRescueUrl.ts
// Validazione/normalizzazione STRETTA dell'URL destinato alla coda LS Site Rescue.
// Modulo puro (nessuna dipendenza esterna, nessun segreto): importa solo node:net
// per riconoscere gli indirizzi IP letterali. Usato SOLO lato server dall'endpoint
// /api/mini-analisi. Restituisce l'URL normalizzato oppure null se non ammesso.
//
// NOTA SICUREZZA: questa validazione riduce la superficie SSRF a monte, ma NON la
// elimina. redirect HTTP e DNS rebinding restano rischi residui, perché il crawler
// (ls-site-rescue) non viene modificato in questa fase e risolve/naviga l'URL da sé.
import net from 'node:net';

const MAX_INPUT_LEN = 200;
const MAX_OUTPUT_LEN = 300;

// Suffissi host non instradabili / riservati alle reti locali.
const FORBIDDEN_HOST_SUFFIXES = ['.localhost', '.local', '.internal', '.lan', '.home'] as const;

/**
 * Valida e normalizza un URL per l'analisi Site Rescue.
 * Ammette esclusivamente:
 * - protocollo http o https;
 * - hostname DNS reale (con almeno un punto e TLD alfabetico o punycode);
 * - nessuna username/password nell'URL;
 * - nessun hostname localhost né suffisso .localhost/.local/.internal/.lan/.home;
 * - nessun indirizzo IPv4 o IPv6 letterale;
 * - nessuna porta diversa da 80 o 443.
 * @returns URL normalizzato (max 300 char) oppure null se non ammesso.
 */
export function validateSiteRescueUrl(raw: unknown): string | null {
  const value = (typeof raw === 'string' ? raw : '').trim().slice(0, MAX_INPUT_LEN);
  if (!value) return null;

  // Se è presente uno schema esplicito, deve essere http/https (blocca ftp, javascript, mailto…).
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) return null;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    return null;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

  // Nessuna credenziale incorporata (user:pass@host).
  if (url.username !== '' || url.password !== '') return null;

  // Solo porta di default (vuota) oppure 80/443.
  if (url.port !== '' && url.port !== '80' && url.port !== '443') return null;

  const host = url.hostname.toLowerCase();

  // Host letterale IPv6 → hostname WHATWG mantiene le parentesi quadre: rimuovile.
  const isBracketed = host.startsWith('[') && host.endsWith(']');
  const unbracketed = isBracketed ? host.slice(1, -1) : host;

  // Nome host CANONICO: rimuove uno o più punti finali (FQDN "root"). Impedisce il
  // bypass tramite trailing dot, es. "localhost." o "server.local." → "localhost"/"server.local".
  // TUTTI i controlli successivi usano il nome canonico.
  const canonicalHost = unbracketed.replace(/\.+$/, '');
  if (!canonicalHost) return null;

  // Rifiuta qualsiasi IP letterale (IPv4 o IPv6): net.isIP restituisce 4, 6 oppure 0.
  if (net.isIP(canonicalHost) !== 0) return null;

  // Rifiuta localhost e i suffissi di rete locale (sul nome canonico).
  if (canonicalHost === 'localhost') return null;
  if (
    FORBIDDEN_HOST_SUFFIXES.some(
      (suffix) => canonicalHost === suffix.slice(1) || canonicalHost.endsWith(suffix),
    )
  ) {
    return null;
  }

  // Richiede un hostname DNS plausibile: almeno un punto e un TLD valido.
  if (!canonicalHost.includes('.')) return null;
  const labels = canonicalHost.split('.').filter(Boolean);
  const tld = labels[labels.length - 1] ?? '';
  if (!/^(xn--[a-z0-9-]+|[a-z]{2,})$/i.test(tld)) return null;

  // Normalizza l'URL restituito al nome host canonico (rimuove l'eventuale punto finale):
  // un dominio pubblico con trailing dot, es. "example.com.", è ACCETTATO e normalizzato.
  if (canonicalHost !== unbracketed) {
    url.hostname = isBracketed ? `[${canonicalHost}]` : canonicalHost;
  }

  return url.toString().slice(0, MAX_OUTPUT_LEN);
}
