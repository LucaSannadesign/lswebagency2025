/**
 * Classificazione dei risultati di Google Places, prima di qualunque richiesta HTTP.
 *
 * Vive in un file separato da run.mjs per una ragione pratica: run.mjs esegue la
 * discovery al primo livello del modulo, quindi importarlo da un test farebbe
 * partire una chiamata reale all'API. Qui dentro ci sono solo funzioni pure.
 *
 * Cosa NON fa: non tocca il punteggio tecnico né la soglia di qualificazione.
 * Le categorie prodotte qui dicono "questo record non va nemmeno analizzato",
 * che è un'informazione diversa da "analizzato e con pochi problemi".
 */

/**
 * Corrispondenza fra il settore digitato e il Place Type di Google.
 *
 * Volutamente corta: un tipo inesistente farebbe fallire la ricerca quando è
 * accompagnato da strictTypeFiltering, quindi qui entrano solo corrispondenze
 * verificate sulla tabella dei tipi supportati. Per estenderla basta aggiungere
 * una riga con la chiave in minuscolo — le varianti singolare/plurale vanno
 * elencate entrambe, perché il confronto è esatto.
 *
 * Tabella di riferimento:
 * https://developers.google.com/maps/documentation/places/web-service/place-types
 */
export const SECTOR_PLACE_TYPES = {
  ristoranti: 'restaurant',
  ristorante: 'restaurant',
};

/** Place Type per un settore, oppure null se non esiste una corrispondenza certa. */
export function placeTypeForSector(sector) {
  const key = String(sector || '')
    .toLocaleLowerCase('it-IT')
    .trim()
    .replace(/\s+/g, ' ');
  return SECTOR_PLACE_TYPES[key] ?? null;
}

/**
 * Domini che sono una presenza social, non un sito dell'attività.
 * Un profilo Facebook o Instagram non si analizza come si analizza un sito:
 * il markup è quello della piattaforma, non dell'attività, e misurarne title o
 * dati strutturati direbbe qualcosa di Meta, non del ristorante.
 */
export const SOCIAL_HOSTS = new Set(['facebook.com', 'm.facebook.com', 'instagram.com']);

/**
 * Host di un URL, senza `www.`. Lettura indipendente e minima: serve solo a
 * riconoscere i social, e non sostituisce le normalizzazioni usate altrove.
 */
export function hostOf(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.hostname.toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
  } catch {
    return null;
  }
}

/** Host social riconosciuto, oppure null. */
export function socialHostOf(rawUrl) {
  const host = hostOf(rawUrl);
  return host && SOCIAL_HOSTS.has(host) ? host : null;
}

/* --- Pagine ospitate da terzi ---------------------------------------------
 *
 * Il caso che ha motivato questa parte: Google restituisce un'osteria con tipo
 * `italian_restaurant` e sito `wireplaza.com/stand/osteriapiega`. La pagina è
 * uno "stand" dentro una piattaforma: il crawler ne leggeva title e markup e
 * assegnava 80 punti — che però misurano wirePlaza, non l'osteria.
 *
 * Il riconoscimento sta su tre segnali indipendenti invece che su un elenco di
 * domini lungo e impossibile da mantenere:
 *   1. una manciata di piattaforme e accorciatori evidenti;
 *   2. la forma dell'URL, quando è quella di un profilo dentro un contenitore;
 *   3. l'incoerenza forte fra il nome di Google e quello letto sul sito.
 *
 * I primi due si valutano prima di visitare il sito, il terzo dopo.
 */

/**
 * Elenco volutamente corto: solo casi in cui il dominio, da solo, dice che la
 * pagina non appartiene all'attività. I micrositi con sottodominio proprio
 * (per esempio `nomeristorante.eatbu.com`) NON stanno qui: sono siti veri
 * dell'attività, e vanno analizzati come tali.
 */
export const PLATFORM_HOSTS = new Set([
  'wireplaza.com',
  'linktr.ee',
  'linktree.com',
]);

/**
 * Accorciatori: la pagina che risponde è un intermediario, e il suo markup non
 * dice nulla dell'attività. Il redirect non viene risolto di proposito —
 * seguirlo significherebbe interrogare un servizio terzo il cui robots.txt non
 * abbiamo motivo di ignorare — quindi il record esce dall'analisi con un esito
 * proprio invece di prendere il punteggio della pagina di rimbalzo.
 */
export const SHORTENER_HOSTS = new Set([
  'goo.gl',
  'bit.ly',
  'tinyurl.com',
  't.co',
  'ow.ly',
]);

/**
 * Primo segmento di percorso tipico di un profilo dentro un contenitore.
 * Confrontato solo sul primo segmento e solo se ne segue almeno un altro:
 * `esempio.it/stand/` da solo non basta, serve `esempio.it/stand/qualcuno`.
 */
const PROFILE_PATH_SEGMENTS = new Set(['stand', 'listing', 'listings', 'profilo', 'profile', 'biz', 'place', 'vetrina']);

/** Termini che non distinguono un'attività da un'altra. */
const GENERIC_NAME_TOKENS = new Set([
  'ristorante', 'ristoranti', 'trattoria', 'osteria', 'pizzeria', 'bar', 'caffe', 'cafe',
  'hotel', 'albergo', 'agriturismo', 'locanda', 'braceria', 'enoteca', 'gelateria',
  'srl', 'srls', 'snc', 'sas', 'spa', 'ss', 'di', 'da', 'del', 'della', 'dei', 'delle',
  'il', 'lo', 'la', 'le', 'gli', 'i', 'e', 'ed', 'a', 'al', 'alla', 'allo', 'ai',
  'the', 'and', 'restaurant', 'srl.', 'com', 'it', 'home', 'benvenuti', 'sito',
  'ufficiale', 'official', 'web', 'online',
]);

/** Minuscole, via la punteggiatura, spazi normalizzati. */
export function normalizeIdentity(value) {
  return String(value || '')
    .toLocaleLowerCase('it-IT')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Token distintivi: normalizzati, senza generici e senza frammenti di 1-2 lettere. */
export function identityTokens(value) {
  return normalizeIdentity(value)
    .split(' ')
    .filter((token) => token.length > 2 && !GENERIC_NAME_TOKENS.has(token));
}

/**
 * Coerenza fra il nome di Google, quello letto dal sito e il dominio.
 *
 * Non è un confronto fra stringhe: "Osteria Piega" e "Piega — Cucina di mare"
 * devono coincidere, mentre "Osteria Piega" e "wirePlaza - Connected, Together"
 * no. Basta un token distintivo condiviso, oppure un token che compaia nel
 * dominio o nel percorso: è un controllo di buon senso, non un giudizio.
 *
 * In mancanza di dati (nome assente, o solo termini generici) risponde `true`:
 * un segnale che non c'è non è una prova di estraneità.
 */
export function identityLooksConsistent(placeName, siteName, url) {
  const placeTokens = identityTokens(placeName);
  if (!placeTokens.length) return true;

  const siteTokens = identityTokens(siteName);
  if (siteTokens.length && placeTokens.some((token) => siteTokens.includes(token))) return true;

  /*
   * Il nome può non comparire nel markup ma essere nel dominio: `osteriapiega.it`
   * è dell'osteria anche se la home dice solo "Benvenuti".
   *
   * Si guarda l'host e non l'intero indirizzo, ed è una distinzione che conta:
   * `wireplaza.com/stand/osteriapiega` contiene il nome nel percorso, ma quel
   * percorso è lo slug che la piattaforma assegna ai suoi iscritti — semmai la
   * conferma che la pagina è ospitata, non la prova che il sito sia loro.
   */
  const host = normalizeIdentity(hostOf(url) || '').replace(/\s+/g, '');
  if (host && placeTokens.some((token) => host.includes(token))) return true;

  return siteTokens.length === 0;
}

/** Esiti di discovery: categorie, non punteggi. */
export const OUTCOME = {
  ok: 'ok',
  nonPertinente: 'non_pertinente',
  socialOnly: 'social_only',
  noWebsite: 'no_website',
  hostedProfile: 'hosted_profile',
};

/* --- Tipo di presenza digitale ---------------------------------------------
 *
 * Il punteggio tecnico misura la salute di un sito. Non dice se l'attività sia
 * interessante per noi: un ristorante senza sito ha punteggio nullo e resta il
 * prospect migliore del lotto, mentre un sito ben fatto ha punteggio basso
 * proprio perché non ha bisogno di niente.
 *
 * `presence_type` risponde a una domanda diversa dal punteggio: che tipo di
 * presenza digitale ha questa attività. È da qui che si costruisce
 * l'opportunità commerciale.
 */
export const PRESENCE = {
  noWebsite: 'no_website',
  socialOnly: 'social_only',
  hostedSite: 'hosted_site',
  thirdPartyPage: 'third_party_page',
  ownedSite: 'owned_site',
  nonPertinente: 'non_pertinente',
};

/**
 * Piattaforme che ospitano micrositi veri dell'attività: il dominio non è suo,
 * ma la pagina la rappresenta davvero e ha contatti propri da leggere.
 *
 * Diverse dalle PLATFORM_HOSTS: lì la pagina è uno stand dentro una vetrina
 * altrui, qui è il sito del ristorante che vive su un sottodominio. Il
 * confronto è sul suffisso, così `trattorialoluda.eatbu.com` rientra e
 * `eatbu.com` da solo no.
 */
export const HOSTED_SITE_SUFFIXES = ['eatbu.com'];

/** true quando l'host è un microsito su una piattaforma nota. */
export function isHostedSiteHost(rawUrl) {
  const host = hostOf(rawUrl);
  if (!host) return false;
  return HOSTED_SITE_SUFFIXES.some((suffix) => host !== suffix && host.endsWith(`.${suffix}`));
}

/**
 * Tipo di presenza a partire dal risultato di Places.
 * Si appoggia a classifyPlace per non duplicarne le regole, e aggiunge la sola
 * distinzione che quella non fa: microsito su piattaforma contro dominio proprio.
 */
export function presenceTypeFor(place, expectedType) {
  const verdict = classifyPlace(place, expectedType);

  switch (verdict.kind) {
    case OUTCOME.nonPertinente:
      return { presence: PRESENCE.nonPertinente, reason: verdict.reason };
    case OUTCOME.noWebsite:
      return { presence: PRESENCE.noWebsite };
    case OUTCOME.socialOnly:
      return { presence: PRESENCE.socialOnly, host: verdict.host };
    case OUTCOME.hostedProfile:
      return { presence: PRESENCE.thirdPartyPage, reason: verdict.reason };
    default:
      return isHostedSiteHost(place?.websiteUri)
        ? { presence: PRESENCE.hostedSite, host: hostOf(place.websiteUri) }
        : { presence: PRESENCE.ownedSite };
  }
}

/* --- Opportunità commerciale ------------------------------------------------
 *
 * Scala 0–100 separata dal punteggio tecnico, con valori espliciti invece che
 * calcolati: sono una scelta commerciale, e vanno letti e discussi come tali.
 *
 * L'ordine riflette quanto lavoro c'è da fare per l'attività: chi non ha un
 * sito ha tutto da costruire, chi ne ha uno proprio e sano non ha bisogno di
 * noi. Le presenze non autonome stanno in mezzo, più in alto quanto meno
 * controllo ha l'attività su ciò che pubblica.
 */
export const OPPORTUNITY_BY_PRESENCE = {
  [PRESENCE.noWebsite]: 95,
  [PRESENCE.socialOnly]: 90,
  [PRESENCE.hostedSite]: 80,
  [PRESENCE.thirdPartyPage]: 75,
  [PRESENCE.nonPertinente]: 0,
};

/** Punteggio tecnico di un sito senza problemi rilevati: è il pavimento della scala. */
export const TECHNICAL_BASELINE = 30;

/**
 * Opportunità di un sito con dominio proprio.
 *
 * Non è il punteggio tecnico ricopiato: quello parte da 30 anche quando non c'è
 * nulla da correggere, e un 30 non è "quasi un terzo di opportunità", è nessuna
 * opportunità. La scala tecnica 30–100 viene quindi riportata su 0–100, così un
 * sito sano vale 0 e uno con cinque problemi su sette supera la soglia
 * commerciale.
 */
export function opportunityForOwnedSite(technicalScore) {
  const technical = Number(technicalScore);
  if (!Number.isFinite(technical)) return 0;
  const normalized = ((technical - TECHNICAL_BASELINE) / (100 - TECHNICAL_BASELINE)) * 100;
  return Math.max(0, Math.min(100, Math.round(normalized)));
}

/** Opportunità commerciale per un record classificato. */
export function opportunityScore(presence, technicalScore) {
  if (presence === PRESENCE.ownedSite) return opportunityForOwnedSite(technicalScore);
  return OPPORTUNITY_BY_PRESENCE[presence] ?? 0;
}

/**
 * Soglia commerciale, deliberatamente distinta da quella tecnica.
 *
 * A 70 passano tutte le presenze non autonome (75–95), cioè le attività a cui
 * manca qualcosa di strutturale, e fra i siti con dominio proprio solo quelli
 * con un punteggio tecnico di almeno 79 — in pratica cinque problemi su sette.
 * Un sito che funziona non diventa un prospect solo perché esiste.
 */
export const QUALIFIED_OPPORTUNITY_SCORE = 70;

/** Un record è commercialmente qualificabile? I non pertinenti non lo sono mai. */
export function isCommerciallyQualified(presence, opportunity) {
  if (presence === PRESENCE.nonPertinente) return false;
  return Number(opportunity) >= QUALIFIED_OPPORTUNITY_SCORE;
}

/**
 * Criterio di ammissione al salvataggio, al netto della deduplica — che
 * dipende da cosa c'è già in tabella e vive in run.mjs.
 *
 * Un'opportunità valida non viene annullata dalla mancanza di un recapito:
 * finché c'è un Place ID il prospect è rintracciabile, e il contatto si cerca a
 * mano sulla scheda Google. Buttarlo qui significherebbe scartare proprio le
 * attività senza sito, che sono le più interessanti. L'assenza resta però
 * segnalata, perché in revisione si sappia quali schede vanno aperte.
 *
 * Restituisce `{ ok }`, eventualmente con `needsContact`, oppure
 * `{ ok: false, reason }` da scrivere nel CSV.
 */
export function qualifiesForSave(row) {
  const presence = row?.presence;
  if (!isCommerciallyQualified(presence, row?.opportunityScore)) {
    return {
      ok: false,
      reason: presence === PRESENCE.nonPertinente ? 'escluso' : 'sotto soglia commerciale',
    };
  }

  const hasContact = Boolean(row?.emails?.length || row?.phones?.length);
  if (hasContact) return { ok: true, needsContact: false };

  // Senza recapito serve almeno un identificatore stabile per ritrovarla.
  const hasPlaceId = Boolean(String(row?.placeId || '').trim());
  if (!hasPlaceId) return { ok: false, reason: 'nessun contatto' };

  return { ok: true, needsContact: true };
}

/**
 * Riconosce, dal solo indirizzo, una pagina che non appartiene all'attività.
 * Restituisce la motivazione oppure null.
 */
export function hostedProfileReason(rawUrl) {
  const host = hostOf(rawUrl);
  if (!host) return null;

  if (SHORTENER_HOSTS.has(host)) return `accorciatore ${host}: destinazione non risolta`;
  if (PLATFORM_HOSTS.has(host)) return `pagina ospitata su ${host}`;

  try {
    const url = new URL(/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`);
    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.length >= 2 && PROFILE_PATH_SEGMENTS.has(segments[0].toLowerCase())) {
      return `URL da profilo dentro un contenitore (/${segments[0]}/)`;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Decide cosa fare di un risultato di Places prima di visitarne il sito.
 *
 * L'incompatibilità di settore viene dichiarata solo quando Google fornisce i
 * tipi e nessuno corrisponde a quello atteso: un record senza tipi non viene
 * scartato per un dato che manca, e senza una mappatura di settore non viene
 * giudicato affatto.
 */
export function classifyPlace(place, expectedType) {
  const types = [place?.primaryType, ...(place?.types ?? [])].filter(Boolean);

  if (expectedType && types.length && !types.includes(expectedType)) {
    return {
      kind: OUTCOME.nonPertinente,
      reason: `tipo Google "${types[0]}" estraneo a "${expectedType}"`,
    };
  }

  const website = String(place?.websiteUri || '').trim();
  if (!website) return { kind: OUTCOME.noWebsite };

  const social = socialHostOf(website);
  if (social) return { kind: OUTCOME.socialOnly, host: social };

  // Ultimo controllo prima del crawl: se l'indirizzo dice già che la pagina è
  // di una piattaforma, visitarla misurerebbe la piattaforma.
  const hosted = hostedProfileReason(website);
  if (hosted) return { kind: OUTCOME.hostedProfile, reason: hosted };

  return { kind: OUTCOME.ok };
}
