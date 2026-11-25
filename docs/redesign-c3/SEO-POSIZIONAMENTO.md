# Posizionamento nazionale e SEO — proposte (NON applicate)

Stato: **da approvare**. Nessun URL, title, description, heading strategico,
canonical o dato strutturato è stato modificato nel refinement C.3.3.

## Situazione attuale (homepage)

| Elemento | Valore attuale | Note |
|---|---|---|
| Title | «Siti web a Sassari per acquisire clienti \| LS Web Agency» | Solo locale |
| Description | «Realizzo siti web a Sassari per PMI e professionisti: …» | Solo locale |
| H1 | «Siti web a Sassari, progettati come esperienze.» | Keyword locale nel titolo principale |
| Testo hero | «… per imprese, professionisti e attività locali …» | Nessun riferimento nazionale |
| JSON-LD `areaServed` | Sassari, Sardegna, Italia | Già nazionale |
| Riga meta hero | «Sassari, IT · coordinate · ora» | Decorativa, `aria-hidden` |

## Obiettivo

Parlare a un pubblico **nazionale** senza perdere il presidio SEO su Sassari:
la keyword locale resta in title, H1 e dati strutturati; il messaggio nazionale
entra in description, testo della hero e nelle pagine servizio.

## Proposte, in ordine di rischio crescente

1. **Testo introduttivo della hero** (rischio basso)
   Da: «Progetto siti veloci, chiari e orientati ai contatti per imprese,
   professionisti e attività locali, …»
   A: «Progetto siti veloci, chiari e orientati ai contatti per professionisti,
   PMI e attività in tutta Italia, …»

2. **Meta description** (rischio basso, nessun effetto sul ranking diretto)
   «Siti web strategici per PMI e professionisti in tutta Italia, progettati e
   sviluppati da Sassari: UX/UI, sviluppo front-end, SEO e moduli integrati.»
   (≈ 150 caratteri)

3. **Title** (rischio medio: cambia lo snippet e può muovere il ranking locale)
   «Siti web strategici per PMI e professionisti · Sassari e tutta Italia | LS Web Agency»
   Verificare la lunghezza visibile in SERP (≈ 60 caratteri utili) e monitorare
   per 4–6 settimane le query «siti web Sassari» / «web agency Sassari» in Search Console.

4. **H1** (rischio medio-alto: da valutare solo dopo i punti 1–3)
   Mantenere «Siti web a Sassari» e aggiungere il nazionale nella terza riga:
   «Siti web a Sassari, / progettati come esperienze / per tutta Italia.»

## Cosa NON cambiare

- Slug e canonical della homepage e delle pagine servizio (nessun redirect necessario).
- `LocalBusiness` / `ProfessionalService` (indirizzo, telefono, `geo`).
- Pagine locali (`/local/*`, `/servizi/creazione-siti-web-sassari`): restano il presidio territoriale.

## Verifica dopo l'eventuale applicazione

- Rich Results Test sul JSON-LD.
- Search Console: impressioni e posizione media su query locali e nazionali, prima e dopo.
- Nessuna variazione di URL indicizzati.
