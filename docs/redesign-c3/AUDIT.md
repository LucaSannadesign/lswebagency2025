# Redesign C.3 — Audit del progetto esistente

Branch: `feat/lswebagency-redesign-c3` · Base: `main@582d7da` · Data: 2026-11-23

Riferimenti progettuali: artifact «LS Web Agency · C.2 con portfolio aggiornato» e
«C.2 · confronto hero Vortex Field / Digital Ink» (motore `hero-fx.js`).

Ambito del redesign: **homepage** (`/`). Le altre ~90 pagine restano invariate in
questa fase; header, footer e token C.3 sono isolati e non toccano i componenti
condivisi (`Header.astro`, `Footer.astro`, `CustomStyles.astro`).

Legenda: **CONSERVARE** · **ADATTARE** · **RIMUOVERE** (solo dalla homepage, i file
restano) · **DA VERIFICARE**.

## 1. Navigazione e struttura

| Elemento | Dove | Decisione | Motivazione |
|---|---|---|---|
| Header sticky con hide-on-scroll | `widgets/Header.astro`, `common/BasicScripts.astro` | ADATTARE | Sulla home sostituito da `c3/C3Header.astro` (grafite, trasparente in cima, pieno allo scroll). Recuperato il comportamento hide-on-scroll e il «mai nascosto con focus da tastiera». Il componente originale resta per le altre pagine. |
| Voci menu (Home, Servizi + 8 sottovoci, Portfolio, Blog, Contatti) | `src/navigation.ts` | CONSERVARE | C3Header legge la stessa fonte (`headerData`): nessuna duplicazione, stessi URL reali (link interni SEO). Sottomenu Servizi come disclosure accessibile. |
| CTA header «Valutazione iniziale gratuita» → `/mini-analisi` | `navigation.ts` | CONSERVARE | Percorso di conversione principale. |
| Menu mobile (pannello + Escape) | `BasicScripts.astro` | ADATTARE | Overlay a tutto schermo C.2, con `aria-expanded`, Escape, focus restituito, blocco scroll. |
| Toggle tema chiaro/scuro | `common/ToggleTheme.astro` | ADATTARE | La home C.3 usa «capitoli» tonali progettati (grafite/carta): il toggle non compare sulla home; la preferenza salvata continua a valere sulle altre pagine. Al suo posto il toggle «Movimento». |
| Scroll-to-top | `layouts/PageLayout.astro` | CONSERVARE | Stesso pulsante e script (soglia 300px, reduced-motion, tastiera); solo restyling grafite/ione sulla home. |
| ClientRouter (view transitions) | `layouts/Layout.astro` | CONSERVARE | Gli script C.3 si inizializzano su `astro:page-load` e si fermano su `astro:before-swap` (nessun RAF/observer orfano). |
| Animazioni `intersect` | `BasicScripts.astro` | CONSERVARE | Restano per le altre pagine; la home usa reveal propri. |

## 2. Effetti, animazioni e microinterazioni

| Elemento | Decisione | Motivazione |
|---|---|---|
| Hero con griglia, glow, `DigitalFlow` animato | RIMUOVERE dalla home | Sostituiti dal campo generativo Vortex Field. File conservati (`HeroHome.astro`, `DigitalFlow.astro`). |
| Ingresso hero sfalsato (`heroIn`) | ADATTARE | Diventa il reveal riga per riga del titolo C.2. |
| Carosello recensioni (scroll-snap, frecce, contatore) | ADATTARE | Tutte le 9 recensioni conservate: una in evidenza + carosello con frecce e snap. |
| Hover/focus su card e CTA | ADATTARE | Riscritti sui token C.3, focus visibile 3px. |
| Gradient viola/fucsia | ADATTARE | Sulla home sostituiti da palette grafite + accento ione; il viola resta sul resto del sito (transizione graduale). |

## 3. Componenti interattivi e flottanti

| Elemento | Decisione | Motivazione |
|---|---|---|
| Assistente di sito (React, `client:idle`) | CONSERVARE | Montato globalmente da PageLayout, nessuna modifica. |
| Cookie banner + modale preferenze + `data-cookie-preferences` | CONSERVARE | Nessuna modifica alla logica di consenso; il footer C.3 mantiene «Gestisci preferenze cookie». |
| CTA personalizzata (`PersonalizedCta`, localStorage) | CONSERVARE | Inserita nel capitolo servizi; stile adattato via CSS di scope. |
| `PersonalizationTracker` | CONSERVARE | Globale, first-party. |
| CTA mobile sticky (da C.2) | NON ADOTTATA | Sul mobile il widget assistente occupa già tutta la fascia inferiore (e ne intercetta i click): una seconda barra fissa si sovrapporrebbe. La conversione resta su hero, sezioni, menu mobile e assistente. |

## 4. Moduli, CTA e percorsi di conversione

| Elemento | Decisione | Motivazione |
|---|---|---|
| Form home → `POST /api/contatti` (honeypot, phone/service strutturati, describeError, guardia doppio binding, `astro:page-load`) | CONSERVARE | Logica identica e resta in `index.astro`: è coperta da `tests/formHandlerBinding.test.mjs`. Solo markup/stile rivisti, stessi `name` e `required`. |
| Link WhatsApp, email, telefono | CONSERVARE | |
| Mini-analisi (`/mini-analisi`) come CTA primaria | CONSERVARE | |
| Card problema/offerta (4 ProblemCard, valutazione vs audit, 3 HomeCard, interventi studi dentistici, «Per chi è») | ADATTARE | Condensate nel capitolo «Da dove partire»: valutazione gratuita, audit 349 €, sprint su preventivo, sito strategico su preventivo; link settore dentale e white label; «Per chi è» nel capitolo Chi sono. Prezzi e URL invariati. |
| Sezione «Cosa cambia quando il sito è più chiaro» | RIMUOVERE dalla home | Concetto assorbito dalla scheda UX/UI interattiva (prima/dopo). |
| CTA finale viola | ADATTARE | Diventa il capitolo Contatti. |

## 5. API, CRM e integrazioni

| Elemento | Decisione | Motivazione |
|---|---|---|
| `/api/contatti`, `/api/mini-analisi`, `/api/process-fit-check`, `/api/site-assistant`, `/api/chat-profile`, `/api/contact` | CONSERVARE (codice invariato) | Nessuna modifica alla logica di produzione. |
| Guardia preview sulle email (`CONTACT_ALLOW_EMAIL_IN_PREVIEW`) | CONSERVARE | Già presente. |
| **Scritture CRM Supabase in preview** | ADATTARE | **Anomalia**: in preview le email sono bloccate ma gli insert su `leads`/audit no. Aggiunta guardia in `middleware.ts` attiva solo con `VERCEL_ENV=preview`: le POST verso `/api/*` ricevono una risposta simulata, senza CRM, email o servizi esterni. |
| Contact guard (origin, fetch metadata, UA, 24 KB) | CONSERVARE | |

## 6. Analytics, cookie e privacy

| Elemento | Decisione | Motivazione |
|---|---|---|
| Consent Mode v2 + GTM `GTM-T8LF93LT` | CONSERVARE in produzione | In preview non vengono caricati (evita dati di test nelle proprietà di produzione). |
| Ahrefs Analytics | CONSERVARE in produzione | Disattivato in preview. |
| Vercel Analytics | CONSERVARE in produzione | Disattivato in preview. |
| Font | ADATTARE | Archivo variabile self-hosted (`public/fonts`, licenza OFL), nessuna richiesta a Google Fonts. |

## 7. SEO, dati strutturati, redirect, sitemap

| Elemento | Decisione | Motivazione |
|---|---|---|
| Title, description, canonical `/`, OG, Twitter della home | CONSERVARE | Valori identici. |
| JSON-LD `ProfessionalService/LocalBusiness` | CONSERVARE | Invariato. |
| JSON-LD `FAQPage` | CONSERVARE | Le domande visibili restano allineate allo schema (una domanda aggiunta in entrambi). |
| H1 unico con «Siti web a Sassari» | CONSERVARE | Focus keyword invariata. |
| Ultimi articoli dal blog | ADATTARE | Assente in C.2 ma importante per i link interni: mantenuto come elenco editoriale. |
| `vercel.json` redirect, `middleware.ts` REDIRECTS, `sitemap.xml.ts`, `robots.txt` | CONSERVARE | Non modificati. In preview `X-Robots-Tag: noindex, nofollow` via middleware. |

## 8. Componenti, stili e token

| Elemento | Decisione | Motivazione |
|---|---|---|
| `CustomStyles.astro` (token `--aw-*`, Inter) | CONSERVARE | Non toccato: il resto del sito non cambia. |
| `tailwind.config.js` | CONSERVARE | Non toccato. |
| Token C.3 | NUOVO | `src/styles/c3/tokens.css`, applicati solo sotto `.c3` / `:has(.c3)`. |
| Motore WebGL | NUOVO | `src/scripts/c3/vortex-field.ts` (motore) separato da `hero-controller.ts` (fallback, viewport, reduced-motion, qualità). |

## 9. Anomalie rilevate (non corrette, fuori ambito)

1. `public/images/og-home.jpg` è referenziata da OG e JSON-LD della home ma **non esiste** (404 nelle anteprime social). DA VERIFICARE.
2. `src/content/data/reviews/review-01…06.json` hanno `author` e `text` vuoti; le recensioni visibili sono hard-coded nella home.
3. Profili social diversi tra footer (`/company/ls-web-agency`, `lswebdesignagency`) e JSON-LD `sameAs` (profili personali). DA VERIFICARE.
4. Alt del logo «LS Web Design Agency» diverso dal nome commerciale «LS Web Agency».
5. File spuri in root: `_nomefile`, `aggiorna`, `timestamp`, `.tmp_*.log`, immagini e `src/content.zip`.
6. Menu duplicato tra `src/config.yaml` e `src/navigation.ts` (fa fede `navigation.ts`).
7. Handle Twitter `@lswebagency` non verificato.
8. In preview il CRM non era protetto (vedi §5): corretto solo per l'ambiente preview.
