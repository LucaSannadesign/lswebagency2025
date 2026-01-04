# Fix API 404 - Deploy Instructions

## Modifica Applicata

**File**: `astro.config.ts`

**Cambiamento**:
```diff
- adapter: vercel(),
+ adapter: vercel({ mode: 'serverless' }),
```

**`output: 'server'` rimane invariato**.

---

## Comandi da Eseguire

### 1. Deploy in Produzione

```bash
vercel --prod
```

Questo comando:
- Builda il progetto con la nuova configurazione
- Deploya su Vercel Production
- Le API routes verranno deployate come serverless functions

### 2. Test Finali

Dopo il deploy, attendi 1-2 minuti per la propagazione, poi esegui:

```bash
# Test ping endpoint
curl -sI https://www.lswebagency.com/api/ping | head -n 15

# Test contact endpoint
curl -sI https://www.lswebagency.com/api/contact | head -n 15
```

**Output atteso**:
```
HTTP/2 200
content-type: application/json; charset=utf-8
```

**Non deve essere**:
```
HTTP/2 404
content-type: text/html; charset=utf-8
```

---

## Se Ancora 404 Dopo il Deploy

Se dopo il deploy i test restituiscono ancora 404, prova questa procedura:

### Backup vercel.json (se presente)

```bash
# Verifica se vercel.json esiste
ls -la vercel.json

# Se esiste, rinominarlo temporaneamente
mv vercel.json vercel.json.bak

# Ridisploy
vercel --prod

# Test di nuovo
curl -sI https://www.lswebagency.com/api/ping | head -n 15
```

**Nota**: Se `vercel.json` non esiste (già rimosso), salta questo step.

---

## Verifica Build Locale (Opzionale)

Prima di fare deploy, puoi verificare che la build locale funzioni:

```bash
npm run build

# Verifica che le functions siano generate
ls -la .vercel/output/functions/ 2>/dev/null && echo "✅ Functions generate" || echo "❌ Functions non generate"
```

---

## Checklist

- [x] Modificato `astro.config.ts`: `adapter: vercel({ mode: 'serverless' })`
- [ ] Eseguito `vercel --prod`
- [ ] Atteso 1-2 minuti per propagazione
- [ ] Testato `curl -sI https://www.lswebagency.com/api/ping` → 200
- [ ] Testato `curl -sI https://www.lswebagency.com/api/contact` → 200
- [ ] Se ancora 404: backup e rimozione `vercel.json`, ridisploy

---

## Risultato Atteso

Dopo il deploy:

- ✅ `https://www.lswebagency.com/api/ping` → 200 OK (non 404)
- ✅ `https://www.lswebagency.com/api/contact` → 200 OK (non 404)
- ✅ Form contatti funziona correttamente


