# LS Web Agency — Commercial Roadmap

Last update: 2026-11-20

## STEP CORRENTE
2 — COMPLETAMENTO COLLAUDO CONVERSIONE E AVVIO ACQUISIZIONE (PR #49; non in produzione)

## SESSIONE 2026-11-20 — CICLO DI ACQUISIZIONE

**Ambito:** www.lswebagency.com, nessuna modifica o invio di contatti in produzione.

### Risultati documentati
- [x] Ricontrollati live `robots.txt` e `sitemap.xml`: sitemap raggiungibile e `/mini-analisi` presente (verifica browser 20/11/2026).
- [x] Landing `/mini-analisi` già attiva: widget guidato, endpoint `/api/mini-analisi` e notifica amministrativa.
- [x] Controllati il codice server/client e l'endpoint, incluso il recupero su email quando il CRM fallisce.
- [x] Letto il CRM Supabase in sola lettura: 239 lead, 10 marcati mini-analisi, nessuno nuovo mini-analisi negli ultimi 30 giorni; i tre potenziali lead non archiviati senza etichetta test fanno riferimento a indirizzi/progetti interni e NON sono prospect commerciabili.
- [x] Correzione preparata in **PR #49 (draft)**: messaggio corretto per recupero via email e evento non-PII `lswa_mini_analisi_received` da collegare a GTM/GA4.
- [x] Aggiunto workflow CI PR: esecuzione 44747861442 **SUCCESS** (test unitari); deploy preview per commit 54d3e075 **READY** su Vercel.
- [x] Identificati 2 prospect esterni già presenti nel registro: Il Cenacolo e Trattoria Loludà, Sassari. I siti Eatbu sono pubblici; osservazioni commerciali: presenza su dominio di terzi e copy/identità da valutare. Per Il Cenacolo compare nel menu di navigazione un link 'Menù Capodanno 2023', da verificare prima di qualsiasi proposta.
- [x] Ricerca storica sulle email delle due attività: nessuna corrispondenza nelle quattro caselle Gmail consultabili e nei registri inbound/outbound LSWA; collegamento PreventivoDentale ancora non leggibile.
- [x] Verificato vincolo privacy: il recapito email pubblico non autorizza invii promozionali non richiesti; art. 130 Codice privacy, cfr. provvedimento Garante 20/10/2026 https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/10313574

### Da chiudere prima della promozione
- [ ] Esito di un test end-to-end controllato su preview, senza contaminare CRM production.
- [ ] Configurare in GTM trigger dell'evento `lswa_mini_analisi_received`, tag GA4 `generate_lead`, e verificare in Tag Assistant / GA4 DebugView dopo consenso; non assumere che la sola dataLayer push misuri le conversioni.
- [ ] Review, merge e verifica post-deploy della PR #49 soltanto dopo via libera al rilascio e test.
- [ ] Trasformare i due micro-audit in contenuti/proposte personalizzate, evitando email promozionali a freddo senza base valida.
- [ ] Preparare il primo contenuto social 'Perché il tuo sito non porta richieste?' con CTA `/mini-analisi`, poi pubblicare soltanto previa approvazione.

**Metriche da monitorare:** visite landing, completamenti, salvataggi CRM, richieste qualificate esterne, preventivi, contratti paganti. Non conteggiare test o lead interni come acquisizioni.

---

## COSA È STATO FATTO
- [x] Verificata la configurazione sitemap nel repository `lswebagency2025`.
- [x] Verificato `robots.txt` e riferimento alla sitemap canonica.
- [x] Verificata la presenza della route autorevole `src/pages/sitemap.xml.ts`.
- [x] Verificato che `astro.config.ts` dichiara `https://www.lswebagency.com` come site origin e che la sitemap legacy di `@astrojs/sitemap` è stata rimossa.
- [x] Verificato che `/mini-analisi` è inclusa nella sitemap XML insieme alle principali pagine commerciali e servizi.
- [x] Audit live metadata/indexability su home, `/mini-analisi`, `/servizi` e articolo recente `google-maps-attivita-locali-controlli-seo-locale`.
- [x] Verificati canonical self-referencing, HTTP 200, indexability, H1 unico e assenza di errori SEO critical/high sulle quattro URL campione.
- [x] Verificata l'implementazione globale di Open Graph/Twitter in `src/layouts/Layout.astro` e i metadata specifici delle pagine campione nel repository.

## EVIDENZA
- `public/robots.txt` → `Sitemap: https://www.lswebagency.com/sitemap.xml`.
- `astro.config.ts` → `site: 'https://www.lswebagency.com'`; commento esplicito: sitemap autorevole generata da `src/pages/sitemap.xml.ts`.
- `src/pages/sitemap.xml.ts` → route prerendered, deduplica URL, include `/mini-analisi`, pagine statiche, servizi, blog, portfolio e local pubblicate.
- Audit live GSC Wizard 2026-09-11: 4/4 URL HTTP 200, indexabili, canonical self, 0 issue critical/high/medium; 4 issue low complessive.
- Home: title 56 caratteri, meta description 144, canonical self, structured data presente, nessun issue rilevato.
- `/servizi`: title 46, meta description 141, canonical self; unico finding low = structured data assente.
- `/mini-analisi`: title 45, canonical self; finding low: meta description 215 caratteri (possibile troncamento) e structured data assente.
- Articolo Google Maps (07/07/2026): canonical self, meta description 145, structured data completa; finding low: title 88 caratteri (possibile troncamento).
- `src/layouts/Layout.astro` genera sempre canonical, `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, con fallback globale; home e `/servizi` hanno anche configurazioni social specifiche, mentre `/mini-analisi` usa il fallback globale per l'immagine social.
- Nessuno dei finding low rilevati costituisce oggi un blocco di discovery o conversione; non è stato aperto un fix tecnico in questo run per evitare modifiche non prioritarie.

## COSA MANCA
- [ ] Verifica live HTTP di `https://www.lswebagency.com/sitemap.xml` e `robots.txt` (status/content) se non già coperta da un controllo live equivalente.
- [ ] Google Search Console: copertura/indicizzazione delle nuove pagine e articoli.
- [ ] Verifica attuale di eventuali pagine orfane/errori tecnici che ostacolano discovery o conversione.
- [ ] Ottimizzazione non bloccante futura: accorciare la meta description di `/mini-analisi` (~150–160 caratteri) e valutare un title SEO più compatto per l'articolo Google Maps.

## RISULTATO RUN 2026-09-11
COMPLETATO — micro-step canonical + title/meta + Open Graph/Twitter sulle quattro URL campione. Nessun errore critical/high/medium; solo ottimizzazioni low non bloccanti.

## PROSSIMO MICRO-STEP
Usare Google Search Console per verificare copertura/indicizzazione di `/mini-analisi`, `/servizi`, home e dei contenuti recenti; distinguere URL indicizzate, scoperte ma non indicizzate e assenti. Aprire un intervento solo se emerge un problema reale.

## CLIENT ACQUISITION P0/P1
Verifica diretta CRM tentata nel run 2026-09-11, ma la query read-only al progetto Supabase `jzluttmlyailndrhmedh` è stata bloccata dal livello di sicurezza dello strumento prima dell'esecuzione. Nessun P0/P1 nuovo può quindi essere attestato da quella fonte in questo run.

## DIGITAL PRODUCT
Non lavorato in questo run: priorità superiore alla Roadmap Commerciale LS Web Agency finché gli step 1–5 non sono completati o formalmente bloccati.
