// Test permanente per src/lib/leadAuditLink.ts.
// Nessun database reale: il client Supabase è sostituito da un fake minimale.
// Esecuzione (Node 22.x/23.x):
//   node --experimental-strip-types --test tests/leadAuditLink.test.mjs
//   (oppure: npm run test:unit)
import test from 'node:test';
import assert from 'node:assert/strict';
import { linkLeadToAudit } from '../src/lib/leadAuditLink.ts';

function fakeClient(result, capture = {}) {
  return {
    from(table) {
      capture.table = table;
      return {
        insert(values) {
          capture.values = values;
          return Promise.resolve(result);
        },
      };
    },
  };
}

test('insert riuscito → collegato, sulla tabella ponte con la coppia di id', async () => {
  const capture = {};
  const res = await linkLeadToAudit(fakeClient({ error: null }, capture), 'lead-1', 'audit-1');
  assert.equal(res.outcome, 'collegato');
  assert.equal(res.errorMessage, undefined);
  assert.equal(capture.table, 'lead_site_audits');
  assert.deepEqual(capture.values, { lead_id: 'lead-1', audit_id: 'audit-1' });
});

test('violazione PK composta (23505) → gia_collegato, senza errore da loggare', async () => {
  const res = await linkLeadToAudit(
    fakeClient({ error: { code: '23505', message: 'duplicate key value violates unique constraint' } }),
    'lead-1',
    'audit-1',
  );
  assert.equal(res.outcome, 'gia_collegato');
  assert.equal(res.errorMessage, undefined);
});

test('altro errore PostgREST → non_collegato con messaggio (non mascherato)', async () => {
  const res = await linkLeadToAudit(
    fakeClient({ error: { code: '42501', message: 'permission denied' } }),
    'lead-1',
    'audit-1',
  );
  assert.equal(res.outcome, 'non_collegato');
  assert.equal(res.errorMessage, 'permission denied');
});

test('eccezione del client → non_collegato, la funzione non lancia mai', async () => {
  const throwing = {
    from() {
      return {
        insert() {
          return Promise.reject(new Error('network down'));
        },
      };
    },
  };
  const res = await linkLeadToAudit(throwing, 'lead-1', 'audit-1');
  assert.equal(res.outcome, 'non_collegato');
  assert.equal(res.errorMessage, 'network down');
});
