import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, '').split('=');
    return [key, rest.length ? rest.join('=') : true];
  }),
);

const sector = String(args.sector || '').trim();
const location = String(args.location || '').trim();
const limit = Math.min(Math.max(Number(args.limit || 20), 1), 20);
const save = args.save === true || String(args.save).toLowerCase() === 'true';

if (!sector || !location) {
  console.error('Uso: npm run prospecting -- --sector="ristoranti" --location="Sassari" --limit=20 [--save]');
  process.exit(1);
}

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

if (!GOOGLE_PLACES_API_KEY) throw new Error('GOOGLE_PLACES_API_KEY mancante');
if (save && (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE)) {
  throw new Error('Per --save servono SUPABASE_URL e SUPABASE_SERVICE_ROLE');
}

const supabase = save
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

const USER_AGENT = 'LSWebAgencyProspecting/1.0 (+https://lswebagency.com)';
const TIMEOUT_MS = 9000;
const MAX_HTML_BYTES = 700_000;
const QUALIFIED_SCORE = 55;
const SERVICE_INTEREST = 'Audit rapido / SEO locale';

function clamp(value, max = 300) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(raw) {
  const value = String(raw || '').trim();
  if (!value) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

function normalizeDomain(raw) {
  const url = normalizeUrl(raw);
  if (!url) return null;
  return new URL(url).hostname.toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
}

function normalizeBusinessName(value) {
  return String(value || '')
    .toLocaleLowerCase('it-IT')
    .trim()
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/g, ' ');
}

function decodeHtml(text) {
  return text
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ');
}

function stripTags(text) {
  return decodeHtml(String(text || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': USER_AGENT,
        accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!response.ok) return null;
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html') && !type.includes('application/xhtml+xml')) return null;
    const text = await response.text();
    return text.slice(0, MAX_HTML_BYTES);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function extractHrefValues(html, scheme) {
  const regex = new RegExp(`href=["']${scheme}:([^"'#?]+)[^"']*["']`, 'gi');
  const out = [];
  let match;
  while ((match = regex.exec(html))) out.push(decodeURIComponent(match[1]).trim());
  return unique(out);
}

function extractEmails(html) {
  const mailto = extractHrefValues(html, 'mailto').map((value) => value.split('?')[0]);
  const textMatches = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  return unique([...mailto, ...textMatches])
    .map((value) => value.toLowerCase())
    .filter((value) => !value.endsWith('@example.com') && !value.includes('wixpress.com'))
    .slice(0, 5);
}

function extractPhones(html) {
  const tel = extractHrefValues(html, 'tel')
    .map((value) => value.replace(/[^+\d]/g, ''))
    .filter((value) => value.replace(/\D/g, '').length >= 7);
  return unique(tel).slice(0, 5);
}

function extractMeta(html, attr, value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]+${attr}=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${escaped}["'][^>]*>`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return stripTags(match[1]);
  }
  return '';
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripTags(match[1]) : '';
}

function extractBusinessName(html, fallbackHost) {
  const ogSiteName = extractMeta(html, 'property', 'og:site_name');
  if (ogSiteName) return clamp(ogSiteName, 120);
  const title = extractTitle(html).split(/[|–—•]/)[0].trim();
  if (title && title.length <= 120) return clamp(title, 120);
  return fallbackHost.replace(/^www\./, '').split('.')[0].replace(/[-_]+/g, ' ');
}

function findContactUrls(html, baseUrl) {
  const urls = [];
  const regex = /href=["']([^"'#]+)["']/gi;
  let match;
  while ((match = regex.exec(html))) {
    const href = match[1];
    if (!/(contatt|contact|chi-siamo|about)/i.test(href)) continue;
    try {
      const url = new URL(href, baseUrl);
      if (url.origin === new URL(baseUrl).origin) urls.push(url.toString());
    } catch {}
  }
  return unique(urls).slice(0, 2);
}

function inspectSignals(html, url) {
  const title = extractTitle(html);
  const description = extractMeta(html, 'name', 'description');
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const hasCanonical = /<link[^>]+rel=["'][^"']*canonical[^"']*["']/i.test(html);
  const hasSchema = /application\/ld\+json/i.test(html);
  const hasContactLink = /href=["'][^"']*(contatt|contact)[^"']*["']/i.test(html);
  const hasTel = /href=["']tel:/i.test(html);
  const hasMail = /href=["']mailto:/i.test(html);
  const hasHttps = String(url).startsWith('https://');

  const issues = [];
  if (!title || title.length < 15) issues.push('title debole o assente');
  if (!description || description.length < 70) issues.push('meta description debole o assente');
  if (!hasViewport) issues.push('viewport mobile non rilevato');
  if (!hasCanonical) issues.push('canonical non rilevata');
  if (!hasSchema) issues.push('dati strutturati non rilevati');
  if (!hasContactLink && !hasTel && !hasMail) issues.push('contatto/CTA poco evidente nel markup');
  if (!hasHttps) issues.push('HTTPS non rilevato');

  let score = 30 + Math.min(issues.length * 10, 50);
  if (!hasContactLink && !hasTel && !hasMail) score += 10;
  if (!hasViewport) score += 10;
  score = Math.min(score, 100);

  const problems = [];
  if (!title || !description || !hasCanonical || !hasSchema) problems.push('google_debole');
  if (!hasViewport) problems.push('sito_vecchio');
  if (!hasContactLink && !hasTel && !hasMail) problems.push('pochi_contatti');

  return { score, issues, problems: unique(problems) };
}

async function inspectWebsite(rawUrl) {
  const url = normalizeUrl(rawUrl);
  if (!url) return null;
  const homeHtml = await fetchText(url);
  if (!homeHtml) return null;

  const canonicalUrl = (() => {
    const match = homeHtml.match(/<link[^>]+rel=["'][^"']*canonical[^"']*["'][^>]+href=["']([^"']+)["']/i);
    if (!match) return url;
    try {
      return new URL(match[1], url).toString();
    } catch {
      return url;
    }
  })();

  const contactUrls = findContactUrls(homeHtml, canonicalUrl);
  const contactHtml = [];
  for (const contactUrl of contactUrls) {
    const page = await fetchText(contactUrl);
    if (page) contactHtml.push(page);
  }

  const combinedHtml = [homeHtml, ...contactHtml].join('\n');
  const host = new URL(canonicalUrl).hostname;

  return {
    website: canonicalUrl,
    domain: normalizeDomain(canonicalUrl),
    businessName: extractBusinessName(homeHtml, host),
    emails: extractEmails(combinedHtml),
    phones: extractPhones(combinedHtml),
    contactUrls,
    ...inspectSignals(homeHtml, canonicalUrl),
  };
}

async function discoverPlaces() {
  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.websiteUri',
    },
    body: JSON.stringify({
      textQuery: `${sector} a ${location}`,
      languageCode: 'it',
      regionCode: 'IT',
      pageSize: limit,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Places ${response.status}: ${text.slice(0, 300)}`);
  }

  const payload = await response.json();
  return (payload.places || []).slice(0, limit).filter((place) => place.websiteUri && place.id);
}

async function loadExistingCrmIndex() {
  const empty = {
    emails: new Set(),
    phones: new Set(),
    domains: new Set(),
    names: new Set(),
  };
  if (!supabase) return empty;

  const { data, error } = await supabase.from('leads').select('business_name,email,phone,website');
  if (error) throw new Error(`Impossibile leggere i lead esistenti: ${error.message}`);

  for (const lead of data || []) {
    if (lead.email) empty.emails.add(String(lead.email).trim().toLowerCase());
    if (lead.phone) empty.phones.add(String(lead.phone).replace(/\D/g, ''));
    const domain = normalizeDomain(lead.website);
    if (domain) empty.domains.add(domain);
    const name = normalizeBusinessName(lead.business_name);
    if (name) empty.names.add(name);
  }

  return empty;
}

function duplicateReason(index, inspected) {
  const email = inspected.emails[0]?.toLowerCase() || null;
  const phone = inspected.phones[0]?.replace(/\D/g, '') || null;
  const name = normalizeBusinessName(inspected.businessName);
  if (email && index.emails.has(email)) return 'email già presente';
  if (phone && index.phones.has(phone)) return 'telefono già presente';
  if (inspected.domain && index.domains.has(inspected.domain)) return 'dominio già presente';
  if (name && index.names.has(name)) return 'attività già presente';
  return null;
}

function addToCrmIndex(index, inspected) {
  const email = inspected.emails[0]?.toLowerCase() || null;
  const phone = inspected.phones[0]?.replace(/\D/g, '') || null;
  const name = normalizeBusinessName(inspected.businessName);
  if (email) index.emails.add(email);
  if (phone) index.phones.add(phone);
  if (inspected.domain) index.domains.add(inspected.domain);
  if (name) index.names.add(name);
}

function priorityFromScore(score) {
  if (score >= 75) return 'alta';
  if (score >= QUALIFIED_SCORE) return 'media';
  return 'bassa';
}

function buildNotes(placeId, inspected) {
  const signal = inspected.issues[0] || 'sito disponibile per verifica manuale';
  return [
    'Origine outreach: outreach_prospecting',
    `SEGNALE: ${signal}`,
    `FONTE: ${inspected.website}`,
    '',
    'Prospect generato automaticamente dal modulo Prospecting LS Web Agency.',
    'Email/telefono estratti dal sito pubblico dell’attività; Google Places usato solo per discovery e Place ID.',
    `Google Place ID: ${placeId}`,
    `Opportunity score: ${inspected.score}/100`,
    `Problemi tecnici rilevati: ${inspected.issues.length ? inspected.issues.join('; ') : 'nessuno dei controlli base'}`,
    `Pagine contatto analizzate: ${inspected.contactUrls.length ? inspected.contactUrls.join(', ') : 'nessuna'}`,
    'Stato outreach: NON INVIATO.',
  ].join('\n');
}

async function saveLead(place, inspected, crmIndex) {
  const email = inspected.emails[0] || null;
  const phone = inspected.phones[0] || null;
  if (!email && !phone) return { saved: false, reason: 'nessun contatto' };

  const duplicate = duplicateReason(crmIndex, inspected);
  if (duplicate) return { saved: false, reason: duplicate };

  const payload = {
    business_name: clamp(inspected.businessName, 150) || 'Prospect outbound',
    contact_name: null,
    email,
    phone,
    website: inspected.website,
    city: clamp(location, 100),
    sector: 'altro',
    service_interest: SERVICE_INTEREST,
    status: 'da_verificare',
    priority: priorityFromScore(inspected.score),
    source: 'altro',
    problem_detected: inspected.problems,
    google_maps_url: null,
    notes: buildNotes(place.id, inspected),
    estimated_value: 0,
    archived: false,
  };

  const { error } = await supabase.from('leads').insert(payload);
  if (error) throw error;
  addToCrmIndex(crmIndex, inspected);
  return { saved: true };
}

const places = await discoverPlaces();
const crmIndex = await loadExistingCrmIndex();
const results = [];

for (const place of places) {
  const inspected = await inspectWebsite(place.websiteUri);
  if (!inspected) {
    results.push({ placeId: place.id, website: place.websiteUri, status: 'crawl_failed' });
    continue;
  }

  let crm = { saved: false, reason: save ? 'non qualificato' : 'dry-run' };
  if (save && inspected.score >= QUALIFIED_SCORE) crm = await saveLead(place, inspected, crmIndex);

  results.push({
    placeId: place.id,
    website: inspected.website,
    businessName: inspected.businessName,
    email: inspected.emails[0] || null,
    phone: inspected.phones[0] || null,
    score: inspected.score,
    issues: inspected.issues,
    crm,
  });

  console.log(
    `${inspected.score.toString().padStart(3)} | ${inspected.businessName} | ${inspected.emails[0] || inspected.phones[0] || 'no-contact'} | ${crm.saved ? 'CRM' : crm.reason}`,
  );
  await sleep(350);
}

const analyzed = results.filter((result) => Number.isFinite(result.score));
const qualified = analyzed.filter((result) => result.score >= QUALIFIED_SCORE);
const savedCount = results.filter((result) => result.crm?.saved).length;
console.log(
  `\nTrovati: ${places.length} | Analizzati: ${analyzed.length} | Qualificati: ${qualified.length} | Salvati CRM: ${savedCount}`,
);

if (!save) console.log('Dry-run attivo. Aggiungi --save per inserire i qualificati nel CRM.');
