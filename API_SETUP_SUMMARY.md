# Riepilogo Setup API - Form Contatti

## File Modificati

### 1. `src/pages/api/contatti.ts` (NUOVO)
Endpoint API che accetta POST JSON per il form contatti.

**Caratteristiche**:
- Accetta POST con `Content-Type: application/json`
- Valida campi (nome min 2, email valida, messaggio min 10, privacy obbligatoria)
- Honeypot anti-spam (campo "company")
- Rate limiting in-memory (max 5 richieste/ora per IP)
- Supporto multipli provider email (priorità: Gmail → Resend → Brevo → fallback log)
- Risponde sempre JSON con `{ ok: boolean, message: string }`

**Variabili ambiente supportate**:
- `GMAIL_USER` + `GMAIL_APP_PASS` → usa Nodemailer/Gmail
- `RESEND_API_KEY` → usa Resend
- `BREVO_API_KEY` → usa Brevo
- Se nessun provider: log su console e risponde 200 OK

### 2. `src/pages/contatti.astro` (MODIFICATO)
Form contatti aggiornato per usare JSON e chiamare `/api/contatti`.

**Modifiche**:
- `action="/api/contatti"` (era `/api/contact`)
- Fetch con `Content-Type: application/json`
- Body: JSON invece di FormData
- Gestione stati: loading, success, error (già presente)

### 3. `astro.config.ts` (VERIFICATO)
Configurazione corretta:
- `output: 'server'` ✅
- `adapter: vercel({ mode: 'serverless' })` ✅

### 4. `src/pages/api/ping.ts` (VERIFICATO)
Endpoint ping esistente e corretto:
- GET e POST handler
- Risponde `{ ok: true, route: '/api/ping', ts: Date.now() }`

---

## Codice Completo Endpoint

### `/api/ping.ts`

```typescript
// src/pages/api/ping.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ ok: true, route: '/api/ping', ts: Date.now() }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }
  );
};

export const POST: APIRoute = async () => {
  return new Response(
    JSON.stringify({ ok: true, route: '/api/ping', ts: Date.now() }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }
  );
};
```

### `/api/contatti.ts`

Vedi file `src/pages/api/contatti.ts` per il codice completo.

**Struttura**:
1. Rate limiting (in-memory)
2. Validazione Content-Type (deve essere JSON)
3. Parse JSON body
4. Honeypot check
5. Validazione campi
6. Invio email (Gmail → Resend → Brevo → log)
7. Risposta JSON

---

## Modifiche Form

### `src/pages/contatti.astro`

**Action form**:
```html
<form id="contact-form" method="POST" action="/api/contatti" ...>
```

**JavaScript fetch**:
```javascript
const formData = new FormData(form);
const data = {
  name: formData.get('name') || '',
  email: formData.get('email') || '',
  phone: formData.get('phone') || '',
  service: formData.get('service') || '',
  message: formData.get('message') || '',
  privacy: formData.get('privacy') === 'on',
  company: formData.get('company') || '', // honeypot
};

const response = await fetch('/api/contatti', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

**Gestione stati**:
- Loading: disabilita bottone, mostra spinner
- Success: mostra messaggio successo, reset form, redirect a `/grazie` dopo 2s
- Error: mostra messaggio errore, mantiene dati form

---

## Test

### Test Ping
```bash
curl -sI https://www.lswebagency.com/api/ping | head -n 15
```

**Output atteso**:
```
HTTP/2 200
content-type: application/json; charset=utf-8
```

### Test Contatti GET
```bash
curl -i https://www.lswebagency.com/api/contatti | head -n 15
```

**Output atteso**:
```
HTTP/2 200
content-type: application/json; charset=utf-8
{ "ok": true, "route": "/api/contatti", "message": "..." }
```

### Test Contatti POST
```bash
curl -i -X POST https://www.lswebagency.com/api/contatti \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@example.com","message":"Hello world test message","privacy":true}' | head -n 20
```

**Output atteso**:
```
HTTP/2 200
content-type: application/json; charset=utf-8
{ "ok": true, "message": "Messaggio inviato con successo." }
```

---

## Verifica vercel.json

**Nota**: `vercel.json` è stato rimosso (non presente nel repository).

Se viene ricreato, assicurarsi che:
- ❌ NON ci siano rewrites che catturano `/api/*`
- ❌ NON ci sia fallback SPA che interferisce con le API
- ✅ Headers e redirects sono OK (non interferiscono con `/api/*`)

---

## Checklist

- [x] `astro.config.ts`: `output: 'server'`, `adapter: vercel({ mode: 'serverless' })`
- [x] `/api/ping.ts`: esiste e risponde 200
- [x] `/api/contatti.ts`: creato, accetta JSON, valida, anti-spam, email providers
- [x] Form contatti: chiama `/api/contatti` con JSON
- [x] Form gestisce stati: loading, success, error
- [x] `vercel.json`: non presente (non interferisce)

---

## Risultato Finale

Dopo deploy:

- ✅ `/api/ping` → 200 OK
- ✅ `/api/contatti` → 200 OK (GET e POST)
- ✅ Form contatti funziona correttamente
- ✅ Gestione errori robusta
- ✅ Anti-spam (honeypot + rate limit)
- ✅ Supporto multipli provider email (con fallback log)


