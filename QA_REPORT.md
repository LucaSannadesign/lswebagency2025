# QA Report - API Routes e Contact Form

## Checklist QA Post-Deploy

### 1. Test API Ping (GET)
```bash
curl -i https://www.lswebagency.com/api/ping | head -n 25
```

**Risultato atteso:**
- Status: `200 OK`
- Content-Type: `application/json; charset=utf-8`
- Body: `{ ok: true, route: "/api/ping", ts: 1234567890 }`

**Verifica:**
- [ ] Status code 200
- [ ] Content-Type corretto (application/json)
- [ ] Body è JSON valido
- [ ] Nessun errore 404

---

### 2. Test API Contact (GET)
```bash
curl -i https://www.lswebagency.com/api/contact | head -n 25
```

**Risultato atteso:**
- Status: `200 OK`
- Content-Type: `application/json; charset=utf-8`
- Body: `{ ok: true, route: "/api/contact", message: "Contact API endpoint. Use POST method to send a message." }`

**Verifica:**
- [ ] Status code 200
- [ ] Content-Type corretto
- [ ] Body è JSON valido
- [ ] Nessun errore 404

---

### 3. Test API Contact (POST - Dati Validi)
```bash
curl -i -X POST https://www.lswebagency.com/api/contact \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'name=Test%20User&email=test@example.com&message=Questo%20è%20un%20messaggio%20di%20test%20con%20almeno%2010%20caratteri&privacy=on' | head -n 40
```

**Risultato atteso (successo):**
- Status: `200 OK`
- Content-Type: `application/json`
- Body: `{ ok: true, message: "Messaggio inviato con successo." }`

**Risultato atteso (errore validazione):**
- Status: `400 Bad Request`
- Content-Type: `application/json`
- Body: `{ ok: false, message: "..." }` (messaggio di errore chiaro)

**Verifica:**
- [ ] Status code 200 (se dati validi) o 400 (se validazione fallisce)
- [ ] Content-Type è application/json (mai text/html)
- [ ] Body è JSON valido (mai "The page could not be found")
- [ ] Nessun errore 404

---

### 4. Test API Contact (POST - Dati Invalidi)
```bash
curl -i -X POST https://www.lswebagency.com/api/contact \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'name=&email=invalid&message=short&privacy=' | head -n 40
```

**Risultato atteso:**
- Status: `400 Bad Request`
- Content-Type: `application/json`
- Body: `{ ok: false, message: "..." }` (messaggio di errore specifico)

**Verifica:**
- [ ] Status code 400
- [ ] Content-Type è application/json
- [ ] Body è JSON valido con messaggio di errore chiaro
- [ ] Nessun errore 404

---

### 5. Test Form UI (Browser)
1. Apri `https://www.lswebagency.com/contatti`
2. Compila il form con dati validi
3. Invia il form

**Risultato atteso:**
- [ ] Form viene inviato senza errori console
- [ ] Nessun errore "Unexpected token 'T' ... is not valid JSON"
- [ ] Messaggio di successo viene mostrato
- [ ] Redirect a `/grazie` dopo 2 secondi (o messaggio OK)

---

### 6. Test Form UI - Errore (Browser)
1. Apri `https://www.lswebagency.com/contatti`
2. Compila il form con dati invalidi (es: nome troppo corto)
3. Invia il form

**Risultato atteso:**
- [ ] Form viene inviato senza errori console
- [ ] Nessun errore "Unexpected token 'T' ... is not valid JSON"
- [ ] Messaggio di errore chiaro viene mostrato
- [ ] Form non viene resettato (permette correzione)

---

### 7. Test Form UI - API Down (Browser DevTools)
1. Apri `https://www.lswebagency.com/contatti`
2. Apri DevTools → Network
3. Blocca `/api/contact` (o simula offline)
4. Compila e invia il form

**Risultato atteso:**
- [ ] Nessun crash JavaScript
- [ ] Nessun errore "Unexpected token ... is not valid JSON"
- [ ] Messaggio di errore chiaro: "Impossibile connettersi al server. Verifica la connessione e riprova."
- [ ] Console mostra errore loggato (non crash)

---

### 8. Test Console Errors (Browser)
1. Apri `https://www.lswebagency.com/contatti`
2. Apri DevTools → Console
3. Invia il form (valido o invalido)

**Verifica:**
- [ ] Nessun errore "Unexpected token 'T' ... is not valid JSON"
- [ ] Nessun errore "Failed to fetch"
- [ ] Se ci sono errori, sono loggati con console.error (non crash)
- [ ] Nessun errore relativo a JSON.parse su risposta HTML

---

## Verifica Configurazione Vercel

### Vercel Project Settings
- [ ] Framework Preset: `Astro`
- [ ] Build Command: `npm run build` (o vuoto)
- [ ] Output Directory: **VUOTO** (campo vuoto)
- [ ] Install Command: vuoto o `npm ci`

### Verifica Build Logs
- [ ] Build completa senza errori
- [ ] Adapter `@astrojs/vercel` attivo
- [ ] Output `.vercel/output` generato
- [ ] Nessun errore "static site" o "output directory"

### Verifica Functions (Vercel Dashboard)
- [ ] Functions tab mostra funzioni SSR
- [ ] `/api/ping` è disponibile
- [ ] `/api/contact` è disponibile
- [ ] Nessun errore 404 nelle Functions

---

## Risultato Finale

- [ ] Tutti i test API passano (200 o 400, mai 404)
- [ ] Form UI funziona senza errori console
- [ ] Nessun errore "Unexpected token ... is not valid JSON"
- [ ] Gestione errori robusta (network, parsing, validation)
- [ ] Configurazione Vercel corretta (Output Directory vuoto)

---

## Note Tecniche

- Le API devono rispondere **sempre JSON**, anche in caso di errore
- Il form JS usa `content-type` header per decidere se fare `response.json()` o `response.text()`
- Se la risposta non è JSON valido, il form mostra errore generico senza crashare
- Vercel deve deployare come SSR (non static) per far funzionare le API
