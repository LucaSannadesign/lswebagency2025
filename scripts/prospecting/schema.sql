-- Tabella dei prospect generati dal modulo di prospecting.
--
-- Va eseguita a mano su Supabase PRIMA del primo `npm run prospecting -- ... --save`.
-- Se la tabella esiste già nella versione precedente, non ricrearla: applicare
-- invece `migrate-opportunity-model.sql`, che porta lo schema esistente qui.
-- Lo schema del database non è versionato nel repository: questo file è la
-- definizione che lo script si aspetta, non una migrazione applicata in automatico.
--
-- I prospect vivono in una tabella separata da `leads`. In `leads` finiscono le
-- persone che hanno scritto spontaneamente dai form del sito; qui finiscono
-- attività trovate in autonomia e non ancora contattate. Tenerle insieme
-- significherebbe non poter più distinguere un contatto in entrata da un
-- nominativo raccolto da noi.

create table if not exists public.prospects (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  -- Provenienza del record.
  source            text        not null default 'prospecting',
  query             text,                 -- testo di ricerca usato per la discovery

  -- Identità dell'attività.
  name              text        not null,   -- nome canonico: quello di Google quando c'è
  website           text,
  domain            text,                 -- host normalizzato, senza www: base della deduplica
  city              text,
  google_maps_url   text,                 -- non popolato dallo script: resta per la revisione manuale

  -- Identità come la vedono le due fonti, tenute separate di proposito: è il
  -- loro confronto a smascherare una pagina ospitata da una piattaforma.
  place_id          text,                 -- identificatore stabile Google: chiave di deduplica primaria
  place_name        text,                 -- nome sulla scheda Google
  site_name         text,                 -- nome letto sul sito
  place_type        text,                 -- tipo primario Google (es. restaurant)

  -- Contatti: dal sito pubblico dell'attività e dalla scheda Google.
  emails            text[]      not null default '{}',
  phones            text[]      not null default '{}',
  contact_urls      text[]      not null default '{}',

  -- Esito dell'analisi tecnica. `technical_score` è null quando non c'è una
  -- pagina da misurare: uno 0 si leggerebbe come "sito perfetto".
  findings          text[]      not null default '{}',
  technical_score   integer     check (technical_score is null or technical_score between 0 and 100),

  -- Valutazione commerciale, indipendente dalla salute del sito.
  presence_type     text        check (presence_type is null or presence_type in (
                      'no_website', 'social_only', 'hosted_site',
                      'third_party_page', 'owned_site', 'non_pertinente')),
  opportunity_score integer     check (opportunity_score is null or opportunity_score between 0 and 100),

  -- Revisione manuale.
  status            text        not null default 'da_verificare'
                    check (status in ('da_verificare', 'qualificato', 'scartato', 'contattato')),
  reviewed_at       timestamptz,
  notes             text
);

-- La deduplica in avvio confronta Place ID, email, telefono, dominio e nome dei
-- prospect già presenti, in quest'ordine. L'indice unico sul Place ID è quello
-- che conta di più: per un'attività senza sito è l'unica chiave stabile, e
-- senza di lui la stessa scheda rientrerebbe a ogni esecuzione.
create unique index if not exists prospects_place_id_key
  on public.prospects (place_id) where place_id is not null;
create index if not exists prospects_domain_idx      on public.prospects (domain);
create index if not exists prospects_status_idx      on public.prospects (status);
create index if not exists prospects_presence_type_idx on public.prospects (presence_type);
create index if not exists prospects_opportunity_idx   on public.prospects (opportunity_score desc);

-- Row Level Security: lo script scrive con la service role, che la scavalca.
-- Attivarla comunque impedisce letture con la chiave anonima, se un giorno
-- questa tabella venisse esposta per errore.
alter table public.prospects enable row level security;
