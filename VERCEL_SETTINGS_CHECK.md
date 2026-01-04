# Verifica Impostazioni Vercel Project Settings

Se dopo le modifiche applicate le API restituiscono ancora 404 in produzione, controlla le impostazioni del progetto su Vercel.

## Dove andare

1. Accedi a [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleziona il progetto **lswebagency** (o il nome del tuo progetto)
3. Vai su **Settings** (Impostazioni)
4. Nella sezione **General** (Generale), trova **Build & Development Settings**

## Cosa verificare e correggere

### 1. Framework Preset
- **Deve essere**: `Astro` (o lasciato vuoto/auto-detect)
- **NON deve essere**: `Other`, `Static Site`, `Docker`

Se è impostato su `Other` o `Static Site`, cambialo in `Astro`.

---

### 2. Build Command
- **Deve essere**: `npm run build` (default per Astro)
- **NON deve essere**: `npm run build -- --mode production` o comandi custom
- **Se vuoto**: va bene, Vercel usa il default

Se c'è un comando custom che potrebbe interferire, rimuovilo e lascia il default.

---

### 3. Output Directory
- **Deve essere**: **VUOTO** (lasciato vuoto)
- **NON deve essere**: `dist`, `.vercel/output`, `build`, o qualsiasi altra directory

**IMPORTANTE**: Se `Output Directory` è impostato su `dist` o altra directory, Vercel ignorerà `.vercel/output` e tratterà il progetto come statico. **Rimuovi completamente questo campo**.

---

### 4. Install Command
- **Può essere**: vuoto (default `npm ci` o `npm install`)
- **Non deve essere**: comandi custom che potrebbero fallire

Lascia vuoto se non hai esigenze specifiche.

---

### 5. Root Directory
- **Deve essere**: vuoto (se il progetto è nella root del repo)
- **O**: il percorso relativo alla root del repo (es. `./project`)

Per questo progetto, lascia vuoto.

---

## Verifica dopo le modifiche

Dopo aver corretto le impostazioni:

1. Fai un nuovo deploy (push su git o `vercel --prod`)
2. Verifica che il build log mostri:
   - `@astrojs/vercel` adapter attivo
   - Output `.vercel/output` generato
   - Nessun errore relativo a "static site" o "output directory"

3. Testa le API:
   ```bash
   curl -i https://www.lswebagency.com/api/ping | head -n 25
   ```

Se le API restituiscono ancora 404 dopo queste correzioni, potrebbe essere necessario:
- Verificare che `astro.config.ts` abbia `output: 'server'`
- Verificare che l'adapter sia `@astrojs/vercel` (non `@astrojs/vercel/serverless`)
- Contattare supporto Vercel con i log di build

