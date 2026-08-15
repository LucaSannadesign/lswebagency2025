// Test della fase di discovery/qualificazione del modulo prospecting.
// Copre: scripts/prospecting/classify.mjs
// Esecuzione:
//   node --test tests/prospectingClassify.test.mjs
//
// Le funzioni sotto test sono pure: nessuna richiesta di rete, nessuna chiave,
// nessun accesso a Supabase. Il caso reale che ha motivato questi controlli è
// "wirePlaza - Connected, Together", che con la sola query testuale finiva fra i
// qualificati pur non essendo un ristorante.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyPlace,
  placeTypeForSector,
  socialHostOf,
  hostedProfileReason,
  identityLooksConsistent,
  identityTokens,
  OUTCOME,
} from '../scripts/prospecting/classify.mjs';
import { extractEmails, mergePhones, phoneKey } from '../scripts/prospecting/extract.mjs';
import {
  presenceTypeFor,
  opportunityScore,
  opportunityForOwnedSite,
  isCommerciallyQualified,
  isHostedSiteHost,
  qualifiesForSave,
  PRESENCE,
  QUALIFIED_OPPORTUNITY_SCORE,
} from '../scripts/prospecting/classify.mjs';

/** Scorciatoia per costruire un risultato di Places nei test. */
const placeOf = (over = {}) => ({
  id: 'p',
  displayName: { text: 'Attività' },
  primaryType: 'restaurant',
  types: ['restaurant'],
  ...over,
});

const RISTORANTE = placeTypeForSector('ristoranti');

test('1. un ristorante con sito proprio viene accettato', () => {
  const place = {
    id: 'place-1',
    displayName: { text: 'Trattoria da Mario' },
    websiteUri: 'https://trattoriadamario.it',
    primaryType: 'restaurant',
    types: ['restaurant', 'food', 'point_of_interest'],
  };
  assert.equal(classifyPlace(place, RISTORANTE).kind, OUTCOME.ok);
});

test('2. un\'attività estranea al settore viene scartata come non pertinente', () => {
  const place = {
    id: 'place-2',
    displayName: { text: 'wirePlaza - Connected, Together' },
    websiteUri: 'https://wireplaza.example',
    primaryType: 'telecommunications_service_provider',
    types: ['telecommunications_service_provider', 'point_of_interest'],
  };
  const verdict = classifyPlace(place, RISTORANTE);
  assert.equal(verdict.kind, OUTCOME.nonPertinente);
  // L'esito deve spiegarsi da solo nel CSV, senza somigliare a un punteggio.
  assert.match(verdict.reason, /restaurant/);
});

test('3. un profilo Facebook diventa social_only e non viene analizzato', () => {
  const place = {
    id: 'place-3',
    displayName: { text: 'Pizzeria del Corso' },
    websiteUri: 'https://www.facebook.com/pizzeriadelcorso',
    primaryType: 'restaurant',
    types: ['restaurant'],
  };
  const verdict = classifyPlace(place, RISTORANTE);
  assert.equal(verdict.kind, OUTCOME.socialOnly);
  assert.equal(verdict.host, 'facebook.com');
});

test('3b. anche la versione mobile di Facebook è social_only', () => {
  const place = { id: 'p', websiteUri: 'https://m.facebook.com/tizio', primaryType: 'restaurant' };
  assert.equal(classifyPlace(place, RISTORANTE).kind, OUTCOME.socialOnly);
});

test('4. un profilo Instagram diventa social_only', () => {
  const place = {
    id: 'place-4',
    displayName: { text: 'Osteria del Porto' },
    websiteUri: 'https://instagram.com/osteriadelporto',
    primaryType: 'restaurant',
    types: ['restaurant'],
  };
  const verdict = classifyPlace(place, RISTORANTE);
  assert.equal(verdict.kind, OUTCOME.socialOnly);
  assert.equal(verdict.host, 'instagram.com');
});

test('5. un ristorante senza sito diventa no_website invece di sparire', () => {
  const place = {
    id: 'place-5',
    displayName: { text: 'Ristorante Da Pietro' },
    primaryType: 'restaurant',
    types: ['restaurant'],
  };
  assert.equal(classifyPlace(place, RISTORANTE).kind, OUTCOME.noWebsite);
});

test('5b. websiteUri vuoto o composto da spazi vale come assente', () => {
  assert.equal(classifyPlace({ id: 'p', websiteUri: '   ' }, null).kind, OUTCOME.noWebsite);
});

test('6. un settore senza mappatura non produce alcun tipo Google', () => {
  assert.equal(placeTypeForSector('consulenti energetici'), null);
  assert.equal(placeTypeForSector(''), null);
  assert.equal(placeTypeForSector(undefined), null);
});

test('6b. senza mappatura nessun record viene giudicato non pertinente', () => {
  const place = {
    id: 'place-6',
    displayName: { text: 'Studio Qualsiasi' },
    websiteUri: 'https://studioqualsiasi.it',
    primaryType: 'telecommunications_service_provider',
    types: ['telecommunications_service_provider'],
  };
  // expectedType null = fallback alla sola ricerca testuale: si analizza tutto.
  assert.equal(classifyPlace(place, null).kind, OUTCOME.ok);
});

test('7. la mappatura riconosce singolare e plurale, ignorando maiuscole e spazi', () => {
  assert.equal(placeTypeForSector('ristoranti'), 'restaurant');
  assert.equal(placeTypeForSector('Ristorante'), 'restaurant');
  assert.equal(placeTypeForSector('  RISTORANTI  '), 'restaurant');
});

test('8. senza tipi da Google non si dichiara incompatibilità', () => {
  // Un dato assente non è una prova contraria: il record va analizzato.
  const place = { id: 'place-7', websiteUri: 'https://esempio.it' };
  assert.equal(classifyPlace(place, RISTORANTE).kind, OUTCOME.ok);
});

test('9. il tipo atteso viene riconosciuto anche se non è il primario', () => {
  const place = {
    id: 'place-8',
    websiteUri: 'https://esempio.it',
    primaryType: 'bar',
    types: ['bar', 'restaurant'],
  };
  assert.equal(classifyPlace(place, RISTORANTE).kind, OUTCOME.ok);
});

test('10. i domini non social non vengono scambiati per social', () => {
  assert.equal(socialHostOf('https://facebookmarketing.it'), null);
  assert.equal(socialHostOf('https://trattoria-instagram.it'), null);
  assert.equal(socialHostOf('https://facebook.com/x'), 'facebook.com');
});

/* --- Identità: nome Google, nome del sito, dominio ------------------------
 *
 * Caso reale: Google restituisce "Osteria Piega" con tipo italian_restaurant,
 * ma il sito è uno stand dentro wirePlaza e il crawler legge come nome
 * "wirePlaza - Connected, Together". Lo score che ne usciva — 80 — misurava la
 * piattaforma, non l'osteria.
 */

test('11. nome Google e nome del sito coerenti', () => {
  assert.equal(identityLooksConsistent('Trattoria da Mario', 'Trattoria da Mario', 'https://trattoriadamario.it'), true);
});

test('12. una piccola variazione del nome resta accettata', () => {
  // Suffissi, punteggiatura, maiuscole e parole generiche non devono scartare.
  assert.equal(identityLooksConsistent('Osteria Piega', 'Piega — Cucina di mare', 'https://osteriapiega.it'), true);
  assert.equal(identityLooksConsistent('Ristorante Il Grillo', 'IL GRILLO s.r.l.', 'https://ilgrillo.it'), true);
  assert.equal(identityLooksConsistent('Sale e Pepe', 'Sale&Pepe Sassari', 'https://saleepepe.it'), true);
});

test('13. il nome che compare solo nel dominio basta a confermare l\'identità', () => {
  assert.equal(identityLooksConsistent('Osteria Piega', 'Benvenuti', 'https://osteriapiega.it'), true);
});

test('14. wirePlaza: identità incoerente, il nome del sito è la piattaforma', () => {
  assert.equal(
    identityLooksConsistent('Osteria Piega', 'wirePlaza - Connected, Together', 'https://wireplaza.com/stand/osteriapiega'),
    false,
  );
});

test('15. wirePlaza viene fermato già dall\'URL, senza visitare la pagina', () => {
  const place = {
    id: 'p-wireplaza',
    displayName: { text: 'Osteria Piega' },
    websiteUri: 'https://wireplaza.com/stand/osteriapiega',
    primaryType: 'italian_restaurant',
    types: ['italian_restaurant', 'restaurant'],
  };
  const verdict = classifyPlace(place, placeTypeForSector('ristoranti'));
  assert.equal(verdict.kind, OUTCOME.hostedProfile);
  // Nessuno score: la categoria non è un punteggio basso.
  assert.equal(verdict.score, undefined);
});

test('16. la forma dell\'URL da profilo basta anche su domini sconosciuti', () => {
  assert.match(hostedProfileReason('https://piattaformaignota.it/listing/osteria-x'), /profilo/);
  assert.equal(hostedProfileReason('https://osteriapiega.it/menu/pesce'), null);
  // Serve un segmento dopo il contenitore: /stand/ da solo non è un profilo.
  assert.equal(hostedProfileReason('https://esempio.it/stand/'), null);
});

test('17. eatbu non viene scartato: i sottodomini sono micrositi veri', () => {
  const place = {
    id: 'p-eatbu',
    displayName: { text: 'Ristorante Da Pietro' },
    websiteUri: 'https://dapietro.eatbu.com',
    primaryType: 'restaurant',
    types: ['restaurant'],
  };
  assert.equal(classifyPlace(place, RISTORANTE).kind, OUTCOME.ok);
  assert.equal(hostedProfileReason('https://dapietro.eatbu.com'), null);
});

test('18. goo.gl non viene sottoposto allo scoring della pagina intermediaria', () => {
  const place = {
    id: 'p-short',
    displayName: { text: 'Pizzeria Vesuvio' },
    websiteUri: 'https://goo.gl/maps/abc123',
    primaryType: 'restaurant',
    types: ['restaurant'],
  };
  const verdict = classifyPlace(place, RISTORANTE);
  assert.equal(verdict.kind, OUTCOME.hostedProfile);
  assert.match(verdict.reason, /accorciatore/);
});

test('19. i termini generici da soli non confermano un\'identità', () => {
  // "Ristorante" compare in entrambi i nomi ma non distingue nulla.
  assert.deepEqual(identityTokens('Ristorante Il Grillo'), ['grillo']);
  assert.equal(identityLooksConsistent('Ristorante Il Grillo', 'Ristorante Da Pietro', 'https://dapietro.it'), false);
});

test('20. senza nome da Google non si dichiara incoerenza', () => {
  assert.equal(identityLooksConsistent('', 'Qualsiasi Nome', 'https://esempio.it'), true);
});

/* --- Deduplica dei contatti ----------------------------------------------- */

test('21. la stessa email in forme equivalenti conta una volta sola', () => {
  // Caso reale: l'indirizzo compariva nel mailto: e nel testo con maiuscole
  // diverse, e finiva due volte nello stesso record.
  const html = `
    <a href="mailto:SaleEPepeSassari@Gmail.com">scrivici</a>
    <p>Scrivi a saleepepesassari@gmail.com oppure passa a trovarci.</p>
    <span> SALEEPEPESASSARI@GMAIL.COM </span>
  `;
  assert.deepEqual(extractEmails(html), ['saleepepesassari@gmail.com']);
});

/* --- Presenza digitale e opportunità commerciale --------------------------
 *
 * Il punteggio tecnico misura la salute di un sito; l'opportunità misura quanto
 * quell'attività ci interessa. Su dieci ristoranti reali a Sassari il primo
 * indicatore qualificava zero prospect, mentre metà del campione non aveva un
 * sito proprio: sono due domande diverse e vanno tenute separate.
 */

test('23. senza sito: presenza no_website e opportunità molto alta', () => {
  const { presence } = presenceTypeFor(placeOf({ displayName: { text: 'Ristorante Da Pietro' } }), RISTORANTE);
  assert.equal(presence, PRESENCE.noWebsite);
  assert.equal(opportunityScore(presence), 95);
  assert.equal(isCommerciallyQualified(presence, opportunityScore(presence)), true);
});

test('24. solo social: presenza social_only e opportunità molto alta', () => {
  const { presence } = presenceTypeFor(placeOf({ websiteUri: 'https://www.facebook.com/tizio' }), RISTORANTE);
  assert.equal(presence, PRESENCE.socialOnly);
  assert.equal(opportunityScore(presence), 90);
  assert.equal(isCommerciallyQualified(presence, 90), true);
});

test('25. eatbu: microsito, quindi hosted_site e opportunità alta', () => {
  const { presence } = presenceTypeFor(placeOf({ websiteUri: 'https://trattorialoluda.eatbu.com' }), RISTORANTE);
  assert.equal(presence, PRESENCE.hostedSite);
  assert.equal(opportunityScore(presence), 80);
  assert.equal(isCommerciallyQualified(presence, 80), true);
  // Il dominio nudo della piattaforma non è un microsito di nessuno.
  assert.equal(isHostedSiteHost('https://eatbu.com'), false);
  assert.equal(isHostedSiteHost('https://trattorialoluda.eatbu.com'), true);
});

test('26. wirePlaza: pagina di terzi, opportunità coerente ma distinta dal microsito', () => {
  const { presence } = presenceTypeFor(
    placeOf({ displayName: { text: 'Osteria Piega' }, websiteUri: 'https://wireplaza.com/stand/osteriapiega' }),
    RISTORANTE,
  );
  assert.equal(presence, PRESENCE.thirdPartyPage);
  assert.equal(opportunityScore(presence), 75);
  assert.equal(isCommerciallyQualified(presence, 75), true);
});

test('27. sito proprio tecnicamente sano: opportunità bassa, non qualificato', () => {
  const { presence } = presenceTypeFor(placeOf({ websiteUri: 'https://lamaisonsassari.it' }), RISTORANTE);
  assert.equal(presence, PRESENCE.ownedSite);
  // 30 = nessun problema rilevato: non c'è nulla da vendergli.
  assert.equal(opportunityScore(presence, 30), 0);
  assert.equal(isCommerciallyQualified(presence, 0), false);
  // 40 = un solo problema: resta ampiamente sotto soglia.
  assert.equal(opportunityScore(presence, 40), 14);
  assert.equal(isCommerciallyQualified(presence, 14), false);
});

test('28. sito proprio tecnicamente debole: opportunità alta e qualificato', () => {
  const presence = PRESENCE.ownedSite;
  assert.equal(opportunityScore(presence, 80), 71); // cinque problemi su sette
  assert.equal(isCommerciallyQualified(presence, 71), true);
  assert.equal(opportunityScore(presence, 100), 100);
  assert.equal(isCommerciallyQualified(presence, 100), true);
});

test('29. non pertinente: opportunità nulla e mai qualificabile', () => {
  const { presence } = presenceTypeFor(
    placeOf({ primaryType: 'telecommunications_service_provider', types: ['telecommunications_service_provider'] }),
    RISTORANTE,
  );
  assert.equal(presence, PRESENCE.nonPertinente);
  assert.equal(opportunityScore(presence), 0);
  assert.equal(isCommerciallyQualified(presence, 0), false);
  // Nemmeno un punteggio alto per errore lo renderebbe salvabile.
  assert.equal(isCommerciallyQualified(presence, 99), false);
});

test('30. punteggio tecnico e opportunità restano due scale distinte', () => {
  // Stesso technical score, opportunità diverse a seconda della presenza.
  assert.equal(opportunityScore(PRESENCE.ownedSite, 30), 0);
  assert.equal(opportunityScore(PRESENCE.hostedSite, 30), 80);
  // E viceversa: la presenza senza pagina non ha punteggio tecnico da leggere.
  assert.equal(opportunityScore(PRESENCE.noWebsite, undefined), 95);
  assert.equal(opportunityForOwnedSite(undefined), 0);
});

test('31. la soglia commerciale separa i due mondi al punto giusto', () => {
  assert.equal(QUALIFIED_OPPORTUNITY_SCORE, 70);
  // Tutte le presenze non autonome stanno sopra.
  for (const presence of [PRESENCE.noWebsite, PRESENCE.socialOnly, PRESENCE.hostedSite, PRESENCE.thirdPartyPage]) {
    assert.equal(isCommerciallyQualified(presence, opportunityScore(presence)), true, presence);
  }
  // Un sito proprio qualifica solo da un punteggio tecnico di 79 in su.
  assert.equal(isCommerciallyQualified(PRESENCE.ownedSite, opportunityForOwnedSite(78)), false);
  assert.equal(isCommerciallyQualified(PRESENCE.ownedSite, opportunityForOwnedSite(79)), true);
});

test('32. solo i record commercialmente qualificati passano il gate di salvataggio', () => {
  // Ogni risultato di Places ha un id: è la condizione normale.
  const righe = [
    { nome: 'senza sito', presence: PRESENCE.noWebsite, opportunityScore: 95, technicalScore: null, placeId: 'ChIJ1', atteso: true },
    { nome: 'solo social', presence: PRESENCE.socialOnly, opportunityScore: 90, technicalScore: null, placeId: 'ChIJ2', atteso: true },
    { nome: 'microsito con contatti', presence: PRESENCE.hostedSite, opportunityScore: 80, technicalScore: 40, emails: ['a@b.it'], placeId: 'ChIJ3', atteso: true },
    { nome: 'pagina di terzi', presence: PRESENCE.thirdPartyPage, opportunityScore: 75, technicalScore: null, placeId: 'ChIJ4', atteso: true },
    { nome: 'sito sano', presence: PRESENCE.ownedSite, opportunityScore: 0, technicalScore: 30, emails: ['a@b.it'], placeId: 'ChIJ5', atteso: false },
    { nome: 'sito debole con contatti', presence: PRESENCE.ownedSite, opportunityScore: 71, technicalScore: 80, phones: ['+39079111111'], placeId: 'ChIJ6', atteso: true },
    { nome: 'non pertinente', presence: PRESENCE.nonPertinente, opportunityScore: 0, technicalScore: null, placeId: 'ChIJ7', atteso: false },
  ];

  for (const riga of righe) {
    assert.equal(qualifiesForSave(riga).ok, riga.atteso, riga.nome);
  }
});

test('33. senza recapito ma con Place ID il prospect resta salvabile', () => {
  // Un'opportunità valida non si annulla per un contatto mancante: la scheda
  // Google resta rintracciabile e il recapito si cerca a mano in revisione.
  const riga = {
    presence: PRESENCE.ownedSite,
    opportunityScore: 85,
    technicalScore: 90,
    emails: [],
    phones: [],
    placeId: 'ChIJabc',
  };
  const gate = qualifiesForSave(riga);
  assert.equal(gate.ok, true);
  assert.equal(gate.needsContact, true, 'la mancanza di recapito deve restare segnalata');
});

test('33b. senza recapito e senza Place ID non resta nulla da ritrovare', () => {
  const riga = { presence: PRESENCE.ownedSite, opportunityScore: 85, technicalScore: 90, emails: [], phones: [] };
  const gate = qualifiesForSave(riga);
  assert.equal(gate.ok, false);
  assert.equal(gate.reason, 'nessun contatto');
});

test('34. a chi non ha una pagina non si chiedono i recapiti', () => {
  // Senza questa eccezione i prospect migliori — quelli senza sito — sarebbero
  // esclusi proprio perché non c'è una pagina da cui leggere un indirizzo.
  const riga = {
    presence: PRESENCE.noWebsite,
    opportunityScore: 95,
    technicalScore: null,
    emails: [],
    phones: [],
    placeId: 'ChIJxyz',
  };
  const gate = qualifiesForSave(riga);
  assert.equal(gate.ok, true);
  assert.equal(gate.needsContact, true);
});

test('34b. con un recapito il flag non scatta', () => {
  const riga = { presence: PRESENCE.socialOnly, opportunityScore: 90, phones: ['079123456'], placeId: 'ChIJ1' };
  assert.deepEqual(qualifiesForSave(riga), { ok: true, needsContact: false });
});

/* --- Telefoni: fonte Google e fonte sito ---------------------------------- */

test('35. la stessa utenza in formati diversi conta una volta sola', () => {
  // Il sito scrive il numero in formato internazionale, Google in nazionale.
  assert.deepEqual(mergePhones(['+39079111111'], ['079 111111']), ['+39079111111']);
  assert.deepEqual(mergePhones([], ['079 111111']), ['079111111']);
  assert.deepEqual(mergePhones(['+393401234567'], ['3401234567']), ['+393401234567']);
});

test('36. numeri diversi restano entrambi, nell\'ordine di preferenza', () => {
  assert.deepEqual(mergePhones(['079111111'], ['079222222']), ['079111111', '079222222']);
});

test('37. i frammenti troppo corti non diventano recapiti', () => {
  assert.deepEqual(mergePhones(['123'], ['']), []);
  assert.deepEqual(mergePhones([], []), []);
});

test('38. la chiave di confronto toglie il prefisso solo quando ha senso', () => {
  assert.equal(phoneKey('+39 079 111111'), phoneKey('079 111111'));
  // Un numero che comincia per 39 ma è corto non va accorciato.
  assert.equal(phoneKey('390123456'), '390123456');
});

test('22. indirizzi diversi restano distinti e i placeholder restano esclusi', () => {
  const html = `
    <a href="mailto:info@osteria.it">info</a>
    <a href="mailto:prenotazioni@osteria.it">prenota</a>
    <a href="mailto:test@example.com">ignorami</a>
  `;
  assert.deepEqual(extractEmails(html), ['info@osteria.it', 'prenotazioni@osteria.it']);
});
