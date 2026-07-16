# Audit di coerenza — offerta, prodotti e copy commerciale
**LS Web Agency — luglio 2026**
Documento analitico. Nessuna pagina, copy, metadata o navigazione è stata modificata.

Branch: `main` · Commit: `5ecfae28` · Modifiche locali preesistenti non toccate: `src/components/widgets/Header.astro`, `src/components/widgets/Footer.astro` (interventi a11y in corso).

---

## 1. Verdetto esecutivo

Il sito non vende un'offerta: vende un catalogo. La direzione strategica approvata (studio indipendente → sito web strategico come prodotto centrale → audit a pagamento come ingresso → sprint come seguito) è **dichiarata correttamente nel copy di posizionamento** di homepage e pagina Servizi, ma **non è implementata nell'architettura reale**: sotto lo strato di copy strategico convivono ~30 offerte, 5 delle quali hanno prezzo autonomo e pagina-prodotto completa, in diretta concorrenza tra loro.

Tre problemi dominano.

**Primo: il prodotto di ingresso approvato non esiste.** "Audit tecnico e di accessibilità prioritizzato del sito" non è presente in nessuna pagina. Al suo posto esistono **quattro audit a pagamento diversi e concorrenti**: Audit Rapido (299 €/399 €), Audit SEO Locale Express (99 €), Audit Sito e Prenotazione (99 €, solo homepage, senza pagina), Audit Flash accessibilità. Nessuno produce l'output approvato (evidenze → finding prioritizzati → roadmap → raccomandazione finale) e nessuno copre la componente di accessibilità.

**Secondo: lo stesso audit ha due prezzi pubblicati diversi.** La homepage lo vende "Da 149 €" in due punti; la pagina prodotto, il SiteAssistant, la pagina SEO locale e il JSON-LD lo vendono "da 299 €". È un'incoerenza di prezzo pubblicata, non un refuso interno: è il rischio più alto del sito.

**Terzo: c'è una promessa di conformità normativa esplicita.** La pagina Accessibilità promette conformità WCAG/AgID/EAA e dichiara "Eviti sanzioni e blocchi su fondi pubblici" — in violazione diretta del vincolo 9.

Un elemento è già allineato: **PreventivoDentale non compare in nessun punto del sito** (vincolo 8 rispettato). Anche la separazione white label è strutturalmente corretta, sebbene la pagina sia sepolta tra i "Percorsi specifici".

La buona notizia: il copy strategico corretto è già scritto. Il lavoro non è riscrivere il posizionamento — è **eliminare le offerte che lo contraddicono**.

---

## 2. Architettura attuale dell'offerta

**Dichiarata** (homepage + `/servizi`): sito web strategico al centro; audit come primo passo; SEO, form, landing, tracciamento come moduli integrabili.

**Reale**, ricostruita dai file:

```
Menu (3 voci servizio)          →  Catalogo reale (~30 offerte)
├── Sito web strategico             ├── 5 livelli gerarchici in /servizi
├── Ottimizzazione SEO  (#seo)      ├── 4 audit a pagamento concorrenti
└── AI e automazioni    (#ai)       ├── 2 SEO locali quasi identici
                                    ├── 2 landing page identiche
CTA header: Valutazione Gratuita    ├── 3 interventi post-diagnosi sovrapposti
        → /mini-analisi             └── 3 offerte "fantasma" solo in homepage
```

La pagina `/servizi` organizza l'offerta su **cinque livelli** — "Da dove partire" (6 card), "Componenti integrabili" (5), "Interventi mirati" (2), "Percorsi specifici" (4), mini-analisi — ma la gerarchia è nominale: `Fix Performance e SEO` e `Sprint di Ottimizzazione` sono classificati "Interventi mirati" pur avendo pagine-prodotto con prezzo e pacchetti identiche per struttura a quelle dei "servizi principali".

**Il menu non riflette il catalogo.** L'audit — dichiarato "primo passo" nel copy — non compare nella navigazione. Le tre voci del dropdown ne coprono 3 su ~30.

**Tre offerte esistono solo in homepage**, con prezzo pubblicato, senza pagina di destinazione: le loro CTA puntano tutte a `/contatti` generico.

| Offerta fantasma | Prezzo | File | CTA |
|---|---|---|---|
| Audit Sito e Prenotazione | 99 € | `index.astro:810` | `/contatti` |
| SEO locale starter | Da 99 € | `index.astro:691` | `/servizi/seo-locale` (pagina che vende un'altra cosa) |
| Sito per attività locali | Da 790 € | `index.astro:646` | `/contatti` |

---

## 3. Architettura consigliata

```
PRODOTTO CENTRALE
└── Sito web strategico                    /servizi/siti-web
    (E-commerce = estensione, non prodotto pari grado)

PRODOTTO DI INGRESSO (unico, a pagamento)
└── Audit tecnico e di accessibilità prioritizzato
    (assorbe: Audit Rapido, Audit Express, Audit Sito e Prenotazione, Audit Flash)
    Output: evidenze → finding prioritizzati → roadmap → raccomandazione

SEGUITO NATURALE
└── Sprint tecnico circoscritto            /servizi/sprint-ottimizzazione
    (assorbe Fix Performance e SEO)

MODULI / COMPETENZE (nessuna pagina-prodotto autonoma con prezzo)
└── SEO · SEO locale · Landing · Form · Accessibilità · Branding
    Automazioni · Assistente AI · UX con AI · Manutenzione

LEAD MAGNET (gratuito, non sostituisce l'audit)
└── Mini-analisi guidata                   /mini-analisi

PERCORSO B2B (separato, non nel catalogo cliente finale)
└── Sviluppo white label per agenzie       /servizi/sviluppo-web-white-label

PAGINE SEO VERTICALI (nessun prezzo autonomo, CTA → prodotto centrale)
└── Sassari · SEO locale · Turismo · Local pages · Voucher
```

Il principio: **un solo audit, un solo sprint, un solo prodotto centrale**. Tutto il resto è modulo, competenza o pagina SEO.

---

## 4. Inventario completo delle offerte

### 4.1 Prodotto centrale

| Nome attuale | File | Pubblico | Promessa | Deliverable | Prezzo | Tempi | CTA | Cat. attuale | Cat. consigliata | Stato | Motivazione |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Sito web strategico | `servizi/siti-web.astro` | PMI, professionisti | Acquisire e gestire richieste | Sito + form + SEO + tracciamento | Non dichiarato | Non dichiarati | `/contatti` | Prodotto | **Prodotto centrale** | **Mantenere** | Coerente con la direzione. Manca però la fascia di prezzo, presente invece in home (790 €) e FAQ |
| Sito per attività locali | `index.astro:646` | Attività locali | Sito chiaro e leggero | Design, struttura, SEO base | Da 790 € | — | `/contatti` | Prodotto (fantasma) | Prodotto centrale | **Accorpare** in `/servizi/siti-web` | Offerta con prezzo senza pagina: è il prodotto centrale con altro nome |
| Realizzazione siti Sassari | `servizi/creazione-siti-web-sassari.astro` | Locale Sassari | Siti per attività locali | — | Nessuno | — | `/contatti` | Prodotto | **Pagina SEO** | **Mantenere solo come pagina SEO** | Duplica il prodotto centrale su base territoriale; corretto che non abbia prezzo |
| E-commerce | `servizi/realizzazione-siti-ecommerce.astro` | Chi vende online | Shop scalabile | Catalogo, checkout | Non dichiarato | 3–5 / 6–10 sett. | `/contatti` | Prodotto | Estensione | **Riposizionare** | Vincolo 6: estensione del sito, non prodotto pari grado |
| WordPress Slim | `servizi/wordpress-slim-...astro` | Chi ha WP | Performance e sicurezza | Migrazione, pipeline | Non dichiarato | — | `/contatti` | Prodotto | Competenza | **Accorpare** | Modalità tecnica di realizzazione, non prodotto |

### 4.2 Audit — l'area critica

| Nome attuale | File | Pubblico | Promessa | Deliverable | Prezzo | Tempi | CTA | Cat. attuale | Cat. consigliata | Stato | Motivazione |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Audit Rapido Sito Web | `servizi/audit-rapido.astro` | PMI generalista | "In 48 ore ti dico cosa blocca" | Report UX/SEO/performance | **299 € / 399 €** | 48 ore | `/contatti?servizio=audit-rapido` | Prodotto | **Prodotto ingresso** | **Rinominare + riposizionare** | Base del prodotto approvato, ma manca accessibilità, roadmap e raccomandazione finale |
| Audit rapido (versione home) | `index.astro:497,596` | Idem | Idem | Idem | **Da 149 €** | — | `#analisi-audit` / `/contatti` | Prodotto | — | **Accorpare (P0)** | **Stesso prodotto, prezzo diverso da tutte le altre fonti** |
| Audit Sito e Prenotazione | `index.astro:810` | Studi dentistici | Percorso di prenotazione | Priorità + call | **99 €** scalabile | — | `/contatti` | Prodotto (fantasma) | — | **Archiviare / accorpare** | Terzo audit, senza pagina, verticale dentale non previsto come prodotto |
| Audit SEO Locale Express | `servizi/seo-locale.astro:327` | Attività locali | Analisi GBP | Report prioritizzato | **99 €** scalabile | 48 ore | `/contatti?servizio=seo-locale` | Prodotto | Modulo | **Accorpare** | Quarto audit; sovrapposto per prezzo e tempi al precedente |
| Audit Flash accessibilità | `servizi/accessibilita-...astro` | Chi ha vincoli a11y | Conformità | Report WCAG | Da definire | 5–10 gg | `/contatti` | Prodotto | Modulo | **Accorpare** | Deve diventare la componente a11y dell'audit unico |
| Audit AI | `audit-ai.astro` | — | — | — | — | — | — | Non chiaro | — | **Archiviare** | Pagina senza metadata né offerta identificabile |

### 4.3 Interventi post-diagnosi

| Nome attuale | File | Pubblico | Promessa | Deliverable | Prezzo | Tempi | CTA | Cat. attuale | Cat. consigliata | Stato | Motivazione |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Sprint di Ottimizzazione | `servizi/sprint-ottimizzazione.astro` | Cliniche, studi, e-comm | Conversione e performance | Report prima/dopo + fix | Non dichiarato | 10–15 gg | `/contatti` | Prodotto | **Seguito dell'audit** | **Mantenere + riposizionare** | È lo sprint approvato. Va legato esplicitamente all'audit |
| Fix Performance e SEO | `servizi/fix-performance-seo.astro` | Chi ha già priorità | Correggere ciò che rallenta | Fix + metriche | 399 € / 699 € | 5–7 / 7–10 gg | `/contatti` | Prodotto | — | **Accorpare** nello sprint | Stesso deliverable dello sprint, prezzo autonomo, confine indistinguibile |
| Intervento operativo | `index.astro:834` | Dentisti/locali | Correzioni mirate | — | Su preventivo | — | `/contatti` | Prodotto (fantasma) | — | **Accorpare** nello sprint | Terza variante dello stesso concetto |

### 4.4 SEO

| Nome attuale | File | Prezzo | Tempi | CTA | Cat. consigliata | Stato | Motivazione |
|---|---|---|---|---|---|---|---|
| Ottimizzazione SEO | `servizi/ottimizzazione-seo-siti-web.astro` | Nessuno (JSON-LD `0`–`0`) | — | `/contatti` | Competenza | **Riposizionare** | Vincolo 6. JSON-LD con prezzo 0–0 è anche un errore tecnico |
| SEO locale | `servizi/seo-locale.astro` | 99 / da 490 / 49 mese | 48h / 2–6 sett. | `?servizio=seo-locale` | Modulo | **Accorpare** con Local SEO Booster | Due pagine, stesso servizio |
| Local SEO Booster | `servizi/local-seo-booster.astro` | 39 mese / 490 / 49 mese | — | `?servizio=local-seo-booster` | Modulo | **Accorpare** | Setup 490 € identico; mensile 39 vs 49 € non spiegato |
| Local pages | `local/[slug].astro`, `local/index.astro` | — | 2–4 sett. | — | Pagina SEO | **Mantenere solo come pagina SEO** | Non devono moltiplicare i prodotti (vincolo: pagine verticali) |

### 4.5 Landing, AI e moduli

| Nome attuale | File | Prezzo | Tempi | Cat. consigliata | Stato | Motivazione |
|---|---|---|---|---|---|---|
| Landing page professionale | `servizi/landing-page-professionale.astro` | Da 690 € | 7–10 gg | Modulo | **Riposizionare** | Vincolo 6 |
| LP contatti rapidi | `lp/contatti-rapidi.astro` | 690 € / 990 € | 7–10 gg | Modulo | **Accorpare** | Duplicato esatto della precedente |
| Assistente AI sito/WhatsApp | `servizi/assistente-ai-sito-whatsapp.astro` | 300/600/900 € + 29/59/99 mese | 5–10 gg | Modulo | **Riposizionare** | Modulo integrabile, non prodotto autonomo |
| UX con AI | `servizi/personalizzazione-ux-...astro` | Nessuno | — | Competenza | **Accorpare** | Sovrapposto ad Assistente AI e al sito strategico |
| AI Blog Engine | `servizi/ai-blog-engine.astro` | Nessuno | — | Competenza | **Archiviare o accorpare** in SEO | Non collegato al percorso centrale |
| Accessibilità digitale | `servizi/accessibilita-digitale-avanzata.astro` | JSON-LD `0`–`0` | 5–10 gg | Modulo + componente audit | **Riposizionare (P0 sul copy)** | Vedi §6 |
| Web design etico | `servizi/web-design-etico-sostenibile.astro` | Nessuno | — | Competenza | **Accorpare** in accessibilità | Stesso contenuto con altro nome |
| Branding e grafica | `servizi/branding-e-grafica-siti-web.astro` | Nessuno | 1–2 sett. | Competenza | **Riposizionare** | Vincolo 6 |
| Assistenza e manutenzione | `servizi/assistenza-manutenzione.astro` | Nessuno | — | Modulo | **Riposizionare** | Vincolo 6 |

### 4.6 Verticali, B2B, lead magnet

| Nome attuale | File | Prezzo | Cat. consigliata | Stato | Motivazione |
|---|---|---|---|---|---|
| Sviluppo white label | `servizi/sviluppo-web-white-label.astro` | Da 1.200 € | **Percorso B2B** | **Mantenere + separare** | Corretto ma sepolto tra i "Percorsi specifici" del catalogo cliente finale (vincolo 7) |
| Transizione digitale turismo | `transizione-digitale-turismo.astro` | 99 / 590 / 79 mese | Pagina SEO verticale | **Riposizionare** | Listino autonomo parallelo: 99 € è un quinto audit, 79 €/mese una terza manutenzione |
| Pre-accoglienza digitale | `servizi/pre-accoglienza-digitale.astro` | Nessuno | Modulo verticale | **Riposizionare** | Verticale dentale; copy prudente e ben fatto |
| Progetto digitale per imprese | `progetto-digitale-per-imprese.astro` | Nessuno | Pagina SEO | **Mantenere solo come pagina SEO** | — |
| Voucher digitali (3 file) | `voucher-digitali-sardegna.astro`, `servizi/voucher-*` | — | Pagina SEO | **Archiviare** | Riferimenti "2025" scaduti a luglio 2026 |
| Mini-analisi | `mini-analisi.astro`, `MiniAnalisi.tsx` | Gratuito | **Lead magnet** | **Mantenere** | Disclaimer "Non sostituisce un audit tecnico completo" già corretto |
| `transizione-digitale-turismo.(OLD)astro` | — | — | — | **Archiviare** | File orfano in `src/pages/` |

---

## 5. Contraddizioni e sovrapposizioni

**5.1 Prezzo audit: 149 € vs 299 €** — `index.astro:497` e `:596` contro `audit-rapido.astro:8,281`, `seo-locale.astro:150,235,249`, `assistantFlow.ts:126,213,325`. Stesso prodotto, stesso deliverable, due prezzi pubblicati. Un utente che passa dalla home alla pagina prodotto vede il prezzo raddoppiare. **P0.**

**5.2 Quattro audit concorrenti** — 299 €, 99 € (dentale), 99 € (GBP), Flash a11y. Le pagine tentano di distinguerli con note esplicite (`audit-rapido.astro:265`, `seo-locale.astro:235`), il che conferma che la sovrapposizione è nota e reale: se serve un paragrafo per spiegare la differenza, i prodotti sono troppi. **P1.**

**5.3 Valutazione gratuita / analisi gratuita / mini-analisi** — tre nomi per due cose. La CTA header dice "Valutazione Gratuita" → `/mini-analisi`; la home dice "Richiedi analisi gratuita" → `#contatti` o `/contatti`; `/servizi` dice "Avvia la mini-analisi". La home presenta inoltre "Analisi gratuita iniziale" come offerta a sé con deliverable propri (`index.astro:465-490`), distinta dalla mini-analisi. **P1.**

**5.4 Audit rapido / Fix Performance / Sprint** — Audit (299 €) = diagnosi; Fix (399 €) = correzione; Sprint (10–15 gg) = "audit + fix + misurazione". Lo sprint contiene entrambi gli altri. La FAQ dello sprint (`sprint-ottimizzazione.astro:247`) ammette che l'audit non è necessario perché "lo sprint include un'analisi rapida mirata" — contraddicendo l'audit come prodotto di ingresso. **P1.**

**5.5 SEO locale vs Local SEO Booster** — due pagine, stesso servizio, setup 490 € in entrambe, mensile 39 € vs 49 €, entrambe con JSON-LD Offer. Query param diversi (`servizio=seo-locale` vs `servizio=local-seo-booster`) suggeriscono che siano trattati come prodotti distinti anche a valle. **P1.**

**5.6 Landing page duplicata** — `/servizi/landing-page-professionale` e `/lp/contatti-rapidi`: 690 €/990 €, 7–10 giorni, identiche. **P2.**

**5.7 Accessibilità / web design etico** — stessa competenza, due pagine, nessun confine dichiarato. **P2.**

**5.8 Turismo come listino parallelo** — 99 € (audit), 590 € (sito), 79 €/mese (manutenzione): una pagina verticale che ricostruisce l'intero funnel con prezzi scollegati dal resto (sito 590 € vs 790 € in home). **P1.**

**5.9 Menu vs catalogo** — 3 voci servizio su ~30 offerte; l'audit, dichiarato "primo passo", è assente dalla navigazione; footer espone "SEO Locale" come unico servizio, elevandolo a rango che la strategia non gli assegna. **P1.**

**5.10 Il prodotto approvato non esiste** — nessuna pagina vende "Audit tecnico e di accessibilità prioritizzato". La componente accessibilità è in una pagina separata che non dialoga con l'audit. **P0 strategico.**

---

## 6. Audit delle promesse

| # | File / sezione | Testo attuale | Rischio | Liv. | Direzione di riscrittura |
|---|---|---|---|---|---|
| 1 | `accessibilita-...astro:108` — "Perché è importante" | "✅ Conformità normative **WCAG/AgID/EAA**" | Promessa di conformità normativa. Vincolo 9 | **P0** | Dichiarare adeguamenti *verso* i criteri, mai conformità come esito garantito |
| 2 | `accessibilita-...astro:111` | "✅ Eviti sanzioni e blocchi su fondi pubblici" | Promessa di effetto legale. Nessun servizio tecnico può garantirlo | **P0** | Rimuovere. Nessuna riformulazione salva questa frase |
| 3 | `accessibilita-...astro:7` — metadata | "Rendi il tuo sito accessibile a tutti e **conforme alle normative europee (WCAG/AgID/EAA)**" | Come sopra, in description indicizzata | **P0** | Riscrivere su miglioramento e riduzione barriere |
| 4 | `accessibilita-...astro:34` — JSON-LD | "Migliora UX, SEO e **conformità**" | Promessa in dato strutturato | **P0** | Allineare al copy corretto |
| 5 | `web-design-etico-...astro:8` — metadata | "Un approccio etico, misurabile e **conforme**" | "Conforme" senza oggetto: implica conformità legale | **P0** | Rimuovere il termine |
| 6 | `index.astro:497` vs `audit-rapido.astro:281` | "Da 149 €" vs "299€" | Prezzo pubblicato incoerente: rischio di pratica commerciale ingannevole | **P0** | Prezzo unico su tutte le fonti, home inclusa |
| 7 | `accessibilita-...astro:92,100` | "report WCAG 2.2 (A/AA)"; "Supporto alla **dichiarazione di accessibilità (AgID)**" | Implica titolo a produrre atti formali | **P1** | Chiarire che il supporto è tecnico e non sostituisce valutazione legale |
| 8 | `assistente-ai-...astro:14,16,96,158` | "Risposte **24/7**", "gestite 24/7" (×8 occorrenze + JSON-LD) | Disponibilità continua di servizio presidiato da una persona sola | **P1** | Dichiarare la disponibilità del sistema automatico, distinta dal presidio umano |
| 9 | `assistente-ai-...astro:16` | "Meno telefonate ripetitive, **più clienti**" | Promette clienti | **P1** | Riformulare su riduzione richieste ripetitive |
| 10 | `index.astro:31` — title home | "Siti Web **per Acquisire Clienti**" | Promette acquisizione clienti nel title indicizzato | **P1** | Spostare su strumento/percorso, non risultato |
| 11 | `chi-siamo.astro:218` | "Monitoriamo costantemente il rendimento dei siti per **garantire una crescita continua e successi concreti**" | "Garantire" + risultati non dimostrati | **P1** | Rimuovere "garantire"; descrivere l'attività, non l'esito |
| 12 | `chi-siamo.astro:186` | "Lavoriamo con precisione per **garantire** siti web veloci, sicuri e dall'estetica impeccabile" | "Garantire" + "impeccabile" | **P2** | Sostituire con impegno verificabile |
| 13 | `local-seo-booster.astro:212`, `seo-locale.astro:461` | "si notano segnali entro **2–6 settimane** (più chiamate, richieste indicazioni, crescita delle impressions)" | Tempi + risultati non supportati da dati verificabili | **P1** | Rimuovere la finestra temporale o dichiarare che è un'ipotesi non garantita |
| 14 | `index.astro:281,1767` | "Risposta in 24h" / "Risposta in 24 ore" vs `contatti.astro:540` "entro 24–48 ore" | Tempo di risposta contraddittorio tra home e pagina contatti | **P2** | Uniformare su 24–48 ore |
| 15 | `audit-rapido.astro:43,401` | "In 48 ore ti dico cosa blocca **davvero** conversioni, SEO e performance" | Tempo garantito su lavoro non ancora visto | **P2** | Dichiarare come tempo tipico |
| 16 | `index.astro:31,252,388` | "richieste **qualificate**" (×3) | "Qualificato" non definito né misurabile | **P2** | Definire cosa rende una richiesta qualificata, o rimuovere |
| 17 | `audit-rapido.astro:413`, `index.astro:1767` | "Report **completo**" / "Piano chiaro" | "Completo" implica esaustività non delimitata | **P2** | Dichiarare lo scope effettivo |
| 18 | `assistenza-manutenzione.astro:8` | "Il tuo sito **funziona sempre, senza problemi**" | Promessa di continuità assoluta | **P1** | Riformulare su monitoraggio e intervento |
| 19 | `ottimizzazione-seo-...astro:162`, `accessibilita-...astro:38` | JSON-LD `"lowPrice": "0", "highPrice": "0"` | Dichiara servizi gratuiti ai motori di ricerca | **P2** | Rimuovere l'oggetto `offers` se il prezzo non è pubblico |

**Nota positiva.** `sprint-ottimizzazione.astro:214,218` contiene già le esclusioni corrette ("non fornisco pareri su GDPR"; "non posso garantire risultati specifici") e `index.astro:850` ("L'obiettivo non è promettere più pazienti") e `mini-analisi.astro:9` ("Non sostituisce un audit tecnico completo") sono modelli di formulazione da estendere alle altre pagine.

---

## 7. Audit di prezzi e tempi

**Prezzi pubblicati**

| Offerta | Prezzo | Fonte | Conflitto |
|---|---|---|---|
| Audit Rapido | **149 €** | `index.astro:497,596` | **⚠ contro 299 €** |
| Audit Rapido | **299 € / 399 €** | `audit-rapido.astro`, `seo-locale.astro`, `assistantFlow.ts`, JSON-LD | **⚠ contro 149 €** |
| Audit Sito e Prenotazione | 99 € | `index.astro:811` | Terzo audit, senza pagina |
| Audit SEO Locale Express | 99 € | `seo-locale.astro:327` | Quarto audit, stesso prezzo del precedente |
| Audit turismo | 99 € | `transizione-digitale-turismo.astro:280` | Quinto audit a 99 € |
| Sito (attività locali) | Da 790 € | `index.astro:648`, FAQ + JSON-LD | ⚠ contro 590 € turismo |
| Sito turismo | 590 € | `transizione-digitale-turismo.astro:298` | ⚠ contro 790 € |
| Fix Performance | 399 € / 699 € | `fix-performance-seo.astro` | — |
| Landing | 690 € / 990 € | 2 pagine | Duplicato |
| SEO locale setup | Da 490 € | `seo-locale.astro` + `local-seo-booster.astro` | Stesso prezzo, 2 pagine |
| Manutenzione mensile | **39 € / 49 € / 79 €** | Booster / SEO locale / Turismo | ⚠ tre prezzi |
| Assistente AI | 300/600/900 € + 29/59/99 mese | Pagina + `assistantFlow.ts` | Coerenti |
| White label | Da 1.200 € | `servizi.astro:340` | Solo nel catalogo cliente finale |
| **Sito web strategico** | **assente** | `servizi/siti-web.astro` | Il prodotto centrale non ha fascia di prezzo sulla sua pagina |
| **Sprint** | **assente** | `sprint-ottimizzazione.astro` | Il seguito approvato non ha prezzo |

Il form home (`index.astro:1859`) propone fasce "Meno di 500 € / 500–1.000 / 1.000–2.000 / Oltre 2.000": la prima è sotto il prezzo di ingresso del sito (790 €) e raccoglie lead fuori target.

**Tempi**

| Dichiarazione | Fonte | Conflitto |
|---|---|---|
| Risposta 24h | `index.astro:281,1767`, `seo-locale.astro:81,104` | ⚠ contro 24–48h |
| Risposta 24–48h | `contatti.astro:540`, `transizione-...astro:430,521` | ⚠ contro 24h |
| Audit 48 ore | `audit-rapido.astro` (×7), `seo-locale.astro` | Coerente ma ripetuto come garanzia |
| Sito 2–4 settimane | `index.astro:173`, `local/[slug].astro:146` | Coerente |
| Sprint 10–15 gg / Fix 5–7 gg | rispettive pagine | Confine tra i due non spiegato |

---

## 8. Audit delle CTA

`/contatti` è la destinazione di **47 CTA**: un imbuto unico che riceve indistintamente chi vuole un audit da 299 €, chi un'analisi gratuita e chi un preventivo. Solo 20 CTA passano un `?servizio=`; le tre offerte con prezzo della homepage non ne passano nessuno.

| CTA | Destinazione | Intenzione | Gratis/pag. | Coerenza | Ambiguità |
|---|---|---|---|---|---|
| Valutazione Gratuita (header) | `/mini-analisi` | Lead magnet | Gratis | ✅ | Nome diverso da "mini-analisi" a destinazione |
| Richiedi analisi gratuita | `#contatti` / `/contatti` | Lead | Gratis | ⚠ | Terzo nome per il gratuito; non porta alla mini-analisi |
| Richiedi analisi rapida | `#contatti` | Lead | Ambiguo | ❌ | "Rapida" richiama l'Audit **Rapido** a pagamento |
| Richiedi analisi del progetto | `/contatti` | Lead | Ambiguo | ❌ | Quarto nome |
| Prenota audit rapido | `#analisi-audit` / `/contatti` | Vendita | **149 € o 299 €** | ❌ | Prezzo incoerente; "Prenota" ma non si prenota nulla |
| Prenota audit | `/contatti` | Vendita | 99 € | ❌ | Quale audit? |
| Verifica SEO locale | `/servizi/seo-locale` | Navigazione | — | ❌ | Card "SEO locale starter 99 €" → pagina che vende Audit Express 99 € + Setup 490 € |
| Valuta un restyling | `/contatti` | Lead | — | ⚠ | "Restyling" assente dal catalogo |
| Richiedi preventivo sito | `/contatti` | Preventivo | — | ✅ | — |
| Parliamo dell'intervento | `/contatti` | Preventivo | — | ⚠ | "Intervento operativo" non ha pagina |
| Richiedi un check gratuito | `/contatti` | Lead | Gratis | ❌ | Quinto nome per il gratuito, su pagina a11y |
| Scopri di più (×15) | pagine servizio | Navigazione | — | ✅ | Generica ma corretta |
| Scrivimi qui (WhatsApp) | `wa.me` | Lead | — | ✅ | 8 messaggi precompilati, coerenti |
| White label | `/servizi/sviluppo-web-white-label` | B2B | — | ⚠ | Dentro il catalogo cliente finale |

**Le cinque intenzioni non sono distinguibili.** "Valutazione gratuita", "analisi gratuita", "analisi rapida", "analisi del progetto" e "check gratuito" indicano la stessa cosa con cinque nomi; "analisi rapida" (gratis) e "audit rapido" (a pagamento) sono distinti da una sola parola.

**CTA primarie consigliate**, una per intenzione:

| Intenzione | CTA unica | Destinazione |
|---|---|---|
| Lead magnet gratuito | "Valutazione gratuita" | `/mini-analisi` |
| Audit a pagamento | "Richiedi l'audit" | pagina audit unico + `?servizio=audit` |
| Preventivo sito | "Richiedi preventivo" | `/contatti?servizio=sito-strategico` |
| Sprint | "Parliamo dello sprint" | `/contatti?servizio=sprint` |
| White label | "Collabora con me" | `/servizi/sviluppo-web-white-label` |

---

## 9. Audit di tono, soggetto e terminologia

**Soggetto incoerente, anche dentro la stessa pagina.** Occorrenze rilevate:

| File | "noi" | "io" | Nota |
|---|---|---|---|
| `index.astro` | 7 | 21 | Prevale "io", ma la sezione "Come funziona" usa "Guardiamo / Ti indichiamo / interveniamo" |
| `fix-performance-seo.astro` | 9 | 3 | Prevale "noi" |
| `accessibilita-...astro` | 5 | 0 | Solo "noi" — "Cosa offriamo" |
| `web-design-etico-...astro` | 4 | 0 | Solo "noi" |
| `chi-siamo.astro` | 3 | 0 | "Collaboriamo con esperti" |
| `siti-web.astro` | 2 | 0 | Solo "noi" |
| `audit-rapido.astro` | 1 | 6 | Prevale "io" |
| `seo-locale.astro` | 4 | 3 | Misto nella stessa pagina — "Ottimizzo" (metadata) e "Ti rispondiamo entro 24h" (riga 104) |

La direzione approvata ("studio indipendente guidato da Luca Sanna") impone la **prima persona singolare**. Il "noi" non è solo stilistico: `chi-siamo.astro:9` dichiara "Collaboriamo con esperti", che descrive un'entità collettiva.

**Terminologia dell'entità.** Convivono "LS Web Agency" (brand), "agenzia" (nel dominio e nel nome), "studio" (direzione approvata) e "progetto di Luca Sanna" (`chi-siamo.astro:9`). Il JSON-LD usa `ProfessionalService` + `LocalBusiness` con `name: 'LS Web Agency di Luca Sanna'` e `founder: Luca Sanna` — la formulazione più corretta e coerente presente sul sito.

**Geografia: coerente.** "Sassari · da remoto in tutta Italia" (home), `areaServed` = Sassari/Sardegna/Italia (JSON-LD), FAQ "Lavori solo a Sassari?" → no. Nessuna contraddizione. Unica frizione: `seo-locale.astro:104` "Operi a Sassari o in Italia?" restringe implicitamente all'Italia un'offerta altrove dichiarata remota.

**Copy vs metadata vs JSON-LD.** L'`OfferCatalog` della home (`index.astro:107-142`) elenca 4 voci che **non corrispondono ad alcuna pagina o prodotto reale** ("Form chiari e gestione ordinata delle richieste clienti", "SEO tecnica e tracciamento conversioni integrati nel sito"): sono componenti descritti come Offer, e due non hanno nemmeno URL. È coerente con il copy strategico ma scollegato dal catalogo navigabile.

La FAQ home è **duplicata**: `faqSchema` (righe 148-209) e le FAQ visibili (righe ~1680-1700) ripetono lo stesso testo in due punti del file — allineate oggi, ma destinate a divergere alla prima modifica.

**Blog.** Non revisionato integralmente. `PostCTA.astro` non contiene offerte né prezzi hardcoded: nessuna CTA di blog risulta incoerente. Da verificare in una seconda passata solo se si cambiano i prezzi.

---

## 10. Pagine da mantenere, accorpare, rinominare o archiviare

**Mantenere** (5): `servizi/siti-web`, `servizi/sprint-ottimizzazione`, `servizi/sviluppo-web-white-label`, `mini-analisi`, `contatti`.

**Rinominare + riposizionare** (1): `servizi/audit-rapido` → prodotto di ingresso approvato, con componente accessibilità e output roadmap/raccomandazione.

**Riposizionare come modulo/competenza** (7): `ottimizzazione-seo-siti-web`, `landing-page-professionale`, `assistente-ai-sito-whatsapp`, `accessibilita-digitale-avanzata`, `branding-e-grafica-siti-web`, `assistenza-manutenzione`, `realizzazione-siti-ecommerce`.

**Accorpare** (8): `fix-performance-seo` → sprint · `local-seo-booster` → `seo-locale` · `lp/contatti-rapidi` → landing · `web-design-etico-sostenibile` → accessibilità · `personalizzazione-ux-intelligenza-artificiale` → assistente AI · `wordpress-slim-...` → sito strategico · `ai-blog-engine` → SEO · le 3 offerte fantasma della home → prodotti reali.

**Mantenere solo come pagina SEO, senza prezzo autonomo** (5): `creazione-siti-web-sassari`, `seo-locale`, `local/*`, `progetto-digitale-per-imprese`, `transizione-digitale-turismo`.

**Archiviare** (5): `transizione-digitale-turismo.(OLD)astro` (file orfano), `audit-ai` (nessuna offerta identificabile), `voucher-digitali-sardegna`, `servizi/voucher-digitali-sardegna-2025`, `servizi/voucher-digitali-sassari` (riferimenti 2025 scaduti).

⚠ Ogni archiviazione richiede redirect 301 e verifica dei link interni. Nessun redirect è stato creato o proposto operativamente in questo audit.

---

## 11. Priorità

**P0 — rischio legale, ingannevole o grave**
1. Audit a 149 € (home) vs 299 € (ovunque) — prezzo pubblicato incoerente.
2. "Eviti sanzioni e blocchi su fondi pubblici" — promessa di effetto legale.
3. Conformità WCAG/AgID/EAA promessa in copy, metadata e JSON-LD (4 punti).
4. "Approccio etico, misurabile e conforme" (web design etico, metadata).
5. Il prodotto di ingresso approvato non esiste; al suo posto 4 audit concorrenti.

**P1 — confusione sull'offerta principale**
6. Tre offerte con prezzo in home senza pagina di destinazione.
7. Audit / Fix / Sprint sovrapposti; la FAQ sprint nega la necessità dell'audit.
8. Cinque nomi per il gratuito; "analisi rapida" vs "audit rapido".
9. SEO locale e Local SEO Booster duplicati (mensile 39 vs 49 €).
10. Turismo come listino parallelo (99/590/79) in conflitto con il listino principale.
11. Menu con 3 voci su ~30 offerte; audit assente dalla navigazione.
12. Promesse "24/7" (×8), "più clienti", "funziona sempre senza problemi", "garantire successi concreti", segnali "entro 2–6 settimane".
13. White label dentro il catalogo cliente finale.

**P2 — incoerenza commerciale o terminologica**
14. Soggetto io/noi incoerente (8 pagine, anche interne alla stessa pagina).
15. Risposta 24h vs 24–48h.
16. Landing duplicata; accessibilità/web design etico duplicati.
17. JSON-LD `lowPrice: 0, highPrice: 0` su due pagine.
18. "Qualificato", "completo", "impeccabile" non definiti.
19. `OfferCatalog` home scollegato dal catalogo reale.
20. Sito strategico e sprint senza fascia di prezzo sulle proprie pagine.

**P3 — rifinitura editoriale**
21. FAQ home duplicata nel file (schema + visibile).
22. File orfano `.(OLD)astro`; `console.log` di debug in home.
23. Form home con fascia "Meno di 500 €" sotto il prezzo di ingresso.
24. "Operi a Sassari o in Italia?" restringe il perimetro remoto.
25. `chi-siamo` con "oltre 15 anni di esperienza" non verificabile dal sito.

---

## 12. Prima ondata di modifiche consigliate (max 10)

Ordinate per rapporto rischio/sforzo. Solo analisi: nessuna è stata applicata.

| # | Intervento | File | Priorità | Sforzo |
|---|---|---|---|---|
| 1 | Allineare il prezzo dell'audit a un valore unico su tutte le fonti (home, pagina, SiteAssistant, seo-locale, JSON-LD) | `index.astro:497,596` + 4 file | P0 | Basso |
| 2 | Rimuovere "Eviti sanzioni e blocchi su fondi pubblici" | `accessibilita-...astro:111` | P0 | Minimo |
| 3 | Riscrivere le 4 promesse di conformità (copy, metadata, JSON-LD) su "riduzione barriere / adeguamento verso i criteri" | `accessibilita-...astro:7,34,108` | P0 | Basso |
| 4 | Rimuovere "conforme" dalla description di web design etico | `web-design-etico-...astro:8` | P0 | Minimo |
| 5 | Definire il prodotto di ingresso unico: rinominare Audit Rapido, aggiungere componente accessibilità e output roadmap + raccomandazione | `servizi/audit-rapido.astro` | P0 | Alto |
| 6 | Eliminare le 3 offerte fantasma dalla home, rimandando ai prodotti reali | `index.astro:646,691,810` | P1 | Medio |
| 7 | Unificare il lessico del gratuito su un solo nome e una sola destinazione (`/mini-analisi`) | `navigation.ts`, `index.astro`, `servizi.astro`, `accessibilita-...astro` | P1 | Medio |
| 8 | Ridefinire il confine Fix/Sprint accorpando Fix nello sprint; correggere la FAQ che nega la necessità dell'audit | `fix-performance-seo.astro`, `sprint-...astro:247` | P1 | Medio |
| 9 | Attenuare "24/7" e "più clienti" sull'assistente AI (8 occorrenze + JSON-LD) | `assistente-ai-...astro` | P1 | Basso |
| 10 | Portare l'audit nel menu come primo passo dichiarato | `navigation.ts` | P1 | Minimo |

Gli interventi 1–4 e 9–10 sono modifiche di copy circoscritte e reversibili. Il 5 e il 6 richiedono una decisione di prodotto prima della scrittura. Il 7 tocca la navigazione: da concordare (vincolo).

---

## 13. Questioni realmente aperte (max 5)

1. **Prezzo dell'audit: 149 €, 299 € o un terzo valore?** L'allineamento è P0, ma il valore corretto è una decisione commerciale. 149 € abbassa la barriera; 299 € è il prezzo già dichiarato dal SiteAssistant e dalla pagina prodotto, e regge un audit che include accessibilità e roadmap.

2. **Il verticale dentale sopravvive?** "Audit Sito e Prenotazione" (99 €) e Pre-accoglienza digitale sono l'unico verticale con offerta a pagamento in home. PreventivoDentale è correttamente assente (vincolo 8), ma resta da decidere se il dentale sia una nicchia di comunicazione o un prodotto separato — che la direzione approvata non prevede.

3. **Il turismo diventa pagina SEO o resta percorso con listino?** Ha un funnel completo e prezzi propri (99/590/79) in conflitto con il listino principale. Declassarlo a pagina SEO significa rinunciare a un'offerta già confezionata.

4. **Sito strategico e sprint pubblicano una fascia di prezzo?** Oggi il prodotto centrale non ha prezzo sulla sua pagina, ma ne ha uno in home (790 €) e nel JSON-LD FAQ. O si pubblica ovunque, o si toglie da entrambi.

5. **Accessibilità: modulo o componente dell'audit?** La direzione la vuole nel prodotto di ingresso, ma esiste una pagina con pacchetti autonomi. Va decisa la doppia natura — componente dell'audit *e* modulo vendibile — o l'assorbimento completo.

---

*Documento analitico — nessuna modifica applicata al sito.*
