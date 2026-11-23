// Validazione server-side del form "Transizione Digitale Turismo".
// Funzioni pure: riutilizzabili nei test senza servizi esterni.
export const TOURISM_GOALS = [
  "aumentare-richieste-dirette",
  "migliorare-modulo-richieste",
  "capire-conversione-bassa",
  "migliorare-esperienza-mobile",
  "altro",
] as const;

export type TourismInquiry = {
  nome: string;
  struttura: string;
  sito: string;
  citta: string;
  email: string;
  telefono: string;
  obiettivo: (typeof TOURISM_GOALS)[number];
  messaggio: string;
};

export type TourismParseResult = {
  inquiry: TourismInquiry | null;
  errors: string[];
  honeypot: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function cleanSingleLine(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

function cleanMultiline(value: string): string {
  return value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ").trim();
}

function normalizeSite(value: string): string | null {
  if (value.length > 2048) return null;
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol) || !url.hostname.includes(".")) return null;
    if (url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function parseTourismInquiry(form: FormData): TourismParseResult {
  // Mai memorizzare né notificare un invio intercettato dal campo-trappola.
  if (field(form, "website_confirm")) {
    return { inquiry: null, errors: [], honeypot: true };
  }

  const nome = cleanSingleLine(field(form, "nome"));
  const struttura = cleanSingleLine(field(form, "struttura"));
  const rawSite = field(form, "sito");
  const sito = normalizeSite(rawSite);
  const citta = cleanSingleLine(field(form, "citta"));
  const email = cleanSingleLine(field(form, "email")).toLowerCase();
  const telefono = cleanSingleLine(field(form, "telefono"));
  const obiettivo = field(form, "obiettivo");
  const messaggio = cleanMultiline(field(form, "messaggio"));
  const privacyAcknowledged = field(form, "privacy") === "on";

  const errors: string[] = [];
  if (nome.length < 2 || nome.length > 160) errors.push("Inserisci un nome valido.");
  if (struttura.length < 2 || struttura.length > 180) errors.push("Inserisci il nome della struttura.");
  if (!sito) errors.push("Inserisci un sito valido con https:// o http://.");
  if (citta.length < 2 || citta.length > 120) errors.push("Inserisci la città.");
  if (!EMAIL_RE.test(email) || email.length > 254) errors.push("Inserisci un indirizzo email valido.");
  if (telefono.length > 80) errors.push("Il numero di telefono è troppo lungo.");
  if (!TOURISM_GOALS.includes(obiettivo as (typeof TOURISM_GOALS)[number])) errors.push("Seleziona un obiettivo.");
  if (messaggio.length > 4000) errors.push("Il messaggio è troppo lungo.");
  if (!privacyAcknowledged) errors.push("Conferma di aver letto l'informativa privacy.");

  if (errors.length || !sito) return { inquiry: null, errors, honeypot: false };

  return {
    inquiry: {
      nome, struttura, sito, citta, email, telefono,
      obiettivo: obiettivo as TourismInquiry["obiettivo"],
      messaggio,
    },
    errors: [],
    honeypot: false,
  };
}
