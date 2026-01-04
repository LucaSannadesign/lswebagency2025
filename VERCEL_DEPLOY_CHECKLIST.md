# Checklist Fix API 404 su Vercel

## ✅ Verifica Codice (già corretto)

Il codice è già configurato correttamente:

- ✅ `astro.config.ts`: `output: 'server'` e `adapter: vercel()` (non serverless)
- ✅ `src/pages/api/contact.ts`: `export const prerender = false;` presente
- ✅ `src/pages/api/ping.ts`: `export const prerender = false;` presente
- ✅ `vercel.json`: nessun `outputDirectory`, `buildCommand`, `installCommand`

## 🔧 CAUSA DEL 404: Vercel Project Settings

Il problema è **NON nel codice**, ma nelle **impostazioni del progetto Vercel**.

Vercel sta probabilmente usando:
- **Output Directory** impostato su `dist` o altro
- **Framework Preset** impostato su `Other` o `Static Site`

Questo fa sì che Vercel **ignori** `.vercel/output` e tratti il progetto come statico.

---

## 📋 ISTRUZIONI PRECISE: Vercel Project Settings

### Dove andare
1. Vai su [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleziona il progetto **lswebagency**
3. Vai su **Settings** (Impostazioni)
4. Nella sezione **General**, trova **Build & Development Settings**

### Cosa modificare (in ordine)

#### 1. Framework Preset
- **Deve essere**: `Astro` (seleziona dal menu a tendina)
- **NON deve essere**: `Other`, `Static Site`, `Docker`

**Azione**: Se è impostato su `Other` o altro, cambialo in `Astro`.

---

#### 2. Build Command
- **Deve essere**: `npm run build` (default per Astro)
- **NON deve essere**: comandi custom o vuoto (anche se vuoto va bene, meglio esplicito)

**Azione**: Imposta esplicitamente `npm run build`.

---

#### 3. Output Directory ⚠️ **CRITICO**
- **Deve essere**: **VUOTO** (campo vuoto)
- **NON deve essere**: `dist`, `.vercel/output`, `build`, o qualsiasi altro valore

**Azione**: **RIMUOVI completamente** qualsiasi valore nel campo "Output Directory". Lascia il campo vuoto.

**IMPORTANTE**: Se questo campo è impostato su `dist` o altro, Vercel ignora `.vercel/output` generato da Astro e tratta il progetto come statico. Questo causa i 404 sulle API.

---

#### 4. Install Command
- **Può essere**: vuoto (default `npm ci`) o `npm ci`
- **NON deve essere**: comandi custom che potrebbero fallire

**Azione**: Lascia vuoto o imposta `npm ci`.

---

#### 5. Root Directory
- **Deve essere**: vuoto (se il progetto è nella root del repo)

**Azione**: Lascia vuoto.

---

## ✅ Dopo aver modificato le impostazioni

1. **Salva** le impostazioni
2. **Trigger un nuovo deploy**:
   - Vai su **Deployments**
   - Clicca **"Redeploy"** sull'ultimo deploy
   - Oppure fai un commit vuoto e push

---

## 🧪 Test dopo deploy

Esegui questi comandi per verificare che le API funzionino:

```bash
# Test ping GET
curl -i https://www.lswebagency.com/api/ping | head -n 25

# Output atteso:
# HTTP/1.1 200 OK
# Content-Type: application/json; charset=utf-8
# { ok: true, ts: 1234567890 }

# Test contact POST (JSON)
curl -i -X POST https://www.lswebagency.com/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}' | head -n 40

# Output atteso (con FormData, non JSON):
# HTTP/1.1 400 Bad Request
# Content-Type: application/json
# { ok: false, message: "..." }

# Test contact POST (FormData - come fa il browser)
curl -i -X POST https://www.lswebagency.com/api/contact \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'name=Test&email=test@example.com&message=Hello%20world&privacy=on' | head -n 40

# Output atteso (se validazione OK):
# HTTP/1.1 200 OK
# Content-Type: application/json
# { ok: true, message: "Messaggio inviato con successo." }
```

---

## 🔍 Verifica Log Build Vercel

Dopo il deploy, controlla i log:

1. Vai su **Deployments** > [ultimo deploy]
2. Apri **Build Logs**
3. Verifica che compaia:
   - `@astrojs/vercel` adapter attivo
   - Output `.vercel/output` generato
   - Nessun errore relativo a "static site" o "output directory"

4. Vai su **Functions** (nella pagina del deploy)
5. Verifica che ci sia una funzione `_render` o che le API siano elencate

---

## ❌ Se le API restano ancora 404

Se dopo aver corretto le impostazioni Vercel le API restano 404:

1. Verifica che il deploy sia completato (non in errore)
2. Controlla i log di build per errori
3. Verifica che `.vercel/output/functions/_render.func` esista nel build
4. Contatta supporto Vercel con:
   - Log di build
   - Screenshot delle impostazioni Project Settings
   - Output di `curl -i https://www.lswebagency.com/api/ping`

---

## 📝 Note Tecniche

- Astro con `output: 'server'` genera `.vercel/output/` con funzioni SSR
- Vercel deve usare questo output, non una directory custom come `dist`
- Il Framework Preset `Astro` dice a Vercel di usare il build output corretto
- Se Output Directory è impostato, Vercel ignora `.vercel/output` e tratta come statico

