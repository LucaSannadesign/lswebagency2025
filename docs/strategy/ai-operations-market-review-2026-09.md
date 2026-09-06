# AI Operations per PMI — revisione di mercato 2026-09

## Decisione

Il servizio resta strategico, ma il posizionamento viene corretto: non vendere “agenti AI” o “automazioni AI” in senso generico. Vendere riduzione del lavoro manuale, affidabilità dei flussi e controllo operativo.

## Evidenze principali

- Il mercato italiano è in crescita, ma non tutte le PMI sono pronte. Istat 2025: uso AI 15,7% tra le PMI; CRM 21,1%. La mancanza di competenze è uno dei freni principali.
- I concorrenti italiani convergono già su audit → build → misura. “Non vendiamo AI” da solo non è quindi un differenziante sufficiente.
- Le community di operatori riportano quattro criticità ricorrenti: aziende con processi/dati non pronti, automazioni che si rompono silenziosamente, uso di agenti dove bastano regole deterministiche, dipendenza dal consulente dopo la consegna.
- In produzione contano più di una demo: monitoraggio, retry/fallback, audit trail, permessi minimi, approvazioni per azioni sensibili e possibilità di ricostruire cosa è successo.
- Dal 2 agosto 2026 si applicano gli obblighi di trasparenza dell’art. 50 AI Act per i casi pertinenti; l’AI literacy è inoltre un obbligo per provider/deployer. Il servizio tecnico deve quindi includere trasparenza e handover/formazione di base, senza presentarsi come consulenza legale.

## Nuovo ICP

Non “tutte le PMI”. Priorità a imprese e studi già sufficientemente digitalizzati che:

- ricevono un volume ripetuto di richieste, email, documenti o task;
- usano già almeno alcuni sistemi digitali (sito/form, email strutturate, CRM/gestionale/database);
- possono nominare un referente di processo;
- hanno un costo/tempo di processo misurabile;
- hanno un primo flusso circoscrivibile e non eccessivamente regolato.

Evitare come primo target micro-attività con poche richieste, processi totalmente informali o business dove l’automazione richiederebbe subito decisioni mediche, finanziarie, legali o altre azioni ad alto impatto.

## Architettura di offerta

### 1. Process Fit Check — 290 €

Analisi di un processo: baseline, dati, integrazioni, eccezioni, rischio, ROI plausibile e decisione GO / PREPARARE / NO-GO.

### 2. Pilot Operativo — da 1.490 €

Un solo workflow prioritario. Perimetro tipico: massimo due integrazioni principali, dataset di test, gestione errori, fallback, log, livelli di autonomia, documentazione e 30 giorni di osservazione post go-live.

### 3. Operations Care — da 249 €/mese

Monitoraggio, alert, verifiche periodiche, aggiornamento integrazioni/API, controllo consumi, piccole correzioni e report sintetico. Nuovi workflow restano fuori perimetro.

Costi di API, provider, licenze e servizi terzi sempre separati e visibili.

## Principi tecnici

1. AI per input ambigui/non strutturati; software deterministico per regole e azioni prevedibili.
2. Read-only e draft-first come default.
3. Azioni irreversibili/sensibili con approvazione esplicita o fuori perimetro.
4. Identità/credenziali con principio del minimo privilegio.
5. Log strutturati, retry, deduplica/idempotenza, fallback manuale e alert.
6. Baseline prima del progetto e KPI dopo il go-live.
7. Documentazione, inventario integrazioni, ownership credenziali e piano di uscita per ridurre lock-in.

## Livelli di autonomia

- Livello 0 — osserva/legge/sintetizza.
- Livello 1 — prepara bozze e suggerimenti.
- Livello 2 — propone azioni che richiedono approvazione.
- Livello 3 — esegue automaticamente solo azioni a basso rischio, reversibili e testate.

## KPI consigliati

- tempo medio di presa in carico;
- percentuale richieste correttamente registrate;
- percentuale esecuzioni riuscite;
- error/fallback rate;
- ore manuali eliminate;
- costo operativo del workflow;
- conversione solo quando attribuibile in modo ragionevole.

## Posizionamento

Nome tecnico interno: AI Operations.
Nome commerciale primario: Automazione dei processi con AI.

Messaggio: “Meno passaggi manuali. Più richieste gestite. Processi sotto controllo.”

La tecnologia va spiegata dopo il problema, non prima.
