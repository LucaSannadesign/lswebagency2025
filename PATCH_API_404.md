# Patch Minima - Fix API 404 su Vercel

## Diagnosi

**Problema**: Le route `/api/ping` e `/api/contact` restituiscono 404 su Vercel in produzione.

**Causa identificata**: **NON è un problema di codice**. Il codice è corretto e il build locale genera correttamente le functions.

**Causa reale**: **Vercel Project Settings** - molto probabilmente "Output Directory" è impostato su `dist` invece di essere vuoto.

---

## Verifica Repository (✅ Tutto Corretto)

### 1. Route API Esistenti
```bash
ls -la src/pages/api/ping.ts src/pages/api/contact.ts
# ✅ Entrambe esistono
```

### 2. Prerender Disabilitato
```bash
grep "prerender = false" src/pages/api/ping.ts src/pages/api/contact.ts
# ✅ Entrambe hanno export const prerender = false;
```

### 3. Astro Config
```typescript
// astro.config.ts
export default defineConfig({
  output: 'server',        // ✅ Corretto
  adapter: vercel(),       // ✅ Corretto (non serverless)
  // ...
});
```

**Verifica:**
```bash
grep -A 2 "output:\|adapter:" astro.config.ts
# ✅ output: 'server'
# ✅ adapter: vercel()
```

### 4. Build Output Locale
```bash
npm run build
ls -la .vercel/output/functions/
# ✅ Esiste: .vercel/output/functions/_render.func

find .vercel/output -name "*api*" | grep -E "ping|contact"
# ✅ .vercel/output/_functions/pages/api/ping.astro.mjs
# ✅ .vercel/output/_functions/pages/api/contact.astro.mjs
```

**Conclusione**: Il codice e il build locale sono corretti. Le API vengono generate correttamente.

---

## Patch Minima

### ✅ Nessuna Modifica al Codice Necessaria

Il codice è già corretto. Non serve modificare file.

### ⚠️ Modifica Richiesta: Vercel Project Settings

Il problema è nelle **impostazioni del progetto Vercel**, non nel codice.

#### Passi da seguire:

1. **Vai su Vercel Dashboard**
   - https://vercel.com/dashboard
   - Seleziona il progetto `lswebagency`

2. **Vai su Settings**
   - Clicca su "Settings" nel menu del progetto
   - Sezione "General" → "Build & Development Settings"

3. **Correggi "Output Directory"**
   - **Campo "Output Directory"**: **DEVE ESSERE VUOTO**
   - Se è impostato su `dist`, `build`, `.vercel/output` o qualsiasi altro valore, **RIMUOVILO COMPLETAMENTE**
   - Lascia il campo vuoto

4. **Verifica "Framework Preset"**
   - **DEVE ESSERE**: `Astro`
   - Se è `Other`, `Static Site`, o altro, cambialo in `Astro`

5. **Verifica "Build Command"**
   - **DEVE ESSERE**: `npm run build` (o vuoto per usare default)
   - Se è vuoto, puoi lasciarlo vuoto o impostarlo esplicitamente a `npm run build`

6. **Salva e Redeploy**
   - Clicca "Save"
   - Vai su "Deployments"
   - Clicca "Redeploy" sull'ultimo deployment, oppure fai push di un commit per triggerare nuovo deploy

---

## Perché "Output Directory" Vuoto è Critico

Quando Vercel vede "Output Directory" = `dist`:
- Ignora `.vercel/output` generato da Astro adapter
- Cerca solo file statici in `dist/`
- Tratta il progetto come static site
- Le API routes (che richiedono SSR) diventano 404

Quando "Output Directory" è vuoto:
- Vercel usa `.vercel/output` generato da `@astrojs/vercel`
- Riconosce le functions SSR
- Le API routes funzionano correttamente

---

## Comandi di Verifica

### Pre-Deploy (Locale)
```bash
# 1. Verifica configurazione
cat astro.config.ts | grep -A 2 "output:\|adapter:"

# 2. Verifica route esistono
ls -la src/pages/api/ping.ts src/pages/api/contact.ts

# 3. Build locale
npm run build

# 4. Verifica output functions
ls -la .vercel/output/functions/ | head -n 5
find .vercel/output -path "*/api/ping*" -o -path "*/api/contact*"
```

### Post-Deploy (Produzione)
```bash
# Test ping
curl -i https://www.lswebagency.com/api/ping | head -n 10

# Output atteso:
# HTTP/1.1 200 OK
# Content-Type: application/json; charset=utf-8
# { "ok": true, "route": "/api/ping", "ts": 1234567890 }

# Test contact GET
curl -i https://www.lswebagency.com/api/contact | head -n 10

# Output atteso:
# HTTP/1.1 200 OK
# Content-Type: application/json; charset=utf-8
# { "ok": true, "route": "/api/contact", "message": "..." }

# Test contact POST
curl -i -X POST https://www.lswebagency.com/api/contact \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'name=Test&email=test@example.com&message=Hello%20world&privacy=on' | head -n 20
```

---

## Checklist Completa

### Repository (✅ Già Corretto)
- [x] `src/pages/api/ping.ts` esiste con `export const prerender = false;`
- [x] `src/pages/api/contact.ts` esiste con `export const prerender = false;`
- [x] `astro.config.ts` ha `output: 'server'`
- [x] `astro.config.ts` ha `adapter: vercel()` (non serverless)
- [x] `vercel.json` non ha redirect che cattura `/api/*`
- [x] Build locale genera `.vercel/output/functions/_render.func`

### Vercel Settings (⚠️ DA VERIFICARE/CORREGGERE)
- [ ] "Output Directory" è **VUOTO** (campo vuoto)
- [ ] "Framework Preset" è `Astro`
- [ ] "Build Command" è `npm run build` (o vuoto)

### Post-Deploy (✅ DA TESTARE DOPO CORREZIONE)
- [ ] `curl https://www.lswebagency.com/api/ping` → 200 JSON
- [ ] `curl https://www.lswebagency.com/api/contact` → 200 JSON
- [ ] `curl -X POST https://www.lswebagency.com/api/contact` → 200/400 JSON (mai 404)
- [ ] Form contatti funziona senza errori console
- [ ] Nessun errore "The page could not be found"

---

## Risultato Atteso

Dopo aver corretto "Output Directory" a vuoto e fatto redeploy:

- ✅ `/api/ping` risponde 200 JSON
- ✅ `/api/contact` risponde 200 JSON (GET e POST)
- ✅ Form contatti funziona correttamente
- ✅ Nessun errore 404 o "The page could not be found"

---

## Nota Tecnica

Astro con `output: 'server'` e `adapter: vercel()` genera:
- `.vercel/output/static/` - file statici
- `.vercel/output/functions/_render.func/` - funzione SSR
- `.vercel/output/_functions/pages/api/*.mjs` - API routes

Vercel deve usare `.vercel/output/` direttamente (quando "Output Directory" è vuoto), non `dist/`.

Se "Output Directory" = `dist`, Vercel cerca solo file statici in `dist/` e ignora `.vercel/output/`, causando 404 sulle API.


