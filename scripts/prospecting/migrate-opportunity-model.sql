-- Migrazione: dal punteggio unico al modello presenza + opportunità.
--
-- Va eseguita A MANO nell'SQL editor di Supabase, una volta sola, PRIMA del
-- prossimo `npm run prospecting -- ... --save`. Lo script non applica DDL.
--
-- Perché serve. La tabella nasceva con una sola colonna `score`, che diceva
-- "punteggio" senza dire di cosa: era la salute tecnica del sito. Un dry-run su
-- dieci ristoranti reali ha mostrato il limite — cinque siti sani, punteggi
-- 30-40, zero prospect qualificati — mentre metà del campione non aveva affatto
-- un sito, che è la condizione commercialmente più interessante. Da qui la
-- separazione fra punteggio tecnico e opportunità, e la colonna che dice di che
-- tipo di presenza digitale stiamo parlando.
--
-- È idempotente: rieseguirla non rompe nulla e non duplica colonne.

begin;

-- 1. `score` diventa `technical_score`: stesso dato, nome che non mente.
--    Il blocco è condizionale perché la migrazione dev'essere ripetibile.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'prospects' and column_name = 'score'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'prospects' and column_name = 'technical_score'
  ) then
    alter table public.prospects rename column score to technical_score;
  end if;
end $$;

-- 2. Il punteggio tecnico deve poter mancare.
--    Un'attività senza sito non ha una pagina da misurare, e uno 0 in quella
--    colonna si leggerebbe come "sito perfetto": l'opposto di "sito assente".
alter table public.prospects
  alter column technical_score drop default,
  alter column technical_score drop not null;

-- 3. Le colonne del nuovo modello.
alter table public.prospects
  add column if not exists presence_type     text,
  add column if not exists opportunity_score integer,
  add column if not exists place_id          text,
  add column if not exists place_name        text,
  add column if not exists site_name         text,
  add column if not exists place_type        text;

-- 4. Vincoli sui valori ammessi. Aggiunti separatamente perché
--    `add constraint` non supporta `if not exists`.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'prospects_presence_type_check'
  ) then
    alter table public.prospects
      add constraint prospects_presence_type_check
      check (presence_type is null or presence_type in (
        'no_website', 'social_only', 'hosted_site',
        'third_party_page', 'owned_site', 'non_pertinente'
      ));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'prospects_opportunity_score_check'
  ) then
    alter table public.prospects
      add constraint prospects_opportunity_score_check
      check (opportunity_score is null or opportunity_score between 0 and 100);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'prospects_technical_score_check'
  ) then
    alter table public.prospects
      add constraint prospects_technical_score_check
      check (technical_score is null or technical_score between 0 and 100);
  end if;
end $$;

-- 5. Indici.
--    Quello sul Place ID è unico perché è la sola chiave stabile per
--    un'attività senza sito: senza, la stessa scheda rientrerebbe a ogni
--    esecuzione sullo stesso settore. È parziale, così le righe già in tabella
--    senza place_id non lo violano.
create unique index if not exists prospects_place_id_key
  on public.prospects (place_id) where place_id is not null;
create index if not exists prospects_presence_type_idx on public.prospects (presence_type);
create index if not exists prospects_opportunity_idx   on public.prospects (opportunity_score desc);

commit;

-- Righe già presenti prima della migrazione: restano con presence_type e
-- opportunity_score a null. Non vengono riclassificate d'ufficio — il tipo di
-- presenza non è ricostruibile a posteriori dal solo punteggio — e vanno
-- riviste a mano oppure lasciate come storico.
