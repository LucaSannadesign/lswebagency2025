# QA Form Contatti - Test API

Questo documento contiene i comandi curl per testare l'endpoint `/api/contact` in produzione.

## Endpoint

- **URL produzione**: `https://www.lswebagency.com/api/contact`
- **Metodi supportati**: `GET`, `POST`
- **Content-Type**: `application/json` (tutte le risposte)

---

## Test 1: GET request (endpoint disponibile)

### Comando

```bash
curl -i https://www.lswebagency.com/api/contact
```

### Risposta attesa

- **Status**: `200 OK`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "ok": true,
    "message": "Contact API endpoint. Use POST method to send a message."
  }
  ```

### Verifica

- ✅ Endpoint non restituisce 404
- ✅ Content-Type è `application/json`
- ✅ Body è JSON valido
- ✅ Struttura risposta coerente (`ok: true`, `message` presente)

---

## Test 2: POST request (invio form valido)

### Comando

```bash
curl -i -X POST https://www.lswebagency.com/api/contact \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=Test%20User" \
  -d "email=test@example.com" \
  -d "message=Questo%20è%20un%20messaggio%20di%20test%20con%20almeno%2010%20caratteri" \
  -d "privacy=on"
```

Oppure con `multipart/form-data` (come fa il browser):

```bash
curl -i -X POST https://www.lswebagency.com/api/contact \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "message=Questo è un messaggio di test con almeno 10 caratteri" \
  -F "privacy=on"
```

### Risposta attesa (successo)

- **Status**: `200 OK`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "ok": true,
    "message": "Messaggio inviato con successo."
  }
  ```

### Risposta attesa (errore validazione)

- **Status**: `400 Bad Request`
- **Content-Type**: `application/json`
- **Body** (esempio):
  ```json
  {
    "ok": false,
    "message": "Il nome deve contenere almeno 2 caratteri."
  }
  ```

### Verifica

- ✅ Status 200 in caso di successo
- ✅ Status 400 in caso di errore validazione
- ✅ Content-Type è sempre `application/json`
- ✅ Body è sempre JSON valido
- ✅ Struttura risposta coerente (`ok: boolean`, `message: string`)

---

## Test 3: POST request (dati mancanti)

### Comando

```bash
curl -i -X POST https://www.lswebagency.com/api/contact \
  -F "name=" \
  -F "email=test@example.com" \
  -F "message=Test"
```

### Risposta attesa

- **Status**: `400 Bad Request`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "ok": false,
    "message": "Il nome deve contenere almeno 2 caratteri."
  }
  ```

### Verifica

- ✅ Status 400
- ✅ JSON valido
- ✅ Messaggio di errore chiaro

---

## Test 4: Metodo non supportato (es. PUT, DELETE)

### Comando

```bash
curl -i -X PUT https://www.lswebagency.com/api/contact
```

### Risposta attesa

- **Status**: `405 Method Not Allowed`
- **Content-Type**: `application/json`
- **Headers**: `Allow: GET, POST`
- **Body**:
  ```json
  {
    "ok": false,
    "message": "Method not allowed"
  }
  ```

### Verifica

- ✅ Status 405
- ✅ Header `Allow` presente
- ✅ JSON valido

---

## Test 5: Rate limiting (test locale/development)

> **Nota**: Il rate limiting è in-memory e si resetta a ogni riavvio. In produzione potrebbe richiedere più richieste per testare.

### Comando (ripetere 6 volte rapidamente)

```bash
for i in {1..6}; do
  echo "Request $i:"
  curl -s -X POST https://www.lswebagency.com/api/contact \
    -F "name=Test User" \
    -F "email=test@example.com" \
    -F "message=Questo è un messaggio di test" \
    -F "privacy=on" | jq
  echo ""
done
```

### Risposta attesa (dopo limite superato)

- **Status**: `429 Too Many Requests`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "ok": false,
    "message": "Troppi tentativi. Riprova più tardi."
  }
  ```

### Verifica

- ✅ Status 429 dopo limite superato
- ✅ JSON valido
- ✅ Messaggio chiaro

---

## Checklist QA Completa

### Funzionalità

- [ ] GET `/api/contact` risponde 200 con JSON valido
- [ ] POST `/api/contact` con dati validi risponde 200 con JSON
- [ ] POST `/api/contact` con dati invalidi risponde 400 con JSON
- [ ] Metodi non supportati (PUT, DELETE, ecc.) rispondono 405 con JSON
- [ ] Tutte le risposte hanno `Content-Type: application/json`
- [ ] Tutte le risposte hanno struttura coerente: `{ ok: boolean, message: string }`

### Robustezza

- [ ] Il frontend gestisce correttamente risposte JSON non valide
- [ ] Il frontend mostra messaggi di errore chiari
- [ ] Non compaiono errori "Unexpected token" in console
- [ ] Rate limiting funziona (429 dopo limite)
- [ ] Honeypot anti-spam funziona

### Produzione (Vercel)

- [ ] Endpoint non restituisce 404
- [ ] Endpoint è raggiungibile
- [ ] Risposte JSON sono valide
- [ ] Headers sono corretti
- [ ] Build Vercel include le API routes

---

## Note Tecniche

### Adapter Vercel

Il progetto usa `@astrojs/vercel` (non più `@astrojs/vercel/serverless` deprecato).

### Configurazione

- `astro.config.ts`: `output: 'server'`, `adapter: vercel()`
- `src/pages/api/contact.ts`: `export const prerender = false;`

### Variabili d'ambiente richieste (produzione)

- `GMAIL_USER`: Email Gmail per invio
- `GMAIL_APP_PASS`: App password Gmail

---

## Troubleshooting

### Endpoint restituisce 404

1. Verifica che `astro.config.ts` abbia `output: 'server'` e `adapter: vercel()`
2. Verifica che il file `src/pages/api/contact.ts` esista
3. Verifica che `export const prerender = false;` sia presente
4. Rigiungi il deploy su Vercel
5. Controlla i log Vercel per errori di build

### Risposta non è JSON

1. Verifica che tutti i `return new Response()` abbiano `headers: { 'Content-Type': 'application/json' }`
2. Verifica che il body sia sempre `JSON.stringify(...)`
3. Controlla i log server per errori

### Frontend crasha con "Unexpected token"

1. Verifica che il form usi parsing robusto (`await response.text()` + `JSON.parse()`)
2. Verifica gestione try/catch per parsing
3. Verifica fallback per risposte non JSON

