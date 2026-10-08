# Attivazione controllata LS Web Agency

Il cron esegue sempre un dry-run. Le pubblicazioni sono possibili solo tramite workflow_dispatch, con LSWEB_SOCIAL_PUBLISH_ENABLED=true, LSWEB_SOCIAL_MAKE_VERIFIED=true e dry_run=false. La variabile di verifica è un'attestazione operativa, non una verifica automatica di Make.

Prima di impostare le variabili:
1. Verificare il webhook dedicato LSWA, le connessioni e gli ID Facebook/Instagram, la destinazione LinkedIn.
2. Filtrare ogni ramo per channel e site=lswebagency; mappare content/link/image.
3. Verificare immagini, link, formati e anteprima dei contenuti.
4. Implementare un registro persistente Make per eventId, con acquisizione atomica o elaborazione seriale senza race. Un evento già pubblicato restituisce la ricevuta originale; un evento pending/unknown non deve essere ripubblicato automaticamente.
5. Provare routing e mapping con moduli social esclusi. Il dry-run GitHub non contatta Make. I test end-to-end devono usare stato di test separato, senza registrare gli eventId di produzione come pubblicati.
6. Verificare lo storico Make e social per escludere invii preesistenti.

## Contratto della risposta Make

Dopo la conferma della piattaforma, rispondere HTTP 2xx con JSON:
```json
{"eventId":"LSWEB-20261007-FACEBOOK-VISITE-SENZA-RICHIESTE","channel":"facebook","status":"published","platformPostId":"ID-REALE"}
```
Per un evento già pubblicato: status=already_published con lo stesso ID reale.
Un semplice 200 Accepted non è una conferma. Lo script ha timeout 45 secondi; Make deve restituire la ricevuta entro questo limite oppure l'esito resta da riconciliare.

## Primo invio

Integrare la PR solo dopo revisione/QA, con variabili ancora disabilitate. Eseguire dry_run=true.
Dopo il controllo esterno, abilitare le due variabili ed eseguire manualmente:
- post_id=visite-senza-richieste
- channel=facebook
- dry_run=false
- allow_initial_state=true SOLO se lo stato manca e lo storico è stato riconciliato.

Controllare il post reale e la cache; poi procedere separatamente con instagram e linkedin.
Non cambiare ID/data di un post già inviato: cambierebbe eventId.

## Errori e cache

Lo script salva unresolvedEvents prima della chiamata. Se la risposta manca o è invalida, blocca gli invii successivi. Dopo aver confrontato Make e piattaforma, ricostruire lo stato con gli eventi confermati e rimuovere soltanto gli unresolvedEvents riconciliati.
La cache GitHub è un aiuto, non un registro durevole: se manca, il publish si ferma. Non usare allow_initial_state come bypass abituale.
Una perdita della cache o un arresto prima del suo salvataggio richiedono la deduplicazione persistente in Make.
Le ricevute non vengono validate contro le API social dallo script: dipendono dall'implementazione Make.

## Test

node --test tests/lswebSocialAgent.test.mjs
I test usano fetch simulato: nessuna richiesta reale al webhook.
