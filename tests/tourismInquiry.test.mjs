// Eseguire con: node --experimental-strip-types --test tests/tourismInquiry.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseTourismInquiry } from '../src/lib/tourismInquiry.ts';

function validForm(overrides = {}) {
  const values = {
    nome: 'Mario Rossi',
    struttura: 'Casa Marina',
    sito: 'https://example.org/alloggi',
    citta: 'Alghero',
    email: 'Mario.Rossi@Example.org',
    telefono: '+39 300 0000000',
    obiettivo: 'aumentare-richieste-dirette',
    messaggio: 'Vorrei migliorare le richieste dirette.',
    privacy: 'on',
    ...overrides,
  };
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value !== null) form.set(key, value);
  }
  return form;
}

test('richiesta valida: campi strutturati e normalizzati', () => {
  const result = parseTourismInquiry(validForm());
  assert.deepEqual(result.errors, []);
  assert.equal(result.honeypot, false);
  assert.equal(result.inquiry?.email, 'mario.rossi@example.org');
  assert.equal(result.inquiry?.struttura, 'Casa Marina');
  assert.equal(result.inquiry?.sito, 'https://example.org/alloggi');
});

test('privacy: informativa non confermata blocca la richiesta', () => {
  const result = parseTourismInquiry(validForm({ privacy: null }));
  assert.equal(result.inquiry, null);
  assert.match(result.errors.join(' '), /privacy/);
});

test('url: vieta protocolli e credenziali non sicuri', () => {
  for (const site of ['javascript:alert(1)', 'file:///etc/passwd', 'https://user:pass@example.org']) {
    const result = parseTourismInquiry(validForm({ sito: site }));
    assert.equal(result.inquiry, null, site);
    assert.match(result.errors.join(' '), /sito valido/);
  }
});

test('obiettivo: impedisce valori fuori dalla lista', () => {
  const result = parseTourismInquiry(validForm({ obiettivo: 'altro-valore' }));
  assert.equal(result.inquiry, null);
  assert.match(result.errors.join(' '), /obiettivo/);
});

test('messaggio eccessivo: rifiutato senza troncare silenziosamente', () => {
  const result = parseTourismInquiry(validForm({ messaggio: 'x'.repeat(4001) }));
  assert.equal(result.inquiry, null);
  assert.match(result.errors.join(' '), /lungo/);
});

test('honeypot: non produce lead né segnalazioni', () => {
  const result = parseTourismInquiry(validForm({ website_confirm: 'spam.example' }));
  assert.equal(result.honeypot, true);
  assert.equal(result.inquiry, null);
});

test('normalizza controllo e mantiene testo multilinea', () => {
  const result = parseTourismInquiry(validForm({
    nome: ' Mario\r\n Rossi ',
    messaggio: 'Prima riga\r\nSeconda riga',
  }));
  assert.equal(result.inquiry?.nome, 'Mario Rossi');
  assert.equal(result.inquiry?.messaggio, 'Prima riga\nSeconda riga');
});

test('binding landing: endpoint, honeypot e privacy obbligatoria', () => {
  const page = readFileSync(new URL('../src/pages/transizione-digitale-turismo.astro', import.meta.url), 'utf8');
  assert.match(page, /method="POST" action="\/api\/richieste-dirette"/);
  assert.match(page, /name="website_confirm"/);
  assert.match(page, /name="privacy"[^>]*required/);
  assert.match(page, /href="\/privacy"/);
});

test('solo notifica interna e mai email in anteprima', () => {
  const endpoint = readFileSync(new URL('../src/pages/api/richieste-dirette.ts', import.meta.url), 'utf8');
  assert.match(endpoint, /env\("VERCEL_ENV"\) !== "production"/);
  assert.match(endpoint, /to: \["info@lswebagency.com"\]/);
  assert.match(endpoint, /status: "nuovo"/);
  assert.match(endpoint, /return new Response\(null, \{ status: 303/);
});
