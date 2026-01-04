#!/usr/bin/env node
// scripts/verify-functions.mjs
// Verifica che il build Astro abbia generato le funzioni SSR per Vercel

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const checks = [];

// 1. Verifica che esista .vercel/output/functions/_render.func
const renderFuncPath = join(projectRoot, '.vercel', 'output', 'functions', '_render.func');
if (existsSync(renderFuncPath)) {
  console.log('✅ .vercel/output/functions/_render.func esiste');
  checks.push(true);
} else {
  console.error('❌ .vercel/output/functions/_render.func NON esiste');
  console.error('   Questo significa che Vercel adapter non ha generato le funzioni SSR');
  checks.push(false);
}

// 2. Verifica che esista .vercel/output/static o .vercel/output/config.json
const configPath = join(projectRoot, '.vercel', 'output', 'config.json');
const staticPath = join(projectRoot, '.vercel', 'output', 'static');

if (existsSync(configPath) || existsSync(staticPath)) {
  console.log('✅ .vercel/output/config.json o static/ esiste');
  checks.push(true);
} else {
  console.error('❌ .vercel/output/config.json o static/ NON esiste');
  console.error('   Il build potrebbe non essere stato eseguito correttamente');
  checks.push(false);
}

// 3. Verifica che le API routes esistano nel source (non possiamo verificare la build finale direttamente)
const apiPingPath = join(projectRoot, 'src', 'pages', 'api', 'ping.ts');
const apiContactPath = join(projectRoot, 'src', 'pages', 'api', 'contact.ts');

if (existsSync(apiPingPath)) {
  console.log('✅ src/pages/api/ping.ts esiste');
  checks.push(true);
} else {
  console.error('❌ src/pages/api/ping.ts NON esiste');
  checks.push(false);
}

if (existsSync(apiContactPath)) {
  console.log('✅ src/pages/api/contact.ts esiste');
  checks.push(true);
} else {
  console.error('❌ src/pages/api/contact.ts NON esiste');
  checks.push(false);
}

// Risultato finale
const allPassed = checks.every(check => check === true);

if (!allPassed) {
  console.error('\n❌ VERIFICA FALLITA');
  console.error('\nPossibili cause:');
  console.error('1. Il build non è stato eseguito: esegui "npm run build"');
  console.error('2. astro.config.ts non ha output: "server" e adapter: vercel()');
  console.error('3. Le API routes non hanno export const prerender = false;');
  process.exit(1);
} else {
  console.log('\n✅ TUTTE LE VERIFICHE PASSATE');
  console.log('Il build sembra corretto per Vercel SSR');
  process.exit(0);
}

