# CLAUDE.md — LS Web Agency

## Contesto progetto

Questo repository contiene il sito LS Web Agency, sviluppato con Astro e Tailwind.

LS Web Agency è un brand professionale dedicato a web design, sviluppo front-end, UX/UI, SEO, AI e soluzioni digitali per professionisti, piccole attività e aziende locali.

L’obiettivo del sito è comunicare professionalità, metodo, competenza tecnica e capacità di generare contatti qualificati.

## Lingua e tono

- Rispondi sempre in italiano.
- Usa un tono professionale, chiaro e operativo.
- Evita introduzioni lunghe e frasi generiche.
- Spiega sempre sia il perché sia il come.
- Quando proponi una modifica, indica impatto, rischio e metodo di verifica.

## Regole operative

- Procedi per micro-task.
- Prima analizza il problema, poi proponi un piano.
- Non fare refactor globale se non richiesto.
- Non creare nuovi file salvo necessità esplicita.
- Non installare nuove dipendenze senza conferma.
- Non cancellare file senza conferma.
- Non fare commit.
- Non fare push.
- Non fare deploy.
- Non modificare più file del necessario.
- Mantieni le modifiche minime, reversibili e testabili.
- Se una modifica è rischiosa, chiedi conferma prima di applicarla.

## Regole per Astro e Tailwind

- Mantieni lo stile già presente nel file.
- Usa classi Tailwind coerenti con quelle esistenti.
- Non introdurre pattern nuovi se il progetto ha già una soluzione equivalente.
- Non cambiare struttura dei componenti se basta una modifica di classi o contenuto.
- Non modificare layout globali se il problema è locale a una sezione.
- Prima di intervenire su componenti condivisi, verifica dove vengono usati.

## Regole UI/UX

- Preserva logo, palette, tipografia, gerarchie visive e stile esistente.
- Non stravolgere la grafica se non richiesto.
- Su mobile privilegia leggibilità, ritmo verticale, margini sicuri e CTA chiare.
- Evita testi, pulsanti o elementi importanti troppo vicini ai bordi.
- Evita hero troppo alte su mobile se penalizzano CTA e contenuto successivo.
- Controlla sempre che non ci sia scroll orizzontale.
- Per modifiche responsive, verifica almeno 390px, 430px, 768px, 1024px e 1440px.
- Se una modifica è solo mobile, usa breakpoint chiari e non alterare desktop.

## Regole SEO

- Non cambiare slug senza avvisare.
- Non cambiare canonical senza avvisare.
- Non modificare redirect, sitemap o robots senza conferma.
- Se uno slug cambia, proponi sempre anche il redirect.
- Mantieni coerenza tra title, description, canonical, contenuto e dati strutturati.
- Evita contenuti duplicati e keyword stuffing.

## Regole per contenuti e copy

- Scrivi testi professionali, concreti e orientati alla conversione.
- Evita promesse eccessive e slogan vuoti.
- Privilegia messaggi chiari, verificabili e utili per professionisti e piccole attività.
- Le CTA devono essere dirette, comprensibili e coerenti con il servizio.
- Quando migliori un testo, conserva il senso originale se non viene richiesto un cambio di posizionamento.

## Sicurezza

- Non eseguire comandi distruttivi.
- Non cancellare cartelle.
- Non sovrascrivere file senza prima aver verificato il contenuto.
- Non usare comandi di reset Git senza conferma esplicita.
- Non usare git commit, git push o comandi di deploy.

## Comandi di verifica preferiti

Quando utile, proporre uno o più di questi comandi:

- git status
- git diff
- npm run dev
- npm run build
- npx astro check

## Output richiesto dopo ogni intervento

Dopo ogni modifica, restituisci sempre:

1. file modificati;
2. cosa è stato cambiato;
3. perché è stato cambiato;
4. diff essenziale;
5. comando di test;
6. cosa verificare nel browser;
7. eventuali rischi prima del commit.

## Metodo di lavoro preferito

Quando ricevi una richiesta di modifica:

1. individua il file o i file coinvolti;
2. leggi il contesto necessario;
3. spiega il problema in modo sintetico;
4. proponi una modifica minima;
5. applica solo ciò che serve;
6. verifica che non ci siano errori;
7. restituisci un riepilogo operativo.

Per modifiche grafiche o responsive, non considerare sufficiente il solo controllo del codice: serve anche verifica visiva.

<!-- EDITORIAL_AGENT_RULES_START -->

# Agente editoriale LS Web Agency

## Ambito e fonti

Applicare queste regole solo a calendario editoriale, blog, SEO e contenuti social.

Prima di intervenire leggere:
- `editorial/calendar.yml`
- `editorial/content-index.json`
- `editorial/duplicate-report.json`
- i contenuti esistenti potenzialmente concorrenti

Eseguire sempre `npm run editorial:check` e fermarsi se fallisce.

## Modalità

- `NEW_ARTICLE`: creare una nuova bozza solo dopo controllo anticanibalizzazione.
- `UPDATE_EXISTING`: aggiornare il contenuto indicato senza creare nuove pagine.
- `SOCIAL_ONLY`: non creare articoli o URL indicizzabili.
- `CONSOLIDATE`: produrre solo una raccomandazione; non eliminare o reindirizzare senza approvazione.

## Anticanibalizzazione

Confrontare keyword, intento di ricerca, problema, pubblico, fase del funnel, struttura e pagine servizio collegate.

Restituire una sola decisione:
- `NEW_ARTICLE`
- `UPDATE_EXISTING`
- `CONSOLIDATE`
- `MANUAL_REVIEW`

In caso di conflitto plausibile non creare il contenuto.

## Bozze

Creare una bozza solo su richiesta esplicita di Luca, solo per `NEW_ARTICLE`, dentro `src/content/data/post/`.

Ogni bozza deve iniziare con:

```yaml
draft: true
robots: "noindex, nofollow"
```

Predisporre title, description, slug, canonical, focusKeyword, categoria, tag, immagine, imageAlt, Open Graph e Twitter Card coerenti.

## Immagine

Preparare l'immagine insieme alla bozza:
- `1200 × 630 px`
- WebP
- `public/images/blog/<slug>.webp`

Claude può preparare brief, prompt, nome file e alt text. Se manca un provider immagini, non deve fingere di aver generato il file.

## Divieti

Non eseguire autonomamente commit, push, merge, deploy, pubblicazione, redirect, cancellazioni, consolidamenti, passaggio da `draft: true` a `draft: false` o indicizzazione.

## Output

Dopo ogni attività editoriale riportare:
- modalità;
- decisione anticanibalizzazione;
- file letti e modificati;
- controlli eseguiti;
- stato immagine;
- decisioni ancora da approvare.

<!-- EDITORIAL_AGENT_RULES_END -->
