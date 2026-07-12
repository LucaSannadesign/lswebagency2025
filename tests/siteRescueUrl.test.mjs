// Test permanente e minimale per src/lib/siteRescueUrl.ts.
// Runner nativo, nessuna dipendenza. Esecuzione (Node 22.x/23.x):
//   node --experimental-strip-types --test tests/siteRescueUrl.test.mjs
//   (oppure: npm run test:unit)
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSiteRescueUrl } from '../src/lib/siteRescueUrl.ts';

test('URL https valido è accettato e normalizzato', () => {
  assert.equal(validateSiteRescueUrl('https://esempio.it'), 'https://esempio.it/');
});

test('dominio nudo viene normalizzato in https', () => {
  assert.equal(validateSiteRescueUrl('esempio.it'), 'https://esempio.it/');
  assert.equal(validateSiteRescueUrl('www.esempio.it/path'), 'https://www.esempio.it/path');
});

test('rifiuta localhost e localhost. (trailing dot)', () => {
  assert.equal(validateSiteRescueUrl('http://localhost'), null);
  assert.equal(validateSiteRescueUrl('http://localhost.'), null);
  assert.equal(validateSiteRescueUrl('localhost:3000'), null);
});

test('rifiuta IPv4 letterale', () => {
  assert.equal(validateSiteRescueUrl('http://127.0.0.1'), null);
  assert.equal(validateSiteRescueUrl('http://192.168.1.10'), null);
  assert.equal(validateSiteRescueUrl('http://169.254.169.254'), null);
});

test('rifiuta IPv6 letterale', () => {
  assert.equal(validateSiteRescueUrl('http://[::1]'), null);
  assert.equal(validateSiteRescueUrl('http://[fe80::1]'), null);
});

test('rifiuta suffissi locali, anche con punto finale', () => {
  assert.equal(validateSiteRescueUrl('http://server.local'), null);
  assert.equal(validateSiteRescueUrl('http://server.local.'), null);
  assert.equal(validateSiteRescueUrl('http://router.internal'), null);
  assert.equal(validateSiteRescueUrl('http://router.internal.'), null);
  assert.equal(validateSiteRescueUrl('http://nas.lan'), null);
  assert.equal(validateSiteRescueUrl('http://nas.lan.'), null);
  assert.equal(validateSiteRescueUrl('http://casa.home'), null);
  assert.equal(validateSiteRescueUrl('http://casa.home.'), null);
  assert.equal(validateSiteRescueUrl('http://app.localhost'), null);
});

test('rifiuta porte non standard e ammette 80/443', () => {
  assert.equal(validateSiteRescueUrl('http://esempio.it:8080'), null);
  assert.equal(validateSiteRescueUrl('https://esempio.it:3000'), null);
  assert.equal(validateSiteRescueUrl('http://esempio.it:80'), 'http://esempio.it/');
  assert.equal(validateSiteRescueUrl('https://esempio.it:443'), 'https://esempio.it/');
});

test('rifiuta username/password nell’URL', () => {
  assert.equal(validateSiteRescueUrl('https://user:pass@esempio.it'), null);
  assert.equal(validateSiteRescueUrl('https://user@esempio.it'), null);
});

test('rifiuta protocolli diversi da http/https', () => {
  assert.equal(validateSiteRescueUrl('ftp://esempio.it'), null);
  assert.equal(validateSiteRescueUrl('javascript:alert(1)'), null);
  assert.equal(validateSiteRescueUrl('mailto:info@esempio.it'), null);
});

test('dominio pubblico con punto finale è ACCETTATO e normalizzato', () => {
  // Regola scelta: il trailing dot su un dominio pubblico viene rimosso (normalizzato).
  assert.equal(validateSiteRescueUrl('https://example.com.'), 'https://example.com/');
  assert.equal(validateSiteRescueUrl('example.com.'), 'https://example.com/');
});

test('rifiuta input vuoto / non stringa / senza punto', () => {
  assert.equal(validateSiteRescueUrl(''), null);
  assert.equal(validateSiteRescueUrl('   '), null);
  assert.equal(validateSiteRescueUrl(undefined), null);
  assert.equal(validateSiteRescueUrl(123), null);
  assert.equal(validateSiteRescueUrl('intranet'), null);
});
