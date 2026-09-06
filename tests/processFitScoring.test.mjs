// Regressioni per Automation Fit Score.
// Esecuzione: node --experimental-strip-types --test tests/processFitScoring.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { computeFitResult } from '../src/utils/process-fit/scoring.ts';

const ideal = {
  frequency: 'daily',
  repeatability: 'same',
  data: 'structured',
  integration: 'api',
  exceptions: 'documented',
  owner: 'clear',
  measurement: 'baseline',
  risk: 'low',
};

test('scenario ideale -> GO 100/100', () => {
  const result = computeFitResult(ideal);
  assert.equal(result.score, 100);
  assert.equal(result.outcome, 'GO');
  assert.equal(result.blockers.length, 0);
});

test('scenario parzialmente pronto -> PREPARARE', () => {
  const result = computeFitResult({
    frequency: 'weekly',
    repeatability: 'mostly',
    data: 'email-sheets',
    integration: 'unknown',
    exceptions: 'partial',
    owner: 'shared',
    measurement: 'estimable',
    risk: 'medium',
  });
  assert.equal(result.score, 60);
  assert.equal(result.outcome, 'PREPARARE');
});

test('scenario caotico/non integrabile -> NO-GO', () => {
  const result = computeFitResult({
    frequency: 'rare',
    repeatability: 'unique',
    data: 'memory-paper',
    integration: 'closed',
    exceptions: 'unpredictable',
    owner: 'unclear',
    measurement: 'none',
    risk: 'high',
  });
  assert.equal(result.outcome, 'NO-GO');
});

test('un processo unico non può risultare GO anche con gli altri valori al massimo', () => {
  const result = computeFitResult({ ...ideal, repeatability: 'unique' });
  assert.equal(result.score, 80);
  assert.equal(result.outcome, 'PREPARARE');
  assert.ok(result.blockers.some((x) => x.includes('cambia troppo')));
});

test('un processo raro non può risultare GO', () => {
  const result = computeFitResult({ ...ideal, frequency: 'rare' });
  assert.equal(result.score, 82);
  assert.equal(result.outcome, 'PREPARARE');
  assert.ok(result.blockers.some((x) => x.includes('volume')));
});

test('eccezioni imprevedibili impediscono GO', () => {
  const result = computeFitResult({ ...ideal, exceptions: 'unpredictable' });
  assert.equal(result.score, 90);
  assert.equal(result.outcome, 'PREPARARE');
});

test('assenza di misurabilità impedisce GO', () => {
  const result = computeFitResult({ ...ideal, measurement: 'none' });
  assert.equal(result.score, 90);
  assert.equal(result.outcome, 'PREPARARE');
});
