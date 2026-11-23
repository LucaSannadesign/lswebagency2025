# C.3.4 — Audit multipagina, piano compositivo e priorità

Branch `feat/lswebagency-redesign-c3` · base del lavoro: `8518919` · data 2026-11-23.
Fonti: `src/pages/**`, collection `src/content/data/{portfolio,post}`, `/sitemap.xml`
generata da `src/pages/sitemap.xml.ts` (93 URL indicizzabili).

Legenda priorità: **P1** = ridisegnato in C.3.4 · **P2** = prossima fase (solo token
e header/footer C.3 già applicati) · **P3** = non toccare o solo manutenzione.

---

## 1. Inventario URL e template

| Famiglia | URL (sitemap) | File | Template / layout |
|---|---|---|---|
| Homepage | `/` | `src/pages/index.astro` | `PageLayout` variant `c3` + `components/c3/*` (C.3.3) |
| Servizi (hub) | `/servizi` | `src/pages/servizi.astro` | `PageLayout` + `widgets/Hero.astro` |
| Dettaglio servizio (21) | `/servizi/siti-web`, `/servizi/audit-rapido`, `/servizi/sprint-ottimizzazione`, `/servizi/ai-operations-pmi`, `/servizi/assistente-ai-sito-whatsapp`, `/servizi/ai-blog-engine`, `/servizi/accessibilita-digitale-avanzata`, `/servizi/personalizzazione-ux-intelligenza-artificiale`, `/servizi/web-design-etico-sostenibile`, `/servizi/branding-e-grafica-siti-web`, `/servizi/landing-page-professionale`, `/servizi/realizzazione-siti-ecommerce`, `/servizi/wordpress-slim-siti-statici-headless`, `/servizi/fix-performance-seo`, `/servizi/ottimizzazione-seo-siti-web`, `/servizi/seo-locale`, `/servizi/local-seo-booster`, `/servizi/creazione-siti-web-sassari`, `/servizi/assistenza-manutenzione`, `/servizi/pre-accoglienza-digitale`, `/servizi/sviluppo-web-white-label` | `src/pages/servizi/*.astro` | pagine singole, markup Tailwind ciascuna diversa (150–940 righe) |
| Portfolio (indice) | `/portfolio`, `/portfolio/page/2` | `src/pages/portfolio/index.astro`, `page/[page].astro` | griglia 12 per pagina, ordine per data |
| Case study (24) | `/portfolio/<slug>` | `src/pages/portfolio/[slug].astro` + `content/data/portfolio/*.mdx` | testata + corpo MDX + prev/next |
| Chi siamo | `/chi-siamo` | `src/pages/chi-siamo.astro` | `PageLayout` + `widgets/Features3` |
| Blog (indice) | `/blog` (+ categorie, tag, paginazione) | `src/pages/[...blog]/[...page].astro`, `[category]`, `[tag]` | `components/blog/List*`, `Grid*` (AstroWind) |
| Articolo (30) | 23 × `/blog/<slug>` + 7 a primo livello (`/sito-lento-clienti-persi`, `/crm-leggero-pmi-quando-serve`, `/sito-web-acquisire-richieste-clienti`, `/prima-di-rifare-il-sito-mini-audit-chiarezza`, `/perche-il-tuo-sito-non-trasmette-fiducia-in-5-secondi`, `/trend-digital-marketing-2026-strategie-clienti`, `/velocizzare-wordpress-2025`) | `src/pages/[...blog]/index.astro` + `components/blog/SinglePost.astro` | permalink da frontmatter: **gli URL non cambiano** |
| Contatti | `/contatti` (+ `?servizio=`, `?pacchetto=`) | `src/pages/contatti.astro` (1.111 righe) | form → `/api/contatti`, coperto da `tests/formHandlerBinding.test.mjs` |
| Strumenti di conversione | `/mini-analisi`, `/process-fit-check` | `mini-analisi.astro` (React `MiniAnalisi.tsx`), `process-fit-check.astro` (`ProcessFitCheck.tsx`) | componenti React con API e CRM |
| Landing | `/progetto-digitale-per-imprese`, `/transizione-digitale-turismo`, `/lp/contatti-rapidi` | omonimi | landing autonome (turismo 1.141 righe, form proprio) |
| Locali (9) | `/local`, `/local/{alghero,cagliari,nuoro,olbia,oristano,porto-torres,quartu-sant-elena,sassari}` | `local/index.astro`, `local/[slug].astro` + `content/data/cities/*.json` | presidio SEO territoriale |
| Legali / servizio | `/privacy`, `/cookie`, `/terms`, `/pagamenti`, `/mappa-del-sito` | omonimi | testo; `terms` noindex |
| Non indicizzate | `/grazie`, `/grazie/*`, `/404`, `/confronto-annunci-sassari`, `/demo/assistente-ai`, `/audit-ai`, voucher (redirect) | omonimi | noindex o redirect in `middleware.ts` / `vercel.json` |

---

## 2. Audit pagina per pagina

### 2.1 `/servizi` — `src/pages/servizi.astro` · **P1**
- **Visivo:** hero con immagine stock (tessere «SEO AUDIT», `assets/images/servizi-seo-grafica-branding-siti-web.webp`) non coerente con l'identità; 6 blocchi di card tutte uguali (`grid` 3 colonne), 39 classi della vecchia palette (oggi rimappate dai token ma ancora nominate `violet/fuchsia`).
- **Commerciale:** 19 servizi presentati allo stesso livello, ordinati per «prodotto» (landing, e-commerce, SEO…) e non per competenza; il valore progettuale (UX/UI, sviluppo su misura, prodotti digitali) non emerge. Mancano dall'hub `ai-operations-pmi`, `ai-blog-engine`, `wordpress-slim-siti-statici-headless`, `/process-fit-check`.
- **Conservare:** metadata (title, description, canonical, OG), H1 «Servizi web e digitali: scegli da dove partire», ancora `#servizi-principali` (usata dal menu «Tutti i servizi»), ancora `#ai`, tutti i link alle 21 pagine servizio, percorso valutazione → audit → sprint → progetto con prezzi dichiarati.
- **Modificare:** gerarchia in 4 pratiche (web design strategico, UX/UI e accessibilità, sviluppo front-end su misura, prodotti digitali e AI) + percorsi secondari (visibilità e SEO, settori e territorio, cura continuativa); hero tipografica; prova con i 4 progetti; doppio percorso finale.
- **Non toccare:** URL delle pagine servizio.

### 2.2 Dettaglio servizio (21 file) · **P2**
- **Visivo:** ogni pagina ha un proprio markup (hero, card, FAQ, pricing) con stili diversi; molte classi legacy (fino a 49 in `ai-operations-pmi.astro`); immagini stock (`creazione-sito-web-professionale.webp`, `ecommerce-business-online.webp`, dashboard «transparent»).
- **Conservare:** contenuti, prezzi, FAQ e JSON-LD di ogni pagina; i form/CTA verso `/contatti?servizio=`.
- **Modificare (fase successiva):** estrarre un template comune (`C3PageHero` + `C3Section` già creati in C.3.4) e migrare per gruppi, partendo dalle 4 pratiche principali.
- **Non toccare ora:** logica dei moduli in `audit-rapido.astro`, `pre-accoglienza-digitale.astro`, `local-seo-booster.astro`.

### 2.3 `/portfolio` — `src/pages/portfolio/index.astro` · **P1**
- **Problema funzionale:** ordinamento per data con 12 elementi per pagina → **Canapalandia (2025-02-05) non compare in prima pagina**: i 4 progetti chiave non sono garantiti in evidenza.
- **Stato dei progetti:** 12 schede su 24 non hanno `projectStatus` (es. `valeria-chelo-psicologa-sassari.mdx`, `premioarte-arte-web-site.mdx`, `sardegna-non-solo-eventi.mdx`): il template le etichetta «Case study storico · Sito non più online», affermazione non verificata. → P2 contenuti: verificare e compilare.
- **Visivo:** testata con gradiente viola (classi `from-violet-100`, `bg-clip-text … fuchsia … pink`), card uniformi.
- **Conservare:** metadata, H1 «Portfolio», paginazione `/portfolio/page/N`, ordine per recenza, link ai case study.
- **Modificare:** sezione in evidenza con PreventivoDentale, Canapalandia, LUGHE, YoArtly; legenda e badge di stato (cliente, indipendente online, in sviluppo, grafica editoriale, storico, da classificare); griglia editoriale.

### 2.4 Case study — `src/pages/portfolio/[slug].astro` · **P1**
- **Struttura:** testata (immagine, stato, titolo, nota, categoria, tecnologie) + MDX libero; nessun indice, nessun «ruolo», nessun blocco risultati; prev/next minimale.
- **Conservare:** metadata dal frontmatter, H1 = titolo, contenuto MDX integrale, prev/next, `prerender`.
- **Modificare:** testata editoriale scura con scheda dati (stato, categoria, ruolo, tecnologie, sito), indice dei capitoli dai titoli dell'MDX, colonna di lettura su avorio, blocco «Risultati» che dichiara quando non sono documentati (nessuna metrica inventata), navigazione progetti.

### 2.5 `/chi-siamo` — `src/pages/chi-siamo.astro` · **P1**
- **Visivo:** illustrazione «dashboard» viola (`/images/chi-siamo-dashboard.webp`) con fallback a gradiente `rgba(139,92,246)` (viola) nel codice; emoji come icone (✅ 🎯 ♿ 🔒 📈 ⭐ 🛡️ 👥 🎨); componente generico `Features3`.
- **Comunicazione:** plurale «aiutiamo», «i nostri valori», «collaboriamo con esperti» → suggerisce un team; la figura di Luca Sanna resta in secondo piano; nessun riferimento alla formazione artistica né al metodo.
- **Conservare:** title, description (contiene «collaboriamo con esperti»: modifica proposta, **non applicata**), H1 «Strategie Digitali e Creazione Siti Web su Misura», CTA «Parla con Luca» → `/contatti`, «Vedi lavori» → `/portfolio`.
- **Modificare:** profilo in prima persona, pratica artistica (rimando a `/portfolio/luca-sanna-artista-contemporaneo`), metodo, competenze con tecnologie realmente usate nei progetti, a chi si rivolge lo studio.

### 2.6 Blog — `[...blog]/[...page].astro`, `components/blog/*` · **P1 (indice e articolo)**
- **Visivo:** testata generica, card AstroWind, articolo `prose` con link `dark:prose-a:text-violet-300`.
- **Editoriale:** 10 categorie con grafie incoerenti («marketing», «wordpress», «tecnologia» in minuscolo accanto a «Web Design»); 7 articoli su URL di primo livello (scelta precedente con redirect in `vercel.json`).
- **Conservare:** URL, permalink, canonical, robots per categoria/tag, `RelatedPosts`, `PostCTA`, condivisione, tag, RSS.
- **Modificare:** testata editoriale, articolo in evidenza, navigazione per categorie, griglia; articolo con testata scura, colonna di lettura confortevole (misura ~70 caratteri) su avorio, tipografia Archivo per i titoli.
- **Non toccare:** normalizzazione delle categorie (cambierebbe gli URL `/category/*`): proposta P2.

### 2.7 `/contatti` — `src/pages/contatti.astro` · **P1 (solo cornice)**
- **Visivo:** testata viola (`from-violet-100`, testo a gradiente), 27 classi legacy.
- **Funzionale:** varianti via query (`?servizio=audit-rapido`, banner servizio/pacchetto), form con honeypot e invio a `/api/contatti`, JSON-LD `ContactPage`.
- **Commerciale:** un solo percorso (valutazione gratuita); nessun ingresso per progetti strutturati o partner.
- **Conservare:** **tutto il blocco `<form>` e i suoi script**, i testi dinamici di H1/lead, varianti query, contatti rapidi, JSON-LD.
- **Modificare:** testata C.3, doppio percorso «Valutazione gratuita» / «Progetto strutturato o collaborazione», cornice del form e della sezione «Dove siamo».

### 2.8 Strumenti e landing · **P2/P3**
- `/mini-analisi`, `/process-fit-check`: componenti React con API/CRM → solo cornice in fase successiva (P2).
- `/transizione-digitale-turismo`, `/progetto-digitale-per-imprese`, `/lp/contatti-rapidi`: landing autonome con form propri → P3 (solo token già applicati).
- `/local/*`: presidio SEO territoriale → P3, nessuna modifica a testi e struttura.

### 2.9 Legali · **P3**
`/privacy`, `/cookie`, `/terms`, `/pagamenti`, `/mappa-del-sito`: solo token e header/footer C.3 (già attivi). Nessuna modifica ai testi.

---

## 3. Piano cromatico e compositivo

Token: solo `src/styles/c3/tokens.css` (6 primitivi + derivati). Superfici: **G** grafite `--c3-g0`,
**S** grafite secondaria `--c3-g1`, **A** antracite `--c3-g2`, **V** avorio `--c3-ivory`.

| Pagina | Sequenza superfici | Composizione specifica | WebGL |
|---|---|---|---|
| Home | G → G (nastro) → tinta progetti → V → S → V → G → V → S → G | capitoli scenografici (C.3.3) | Sì (Vortex Field) |
| Servizi | G (hero tipografica, griglia a filo) → V (4 pratiche, griglia asimmetrica 7/5) → S (percorso d'ingresso numerato) → G (percorsi secondari in colonne) → V (lavori selezionati) → S (doppio percorso) | «indice» di uno studio: pratiche grandi, servizi come voci | No |
| Portfolio | G (hero con conteggio) → G (4 progetti in evidenza, screenshot grandi alternati) → V (archivio con legenda di stato) → S (doppio percorso) | galleria editoriale | No |
| Case study | G (testata + scheda dati) → V (lettura con indice laterale) → A (risultati / note) → G (altri progetti) | articolo di progetto | No |
| Chi siamo | G (manifesto tipografico) → V (profilo, 7/5) → S (metodo in 4 tempi) → V (competenze e strumenti) → A (con chi lavoro: 3 pubblici) → S (doppio percorso) | ritratto professionale, nessuna illustrazione | No |
| Blog | G (testata + articolo in evidenza) → V (categorie e griglia) | rivista | No |
| Articolo | G (testata) → V (colonna di lettura) → V (CTA, tag) | lettura | No |
| Contatti | G (testata con due percorsi) → V (form) → S (dove siamo) | sportello | No |

Gradienti: solo su una parola o frase dei titoli principali e su dettagli interattivi
(filetti, hover). Testo corrente sempre in colore pieno.

---

## 4. Rischi e vincoli rispettati
- Nessun cambio di URL, title, description, canonical, H1 o dati strutturati.
- Nessuna modifica a form, API, CRM (`/api/*`, `MiniAnalisi.tsx`, `ProcessFitCheck.tsx`, script del form contatti).
- Pagine con tema chiaro/scuro: le pagine ridisegnate hanno toni progettati (come la home); il toggle tema resta attivo e governa le pagine non ancora migrate.

---

## 5. Stato a fine C.3.4 — pagine modificate

| Area | File | Cosa è cambiato | Invariato |
|---|---|---|---|
| Sistema pagine | `src/styles/c3/pages.css`, `src/components/c3/page/*`, `src/scripts/c3/pages.ts`, `src/layouts/PageLayout.astro` (`headerTone`) | Testata editoriale, sezioni a tono, percorsi, card, stati, lettura, blog, contatti | Token C.3, header/footer globali |
| `/servizi` | `src/pages/servizi.astro`, `src/data/c3/services.ts` | 4 pratiche principali, percorso d'ingresso, percorsi secondari, lavori, doppio percorso | Metadata, URL dei 21 servizi |
| `/portfolio`, `/portfolio/page/N` | `src/pages/portfolio/index.astro`, `page/[page].astro`, `src/data/c3/portfolio-*.ts` | 4 progetti in evidenza sempre visibili, archivio con stato dichiarato | Metadata, formato title/canonical delle pagine N |
| Case study (24) | `src/pages/portfolio/[slug].astro`, `MdxH1AsH2.astro` | Testata con scheda dati, indice capitoli, risultati dichiarati onestamente | Metadata, contenuto MDX, prev/next, un solo H1 |
| `/chi-siamo` | `src/pages/chi-siamo.astro` | Profilo dello studio indipendente, formazione artistica, metodo, competenze reali, tre pubblici, principi | Title, description, H1 |
| Blog | `[...blog]/[...page].astro`, `[category]`, `[tag]`, `index.astro`, `components/blog/SinglePost.astro`, `C3BlogList.astro`, `C3PostCard.astro` | Indice con categorie e articolo in evidenza; articolo con testata scura e colonna di lettura che segue il tema | URL, metadata, robots, H1, CTA, tag, share, correlati, RSS |
| `/contatti` | `src/pages/contatti.astro` | Testata C.3 con contatti rapidi, sezione `#progetto-strutturato`, fascia di lettura attorno a modulo e sede | H1 dinamico, testi, modulo, script `initContactForm`, JSON-LD |
| Homepage | `src/components/c3/C3About.astro` | Corretto link al portfolio artistico (era 404) | — |

Non migrate (restano con lo stile legacy ricolorato via token, P2/P3): 21 pagine servizio, `/local/*`, landing `/lp/*`, strumenti, legali.

### Problemi aperti (preesistenti, non introdotti da C.3.4)

- `/contatti`: asterischi dei campi obbligatori (`text-red-500`, 3.2:1) e pulsante WhatsApp in «Dove siamo» (3.8:1) sotto soglia AA; bordi rossi dei campi prima dell'interazione. Appartengono al modulo, lasciato invariato per vincolo.
- Articolo `voucher-innovazione-sostenibilita-sassari-2026`: pulsante «Vai al sito ufficiale» (classi nel MDX) 3.2:1 in tema scuro. Correzione editoriale da approvare.
- Categorie blog con titoli minuscoli (`marketing`, `tecnologia`, `wordpress`): mostrati con iniziale maiuscola solo a video; la normalizzazione cambierebbe gli URL `/category/*` (P2, da approvare con redirect).
- ESLint segnala `any` e import inutilizzati preesistenti in `SinglePost.astro` e `[...blog]/*.astro`.
