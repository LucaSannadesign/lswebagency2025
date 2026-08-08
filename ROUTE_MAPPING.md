# Analisi Route: Versione Precedente vs Attuale

> ## ⛔ Decisione vigente (8 agosto 2026) — Local SEO Booster
>
> Il redirect **`/servizi/local-seo-booster` → `/servizi/seo-locale` NON deve essere implementato.**
>
> - `/servizi/local-seo-booster` resta una **pagina autonoma** (pacchetto operativo: Google Business Profile, recensioni, citazioni, tracking, con deliverable e tempi).
> - `/servizi/seo-locale` resta una **pagina autonoma** (hub: approccio e priorità della SEO locale).
> - La decisione attuale è **mantenerle distinte**, con link interni reciproci.
> - Un eventuale consolidamento futuro richiede una **nuova analisi SEO/editoriale** (intento di ricerca, keyword, rischio canibalizzazione, link interni, dati di traffico) prima di introdurre qualsiasi redirect.
>
> Le raccomandazioni di redirect verso `/servizi/seo-locale` presenti più sotto sono **superate** e restano solo come storico. Vedi anche `REDIRECT_IMPLEMENTATION.md`.

## 1. Route della Versione Precedente (Menu Navigazione)

Basato su `nav-old.ts` e struttura esistente:

### Pagine Principali:
- `/` ✅ (esiste)
- `/chi-siamo` ✅ (esiste)
- `/servizi` ✅ (esiste)
- `/portfolio` ✅ (esiste)
- `/blog` ✅ (esiste)
- `/contatti` ✅ (esiste)

### Servizi (Menu Navigazione Vecchio):
- `/servizi/creazione-siti-web-sassari` ✅ (esiste ancora, ma non più nel menu principale)
- `/servizi/realizzazione-siti-ecommerce` ✅ (esiste ancora, ma non più nel menu principale)
- `/servizi/branding-e-grafica-siti-web` ✅ (esiste ancora, ma non più nel menu principale)
- `/servizi/ottimizzazione-seo-siti-web` ✅ (esiste ancora, ma non più nel menu principale)
- `/voucher-digitali-sardegna` ⚠️ (già redirect in vercel.json → /servizi/voucher-digitali-sassari)

## 2. Route della Versione Attuale (Menu Navigazione)

Basato su `src/navigation.ts`:

### Pagine Principali:
- `/` ✅
- `/servizi/siti-web` ✅ (NUOVO - servizio principale)
- `/servizi/seo-locale` ✅ (NUOVO - servizio principale)
- `/servizi/assistenza-manutenzione` ✅ (NUOVO - servizio principale)
- `/portfolio` ✅
- `/contatti` ✅

### Servizi Secondari (esistono ma non nel menu):
- `/servizi/creazione-siti-web-sassari` ✅
- `/servizi/local-seo-booster` ✅ (pagina autonoma e distinta da `seo-locale`: pacchetto operativo vs hub di approccio)
- `/servizi/realizzazione-siti-ecommerce` ✅
- `/servizi/branding-e-grafica-siti-web` ✅
- `/servizi/ottimizzazione-seo-siti-web` ✅
- Altri servizi avanzati...

## 3. Tabella Mapping URL

| URL Vecchio | Esiste Ora? | Nuova Destinazione Consigliata | Tipo Intervento | Note |
|------------|-------------|-------------------------------|-----------------|------|
| `/servizi/creazione-siti-web-sassari` | ✅ Sì | `/servizi/siti-web` | **301 redirect** | Pagina esiste ma non più nel menu. La nuova pagina `/servizi/siti-web` è il servizio principale equivalente |
| `/servizi/local-seo-booster` | ✅ Sì | — (nessuna) | ⛔ **Nessun redirect** | ~~301 verso `/servizi/seo-locale`~~ **superato**. Le due pagine restano autonome e distinte: booster = pacchetto operativo, seo-locale = hub di approccio. Consolidamento futuro solo dopo nuova analisi SEO/editoriale |
| `/servizi/assistenza-e-manutenzione` | ❌ No | `/servizi/assistenza-manutenzione` | **301 redirect** | URL con trattino diverso (e-manutenzione vs manutenzione) |
| `/servizi/local-seo` | ❌ No | `/servizi/seo-locale` | **301 redirect** | Già presente in vercel.json → `/servizi/local-seo-booster`, ma ora dovrebbe puntare a `/servizi/seo-locale` |
| `/chi-siamo` | ✅ Sì | Mantenere | Nessuno | Pagina esiste, potrebbe non essere nel menu ma è accessibile |

### Note Importanti:

1. **`/servizi/creazione-siti-web-sassari`**: 
   - Esiste ancora come pagina
   - Ma ora il servizio principale è `/servizi/siti-web`
   - **Raccomandazione**: Redirect a `/servizi/siti-web` per evitare duplicazione di contenuto SEO

2. **`/servizi/local-seo-booster`** — ⛔ raccomandazione superata:
   - Esiste come pagina autonoma, indicizzabile e mantenuta
   - `/servizi/seo-locale` è l'hub di approccio; `/servizi/local-seo-booster` è il pacchetto operativo: intento di ricerca e fase del funnel diversi
   - ~~**Raccomandazione**: Redirect a `/servizi/seo-locale` per evitare duplicazione~~
   - **Decisione attuale**: **nessun redirect**. Le due pagine restano distinte e collegate tra loro da link interni. Un eventuale consolidamento futuro richiede una nuova analisi SEO/editoriale prima di introdurre qualsiasi redirect

3. **`/servizi/assistenza-e-manutenzione`**:
   - URL con formato diverso (trattino "e" invece di solo trattino)
   - La pagina corretta è `/servizi/assistenza-manutenzione`
   - **Raccomandazione**: Redirect per gestire variante URL

4. **Servizi secondari** (ecommerce, branding, seo ottimizzazione):
   - Esistono ancora come pagine
   - Non più nel menu principale ma accessibili
   - **Raccomandazione**: Nessun redirect, lasciare accessibili come risorse secondarie

## 4. Redirect da Implementare

Priorità Alta (servizi principali rinominati):
1. `/servizi/creazione-siti-web-sassari` → `/servizi/siti-web` (301)
2. ~~`/servizi/local-seo-booster` → `/servizi/seo-locale` (301)~~ — ⛔ **ANNULLATO, non implementare.** Le due pagine restano autonome; consolidamento solo dopo nuova analisi SEO/editoriale
3. `/servizi/assistenza-e-manutenzione` → `/servizi/assistenza-manutenzione` (301)

Priorità Media (varianti URL):
4. `/servizi/local-seo` → `/servizi/seo-locale` (301) - aggiornare redirect esistente
5. `/servizi/creazione-siti-web` → `/servizi/siti-web` (301) - se esiste
6. `/servizi/assistenza` → `/servizi/assistenza-manutenzione` (301) - se esiste

## 5. Link Interni da Verificare

Da verificare se ci sono link interni che puntano a:
- ~~`/servizi/local-seo-booster` (potrebbe puntare a `/servizi/seo-locale`)~~ — ⛔ **superato**: i link interni a `/servizi/local-seo-booster` sono corretti e vanno mantenuti, non riscritti verso `/servizi/seo-locale`
- `/servizi/creazione-siti-web-sassari` (potrebbe puntare a `/servizi/siti-web`)
- `/servizi/assistenza-e-manutenzione` (dovrebbe essere `/servizi/assistenza-manutenzione`)


