# Prospecting

Script da riga di comando per individuare attività locali il cui sito presenta
problemi tecnici evidenti, e raccoglierle in un elenco da valutare a mano.

Vive fuori dal sito: non è una rotta, non è un endpoint, non viene incluso nella
build e non è raggiungibile dall'esterno. Si esegue solo da terminale.

## Cosa fa

1. Cerca su Google Places le attività che corrispondono a settore e località.
2. Per ciascuna, legge `robots.txt` e — se consentito — visita la home e al
   massimo due pagine contatti.
3. Estrae dal markup pubblico nome dell'attività, email, telefoni e URL delle
   pagine contatti.
4. Applica sette controlli tecnici di base (title, meta description, viewport,
   canonical, dati strutturati, presenza di un contatto nel markup, HTTPS) e
   assegna un punteggio da 0 a 100: **più alto significa più problemi rilevati**.
5. Con `--csv` scrive un file con tutti gli esaminati.
6. Con `--save`, e solo dopo conferma, inserisce i prospect sopra la soglia di
   55 punti nella tabella `prospects`.

## Cosa NON fa

- **Non invia niente a nessuno.** Non manda email, non compila form, non apre
  conversazioni. Si ferma alla raccolta.
- Non genera testi, messaggi o bozze di contatto. Non chiama modelli di AI.
- Non scrive nella tabella `leads`, dove arrivano i contatti dai form del sito.
- Non crea la tabella su cui scrive: va creata a mano (vedi sotto).
- Non aggiorna né cancella righe esistenti: fa solo inserimenti.

## Prima del primo `--save`

La struttura del database non è versionata in questo repository. La tabella va
creata a mano, una volta sola, eseguendo `schema.sql` nell'SQL editor di
Supabase:

```
scripts/prospecting/schema.sql
```

Senza quella tabella `--save` fallisce all'inserimento.

## Uso

```bash
npm run prospecting -- --sector="ristoranti" --location="Sassari"
```

Senza altri flag lo script **non scrive nulla**: analizza e stampa a schermo.

```bash
# Esporta tutti gli esaminati per la revisione manuale
npm run prospecting -- --sector="dentisti" --location="Sassari" --csv prospect.csv

# Scrive su database, chiedendo conferma prima di procedere
npm run prospecting -- --sector="dentisti" --location="Sassari" --save
```

### Flag

| Flag | Effetto |
| --- | --- |
| `--sector=<testo>` | obbligatorio. Settore da cercare |
| `--location=<testo>` | obbligatorio. Località da cercare |
| `--limit=<n>` | quante attività esaminare. Default 20, massimo 20 |
| `--csv <percorso>` | esporta **tutti** gli esaminati, non solo i qualificati |
| `--save` | inserisce i qualificati in `prospects`, previa conferma |
| `--yes` | salta la conferma. Solo per usi non interattivi |

Le opzioni accettano sia `--chiave=valore` sia `--chiave valore`.

Prima di scrivere, `--save` stampa nome della tabella e numero esatto di righe e
chiede conferma `y/N`. In una sessione non interattiva senza `--yes` si ferma
invece di restare in attesa di un input che non arriverà.

### Variabili d'ambiente

| Variabile | Quando serve |
| --- | --- |
| `GOOGLE_PLACES_API_KEY` | sempre. Chiave Google Places API |
| `SUPABASE_URL` | solo con `--save` |
| `SUPABASE_SERVICE_ROLE` | solo con `--save`. Scavalca le Row Level Security |

Sono dichiarate in `.env.example` nella radice del progetto. Il file `.env` non
è tracciato da git e non deve esserlo.

## robots.txt e cortesia

`robots.txt` viene scaricato una volta per dominio e rispettato per lo user agent
dichiarato, `LSWebAgencyProspecting`. I due casi restano distinti nell'output e
nel CSV:

- **`saltato per robots.txt`** — il file esclude esplicitamente quel percorso;
- **`robots.txt non leggibile`** — timeout, errore di rete o risposta 5xx. In
  dubbio il sito non viene visitato.

Un `robots.txt` assente (404 o 410) vale come nessuna restrizione, secondo lo
standard.

Le richieste hanno timeout di 9 secondi, si fermano a 700 KB per pagina e sono
distanziate da una pausa di 350 ms. Lo user agent è dichiarato e contiene un URL
di riferimento.

## Revisione manuale

I prospect entrano in tabella con `status = 'da_verificare'`. Gli stati previsti
sono `da_verificare`, `qualificato`, `scartato`, `contattato`, e il passaggio da
uno all'altro è un'operazione manuale: lo script non li aggiorna mai. Il campo
`reviewed_at` va valorizzato quando la riga viene esaminata.

La deduplica in avvio confronta email, telefono, dominio e nome normalizzato con
i prospect già presenti, e vale anche all'interno della stessa esecuzione.

## Trattamento dati

Lo script raccoglie dati di contatto pubblicati sui siti web di attività
professionali: indirizzi email, numeri di telefono e denominazione dell'attività,
letti dalle pagine pubbliche di quei siti. Google Places viene usato solo per
individuare le attività e ottenerne l'indirizzo del sito.

- **Origine.** Tutti i dati provengono da pagine web accessibili pubblicamente.
  Non vengono usate fonti riservate, non viene aggirata alcuna autenticazione e
  non vengono raccolti dati da profili personali.
- **Finalità e base giuridica.** L'elenco serve a valutare un contatto
  commerciale B2B verso attività professionali. La base giuridica su cui si
  fonda è il legittimo interesse a proporre un servizio pertinente all'attività
  destinataria.
- **Informativa.** Al primo contatto va fornita l'informativa sul trattamento,
  indicando da dove provengono i dati, per quale finalità sono trattati e come
  opporsi.
- **Opposizione e cancellazione.** Chi lo richiede va rimosso dall'elenco senza
  ritardo, e la richiesta va registrata per non reinserirlo in un'esecuzione
  successiva.
- **Minimizzazione.** Vengono conservati solo i dati necessari alla valutazione e
  al contatto. Lo script non raccoglie dati di persone fisiche estranee
  all'attività professionale.
- **Accesso.** La tabella `prospects` è separata da `leads` proprio per non
  confondere chi ci ha contattato spontaneamente con chi non ci ha mai scritto.

Questa sezione descrive come lo strumento è pensato per essere usato; non
sostituisce una valutazione legale del trattamento.
