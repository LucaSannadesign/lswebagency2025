# Checklist Fix API 404 su Vercel

## Verifica Configurazione Repository

### ✅ 1. Route API Esistenti
- [x] `src/pages/api/ping.ts` esiste
- [x] `src/pages/api/contact.ts` esiste
- [x] Entrambe hanno `export const prerender = false;`
- [x] Entrambe esportano handler GET/POST con `APIRoute`

### ✅ 2. Astro Config
- [x] `astro.config.ts` (non .mjs)
- [x] `output: 'server'` presente
- [x] `adapter: vercel()` presente
- [x] Import: `import vercel from '@astrojs/vercel'` (non serverless)

### ✅ 3. Vercel.json
- [x] Nessuna redirect che cattura `/api/*`
- [x] Nessun `outputDirectory` che forza static
- [x] Nessun `buildCommand` custom che potrebbe interferire

---

## Test Locale (Prima del Deploy)

### Test Build
```bash
# Build locale
npm run build

# Verifica output
ls -la .vercel/output/functions/
# Deve esistere: .vercel/output/functions/_render.func (o simile)

# Verifica che le API siano incluse
find .vercel/output -name "*api*" -o -name "*contact*" -o -name "*ping*"
```

### Test Dev Server
```bash
# Avvia dev server
npm run dev

# In altro terminale, testa ping
curl -i http://localhost:4321/api/ping

# Output atteso:
# HTTP/1.1 200 OK
# Content-Type: application/json; charset=utf-8
# { ok: true, route: "/api/ping", ts: 1234567890 }

# Test contact GET
curl -i http://localhost:4321/api/contact

# Output atteso:
# HTTP/1.1 200 OK
# Content-Type: application/json; charset=utf-8
# { ok: true, route: "/api/contact", message: "..." }
```

---

## Test Produzione (Dopo Deploy)

### Test Ping
```bash
curl -i https://www.lswebagency.com/api/ping | head -n 25
```

**Risultato atteso:**
- Status: `200 OK`
- Content-Type: `application/json; charset=utf-8`
- Body: `{ ok: true, route: "/api/ping", ts: 1234567890 }`

**Se 404:**
- Verifica Vercel Project Settings (vedi sotto)
- Controlla log di build su Vercel Dashboard

### Test Contact GET
```bash
curl -i https://www.lswebagency.com/api/contact | head -n 25
```

**Risultato atteso:**
- Status: `200 OK`
- Content-Type: `application/json; charset=utf-8`
- Body: `{ ok: true, route: "/api/contact", message: "..." }`

### Test Contact POST
```bash
curl -i -X POST https://www.lswebagency.com/api/contact \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'name=Test&email=test@example.com&message=Hello%20world%20test&privacy=on' | head -n 40
```

**Risultato atteso:**
- Status: `200 OK` (se validazione OK) o `400 Bad Request` (se validazione fallisce)
- Content-Type: `application/json`
- Body: JSON valido (mai HTML "The page could not be found")

---

## Verifica Vercel Project Settings (CRITICO)

Se le API restituiscono 404 in produzione, il problema è **NON nel codice** ma nelle **impostazioni Vercel**.

### Dove andare
1. Vercel Dashboard → progetto lswebagency
2. Settings → General → Build & Development Settings

### Cosa verificare/correggere

#### 1. Framework Preset
- **DEVE ESSERE**: `Astro`
- **NON DEVE ESSERE**: `Other`, `Static Site`, `Docker`

**Azione**: Se è impostato su `Other` o altro, cambialo in `Astro`.

#### 2. Build Command
- **DEVE ESSERE**: `npm run build`
- **PUÒ ESSERE**: vuoto (Vercel usa default)

**Azione**: Imposta esplicitamente `npm run build`.

#### 3. Output Directory ⚠️ **CRITICO**
- **DEVE ESSERE**: **VUOTO** (campo completamente vuoto)
- **NON DEVE ESSERE**: `dist`, `.vercel/output`, `build`, o qualsiasi altro valore

**Azione**: **RIMUOVI completamente** qualsiasi valore nel campo "Output Directory". Lascia il campo vuoto.

**IMPORTANTE**: Se questo campo è impostato su `dist` o altro, Vercel ignora `.vercel/output` generato da Astro e tratta il progetto come statico, causando 404 sulle API.

#### 4. Install Command
- **PUÒ ESSERE**: vuoto (default `npm ci`) o `npm ci`

**Azione**: Lascia vuoto o imposta `npm ci`.

---

## Diagnostica Build Vercel

### Verifica Log di Build
1. Vercel Dashboard → Deployments → [ultimo deploy]
2. Apri "Build Logs"
3. Cerca:
   - `@astrojs/vercel` adapter attivo
   - Output `.vercel/output` generato
   - Nessun errore "static site" o "output directory"

### Verifica Functions
1. Vercel Dashboard → Deployments → [ultimo deploy]
2. Vai su tab "Functions"
3. Verifica che ci sia una funzione `_render` o che le API siano elencate

**Se Functions tab è vuoto o non esiste:**
- Vercel sta deployando come static
- Verifica "Output Directory" è vuoto
- Verifica "Framework Preset" è `Astro`

---

## Patch Minima Applicata

Nessuna modifica al codice necessario: il codice è già corretto.

**File verificati (già corretti):**
- ✅ `astro.config.ts`: `output: 'server'`, `adapter: vercel()`
- ✅ `src/pages/api/ping.ts`: `export const prerender = false;`, handler GET/POST
- ✅ `src/pages/api/contact.ts`: `export const prerender = false;`, handler GET/POST
- ✅ `vercel.json`: nessuna redirect che cattura `/api/*`

**Causa probabile del 404:**
- Vercel Project Settings: "Output Directory" impostato su `dist` o altro
- Vercel Project Settings: "Framework Preset" non è `Astro`

**Soluzione:**
- Vercel Dashboard → Settings → Build & Development Settings
- Imposta "Output Directory" a **VUOTO**
- Imposta "Framework Preset" a `Astro`
- Redeploy

---

## Comandi di Verifica Rapida

```bash
# 1. Verifica configurazione locale
cat astro.config.ts | grep -A 2 "output:\|adapter:"
# Deve mostrare: output: 'server' e adapter: vercel()

# 2. Verifica route API esistono
ls -la src/pages/api/ping.ts src/pages/api/contact.ts

# 3. Verifica prerender disabilitato
grep "prerender = false" src/pages/api/ping.ts src/pages/api/contact.ts

# 4. Build e verifica output
npm run build
ls -la .vercel/output/functions/ 2>/dev/null | head -n 5

# 5. Test produzione (dopo deploy)
curl -i https://www.lswebagency.com/api/ping | head -n 10
```

---

## Risultato Atteso

Dopo aver corretto le Vercel Project Settings e fatto redeploy:

- ✅ `curl https://www.lswebagency.com/api/ping` → 200 JSON
- ✅ `curl https://www.lswebagency.com/api/contact` → 200 JSON
- ✅ Form contatti funziona senza errori console
- ✅ Nessun errore "The page could not be found"




