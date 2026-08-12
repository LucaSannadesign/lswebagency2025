-- Tabella dei prospect generati dal modulo di prospecting.
--
-- Va eseguita a mano su Supabase PRIMA del primo `npm run prospecting -- ... --save`.
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
  name              text        not null,
  website           text,
  domain            text,                 -- host normalizzato, senza www: base della deduplica
  city              text,
  google_maps_url   text,                 -- non popolato dallo script: resta per la revisione manuale

  -- Contatti estratti dal sito pubblico dell'attività.
  emails            text[]      not null default '{}',
  phones            text[]      not null default '{}',
  contact_urls      text[]      not null default '{}',

  -- Esito dell'analisi tecnica.
  findings          text[]      not null default '{}',
  score             integer     not null default 0,

  -- Revisione manuale.
  status            text        not null default 'da_verificare'
                    check (status in ('da_verificare', 'qualificato', 'scartato', 'contattato')),
  reviewed_at       timestamptz,
  notes             text
);

-- La deduplica in avvio legge dominio, nome, email e telefoni di tutti i
-- prospect già presenti: l'indice sul dominio è quello che porta il peso.
create index if not exists prospects_domain_idx on public.prospects (domain);
create index if not exists prospects_status_idx on public.prospects (status);

-- Row Level Security: lo script scrive con la service role, che la scavalca.
-- Attivarla comunque impedisce letture con la chiave anonima, se un giorno
-- questa tabella venisse esposta per errore.
alter table public.prospects enable row level security;
