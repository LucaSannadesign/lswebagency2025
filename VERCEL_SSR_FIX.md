# Fix API 404 su Vercel - Documentazione Completa

## Problema Identificato

Le route `/api/ping` e `/api/contact` restituiscono 404 su Vercel in produzione, mentre il build locale genera correttamente le functions.

**Causa principale**: Vercel Project Settings hanno:
- Framework Preset: "Other" (dovrebbe essere "Astro")
- Output Directory: "public" (dovrebbe essere VUOTO)

Quando "Output Directory" è impostato su "public", Vercel ignora `.vercel/output` generato da Astro e cerca solo file statici, causando 404 sulle API routes.

---

## Modifiche Applicate al Codice

### 1. `vercel.json` - Aggiunta configurazione esplicita

**File modificato**: `vercel.json`

**Modifiche**:
```json
{
  "buildCommand": "npm run build",
  "framework": "astro",
  "headers": [
    // ... resto invariato
  ]
}
```

**Motivazione**: 
- `buildCommand` esplicito assicura che Vercel esegua `npm run build`
- `framework: "astro"` aiuta Vercel a riconoscere il progetto come Astro (anche se le Project Settings sono sbagliate)

### 2. `.vercelignore` - Creato nuovo file

**File creato**: `.vercelignore`

**Contenuto**:
```
dist/
public/
node_modules/
.env.local
.env.*.local
```

**Motivazione**: 
- Evita che Vercel confonda `dist/` o `public/` con l'output directory
- Assicura che Vercel usi `.vercel/output` generato da Astro

### 3. Verifica configurazione esistente

**File verificati (già corretti)**:
- ✅ `astro.config.ts`: `output: 'server'`, `adapter: vercel()`
- ✅ `src/pages/api/ping.ts`: `export const prerender = false;`, handler GET/POST
- ✅ `src/pages/api/contact.ts`: `export const prerender = false;`, handler GET/POST
- ✅ Build locale genera correttamente `.vercel/output/functions/_render.func`

---

## Modifiche Necessarie nelle Vercel Project Settings

**⚠️ CRITICO**: Anche con le modifiche al codice, devi correggere le Vercel Project Settings.

### Passi da seguire:

1. **Vai su Vercel Dashboard**
   - https://vercel.com/dashboard
   - Seleziona progetto `lswebagency`

2. **Vai su Settings → General → Build & Development Settings**

3. **Correggi "Output Directory"**
   - **RIMUOVI completamente** il valore "public"
   - **LASCIA IL CAMPO VUOTO**
   - Questo è il passo più critico

4. **Correggi "Framework Preset"**
   - Cambia da "Other" a **"Astro"**
   - Questo aiuta Vercel a riconoscere il framework

5. **Verifica "Build Command"**
   - Dovrebbe essere `npm run build` (o vuoto per usare default)
   - Se è vuoto, puoi lasciarlo vuoto (vercel.json ora lo specifica)

6. **Salva e Redeploy**
   - Clicca "Save"
   - Vai su "Deployments" → "Redeploy" sull'ultimo deployment

---

## Verifica Build Locale

### Test Build
```bash
# Build locale
npm run build

# Verifica output
ls -la .vercel/output/functions/
# Output atteso: .vercel/output/functions/_render.func esiste

# Verifica API routes incluse
find .vercel/output -path "*/api/ping*" -o -path "*/api/contact*"
# Output atteso: 
# .vercel/output/_functions/pages/api/ping.astro.mjs
# .vercel/output/_functions/pages/api/contact.astro.mjs
# .vercel/output/functions/_render.func/dist/server/pages/api/ping.astro.mjs
# .vercel/output/functions/_render.func/dist/server/pages/api/contact.astro.mjs
```

### Test Dev Server (opzionale)
```bash
# Avvia dev server
npm run dev

# In altro terminale, testa ping
curl -i http://localhost:4321/api/ping

# Output atteso:
# HTTP/1.1 200 OK
# Content-Type: application/json; charset=utf-8
# { "ok": true, "route": "/api/ping", "ts": 1234567890 }
```

---

## Test Produzione (Dopo Deploy)

### Test Ping
```bash
curl -sI https://www.lswebagency.com/api/ping | head -n 10
```

**Risultato atteso**:
```
HTTP/2 200
content-type: application/json; charset=utf-8
```

**Se 404**: Verifica che "Output Directory" sia VUOTO nelle Vercel Project Settings.

### Test Contact GET
```bash
curl -i https://www.lswebagency.com/api/contact | head -n 10
```

**Risultato atteso**:
```
HTTP/2 200
content-type: application/json; charset=utf-8
{ "ok": true, "route": "/api/contact", "message": "..." }
```

### Test Contact POST
```bash
curl -i -X POST https://www.lswebagency.com/api/contact \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'name=Test&email=test@example.com&message=Hello%20world&privacy=on' | head -n 20
```

**Risultato atteso**:
- Status: `200 OK` (se validazione OK) o `400 Bad Request` (se validazione fallisce)
- Content-Type: `application/json`
- Body: JSON valido (mai HTML "The page could not be found")

---

## File Modificati

1. **`vercel.json`**
   - Aggiunto: `"buildCommand": "npm run build"`
   - Aggiunto: `"framework": "astro"`
   - Resto invariato (headers, redirects)

2. **`.vercelignore`** (nuovo file)
   - Creato per evitare confusione con `dist/` o `public/`

---

## Risultato Atteso

Dopo aver:
1. ✅ Applicato le modifiche al codice (già fatto)
2. ✅ Corretto Vercel Project Settings (Output Directory = VUOTO, Framework = Astro)
3. ✅ Fatto redeploy

**Risultato**:
- ✅ `curl -sI https://www.lswebagency.com/api/ping` → 200 (non 404)
- ✅ `curl -sI https://www.lswebagency.com/api/contact` → 200 (non 404)
- ✅ Form contatti funziona senza errori console
- ✅ Nessun errore "The page could not be found"

---

## Note Tecniche

### Perché "Output Directory" vuoto è critico?

Astro con `output: 'server'` e `adapter: vercel()` genera:
- `.vercel/output/static/` - file statici
- `.vercel/output/functions/_render.func/` - funzione SSR
- `.vercel/output/_functions/pages/api/*.mjs` - API routes

Vercel deve usare `.vercel/output/` direttamente (quando "Output Directory" è vuoto), non `dist/` o `public/`.

Se "Output Directory" = `public`:
- Vercel cerca solo file statici in `public/`
- Ignora `.vercel/output/` generato da Astro
- Le API routes (che richiedono SSR) diventano 404

### Perché `framework: "astro"` in vercel.json?

Anche se le Project Settings hanno "Framework Preset" = "Other", `framework: "astro"` in `vercel.json` può aiutare Vercel a riconoscere il progetto come Astro durante il build. Tuttavia, **non sostituisce** la correzione delle Project Settings.

---

## Checklist Finale

### Repository (✅ Completato)
- [x] `vercel.json` ha `buildCommand` e `framework: "astro"`
- [x] `.vercelignore` creato
- [x] `astro.config.ts` ha `output: 'server'` e `adapter: vercel()`
- [x] API routes hanno `export const prerender = false;`
- [x] Build locale genera `.vercel/output/functions/_render.func`

### Vercel Project Settings (⚠️ DA FARE)
- [ ] "Output Directory" è **VUOTO** (campo vuoto)
- [ ] "Framework Preset" è `Astro`
- [ ] "Build Command" è `npm run build` (o vuoto)

### Post-Deploy (✅ DA TESTARE)
- [ ] `curl -sI https://www.lswebagency.com/api/ping` → 200
- [ ] `curl -sI https://www.lswebagency.com/api/contact` → 200
- [ ] Form contatti funziona senza errori console






