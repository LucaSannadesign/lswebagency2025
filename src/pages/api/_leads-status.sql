-- Ampliamento del vincolo leads_status_check con lo stato 'scartato_honeypot'.
--
-- DA ESEGUIRE A MANO SU SUPABASE **PRIMA** DEL DEPLOY DI QUESTO BRANCH.
--
-- Il ramo honeypot di /api/contatti registra ora l'invio scartato in
-- public.leads con status = 'scartato_honeypot'. Finché il vincolo non ammette
-- quel valore, l'insert viene rifiutato dal database: la richiesta continuerà a
-- ricevere 200 e nessuno se ne accorgerà, tranne un console.error nei log della
-- funzione. Eseguire prima significa non perdere gli scarti del periodo
-- intermedio.
--
-- Il file inizia con "_" e ha estensione .sql: Astro non lo raccoglie come
-- rotta. Non viene eseguito da alcun codice.

alter table public.leads drop constraint leads_status_check;

alter table public.leads add constraint leads_status_check
  check (status = any (array[
    'nuovo', 'da_verificare', 'contattato', 'interessato', 'call',
    'preventivo', 'follow_up', 'vinto', 'perso', 'da_ricontattare',
    'opt_out', 'scartato_honeypot'
  ]));
