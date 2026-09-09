// Test permanente sul binding dei form di contatto.
//
// Il funnel lead si era rotto in modo silenzioso: con ClientRouter attivo la
// navigazione client-side sostituisce il DOM senza rieseguire gli script di
// modulo, quindi il form arrivava in pagina senza handler e l'invio non
// partiva. Questi test bloccano la regressione a livello di sorgente, dove il
// problema è verificabile senza un DOM reale.
//
// Esecuzione (Node 22.x):
//   node --experimental-strip-types --test tests/formHandlerBinding.test.mjs
//   (oppure: npm run test:unit)
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function source(relativePath) {
  return readFileSync(fileURLToPath(new URL(`../${relativePath}`, import.meta.url)), 'utf8');
}

const HOME = source('src/pages/index.astro');
const CONTATTI = source('src/pages/contatti.astro');
const FORM_COMPONENT = source('src/components/ui/Form.astro');

const SURFACES = [
  { name: 'home (src/pages/index.astro)', code: HOME, init: 'attachContactFormHandler' },
  { name: 'contatti (src/pages/contatti.astro)', code: CONTATTI, init: 'initContactForm' },
  { name: 'componente Form (src/components/ui/Form.astro)', code: FORM_COMPONENT, init: 'attachContactFormHandler' },
];

// --- 1. Lifecycle astro:page-load -------------------------------------------

for (const surface of SURFACES) {
  test(`lifecycle: ${surface.name} inizializza il form su astro:page-load`, () => {
    assert.match(
      surface.code,
      new RegExp(`addEventListener\\(\\s*'astro:page-load'\\s*,\\s*${surface.init}\\s*\\)`),
      'manca la registrazione su astro:page-load: dopo una navigazione client-side il form resta senza handler'
    );
  });

  test(`lifecycle: ${surface.name} mantiene il fallback sul primo caricamento`, () => {
    assert.match(
      surface.code,
      new RegExp(`addEventListener\\(\\s*'DOMContentLoaded'\\s*,\\s*${surface.init}\\s*\\)`),
      'manca il fallback DOMContentLoaded per il caricamento diretto della pagina'
    );
    assert.ok(
      surface.code.includes("document.readyState === 'loading'"),
      'manca il controllo su readyState: lo script può essere valutato a DOM già pronto'
    );
  });

  test(`lifecycle: ${surface.name} ha la guardia contro il doppio binding`, () => {
    assert.ok(
      surface.code.includes("form.dataset.contactFetchBound === '1'"),
      'manca la guardia: una seconda inizializzazione registrerebbe un secondo submit'
    );
    assert.ok(
      surface.code.includes("form.dataset.contactFetchBound = '1'"),
      'la guardia non viene mai marcata come attiva'
    );
  });
}

test('lifecycle: la guardia precede la registrazione del listener submit', () => {
  for (const surface of SURFACES) {
    const guardAt = surface.code.indexOf("form.dataset.contactFetchBound = '1'");
    const submitAt = surface.code.indexOf("addEventListener('submit'");
    assert.ok(guardAt > -1, `${surface.name}: guardia assente`);
    assert.ok(submitAt > -1, `${surface.name}: listener submit assente`);
    assert.ok(
      guardAt < submitAt,
      `${surface.name}: la guardia deve essere valutata prima di registrare il submit`
    );
  }
});

// --- 2. Campi strutturati ----------------------------------------------------

test('campi strutturati: la home invia phone come campo dedicato', () => {
  assert.match(
    HOME,
    /phone:\s*String\(formData\.get\('phone'\)\s*\|\|\s*''\)/,
    'il telefono deve essere un campo del payload, non testo dentro al messaggio'
  );
});

test('campi strutturati: la home non nasconde più il telefono nel messaggio', () => {
  assert.ok(
    !/lines\.push\(`Telefono:/.test(HOME),
    'il telefono non deve essere concatenato nel corpo del messaggio: nel CRM finiva fuori dalla colonna phone'
  );
});

test('campi strutturati: la home invia il servizio di interesse come campo dedicato', () => {
  // `service` è la chiave letta da /api/contatti e mappata su `service_interest`
  // nella tabella leads.
  assert.match(
    HOME,
    /service:\s*String\(formData\.get\('need'\)\s*\|\|\s*''\)/,
    'la selezione "Di cosa hai bisogno?" deve viaggiare come campo strutturato'
  );
  assert.match(
    source('src/pages/api/contatti.ts'),
    /service_interest:\s*serviceInterest/,
    'il campo service deve restare mappato su service_interest nel CRM'
  );
});

test('campi strutturati: la home mostra message e fields restituiti dall’API', () => {
  assert.ok(HOME.includes('function describeError('), 'manca la lettura degli errori restituiti dall’API');
  assert.ok(HOME.includes('body.fields'), 'gli errori per singolo campo non vengono mostrati all’utente');
});

// --- 3. Campi obbligatori sulla home ----------------------------------------

const REQUIRED_FIELDS = [
  { label: 'nome', marker: 'name="name"' },
  { label: 'email', marker: 'name="email"' },
  { label: 'messaggio', marker: 'name="message"' },
  { label: 'privacy', marker: 'name="disclaimer"' },
];

for (const field of REQUIRED_FIELDS) {
  test(`required: il campo ${field.label} della home è obbligatorio`, () => {
    const at = HOME.indexOf(field.marker);
    assert.ok(at > -1, `campo ${field.label} non trovato nel form della home`);
    // Il blocco dell'elemento termina sulla prima parentesi angolare di chiusura.
    const block = HOME.slice(at, HOME.indexOf('>', at));
    assert.match(
      block,
      /\brequired\b/,
      `il campo ${field.label} deve essere obbligatorio anche lato browser`
    );
  });
}
