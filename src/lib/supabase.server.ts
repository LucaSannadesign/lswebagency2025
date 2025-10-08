// src/lib/supabase.server.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = import.meta.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.warn('[supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE');
}

export const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!, {
  auth: { autoRefreshToken: false, persistSession: false },
});