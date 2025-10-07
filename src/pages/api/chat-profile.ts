// src/pages/api/chat-profile.ts
import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase.server';

export const prerender = false;

function json(body: unknown, init: number | ResponseInit = 200) {
  const status = typeof init === 'number' ? init : (init as any)?.['status'] || 200;
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email } = await request.json();
    if (!name || !email || !/.+@.+\..+/.test(email)) {
      return json({ ok: false, error: 'VALIDATION_ERROR' }, 400);
    }

    const sb = supabaseAdmin();
    const { error } = await sb
      .from('chat_profiles')
      .upsert(
        {
          email: String(email).toLowerCase().trim(),
          name: String(name).trim(),
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'email' },
      );

    if (error) {
      console.error('[chat-profile] supabase error', error);
      return json({ ok: false, error: 'SUPABASE_ERROR' }, 500);
    }

    return json({ ok: true });
  } catch (err) {
    console.error('[chat-profile] unexpected', err);
    return json({ ok: false, error: 'SERVER_ERROR' }, 500);
  }
};
