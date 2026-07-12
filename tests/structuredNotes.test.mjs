// Test permanente per src/lib/structuredNotes.ts.
// Runner nativo, nessuna dipendenza. Esecuzione (Node 22.x/23.x):
//   node --experimental-strip-types --test tests/structuredNotes.test.mjs
//   (oppure: npm run test:unit)
import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeStructuredNotes, MAX_STRUCTURED_NOTES_LEN } from '../src/lib/structuredNotes.ts';

test('A: JSON completo entro il limite → { answers, summary }', () => {
  const answers = { siteStatus: 'Parto da zero', urgency: 'Entro 1 mese' };
  const summary = { service: 'Sito vetrina', level: 'base' };
  const out = serializeStructuredNotes(answers, summary);
  assert.equal(out, JSON.stringify({ answers, summary }));
  assert.ok(out.length <= MAX_STRUCTURED_NOTES_LEN);
});

test('B: completo troppo lungo ma { answers } entro il limite → { answers }', () => {
  const answers = { a: 'x'.repeat(50) };
  const summary = { s: 'y'.repeat(300) };
  // Limite scelto tra la lunghezza della versione ridotta e quella completa.
  const limit = JSON.stringify({ answers }).length + 10;
  assert.ok(JSON.stringify({ answers, summary }).length > limit);
  const out = serializeStructuredNotes(answers, summary, limit);
  assert.equal(out, JSON.stringify({ answers }));
});

test('C: anche { answers } troppo lungo → null (blocco omesso)', () => {
  const out = serializeStructuredNotes({ a: 'x'.repeat(100) }, { s: 1 }, 20);
  assert.equal(out, null);
});

test('D: risultato sempre parsabile con JSON.parse quando non è null', () => {
  const cases = [
    [{ a: 1 }, { b: 2 }, MAX_STRUCTURED_NOTES_LEN],
    [{ a: 'x'.repeat(30) }, { b: 'y'.repeat(500) }, 100], // degrada ad { answers }
    [{ a: 'à "quote" \n newline' }, { b: '€' }, MAX_STRUCTURED_NOTES_LEN],
    [{ a: 'x'.repeat(100) }, { b: 1 }, 20], // null: nessuna versione entra
  ];
  for (const [answers, summary, limit] of cases) {
    const out = serializeStructuredNotes(answers, summary, limit);
    if (out !== null) {
      assert.doesNotThrow(() => JSON.parse(out));
      assert.ok(out.length <= limit);
    }
  }
});

test('E: nessuna mutazione degli oggetti originali', () => {
  const answers = { a: '1', nested: { k: 'v' } };
  const summary = { s: '2', list: [1, 2, 3] };
  const answersCopy = structuredClone(answers);
  const summaryCopy = structuredClone(summary);
  serializeStructuredNotes(answers, summary); // percorso completo
  serializeStructuredNotes(answers, summary, 30); // percorso degradato
  serializeStructuredNotes(answers, summary, 1); // percorso null
  assert.deepEqual(answers, answersCopy);
  assert.deepEqual(summary, summaryCopy);
});
