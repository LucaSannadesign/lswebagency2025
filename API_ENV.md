# Variabili d'Ambiente per API Vercel

Questo documento elenca le variabili d'ambiente necessarie per le funzioni API serverless su Vercel.

## Variabili Richieste

### `RESEND_API_KEY`
- **Tipo**: String
- **Richiesto**: Sì
- **Descrizione**: API Key di Resend per l'invio email
- **Esempio**: `re_1234567890abcdefghijklmnopqrstuvwxyz`
- **Dove ottenerla**: [Resend Dashboard](https://resend.com/api-keys)

### `CONTACT_TO_EMAIL`
- **Tipo**: String (email valida)
- **Richiesto**: Sì
- **Descrizione**: Indirizzo email destinatario per i contatti dal sito
- **Esempio**: `info@lswebagency.com`

### `CONTACT_FROM_EMAIL`
- **Tipo**: String (email valida)
- **Richiesto**: No (fallback: `onboarding@resend.dev`)
- **Descrizione**: Indirizzo email mittente. Deve essere verificato su Resend
- **Esempio**: `noreply@lswebagency.com`
- **Nota**: Se non impostata, viene usato `onboarding@resend.dev` (solo per test)

## Variabili Opzionali

### `ALLOWED_ORIGIN`
- **Tipo**: String (URL)
- **Richiesto**: No (default: `*`)
- **Descrizione**: Origine permessa per CORS. Se non impostata, accetta tutte le origini
- **Esempio**: `https://www.lswebagency.com`
- **Nota**: Per produzione, è consigliabile impostare il dominio specifico

## Configurazione su Vercel

1. Vai al progetto su [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleziona il progetto `lswebagency`
3. Vai su **Settings** → **Environment Variables**
4. Aggiungi ogni variabile:
   - **Key**: nome della variabile (es. `RESEND_API_KEY`)
   - **Value**: valore della variabile
   - **Environment**: seleziona `Production`, `Preview`, `Development` (o tutte)
5. Clicca **Save**
6. **Redeploy** il progetto per applicare le modifiche

## Esempio Completo

```bash
RESEND_API_KEY=re_1234567890abcdefghijklmnopqrstuvwxyz
CONTACT_TO_EMAIL=info@lswebagency.com
CONTACT_FROM_EMAIL=noreply@lswebagency.com
ALLOWED_ORIGIN=https://www.lswebagency.com
```

## Verifica

Dopo il deploy, testa l'endpoint:

```bash
curl -X POST https://www.lswebagency.com/api/contatti \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Test User",
    "email": "test@example.com",
    "messaggio": "Messaggio di test con almeno 10 caratteri",
    "privacy": true
  }'
```

Risposta attesa: `{"ok":true,"emailSent":true,"provider":"resend","id":"..."}`


