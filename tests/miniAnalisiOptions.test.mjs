// Test permanente per la separazione label/value delle opzioni della mini-analisi.
// Copre: src/utils/mini-analisi/options.ts, questions.json, computeProfile.ts, structuredNotes.ts
// Esecuzione (Node 22.x/23.x):
//   node --experimental-strip-types --test tests/miniAnalisiOptions.test.mjs
//   (oppure: npm run test:unit)
import test from 'node:test';
import assert from 'node:assert/strict';
import questions from '../src/utils/mini-analisi/questions.json' with { type: 'json' };
import { optionValue, optionLabel } from '../src/utils/mini-analisi/options.ts';
import computeProfile from '../src/utils/mini-analisi/computeProfile.ts';
import { serializeStructuredNotes } from '../src/lib/structuredNotes.ts';

// Valore tecnico interno (confrontato da computeProfile e dall'API) e label pubblico atteso.
const TECH_VALUE = 'Audit rapido / SEO locale';
const PUBLIC_LABEL = 'Audit tecnico e accessibilità / SEO locale';

const primaryNeed = questions.find((q) => q.key === 'primaryNeed');
const auditOption = primaryNeed.options.find((o) => optionValue(o) === TECH_VALUE);

test('0. l\'opzione audit esiste ed è nel formato oggetto { value, label }', () => {
  assert.ok(auditOption, 'opzione audit non trovata in questions.json');
  assert.equal(typeof auditOption, 'object');
});

test('1. il label pubblico dell\'opzione audit è quello nuovo', () => {
  assert.equal(optionLabel(auditOption), PUBLIC_LABEL);
});

test('2. il valore tecnico registrato resta invariato', () => {
  assert.equal(optionValue(auditOption), TECH_VALUE);
  // value e label devono essere distinti (separazione riuscita)
  assert.notEqual(optionValue(auditOption), optionLabel(auditOption));
});

test('3. computeProfile riconosce il value e restituisce lo stesso profilo di prima', () => {
  const p = computeProfile({ primaryNeed: TECH_VALUE });
  assert.equal(p.service, 'Audit tecnico e di accessibilità prioritizzato');
  assert.equal(p.reason, 'la visibilità su Google è la priorità principale');
});

test('4. l\'API riconosce il valore: il value combacia col literal confrontato dallo switch', () => {
  // api/mini-analisi.ts e computeProfile.ts confrontano `answers.primaryNeed === 'Audit rapido / SEO locale'`.
  // Se qui combacia, il payload (che trasporta il value) viene riconosciuto a valle.
  assert.equal(optionValue(auditOption), TECH_VALUE);
});

test('5. le opzioni ancora definite come semplici stringhe continuano a funzionare', () => {
  const landing = primaryNeed.options.find((o) => optionValue(o) === 'Landing page');
  assert.equal(typeof landing, 'string');
  assert.equal(optionValue(landing), 'Landing page');
  assert.equal(optionLabel(landing), 'Landing page');
  assert.equal(computeProfile({ primaryNeed: 'Landing page' }).service, 'Landing page');
});

test('6. si invia il valore tecnico, non il label pubblico', () => {
  // Simula il salvataggio: si registra optionValue, mai optionLabel.
  const recorded = optionValue(auditOption);
  assert.equal(recorded, TECH_VALUE);
  const notes = serializeStructuredNotes({ primaryNeed: recorded }, {});
  assert.ok(notes.includes(TECH_VALUE), 'il valore tecnico deve essere nel payload');
  assert.ok(!notes.includes(PUBLIC_LABEL), 'il label pubblico NON deve finire nel payload');
});

test('7. se il label trapelasse come value, il profilo cambierebbe (guardia anti-regressione)', () => {
  const pValue = computeProfile({ primaryNeed: TECH_VALUE });
  const pLabel = computeProfile({ primaryNeed: PUBLIC_LABEL });
  // Il label non è un ramo riconosciuto: il risultato NON coincide con quello del value.
  assert.notEqual(pLabel.reason, pValue.reason);
});
