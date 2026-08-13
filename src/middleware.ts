import { defineMiddleware } from 'astro:middleware';

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
    const url = new URL(origin);
    const requestHost = new URL(request.url).hostname;

    if (url.protocol !== 'https:' && requestHost !== 'localhost') return false;
    if (url.hostname === requestHost) return true;
    if (ALLOWED_PRODUCTION_HOSTS.has(url.hostname)) return true;

    // Consente esclusivamente i Preview Deployment Vercel del progetto.
    return url.hostname.endsWith('-lucasannadesigns-projects.vercel.app');
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

export const onRequest = defineMiddleware((context, next) => {
  const pathname = context.url.pathname;

  // Normalizza eventuale trailing slash
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
    return json(413, { ok: false, error: 'PAYLOAD_TOO_LARGE' });
  }

  if (!isAllowedOrigin(request)) {
    console.warn('[contact-guard] origin rifiutata', {
      origin: request.headers.get('origin') || '(missing)',
    });
    return json(403, { ok: false, error: 'REQUEST_REJECTED' });
  }

  if (!hasValidFetchMetadata(request)) {
    console.warn('[contact-guard] fetch metadata rifiutata', {
      site: request.headers.get('sec-fetch-site') || '(missing)',
    });
    return json(403, { ok: false, error: 'REQUEST_REJECTED' });
  }

  if (hasSuspiciousUserAgent(request)) {
    console.warn('[contact-guard] user-agent rifiutato');
    return json(403, { ok: false, error: 'REQUEST_REJECTED' });
  }

  return next();
});
