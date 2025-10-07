// src/lib/supabase.server.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL as string | undefined;
const SUPABASE_SERVICE_ROLE = import.meta.env.SUPABASE_SERVICE_ROLE as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY as string | undefined;

// Preferisci SEMPRE la SERVICE_ROLE lato server. Se assente, si tenta l'ANON (meno sicuro e soggetto a RLS).
const KEY = SUPABASE_SERVICE_ROLE || SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !KEY) {
  console.warn('[supabase] Variabili mancanti: SUPABASE_URL o SUPABASE_SERVICE_ROLE/ANON');
}

export function supabaseAdmin() {
  return createClient(SUPABASE_URL || '', KEY || '', {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, init) },
  });
}
