# Fix Domain Assignment e Deployment Protection - Vercel

## Analisi del Problema

### Sintomi
- ✅ **Locale**: `/api/ping` → 200 OK (funziona)
- ❌ **Dominio custom** (`www.lswebagency.com`): `/api/ping` → 404 NOT_FOUND
- ⚠️ **Deployment URL** (`lswebagency-<id>.vercel.app`): `/api/ping` → 401 UNAUTHORIZED

### Diagnosi

Il 404 su dominio custom + 401 su deployment URL indica due problemi distinti:

1. **404 su dominio custom**: Il dominio `www.lswebagency.com` (e/o `lswebagency.com`) è assegnato a un **progetto diverso** da quello dove sono deployate le API routes. Vercel sta servendo un progetto vecchio/statico che non ha le API routes.

2. **401 su deployment URL**: "Deployment Protection" o "SSO Protection" è attiva per Production deployments. Questo blocca l'accesso senza autenticazione.

### Perché succede?

- I domini possono essere assegnati a progetti diversi (anche su team diversi)
- Se il dominio punta a un progetto senza SSR/API, ottieni 404
- Deployment Protection blocca l'accesso pubblico ai deployment URLs (401)
- Il dominio custom bypassa la protection, ma punta al progetto sbagliato

---

## Soluzione Step-by-Step

### STEP 1: Identificare il Progetto Corretto

#### Opzione A: Via CLI (Vercel CLI)

```bash
# Installa Vercel CLI se non presente
npm i -g vercel

# Login
vercel login

# Lista tutti i progetti (include team diversi)
vercel projects ls

# Lista progetti del team corrente
vercel projects ls --scope <team-name>

# Verifica domini del progetto "lswebagency"
vercel domains ls lswebagency
```

**Output atteso**:
```
Domain                        Project          Type
www.lswebagency.com          lswebagency      alias
lswebagency.com              lswebagency      alias
```

**Se vedi domini assegnati a un progetto diverso**: prendi nota del nome del progetto.

#### Opzione B: Via Dashboard Vercel

1. Vai su https://vercel.com/dashboard
2. **Cerca il progetto "lswebagency"** nella lista
3. Clicca sul progetto
4. Vai su **Settings → Domains**
5. Verifica quali domini sono assegnati

---

### STEP 2: Trovare Dove Sono Assegnati i Domini (Progetto Sbagliato)

#### Via Dashboard (tutti i progetti)

1. **Vercel Dashboard → Settings → Domains** (a livello di team/account)
   - URL: https://vercel.com/domains
   - Mostra tutti i domini assegnati a tutti i progetti del team

2. **Cerca `lswebagency.com` e `www.lswebagency.com`**
   - Vedi a quale progetto sono assegnati
   - Se sono su un progetto diverso da "lswebagency", prendi nota

#### Via CLI

```bash
# Lista tutti i domini del team
vercel domains ls

# Output mostra: Domain | Project | Type
# Cerca lswebagency.com e www.lswebagency.com
```

---

### STEP 3: Rimuovere Domini dal Progetto Sbagliato

#### Via Dashboard

1. Vai al **progetto sbagliato** (quello dove sono attualmente i domini)
2. **Settings → Domains**
3. Per ogni dominio (`lswebagency.com` e `www.lswebagency.com`):
   - Clicca sui tre puntini (⋮) accanto al dominio
   - Seleziona **"Remove"** o **"Delete"**
   - Conferma la rimozione

#### Via CLI

```bash
# Rimuovi dominio dal progetto sbagliato
vercel domains rm www.lswebagency.com <wrong-project-name>
vercel domains rm lswebagency.com <wrong-project-name>
```

**Nota**: Se i domini sono su un team diverso, devi prima fare `vercel teams switch <team-name>` o `vercel teams add`.

---

### STEP 4: Aggiungere Domini al Progetto Corretto "lswebagency"

#### Via Dashboard (Consigliato)

1. Vai al progetto **"lswebagency"**
2. **Settings → Domains**
3. Clicca **"Add Domain"**
4. Aggiungi prima **`www.lswebagency.com`**
   - Vercel verifica automaticamente il DNS
   - Seleziona **"Add"**
5. Aggiungi poi **`lswebagency.com`** (apex domain)
   - Vercel verifica automaticamente il DNS
   - Seleziona **"Add"**

#### Via CLI

```bash
# Assicurati di essere nel progetto corretto
cd /path/to/lswebagency

# Aggiungi dominio www (primary)
vercel domains add www.lswebagency.com lswebagency

# Aggiungi dominio apex
vercel domains add lswebagency.com lswebagency
```

---

### STEP 5: Configurare Primary Domain e Redirect Apex → WWW

#### Via Dashboard

1. Nel progetto "lswebagency", vai su **Settings → Domains**
2. Trova `www.lswebagency.com`
3. Clicca sui tre puntini (⋮) → **"Set as Primary"**
   - Questo rende `www.lswebagency.com` il dominio primario
4. Per `lswebagency.com` (apex):
   - Verifica che ci sia l'opzione **"Redirect to www"** o **"Redirect"**
   - Se presente, attivala
   - Se non presente, Vercel gestisce automaticamente il redirect se entrambi i domini sono assegnati

**Nota**: Vercel di default redirecta apex → www se entrambi sono assegnati allo stesso progetto e www è primary.

#### Verifica DNS

Se i domini sono gestiti da Vercel (nameservers Vercel), non devi fare nulla. Se gestisci DNS esternamente:

1. **Per `www.lswebagency.com`**: CNAME → `cname.vercel-dns.com`
2. **Per `lswebagency.com`**: 
   - **A record** → `76.76.21.21` (Vercel apex)
   - **Oppure ALIAS/ANAME** → `cname.vercel-dns.com` (se supportato dal registrar)

Vercel Dashboard → Settings → Domains mostra le istruzioni DNS precise.

---

### STEP 6: Disabilitare Deployment Protection per Production

#### Via Dashboard

1. Nel progetto "lswebagency", vai su **Settings → Deployment Protection**
2. Trova la sezione **"Production"** (o **"All Deployments"**)
3. Verifica se è attiva:
   - **"Password Protection"**
   - **"Vercel Authentication"**
   - **"SSO Protection"**
4. Per Production:
   - **Disabilita** tutte le protezioni (o almeno Password/SSO)
   - Lascia attiva solo se necessario per sicurezza (es. staging)
5. **Salva** le modifiche

**Nota**: Deployment Protection è utile per Preview/Staging, ma non per Production se vuoi accesso pubblico.

#### Via CLI (se supportato)

```bash
# Verifica protection status
vercel project ls lswebagency

# Non c'è comando CLI diretto per deployment protection,
# usa il Dashboard per questa configurazione
```

#### Alternative: Disabilitare solo per Deployment URLs

Se vuoi mantenere protection su preview deployments ma non su production:

1. **Settings → Deployment Protection**
2. **"Production"**: Disabilita
3. **"Preview"**: Mantieni abilitata (opzionale)

---

### STEP 7: Redeploy e Verifica

#### Redeploy

##### Via Dashboard
1. Vai su **Deployments**
2. Trova l'ultimo deployment (Production)
3. Clicca sui tre puntini (⋮) → **"Redeploy"**
4. Conferma **"Redeploy"**

##### Via CLI
```bash
# Nel progetto
cd /path/to/lswebagency

# Redeploy production
vercel --prod
```

##### Via Git (se hai Git integration)
```bash
# Fai un commit dummy o push
git commit --allow-empty -m "Trigger redeploy for domain fix"
git push
```

#### Verifica DNS Propagation (se necessario)

```bash
# Verifica DNS per www
dig www.lswebagency.com +short

# Verifica DNS per apex
dig lswebagency.com +short

# Output atteso: IP Vercel o CNAME a vercel-dns.com
```

**Nota**: DNS propagation può richiedere fino a 48h (solitamente 5-15 minuti).

---

### STEP 8: Test Finale

#### Test Dominio Custom

```bash
# Test ping (HEAD)
curl -sI https://www.lswebagency.com/api/ping | head -n 10

# Output atteso:
# HTTP/2 200
# content-type: application/json; charset=utf-8

# Test ping (GET con body)
curl -i https://www.lswebagency.com/api/ping | head -n 15

# Output atteso:
# HTTP/2 200
# content-type: application/json; charset=utf-8
# { "ok": true, "route": "/api/ping", "ts": 1234567890 }

# Test apex redirect
curl -sI https://lswebagency.com/api/ping | head -n 5

# Output atteso:
# HTTP/2 301 (redirect) o HTTP/2 200 (se serve direttamente)
# location: https://www.lswebagency.com/api/ping
```

#### Test Deployment URL (dovrebbe funzionare ora)

```bash
# Trova deployment URL dal dashboard o CLI
vercel ls lswebagency

# Test (dovrebbe essere 200, non 401)
curl -i https://lswebagency-<id>.vercel.app/api/ping | head -n 15
```

---

## Checklist Completa

### Pre-Fix
- [ ] Identificato progetto corretto "lswebagency"
- [ ] Verificato dove sono assegnati `www.lswebagency.com` e `lswebagency.com`
- [ ] Confermato che domini sono su progetto sbagliato

### Fix Domini
- [ ] Rimosso `www.lswebagency.com` dal progetto sbagliato
- [ ] Rimosso `lswebagency.com` dal progetto sbagliato
- [ ] Aggiunto `www.lswebagency.com` al progetto "lswebagency"
- [ ] Aggiunto `lswebagency.com` al progetto "lswebagency"
- [ ] Impostato `www.lswebagency.com` come Primary Domain
- [ ] Verificato redirect apex → www (automatico o manuale)

### Fix Deployment Protection
- [ ] Disabilitato Deployment Protection per Production
- [ ] Verificato che Preview può mantenere protection (opzionale)

### Post-Fix
- [ ] Eseguito redeploy
- [ ] Atteso propagazione DNS (se necessario, 5-15 min)
- [ ] Testato `curl -sI https://www.lswebagency.com/api/ping` → 200
- [ ] Testato `curl -sI https://lswebagency.com/api/ping` → 200 o 301
- [ ] Testato deployment URL → 200 (non 401)

---

## Comandi CLI Riepilogativi

```bash
# 1. Login e verifica progetti
vercel login
vercel projects ls

# 2. Verifica domini del progetto
vercel domains ls lswebagency

# 3. Lista tutti i domini (per trovare progetto sbagliato)
vercel domains ls

# 4. Rimuovi domini dal progetto sbagliato
vercel domains rm www.lswebagency.com <wrong-project>
vercel domains rm lswebagency.com <wrong-project>

# 5. Aggiungi domini al progetto corretto
cd /path/to/lswebagency
vercel domains add www.lswebagency.com lswebagency
vercel domains add lswebagency.com lswebagency

# 6. Redeploy
vercel --prod

# 7. Verifica
curl -sI https://www.lswebagency.com/api/ping
```

---

## Punti Precisi Dashboard Vercel

### Per Trovare Domini Assegnati
1. **Dashboard → Settings (icona ingranaggio in alto a destra)**
2. **Domains** (sidebar sinistra)
3. Cerca `lswebagency.com` nella lista

### Per Gestire Domini di un Progetto
1. **Dashboard → [Nome Progetto]**
2. **Settings** (tab)
3. **Domains** (sidebar sinistra)
4. **Add Domain** (pulsante in alto)
5. Per rimuovere: tre puntini (⋮) → **Remove**
6. Per primary: tre puntini (⋮) → **Set as Primary**

### Per Deployment Protection
1. **Dashboard → [Nome Progetto]**
2. **Settings** (tab)
3. **Deployment Protection** (sidebar sinistra)
4. **Production** → Disabilita protezioni
5. **Save**

### Per Redeploy
1. **Dashboard → [Nome Progetto]**
2. **Deployments** (tab)
3. Trova deployment Production (ultimo)
4. Tre puntini (⋮) → **Redeploy**
5. Conferma

---

## Troubleshooting

### Domini ancora 404 dopo fix
- Verifica DNS propagation: `dig www.lswebagency.com`
- Attendi 5-15 minuti
- Verifica che domini siano assegnati al progetto corretto: `vercel domains ls lswebagency`

### Deployment URL ancora 401
- Verifica Deployment Protection: Settings → Deployment Protection
- Disabilita per Production
- Redeploy

### Domini non disponibili per rimozione
- Verifica permessi (devi essere Owner/Admin del progetto)
- Verifica team (potrebbero essere su team diverso)

### Redirect apex → www non funziona
- Vercel di default redirecta se entrambi i domini sono assegnati e www è primary
- Se non funziona, configura manualmente nel registrar DNS (redirect 301)

---

## Risultato Finale

Dopo tutti gli step:

- ✅ `https://www.lswebagency.com/api/ping` → 200 OK
- ✅ `https://lswebagency.com/api/ping` → 200 OK (o 301 → www)
- ✅ Deployment URL → 200 OK (non 401)
- ✅ Form contatti funziona su dominio custom
- ✅ Nessun errore 404 o 401




