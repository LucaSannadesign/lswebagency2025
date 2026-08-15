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

## Due punteggi, non uno

Un dry-run reale su dieci ristoranti a Sassari ha qualificato **zero** prospect:
i cinque siti analizzati avevano punteggio tecnico 30–40, cioè zero o un
problema, mentre metà del campione non aveva affatto un sito proprio. Il
punteggio tecnico misura la salute di una pagina; non dice se l'attività ci
interessa. Sono due domande diverse e ora hanno due risposte separate.

| | cosa misura | soglia |
| --- | --- | --- |
| `technical_score` | quanti problemi ha il sito (30 = nessuno, 100 = molti) | `QUALIFIED_SCORE` 55, resta come diagnostica |
| `opportunity_score` | quanto l'attività è interessante per noi | `QUALIFIED_OPPORTUNITY_SCORE` 70, decide `--save` |

### presence_type

| valore | opportunità | significato |
| --- | --- | --- |
| `no_website` | 95 | nessun sito: tutto da costruire |
| `social_only` | 90 | solo Facebook o Instagram |
| `hosted_site` | 80 | microsito su piattaforma (`*.eatbu.com`): suo, ma non un dominio autonomo |
| `third_party_page` | 75 | pagina dentro una vetrina altrui, o accorciatore |
| `owned_site` | derivata | dominio proprio: vedi sotto |
| `non_pertinente` | 0 | fuori settore, mai salvabile |

Per `owned_site` l'opportunità non ricopia il punteggio tecnico: quello parte da
30 anche quando non c'è nulla da correggere, e un 30 non è "un terzo di
opportunità", è nessuna opportunità. La scala 30–100 viene riportata su 0–100:

```
opportunity = (technical − 30) / 70 × 100
```

Un sito senza problemi vale 0, uno con cinque problemi su sette vale 71 e supera
la soglia. In pratica un sito con dominio proprio qualifica solo da un punteggio
tecnico di **79** in su.

La soglia commerciale è 70 perché lascia passare tutte le presenze non autonome
(75–95) — attività a cui manca qualcosa di strutturale — ed esclude i siti che
funzionano. Un sito sano non diventa un prospect solo perché esiste.

`--save` si basa su questa soglia. Restano esclusi i `non_pertinente` e i record
la cui analisi non ha prodotto una classificazione utilizzabile. Il recapito
viene preteso solo da chi una pagina ce l'ha: per un'attività senza sito i
contatti si prendono dalla scheda Google in fase di revisione.

## Pertinenza e categorie di scarto

Per i settori con una corrispondenza certa in `classify.mjs` la ricerca viene
ristretta al Place Type di Google (`includedType` + `strictTypeFiltering`), e i
tipi restituiti vengono comunque ricontrollati. Per gli altri settori resta la
sola ricerca testuale: nessun tipo viene inventato.

Tre categorie escono dall'analisi prima ancora di visitare un sito. Non hanno
punteggio, compaiono nella colonna `esito` del CSV e **non vengono mai salvate
da `--save`**:

| Esito | Significato |
| --- | --- |
| `non_pertinente` | i tipi Google del record sono estranei al settore cercato |
| `social_only` | il "sito" è un profilo Facebook o Instagram: non si analizza come un sito aziendale |
| `no_website` | attività pertinente ma senza sito. Si conserva, non si perde |
| `hosted_profile` | il "sito" è una pagina dentro una piattaforma, o un accorciatore: il punteggio misurerebbe l'intermediario |

Queste categorie non sono un punteggio basso: sono attività che richiedono una
valutazione commerciale diversa, tenuta separata di proposito.

### Identità dell'attività

Il nome di Google e quello letto dal sito vengono conservati separati
(`place_name` e `site_name` nel CSV). Il nome canonico del prospect — la colonna
`nome`, e il campo `name` in tabella — è quello di Google quando disponibile;
quello del sito serve da controllo.

Un record diventa `hosted_profile` quando si verifica uno di tre segnali:

1. il dominio è una piattaforma nota o un accorciatore (elenco corto e
   volutamente non esaustivo, in `classify.mjs`);
2. l'URL ha la forma di un profilo dentro un contenitore — `/stand/nome`,
   `/listing/nome`, `/profile/nome`;
3. il nome letto sul sito non ha alcun elemento in comune con quello di Google
   né con il dominio.

Il confronto fra nomi ignora maiuscole, punteggiatura, accenti e termini
generici (`ristorante`, `srl`, articoli), quindi "Osteria Piega" e "Piega —
Cucina di mare" restano la stessa attività. Il nome cercato nel **dominio**, non
nell'intero indirizzo: uno slug come `wireplaza.com/stand/osteriapiega` è il
modo in cui la piattaforma nomina i suoi iscritti, non la prova che il sito sia
dell'osteria.

I micrositi con sottodominio proprio, come `nomeristorante.eatbu.com`, restano
analizzati normalmente: sono siti veri dell'attività.

Gli accorciatori non vengono risolti: seguire il redirect significherebbe
interrogare un servizio terzo, e il record esce con un esito proprio invece di
prendere il punteggio della pagina di rimbalzo.

## Cosa NON fa

- **Non invia niente a nessuno.** Non manda email, non compila form, non apre
  conversazioni. Si ferma alla raccolta.
- Non genera testi, messaggi o bozze di contatto. Non chiama modelli di AI.
- Non scrive nella tabella `leads`, dove arrivano i contatti dai form del sito.
- Non crea la tabella su cui scrive: va creata a mano (vedi sotto).
- Non aggiorna né cancella righe esistenti: fa solo inserimenti.

## Contatti: due fonti

I recapiti arrivano da due parti e restano distinti fino all'unione finale:

- **dal sito**, per chi ne ha uno leggibile: email e numeri dal markup pubblico;
- **dalla scheda Google** (`nationalPhoneNumber`), che è l'unico appiglio per
  chi un sito non ce l'ha.

I numeri equivalenti non vengono duplicati: `+39 079 111111` dal sito e
`079 111111` da Google sono la stessa utenza, e il confronto avviene sulle cifre
al netto del prefisso internazionale.

Un prospect commercialmente qualificato **non viene scartato** se resta senza
recapito: finché ha un Place ID è rintracciabile, entra in tabella come
`da_verificare` e l'esito segnala «contatto da trovare». Buttarlo significherebbe
perdere proprio le attività senza sito, che sono le più interessanti.

## Prima del primo `--save`

La struttura del database non è versionata in questo repository. Va eseguita a
mano nell'SQL editor di Supabase, una volta sola:

- **tabella nuova** → `scripts/prospecting/schema.sql`
- **tabella già esistente** → `scripts/prospecting/migrate-opportunity-model.sql`,
  che porta lo schema precedente a quello attuale ed è idempotente

Senza questo passaggio `--save` fallisce all'inserimento: lo script scrive su
`technical_score`, `opportunity_score`, `presence_type`, `place_id`,
`place_name`, `site_name` e `place_type`, colonne che la versione precedente
della tabella non ha.

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
| `SUPABASE_SECRET_KEY` | solo con `--save`. Chiave server-side: scavalca le Row Level Security |
| `SUPABASE_SERVICE_ROLE` | solo con `--save`, e solo come fallback del nome precedente |

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
