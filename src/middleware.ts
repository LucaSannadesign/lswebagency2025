import { defineMiddleware } from 'astro:middleware';

const REDIRECTS: Record<string, string> = {
  // Voucher (pagine rimosse)
  '/servizi/voucher-digitali-sassari-2025': '/servizi',
  '/servizi/voucher-digitali-sardegna-2025': '/servizi',

  // Copertura eventuali varianti vecchie
  '/servizi/voucher-digitali-sassari': '/servizi',
  '/servizi/voucher-digitali-sardegna': '/servizi',
};

export const onRequest = defineMiddleware((context, next) => {
  const pathname = context.url.pathname;

  // Normalizza eventuale trailing slash
  const normalized = pathname.replace(/\/+$/, '') || '/';

  const destination = REDIRECTS[pathname] ?? REDIRECTS[normalized];
  if (destination) {
    return context.redirect(destination, 301);
  }

  return next();
});