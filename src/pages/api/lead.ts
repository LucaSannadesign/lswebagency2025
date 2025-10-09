// src/pages/api/lead.ts
// Salva i messaggi della chat su Supabase (tabella: public.leads)
// Richiede in env lato server: SUPABASE_URL, SUPABASE_ANON_KEY
import type { APIContext } from 'astro';

export const prerender = false;

type LeadBody = {
  channel?: string;
  name?: string;
  email?: string;
  message?: string;
  meta?: Record<string, any>;
};

const SUPABASE_URL = import.meta.env.SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY as string | undefined;

export async function POST({ request }: APIContext) {
  try {
    const body = (await request.json()) as LeadBody;
    const channel = body.channel ?? 'web';
    const name = (body.name ?? '').trim() || 'Chat user';
    const email = (body.email ?? '').trim() || null;
    const message = (body.message ?? '').trim();
    const meta = body.meta ?? {};

    if (!message) {
      return new Response(JSON.stringify({ error: 'Missing message' }), {
        status: 400,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    // Inserimento su Supabase (REST)
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'content-type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify([
          {
            channel,
            name,
            email,
            message,
            meta,
            created_at: new Date().toISOString(),
          },
        ]),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('[lead] supabase insert error:', res.status, text);
      }
    } else {
      console.warn('[lead] Missing SUPABASE_URL / SUPABASE_ANON_KEY env');
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[lead] fatal', err);
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
}