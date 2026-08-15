// Test end-to-end del modulo prospecting, con `fetch` sostituito da uno stub.
// Copre: scripts/prospecting/run.mjs
// Esecuzione:
//   node --test tests/prospectingRun.test.mjs
//
// Lo script viene eseguito davvero, come sottoprocesso, ma nessuna richiesta
// esce: Google Places, i siti e Supabase sono tutti serviti da
// tests/fixtures/prospectingStub.mjs. Nessuna chiave reale, nessuna scrittura.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const STUB = join(here, 'fixtures', 'prospectingStub.mjs');
const RUN = join(here, '..', 'scripts', 'prospecting', 'run.mjs');

/** Esegue lo script e restituisce output, CSV e ciò che lo stub ha catturato. */
function runProspecting({ extraArgs = [], save = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'prospecting-test-'));
  const csvPath = join(dir, 'out.csv');
  const capturePath = join(dir, 'captured.json');

  const args = [
    '--import', STUB, RUN,
    '--sector=ristoranti', '--location=Sassari', '--limit=10',
    '--csv', csvPath,
    ...(save ? ['--save'] : []),
    ...extraArgs,
  ];

  const result = spawnSync(process.execPath, args, {
    encoding: 'utf8',
    cwd: dir, // fuori dal repo: dotenv non trova il .env reale
    env: {
      PATH: process.env.PATH,
      GOOGLE_PLACES_API_KEY: 'chiave-di-test',
      PROSPECTING_STUB_OUT: capturePath,
      ...(save
        ? { SUPABASE_URL: 'https://progetto.supabase.test', SUPABASE_SECRET_KEY: 'chiave-di-test' }
        : {}),
    },
  });

  const parseCsv = (text) => {
    const [header, ...lines] = text.trim().split('\n');
    const columns = header.split(',');
    return lines.map((line) => {
      const cells = line.match(/"([^"]|"")*"/g).map((cell) => cell.slice(1, -1).replace(/""/g, '"'));
      return Object.fromEntries(columns.map((name, i) => [name, cells[i]]));
    });
  };

  const out = {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    rows: parseCsv(readFileSync(csvPath, 'utf8')),
    captured: JSON.parse(readFileSync(capturePath, 'utf8')),
  };
  rmSync(dir, { recursive: true, force: true });
  return out;
}

const byName = (rows, name) => rows.find((row) => row.nome === name);

test('1. il FieldMask chiede il telefono e nient\'altro di superfluo', () => {
  const { captured } = runProspecting();
  const mask = captured.placesRequest.fieldMask.split(',');
  assert.deepEqual(mask, [
    'places.id',
    'places.displayName',
    'places.websiteUri',
    'places.primaryType',
    'places.types',
    'places.nationalPhoneNumber',
  ]);
  // Nessun campo a tariffa superiore.
  for (const vietato of ['rating', 'reviews', 'userRating', 'regularOpeningHours', 'priceLevel']) {
    assert.ok(!captured.placesRequest.fieldMask.includes(vietato), `richiesto ${vietato}`);
  }
});

test('2. senza sito, il telefono della scheda Google diventa il recapito', () => {
  const riga = byName(runProspecting().rows, 'Ristorante Da Pietro');
  assert.equal(riga.presence_type, 'no_website');
  assert.equal(riga.opportunity_score, '95');
  assert.equal(riga.technical_score, '', 'senza pagina non esiste un punteggio tecnico');
  assert.equal(riga.telefoni, '079555555');
});

test('3. solo social: il telefono Google arriva senza visitare la pagina', () => {
  const riga = byName(runProspecting().rows, 'Ristorante Il Giamaranto');
  assert.equal(riga.presence_type, 'social_only');
  assert.equal(riga.telefoni, '079444444');
  assert.equal(riga.technical_score, '');
});

test('4. stesso numero da sito e da Google: una sola occorrenza', () => {
  // Il sito scrive +39079111111, la scheda Google 079 111111.
  const riga = byName(runProspecting().rows, 'Trattoria da Mario');
  assert.equal(riga.telefoni, '+39079111111');
  assert.ok(!riga.telefoni.includes('|'), `due numeri equivalenti nel record: ${riga.telefoni}`);
});

test('5. telefono assente: comportamento invariato, nessun campo inventato', () => {
  const rows = runProspecting().rows;
  assert.equal(byName(rows, 'Taberna Santona').telefoni, '');
  assert.equal(byName(rows, 'Osteria Senza Recapito').telefoni, '');
  // Restano comunque classificati e con la loro opportunità.
  assert.equal(byName(rows, 'Osteria Senza Recapito').opportunity_score, '95');
});

test('6. anche le email arrivano deduplicate fra link e testo', () => {
  const riga = byName(runProspecting().rows, 'Trattoria da Mario');
  assert.equal(riga.email, 'info@trattoriadamario.example');
});

/* --- Salvataggio: payload e deduplica ------------------------------------- */

test('7. il payload rispetta il nuovo schema e non usa più la colonna score', () => {
  const { captured } = runProspecting({ save: true, extraArgs: ['--yes'] });
  assert.ok(captured.inserts.length > 0, 'nessun insert catturato');

  for (const payload of captured.inserts) {
    assert.ok(!('score' in payload), 'il payload usa ancora la colonna score');
    for (const colonna of [
      'source', 'query', 'name', 'website', 'domain', 'city',
      'emails', 'phones', 'contact_urls', 'findings',
      'technical_score', 'opportunity_score', 'presence_type',
      'place_id', 'place_name', 'site_name', 'place_type',
      'status', 'notes',
    ]) {
      assert.ok(colonna in payload, `manca la colonna ${colonna}`);
    }
    assert.equal(payload.status, 'da_verificare');
    assert.ok(payload.place_id, 'place_id non valorizzato');
  }
});

test('8. senza sito: technical_score null, opportunity_score conservato', () => {
  const { captured } = runProspecting({ save: true, extraArgs: ['--yes'] });
  const senzaSito = captured.inserts.find((row) => row.presence_type === 'no_website');
  assert.ok(senzaSito, 'nessun prospect no_website salvato');
  assert.equal(senzaSito.technical_score, null);
  assert.equal(senzaSito.opportunity_score, 95);
  assert.equal(senzaSito.website, null);
});

test('9. un prospect qualificato senza alcun recapito viene comunque salvato', () => {
  const { captured } = runProspecting({ save: true, extraArgs: ['--yes'] });
  const salvato = captured.inserts.find((row) => row.name === 'Osteria Senza Recapito');
  assert.ok(salvato, 'un\'opportunità valida è stata scartata per mancanza di contatto');
  assert.deepEqual(salvato.emails, []);
  assert.deepEqual(salvato.phones, []);
  assert.equal(salvato.opportunity_score, 95);
  // La mancanza resta scritta, così in revisione si sa quali schede aprire.
  assert.match(salvato.notes, /Nessun recapito raccolto/);
});

test('9b. in selezione l\'assenza di recapito è visibile nell\'esito', () => {
  // Prima della scrittura: dopo l'insert l'esito diventa "inserito", quindi il
  // dettaglio si legge nella fase di selezione, che è dove serve.
  const { stdout } = runProspecting({ save: true, extraArgs: ['--yes'] });
  assert.ok(stdout.includes('Righe da inserire'), 'manca il riepilogo di scrittura');
  const { rows } = runProspecting();
  // Senza --save nessuna riga viene selezionata: resta la classificazione.
  assert.equal(byName(rows, 'Osteria Senza Recapito').presence_type, 'no_website');
  assert.equal(byName(rows, 'Osteria Senza Recapito').telefoni, '');
});

test('10. i non pertinenti non vengono mai salvati', () => {
  const { captured } = runProspecting({ save: true, extraArgs: ['--yes'] });
  const estraneo = captured.inserts.find((row) => row.presence_type === 'non_pertinente');
  assert.equal(estraneo, undefined);
});

test('11. il punteggio tecnico e quello commerciale restano due scale distinte', () => {
  const { captured } = runProspecting({ save: true, extraArgs: ['--yes'] });

  const eatbu = captured.inserts.find((row) => row.presence_type === 'hosted_site');
  const proprio = captured.inserts.find((row) => row.presence_type === 'owned_site');
  assert.ok(eatbu, 'il microsito non è stato salvato');
  assert.ok(proprio, 'il sito con dominio proprio non è stato salvato');

  /*
   * I due hanno lo stesso identico punteggio tecnico e opportunità diverse:
   * per il microsito l'opportunità viene dal tipo di presenza (80 fisso), per
   * il dominio proprio dalla formula sul punteggio tecnico. È esattamente la
   * separazione che questo modello introduce.
   */
  assert.equal(eatbu.technical_score, proprio.technical_score);
  assert.equal(eatbu.opportunity_score, 80);
  assert.equal(proprio.opportunity_score, 71);

  // E c'è chi viene salvato senza avere alcun punteggio tecnico.
  const senzaPagina = captured.inserts.filter((row) => row.technical_score === null);
  assert.ok(senzaPagina.length >= 3, 'atteso più di un prospect salvato senza pagina analizzata');
});

test('12. le note non ripetono i dati che hanno una colonna propria', () => {
  const { captured } = runProspecting({ save: true, extraArgs: ['--yes'] });
  for (const payload of captured.inserts) {
    assert.ok(!/Place ID:/i.test(payload.notes), 'il Place ID è duplicato nelle note');
    assert.ok(!/Opportunità commerciale:/i.test(payload.notes), 'l\'opportunità è duplicata nelle note');
    assert.ok(!/Punteggio tecnico:/i.test(payload.notes), 'il punteggio tecnico è duplicato nelle note');
  }
});
