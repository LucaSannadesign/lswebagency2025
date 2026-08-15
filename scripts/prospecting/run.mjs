import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { createClient } from '@supabase/supabase-js';
import {
  presenceTypeFor,
  placeTypeForSector,
  identityLooksConsistent,
  opportunityScore,
  isCommerciallyQualified,
  qualifiesForSave,
  PRESENCE,
  QUALIFIED_OPPORTUNITY_SCORE,
} from './classify.mjs';
import { unique, extractEmails, extractPhones, mergePhones, normalizePhone, phoneKey } from './extract.mjs';

/**
 * Accetta sia `--chiave=valore` sia `--chiave valore`: la seconda forma serve a
 * `--csv <percorso>`. Un token successivo che inizia per `--` non viene mai
 * consumato come valore, così `--save --sector=x` continua a leggersi come due
 * opzioni distinte.
 */
const args = {};
{
  const tokens = process.argv.slice(2);
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (!token.startsWith('--')) continue;
    const [key, ...rest] = token.replace(/^--/, '').split('=');
    if (rest.length) {
      args[key] = rest.join('=');
    } else if (tokens[i + 1] && !tokens[i + 1].startsWith('--')) {
      args[key] = tokens[i + 1];
      i += 1;
    } else {
      args[key] = true;
    }
  }
}

const flag = (value) => value === true || String(value).toLowerCase() === 'true';

const sector = String(args.sector || '').trim();
const location = String(args.location || '').trim();
const limit = Math.min(Math.max(Number(args.limit || 20), 1), 20);
/** Senza --save non viene scritta una riga: il default è la sola analisi. */
const save = flag(args.save);
/** Salta la conferma interattiva. Serve negli usi non interattivi. */
const assumeYes = flag(args.yes);
/** Percorso del CSV con TUTTI gli analizzati, non solo i qualificati. */
const csvPath = typeof args.csv === 'string' ? args.csv.trim() : '';

if (!sector || !location) {
  console.error(
    [
      'Uso:',
      '  npm run prospecting -- --sector="ristoranti" --location="Sassari" [--limit=20]',
      '',
      'Opzioni:',
      '  (nessuna)        analisi soltanto, nessuna scrittura',
      '  --csv <file>     esporta tutti gli analizzati in CSV',
      '  --save           scrive i qualificati su Supabase, previa conferma',
      '  --yes            salta la conferma richiesta da --save',
    ].join('\n'),
  );
  process.exit(1);
}

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
/*
 * Chiave server-side. Il nome in uso è SUPABASE_SECRET_KEY; SUPABASE_SERVICE_ROLE
 * resta accettata come fallback finché qualche ambiente la definisce ancora, così
 * lo script continua a funzionare dove la variabile non è stata ancora rinominata.
 * Quando nessun ambiente la userà più, il fallback può sparire.
 */
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!GOOGLE_PLACES_API_KEY) throw new Error('GOOGLE_PLACES_API_KEY mancante');
if (save && (!SUPABASE_URL || !SUPABASE_SECRET_KEY)) {
  throw new Error('Per --save servono SUPABASE_URL e SUPABASE_SECRET_KEY (in alternativa SUPABASE_SERVICE_ROLE)');
}

const supabase = save
  ? createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

const USER_AGENT = 'LSWebAgencyProspecting/1.0 (+https://lswebagency.com)';
const TIMEOUT_MS = 9000;
const MAX_HTML_BYTES = 700_000;
const QUALIFIED_SCORE = 55;

/**
 * I prospect NON vanno in `leads`.
 *
 * In `leads` finiscono le persone che hanno scritto dai form del sito: hanno
 * lasciato i propri dati di loro iniziativa. Qui finiscono attività trovate in
 * autonomia e mai contattate. Tenerle nella stessa tabella significa perdere la
 * distinzione fra un contatto in entrata e un nominativo raccolto da noi.
 *
 * Lo schema atteso è in scripts/prospecting/schema.sql, da eseguire a mano su
 * Supabase prima del primo --save.
 */
const PROSPECTS_TABLE = 'prospects';

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

/* --- robots.txt ------------------------------------------------------------
 *
 * Parser minimo, scritto qui invece di aggiungere una dipendenza: il file legge
 * già HTML con espressioni regolari, e una regola interpretata male costa al
 * massimo un sito visitato in meno.
 *
 * Copre ciò che serve: gruppi User-agent (quello specifico se presente,
 * altrimenti `*`), direttive Allow e Disallow, i caratteri jolly `*` e `$`, e la
 * precedenza alla regola più lunga con Allow che vince a parità.
 * Non copre Crawl-delay, Sitemap e le altre direttive non vincolanti.
 */

/** Token di prodotto del nostro user agent, come si dichiara in robots.txt. */
const ROBOTS_TOKEN = 'lswebagencyprospecting';

/** Un robots.txt per origine, scaricato una volta sola per esecuzione. */
const robotsCache = new Map();

function parseRobots(text) {
  const groups = new Map();
  let current = [];

  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (field === 'user-agent') {
      const agent = value.toLowerCase();
      if (!groups.has(agent)) groups.set(agent, []);
      current = groups.get(agent);
      continue;
    }
    if (field === 'allow' || field === 'disallow') {
      current.push({ allow: field === 'allow', path: value });
    }
  }

  return groups.get(ROBOTS_TOKEN) ?? groups.get('*') ?? [];
}

function robotsPatternToRegex(pattern) {
  const anchored = pattern.endsWith('$');
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const escaped = body.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}${anchored ? '$' : ''}`);
}

function robotsAllows(rules, pathname) {
  let decision = true;
  let strength = -1;

  for (const rule of rules) {
    // `Disallow:` vuoto significa "nessun divieto": non è una regola.
    if (!rule.path) continue;
    if (!robotsPatternToRegex(rule.path).test(pathname)) continue;
    const length = rule.path.length;
    if (length > strength || (length === strength && rule.allow)) {
      decision = rule.allow;
      strength = length;
    }
  }

  return decision;
}

/**
 * Esiti possibili:
 *   'allowed'    — il percorso può essere visitato
 *   'disallowed' — robots.txt lo esclude esplicitamente
 *   'unreadable' — robots.txt non è leggibile (timeout, errore di rete, 5xx)
 *
 * 404 e 410 valgono come "nessuna restrizione", secondo lo standard. Un
 * robots.txt che non si riesce a leggere non viene invece interpretato come
 * permesso: in dubbio non si visita.
 */
async function robotsStateFor(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return 'unreadable';
  }

  if (!robotsCache.has(url.origin)) {
    robotsCache.set(url.origin, await loadRobots(url.origin));
  }

  const robots = robotsCache.get(url.origin);
  if (robots.state !== 'rules') return robots.state;
  return robotsAllows(robots.rules, url.pathname) ? 'allowed' : 'disallowed';
}

async function loadRobots(origin) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${origin}/robots.txt`, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': USER_AGENT, accept: 'text/plain' },
    });
    if (response.status === 404 || response.status === 410) return { state: 'allowed' };
    if (!response.ok) return { state: 'unreadable' };
    const text = (await response.text()).slice(0, MAX_HTML_BYTES);
    return { state: 'rules', rules: parseRobots(text) };
  } catch {
    return { state: 'unreadable' };
  } finally {
    clearTimeout(timer);
  }
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

  // Punteggio TECNICO: quanti problemi ha la pagina, da 30 (nessuno) a 100.
  // Non dice se l'attività sia interessante — quella è l'opportunità, calcolata
  // altrove a partire dal tipo di presenza.
  let technicalScore = 30 + Math.min(issues.length * 10, 50);
  if (!hasContactLink && !hasTel && !hasMail) technicalScore += 10;
  if (!hasViewport) technicalScore += 10;
  technicalScore = Math.min(technicalScore, 100);

  const problems = [];
  if (!title || !description || !hasCanonical || !hasSchema) problems.push('google_debole');
  if (!hasViewport) problems.push('sito_vecchio');
  if (!hasContactLink && !hasTel && !hasMail) problems.push('pochi_contatti');

  return { technicalScore, issues, problems: unique(problems) };
}

/**
 * Restituisce `{ ok: true, data }` oppure `{ ok: false, reason }`, così il
 * chiamante può distinguere un'esclusione voluta da un errore di lettura.
 */
async function inspectWebsite(rawUrl) {
  const url = normalizeUrl(rawUrl);
  if (!url) return { ok: false, reason: 'URL non valido' };

  const robots = await robotsStateFor(url);
  if (robots === 'disallowed') return { ok: false, reason: 'saltato per robots.txt' };
  if (robots === 'unreadable') return { ok: false, reason: 'robots.txt non leggibile' };

  const homeHtml = await fetchText(url);
  if (!homeHtml) return { ok: false, reason: 'analisi fallita' };

  const canonicalUrl = (() => {
    const match = homeHtml.match(/<link[^>]+rel=["'][^"']*canonical[^"']*["'][^>]+href=["']([^"']+)["']/i);
    if (!match) return url;
    try {
      return new URL(match[1], url).toString();
    } catch {
      return url;
    }
  })();

  // Le pagine contatto sono fetch aggiuntivi: se robots ne esclude una si salta
  // quella, non l'intero sito, che è già stato ammesso sulla home.
  const contactUrls = [];
  const contactHtml = [];
  for (const contactUrl of findContactUrls(homeHtml, canonicalUrl)) {
    if ((await robotsStateFor(contactUrl)) !== 'allowed') continue;
    contactUrls.push(contactUrl);
    const page = await fetchText(contactUrl);
    if (page) contactHtml.push(page);
  }

  const combinedHtml = [homeHtml, ...contactHtml].join('\n');
  const host = new URL(canonicalUrl).hostname;

  return {
    ok: true,
    data: {
      website: canonicalUrl,
      domain: normalizeDomain(canonicalUrl),
      businessName: extractBusinessName(homeHtml, host),
      emails: extractEmails(combinedHtml),
      phones: extractPhones(combinedHtml),
      contactUrls,
      ...inspectSignals(homeHtml, canonicalUrl),
    },
  };
}

/**
 * Place Type corrispondente al settore richiesto, quando esiste. Con una
 * corrispondenza la ricerca viene ristretta lato Google; senza, resta la sola
 * query testuale di prima e nessun tipo viene inventato.
 */
const expectedPlaceType = placeTypeForSector(sector);

async function discoverPlaces() {
  const body = {
    textQuery: `${sector} a ${location}`,
    languageCode: 'it',
    regionCode: 'IT',
    pageSize: limit,
  };

  // strictTypeFiltering ha effetto solo insieme a includedType: chiesti insieme,
  // Google restituisce esclusivamente attività il cui tipo primario corrisponde.
  if (expectedPlaceType) {
    body.includedType = expectedPlaceType;
    body.strictTypeFiltering = true;
  }

  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      /*
       * FieldMask minimo: identificativo, nome, sito, i due campi di tipo che
       * servono al controllo di pertinenza, e il telefono — che per un'attività
       * senza sito è l'unico recapito ottenibile senza visitare nulla.
       * Nessun campo a tariffa superiore: niente rating, recensioni, orari.
       */
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.websiteUri,places.primaryType,places.types,places.nationalPhoneNumber',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Places ${response.status}: ${text.slice(0, 300)}`);
  }

  const payload = await response.json();
  // Il sito non è più obbligatorio: un'attività pertinente che non ce l'ha è un
  // dato utile, non un record da buttare. Resta obbligatorio il solo Place ID.
  return (payload.places || []).slice(0, limit).filter((place) => place.id);
}

async function loadExistingProspectIndex() {
  const index = {
    placeIds: new Set(),
    emails: new Set(),
    phones: new Set(),
    domains: new Set(),
    names: new Set(),
  };
  if (!supabase) return index;

  const { data, error } = await supabase
    .from(PROSPECTS_TABLE)
    .select('place_id,name,emails,phones,domain,website');
  if (error) throw new Error(`Impossibile leggere i prospect esistenti: ${error.message}`);

  for (const row of data || []) {
    if (row.place_id) index.placeIds.add(String(row.place_id).trim());
    for (const email of row.emails || []) {
      if (email) index.emails.add(String(email).trim().toLowerCase());
    }
    for (const phone of row.phones || []) {
      const key = phoneKey(phone);
      if (key) index.phones.add(key);
    }
    const domain = row.domain || normalizeDomain(row.website);
    if (domain) index.domains.add(domain);
    const name = normalizeBusinessName(row.name);
    if (name) index.names.add(name);
  }

  return index;
}

/*
 * Deduplica in ordine di affidabilità decrescente.
 *
 * Il Place ID viene per primo perché è l'unico identificatore stabile che
 * abbiamo: non cambia se l'attività rifà il sito o cambia numero, ed è l'unica
 * chiave disponibile per chi un sito non ce l'ha. Senza di lui un'attività
 * `no_website` — priva di email, dominio e spesso di telefono — rientrerebbe a
 * ogni esecuzione sullo stesso settore.
 */
function duplicateReason(index, record) {
  const placeId = record.placeId ? String(record.placeId).trim() : null;
  const email = record.emails?.[0]?.toLowerCase() || null;
  const phone = record.phones?.[0] ? phoneKey(record.phones[0]) : null;
  const name = normalizeBusinessName(record.canonicalName || record.businessName);
  if (placeId && index.placeIds.has(placeId)) return 'Place ID già presente';
  if (email && index.emails.has(email)) return 'email già presente';
  if (phone && index.phones.has(phone)) return 'telefono già presente';
  if (record.domain && index.domains.has(record.domain)) return 'dominio già presente';
  if (name && index.names.has(name)) return 'attività già presente';
  return null;
}

function addToProspectIndex(index, record) {
  const email = record.emails?.[0]?.toLowerCase() || null;
  const phone = record.phones?.[0] ? phoneKey(record.phones[0]) : null;
  const name = normalizeBusinessName(record.canonicalName || record.businessName);
  if (record.placeId) index.placeIds.add(String(record.placeId).trim());
  if (email) index.emails.add(email);
  if (phone) index.phones.add(phone);
  if (record.domain) index.domains.add(record.domain);
  if (name) index.names.add(name);
}

/**
 * Le note raccolgono solo ciò che non ha una colonna propria: i findings, i
 * contatti e il punteggio hanno ora campi dedicati e non vanno duplicati qui.
 */
/**
 * Le note dicono solo ciò che non ha una colonna propria: presenza, punteggi,
 * Place ID e tipo Google adesso ce l'hanno, e ripeterli qui creerebbe due
 * verità da tenere allineate.
 */
function buildNotes(row) {
  const contatto = row.emails?.length || row.phones?.length
    ? 'Recapito disponibile.'
    : 'Nessun recapito raccolto: da cercare sulla scheda Google in fase di revisione.';

  return [
    'Prospect generato automaticamente dal modulo Prospecting LS Web Agency.',
    'Email e telefoni estratti dal sito pubblico dell’attività e dalla scheda Google.',
    contatto,
    'Stato: mai contattato.',
  ].join('\n');
}

/**
 * Payload di inserimento, sullo schema introdotto da
 * `migrate-opportunity-model.sql`.
 *
 * `technical_score` è null — non zero — quando non c'è una pagina da misurare:
 * uno zero in quella colonna si leggerebbe come "sito perfetto", che è
 * l'opposto di "sito assente".
 */
function buildPayload(row) {
  return {
    source: 'prospecting',
    query: `${sector} a ${location}`,
    name: clamp(row.businessName, 150) || 'Prospect senza nome',
    website: row.website || null,
    domain: row.domain || null,
    city: clamp(location, 100),
    // Lo script non ricostruisce l'URL della scheda Maps: con il Place ID in
    // colonna, ricavarlo in revisione è immediato.
    google_maps_url: null,
    emails: row.emails ?? [],
    phones: row.phones ?? [],
    contact_urls: row.contactUrls ?? [],
    findings: row.issues ?? [],
    technical_score: Number.isFinite(row.technicalScore) ? row.technicalScore : null,
    opportunity_score: Number.isFinite(row.opportunityScore) ? row.opportunityScore : null,
    presence_type: row.presence ?? null,
    place_id: row.placeId || null,
    place_name: clamp(row.placeName, 150) || null,
    site_name: clamp(row.siteName, 150) || null,
    place_type: clamp(row.placeType, 80) || null,
    status: 'da_verificare',
    reviewed_at: null,
    notes: buildNotes(row),
  };
}

/* --- CSV ------------------------------------------------------------------ */

function csvCell(value) {
  const text = Array.isArray(value) ? value.join(' | ') : String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

/*
 * La vecchia colonna `score` è sparita: diceva "punteggio" senza dire di cosa.
 * Al suo posto ci sono `technical_score` — la salute del sito, vuoto quando non
 * c'è una pagina da misurare — e `opportunity_score`, che è la ragione per cui
 * un'attività ci interessa. `presence_type` apre la riga perché è la chiave di
 * lettura di tutto il resto.
 *
 * `nome` resta il nome canonico del prospect — quello di Google quando c'è —
 * mentre `place_name` e `site_name` mostrano le due identità separate: è il
 * confronto fra le due che smaschera una pagina ospitata.
 */
const CSV_COLUMNS = [
  'presence_type',
  'opportunity_score',
  'technical_score',
  'esito',
  'nome',
  'website',
  'dominio',
  'email',
  'telefoni',
  'findings',
  'pagine_contatto',
  'place_id',
  'tipo_google',
  'place_name',
  'site_name',
];

function toCsv(rows) {
  const lines = [CSV_COLUMNS.join(',')];
  for (const row of rows) {
    lines.push(
      [
        row.presence ?? '',
        row.opportunityScore ?? '',
        Number.isFinite(row.technicalScore) ? row.technicalScore : '',
        row.outcome,
        row.businessName ?? '',
        row.website ?? '',
        row.domain ?? '',
        row.emails ?? [],
        row.phones ?? [],
        row.issues ?? [],
        row.contactUrls ?? [],
        row.placeId ?? '',
        row.placeType ?? '',
        row.placeName ?? '',
        row.siteName ?? '',
      ]
        .map(csvCell)
        .join(','),
    );
  }
  return `${lines.join('\n')}\n`;
}

/* --- Conferma interattiva -------------------------------------------------- */

async function confirm(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await new Promise((resolve) => rl.question(question, resolve));
    return String(answer).trim().toLowerCase() === 'y';
  } finally {
    rl.close();
  }
}

/* --- Fase 1: analisi ------------------------------------------------------- */

const places = await discoverPlaces();
const results = [];

if (expectedPlaceType) {
  console.log(`Settore "${sector}" ristretto al tipo Google "${expectedPlaceType}".\n`);
} else {
  console.log(`Nessun tipo Google per "${sector}": ricerca solo testuale.\n`);
}

for (const place of places) {
  const placeName = clamp(place.displayName?.text || '', 150);
  const placeType = place.primaryType || (place.types || [])[0] || '';
  /*
   * Recapito dalla scheda Google. Resta distinto da quelli letti sul sito
   * finché non vengono uniti: è l'unico contatto disponibile per le presenze
   * che una pagina non ce l'hanno.
   */
  const googlePhone = normalizePhone(place.nationalPhoneNumber);
  const googlePhones = googlePhone ? [googlePhone] : [];

  /*
   * Tipo di presenza digitale, deciso prima di visitare qualunque sito.
   * Solo `owned_site` e `hosted_site` hanno una pagina che valga la pena
   * analizzare: le altre presenze si valutano per quello che sono, e la loro
   * opportunità commerciale non dipende dalla salute di un markup.
   */
  const { presence, reason, host } = presenceTypeFor(place, expectedPlaceType);
  const crawlable = presence === PRESENCE.ownedSite || presence === PRESENCE.hostedSite;

  if (!crawlable) {
    const opportunity = opportunityScore(presence);
    results.push({
      placeId: place.id,
      website: place.websiteUri || '',
      businessName: placeName,
      placeName,
      siteName: '',
      placeType,
      presence,
      technicalScore: null,
      opportunityScore: opportunity,
      emails: [],
      phones: googlePhones,
      contactUrls: [],
      issues: [],
      outcome: presence === PRESENCE.nonPertinente ? 'escluso' : 'non analizzato',
    });
    const dettaglio = reason || host || '';
    console.log(
      `  — | ${(placeName || place.id).padEnd(28).slice(0, 28)} | ${presence.padEnd(17)} | opp ${String(opportunity).padStart(3)} | ${googlePhones[0] || 'no-contact'}${dettaglio ? ` (${dettaglio})` : ''}`,
    );
    // Nessuna pausa: qui non è partita nessuna richiesta verso terzi.
    continue;
  }

  const outcome = await inspectWebsite(place.websiteUri);

  if (!outcome.ok) {
    /*
     * Pagina non leggibile. Per un microsito la presenza resta nota e con essa
     * l'opportunità; per un dominio proprio no, perché lì l'opportunità nasce
     * proprio dai problemi del sito: senza averlo letto non si può affermare
     * nulla, e il record resta fuori dalla qualificazione.
     */
    const opportunity = presence === PRESENCE.hostedSite ? opportunityScore(presence) : null;
    results.push({
      placeId: place.id,
      website: place.websiteUri,
      businessName: placeName,
      placeName,
      siteName: '',
      placeType,
      presence,
      technicalScore: null,
      opportunityScore: opportunity,
      emails: [],
      phones: googlePhones,
      contactUrls: [],
      issues: [],
      outcome: outcome.reason,
    });
    console.log(`  — | ${place.websiteUri} | ${outcome.reason}`);
    await sleep(350);
    continue;
  }

  const inspected = outcome.data;
  const siteName = inspected.businessName;

  /*
   * Terzo segnale, quello che si può leggere solo dopo aver visitato la pagina:
   * il nome sul sito non ha nulla a che vedere con quello che Google associa
   * all'attività, né con l'indirizzo. In quel caso il punteggio appena
   * calcolato descrive qualcun altro, e non va attribuito a questo prospect.
   */
  if (!identityLooksConsistent(placeName, siteName, inspected.website)) {
    const opportunity = opportunityScore(PRESENCE.thirdPartyPage);
    results.push({
      placeId: place.id,
      website: inspected.website,
      domain: inspected.domain,
      businessName: placeName,
      placeName,
      siteName,
      placeType,
      presence: PRESENCE.thirdPartyPage,
      // Il punteggio tecnico appena calcolato descrive la piattaforma:
      // non viene attribuito a questa attività. I contatti letti su quella
      // pagina sono della piattaforma, quindi resta il solo numero di Google.
      technicalScore: null,
      opportunityScore: opportunity,
      emails: [],
      phones: googlePhones,
      contactUrls: [],
      issues: [],
      outcome: 'non analizzato',
    });
    console.log(
      `  — | ${(placeName || place.id).padEnd(28).slice(0, 28)} | ${PRESENCE.thirdPartyPage.padEnd(17)} | opp ${String(opportunity).padStart(3)} (il sito si presenta come "${siteName}")`,
    );
    await sleep(350);
    continue;
  }

  // Nome canonico: quello di Google, che identifica l'attività sulla mappa.
  // Il nome letto dal sito resta accanto come segnale di verifica.
  const canonicalName = placeName || siteName;

  const technicalScore = inspected.technicalScore;
  const opportunity = opportunityScore(presence, technicalScore);
  const phones = mergePhones(inspected.phones, googlePhones);

  results.push({
    place,
    placeId: place.id,
    website: inspected.website,
    domain: inspected.domain,
    businessName: canonicalName,
    placeName,
    siteName,
    placeType,
    presence,
    technicalScore,
    opportunityScore: opportunity,
    emails: inspected.emails,
    // Sito prima, Google poi: la stessa utenza in due formati conta una volta.
    phones,
    contactUrls: inspected.contactUrls,
    issues: inspected.issues,
    inspected: { ...inspected, canonicalName, phones },
    outcome: 'analizzato',
  });

  console.log(
    `${String(technicalScore).padStart(3)} | ${(canonicalName || '').padEnd(28).slice(0, 28)} | ${presence.padEnd(17)} | opp ${String(opportunity).padStart(3)} | ${inspected.emails[0] || inspected.phones[0] || 'no-contact'}`,
  );
  await sleep(350);
}

/** Record che hanno davvero un punteggio tecnico, cioè quelli con una pagina letta. */
const analyzed = results.filter((row) => Number.isFinite(row.technicalScore));
/** Sopra la soglia TECNICA: resta come diagnostica, non decide più chi si salva. */
const technicallyWeak = analyzed.filter((row) => row.technicalScore >= QUALIFIED_SCORE);
/** Sopra la soglia COMMERCIALE: è questa che governa --save. */
const commerciallyQualified = results.filter((row) =>
  isCommerciallyQualified(row.presence, row.opportunityScore),
);

/* --- Fase 2: selezione delle righe da inserire ----------------------------- */

/**
 * La selezione avviene prima di qualunque scrittura: e' cio' che permette di
 * annunciare quante righe verranno inserite e su quale tabella. L'indice viene
 * aggiornato mentre si pianifica, cosi' due prospect identici nella stessa
 * esecuzione non passano entrambi.
 */
const prospectIndex = save ? await loadExistingProspectIndex() : null;
const toInsert = [];

if (save) {
  for (const row of results) {
    const gate = qualifiesForSave(row);
    if (!gate.ok) {
      row.outcome = gate.reason;
      continue;
    }

    const duplicate = duplicateReason(prospectIndex, row);
    if (duplicate) {
      row.outcome = duplicate;
      continue;
    }
    addToProspectIndex(prospectIndex, row);
    // L'assenza di recapito non annulla l'opportunità: resta scritta nell'esito,
    // così in revisione si sa quali schede vanno aperte su Maps per il contatto.
    row.outcome = gate.needsContact ? 'da inserire (contatto da trovare)' : 'da inserire';
    toInsert.push(row);
  }
}

/* --- CSV: sempre tutti gli analizzati, non solo i qualificati -------------- */

if (csvPath) {
  writeFileSync(csvPath, toCsv(results), 'utf8');
  console.log(`\nCSV scritto: ${csvPath} (${results.length} righe, tutti gli esaminati)`);
}

const countPresence = (kind) => results.filter((row) => row.presence === kind).length;

console.log(
  `\nTrovati: ${places.length} | Pagine analizzate: ${analyzed.length} | Tecnicamente deboli (${QUALIFIED_SCORE}+): ${technicallyWeak.length}`,
);
console.log(
  `Presenza — sito proprio: ${countPresence(PRESENCE.ownedSite)} | microsito: ${countPresence(PRESENCE.hostedSite)} | solo social: ${countPresence(PRESENCE.socialOnly)} | senza sito: ${countPresence(PRESENCE.noWebsite)} | pagina di terzi: ${countPresence(PRESENCE.thirdPartyPage)} | non pertinenti: ${countPresence(PRESENCE.nonPertinente)}`,
);
console.log(
  `Opportunità commerciale (${QUALIFIED_OPPORTUNITY_SCORE}+): ${commerciallyQualified.length} — è questa a decidere cosa salva --save.`,
);

/* --- Fase 3: scrittura, solo dopo conferma --------------------------------- */

if (!save) {
  console.log(
    `Nessuna scrittura: questa e' una sola analisi. Aggiungi --save per inserire in ${PROSPECTS_TABLE}.`,
  );
  process.exit(0);
}

if (!toInsert.length) {
  console.log('Nessuna riga da inserire: niente da scrivere.');
  process.exit(0);
}

console.log(
  [
    '',
    '─────────────────────────────────────────────',
    ` SCRITTURA SU DATABASE`,
    ` Tabella: ${PROSPECTS_TABLE}`,
    ` Righe da inserire: ${toInsert.length}`,
    ' Operazione non annullabile dallo script.',
    '─────────────────────────────────────────────',
  ].join('\n'),
);

if (!assumeYes) {
  if (!process.stdin.isTTY) {
    console.error(
      'Sessione non interattiva: impossibile chiedere conferma. Rilancia con --yes se e\' voluto.',
    );
    process.exit(1);
  }
  const ok = await confirm(`Procedo a inserire ${toInsert.length} righe in ${PROSPECTS_TABLE}? (y/N) `);
  if (!ok) {
    console.log('Annullato. Nessuna riga inserita.');
    process.exit(0);
  }
}

let savedCount = 0;
for (const row of toInsert) {
  const { error } = await supabase.from(PROSPECTS_TABLE).insert(buildPayload(row));
  if (error) throw error;
  row.outcome = 'inserito';
  savedCount += 1;
}

console.log(`Inserite ${savedCount} righe in ${PROSPECTS_TABLE}.`);

if (csvPath) {
  writeFileSync(csvPath, toCsv(results), 'utf8');
  console.log(`CSV aggiornato con l'esito finale: ${csvPath}`);
}
