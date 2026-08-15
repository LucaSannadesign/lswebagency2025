/*
 * Stub di `fetch` per provare run.mjs end-to-end senza toccare nulla di reale.
 *
 * Intercetta tre destinazioni:
 *   — Google Places, a cui risponde con un campione fisso e di cui registra la
 *     richiesta, così i test possono verificare FieldMask e parametri;
 *   — i siti delle attività, con pagine finte;
 *   — Supabase, di cui cattura i payload di insert invece di scriverli.
 *
 * Nessuna chiamata esce da qui. Va caricato con `node --import`.
 *
 * Il campione riproduce i casi visti in un dry-run reale su Sassari: un sito
 * proprio, un microsito eatbu, uno stand su piattaforma, un accorciatore, due
 * profili social, un'attività senza sito e una fuori settore.
 */
import { writeFileSync } from 'node:fs';

const PLACES = [
  {
    id: 'place-owned',
    displayName: { text: 'Trattoria da Mario' },
    websiteUri: 'https://trattoriadamario.example',
    primaryType: 'restaurant',
    types: ['restaurant', 'food'],
    nationalPhoneNumber: '079 111111',
  },
  {
    id: 'place-eatbu',
    displayName: { text: 'Trattoria Loludà' },
    websiteUri: 'https://trattorialoluda.eatbu.com',
    primaryType: 'restaurant',
    types: ['restaurant'],
    nationalPhoneNumber: '079 222222',
  },
  {
    id: 'place-wireplaza',
    displayName: { text: 'Osteria Piega' },
    websiteUri: 'https://wireplaza.com/stand/osteriapiega',
    primaryType: 'italian_restaurant',
    types: ['italian_restaurant', 'restaurant'],
    nationalPhoneNumber: '079 333333',
  },
  {
    id: 'place-short',
    displayName: { text: 'Spaghettoria S’Artea' },
    websiteUri: 'https://goo.gl/maps/abc123',
    primaryType: 'restaurant',
    types: ['restaurant'],
  },
  {
    // Social con telefono sulla scheda: il recapito arriva senza crawl.
    id: 'place-social-phone',
    displayName: { text: 'Ristorante Il Giamaranto' },
    websiteUri: 'https://www.facebook.com/giamaranto',
    primaryType: 'restaurant',
    types: ['restaurant'],
    nationalPhoneNumber: '079 444444',
  },
  {
    // Social senza telefono: resta qualificato ma senza recapito.
    id: 'place-social-nophone',
    displayName: { text: 'Taberna Santona' },
    websiteUri: 'https://instagram.com/tabernasantona',
    primaryType: 'restaurant',
    types: ['restaurant'],
  },
  {
    id: 'place-nowebsite',
    displayName: { text: 'Ristorante Da Pietro' },
    primaryType: 'restaurant',
    types: ['restaurant'],
    nationalPhoneNumber: '079 555555',
  },
  {
    id: 'place-nowebsite-nophone',
    displayName: { text: 'Osteria Senza Recapito' },
    primaryType: 'restaurant',
    types: ['restaurant'],
  },
  {
    id: 'place-estraneo',
    displayName: { text: 'wirePlaza - Connected, Together' },
    websiteUri: 'https://wireplaza.example',
    primaryType: 'telecommunications_service_provider',
    types: ['telecommunications_service_provider'],
  },
];

/** Sito proprio: stesso numero della scheda Google, in formato internazionale. */
const HTML_OWNED = `<!doctype html><html><head><title>Trattoria da Mario</title></head>
<body><a href="tel:+39079111111">chiama</a><a href="mailto:INFO@Trattoriadamario.example">scrivi</a>
<p>info@trattoriadamario.example</p></body></html>`;

const HTML_EATBU = `<!doctype html><html><head><title>Trattoria Loludà</title></head>
<body><a href="mailto:loluda@example.it">scrivi</a></body></html>`;

const captured = { placesRequest: null, inserts: [] };
const outFile = process.env.PROSPECTING_STUB_OUT;

function dump() {
  if (outFile) writeFileSync(outFile, JSON.stringify(captured, null, 2), 'utf8');
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const html = (body) =>
  new Response(body, { status: 200, headers: { 'content-type': 'text/html' } });

globalThis.fetch = async (url, options = {}) => {
  const href = String(url);

  if (href.includes('places.googleapis.com')) {
    captured.placesRequest = {
      fieldMask: options.headers?.['X-Goog-FieldMask'],
      body: JSON.parse(options.body),
    };
    dump();
    return json({ places: PLACES });
  }

  // Supabase: si registra ciò che sarebbe stato scritto, senza scrivere.
  if (href.includes('.supabase.co') || href.includes('supabase.test')) {
    const method = (options.method || 'GET').toUpperCase();
    if (method === 'POST') {
      const body = JSON.parse(options.body);
      captured.inserts.push(...(Array.isArray(body) ? body : [body]));
      dump();
      return json([{ id: '00000000-0000-0000-0000-000000000000' }], 201);
    }
    return json([]);
  }

  if (href.endsWith('/robots.txt')) {
    return new Response('User-agent: *\nAllow: /\n', {
      status: 200,
      headers: { 'content-type': 'text/plain' },
    });
  }

  if (href.includes('facebook.com') || href.includes('instagram.com')) {
    throw new Error(`IL CRAWL SOCIAL NON DEVE PARTIRE: ${href}`);
  }
  if (href.includes('wireplaza.com') || href.includes('goo.gl')) {
    throw new Error(`IL CRAWL DELLA PIATTAFORMA NON DEVE PARTIRE: ${href}`);
  }

  if (href.includes('eatbu.com')) return html(HTML_EATBU);
  return html(HTML_OWNED);
};

process.on('exit', dump);
