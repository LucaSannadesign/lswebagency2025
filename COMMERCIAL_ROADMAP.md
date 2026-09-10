# LS Web Agency — Commercial Roadmap

Last update: 2026-09-10

## STEP CORRENTE
1 — VERIFICA TECNICA/SEO

## COSA È STATO FATTO
- [x] Verificata la configurazione sitemap nel repository `lswebagency2025`.
- [x] Verificato `robots.txt` e riferimento alla sitemap canonica.
- [x] Verificata la presenza della route autorevole `src/pages/sitemap.xml.ts`.
- [x] Verificato che `astro.config.ts` dichiara `https://www.lswebagency.com` come site origin e che la sitemap legacy di `@astrojs/sitemap` è stata rimossa.
- [x] Verificato che `/mini-analisi` è inclusa nella sitemap XML insieme alle principali pagine commerciali e servizi.

## EVIDENZA
- `public/robots.txt` → `Sitemap: https://www.lswebagency.com/sitemap.xml`.
- `astro.config.ts` → `site: 'https://www.lswebagency.com'`; commento esplicito: sitemap autorevole generata da `src/pages/sitemap.xml.ts`.
- `src/pages/sitemap.xml.ts` → route prerendered, deduplica URL, include `/mini-analisi`, pagine statiche, servizi, blog, portfolio e local pubblicate.
- Audit storico `AUDIT_REPORT.md`: build senza errori critici; la pagina `sprint-ottimizzazione` era stata identificata come orfana nel vecchio audit, ma oggi è presente nella sitemap XML. Serve ancora verifica attuale dell'internal linking prima di chiudere Step 1.

## COSA MANCA
- [ ] Verifica live HTTP di `https://www.lswebagency.com/sitemap.xml` e `robots.txt` (status/content).
- [ ] Google Search Console: copertura/indicizzazione delle nuove pagine e articoli, se il connettore/proprietà è disponibile.
- [ ] Audit attuale di canonical, title/meta description, Open Graph/Twitter card sulle pagine commerciali chiave.
- [ ] Verifica attuale di eventuali pagine orfane/errori tecnici che ostacolano discovery o conversione.

## RISULTATO RUN 2026-09-10
READY_FOR_REVIEW — micro-step sitemap/robots completato a livello repository; la chiusura dello Step 1 richiede i controlli live e metadata sopra elencati.

## PROSSIMO MICRO-STEP
Verificare canonical + title/meta description + Open Graph/Twitter card della home, `/mini-analisi`, `/servizi` e una pagina/articolo recente; registrare anomalie P0/P1 e preparare un fix solo se necessario.

## CLIENT ACQUISITION P0/P1
Nessun P0/P1 commerciale verificato in questo run.

## DIGITAL PRODUCT
Non lavorato in questo run: priorità superiore alla Roadmap Commerciale LS Web Agency finché gli step 1–5 non sono completati o formalmente bloccati.
