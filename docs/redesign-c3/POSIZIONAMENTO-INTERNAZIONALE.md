# Posizionamento premium, nazionale e internazionale — proposta C.3.4

Stato: **proposta da approvare. Nulla di quanto descritto qui è pubblicato o attivo.**
Nessuna pagina `/en/` esiste nel branch; nessun hreflang, canonical, sitemap,
redirect o robots è stato modificato. Il documento integra `SEO-POSIZIONAMENTO.md`
(proposte nazionali per la homepage, anch'esse non applicate).

---

## 1. Sintesi

| Tema | Decisione proposta |
|---|---|
| Messaggio guida | Studio indipendente di design e sviluppo: progetto + codice nella stessa persona, qualità verificabile, nessuna promessa non misurata |
| Gerarchia | Dal valore al prezzo: prima pratiche e lavori, poi percorsi d'ingresso (valutazione gratuita, audit 349 €), poi servizi locali |
| SEO locale | Sassari resta presidiata da homepage (title/H1), `/servizi/creazione-siti-web-sassari`, `/local/*`, JSON-LD LocalBusiness: **invariati** |
| Internazionale | Sezione `/en/` ridotta (5 pagine), scritta a mano, attivata solo dopo revisione SEO e con `noindex` fino all'approvazione |

---

## 2. I tre pubblici

### 2.1 Aziende italiane con progetti strutturati

- **Cosa cercano**: un interlocutore affidabile per un nuovo sito, un rifacimento o un prodotto digitale con obiettivi, tempi e budget.
- **Prova richiesta**: case study con ruolo dichiarato, processo leggibile, stato reale del progetto, tecnologie.
- **Pagine d'ingresso**: `/servizi` (pratiche), `/portfolio`, `/chi-siamo`, `/contatti#progetto-strutturato`.
- **Messaggio**: «Un solo interlocutore dalla strategia al codice, con fasi, tempi e preventivo chiari.»
- **CTA**: «Descrivi il progetto» (modulo esistente, nessuna logica nuova).

### 2.2 Agenzie creative e partner tecnologici

- **Cosa cercano**: capacità esecutiva front-end e di UX/UI, riservatezza, perimetro definito, puntualità.
- **Prova richiesta**: qualità del codice (performance, accessibilità), esempi di interfacce, modalità di collaborazione.
- **Pagine d'ingresso**: `/servizi/sviluppo-web-white-label` (esistente), sezione «Con chi lavoro» in `/chi-siamo`, nota in `C3Paths`.
- **Messaggio**: «Sviluppo front-end e design in collaborazione: il cliente resta vostro.»
- **CTA**: «Collaborazioni white label».
- **Da valutare**: una pagina «Metodo di collaborazione» (NDA, strumenti, consegne) solo se i contenuti sono reali e documentabili.

### 2.3 Clienti internazionali

- **Cosa cercano**: creative development, UX/UI, sviluppo su misura a distanza; comunicazione in inglese.
- **Prova richiesta**: portfolio visivo forte, profilo professionale, fuso orario e modalità di lavoro.
- **Pagine d'ingresso**: oggi `/chi-siamo` e `/contatti` (righe in inglese già presenti, con `lang="en"`); domani `/en/`.
- **Messaggio**: «Independent design & front-end studio. Interfaces that look considered and load fast.»
- **CTA**: «Tell me about your project».

---

## 3. Gerarchia orientata al valore (applicata nel redesign C.3.4)

1. **Pratiche principali** in `/servizi`: Web design strategico · UX/UI e accessibilità · Sviluppo front-end su misura · Prodotti digitali e AI.
2. **Lavori** prima dei listini: portfolio con 4 progetti in evidenza e stati dichiarati.
3. **Percorsi d'ingresso**: valutazione iniziale gratuita e progetto strutturato (`C3Paths`, `/contatti#progetto-strutturato`).
4. **Percorsi secondari** (visibilità e SEO, settori e territorio, cura continuativa): restano tutti raggiungibili, con URL invariati.

Nessun prezzo è stato aggiunto o modificato: compaiono solo quelli già pubblicati (audit 349 €, fix performance da 399 €).

---

## 4. SEO locale Sassari: cosa NON cambia

| Elemento | Stato |
|---|---|
| Title e H1 della homepage con «Sassari» | Invariati (proposte nazionali in `SEO-POSIZIONAMENTO.md`, non applicate) |
| `/servizi/creazione-siti-web-sassari`, `/servizi/seo-locale`, `/servizi/local-seo-booster` | Invariati, linkati da `/servizi` (percorsi secondari) |
| `/local/*` (9 pagine) | Invariate |
| JSON-LD LocalBusiness in `/contatti` e NAP (indirizzo, telefono) | Invariati |
| «Base a Sassari · da remoto in tutta Italia» | Presente in `/chi-siamo` e `/contatti` |

Principio: le pagine nazionali e internazionali **non** devono competere con le pagine locali sulle stesse keyword. Le pagine `/en/` non usano «Sassari» come keyword primaria (al massimo come sede nel footer e in `/en/about`).

---

## 5. Proposta sezione `/en/` (NON attivata)

### 5.1 Perimetro

Tradurre solo ciò che un cliente internazionale usa davvero. Blog, pagine locali, voucher e servizi legati al territorio **restano solo in italiano**.

| URL IT (esistente) | URL EN (proposto) | Contenuto |
|---|---|---|
| `/` | `/en/` | Hero, pratiche, 4 progetti, metodo, contatto |
| `/servizi` | `/en/services` | Le 4 pratiche principali + white label |
| `/portfolio` | `/en/work` | Solo i 4 progetti in evidenza |
| `/portfolio/<slug>` (4 schede) | `/en/work/<slug>` | Case study tradotti a mano |
| `/chi-siamo` | `/en/about` | Profilo, formazione, metodo, strumenti |
| `/contatti` | `/en/contact` | Stesso modulo e stessa API, campo lingua implicito |

Totale: 9 URL. Slug inglesi corti e stabili; gli slug italiani non cambiano.

### 5.2 Canonical, hreflang, sitemap

- **Canonical**: ogni pagina punta a se stessa (`/en/about` → `https://www.lswebagency.com/en/about`). Mai canonical incrociato IT ↔ EN.
- **Hreflang** (solo sulle coppie tradotte, reciproco):
  ```html
  <link rel="alternate" hreflang="it" href="https://www.lswebagency.com/chi-siamo" />
  <link rel="alternate" hreflang="en" href="https://www.lswebagency.com/en/about" />
  <link rel="alternate" hreflang="x-default" href="https://www.lswebagency.com/chi-siamo" />
  ```
- **Sitemap**: aggiungere le pagine EN solo al momento dell'attivazione (oggi `src/pages/sitemap.xml.ts` non va toccato).
- **`<html lang>`**: `en` sulle pagine EN (oggi `language: it` da `src/config.yaml`; serve un override per pagina in `Layout.astro`).
- **Stato iniziale**: `robots: noindex, nofollow` sulle pagine EN fino all'approvazione; nessun link dal menu finché sono noindex.

Verificato nel codice: il componente metadata attuale **non** gestisce `hreflang`
(nessuna occorrenza nel repository). Va aggiunta una prop `alternates` al metadata
di `Layout.astro`, opzionale e retro-compatibile.

### 5.3 Implementazione proposta (micro-task, ognuno con commit separato)

1. Prop `alternates?: { lang: string; href: string }[]` e `lang?: string` in `Layout.astro` / metadata (nessun effetto sulle pagine IT finché non valorizzata).
2. Dizionario testi `src/data/c3/i18n/en.ts` e riuso dei componenti C.3 (`C3PageHero`, `C3Section`, `C3Paths`) con testi passati come props: nessun componente duplicato.
3. Pagine `src/pages/en/*.astro` con `noindex`.
4. Selettore lingua nell'header (link testuale «EN / IT» alla pagina corrispondente; nessun redirect automatico per lingua del browser).
5. Revisione SEO e linguistica → rimozione `noindex`, aggiunta hreflang reciproci sulle 9 coppie e voci sitemap.

Alternativa valutata e sconsigliata ora: routing i18n nativo di Astro
(`i18n` in `astro.config`). Funziona, ma interviene sul routing globale di un sito
SSR con 90+ URL indicizzati: più rischio per un perimetro di 9 pagine.

### 5.4 Esempi di copy inglese (bozza, da rivedere)

**`/en/` · hero**
```text
Independent design & front-end studio.
I design and build websites and digital products for companies and agencies —
strategy, interface and code by the same person. Fast, accessible, measurable.
[Tell me about your project]  [See selected work]
```

**`/en/services` · pratiche**
```text
Strategic web design — Structure, content hierarchy and visual direction for sites that need to convert.
UX/UI & accessibility — Interfaces that are clear to use and compliant by design.
Custom front-end development — Hand-written code (Astro, React, Tailwind CSS), built for speed and easy maintenance.
Digital products & AI — Prototypes and tools with a defined scope, from validation to launch.
```

**`/en/about`**
```text
I'm Luca Sanna, a web designer and front-end developer with over 15 years of experience.
I come from painting and graphic design: composition, colour and hierarchy are where
every interface starts. Then comes the code — written for the project, not adapted
from a theme. Based in Sardinia, Italy; working remotely with clients in Italy and abroad.
```

**`/en/contact`**
```text
Have a structured project? Share goals, timeline and budget — even as a rough draft.
I'll reply with the questions that matter and, once the picture is clear,
a phased proposal. Agencies and tech partners: white-label collaborations available.
```

**White label (per agenzie)**
```text
Front-end and design capacity for your team. Defined scope, confidential work,
your client stays yours.
```

Regole del copy: niente metriche non verificate, niente «we» che suggerisca un team,
niente traduzione automatica non rivista.

---

## 6. Rischi e prerequisiti

| Rischio | Mitigazione |
|---|---|
| Cannibalizzazione IT/EN | Hreflang reciproci, canonical self, keyword EN distinte |
| Pagine EN sottili o tradotte male | Solo 9 URL, testi rivisti da madrelingua o revisore |
| Modulo contatti in EN | Stessa API e stessa logica; solo etichette tradotte. Nessuna modifica a CRM o automazioni senza analisi delle dipendenze |
| Promesse non sostenibili (tempi di risposta, fuso orario) | Dichiarare solo ciò che è garantito |

## 7. Decisioni da approvare

1. Perimetro `/en/` (9 URL) e slug inglesi proposti.
2. Avvio dei micro-task 5.3.1–5.3.4 con `noindex`.
3. Revisione del copy inglese.
4. Data di attivazione (micro-task 5.3.5), dopo la revisione SEO.
5. Eventuale applicazione delle proposte nazionali di `SEO-POSIZIONAMENTO.md` (indipendente da `/en/`).
