import { defineMiddleware } from 'astro:middleware';
import type { APIContext, MiddlewareNext } from 'astro';
import { isPreviewDeployment } from './lib/deployEnv';

const REDIRECTS: Record<string, string> = {
  // Voucher (pagine rimosse)
  '/servizi/voucher-digitali-sassari-2025': '/servizi',
  '/servizi/voucher-digitali-sardegna-2025': '/servizi',

  // Copertura eventuali varianti vecchie
  '/servizi/voucher-digitali-sassari': '/servizi',
  '/servizi/voucher-digitali-sardegna': '/servizi',
};

const CONTACT_PATH = '/api/contatti';
const MAX_BODY_BYTES = 24 * 1024;

/**
 * Indirizzo alternativo mostrato all'utente quando la guardia blocca l'invio:
 * una richiesta legittima rifiutata dai controlli deve comunque avere una via
 * di contatto, altrimenti il lead viene perso senza che nessuno lo sappia.
 */
const FALLBACK_CONTACT_EMAIL = 'info@lswebagency.com';

const REJECTED_MESSAGE =
  `Non siamo riusciti a inviare il modulo da questo browser. ` +
  `Scrivici direttamente a ${FALLBACK_CONTACT_EMAIL}: leggiamo tutte le richieste e ti rispondiamo.`;

const TOO_LARGE_MESSAGE =
  `Il messaggio è troppo lungo per essere inviato dal modulo. ` +
  `Accorcialo oppure inviacelo per email a ${FALLBACK_CONTACT_EMAIL}.`;

const ALLOWED_PRODUCTION_HOSTS = new Set([
  'lswebagency.com',
  'www.lswebagency.com',
]);

const SUSPICIOUS_UA = [
  'curl',
  'wget',
  'python-requests',
  'python/',
  'scrapy',
  'go-http-client',
  'libwww-perl',
  'httpclient',
  'headlesschrome',
];

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    const requestHost = new URL(request.url).hostname;

    if (originUrl.protocol !== 'https:' && requestHost !== 'localhost') return false;
    if (originUrl.hostname === requestHost) return true;
    if (ALLOWED_PRODUCTION_HOSTS.has(originUrl.hostname)) return true;

    // Consente esclusivamente i Preview Deployment Vercel del progetto.
    return originUrl.hostname.endsWith('-lucasannadesigns-projects.vercel.app');
  } catch {
    return false;
  }
}

function hasValidFetchMetadata(request: Request): boolean {
  const site = request.headers.get('sec-fetch-site');
  if (!site) return true; // Compatibilità con browser che non inviano Fetch Metadata.
  return site === 'same-origin' || site === 'same-site';
}

function hasSuspiciousUserAgent(request: Request): boolean {
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  if (!ua) return true;
  return SUSPICIOUS_UA.some((needle) => ua.includes(needle));
}

/**
 * Anteprima isolata: nei deployment Preview nessuna richiesta di scrittura verso
 * le API raggiunge CRM (Supabase), provider email o servizi esterni. La risposta
 * simulata ha la stessa forma di quella reale (ok/success), così i moduli si
 * possono provare fino alla conferma. In produzione questo ramo non si attiva.
 */
const PREVIEW_SIMULATED_MESSAGE =
  'Anteprima: richiesta simulata. Nessun dato è stato inviato al CRM o via email.';

function withPreviewHeaders(response: Response): Response {
  try {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  } catch {
    // Header immutabili (es. redirect): si ricrea la risposta con gli stessi dati.
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (!isPreviewDeployment()) return productionHandler(context, next);

  const { request, url } = context;
  if (url.pathname.startsWith('/api/') && request.method !== 'GET' && request.method !== 'HEAD') {
    console.warn('[preview-guard] scrittura API simulata', { path: url.pathname });
    return withPreviewHeaders(
      json(200, { ok: true, success: true, preview: true, message: PREVIEW_SIMULATED_MESSAGE })
    );
  }

  return withPreviewHeaders(await productionHandler(context, next));
});

function productionHandler(context: APIContext, next: MiddlewareNext): Response | Promise<Response> {
  const pathname = context.url.pathname;

  // Normalizza eventuale trailing slash.
  const normalized = pathname.replace(/\/+$/, '') || '/';

  const destination = REDIRECTS[pathname] ?? REDIRECTS[normalized];
  if (destination) {
    return context.redirect(destination, 301);
  }

  const { request, url } = context;

  if (url.pathname !== CONTACT_PATH || request.method !== 'POST') {
    return next();
  }

  const contentLength = Number(request.headers.get('content-length') || '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    console.warn('[contact-guard] payload troppo grande', { contentLength });
    return json(413, {
      ok: false,
      error: 'PAYLOAD_TOO_LARGE',
      message: TOO_LARGE_MESSAGE,
      contactEmail: FALLBACK_CONTACT_EMAIL,
    });
  }

  if (!isAllowedOrigin(request)) {
    console.warn('[contact-guard] origin rifiutata', {
      origin: request.headers.get('origin') || '(missing)',
    });
    return json(403, {
      ok: false,
      error: 'REQUEST_REJECTED',
      message: REJECTED_MESSAGE,
      contactEmail: FALLBACK_CONTACT_EMAIL,
    });
  }

  if (!hasValidFetchMetadata(request)) {
    console.warn('[contact-guard] fetch metadata rifiutata', {
      site: request.headers.get('sec-fetch-site') || '(missing)',
    });
    return json(403, {
      ok: false,
      error: 'REQUEST_REJECTED',
      message: REJECTED_MESSAGE,
      contactEmail: FALLBACK_CONTACT_EMAIL,
    });
  }

  if (hasSuspiciousUserAgent(request)) {
    console.warn('[contact-guard] user-agent rifiutato');
    return json(403, {
      ok: false,
      error: 'REQUEST_REJECTED',
      message: REJECTED_MESSAGE,
      contactEmail: FALLBACK_CONTACT_EMAIL,
    });
  }

  return next();
}
