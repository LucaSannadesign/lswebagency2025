// src/pages/api/site-assistant.ts
// Endpoint del futuro assistente virtuale interno al sito.
// Riceve i dati essenziali raccolti dalla chat, valida/sanitizza, salva il lead nel CRM
// (public.leads, schema strutturato) e invia una notifica admin via Resend.
// CRM e notifica email sono INDIPENDENTI (best-effort), coerentemente con contatti.ts.
// La service role NON è mai esposta al client: l'insert avviene solo qui, lato server.
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../lib/supabase.server';

export const prerender = false;

// === Limiti prudenti sui testi (anti-abuso, niente payload arbitrari) ===
const MAX = {
  name: 120,
  email: 200,
  phone: 40,
  message: 2000,
  intent: 120,
  service: 200,
  summary: 2000,
  pageUrl: 500,
};

// === Rate limit in-memory per IP (stesso meccanismo di contatti.ts, max adattato) ===
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10; // adattato (contatti.ts usa 3): una chat può generare più invii legittimi
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  const cf = request.headers.get('cf-connecting-ip')?.trim();
  if (cf) return cf;
  return 'unknown';
}

function checkRateLimit(ipKey: string): boolean {
  const now = Date.now();
  const key = ipKey || 'unknown';
  const record = rateLimitMap.get(key);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function getContentType(req: Request): string {
  return (req.headers.get('content-type') || '').toLowerCase();
}

// Validazione email pratica (stessa di contatti.ts).
const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);

// Accetta solo stringhe, le trimma e tronca; ignora oggetti/array (→ undefined).
function clampStr(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t ? t.slice(0, max) : undefined;
}

// Normalizzazione URL replicata dal comportamento di mini-analisi.ts:
// accetta domini senza protocollo (→ https://), accetta http/https, RIFIUTA altri schemi
// e input non validi (→ null). Campo facoltativo.
function normalizeWebsiteUrl(raw: unknown): string | null {
  const v = (typeof raw === 'string' ? raw : '').trim().slice(0, 200);
  if (!v) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v) && !/^https?:\/\//i.test(v)) return null;
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withProto);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    if (!u.hostname.includes('.')) return null;
    return u.toString().slice(0, 300);
  } catch {
    return null;
  }
}

// business_name dal dominio del sito quando possibile, altrimenti default.
function deriveBusinessName(websiteUrl: string | null): string {
  if (websiteUrl) {
    try {
      const host = new URL(websiteUrl).hostname.replace(/^www\./i, '');
      if (host) return host.slice(0, 120);
    } catch {
      // ignora: usa il default
    }
  }
  return 'Lead da Assistente sito';
}

function maskEmailForLog(value: string): string {
  const trimmed = value.trim();
  const at = trimmed.indexOf('@');
  if (at <= 0 || at >= trimmed.length - 1) return '[redacted]';
  return `${trimmed.slice(0, 2)}***@${trimmed.slice(at + 1)}`;
}

// Diagnostica errore Resend (stessa logica di contatti.ts), nessun dato sensibile.
function diagnoseResendError(error: any): string {
  const combined = `${String(error?.message || '')} ${String(error?.name || '')}`;
  if (/unauthorized|forbidden|api key/i.test(combined)) return 'RESEND_UNAUTHORIZED';
  if (/from.*verif|domain.*verif|sender.*verif/i.test(combined)) return 'FROM_NOT_VERIFIED';
  if (/to.*invalid|recipient|address/i.test(combined)) return 'TO_INVALID';
  if (/rate limit|429/i.test(combined)) return 'RESEND_RATE_LIMIT';
  return 'EMAIL_PROVIDER_ERROR';
}

type AssistantLead = {
  contactName: string;
  email: string;
  phone: string | null;
  websiteUrl: string | null;
  message?: string;
  intent?: string;
  serviceInterest: string;
  conversationSummary?: string;
  pageUrl?: string;
};

// Note CRM leggibili: niente righe vuote inutili, "—" per i valori assenti.
function buildNotes(lead: AssistantLead): string {
  return [
    'Origine: site_assistant',
    `Intento: ${lead.intent || '—'}`,
    `Servizio di interesse: ${lead.serviceInterest || '—'}`,
    `Sito segnalato: ${lead.websiteUrl || '—'}`,
    `Pagina di provenienza: ${lead.pageUrl || '—'}`,
    `Riepilogo conversazione: ${lead.conversationSummary || '—'}`,
    `Messaggio del visitatore: ${lead.message || '—'}`,
  ].join('\n');
}

/**
 * Salva il lead nel CRM (public.leads) in modo best-effort: nessun valore amministrativo
 * proviene dal client. Ritorna true solo se l'insert è andato a buon fine.
 */
async function saveLeadToCrm(lead: AssistantLead): Promise<boolean> {
  try {
    const payload = {
      business_name: deriveBusinessName(lead.websiteUrl),
      contact_name: lead.contactName,
      email: lead.email,
      phone: lead.phone,
      sector: 'altro',
      service_interest: lead.serviceInterest,
      status: 'nuovo',
      priority: 'media',
      source: 'altro',
      problem_detected: [] as string[],
      notes: buildNotes(lead),
      estimated_value: 0,
      archived: false,
    };

    const { error } = await supabaseAdmin.from('leads').insert(payload);
    if (error) {
      console.error('[site-assistant] CRM insert error', error.message);
      return false;
    }
    console.log('[site-assistant] CRM lead salvato');
    return true;
  } catch (e) {
    console.error('[site-assistant] CRM save eccezione', e instanceof Error ? e.message : String(e));
    return false;
  }
}

/**
 * Notifica admin via Resend (pattern di contatti.ts): preview-guard, env esistenti,
 * replyTo sul contatto, diagnostica errore. Best-effort: non lancia e non blocca il CRM.
 */
async function sendNotificationEmail(lead: AssistantLead): Promise<{ emailSent: boolean; errorCode?: string }> {
  try {
    // Preview Vercel: nessun invio reale senza consenso esplicito (production invariata).
    if (
      import.meta.env.VERCEL_ENV === 'preview' &&
      import.meta.env.CONTACT_ALLOW_EMAIL_IN_PREVIEW !== 'true'
    ) {
      console.warn('[site-assistant] preview: invio email disabilitato (CONTACT_ALLOW_EMAIL_IN_PREVIEW non attivo)');
      return { emailSent: false, errorCode: 'PREVIEW_EMAIL_DISABLED' };
    }

    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const TO = import.meta.env.CONTACT_TO_EMAIL || import.meta.env.MAIL_TO;
    const FROM = import.meta.env.CONTACT_FROM_EMAIL || import.meta.env.MAIL_FROM || 'onboarding@resend.dev';

    if (!RESEND_API_KEY || !TO) {
      console.error('[site-assistant] email non inviata: configurazione mancante', {
        hasResendKey: Boolean(RESEND_API_KEY),
        hasToEmail: Boolean(TO),
      });
      return { emailSent: false, errorCode: 'SERVER_MISCONFIGURED' };
    }

    const subject = 'Nuova richiesta dall’assistente del sito — LS Web Agency';
    const text = [
      'Nuova richiesta raccolta dall’assistente del sito LS Web Agency.',
      '',
      `Nome: ${lead.contactName}`,
      `Email: ${lead.email}`,
      `Telefono: ${lead.phone || '—'}`,
      `Sito: ${lead.websiteUrl || '—'}`,
      `Intento: ${lead.intent || '—'}`,
      `Servizio: ${lead.serviceInterest || '—'}`,
      `Pagina di provenienza: ${lead.pageUrl || '—'}`,
      '',
      'Riepilogo conversazione:',
      lead.conversationSummary || '—',
      '',
      'Messaggio del visitatore:',
      lead.message || '—',
    ].join('\n');

    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: lead.email,
      subject,
      text,
    });

    if (error) {
      const errorCode = diagnoseResendError(error);
      console.error('[site-assistant] Resend error', {
        code: errorCode,
        name: (error as any)?.name,
        message: String((error as any)?.message || '').replace(/[^\s@]+@[^\s@]+/g, '[email]').slice(0, 200),
      });
      return { emailSent: false, errorCode };
    }

    console.log('[site-assistant] notifica email inviata', {
      toDomain: TO.includes('@') ? TO.split('@').pop() : '(n/a)',
    });
    return { emailSent: true };
  } catch (err: any) {
    const errorCode = diagnoseResendError(err);
    console.error('[site-assistant] Resend eccezione', {
      code: errorCode,
      message: String(err?.message || '').replace(/[^\s@]+@[^\s@]+/g, '[email]').slice(0, 200),
    });
    return { emailSent: false, errorCode };
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1) Solo JSON.
    if (!getContentType(request).includes('application/json')) {
      return json(415, { success: false, error: 'UNSUPPORTED_MEDIA_TYPE' });
    }

    // 2) Parse robusto.
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return json(400, { success: false, error: 'INVALID_JSON' });
    }

    // 3) Honeypot: se "company" è valorizzato → risposta neutra, nessun salvataggio/email.
    const company = typeof body.company === 'string' ? body.company.trim() : '';
    if (company.length > 0) {
      console.warn('[site-assistant] honeypot attivato, nessun invio');
      return json(200, { success: true });
    }

    // 4) Rate limit per IP.
    const clientIp = getClientIp(request);
    if (!checkRateLimit(clientIp)) {
      return json(429, { success: false, error: 'RATE_LIMIT_EXCEEDED' });
    }

    // 5) Normalizzazione/sanitizzazione (oggetti/array nei campi testo → ignorati).
    const contactName = clampStr(body.contactName, MAX.name) ?? '';
    const email = (typeof body.email === 'string' ? body.email.trim() : '').slice(0, MAX.email);
    const phone = clampStr(body.phone, MAX.phone) ?? null;
    const websiteUrl = normalizeWebsiteUrl(body.websiteUrl);
    const message = clampStr(body.message, MAX.message);
    const intent = clampStr(body.intent, MAX.intent);
    const serviceInterest = clampStr(body.serviceInterest, MAX.service) ?? 'Assistente sito';
    const conversationSummary = clampStr(body.conversationSummary, MAX.summary);
    const pageUrl = clampStr(body.pageUrl, MAX.pageUrl);
    const privacyConsent = body.privacyConsent === true;

    // 6) Validazione minima.
    if (!contactName) return json(400, { success: false, error: 'MISSING_CONTACT_NAME' });
    if (!isEmail(email)) return json(400, { success: false, error: 'INVALID_EMAIL' });
    if (!privacyConsent) return json(400, { success: false, error: 'PRIVACY_REQUIRED' });

    console.log('[site-assistant] payload valido', {
      nameLen: contactName.length,
      emailMasked: maskEmailForLog(email),
      hasPhone: Boolean(phone),
      hasSite: Boolean(websiteUrl),
      hasMessage: Boolean(message),
      hasSummary: Boolean(conversationSummary),
    });

    const lead: AssistantLead = {
      contactName,
      email,
      phone,
      websiteUrl,
      message,
      intent,
      serviceInterest,
      conversationSummary,
      pageUrl,
    };

    // 7) CRM ed email indipendenti (best-effort): il lead utile non va perso.
    const leadSaved = await saveLeadToCrm(lead);
    const { emailSent, errorCode } = await sendNotificationEmail(lead);

    if (leadSaved || emailSent) {
      if (!leadSaved || !emailSent) {
        console.warn('[site-assistant] successo parziale', {
          leadSaved,
          emailSent,
          emailError: errorCode ?? null,
        });
      }
      return json(200, { success: true, leadSaved, emailSent });
    }

    // Entrambi falliti → errore server generico (nessun dettaglio Supabase al client).
    console.error('[site-assistant] FALLIMENTO totale: CRM ed email entrambi falliti', {
      emailError: errorCode ?? 'UNKNOWN',
    });
    return json(500, { success: false, error: 'DELIVERY_FAILED' });
  } catch (unexpected: unknown) {
    console.error('[site-assistant] errore non gestito', {
      message: (unexpected instanceof Error ? unexpected.message : String(unexpected)).slice(0, 300),
    });
    return json(500, { success: false, error: 'INTERNAL_ERROR' });
  }
};
